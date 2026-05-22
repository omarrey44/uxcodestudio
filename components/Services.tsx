"use client";

import { useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SERVICES = [
  {
    title: "Marketing Websites",
    description: "Cinematic, brand-defining sites engineered to convert and rank.",
    icon: "◇",
    tags: ["Design", "Webflow", "Next.js"],
    glow: "from-accent-blue/40 to-accent-cyan/20",
    iconColor: "rgba(79,110,247,0.85)",
    iconGlow: "rgba(79,110,247,0.55)",
    lineColor: "rgba(79,110,247,0.7)",
  },
  {
    title: "Landing Pages",
    description: "High-velocity launch pages optimized for paid traffic and growth loops.",
    icon: "◆",
    tags: ["CRO", "A/B Tests", "Analytics"],
    glow: "from-accent-cyan/40 to-accent-violet/20",
    iconColor: "rgba(0,212,255,0.85)",
    iconGlow: "rgba(0,212,255,0.5)",
    lineColor: "rgba(0,212,255,0.7)",
  },
  {
    title: "Web Applications",
    description: "Production-grade interfaces, design systems and full-stack engineering.",
    icon: "◈",
    tags: ["React", "TS", "Node"],
    glow: "from-accent-violet/40 to-accent-blue/20",
    iconColor: "rgba(139,92,246,0.85)",
    iconGlow: "rgba(139,92,246,0.5)",
    lineColor: "rgba(139,92,246,0.7)",
  },
  {
    title: "SaaS Platforms",
    description: "End-to-end product studios: from 0→1 architecture to billing flows.",
    icon: "✦",
    tags: ["Stripe", "Auth", "AI"],
    glow: "from-accent-blue/40 to-accent-violet/30",
    iconColor: "rgba(79,110,247,0.85)",
    iconGlow: "rgba(79,110,247,0.55)",
    lineColor: "rgba(79,110,247,0.7)",
  },
  {
    title: "Brand & Identity",
    description: "Visual systems, motion principles and verbal identity for tech-first brands.",
    icon: "✺",
    tags: ["Logo", "Motion", "Tone"],
    glow: "from-accent-cyan/40 to-accent-blue/20",
    iconColor: "rgba(0,212,255,0.85)",
    iconGlow: "rgba(0,212,255,0.5)",
    lineColor: "rgba(0,212,255,0.7)",
  },
  {
    title: "Motion & 3D",
    description: "WebGL, GSAP and Three.js choreography for unforgettable interactions.",
    icon: "✸",
    tags: ["GSAP", "Three.js", "Shader"],
    glow: "from-accent-violet/40 to-accent-cyan/20",
    iconColor: "rgba(139,92,246,0.85)",
    iconGlow: "rgba(139,92,246,0.5)",
    lineColor: "rgba(139,92,246,0.7)",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-alt section-separator relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-28 left-1/3 h-[600px] w-[600px] rounded-full bg-accent-blue/[0.12] blur-[100px]" />
        <div className="absolute -bottom-16 right-1/4 h-[500px] w-[400px] rounded-full bg-accent-cyan/[0.07] blur-3xl" />
      </div>
      <div className="container-x">
        <SectionHeader
          eyebrow="Services"
          title={<>Engineered <em className="display-em">for</em> momentum,</>}
          accent="designed for awe."
          description="One studio. Six disciplines. A workflow optimized to ship measurable wins fast — without sacrificing craft."
        />

        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <TiltCard key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({
  title,
  description,
  icon,
  tags,
  glow,
  iconColor,
  iconGlow,
  lineColor,
  index,
}: (typeof SERVICES)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [8, -8]);
  const rotateX = useTransform(sy, [0, 1], [-8, 8]);
  const glowX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(sy, [0, 1], ["0%", "100%"]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      data-cursor-hover
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 transition-colors hover:border-white/20"
    >
      {/* Top accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${lineColor}, transparent)` }}
      />
      {/* Always-on subtle top line */}
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${lineColor}55, transparent)` }}
      />

      <motion.div
        style={{
          background: `radial-gradient(400px circle at ${glowX.get()} ${glowY.get()}, rgba(79,110,247,0.18), transparent 70%)`,
        }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${glow} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70`}
      />

      <div className="relative">
        {/* 3D glass icon */}
        <div
          className="relative mb-7 inline-grid h-16 w-16 overflow-hidden rounded-2xl place-items-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${iconColor}, rgba(5,5,8,0.95))`,
            boxShadow: `0 8px 28px -6px ${iconGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
          }}
        >
          {/* glass shine */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-2/5 rounded-t-2xl bg-gradient-to-b from-white/30 to-transparent" />
          <span className="relative text-2xl text-white">{icon}</span>
        </div>
        <h3 className="font-display text-2xl font-semibold text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-soft">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-muted-soft"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-2 text-xs text-muted-dim transition-colors group-hover:text-accent-cyan">
          <span>Learn more</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-soft">
        <span className="h-1 w-1 rounded-full bg-accent-cyan" />
        {eyebrow}
      </div>
      <h2 className="font-display text-h2 font-bold text-white text-balance">
        {title}{" "}
        {accent && <span className="text-gradient-accent">{accent}</span>}
      </h2>
      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-balance text-muted-soft md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
