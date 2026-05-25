"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./Services";
import AnimatedCounter from "./AnimatedCounter";
import { useLanguage } from "@/lib/i18n";

export default function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="section-alt section-separator relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/[0.13] blur-[120px]" />
        <div className="absolute -right-24 top-1/4 h-[450px] w-[450px] rounded-full bg-accent-violet/[0.09] blur-[100px]" />
        <div className="absolute -left-16 bottom-1/4 h-[350px] w-[400px] rounded-full bg-accent-blue/[0.08] blur-3xl" />
      </div>

      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.why.eyebrow}
          title={<>{t.why.titlePart1} <em className="display-em">{t.why.titleEmphasis}</em>{t.why.titlePart2 ? ` ${t.why.titlePart2}` : ""}</>}
          accent={t.why.accent}
        />

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {t.why.stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto mt-24 max-w-5xl overflow-hidden rounded-3xl glass-strong p-10 md:p-14"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-violet/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-cyan/20 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
                {t.why.teamHeadline}{" "}
                <span className="text-gradient-accent">{t.why.teamHeadlineAccent}</span>{" "}
                {t.why.teamPartners}
              </div>
              <p className="mt-4 text-muted-soft">{t.why.teamDesc}</p>
            </div>

            <ul className="grid grid-cols-1 gap-3 text-sm text-muted">
              {t.why.features.map((f) => (
                <li key={f} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-[10px] text-black">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, sub, index }: { value: number; suffix: string; label: string; sub: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-violet/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <div className="font-display text-4xl font-bold leading-none md:text-5xl">
          <AnimatedCounter value={value} suffix={suffix} className="text-gradient" />
        </div>
        <div className="mt-3 text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-muted-dim">{sub}</div>
      </div>
    </motion.div>
  );
}
