"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Plus, Minus, ShieldCheck, Asterisk } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { BookingModal } from "./BookingModal";
import { Reveal, SectionLabel, Spotlight } from "./studio/StudioUI";

// Pricing titles differ from service titles in both languages.
const SERVICE_ORDER = [1, 0, 2, 4, 5, 3, 6];

export default function Pricing() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  const [booking, setBooking] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const bookPlan = (index: number) => setBooking(t.services.items[SERVICE_ORDER[index]].title);
  return <section id="pricing" className="studio-pricing">
    <div className="studio-pricing-glow" aria-hidden="true" />
    <div className="studio-shell">
      <Reveal className="studio-section-heading">
        <div><SectionLabel number="03" kind="pricing">{es ? "Inversión" : "Investment"}</SectionLabel>
          <h2 className="studio-heading">{es ? <>Una gran presencia.<br /><em>Un comienzo claro.</em></> : <>A remarkable presence.<br /><em>A clear starting point.</em></>}</h2></div>
        <p>{es ? "Opciones para tu siguiente paso. Un alcance definido y una cotización antes de comenzar." : "Options for your next chapter. A defined scope and a clear quote before we start."}</p>
      </Reveal>
      <div className="studio-pricing-grid">{t.pricing.plans.slice(0, 3).map((plan, i) => {
        const amount = plan.price.replace(/^(Starting at|Desde)\s+/, "");
        return <Reveal key={plan.name} delay={i * 0.09}>
          <Spotlight className={"studio-price-card" + (plan.highlight ? " is-featured" : "")}>
            <div className="studio-price-top"><span>0{i + 1} / {i === 0 ? "THE START" : i === 1 ? "THE NEXT LEVEL" : "THE OPEN STORE"}</span>{plan.highlight && <span className="studio-popular"><Asterisk size={12} />{t.pricing.badge}</span>}</div>
            <h3>{plan.name}</h3>
            <p className="studio-plan-description">{plan.description}</p>
            <div className="studio-plan-amount"><span>{es ? "DESDE" : "FROM"}</span><strong>{amount}</strong><small>USD</small></div>
            <button type="button" className={"studio-button " + (plan.highlight ? "studio-button-cyan" : "studio-button-outline")} onClick={() => bookPlan(i)}>{es ? "Elegir este plan" : "Choose this plan"}<ArrowUpRight size={18} /></button>
            <div className="studio-plan-divider" />
            <p className="studio-eyebrow">{es ? "EL PUNTO DE PARTIDA" : "YOUR STARTING POINT"}</p>
            <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
            {plan.legalNote && <p className="studio-plan-note">{plan.legalNote}</p>}
          </Spotlight>
        </Reveal>;
      })}</div>
      <Reveal>
        <button className="studio-more-pricing" type="button" aria-expanded={expanded} aria-controls="other-pricing" onClick={() => setExpanded(!expanded)}>
          <span>{es ? "¿Buscas algo diferente?" : "Looking for something else?"}<small>{es ? "Reservas, actualizaciones, hosting y proyectos a medida." : "Booking, updates, hosting, and custom projects."}</small></span>
          <span>{es ? "Ver opciones" : "Explore options"}{expanded ? <Minus size={19} /> : <Plus size={19} />}</span>
        </button>
        <div id="other-pricing" hidden={!expanded} className="studio-other-plans">{t.pricing.plans.slice(3).map((plan, i) => <article key={plan.name}>
          <div><h3>{plan.name}</h3><p>{plan.description}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={12} />{feature}</li>)}</ul></div>
          <div className="studio-other-plan-price"><strong>{plan.price}</strong>{plan.cadence && <small>{plan.cadence}</small>}<button className="studio-text-link" type="button" onClick={() => bookPlan(i + 3)}>{plan.cta}<ArrowUpRight size={16} /></button></div>
        </article>)}</div>
        <p className="studio-pricing-legal">{t.pricing.sectionLegal}</p>
        <div className="studio-price-promise"><ShieldCheck size={19} /><span>{es ? "Diseño a medida. Comunicación directa. Sin sorpresas en el alcance." : "Tailored design. Direct communication. No surprises in the scope."}</span></div>
      </Reveal>
    </div>
    <BookingModal open={booking !== null} onClose={() => setBooking(null)} initialService={booking ?? ""} />
  </section>;
}
