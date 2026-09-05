"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { useMotionPreference } from "@/lib/useMotionPreference";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(root.current, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, delay, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 94%", once: true },
        clearProps: "transform,opacity",
      });
    }, root);
    return () => context.revert();
  }, [reduced, delay]);
  return <div ref={root} className={className}>{children}</div>;
}

export { SectionLabel } from "./SectionLabel";

export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useMotionPreference();
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--pointer-x", `${event.clientX - box.left}px`);
    el.style.setProperty("--pointer-y", `${event.clientY - box.top}px`);
    el.style.setProperty("--tilt-x", `${-(event.clientY - box.top - box.height/2)/box.height * 3}deg`);
    el.style.setProperty("--tilt-y", `${(event.clientX - box.left - box.width/2)/box.width * 3}deg`);
  };
  return <div className={`studio-spotlight ${className}`} onPointerMove={move} onPointerLeave={(event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }}>{children}</div>;
}

export function StudioModal({ open, onClose, title, children, closeLabel, className = "" }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; closeLabel: string; className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) { if (element.open) element.close(); return; }
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={dialog} aria-label={title} className={`studio-modal ${className}`} onCancel={onClose}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} data-lenis-prevent>
    <div className="studio-modal-content">
      <button type="button" className="studio-modal-close" onClick={onClose} aria-label={closeLabel}><X size={21} /></button>
      {children}
    </div>
  </dialog>;
}
