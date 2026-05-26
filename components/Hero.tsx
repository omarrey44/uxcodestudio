"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import { useTextScramble } from "@/lib/hooks/useTextScramble";
import { useLanguage } from "@/lib/i18n";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });


function HeroShaderBg() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "70%", height: "70%", borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(0,180,255,0.18) 0%, transparent 70%)",
        filter: "blur(36px)",
        animation: "aurora-a 18s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", top: "10%", right: "-15%",
        width: "60%", height: "60%", borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(80,60,220,0.14) 0%, transparent 70%)",
        filter: "blur(44px)",
        animation: "aurora-b 22s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "30%",
        width: "50%", height: "50%", borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(0,210,200,0.10) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "aurora-c 26s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [eyeColor] = useState("#ffffff");
  const [uxOn, setUxOn] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  const { t } = useLanguage();
  const scrambledHero = useTextScramble(t.hero.desc, 1600);

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
        <Image src="/Hero1.png" alt="" fill priority className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.30)" }} />
        {isDesktop && <HeroShaderBg />}
      </div>

      <div ref={contentRef} className="container-x relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* LEFT */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted backdrop-blur mx-auto md:mx-0 block w-fit"
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

          <p className="hero-sub mt-8 min-h-[5rem] max-w-xl text-balance text-base text-muted-soft md:text-lg text-center md:text-left">
            {scrambledHero}
          </p>

          <div className="hero-cta mt-10 flex justify-center md:justify-start">
            <MagneticButton href="#contact" variant="primary" className="px-14 py-4 text-base">
              {t.hero.cta1} <span aria-hidden>→</span>
            </MagneticButton>
          </div>

          <div className="hero-cta mt-14 flex items-center gap-6 justify-center md:justify-start">
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
              <HeroScene eyeColor={eyeColor} uxOn={uxOn} />
            </div>


            {/* Holographic floating cards */}
            <FloatingDashboard eyeColor={eyeColor} uxOn={uxOn} setUxOn={setUxOn} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-1.5"
      >
        {/* Mouse body */}
        <svg width="24" height="38" viewBox="0 0 24 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="wheel-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Outer shell */}
          <rect x="1" y="1" width="22" height="36" rx="11"
            stroke="rgba(0,212,255,0.35)" strokeWidth="1.5" />
          {/* Inner top half highlight */}
          <rect x="1" y="1" width="22" height="18" rx="11"
            fill="rgba(0,212,255,0.04)" />
          {/* Scroll wheel — cyan glow + bounce + fade */}
          <motion.rect
            x="10.5" y="7" width="3" height="7" rx="1.5"
            fill="#00d4ff"
            filter="url(#wheel-glow)"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          />
        </svg>
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
          className="absolute inset-x-0 text-center md:text-left whitespace-nowrap text-gradient-accent"
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
  { text: "// UX-01 · ROBOT BOOT SEQUENCE",       color: "#546e7a" },
  { text: "await robot.powerOn({",                color: "#c792ea" },
  { text: '  unit:    "UX-01",',                  color: "#f78c6c" },
  { text: '  mode:    "cinematic",',              color: "#c3e88d" },
  { text: "  sensors: true,",                     color: "#f78c6c" },
  { text: "  visor:   ACTIVE,",                   color: "#82aaff" },
  { text: "});",                                  color: "#c792ea" },
  { text: "▸ UX-01 robot online",                color: "#00d8ff" },
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
              aria-label={uxOn ? "Power off robot" : "Power on robot"}
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
        <AnimatePresence mode="wait">
          {uxOn && (
            <motion.div
              key="code-on"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <TypedCode />
            </motion.div>
          )}
          {!uxOn && (
            <motion.div
              key="code-off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <pre className="font-mono text-[11px] leading-[1.75]">
                <div><span style={{ color: "#546e7a" }}>// UX-01 · POWERED OFF</span></div>
                <div><span style={{ color: "#c792ea" }}>robot</span><span style={{ color: "#546e7a" }}>.shutdown()</span></div>
                <div><span style={{ color: "#ef5350" }}>▸ system offline</span><span className="animate-pulse" style={{ color: "#ef5350" }}>▌</span></div>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}