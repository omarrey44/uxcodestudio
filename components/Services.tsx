"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import React from "react";

const ShaderBackground = dynamic(() => import("./ui/ShaderBackground"), { ssr: false });

/* ── App-icon SVGs ──────────────────────────────────────────────────────────── */
const SERVICE_ICONS = [
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  <svg key="rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  <svg key="layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  <svg key="fp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-1.7.4-3.2 1.1-4.6"/><path d="M22 12c0 4.7-1.3 7.5-3.4 9"/><path d="M9 12c0-1.66.67-3.16 1.75-4.25"/><path d="M14 12c0 .82-.09 1.61-.26 2.37"/><path d="M12 12c0 3-1 5.5-3 7.5"/><path d="M12 8a4 4 0 0 1 4 4"/></svg>,
  <svg key="phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
];

/* ── Service hero images (panel top) ────────────────────────────────────────── */
const SERVICE_HERO_IMAGES = [
  // 0 Marketing — web design workspace
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80&fit=crop&auto=format",
  // 1 Growth — analytics on laptop
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&fit=crop&auto=format",
  // 2 Web Apps — UI dashboard design
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&fit=crop&auto=format",
  // 3 SaaS — developer + platform
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80&fit=crop&auto=format",
  // 4 Brand — logo / visual identity
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&fit=crop&auto=format",
  // 5 Mobile — app screens
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80&fit=crop&auto=format",
];

