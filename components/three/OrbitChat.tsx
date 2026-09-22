"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, Send, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ORBIT_PREFILL } from "@/lib/orbitCue";
import type { OrbitAction } from "./orbitBehavior";
import styles from "./OrbitChat.module.css";

type Turn = { role: "user" | "assistant"; content: string };
type Props = { accent: string; onClose: () => void; onTalking: (talking: boolean) => void; onReact: (kind: OrbitAction) => void };

const MAX_CHARS = 600;

export default function OrbitChat({ accent, onClose, onTalking, onReact }: Props) {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const suggestions = es
    ? ["¿Cuánto cuesta una página web?", "¿Cuánto tardan en entregarla?", "¿Qué incluye una tienda en línea?"]
    : ["How much is a website?", "How long does it take?", "What's in an online store?"];

  useEffect(() => {
    input.current?.focus();
    return () => { request.current?.abort(); onTalking(false); };
  }, [onTalking]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [turns]);

  const ask = async (text: string) => {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    const history: Turn[] = [...turns, { role: "user", content: question }];
    setTurns([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);
    onTalking(true);
    request.current = new AbortController();
    let answer = "";
    try {
      const response = await fetch("/api/orbit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: request.current.signal,
      });
      if (!response.ok || !response.body) throw new Error(String(response.status));
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += value;
        setTurns([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) throw new Error("empty");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      answer = es
        ? "Uy, se me cruzaron los cables. Escríbenos a info@uxcodestudio.com o usa el formulario de contacto."
        : "Oops, my wires got crossed. Email info@uxcodestudio.com or use the contact form.";
      setTurns([...history, { role: "assistant", content: answer }]);
      onReact("sad");
    } finally {
      setBusy(false);
      onTalking(false);
    }
  };
  const submit = (event: FormEvent) => { event.preventDefault(); ask(draft); };
  const handOff = () => {
    const message = turns.filter((turn) => turn.role === "user").map((turn) => turn.content).join("\n\n");
    window.dispatchEvent(new CustomEvent(ORBIT_PREFILL, { detail: message }));
    onClose();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("contact-name")?.focus({ preventScroll: true }), 700);
  };

  return createPortal(
    <div className={styles.chat} style={{ "--orbit-accent": accent } as CSSProperties} role="dialog" aria-label={es ? "Chat con ORBIT" : "Chat with ORBIT"}
      onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <div className={styles.header}>
        <div><strong>ORBIT</strong><span>{busy ? (es ? "escribiendo…" : "typing…") : (es ? "asistente de UXCODESTUDIO" : "UXCODESTUDIO assistant")}</span></div>
        <button type="button" onClick={onClose} aria-label={es ? "Cerrar chat" : "Close chat"}><X size={17} /></button>
      </div>
      <div ref={log} className={styles.log} role="log" aria-live="polite" data-lenis-prevent>
        <p className={styles.assistant}>{es
          ? "¡Hola! Soy ORBIT. Pregúntame sobre servicios, precios o cómo empezar tu proyecto."
          : "Hi! I'm ORBIT. Ask me about services, pricing or how to start your project."}</p>
        {turns.map((turn, index) => (
          <p key={index} className={turn.role === "user" ? styles.user : styles.assistant}>
            {turn.content || <span className={styles.dots} aria-label={es ? "Pensando" : "Thinking"}><i /><i /><i /></span>}
          </p>
        ))}
        {!turns.length && <div className={styles.suggestions}>
          {suggestions.map((text) => <button key={text} type="button" onClick={() => ask(text)}>{text}</button>)}
        </div>}
      </div>
      {turns.length > 1 && !busy && (
        <button type="button" className={styles.handoff} onClick={handOff}>
          <Send size={14} />{es ? "Enviar esto al equipo" : "Send this to the team"}
        </button>
      )}
      <form className={styles.form} onSubmit={submit}>
        <textarea ref={input} rows={1} value={draft} maxLength={MAX_CHARS} disabled={busy}
          aria-label={es ? "Tu mensaje" : "Your message"} placeholder={es ? "Escribe tu pregunta…" : "Type your question…"}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(draft); } }} />
        <button type="submit" disabled={busy || !draft.trim()} aria-label={es ? "Enviar" : "Send"}><ArrowUp size={17} /></button>
      </form>
      <p className={styles.note}>{es ? "Respuestas generadas por IA. El equipo confirma precios y plazos." : "AI-generated answers. The team confirms pricing and timelines."}</p>
    </div>,
    document.body,
  );
}
