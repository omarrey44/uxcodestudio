"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./Services";
import MagneticButton from "./MagneticButton";

const PLANS = [
  {
    name: "Launchpad",
    price: "$4,900",
    cadence: "/ project",
    description: "A premium landing or single-page site to convert your next campaign.",
    features: [
      "Strategy + copy direction",
      "Custom design (Figma)",
      "Next.js + Tailwind build",
      "GSAP motion baseline",
      "1 round of revisions",
    ],
    cta: "Start a Launchpad",
    highlight: false,
  },
  {
    name: "Studio",
    price: "$14,800",
    cadence: "/ project",
    description:
      "Our flagship engagement — multi-page sites with cinematic motion and CMS.",
    features: [
      "Everything in Launchpad",
      "Up to 8 pages + CMS",
      "Full motion choreography",
      "Three.js / WebGL elements",
      "A/B + analytics setup",
      "30-day post-launch support",
    ],
    cta: "Book the Studio",
    highlight: true,
  },
  {
    name: "Product",
    price: "Custom",
    cadence: "",
    description: "A long-term partnership: design + engineering for SaaS, AI, fintech.",
    features: [
      "Embedded design + dev team",
      "Design system + component lib",
      "Full-stack engineering",
      "Quarterly product strategy",
      "Always-on Slack channel",
    ],
    cta: "Talk to founders",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-alt section-separator relative py-32 md:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-violet/10 blur-3xl" />
      </div>

      <div className="container-x">
        <SectionHeader
          eyebrow="Pricing"
          title="Transparent pricing."
          accent="No surprises."
          description="Pick a plan, get a fixed quote within 24h, and lock your start date."
        />

        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-3xl p-8 transition-transform duration-500 ${
                p.highlight
                  ? "scale-[1.02] glass-strong glow-blue lg:scale-105"
                  : "border border-white/10 bg-white/[0.02]"
              }`}
            >
              {p.highlight && (
                <>
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet opacity-40 blur-2xl" />
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent-blue/60 via-accent-cyan/40 to-accent-violet/60 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" />
                  <div className="absolute right-6 top-6">
                    <span className="rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-black">
                      Most loved
                    </span>
                  </div>
                </>
              )}

              <div className="relative">
                <div className="font-display text-lg font-semibold text-white">
                  {p.name}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-white">
                    {p.price}
                  </span>
                  <span className="text-sm text-white/50">{p.cadence}</span>
                </div>
                <p className="mt-4 text-sm text-white/60">{p.description}</p>

                <ul className="mt-7 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-white/75">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-[10px] text-black">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <MagneticButton
                    href="#contact"
                    variant={p.highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {p.cta} <span aria-hidden>→</span>
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