/* ── Service example images (3 per service shown in gallery) ─────────────────── */
const SERVICE_EXAMPLES: { src: string; caption: string; captionEs: string }[][] = [
  // 0 Marketing
  [
    { src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=440&q=75&fit=crop&auto=format", caption: "Premium landing page", captionEs: "Landing premium" },
    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=440&q=75&fit=crop&auto=format", caption: "Product showcase", captionEs: "Showcase de producto" },
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=440&q=75&fit=crop&auto=format", caption: "Brand website", captionEs: "Sitio de marca" },
  ],
  // 1 Growth
  [
    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=440&q=75&fit=crop&auto=format", caption: "Conversion dashboard", captionEs: "Dashboard de conversión" },
    { src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=440&q=75&fit=crop&auto=format", caption: "Analytics overview", captionEs: "Panel de analytics" },
    { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=440&q=75&fit=crop&auto=format", caption: "Growth metrics", captionEs: "Métricas de crecimiento" },
  ],
  // 2 Web Apps
  [
    { src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=440&q=75&fit=crop&auto=format", caption: "Admin dashboard", captionEs: "Panel de administración" },
    { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=440&q=75&fit=crop&auto=format", caption: "Dev environment", captionEs: "Entorno de desarrollo" },
    { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=440&q=75&fit=crop&auto=format", caption: "Web application", captionEs: "Aplicación web" },
  ],
  // 3 SaaS
  [
    { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=440&q=75&fit=crop&auto=format", caption: "SaaS platform", captionEs: "Plataforma SaaS" },
    { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=440&q=75&fit=crop&auto=format", caption: "Team workspace", captionEs: "Espacio de equipo" },
    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=440&q=75&fit=crop&auto=format", caption: "Usage analytics", captionEs: "Analytics de uso" },
  ],
  // 4 Brand
  [
    { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=440&q=75&fit=crop&auto=format", caption: "Brand identity", captionEs: "Identidad de marca" },
    { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=440&q=75&fit=crop&auto=format", caption: "Visual system", captionEs: "Sistema visual" },
    { src: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=440&q=75&fit=crop&auto=format", caption: "Brand guidelines", captionEs: "Manual de marca" },
  ],
  // 5 Mobile
  [
    { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=440&q=75&fit=crop&auto=format", caption: "iOS app", captionEs: "App iOS" },
    { src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=440&q=75&fit=crop&auto=format", caption: "App analytics", captionEs: "Analytics de app" },
    { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=440&q=75&fit=crop&auto=format", caption: "Mobile UX", captionEs: "UX móvil" },
  ],
];

/* ── Card visual configs ────────────────────────────────────────────────────── */
const VISUALS = [
  { bg: "linear-gradient(135deg,#3b30cc 0%,#4f6ef7 100%)", glow: "rgba(79,110,247,0.55)",  glowBg: "rgba(79,110,247,0.10)",  border: "rgba(79,110,247,0.35)"  },
  { bg: "linear-gradient(135deg,#0a9bd4 0%,#00d4ff 100%)", glow: "rgba(0,212,255,0.50)",   glowBg: "rgba(0,212,255,0.09)",   border: "rgba(0,212,255,0.35)"   },
  { bg: "linear-gradient(135deg,#5b21b6 0%,#7c3aed 100%)", glow: "rgba(124,58,237,0.55)",  glowBg: "rgba(124,58,237,0.10)",  border: "rgba(124,58,237,0.35)"  },
  { bg: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)", glow: "rgba(59,130,246,0.50)",  glowBg: "rgba(59,130,246,0.09)",  border: "rgba(59,130,246,0.35)"  },
  { bg: "linear-gradient(135deg,#6d28d9 0%,#a855f7 100%)", glow: "rgba(168,85,247,0.50)",  glowBg: "rgba(168,85,247,0.09)",  border: "rgba(168,85,247,0.35)"  },
  { bg: "linear-gradient(135deg,#0284c7 0%,#06b6d4 100%)", glow: "rgba(6,182,212,0.50)",   glowBg: "rgba(6,182,212,0.09)",   border: "rgba(6,182,212,0.35)"   },
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
type Metric   = { value: string; label: string };
type DetailCopy = {
  eyebrow: string;
  extendedDesc: string;
  includes: string[];
  metrics: Metric[];
  idealFor?: string[];
  process?: string[];
  features?: string[];
  deliverables?: string[];
  attributes?: string[];
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
    eyebrow: "Marketing", extendedDesc: "Cinematic websites that convert visitors into believers. We combine branding precision, performance engineering, and motion design to create digital flagships.",
    includes: ["Marketing websites", "CMS editable (Sanity)", "SEO architecture", "Motion design", "Performance optimization", "Interactive storytelling"],
    metrics: [{ value: "+58%", label: "Engagement" }, { value: "<1s", label: "Load speed" }, { value: "100", label: "SEO score" }],
    idealFor: ["Startups", "SaaS companies", "Premium brands", "Product launches"],
    cta: "Launch Your Brand Presence",
    accentColor: "#4f6ef7", accentRgb: "79,110,247",
    heroBg: "linear-gradient(135deg,#0a0f2e 0%,#1a1060 60%,#0d1845 100%)",
    es: {
      eyebrow: "Marketing", extendedDesc: "Sitios web cinemáticos que convierten visitantes en clientes. Combinamos branding de precisión, ingeniería de rendimiento y motion design para crear experiencias que definen categorías.",
      includes: ["Sitios de marketing", "CMS editable (Sanity)", "Arquitectura SEO", "Motion design", "Optimización de rendimiento", "Storytelling interactivo"],
      metrics: [{ value: "+58%", label: "Engagement" }, { value: "<1s", label: "Velocidad de carga" }, { value: "100", label: "Score SEO" }],
      idealFor: ["Startups", "Empresas SaaS", "Marcas premium", "Lanzamientos de producto"],
      cta: "Lanza tu Presencia de Marca",
    },
  },
  {
    eyebrow: "Growth", extendedDesc: "We equip companies with the systems and strategies to understand and accelerate their growth. CRO frameworks, analytics dashboards, and high-speed delivery — built with Next.js, React, Angular, and Python.",
    includes: ["CRO strategy", "Analytics integration", "High-speed delivery", "Next.js & React", "Angular", "Python"],
    metrics: [{ value: "+43%", label: "Conversion uplift" }, { value: "2x", label: "Qualified leads" }, { value: "↓ CAC", label: "Acquisition cost" }],
    idealFor: ["Growing companies", "SaaS teams", "E-commerce", "Scale-ups"],
    cta: "Start Growing Smarter",
    accentColor: "#00d4ff", accentRgb: "0,212,255",
    heroBg: "linear-gradient(135deg,#041824 0%,#083048 60%,#041824 100%)",
    es: {
      eyebrow: "Crecimiento", extendedDesc: "Equipamos a empresas con los sistemas y estrategias para entender y acelerar su crecimiento. Frameworks CRO, dashboards de analytics y entrega ultra-rápida — construidos con Next.js, React, Angular y Python.",
      includes: ["Estrategia CRO", "Integración de analytics", "Entrega ultra-rápida", "Next.js & React", "Angular", "Python"],
      metrics: [{ value: "+43%", label: "Aumento de conversión" }, { value: "2x", label: "Leads calificados" }, { value: "↓ CAC", label: "Costo de adquisición" }],
      idealFor: ["Empresas en crecimiento", "Equipos SaaS", "E-commerce", "Scale-ups"],
      cta: "Empieza a Crecer con Inteligencia",
    },
  },
  {
    eyebrow: "Engineering", extendedDesc: "Scalable web applications built with serious architecture. From admin dashboards to collaborative SaaS tools — production-grade systems designed for growth.",
    includes: ["SaaS platforms", "Admin dashboards", "Authentication systems", "REST & GraphQL APIs", "Real-time features", "Team collaboration"],
    metrics: [{ value: "99.9%", label: "Uptime SLA" }, { value: "<50ms", label: "API response" }, { value: "∞", label: "Scalable" }],
    process: ["Frontend", "Backend", "Database", "APIs", "Deploy"],
    cta: "Build Your Platform",
    accentColor: "#7c3aed", accentRgb: "124,58,237",
    heroBg: "linear-gradient(135deg,#0d0820 0%,#1e0d4a 60%,#0d0820 100%)",
    es: {
      eyebrow: "Ingeniería", extendedDesc: "Aplicaciones web escalables con arquitectura seria. Desde dashboards administrativos hasta herramientas SaaS colaborativas — sistemas de producción diseñados para crecer.",
      includes: ["Plataformas SaaS", "Dashboards admin", "Sistemas de autenticación", "APIs REST & GraphQL", "Funciones en tiempo real", "Colaboración en equipo"],
      metrics: [{ value: "99.9%", label: "Uptime SLA" }, { value: "<50ms", label: "Respuesta API" }, { value: "∞", label: "Escalable" }],
      process: ["Frontend", "Backend", "Base de datos", "APIs", "Deploy"],
      cta: "Construye tu Plataforma",
    },
  },
  {
    eyebrow: "Product", extendedDesc: "Full SaaS systems — from onboarding to billing, permissions to analytics. Enterprise-ready architecture that scales with your MRR from day one.",
    includes: ["Multi-tenant architecture", "Subscription billing", "Onboarding systems", "Team management", "Role permissions", "Usage analytics"],
    metrics: [{ value: "MRR+", label: "Revenue ready" }, { value: "∞", label: "Multi-tenant" }, { value: "SOC2", label: "Enterprise-ready" }],
    features: ["AI copilots", "Workflow automation", "Semantic search", "AI dashboards"],
    cta: "Launch Your SaaS",
    accentColor: "#3b82f6", accentRgb: "59,130,246",
    heroBg: "linear-gradient(135deg,#030d24 0%,#0a2060 60%,#030d24 100%)",
    es: {
      eyebrow: "Producto", extendedDesc: "Sistemas SaaS completos — desde onboarding hasta billing, permisos hasta analytics. Arquitectura enterprise-ready que escala con tu MRR desde el día uno.",
      includes: ["Arquitectura multi-tenant", "Billing por suscripción", "Sistemas de onboarding", "Gestión de equipos", "Permisos por roles", "Analytics de uso"],
      metrics: [{ value: "MRR+", label: "Listo para ingresos" }, { value: "∞", label: "Multi-tenant" }, { value: "SOC2", label: "Enterprise-ready" }],
      features: ["Copilotos IA", "Automatización de flujos", "Búsqueda semántica", "Dashboards IA"],
      cta: "Lanza tu SaaS",
    },
  },
  {
    eyebrow: "Creative", extendedDesc: "Visual identities with personality and longevity. We define how your brand looks, moves, speaks, and feels — across every touchpoint.",
    includes: ["Visual identity system", "Brand guidelines", "Typography direction", "Motion language", "Verbal tone & voice", "UI aesthetic standards"],
    metrics: [{ value: "∞", label: "Brand clarity" }, { value: "100%", label: "Custom-built" }, { value: "Full IP", label: "Ownership" }],
    deliverables: ["Logo suite", "Brand guidelines", "Motion principles", "Asset library"],
    attributes: ["Minimal", "Timeless", "Tech-first", "Cinematic"],
    cta: "Define Your Brand",
    accentColor: "#a855f7", accentRgb: "168,85,247",
    heroBg: "linear-gradient(135deg,#130820 0%,#2d0d50 60%,#130820 100%)",
    es: {
      eyebrow: "Creativo", extendedDesc: "Identidades visuales con personalidad y longevidad. Definimos cómo tu marca se ve, se mueve, habla y se siente — en cada punto de contacto.",
      includes: ["Sistema de identidad visual", "Manual de marca", "Dirección tipográfica", "Lenguaje de movimiento", "Tono y voz verbal", "Estándares de UI"],
      metrics: [{ value: "∞", label: "Claridad de marca" }, { value: "100%", label: "A medida" }, { value: "IP total", label: "Propiedad" }],
      deliverables: ["Suite de logos", "Manual de marca", "Principios de motion", "Librería de assets"],
      attributes: ["Minimal", "Atemporal", "Tech-first", "Cinemático"],
      cta: "Define tu Marca",
    },
  },
  {
    eyebrow: "Mobile", extendedDesc: "App Store-quality mobile experiences. Native performance, fluid interactions, and thoughtful UX — built for iOS and Android with no compromises.",
    includes: ["iOS native apps", "Android apps", "Cross-platform (RN/Flutter)", "Native-feel UX", "Offline support", "Push notifications"],
    metrics: [{ value: "60fps", label: "Animations" }, { value: "4.9★", label: "App Store" }, { value: "Native", label: "Interactions" }],
    features: ["Onboarding flows", "Biometric auth", "In-app payments", "Realtime sync", "App analytics"],
    cta: "Build Your Mobile App",
    accentColor: "#06b6d4", accentRgb: "6,182,212",
    heroBg: "linear-gradient(135deg,#031218 0%,#062836 60%,#031218 100%)",
    es: {
      eyebrow: "Mobile", extendedDesc: "Experiencias móviles nivel App Store. Rendimiento nativo, interacciones fluidas y UX pensada — construida para iOS y Android sin compromisos.",
      includes: ["Apps nativas iOS", "Apps Android", "Cross-platform (RN/Flutter)", "UX de sensación nativa", "Soporte offline", "Notificaciones push"],
      metrics: [{ value: "60fps", label: "Animaciones" }, { value: "4.9★", label: "App Store" }, { value: "Nativo", label: "Interacciones" }],
      features: ["Flujos de onboarding", "Autenticación biométrica", "Pagos in-app", "Sync en tiempo real", "Analytics de app"],
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
        className="h-full w-full object-cover opacity-65"
        loading="lazy"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(${detail.accentRgb},0.4) 0%, transparent 55%)` }} />
      <div className="absolute inset-0" style={{ background: "rgba(6,7,14,0.38)" }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060712] to-transparent" />
    </div>
  );
}

/* ── Examples gallery ──────────────────────────────────────────────────────── */
function ExamplesGallery({ idx, lang }: { idx: number; lang: "en" | "es" }) {
  const examples = SERVICE_EXAMPLES[idx];
  return (
    <div className="grid grid-cols-3 gap-2">
      {examples.map((ex) => (
        <div key={ex.src} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/[0.07] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ex.src}
            alt={lang === "es" ? ex.captionEs : ex.caption}
            className="h-full w-full object-cover opacity-55 transition-opacity duration-300 group-hover:opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-2 text-[9px] font-medium text-white leading-none">
            {lang === "es" ? ex.captionEs : ex.caption}
          </div>
        </div>
      ))}
    </div>
  );
}



/* ── Service panel (desktop side panel + mobile full-screen) ──────────────── */
type PanelProps = {
  idx: number;
  title: string;
  tags: string[];
  detail: ServiceDetail;
  lang: "en" | "es";
  onClose: () => void;
};

const PANEL_LABELS = {
  en: {
    included:      "What's Included",
    impact:        "Impact",
    arch:          "Architecture",
    stack:         "Tech Stack",
    idealFor:      "Ideal For",
    features:      "AI & Advanced Features",
    deliver:       "Deliverables",
    aesthetic:     "Aesthetic Direction",
    workExamples:  "Work Examples",
  },
  es: {
    included:      "Incluye",
    impact:        "Impacto",
    arch:          "Arquitectura",
    stack:         "Stack Tecnológico",
    idealFor:      "Ideal Para",
    features:      "IA y Funciones Avanzadas",
    deliver:       "Entregables",
    aesthetic:     "Dirección Estética",
    workExamples:  "Ejemplos de Trabajo",
  },
};

function ServicePanel({ idx, title, tags, detail, lang, onClose }: PanelProps) {
  const copy   = lang === "es" ? detail.es : detail;
  const labels = PANEL_LABELS[lang];

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
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl border border-white/[0.09]"
        style={{ background: "rgba(6,7,14,0.98)", backdropFilter: "blur(28px)", maxHeight: "92vh" }}
      >
        {/* Accent top line */}
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${detail.accentColor}, transparent)` }} />

        {/* Two-column layout: image left | content right */}
        <div className="flex flex-col lg:flex-row" style={{ maxHeight: "92vh" }}>

          {/* ── Left: hero image (fixed, no scroll) ───────────────────────── */}
          <div className="relative flex-none h-48 lg:h-auto lg:w-[340px]">
            <ServicePanelHero idx={idx} detail={detail} />

            {/* Title overlay at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: detail.accentColor }}>{copy.eyebrow}</span>
              <h2 className="mt-1 text-xl font-bold text-white leading-tight">{title}</h2>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-black/50 text-white transition-colors hover:bg-white/[0.12]"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Right: scrollable content ──────────────────────────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 md:p-6">
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

              <motion.p variants={fadeUp} className="text-sm leading-relaxed text-white">
                {copy.extendedDesc}
              </motion.p>

              {/* Examples gallery */}
              <motion.div variants={fadeUp}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.workExamples}</div>
                <ExamplesGallery idx={idx} lang={lang} />
              </motion.div>

              {/* Included + Impact */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.included}</div>
                  <div className="space-y-1.5">
                    {copy.includes.map((item) => (
                      <div key={item} className="flex items-start gap-1.5">
                        <span className="flex-none mt-0.5"><CheckIcon color={detail.accentColor}/></span>
                        <span className="text-[12px] text-white leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.impact}</div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {copy.metrics.map((m) => (
                        <div key={m.label} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 flex items-center gap-2">
                          <span className="text-sm font-bold leading-none" style={{ color: detail.accentColor }}>{m.value}</span>
                          <span className="text-[10px] text-white">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {copy.features && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.features}</div>
                      <div className="space-y-1">
                        {copy.features.map((f) => (
                          <div key={f} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full flex-none" style={{ background: detail.accentColor }}/>
                            <span className="text-[11px] text-white">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {copy.deliverables && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.deliver}</div>
                      <div className="space-y-1">
                        {copy.deliverables.map((d) => (
                          <div key={d} className="flex items-center gap-1.5">
                            <CheckIcon color={detail.accentColor}/>
                            <span className="text-[11px] text-white">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {copy.attributes && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.aesthetic}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {copy.attributes.map((a) => (
                          <span key={a} className="text-[11px] text-white border border-white/[0.08] rounded-full px-2 py-0.5">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Process flow */}
              {copy.process && (
                <motion.div variants={fadeUp}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.arch}</div>
                  <div className="flex flex-wrap items-center gap-1">
                    {copy.process.map((step, i) => (
                      <div key={step} className="flex items-center gap-1">
                        <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white">{step}</div>
                        {i < copy.process!.length - 1 && (
                          <svg viewBox="0 0 16 16" fill="none" width="14" height="14" className="flex-none opacity-30">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke={detail.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tech stack + Ideal for */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.stack}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-white/[0.09] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white">
                        {TAG_ICONS[tag] && <span className="opacity-70">{TAG_ICONS[tag]}</span>}
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {copy.idealFor && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">{labels.idealFor}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {copy.idealFor.map((item) => (
                        <span key={item} className="rounded-full px-2 py-0.5 text-[10px] border"
                          style={{ color: detail.accentColor, borderColor: detail.accentColor + "44", background: detail.accentColor + "11" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp} className="pb-1">
                <button
                  type="button"
                  className="group relative w-full overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-300"
                  style={{ background: `linear-gradient(135deg,${detail.accentColor}cc,${detail.accentColor})` }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {copy.cta}
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>
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
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      animate={{
        opacity: isDimmed ? 0.4 : 1,
        scale: isDimmed ? 0.985 : 1,
        filter: isDimmed ? "saturate(0.5)" : "saturate(1)",
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#09090f] transition-colors duration-300 cursor-pointer
        ${isActive ? "border-white/[0.22]" : "border-white/[0.08] hover:border-white/[0.15]"}`}
      style={isActive ? { boxShadow: `0 0 0 1px ${detail.accentColor}44, 0 8px 32px ${detail.accentColor}22` } : {}}
      onClick={onClick}
    >
      {/* Hover top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${border}, transparent)` }}/>

      {/* Active top glow line */}
      {isActive && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${detail.accentColor}, transparent)` }}/>
      )}

      {/* Hover inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px circle at 50% 0%, ${glowBg}, transparent 70%)` }}/>

      <div className="p-7">
        {/* Icon */}
        <div className="relative mb-7 w-fit">
          <div className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[18px] transition-transform duration-300 group-hover:scale-105"
            style={{ background: bg, boxShadow: `0 0 0 1px ${border}, inset 0 1px 0 rgba(255,255,255,0.2)` }}>
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[18px] bg-gradient-to-b from-white/25 to-transparent"/>
            {svgIcon}
          </div>
          <div className="absolute -bottom-2 left-1/2 h-8 w-14 -translate-x-1/2 rounded-full blur-xl opacity-70"
            style={{ background: glow }}/>
        </div>

        {/* Text */}
        <h3 className="font-display text-[22px] font-bold leading-tight text-white">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white">{description}</p>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white">
              {TAG_ICONS[tag] && <span className="opacity-70">{TAG_ICONS[tag]}</span>}
              {tag}
            </span>
          ))}
        </div>

        {/* Learn more */}
        <div className="mt-6 flex items-center gap-1.5 text-sm font-medium transition-colors duration-300"
          style={{ color: isActive ? detail.accentColor : "#ffffff" }}>
          <span>{learnMore}</span>
          <span>→</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Services section ──────────────────────────────────────────────────── */
export default function Services() {
  const { t, lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

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
        <div className="absolute inset-0 block md:hidden"
          style={{ backgroundImage: "url('/fondoMovilServices.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 hidden md:block"
          style={{ backgroundImage: "url('/fondoServices.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 hidden md:block opacity-60">
          <ShaderBackground/>
        </div>
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

        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
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
          ))}
        </div>
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
                tags={services[activeIdx!].tags}
                detail={services[activeIdx!].detail}
                lang={lang}
                onClose={handleClose}
              />
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
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
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white"
      >
        <span className="h-1 w-1 rounded-full bg-accent-cyan"/>
        {eyebrow}
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
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.9, delay: 0.28, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-balance text-white md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
