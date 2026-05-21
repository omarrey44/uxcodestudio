"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-40">
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
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] glass-strong p-12 text-center md:p-20"
        >
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue/50 via-accent-cyan/30 to-accent-violet/50 opacity-60 blur-2xl" />
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px opacity-60" />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-white/70">
              <span className="h-1 w-1 rounded-full bg-accent-cyan" /> Let's build
            </div>

            <h2 className="font-display text-4xl font-bold leading-[1.05] text-balance text-white md:text-7xl">
              Ready to ship something
              <br />
              <span className="text-gradient-accent">people screenshot?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-balance text-white/65 md:text-lg">
              Book a 30-minute call. Walk out with a clear scope, a fixed quote
              and an honest opinion on whether we're the right fit.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="mailto:hello@uxcodestudio.com" variant="primary">
                Book a discovery call <span aria-hidden>→</span>
              </MagneticButton>
              <MagneticButton href="#work" variant="secondary">
                Or browse the work
              </MagneticButton>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/40">
              <span>✦ Fixed quote in 24h</span>
              <span>✦ NDA on request</span>
              <span>✦ Remote-first · Worldwide</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
