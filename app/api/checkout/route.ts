import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;
    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.trim().slice(0, 64) : "";

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const supabase = createSupabaseServer();
    const { data: quote, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error || !quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    if (quote.status === "paid") {
      return NextResponse.json({ error: "This quote has already been paid" }, { status: 409 });
    }

    if (quote.quote_type === "subscription") {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: quote.recurring_price_cents,
              recurring: { interval: quote.billing_cycle === "annual" ? "year" : "month" },
              product_data: {
                name: quote.description,
                description: `${quote.billing_cycle === "annual" ? "Annual" : "Monthly"} hosting subscription for ${quote.client_name}.`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pay/${code}`,
        metadata: { quoteCode: code },
      });

      if (!session.url) {
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
      }
      return NextResponse.json({ url: session.url });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: quote.deposit_amount_cents,
            product_data: {
              name: `${quote.description} — 50% Deposit`,
              description: `Deposit for ${quote.client_name}. Remaining 50% due on delivery.`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pay/${code}`,
      metadata: { quoteCode: code },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
