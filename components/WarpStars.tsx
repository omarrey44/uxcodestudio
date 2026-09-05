"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPreference } from "@/lib/useMotionPreference";

const COUNT = 80;

interface Star {
  x: number;
  initialY: number;
  speed: number;
  size: number;
  twinklePhase: number;
  isStatic: boolean;
}

function buildStars(): Star[] {
  return Array.from({ length: COUNT }, () => {
    const isStatic = Math.random() < 0.3;
    return {
      x: Math.random(),
      initialY: Math.random(),
      speed: isStatic ? 0 : 0.2 + Math.random() * 0.6,
      size: isStatic ? 1 + Math.random() * 0.5 : 1 + Math.random() * 2,
      twinklePhase: Math.random() * Math.PI * 2,
      isStatic,
    };
  });
}

export default function WarpStars() {
  const reduced = useMotionPreference();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const rafActiveRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gsap.registerPlugin(ScrollTrigger);

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = buildStars();
    };
    init();
    window.addEventListener("resize", init);

    const render = (time: number) => {
      const p = progressRef.current;

      if (p > 0.01 && p < 0.99) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const alpha = Math.sin(p * Math.PI);
        const w = canvas.width;
        const h = canvas.height;

        const delta = Math.abs(p - prevProgressRef.current);
        prevProgressRef.current = p;
        const stretch = Math.max(1, Math.min(1 + delta * 900, 4));
        const fakeScroll = p * h * 8;

        starsRef.current.forEach((star) => {
          const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0008 + star.twinklePhase);

          if (star.isStatic) {
            ctx.globalAlpha = alpha * twinkle * 0.7;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(star.x * w, star.initialY * h, star.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            let pos = (star.initialY - (fakeScroll * star.speed * 0.05) / h) % 1;
            if (pos < 0) pos += 1;

            ctx.globalAlpha = alpha * (0.7 + twinkle * 0.3);
            ctx.save();
            ctx.translate(star.x * w, pos * h);
            ctx.scale(1, stretch);
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, star.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        ctx.globalAlpha = 1;
        rafRef.current = requestAnimationFrame(render);
      } else {
        // Animation done — clear canvas once, stop RAF
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafActiveRef.current = false;
      }
    };

    const startRaf = () => {
      if (!rafActiveRef.current) {
        rafActiveRef.current = true;
        rafRef.current = requestAnimationFrame(render);
      }
    };

    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "bottom 88%",
      endTrigger: "#services",
      end: "top 12%",
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        // Wake up RAF only when entering active range
        if (self.progress > 0.01 && self.progress < 0.99) startRaf();
      },
    });

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(rafRef.current);
      rafActiveRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      st.kill();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 25 }}
    />
  );
}
