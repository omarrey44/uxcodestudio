"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./Services";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Deep-dive workshops to align on business goals, audience and the moat we're building.",
  },
  {
    n: "02",
    title: "Define",
    body: "Strategy, brand foundations, IA and motion principles documented as a living spec.",
  },
  {
    n: "03",
    title: "Design",
    body: "High-fidelity UI, prototyping and choreography mapped to real conversion targets.",
  },
  {
    n: "04",
    title: "Build",
    body: "Production engineering with Next.js, TypeScript and a tested component system.",
  },
  {
    n: "05",
    title: "Launch & Scale",
    body: "Analytics, experimentation and ongoing product partnership to compound results.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".process-node").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative py-32 md:py-40">
      <div className="container-x">
        <SectionHeader
          eyebrow="Process"
          title="A workflow tuned for"
          accent="cinematic outcomes."
          description="Five tight phases — no fluff, no surprises. You always know what's next and what success looks like."
        />

        <div className="relative mx-auto mt-20 max-w-3xl">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2">
            <span
              ref={lineRef}
              className="absolute inset-x-0 top-0 block h-full origin-top bg-gradient-to-b from-accent-blue via-accent-cyan to-accent-violet [box-shadow:0_0_20px_rgba(0,212,255,0.6)]"
            />
          </div>

          <ul className="space-y-12">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className={`process-node relative grid grid-cols-[48px_1fr] gap-6 md:grid-cols-2 md:gap-12 ${
                  i % 2 === 0 ? "md:[&>div:last-child]:order-2" : ""
                }`}
              >
                {/* Node */}
                <span className="absolute left-6 top-2 z-10 -translate-x-1/2 md:left-1/2">
                  <span className="relative grid h-5 w-5 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent-cyan/50" />
                    <span className="relative h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_18px_rgba(0,212,255,0.9)]" />
                  </span>
                </span>

                <div className="md:text-right">
                  <div className="font-display text-5xl font-bold text-white/10 md:text-7xl">
                    {s.n}
                  </div>
                </div>
                <div className="rounded-2xl glass p-6">
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
