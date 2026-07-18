import type { Metadata } from "next";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function money(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PaySuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;

  let amount: string | null = null;
  let email: string | null = null;

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        amount = money(session.amount_total ?? 0);
        email = session.customer_details?.email ?? null;
      }
    } catch (err) {
      console.error("[pay/success] failed to retrieve session:", err);
    }
  }

  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-6 py-24" style={{ background: "#050508" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.10) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl">Deposit received</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {amount
            ? `Thank you — we've received your deposit of ${amount}${email ? ` (confirmation sent to ${email})` : ""}. We'll be in touch shortly to kick off your project.`
            : "Thank you for your payment. We'll be in touch shortly to kick off your project."}
        </p>
        <a href="/" className="mt-8 inline-block rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.08]">
          Back to homepage
        </a>
      </div>
    </section>
  );
}
