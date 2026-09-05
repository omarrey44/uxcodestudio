"use client";

import type { CSSProperties } from "react";
import { Globe2, MousePointer2, ShoppingBag, Server, CalendarDays, RefreshCw, Smartphone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import styles from "./ServiceCardHeading.module.css";

const HEADINGS = [
  { icon: Globe2, color: "#a9d8df", en: "Web experience", es: "Experiencia web" },
  { icon: MousePointer2, color: "#c8bdeb", en: "One page. Big impact.", es: "Una página. Gran impacto." },
  { icon: ShoppingBag, color: "#d4d5b5", en: "Digital commerce", es: "Comercio digital" },
  { icon: Server, color: "#acc9ea", en: "Always connected", es: "Siempre conectado" },
  { icon: CalendarDays, color: "#e0ccaa", en: "Make room for connection", es: "Espacio para conectar" },
  { icon: RefreshCw, color: "#cabce9", en: "A fresh perspective", es: "Una nueva perspectiva" },
  { icon: Smartphone, color: "#b1dbc5", en: "Your brand. Closer.", es: "Tu marca, más cerca" },
];

export default function ServiceCardHeading({ index }: { index: number }) {
  const { lang } = useLanguage();
  const heading = HEADINGS[index];
  const Icon = heading.icon;
  return <span className={styles.heading} style={{ "--eyebrow-accent": heading.color } as CSSProperties}>
    <span className={styles.emblem} aria-hidden="true"><Icon size={25} strokeWidth={1.4} /><span className={styles.number}>0{index + 1}</span></span>
    <span className={styles.text}>{heading[lang]}</span>
  </span>;
}
