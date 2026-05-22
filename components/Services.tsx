"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

const VISUAL = [
  { icon: "◇", glow: "from-accent-blue/40 to-accent-cyan/20",    iconColor: "rgba(79,110,247,0.85)",  iconGlow: "rgba(79,110,247,0.55)",  lineColor: "rgba(79,110,247,0.7)"  },
  { icon: "◆", glow: "from-accent-cyan/40 to-accent-violet/20",  iconColor: "rgba(0,212,255,0.85)",   iconGlow: "rgba(0,212,255,0.5)",    lineColor: "rgba(0,212,255,0.7)"   },
  { icon: "◈", glow: "from-accent-violet/40 to-accent-blue/20",  iconColor: "rgba(139,92,246,0.85)",  iconGlow: "rgba(139,92,246,0.5)",   lineColor: "rgba(139,92,246,0.7)"  },
  { icon: "✦", glow: "from-accent-blue/40 to-accent-violet/30",  iconColor: "rgba(79,110,247,0.85)",  iconGlow: "rgba(79,110,247,0.55)",  lineColor: "rgba(79,110,247,0.7)"  },
  { icon: "✺", glow: "from-accent-cyan/40 to-accent-blue/20",    iconColor: "rgba(0,212,255,0.85)",   iconGlow: "rgba(0,212,255,0.5)",    lineColor: "rgba(0,212,255,0.7)"   },
  { icon: "✸", glow: "from-accent-violet/40 to-accent-cyan/20",  iconColor: "rgba(139,92,246,0.85)",  iconGlow: "rgba(139,92,246,0.5)",   lineColor: "rgba(139,92,246,0.7)"  },
];

export default function Services() {
  const { t } = useLanguage();
  const services = t.services.items.map((item, i) => ({ ...item, ...VISUAL[i] }));
  return (
    <section id="services" className="section-separator relative isolate py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/ServiceSection.png')" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.70)" }} />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{ background: "linear-gradient(to bottom, #050508 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, #080810 0%, transparent 100%)" }}
        />
        <div className="absolute -bottom-28 left-1/3 h-[600px] w-[600px] rounded-full bg-accent-blue/[0.10] blur-[100px]" />
        <div className="absolute -bottom-16 right-1/4 h-[500px] w-[400px] rounded-full bg-accent-cyan/[0.06] blur-3xl" />
      </div>
      <div className="container-x">
        <SectionHeader
          eyebrow={t.services.eyebrow}
          title={<>{t.services.titlePart1} <em className="display-em">{t.services.titleEmphasis}</em>{t.services.titlePart2 ? ` ${t.services.titlePart2}` : ""}</>}
          accent={t.services.accent}
          description={t.services.description}
        />

        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <TiltCard key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

type TiltCardProps = {
  title: string;
  description: string;
  tags: string[];
  learnMore: string;
  icon: string;
  glow: string;
  iconColor: string;
  iconGlow: string;
  lineColor: string;
  index: number;
};

function TiltCard({
  title,
  description,
  icon,
  tags,
  learnMore,
  glow,
  iconColor,
  iconGlow,
  lineColor,
  index,
}: TiltCardProps) {
  return (
    <motion.div
      data-cursor-hover
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
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
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-muted-soft"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-2 text-xs text-muted-dim transition-colors group-hover:text-accent-cyan">
          <span>{learnMore}</span>
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
    <div className="mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-soft"
      >
        <span className="h-1 w-1 rounded-full bg-accent-cyan" />
        {eyebrow}
      </motion.div>

      <motion.h2
        initial={{ clipPath: "inset(100% 0 0% 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 1.0, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-h2 font-bold text-white text-balance"
      >
        {title}{" "}
        {accent && <span className="text-gradient-accent">{accent}</span>}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.9, delay: 0.28, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-balance text-muted-soft md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
