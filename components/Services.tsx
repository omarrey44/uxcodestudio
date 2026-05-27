"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";
import React from "react";

/* ── Tag icons ──────────────────────────────────────────────────────────────── */
const TAG_ICONS: Record<string, React.ReactNode> = {
  "Design":       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  "Webflow":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M17.82 7.5s-2.09 6.46-2.27 7.07c-.07-.61-.73-7.07-.73-7.07H11.5s-2.05 7-2.17 7.44C9.25 14.27 7.7 7.5 7.7 7.5H4.5l3.66 9h3.44l2.1-6.67L15.82 16.5h3.44l3.24-9h-4.68z"/></svg>,
  "Next.js":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C23.422 4.8 20.214 1.01 15.848.11a12.96 12.96 0 0 0-2.276-.11z"/></svg>,
  "CRO":          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  "A/B Tests":    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M6 3v12"/><path d="M18 9a3 3 0 0 1 0 6"/><path d="M6 21a6 6 0 0 0 6-6"/><path d="M6 3a3 3 0 0 1 3 3v3a3 3 0 0 1 3 3"/></svg>,
  "Analytics":    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  "React":        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3"><circle cx="12" cy="12" r="2"/><path d="M12 2C6.5 2 2 6.48 2 12s4.5 10 10 10 10-4.48 10-10S17.5 2 12 2z" strokeDasharray="4 2"/></svg>,
  "TS":           <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><rect x="2" y="2" width="20" height="20" rx="2" fill="#3178c6"/><path d="M14.5 11.5H12v6h-2v-6H7.5V10h7v1.5zM16 16.5c.4.3.9.5 1.5.5.8 0 1.2-.4 1.2-.9 0-.5-.3-.8-1.2-1.1-1.2-.4-1.9-1-1.9-2.1 0-1.2.9-2.1 2.4-2.1.7 0 1.3.2 1.7.4l-.3 1.2c-.3-.2-.7-.4-1.3-.4-.7 0-1.1.4-1.1.9 0 .5.3.8 1.3 1.1 1.3.4 1.8 1 1.8 2.1 0 1.2-.9 2.2-2.6 2.2-.7 0-1.4-.2-1.9-.5l.4-1.3z" fill="white"/></svg>,
  "Node":         <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 1.85c-.27 0-.55.07-.78.2L3.78 6.34c-.48.28-.78.8-.78 1.36v8.6c0 .56.3 1.08.78 1.36l7.44 4.29c.23.13.5.2.78.2s.55-.07.78-.2l7.44-4.29c.48-.28.78-.8.78-1.36V7.7c0-.56-.3-1.08-.78-1.36L12.78 2.05c-.23-.13-.5-.2-.78-.2zm0 2.27l6.44 3.72v7.44L12 18.98l-6.44-3.7V7.84L12 4.12z" fill="#539e43"/></svg>,
  "Stripe":       <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="#6772e5"/></svg>,
  "Auth":         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  "AI":           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  "React Native": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>,
  "Flutter":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" fill="#54C5F8"/></svg>,
  "iOS":          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="#555"/></svg>,
  "Android":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M17.523 15.341a1.046 1.046 0 0 1-1.045-1.044 1.046 1.046 0 0 1 1.045-1.045 1.046 1.046 0 0 1 1.045 1.045 1.046 1.046 0 0 1-1.045 1.044zm-11.046 0a1.046 1.046 0 0 1-1.045-1.044 1.046 1.046 0 0 1 1.045-1.045 1.046 1.046 0 0 1 1.044 1.045 1.046 1.046 0 0 1-1.044 1.044zm11.41-6.235l1.045-1.81a.218.218 0 0 0-.08-.297.218.218 0 0 0-.296.08l-1.058 1.832A6.762 6.762 0 0 0 12 8.276c-1.008 0-1.963.223-2.817.622L8.126 7.08a.217.217 0 0 0-.296-.08.218.218 0 0 0-.08.296L8.796 9.09C7.128 9.99 6 11.701 6 13.67h12c0-1.968-1.128-3.678-2.113-4.564z" fill="#3DDC84"/></svg>,
  "Diseño":       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  "Motion":       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M5 12s2.3-1 4-1 4 2 6 2 4-1 4-1V3s-2.3 1-4 1-4-2-6-2-4 1-4 1z"/><path d="M5 19v-7"/></svg>,
  "Angular":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 2.25L2.2 5.77l1.52 13.23L12 22.5l8.28-3.5L21.8 5.77 12 2.25zm0 2.19l7.34 2.56-1.17 10.19L12 19.72l-6.17-2.53L4.66 6.94 12 4.44zm0 3.06L7.2 16.5h1.93l.98-2.45h3.78l.98 2.45H16.8L12 7.5zm0 2.19l1.38 3.36H10.62L12 9.69z" fill="#DD0031"/></svg>,
  "Python":       <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.403 3.347-3.403h5.768s3.24.052 3.24-3.13V3.19S18.28 0 11.914 0zm-3.21 1.849a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.403-3.347 3.403h-5.768s-3.24-.052-3.24 3.13v5.339S5.72 24 12.086 24zm3.21-1.849a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" fill="#3776AB"/></svg>,
  "Tono":         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/></svg>,
  "Tone":         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
};

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
    eyebrow: "E-commerce",
    extendedDesc: "We build your online store from scratch — ready to sell from day one. Your customers can browse products, add to cart, and pay securely. We make sure your store loads fast, looks great on any phone, and shows up on Google so new customers can find you.",
    includes: ["Custom website design", "Online store & product catalog", "Secure checkout & payments", "Google SEO setup", "Fast loading on all devices", "Easy to manage yourself"],
    idealFor: ["Local businesses", "Online stores", "Product launches", "Service providers"],
    cta: "Launch Your Online Store",
    accentColor: "#4f6ef7", accentRgb: "79,110,247",
    heroBg: "linear-gradient(135deg,#0a0f2e 0%,#1a1060 60%,#0d1845 100%)",
    es: {
      eyebrow: "E-commerce",
      extendedDesc: "Construimos tu tienda en línea desde cero — lista para vender desde el primer día. Tus clientes pueden explorar productos, añadir al carrito y pagar de forma segura. Nos aseguramos de que cargue rápido, se vea bien en cualquier teléfono y aparezca en Google para que nuevos clientes te encuentren.",
      includes: ["Diseño web personalizado", "Tienda y catálogo de productos", "Checkout y pagos seguros", "Configuración SEO en Google", "Carga rápida en todos los dispositivos", "Fácil de administrar tú mismo"],
      idealFor: ["Negocios locales", "Tiendas en línea", "Lanzamientos de producto", "Proveedores de servicios"],
      cta: "Lanza tu Tienda en Línea",
    },
  },
  {
    eyebrow: "Landing Pages",
    extendedDesc: "A landing page is a focused page designed to turn visitors into leads or paying customers. We design it to look great, load in under a second, and guide people toward taking action — whether that's filling out a form, calling you, or making a purchase. Simple, fast, and built to convert.",
    includes: ["One-page website design", "Clear sections that drive action", "Contact form & lead capture", "Super fast load times", "Ready to share on social & Google", "Visitor tracking so you see what works"],
    idealFor: ["New businesses", "Product launches", "Event promotions", "Service bookings"],
    cta: "Get Your Landing Page",
    accentColor: "#00d4ff", accentRgb: "0,212,255",
    heroBg: "linear-gradient(135deg,#041824 0%,#083048 60%,#041824 100%)",
    es: {
      eyebrow: "Landing Pages",
      extendedDesc: "Una landing page es una página enfocada diseñada para convertir visitas en contactos o clientes. La diseñamos para que se vea increíble, cargue en menos de un segundo y guíe a las personas a tomar acción — ya sea llenar un formulario, llamarte o comprar. Sencilla, rápida y construida para convertir.",
      includes: ["Diseño de página única", "Secciones que impulsan la acción", "Formulario de contacto y captura de leads", "Tiempos de carga muy rápidos", "Lista para compartir en redes y Google", "Seguimiento de visitas para ver qué funciona"],
      idealFor: ["Negocios nuevos", "Lanzamientos de producto", "Promociones de eventos", "Reservas de servicios"],
      cta: "Obtén tu Landing Page",
    },
  },
  {
    eyebrow: "Engineering",
    extendedDesc: "We build web apps that your team and customers use every day. Think login systems, booking tools, management portals, internal dashboards — anything that needs user accounts, data, or live updates. Built to work reliably whether you have 10 or 10,000 users.",
    includes: ["Custom web application", "User login & account management", "Admin dashboard & control panel", "Secure data storage", "Fast & reliable performance", "Hosted and ready to use online"],
    idealFor: ["Small businesses", "Startups", "Internal tools", "Client portals"],
    cta: "Build Your Web App",
    accentColor: "#7c3aed", accentRgb: "124,58,237",
    heroBg: "linear-gradient(135deg,#0d0820 0%,#1e0d4a 60%,#0d0820 100%)",
    es: {
      eyebrow: "Ingeniería",
      extendedDesc: "Construimos aplicaciones web que tu equipo y clientes usan todos los días. Piensa en sistemas de login, herramientas de reserva, portales de gestión, paneles internos — cualquier cosa que necesite cuentas de usuario, datos o actualizaciones en vivo. Diseñadas para funcionar sin importar si tienes 10 o 10,000 usuarios.",
      includes: ["Aplicación web a medida", "Login y gestión de cuentas", "Panel de administración", "Almacenamiento seguro de datos", "Rendimiento rápido y confiable", "Alojada y lista para usar en línea"],
      idealFor: ["Pequeños negocios", "Startups", "Herramientas internas", "Portales para clientes"],
      cta: "Construye tu App Web",
    },
  },
  {
    eyebrow: "Product",
    extendedDesc: "We build complete software products that your customers subscribe to and pay for monthly. We handle everything from sign-up to billing, team management to notifications. You focus on growing your business while we build the product that makes it possible.",
    includes: ["Full product development", "Monthly subscription & payments", "User sign-up & welcome flow", "Team & permission management", "Track how customers use the product", "Built to grow with your business"],
    idealFor: ["Entrepreneurs", "SaaS startups", "Digital products", "Subscription businesses"],
    cta: "Build Your SaaS Product",
    accentColor: "#3b82f6", accentRgb: "59,130,246",
    heroBg: "linear-gradient(135deg,#030d24 0%,#0a2060 60%,#030d24 100%)",
    es: {
      eyebrow: "Producto",
      extendedDesc: "Construimos productos de software completos a los que tus clientes se suscriben y pagan mensualmente. Nos encargamos de todo: desde el registro hasta el cobro, la gestión de equipos y las notificaciones. Tú te enfocas en hacer crecer tu negocio mientras nosotros construimos el producto que lo hace posible.",
      includes: ["Desarrollo completo del producto", "Suscripción mensual y cobros", "Registro y flujo de bienvenida", "Gestión de equipos y permisos", "Seguimiento de uso por clientes", "Diseñado para crecer con tu negocio"],
      idealFor: ["Emprendedores", "Startups SaaS", "Productos digitales", "Negocios por suscripción"],
      cta: "Construye tu Producto SaaS",
    },
  },
  {
    eyebrow: "Mobile",
    extendedDesc: "We build mobile apps for iPhone and Android that your customers will love using. Smooth, fast, and polished — ready to publish on the App Store and Google Play. Whether you need a simple companion app or a full-featured product, we deliver on time and within budget.",
    includes: ["App for iPhone & Android", "Beautiful and easy-to-use design", "User login & profiles", "Push notifications", "Works offline too", "Published to App Store & Google Play"],
    idealFor: ["Delivery services", "Booking apps", "Retail brands", "On-demand platforms"],
    cta: "Build Your Mobile App",
    accentColor: "#06b6d4", accentRgb: "6,182,212",
    heroBg: "linear-gradient(135deg,#031218 0%,#062836 60%,#031218 100%)",
    es: {
      eyebrow: "Mobile",
      extendedDesc: "Construimos apps móviles para iPhone y Android que tus clientes amarán usar. Fluidas, rápidas y pulidas — listas para publicarse en el App Store y Google Play. Ya sea que necesites una app sencilla o un producto completo, entregamos a tiempo y dentro del presupuesto.",
      includes: ["App para iPhone y Android", "Diseño bonito y fácil de usar", "Login y perfiles de usuario", "Notificaciones push", "Funciona sin conexión también", "Publicada en App Store y Google Play"],
      idealFor: ["Servicios de entrega", "Apps de reservas", "Marcas de retail", "Plataformas on-demand"],
      cta: "Construye tu App Móvil",
    },
  },
];

