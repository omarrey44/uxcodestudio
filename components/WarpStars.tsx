"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NUM_TRACES = 22;
const CYAN = "0, 212, 255";

interface Seg { x1: number; y1: number; x2: number; y2: number; len: number }
interface Trace {
  segs: Seg[];
  totalLen: number;
  delay: number;   // stagger 0–0.35
  width: number;
  opacity: number;
}

function buildTraces(w: number, h: number): Trace[] {
  const out: Trace[] = [];
  for (let i = 0; i < NUM_TRACES; i++) {
    const segs: Seg[] = [];
    let x = w * 0.05 + Math.random() * w * 0.9;
    let y = h * 0.05 + Math.random() * h * 0.9;
    let dir: "h" | "v" = Math.random() < 0.5 ? "h" : "v";
    const numSegs = 2 + Math.floor(Math.random() * 3);
    let totalLen = 0;

    for (let s = 0; s < numSegs; s++) {
      const len = 50 + Math.random() * 160;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const x2 = dir === "h" ? x + sign * len : x;
      const y2 = dir === "v" ? y + sign * len : y;
      segs.push({ x1: x, y1: y, x2, y2, len });
      totalLen += len;
      x = x2; y = y2;
      dir = dir === "h" ? "v" : "h";
    }

    out.push({
      segs,
      totalLen,
      delay: Math.random() * 0.35,
      width: 0.5 + Math.random() * 0.6,
      opacity: 0.25 + Math.random() * 0.35,
    });
  }
  return out;
}

export default function WarpStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const tracesRef = useRef<Trace[]>([]);
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
      tracesRef.current = buildTraces(canvas.width, canvas.height);
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

    const drawSegments = (
      trace: Trace,
      drawnLen: number,
      alpha: number
    ) => {
      let remaining = drawnLen;
      ctx.strokeStyle = `rgba(${CYAN}, ${trace.opacity * alpha})`;
      ctx.lineWidth = trace.width;
      ctx.shadowBlur = 5;
      ctx.shadowColor = `rgba(${CYAN}, ${alpha * 0.7})`;
      ctx.lineCap = "round";

      for (const seg of trace.segs) {
        if (remaining <= 0) break;
        const t = Math.min(remaining / seg.len, 1);
        const x2 = seg.x1 + (seg.x2 - seg.x1) * t;
        const y2 = seg.y1 + (seg.y2 - seg.y1) * t;
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // node dot at joint
        if (t >= 1) {
          ctx.beginPath();
          ctx.arc(seg.x2, seg.y2, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${CYAN}, ${trace.opacity * alpha * 1.4})`;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        remaining -= seg.len;
      }
    };

    const render = () => {
      const p = progressRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (p > 0.01 && p < 0.99) {
        // bell alpha: peaks at center
        const alpha = Math.sin(p * Math.PI);
        // draw progress: 0→1 over first half, stays 1 after
        const drawP = Math.min(p * 2, 1);

        tracesRef.current.forEach((trace) => {
          const localP = Math.max(0, (drawP - trace.delay) / (1 - trace.delay));
          const drawnLen = localP * trace.totalLen;
          if (drawnLen > 0) drawSegments(trace, drawnLen, alpha);
        });

        // reset shadow
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
