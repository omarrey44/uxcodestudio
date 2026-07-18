"use client";

import { useState } from "react";
import Image from "next/image";

type Quote = {
  client_name: string;
  description: string;
  quote_type: string;
  billing_cycle: string | null;
  recurring_price_cents: number | null;
  total_amount_cents: number;
  deposit_amount_cents: number;
  status: string;
};

function money(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-7 w-7 flex-none place-items-center rounded-lg" style={{ background: "rgba(0,212,255,0.10)", border: "1px solid rgba(0,212,255,0.22)" }}>
      {children}
    </span>
  );
}

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "#22d3ee", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-4 w-4" };

function ShieldIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? "h-4 w-4"}>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PersonIcon() { return (<svg {...iconProps}><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-4 4-5.6 7-5.6s5.8 1.6 7 5.6" /></svg>); }
function TagIcon() { return (<svg {...iconProps}><path d="M12.6 3.6l7.8 7.8a1.8 1.8 0 0 1 0 2.6l-6.4 6.4a1.8 1.8 0 0 1-2.6 0L3.6 12.6a1.8 1.8 0 0 1-.5-1.3V4.8A1.2 1.2 0 0 1 4.3 3.6h6.9c.5 0 1 .2 1.4.5z" /><circle cx="8" cy="8" r="1.3" fill="#22d3ee" stroke="none" /></svg>); }
function CalendarIcon() { return (<svg {...iconProps}><rect x="3.5" y="5" width="17" height="15.5" rx="2.4" /><path d="M3.5 9.5h17M8 3v3.6M16 3v3.6" /></svg>); }
function TruckIcon() { return (<svg {...iconProps}><path d="M3 7h11v9H3z" /><path d="M14 11h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>); }
function RefreshIcon() { return (<svg {...iconProps}><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" /><path d="M21 4v4h-4" /><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" /><path d="M3 20v-4h4" /></svg>); }
function LockIcon() { return (<svg viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></svg>); }
function StripeLogo() {
  return (
    <span className="grid h-6 w-6 flex-none place-items-center rounded-md" style={{ background: "#635bff" }}>
      <svg viewBox="0 0 24 24" fill="#ffffff" className="h-3.5 w-3.5">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
      </svg>
    </span>
  );
}

function Row({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <div className="flex items-center gap-2.5 text-[12.5px] text-white/55">
        <IconBadge>{icon}</IconBadge>
        {label}
      </div>
      <span className="text-sm font-bold" style={{ color: accent ? "#22d3ee" : "#ffffff" }}>{value}</span>
    </div>
  );
}

export default function PayClient({ quote, code }: { quote: Quote; code: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const isSubscription = quote.quote_type === "subscription";
  const balance = quote.total_amount_cents - quote.deposit_amount_cents;
  const cadence = quote.billing_cycle === "annual" ? "year" : "month";
  const cadenceShort = quote.billing_cycle === "annual" ? "/yr" : "/mo";
  const recurringPrice = quote.recurring_price_cents ?? 0;
  const dueAmount = isSubscription ? recurringPrice : quote.deposit_amount_cents;

  return (
    <section className="relative min-h-[100dvh] overflow-hidden" style={{ background: "#050508" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[460px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,212,255,0.10) 0%, transparent 70%)", filter: "blur(64px)" }} />
      </div>

      <div className="container-x relative z-10">
        {/* Top bar — logo + back link */}
        <div className="flex items-center justify-between py-4">
          <Image src="/logo.png" width={110} height={34} alt="UXCODESTUDIO" />
          <a href="/" className="flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white">
            <span aria-hidden>←</span> Back to overview
          </a>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-md pb-6">
          <div
            className="overflow-hidden rounded-[24px] border p-5 md:p-6"
            style={{
              borderColor: "rgba(34,211,238,0.30)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
              boxShadow: "0 0 0 1px rgba(34,211,238,0.06), 0 0 60px -12px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 48px -24px rgba(0,0,0,0.7)",
            }}
          >
            {/* Secure checkout badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-cyan">
              <ShieldIcon className="h-4 w-4" />
              Secure Checkout
            </div>

            {/* Quote for pill */}
            <div className="mt-3 flex justify-center">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                {isSubscription ? "Subscription for" : "Quote for"} {quote.client_name}
              </span>
            </div>

            <h1 className="mt-3 text-center text-[19px] font-bold leading-tight text-white md:text-[22px]">{quote.description}</h1>

            {/* Client row */}
            <div className="mt-4">
              <Row icon={<PersonIcon />} label="Client" value={quote.client_name} />
            </div>

            <div className="my-1 h-px w-full bg-white/[0.08]" />

            {/* Price rows */}
            {isSubscription ? (
              <div>
                <Row icon={<TagIcon />} label={`Billed ${cadence === "year" ? "annually" : "monthly"}`} value={`${money(recurringPrice)}${cadenceShort}`} accent />
                <Row icon={<RefreshIcon />} label="Auto-renews" value={cadence === "year" ? "Every year" : "Every month"} />
              </div>
            ) : (
              <div>
                <Row icon={<TagIcon />} label="Total project price" value={money(quote.total_amount_cents)} />
                <Row icon={<CalendarIcon />} label="Deposit due now (50%)" value={money(quote.deposit_amount_cents)} accent />
                <Row icon={<TruckIcon />} label="Remaining on delivery" value={money(balance)} />
              </div>
            )}

            {/* Due today highlight box */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="text-sm font-bold text-white">{isSubscription ? "First charge today" : "Due today"}</span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold leading-none text-accent-cyan">{money(dueAmount)}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{isSubscription ? cadenceShort.slice(1).toUpperCase() : "USD"}</span>
              </span>
            </div>

            {quote.status === "paid" ? (
              <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm font-medium text-emerald-300">
                {isSubscription ? "This subscription is already active." : "This deposit has already been paid."} We'll be in touch shortly.
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[#050508] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(90deg, #00d4ff, #38bdf8)", boxShadow: "0 0 32px -6px rgba(0,212,255,0.5)" }}
                >
                  <LockIcon />
                  {loading
                    ? "Redirecting to Stripe…"
                    : isSubscription
                      ? `Subscribe — ${money(recurringPrice)}${cadenceShort}`
                      : `Pay ${money(quote.deposit_amount_cents)} deposit`}
                </button>
                {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
                <p className="mt-3 text-center text-xs leading-relaxed text-white/45">
                  Secure checkout powered by <span className="font-semibold text-white/70">Stripe</span>.<br />
                  {isSubscription ? "Auto-renews. Cancel anytime." : "Remaining 50% is due on delivery."}
                </p>
              </>
            )}

            {/* Trust strip */}
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-4 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldIcon className="h-6 w-6 flex-none text-accent-cyan" />
                <div className="leading-tight">
                  <div className="text-[11px] font-semibold text-white">Encrypted payment</div>
                  <div className="text-[10px] text-white/40">256-bit SSL encryption</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <StripeLogo />
                <div className="leading-tight">
                  <div className="text-[11px] font-semibold text-white">Stripe protected</div>
                  <div className="text-[10px] text-white/40">Secure payments</div>
                </div>
              </div>
              {isSubscription ? (
                <div className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-accent-cyan/40 text-accent-cyan">
                    <RefreshIcon />
                  </span>
                  <div className="leading-tight">
                    <div className="text-[11px] font-semibold text-white">Auto-renews {cadence === "year" ? "yearly" : "monthly"}</div>
                    <div className="text-[10px] text-white/40">Cancel anytime</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-accent-cyan/40 text-[8px] font-bold text-accent-cyan">50%</span>
                  <div className="leading-tight">
                    <div className="text-[11px] font-semibold text-white">50% due today</div>
                    <div className="text-[10px] text-white/40">Remaining on delivery</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
