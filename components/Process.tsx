"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Circle, MousePointer2, PenTool, Rocket, Code2, MessageCircle, Layers, Asterisk } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { Reveal, SectionLabel } from "./studio/StudioUI";

const ICONS = [MessageCircle, Layers, PenTool, Code2, Rocket];
const SHORT = {
  es: ["Nos cuentas tu idea. Nosotros escuchamos, preguntamos y trazamos el camino.", "Definimos lo importante: alcance, estructura y una cotización clara.", "Tu marca toma forma. Diseñamos, compartimos y afinamos contigo.", "Convertimos el diseño en una experiencia rápida, adaptable y funcional.", "Revisamos cada detalle y ponemos tu proyecto en manos del mundo."],
  en: ["You share your idea. We listen, ask questions, and find the way forward.", "We define the essentials: scope, structure, and a clear quote.", "Your brand takes shape. We design, share, and refine it with you.", "We turn the design into a fast, responsive, functional experience.", "We check every detail and introduce your project to the world."]
};

export default function Process() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  const root = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  const [active, setActive] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".studio-process-card");
      cards.forEach((card, i) => {
        ScrollTrigger.create({ trigger: card, start: "top 55%", end: "bottom 25%", onEnter: () => setActive(i), onEnterBack: () => setActive(i) });
      });
      if (!reduced) media.add("(min-width: 1024px)", () => {
        cards.slice(0, -1).forEach((card, i) => {
          gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, { scale: 0.94, filter: "brightness(0.92)", transformOrigin: "center top", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 65%", end: "top 165px", scrub: true, invalidateOnRefresh: true } });
        });
      });
    }, root);
    return () => { media.revert(); context.revert(); };
  }, [reduced, lang]);

  return <section id="process" ref={root} className="studio-process">
    <div className="studio-shell">
      <SectionLabel number="02" kind="process">{es ? "El proceso" : "The process"}</SectionLabel>
      <div className="studio-process-grid">
        <div className="studio-process-intro">
          <h2 className="studio-heading">{es ? <>Del primer hola<br />al gran<br /><em>lanzamiento.</em></> : <>From the first hello<br />to the big<br /><em>launch.</em></>}</h2>
          <p>{es ? "Un proceso cercano, claro y sin vueltas. Tú traes la visión. Nosotros la hacemos realidad." : "A close collaboration. A clear process. You bring the vision. We bring it to life."}</p>
          <div className="studio-process-counter" aria-hidden="true"><span>0{active + 1}</span><i>/ 0{t.process.steps.length}</i><ArrowDownRight size={43} strokeWidth={1} /></div>
          <div className="studio-process-progress" aria-hidden="true">{t.process.steps.map((_, i) => <span key={i} className={i <= active ? "is-active" : ""} />)}</div>
          <a href="#contact" className="studio-text-link">{es ? "Empecemos con un hola" : "It starts with a hello"}<ArrowUpRight size={17} /></a>
        </div>
        <div className="studio-process-stack">{t.process.steps.map((step, i) => {
          const Icon = ICONS[i] || Circle;
          return <article key={step.n} className={"studio-process-card process-tone-" + i} style={{ top: 125 + i * 16 }}>
            <div className="studio-step-top">
              <div className="studio-step-kicker"><span>{es ? "PASO" : "STEP"}</span><span className="studio-step-number">0{i + 1}</span></div>
              <span className="studio-step-track" aria-hidden="true">{t.process.steps.map((_, n) => <i key={n} className={n <= i ? "is-filled" : ""} />)}</span>
              <span className="studio-step-icon" aria-hidden="true"><Icon size={29} strokeWidth={1.4} /></span>
            </div>
            <div className="studio-step-content"><div><h3>{step.title}</h3><p>{SHORT[lang][i] || step.body}</p></div></div>
            <div className="studio-step-outputs">{step.output.map((output) => <span key={output}><Check size={12} />{output}</span>)}</div>
            {i === 2 && <span className="studio-designer-cursor" aria-hidden="true"><MousePointer2 size={17} fill="currentColor" />UXCODESTUDIO</span>}
          </article>;
        })}</div>
      </div>
      <Reveal className="studio-process-note"><Asterisk className="studio-note-star" strokeWidth={1.2} aria-hidden="true" /><p>{es ? <>Buenas ideas. Buena comunicación.<br /><strong>Un resultado que se siente tuyo.</strong></> : <>Good ideas. Great communication.<br /><strong>A result that feels like you.</strong></>}</p></Reveal>
    </div>
  </section>;
}
