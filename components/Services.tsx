"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useLanguage } from "@/lib/i18n";
import { BookingModal } from "./BookingModal";
import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  ShoppingBag, LayoutTemplate, Code2, Layers, Smartphone, PencilLine, TabletSmartphone,
  Zap, Gem, BarChart3, Handshake,
} from "lucide-react";


/* ── App icons (lucide-react) ────────────────────────────────────────────────── */
const SERVICE_ICONS = [
  <ShoppingBag   key="cart"   className="h-7 w-7 text-white" strokeWidth={1.75} />,
  <LayoutTemplate key="layout" className="h-7 w-7 text-white" strokeWidth={1.75} />,
  <Code2         key="code"   className="h-7 w-7 text-white" strokeWidth={1.75} />,
  <Layers        key="layers" className="h-7 w-7 text-white" strokeWidth={1.75} />,
  <Smartphone    key="phone"  className="h-7 w-7 text-white" strokeWidth={1.75} />,
  <PencilLine    key="pencil" className="h-7 w-7 text-white" strokeWidth={1.75} />,
  <TabletSmartphone key="mobile2" className="h-7 w-7 text-white" strokeWidth={1.75} />,
];

/* ── Per-card static 3D tilt (mirrors the reference layout) ───────────────────── */
const SERVICE_TILT = [
  { rx: 7, ry: 9 },   // top-left  → faces right
  { rx: 6, ry: 0 },   // top-center
  { rx: 7, ry: -9 },  // top-right → faces left
  { rx: 6, ry: 7 },   // bottom-left
  { rx: 6, ry: -7 },  // bottom-right
];
const VIOLET = "#8b5cf6";

/* ── Service hero images (panel top) ────────────────────────────────────────── */
const SERVICE_HERO_IMAGES = [
  "/Website.png",
  "/LandingPage.png",
  "/OnlineStore.png",
  "/Hosting.png",
  "/Booking.png",
  "/WebsiteUpdates.png",
  "/MobileApps.png",
];


/* ── Card visual configs ────────────────────────────────────────────────────── */
const VISUALS = [
  { bg: "linear-gradient(135deg,#3b30cc 0%,#4f6ef7 100%)", glow: "rgba(79,110,247,0.55)",  glowBg: "rgba(79,110,247,0.10)",  border: "rgba(79,110,247,0.35)"  },
  { bg: "linear-gradient(135deg,#0a9bd4 0%,#00d4ff 100%)", glow: "rgba(0,212,255,0.50)",   glowBg: "rgba(0,212,255,0.09)",   border: "rgba(0,212,255,0.35)"   },
  { bg: "linear-gradient(135deg,#5b21b6 0%,#7c3aed 100%)", glow: "rgba(124,58,237,0.55)",  glowBg: "rgba(124,58,237,0.10)",  border: "rgba(124,58,237,0.35)"  },
  { bg: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)", glow: "rgba(59,130,246,0.50)",  glowBg: "rgba(59,130,246,0.09)",  border: "rgba(59,130,246,0.35)"  },
  { bg: "linear-gradient(135deg,#6d28d9 0%,#a855f7 100%)", glow: "rgba(168,85,247,0.50)",  glowBg: "rgba(168,85,247,0.09)",  border: "rgba(168,85,247,0.35)"  },
  { bg: "linear-gradient(135deg,#0284c7 0%,#06b6d4 100%)", glow: "rgba(6,182,212,0.50)",   glowBg: "rgba(6,182,212,0.09)",   border: "rgba(6,182,212,0.35)"   },
  { bg: "linear-gradient(135deg,#065f46 0%,#059669 100%)", glow: "rgba(5,150,105,0.50)",   glowBg: "rgba(5,150,105,0.09)",   border: "rgba(5,150,105,0.35)"   },
];

/* ── Extended service data ──────────────────────────────────────────────────── */
type DetailCopy = {
  eyebrow: string;
  extendedDesc: string;
  includes: string[];
  idealFor?: string[];
  cta: string;
};
type ServiceDetail = DetailCopy & {
  accentColor: string;
  accentRgb: string;
  heroBg: string;
  es: DetailCopy;
};

