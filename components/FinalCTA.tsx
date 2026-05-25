"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/lib/i18n";

export default function FinalCTA() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send failed");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="section-deep relative overflow-hidden py-40 md:py-56">
      <div className="absolute inset-0 -z-10">
        <div className="aurora-layer opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <div
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent-cyan/25 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.22em]"
            style={{ boxShadow: "0 0 24px rgba(0,212,255,0.12)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-cyan opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-accent-cyan" style={{ boxShadow: "0 0 6px rgba(0,212,255,0.9)" }} />
            </span>
            <span className="text-white font-semibold">Contact</span>
          </div>
          <h2 className="font-display text-h2 font-bold text-white">
            {`Let's `}<span className="text-gradient-accent">Build</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] glass-strong p-12 text-center md:p-16"
        >
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue/50 via-accent-cyan/30 to-accent-violet/50 opacity-60 blur-2xl" />
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px opacity-60" />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-muted">
              <span className="h-1 w-1 rounded-full bg-accent-cyan" /> {t.cta.badge}
            </div>

            <h2 className="font-display text-4xl font-bold leading-[1.05] text-balance text-white md:text-7xl">
              {t.cta.headlinePart1}
              <br />
              <span style={{ background: "linear-gradient(90deg, #ffffff 0%, #a5f3fc 55%, #ddd6fe 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{t.cta.headlinePart2}</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-balance text-muted md:text-lg">
              {t.cta.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="mailto:info@uxcodestudio.com" variant="primary">
                {t.cta.cta1} <span aria-hidden>→</span>
              </MagneticButton>
              <MagneticButton href="#work" variant="secondary">
                {t.cta.cta2}
              </MagneticButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-dim">
              {t.cta.features.map((f) => <span key={f}>✦ {f}</span>)}
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="mt-10 mx-auto max-w-xl text-left space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  required
                  type="text"
                  placeholder={t.cta.formName}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-muted-dim focus:border-accent-cyan/50 focus:outline-none transition-colors"
                />
                <input
                  required
                  type="email"
                  placeholder={t.cta.formEmail}
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-muted-dim focus:border-accent-cyan/50 focus:outline-none transition-colors"
                />
              </div>
              <textarea
                required
                rows={4}
                placeholder={t.cta.formMessage}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-muted-dim focus:border-accent-cyan/50 focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-xl bg-accent-cyan px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-accent-cyan/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Sending…" : sent ? "✓ " + t.cta.formSent : t.cta.formSubmit}
              </button>
              {error && (
                <p className="text-center text-xs text-red-400">{error}</p>
              )}
            </form>

            {/* Divider */}
            <div className="my-10 h-px w-full bg-white/10" />

            {/* Contact methods — integrated */}
            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
            >
              {t.cta.contactMethods.map((m) => (
                <motion.a
                  key={m.label}
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                  whileHover={{ y: -3 }}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/30 bg-black/40 text-base text-white transition-colors group-hover:border-accent-cyan/60 group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan">
                    {m.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-dim">{m.label}</div>
                    <div className="mt-0.5 text-sm font-medium text-white">{m.value}</div>
                    <div className="text-[10px] text-muted-dim">{m.hint}</div>
                  </div>
                  <span className="shrink-0 text-muted-dim transition-transform group-hover:translate-x-1 group-hover:text-accent-cyan">→</span>
                </motion.a>
              ))}

              {/* Video call card — Zoom + Teams */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/30 bg-black/40 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M15 10l4.55-2.73A1 1 0 0 1 21 8.13v7.74a1 1 0 0 1-1.45.9L15 14"/><rect x="1" y="6" width="14" height="12" rx="2"/>
                    </svg>
                  </span>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-dim">Video call</div>
                    <div className="text-[10px] text-muted-dim">Pick your platform</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://zoom.us/my/uxcodestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs font-medium text-white/60 transition-colors hover:border-accent-cyan/50 hover:bg-accent-cyan/10 hover:text-accent-cyan"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.02 8h4.95v16H.02V8zm7.93 0h4.73v2.19h.07c.66-1.25 2.27-2.56 4.67-2.56 5 0 5.92 3.29 5.92 7.57V24h-4.95v-7.82c0-1.87-.03-4.27-2.6-4.27-2.61 0-3.01 2.04-3.01 4.14V24H7.95V8z"/>
                    </svg>
                    Zoom
                  </a>
                  <a
                    href="https://teams.microsoft.com/l/meetup-join/uxcodestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs font-medium text-white/60 transition-colors hover:border-accent-violet/50 hover:bg-accent-violet/10 hover:text-accent-violet"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                      <path d="M20.625 6.75h-4.5V3.375A1.125 1.125 0 0 0 15 2.25H9a1.125 1.125 0 0 0-1.125 1.125V6.75h-4.5A1.125 1.125 0 0 0 2.25 7.875v9A1.125 1.125 0 0 0 3.375 18h4.5v2.625A1.125 1.125 0 0 0 9 21.75h6a1.125 1.125 0 0 0 1.125-1.125V18h4.5a1.125 1.125 0 0 0 1.125-1.125v-9A1.125 1.125 0 0 0 20.625 6.75zM13.5 15.75h-3V9.75h3v6z"/>
                    </svg>
                    Teams
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
