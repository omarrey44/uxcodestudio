"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

// ── App-icon SVGs per service ─────────────────────────────────────────────────
const SERVICE_ICONS = [
  // Marketing Websites — globe
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>,
  // Landing Pages — rocket
  <svg key="rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>,
  // Web Applications — code
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>,
  // SaaS Platforms — layers
  <svg key="layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>,
  // Brand & Identity — fingerprint
  <svg key="fingerprint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-1.7.4-3.2 1.1-4.6" /><path d="M22 12c0 4.7-1.3 7.5-3.4 9" /><path d="M9 12c0-1.66.67-3.16 1.75-4.25" /><path d="M14 12c0 .82-.09 1.61-.26 2.37" /><path d="M12 12c0 3-1 5.5-3 7.5" /><path d="M12 8a4 4 0 0 1 4 4" />
  </svg>,
  // Mobile Apps — smartphone
  <svg key="phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" />
  </svg>,
];

// ── Icon style per service ────────────────────────────────────────────────────
const VISUALS = [
  { bg: "linear-gradient(135deg,#3b30cc 0%,#4f6ef7 100%)", glow: "rgba(79,110,247,0.55)",  glowBg: "rgba(79,110,247,0.10)",  border: "rgba(79,110,247,0.35)"  },
  { bg: "linear-gradient(135deg,#0a9bd4 0%,#00d4ff 100%)", glow: "rgba(0,212,255,0.50)",   glowBg: "rgba(0,212,255,0.09)",   border: "rgba(0,212,255,0.35)"   },
  { bg: "linear-gradient(135deg,#5b21b6 0%,#7c3aed 100%)", glow: "rgba(124,58,237,0.55)",  glowBg: "rgba(124,58,237,0.10)",  border: "rgba(124,58,237,0.35)"  },
  { bg: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)", glow: "rgba(59,130,246,0.50)",  glowBg: "rgba(59,130,246,0.09)",  border: "rgba(59,130,246,0.35)"  },
  { bg: "linear-gradient(135deg,#6d28d9 0%,#a855f7 100%)", glow: "rgba(168,85,247,0.50)",  glowBg: "rgba(168,85,247,0.09)",  border: "rgba(168,85,247,0.35)"  },
  { bg: "linear-gradient(135deg,#0284c7 0%,#06b6d4 100%)", glow: "rgba(6,182,212,0.50)",   glowBg: "rgba(6,182,212,0.09)",   border: "rgba(6,182,212,0.35)"   },
];

// ── Tag icons map ─────────────────────────────────────────────────────────────
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
  "React Native": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>,
  "Flutter":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" fill="#54C5F8"/></svg>,
  "iOS":          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="#555"/></svg>,
  "Android":      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M17.523 15.341a1.046 1.046 0 0 1-1.045-1.044 1.046 1.046 0 0 1 1.045-1.045 1.046 1.046 0 0 1 1.045 1.045 1.046 1.046 0 0 1-1.045 1.044zm-11.046 0a1.046 1.046 0 0 1-1.045-1.044 1.046 1.046 0 0 1 1.045-1.045 1.046 1.046 0 0 1 1.044 1.045 1.046 1.046 0 0 1-1.044 1.044zm11.41-6.235l1.045-1.81a.218.218 0 0 0-.08-.297.218.218 0 0 0-.296.08l-1.058 1.832A6.762 6.762 0 0 0 12 8.276c-1.008 0-1.963.223-2.817.622L8.126 7.08a.217.217 0 0 0-.296-.08.218.218 0 0 0-.08.296L8.796 9.09C7.128 9.99 6 11.701 6 13.67h12c0-1.968-1.128-3.678-2.113-4.564z" fill="#3DDC84"/></svg>,
  "Diseño":       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
};

export default function Services() {
  const { t } = useLanguage();
  const services = t.services.items.map((item, i) => ({ ...item, ...VISUALS[i], svgIcon: SERVICE_ICONS[i] }));

  return (
    <section id="services" className="section-separator relative isolate py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/ServiceSection.png')" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(5,5,8,0.72)" }} />
        <div className="absolute inset-x-0 top-0 h-40" style={{ background: "linear-gradient(to bottom, #050508 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to top, #080810 0%, transparent 100%)" }} />
      </div>

      <div className="container-x">
        <SectionHeader
          eyebrow={t.services.eyebrow}
          title={<>{t.services.titlePart1} <em className="display-em">{t.services.titleEmphasis}</em>{t.services.titlePart2 ? ` ${t.services.titlePart2}` : ""}</>}
          accent={t.services.accent}
          description={t.services.description}
        />

        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
};

function ServiceCard({ title, description, svgIcon, tags, learnMore, bg, glow, glowBg, border, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#09090f] p-7 transition-all duration-500 hover:border-white/[0.15] hover:bg-[#0c0c14]"
    >
      {/* Hover top glow line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${border}, transparent)` }}
      />
      {/* Hover inner glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px circle at 50% 0%, ${glowBg}, transparent 70%)` }}
      />

      {/* App icon */}
      <div className="relative mb-7 w-fit">
        <div
          className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[18px]"
          style={{
            background: bg,
            boxShadow: `0 0 0 1px ${border}, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        >
          {/* Glass shine */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[18px] bg-gradient-to-b from-white/25 to-transparent" />
          {svgIcon}
        </div>
        {/* Bloom glow below icon */}
        <div
          className="absolute -bottom-2 left-1/2 h-8 w-14 -translate-x-1/2 rounded-full blur-xl opacity-70"
          style={{ background: glow }}
        />
      </div>

      {/* Text */}
      <h3 className="font-display text-[22px] font-bold leading-tight text-white">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white">
        {description}
      </p>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60"
          >
            {TAG_ICONS[tag] && <span className="opacity-70">{TAG_ICONS[tag]}</span>}
            {tag}
          </span>
        ))}
      </div>

      {/* Learn more */}
      <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors duration-300 group-hover:text-white/80">
        <span>{learnMore}</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
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
        <span className="h-1 w-1 rounded-full bg-accent-cyan" />
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
