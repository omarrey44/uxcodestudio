"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, Menu } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { StudioModal } from "./studio/StudioUI";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const es = lang === "es";
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive("#" + entry.target.id); });
    }, { rootMargin: "-20% 0px -55% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  if (pathname?.startsWith("/pay") || pathname?.startsWith("/admin")) return null;

  const languages = <div className="studio-languages" aria-label={es ? "Idioma" : "Language"}>
    {(["en", "es"] as const).map((language) => <button key={language} type="button" aria-pressed={lang === language}
      onClick={() => { if (lang !== language) router.push(language === "es" ? "/es" : "/"); }}>{language.toUpperCase()}</button>)}
  </div>;
  return <>
    <header className={"studio-nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="studio-shell studio-nav-inner">
        <a href="#top" className="studio-logo"><Image src="/logo.png" alt="UXCODESTUDIO" width={150} height={55} priority style={{ width: "auto", height: 42 }} /></a>
        <nav className="studio-nav-links" aria-label={es ? "Navegación principal" : "Main navigation"}>
          {t.nav.links.map((link) => <a key={link.href} href={link.href} className={active === link.href ? "is-active" : ""} aria-current={active === link.href ? "location" : undefined}>{link.label}</a>)}
        </nav>
        <div className="studio-nav-actions">{languages}
          <a href="#contact" className="studio-nav-cta">{es ? "Hablemos" : "Let's talk"}<ArrowUpRight size={16} /></a>
          <button type="button" className="studio-menu-toggle" aria-expanded={menuOpen} aria-label={es ? "Abrir menú" : "Open menu"} onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
        </div>
      </div>
    </header>
    <StudioModal open={menuOpen} onClose={() => setMenuOpen(false)} title={es ? "Navegación" : "Navigation"} closeLabel={es ? "Cerrar menú" : "Close menu"} className="studio-menu">
      <p className="studio-eyebrow">UXCODESTUDIO / EXPLORE</p>
      <nav>{t.nav.links.map((link, i) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{link.label}<ArrowUpRight size={26} /></a>)}</nav>
      <a href="mailto:info@uxcodestudio.com" className="studio-menu-email">info@uxcodestudio.com</a>
    </StudioModal>
  </>;
}
