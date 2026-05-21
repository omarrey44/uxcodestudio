"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1500,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let tween: gsap.core.Tween | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const obj = { val: 0 };
        tween = gsap.to(obj, {
          val: value,
          duration: duration / 1000,
          ease: "expo.out",
          onUpdate() {
            setN(Math.round(obj.val));
          },
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}{n}{suffix}
    </span>
  );
}
