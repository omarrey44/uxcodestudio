"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./Services";
import { useLanguage } from "@/lib/i18n";

const WORKS = [
  {
    title: "Nebula Analytics",
    tag: "SaaS · Dashboard",
    accent: "from-accent-blue to-accent-cyan",
    mock: <NebulaMock />,
  },
  {
    title: "Helio Wallet",
    tag: "Fintech · Web App",
    accent: "from-accent-violet to-accent-blue",
    mock: <HelioMock />,
  },
  {
    title: "Orbit AI",
    tag: "AI · Marketing site",
    accent: "from-accent-cyan to-accent-violet",
    mock: <OrbitMock />,
  },
  {
    title: "Lumen CMS",
    tag: "Platform · Tooling",
    accent: "from-accent-blue to-accent-violet",
    mock: <LumenMock />,
  },
];

export default function FeaturedWork() {
  const { t } = useLanguage();
  return (
    <section id="work" className="section-deep section-separator relative py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 grid-bg opacity-[0.25]"
          style={{ maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 25%, transparent 100%)" }}
        />
        <div className="absolute -right-24 top-1/3 h-[600px] w-[500px] rounded-full bg-accent-cyan/[0.09] blur-[120px]" />
        <div className="absolute -left-16 bottom-1/4 h-[500px] w-[500px] rounded-full bg-accent-blue/[0.09] blur-[100px]" />
      </div>
      <div className="container-x">
        <SectionHeader
          eyebrow={t.work.eyebrow}
          title={t.work.titlePart1}
          accent={t.work.accent}
          description={t.work.description}
        />

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
          {WORKS.map((w, i) => (
            <motion.article
              key={w.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
            >
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${w.accent} opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-30`}
              />
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-ink">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                  {w.mock}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              <div className="relative mt-6 flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-muted-dim">
                    {w.tag}
                  </div>
                  <div className="mt-2 font-display text-2xl font-semibold text-white">
                    {w.title}
                  </div>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                  →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* — Realistic SaaS mockups (pure SVG/CSS) — */

function NebulaMock() {
  return (
    <div className="absolute inset-0 p-6">
      <div className="flex h-full gap-3">
        <div className="w-24 rounded-xl bg-white/[0.04] p-3 backdrop-blur">
          <div className="mb-4 h-3 w-12 rounded bg-white/15" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`mb-2 h-2 rounded ${
                i === 1 ? "w-full bg-accent-cyan/70" : "w-3/4 bg-white/10"
              }`}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="rounded-xl bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-2 w-20 rounded bg-white/15" />
                <div className="mt-2 h-5 w-24 rounded bg-gradient-to-r from-accent-blue to-accent-cyan" />
              </div>
              <div className="h-8 w-16 rounded bg-emerald-400/70" />
            </div>
            <div className="mt-4 flex items-end gap-1.5 [&>span]:flex-1 [&>span]:rounded-sm">
              {[40, 70, 50, 85, 65, 92, 70, 96, 80, 60, 88, 74].map((h, i) => (
                <span
                  key={i}
                  style={{ height: h }}
                  className="bg-gradient-to-t from-accent-blue/60 to-accent-cyan"
                />
              ))}
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.04] p-3">
              <div className="h-2 w-14 rounded bg-white/15" />
              <div className="mt-3 h-12 w-12 rounded-full border-[6px] border-accent-violet/80" />
              <div className="mt-3 h-2 w-3/4 rounded bg-white/10" />
            </div>
            <div className="rounded-xl bg-white/[0.04] p-3">
              <div className="h-2 w-14 rounded bg-white/15" />
              <div className="mt-3 space-y-2">
                {[80, 55, 70].map((w, i) => (
                  <div key={i} className="h-2 rounded bg-white/10" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="h-2 flex-1 rounded bg-accent-cyan/70" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelioMock() {
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="w-64 -rotate-3 rounded-2xl bg-gradient-to-br from-accent-violet via-accent-blue to-accent-cyan p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="text-xs opacity-80">Helio · Premium</div>
          <div className="h-4 w-6 rounded-sm bg-white/30" />
        </div>
        <div className="mt-10 font-display text-2xl tracking-widest">
          •••• •••• •••• 4017
        </div>
        <div className="mt-4 flex justify-between text-[10px] opacity-80">
          <span>OMAR REYES</span>
          <span>08/29</span>
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/[0.05] p-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-muted-soft">
            Balance
          </div>
          <div className="text-[10px] text-emerald-300">+ 12.4%</div>
        </div>
        <div className="font-display text-2xl text-white">$ 48,219.04</div>
      </div>
    </div>
  );
}

function OrbitMock() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-56 w-56">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-accent-cyan/30" />
        <div className="absolute inset-4 animate-spin-slow rounded-full border border-accent-violet/40 [animation-direction:reverse]" />
        <div className="absolute inset-10 animate-spin-slow rounded-full border border-accent-blue/40" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-violet text-2xl text-white shadow-[0_0_60px_rgba(0,212,255,0.5)]">
            ✦
          </div>
        </div>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.8)]"
            style={{
              transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-100px)`,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-xl bg-white/[0.04] p-3 backdrop-blur">
        <div className="text-[10px] uppercase tracking-widest text-muted-soft">
          orbit.ai
        </div>
        <div className="font-display text-sm text-white">v3.2 · live</div>
      </div>
    </div>
  );
}

function LumenMock() {
  return (
    <div className="absolute inset-0 p-6">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-2">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          <span className="ml-4 h-2 w-40 rounded bg-white/10" />
        </div>
        <div className="flex flex-1 gap-3">
          <div className="w-32 space-y-2 rounded-xl bg-white/[0.04] p-3">
            {["Pages", "Posts", "Media", "Authors", "Settings"].map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-[10px] ${
                  i === 0 ? "bg-accent-blue/30 text-white" : "text-muted-soft"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> {s}
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-xl bg-white/[0.04] p-4">
            <div className="h-3 w-1/2 rounded bg-white/15" />
            <div className="mt-3 space-y-2">
              {[90, 70, 80, 60, 75, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded bg-white/10"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded bg-gradient-to-br from-accent-blue/30 to-accent-violet/30"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
