"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "./Services";

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Landing pages launch in 10–14 days. Full marketing sites: 4–6 weeks. SaaS products: 8–16 weeks depending on scope. We always lock the timeline in writing before kickoff.",
  },
  {
    q: "Do you work with our existing design or brand?",
    a: "Absolutely. We can pick up an existing system and elevate it, or build everything from scratch. We'll audit your brand in the discovery call and recommend the most efficient path.",
  },
  {
    q: "What tech stack do you build on?",
    a: "Our default stack is Next.js + TypeScript + Tailwind, with GSAP / Framer Motion / Three.js for motion. We also ship on Webflow, Shopify Hydrogen and headless CMS when it makes sense.",
  },
  {
    q: "Can you take over an in-progress project?",
    a: "Yes — about 30% of our work is rescues. We do a paid 1-week audit, give you a clear plan, and either ship it ourselves or coach your team to the finish line.",
  },
  {
    q: "Do you offer ongoing retainers?",
    a: "Yes. After launch, most clients move to a monthly partnership for iteration, experiments and new features. Plans start at $4.8k/mo.",
  },
  {
    q: "How do payments work?",
    a: "50% to lock your start date, 50% on launch for fixed-scope projects. Retainers are billed monthly in advance. We invoice in USD via Stripe / wire.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-32 md:py-40">
      <div className="container-x">
        <SectionHeader
          eyebrow="FAQ"
          title="Everything you need"
          accent="to decide."
          description="Still curious? Reach out — we reply in under a business day."
        />

        <div className="mx-auto mt-16 max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-accent-cyan/40 bg-white/[0.04]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-medium text-white md:text-lg">
                    {f.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-sm transition-all duration-500 ${
                      isOpen
                        ? "rotate-45 bg-gradient-to-br from-accent-blue to-accent-cyan text-black"
                        : "text-muted"
                    }`}
                  >
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
                      <div className="px-6 pb-6 text-sm leading-relaxed text-muted">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
