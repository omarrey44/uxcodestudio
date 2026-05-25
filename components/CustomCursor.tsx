"use client";

import { useEffect, useRef } from "react";

const TRAIL_COUNT = 4;
const TRAIL_DELAY_MS = 18;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    // Desktop only
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId: number;
    const LERP = 0.14;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const showCursor = () => {
      cursor.style.opacity = "1";
      trailRefs.current.forEach((t) => { if (t) t.style.opacity = "1"; });
    };

    const hideCursor = () => {
      cursor.style.opacity = "0";
      trailRefs.current.forEach((t) => { if (t) t.style.opacity = "0"; });
    };

    const bindZones = () => {
      document.querySelectorAll("[data-custom-cursor-zone]").forEach((zone) => {
        zone.addEventListener("mouseenter", showCursor);
        zone.addEventListener("mouseleave", hideCursor);
      });
    };

    bindZones();
    const zoneObserver = new MutationObserver(bindZones);
    zoneObserver.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      const { x, y } = pos.current;

      // Main cursor — use transform to avoid layout thrash
      const cx = cursorPos.current.x;
      const cy = cursorPos.current.y;
      const nx = lerp(cx, x, LERP);
      const ny = lerp(cy, y, LERP);
      cursorPos.current = { x: nx, y: ny };
      cursor.style.transform = `translate(${nx}px, ${ny}px)`;

      // Trail dots
      trailPositions.current.forEach((tp, i) => {
        const prev = i === 0 ? { x: nx, y: ny } : trailPositions.current[i - 1];
        tp.x = lerp(tp.x, prev.x, LERP * (1 - i * 0.15));
        tp.y = lerp(tp.y, prev.y, LERP * (1 - i * 0.15));
        const el = trailRefs.current[i];
        if (el) el.style.transform = `translate(${tp.x}px, ${tp.y}px)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnterHoverable = () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.marginLeft = "-20px";
      cursor.style.marginTop = "-20px";
      cursor.style.mixBlendMode = "difference";
      cursor.style.backgroundColor = "white";
      cursor.style.borderColor = "transparent";
    };

    const onMouseLeaveHoverable = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      cursor.style.marginLeft = "-6px";
      cursor.style.marginTop = "-6px";
      cursor.style.mixBlendMode = "normal";
      cursor.style.backgroundColor = "transparent";
      cursor.style.borderColor = "#4f6ef7";
    };

    const bindHoverables = () => {
      document.querySelectorAll("[data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterHoverable);
        el.addEventListener("mouseleave", onMouseLeaveHoverable);
      });
    };

    bindHoverables();
    const observer = new MutationObserver(bindHoverables);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      zoneObserver.disconnect();
      document.querySelectorAll("[data-cursor-hover]").forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterHoverable);
        el.removeEventListener("mouseleave", onMouseLeaveHoverable);
      });
      document.querySelectorAll("[data-custom-cursor-zone]").forEach((zone) => {
        zone.removeEventListener("mouseenter", showCursor);
        zone.removeEventListener("mouseleave", hideCursor);
      });
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "12px",
          height: "12px",
          marginLeft: "-6px",
          marginTop: "-6px",
          borderRadius: "50%",
          border: "1.5px solid #4f6ef7",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition: "width 0.2s, height 0.2s, margin 0.2s, background-color 0.2s, mix-blend-mode 0s",
          willChange: "transform",
        }}
      />
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el as HTMLDivElement; }}
          aria-hidden
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: `${6 - i}px`,
            height: `${6 - i}px`,
            marginLeft: `-${(6 - i) / 2}px`,
            marginTop: `-${(6 - i) / 2}px`,
            borderRadius: "50%",
            backgroundColor: "#4f6ef7",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 9998,
            willChange: "transform",
            transition: `opacity 0.3s ${i * TRAIL_DELAY_MS}ms`,
          }}
        />
      ))}
    </>
  );
}
