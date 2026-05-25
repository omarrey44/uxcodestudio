"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "./Services";
import { useLanguage } from "@/lib/i18n";

export default function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-deep section-separator relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-24 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent-cyan/[0.12] blur-[60px]" />
        <div className="absolute -top-10 right-1/4 h-[280px] w-[320px] rounded-full bg-accent-violet/[0.09] blur-[50px]" />
      </div>
      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.faq.eyebrow}
          title={t.faq.titlePart1}
          accent={t.faq.accent}
        />

        <motion.div
          className="mx-auto mt-16 max-w-3xl space-y-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
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
