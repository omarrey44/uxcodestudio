"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { createPortal } from "react-dom";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
];

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
// Monday-first
const DAYS_EN = ["Mo","Tu","We","Th","Fr","Sa","Su"];
const DAYS_ES = ["LU","MA","MI","JU","VI","SA","DO"];

const TRUST_EN = ["Fixed quote in 12h"];
const TRUST_ES = ["Cotización fija en 12h"];

const TRUST_ICONS = [
  <svg key="check" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0"><circle cx="10" cy="10" r="9" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2"/><path d="M6.5 10l2.5 2.5 4.5-5" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="shield" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0"><path d="M10 2l7 3v5c0 4-3 7-7 8C6 17 3 14 3 10V5l7-3z" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  <svg key="globe" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0"><circle cx="10" cy="10" r="8" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2"/><path d="M2 10h16M10 2c-2 2-3 5-3 8s1 6 3 8M10 2c2 2 3 5 3 8s-1 6-3 8" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>,
];

function MiniCalendar({ selected, onSelect, lang }: {
  selected: Date | null;
  onSelect: (d: Date) => void;
  lang: "en" | "es";
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTHS = lang === "es" ? MONTHS_ES : MONTHS_EN;
  const DAYS   = lang === "es" ? DAYS_ES   : DAYS_EN;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Monday-first: getDay() returns 0=Sun, convert to Mon=0
  const rawFirstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const firstDay     = (rawFirstDay + 6) % 7; // Mon=0 … Sun=6
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  // Build cells: leading prev-month days, current days, trailing null
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - firstDay - daysInMonth + 1, current: false });

  return (
    <div>
      {/* Month nav */}
      <div className="mb-5 flex items-center justify-between">
        <button type="button" onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/10 hover:text-white"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[15px] font-bold tracking-tight text-white">
          {MONTHS[viewMonth]}{" "}
          <span style={{ color: "#00d4ff" }}>{viewYear}</span>
        </span>
        <button type="button" onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/10 hover:text-white"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7">
        {DAYS.map(d => (
          <div key={d} className="py-1 text-center text-[11px] font-bold uppercase tracking-widest text-white/25">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, i) => {
          if (!cell.current) {
            return <div key={`other-${i}`} className="mx-auto flex h-9 w-9 items-center justify-center text-[13px] text-white/15">{cell.day}</div>;
          }
          const date       = new Date(viewYear, viewMonth, cell.day);
          const isPast     = date < today;
          const isSelected = selected?.toDateString() === date.toDateString();
          const isToday    = date.toDateString() === today.toDateString();

          return (
            <button
              key={`cur-${cell.day}`}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(date)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium transition-all
                ${isPast ? "cursor-not-allowed text-white/15"
                : isSelected ? "font-bold text-white shadow-lg"
                : "cursor-pointer text-white/80 hover:bg-white/10"}`}
              style={
                isSelected ? { background: "linear-gradient(135deg,#00d4ff,#0090ff)", boxShadow: "0 4px 14px rgba(0,212,255,0.4)", color: "#fff" }
                : isToday  ? { outline: "1.5px solid rgba(0,212,255,0.7)", color: "#00d4ff" }
                : {}
              }
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingModalInner({ onClose, initialService = "" }: { onClose: () => void; initialService?: string }) {
  const { t, lang } = useLanguage();

  const [date,    setDate]    = useState<Date | null>(null);
  const [time,    setTime]    = useState<string | null>(null);
  const [service, setService] = useState(initialService);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const canSubmit = !!(date && time && service && name && email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, service, message,
          date: date!.toISOString().split("T")[0],
          time,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError(lang === "es" ? "Algo salió mal. Intenta de nuevo." : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const L = {
    title:          lang === "es" ? "Reserva una llamada"                            : "Book a Call",
    subtitle:       lang === "es" ? "Elige fecha, hora y cuéntanos sobre tu proyecto": "Pick a date, time & tell us about your project",
    timeLabel:      lang === "es" ? "Horarios disponibles"                           : "Available times",
    svcLabel:       lang === "es" ? "Servicio de interés"                            : "Service of interest",
    svcPlaceholder: lang === "es" ? "Selecciona un servicio"                         : "Select a service",
    nameLabel:      lang === "es" ? "Empresa o nombre"                               : "Company or name",
    emailLabel:     lang === "es" ? "Tu email"                                       : "Your email",
    msgLabel:       lang === "es" ? "Mensaje (opcional)"                             : "Message (optional)",
    msgPlaceholder: lang === "es" ? "Cuéntanos brevemente sobre tu proyecto..."      : "Tell us briefly about your project...",
    submit:         lang === "es" ? "Confirmar reserva"                              : "Confirm booking",
    doneTitle:      lang === "es" ? "¡Cita confirmada!"                              : "Booking confirmed!",
    doneDesc:       lang === "es"
      ? "Te contactaremos pronto con el enlace de la llamada."
      : "We'll reach out soon with the meeting link.",
    timezone:       lang === "es" ? "Zona horaria: Los Ángeles (GMT-7)"              : "Timezone: Los Angeles (GMT-7)",
    trust:          lang === "es" ? TRUST_ES : TRUST_EN,
  };

  const serviceOptions = t.services.items.map(s => s.title);
  const dateStr = date
    ? date.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;

  const input = [
    "w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-colors",
    "focus:outline-none",
  ].join(" ");
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
  const inputFocusStyle = "focus:border-accent-cyan/60 focus:bg-white/[0.08]";

  return (
    <motion.div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ zIndex: 9500 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(4,6,16,0.94)", backdropFilter: "blur(14px)" }} />

      <motion.div
        className="relative w-full max-w-3xl overflow-hidden rounded-t-[28px] sm:rounded-[24px]"
        style={{
          background: "linear-gradient(160deg, #0c1228 0%, #080d1c 60%, #060a18 100%)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)",
          maxHeight: "94vh",
        }}
        initial={{ y: 60, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 60, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top glow strip */}
        <div className="absolute inset-x-0 top-0 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.6) 35%, rgba(100,80,255,0.6) 65%, transparent 100%)" }} />
        <div className="absolute inset-x-0 top-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,180,255,0.05) 0%, transparent 100%)" }} />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.18), rgba(60,80,255,0.18))", border: "1px solid rgba(0,212,255,0.2)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold leading-tight text-white">{L.title}</p>
              <p className="text-[11px] text-white">{L.subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(94vh - 73px)" }}>
          {done ? (
            <div className="flex flex-col items-center justify-center gap-5 px-8 py-16 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(80,100,255,0.15))", boxShadow: "0 0 50px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10" style={{ stroke: "#00d4ff" }}>
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-white">{L.doneTitle}</h4>
                <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{L.doneDesc}</p>
                {dateStr && time && (
                  <p className="mt-3 text-xs font-semibold capitalize" style={{ color: "#00d4ff" }}>{dateStr} · {time}</p>
                )}
              </div>
              <button onClick={onClose}
                className="mt-1 rounded-xl px-8 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg,#00d4ff,#0090ff)", boxShadow: "0 4px 20px rgba(0,212,255,0.35)" }}>
                OK
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2">

                {/* LEFT — Calendar + time slots */}
                <div className="p-6 sm:border-r" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <MiniCalendar selected={date} onSelect={d => { setDate(d); setTime(null); }} lang={lang} />

                  <AnimatePresence mode="wait">
                    {date ? (
                      <motion.div key="slots" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-5">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(0,212,255,0.6)" }}>
                          {L.timeLabel}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {TIME_SLOTS.map(slot => (
                            <button key={slot} type="button" onClick={() => setTime(slot)}
                              className="rounded-xl py-2.5 text-[12px] font-semibold transition-all active:scale-[0.96]"
                              style={time === slot
                                ? { background: "linear-gradient(135deg,#00d4ff,#0090ff)", color: "#fff", boxShadow: "0 3px 14px rgba(0,212,255,0.4)" }
                                : { border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)" }
                              }
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col items-center gap-2 text-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" className="h-8 w-8">
                          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                        </svg>
                        <p className="text-xs text-white">
                          {lang === "es" ? "Elige una fecha para ver horarios" : "Choose a date to see times"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Timezone */}
                  <div className="mt-5 flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-white">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8 1.5c-1.5 1.5-2 3-2 6.5s.5 5 2 6.5M8 1.5c1.5 1.5 2 3 2 6.5s-.5 5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[11px] text-white">{L.timezone}</span>
                  </div>
                </div>

                {/* RIGHT — Form */}
                <div className="flex flex-col gap-4 p-6">

                  {/* Service */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "rgba(0,212,255,0.7)" }}>
                      {L.svcLabel}
                    </label>
                    <div className="relative flex items-center">
                      <svg viewBox="0 0 20 20" fill="none" className="absolute left-3.5 h-4 w-4 pointer-events-none" style={{ color: "rgba(0,212,255,0.5)" }}>
                        <path d="M4 4h4v4H4zM12 4h4v4h-4zM4 12h4v4H4zM12 12h4v4h-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      </svg>
                      <select required value={service} onChange={e => setService(e.target.value)}
                        className={`${input} ${inputFocusStyle} appearance-none pl-9 pr-10 cursor-pointer`}
                        style={inputStyle}>
                        <option value="" disabled style={{ background: "#080d1c" }}>{L.svcPlaceholder}</option>
                        {serviceOptions.map(s => (
                          <option key={s} value={s} style={{ background: "#080d1c" }}>{s}</option>
                        ))}
                      </select>
                      <svg viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-3.5 h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {L.nameLabel}
                    </label>
                    <div className="relative flex items-center">
                      <svg viewBox="0 0 20 20" fill="none" className="absolute left-3.5 h-4 w-4 pointer-events-none" style={{ color: "rgba(0,212,255,0.4)" }}>
                        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      <input required type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder={L.nameLabel}
                        className={`${input} ${inputFocusStyle} pl-9`}
                        style={inputStyle} />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "rgba(0,212,255,0.7)" }}>
                      {L.emailLabel}
                    </label>
                    <div className="relative flex items-center">
                      <svg viewBox="0 0 20 20" fill="none" className="absolute left-3.5 h-4 w-4 pointer-events-none" style={{ color: "rgba(0,212,255,0.5)" }}>
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className={`${input} ${inputFocusStyle} pl-9`}
                        style={{ ...inputStyle, borderColor: "rgba(0,212,255,0.25)" }} />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {L.msgLabel}
                    </label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)}
                      placeholder={L.msgPlaceholder} rows={3}
                      className={`${input} ${inputFocusStyle} resize-none`}
                      style={inputStyle} />
                  </div>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {TRUST_ICONS[0]}
                    <span className="text-[11px] font-medium text-white">{L.trust[0]}</span>
                  </div>

                  {error && <p className="text-center text-xs text-red-400">{error}</p>}

                  {/* Submit */}
                  <button type="submit" disabled={!canSubmit || sending}
                    className="w-full rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all active:scale-[0.99] disabled:cursor-not-allowed"
                    style={canSubmit
                      ? { background: "linear-gradient(135deg,#00d4ff 0%,#0070ff 100%)", color: "#fff", boxShadow: "0 4px 28px rgba(0,212,255,0.35)" }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }
                    }
                  >
                    {sending ? "…" : `${L.submit} →`}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BookingModal({ open, onClose, initialService = "" }: { open: boolean; onClose: () => void; initialService?: string }) {
  if (typeof window === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && <BookingModalInner onClose={onClose} initialService={initialService} />}
    </AnimatePresence>,
    document.body,
  );
}
