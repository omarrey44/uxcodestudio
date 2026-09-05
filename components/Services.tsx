"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight, ArrowRight, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { SERVICE_DETAILS } from "@/lib/serviceDetails";
import { BookingModal } from "./BookingModal";
import { Reveal, SectionLabel, Spotlight, StudioModal } from "./studio/StudioUI";
import ServiceVisual from "./studio/ServiceVisual";
import ServiceExtensions from "./studio/ServiceExtensions";

const KINDS = ["website", "landing", "store"] as const;

export default function Services() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  const [active, setActive] = useState<number | null>(null);
  const [booking, setBooking] = useState<string | null>(null);
  const detail = active === null ? null : SERVICE_DETAILS[active];
  const copy = detail && (es ? detail.es : detail);

  return <section id="services" className="studio-services">
    <div className="studio-shell">
      <Reveal className="studio-section-heading">
        <div><SectionLabel number="01" kind="services">{es ? "Servicios" : "Services"}</SectionLabel>
          <h2 className="studio-heading">{es ? <>Diseño que atrae.<br /><em>Ideas que conectan.</em></> : <>Design that inspires.<br /><em>Ideas that connect.</em></>}</h2></div>
        <p>{es ? "De una primera impresión inolvidable a una experiencia que invita a quedarse. Cada detalle tiene un propósito." : "From an unforgettable first impression to an experience worth staying for. Every detail has a purpose."}</p>
      </Reveal>
      <div className="studio-services-grid">
        {t.services.items.slice(0, 3).map((service, i) => <Reveal key={service.title} className={"studio-service-slot service-slot-" + i} delay={i * 0.08}>
          <Spotlight className={"studio-service-card service-card-" + i}>
            <button type="button" onClick={() => setActive(i)} className="studio-service-button" aria-haspopup="dialog">
              <div className="studio-service-meta"><span>0{i + 1} / {i === 0 ? "WEB EXPERIENCE" : i === 1 ? "ONE PAGE. BIG IMPACT." : "DIGITAL COMMERCE"}</span><span className="studio-round-arrow"><ArrowUpRight size={21} /></span></div>
              <div className="studio-service-copy"><h3>{service.title}</h3><p>{i === 0 ? (es ? "Una presencia a la altura de tu negocio." : "A digital presence worthy of your business.") : i === 1 ? (es ? "Un mensaje claro. Un siguiente paso." : "One clear message. One next step.") : (es ? "Una tienda tan especial como lo que vendes." : "A store as special as what you sell.")}</p></div>
              <ServiceVisual kind={KINDS[i]} es={es} />
              <div className="studio-service-footer"><span>{i === 0 ? "UI/UX · DEVELOPMENT · SEO" : i === 1 ? "DESIGN · STRATEGY" : "E-COMMERCE · CHECKOUT"}</span><span>{es ? "Descubrir" : "Discover"}<ArrowRight size={14} /></span></div>
            </button>
          </Spotlight>
        </Reveal>)}
      </div>
      <ServiceExtensions onSelect={setActive} />
      <Reveal className="studio-custom-line"><span><Sparkles size={18} />{es ? "¿Tu idea no cabe en una categoría?" : "Your idea doesn't fit in a category?"}</span><a href="#contact">{es ? "Nos gustan los retos." : "We like a challenge."}<ArrowUpRight size={16} /></a></Reveal>
    </div>
    <StudioModal open={active !== null} onClose={() => setActive(null)} title={active === null ? "" : t.services.items[active].title} closeLabel={t.services.closeLabel}>
      {active !== null && copy && <>
        <p className="studio-eyebrow">{copy.eyebrow}</p><h2>{t.services.items[active].title}</h2>
        <p className="studio-modal-description">{copy.extendedDesc}</p>
        <h3>{es ? "Qué incluye" : "What's included"}</h3>
        <ul className="studio-modal-features">{copy.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
        {copy.idealFor && <div className="studio-modal-tags">{copy.idealFor.map((item) => <span key={item}>{item}</span>)}</div>}
        <button type="button" className="studio-button studio-button-cyan" onClick={() => {
          setBooking(t.services.items[active].title); setActive(null);
        }}>{copy.cta}<ArrowUpRight size={18} /></button>
      </>}
    </StudioModal>
    <BookingModal open={booking !== null} onClose={() => setBooking(null)} initialService={booking ?? ""} />
  </section>;
}

export function SectionHeader({ eyebrow, title, accent, description }: { eyebrow: string; title: ReactNode; accent?: string; description?: string }) {
  return <Reveal className="studio-section-heading"><div><SectionLabel number="01">{eyebrow}</SectionLabel><h2 className="studio-heading">{title} <em>{accent}</em></h2></div>{description && <p>{description}</p>}</Reveal>;
}
