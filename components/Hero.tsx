"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import { useTextScramble } from "@/lib/hooks/useTextScramble";
import { useLanguage } from "@/lib/i18n";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const EYE_COLORS = ["#4f6ef7", "#00d4ff", "#8b5cf6", "#f43f5e"];

function HeroComets() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Comet {
      x: number; y: number;
      vx: number; vy: number;
      len: number; alpha: number;
      size: number; isStatic: boolean;
      twinkle: number;
    }

    let w = 0, h = 0;
    let comets: Comet[] = [];
    let raf = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const spawn = (): Comet => {
      const isStatic = Math.random() < 0.55;
      const angle = isStatic ? 0 : (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
      const speed = isStatic ? 0 : 0.4 + Math.random() * 1.2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: isStatic ? 0 : 12 + Math.random() * 40,
        alpha: 0.15 + Math.random() * 0.55,
        size: isStatic ? 0.6 + Math.random() * 0.8 : 0.8 + Math.random() * 1.0,
        isStatic,
        twinkle: Math.random() * Math.PI * 2,
      };
    };

    const init = () => {
      resize();
      comets = Array.from({ length: 70 }, spawn);
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      comets.forEach((c, i) => {
        const tw = 0.5 + 0.5 * Math.sin(time * 0.0006 + c.twinkle);
        const a = c.alpha * tw;

        if (c.isStatic) {
          ctx.globalAlpha = a * 0.8;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = a;
          const grad = ctx.createLinearGradient(c.x - c.vx * c.len, c.y - c.vy * c.len, c.x, c.y);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, `rgba(180,220,255,${a})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = c.size;
          ctx.beginPath();
          ctx.moveTo(c.x - c.vx * c.len, c.y - c.vy * c.len);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();

          c.x += c.vx;
          c.y += c.vy;
          if (c.x > w + 60 || c.y > h + 60) comets[i] = spawn();
        }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    init();
    window.addEventListener("resize", init);
    raf = requestAnimationFrame(render);
    return () => { window.removeEventListener("resize", init); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }} />;
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [eyeColor, setEyeColor] = useState("#00d4ff");
  const [uxOn, setUxOn] = useState(false);

  const { t } = useLanguage();
  const scrambledHero = useTextScramble(t.hero.desc, 1600);
  const activeColor = uxOn ? "#ffb700" : eyeColor;

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
          duration: 1.4,
          delay: 0.4,
          ease: "expo.out",
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
      data-custom-cursor-zone
      className="relative isolate min-h-screen overflow-hidden pt-24 md:pt-36"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Hero1.png')" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.30)" }} />
        <HeroComets />
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
            {t.hero.badge}
          </motion.div>

          <h1
            ref={headlineRef}
            className="hero-headline font-hero font-black uppercase text-center md:text-left"
            style={{ fontSize: "clamp(2.2rem, 5.6vw, 6rem)", lineHeight: "0.93", letterSpacing: "-0.01em" }}
          >
            <span className="block [clip-path:inset(0_-9999px)]">
              <span className="word inline-block" style={{ color: "#ffffff" }}>{t.hero.headlinePart1}</span>
            </span>
            <span className="block [clip-path:inset(0_-9999px)]">
              <span className="word inline-block" style={{ color: "#60a5fa" }}>{t.hero.headlinePart2}</span>
            </span>
            <span className="block [clip-path:inset(0_-9999px)]">
              <span className="word block text-center md:text-left">
                <RotatingWord words={t.hero.rotating} />
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-8 min-h-[5rem] max-w-xl text-balance text-base text-muted-soft md:text-lg">
            {scrambledHero}
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#contact" variant="primary">
              {t.hero.cta1} <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton href="#work" variant="secondary">
              {t.hero.cta2}
            </MagneticButton>
          </div>

          <div className="hero-cta mt-14 flex items-center gap-6">
            <div className="flex -space-x-2">
              {EYE_COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setEyeColor(c)}
                  className="h-9 w-9 rounded-full border-2 transition-all duration-300 cursor-pointer"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${c}, #050508)`,
                    borderColor: eyeColor === c ? c : "var(--background)",
                    boxShadow: eyeColor === c ? `0 0 10px ${c}88` : "none",
                  }}
                />
              ))}
            </div>
            <div>
              <div className="font-display text-lg text-white">{t.hero.statsCount}</div>
              <div className="text-xs text-muted-soft">{t.hero.statsRating}</div>
            </div>
          </div>
        </div>

        {/* RIGHT — 3D + Holographic UI */}
        <div className="hero-scene relative lg:col-span-6">
          <div className="relative h-[480px] sm:h-auto sm:aspect-[4/5] w-full">
            <div className="absolute inset-0 h-full w-full">
              <HeroScene eyeColor={activeColor} uxOn={uxOn} />
            </div>

            {/* Holographic floating cards */}
            <FloatingDashboard eyeColor={activeColor} uxOn={uxOn} setUxOn={setUxOn} />
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

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [words]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words]);

  return (
    <span className="relative block h-[1.05em] [clip-path:inset(0_-9999px)]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[index]}
          className="absolute left-0 text-left whitespace-nowrap text-gradient-accent"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const CODE_LINES = [
  { text: "// UX-01 · ORBIT SYSTEM BOOT",        color: "#546e7a" },
  { text: "const orbit = await UX.initialize({",  color: "#c792ea" },
  { text: '  unit:    "UX-01",',                  color: "#f78c6c" },
  { text: '  mode:    "cinematic",',              color: "#c3e88d" },
  { text: "  polish:  100,",                      color: "#f78c6c" },
  { text: "  status:  ONLINE,",                   color: "#82aaff" },
  { text: "});",                                  color: "#c792ea" },
  { text: "▌ Initializing UX-01…",               color: "#00d8ff" },
];

function TypedCode() {
  const full = CODE_LINES.map((l) => l.text).join("\n");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= full.length) {
      const id = setTimeout(() => setCount(0), 2600);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCount((c) => c + 1), 30);
    return () => clearTimeout(id);
  }, [count, full.length]);

  const typed = full.slice(0, count);
  const lines = typed.split("\n");

  return (
    <pre className="font-mono text-[11px] leading-[1.75]">
      {lines.map((lineText, li) => {
        const isLast = li === lines.length - 1;
        return (
          <div key={li}>
            <span style={{ color: CODE_LINES[li]?.color ?? "#fff" }}>{lineText}</span>
            {isLast && <span className="animate-pulse" style={{ color: "#00d4ff" }}>▌</span>}
          </div>
        );
      })}
    </pre>
  );
}

