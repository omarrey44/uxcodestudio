import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { createSupabaseServer } from "@/lib/supabase";
import { esc, money, emailShell, row } from "@/lib/email";

function adminNotificationHtml(opts: {
  clientName: string;
  description: string;
  quoteCode: string;
  depositCents: number;
  totalCents: number;
  customerEmail: string;
  paidAt: string;
}) {
  const { clientName, description, quoteCode, depositCents, totalCents, customerEmail, paidAt } = opts;
  const remainingCents = totalCents - depositCents;

  return emailShell({
    badge: "Deposit received",
    heading: `${esc(money(depositCents))} paid by ${esc(clientName)}`,
    rows: [
      row("Client", esc(clientName)),
      row("Project", esc(description)),
      row("Quote code", esc(quoteCode)),
      row("Deposit paid (50%)", esc(money(depositCents)), true),
      row("Total project price", esc(money(totalCents))),
      row("Remaining on delivery", esc(money(remainingCents))),
      row("Customer email", `<a href="mailto:${esc(customerEmail)}" style="color:#22d3ee;text-decoration:none;">${esc(customerEmail)}</a>`),
      row("Date", esc(paidAt)),
    ].join(""),
    footerNote: "Sent automatically from uxcodestudio.com &middot; Stripe checkout.session.completed",
  });
}

function clientReceiptHtml(opts: {
  clientName: string;
  description: string;
  depositCents: number;
  totalCents: number;
  paidAt: string;
}) {
  const { clientName, description, depositCents, totalCents, paidAt } = opts;
  const remainingCents = totalCents - depositCents;

  return emailShell({
    badge: "Payment confirmed",
    heading: `Thank you, ${esc(clientName.split(" ")[0] || clientName)}!`,
    rows: [
      row("Project", esc(description)),
      row("Deposit paid (50%)", esc(money(depositCents)), true),
      row("Total project price", esc(money(totalCents))),
      row("Remaining on delivery", esc(money(remainingCents))),
      row("Date", esc(paidAt)),
    ].join(""),
    footerNote: "We've received your deposit and will be in touch shortly to kick off your project. Questions? Reply to this email or write to info@uxcodestudio.com.",
  });
}

function adminSubscriptionHtml(opts: {
  clientName: string;
  description: string;
  quoteCode: string;
  priceCents: number;
  billingCycle: string;
  customerEmail: string;
  paidAt: string;
}) {
  const { clientName, description, quoteCode, priceCents, billingCycle, customerEmail, paidAt } = opts;
  const cadence = billingCycle === "annual" ? "year" : "month";

  return emailShell({
    badge: "Subscription active",
    heading: `${esc(money(priceCents))}/${cadence} — ${esc(clientName)}`,
    rows: [
      row("Client", esc(clientName)),
      row("Plan", esc(description)),
      row("Quote code", esc(quoteCode)),
      row("Price", `${esc(money(priceCents))} / ${cadence}`, true),
      row("Billing cycle", cadence === "year" ? "Annual" : "Monthly"),
      row("Customer email", `<a href="mailto:${esc(customerEmail)}" style="color:#22d3ee;text-decoration:none;">${esc(customerEmail)}</a>`),
      row("Started", esc(paidAt)),
    ].join(""),
    footerNote: "Sent automatically from uxcodestudio.com &middot; Stripe checkout.session.completed",
  });
}

