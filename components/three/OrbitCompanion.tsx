"use client";

import { Component, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Check, Hand, Heart, Orbit, Power, RotateCcw, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useOrbitPersonality } from "./useOrbitPersonality";
import { SECRET_IDS, type OrbitAction } from "./orbitBehavior";
import styles from "./OrbitCompanion.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const COLORS = [
  { value: "#38dcff", en: "Cyan", es: "Cian" },
  { value: "#a394ff", en: "Violet", es: "Violeta" },
  { value: "#ffbd77", en: "Amber", es: "Ámbar" },
];
const LINES: Record<OrbitAction, { es: string; en: string }> = {
  hello: { es: "¡Eh, qué bueno verte!", en: "Hey, good to see you!" },
  orbit: { es: "Una vuelta. Ya regreso.", en: "A little lap. Be right back." },
  dance: { es: "También tengo mis pasos.", en: "I've got a few moves." },
  wink: { es: "Tú y yo nos entendemos.", en: "You and me. We get it." },
  love: { es: "Mi humano favorito.", en: "My favorite human." },
  spin: { es: "¡Eso me da vueltas!", en: "You make my world spin!" },
  cosmic: { es: "Mi nombre tenía una pista.", en: "The clue was in my name." },
};

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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [supported, setSupported] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const secretsButton = useRef<HTMLButtonElement>(null);
  const secretsId = useId();
  const hintId = useId();
  const enabled = powered && ready && !failed;
  const { performance, discoveries, play, stop, surprise, gestures } = useOrbitPersonality(enabled);
  const closeSecrets = () => { setShowSecrets(false); secretsButton.current?.focus(); };
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setReady(false); }, []);
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

  const sayHello = () => play("hello");
  const togglePower = () => {
    stop();
    setPowered((value) => !value);
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
        : performance ? (es ? "Jugando contigo" : "Playing with you")
          : (es ? "Listo para crear" : "Ready to create");

  return (
    <div className={styles.companion} style={{ "--orbit-accent": color } as CSSProperties} data-powered={powered} data-ready={ready} data-reduced-motion={reducedMotion} data-action={performance?.kind ?? "idle"}
      onKeyDown={(event) => { if (event.key === "Escape") { if (showSecrets) closeSecrets(); stop(); } }}>
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
              <HeroScene eyeColor={color} uxOn={powered} performance={performance} reducedMotion={reducedMotion} onReady={onReady} onError={onError} />
            </SceneBoundary>
          </div>
        )}
        <button type="button" className={styles.touchTarget} aria-label={es ? "Jugar con ORBIT" : "Play with ORBIT"} aria-describedby={hintId}
          disabled={!enabled} {...gestures} />
        <div className={styles.speech} role="status" aria-atomic="true" data-visible={!!performance && enabled}>
          {performance && enabled && <><Sparkles size={13} aria-hidden="true" /><span>{LINES[performance.kind][es ? "es" : "en"]}</span></>}
        </div>
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
      <div className={styles.actions} role="group" aria-label={es ? "Juega con ORBIT" : "Play with ORBIT"}>
        <button type="button" disabled={!enabled} aria-pressed={performance?.kind === "orbit"}
          onClick={() => performance?.kind === "orbit" ? stop() : play("orbit")}>
          <Orbit size={16} aria-hidden="true" /><span>{es ? "Órbita" : "Orbit"}</span>
        </button>
        <button type="button" disabled={!enabled} onClick={surprise}>
          <Sparkles size={15} aria-hidden="true" /><span>{es ? "Sorpréndeme" : "Surprise me"}</span>
        </button>
        <button ref={secretsButton} type="button" className={styles.secretsToggle} aria-expanded={showSecrets} aria-controls={secretsId} onClick={() => setShowSecrets((value) => !value)}>
          <span>{es ? "Secretos" : "Secrets"}</span><b>{discoveries.length}/3</b>
        </button>
      </div>
      <div id={secretsId} className={styles.secrets} hidden={!showSecrets}>
        <div className={styles.secretsHeader}><span>{es ? "UN PEQUEÑO LADO SECRETO" : "A LITTLE SECRET SIDE"}</span>
          <button type="button" onClick={closeSecrets} aria-label={es ? "Cerrar pistas" : "Close hints"}><X size={16} /></button>
        </div>
        {SECRET_IDS.map((id, index) => {
          const found = discoveries.includes(id);
          const names = es ? ["Un poco de cariño", "Vuelta inesperada", "Entre las estrellas"] : ["A little affection", "An unexpected spin", "Among the stars"];
          const clues = es ? ["Mantén pulsado al robot, o enfócalo y pulsa H.", "Tócalo tres veces rápido. También vale Enter.", "Enfoca al robot y escribe su nombre: ORBIT."] : ["Hold the robot, or focus it and press H.", "Tap three times quickly. Enter works too.", "Focus the robot and type its name: ORBIT."];
          return <div key={id} className={styles.secret} data-found={found}>
            <span className={styles.secretIcon} aria-hidden="true">{found ? <Check size={15} /> : index === 0 ? <Heart size={15} /> : index === 1 ? <RotateCcw size={15} /> : <Sparkles size={15} />}</span>
            <div><strong>{names[index]}{found && <span> / {es ? "DESCUBIERTO" : "FOUND"}</span>}</strong><p>{clues[index]}</p></div>
            {found && <button type="button" disabled={!enabled} onClick={() => play(id)} aria-label={`${es ? "Repetir" : "Replay"}: ${names[index]}`}><RotateCcw size={14} /></button>}
          </div>;
        })}
      </div>
      <p className={styles.hint}>
        {failed ? <button type="button" onClick={retry}><RotateCcw size={13} />{es ? "Reintentar vista 3D" : "Retry 3D view"}</button>
          : <span id={hintId}>{es ? "Sigue tu cursor. Tócalo y descubre su personalidad." : "He follows your cursor. Tap to meet his playful side."}</span>}
      </p>
    </div>
  );
}
