"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPreference } from "@/lib/useMotionPreference";

type Signature = "studio" | "services" | "process" | "pricing" | "faq" | "contact";

/** Each section gets its own small animated drawing, in the site's visual language. */
function SignatureDrawing({ kind }: { kind: Signature }) {
  const drawings: Record<Signature, ReactNode> = {
    studio: <>
      <circle className="signature-guide" cx="32" cy="32" r="23" />
      <ellipse cx="32" cy="32" rx="12" ry="23" transform="rotate(-35 32 32)" />
      <ellipse className="signature-guide" cx="32" cy="32" rx="23" ry="10" transform="rotate(-35 32 32)" />
      <g className="signature-orbit"><circle className="signature-solid" cx="32" cy="9" r="4" /></g>
      <path d="M28 32h8m-4-4v8" />
    </>,
    services: <>
      <path className="signature-guide" d="M8 8h8M8 8v8m48-8h-8m8 0v8M8 56h8m-8 0v-8m48 8h-8m8 0v-8" />
      <g className="signature-compose">
        <path d="m32 7 12 12-12 12-12-12Zm0 26 12 12-12 12-12-12Z" />
        <path className="signature-fill" d="m6 32 12-12 12 12-12 12Zm28 0 12-12 12 12-12 12Z" />
      </g>
    </>,
    process: <>
      <path className="signature-guide" d="M12 15h30a10 10 0 0 1 0 20H22a9 9 0 0 0 0 18h29" />
      <path className="signature-route" pathLength="1" d="M12 15h30a10 10 0 0 1 0 20H22a9 9 0 0 0 0 18h29" />
      <circle className="signature-node node-one" cx="12" cy="15" r="4" />
      <circle className="signature-node node-two" cx="42" cy="35" r="4" />
      <path className="signature-arrival" d="m45 47 6 6-6 6" />
    </>,
    pricing: <>
      <path className="signature-guide" d="M10 9v46h46M21 48V37m11 11V28m11 20V17" />
      <path className="signature-chart" pathLength="1" d="m15 34 13-12 10 5L54 10" />
      <path className="signature-chart-tip" d="M43 10h11v11" />
      <circle className="signature-solid signature-chart-point" cx="28" cy="22" r="3" />
    </>,
    faq: <>
      <path className="signature-guide" d="M44 48h7l8 7V29a7 7 0 0 0-7-7" />
      <path d="M12 9h32a8 8 0 0 1 8 8v19a8 8 0 0 1-8 8H25L12 54V44a8 8 0 0 1-8-8V17a8 8 0 0 1 8-8Z" />
      <g className="signature-question"><path d="M22 21a6 6 0 1 1 10 4c-3 2-4 3-4 5" /><circle className="signature-solid" cx="28" cy="35" r="1.5" /></g>
      <g className="signature-answer"><circle cx="19" cy="27" r="2" /><circle cx="28" cy="27" r="2" /><circle cx="37" cy="27" r="2" /></g>
    </>,
    contact: <>
      <path className="signature-guide" d="M6 48h10M10 56h16M5 39h7" />
      <g className="signature-plane"><path className="signature-fill" d="M12 23 55 8 40 52 29 34Z" /><path d="m29 34 26-26M29 34l-3 15 8-9" /></g>
      <path className="signature-trail" pathLength="1" d="m7 57 13-13" />
    </>,
  };
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[kind]}</svg>;
}

export function SectionLabel({ number, children, kind = "services", compact = false }: {
  number: string;
  children: ReactNode;
  kind?: Signature;
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (reduced) { element.dataset.active = "false"; return; }
    let visible = false;
    const update = () => { element.dataset.active = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) element.dataset.entered = "true";
      update();
    }, { threshold: 0.2 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [reduced]);

  return <div ref={root} className={`studio-label signature-${kind}${compact ? " studio-label-compact" : ""}`}>
    <span className="studio-label-symbol"><SignatureDrawing kind={kind} /></span>
    <span className="studio-label-wordmark"><span className="studio-label-title">{children}</span><sup className="studio-label-index" aria-hidden="true">{number}</sup></span>
  </div>;
}
