import type { Metadata } from "next";
import { createSupabaseServer } from "@/lib/supabase";
import PayClient from "./PayClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = createSupabaseServer();
  const { data: quote } = await supabase
    .from("quotes")
    .select("client_name, description, quote_type, billing_cycle, recurring_price_cents, total_amount_cents, deposit_amount_cents, status")
    .eq("code", code)
    .maybeSingle();

  if (!quote) {
    return (
      <section className="flex min-h-[100dvh] items-center justify-center px-6" style={{ background: "#050508" }}>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Quote not found</h1>
          <p className="mt-2 text-sm text-white/50">This payment link is invalid or has expired. Please contact us for a new link.</p>
        </div>
      </section>
    );
  }

  return <PayClient quote={quote} code={code} />;
}
