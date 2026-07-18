"use client";

import { useState } from "react";

type QuoteType = "deposit" | "subscription";
type BillingCycle = "monthly" | "annual";

export default function AdminQuotesPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [quoteType, setQuoteType] = useState<QuoteType>("deposit");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [pricePerCycle, setPricePerCycle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ code: string; payUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const body =
        quoteType === "subscription"
          ? { clientName, description, quoteType, billingCycle, pricePerCycle: Number(pricePerCycle) }
          : { clientName, description, quoteType, totalAmount: Number(totalAmount) };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setClientName("");
        setDescription("");
        setTotalAmount("");
        setPricePerCycle("");
      } else {
        setError(data.error || "Failed to create quote.");
      }
    } catch {
      setError("Failed to create quote.");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    if (!result) return;
    navigator.clipboard.writeText(result.payUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent-cyan/50 focus:outline-none transition-colors";
  const tabClass = (active: boolean) =>
    `flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
      active ? "bg-accent-cyan text-black" : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
    }`;

  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-6 py-24" style={{ background: "#050508" }}>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-xl font-bold text-white">Generate payment link</h1>
        <p className="mt-1.5 text-sm text-white/50">Internal tool. Keep this URL and the admin secret private.</p>

        {/* Quote type tabs */}
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => setQuoteType("deposit")} className={tabClass(quoteType === "deposit")}>
            One-time deposit
          </button>
          <button type="button" onClick={() => setQuoteType("subscription")} className={tabClass(quoteType === "subscription")}>
            Subscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            required
            placeholder="Admin secret"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            className={inputClass}
            autoComplete="off"
          />
          <input
            type="text"
            required
            placeholder="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            required
            placeholder={quoteType === "subscription" ? "Plan description (e.g. Hosting Management)" : "Project description (e.g. Business Website — 5 pages)"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />

          {quoteType === "subscription" ? (
            <>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={tabClass(billingCycle === "monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={tabClass(billingCycle === "annual")}
                >
                  Annual
                </button>
              </div>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder={billingCycle === "annual" ? "Price per year (USD)" : "Price per month (USD)"}
                value={pricePerCycle}
                onChange={(e) => setPricePerCycle(e.target.value)}
                className={inputClass}
              />
            </>
          ) : (
            <input
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="Total project price (USD)"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className={inputClass}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent-cyan px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-accent-cyan/90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate payment link"}
          </button>
          {error && <p className="text-center text-xs text-red-400">{error}</p>}
        </form>

        {result && (
          <div className="mt-6 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-4">
            <p className="text-xs text-white/50">Payment link</p>
            <p className="mt-1 break-all text-sm font-medium text-accent-cyan">{result.payUrl}</p>
            <button
              type="button"
              onClick={copyLink}
              className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/20"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
