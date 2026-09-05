"use client";

import { ArrowUpRight, ArrowRight, Check, ShieldCheck, Globe2, CalendarDays, Clock3, MousePointer2, Bell, Home, UserRound, Layers3 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal, Spotlight } from "./StudioUI";
import styles from "./ServiceExtensions.module.css";

const SERVICES = [
  {
    kind: "hosting", label: "ALWAYS CONNECTED", category: "HOSTING · SSL · SUPPORT",
    es: { description: "Tu sitio necesita una buena base. Configuramos el hosting, conectamos tu dominio y te acompañamos con el lado técnico para que puedas enfocarte en tu negocio.", features: ["Dominio y certificado SSL", "Correo profesional", "Soporte de hosting"] },
    en: { description: "Every great website needs a solid foundation. We set up hosting, connect your domain, and help with the technical side so you can focus on your business.", features: ["Domain & SSL certificate", "Professional email", "Hosting support"] },
  },
  {
    kind: "booking", label: "MAKE ROOM FOR CONNECTION", category: "BOOKING · FORMS · CONTACT",
    es: { description: "De una visita a una conversación. Reunimos reservas, solicitudes y formas de contacto en una experiencia sencilla para que tus clientes encuentren su siguiente paso.", features: ["Calendario de reservas", "Formularios y cotizaciones", "Mapa y contacto directo"] },
    en: { description: "Turn a visit into a conversation. Bring appointments, inquiries, and contact details together in one simple experience that helps customers take the next step.", features: ["Booking calendar", "Inquiry & quote forms", "Map & direct contact"] },
  },
  {
    kind: "updates", label: "A FRESH PERSPECTIVE", category: "REDESIGN · CONTENT · PERFORMANCE",
    es: { description: "Tu negocio evoluciona. Tu web también puede hacerlo. Renovamos contenido, imágenes y diseño, corregimos problemas en móvil y mejoramos la claridad de cada sección.", features: ["Contenido e imágenes", "Diseño adaptable", "Mejoras de velocidad"] },
    en: { description: "Your business evolves. Your website can too. Refresh your content, imagery, and layout, fix mobile issues, and bring clarity to every section.", features: ["Content & imagery", "Responsive design", "Speed improvements"] },
  },
  {
    kind: "apps", label: "YOUR BRAND. CLOSER.", category: "MOBILE · UI/UX · CUSTOM FEATURES",
    es: { description: "Una experiencia que tus clientes llevan consigo. Diseñamos y desarrollamos apps con cuentas, reservas, notificaciones o funciones a medida, según lo que necesita tu proyecto.", features: ["Flujos y prototipos", "Cuentas y reservas", "Funciones a medida"] },
    en: { description: "An experience your customers can take with them. We design and develop apps with accounts, booking, notifications, or custom features shaped around your project.", features: ["User flows & prototypes", "Accounts & booking", "Custom features"] },
  },
] as const;

type Kind = typeof SERVICES[number]["kind"];

