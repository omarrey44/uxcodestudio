"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./Services";

const QUOTES = [
  {
    name: "Sofía R.",
    role: "CEO, Nebula",
    quote:
      "The handoff between design and engineering was invisible. We launched 3 weeks early and conversion doubled in the first month.",
    avatar: "from-accent-blue to-accent-cyan",
  },
  {
    name: "Marcus L.",
    role: "Co-founder, Helio",
    quote:
      "These are the people other agencies copy. The motion alone closed our Series A pitch.",
    avatar: "from-accent-violet to-accent-blue",
  },
  {
    name: "Priya K.",
    role: "Head of Product, Orbit AI",
    quote:
      "We needed an interface that feels like the future. UXCODESTUDIO delivered something investors literally applauded.",
    avatar: "from-accent-cyan to-accent-violet",
  },
  {
    name: "Daniel P.",
    role: "CTO, Lumen",
    quote:
      "Senior. Opinionated. Fast. They became part of our team within a week and never slowed down.",
    avatar: "from-accent-blue to-accent-violet",
  },
  {
    name: "Elena V.",
    role: "Marketing Lead, Flux",
    quote:
      "Every micro-interaction has intent. Our bounce rate dropped 41% the day we shipped.",
    avatar: "from-accent-cyan to-accent-blue",
  },
  {
    name: "Tomás A.",
    role: "Founder, Northwind",
    quote:
      "We've worked with three top-10 agencies. This is the only team we kept on retainer.",
    avatar: "from-accent-violet to-accent-cyan",
  },
];

export default function Testimonials() {
  // duplicate for seamless marquee
  const row = [...QUOTES, ...QUOTES];

  return (
    <section className="section-alt section-separator relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 left-1/4 h-[500px] w-[700px] rounded-full bg-accent-violet/[0.1] blur-[120px]" />
        <div className="absolute -bottom-16 right-1/4 h-[450px] w-[600px] rounded-full bg-accent-blue/[0.09] blur-[100px]" />
      </div>
      <div className="container-x">
        <SectionHeader
          eyebrow="Loved by founders"
          title="Trusted by teams who"
          accent="don't settle."
        />
      </div>

      <div className="mt-20 space-y-6 mask-fade-x">
        <div className="flex animate-marquee gap-6 will-change-transform">
          {row.map((q, i) => (
            <Card key={`a-${i}`} {...q} />
          ))}
        </div>
        <div
          className="flex animate-marquee gap-6 will-change-transform"
          style={{ animationDirection: "reverse", animationDuration: "55s" }}
        >
          {row.map((q, i) => (
            <Card key={`b-${i}`} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  name,
  role,
  quote,
  avatar,
}: {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}) {
  return (
    <motion.figure
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group relative flex w-[360px] shrink-0 flex-col justify-between rounded-2xl glass p-7 md:w-[420px]"
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-accent-blue/20 via-transparent to-accent-violet/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <div className="text-3xl text-accent-cyan">“</div>
        <blockquote className="mt-2 text-[15px] leading-relaxed text-muted">
          {quote}
        </blockquote>
      </div>
      <figcaption className="relative mt-6 flex items-center gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${avatar} font-display text-sm text-white`}
        >
          {name.charAt(0)}
        </span>
        <div className="leading-tight">
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-muted-soft">{role}</div>
        </div>
      </figcaption>
    </motion.figure>
  );
}
