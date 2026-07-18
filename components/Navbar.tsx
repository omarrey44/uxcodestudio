"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLanguage();

  // Language must change the URL (not just client state) so the served
  // content, hreflang, and indexed language always stay in sync.
  const goToLang = (l: "en" | "es") => {
    if (l === lang) return;
    router.push(l === "es" ? "/es" : "/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const LangToggle = ({ className = "", dark = false }: { className?: string; dark?: boolean }) => (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => goToLang("en")}
        className={cn(
          "text-[11px] font-semibold transition-all px-1.5 py-0.5 rounded",
          dark
            ? lang === "en" ? "text-[#111111] bg-black/10 ring-1 ring-black/20" : "text-[#111111]/50 hover:text-[#111111]"
            : lang === "en" ? "text-white bg-white/10 ring-1 ring-white/20" : "text-muted hover:text-white"
        )}
      >
        EN
      </button>
      <span className={cn("text-[11px]", dark ? "text-[#111111]/30" : "text-muted-dim")}>|</span>
      <button
        onClick={() => goToLang("es")}
        className={cn(
          "text-[11px] font-semibold transition-all px-1.5 py-0.5 rounded",
          dark
            ? lang === "es" ? "text-[#111111] bg-black/10 ring-1 ring-black/20" : "text-[#111111]/50 hover:text-[#111111]"
            : lang === "es" ? "text-white bg-white/10 ring-1 ring-white/20" : "text-muted hover:text-white"
        )}
      >
        ES
      </button>
    </div>
  );

  if (pathname?.startsWith("/pay") || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* ── MOBILE ─────────────────────────────────────────── */}
        <div className="flex md:hidden items-center justify-between px-5 pt-6 pb-3">
          <a href="#top">
            <Image src="/logo.png" width={200} height={60} alt="UXCODESTUDIO" priority className="w-[120px] h-auto" />
          </a>
          <div className={cn(
            "flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-500 backdrop-blur-sm",
            scrolled
              ? "bg-[#B3B3B3] shadow-[0_8px_40px_-16px_rgba(0,0,0,0.15)]"
              : "bg-[#B3B3B3]"
          )}>
            <LangToggle dark />
            <div className="h-4 w-px bg-black/10" />
            <a href="#contact" className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black">
              Start <span aria-hidden>→</span>
            </a>
            <button onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" className="flex flex-col justify-center gap-[5px] p-1.5">
              <span className="block h-[2px] w-5 rounded-full bg-[#111111]/80" />
              <span className="block h-[2px] w-5 rounded-full bg-[#111111]/80" />
              <span className="block h-[2px] w-3.5 rounded-full bg-[#111111]/80" />
            </button>
          </div>
        </div>

        {/* ── DESKTOP ────────────────────────────────────────── */}
        <div className="hidden md:flex justify-center px-4 pt-3">
          <a href="#top" className="absolute left-6 top-3 flex items-center">
            <Image src="/logo.png" width={155} height={46} alt="UXCODESTUDIO" priority />
          </a>
          <div className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-2 transition-all duration-500 backdrop-blur-sm",
            scrolled
              ? "bg-[#B3B3B3] shadow-[0_10px_60px_-20px_rgba(0,0,0,0.15)]"
              : "bg-[#B3B3B3]"
          )}>
            <nav className="flex items-center gap-1">
              {t.nav.links.map((l) => (
                <a key={l.href} href={l.href} className="group relative rounded-lg px-2.5 py-1.5 text-sm text-[#111111]/60 transition-colors hover:text-[#111111]">
                  <span className="relative z-10">{l.label}</span>
                  <span className="absolute inset-0 -z-0 rounded-lg bg-black/0 transition-colors group-hover:bg-black/5" />
                </a>
              ))}
            </nav>
            <div className="h-4 w-px bg-black/10" />
            <LangToggle dark />
            <a href="#contact" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]">
              <span>{t.nav.startProject}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE MENU ────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col bg-[#050508] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
              <a href="#top" onClick={() => setMenuOpen(false)}>
                <Image src="/logo.png" width={200} height={60} alt="UXCODESTUDIO" className="w-[120px] h-auto" />
              </a>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white transition-colors text-base">
                ✕
              </button>
            </div>

            <nav className="flex flex-1 flex-col px-6 pt-4 overflow-y-auto">
              {t.nav.links.map((l, i) => (
                <motion.a
                  key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/[0.07] py-5 text-2xl font-display font-bold text-white/50 hover:text-white transition-colors"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span>{l.label}</span>
                  <span className="text-base text-white/20">→</span>
                </motion.a>
              ))}
            </nav>

            <motion.div className="px-6 pb-4 pt-6 flex items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <span className="text-sm text-muted">Idioma / Language:</span>
              <LangToggle />
            </motion.div>

            <motion.div className="px-6 pb-10"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <a href="#contact" onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-sm font-semibold text-black">
                {t.nav.startProject} →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