const SERVICE_DETAILS: ServiceDetail[] = [
  {
    eyebrow: "Most Popular",
    extendedDesc: "A business website is your company's main online home. It gives customers a clear place to learn who you are, what you offer, where you are located, and how to contact you.\n\nIt is perfect for businesses that need to look more professional, build trust, explain their services, and make it easier for customers to call, visit, book, or request a quote.\n\nWith a business website, your company can create a stronger first impression, support your Google and Apple Maps presence, and give customers the information they need before making a decision.",
    includes: ["Professional design tailored to your brand", "Mobile-friendly on all devices", "Contact form & click-to-call button", "Google Maps & location integration", "Core Web Vitals optimized", "Basic SEO setup", "Analytics integration (Google Analytics)", "Easy to update yourself"],
    idealFor: ["Local businesses", "Service providers", "Restaurants & retail", "Contractors & freelancers"],
    cta: "Get Your Business Website",
    accentColor: "#4f6ef7", accentRgb: "79,110,247",
    heroBg: "linear-gradient(135deg,#0a0f2e 0%,#1a1060 60%,#0d1845 100%)",
    es: {
      eyebrow: "Más Popular",
      extendedDesc: "Un sitio web de negocio es el hogar principal de tu empresa en línea. Les da a los clientes un lugar claro para conocer quién eres, qué ofreces, dónde estás ubicado y cómo contactarte.\n\nEs perfecto para negocios que necesitan verse más profesionales, generar confianza, explicar sus servicios y facilitar que los clientes llamen, visiten, reserven o soliciten una cotización.\n\nCon un sitio web de negocio, tu empresa puede causar una mejor primera impresión, reforzar tu presencia en Google y Apple Maps, y darle a los clientes la información que necesitan antes de tomar una decisión.",
      includes: ["Diseño profesional para tu marca", "Compatible con celular y tablet", "Formulario de contacto y botón de llamada", "Integración con Google Maps", "Core Web Vitals optimizado", "SEO básico configurado", "Integración con Analytics (Google Analytics)", "Fácil de actualizar"],
      idealFor: ["Negocios locales", "Proveedores de servicios", "Restaurantes y tiendas", "Contratistas y freelancers"],
      cta: "Obtén tu Sitio Web",
    },
  },
  {
    eyebrow: "Landing Page",
    extendedDesc: "A landing page is a focused one-page website designed for a specific goal: promote a service, present an offer, collect leads, receive calls, or guide customers to take action.\n\nIt is perfect for businesses that want to advertise one main service, launch a promotion, test a new idea, or create a simple online presence without needing a full website.\n\nWith a landing page, your business can give customers the key information they need quickly, clearly, and professionally. No distractions. Just one clear message and one clear action.",
    includes: ["One professional page", "Clear headline and message", "Service or offer section", "Benefits and key information", "Contact form or call button", "Mobile-friendly design", "Core Web Vitals optimized", "Basic SEO setup", "Analytics integration", "Social media links", "Clear call to action"],
    idealFor: ["New businesses", "Service promotions", "Campaign launches", "Simple online presence"],
    cta: "Get Your Landing Page",
    accentColor: "#00d4ff", accentRgb: "0,212,255",
    heroBg: "linear-gradient(135deg,#041824 0%,#083048 60%,#041824 100%)",
    es: {
      eyebrow: "Landing Page",
      extendedDesc: "Una landing page es un sitio web de una sola página diseñado para un objetivo específico: promover un servicio, presentar una oferta, capturar leads, recibir llamadas o guiar a los clientes a tomar acción.\n\nEs perfecta para negocios que quieren publicitar un servicio principal, lanzar una promoción, probar una nueva idea o crear una presencia en línea simple sin necesitar un sitio web completo.\n\nCon una landing page, tu negocio puede dar a los clientes la información clave que necesitan de manera rápida, clara y profesional. Sin distracciones. Solo un mensaje claro y una acción clara.",
      includes: ["Una página profesional", "Encabezado y mensaje claro", "Sección de servicio u oferta", "Beneficios e información clave", "Formulario de contacto o botón de llamada", "Diseño compatible con móvil", "Core Web Vitals optimizado", "Configuración básica de SEO", "Integración con Analytics", "Links a redes sociales", "Llamada a la acción clara"],
      idealFor: ["Negocios nuevos", "Promociones de servicios", "Lanzamientos de campaña", "Presencia en línea simple"],
      cta: "Obtén tu Landing Page",
    },
  },
  {
    eyebrow: "Online Store",
    extendedDesc: "An online store is a website where your customers can see your products, learn about them, add them to a cart, and buy directly from your business.\n\nIt is perfect for businesses that sell physical products, digital products, packages, memberships, or services that can be paid for online.\n\nWith an online store, your business can sell beyond your physical location, stay open 24/7, and give customers a simple way to shop from their phone or computer.",
    includes: ["Product pages", "Product images and descriptions", "Shopping cart", "Secure checkout setup", "Payment connection", "Mobile-friendly design", "Basic store organization", "Contact and support information"],
    idealFor: ["Retail businesses", "Handmade & crafts", "Digital products", "Service packages"],
    cta: "Launch Your Online Store",
    accentColor: "#7c3aed", accentRgb: "124,58,237",
    heroBg: "linear-gradient(135deg,#0d0820 0%,#1e0d4a 60%,#0d0820 100%)",
    es: {
      eyebrow: "Tienda en Línea",
      extendedDesc: "Una tienda en línea es un sitio web donde tus clientes pueden ver tus productos, conocerlos, agregarlos al carrito y comprarlos directamente de tu negocio.\n\nEs perfecta para negocios que venden productos físicos, productos digitales, paquetes, membresías o servicios que se pueden pagar en línea.\n\nCon una tienda en línea, tu negocio puede vender más allá de tu ubicación física, estar disponible las 24 horas y darles a los clientes una forma sencilla de comprar desde su celular o computadora.",
      includes: ["Páginas de producto", "Imágenes y descripciones de productos", "Carrito de compras", "Configuración de pago seguro", "Conexión de pasarela de pago", "Diseño compatible con móvil", "Organización básica de tienda", "Información de contacto y soporte"],
      idealFor: ["Negocios minoristas", "Artesanías y manualidades", "Productos digitales", "Paquetes de servicios"],
      cta: "Lanza tu Tienda en Línea",
    },
  },
  {
    eyebrow: "Hosting & Management",
    extendedDesc: "Website hosting is the service that keeps your website online and available for customers to visit at any time.\n\nMany business owners do not want to deal with technical setup, servers, domains, security, emails, or confusing hosting platforms. That is where we help.\n\nWith our hosting management service, we help set up, connect, and manage the basic technical side of your website so your business can stay online, load properly, and look professional. It is perfect for businesses that want a simple, guided solution without dealing with complicated technical steps.",
    includes: ["Domain connection & configuration", "Hosting setup (Bluehost)", "SSL security certificate", "Professional email setup", "Website publishing & testing", "Basic speed optimization", "Monthly uptime monitoring", "Contact form configuration", "Technical support for hosting issues"],
    idealFor: ["New website owners", "Businesses upgrading online", "Non-technical owners", "Any business needing hosting"],
    cta: "Get Hosting & Management",
    accentColor: "#3b82f6", accentRgb: "59,130,246",
    heroBg: "linear-gradient(135deg,#030d24 0%,#0a2060 60%,#030d24 100%)",
    es: {
      eyebrow: "Hosting y Gestión",
      extendedDesc: "El hosting web es el servicio que mantiene tu sitio en línea y disponible para que los clientes lo visiten en cualquier momento.\n\nMuchos dueños de negocios no quieren lidiar con servidores, dominios, seguridad, correos o plataformas de hosting complicadas. Ahí es donde ayudamos.\n\nCon nuestro servicio de gestión de hosting, configuramos y administramos el lado técnico de tu sitio web para que tu negocio esté en línea, cargue correctamente y se vea profesional. Es ideal para negocios que quieren una solución guiada y simple.",
      includes: ["Conexión y configuración de dominio", "Configuración de hosting (Bluehost)", "Certificado de seguridad SSL", "Configuración de correo profesional", "Publicación y prueba del sitio", "Optimización básica de velocidad", "Monitoreo mensual de disponibilidad", "Configuración de formulario de contacto", "Soporte técnico para problemas de hosting"],
      idealFor: ["Nuevos propietarios de sitios", "Negocios actualizando su presencia", "Dueños no técnicos", "Cualquier negocio que necesite hosting"],
      cta: "Obtén Hosting y Gestión",
    },
  },
  {
    eyebrow: "Booking & Contact",
    extendedDesc: "A booking or contact page gives your customers a simple way to reach your business, request information, schedule a service, or ask for a quote.\n\nIt is perfect for businesses that depend on appointments, service requests, consultations, reservations, or direct customer communication.\n\nWith a clear booking or contact page, your customers do not have to search for your phone number, email, location, or next step. Everything they need is organized in one place, making it easier for them to take action.",
    includes: ["Contact form", "Call button", "Email link", "Location & map", "Service request form", "Quote request form", "Booking button or calendar link", "Business hours", "Social media links", "Mobile-friendly design"],
    idealFor: ["Service businesses", "Salons & clinics", "Contractors", "Restaurants & cafes"],
    cta: "Add Booking & Contact",
    accentColor: "#a855f7", accentRgb: "168,85,247",
    heroBg: "linear-gradient(135deg,#1a0535 0%,#2d0a5e 60%,#1a0535 100%)",
    es: {
      eyebrow: "Reservas y Contacto",
      extendedDesc: "Una página de reservas o contacto le da a tus clientes una forma sencilla de comunicarse con tu negocio, solicitar información, agendar un servicio o pedir una cotización.\n\nEs perfecta para negocios que dependen de citas, solicitudes de servicio, consultas, reservaciones o comunicación directa con clientes.\n\nCon una página de reservas o contacto clara, tus clientes no tienen que buscar tu número, correo, ubicación o próximo paso. Todo lo que necesitan está organizado en un solo lugar.",
      includes: ["Formulario de contacto", "Botón de llamada", "Enlace de correo", "Ubicación y mapa", "Formulario de solicitud de servicio", "Formulario de cotización", "Botón de reserva o enlace de calendario", "Horario de atención", "Links a redes sociales", "Diseño compatible con móvil"],
      idealFor: ["Negocios de servicios", "Salones y clínicas", "Contratistas", "Restaurantes y cafés"],
      cta: "Agregar Reservas y Contacto",
    },
  },
  {
    eyebrow: "Website Updates",
    extendedDesc: "If your business already has a website, but it looks outdated, feels confusing, loads slowly, or no longer represents your brand, we can help improve it.\n\nWebsite updates are perfect for businesses that need to refresh their content, replace images, improve sections, fix mobile issues, update services, or make the website look cleaner and more professional.\n\nA few smart updates can make your website easier to understand, easier to use, and more effective for customers who are ready to call, book, visit, or buy.",
    includes: ["Text & content updates", "Image changes", "Service section updates", "Layout improvements", "Mobile fixes", "Button & link updates", "Contact info updates", "Basic speed improvements", "Section cleanup & visual refresh"],
    idealFor: ["Businesses with outdated sites", "Post-rebrand updates", "Seasonal content changes", "Fixing broken elements"],
    cta: "Update My Website",
    accentColor: "#06b6d4", accentRgb: "6,182,212",
    heroBg: "linear-gradient(135deg,#031218 0%,#062836 60%,#031218 100%)",
    es: {
      eyebrow: "Actualizaciones Web",
      extendedDesc: "Si tu negocio ya tiene un sitio web pero se ve desactualizado, confuso, lento o ya no representa tu marca, podemos ayudarte a mejorarlo.\n\nLas actualizaciones de sitio web son perfectas para negocios que necesitan refrescar su contenido, cambiar imágenes, mejorar secciones, arreglar problemas en móvil, actualizar servicios o hacer que el sitio se vea más limpio y profesional.\n\nUnos cuantos cambios inteligentes pueden hacer que tu sitio sea más fácil de entender, más fácil de usar y más efectivo para clientes listos para llamar, reservar, visitar o comprar.",
      includes: ["Actualización de texto y contenido", "Cambio de imágenes", "Actualización de sección de servicios", "Mejoras de diseño", "Correcciones para móvil", "Actualización de botones y enlaces", "Actualización de información de contacto", "Mejoras básicas de velocidad", "Limpieza y refresco visual"],
      idealFor: ["Negocios con sitios desactualizados", "Actualizaciones post-rebranding", "Cambios de contenido de temporada", "Corrección de elementos rotos"],
      cta: "Actualizar mi Sitio Web",
    },
  },
  {
    eyebrow: "Mobile Apps",
    extendedDesc: "A mobile app gives your business a more direct and personalized way to connect with customers from their phones.\n\nIt is perfect for businesses that need more than a website and want to offer features such as customer accounts, bookings, notifications, loyalty programs, online ordering, service requests, or a more customized digital experience.\n\nWith a mobile app, your business can make it easier for customers to interact with your brand, return more often, and access your services in a faster and more convenient way.",
    includes: ["App structure planning", "Mobile-friendly interface design", "Customer account options", "Booking or request features", "Service or product sections", "Push notification options", "Loyalty or rewards features", "Basic app flow design", "Prototype or app development", "Custom features based on project needs"],
    idealFor: ["Restaurants & delivery", "Salons & booking services", "Retail & loyalty programs", "Service businesses"],
    cta: "Build Your Mobile App",
    accentColor: "#059669", accentRgb: "5,150,105",
    heroBg: "linear-gradient(135deg,#022c1e 0%,#065f46 60%,#022c1e 100%)",
    es: {
      eyebrow: "Apps Móviles",
      extendedDesc: "Una app móvil le da a tu negocio una forma más directa y personalizada de conectar con los clientes desde sus teléfonos.\n\nEs perfecta para negocios que necesitan más que un sitio web y quieren ofrecer funciones como cuentas de cliente, reservas, notificaciones, programas de lealtad, pedidos en línea, solicitudes de servicio o una experiencia digital más personalizada.\n\nCon una app móvil, tu negocio puede hacer que sea más fácil para los clientes interactuar con tu marca, regresar más seguido y acceder a tus servicios de forma más rápida y cómoda.",
      includes: ["Planificación de estructura de app", "Diseño de interfaz para móvil", "Opciones de cuenta de cliente", "Funciones de reserva o solicitud", "Secciones de servicios o productos", "Opciones de notificaciones push", "Funciones de lealtad o recompensas", "Diseño básico del flujo de la app", "Prototipo o desarrollo de app", "Funciones personalizadas según el proyecto"],
      idealFor: ["Restaurantes y entregas", "Salones y servicios de reserva", "Retail y programas de lealtad", "Negocios de servicios"],
      cta: "Construye tu App Móvil",
    },
  },
];

