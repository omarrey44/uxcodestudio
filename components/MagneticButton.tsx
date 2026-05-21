"use client";

import { ReactNode, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className,
  variant = "primary",
  href,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const inner = (
    <motion.div
      ref={ref}
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium will-change-transform",
        variant === "primary"
          ? "bg-white text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_15px_60px_-10px_rgba(0,212,255,0.55)]"
          : "glass-strong text-white",
        className
      )}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.div>
  );

  return href ? <a href={href}>{inner}</a> : inner;
}
