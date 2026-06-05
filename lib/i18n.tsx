"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "es";

export type ServiceItem   = { title: string; description: string; tags: string[]; learnMore: string };
export type StepItem      = { n: string; tag: string; title: string; body: string; output: string[] };
export type StatItem      = { value: number; suffix: string; label: string; sub: string };
export type PlanItem      = { name: string; price: string; cadence: string; description: string; features: string[]; cta: string; highlight: boolean; legalNote?: string };
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
    descShort: string;
    cta1: string;
    cta2: string;
    statsCount: string;
    statsRating: string;
    features: string[];
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
    eyebrow: string;
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
    sectionLegal: string;
    plans: PlanItem[];
  };
  faq: {
    eyebrow: string;
    titlePart1: string;
    accent: string;
    whyTitle: string;
    whyHeadline: string;
    whyDesc: string;
    whyFeatures: string[];
    items: FaqItem[];
  };
  cta: {
    eyebrow: string;
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
    startProject: "Start Now",
    links: [
      { label: "Services", href: "#services" },
      { label: "Process",  href: "#process"  },
      { label: "Pricing",  href: "#pricing"  },
      { label: "Contact",  href: "#contact"  },
      { label: "FAQ",      href: "#faq"      },
    ],
  },
  hero: {
    badge:         "Booking new projects · Q3 2026",
    headlinePart1: "We design affordable",
    headlinePart2: "",
    rotating:      ["WEBSITES", "LANDINGS", "MOBILE APPS", "AND MORE…"],
    descShort:     "Customers often search for businesses directly from their phones through Google Maps, Apple Maps, Siri, social media, or local search before making a decision.",
    desc:          "Your website gives your business a central place to build trust, show your services, display your products, share your contact information, and help customers understand what you do before they call, visit, book, or buy. That's where UXCODESTUDIO comes in, helping your business build a clear, professional online presence that customers can trust. Don't overthink it. Start today.",
    cta1:          "Start Now",
    cta2:          "View our work",
    statsCount:    "Personal projects → real results",
    statsRating:   "Built with senior-level craft & attention to detail",
    features:      ["Quick turnaround", "Professional design", "Bilingual service (Spanish & English)", "Built for U.S. businesses"],
  },
  services: {
    eyebrow:     "SERVICES",
    titlePart1:  "Digital Solutions",
    titleEmphasis: "",
    titlePart2:  "",
    closeLabel:  "Close",
    accent:      "Made Simple.",
    description: "We design websites and digital tools for local businesses, growing brands, entrepreneurs, and service providers.",
    items: [
      { title: "Business Websites",    description: "A professional website that presents your business clearly and helps customers take action.", tags: [], learnMore: "Learn more" },
      { title: "Landing Page",         description: "A focused page designed for one offer, service, campaign, or promotion.",                   tags: [], learnMore: "Learn more" },
      { title: "Online Store",         description: "A clean online store where customers can view your products and buy with confidence.",          tags: [], learnMore: "Learn more" },
      { title: "Hosting & Management", description: "Keep your website online without dealing with complicated technical setup.",                   tags: [], learnMore: "Learn more" },
      { title: "Booking & Contact",     description: "Make it easier for customers to schedule, call, message, or request a quote.",                              tags: [], learnMore: "Learn more" },
      { title: "Website Updates",       description: "Already have a website? We can improve the design, update your content, fix mobile issues, and make it feel more professional.", tags: [], learnMore: "Learn more" },
      { title: "Mobile Apps",           description: "A mobile app gives your business a more direct and personalized way to connect with customers from their phones.",              tags: [], learnMore: "Learn more" },
    ],
  },
  process: {
    eyebrow:           "Our Process",
    headlinePart1:    "From idea",
    headlineEmphasis: "to online",
    headlinePart2:    "",
    headlineAccent:   "in 5 steps.",
    sub:              "Building a website does not have to feel complicated. We guide you through each step, keep you updated, and make sure you always know what is happening next. No jargon. No surprises. Just results.",
    steps: [
      { n: "01", tag: "Discovery",  title: "Discovery",  body: "You tell us about your business, your customers, and what you want your website to do for you. You walk away from this step with a clear direction, a defined goal, and confidence that we understand your business.",

        output: ["Business goals defined", "Target audience clear", "Project direction set"] },
      { n: "02", tag: "Planning",   title: "Planning",   body: "We organize your website before building a single pixel. You will see exactly what sections, content, and features your site will have — so there are no surprises during design or build.",

        output: ["Site structure", "Sections & features", "Content outline"] },
      { n: "03", tag: "Design",     title: "Design",     body: "You get a professional design built around your brand. Before we write a single line of code, you see and approve the look — so the final website matches your expectations, not just ours.",

        output: ["Professional design", "Mobile-first", "Ready to approve"] },
      { n: "04", tag: "Build",      title: "Build",      body: "We build your website and connect every feature your customers need — forms, call buttons, maps, booking links, and more. You can follow progress and ask questions at any point.",

        output: ["Website built", "All features connected", "Tested & working"] },
      { n: "05", tag: "Launch",     title: "Launch",     body: "Before going live, we test every page, button, and mobile view. After launch, your business has a professional online presence — and you know exactly how to use it.",

        output: ["Website live", "Mobile tested", "Ready for customers"] },
    ],
    pills:              [],
    pillDescs:          [],
    sidebarTagline:     "",
    sidebarSub:         "",
    transparencyItems:  [],
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
    eyebrow:     "PRICING",
    title:       "",
    accent:      "",
    description: "Flexible, affordable options for different business needs. Start simple or build something more complete. Every project is quoted clearly before we begin. Get a fixed quote within 24h.",
    badge:       "Most Popular",
    sectionLegal: "*Starting prices are based on standard project scope. Final pricing may vary depending on pages, features, content, integrations, revisions, timeline, hosting needs, third party fees, and project complexity. Promotional hosting pricing applies to the first 36 months only. Terms and conditions apply.",
    plans: [
      {
        name: "Landing Page", price: "Starting at $150", cadence: "", highlight: false,
        description: "Best for a single service, offer, campaign, or simple business presence.",
        features: ["One professional page", "Contact form or call button", "Mobile-friendly design", "Basic SEO setup", "Social media links"],
        cta: "Get Started",
        legalNote: "Launch pricing is available for a limited time. Start now and lock in your introductory rate before prices increase.",
      },
      {
        name: "Business Website", price: "Starting at $400", cadence: "", highlight: true,
        description: "Best for businesses that need a complete website with more information, services, and credibility.",
        features: ["Multi-page professional design", "Services & about sections", "Contact form & call button", "Google Maps integration", "Mobile-friendly & fast"],
        cta: "Get Started",
        legalNote: "Launch pricing is available for a limited time. Start now and lock in your introductory rate before prices increase.",
      },
      {
        name: "Online Store", price: "Starting at $400", cadence: "", highlight: false,
        description: "A clean e-commerce website where customers can view your products, add them to a cart, and buy online.",
        features: ["Product pages & catalog", "Shopping cart & checkout", "Secure payment connection", "Mobile-friendly design", "Basic store organization"],
        cta: "Get Started",
        legalNote: "Launch pricing is available for a limited time. Start now and lock in your introductory rate before prices increase.",
      },
      {
        name: "Booking & Contact", price: "Starting at $100", cadence: "", highlight: false,
        description: "A simple page that helps customers contact your business, request information, schedule a service, or ask for a quote.",
        features: ["Contact form", "Call & email buttons", "Location & map", "Booking button or calendar link", "Mobile-friendly design"],
        cta: "Get Started",
        legalNote: "Launch pricing is available for a limited time. Start now and lock in your introductory rate before prices increase.",
      },
      {
        name: "Website Updates", price: "Starting at $350", cadence: "", highlight: false,
        description: "Refresh your existing site with updated content, images, layout fixes, and a cleaner, more professional look.",
        features: ["Text & image updates", "Layout improvements", "Mobile fixes", "Section cleanup", "Visual refresh"],
        cta: "Get Started",
        legalNote: "Launch pricing is available for a limited time. Start now and lock in your introductory rate before prices increase.",
      },
      {
        name: "Hosting Management", price: "$11.99", cadence: "/ month · first 36 months, then $19.99/mo", highlight: false,
        description: "Managed hosting that keeps your website online, secure, and properly configured — no technical setup on your end.",
        features: ["Domain connection", "Hosting setup (Bluehost)", "SSL security certificate", "Monthly uptime monitoring", "Technical support"],
        cta: "Get Started",
        legalNote: "Launch pricing is available for a limited time. Start now and lock in your introductory rate before prices increase.",
      },
      {
        name: "Custom", price: "Custom", cadence: "", highlight: false,
        description: "Mobile app, advanced web app, or a unique project? We build exactly what your business needs.",
        features: ["Mobile apps (iOS & Android)", "Advanced web applications", "Custom integrations", "Tailored scope & timeline", "Direct consultation"],
        cta: "Talk to us",
      },
    ],
  },
  faq: {
    eyebrow:    "FAQ",
    titlePart1: "Everything you need",
    accent:     "to decide.",
    whyTitle:    "Why Choose UXCODESTUDIO",
    whyHeadline: "Professional websites without the complicated process.",
    whyDesc:     "We help businesses move online with clear design, simple communication, and practical digital solutions. Whether you are starting small, growing locally, or building a more premium presence, your website should match your next level.",
    whyFeatures: ["Clear pricing", "Fast communication", "Professional design", "Bilingual support", "Mobile-first experience", "Built for the U.S. market"],
    items: [
      { q: "How long does a typical project take?",       a: "Landing pages are ready in 3–5 business days. Business websites: 1–2 weeks. Online stores: 2–3 weeks. Larger or custom projects are quoted individually. We always confirm the exact timeline in writing before we start." },
      { q: "Do you work with our existing design or brand?", a: "Absolutely. We can pick up an existing system and elevate it, or build everything from scratch. We'll audit your brand in the discovery call and recommend the most efficient path." },
      { q: "What tech stack do you build on?",            a: "We build with Next.js, React, and Tailwind CSS — modern tools that result in fast, clean, and reliable websites. For online stores, we connect Shopify or WooCommerce. We recommend the right tool for your budget and goals, not the most complex one." },
      { q: "Can you improve or redesign an existing website?", a: "Yes. If you already have a website or online system but it feels outdated, slow, or unprofessional, we can help. We review what you have, identify what needs to change, and deliver a cleaner, more effective result — whether that means a full redesign or targeted improvements." },
      { q: "Do you offer ongoing retainers?",             a: "Yes. After launch, most clients move to a monthly partnership for iteration and new features. Contact us for details." },
      { q: "Do I need to provide content?",               a: "We can work with whatever you have. If you already have text, photos, or a logo, we will use them. If you do not have content yet, we will guide you on what we need and help structure it during the project." },
      { q: "How do payments work?",                       a: "50% upfront to confirm your start date, 50% on delivery. Every project includes a fixed quote before we begin — no surprises. We invoice in USD." },
    ],
  },
  cta: {
    eyebrow:       "Contact",
    badge:         "LET'S BUILD",
    headlinePart1: "Ready to build your next",
    headlinePart2: "online presence?",
    description:   "Tell us about your business and what you need. We will review your project and send you a clear quote.",
    cta1:          "Book a discovery call",
    cta2:          "Or browse the work",
    features:      ["Fixed quote in 24h", "We support small businesses", "Remote-first · Worldwide"],
    formName:      "Your name",
    formEmail:     "Your email",
    formMessage:   "E.g. I need a website for my business in Downey, CA. Currently I have no website and I want to start attracting more customers online.",
    formSubmit:    "Send message",
    formSent:      "Message sent!",
    contactTitle:  "Or reach us directly",
    contactMethods: [
      { icon: "✉", label: "Send an email", value: "info@uxcodestudio.com", href: "mailto:info@uxcodestudio.com", hint: "We reply within 24h" },
      { icon: "💬", label: "WhatsApp / Text", value: "+1 562-269-5923", href: "https://wa.me/15622695923", hint: "Quick reply via WhatsApp" },
    ],
  },
  footer: {
    description: "Downey, CA 90240",
    columns: [
      { title: "Studio",    links: ["About", "Process", "Contact"] },
      { title: "Services",  links: ["Business Websites", "Landing Page", "Online Store", "Hosting & Management", "Booking & Contact", "Website Updates", "Mobile Apps"] },
      { title: "Resources", links: ["Pricing", "FAQ", "Blog"] },
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
    startProject: "Empieza Ahora",
    links: [
      { label: "Servicios", href: "#services" },
      { label: "Proceso",   href: "#process"  },
      { label: "Precios",   href: "#pricing"  },
      { label: "Contacto",  href: "#contact"  },
      { label: "FAQ",       href: "#faq"      },
    ],
  },
  hero: {
    badge:         "Proyectos abiertos · Q3 2026",
    headlinePart1: "Diseñamos",
    headlinePart2: "",
    rotating:      ["SITIOS WEB", "LANDINGS", "MOBILE APPS", "Y MÁS…"],
    descShort:     "Los clientes suelen buscar negocios directamente desde sus teléfonos a través de Google Maps, Apple Maps, Siri, redes sociales o búsqueda local antes de tomar una decisión.",
    desc:          "Tu sitio web le da a tu negocio un lugar central para generar confianza, mostrar tus servicios, exhibir tus productos, compartir tu información de contacto y ayudar a los clientes a entender lo que haces antes de que llamen, visiten, reserven o compren. Ahí es donde entra UXCODESTUDIO, ayudando a tu negocio a construir una presencia en línea clara y profesional en la que los clientes puedan confiar. No lo pienses demasiado. Empieza hoy.",
    cta1:          "Empieza Ahora",
    cta2:          "Ver nuestro trabajo",
    statsCount:    "Proyectos personales → resultados reales",
    statsRating:   "Construido con nivel senior y atención al detalle",
    features:      ["Entrega rápida", "Diseño profesional", "Servicio bilingüe (Español & Inglés)", "Para negocios en EE.UU."],
  },
  services: {
    eyebrow:      "SERVICIOS",
    titlePart1:   "Soluciones Digitales",
    titleEmphasis:"",
    titlePart2:   "",
    closeLabel:   "Cerrar",
    accent:       "Simples.",
    description:  "Diseñamos sitios web y herramientas digitales para negocios locales, marcas en crecimiento, emprendedores y proveedores de servicios.",
    items: [
      { title: "Sitios Web de Negocio", description: "Un sitio web profesional que presenta tu negocio claramente y ayuda a los clientes a tomar acción.",  tags: [], learnMore: "Saber más" },
      { title: "Landing Page",         description: "Una página enfocada diseñada para una oferta, servicio, campaña o promoción específica.",           tags: [], learnMore: "Saber más" },
      { title: "Tienda en Línea",      description: "Una tienda en línea donde tus clientes pueden ver tus productos y comprar con confianza.",           tags: [], learnMore: "Saber más" },
      { title: "Hosting y Gestión",    description: "Mantén tu sitio web en línea sin lidiar con configuraciones técnicas complicadas.",                  tags: [], learnMore: "Saber más" },
      { title: "Reservas y Contacto",   description: "Facilita que los clientes agenden, llamen, escriban o soliciten una cotización.",                               tags: [], learnMore: "Saber más" },
      { title: "Actualizaciones Web",   description: "¿Ya tienes un sitio? Mejoramos el diseño, actualizamos el contenido, corregimos errores y lo hacemos más profesional.", tags: [], learnMore: "Saber más" },
      { title: "Apps Móviles",          description: "Una app móvil le da a tu negocio una forma más directa y personalizada de conectar con los clientes desde sus teléfonos.",   tags: [], learnMore: "Saber más" },
    ],
  },
  process: {
    eyebrow:           "Nuestro Proceso",
    headlinePart1:    "De la idea",
    headlineEmphasis: "a estar en línea",
    headlinePart2:    "",
    headlineAccent:   "en 5 pasos.",
    sub:              "Tener un sitio web no tiene que ser complicado. Te guiamos en cada paso para que tu negocio pase de la idea a una presencia en línea con claridad, dirección y resultados profesionales.",
    steps: [
      { n: "01", tag: "Descubrimiento", title: "Descubrimiento", body: "Empezamos conociendo tu negocio, tus servicios, tus clientes y qué quieres lograr con tu sitio web. Esto nos ayuda a entender qué necesita comunicar tu sitio y qué acciones deben tomar tus clientes.",
        output: ["Objetivos definidos", "Audiencia identificada", "Dirección clara"] },
      { n: "02", tag: "Planificación",  title: "Planificación",  body: "Antes de diseñar, organizamos la estructura de tu sitio web. Definimos las secciones principales, el contenido, las funciones, botones, opciones de contacto y la información más importante que tus clientes necesitan ver.",
        output: ["Estructura del sitio", "Secciones y funciones", "Esquema de contenido"] },
      { n: "03", tag: "Diseño",         title: "Diseño",         body: "Creamos un diseño limpio y profesional que representa tu negocio y hace que tu información sea fácil de entender. Tu sitio está diseñado para verse bien en celulares, tablets y computadoras.",
        output: ["Diseño profesional", "Mobile-first", "Listo para aprobar"] },
      { n: "04", tag: "Construcción",   title: "Construcción",   body: "Una vez clara la dirección, construimos el sitio y conectamos las partes importantes. Esto puede incluir formularios, botones de llamada, links de reserva, mapas, redes sociales, secciones de servicios y otras funciones que tu negocio necesita.",
        output: ["Sitio construido", "Todo conectado", "Probado y funcionando"] },
      { n: "05", tag: "Lanzamiento",    title: "Lanzamiento",    body: "Antes de publicar, revisamos las páginas, probamos los botones, verificamos la versión móvil y nos aseguramos de que todo funcione correctamente. Al lanzar, tu negocio tiene una presencia profesional en línea lista para que los clientes te visiten, contacten, reserven o compren.",
        output: ["Sitio en línea", "Versión móvil verificada", "Listo para clientes"] },
    ],
    pills:             [],
    pillDescs:         [],
    sidebarTagline:    "",
    sidebarSub:        "",
    transparencyItems: [],
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
    eyebrow:     "PRECIOS",
    title:       "",
    accent:      "",
    description: "Opciones flexibles y accesibles para diferentes necesidades de negocio. Empieza simple o construye algo más completo. Cada proyecto se cotiza claramente antes de comenzar. Obtén una cotización fija en 24h.",
    badge:       "Más Popular",
    sectionLegal: "*Los precios iniciales están basados en un alcance estándar de proyecto. El precio final puede variar según páginas, funciones, contenido, integraciones, revisiones, cronograma, necesidades de hosting, tarifas de terceros y complejidad del proyecto. El precio promocional de hosting aplica solo para los primeros 36 meses. Aplican términos y condiciones.",
    plans: [
      {
        name: "Landing Page", price: "Desde $150", cadence: "", highlight: false,
        description: "Ideal para un solo servicio, oferta, campaña o presencia de negocio simple.",
        features: ["Una página profesional", "Formulario de contacto o botón de llamada", "Diseño compatible con móvil", "Configuración básica de SEO", "Links a redes sociales"],
        cta: "Comenzar",
        legalNote: "Precio de lanzamiento disponible por tiempo limitado. Comienza ahora y asegura tu tarifa introductoria antes de que suban los precios.",
      },
      {
        name: "Sitio Web de Negocio", price: "Desde $400", cadence: "", highlight: true,
        description: "Ideal para negocios que necesitan un sitio completo con más información, servicios y credibilidad.",
        features: ["Diseño multipágina profesional", "Secciones de servicios y acerca de", "Formulario de contacto y llamada", "Integración con Google Maps", "Diseño compatible con móvil"],
        cta: "Comenzar",
        legalNote: "Precio de lanzamiento disponible por tiempo limitado. Comienza ahora y asegura tu tarifa introductoria antes de que suban los precios.",
      },
      {
        name: "Tienda en Línea", price: "Desde $400", cadence: "", highlight: false,
        description: "Un sitio de e-commerce donde los clientes pueden ver tus productos, agregarlos al carrito y comprar en línea.",
        features: ["Páginas de producto y catálogo", "Carrito y checkout", "Conexión de pago seguro", "Diseño compatible con móvil", "Organización básica de tienda"],
        cta: "Comenzar",
        legalNote: "Precio de lanzamiento disponible por tiempo limitado. Comienza ahora y asegura tu tarifa introductoria antes de que suban los precios.",
      },
      {
        name: "Reservas y Contacto", price: "Desde $100", cadence: "", highlight: false,
        description: "Una página simple que ayuda a los clientes a contactarte, solicitar información, agendar un servicio o pedir una cotización.",
        features: ["Formulario de contacto", "Botones de llamada y correo", "Ubicación y mapa", "Botón de reserva o link de calendario", "Diseño compatible con móvil"],
        cta: "Comenzar",
        legalNote: "Precio de lanzamiento disponible por tiempo limitado. Comienza ahora y asegura tu tarifa introductoria antes de que suban los precios.",
      },
      {
        name: "Actualizaciones Web", price: "Desde $350", cadence: "", highlight: false,
        description: "Renueva tu sitio actual con contenido e imágenes actualizadas, ajustes de diseño y un look más limpio y profesional.",
        features: ["Actualización de texto e imágenes", "Mejoras de diseño", "Correcciones para móvil", "Limpieza de secciones", "Refresco visual"],
        cta: "Comenzar",
        legalNote: "Precio de lanzamiento disponible por tiempo limitado. Comienza ahora y asegura tu tarifa introductoria antes de que suban los precios.",
      },
      {
        name: "Hosting y Gestión", price: "$11.99", cadence: "/ mes · primeros 36 meses, luego $19.99/mes", highlight: false,
        description: "Hosting administrado que mantiene tu sitio en línea, seguro y bien configurado — sin que toques nada técnico.",
        features: ["Conexión de dominio", "Configuración de hosting (Bluehost)", "Certificado SSL", "Monitoreo mensual", "Soporte técnico"],
        cta: "Comenzar",
        legalNote: "Precio de lanzamiento disponible por tiempo limitado. Comienza ahora y asegura tu tarifa introductoria antes de que suban los precios.",
      },
      {
        name: "Custom", price: "Custom", cadence: "", highlight: false,
        description: "¿App móvil, aplicación web avanzada o un proyecto único? Construimos exactamente lo que tu negocio necesita.",
        features: ["Apps móviles (iOS y Android)", "Aplicaciones web avanzadas", "Integraciones personalizadas", "Alcance y cronograma a medida", "Consulta directa"],
        cta: "Contáctanos",
      },
    ],
  },
  faq: {
    eyebrow:    "Preguntas frecuentes",
    titlePart1: "Todo lo que necesitas",
    accent:     "para decidir.",
    whyTitle:    "Por qué elegir UXCODESTUDIO",
    whyHeadline: "Sitios web profesionales sin el proceso complicado.",
    whyDesc:     "Ayudamos a los negocios a estar en línea con un diseño claro, comunicación sencilla y soluciones digitales prácticas. Ya sea que estés empezando, creciendo localmente o construyendo una presencia más premium, tu sitio web debe estar a la altura de tu siguiente nivel.",
    whyFeatures: ["Precios claros", "Comunicación rápida", "Diseño profesional", "Soporte bilingüe", "Experiencia mobile-first", "Hecho para el mercado de EE.UU."],
    items: [
      { q: "¿Cuánto tiempo tarda un proyecto típico?",        a: "Las landing pages están listas en 3–5 días hábiles. Sitios web de negocio: 1–2 semanas. Tiendas en línea: 2–3 semanas. Proyectos más grandes se cotizan de forma individual. Siempre confirmamos el plazo exacto por escrito antes de comenzar." },
      { q: "¿Trabajan con nuestro diseño o marca existente?",a: "Absolutamente. Podemos tomar un sistema existente y elevarlo, o construir todo desde cero. Auditaremos tu marca en la llamada de discovery y recomendaremos el camino más eficiente." },
      { q: "¿Qué stack tecnológico usan?",                   a: "Nuestro stack principal es Next.js + TypeScript + Tailwind, con GSAP / Framer Motion / Three.js para motion. También trabajamos en Webflow, Shopify Hydrogen y CMS headless cuando tiene sentido." },
      { q: "¿Pueden mejorar o rediseñar un sitio web existente?", a: "Sí. Si ya tienes un sitio web o sistema en línea pero se ve desactualizado, lento o poco profesional, podemos ayudarte. Revisamos lo que tienes, identificamos qué debe cambiar y entregamos un resultado más limpio y efectivo — ya sea un rediseño completo o mejoras específicas." },
      { q: "¿Ofrecen retainers continuos?",                  a: "Sí. Después del lanzamiento, la mayoría de los clientes pasan a una alianza mensual para iteración y nuevas funcionalidades. Contáctanos para más detalles." },
      { q: "¿Cómo funcionan los pagos?",                     a: "50% para reservar tu fecha de inicio, 50% al lanzamiento para proyectos de alcance fijo. Los retainers se cobran mensualmente por adelantado. Facturamos en USD via Stripe / transferencia." },
    ],
  },
  cta: {
    eyebrow:       "Contacto",
    badge:         "CONSTRUYAMOS",
    headlinePart1: "¿Listo para construir tu",
    headlinePart2: "presencia en línea?",
    description:   "Cuéntanos sobre tu negocio y lo que necesitas. Revisaremos tu proyecto y te enviaremos una cotización clara.",
    cta1:          "Reserva una llamada",
    cta2:          "O ve nuestro trabajo",
    features:      ["Cotización fija en 24h", "Apoyamos pequeños negocios", "Remoto · Para EE.UU."],
    formName:      "Tu nombre",
    formEmail:     "Tu email",
    formMessage:   "Ej. Necesito un sitio web para mi negocio en Downey, CA. Actualmente no tengo sitio web y quiero empezar a atraer más clientes en línea.",
    formSubmit:    "Enviar mensaje",
    formSent:      "¡Mensaje enviado!",
    contactTitle:  "O contáctanos directamente",
    contactMethods: [
      { icon: "✉", label: "Envíanos un email", value: "info@uxcodestudio.com", href: "mailto:info@uxcodestudio.com", hint: "Respondemos en 24h" },
      { icon: "💬", label: "WhatsApp / Texto", value: "+1 562-269-5923", href: "https://wa.me/15622695923", hint: "Respuesta rápida por WhatsApp" },
    ],
  },
  footer: {
    description: "Downey, CA 90240",
    columns: [
      { title: "Estudio",   links: ["Acerca de", "Proceso", "Contacto"] },
      { title: "Servicios", links: ["Sitios Web de Negocio", "Landing Page", "Tienda en Línea", "Hosting y Gestión", "Reservas y Contacto", "Actualizaciones Web", "Apps Móviles"] },
      { title: "Recursos",  links: ["Precios", "FAQ", "Blog"] },
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
