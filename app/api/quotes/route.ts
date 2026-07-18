import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createSupabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const clientName  = typeof body.clientName  === "string" ? body.clientName.slice(0, 200)  : "";
  const description = typeof body.description === "string" ? body.description.slice(0, 500) : "";
  const quoteType    = body.quoteType === "subscription" ? "subscription" : "deposit";

  if (!clientName || !description) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const code = randomUUID().replace(/-/g, "").slice(0, 16);
  const supabase = createSupabaseServer();

  if (quoteType === "subscription") {
    const billingCycle = body.billingCycle === "annual" ? "annual" : "monthly";
    const pricePerCycle = Number(body.pricePerCycle);

    if (!Number.isFinite(pricePerCycle) || pricePerCycle <= 0) {
      return NextResponse.json({ error: "Missing or invalid price" }, { status: 400 });
    }

    const { error } = await supabase.from("quotes").insert([{
      code,
      client_name: clientName,
      description,
      quote_type: "subscription",
      billing_cycle: billingCycle,
      recurring_price_cents: Math.round(pricePerCycle * 100),
      total_amount_cents: 0,
      deposit_amount_cents: 0,
    }]);

    if (error) {
      console.error("[quotes] insert error:", error);
      return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
    }
  } else {
    const totalAmount = Number(body.totalAmount);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const totalAmountCents   = Math.round(totalAmount * 100);
    const depositAmountCents = Math.round(totalAmountCents / 2);

    const { error } = await supabase.from("quotes").insert([{
      code,
      client_name: clientName,
      description,
      quote_type: "deposit",
      total_amount_cents: totalAmountCents,
      deposit_amount_cents: depositAmountCents,
    }]);

    if (error) {
      console.error("[quotes] insert error:", error);
      return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
    }
  }

  return NextResponse.json({ code, payUrl: `${req.nextUrl.origin}/pay/${code}` });
}
