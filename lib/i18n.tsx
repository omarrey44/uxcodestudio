"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "es";

export type ServiceItem   = { title: string; description: string; tags: string[]; learnMore: string };
export type StepItem      = { n: string; title: string; body: string };
export type StatItem      = { value: number; suffix: string; label: string; sub: string };
export type PlanItem      = { name: string; price: string; cadence: string; description: string; features: string[]; cta: string; highlight: boolean };
export type FaqItem       = { q: string; a: string };
export type FooterColumn  = { title: string; links: string[] };

interface Translations {
  nav: {
    startProject: string;
    links: { label: string; href: string }[];
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlinePart2: string;
    rotating: string[];
    desc: string;
    cta1: string;
    cta2: string;
    statsCount: string;
    statsRating: string;
  };
  services: {
    eyebrow: string;
    titlePart1: string;
    titleEmphasis: string;
    titlePart2: string;
    accent: string;
    description: string;
    items: ServiceItem[];
  };
  process: {
    headlinePart1: string;
    headlineEmphasis: string;
    headlinePart2: string;
    headlineAccent: string;
    sub: string;
    steps: StepItem[];
  };
  why: {
    eyebrow: string;
    titlePart1: string;
    titleEmphasis: string;
    titlePart2: string;
    accent: string;
    stats: StatItem[];
    teamHeadline: string;
    teamHeadlineAccent: string;
    teamDesc: string;
    features: string[];
  };
  work: {
    eyebrow: string;
    titlePart1: string;
    accent: string;
    description: string;
  };
  testimonials: {
    eyebrow: string;
    titlePart1: string;
    accent: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    badge: string;
    plans: PlanItem[];
  };
  faq: {
    eyebrow: string;
    titlePart1: string;
    accent: string;
    items: FaqItem[];
  };
  cta: {
    badge: string;
    headlinePart1: string;
    headlinePart2: string;
    description: string;
    cta1: string;
    cta2: string;
    features: string[];
    contactTitle: string;
    contactMethods: { icon: string; label: string; value: string; href: string; hint: string }[];
  };
  footer: {
    description: string;
    columns: FooterColumn[];
    copyright: string;
    privacy: string;
    terms: string;
    status: string;
  };
}

// ── English ──────────────────────────────────────────────────────────────────

