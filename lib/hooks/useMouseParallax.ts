"use client";
import { useEffect, useRef } from "react";

const LERP = 0.08;

export function useMouseParallax() {
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const raw = { x: 0, y: 0 };
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      raw.x = (e.clientX / window.innerWidth) * 2 - 1;
      raw.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      smooth.current.x += (raw.x - smooth.current.x) * LERP;
      smooth.current.y += (raw.y - smooth.current.y) * LERP;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return smooth;
}
