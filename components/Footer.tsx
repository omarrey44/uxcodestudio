"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowRight, ChevronUp, Loader2, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import FooterTechnology from "./studio/FooterTechnology";

// Lucide no longer ships brand icons. Add Instagram/LinkedIn/YouTube here once their URLs exist.
const SOCIALS = [
  { name: "GitHub", href: "https://github.com/omarrey44", path: "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" },
];

function Newsletter({ es }: { es: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      // ponytail: reuses the contact inbox. Move to a mailing-list provider once newsletters go out.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter", email, message: "Newsletter sign-up from the site footer." }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };
  return <form className="studio-footer-newsletter" onSubmit={submit}>
    <p className="studio-footer-newsletter-title">{es ? "Mantente al día" : "Stay in the loop"}</p>
    <p className="studio-footer-newsletter-copy">{es ? "Tips, ideas y recursos para hacer crecer tu negocio en línea." : "Tips, ideas and resources to grow your business online."}</p>
    <div className="studio-footer-newsletter-field">
      <label htmlFor="footer-newsletter-email" className="sr-only">{es ? "Tu correo electrónico" : "Your email address"}</label>
      <Mail size={18} aria-hidden="true" />
      <input id="footer-newsletter-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)}
        placeholder={es ? "Tu correo electrónico" : "Your email address"} />
      <button type="submit" disabled={status === "sending"} aria-label={es ? "Suscribirme" : "Subscribe"}>
        {status === "sending" ? <Loader2 size={20} className="studio-spin" /> : <ArrowRight size={20} />}
      </button>
    </div>
    <p className="studio-footer-newsletter-status" role="status">{status === "sent"
      ? (es ? "¡Listo! Te escribiremos pronto." : "You're in. We'll be in touch.")
      : status === "error" ? (es ? "No se pudo enviar. Escríbenos a info@uxcodestudio.com." : "Couldn't subscribe. Email info@uxcodestudio.com.") : ""}</p>
  </form>;
}

export default function Footer() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  const studioLinks = [
    { href: "#process", label: es ? "Proceso" : "Process" },
    { href: "#pricing", label: es ? "Precios" : "Pricing" },
    { href: "#stack", label: es ? "Nuestro stack" : "Our stack" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: es ? "Contacto" : "Contact" },
  ];
  return <footer id="footer" className="studio-footer">
    <div className="studio-shell">
      <FooterTechnology />
      <div className="studio-footer-main">
        <div className="studio-footer-brand">
          <a href="#top" className="studio-footer-logo" aria-label={es ? "UXCODESTUDIO, volver al inicio" : "UXCODESTUDIO, back to top"}>
            <Image src="/logo.png" alt="" width={150} height={55} style={{ width: "auto", height: 44 }} />
          </a>
          <p className="studio-footer-kicker">{es ? "Sitios web · Apps · Soluciones digitales" : "Websites · Apps · Digital solutions"}</p>
          <p className="studio-footer-tagline">{es ? "Ayudamos a negocios locales a convertir ideas en experiencias digitales modernas." : "Helping local businesses turn ideas into modern digital experiences."}</p>
          <ul className="studio-footer-contact">
            <li><Mail size={18} aria-hidden="true" /><a href="mailto:info@uxcodestudio.com">info@uxcodestudio.com</a></li>
            <li><MapPin size={18} aria-hidden="true" /><span>{t.footer.description}</span></li>
          </ul>
          <ul className="studio-footer-social">
            {SOCIALS.map((social) => <li key={social.name}><a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={social.path} /></svg>
            </a></li>)}
          </ul>
        </div>
        <nav className="studio-footer-column" aria-label={es ? "Servicios" : "Services"}>
          <p className="studio-footer-heading">{es ? "Servicios" : "Services"}</p>
          <ul>{t.services.items.map((service) => <li key={service.title}><a href="#services">{service.title}</a></li>)}</ul>
        </nav>
        <nav className="studio-footer-column" aria-label={es ? "Estudio" : "Studio"}>
          <p className="studio-footer-heading">{es ? "Estudio" : "Studio"}</p>
          <ul>{studioLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
        </nav>
        <Newsletter es={es} />
      </div>
    </div>
    <div className="studio-footer-bottom">
      <div className="studio-shell studio-footer-bottom-inner">
        <span>© {new Date().getFullYear()} UXCODESTUDIO. {t.footer.copyright}</span>
        <div className="studio-footer-bottom-end">
          <nav aria-label={es ? "Idioma" : "Language"} className="studio-footer-languages">
            <a href="/" hrefLang="en" aria-current={es ? undefined : "page"}>English</a>
            <a href="/es" hrefLang="es" aria-current={es ? "page" : undefined}>Español</a>
          </nav>
          <a href="#top" className="studio-footer-top-button" aria-label={es ? "Volver arriba" : "Back to top"}><ChevronUp size={20} /></a>
        </div>
      </div>
    </div>
  </footer>;
}
