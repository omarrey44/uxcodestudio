"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "es";

export type ServiceItem   = { title: string; description: string; tags: string[]; learnMore: string };
export type StepItem      = { n: string; tag: string; title: string; body: string; output: string[] };
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
    closeLabel: string;
    items: ServiceItem[];
  };
  process: {
    headlinePart1: string;
    headlineEmphasis: string;
    headlinePart2: string;
    headlineAccent: string;
    sub: string;
    steps: StepItem[];
    pills: string[];
    pillDescs: string[];
    sidebarTagline: string;
    sidebarSub: string;
    transparencyItems: string[];
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
    teamPartners: string;
    features: string[];
  };
  work: {
    eyebrow: string;
    titlePart1: string;
    accent: string;
    description: string;
    scrollExplore: string;
    items: { title: string; tag: string }[];
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
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
    formSent: string;
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
      { label: "Pricing",  href: "#pricing"  },
      { label: "FAQ",      href: "#faq"      },
      { label: "Contact",  href: "#contact"  },
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
    statsCount:    "Personal projects → real results",
    statsRating:   "Built with senior-level craft & attention to detail",
  },
  services: {
    eyebrow:     "Services",
    titlePart1:  "Engineered",
    titleEmphasis: "for",
    titlePart2:  "momentum,",
    closeLabel:  "Close",
    accent:      "designed for awe.",
    description: "One studio. Six disciplines. A workflow optimized to ship measurable wins fast — without sacrificing craft.",
    items: [
      { title: "E-commerce Websites",  description: "High-converting online stores built for sales, speed, and brand.",                          tags: ["Design", "Webflow", "Next.js"], learnMore: "Learn more" },
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
      { n: "01", tag: "Discovery",    title: "We Talk",    body: "We listen first. Tell us about your idea, your audience and what success looks like for you — no forms, no pressure.",
        output: ["Clear brief", "Timeline defined", "No surprises"] },
      { n: "02", tag: "Strategy",     title: "We Plan",    body: "We map out what to build, how it looks and what features matter — all in a document you approve before we write a line of code.",
        output: ["Site structure", "Feature list", "Action plan"] },
      { n: "03", tag: "Design",       title: "We Design",  body: "Your product comes to life visually — clean, branded and built to impress from the first scroll.",
        output: ["Unique design", "Mobile-first", "Ready to approve"] },
      { n: "04", tag: "Development",  title: "We Build",   body: "We code your product fast, clean and tested — landing page, web app or mobile app, ready to ship.",
        output: ["Clean code", "Fast & optimized", "Tested & stable"] },
      { n: "05", tag: "Launch",       title: "We Launch",  body: "We go live, make sure everything runs perfectly and stay close for any tweaks you need after launch.",
        output: ["Live product", "Post-launch support", "You stay in control"] },
    ],
    pills:              ["Clarity at every step", "Aligned with your goals", "Built for speed and quality"],
    pillDescs:          ["Align strategy, users and business goals.", "Iterate fast, validate and build without friction.", "Interaction, motion and detail at every touchpoint."],
    sidebarTagline:     "Structured, transparent, cinematic.",
    sidebarSub:         "You always know what's next.",
    transparencyItems:  ["Weekly check-ins", "Shared roadmap", "Full visibility"],
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
    teamPartners:       "Real partners.",
    features: [
      "Embedded Slack channel from day 1",
      "Weekly demo + Loom updates",
      "Dedicated Figma + GitHub workspace",
      "Lifetime micro-fixes on shipped work",
    ],
  },
  work: {
    eyebrow:       "Featured work",
    titlePart1:    "Selected pieces from",
    accent:        "our 2025–2026 lab.",
    description:   "A few products we engineered end-to-end. Every detail tuned for clarity, depth and feel.",
    scrollExplore: "Scroll to explore",
    items: [
      { title: "Nebula Analytics", tag: "SaaS · Dashboard" },
      { title: "Helio Wallet",     tag: "Fintech · Web App" },
      { title: "Orbit AI",         tag: "AI · Marketing site" },
      { title: "Lumen CMS",        tag: "Platform · Tooling" },
    ],
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
        name: "Landing Page", price: "$100–$200", cadence: "/ project", highlight: false,
        description: "A professional page designed to showcase your business and turn visitors into customers — delivered in days.",
        features: ["Unique design tailored to your brand", "Works on phones, tablets & computers", "Smooth animations & visual effects", "Fast loading speed", "1 round of revisions included"],
        cta: "Start Landing Page",
      },
      {
        name: "Webpage", price: "$350–$500", cadence: "/ project", highlight: true,
        description: "A complete website or web app — designed, built and ready to run your business online from day one.",
        features: ["Everything in Landing Page", "User accounts & login system", "Contact forms & third-party connections", "Online payment ready", "Speed & performance optimized", "30-day post-launch support"],
        cta: "Start Webpage",
      },
      {
        name: "Custom", price: "Custom", cadence: "", highlight: false,
        description: "Need something specific? Mobile app, SaaS platform or ongoing support — we'll build exactly what your business needs.",
        features: ["Mobile apps (iOS & Android)", "SaaS platforms & dashboards", "Bug fixes & updates", "New features & improvements", "Priority support & monthly reports"],
        cta: "Talk to us",
      },
    ],
  },
  faq: {
    eyebrow:    "FAQ",
    titlePart1: "Everything you need",
    accent:     "to decide.",
    items: [
      { q: "How long does a typical project take?",       a: "Landing pages are ready in 3–5 days. E-commerce sites: 5–10 days. Full web apps and SaaS products: 8–16 weeks depending on scope. We always lock the timeline in writing before kickoff." },
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
    formName:      "Your name",
    formEmail:     "Your email",
    formMessage:   "Tell us about your project…",
    formSubmit:    "Send message",
    formSent:      "Message sent!",
    contactTitle:  "Or reach us directly",
    contactMethods: [
      { icon: "✉", label: "Send an email", value: "info@uxcodestudio.com", href: "mailto:info@uxcodestudio.com", hint: "We reply within 24h" },
      { icon: "✆", label: "Call us", value: "+1 562-269-5923", href: "tel:+15622695923", hint: "Sat–Sun · 9am–5pm" },
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
      { label: "Precios",   href: "#pricing"  },
      { label: "FAQ",       href: "#faq"      },
      { label: "Contacto",  href: "#contact"  },
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
    statsCount:    "Proyectos personales → resultados reales",
    statsRating:   "Construido con nivel senior y atención al detalle",
  },
  services: {
    eyebrow:      "Servicios",
    titlePart1:   "Construido",
    titleEmphasis:"para",
    titlePart2:   "el impulso,",
    closeLabel:   "Cerrar",
    accent:       "diseñado para asombrar.",
    description:  "Un estudio. Seis disciplinas. Un flujo de trabajo optimizado para lanzar victorias medibles rápido — sin sacrificar la calidad.",
    items: [
      { title: "Sitios de E-commerce", description: "Tiendas online de alto rendimiento construidas para vender, cargar rápido y posicionarse.",          tags: ["Diseño", "Webflow", "Next.js"], learnMore: "Saber más" },
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
      { n: "01", tag: "Descubrimiento", title: "Hablamos",      body: "Primero escuchamos. Cuéntanos tu idea, tu audiencia y qué significa el éxito para ti — sin formularios, sin presión.",
        output: ["Brief claro", "Timeline definido", "Sin sorpresas"] },
      { n: "02", tag: "Estrategia",     title: "Planificamos",  body: "Mapeamos qué construir, cómo se verá y qué funcionalidades importan — en un documento que apruebas antes de escribir una línea de código.",
        output: ["Estructura del sitio", "Lista de funciones", "Plan de acción"] },
      { n: "03", tag: "Diseño",         title: "Diseñamos",     body: "Tu producto cobra vida visualmente — limpio, con tu marca y pensado para impresionar desde el primer scroll.",
        output: ["Diseño único", "Mobile-first", "Listo para aprobar"] },
      { n: "04", tag: "Desarrollo",     title: "Construimos",   body: "Codificamos tu producto rápido, limpio y probado — landing page, app web o app móvil, lista para lanzar.",
        output: ["Código limpio", "Rápido y optimizado", "Probado y estable"] },
      { n: "05", tag: "Lanzamiento",    title: "Lanzamos",      body: "Lo publicamos, nos aseguramos de que todo funcione perfecto y estamos cerca para cualquier ajuste que necesites.",
        output: ["Producto en vivo", "Soporte post-lanzamiento", "Tú en control"] },
    ],
    pills:             ["Claridad en cada paso", "Alineado con tus metas", "Velocidad y calidad"],
    pillDescs:         ["Alineamos estrategia, usuarios y objetivos de negocio.", "Iteramos rápido, validamos y construimos sin fricción.", "Interacción, motion y detalle en cada punto de contacto."],
    sidebarTagline:    "Estructurado, transparente, cinematográfico.",
    sidebarSub:        "Siempre sabes qué sigue.",
    transparencyItems: ["Check-ins semanales", "Roadmap compartido", "Visibilidad total"],
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
    teamPartners:       "Socios reales.",
    features: [
      "Canal de Slack integrado desde el día 1",
      "Demo semanal + actualizaciones en Loom",
      "Espacio dedicado en Figma + GitHub",
      "Micro-fixes de por vida en el trabajo entregado",
    ],
  },
  work: {
    eyebrow:       "Trabajo destacado",
    titlePart1:    "Piezas seleccionadas de",
    accent:        "nuestro laboratorio 2025–2026.",
    description:   "Algunos productos que construimos de principio a fin. Cada detalle calibrado para claridad, profundidad y sensación.",
    scrollExplore: "Desliza para explorar",
    items: [
      { title: "Nebula Analytics", tag: "SaaS · Dashboard" },
      { title: "Helio Wallet",     tag: "Fintech · App Web" },
      { title: "Orbit AI",         tag: "IA · Sitio de marketing" },
      { title: "Lumen CMS",        tag: "Plataforma · Herramientas" },
    ],
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
        name: "Landing Page", price: "$100–$200", cadence: "/ proyecto", highlight: false,
        description: "Una página profesional para mostrar tu negocio y convertir visitas en clientes — lista en días.",
        features: ["Diseño único adaptado a tu marca", "Funciona en celular, tablet y computadora", "Animaciones y efectos visuales", "Carga rápida", "1 ronda de revisiones incluida"],
        cta: "Comenzar Landing Page",
      },
      {
        name: "Página Web", price: "$350–$500", cadence: "/ proyecto", highlight: true,
        description: "Un sitio web o app completa — diseñada, desarrollada y lista para hacer crecer tu negocio desde el día uno.",
        features: ["Todo lo de Landing Page", "Cuentas de usuario e inicio de sesión", "Formularios de contacto e integraciones", "Pagos en línea listos", "Velocidad y rendimiento optimizados", "30 días de soporte post-lanzamiento"],
        cta: "Comenzar Página Web",
      },
      {
        name: "Custom", price: "Custom", cadence: "", highlight: false,
        description: "¿Necesitas algo específico? App móvil, plataforma SaaS o soporte continuo — construimos exactamente lo que tu negocio necesita.",
        features: ["Apps móviles (iOS y Android)", "Plataformas SaaS y dashboards", "Corrección de errores y actualizaciones", "Nuevas funciones y mejoras", "Soporte prioritario e informes mensuales"],
        cta: "Contáctanos",
      },
    ],
  },
  faq: {
    eyebrow:    "Preguntas frecuentes",
    titlePart1: "Todo lo que necesitas",
    accent:     "para decidir.",
    items: [
      { q: "¿Cuánto tiempo dura un proyecto típico?",        a: "Las landing pages están listas en 3–5 días. Sitios e-commerce: 5–10 días. Apps web y plataformas SaaS: 8–16 semanas según el alcance. Siempre fijamos el plazo por escrito antes de empezar." },
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
    formName:      "Tu nombre",
    formEmail:     "Tu email",
    formMessage:   "Cuéntanos sobre tu proyecto…",
    formSubmit:    "Enviar mensaje",
    formSent:      "¡Mensaje enviado!",
    contactTitle:  "O contáctanos directamente",
    contactMethods: [
      { icon: "✉", label: "Envíanos un email", value: "info@uxcodestudio.com", href: "mailto:info@uxcodestudio.com", hint: "Respondemos en 24h" },
      { icon: "✆", label: "Llámanos", value: "+1 562-269-5923", href: "tel:+15622695923", hint: "Sáb–Dom · 9am–5pm" },
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
