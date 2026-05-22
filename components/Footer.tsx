"use client";

import { motion } from "framer-motion";

const COLUMNS = [
  {
    title: "Studio",
    links: ["About", "Process", "Careers", "Contact"],
  },
  {
    title: "Services",
    links: ["Websites", "Landing Pages", "Web Apps", "SaaS Platforms"],
  },
  {
    title: "Resources",
    links: ["Work", "Pricing", "FAQ", "Blog"],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />
      <div className="absolute -bottom-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-3xl" />

      <div className="container-x relative py-20">
        {/* Huge wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="select-none pb-12 text-center font-display text-[18vw] font-bold leading-none tracking-tighter text-muted-dim md:text-[140px]"
        >
          UXCODESTUDIO
        </motion.div>

        <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-14 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet">
                <span className="absolute inset-[1px] rounded-[7px] bg-background" />
                <span className="relative font-display text-sm font-bold text-white">
                  ux
                </span>
              </span>
              <span className="font-display text-sm font-semibold tracking-wider text-white">
                UXCODE<span className="text-accent-cyan">STUDIO</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-soft">
              A premium digital product studio crafting cinematic interfaces for
              ambitious teams worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              {["x", "in", "be", "dr"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-xs uppercase text-muted-soft transition-all hover:border-accent-cyan/50 hover:text-accent-cyan"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title}>
              <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted-dim">
                {c.title}
              </div>
              <ul className="space-y-2.5 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-muted transition-colors hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-dim md:flex-row">
          <div>© {new Date().getFullYear()} UXCODESTUDIO. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