function FloatingDashboard({ eyeColor, uxOn, setUxOn }: {
  eyeColor: string;
  uxOn: boolean;
  setUxOn: (v: boolean | ((p: boolean) => boolean)) => void;
}) {
  return (
    <motion.div
      className="absolute inset-x-0 hidden sm:block"
      style={{ top: "-4.5rem" }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl glass-strong p-4 neon-border">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          {/* Visor toggle — centered in header */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <span className="font-mono text-[10px]" style={{ color: uxOn ? eyeColor : "#546e7a" }}>
              {uxOn ? "ONLINE" : "OFFLINE"}
            </span>
            <button
              onClick={() => setUxOn((v) => !v)}
              style={{
                display: "flex", alignItems: "center",
                width: 32, height: 18, borderRadius: 9, padding: 2,
                border: "none", cursor: "pointer",
                transition: "background 0.3s, box-shadow 0.3s",
                background: uxOn ? eyeColor : "rgba(40,44,60,0.9)",
                boxShadow: uxOn ? `0 0 8px ${eyeColor}88` : "0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: "#fff",
                transform: uxOn ? "translateX(14px)" : "translateX(0)",
                transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }} />
            </button>
          </div>
          <span className="text-[10px] tracking-widest text-muted-dim">App.tsx</span>
        </div>
        <TypedCode />
      </div>
    </motion.div>
  );
}