"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./Services";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/lib/i18n";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="section-alt section-separator relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-violet/[0.14] blur-[130px]" />
        <div className="absolute -left-24 top-1/3 h-[450px] w-[450px] rounded-full bg-accent-blue/[0.1] blur-[100px]" />
        <div className="absolute -right-16 bottom-1/3 h-[400px] w-[400px] rounded-full bg-accent-cyan/[0.07] blur-3xl" />
      </div>

      <div className="container-x">
        <SectionHeader
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.title}
          accent={t.pricing.accent}
          description={t.pricing.description}
        />

        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {t.pricing.plans.map((p, i) => (
            <motion.div
              key={p.name}
              data-cursor-hover
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-3xl p-8 transition-transform duration-500 ${
                p.highlight ? "scale-[1.02] glass-strong glow-blue lg:scale-105" : "border border-white/10 bg-white/[0.02]"
              }`}
            >
              {p.highlight && (
                <>
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet opacity-40 blur-2xl" />
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent-blue/60 via-accent-cyan/40 to-accent-violet/60 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" />
                  <div className="absolute right-6 top-6">
                    <span className="rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-black">
                      {t.pricing.badge}
                    </span>
                  </div>
                </>
              )}

              <div className="relative">
                <div className="font-display text-lg font-semibold text-white">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-white">{p.price}</span>
                  <span className="text-sm text-muted-soft">{p.cadence}</span>
                </div>
                <p className="mt-4 text-sm text-muted-soft">{p.description}</p>

                <ul className="mt-7 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-muted">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-[10px] text-black">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <MagneticButton href="#contact" variant={p.highlight ? "primary" : "secondary"} className="w-full">
                    {p.cta} <span aria-hidden>→</span>
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
