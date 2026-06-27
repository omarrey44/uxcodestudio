"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import React from "react";
import { SectionHeader } from "./Services";
import { useLanguage } from "@/lib/i18n";
import { BookingModal } from "./BookingModal";
import { Monitor, Globe, ShoppingCart, CalendarCheck, PencilLine, Server, MessageSquare } from "lucide-react";

/* ── Per-plan icon (index-aligned with pricing.plans) ──────────────────────── */
const PLAN_ICONS = [
  <Monitor       key="0" className="h-6 w-6" strokeWidth={1.6} />,
  <Globe         key="1" className="h-6 w-6" strokeWidth={1.6} />,
  <ShoppingCart  key="2" className="h-6 w-6" strokeWidth={1.6} />,
  <CalendarCheck key="3" className="h-6 w-6" strokeWidth={1.6} />,
  <PencilLine    key="4" className="h-6 w-6" strokeWidth={1.6} />,
  <Server        key="5" className="h-6 w-6" strokeWidth={1.6} />,
  <MessageSquare key="6" className="h-6 w-6" strokeWidth={1.6} />,
];

/* ── Ambient aurora background ─────────────────────────────────────────────── */

/* ── Border beam — single beam tracing card perimeter ──────────────────────── */
function BorderBeam() {
  const SEG = 200;
  const SPEED = 3.8;
  const GAP   = 3;
  const PERIOD = SPEED + GAP;

  const beam = (
    color: string,
    from: string,
    to: string,
    isVertical: boolean,
    delay: number
  ) => (
    <motion.div
      key={delay}
      className="absolute rounded-full"
      style={{
        background: `linear-gradient(${isVertical ? "180deg" : "90deg"}, transparent, ${color}, transparent)`,
        ...(isVertical
          ? { width: "1px", height: SEG, [delay < PERIOD * 2 ? "right" : "left"]: 0 }
          : { height: "1px", width: SEG, [delay < PERIOD ? "top" : "bottom"]: 0 }),
      }}
      animate={isVertical ? { y: [from, to] } : { x: [from, to] }}
      transition={{ duration: SPEED, repeat: Infinity, ease: "linear", delay, repeatDelay: GAP }}
    />
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {/* Top → right */}
      {beam("rgba(6,182,212,0.7)", `-${SEG}px`, `calc(100% + ${SEG}px)`, false, 0)}
      {/* Right ↓ bottom */}
      {beam("rgba(99,102,241,0.6)", `-${SEG}px`, `calc(100% + ${SEG}px)`, true, PERIOD * 0.85)}
      {/* Bottom ← left */}
      {beam("rgba(6,182,212,0.6)", `${SEG}px`, `calc(-100% - ${SEG}px)`, false, PERIOD * 1.7)}
      {/* Left ↑ top */}
      {beam("rgba(99,102,241,0.7)", `${SEG}px`, `calc(-100% - ${SEG}px)`, true, PERIOD * 2.55)}
    </div>
  );
}

