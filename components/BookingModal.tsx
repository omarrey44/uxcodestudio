"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { createPortal } from "react-dom";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM",  "2:00 PM",
  "3:00 PM",  "4:00 PM",  "5:00 PM",
];

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_EN   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const DAYS_ES   = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

function MiniCalendar({
  selected, onSelect, lang,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
  lang: "en" | "es";
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
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

  const firstDay     = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-sm font-semibold text-white">{MONTHS[viewMonth]} {viewYear}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7">
        {DAYS.map(d => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white/25">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const date      = new Date(viewYear, viewMonth, day);
          const isPast    = date < today;
          const isSelected = selected?.toDateString() === date.toDateString();
          const isToday   = date.toDateString() === today.toDateString();

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(date)}
              className={`
                relative mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all
                ${isPast    ? "cursor-not-allowed text-white/15" : "cursor-pointer"}
                ${isSelected ? "font-bold text-black"            : !isPast ? "text-white hover:bg-white/10" : ""}
              `}
              style={
                isSelected  ? { background: "#00d4ff" } :
                isToday     ? { outline: "1.5px solid rgba(0,212,255,0.5)" } :
                {}
              }
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingModalInner({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLanguage();

  const [date,    setDate]    = useState<Date | null>(null);
  const [time,    setTime]    = useState<string | null>(null);
  const [service, setService] = useState("");
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
    title:     lang === "es" ? "Agenda tu llamada"                         : "Book a Call",
    subtitle:  lang === "es" ? "Selecciona fecha, hora y servicio"         : "Pick a date, time & service",
    timeLabel: lang === "es" ? "Horarios disponibles"                      : "Available times",
    svcLabel:  lang === "es" ? "¿En qué servicio estás interesado?"        : "Which service are you interested in?",
    svcPlaceholder: lang === "es" ? "Selecciona un servicio"               : "Select a service",
    nameLabel: lang === "es" ? "Tu nombre"                                 : "Your name",
    emailLabel:lang === "es" ? "Tu correo"                                 : "Your email",
    msgLabel:  lang === "es" ? "Mensaje (opcional)"                        : "Message (optional)",
    submit:    lang === "es" ? "Confirmar cita"                            : "Confirm booking",
    doneTitle: lang === "es" ? "¡Cita confirmada!"                         : "Booking confirmed!",
    doneDesc:  lang === "es"
      ? "Te contactaremos pronto con el enlace de la llamada."
      : "We'll reach out soon with the meeting link.",
    dateHint:  lang === "es" ? "Elige una fecha para ver los horarios"     : "Choose a date to see available times",
  };

  const serviceOptions = t.services.items.map(s => s.title);
  const dateStr = date
    ? date.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;

  return (
    <motion.div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ zIndex: 9500 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(3,4,10,0.88)", backdropFilter: "blur(8px)" }} />

      <motion.div
        className="relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-white/[0.1] overflow-hidden"
        style={{ background: "rgba(6,7,18,0.99)", maxHeight: "92vh" }}
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[1.5px]"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(0,212,255,0.9) 50%, transparent 95%)" }} />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-cyan/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-white">{L.title}</p>
              <p className="text-[11px] text-white/40">{L.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 68px)" }}>
          {done ? (
            <div className="flex flex-col items-center justify-center gap-5 px-8 py-14 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: "rgba(0,212,255,0.12)", boxShadow: "0 0 40px rgba(0,212,255,0.2)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-white">{L.doneTitle}</h4>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">{L.doneDesc}</p>
                {dateStr && time && (
                  <p className="mt-3 text-xs font-medium text-accent-cyan">{dateStr} · {time}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl bg-accent-cyan px-8 py-2.5 text-sm font-bold text-black transition-all hover:bg-accent-cyan/85 active:scale-[0.98]"
              >
                OK
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* LEFT — Calendar */}
                <div className="border-b border-white/[0.06] p-5 sm:border-b-0 sm:border-r">
                  <MiniCalendar selected={date} onSelect={(d) => { setDate(d); setTime(null); }} lang={lang} />

                  <AnimatePresence>
                    {date ? (
                      <motion.div
                        key="slots"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-5"
                      >
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.26em] text-white/35">{L.timeLabel}</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className="rounded-xl border py-2 text-xs font-medium transition-all active:scale-[0.97]"
                              style={time === slot
                                ? { background: "#00d4ff", borderColor: "#00d4ff", color: "#000" }
                                : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.65)" }
                              }
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 text-center text-xs text-white/25"
                      >
                        {L.dateHint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT — Form */}
                <div className="space-y-4 p-5">
                  {/* Service select */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{L.svcLabel}</label>
                    <div className="relative">
                      <select
                        required
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 pr-10 text-sm text-white focus:border-accent-cyan/50 focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="" disabled style={{ background: "#06070e" }}>{L.svcPlaceholder}</option>
                        {serviceOptions.map(s => (
                          <option key={s} value={s} style={{ background: "#06070e" }}>{s}</option>
                        ))}
                      </select>
                      <svg viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{L.nameLabel}</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={L.nameLabel}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-accent-cyan/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{L.emailLabel}</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={L.emailLabel}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-accent-cyan/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{L.msgLabel}</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={L.msgLabel}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-accent-cyan/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.07] px-5 py-4">
                {error && <p className="mb-3 text-center text-xs text-red-400">{error}</p>}

                {date && time && (
                  <p className="mb-3 text-center text-[11px] text-white/35">
                    <span className="capitalize">{dateStr}</span> · {time}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || sending}
                  className="w-full rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.99] disabled:cursor-not-allowed"
                  style={
                    canSubmit
                      ? { background: "#00d4ff", color: "#000", boxShadow: "0 0 20px rgba(0,212,255,0.3)" }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }
                  }
                >
                  {sending ? "…" : L.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (typeof window === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && <BookingModalInner onClose={onClose} />}
    </AnimatePresence>,
    document.body,
  );
}
