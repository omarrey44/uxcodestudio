"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

const SOCIALS = [
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.07 2.25h6.97l4.261 5.635 5.942-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.73zm-7.441-3h4.232c-.197-1.954-1.318-2.454-2.092-2.454-.803 0-1.979.454-2.14 2.454zM8 10c2.086 0 3-.735 3-2.5S10.086 5 8 5H3v14h5.005c2.011 0 3.995-.946 3.995-3.6 0-1.973-1.167-3.1-3-3.4H8zm-3-3h2.7c.742 0 1.3.202 1.3 1s-.558 1-1.3 1H5V7zm2.7 8H5v-4h2.7c.964 0 1.655.285 1.655 2s-.691 2-1.655 2z" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.952-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.22 10.22 0 0 0 4.392-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4a10.161 10.161 0 0 0 6.29 2.166 10.24 10.24 0 0 0 4.006-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12a28.5 28.5 0 0 0-.722-1.458c-5.014 1.515-9.876 1.445-10.32 1.43a10.2 10.2 0 0 0 2.305 6.913zm-2.44-8.834c.45.009 4.599.038 9.3-1.24A68.27 68.27 0 0 0 8.14 2.37a10.2 10.2 0 0 0-8.1 8.163zm10.962-9.08a69.562 69.562 0 0 1 3.22 5.626 20.942 20.942 0 0 0 6.33-2.23A10.218 10.218 0 0 0 12.907 1.46zm4.297 6.724a20.208 20.208 0 0 1-5.88 2.189l-.012-.027c.43.899.832 1.812 1.19 2.73 3.46-.433 6.906.26 7.256.332a10.18 10.18 0 0 0-2.554-5.224z" />
      </svg>
    ),
  },
];

// Column order: Studio, Services, Resources — same in EN and ES
const COL_HREFS: string[][] = [
  ["#top", "#process", "#contact", "#contact"],          // Studio
  ["#services", "#services", "#services", "#services"],  // Services
  ["#work", "#pricing", "#faq", "#"],                    // Resources
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />
      <div className="absolute -bottom-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-3xl" />

      <div className="container-x relative py-20">
        {/* Huge wordmark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="select-none overflow-hidden pb-12"
        >
          <div className="flex animate-marquee gap-12 will-change-transform" style={{ animationDuration: "18s" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="shrink-0 font-display text-[18vw] font-bold leading-none tracking-tighter text-muted-dim md:text-[140px]"
              >
                UXCODESTUDIO <span className="text-accent-cyan/40">·</span>
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-14 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center">
              <Image src="/logo.png" width={160} height={48} alt="UXCODESTUDIO" />
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-soft">{t.footer.description}</p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted-soft transition-all hover:border-accent-cyan/50 hover:text-accent-cyan"
                >
                  <span className="h-4 w-4">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {t.footer.columns.map((c, ci) => (
            <div key={c.title}>
              <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted-dim">{c.title}</div>
              <ul className="space-y-2.5 text-sm">
                {c.links.map((l, li) => (
                  <li key={l}>
                    <a href={COL_HREFS[ci]?.[li] ?? "#"} className="text-muted transition-colors hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-dim md:flex-row">
          <div>© {new Date().getFullYear()} UXCODESTUDIO. {t.footer.copyright}</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white">{t.footer.terms}</a>
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t.footer.status}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