const en: Translations = {
  nav: {
    startProject: "Start a project",
    links: [
      { label: "Services", href: "#services" },
      { label: "Process", href: "#process" },
      { label: "Work",     href: "#work"     },
      { label: "Pricing",  href: "#pricing"  },
      { label: "FAQ",      href: "#faq"      },
    ],
  },
  hero: {
    badge:         "Booking new projects · Q3 2026",
    headlinePart1: "We design &",
    headlinePart2: "engineer",
    rotating:      ["Websites", "Landings", "Mobile Apps", "SaaS"],
    desc:          "UXCODESTUDIO is a digital product studio crafting cinematic interfaces and high-performing systems for ambitious teams that refuse to ship anything average.",
    cta1:          "Start your project",
    cta2:          "View our work",
    statsCount:    "40+ products shipped",
    statsRating:   "Rated 4.9/5 by founders & design leads",
  },
  services: {
    eyebrow:     "Services",
    titlePart1:  "Engineered",
    titleEmphasis: "for",
    titlePart2:  "momentum,",
    accent:      "designed for awe.",
    description: "One studio. Six disciplines. A workflow optimized to ship measurable wins fast — without sacrificing craft.",
    items: [
      { title: "Marketing Websites",  description: "Cinematic, brand-defining sites engineered to convert and rank.",                          tags: ["Design", "Webflow", "Next.js"], learnMore: "Learn more" },
      { title: "Landing Pages",       description: "Systems and strategies to help companies understand and accelerate their growth.",          tags: ["CRO", "Analytics", "Next.js", "React", "Angular", "Python"], learnMore: "Learn more" },
      { title: "Web Applications",    description: "Production-grade interfaces, design systems and full-stack engineering.",                   tags: ["React", "TS", "Node"], learnMore: "Learn more" },
      { title: "SaaS Platforms",      description: "End-to-end product studios: from 0→1 architecture to billing flows.",                     tags: ["Stripe", "Auth", "AI"], learnMore: "Learn more" },
      { title: "Brand & Identity",    description: "Visual systems, motion principles and verbal identity for tech-first brands.",              tags: ["Logo", "Motion", "Tone"], learnMore: "Learn more" },
      { title: "Mobile Apps",          description: "Native-quality iOS and Android apps built with React Native and Flutter — fast, beautiful and App Store ready.",  tags: ["React Native", "Flutter", "iOS", "Android"], learnMore: "Learn more" },
    ],
  },
  process: {
    headlinePart1:    "A workflow",
    headlineEmphasis: "tuned",
    headlinePart2:    "for",
    headlineAccent:   "cinematic outcomes.",
    sub:              "Five tight phases — no fluff, no surprises.",
    steps: [
      { n: "01", title: "Discover",       body: "Deep-dive workshops to align on business goals, audience and the moat we're building." },
      { n: "02", title: "Define",         body: "Strategy, brand foundations, IA and motion principles documented as a living spec." },
      { n: "03", title: "Design",         body: "High-fidelity UI, prototyping and choreography mapped to real conversion targets." },
      { n: "04", title: "Build",          body: "Production engineering with Next.js, TypeScript and a tested component system." },
      { n: "05", title: "Launch & Scale", body: "Analytics, experimentation and ongoing product partnership to compound results." },
    ],
  },
  why: {
    eyebrow:            "Why us",
    titlePart1:         "Numbers",
    titleEmphasis:      "that",
    titlePart2:         "make",
    accent:             "founders relax.",
    stats: [
      { value: 187, suffix: "%",    label: "Avg. conversion lift", sub: "across 24 launches" },
      { value: 42,  suffix: "",     label: "Industry awards",      sub: "Awwwards · CSSDA · FWA" },
      { value: 98,  suffix: "/100", label: "Lighthouse score",     sub: "median across shipped sites" },
      { value: 5,   suffix: " days",label: "Average to launch",    sub: "for landing pages" },
    ],
    teamHeadline:       "Senior team.",
    teamHeadlineAccent: "Zero handoffs.",
    teamDesc:           "You work directly with the designers and engineers shipping the pixels — no account managers, no juniors silently learning on your project.",
    features: [
      "Embedded Slack channel from day 1",
      "Weekly demo + Loom updates",
      "Dedicated Figma + GitHub workspace",
      "Lifetime micro-fixes on shipped work",
    ],
  },
  work: {
    eyebrow:     "Featured work",
    titlePart1:  "Selected pieces from",
    accent:      "our 2025–2026 lab.",
    description: "A few products we engineered end-to-end. Every detail tuned for clarity, depth and feel.",
  },
  testimonials: {
    eyebrow:    "Loved by founders",
    titlePart1: "Trusted worldwide by teams focused on performance,",
    accent:     "quality, and growth.",
  },
  pricing: {
    eyebrow:     "Pricing",
    title:       "Transparent pricing.",
    accent:      "No surprises.",
    description: "Pick a plan, get a fixed quote within 24h, and lock your start date.",
    badge:       "Most popular",
    plans: [
      {
        name: "Launchpad", price: "$100–$200", cadence: "/ landing page", highlight: false,
        description: "A high-converting landing page — basic or premium finish, shipped fast.",
        features: ["Custom design (Figma)", "Next.js + Tailwind build", "Mobile responsive", "Basic animations", "1 round of revisions"],
        cta: "Start a Launchpad",
      },
      {
        name: "Studio", price: "$350–$500", cadence: "/ project", highlight: true,
        description: "Full-stack web app or site — frontend, backend, analytics and everything in between.",
        features: ["Everything in Launchpad", "Backend API + database", "Analytics integration", "Auth + third-party integrations", "Performance optimization", "30-day post-launch support"],
        cta: "Book the Studio",
      },
      {
        name: "Support", price: "Custom", cadence: "", highlight: false,
        description: "Ongoing maintenance, updates and dedicated support — priced separately per need.",
        features: ["Bug fixes & updates", "Performance monitoring", "Feature iterations", "Priority response", "Monthly reporting"],
        cta: "Talk to us",
      },
    ],
  },
  faq: {
    eyebrow:    "FAQ",
    titlePart1: "Everything you need",
    accent:     "to decide.",
    items: [
      { q: "How long does a typical project take?",       a: "Landing pages launch in 5–7 days. Full marketing sites: 2–4 weeks. SaaS products: 8–16 weeks depending on scope. We always lock the timeline in writing before kickoff." },
      { q: "Do you work with our existing design or brand?", a: "Absolutely. We can pick up an existing system and elevate it, or build everything from scratch. We'll audit your brand in the discovery call and recommend the most efficient path." },
      { q: "What tech stack do you build on?",            a: "Our default stack is Next.js + TypeScript + Tailwind, with GSAP / Framer Motion / Three.js for motion. We also ship on Webflow, Shopify Hydrogen and headless CMS when it makes sense." },
      { q: "Can you take over an in-progress project?",   a: "Yes — about 30% of our work is rescues. We do a paid 1-week audit, give you a clear plan, and either ship it ourselves or coach your team to the finish line." },
      { q: "Do you offer ongoing retainers?",             a: "Yes. After launch, most clients move to a monthly partnership for iteration, experiments and new features. Plans start at $4.8k/mo." },
      { q: "How do payments work?",                       a: "50% to lock your start date, 50% on launch for fixed-scope projects. Retainers are billed monthly in advance. We invoice in USD via Stripe / wire." },
    ],
  },
  cta: {
    badge:         "Let's build",
    headlinePart1: "Ready to ship something",
    headlinePart2: "people screenshot?",
    description:   "Book a 30-minute call. Walk out with a clear scope, a fixed quote and an honest opinion on whether we're the right fit.",
    cta1:          "Book a discovery call",
    cta2:          "Or browse the work",
    features:      ["Fixed quote in 24h", "NDA on request", "Remote-first · Worldwide"],
    contactTitle:  "Or reach us directly",
    contactMethods: [
      { icon: "✉", label: "Send an email", value: "hello@uxcodestudio.com", href: "mailto:hello@uxcodestudio.com", hint: "We reply within 24h" },
      { icon: "✆", label: "Call us", value: "+1 (000) 000-0000", href: "tel:+10000000000", hint: "Mon–Fri · 9am–6pm" },
      { icon: "◈", label: "Book a meeting", value: "Schedule 30 min", href: "https://calendly.com/uxcodestudio", hint: "Free discovery call" },
    ],
  },
  footer: {
    description: "A premium digital product studio crafting cinematic interfaces for ambitious teams worldwide.",
    columns: [
      { title: "Studio",    links: ["About", "Process", "Careers", "Contact"] },
      { title: "Services",  links: ["Websites", "Landing Pages", "Web Apps", "SaaS Platforms"] },
      { title: "Resources", links: ["Work", "Pricing", "FAQ", "Blog"] },
    ],
    copyright: "All rights reserved.",
    privacy:   "Privacy",
    terms:     "Terms",
    status:    "All systems operational",
  },
};

