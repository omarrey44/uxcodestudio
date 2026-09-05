"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRight, Asterisk, Code2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "./StudioUI";
import styles from "./FooterTechnology.module.css";

const TECHNOLOGIES = [
  { name: "Next.js", logo: "nextjs", href: "https://nextjs.org", color: "#f0f3f2", es: "La base de tu web", en: "Your website's foundation" },
  { name: "React", logo: "react", href: "https://react.dev", color: "#61dafb", es: "Interfaces interactivas", en: "Interactive interfaces" },
  { name: "TypeScript", logo: "typescript", href: "https://www.typescriptlang.org", color: "#6fa9e4", es: "Código con estructura", en: "Code with structure" },
  { name: "Tailwind CSS", logo: "tailwind", href: "https://tailwindcss.com", color: "#38bdf8", es: "Diseño en cada pantalla", en: "Design for every screen" },
  { name: "Framer Motion", logo: "framer", href: "https://motion.dev", color: "#c9a2ed", es: "Movimiento con intención", en: "Motion with intention" },
  { name: "Vercel", logo: "vercel", href: "https://vercel.com", color: "#f0f3f2", es: "Del código al mundo", en: "From code to the world" },
];

export default function FooterTechnology() {
  const { lang } = useLanguage();
  const es = lang === "es";

  return <section className={styles.technology} aria-labelledby="footer-stack-title">
    <Reveal className={styles.heading}>
      <div>
        <p className={styles.label}><Code2 size={31} strokeWidth={1.4} /><span>{es ? "NUESTRO STACK" : "OUR TECH STACK"}</span><span className={styles.labelLine} /></p>
        <h2 id="footer-stack-title">{es ? <>La tecnología detrás<br /><em>de cada detalle.</em></> : <>The technology behind<br /><em>every detail.</em></>}</h2>
      </div>
      <p className={styles.description}>{es
        ? "Diseño, desarrollo y animación conectados. Elegimos las herramientas que necesita cada proyecto para convertir una idea en una experiencia digital."
        : "Design, development, and motion working together. We choose the tools each project needs to turn an idea into a digital experience."}</p>
    </Reveal>

    <ul className={styles.grid}>
      {TECHNOLOGIES.map((technology, i) => <li key={technology.logo}>
        <Reveal delay={(i % 3) * 0.06}>
          <a href={technology.href} target="_blank" rel="noopener noreferrer" className={styles.technologyLink}
            style={{ "--tech-color": technology.color } as CSSProperties}
            aria-label={`${technology.name} — ${es ? "sitio oficial, abre una nueva pestaña" : "official website, opens in a new tab"}`}>
            <span className={styles.logoRow}>
              <Image src={`/tech/${technology.logo}.svg`} width={37} height={37} alt="" className={styles.logo} />
              <ArrowUpRight className={styles.arrow} size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className={styles.name}>{technology.name}</span>
            <span className={styles.role}>{technology[lang]}</span>
            <span className={styles.index} aria-hidden="true">0{i + 1}</span>
          </a>
        </Reveal>
      </li>)}
    </ul>
    <p className={styles.caption}><Asterisk className={styles.captionMark} size={18} strokeWidth={1.3} aria-hidden="true" />{es ? "Buenas herramientas. El cuidado está en cómo las usamos." : "Good tools. The craft is in how we use them."}</p>
  </section>;
}
