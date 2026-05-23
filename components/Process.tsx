"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n";

const STEP_ICONS = [
  // Discover — search
  <svg key="search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>,
  // Define — strategy arrows
  <svg key="define" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M5 9l4-4 4 4"/><path d="M9 5v14"/><path d="M19 15l-4 4-4-4"/><path d="M15 19V5"/>
  </svg>,
  // Design — pen tool
  <svg key="design" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
  </svg>,
  // Build — code
  <svg key="build" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>,
  // Launch — rocket
  <svg key="rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>,
];

const PILLS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    label: "Clarity at every step",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    label: "Aligned with your goals",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    label: "Built for speed and quality",
  },
];

export default function Process() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section-deep section-separator relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 grid-bg opacity-[0.22]"
          style={{ maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 100%)" }}
        />
        <div className="absolute -left-32 top-1/4 h-[600px] w-[500px] rounded-full bg-accent-violet/[0.10] blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-[450px] w-[450px] rounded-full bg-accent-blue/[0.07] blur-[100px]" />
      </div>

      <div className="container-x">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[2fr_3fr] lg:gap-20">

          {/* ── Left column ── */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-violet" />
                Our Process
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ clipPath: "inset(100% 0 0% 0)" }}
                whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold text-white"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.2rem)", lineHeight: "1.08" }}
              >
                {t.process.headlinePart1}{" "}
                <em className="display-em">{t.process.headlineEmphasis}</em>{" "}
                {t.process.headlinePart2}
                <br />
                <span className="text-gradient-accent">{t.process.headlineAccent}</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-5 max-w-sm text-white"
              >
                {t.process.sub}
              </motion.p>

              {/* Pills */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.8, delay: 0.32 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {PILLS.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-muted-soft"
                  >
                    <span className="text-accent-cyan">{p.icon}</span>
                    {p.label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-violet/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-accent-violet">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Structured, transparent, cinematic.</p>
                  <p className="mt-1 text-sm text-muted-soft">You always know what's next.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-dim">
                {["Weekly check-ins", "Shared roadmap", "Full visibility"].map((item, i) => (
                  <span key={item} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-white/20">·</span>}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-accent-cyan">
                      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column — timeline ── */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[calc(3rem+1px)] top-0 h-full w-px bg-white/[0.08] lg:left-[3.75rem]">
              <span
                ref={lineRef}
                className="absolute inset-x-0 top-0 block h-full origin-top bg-gradient-to-b from-accent-blue via-accent-cyan to-accent-violet"
                style={{ boxShadow: "0 0 16px rgba(0,212,255,0.5)" }}
              />
            </div>

            <ul className="space-y-5">
              {t.process.steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-start gap-5 lg:gap-7"
                >
                  {/* Step number */}
                  <div className="w-12 shrink-0 pt-5 text-right lg:w-14">
                    <span className="font-display text-2xl font-bold text-white/20">{s.n}</span>
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 mt-5 shrink-0">
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-accent-cyan/40" style={{ animationDelay: `${i * 0.4}s` }} />
                      <span className="relative h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_14px_rgba(0,212,255,0.8)]" />
                    </span>
                  </div>

                  {/* Card */}
                  <div className="flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090912] p-5 transition-colors duration-300 hover:border-white/[0.14]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-accent-cyan">
                        {STEP_ICONS[i]}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-white">{s.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
