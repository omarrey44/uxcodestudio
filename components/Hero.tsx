"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Asterisk, Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n";
import { useMotionPreference } from "@/lib/useMotionPreference";
import OrbitCompanion from "./three/OrbitCompanion";
import { SectionLabel } from "./studio/SectionLabel";

export default function Hero() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const root = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    let context: gsap.Context | undefined;
    const animate = () => {
      context?.revert();
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline.from(".studio-hero-line > span", { yPercent: 108, rotate: 2, duration: 1.1, stagger: 0.12 })
          .from(".studio-hero-copy > :not(h1)", { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.2)
          .from(".studio-hero-orbit", { opacity: 0, y: 28, duration: 1.2 }, 0.3);
        gsap.to(".hero-ellipse", { y: 130, rotate: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } });
      }, root);
    };
    let loaded = false;
    try { loaded = sessionStorage.getItem("loader-shown") === "1"; } catch { loaded = true; }
    if (loaded) animate();
    else window.addEventListener("loader:done", animate, { once: true });
    return () => { context?.revert(); window.removeEventListener("loader:done", animate); };
  }, [reduced, lang]);

  const principles = es
    ? ["Diseño con intención", "Desarrollo a medida", "Ideas que despegan"]
    : ["Design with intention", "Built around you", "Ideas that take off"];

  return <section id="top" ref={root} className="studio-hero">
    <div className="studio-hero-atmosphere" aria-hidden="true">
      <div className="hero-ellipse" /><div className="hero-horizon" />
      {Array.from({ length: 28 }, (_, i) => <i key={i} className="hero-star" style={{ left: ((i * 37 + 7) % 100) + "%", top: ((i * 23 + 9) % 94) + "%", animationDelay: (i % 6) + "s", opacity: 0.2 + (i % 4) * 0.15 }} />)}
    </div>
    <div className="studio-shell studio-hero-grid">
      <div className="studio-hero-copy">
        <SectionLabel number="LA" kind="studio" compact>{es ? "Estudio digital" : "Digital studio"}</SectionLabel>
        <h1>
          <span className="studio-hero-line"><span>{es ? "Tu marca." : "Your brand."}</span></span>
          <span className="studio-hero-line"><span>{es ? "A otro" : "On another"}</span></span>
          <span className="studio-hero-line hero-line-accent"><span>{es ? "nivel." : "level."}<Asterisk aria-hidden="true" /></span></span>
        </h1>
        <p className="studio-hero-description">{es
          ? "Sitios web y experiencias digitales con diseño excepcional. Hechos para llevar tu negocio más lejos."
          : "Beautiful websites and digital experiences. Thoughtfully built to take your business further."}</p>
        <div className="studio-hero-actions">
          <a href="#contact" className="studio-button studio-button-light">{es ? "Hablemos de tu proyecto" : "Let's build something"}<ArrowUpRight size={19} /></a>
          <a href="#services" className="studio-text-link">{es ? "Explorar servicios" : "Explore services"}<ArrowDown size={15} /></a>
        </div>
        <p className="studio-hero-note"><Check size={13} />{es ? "A tu medida. En español y en inglés." : "Made for you. In English & Spanish."}</p>
      </div>
      <div className="hero-scene studio-hero-orbit"><OrbitCompanion /></div>
    </div>
    <div className="studio-shell studio-hero-bottom">
      <span className="studio-coordinate">INDEPENDENT MINDS.<br /><b>EXTRAORDINARY POSSIBILITIES.</b></span>
      <a href="#services" className="studio-scroll-link"><span>{es ? "DESLIZA PARA DESCUBRIR" : "SCROLL TO DISCOVER"}</span><ArrowDown size={17} /></a>
      <span className="studio-coordinate studio-coordinate-right">34°03′ N / 118°15′ W<br /><b>CREATING EVERYWHERE.</b></span>
    </div>
    <div className="studio-marquee" aria-label={principles.join(" · ")}>
      <div className="studio-marquee-track" aria-hidden="true">
        {[0, 1, 2, 3].map((copy) => <div key={copy}>{principles.map((text) => <span key={text}>{text}<Asterisk size={22} /></span>)}</div>)}
      </div>
    </div>
  </section>;
}