/* ── Premium CTA button ─────────────────────────────────────────────────────── */
function PremiumCTA({ children, onClick, highlight }: { children: React.ReactNode; onClick: () => void; highlight: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [shineX, setShineX] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setShineX(((e.clientX - r.left) / r.width) * 100);
  };

  if (highlight) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.975 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="relative block w-full overflow-hidden rounded-xl text-center text-sm font-semibold text-white"
        style={{
          padding: "14px 24px",
          background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
          boxShadow: hovered
            ? "0 0 40px -6px rgba(6,182,212,0.55), 0 0 80px -20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.22)"
            : "0 0 24px -8px rgba(6,182,212,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Inner shine sweep on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ x: "-100%", opacity: 0 }}
          animate={hovered ? { x: "100%", opacity: 1 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
        />
        {/* Mouse-tracked inner glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(300px circle at ${shineX}% 50%, rgba(255,255,255,0.12), transparent 70%)`,
          }}
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
          <motion.span animate={hovered ? { x: 4 } : { x: 0 }} transition={{ duration: 0.22 }}>→</motion.span>
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block w-full overflow-hidden rounded-xl text-center text-sm font-medium transition-all duration-400"
      style={{
        padding: "14px 24px",
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
        color: "#ffffff",
        boxShadow: hovered ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <span className="inline-flex items-center gap-2">
        {children}
        <motion.span animate={hovered ? { x: 3 } : { x: 0 }} transition={{ duration: 0.22 }}>→</motion.span>
      </span>
    </motion.button>
  );
}

/* ── Single pricing card ────────────────────────────────────────────────────── */
type Plan = {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  legalNote?: string;
};

function PricingCard({ plan, index, badge, sectionVisible, onBook }: { plan: Plan; index: number; badge: string; sectionVisible: boolean; onBook: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
    setHovered(true);
  }, []);

  const onLeave = useCallback(() => { setSpot(s => ({ ...s, on: false })); setHovered(false); }, []);

  const isCenter = plan.highlight;

  return (
    <motion.div
      initial={{ y: 36 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: isCenter ? -8 : -5, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      animate={isCenter && sectionVisible ? { y: [0, -6, 0] } : {}}
      transition={isCenter
        ? { duration: 0.9, delay: index * 0.13, ease: [0.22, 1, 0.36, 1], y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" } }
        : { duration: 0.9, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }
      }
      className={`relative ${isCenter ? "lg:scale-[1.04] lg:-my-3 z-10" : "z-0"}`}
    >
      {/* Breathing ambient glow — featured only */}
      {isCenter && (
        <motion.div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem]"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(ellipse at 50% 60%, rgba(6,182,212,0.22) 0%, rgba(99,102,241,0.15) 45%, transparent 72%)",
            filter: "blur(18px)",
          }}
        />
      )}

      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative h-full overflow-hidden rounded-3xl"
        style={{
          backgroundImage: "url('/fondopricing.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "box-shadow 0.35s ease, border-color 0.35s ease",
          ...(isCenter ? {
            border: "1px solid rgba(6,182,212,0.45)",
            boxShadow: hovered
              ? "0 0 0 1px rgba(6,182,212,0.35), 0 0 80px -6px rgba(6,182,212,0.45), 0 40px 80px -24px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.14)"
              : "0 0 0 1px rgba(6,182,212,0.25), 0 0 60px -10px rgba(6,182,212,0.30), 0 40px 80px -24px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.14)",
          } : {
            border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
            boxShadow: hovered
              ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 0 48px -8px rgba(6,182,212,0.22)"
              : "inset 0 1px 0 rgba(255,255,255,0.03)",
          }),
        }}
      >
        {/* Dark overlay — center card lighter, sides darker */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isCenter
              ? "rgba(4,12,50,0.22)"
              : "rgba(2,3,12,0.76)",
          }}
        />
        {/* Mouse spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: spot.on ? 1 : 0,
            background: spot.on
              ? `radial-gradient(380px circle at ${spot.x}px ${spot.y}px, ${isCenter ? "rgba(6,182,212,0.07)" : "rgba(255,255,255,0.035)"}, transparent 60%)`
              : "none",
          }}
        />

        {/* Border beam — featured only */}
        {isCenter && sectionVisible && <BorderBeam />}

        {/* Top edge highlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: isCenter
              ? "linear-gradient(90deg, transparent 5%, rgba(6,182,212,0.5) 40%, rgba(99,102,241,0.4) 60%, transparent 95%)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col p-6">
          {/* Icon + badge */}
          <div className="mb-4 flex items-start justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background: isCenter ? "rgba(6,182,212,0.14)" : "rgba(255,255,255,0.05)",
                border: isCenter ? "1px solid rgba(6,182,212,0.30)" : "1px solid rgba(255,255,255,0.08)",
                color: isCenter ? "#22d3ee" : "#7dd3fc",
              }}
            >
              {PLAN_ICONS[index]}
            </div>
            {isCenter && (
              <motion.span
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.15))",
                  border: "1px solid rgba(6,182,212,0.28)",
                  color: "#7dd3fc",
                }}
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {badge}
              </motion.span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: isCenter ? "#22d3ee" : "#7dd3fc" }}>
            {plan.name}
          </h3>

          {/* Description */}
          <p className="mt-2.5 text-[13px] leading-relaxed text-white">{plan.description}</p>

          {/* Divider */}
          <div
            className="my-5 h-px flex-none"
            style={{
              background: isCenter
                ? "linear-gradient(90deg, transparent, rgba(6,182,212,0.18), rgba(99,102,241,0.14), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)",
            }}
          />

          {/* Price */}
          <div className="mb-5">
            {(() => {
              const m = plan.price.match(/^(Starting at|Desde)\s+(.+)$/);
              const label = m ? m[1] : null;
              const amount = m ? m[2] : plan.price;
              return (
                <>
                  {label && <div className="mb-0.5 text-xs text-white/50">{label}</div>}
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="font-display text-[2.4rem] font-bold leading-none tracking-tight text-white">
                      {amount}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">USD</span>
                    )}
                  </div>
                </>
              );
            })()}
            {plan.cadence && (
              <div className="mt-1.5 text-xs text-white/60">{plan.cadence}</div>
            )}
          </div>

          {/* Features */}
          <ul className="flex-1 space-y-2.5">
            {plan.features.map((f, fi) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 + fi * 0.045 + index * 0.1 }}
                className="flex items-start gap-2.5 text-[13px] text-white"
              >
                <span
                  className="mt-0.5 flex-none grid h-4 w-4 place-items-center rounded-full"
                  style={{
                    background: isCenter ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                    border: isCenter ? "1px solid rgba(6,182,212,0.28)" : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path
                      d="M1 3.5l1.6 1.6L6 1.5"
                      stroke={isCenter ? "#22d3ee" : "rgba(255,255,255,0.35)"}
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {f}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-6 flex-none">
            <PremiumCTA onClick={onBook} highlight={isCenter}>
              {plan.cta}
            </PremiumCTA>
            {plan.legalNote && (
              <p className="mt-2.5 text-[9px] leading-relaxed text-white/30 text-center">{plan.legalNote}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Compact pricing card (secondary plans) ───────────────────────────────── */
function CompactPricingCard({ plan, index, baseIndex, onBook }: { plan: Plan; index: number; baseIndex: number; onBook: () => void }) {
  const m = plan.price.match(/^(Starting at|Desde)\s+(.+)$/);
  const label = m ? m[1] : null;
  const amount = m ? m[2] : plan.price;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onBook}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onBook(); }}
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-xl p-5"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.018)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#7dd3fc" }}>
        {PLAN_ICONS[baseIndex]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name on top */}
        <h3 className="font-display text-base font-bold tracking-tight leading-tight" style={{ color: "#7dd3fc" }}>{plan.name}</h3>

        {/* Price + description + arrow */}
        <div className="mt-2.5 flex items-start gap-4">
          <div className="shrink-0">
            {label && <div className="text-[10px] text-white/50">{label}</div>}
            {plan.price !== "Custom" && (
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold leading-none tracking-tight text-white">{amount}</span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-white/60">USD</span>
              </div>
            )}
          </div>

          <p className="flex-1 text-[11px] leading-relaxed text-white">{plan.description}</p>

          <span className="mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition-colors duration-300 group-hover:bg-accent-cyan/15"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}>
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Pricing section ────────────────────────────────────────────────────────── */
export default function Pricing() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const sectionVisible = useInView(sectionRef, { margin: "200px" });
  const [bookingService, setBookingService] = useState<string | null>(null);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="section-separator relative py-32 md:py-44 overflow-hidden"
    >
      {/* Dark site-palette background */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(160deg, #050508 0%, #07091c 35%, #050a10 65%, #050508 100%)" }} />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[380px] w-[380px] rounded-full bg-accent-blue/[0.09] blur-[60px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/3 h-[320px] w-[320px] rounded-full bg-accent-violet/[0.08] blur-[55px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/[0.06] blur-[50px]" />

      {/* Top/bottom edge fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 -z-0"
        style={{ background: "linear-gradient(to bottom, #05060f 0%, transparent 100%)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 -z-0"
        style={{ background: "linear-gradient(to top, #05060f 0%, transparent 100%)" }} />
      {/* Subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }} />

      <div className="container-x relative z-10">
        <SectionHeader
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.title}
          accent={t.pricing.accent}
          description={t.pricing.description}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex justify-center"
        >
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.35)",
              boxShadow: "0 0 24px -8px rgba(6,182,212,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[13px] font-semibold text-white/90 md:text-sm">{t.pricing.guarantee}</span>
          </div>
        </motion.div>

        {/* Main 4 plans */}
        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {t.pricing.plans.slice(0, 4).map((p, i) => (
            <PricingCard
              key={p.name}
              plan={p}
              index={i}
              badge={t.pricing.badge}
              sectionVisible={sectionVisible}
              onBook={() => setBookingService(p.name)}
            />
          ))}
        </div>

        {/* Secondary 3 plans — compact */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.pricing.plans.slice(4).map((p, i) => (
            <CompactPricingCard key={p.name} plan={p} index={i} baseIndex={i + 4} onBook={() => setBookingService(p.name)} />
          ))}
        </div>

        {/* Section legal disclaimer */}
        <p className="mt-10 text-center text-[10px] leading-relaxed text-white/25 max-w-3xl mx-auto">
          {t.pricing.sectionLegal}
        </p>
      </div>
      <BookingModal
        open={bookingService !== null}
        onClose={() => setBookingService(null)}
        initialService={bookingService ?? ""}
      />
    </section>
  );
}
