"use client";

import { ArrowUpRight, ArrowUp, Asterisk } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  return <footer className="studio-footer">
    <div className="studio-shell">
      <div className="studio-footer-top"><div><p className="studio-eyebrow">INDEPENDENT STUDIO. UNLIMITED IDEAS.</p><p>{es ? "Diseñado con intención. Construido con pasión." : "Designed with intention. Built with passion."}</p></div>
        <a href="#top" className="studio-back-top" aria-label={es ? "Volver al inicio" : "Back to top"}><ArrowUp size={22} /></a>
      </div>
      <a href="#top" className="studio-footer-wordmark" aria-label="UXCODESTUDIO"><span>uxcode</span><em>studio</em><Asterisk aria-hidden="true" /></a>
      <div className="studio-footer-bottom"><span>© {new Date().getFullYear()} UXCODESTUDIO.</span><span>{t.footer.description}</span><nav aria-label={es ? "Enlaces del pie de página" : "Footer navigation"}><a href="#services">{es ? "Servicios" : "Services"}</a><a href="#pricing">{es ? "Precios" : "Pricing"}</a><a href="#faq">FAQ</a><a href="mailto:info@uxcodestudio.com">Email<ArrowUpRight size={12} /></a></nav><span className="studio-footer-language">EN / ES</span></div>
    </div>
  </footer>;
}
