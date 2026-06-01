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
  "Logo":         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  "Motion":       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M5 12s2.3-1 4-1 4 2 6 2 4-1 4-1V3s-2.3 1-4 1-4-2-6-2-4 1-4 1z"/><path d="M5 19v-7"/></svg>,
  "Tone":         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  "Tono":         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/></svg>,
  "Angular":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 2.25L2.2 5.77l1.52 13.23L12 22.5l8.28-3.5L21.8 5.77 12 2.25zm0 2.19l7.34 2.56-1.17 10.19L12 19.72l-6.17-2.53L4.66 6.94 12 4.44zm0 3.06L7.2 16.5h1.93l.98-2.45h3.78l.98 2.45H16.8L12 7.5zm0 2.19l1.38 3.36H10.62L12 9.69z" fill="#DD0031"/></svg>,
  "Python":       <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.403 3.347-3.403h5.768s3.24.052 3.24-3.13V3.19S18.28 0 11.914 0zm-3.21 1.849a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.403-3.347 3.403h-5.768s-3.24-.052-3.24 3.13v5.339S5.72 24 12.086 24zm3.21-1.849a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" fill="#3776AB"/></svg>,
  "React Native": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>,
  "Flutter":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" fill="#54C5F8"/></svg>,
  "iOS":          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="#555"/></svg>,
  "Android":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M17.523 15.341a1.046 1.046 0 0 1-1.045-1.044 1.046 1.046 0 0 1 1.045-1.045 1.046 1.046 0 0 1 1.045 1.045 1.046 1.046 0 0 1-1.045 1.044zm-11.046 0a1.046 1.046 0 0 1-1.045-1.044 1.046 1.046 0 0 1 1.045-1.045 1.046 1.046 0 0 1 1.044 1.045 1.046 1.046 0 0 1-1.044 1.044zm11.41-6.235l1.045-1.81a.218.218 0 0 0-.08-.297.218.218 0 0 0-.296.08l-1.058 1.832A6.762 6.762 0 0 0 12 8.276c-1.008 0-1.963.223-2.817.622L8.126 7.08a.217.217 0 0 0-.296-.08.218.218 0 0 0-.08.296L8.796 9.09C7.128 9.99 6 11.701 6 13.67h12c0-1.968-1.128-3.678-2.113-4.564z" fill="#3DDC84"/></svg>,
  "Diseño":       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
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
    eyebrow: "Most Popular",
    extendedDesc: "A business website is your company's main online home. It gives customers a clear place to learn who you are, what you offer, where you are located, and how to contact you.\n\nIt is perfect for businesses that need to look more professional, build trust, explain their services, and make it easier for customers to call, visit, book, or request a quote.\n\nWith a business website, your company can create a stronger first impression, support your Google and Apple Maps presence, and give customers the information they need before making a decision.",
    includes: ["Professional design tailored to your brand", "Mobile-friendly on all devices", "Contact form & click-to-call button", "Google Maps & location integration", "Fast loading speed", "Easy to update yourself"],
    idealFor: ["Local businesses", "Service providers", "Restaurants & retail", "Contractors & freelancers"],
    cta: "Get Your Business Website",
    accentColor: "#00d4ff", accentRgb: "0,212,255",
    heroBg: "linear-gradient(135deg,#041824 0%,#083048 60%,#041824 100%)",
    es: {
      eyebrow: "Más Popular",
      extendedDesc: "Un sitio web de negocio es el hogar principal de tu empresa en línea. Les da a los clientes un lugar claro para conocer quién eres, qué ofreces, dónde estás ubicado y cómo contactarte.\n\nEs perfecto para negocios que necesitan verse más profesionales, generar confianza, explicar sus servicios y facilitar que los clientes llamen, visiten, reserven o soliciten una cotización.\n\nCon un sitio web de negocio, tu empresa puede causar una mejor primera impresión, reforzar tu presencia en Google y Apple Maps, y darle a los clientes la información que necesitan antes de tomar una decisión.",
      includes: ["Diseño profesional para tu marca", "Compatible con celular y tablet", "Formulario de contacto y botón de llamada", "Integración con Google Maps", "Carga rápida", "Fácil de actualizar"],
      idealFor: ["Negocios locales", "Proveedores de servicios", "Restaurantes y tiendas", "Contratistas y freelancers"],
      cta: "Obtén tu Sitio Web",
    },
  },
  {
    eyebrow: "Landing Page",
    extendedDesc: "A landing page is a focused one-page website designed for a specific goal: promote a service, present an offer, collect leads, receive calls, or guide customers to take action.\n\nIt is perfect for businesses that want to advertise one main service, launch a promotion, test a new idea, or create a simple online presence without needing a full website.\n\nWith a landing page, your business can give customers the key information they need quickly, clearly, and professionally. No distractions. Just one clear message and one clear action.",
    includes: ["One professional page", "Clear headline and message", "Service or offer section", "Benefits and key information", "Contact form or call button", "Mobile-friendly design", "Basic SEO setup", "Social media links", "Clear call to action"],
    idealFor: ["New businesses", "Service promotions", "Campaign launches", "Simple online presence"],
    cta: "Get Your Landing Page",
    accentColor: "#4f6ef7", accentRgb: "79,110,247",
    heroBg: "linear-gradient(135deg,#0a0f2e 0%,#1a1060 60%,#0d1845 100%)",
    es: {
      eyebrow: "Landing Page",
      extendedDesc: "Una landing page es un sitio web de una sola página diseñado para un objetivo específico: promover un servicio, presentar una oferta, capturar leads, recibir llamadas o guiar a los clientes a tomar acción.\n\nEs perfecta para negocios que quieren publicitar un servicio principal, lanzar una promoción, probar una nueva idea o crear una presencia en línea simple sin necesitar un sitio web completo.\n\nCon una landing page, tu negocio puede dar a los clientes la información clave que necesitan de manera rápida, clara y profesional. Sin distracciones. Solo un mensaje claro y una acción clara.",
      includes: ["Una página profesional", "Encabezado y mensaje claro", "Sección de servicio u oferta", "Beneficios e información clave", "Formulario de contacto o botón de llamada", "Diseño compatible con móvil", "Configuración básica de SEO", "Links a redes sociales", "Llamada a la acción clara"],
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

/* ── Service card ───────────────────────────────────────────────────────────── */
type ServiceCardProps = {
  title: string;
  description: string;
  tags: string[];
  learnMore: string;
  svgIcon: React.ReactNode;
  bg: string;
  glow: string;
  glowBg: string;
  border: string;
  index: number;
  detail: ServiceDetail;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
};

function ServiceCard({ title, description, svgIcon, tags, learnMore, bg, glow, glowBg, border, index, detail, isActive, isDimmed, onClick }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: isDimmed ? 0.4 : 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-pointer"
    >

      <motion.div
        className="relative will-change-transform"
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* ── Front face ── */}
        <div
          className={`relative flex flex-col rounded-[22px] border p-7 transition-colors duration-300
            ${isActive || hovered ? "border-white/25" : "border-white/[0.12]"}`}
          style={{
            background: "linear-gradient(180deg,#0e0e1a 0%,#09090f 60%,#070710 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 40px -20px rgba(0,0,0,0.7)",
          }}
        >
          {/* Most popular badge */}
          {index === 0 && (
            <div className="absolute -top-3 left-6 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "linear-gradient(90deg, #4f6ef7, #00d4ff)", color: "#fff", boxShadow: "0 0 12px rgba(0,212,255,0.4)" }}>
              Most Popular
            </div>
          )}
          {/* Top edge light reflection */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${detail.accentColor}aa, transparent)` }} />
          {/* Left edge sheen */}
          <div className="pointer-events-none absolute inset-y-6 left-0 w-px opacity-60"
            style={{ background: `linear-gradient(180deg, transparent, ${detail.accentColor}55, transparent)` }} />

          {/* Floating icon block */}
          <div className="relative mb-6 w-fit">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: bg, boxShadow: `0 12px 26px -8px ${glow}, inset 0 1px 0 rgba(255,255,255,0.35)` }}>
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/30 to-transparent" />
              {svgIcon}
            </div>
          </div>

          {/* Title + description */}
          <h3 className="font-sans text-[19px] font-bold leading-snug tracking-tight" style={{
            background: `linear-gradient(95deg, #ffffff 0%, ${detail.accentColor} 120%)`,
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{title}</h3>
          <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-white">{description}</p>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white">
                {TAG_ICONS[tag] && <span className="text-white">{TAG_ICONS[tag]}</span>}
                {tag}
              </span>
            ))}
          </div>

          {/* Explore service */}
          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300"
            style={{ color: isActive || hovered ? detail.accentColor : "#ffffff" }}>
            <span>{learnMore}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
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
    <section id="services" className="section-separator relative isolate py-24 md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dark site-palette gradient background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #050508 0%, #07091a 40%, #050810 70%, #050508 100%)" }} />
        <div className="absolute -left-60 top-1/4 h-[380px] w-[380px] rounded-full bg-accent-violet/[0.09] blur-[60px]" />
        <div className="absolute -right-40 bottom-1/3 h-[320px] w-[320px] rounded-full bg-accent-blue/[0.08] blur-[55px]" />
        <div className="absolute inset-0 grid-bg opacity-[0.12]" style={{ maskImage: "radial-gradient(ellipse 85% 70% at 50% 50%, black 10%, transparent 100%)" }} />
        <div className="absolute inset-x-0 top-0 h-40"
          style={{ background: "linear-gradient(to bottom, #050508 0%, transparent 100%)" }}/>
        <div className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, #080810 0%, transparent 100%)" }}/>
      </div>

      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.services.eyebrow}
          title={<>{t.services.titlePart1} <em className="display-em">{t.services.titleEmphasis}</em>{t.services.titlePart2 ? ` ${t.services.titlePart2}` : ""}</>}
          accent={t.services.accent}
          description={t.services.description}
        />

        {/* 7 cards: 3 cols desktop — rows of 3+3+1 (last centered) */}
        <div className="mt-24 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const isLast = i === services.length - 1 && services.length % 3 === 1;
            return (
              <div key={s.title} className={isLast ? "md:col-span-2 lg:col-span-1 lg:col-start-2" : ""}>
                <ServiceCard
                  index={i}
                  title={s.title}
                  description={s.description}
                  tags={s.tags}
                  learnMore={s.learnMore}
                  svgIcon={s.svgIcon}
                  bg={s.bg}
                  glow={s.glow}
                  glowBg={s.glowBg}
                  border={s.border}
                  detail={s.detail}
                  isActive={activeIdx === i}
                  isDimmed={activeIdx !== null && activeIdx !== i}
                  onClick={() => handleToggle(i)}
                />
              </div>
            );
          })}
        </div>

        {/* Advanced services — text only */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 border-t border-white/[0.07] pt-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-4">
            {lang === "es" ? "También trabajamos en" : "We also build"}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/50">
            {(lang === "es"
              ? ["Aplicaciones Web personalizadas", "Plataformas SaaS", "Dashboards internos", "Portales de clientes", "Integraciones de API"]
              : ["Custom Web Applications", "SaaS Platforms", "Internal Dashboards", "Client Portals", "API Integrations"]
            ).map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-white/20" />
                {item}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/30">
            {lang === "es"
              ? "¿Tienes un proyecto más avanzado? "
              : "Have a more advanced project? "}
            <a href="#contact" className="text-accent-cyan hover:underline">
              {lang === "es" ? "Contáctanos." : "Contact us."}
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
