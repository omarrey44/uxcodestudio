"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
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

    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "bottom 88%",
      endTrigger: "#services",
      end: "top 12%",
      scrub: 1,
      onUpdate: (self) => { progressRef.current = self.progress; },
    });

    const render = (time: number) => {
      const p = progressRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (p > 0.01 && p < 0.99) {
        const alpha = Math.sin(p * Math.PI);
        const w = canvas.width;
        const h = canvas.height;

        // Derive velocity from progress delta between frames
        const delta = Math.abs(p - prevProgressRef.current);
        prevProgressRef.current = p;
        const stretch = Math.max(1, Math.min(1 + delta * 900, 4));

        // Approximate scroll position from progress (for star parallax)
        const fakeScroll = p * h * 8;

        starsRef.current.forEach((star) => {
          const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0008 + star.twinklePhase);

          if (star.isStatic) {
            const posY = star.initialY * h;
            ctx.globalAlpha = alpha * twinkle * 0.7;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(star.x * w, posY, star.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            let pos = (star.initialY - (fakeScroll * star.speed * 0.05) / h) % 1;
            if (pos < 0) pos += 1;
            const posY = pos * h;

            ctx.globalAlpha = alpha * (0.7 + twinkle * 0.3);
            ctx.save();
            ctx.translate(star.x * w, posY);
            ctx.scale(1, stretch);
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = stretch > 1.5 ? 6 : 0;
            ctx.shadowColor = "rgba(255,255,255,0.8)";
            ctx.beginPath();
            ctx.arc(0, 0, star.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(rafRef.current);
      st.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 25 }}
    />
  );
}
