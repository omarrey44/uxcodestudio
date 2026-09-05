"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { ACTION_DURATION, SECRET_IDS, type OrbitAction, type OrbitPerformance, type OrbitSecret } from "./orbitBehavior";

const MEMORY_KEY = "uxcode-orbit-secrets-v1";

export function useOrbitPersonality(enabled: boolean) {
  const [performance, setPerformance] = useState<OrbitPerformance | null>(null);
  const [discoveries, setDiscoveries] = useState<OrbitSecret[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointer = useRef<{ x: number; y: number; cancelled: boolean; held: boolean } | null>(null);
  const taps = useRef<number[]>([]);
  const sequence = useRef({ text: "", at: 0 });
  const surpriseIndex = useRef(0);
  const serial = useRef(0);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }, []);
  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    cancelHold();
    pointer.current = null;
    taps.current = [];
    sequence.current = { text: "", at: 0 };
    setPerformance(null);
  }, [cancelHold]);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(MEMORY_KEY) || "[]");
      if (Array.isArray(saved)) setDiscoveries(SECRET_IDS.filter((id) => saved.includes(id)));
    } catch { /* Storage is optional, including in private browsers. */ }
    return () => {
      if (timer.current) clearTimeout(timer.current);
      cancelHold();
    };
  }, [cancelHold]);
  useEffect(() => { if (!enabled) stop(); }, [enabled, stop]);
  useEffect(() => {
    const blur = () => { cancelHold(); if (pointer.current) pointer.current.cancelled = true; };
    window.addEventListener("blur", blur);
    return () => window.removeEventListener("blur", blur);
  }, [cancelHold]);

  const play = useCallback((kind: OrbitAction) => {
    if (!enabled) return;
    if (timer.current) clearTimeout(timer.current);
    setPerformance({ kind, id: ++serial.current, startedAt: window.performance.now() });
    timer.current = setTimeout(() => setPerformance(null), ACTION_DURATION[kind] * 1000);
    if (SECRET_IDS.includes(kind as OrbitSecret)) {
      setDiscoveries((current) => current.includes(kind as OrbitSecret) ? current : [...current, kind as OrbitSecret]);
    }
  }, [enabled]);
  useEffect(() => {
    if (!discoveries.length) return;
    try { localStorage.setItem(MEMORY_KEY, JSON.stringify(discoveries)); } catch { /* Optional memory. */ }
  }, [discoveries]);

  const cancelPointer = () => {
    cancelHold();
    if (pointer.current) pointer.current.cancelled = true;
  };
  return {
    performance, discoveries, play, stop,
    surprise: () => { play(surpriseIndex.current++ % 2 === 0 ? "dance" : "wink"); },
    gestures: {
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        if (!enabled || !event.isPrimary || event.button !== 0) return;
        cancelHold();
        pointer.current = { x: event.clientX, y: event.clientY, cancelled: false, held: false };
        event.currentTarget.setPointerCapture(event.pointerId);
        holdTimer.current = setTimeout(() => {
          if (!pointer.current || pointer.current.cancelled) return;
          pointer.current.held = true;
          taps.current = [];
          play("love");
        }, 700);
      },
      onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
        const start = pointer.current;
        if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) cancelPointer();
      },
      onPointerUp: cancelHold,
      onPointerCancel: cancelPointer,
      onLostPointerCapture: cancelHold,
      onContextMenu: (event: MouseEvent<HTMLButtonElement>) => event.preventDefault(),
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        const start = pointer.current;
        pointer.current = null;
        cancelHold();
        if (event.detail !== 0 && start && (start.cancelled || start.held || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12)) return;
        const now = window.performance.now();
        taps.current = [...taps.current.filter((at) => now - at < 900), now];
        if (taps.current.length >= 3) { taps.current = []; play("spin"); }
        else play("hello");
      },
      onBlur: () => { cancelPointer(); sequence.current = { text: "", at: 0 }; taps.current = []; },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
        const key = event.key.toLowerCase();
        if (key === "escape") { stop(); return; }
        if (key === "h") { play("love"); return; }
        if (!/^[a-z]$/.test(key)) return;
        const now = window.performance.now();
        sequence.current.text = (now - sequence.current.at > 1500 ? "" : sequence.current.text) + key;
        sequence.current.text = sequence.current.text.slice(-5);
        sequence.current.at = now;
        if (sequence.current.text === "orbit") { play("cosmic"); sequence.current.text = ""; }
      },
    },
  };
}
