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
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.26 8.26 0 0 0 4.83 1.56V6.78a4.85 4.85 0 0 1-1.06-.09z" />
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
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="select-none overflow-hidden pb-12"
        >
          <div className="flex justify-center">
            <span className="font-display text-[7.5vw] font-bold leading-none tracking-tighter text-muted-dim md:text-[100px]">
              UXCODESTUDIO
            </span>
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
