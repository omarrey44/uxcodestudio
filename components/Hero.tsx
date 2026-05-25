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

function HeroShaderBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dynamic import THREE to avoid SSR issues (component already client-only)
    import("three").then((THREE) => {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;
          #define NUM_OCTAVES 3
          float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 ip = floor(p); vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            return pow(mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y),2.0);
          }
          float fbm(vec2 x) {
            float v=0.; float a=0.3; vec2 shift=vec2(100);
            mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
            for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.+shift;a*=0.4;}
            return v;
          }
          void main() {
            vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);
            vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6,-4,4,6);
            vec2 v; vec4 o=vec4(0);
            float f=2.+fbm(p+vec2(iTime*5.,0.))*0.5;
            for(float i=0.;i<35.;i++){
              v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13,11))*3.5+vec2(sin(iTime*3.+i)*0.003,cos(iTime*3.5-i)*0.003);
              float tailNoise=fbm(v+vec2(iTime*0.5,i))*0.3*(1.-(i/35.));
              vec4 col=vec4(0.1+0.3*sin(i*0.2+iTime*0.4),0.3+0.5*cos(i*0.3+iTime*0.5),0.7+0.3*sin(i*0.4+iTime*0.3),1.);
              float thin=smoothstep(0.,1.,i/35.)*0.6;
              o+=col*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)))*(1.+tailNoise*0.8)*thin;
            }
            o=tanh(pow(o/100.,vec4(1.6)))*1.5;
            gl_FragColor=vec4(o.rgb, o.a * 0.72);
          }
        `,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      let frameId: number;
      let active = true;
      const animate = () => {
        if (active) {
          material.uniforms.iTime.value += 0.016;
          renderer.render(scene, camera);
        }
        frameId = requestAnimationFrame(animate);
      };
      animate();

      const obs = new IntersectionObserver(
        ([e]) => { active = e.isIntersecting; },
        { rootMargin: "200px" }
      );
      obs.observe(container);

      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      // Store cleanup on container element
      (container as HTMLDivElement & { _cleanup?: () => void })._cleanup = () => {
        cancelAnimationFrame(frameId);
        obs.disconnect();
        window.removeEventListener("resize", onResize);
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        material.dispose();
        renderer.dispose();
      };
    });

    return () => {
      const c = containerRef.current as (HTMLDivElement & { _cleanup?: () => void }) | null;
      c?._cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [eyeColor, setEyeColor] = useState("#00d4ff");
  const [uxOn, setUxOn] = useState(false);

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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Hero1.png')" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.30)" }} />
        <HeroShaderBg />
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