/** Decorative service concepts, not live dashboards, calendars, or client work. */
function ServiceArtwork({ kind, es }: { kind: Kind; es: boolean }) {
  if (kind === "hosting") return <div className={`${styles.art} ${styles.hostingArt}`} aria-hidden="true">
    <div className={styles.hostingOrbit} />
    <div className={styles.domain}><Globe2 size={13} /><span>yourbrand.com</span><Check size={12} /></div>
    <div className={styles.racks}>{[0, 1, 2].map(i => <div className={styles.rack} key={i}><span className={styles.rackLights}><i /><i /><i /></span><span className={styles.rackVents}>|||||||||||</span><span className={styles.rackIndex}>0{i + 1}</span></div>)}</div>
    <div className={styles.hostingBase} />
    <div className={styles.ssl}><ShieldCheck size={20} /><span>SSL<strong>{es ? "Conexión segura" : "Secure connection"}</strong></span></div>
  </div>;

  if (kind === "booking") return <div className={`${styles.art} ${styles.bookingArt}`} aria-hidden="true">
    <div className={styles.calendar}>
      <div className={styles.calendarHeading}><span>{es ? "Hagamos espacio." : "Let's make time."}</span><CalendarDays size={18} /></div>
      <div className={styles.calendarDays}>{(es ? ["L", "M", "M", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"]).map((d,i) => <span key={i}>{d}</span>)}</div>
      <div className={styles.calendarDates}>{Array.from({length:21},(_,i) => <span key={i} className={i === 11 ? styles.selectedDate : ""}>{i + 1}</span>)}</div>
      <div className={styles.calendarTime}><Clock3 size={11} />10:30 AM <span>30 MIN</span></div>
    </div>
    <div className={styles.appointment}><span className={styles.appointmentIcon}><Check size={17} /></span><span>{es ? "Tu próxima cita" : "Your next appointment"}<strong>{es ? "Todo empieza con un hola." : "It starts with a hello."}</strong></span></div>
  </div>;

  if (kind === "updates") return <div className={`${styles.art} ${styles.updatesArt}`} aria-hidden="true">
    <div className={styles.beforeSite}><div className={styles.beforeToolbar}><i /><i /><i /></div><small>{es ? "ANTES" : "BEFORE"}</small><div className={styles.skeletonTitle} /><div className={styles.skeletonLine} /><div className={styles.skeletonImage} /><div className={styles.skeletonLine} /></div>
    <div className={styles.afterSite}><div className={styles.afterToolbar}><b>forma.</b><ArrowUpRight size={11} /></div><small>{es ? "UNA NUEVA ETAPA" : "A NEW CHAPTER"}</small><strong>{es ? <>Una nueva<br /><em>mirada.</em></> : <>A fresh<br /><em>perspective.</em></>}</strong><div className={styles.afterSculpture}><i /><i /></div><span className={styles.afterCta}>{es ? "Descubre lo nuevo" : "Explore what's new"}<ArrowRight size={10} /></span></div>
    <div className={styles.designCursor}><MousePointer2 size={22} fill="currentColor" /><span>{es ? "Diseño renovado" : "A refreshed design"}</span></div>
  </div>;

  return <div className={`${styles.art} ${styles.appsArt}`} aria-hidden="true">
    <div className={styles.backPhone}><span className={styles.phoneSpeaker} /><div className={styles.appProfile}><UserRound size={26} /><span>{es ? "Tu espacio." : "Your space."}</span></div><div className={styles.profileLine} /><div className={styles.profileLine} /><div className={styles.profileTiles}><i /><i /></div></div>
    <div className={styles.phone}><span className={styles.phoneSpeaker} /><div className={styles.phoneHeader}><b>hola.</b><Bell size={13} /></div><p>{es ? <>Todo,<br /><em>más cerca.</em></> : <>Everything,<br /><em>a little closer.</em></>}</p><div className={styles.appOrb} /><div className={styles.appAction}><CalendarDays size={13} /><span>{es ? "Tu próximo plan" : "Your next plan"}</span><ArrowUpRight size={12} /></div><div className={styles.appNavigation}><Home size={13} /><Layers3 size={13} /><UserRound size={13} /></div></div>
    <div className={styles.notification}><span><Bell size={15} /></span><div>{es ? "Tu marca, a un toque." : "Your brand, one tap away."}<small>{es ? "Una conexión más cercana." : "A closer connection."}</small></div></div>
  </div>;
}

export default function ServiceExtensions({ onSelect }: { onSelect: (index: number) => void }) {
  const { t, lang } = useLanguage();
  const es = lang === "es";

  return <div className={styles.grid}>
    {SERVICES.map((service, i) => {
      const index = i + 3;
      const copy = service[lang];
      const title = t.services.items[index].title;
      return <Reveal key={service.kind} delay={(i % 2) * 0.08}>
        <Spotlight className={`${styles.card} ${styles[service.kind]}`}>
          <button type="button" className={styles.button} aria-haspopup="dialog" aria-labelledby={`service-${service.kind}-title`} onClick={() => onSelect(index)}>
            <span className={styles.meta}><span>0{index + 1} / {service.label}</span><span className="studio-round-arrow"><ArrowUpRight size={21} /></span></span>
            <div className={styles.copy}><h3 id={`service-${service.kind}-title`}>{title}</h3><p>{copy.description}</p></div>
            <ServiceArtwork kind={service.kind} es={es} />
            <ul className={styles.features}>{copy.features.map(feature => <li key={feature}><Check size={13} /><span>{feature}</span></li>)}</ul>
            <span className={styles.footer}><span>{service.category}</span><span>{es ? "Descubrir" : "Discover"}<ArrowRight size={14} /></span></span>
          </button>
        </Spotlight>
      </Reveal>;
    })}
  </div>;
}
