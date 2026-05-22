"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScanlineReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      if (sessionStorage.getItem("scan-done") === "1") return;
    } catch {}

    const ticks: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ticks.length = 0;
      let x = 24;
      while (x < canvas.width - 24) {
        ticks.push(x);
        x += 44 + Math.floor(Math.random() * 36);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const services = document.getElementById("services");
    if (!services) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || firedRef.current) return;
        firedRef.current = true;
        obs.disconnect();
        try { sessionStorage.setItem("scan-done", "1"); } catch {}

        const startY = services.getBoundingClientRect().top;
        const proxy = { y: startY };
        const w = canvas.width;
        const endY = startY + window.innerHeight * 0.9;

        gsap.to(proxy, {
          y: endY,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate() {
            const y = proxy.y;
            ctx.clearRect(0, 0, w, canvas.height);

            // Trailing aura above scanline
            const aura = ctx.createLinearGradient(0, y - 110, 0, y + 24);
            aura.addColorStop(0,   "rgba(0,212,255,0)");
            aura.addColorStop(0.6, "rgba(0,212,255,0.07)");
            aura.addColorStop(1,   "rgba(0,212,255,0.28)");
            ctx.fillStyle = aura;
            ctx.fillRect(0, y - 110, w, 134);

            // Core line
            ctx.save();
            ctx.shadowBlur = 22;
            ctx.shadowColor = "#00d4ff";
            ctx.strokeStyle = "rgba(210,248,255,0.96)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
            ctx.restore();

            // Circuit tick marks
            ctx.fillStyle = "rgba(0,212,255,0.5)";
            for (const tx of ticks) {
              ctx.fillRect(tx, y - 5, 1.5, 10);
            }

            // Leading edge glow below line
            const edge = ctx.createLinearGradient(0, y, 0, y + 18);
            edge.addColorStop(0, "rgba(0,212,255,0.18)");
            edge.addColorStop(1, "rgba(0,212,255,0)");
            ctx.fillStyle = edge;
            ctx.fillRect(0, y, w, 18);
          },
          onComplete() {
            gsap.to(canvas, { opacity: 0, duration: 0.55, ease: "power2.out" });
          },
        });
      },
      { threshold: 0.02 }
    );

    obs.observe(services);

    return () => {
      window.removeEventListener("resize", resize);
      obs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 28 }}
    />
  );
}
