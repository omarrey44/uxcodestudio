"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import { useTextScramble } from "@/lib/hooks/useTextScramble";
import { useMouseParallax } from "@/lib/hooks/useMouseParallax";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const ROTATING = ["Websites", "Landings", "Web Apps", "SaaS"];

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const heroText = "UXCODESTUDIO is a digital product studio crafting cinematic interfaces and high-performing systems for ambitious teams that refuse to ship anything average.";
  const scrambledHero = useTextScramble(heroText, 1600);

  useEffect(() => {
    // SSR-safe — runs only on client
    const alreadyShown = (() => {
      try { return sessionStorage.getItem("loader-shown") === "1"; }
      catch { return false; }
    })();

    function initGsap() {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const split = (headlineRef.current?.querySelectorAll(".word") ??
          []) as NodeListOf<HTMLElement>;
        gsap.from(split, {
          yPercent: 110,
          opacity: 0,
          rotate: 3,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.2,
        });

        gsap.from(".hero-sub", {
          y: 24,
          opacity: 0,
          duration: 1,
          delay: 0.7,
          ease: "power3.out",
        });

        gsap.from(".hero-cta", {
          y: 18,
          opacity: 0,
          duration: 0.9,
          delay: 0.9,
          ease: "power3.out",
          stagger: 0.1,
        });

        gsap.from(".hero-scene", {
          opacity: 0,
          scale: 0.92,
          duration: 1.4,
          delay: 0.4,
          ease: "expo.out",
        });

        gsap.to(rootRef.current, {
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          opacity: 0.4,
          ease: "none",
        });

        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          scale: 0.96,
          ease: "none",
        });
      }, rootRef);
      return () => ctx.revert();
    }

    if (alreadyShown) {
      return initGsap();
    }

    let cleanup: (() => void) | undefined;
    const handler = () => { cleanup = initGsap(); };
    window.addEventListener("loader:done", handler, { once: true });

    return () => {
      window.removeEventListener("loader:done", handler);
      cleanup?.();
    };
  }, []); // empty deps — initGsap is declared inside and must NOT be added to deps

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative isolate min-h-screen overflow-hidden pt-32 md:pt-36"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Hero1.png')" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.30)" }} />
      </div>

      <div ref={contentRef} className="container-x relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* LEFT */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-cyan opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-accent-cyan" />
            </span>
            Booking new projects · Q3 2026
          </motion.div>

          <h1
            ref={headlineRef}
            className="hero-headline font-hero font-black uppercase"
            style={{ fontSize: "clamp(3.2rem, 6.5vw, 6rem)", lineHeight: "0.93", letterSpacing: "-0.01em" }}
          >
            <span className="block overflow-hidden">
              <span className="word inline-block" style={{ color: "#ffffff" }}>We&nbsp;design&nbsp;&amp;</span>
            </span>
            <span className="block overflow-hidden">
              <span className="word inline-block" style={{ color: "#60a5fa" }}>engineer</span>
            </span>
            <span className="block overflow-hidden">
              <span className="word inline-block">
                <RotatingWord />
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-8 max-w-xl text-balance text-base text-muted-soft md:text-lg">
            {scrambledHero}
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#contact" variant="primary">
              Start your project <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton href="#work" variant="secondary">
              View our work
            </MagneticButton>
          </div>

          <div className="hero-cta mt-14 flex items-center gap-6">
            <div className="flex -space-x-2">
              {["#4f6ef7", "#00d4ff", "#8b5cf6", "#1f2937"].map((c, i) => (
                <span
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-background"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${c}, #050508)`,
                  }}
                />
              ))}
            </div>
            <div>
              <div className="font-display text-lg text-white">
                40+ products shipped
              </div>
              <div className="text-xs text-muted-soft">
                Rated 4.9/5 by founders &amp; design leads
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — 3D + Holographic UI */}
        <div className="hero-scene relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-full">
            <div className="absolute inset-0 h-full w-full">
              <HeroScene />
            </div>

            {/* Holographic floating cards */}
            <FloatingDashboard />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-muted-dim"
      >
        <span>Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-3 animate-[float_2.2s_ease-in-out_infinite] bg-gradient-to-b from-accent-cyan to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex h-[1.05em] min-w-[10ch] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={ROTATING[index]}
          className="absolute left-0 text-gradient-accent"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {ROTATING[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FloatingDashboard() {
  const parallax = useMouseParallax();
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const px = parallax.current.x;
      const py = parallax.current.y;
      if (card1Ref.current)
        card1Ref.current.style.transform = `translate(${px * 1.2 * 18}px, ${py * 1.2 * 12}px)`;
      if (card2Ref.current)
        card2Ref.current.style.transform = `translate(${px * 0.6 * 18}px, ${py * 0.6 * 12}px)`;
      if (card3Ref.current)
        card3Ref.current.style.transform = `translate(${px * 0.9 * 18}px, ${py * 0.9 * 12}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [parallax]);

  return (
    <>
      {/* Card 1: Conversion chart — depth 1.2× (closest) */}
      <div
        ref={card1Ref}
        className="absolute"
        style={{ top: "2.5rem", left: "-1.5rem", willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="w-[220px] rounded-2xl glass-strong p-4 neon-border glow-blue"
          >
            <div className="flex items-center justify-between text-[10px] text-muted-soft">
              <span>Conversion</span>
              <span className="text-accent-cyan">+318%</span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              {[40, 55, 38, 70, 50, 82, 65, 92].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: 1.3 + i * 0.06, duration: 0.6 }}
                  className="w-2.5 rounded-sm bg-gradient-to-t from-accent-blue to-accent-cyan"
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="mt-3 font-display text-2xl font-bold text-white">
              12,847
            </div>
            <div className="text-[10px] text-muted-dim">unique sessions / 24h</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Card 2: Code editor — depth 0.6× (furthest) */}
      <div
        ref={card2Ref}
        className="absolute"
        style={{ bottom: "6rem", right: "-1rem", willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="w-[260px] rounded-2xl glass-strong p-3 neon-border"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-auto text-[10px] text-muted-dim">App.tsx</span>
            </div>
            <pre className="mt-3 overflow-hidden text-[10.5px] leading-relaxed text-muted">
{`export default function Ship() {
  const ui = useDesign({
    polish: 100,
    motion: "cinematic",
  });
  return <Beautiful {...ui} />;
}`}
            </pre>
          </motion.div>
        </motion.div>
      </div>

      {/* Card 3: Lighthouse badge — depth 0.9× (medium) */}
      <div
        ref={card3Ref}
        className="absolute"
        style={{ bottom: "0.5rem", left: "1rem", willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex items-center gap-3 rounded-full glass-strong px-4 py-2.5 glow-violet"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent-violet to-accent-blue text-xs">
              ✦
            </span>
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-white">Lighthouse 100</div>
              <div className="text-[9px] text-muted-dim">Perf · A11y · SEO</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}