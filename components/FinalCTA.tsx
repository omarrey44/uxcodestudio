"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/lib/i18n";

export default function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="section-deep relative overflow-hidden py-40 md:py-56">
      <div className="absolute inset-0 -z-10">
        <div className="aurora-layer opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] glass-strong p-12 text-center md:p-16"
        >
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue/50 via-accent-cyan/30 to-accent-violet/50 opacity-60 blur-2xl" />
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px opacity-60" />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-muted">
              <span className="h-1 w-1 rounded-full bg-accent-cyan" /> {t.cta.badge}
            </div>

            <h2 className="font-display text-4xl font-bold leading-[1.05] text-balance text-white md:text-7xl">
              {t.cta.headlinePart1}
              <br />
              <span style={{ background: "linear-gradient(90deg, #ffffff 0%, #a5f3fc 55%, #ddd6fe 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{t.cta.headlinePart2}</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-balance text-muted md:text-lg">
              {t.cta.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="mailto:hello@uxcodestudio.com" variant="primary">
                {t.cta.cta1} <span aria-hidden>→</span>
              </MagneticButton>
              <MagneticButton href="#work" variant="secondary">
                {t.cta.cta2}
              </MagneticButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-dim">
              {t.cta.features.map((f) => <span key={f}>✦ {f}</span>)}
            </div>

            {/* Divider */}
            <div className="my-10 h-px w-full bg-white/10" />

            {/* Contact methods — integrated */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {t.cta.contactMethods.map((m, i) => (
                <motion.a
                  key={m.label}
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3 }}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-base text-accent-cyan transition-colors group-hover:border-accent-cyan/40 group-hover:bg-accent-cyan/10">
                    {m.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-dim">{m.label}</div>
                    <div className="mt-0.5 truncate text-sm font-medium text-white">{m.value}</div>
                    <div className="text-[10px] text-muted-dim">{m.hint}</div>
                  </div>
                  <span className="shrink-0 text-muted-dim transition-transform group-hover:translate-x-1 group-hover:text-accent-cyan">→</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
