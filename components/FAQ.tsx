"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "./Services";
import { useLanguage } from "@/lib/i18n";

export default function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 md:py-28" style={{ background: "#0d0d0f" }}>
      {/* top accent border */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #3b82f6 30%, #8b5cf6 70%, transparent 100%)" }} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-accent-violet/[0.07] blur-[80px]" />
      </div>
      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.faq.eyebrow}
          title={t.faq.titlePart1}
          accent={t.faq.accent}
        />

        {/* Why Choose block */}
        <motion.div
          className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-cyan">{t.faq.whyTitle}</span>
          <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white md:text-3xl">{t.faq.whyHeadline}</h3>
          <p className="mt-4 text-sm leading-relaxed text-white md:text-base">{t.faq.whyDesc}</p>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {t.faq.whyFeatures.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(0,212,255,0.15)" }}>
                  <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3"><path d="M2 5l2 2 4-4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="text-sm font-medium text-white">{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-6 max-w-3xl space-y-3"
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-accent-cyan/40 bg-white/[0.04]" : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-medium text-white md:text-lg">{f.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-sm transition-all duration-500 ${
                    isOpen ? "rotate-45 bg-gradient-to-br from-accent-blue to-accent-cyan text-black" : "text-muted"
                  }`}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm leading-relaxed text-muted">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
