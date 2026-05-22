"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NUM_STARS = 200;

interface Star {
  x: number; // offset from center
  y: number;
  speed: number; // px at full warp
  size: number;
  hue: number; // 185–220 = white-cyan range
}

export default function WarpStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warpRef = useRef(0);
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
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const diag = Math.sqrt(cx * cx + cy * cy);
      starsRef.current = Array.from({ length: NUM_STARS }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * diag * 0.9;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          speed: 120 + Math.random() * 280,
          size: 0.6 + Math.random() * 1.4,
          hue: 185 + Math.random() * 35,
        };
      });
    };

    init();
    window.addEventListener("resize", init);

    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "bottom 85%",
      endTrigger: "#services",
      end: "top 15%",
      scrub: 0.8,
      onUpdate: (self) => {
        // bell curve: 0 at both ends, 1 at center
        warpRef.current = Math.sin(self.progress * Math.PI);
      },
    });

    const render = () => {
      const warp = warpRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      if (warp > 0.01) {
        starsRef.current.forEach((star) => {
          const sx = cx + star.x;
          const sy = cy + star.y;

          const len = Math.sqrt(star.x * star.x + star.y * star.y) || 1;
          const nx = star.x / len;
          const ny = star.y / len;

          const tailX = sx - nx * star.size * 2;
          const tailY = sy - ny * star.size * 2;
          const headX = sx + nx * warp * star.speed;
          const headY = sy + ny * warp * star.speed;

          const alpha = (0.35 + warp * 0.65) * warp;
          const lineW = star.size * (0.4 + warp * 2.8);

          const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grad.addColorStop(0, `hsla(${star.hue},90%,95%,0)`);
          grad.addColorStop(0.6, `hsla(${star.hue},90%,95%,${alpha * 0.5})`);
          grad.addColorStop(1, `hsla(${star.hue},90%,98%,${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = lineW;
          ctx.lineCap = "round";
          ctx.stroke();
        });
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
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 25,
      }}
    />
  );
}
