"use client";

import { ArrowUpRight, ShoppingBag, Plus, ArrowRight } from "lucide-react";

/** Illustrative interface concepts, not client case studies. */
export default function ServiceVisual({ kind, es }: { kind: "website" | "landing" | "store"; es: boolean }) {
  if (kind === "website") return <div className="service-art service-art-web" aria-hidden="true">
    <div className="mock-browser">
      <div className="mock-toolbar"><span /><span /><span /><i>yourbrand.studio</i><ArrowUpRight size={10} /></div>
      <div className="mock-website">
        <div className="mock-nav"><b>forma®</b><span>Studio &nbsp; — &nbsp; {es ? "Contacto" : "Contact"}</span></div>
        <div className="mock-site-content"><div><small>{es ? "HECHO PARA DESTACAR" : "MADE TO STAND OUT"}</small><strong>{es ? <>Menos ruido.<br /><em>Más esencia.</em></> : <>Less noise.<br /><em>More meaning.</em></>}</strong><span className="mock-site-cta">{es ? "Descubre más" : "Discover more"}<ArrowUpRight size={11} /></span></div><div className="chrome-sculpture"><i /><i /><i /></div></div>
        <div className="mock-site-bottom"><span>EST. 2026</span><span>CREATIVE BY NATURE <span>↗</span></span></div>
      </div>
    </div>
    <div className="mock-floating-tag"><span />{es ? "Tu marca. Tu universo." : "Your brand. Your universe."}</div>
  </div>;
  if (kind === "landing") return <div className="service-art service-art-landing" aria-hidden="true">
    <div className="landing-orbit orbit-one" /><div className="landing-orbit orbit-two" />
    <div className="mini-landing"><small>ONE IDEA. BIG IMPACT.</small><strong>{es ? "Hazlo realidad." : "Make it happen."}</strong><span>{es ? "Comienza aquí" : "Start here"}<ArrowRight size={12} /></span></div>
    <span className="floating-cursor"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 2l16 11-8 1-4 7z" /></svg><b>{es ? "Tu próximo cliente" : "Your next customer"}</b></span>
  </div>;
  return <div className="service-art service-art-store" aria-hidden="true">
    <div className="store-product"><div className="product-orb" /><span>OBJECT / 01</span><b>{es ? "Pura forma." : "Pure form."}</b><Plus size={14} /></div>
    <div className="store-product second"><div className="product-arch" /><span>OBJECT / 02</span><b>{es ? "Otra perspectiva." : "A new perspective."}</b></div>
    <span className="store-checkout"><ShoppingBag size={14} />{es ? "De explorar a comprar" : "From browsing to buying"}</span>
  </div>;
}
