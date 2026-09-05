"use client";

import { useState, useId } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal, SectionLabel } from "./studio/StudioUI";

export default function FAQ() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const es = lang === "es";
  return <section id="faq" className="studio-faq">
    <div className="studio-shell studio-faq-grid">
      <Reveal><SectionLabel number="04" kind="faq">{es ? "Preguntas" : "Questions"}</SectionLabel>
        <h2 className="studio-heading">{es ? <>Todo empieza<br />con una<br /><em>buena pregunta.</em></> : <>It all starts<br />with a<br /><em>good question.</em></>}</h2>
        <p>{es ? "Aquí están las respuestas. Si falta la tuya, estamos a un mensaje." : "Here are the answers. If yours is missing, we're a message away."}</p>
        <a href="#contact" className="studio-text-link">{es ? "Hablemos" : "Let's talk"}<ArrowUpRight size={17} /></a>
      </Reveal>
      <div className="studio-faq-list">{t.faq.items.map((item, i) => <div key={item.q} className={"studio-faq-item" + (open === i ? " is-open" : "")}>
        <h3><button type="button" id={id + "-q-" + i} aria-expanded={open === i} aria-controls={id + "-a-" + i} onClick={() => setOpen(open === i ? null : i)}>
          <span className="studio-faq-number">0{i + 1}</span><span>{item.q}</span>{open === i ? <Minus size={19} /> : <Plus size={19} />}
        </button></h3>
        <div className="studio-faq-answer" id={id + "-a-" + i} role="region" aria-labelledby={id + "-q-" + i} inert={open !== i}><div><p>{item.a}</p></div></div>
      </div>)}</div>
    </div>
  </section>;
}
