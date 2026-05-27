"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
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

function SpotlightStepCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) => `radial-gradient(160px circle at ${x}px ${y}px, rgba(139,92,246,0.18), transparent 70%)`
  );
  return (
    <div ref={ref} className={`relative ${className}`}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      onMouseEnter={() => spotlightOpacity.set(1)}
      onMouseLeave={() => spotlightOpacity.set(0)}
    >
      <motion.div className="pointer-events-none absolute -inset-2 rounded-2xl"
        style={{ background: spotlightBg, opacity: spotlightOpacity }} />
      {children}
    </div>
  );
}

function MobileStepCarousel({ steps }: { steps: { n: string; tag: string; title: string; body: string; output: string[] }[] }) {
  const [active, setActive] = useState(0);
  const dragX = useMotionValue(0);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -40 && active < steps.length - 1) setActive(active + 1);
    if (info.offset.x > 40 && active > 0) setActive(active - 1);
  }

  const s = steps[active];

  return (
    <div className="relative">
      {/* Step counter */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-cyan/60">
          {active + 1} / {steps.length}
        </span>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "24px" : "6px",
                background: i === active ? "rgba(0,212,255,0.9)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Drag card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{ x: dragX }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="cursor-grab active:cursor-grabbing select-none rounded-2xl border border-white/[0.1] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
        >
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent-cyan/50 bg-[#050508] text-sm font-bold tabular-nums text-accent-cyan"
              style={{ boxShadow: "0 0 12px rgba(0,212,255,0.35)" }}
            >
              {s.n}
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-accent-cyan/70">{s.tag}</div>
              <h3 className="font-display text-base font-bold tracking-tight text-blue-300">{s.title}</h3>
            </div>
            <span className="ml-auto text-white">{STEP_ICONS[active]}</span>
          </div>

          <p className="text-sm leading-relaxed text-white/80">{s.body}</p>

          <div className="mt-4 border-l-2 border-accent-cyan/20 pl-3.5">
            <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-accent-cyan/60">Output</div>
            <div className="space-y-1.5">
              {s.output.map((o) => (
                <div key={o} className="flex items-center gap-2">
                  <span className="h-px w-3 shrink-0 bg-accent-cyan/35" />
                  <span className="text-[12px] leading-snug text-white/70">{o}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe hint — only on first view */}
      {active === 0 && (
        <motion.p
          className="mt-3 text-center text-[11px] text-white/30"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        >
          ← desliza para ver pasos →
        </motion.p>
      )}

      {/* Prev / Next buttons */}
      <div className="mt-4 flex justify-between gap-3">
        <button
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          disabled={active === 0}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 transition-colors disabled:opacity-30 hover:border-white/20 hover:text-white"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
          disabled={active === steps.length - 1}
          className="flex-1 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 py-2.5 text-sm text-accent-cyan transition-colors disabled:opacity-30 hover:bg-accent-cyan/20"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

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
        {/* Eyebrow — full width above grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex items-center justify-center gap-5"
        >
          <span className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
          <span
            className="text-3xl font-black uppercase tracking-[0.15em] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ background: "linear-gradient(90deg, #00d4ff 0%, #7c5cfc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            {t.process.eyebrow}
          </span>
          <span className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)" }} />
        </motion.div>

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
                variants={{ hidden: { y: 12 }, visible: { y: 0, transition: { duration: 0.7 } } }}
                className="mt-5 text-sm leading-relaxed text-white"
              >
                {t.process.sub}
              </motion.p>

              <motion.div
                variants={{ hidden: { y: 12 }, visible: { y: 0, transition: { duration: 0.7 } } }}
                className="mt-10 space-y-6"
              >
                {t.process.pills.map((label, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0 text-white">{PILL_ICONS[i]}</div>
                    <div>
                      <div className="text-sm font-semibold tracking-tight text-white">{label}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-white">{t.process.pillDescs[i]}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              variants={{ hidden: { y: 18 }, visible: { y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } } }}
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
                  <p className="mt-0.5 text-xs text-white">{t.process.sidebarSub}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {t.process.transparencyItems.map((item, i) => (
                  <span key={item} className="flex items-center gap-1.5 text-[11px] text-white">
                    {i > 0 && <span className="text-white">·</span>}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-accent-cyan/70">
                      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — mobile carousel */}
          <div className="block lg:hidden">
            <MobileStepCarousel steps={t.process.steps} />
          </div>

          {/* RIGHT — desktop scroll-fill timeline */}
          <div ref={stepsRef} className="relative hidden lg:block">
            {/* Background rail */}
            <div className="absolute left-[21px] top-6 bottom-6 w-[2px] rounded-full bg-white/[0.06]" />
            {/* Animated fill */}
            <motion.div
              className="absolute left-[21px] top-6 bottom-6 w-[2px] rounded-full origin-top bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet"
              style={{ scaleY: lineScaleY, boxShadow: "0 0 8px rgba(0,212,255,0.6), 0 0 20px rgba(0,144,255,0.3)" }}
            >
              {/* A — traveling glow dot at fill tip */}
              <div className="absolute bottom-0 left-1/2 h-3 w-3 translate-y-1/2 -translate-x-1/2 rounded-full bg-accent-cyan"
                style={{ boxShadow: "0 0 8px 3px rgba(0,212,255,0.9), 0 0 20px 6px rgba(0,212,255,0.45)" }} />
            </motion.div>

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
                  variants={{ hidden: { x: 16 }, visible: { x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                  className={`relative flex gap-6 ${i < t.process.steps.length - 1 ? "pb-14" : "pb-0"}`}
                >
                  {/* Step bubble */}
                  <div
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-accent-cyan/50 bg-[#050508] text-sm font-bold tabular-nums text-accent-cyan"
                    style={{ boxShadow: "0 0 12px rgba(0,212,255,0.35), inset 0 1px 0 rgba(0,212,255,0.15)" }}
                  >
                    {s.n}
                  </div>

                  {/* B — spotlight hover wrapper */}
                  <SpotlightStepCard className="flex-1 pt-1">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-accent-cyan/70">{s.tag}</span>
                      <span className="text-white">{STEP_ICONS[i]}</span>
                      <h3 className="font-display text-[17px] font-bold tracking-tight text-blue-300">{s.title}</h3>
                    </div>

                    <p className="text-sm leading-relaxed text-white">{s.body}</p>

                    <div className="mt-4 border-l-2 border-accent-cyan/20 pl-3.5">
                      <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-accent-cyan/60">Output</div>
                      <div className="space-y-1.5">
                        {s.output.map((o, oi) => (
                          <div key={o} className="flex items-center gap-2">
                            {/* C — output line draw */}
                            <motion.span
                              className="h-px w-3 shrink-0 bg-accent-cyan/35"
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true, margin: "-20px" }}
                              transition={{ duration: 0.4, ease: "easeOut", delay: oi * 0.08 }}
                              style={{ originX: "left" }}
                            />
                            <span className="text-[12px] leading-snug text-white">{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SpotlightStepCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