/* ── SERVICE_HERO_IMAGES (used in panel) ─────────────────────────────────── */
const SERVICE_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80&fit=crop&auto=format",
];

/* ── Bento card illustrations ────────────────────────────────────────────── */

/** Shared shell: gradient bg + grid texture */
function IlluShell({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: gradient }}>
      {/* subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      {children}
    </div>
  );
}

/** 0 — E-commerce: product card grid */
function EcomIllustration() {
  return (
    <IlluShell gradient="linear-gradient(145deg, #0c1240 0%, #1a1a6e 60%, #0c1240 100%)">
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="w-full grid grid-cols-2 gap-2.5">
          {[
            { accent: "rgba(79,110,247,0.5)", h: "h-12" },
            { accent: "rgba(0,212,255,0.3)", h: "h-10" },
            { accent: "rgba(79,110,247,0.3)", h: "h-11" },
            { accent: "rgba(124,58,237,0.4)", h: "h-10" },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-white/[0.09] bg-white/[0.04] p-2 flex flex-col gap-1.5"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}>
              <div className={`${p.h} w-full rounded-lg`} style={{ background: p.accent }} />
              <div className="h-1.5 w-3/4 rounded-full bg-white/25" />
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-1/3 rounded-full" style={{ background: "#4f6ef7" }} />
                <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* cart badge */}
      <div className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center"
        style={{ background: "#4f6ef7", boxShadow: "0 0 12px rgba(79,110,247,0.6)" }}>
        <svg viewBox="0 0 12 12" fill="none" className="h-3.5 w-3.5 text-white">
          <path d="M1 1.5h1.5l1.5 5h5l1-3.5H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="5.5" cy="10" r="0.8" fill="currentColor"/>
          <circle cx="9" cy="10" r="0.8" fill="currentColor"/>
        </svg>
      </div>
    </IlluShell>
  );
}

/** 1 — Landing Pages: conversion funnel + CTA hero */
function LandingIllustration() {
  return (
    <IlluShell gradient="linear-gradient(145deg, #041a28 0%, #073854 60%, #041a28 100%)">
      <div className="absolute inset-0 flex flex-col p-4 gap-2">
        {/* Mini browser bar */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-white/15" />
          <div className="h-2 w-2 rounded-full bg-white/15" />
          <div className="h-2 w-2 rounded-full bg-white/15" />
          <div className="ml-2 flex-1 h-2 rounded-full bg-white/[0.07]" />
        </div>
        {/* Page mockup */}
        <div className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.03] overflow-hidden flex flex-col">
          {/* Nav */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.05]">
            <div className="h-2 w-8 rounded-full bg-white/30" />
            <div className="ml-auto flex gap-1.5">
              {[1,2,3].map(i => <div key={i} className="h-1.5 w-5 rounded-full bg-white/15" />)}
            </div>
          </div>
          {/* Hero area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-2">
            <div className="h-2 w-3/4 rounded-full bg-white/40" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
            <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
            <div className="mt-1 h-5 w-20 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,212,255,0.7)" }}>
              <div className="h-1.5 w-10 rounded-full bg-white/80" />
            </div>
          </div>
          {/* Conversion stats */}
          <div className="flex border-t border-white/[0.05]">
            {["+47%", "+2.3×", "0.8s"].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center py-1.5 border-r border-white/[0.05] last:border-r-0">
                <span className="text-[7px] font-bold" style={{ color: "#00d4ff" }}>{v}</span>
                <div className="mt-0.5 h-1 w-5 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </IlluShell>
  );
}

/** 2 — Web Applications (featured): dashboard */
function WebAppIllustration() {
  return (
    <IlluShell gradient="linear-gradient(145deg, #0d0822 0%, #1a0d4a 55%, #0d0822 100%)">
      <div className="absolute inset-0 flex gap-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-10 flex-none border-r border-white/[0.07] bg-white/[0.02] flex flex-col items-center gap-2 py-3">
          <div className="h-4 w-4 rounded-lg" style={{ background: "rgba(124,58,237,0.6)" }} />
          <div className="mt-1 flex flex-col gap-1.5 items-center">
            {[0.5,0.3,0.4,0.3,0.2].map((o, i) => (
              <div key={i} className="h-3 w-5 rounded" style={{ background: `rgba(255,255,255,${o})` }} />
            ))}
          </div>
          {/* avatar bottom */}
          <div className="mt-auto h-4 w-4 rounded-full" style={{ background: "rgba(124,58,237,0.5)" }} />
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col p-2 gap-1.5">
          {/* Top metrics row */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { v: "12.4k", c: "rgba(124,58,237,0.5)" },
              { v: "$8.2k", c: "rgba(59,130,246,0.5)" },
              { v: "94%",   c: "rgba(0,212,255,0.4)" },
            ].map((m, i) => (
              <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-1.5"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
                <div className="h-1 w-4 rounded-full bg-white/20 mb-1" />
                <span className="text-[7px] font-bold text-white/70">{m.v}</span>
                <div className="mt-0.5 h-3 w-full rounded" style={{ background: m.c }} />
              </div>
            ))}
          </div>
          {/* Chart area */}
          <div className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.02] p-1.5 flex flex-col">
            <div className="h-1 w-8 rounded-full bg-white/20 mb-1.5" />
            <div className="flex-1 flex items-end gap-0.5 px-1">
              {[30,55,40,70,50,85,65,90,60,75,45,80].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, background: i === 7 ? "rgba(124,58,237,0.85)" : `rgba(124,58,237,${0.2 + i * 0.02})` }} />
              ))}
            </div>
          </div>
          {/* User list */}
          <div className="flex items-center gap-1">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-4 w-4 rounded-full border border-white/10"
                style={{ background: `hsl(${200 + i * 40}, 70%, 40%)`, marginLeft: i > 0 ? "-6px" : "0" }} />
            ))}
            <div className="h-1.5 w-10 rounded-full bg-white/15 ml-1.5" />
          </div>
        </div>
      </div>
    </IlluShell>
  );
}