/* ── Check icon ─────────────────────────────────────────────────────────────── */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke={color} strokeOpacity="0.3"/>
      <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Panel hero visual — real photo per service ──────────────────────────────── */
function ServicePanelHero({ idx, detail }: { idx: number; detail: ServiceDetail }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SERVICE_HERO_IMAGES[idx]}
        alt={detail.eyebrow}
        className="h-full w-full object-cover opacity-100"
        loading="lazy"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, rgba(${detail.accentRgb},0.55) 0%, transparent 60%)` }} />
      <div className="absolute inset-0" style={{ background: "rgba(6,7,14,0.10)" }} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06070e] to-transparent" />
    </div>
  );
}

/* ── Examples gallery ──────────────────────────────────────────────────────── */



/* ── Service panel (desktop side panel + mobile full-screen) ──────────────── */
type PanelProps = {
  idx: number;
  title: string;
  detail: ServiceDetail;
  lang: "en" | "es";
  onClose: () => void;
  onBooking: (serviceName: string) => void;
};

const PANEL_LABELS = {
  en: { included: "What's Included", idealFor: "Perfect For" },
  es: { included: "Incluye",         idealFor: "Ideal Para"  },
};

function ServicePanel({ idx, title, detail, lang, onClose, onBooking }: PanelProps) {
  const copy   = lang === "es" ? detail.es : detail;
  const labels = PANEL_LABELS[lang];
  // Brighter accent for small text on the dark panel — keeps labels legible
  const accentText = `color-mix(in srgb, ${detail.accentColor} 58%, #ffffff)`;

  const lastTapRef = useRef<number>(0);
  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) onClose();
    lastTapRef.current = now;
  }

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const fadeUp  = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } } };

  return (
    /* Centered modal wrapper — fills viewport, flex centers the card */
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-3 md:p-6"
      style={{ zIndex: 9001 }}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
      onClick={onClose}
    >
      {/* Modal card — stop propagation so clicks inside don't close */}
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl border"
        style={{ background: "rgba(6,7,18,0.97)", backdropFilter: "blur(32px)", maxHeight: "92vh", borderColor: detail.accentColor + "30" }}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={handleDoubleTap}
      >
        {/* Accent ambient glow — top */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${detail.accentColor}28 0%, transparent 70%)`, filter: "blur(24px)" }} />
        {/* Accent top line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background: `linear-gradient(90deg, transparent 5%, ${detail.accentColor}cc 40%, ${detail.accentColor} 50%, ${detail.accentColor}cc 60%, transparent 95%)` }} />

        {/* Two-column layout: image left | content right */}
        <div className="flex flex-col lg:flex-row" style={{ maxHeight: "92vh", minHeight: "min(92vh, 680px)" }}>

          {/* ── Left: hero image — desktop only ───────────────────────── */}
          <div className="relative flex-none hidden lg:block lg:w-[340px]">
            <ServicePanelHero idx={idx} detail={detail} />

            {/* Service icon block — top-left over the image (matches reference) */}
            <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl"
              style={{ background: VISUALS[idx].bg, boxShadow: `0 12px 28px -8px ${detail.accentColor}, inset 0 1px 0 rgba(255,255,255,0.35)` }}>
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/30 to-transparent" />
              {SERVICE_ICONS[idx]}
            </div>

            {/* Close button — desktop */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-black/50 text-white transition-colors hover:bg-white/[0.12]"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Right: content ──────────────────────────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6 lg:p-8"
            style={{ background: `linear-gradient(160deg, rgba(${detail.accentRgb},0.04) 0%, transparent 40%)` }}>
            {/* Close button — mobile only */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="lg:hidden absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-black/50 text-white"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 md:space-y-6">

              {/* Title — last word painted in the service accent (matches reference) */}
              <motion.div variants={fadeUp}>
                {/* Service icon — mobile only (desktop shows it over the image) */}
                <div className="lg:hidden mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl"
                  style={{ background: VISUALS[idx].bg, boxShadow: `0 10px 24px -8px ${detail.accentColor}, inset 0 1px 0 rgba(255,255,255,0.35)` }}>
                  {SERVICE_ICONS[idx]}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em]"
                  style={{ color: accentText }}>{copy.eyebrow}</span>
                <h2 className="mt-1.5 text-[28px] md:text-3xl font-bold leading-[1.1] tracking-tight text-white">
                  {(() => {
                    const words = title.trim().split(" ");
                    const last = words.pop();
                    return (
                      <>
                        {words.length > 0 && <span>{words.join(" ")} </span>}
                        <span style={{
                          background: `linear-gradient(100deg, color-mix(in srgb, ${detail.accentColor} 55%, #ffffff) 0%, ${detail.accentColor} 55%, color-mix(in srgb, ${detail.accentColor} 70%, #000000) 100%)`,
                          WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>{last}</span>
                      </>
                    );
                  })()}
                </h2>
              </motion.div>

              <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed text-white/90">
                {copy.extendedDesc}
              </motion.p>

              {/* Divider */}
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${detail.accentColor}50, transparent)` }} />

              {/* What's Included — full width */}
              <motion.div variants={fadeUp}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1 w-4 rounded-full" style={{ background: accentText }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: accentText }}>{labels.included}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {copy.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="flex-none mt-0.5"><CheckIcon color={accentText}/></span>
                      <span className="text-[13px] text-white/90 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Ideal For */}
              {copy.idealFor && (
                <>
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${detail.accentColor}40, transparent)` }} />
                  <motion.div variants={fadeUp}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1 w-4 rounded-full" style={{ background: accentText }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: accentText }}>{labels.idealFor}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {copy.idealFor.map((item) => (
                        <span key={item} className="rounded-full px-3 py-1 text-[12px] font-medium border"
                          style={{ color: accentText, borderColor: `color-mix(in srgb, ${detail.accentColor} 45%, transparent)`, background: `color-mix(in srgb, ${detail.accentColor} 14%, transparent)` }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              {/* CTA */}
              <motion.div variants={fadeUp} className="pb-1 pt-2">
                <button
                  type="button"
                  onClick={() => { onClose(); onBooking(title); }}
                  className="group relative block w-full overflow-hidden rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${detail.accentColor}, color-mix(in srgb, ${detail.accentColor} 65%, #ffffff))`,
                    boxShadow: `0 0 24px ${detail.accentColor}40, 0 4px 16px rgba(0,0,0,0.4)`,
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {lang === "es" ? "Empieza Ahora" : "Start Now"}
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>
                </button>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Service card — premium product card (image lives in the Learn More modal) ── */
type ServiceCardProps = {
  title: string;
  description: string;
  learnMore: string;
  svgIcon: React.ReactNode;
  bg: string;
  glow: string;
  index: number;
  detail: ServiceDetail;
  benefits: string[];
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
};

function ServiceCard({ title, description, svgIcon, learnMore, bg, glow, index, detail, benefits, isActive, isDimmed, onClick }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  const content = (
    <>
      {/* Floating icon — glass square with glow */}
      <motion.div
        className="relative mb-5 w-fit"
        animate={hovered ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl"
          style={{ background: bg, boxShadow: `0 14px 30px -10px ${glow}, 0 0 26px -6px ${glow}, inset 0 1px 0 rgba(255,255,255,0.4)` }}
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent" />
          <span className="scale-[0.82]">{svgIcon}</span>
        </div>
        <div className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl" style={{ background: `${detail.accentColor}20`, filter: "blur(14px)" }} />
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-[25px]">{title}</h3>

      {/* Description */}
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-gray-400">{description}</p>

      {/* Benefits */}
      <ul className="mt-5 space-y-2.5">
        {benefits.map((b) => (
          <li key={b} className="flex items-center gap-2.5">
            <span
              className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full"
              style={{ background: `${detail.accentColor}2b`, boxShadow: `inset 0 0 0 1px ${detail.accentColor}50` }}
            >
              <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
                <path d="M2 5.2l2 2 4-4.4" stroke={detail.accentColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[13px] leading-snug text-white/75">{b}</span>
          </li>
        ))}
      </ul>

      {/* Learn more — elegant link, pinned to card bottom */}
      <div className="mt-auto flex items-center gap-2 pt-6 text-[13.5px] font-semibold" style={{ color: `color-mix(in srgb, ${detail.accentColor} 70%, #ffffff)` }}>
        {learnMore}
        <motion.span
          animate={hovered ? { x: 6 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="inline-flex"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: isDimmed ? 0.4 : 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative h-full cursor-pointer"
    >
      <motion.div
        className="relative h-full will-change-transform"
        animate={hovered ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div
          className="relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 backdrop-blur-[2px]"
          style={{
            background: "#0B0B0F",
            borderColor: hovered || isActive ? `${detail.accentColor}55` : "rgba(255,255,255,0.08)",
            boxShadow: hovered
              ? `0 32px 64px -24px rgba(0,0,0,0.85), 0 0 64px -14px ${detail.accentColor}50, inset 0 1px 0 rgba(255,255,255,0.10)`
              : "0 16px 40px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          {/* Corner radial glow — top right */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full transition-opacity duration-[400ms]"
            style={{ background: `radial-gradient(circle, ${detail.accentColor}24 0%, transparent 70%)`, filter: "blur(32px)", opacity: hovered ? 1 : 0.5 }}
          />
          {/* Ambient blue depth — bottom left */}
          <div
            className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)", filter: "blur(36px)" }}
          />
          {/* Top edge light */}
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px transition-opacity duration-[400ms]"
            style={{ background: `linear-gradient(90deg, transparent, ${detail.accentColor}, transparent)`, opacity: hovered ? 0.9 : 0.3 }}
          />

          {/* Most popular badge */}
          {index === 0 && (
            <div className="absolute right-6 top-6 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "linear-gradient(90deg, #4f6ef7, #00d4ff)", color: "#fff", boxShadow: "0 0 16px rgba(0,212,255,0.45)" }}>
              Most Popular
            </div>
          )}

          {content}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Trust feature strip (matches reference bottom row) ───────────────────────── */
const FEATURES = [
  { icon: Zap,        en: "Fast Delivery",      es: "Entrega Rápida" },
  { icon: Gem,        en: "High Quality",       es: "Alta Calidad" },
  { icon: BarChart3,  en: "Measurable Results", es: "Resultados Medibles" },
  { icon: Handshake,  en: "Long-term Partner",  es: "Socio a Largo Plazo" },
];

function FeatureStrip({ lang }: { lang: "en" | "es" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {FEATURES.map(({ icon: Icon, en, es }) => (
        <div key={en}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.16]">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-accent-blue/30 to-accent-violet/30 text-accent-cyan ring-1 ring-white/10">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-[13px] font-semibold text-white/85">{lang === "es" ? es : en}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── Main Services section ──────────────────────────────────────────────────── */
export default function Services() {
  const { t, lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [bookingService, setBookingService] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC + body scroll lock — all screen sizes when modal is open
  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveIdx(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIdx]);

  const handleToggle = (i: number) => setActiveIdx((prev) => (prev === i ? null : i));
  const handleClose  = () => setActiveIdx(null);

  const services = t.services.items.map((item, i) => ({
    ...item,
    ...VISUALS[i],
    svgIcon: SERVICE_ICONS[i],
    detail: SERVICE_DETAILS[i],
  }));

  const showPanel = mounted && activeIdx !== null;

  return (
    <section id="services" className="section-separator relative isolate py-32 md:py-44">
      {/* Background — graphite + technical grid identity */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050508 0%, #0B0B0F 18%, #0B0B0F 82%, #060810 100%)" }} />
        {/* Technical grid — slightly more present, masked to center */}
        <div className="absolute inset-0 grid-bg opacity-[0.16]" style={{ maskImage: "radial-gradient(ellipse 90% 75% at 50% 42%, black 15%, transparent 100%)" }} />
        {/* Technical corner lines */}
        <div className="absolute left-[8%] top-32 h-px w-24 bg-gradient-to-r from-accent-cyan/25 to-transparent" />
        <div className="absolute left-[8%] top-32 h-24 w-px bg-gradient-to-b from-accent-cyan/25 to-transparent" />
        <div className="absolute right-[8%] bottom-32 h-px w-24 bg-gradient-to-l from-accent-violet/25 to-transparent" />
        <div className="absolute right-[8%] bottom-32 h-24 w-px bg-gradient-to-t from-accent-violet/25 to-transparent" />
        {/* Ambient glow — restrained */}
        <div className="absolute -left-60 top-1/4 h-[380px] w-[380px] rounded-full bg-accent-violet/[0.07] blur-[60px]" />
        <div className="absolute -right-40 bottom-1/3 h-[320px] w-[320px] rounded-full bg-accent-blue/[0.07] blur-[55px]" />
        <div className="absolute inset-x-0 top-0 h-40"
          style={{ background: "linear-gradient(to bottom, #050508 0%, transparent 100%)" }}/>
        <div className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, #060810 0%, transparent 100%)" }}/>
      </div>

      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.services.eyebrow}
          title={<>{t.services.titlePart1} <em className="display-em">{t.services.titleEmphasis}</em>{t.services.titlePart2 ? ` ${t.services.titlePart2}` : ""}</>}
          accent={t.services.accent}
          description={t.services.description}
        />

        {/* 7 cards: 3 cols desktop — rows of 3+3+1 (last centered) */}
        <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const isLast = i === services.length - 1 && services.length % 3 === 1;
            const benefits = (lang === "es" ? s.detail.es.includes : s.detail.includes).slice(0, 3);
            return (
              <div key={s.title} className={isLast ? "md:col-span-2 lg:col-span-1 lg:col-start-2" : ""}>
                <ServiceCard
                  index={i}
                  title={s.title}
                  description={s.description}
                  learnMore={s.learnMore}
                  svgIcon={s.svgIcon}
                  bg={s.bg}
                  glow={s.glow}
                  detail={s.detail}
                  benefits={benefits}
                  isActive={activeIdx === i}
                  isDimmed={activeIdx !== null && activeIdx !== i}
                  onClick={() => handleToggle(i)}
                />
              </div>
            );
          })}
        </div>

        {/* Advanced services */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-8 py-8 text-center"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-accent-cyan/60 mb-2">
            {lang === "es" ? "Proyectos avanzados" : "Advanced projects"}
          </p>
          <p className="mb-6 text-base font-medium text-white/70">
            {lang === "es"
              ? "¿Necesitas algo más que un sitio web?"
              : "Need something beyond a website?"}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/55">
            {(lang === "es"
              ? ["Aplicaciones Web personalizadas", "Plataformas SaaS", "Marketplaces", "Dashboards internos", "Portales de clientes", "Integraciones de API e IA"]
              : ["Custom Web Applications", "SaaS Platforms", "Marketplaces", "Internal Dashboards", "Client Portals", "AI & API Integrations"]
            ).map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan/40" />
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/40">
            {lang === "es"
              ? "Estos proyectos requieren una cotización personalizada. "
              : "These projects require a custom quote. "}
            <a href="#contact" className="text-accent-cyan hover:underline font-medium">
              {lang === "es" ? "Platiquemos →" : "Let's talk →"}
            </a>
          </p>
        </motion.div>

      </div>

      {/* Desktop: backdrop + panel rendered in document.body via portal to escape stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {showPanel && (
            <>
              <motion.div
                key="backdrop"
                className="fixed inset-0"
                style={{ zIndex: 9000, background: "rgba(3,4,10,0.6)", backdropFilter: "blur(4px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={handleClose}
              />
              <ServicePanel
                key="panel"
                idx={activeIdx!}
                title={services[activeIdx!].title}
                detail={services[activeIdx!].detail}
                lang={lang}
                onClose={handleClose}
                onBooking={(name) => { handleClose(); setBookingService(name); }}
              />
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
      <BookingModal
        open={bookingService !== null}
        onClose={() => setBookingService(null)}
        initialService={bookingService ?? ""}
      />
    </section>
  );
}

/* ── Section header (shared) ────────────────────────────────────────────────── */
export function SectionHeader({
  eyebrow, title, accent, description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {/* Eyebrow — lines + title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20 flex items-center justify-center gap-5"
      >
        <span className="h-px w-10 shrink-0 sm:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45))" }} />
        <span
          className="shrink font-black uppercase tracking-[0.1em] min-w-0 text-center text-white"
          style={{ fontSize: "clamp(1.6rem, 5.5vw, 4.2rem)" }}
        >
          {eyebrow}
        </span>
        <span className="h-px w-10 shrink-0 sm:w-16" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.45), transparent)" }} />
      </motion.div>

      <motion.h2
        initial={{ clipPath: "inset(100% 0 0% 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 1.0, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-h2 font-bold text-white text-balance"
      >
        {title}{" "}
        {accent && <span className="text-gradient-accent">{accent}</span>}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ y: 18 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.9, delay: 0.28, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-2xl text-balance text-white md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
