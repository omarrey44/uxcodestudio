"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, CalendarDays, Check, LoaderCircle, Asterisk } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { BookingModal } from "./BookingModal";
import { Reveal, SectionLabel } from "./studio/StudioUI";

export default function FinalCTA() {
  const { t, lang } = useLanguage();
  const es = lang === "es";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [booking, setBooking] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Contact request failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch { setStatus("error"); }
  };
  return <section id="contact" className="studio-contact">
    <div className="studio-contact-orbit" aria-hidden="true"><span /><span /></div>
    <div className="studio-shell">
      <SectionLabel number="05" kind="contact">{es ? "Hablemos" : "Let's talk"}</SectionLabel>
      <div className="studio-contact-grid">
        <Reveal className="studio-contact-intro">
          <h2>{es ? <>¿Y si hacemos<br />algo <em>increíble?</em></> : <>Let's make<br />something <em>great.</em></>}<Asterisk className="studio-contact-star" size={72} strokeWidth={1.2} aria-hidden="true" /></h2>
          <p>{es ? "Cuéntanos lo que tienes en mente. El siguiente gran proyecto puede empezar con este mensaje." : "Tell us what's on your mind. The next great project could start with this message."}</p>
          <a href="mailto:info@uxcodestudio.com" className="studio-contact-email">info@uxcodestudio.com<ArrowUpRight size={23} /></a>
          <button type="button" className="studio-call-link" onClick={() => setBooking(true)}><CalendarDays size={18} /><span>{es ? "¿Prefieres una llamada?" : "Rather have a conversation?"}<b>{es ? "Encuentra un momento para conectar" : "Find a time to connect"}</b></span><ArrowUpRight size={19} /></button>
        </Reveal>
        <Reveal className="studio-form-card" delay={0.1}>
          <div className="studio-form-heading"><span><Mail size={18} />{es ? "TU IDEA EMPIEZA AQUÍ" : "YOUR IDEA STARTS HERE"}</span><ArrowUpRight size={20} /></div>
          <form onSubmit={submit}>
            <div className="studio-form-row">
              <label htmlFor="contact-name">{es ? "Tu nombre" : "Your name"}<input id="contact-name" name="name" required autoComplete="name" maxLength={100} placeholder={es ? "¿Cómo te llamas?" : "What should we call you?"} value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (status === "sent") setStatus("idle"); }} /></label>
              <label htmlFor="contact-email">Email<input id="contact-email" name="email" required type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (status === "sent") setStatus("idle"); }} /></label>
            </div>
            <label htmlFor="contact-message">{es ? "¿Qué te gustaría crear?" : "What would you like to create?"}<textarea id="contact-message" name="message" required rows={4} maxLength={5000} placeholder={es ? "Una nueva web, una tienda, una idea que no te deja dormir..." : "A new website, an online store, an idea you can't stop thinking about..."} value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); if (status === "sent") setStatus("idle"); }} /></label>
            <button type="submit" className="studio-button studio-button-dark" disabled={status === "sending" || status === "sent"}>
              {status === "sending" ? <>{es ? "Enviando" : "Sending"}<LoaderCircle className="studio-spin" size={18} /></> : status === "sent" ? <>{t.cta.formSent}<Check size={18} /></> : <>{es ? "Hagámoslo realidad" : "Let's make it happen"}<ArrowUpRight size={19} /></>}
            </button>
            <p className="studio-form-response" role="status">{status === "error" ? (es ? "No se pudo enviar. Inténtalo de nuevo o escríbenos por email." : "Couldn't send your message. Try again or email us directly.") : status === "sent" ? (es ? "Gracias. Pronto nos pondremos en contacto contigo." : "Thank you. We'll be in touch soon.") : (es ? "Sin compromiso. Solo el inicio de algo bueno." : "No commitment. Just the start of something good.")}</p>
          </form>
        </Reveal>
      </div>
    </div>
    <BookingModal open={booking} onClose={() => setBooking(false)} />
  </section>;
}
