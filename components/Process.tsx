"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n";

export default function Process() {
  const { t } = useLanguage();
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
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section-deep section-separator relative py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 grid-bg opacity-[0.28]"
          style={{ maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 100%)" }}
        />
        <div className="absolute -left-32 top-1/4 h-[600px] w-[500px] rounded-full bg-accent-violet/[0.11] blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-[450px] w-[450px] rounded-full bg-accent-blue/[0.08] blur-[100px]" />
      </div>
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", lineHeight: "1.05" }}
          >
            {t.process.headlinePart1} <em className="display-em">{t.process.headlineEmphasis}</em> {t.process.headlinePart2}<br />
            <span className="text-gradient-accent">{t.process.headlineAccent}</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-soft">{t.process.sub}</p>
        </motion.div>

        <div className="relative mx-auto mt-20 max-w-3xl">
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2">
            <span
              ref={lineRef}
              className="absolute inset-x-0 top-0 block h-full origin-top bg-gradient-to-b from-accent-blue via-accent-cyan to-accent-violet [box-shadow:0_0_20px_rgba(0,212,255,0.6)]"
            />
          </div>

          <ul className="space-y-12">
            {t.process.steps.map((s, i) => (
              <li
                key={s.n}
                className={`process-node relative grid grid-cols-[48px_1fr] gap-6 md:grid-cols-2 md:gap-12 ${
                  i % 2 === 0 ? "md:[&>div:last-child]:order-2" : ""
                }`}
              >
                <span className="absolute left-6 top-2 z-10 -translate-x-1/2 md:left-1/2">
                  <span className="relative grid h-5 w-5 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent-cyan/50" />
                    <span className="relative h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_18px_rgba(0,212,255,0.9)]" />
                  </span>
                </span>
                <div className="md:text-right">
                  <div className="font-display text-5xl font-bold text-muted-dim md:text-7xl">{s.n}</div>
                </div>
                <div className="rounded-2xl glass p-6">
                  <h3 className="font-display text-2xl font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
