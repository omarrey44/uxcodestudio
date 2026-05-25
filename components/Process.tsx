"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

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

export default function Process() {
  const { t } = useLanguage();
  const stepsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 0.85", "end 0.3"],
  });

  const lineScaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="process" className="section-deep section-separator relative py-24 md:py-32">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-[0.18]" style={{ maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, transparent 100%)" }} />
        <div className="absolute -left-40 top-1/3 h-[340px] w-[340px] rounded-full bg-accent-violet/[0.10] blur-[60px]" />
        <div className="absolute -right-24 bottom-1/4 h-[300px] w-[340px] rounded-full bg-accent-blue/[0.08] blur-[55px]" />
      </div>

      <div className="container-x">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_2.2fr] lg:gap-16">

          {/* LEFT */}
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
                className="mb-7 inline-flex items-center gap-3 rounded-full border border-accent-violet/30 bg-gradient-to-r from-accent-violet/10 to-accent-blue/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ boxShadow: "0 0 20px rgba(139,92,246,0.12)" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent-violet opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-accent-violet" style={{ boxShadow: "0 0 6px rgba(139,92,246,0.9)" }} />
                </span>
                <span style={{ background: "linear-gradient(90deg, #c4b5fd, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", display: "inline-block" }}>
                  Our Process
                </span>
              </motion.div>

              <motion.h2
                variants={{ hidden: { clipPath: "inset(100% 0 0% 0)" }, visible: { clipPath: "inset(0% 0 0% 0)", transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } } }}
                className="font-display font-bold tracking-tighter text-white text-h2"
              >
                {t.process.headlinePart1}{" "}
                <em className="display-em">{t.process.headlineEmphasis}</em>{" "}
                {t.process.headlinePart2}
                <br />
                <span className="text-gradient-accent">{t.process.headlineAccent}</span>
              </motion.h2>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
                className="mt-5 text-sm leading-relaxed text-white/70"
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
                      <div className="mt-0.5 text-xs leading-relaxed text-white/50">{t.process.pillDescs[i]}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

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

          {/* RIGHT — scroll-fill timeline */}
          <div ref={stepsRef} className="relative">
            {/* Background rail */}
            <div className="absolute left-[21px] top-6 bottom-6 w-[2px] rounded-full bg-white/[0.06]" />
            {/* Animated fill */}
            <motion.div
              className="absolute left-[21px] top-6 bottom-6 w-[2px] rounded-full origin-top bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet"
              style={{ scaleY: lineScaleY, boxShadow: "0 0 8px rgba(0,212,255,0.6), 0 0 20px rgba(0,144,255,0.3)" }}
            />

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
                  variants={{ hidden: { opacity: 0, x: 16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                  className={`relative flex gap-6 ${i < t.process.steps.length - 1 ? "pb-14" : "pb-0"}`}
                >
                  {/* Step bubble */}
                  <div
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-accent-cyan/50 bg-[#050508] text-sm font-bold tabular-nums text-accent-cyan"
                    style={{ boxShadow: "0 0 12px rgba(0,212,255,0.35), inset 0 1px 0 rgba(0,212,255,0.15)" }}
                  >
                    {s.n}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-accent-cyan/70">{s.tag}</span>
                      <span className="text-white/25">{STEP_ICONS[i]}</span>
                      <h3 className="font-display text-[17px] font-bold tracking-tight text-white">{s.title}</h3>
                    </div>

                    <p className="text-sm leading-relaxed text-white/60">{s.body}</p>

                    <div className="mt-4 flex items-start divide-x divide-white/[0.06]">
                      {s.metrics.map((m) => (
                        <div key={m.label} className="px-4 first:pl-0 last:pr-0">
                          <div className="text-sm font-bold tracking-tight text-white">{m.value}</div>
                          <div className="mt-0.5 whitespace-nowrap text-[9px] text-white/30">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-l-2 border-accent-cyan/20 pl-3.5">
                      <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/25">Output</div>
                      <div className="space-y-1.5">
                        {s.output.map((o) => (
                          <div key={o} className="flex items-center gap-2">
                            <span className="h-px w-3 shrink-0 bg-accent-cyan/35" />
                            <span className="text-[12px] leading-snug text-white/70">{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
