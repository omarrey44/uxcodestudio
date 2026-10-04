"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, Code2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "./StudioUI";
import styles from "./FooterTechnology.module.css";

const TECHNOLOGIES = [
  { name: "Next.js", logo: "nextjs", href: "https://nextjs.org", color: "#f0f3f2", es: "Aplicaciones web modernas", en: "Modern web applications" },
  { name: "React", logo: "react", href: "https://react.dev", color: "#61dafb", es: "Interfaces interactivas", en: "Interactive interfaces" },
  { name: "TypeScript", logo: "typescript", href: "https://www.typescriptlang.org", color: "#6fa9e4", es: "Código escalable y robusto", en: "Scalable and robust code" },
  { name: "Tailwind CSS", logo: "tailwind", href: "https://tailwindcss.com", color: "#38bdf8", es: "UI atractiva y adaptable", en: "Beautiful and responsive UI" },
  { name: "Framer Motion", logo: "framer", href: "https://motion.dev", color: "#c9a2ed", es: "Animaciones que atrapan", en: "Engaging animations" },
  { name: "Vercel", logo: "vercel", href: "https://vercel.com", color: "#f0f3f2", es: "Despliegues rápidos y confiables", en: "Fast and reliable deployments" },
];

export default function FooterTechnology() {
  const { lang } = useLanguage();
  const es = lang === "es";

  return <section id="stack" className={styles.technology} aria-labelledby="footer-stack-title">
    <Reveal className={styles.intro}>
      <p className={styles.label}><Code2 size={22} strokeWidth={1.6} /><span>{es ? "NUESTRO STACK" : "OUR TECH STACK"}</span><span className={styles.labelLine} /></p>
      <h2 id="footer-stack-title">{es ? <>La tecnología detrás<br /><em>de cada detalle.</em></> : <>The technology behind<br /><em>every detail.</em></>}</h2>
      <p className={styles.description}>{es
        ? "Diseño, desarrollo y soluciones creativas que ayudan a negocios locales a crecer en el mundo digital."
        : "Design, development and creative solutions that help local businesses grow in the digital world."}</p>
      <a href="#contact" className={styles.cta}>{es ? "Construyamos algo increíble" : "Let's build something great"}<ArrowRight size={18} /></a>
    </Reveal>

    <ul className={styles.grid}>
      {TECHNOLOGIES.map((technology, i) => <li key={technology.logo}>
        <Reveal delay={(i % 3) * 0.06}>
          <a href={technology.href} target="_blank" rel="noopener noreferrer" className={styles.technologyLink}
            style={{ "--tech-color": technology.color } as CSSProperties}
            aria-label={`${technology.name} — ${es ? "sitio oficial, abre una nueva pestaña" : "official website, opens in a new tab"}`}>
            <Image src={`/tech/${technology.logo}.svg`} width={34} height={34} alt="" className={styles.logo} />
            <span className={styles.name}>{technology.name}</span>
            <span className={styles.role}>{technology[lang]}</span>
            <ArrowRight className={styles.arrow} size={16} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </Reveal>
      </li>)}
    </ul>
  </section>;
}
