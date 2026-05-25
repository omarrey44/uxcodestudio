"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

/* ── Icons ──────────────────────────────────────────────────────────────────── */

const STEP_ICONS = [
  <svg key="search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  <svg key="define" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 9l4-4 4 4"/><path d="M9 5v14"/><path d="M19 15l-4 4-4-4"/><path d="M15 19V5"/></svg>,
  <svg key="design" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>,
  <svg key="build" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  <svg key="rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>,
];

const PILL_ICONS = [
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  <svg key="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="zap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
];

/* ── Step images ────────────────────────────────────────────────────────────── */

const STEP_IMAGES = [
  // 01 Discover — user research / sticky notes workshop
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&fit=crop&auto=format",
  // 02 Define — strategy whiteboard / wireframing
  "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80&fit=crop&auto=format",
  // 03 Design — UI design / Figma on screen
  "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80&fit=crop&auto=format",
  // 04 Build — code editor / development
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80&fit=crop&auto=format",
  // 05 Launch — analytics dashboard / growth data
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop&auto=format",
];

function StepImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover opacity-75" loading="lazy" />
      {/* Dark overlay to match site's dark aesthetic */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,7,16,0.55) 0%, rgba(7,7,16,0.2) 50%, rgba(7,7,16,0.65) 100%)" }} />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(to top, rgba(7,7,16,0.8), transparent)" }} />
    </div>
  );
}

const STEP_MOCKS = [
  <StepImage key={0} src={STEP_IMAGES[0]} alt="User research and discovery" />,
  <StepImage key={1} src={STEP_IMAGES[1]} alt="Strategy and wireframing" />,
  <StepImage key={2} src={STEP_IMAGES[2]} alt="UI design and prototyping" />,
  <StepImage key={3} src={STEP_IMAGES[3]} alt="Development and engineering" />,
  <StepImage key={4} src={STEP_IMAGES[4]} alt="Launch and analytics" />,
];

/* ── Component ──────────────────────────────────────────────────────────────── */

export default function Process() {
  const { t } = useLanguage();

  return (
    <section id="process" className="section-deep section-separator relative py-24 md:py-32">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-[0.18]" style={{ maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, transparent 100%)" }} />
        <div className="absolute -left-40 top-1/3 h-[340px] w-[340px] rounded-full bg-accent-violet/[0.10] blur-[60px]" />
        <div className="absolute -right-24 bottom-1/4 h-[300px] w-[340px] rounded-full bg-accent-blue/[0.08] blur-[55px]" />
      </div>

      <div className="container-x">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_2.2fr] lg:gap-16">

          {/* ── Left column ─────────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white/70"
              >
                <span className="h-1 w-1 rounded-full bg-accent-violet" />
                Our Process
              </motion.div>

              <motion.h2
                variants={{ hidden: { clipPath: "inset(100% 0 0% 0)" }, visible: { clipPath: "inset(0% 0 0% 0)", transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } } }}
                className="font-display font-bold tracking-tighter text-white"
                style={{ fontSize: "clamp(2.2rem, 3vw, 3rem)", lineHeight: "1.05" }}
              >
                {t.process.headlinePart1}{" "}
                <em className="display-em">{t.process.headlineEmphasis}</em>{" "}
                {t.process.headlinePart2}
                <br />
                <span className="text-gradient-accent">{t.process.headlineAccent}</span>
              </motion.h2>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
                className="mt-5 text-sm leading-relaxed text-white"
              >
                {t.process.sub}
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
                className="mt-10 space-y-6"
              >
                {t.process.pills.map((label, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0 text-white/30">{PILL_ICONS[i]}</div>
                    <div>
                      <div className="text-sm font-semibold tracking-tight text-white">{label}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-white">{t.process.pillDescs[i]}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom card — glassmorphism */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } } }}
              className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-violet/15 text-accent-violet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-white">{t.process.sidebarTagline}</p>
                  <p className="mt-0.5 text-xs text-white/40">{t.process.sidebarSub}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {t.process.transparencyItems.map((item, i) => (
                  <span key={item} className="flex items-center gap-1.5 text-[11px] text-white/35">
                    {i > 0 && <span className="text-white/15">·</span>}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-accent-cyan/70">
                      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right column — vertical timeline ─────────────────────────── */}
          <motion.div
            className="space-y-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {t.process.steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } }}
                className="relative flex gap-5"
              >
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  {/* Step bubble */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/[0.07] text-[11px] font-bold tabular-nums text-accent-cyan">
                    {s.n}
                  </div>
                  {/* Connecting line */}
                  {i < t.process.steps.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-gradient-to-b from-accent-cyan/25 via-white/[0.05] to-transparent" style={{ minHeight: "2rem" }} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 ${i < t.process.steps.length - 1 ? "pb-10" : "pb-0"}`}>
                  {/* Header */}
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-accent-cyan/70">{s.tag}</span>
                    <span className="text-white/25">{STEP_ICONS[i]}</span>
                    <h3 className="font-display text-[17px] font-bold tracking-tight text-white">{s.title}</h3>
                  </div>

                  {/* Body + image grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_40%]">

                    {/* Text side */}
                    <div>
                      <p className="text-sm leading-relaxed text-white">{s.body}</p>

                      {/* Metrics inline */}
                      <div className="mt-4 flex items-start divide-x divide-white/[0.06]">
                        {s.metrics.map((m) => (
                          <div key={m.label} className="px-4 first:pl-0 last:pr-0">
                            <div className="text-sm font-bold tracking-tight text-white">{m.value}</div>
                            <div className="mt-0.5 whitespace-nowrap text-[9px] text-white/30">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Output */}
                      <div className="mt-4 border-l-2 border-accent-cyan/20 pl-3.5">
                        <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/25">Output</div>
                        <div className="space-y-1.5">
                          {s.output.map((o) => (
                            <div key={o} className="flex items-center gap-2">
                              <span className="h-px w-3 shrink-0 bg-accent-cyan/35" />
                              <span className="text-[12px] leading-snug text-white">{o}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/[0.06] bg-[#070710]">
                      {STEP_MOCKS[i]}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
