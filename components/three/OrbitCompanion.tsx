"use client";

import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Hand, MousePointer2, Power, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import styles from "./OrbitCompanion.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const COLORS = [
  { value: "#38dcff", en: "Cyan", es: "Cian" },
  { value: "#a394ff", en: "Violet", es: "Violeta" },
  { value: "#ffbd77", en: "Amber", es: "Ámbar" },
];

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function OrbitCompanion() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [reducedMotion, setReducedMotion] = useState(true);
  const [color, setColor] = useState(COLORS[0].value);
  const [powered, setPowered] = useState(true);
  const [greeting, setGreeting] = useState(0);
  const [greetingActive, setGreetingActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [supported, setSupported] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPointer = useRef<{ x: number; y: number } | null>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setReady(false); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    // Check before mounting Fiber: renderer creation can reject outside React's boundary.
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      if (!context) { onError(); return; }
      context.getExtension("WEBGL_lose_context")?.loseContext();
      setSupported(true);
    } catch { onError(); }
  }, [attempt, onError]);

  const sayHello = () => {
    if (!powered || !ready || failed) return;
    setGreeting((value) => value + 1);
    setGreetingActive(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGreetingActive(false), 2400);
  };
  const togglePower = () => {
    setPowered((value) => !value);
    setGreetingActive(false);
    if (timer.current) clearTimeout(timer.current);
  };
  const retry = async () => {
    try {
      const { clearOrbitModel } = await import("./HeroScene");
      clearOrbitModel();
      setSupported(false);
      setAttempt((value) => value + 1);
      setFailed(false);
    } catch { onError(); }
  };
  const status = failed ? (es ? "Vista previa" : "Preview")
    : !ready ? (es ? "Despertando" : "Waking up")
      : !powered ? (es ? "En reposo" : "Resting")
        : greetingActive ? (es ? "¡Hola, humano!" : "Hey, human!")
          : (es ? "Listo para crear" : "Ready to create");

  return (
    <div className={styles.companion} style={{ "--orbit-accent": color } as CSSProperties} data-powered={powered} data-ready={ready} data-reduced-motion={reducedMotion}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.brandMark} aria-hidden="true">o<span>·</span></span>
          <div><span className={styles.eyebrow}>UXCODESTUDIO / LAB</span><h2>{es ? "Conoce a" : "Meet"} <span>ORBIT.</span></h2></div>
        </div>
        <span className={styles.edition}>{es ? "COMPAÑERO" : "COMPANION"}<br /><b>NO. 001</b></span>
      </div>
      <div className={styles.stage} data-orbit-stage>
        <div className={styles.aura} aria-hidden="true" />
        <div className={styles.orbitRing} aria-hidden="true"><span /><i /></div>
        <div className={styles.outerRing} aria-hidden="true" />
        <span className={`${styles.annotation} ${styles.annotationLeft}`} aria-hidden="true">{es ? <>DISEÑADO PARA<br />CONECTAR</> : <>DESIGNED<br />TO CONNECT</>}<span>+</span></span>
        <span className={`${styles.annotation} ${styles.annotationRight}`} aria-hidden="true"><span>+</span>{es ? <>UN POCO<br />MÁS HUMANO</> : <>A LITTLE<br />MORE HUMAN</>}</span>
        {(!ready || failed) && (
          <div className={styles.preview}>
            {/* A local render keeps ORBIT visible while loading or without WebGL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/models/orbit-poster.png" alt={es ? "ORBIT, robot de cerámica con ojos luminosos" : "ORBIT, a ceramic robot with glowing eyes"} />
          </div>
        )}
        {!failed && supported && (
          <div className={styles.canvas} style={{ opacity: ready ? 1 : 0 }}>
            <SceneBoundary key={attempt} onError={onError}>
              <HeroScene eyeColor={color} uxOn={powered} greeting={greeting} greetingActive={greetingActive} reducedMotion={reducedMotion} onReady={onReady} onError={onError} />
            </SceneBoundary>
          </div>
        )}
        <button type="button" className={styles.touchTarget} aria-label={es ? "Saludar a ORBIT" : "Say hello to ORBIT"}
          disabled={!ready || !powered || failed}
          onPointerDown={(event) => { startPointer.current = { x: event.clientX, y: event.clientY }; }}
          onPointerCancel={() => { startPointer.current = null; }}
          onClick={(event) => {
            const start = startPointer.current;
            startPointer.current = null;
            if (event.detail === 0 || !start || Math.hypot(event.clientX-start.x, event.clientY-start.y) < 12) sayHello();
          }} />
        <div className={styles.status} role="status"><span />{status}</div>
      </div>
      <div className={styles.controls}>
        <div className={styles.swatches} role="group" aria-label={es ? "Color de iluminación" : "Light color"}>
          {COLORS.map((option) => (
            <button key={option.value} type="button" aria-label={es ? option.es : option.en} aria-pressed={color === option.value}
              onClick={() => setColor(option.value)} disabled={failed}
              style={{ "--swatch": option.value } as CSSProperties}><span /></button>
          ))}
        </div>
        <span className={styles.divider} />
        <button type="button" className={styles.hello} onClick={sayHello} disabled={!powered || !ready || failed}>
          <Hand size={16} strokeWidth={1.6} /><span>{es ? "Saludar" : "Say hello"}</span><ArrowUpRight size={14} />
        </button>
        <span className={styles.divider} />
        <button type="button" className={styles.power} onClick={togglePower} aria-pressed={powered} disabled={!ready || failed}
          aria-label={es ? (powered ? "Poner a ORBIT en reposo" : "Despertar a ORBIT") : (powered ? "Put ORBIT to sleep" : "Wake ORBIT up")}>
          <Power size={18} strokeWidth={1.6} />
        </button>
      </div>
      <p className={styles.hint}>
        {failed ? <button type="button" onClick={retry}><RotateCcw size={13} />{es ? "Reintentar vista 3D" : "Retry 3D view"}</button>
          : <><MousePointer2 size={13} strokeWidth={1.5} /><span>{es ? "Mueve el cursor. Tócame y te saludo." : "Move your cursor. Tap me to say hello."}</span></>}
      </p>
    </div>
  );
}