function clientSubscriptionHtml(opts: {
  clientName: string;
  description: string;
  priceCents: number;
  billingCycle: string;
  paidAt: string;
}) {
  const { clientName, description, priceCents, billingCycle, paidAt } = opts;
  const cadence = billingCycle === "annual" ? "year" : "month";

  return emailShell({
    badge: "Subscription active",
    heading: `Thank you, ${esc(clientName.split(" ")[0] || clientName)}!`,
    rows: [
      row("Plan", esc(description)),
      row("Price", `${esc(money(priceCents))} / ${cadence}`, true),
      row("Billing cycle", cadence === "year" ? "Annual — renews yearly" : "Monthly — renews every month"),
      row("Started", esc(paidAt)),
    ].join(""),
    footerNote: "Your subscription is active. You can cancel anytime by contacting us. Questions? Reply to this email or write to info@uxcodestudio.com.",
  });
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const quoteCode = session.metadata?.quoteCode;
    const customerEmail = session.customer_details?.email ?? "unknown";
    const paidAt = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!quoteCode) {
      return NextResponse.json({ received: true });
    }

    const supabase = createSupabaseServer();
    const { data: quote } = await supabase
      .from("quotes")
      .select("*")
      .eq("code", quoteCode)
      .maybeSingle();

    if (!quote) {
      console.error("[stripe webhook] quote not found for code:", quoteCode);
      return NextResponse.json({ received: true });
    }

    if (quote.quote_type === "subscription") {
      const { error } = await supabase
        .from("quotes")
        .update({
          status: "paid",
          stripe_session_id: session.id,
          stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          customer_email: customerEmail !== "unknown" ? customerEmail : null,
          paid_at: new Date().toISOString(),
        })
        .eq("code", quoteCode);
      if (error) console.error("[stripe webhook] failed to update subscription quote:", error);

      const priceCents = quote.recurring_price_cents ?? 0;
      const billingCycle = quote.billing_cycle ?? "monthly";

      await resend.emails
        .send({
          from: "UX Code Studio <onboarding@resend.dev>",
          to: "uxcodestudio@outlook.com",
          subject: `Subscription active — ${quote.client_name} (${money(priceCents)}/${billingCycle === "annual" ? "yr" : "mo"})`,
          html: adminSubscriptionHtml({
            clientName: quote.client_name,
            description: quote.description,
            quoteCode,
            priceCents,
            billingCycle,
            customerEmail,
            paidAt,
          }),
        })
        .catch((err) => console.error("[stripe webhook] resend error (admin subscription):", err));

      if (customerEmail !== "unknown") {
        await resend.emails
          .send({
            from: "UX Code Studio <onboarding@resend.dev>",
            to: customerEmail,
            subject: "Subscription confirmed — UXCODESTUDIO",
            html: clientSubscriptionHtml({
              clientName: quote.client_name,
              description: quote.description,
              priceCents,
              billingCycle,
              paidAt,
            }),
          })
          .catch((err) => console.error("[stripe webhook] resend error (client subscription):", err));
      }
    } else {
      const { error } = await supabase
        .from("quotes")
        .update({
          status: "paid",
          stripe_session_id: session.id,
          customer_email: customerEmail !== "unknown" ? customerEmail : null,
          paid_at: new Date().toISOString(),
        })
        .eq("code", quoteCode);
      if (error) console.error("[stripe webhook] failed to update quote:", error);

      const depositCents = quote.deposit_amount_cents;
      const totalCents = quote.total_amount_cents;

      await resend.emails
        .send({
          from: "UX Code Studio <onboarding@resend.dev>",
          to: "uxcodestudio@outlook.com",
          subject: `Deposit received — ${quote.client_name} (${money(depositCents)})`,
          html: adminNotificationHtml({
            clientName: quote.client_name,
            description: quote.description,
            quoteCode,
            depositCents,
            totalCents,
            customerEmail,
            paidAt,
          }),
        })
        .catch((err) => console.error("[stripe webhook] resend error (admin notification):", err));

      if (customerEmail !== "unknown") {
        await resend.emails
          .send({
            from: "UX Code Studio <onboarding@resend.dev>",
            to: customerEmail,
            subject: "Payment confirmed — UXCODESTUDIO",
            html: clientReceiptHtml({
              clientName: quote.client_name,
              description: quote.description,
              depositCents,
              totalCents,
              paidAt,
            }),
          })
          .catch((err) => console.error("[stripe webhook] resend error (client receipt):", err));
      }
    }
  }

  return NextResponse.json({ received: true });
}
