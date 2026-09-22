"use client";

import { Component, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Check, Hand, Heart, MessageCircle, RotateCcw, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ORBIT_CUE, type OrbitCue } from "@/lib/orbitCue";
import { useOrbitPersonality } from "./useOrbitPersonality";
import { SECRET_IDS, type OrbitAction, type OrbitLine } from "./orbitBehavior";
import OrbitDock from "./OrbitDock";
import OrbitChat from "./OrbitChat";
import styles from "./OrbitCompanion.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const SLEEP_AFTER_MS = 30_000;
const COLORS = [
  { value: "#38dcff", en: "Cyan", es: "Cian" },
  { value: "#a394ff", en: "Violet", es: "Violeta" },
  { value: "#ffbd77", en: "Amber", es: "Ámbar" },
];
export const LINES: Record<OrbitAction, OrbitLine> = {
  hello: { es: "¡Eh, qué bueno verte!", en: "Hey, good to see you!" },
  orbit: { es: "Una vuelta. Ya regreso.", en: "A little lap. Be right back." },
  dance: { es: "También tengo mis pasos.", en: "I've got a few moves." },
  wink: { es: "Tú y yo nos entendemos.", en: "You and me. We get it." },
  love: { es: "Mi humano favorito.", en: "My favorite human." },
  spin: { es: "¡Eso me da vueltas!", en: "You make my world spin!" },
  cosmic: { es: "Mi nombre tenía una pista.", en: "The clue was in my name." },
  sad: { es: "Uy… algo salió mal.", en: "Oops… something went wrong." },
  startle: { es: "¡Ah! Soñaba con píxeles.", en: "Whoa! I was dreaming in pixels." },
};
// First visit to each section while ORBIT floats along with the visitor.
const SECTION_CUES: Record<string, OrbitCue> = {
  services: { kind: "hello", line: { es: "Estos son mis favoritos. Toca uno para ver más.", en: "These are my favorites. Tap one to see more." } },
  process: { kind: "wink", line: { es: "Cinco pasos. Cero sorpresas.", en: "Five steps. Zero surprises." } },
  pricing: { kind: "dance", line: { es: "Precios claros desde el principio.", en: "Clear prices from the start." } },
  faq: { kind: "wink", line: { es: "¿Otra duda? También puedes preguntarme a mí.", en: "Another question? You can ask me too." } },
  contact: { kind: "hello", line: { es: "¡Mi parte favorita! Cuéntanos tu idea.", en: "My favorite part! Tell us your idea." } },
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
  const [asleep, setAsleep] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [supported, setSupported] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [dockMounted, setDockMounted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [talking, setTalking] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const secretsButton = useRef<HTMLButtonElement>(null);
  const chatOpener = useRef<HTMLElement | null>(null);
  const wasAsleep = useRef(false);
  const seenSections = useRef(new Set<string>());
  const lastHoverCue = useRef(0);
  const secretsId = useId();
  const hintId = useId();
  const enabled = ready && !failed && !asleep;
  const docked = !heroVisible && ready && !failed;
  const { performance, discoveries, play, stop, gestures } = useOrbitPersonality(enabled);
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

  // Hero leaves the viewport: ORBIT keeps the visitor company from a corner.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (docked) setDockMounted(true); }, [docked]);

  // Falls asleep after 30 s without activity; any activity wakes him with a start.
  useEffect(() => {
    if (!ready || failed || chatOpen) { setAsleep(false); return; }
    let timer = setTimeout(() => setAsleep(true), SLEEP_AFTER_MS);
    const activity = () => {
      setAsleep(false);
      clearTimeout(timer);
      timer = setTimeout(() => setAsleep(true), SLEEP_AFTER_MS);
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((name) => window.addEventListener(name, activity, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, activity));
    };
  }, [ready, failed, chatOpen]);
  useEffect(() => {
    if (wasAsleep.current && !asleep) play("startle");
    wasAsleep.current = asleep;
  }, [asleep, play]);

  // Cues from other sections (contact form result) always get a reaction.
  useEffect(() => {
    const cue = (event: Event) => { const { kind, line } = (event as CustomEvent<OrbitCue>).detail; play(kind, line); };
    window.addEventListener(ORBIT_CUE, cue);
    return () => window.removeEventListener(ORBIT_CUE, cue);
  }, [play]);

  // While docked: greet each section once, and react to what the visitor explores.
  useEffect(() => {
    if (!docked || !enabled) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (!entry.isIntersecting || seenSections.current.has(id)) return;
        seenSections.current.add(id);
        play(SECTION_CUES[id].kind, SECTION_CUES[id].line);
      });
    }, { rootMargin: "-45% 0px -45% 0px" }); // a section counts once it crosses mid-screen, however tall it is
    Object.keys(SECTION_CUES).forEach((id) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    const hover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || window.performance.now() - lastHoverCue.current < 8000) return;
      const target = event.target as Element | null;
      const featured = target?.closest?.(".studio-price-card.is-featured");
      const service = target?.closest?.(".studio-service-card");
      if (!featured && !service) return;
      lastHoverCue.current = window.performance.now();
      if (featured) play("dance", { es: "¡Ese es el favorito de todos!", en: "That's everyone's favorite!" });
      else {
        const title = service?.querySelector("h3")?.textContent?.trim();
        play("wink", title ? { es: `Buena elección: ${title}.`, en: `Good pick: ${title}.` } : undefined);
      }
    };
    document.addEventListener("pointerover", hover, { passive: true });
    return () => { observer.disconnect(); document.removeEventListener("pointerover", hover); };
  }, [docked, enabled, play]);

  const openChat = (opener: HTMLElement | null) => {
    chatOpener.current = opener;
    setShowSecrets(false);
    setChatOpen(true);
  };
  const closeChat = useCallback(() => {
    setChatOpen(false);
    setTalking(false);
    chatOpener.current?.focus();
  }, []);
  const askForMotion = () => {
    // iOS only exposes device tilt after a user gesture grants permission.
    const orientation = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
    orientation?.requestPermission?.().catch(() => {});
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
  const line = performance ? (performance.line ?? LINES[performance.kind])[es ? "es" : "en"] : null;
  const status = failed ? (es ? "Vista previa" : "Preview")
    : !ready ? (es ? "Despertando" : "Waking up")
      : asleep ? (es ? "Durmiendo… mueve el cursor" : "Sleeping… move your cursor")
        : talking ? (es ? "Hablando contigo" : "Talking with you")
          : performance ? (es ? "Jugando contigo" : "Playing with you")
            : (es ? "Listo para crear" : "Ready to create");
  const tapHint = es ? "Tócalo: saluda, vuela, baila y guiña." : "Tap him: he waves, flies, dances and winks.";

  return (
    <div ref={root} className={styles.companion} style={{ "--orbit-accent": color } as CSSProperties} data-asleep={asleep} data-ready={ready} data-reduced-motion={reducedMotion} data-action={performance?.kind ?? "idle"}
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
              <HeroScene eyeColor={color} uxOn={!asleep} performance={performance} reducedMotion={reducedMotion} talking={talking && !docked} onReady={onReady} onError={onError} />
            </SceneBoundary>
          </div>
        )}
        <button type="button" className={styles.touchTarget} aria-label={es ? "Jugar con ORBIT" : "Play with ORBIT"} aria-describedby={hintId}
          disabled={!enabled} {...gestures} onClick={(event) => { askForMotion(); gestures.onClick(event); }} />
        {asleep && <div className={styles.zzz} aria-hidden="true"><span>z</span><span>z</span><span>Z</span></div>}
        <div className={styles.speech} role="status" aria-atomic="true" data-visible={!!line && enabled && !docked}>
          {line && enabled && !docked && <><Sparkles size={13} aria-hidden="true" /><span>{line}</span></>}
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
        <button type="button" className={styles.ask} onClick={(event) => openChat(event.currentTarget)} aria-expanded={chatOpen}>
          <MessageCircle size={16} strokeWidth={1.6} /><span>{es ? "Pregúntale a ORBIT" : "Ask ORBIT"}</span><ArrowUpRight size={14} />
        </button>
        <span className={styles.divider} />
        <button ref={secretsButton} type="button" className={styles.secretsToggle} aria-expanded={showSecrets} aria-controls={secretsId}
          aria-label={`${es ? "Secretos" : "Secrets"}: ${discoveries.length}/3`} onClick={() => setShowSecrets((value) => !value)}>
          <span aria-hidden="true">?</span><b aria-hidden="true">{discoveries.length}/3</b>
        </button>
      </div>
      <div id={secretsId} className={styles.secrets} hidden={!showSecrets}>
        <div className={styles.secretsHeader}><span>{es ? "UN PEQUEÑO LADO SECRETO" : "A LITTLE SECRET SIDE"}</span>
          <button type="button" onClick={closeSecrets} aria-label={es ? "Cerrar pistas" : "Close hints"}><X size={16} /></button>
        </div>
        <div className={styles.secret} data-found="true">
          <span className={styles.secretIcon} aria-hidden="true"><Hand size={15} /></span>
          <div><strong>{es ? "Para empezar" : "To begin"}</strong><p>{tapHint}</p></div>
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
      {dockMounted && supported && !failed && (
        <OrbitDock active={docked} eyeColor={color} asleep={asleep} performance={performance} reducedMotion={reducedMotion}
          talking={talking && docked} line={docked && enabled ? line : null} chatOpen={chatOpen} onOpenChat={openChat} onError={onError} />
      )}
      {chatOpen && <OrbitChat accent={color} onClose={closeChat} onTalking={setTalking} onReact={(kind) => play(kind)} />}
    </div>
  );
}
