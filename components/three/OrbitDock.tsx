"use client";

import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/i18n";
import type { OrbitPerformance } from "./orbitBehavior";
import styles from "./OrbitDock.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const noop = () => {};

type Props = {
  active: boolean;
  eyeColor: string;
  asleep: boolean;
  performance: OrbitPerformance | null;
  reducedMotion: boolean;
  talking: boolean;
  line: string | null;
  chatOpen: boolean;
  onOpenChat: (opener: HTMLElement) => void;
  onError: () => void;
};

/** Mini ORBIT that floats in a corner once the hero scrolls away. */
export default function OrbitDock({ active, eyeColor, asleep, performance, reducedMotion, talking, line, chatOpen, onOpenChat, onError }: Props) {
  const { lang } = useLanguage();
  const es = lang === "es";
  // Portaled: the hero column is transformed by GSAP, which would trap position: fixed.
  return createPortal(
    <div className={styles.dock} data-active={active} data-asleep={asleep} inert={!active}
      style={{ "--orbit-accent": eyeColor } as CSSProperties}>
      <div className={styles.bubble} role="status" aria-atomic="true" data-visible={!!line && !chatOpen}>{!chatOpen && line}</div>
      <button type="button" className={styles.robot} onClick={(event) => onOpenChat(event.currentTarget)} aria-expanded={chatOpen}
        aria-label={es ? "Hablar con ORBIT" : "Talk to ORBIT"}>
        <span className={styles.glow} aria-hidden="true" />
        <HeroScene variant="dock" paused={!active} eyeColor={eyeColor} uxOn={!asleep} performance={performance}
          reducedMotion={reducedMotion} talking={talking} onReady={noop} onError={onError} />
        {asleep && <span className={styles.zzz} aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span>}
      </button>
    </div>,
    document.body,
  );
}
