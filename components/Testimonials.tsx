"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { ReviewStars } from "@/components/ui/animated-cards-stack";

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sofía R.",
    role: "CEO · Nebula",
    rating: 5,
    quote:   "The handoff between design and engineering was invisible. We launched 3 weeks early and conversion doubled.",
    quoteEs: "La transición entre diseño e ingeniería fue invisible. Lanzamos 3 semanas antes y la conversión se duplicó.",
    gradient: "from-accent-blue to-accent-cyan",
  },
  {
    id: "t2",
    name: "Marcus L.",
    role: "Co-founder · Helio",
    rating: 5,
    quote:   "These are the people other agencies copy. The motion alone closed our Series A pitch.",
    quoteEs: "Son las personas que otras agencias copian. Solo el motion cerró nuestra ronda Serie A.",
    gradient: "from-accent-violet to-accent-blue",
  },
  {
    id: "t3",
    name: "Priya K.",
    role: "Head of Product · Orbit AI",
    rating: 5,
    quote:   "We needed an interface that feels like the future. Investors literally applauded the demo.",
    quoteEs: "Necesitábamos una interfaz que se sintiera del futuro. Los inversores aplaudieron literalmente el demo.",
    gradient: "from-accent-cyan to-accent-violet",
  },
  {
    id: "t4",
    name: "Daniel P.",
    role: "CTO · Lumen",
    rating: 5,
    quote:   "Senior. Opinionated. Fast. They became part of our team in a week and never slowed down.",
    quoteEs: "Senior. Con criterio. Rápidos. Se integraron a nuestro equipo en una semana y nunca frenaron.",
    gradient: "from-accent-blue to-accent-violet",
  },
];

const STACK = [
  { x: 0,  y: 0,   rotate: 0,  scale: 1,    zIndex: 40, opacity: 1    },
  { x: 14, y: -14, rotate: 4,  scale: 0.94, zIndex: 30, opacity: 0.65 },
  { x: 26, y: -26, rotate: 7,  scale: 0.88, zIndex: 20, opacity: 0.4  },
  { x: 36, y: -36, rotate: 10, scale: 0.82, zIndex: 10, opacity: 0.18 },
];

const LOGOS = [
  {
    name: "Linear",
    icon: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M1.22 61.75 38.25 98.78a50 50 0 0 0 23.27-12.88L14.1 38.48A50.06 50.06 0 0 0 1.22 61.75ZM6.08 38.41 61.59 93.92A50 50 0 0 0 93.92 61.6L38.41 6.08A50 50 0 0 0 6.08 38.41ZM44.24 1.65 98.35 55.76a50.07 50.07 0 0 0 1.4-12.17C99.75 19.78 80.22.25 56.41.25A50.07 50.07 0 0 0 44.24 1.65ZM.25 43.59c0 4.19.54 8.25 1.56 12.11L44.3 13.16A49.75 49.75 0 0 0 .25 43.59Z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    icon: (
      <svg viewBox="0 0 116 100" fill="currentColor">
        <path d="M57.5 0L115 100H0L57.5 0Z" />
      </svg>
    ),
  },
  {
    name: "Raycast",
    icon: (
      <svg viewBox="0 0 512 512" fill="currentColor">
        <path d="M0 320.141v44l105.032 105.032h44L0 320.141ZM0 234.961l277.039 277.039h44.18L0 190.601v44.36ZM21.659 512l277.22-277.22V191.6L0 469.18 21.659 512ZM277.039 0H234.5L0 234.5v42.539L277.039 0ZM320 21.48 42.96 298.52h43.18L320 64.659V21.48ZM320.141 0l-44 44h148.489v148.489l44-44V0H320.141ZM512 191.84l-44 44v148.489H319.511l-44 44H512V191.84Z" />
      </svg>
    ),
  },
  {
    name: "resend",
    icon: (
      <svg viewBox="0 0 40 40" fill="currentColor">
        <path d="M5 5h13.5C24.3 5 29 9.7 29 15.5c0 4.5-2.8 8.4-6.9 10L30 35H21l-7.5-9H12v9H5V5Zm7 6v9h6.5a4.5 4.5 0 0 0 0-9H12Z" />
      </svg>
    ),
  },
];

