import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { createSupabaseServer } from "@/lib/supabase";
import { esc, money, emailShell, row } from "@/lib/email";

function reminderHtml(opts: {
  clientName: string;
  description: string;
  priceCents: number;
  billingCycle: string;
  renewsOn: string;
  daysLeft: number;
}) {
  const { clientName, description, priceCents, billingCycle, renewsOn, daysLeft } = opts;
  const cadence = billingCycle === "annual" ? "year" : "month";

  return emailShell({
    badge: "Renewing soon",
    heading: `Your subscription renews in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
    rows: [
      row("Plan", esc(description)),
      row("Price", `${esc(money(priceCents))} / ${cadence}`, true),
      row("Renews on", esc(renewsOn)),
    ].join(""),
    footerNote: `Hi ${esc(clientName.split(" ")[0] || clientName)}, this is a reminder that your subscription will renew automatically — no action is needed. To make changes or cancel, contact us at info@uxcodestudio.com.`,
  });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServer();
  const { data: subs, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("quote_type", "subscription")
    .eq("status", "paid")
    .not("stripe_subscription_id", "is", null);

  if (error) {
    console.error("[cron] failed to fetch subscriptions:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let remindersSent = 0;

  for (const quote of subs ?? []) {
    if (!quote.customer_email || !quote.stripe_subscription_id) continue;

    let subscription;
    try {
      subscription = await stripe.subscriptions.retrieve(quote.stripe_subscription_id);
    } catch (err) {
      console.error(`[cron] failed to retrieve subscription ${quote.stripe_subscription_id}:`, err);
      continue;
    }

    if (subscription.status !== "active") continue;

    const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
    if (!currentPeriodEnd) continue;

    const periodEndMs = currentPeriodEnd * 1000;
    const periodEndIso = new Date(periodEndMs).toISOString();
    const daysUntilRenewal = Math.ceil((periodEndMs - Date.now()) / 86_400_000);
    const threshold = quote.billing_cycle === "annual" ? 30 : 10;

    const alreadySentForThisCycle = quote.reminder_sent_for_period_end === periodEndIso;
    if (alreadySentForThisCycle || daysUntilRenewal > threshold || daysUntilRenewal < 0) continue;

    await resend.emails
      .send({
        from: "UX Code Studio <onboarding@resend.dev>",
        to: quote.customer_email,
        subject: `Your ${quote.description} subscription renews in ${daysUntilRenewal} day${daysUntilRenewal === 1 ? "" : "s"}`,
        html: reminderHtml({
          clientName: quote.client_name,
          description: quote.description,
          priceCents: quote.recurring_price_cents ?? 0,
          billingCycle: quote.billing_cycle ?? "monthly",
          renewsOn: new Date(periodEndMs).toLocaleDateString("en-US", { dateStyle: "medium" }),
          daysLeft: daysUntilRenewal,
        }),
      })
      .catch((err) => console.error(`[cron] resend error for quote ${quote.code}:`, err));

    await supabase.from("quotes").update({ reminder_sent_for_period_end: periodEndIso }).eq("code", quote.code);
    remindersSent++;
  }

  return NextResponse.json({ checked: subs?.length ?? 0, remindersSent });
}