/** 3 — SaaS: subscription plan cards */
function SaaSIllustration() {
  return (
    <IlluShell gradient="linear-gradient(145deg, #030c22 0%, #0a1e5c 60%, #030c22 100%)">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full flex gap-1.5">
          {[
            { label: "Starter", price: "$29", color: "rgba(255,255,255,0.1)", accent: "rgba(255,255,255,0.3)", featured: false },
            { label: "Pro",     price: "$79", color: "rgba(59,130,246,0.25)", accent: "#3b82f6",              featured: true  },
            { label: "Scale",   price: "$149",color: "rgba(255,255,255,0.1)", accent: "rgba(255,255,255,0.3)", featured: false },
          ].map((plan, i) => (
            <div key={i} className={`flex-1 rounded-xl border p-2 flex flex-col gap-1 ${plan.featured ? "border-blue-500/50" : "border-white/[0.07]"}`}
              style={{ background: plan.color, boxShadow: plan.featured ? "0 0 16px rgba(59,130,246,0.2)" : undefined }}>
              <div className="h-1.5 w-full rounded-full" style={{ background: plan.accent, opacity: 0.5 }} />
              <div className="h-1 w-5 rounded-full bg-white/30" />
              <span className="text-[7px] font-bold" style={{ color: plan.featured ? "#3b82f6" : "rgba(255,255,255,0.5)" }}>{plan.price}</span>
              <div className="flex flex-col gap-1 mt-0.5">
                {[1,2,3].map(j => (
                  <div key={j} className="flex items-center gap-0.5">
                    <div className="h-1 w-1 rounded-full" style={{ background: plan.accent }} />
                    <div className="h-1 flex-1 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue chart at bottom */}
      <div className="absolute inset-x-4 bottom-3 flex items-end gap-0.5 h-6">
        {[20,40,35,60,45,75,55,80].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm"
            style={{ height: `${h}%`, background: `rgba(59,130,246,${0.2 + i * 0.07})` }} />
        ))}
      </div>
    </IlluShell>
  );
}

/** 4 — Mobile Apps: phone with app UI */
function MobileIllustration() {
  return (
    <IlluShell gradient="linear-gradient(145deg, #031218 0%, #062e3e 60%, #031218 100%)">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Phone frame */}
        <div className="relative h-[88%] w-[42%] rounded-[16px] border-2 border-white/20 bg-black/60 flex flex-col overflow-hidden"
          style={{ boxShadow: "0 0 30px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[5px] text-white/50">9:41</span>
            <div className="flex gap-0.5">
              {[1,2,3].map(i => <div key={i} className="h-1 w-0.5 rounded-full bg-white/40" />)}
            </div>
          </div>
          {/* App content */}
          <div className="flex-1 flex flex-col px-1.5 gap-1">
            {/* Hero card */}
            <div className="rounded-lg h-10 w-full" style={{ background: "rgba(6,182,212,0.25)" }}>
              <div className="p-1.5 flex flex-col gap-0.5">
                <div className="h-1 w-8 rounded-full bg-white/40" />
                <div className="h-1 w-5 rounded-full bg-white/20" />
              </div>
            </div>
            {/* List items */}
            {[0,1,2].map(i => (
              <div key={i} className="flex items-center gap-1 p-1 rounded bg-white/[0.04] border border-white/[0.06]">
                <div className="h-4 w-4 rounded-full flex-none" style={{ background: `rgba(6,182,212,${0.3 + i*0.1})` }} />
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="h-1 w-full rounded-full bg-white/25" />
                  <div className="h-0.5 w-2/3 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
          {/* Bottom nav */}
          <div className="flex items-center justify-around py-1.5 border-t border-white/[0.07]">
            {[0,1,2,3].map(i => (
              <div key={i} className={`h-3 w-3 rounded-sm ${i === 1 ? "bg-cyan-400/60" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
        {/* Second phone peeking behind */}
        <div className="absolute h-[70%] w-[38%] rounded-[14px] border border-white/10 bg-black/40"
          style={{ right: "14%", top: "15%", transform: "rotate(8deg)", zIndex: 0 }} />
      </div>
    </IlluShell>
  );
}

const ILLUSTRATIONS = [
  EcomIllustration,
  LandingIllustration,
  WebAppIllustration,
  SaaSIllustration,
  MobileIllustration,
];

/* ── Bento grid layout config ────────────────────────────────────────────── */
// Visual order: [Landing(1), WebApps(2 featured), SaaS(3)] / [Ecom(0), Mobile(4)]
const BENTO: { dataIdx: number; col: string; row: string; featured?: boolean }[] = [
  { dataIdx: 1, col: "lg:col-span-3",                  row: "lg:row-start-1" },
  { dataIdx: 2, col: "lg:col-span-6",                  row: "lg:row-start-1", featured: true },
  { dataIdx: 3, col: "lg:col-span-3",                  row: "lg:row-start-1" },
  { dataIdx: 0, col: "lg:col-span-6",                  row: "lg:row-start-2" },
  { dataIdx: 4, col: "lg:col-span-6",                  row: "lg:row-start-2" },
];

/* ── Card visual accent map ──────────────────────────────────────────────── */
// Index aligned with SERVICE_DETAILS order (0=ecom,1=landing,2=webapps,3=saas,4=mobile)
const ACCENTS = [
  { border: "rgba(79,110,247,0.35)",  glow: "rgba(79,110,247,0.12)"  },
  { border: "rgba(0,212,255,0.35)",   glow: "rgba(0,212,255,0.10)"   },
  { border: "rgba(124,58,237,0.45)",  glow: "rgba(124,58,237,0.14)"  },
  { border: "rgba(59,130,246,0.35)",  glow: "rgba(59,130,246,0.10)"  },
  { border: "rgba(6,182,212,0.35)",   glow: "rgba(6,182,212,0.10)"   },
];

/* ── Check icon ──────────────────────────────────────────────────────────── */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke={color} strokeOpacity="0.3"/>
      <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Panel hero visual ───────────────────────────────────────────────────── */
function ServicePanelHero({ idx, detail }: { idx: number; detail: ServiceDetail }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SERVICE_HERO_IMAGES[idx]} alt={detail.eyebrow} className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, rgba(${detail.accentRgb},0.55) 0%, transparent 60%)` }} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06070e] to-transparent" />
    </div>
  );
}

/* ── Service panel modal ─────────────────────────────────────────────────── */
type PanelProps = { idx: number; title: string; detail: ServiceDetail; lang: "en" | "es"; onClose: () => void };
const PANEL_LABELS = {
  en: { included: "What's Included", idealFor: "Perfect For" },
  es: { included: "Incluye",         idealFor: "Ideal Para"  },
};

function ServicePanel({ idx, title, detail, lang, onClose }: PanelProps) {
  const copy   = lang === "es" ? detail.es : detail;
  const labels = PANEL_LABELS[lang];
  const lastTapRef = useRef<number>(0);
  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) onClose();
    lastTapRef.current = now;
  }
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const fadeUp  = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } } };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-3 md:p-6"
      style={{ zIndex: 9001 }}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl border"
        style={{ background: "rgba(6,7,18,0.97)", backdropFilter: "blur(32px)", maxHeight: "92vh", borderColor: detail.accentColor + "30" }}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={handleDoubleTap}
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${detail.accentColor}28 0%, transparent 70%)`, filter: "blur(24px)" }} />
        <div className="absolute inset-x-0 top-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${detail.accentColor}cc 40%, ${detail.accentColor} 50%, ${detail.accentColor}cc 60%, transparent 95%)` }} />
        <div className="flex flex-col lg:flex-row" style={{ maxHeight: "92vh", minHeight: "min(92vh, 680px)" }}>
          <div className="relative flex-none hidden lg:block lg:w-[340px]">
            <ServicePanelHero idx={idx} detail={detail} />
            <button type="button" aria-label="Close" onClick={onClose}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-black/50 text-white transition-colors hover:bg-white/[0.12]">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6 lg:p-8"
            style={{ background: `linear-gradient(160deg, rgba(${detail.accentRgb},0.04) 0%, transparent 40%)` }}>
            <button type="button" aria-label="Close" onClick={onClose}
              className="lg:hidden absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-black/50 text-white">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 md:space-y-6">
              <motion.div variants={fadeUp}>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: detail.accentColor }}>{copy.eyebrow}</span>
                <h2 className="mt-1 text-2xl font-bold text-white leading-tight">{title}</h2>
              </motion.div>
              <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed text-white/90">{copy.extendedDesc}</motion.p>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${detail.accentColor}50, transparent)` }} />
              <motion.div variants={fadeUp}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1 w-4 rounded-full" style={{ background: detail.accentColor }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: detail.accentColor }}>{labels.included}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {copy.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="flex-none mt-0.5"><CheckIcon color={detail.accentColor}/></span>
                      <span className="text-[13px] text-white/90 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              {copy.idealFor && (
                <>
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${detail.accentColor}40, transparent)` }} />
                  <motion.div variants={fadeUp}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1 w-4 rounded-full" style={{ background: detail.accentColor }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: detail.accentColor }}>{labels.idealFor}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {copy.idealFor.map((item) => (
                        <span key={item} className="rounded-full px-3 py-1 text-[12px] font-medium border"
                          style={{ color: detail.accentColor, borderColor: detail.accentColor + "50", background: detail.accentColor + "15" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
              <motion.div variants={fadeUp} className="pb-1 pt-2">
                <button type="button"
                  className="group relative w-full overflow-hidden rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all duration-300"
                  style={{ background: `linear-gradient(135deg, rgba(${detail.accentRgb},0.85), rgba(${detail.accentRgb},1))`, boxShadow: `0 0 24px ${detail.accentColor}40, 0 4px 16px rgba(0,0,0,0.4)` }}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {copy.cta}
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

/* ── Bento card ──────────────────────────────────────────────────────────── */
type BentoCardProps = {
  dataIdx: number;
  title: string;
  description: string;
  tags: string[];
  learnMore: string;
  detail: ServiceDetail;
  featured?: boolean;
  isActive: boolean;
  isDimmed: boolean;
  animationIdx: number;
  onClick: () => void;
};

function BentoCard({ dataIdx, title, description, tags, learnMore, detail, featured, isActive, isDimmed, animationIdx, onClick }: BentoCardProps) {
  const Illustration = ILLUSTRATIONS[dataIdx];
  const accent = ACCENTS[dataIdx];
  const illuHeight = featured ? "h-52" : "h-40";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay: animationIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      animate={{ opacity: isDimmed ? 0.38 : 1, scale: isDimmed ? 0.99 : 1 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300"
      style={{
        background: "rgba(10,10,20,0.65)",
        backdropFilter: "blur(12px)",
        borderColor: isActive ? detail.accentColor + "60" : accent.border,
        boxShadow: isActive
          ? `0 0 0 1px ${detail.accentColor}30, 0 8px 40px ${detail.accentColor}18, inset 0 1px 0 rgba(255,255,255,0.07)`
          : `inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Accent top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${detail.accentColor}aa, transparent)` }} />
      {isActive && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg, transparent, ${detail.accentColor}, transparent)` }} />
      )}

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent.glow}, transparent 70%)` }} />

      {/* Illustration */}
      <div className={`relative ${illuHeight} w-full shrink-0 overflow-hidden`}>
        <Illustration />
        {/* Fade to card bg */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to top, rgba(10,10,20,0.95) 0%, transparent 100%)" }} />
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
            style={{ color: detail.accentColor, borderColor: detail.accentColor + "60", background: detail.accentColor + "18", backdropFilter: "blur(8px)" }}>
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${featured ? "p-6" : "p-5"}`}>
        <h3 className={`font-display font-bold text-white leading-tight ${featured ? "text-[22px]" : "text-[18px]"}`}>{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{description}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-white/70">
              {TAG_ICONS[tag] && <span className="opacity-60">{TAG_ICONS[tag]}</span>}
              {tag}
            </span>
          ))}
        </div>

        {/* Learn more */}
        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300"
          style={{ color: isActive ? detail.accentColor : "rgba(255,255,255,0.55)" }}>
          <span className="group-hover:text-white transition-colors duration-300">{learnMore}</span>
          <motion.span
            animate={{ x: isActive ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group-hover:translate-x-1 transition-transform duration-300"
          >→</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Services section ───────────────────────────────────────────────── */
export default function Services() {
  const { t, lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  const handleClose = () => setActiveIdx(null);
  const showPanel = mounted && activeIdx !== null;

  return (
    <section id="services" className="section-separator relative isolate py-24 md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #050508 0%, #07091a 40%, #050810 70%, #050508 100%)" }} />
        <div className="absolute -left-60 top-1/4 h-[380px] w-[380px] rounded-full bg-accent-violet/[0.09] blur-[60px]" />
        <div className="absolute -right-40 bottom-1/3 h-[320px] w-[320px] rounded-full bg-accent-blue/[0.08] blur-[55px]" />
        <div className="absolute inset-0 grid-bg opacity-[0.12]" style={{ maskImage: "radial-gradient(ellipse 85% 70% at 50% 50%, black 10%, transparent 100%)" }} />
        <div className="absolute inset-x-0 top-0 h-40" style={{ background: "linear-gradient(to bottom, #050508 0%, transparent 100%)" }}/>
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to top, #080810 0%, transparent 100%)" }}/>
      </div>

      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.services.eyebrow}
          title={<>{t.services.titlePart1} <em className="display-em">{t.services.titleEmphasis}</em>{t.services.titlePart2 ? ` ${t.services.titlePart2}` : ""}</>}
          accent={t.services.accent}
          description={t.services.description}
        />

        {/* Bento grid: 12 cols on lg, 2 cols on md, 1 col on mobile */}
        <div className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
          {BENTO.map(({ dataIdx, col, row, featured }, visualIdx) => {
            const item = t.services.items[dataIdx];
            const detail = SERVICE_DETAILS[dataIdx];
            return (
              <div key={dataIdx} className={`${col} ${row} h-full`}>
                <BentoCard
                  dataIdx={dataIdx}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  learnMore={item.learnMore}
                  detail={detail}
                  featured={featured}
                  isActive={activeIdx === dataIdx}
                  isDimmed={activeIdx !== null && activeIdx !== dataIdx}
                  animationIdx={visualIdx}
                  onClick={() => setActiveIdx((prev) => (prev === dataIdx ? null : dataIdx))}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal: backdrop + modal panel */}
      {mounted && createPortal(
        <AnimatePresence>
          {showPanel && (
            <>
              <motion.div key="backdrop" className="fixed inset-0"
                style={{ zIndex: 9000, background: "rgba(3,4,10,0.65)", backdropFilter: "blur(4px)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }} onClick={handleClose} />
              <ServicePanel key="panel"
                idx={activeIdx!}
                title={t.services.items[activeIdx!].title}
                detail={SERVICE_DETAILS[activeIdx!]}
                lang={lang}
                onClose={handleClose} />
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

/* ── Section header (shared) ─────────────────────────────────────────────── */
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20 flex items-center justify-center gap-5"
      >
        <span className="h-px w-10 shrink-0 sm:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45))" }} />
        <span
          className="shrink font-black uppercase tracking-[0.1em] min-w-0 text-center"
          style={{
            fontSize: "clamp(1.6rem, 5.5vw, 4.2rem)",
            background: "linear-gradient(90deg, #00d4ff 0%, #7c5cfc 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
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
