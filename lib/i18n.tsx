"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { en, es, type Translations } from "./i18nData";

export type {
  ServiceItem, StepItem, StatItem, PlanItem, FaqItem, FooterColumn, Translations,
} from "./i18nData";
export { en, es, buildFaqJsonLd } from "./i18nData";

type Lang = "en" | "es";

const translations: Record<Lang, Translations> = { en, es };

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({ lang: "en", setLang: () => {}, t: en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const urlLang: Lang = pathname === "/es" || pathname?.startsWith("/es/") ? "es" : "en";
  const [lang, setLang] = useState<Lang>(urlLang);

  // The URL is the source of truth for language — keeps SSR content, hreflang,
  // and indexed language in sync. A stale localStorage value must never override it.
  useEffect(() => {
    setLang(urlLang);
    document.documentElement.lang = urlLang;
  }, [urlLang]);

  const handleSet = (l: Lang) => {
    setLang(l);
    try { localStorage.setItem("uxcs-lang", l); } catch { /* storage blocked */ }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSet, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