// ── Spanish ──────────────────────────────────────────────────────────────────

const es: Translations = {
  nav: {
    startProject: "Iniciar proyecto",
    links: [
      { label: "Servicios", href: "#services" },
      { label: "Proceso",   href: "#process"  },
      { label: "Trabajo",   href: "#work"     },
      { label: "Precios",   href: "#pricing"  },
      { label: "FAQ",       href: "#faq"      },
    ],
  },
  hero: {
    badge:         "Proyectos abiertos · Q3 2026",
    headlinePart1: "Diseñamos &",
    headlinePart2: "construimos",
    rotating:      ["Sitios Web", "Landings", "Mobile Apps", "SaaS"],
    desc:          "UXCODESTUDIO es un estudio de producto digital que crea interfaces cinematográficas y sistemas de alto rendimiento para equipos ambiciosos que se niegan a lanzar algo mediocre.",
    cta1:          "Inicia tu proyecto",
    cta2:          "Ver nuestro trabajo",
    statsCount:    "40+ productos lanzados",
    statsRating:   "Valorado 4.9/5 por founders y líderes de diseño",
  },
  services: {
    eyebrow:      "Servicios",
    titlePart1:   "Construido",
    titleEmphasis:"para",
    titlePart2:   "el impulso,",
    accent:       "diseñado para asombrar.",
    description:  "Un estudio. Seis disciplinas. Un flujo de trabajo optimizado para lanzar victorias medibles rápido — sin sacrificar la calidad.",
    items: [
      { title: "Sitios de Marketing", description: "Sitios cinematográficos que definen tu marca, construidos para convertir y posicionarse.",          tags: ["Diseño", "Webflow", "Next.js"], learnMore: "Saber más" },
      { title: "Landing Pages",       description: "Sistemas y estrategias para que empresas entiendan y aceleren su crecimiento.",                     tags: ["CRO", "Analytics", "Next.js", "React", "Angular", "Python"], learnMore: "Saber más" },
      { title: "Aplicaciones Web",    description: "Interfaces de nivel producción, sistemas de diseño e ingeniería full-stack.",                        tags: ["React", "TS", "Node"], learnMore: "Saber más" },
      { title: "Plataformas SaaS",    description: "Estudio de producto end-to-end: de la arquitectura 0→1 a los flujos de pago.",                      tags: ["Stripe", "Auth", "AI"], learnMore: "Saber más" },
      { title: "Marca e Identidad",   description: "Sistemas visuales, principios de movimiento e identidad verbal para marcas tech-first.",             tags: ["Logo", "Motion", "Tono"], learnMore: "Saber más" },
      { title: "Apps Móviles",         description: "Apps iOS y Android de calidad nativa con React Native y Flutter — rápidas, hermosas y listas para el App Store.",  tags: ["React Native", "Flutter", "iOS", "Android"], learnMore: "Saber más" },
    ],
  },
  process: {
    headlinePart1:    "Un flujo de trabajo",
    headlineEmphasis: "afinado",
    headlinePart2:    "para",
    headlineAccent:   "resultados cinematográficos.",
    sub:              "Cinco fases precisas — sin relleno, sin sorpresas.",
    steps: [
      { n: "01", title: "Descubrir",       body: "Talleres profundos para alinear objetivos de negocio, audiencia y la ventaja competitiva que estamos construyendo." },
      { n: "02", title: "Definir",         body: "Estrategia, fundamentos de marca, IA y principios de movimiento documentados como especificación viva." },
      { n: "03", title: "Diseñar",         body: "UI de alta fidelidad, prototipado y coreografía mapeada a objetivos de conversión reales." },
      { n: "04", title: "Construir",       body: "Ingeniería de producción con Next.js, TypeScript y un sistema de componentes probado." },
      { n: "05", title: "Lanzar & Escalar",body: "Analytics, experimentación y alianza continua de producto para multiplicar resultados." },
    ],
  },
  why: {
    eyebrow:            "Por qué nosotros",
    titlePart1:         "Números",
    titleEmphasis:      "que hacen",
    titlePart2:         "",
    accent:             "relajar a los founders.",
    stats: [
      { value: 187, suffix: "%",     label: "Aumento de conversión promedio", sub: "en 24 lanzamientos" },
      { value: 42,  suffix: "",      label: "Premios de la industria",        sub: "Awwwards · CSSDA · FWA" },
      { value: 98,  suffix: "/100",  label: "Puntuación Lighthouse",          sub: "mediana en sitios lanzados" },
      { value: 5,  suffix: " días", label: "Promedio para lanzar",           sub: "para landing pages" },
    ],
    teamHeadline:       "Equipo senior.",
    teamHeadlineAccent: "Sin intermediarios.",
    teamDesc:           "Trabajas directamente con los diseñadores e ingenieros que crean los pixels — sin account managers, sin juniors aprendiendo en silencio a tu costo.",
    features: [
      "Canal de Slack integrado desde el día 1",
      "Demo semanal + actualizaciones en Loom",
      "Espacio dedicado en Figma + GitHub",
      "Micro-fixes de por vida en el trabajo entregado",
    ],
  },
  work: {
    eyebrow:     "Trabajo destacado",
    titlePart1:  "Piezas seleccionadas de",
    accent:      "nuestro laboratorio 2025–2026.",
    description: "Algunos productos que construimos de principio a fin. Cada detalle calibrado para claridad, profundidad y sensación.",
  },
  testimonials: {
    eyebrow:    "Amados por founders",
    titlePart1: "Confianza mundial para equipos enfocados en rendimiento,",
    accent:     "calidad y crecimiento.",
  },
  pricing: {
    eyebrow:     "Precios",
    title:       "Precios transparentes.",
    accent:      "Sin sorpresas.",
    description: "Elige un plan, obtén una cotización fija en 24h y bloquea tu fecha de inicio.",
    badge:       "Más popular",
    plans: [
      {
        name: "Launchpad", price: "$100–$200", cadence: "/ landing page", highlight: false,
        description: "Landing page de alta conversión — acabado básico o premium, entregada rápido.",
        features: ["Diseño personalizado (Figma)", "Next.js + Tailwind build", "Responsive mobile", "Animaciones básicas", "1 ronda de revisiones"],
        cta: "Comenzar Launchpad",
      },
      {
        name: "Studio", price: "$350–$500", cadence: "/ proyecto", highlight: true,
        description: "Aplicación web full-stack — frontend, backend, analytics y todo lo necesario.",
        features: ["Todo lo de Launchpad", "Backend API + base de datos", "Integración de analytics", "Auth + integraciones externas", "Optimización de rendimiento", "30 días de soporte post-lanzamiento"],
        cta: "Reservar Studio",
      },
      {
        name: "Soporte", price: "Custom", cadence: "", highlight: false,
        description: "Mantenimiento continuo, actualizaciones y soporte dedicado — precio según necesidad.",
        features: ["Corrección de bugs y updates", "Monitoreo de rendimiento", "Iteraciones de funciones", "Respuesta prioritaria", "Reporte mensual"],
        cta: "Contáctanos",
      },
    ],
  },
  faq: {
    eyebrow:    "Preguntas frecuentes",
    titlePart1: "Todo lo que necesitas",
    accent:     "para decidir.",
    items: [
      { q: "¿Cuánto tiempo dura un proyecto típico?",        a: "Las landing pages se lanzan en 5–7 días. Sitios de marketing completos: 2–4 semanas. Productos SaaS: 8–16 semanas según el alcance. Siempre fijamos el plazo por escrito antes del inicio." },
      { q: "¿Trabajan con nuestro diseño o marca existente?",a: "Absolutamente. Podemos tomar un sistema existente y elevarlo, o construir todo desde cero. Auditaremos tu marca en la llamada de discovery y recomendaremos el camino más eficiente." },
      { q: "¿Qué stack tecnológico usan?",                   a: "Nuestro stack principal es Next.js + TypeScript + Tailwind, con GSAP / Framer Motion / Three.js para motion. También trabajamos en Webflow, Shopify Hydrogen y CMS headless cuando tiene sentido." },
      { q: "¿Pueden tomar un proyecto en curso?",            a: "Sí — alrededor del 30% de nuestro trabajo son rescates. Hacemos una auditoría paga de 1 semana, te damos un plan claro, y o bien lo terminamos nosotros o asesoramos a tu equipo hasta la meta." },
      { q: "¿Ofrecen retainers continuos?",                  a: "Sí. Después del lanzamiento, la mayoría de los clientes pasan a una alianza mensual para iteración, experimentos y nuevas funcionalidades. Los planes empiezan en $4.8k/mes." },
      { q: "¿Cómo funcionan los pagos?",                     a: "50% para reservar tu fecha de inicio, 50% al lanzamiento para proyectos de alcance fijo. Los retainers se cobran mensualmente por adelantado. Facturamos en USD via Stripe / transferencia." },
    ],
  },
  cta: {
    badge:         "Construyamos",
    headlinePart1: "¿Listo para lanzar algo",
    headlinePart2: "que la gente comparta?",
    description:   "Reserva una llamada de 30 minutos. Sal con un alcance claro, una cotización fija y una opinión honesta sobre si somos el equipo ideal para ti.",
    cta1:          "Reserva una llamada",
    cta2:          "O ve nuestro trabajo",
    features:      ["Cotización fija en 24h", "NDA bajo solicitud", "Remoto primero · Mundial"],
    contactTitle:  "O contáctanos directamente",
    contactMethods: [
      { icon: "✉", label: "Envíanos un email", value: "hello@uxcodestudio.com", href: "mailto:hello@uxcodestudio.com", hint: "Respondemos en 24h" },
      { icon: "✆", label: "Llámanos", value: "+1 (000) 000-0000", href: "tel:+10000000000", hint: "Lun–Vie · 9am–6pm" },
      { icon: "◈", label: "Agenda una cita", value: "Reservar 30 min", href: "https://calendly.com/uxcodestudio", hint: "Llamada de discovery gratis" },
    ],
  },
  footer: {
    description: "Un estudio premium de producto digital creando interfaces cinematográficas para equipos ambiciosos en todo el mundo.",
    columns: [
      { title: "Estudio",   links: ["Acerca de", "Proceso", "Carreras", "Contacto"] },
      { title: "Servicios", links: ["Sitios Web", "Landing Pages", "Apps Web", "Plataformas SaaS"] },
      { title: "Recursos",  links: ["Trabajo", "Precios", "FAQ", "Blog"] },
    ],
    copyright: "Todos los derechos reservados.",
    privacy:   "Privacidad",
    terms:     "Términos",
    status:    "Todos los sistemas operativos",
  },
};

// ── Context ──────────────────────────────────────────────────────────────────

const translations: Record<Lang, Translations> = { en, es };

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({ lang: "en", setLang: () => {}, t: en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("uxcs-lang") as Lang | null;
      if (saved === "en" || saved === "es") setLang(saved);
    } catch { /* storage blocked */ }
  }, []);

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
