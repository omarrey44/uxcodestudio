"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useInView, type Variants, type TargetAndTransition } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/lib/i18n";
import { BookingModal } from "./BookingModal";

function FlowConnector({ delay = 0 }: { delay?: number }) {
  const id = `hg${delay * 10}`;
  return (
    <div className="hidden lg:flex flex-none w-12 items-center justify-center self-center">
      <svg viewBox="0 0 48 20" fill="none" width="48" height="20" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,255,255,0.12)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.45)" />
          </linearGradient>
        </defs>
        {/* base line */}
        <line x1="2" y1="10" x2="38" y2="10" stroke={`url(#${id})`} strokeWidth="1.5" strokeLinecap="round" />
        {/* arrowhead */}
        <path d="M32 4l8 6-8 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* traveling glow dot */}
        <motion.circle
          r="3" cy="10"
          animate={{ cx: [2, 38], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay, repeatDelay: 1.2 }}
          fill="white"
          style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 10px rgba(200,220,255,0.6))" }}
        />
      </svg>
    </div>
  );
}

function ShimmerSpotlightCard({
  children, className = "", shimmerDelay = 0, href, target, rel, variants, whileHover, visible = true,
}: {
  children: React.ReactNode; className?: string; shimmerDelay?: number; visible?: boolean;
  href?: string; target?: string; rel?: string; variants?: Variants; whileHover?: TargetAndTransition;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) =>
      `radial-gradient(160px circle at ${x}px ${y}px, rgba(0,212,255,0.22), transparent 70%)`
  );
  const handlers = {
    onMouseMove: (e: React.MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    onMouseEnter: () => spotlightOpacity.set(1),
    onMouseLeave: () => spotlightOpacity.set(0),
  };
  const inner = (
    <>
      <motion.div className="pointer-events-none absolute -inset-px rounded-2xl" style={{ background: spotlightBg, opacity: spotlightOpacity }} />
      <motion.div
        className="pointer-events-none absolute top-0 bottom-0 w-16 -skew-x-12"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)" }}
        animate={visible ? { x: [-64, 500] } : { x: -64 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: shimmerDelay, repeatDelay: 2 }}
      />
      {children}
    </>
  );
  if (href) {
    return (
      <motion.a ref={cardRef as React.Ref<HTMLAnchorElement>} href={href} target={target} rel={rel}
        className={`relative overflow-hidden ${className}`} variants={variants} whileHover={whileHover} {...handlers}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.div ref={cardRef as React.Ref<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`} variants={variants} whileHover={whileHover} {...handlers}>
      {inner}
    </motion.div>
  );
}

export default function FinalCTA() {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const sectionVisible = useInView(sectionRef, { margin: "300px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

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
    <>
    <section id="contact" ref={sectionRef} className="section-deep relative overflow-hidden py-40 md:py-56">
      <div className="absolute inset-0 -z-10">
        <div className="aurora-layer opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="container-x relative">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-20 flex items-center justify-center gap-5">
            <span className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
            <span
              className="text-3xl font-black uppercase tracking-[0.15em] sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ background: "linear-gradient(90deg, #00d4ff 0%, #7c5cfc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              {t.cta.eyebrow}
            </span>
            <span className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)" }} />
          </div>
          <h2 className="font-display text-h2 font-bold text-white">
            {t.cta.badge}
          </h2>
        </motion.div>

        <motion.div
          initial={{ y: 60, scale: 0.96 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] glass-strong p-12 text-center md:p-16"
        >
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue/50 via-accent-cyan/30 to-accent-violet/50 opacity-60 blur-2xl" />
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px opacity-60" />

          <div className="relative">
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
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-dim">
              {t.cta.features.map((f) => <span key={f}>✦ {f}</span>)}
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="mt-10 mx-auto max-w-xl text-left space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="sr-only">{t.cta.formName}</label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    autoComplete="name"
                    placeholder={t.cta.formName}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-muted-dim focus:border-accent-cyan/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">{t.cta.formEmail}</label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder={t.cta.formEmail}
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-muted-dim focus:border-accent-cyan/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <label htmlFor="contact-message" className="sr-only">{t.cta.formMessage}</label>
              <textarea
                id="contact-message"
                required
                rows={4}
                autoComplete="off"
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

            {/* Contact methods — flex row with animated connectors */}
            <motion.div
              className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
            >
              {t.cta.contactMethods.map((m, i) => (
                <React.Fragment key={i}>
                  <ShimmerSpotlightCard
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                    whileHover={{ y: -3 }}
                    shimmerDelay={i * 0.6}
                    visible={sectionVisible}
                    className="group flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/30 bg-black/40 text-base text-white transition-colors group-hover:border-accent-cyan/60 group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan">
                      {m.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-dim">{m.label}</div>
                      <div className="mt-0.5 text-sm font-medium text-white break-all leading-tight">{m.value}</div>
                      <div className="text-[10px] text-muted-dim">{m.hint}</div>
                    </div>
                  </ShimmerSpotlightCard>
                  <FlowConnector key={`fc-${i}`} delay={i * 0.5} />
                </React.Fragment>
              ))}

              {/* Video call card */}
              <ShimmerSpotlightCard
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                shimmerDelay={1.8}
                visible={sectionVisible}
                className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/30 bg-black/40 text-white transition-colors group-hover:border-accent-cyan/60 group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-dim">Video call</div>
                    <div className="text-sm font-medium text-white">Zoom · Teams</div>
                    <div className="text-[10px] text-muted-dim">All days · 9am–6pm</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="w-full rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 py-2 text-xs font-semibold text-accent-cyan transition-all hover:bg-accent-cyan/20 active:scale-[0.98]"
                >
                  {lang === "es" ? "Agendar llamada →" : "Book a call →"}
                </button>
              </ShimmerSpotlightCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>

    <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
