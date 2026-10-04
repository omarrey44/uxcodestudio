"use client";

import { Globe2, MousePointer2, ShoppingBag, Server, CalendarDays, RefreshCw, Smartphone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import styles from "./ServiceCardHeading.module.css";

const HEADINGS = [
  { icon: Globe2, en: "Web experience", es: "Experiencia web" },
  { icon: MousePointer2, en: "One page. Big impact.", es: "Una página. Gran impacto." },
  { icon: ShoppingBag, en: "Digital commerce", es: "Comercio digital" },
  { icon: Server, en: "Always connected", es: "Siempre conectado" },
  { icon: CalendarDays, en: "Make room for connection", es: "Espacio para conectar" },
  { icon: RefreshCw, en: "A fresh perspective", es: "Una nueva perspectiva" },
  { icon: Smartphone, en: "Your brand. Closer.", es: "Tu marca, más cerca" },
];

export default function ServiceCardHeading({ index }: { index: number }) {
  const { lang } = useLanguage();
  const heading = HEADINGS[index];
  const Icon = heading.icon;
  return <span className={styles.heading}>
    <span className={styles.emblem} aria-hidden="true"><Icon size={25} strokeWidth={1.4} /><span className={styles.number}>0{index + 1}</span></span>
    <span className={styles.text}>{heading[lang]}</span>
  </span>;
}