export default function Testimonials() {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useInView(sectionRef, { margin: "200px" });
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [busy, setBusy] = useState(false);

  const shuffle = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      setOrder((prev) => { const [f, ...rest] = prev; return [...rest, f]; });
      setBusy(false);
    }, 320);
  }, [busy]);

  useEffect(() => {
    const id = setInterval(shuffle, 4500);
    return () => clearInterval(id);
  }, [shuffle]);

  const active = TESTIMONIALS[order[0]];
  const q = (item: typeof TESTIMONIALS[0]) => lang === "es" ? item.quoteEs : item.quote;

  return (
    <section ref={sectionRef} className="section-separator relative overflow-hidden py-24 md:py-32">

      {/* ── Atmospheric background ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">

        {/* Responsive background image */}
        <div className="absolute inset-0 block md:hidden"
          style={{ backgroundImage: "url('/testimonioMovil.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 hidden md:block"
          style={{ backgroundImage: "url('/testimonioFondo.png')", backgroundSize: "cover", backgroundPosition: "center" }} />

        {/* Aurora blob — top left, violet, ultra slow drift */}
        <motion.div
          animate={visible ? { x: [0, 40, -20, 0], y: [0, -30, 18, 0] } : {}}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-16 h-[560px] w-[680px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.10) 0%, transparent 68%)", filter: "blur(55px)" }}
        />

        {/* Aurora blob — bottom right, cyan, slow */}
        <motion.div
          animate={visible ? { x: [0, -50, 28, 0], y: [0, 35, -20, 0] } : {}}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 h-[500px] w-[620px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(55px)" }}
        />

        {/* Center ambient — barely visible, ties both sides */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(79,70,229,0.06) 0%, transparent 70%)", filter: "blur(50px)" }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Top fade — blends with section above */}
        <div className="absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(to bottom, #08090f 0%, transparent 100%)" }} />

        {/* Bottom fade — transitions toward pricing aurora */}
        <div className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(4,6,20,0.7) 60%, #05060f 100%)" }} />
      </div>

      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">

          {/* ── Left: eyebrow + title + quote ── */}
          <div>
            {/* Eyebrow */}
            <div className="mb-20 flex items-center gap-5">
              <span className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
              <span
                className="text-3xl font-black uppercase tracking-[0.15em] sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ background: "linear-gradient(90deg, #00d4ff 0%, #7c5cfc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                {t.testimonials.eyebrow}
              </span>
              <span className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)" }} />
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              {t.testimonials.titlePart1}{" "}
              <span className="text-gradient-accent">{t.testimonials.accent}</span>
            </h2>
            {/* Animated quote */}
            <AnimatePresence mode="wait">
              <motion.div
                key={order[0]}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10"
              >
                <div className="mb-4 text-4xl leading-none text-accent-cyan">"</div>
                <blockquote className="text-lg font-light leading-relaxed text-white md:text-xl">
                  {q(active)}
                </blockquote>
                <div className="mt-7 flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${active.gradient} font-bold text-white`}
                  >
                    {active.name.charAt(0)}
                  </span>
                  <div className="leading-tight">
                    <div className="font-medium text-white">{active.name}</div>
                    <div className="text-sm text-muted-soft">{active.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="mt-8 flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (busy) return;
                    const idx = order.indexOf(i);
                    if (idx === 0) return;
                    setOrder((prev) => {
                      const next = [...prev];
                      next.splice(idx, 1);
                      next.unshift(i);
                      return next;
                    });
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    order[0] === i ? "w-8 bg-accent-cyan" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: stacked cards ── */}
          <div className="flex justify-center lg:justify-end">
            {/* Ambient glow behind stack — subtle depth */}
            <div className="relative">
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                style={{
                  transform: "translate(-10%, 10%) scale(1.3)",
                  background: "radial-gradient(ellipse at center, rgba(99,102,241,0.14) 0%, rgba(6,182,212,0.08) 45%, transparent 70%)",
                  filter: "blur(32px)",
                }}
              />
            <div
              className="relative h-[420px] w-[340px] cursor-pointer select-none"
              onClick={shuffle}
            >
              {order.map((dataIdx, stackPos) => {
                const s = STACK[stackPos] ?? STACK[STACK.length - 1];
                const item = TESTIMONIALS[dataIdx];
                return (
                  <motion.div
                    key={dataIdx}
                    animate={{
                      x: s.x,
                      y: s.y,
                      rotate: s.rotate,
                      scale: s.scale,
                      opacity: s.opacity,
                      zIndex: s.zIndex,
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md"
                    style={{ transformOrigin: "bottom left" }}
                  >
                    {stackPos === 0 && (
                      <>
                        <div className="flex flex-col items-center gap-4 text-center">
                          <ReviewStars rating={item.rating} className="text-accent-cyan" />
                          <blockquote className="text-[15px] leading-relaxed text-white">
                            "{q(item)}"
                          </blockquote>
                        </div>
                        <div className="flex w-full items-center gap-3 border-t border-white/[0.08] pt-4">
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${item.gradient} text-sm font-bold text-white`}
                          >
                            {item.name.charAt(0)}
                          </span>
                          <div className="leading-tight text-left">
                            <div className="text-sm font-medium text-white">{item.name}</div>
                            <div className="text-xs text-muted-soft">{item.role}</div>
                          </div>
                          <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-dim">
                            {lang === "es" ? "toca ↻" : "tap ↻"}
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
            </div>{/* close glow wrapper */}
          </div>
        </div>

        {/* ── Logo strip ── */}
        <div className="mt-20 border-t border-white/5 pt-10">
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {LOGOS.map(({ name, icon }) => (
              <div
                key={name}
                className="flex items-center gap-3 text-white/50 transition-colors duration-300 hover:text-white"
              >
                <span className="h-6 w-6 shrink-0">{icon}</span>
                <span className="text-lg font-semibold tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
