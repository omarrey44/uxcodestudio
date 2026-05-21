# UXCodeStudio Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a cohesive visual refresh covering background rhythm, typography hierarchy, three new animation effects, and a redesigned 3D hero scene representing software development.

**Architecture:** Changes are layered from global tokens outward — CSS custom properties and Tailwind scale first, then shared components, then leaf components. Three new self-contained files (hook, component, component) are added with no cross-dependencies. The 3D scene is a full replacement of one file.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, TailwindCSS 3, GSAP 3, Framer Motion 12, React Three Fiber 9, Drei 10, Three.js 0.184

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Background tokens, section utility classes, section separator, `.display-em` |
| `tailwind.config.ts` | Modify | Add fluid `fontSize` entries for `display` and `h2` |
| `app/layout.tsx` | Modify | Import and render `<CustomCursor />` |
| `components/Services.tsx` | Modify | Apply `.section-alt`, update `SectionHeader` definition (shared — used by Process, WhyChooseUs, Testimonials, FAQ, FinalCTA via import), add `data-cursor-hover` to TiltCard |
| `components/Process.tsx` | Modify | Apply `.section-deep` |
| `components/WhyChooseUs.tsx` | Modify | Apply `.section-alt`, replace inline counter with `<AnimatedCounter />` |
| `components/Testimonials.tsx` | Modify | Apply `.section-deep` |
| `components/Pricing.tsx` | Modify | Apply `.section-alt`, add `data-cursor-hover` to plan cards |
| `components/FinalCTA.tsx` | Modify | Apply `.section-deep` |
| `components/Hero.tsx` | Modify | Apply `useTextScramble` to headline, update heading classes |
| `components/MagneticButton.tsx` | Modify | Add `data-cursor-hover` attribute |
| `components/three/HeroScene.tsx` | Rewrite | Code orbit scene: 3 orbital rings with syntax tokens, central core, particle field |
| `lib/hooks/useTextScramble.ts` | Create | `useTextScramble(text, duration)` → `displayText` via rAF |
| `components/AnimatedCounter.tsx` | Create | Extracted counter from `WhyChooseUs.StatCard`, reusable with `value`, `suffix`, `prefix` props |
| `components/CustomCursor.tsx` | Create | Custom cursor with trail, lerp lag, hover expand + blend mode, desktop-only |

---

## Task 1: Background System

**Files:**
- Modify: `app/globals.css`
- Modify: `components/Services.tsx`
- Modify: `components/Process.tsx`
- Modify: `components/WhyChooseUs.tsx`
- Modify: `components/Testimonials.tsx`
- Modify: `components/Pricing.tsx`
- Modify: `components/FinalCTA.tsx`

- [ ] **Step 1: Add background tokens and utility classes to `globals.css`**

Add inside `:root {}` (after `--foreground: #f5f7ff;`):
```css
--bg-base: #050508;
--bg-section: #080810;
--bg-section-deep: #0c0c18;
```

Add inside `@layer components {}` (after `.grid-bg {}`):
```css
.section-alt {
  background-color: var(--bg-section);
}

.section-deep {
  background-color: var(--bg-section-deep);
  position: relative;
}
.section-deep::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% -20%, rgba(139, 92, 246, 0.06), transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.section-separator {
  position: relative;
}
.section-separator::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(79, 110, 247, 0.2) 30%,
    rgba(0, 212, 255, 0.15) 50%,
    rgba(79, 110, 247, 0.2) 70%,
    transparent
  );
}
```

- [ ] **Step 2: Apply background classes to section components**

In `components/Services.tsx`, update the `<section>` opening tag:
```tsx
// Before:
<section id="services" className="relative py-32 md:py-40">
// After:
<section id="services" className="section-alt section-separator relative py-32 md:py-40">
```

In `components/Process.tsx`:
```tsx
// Before:
<section id="process" ref={sectionRef} className="relative py-32 md:py-40">
// After:
<section id="process" ref={sectionRef} className="section-deep section-separator relative py-32 md:py-40">
```

In `components/WhyChooseUs.tsx`:
```tsx
// Before:
<section className="relative overflow-hidden py-32 md:py-40">
// After:
<section className="section-alt section-separator relative overflow-hidden py-32 md:py-40">
```

In `components/Testimonials.tsx`, find the outer `<section>` and add `section-deep section-separator`.

In `components/Pricing.tsx`, find the outer `<section>` and add `section-alt section-separator`.

In `components/FinalCTA.tsx`, find the outer `<section>` and add `section-deep`.

- [ ] **Step 3: Verify in browser**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio
npm run dev
```

Open http://localhost:3000 and scroll through all sections. Each section should have a subtly different background. The gradient separator line should be visible at the bottom of each section. No layout breaks.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/Services.tsx components/Process.tsx components/WhyChooseUs.tsx components/Testimonials.tsx components/Pricing.tsx components/FinalCTA.tsx
git commit -m "feat: add alternating background system with section tokens and separators"
```

---

## Task 2: Typography System

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `components/Services.tsx` (SectionHeader)
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Add fluid fontSize scale to `tailwind.config.ts`**

Inside `theme.extend`, add a `fontSize` key after `backgroundImage`:
```ts
fontSize: {
  display: ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "800" }],
  h2: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
  h3: ["clamp(1.25rem, 2vw, 1.75rem)", { lineHeight: "1.1" }],
},
```

- [ ] **Step 2: Add `.display-em` utility class to `globals.css`**

Inside `@layer components {}`, add after `.noise {}`:
```css
.display-em {
  font-style: italic;
  font-weight: 500;
  color: rgba(199, 210, 254, 0.85);
}
```

- [ ] **Step 3: Update `SectionHeader` in `components/Services.tsx`**

**Important:** `SectionHeader` is **defined once** in `components/Services.tsx` (lines 160–194) and is **imported by** `Process.tsx`, `WhyChooseUs.tsx`, `FeaturedWork.tsx`, `Testimonials.tsx`, `Pricing.tsx`, `FAQ.tsx`, and `FinalCTA.tsx`. Changing it here propagates automatically to **all sections** — no need to touch any of those files for heading markup updates. Update the eyebrow label and h2:

```tsx
// Eyebrow — before:
className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-white/60"
// Eyebrow — after:
className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white/50"

// h2 — before:
className="font-display text-4xl font-bold leading-[1.05] text-white text-balance md:text-6xl"
// h2 — after:
className="font-display text-h2 font-bold text-white text-balance"
```

- [ ] **Step 6: Confirm `SectionHeader` propagation covers FeaturedWork and FAQ**

Both `components/FeaturedWork.tsx` (line 4) and `components/FAQ.tsx` (line 5) import `SectionHeader` from `./Services`. No additional changes needed in those files — the typography update in Step 3 already applies.

- [ ] **Step 5: Apply `.display-em` italic/weight mixing to section headlines**

Update `SectionHeader` in `components/Services.tsx` to accept `React.ReactNode` as the `title` prop (so JSX with `<em>` can be passed):

```tsx
// Change the interface from:
title: string;
// To:
title: React.ReactNode;
```

Then update 3 representative section usages in `app/page.tsx` — no, `SectionHeader` is called inside each component. Update the `title` prop in:

**`components/Services.tsx`** (its own usage):
```tsx
// Before:
<SectionHeader
  eyebrow="Services"
  title="Engineered for momentum,"
  accent="designed for awe."
```
```tsx
// After:
<SectionHeader
  eyebrow="Services"
  title={<>Engineered <em className="display-em">for</em> momentum,</>}
  accent="designed for awe."
```

**`components/Process.tsx`**:
```tsx
// Before:
title="A workflow tuned for"
accent="cinematic outcomes."
// After:
title={<>A workflow <em className="display-em">tuned</em> for</>}
accent="cinematic outcomes."
```

**`components/WhyChooseUs.tsx`**:
```tsx
// Before:
title="Numbers that make"
accent="founders relax."
// After:
title={<>Numbers <em className="display-em">that</em> make</>}
accent="founders relax."
```

- [ ] **Step 7: Update Hero headline classes in `components/Hero.tsx`**

Update the `<h1>` tag:
```tsx
// Before:
className="font-display text-[44px] font-bold leading-[1.02] tracking-tight text-balance md:text-[72px] lg:text-[88px]"
// After:
className="font-display text-display font-bold text-balance"
```

The headline text within uses `.word` spans — leave those intact (used by GSAP animation). The existing split-word animation in `useEffect` still works.

- [ ] **Step 8: Verify in browser**

```bash
npm run dev
```

Check that:
- Section labels render with tighter weight and wider tracking (`tracking-[0.22em]`)
- Selected words in section headlines (e.g. "for" in Services, "tuned" in Process) render italic and lighter than surrounding bold words
- Section headings scale fluidly on resize (drag browser window)
- Hero headline renders at the correct large size on desktop
- No text overflows or wrapping regressions

- [ ] **Step 9: Commit**

```bash
git add tailwind.config.ts app/globals.css components/Services.tsx components/Process.tsx components/WhyChooseUs.tsx components/Hero.tsx
git commit -m "feat: fluid type scale, italic/weight mixing, and SectionHeader typography improvements"
```

---

## Task 3: Text Scramble Hook

**Files:**
- Create: `lib/hooks/useTextScramble.ts`
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Create `lib/hooks/useTextScramble.ts`**

```ts
"use client";

import { useState, useEffect, useRef } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function useTextScramble(text: string, duration = 1200) {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const totalChars = text.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // How many characters have been "resolved" left-to-right
      const resolved = Math.floor(progress * totalChars);

      let result = "";
      for (let i = 0; i < totalChars; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration]);

  return displayText;
}
```

- [ ] **Step 2: Apply `useTextScramble` to the Hero subheadline paragraph**

**Intentional deviation from spec:** The spec targets the main `<h1>` headline. However, the headline uses GSAP word-split animation (`.word` spans animated with `yPercent: 110 → 0`, stagger 0.08s). Applying the scramble hook to those spans would conflict: the hook updates `displayText` as a flat string which cannot feed into pre-split DOM nodes. The subheadline `<p>` is the next best target — it is the first long text the user reads in the hero, has 146 characters (dramatic scramble), and has no GSAP animation on it.

In `components/Hero.tsx`, add the import:
```tsx
import { useTextScramble } from "@/lib/hooks/useTextScramble";
```

Inside the `Hero` function component (before the return), add:
```tsx
const heroText = "UXCODESTUDIO is a digital product studio crafting cinematic interfaces and high-performing systems for ambitious teams that refuse to ship anything average.";
const scrambledHero = useTextScramble(heroText, 1600);
```

Find the `<p className="hero-sub ...">` element and replace its text content:
```tsx
// Before:
<p className="hero-sub mt-8 max-w-xl text-balance text-base text-white/60 md:text-lg">
  UXCODESTUDIO is a digital product studio crafting cinematic
  interfaces and high-performing systems for ambitious teams that
  refuse to ship anything average.
</p>

// After:
<p className="hero-sub mt-8 max-w-xl text-balance text-base text-white/60 md:text-lg">
  {scrambledHero}
</p>
```

The scramble resolves in ~1.6s, slightly after the GSAP headline words appear (delay 0.2–0.9s), creating a layered reveal sequence.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Reload the page. The subheadline paragraph below the main headline ("UXCODESTUDIO is a digital product studio crafting...") should start as random scrambled characters and resolve letter-by-letter to the real text within ~1.6s. The main headline GSAP word animation (words flying in from below) is unaffected.

- [ ] **Step 4: Commit**

```bash
git add lib/hooks/useTextScramble.ts components/Hero.tsx
git commit -m "feat: add useTextScramble hook, apply to hero subheadline paragraph"
```

---

## Task 4: AnimatedCounter Component

**Files:**
- Create: `components/AnimatedCounter.tsx`
- Modify: `components/WhyChooseUs.tsx`

**Note:** `WhyChooseUs.tsx` already has a working counter in `StatCard` using `requestAnimationFrame` and `useInView`. This task extracts it into a reusable component and updates `StatCard` to use it.

- [ ] **Step 1: Create `components/AnimatedCounter.tsx`**

Uses GSAP `expo.out` (already a project dependency) and native `IntersectionObserver` at `threshold: 0.5` as specified.

```tsx
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
  duration = 1.5,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const obj = { val: 0 };
        gsap.to(obj, {
          val: value,
          duration,
          ease: "expo.out",
          onUpdate() {
            setN(Math.round(obj.val));
          },
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{n}{suffix}
    </span>
  );
}
```

- [ ] **Step 2: Update `WhyChooseUs.tsx` to use `<AnimatedCounter />`**

Add import at top of `components/WhyChooseUs.tsx`:
```tsx
import AnimatedCounter from "./AnimatedCounter";
```

In `StatCard`, remove the `useState`, `useEffect`, and `inView` counter logic. Replace the display div:
```tsx
// Before:
<div className="font-display text-4xl font-bold leading-none text-gradient md:text-5xl">
  {n}
  <span className="text-accent-cyan">{suffix}</span>
</div>
// After:
<div className="font-display text-4xl font-bold leading-none md:text-5xl">
  <AnimatedCounter
    value={value}
    suffix={suffix}
    className="text-gradient"
  />
</div>
```

Also remove the now-unused `useEffect`, `useState`, `inView`, and `ref` from `StatCard`. The `motion.div` wrapper already handles the `ref` for the entrance animation — keep that. Only remove the counter-specific state/effect.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Scroll to the "Why Choose Us" section. The four stat numbers (187, 42, 98, 14) should animate from 0 when they enter the viewport. Reload and re-scroll to confirm the animation fires correctly.

- [ ] **Step 4: Commit**

```bash
git add components/AnimatedCounter.tsx components/WhyChooseUs.tsx
git commit -m "feat: extract AnimatedCounter component, apply to WhyChooseUs stats"
```

---

## Task 5: Custom Cursor

**Files:**
- Create: `components/CustomCursor.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/MagneticButton.tsx`
- Modify: `components/Services.tsx` (TiltCard)
- Modify: `components/Pricing.tsx`

- [ ] **Step 1: Create `components/CustomCursor.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

const TRAIL_COUNT = 4;
const TRAIL_DELAY_MS = 18;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    // Desktop only
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.opacity = "1";
    trailRefs.current.forEach((t) => { if (t) t.style.opacity = "1"; });

    let rafId: number;
    const LERP = 0.14;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const { x, y } = pos.current;

      // Main cursor — snappy
      const cx = parseFloat(cursor.style.left || "0") || x;
      const cy = parseFloat(cursor.style.top || "0") || y;
      const nx = lerp(cx, x, LERP);
      const ny = lerp(cy, y, LERP);
      cursor.style.left = `${nx}px`;
      cursor.style.top = `${ny}px`;

      // Trail dots — each follows the previous with delay
      trailPositions.current.forEach((tp, i) => {
        const prev = i === 0 ? { x: nx, y: ny } : trailPositions.current[i - 1];
        tp.x = lerp(tp.x, prev.x, LERP * (1 - i * 0.15));
        tp.y = lerp(tp.y, prev.y, LERP * (1 - i * 0.15));
        const el = trailRefs.current[i];
        if (el) {
          el.style.left = `${tp.x}px`;
          el.style.top = `${tp.y}px`;
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnterHoverable = () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.marginLeft = "-20px";
      cursor.style.marginTop = "-20px";
      cursor.style.mixBlendMode = "difference";
      cursor.style.backgroundColor = "white";
      cursor.style.borderColor = "transparent";
    };

    const onMouseLeaveHoverable = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      cursor.style.marginLeft = "-6px";
      cursor.style.marginTop = "-6px";
      cursor.style.mixBlendMode = "normal";
      cursor.style.backgroundColor = "transparent";
      cursor.style.borderColor = "#4f6ef7";
    };

    const bindHoverables = () => {
      document.querySelectorAll("[data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterHoverable);
        el.addEventListener("mouseleave", onMouseLeaveHoverable);
      });
    };

    bindHoverables();
    // Re-bind on DOM changes (for dynamically added elements)
    const observer = new MutationObserver(bindHoverables);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "12px",
          height: "12px",
          marginLeft: "-6px",
          marginTop: "-6px",
          borderRadius: "50%",
          border: "1.5px solid #4f6ef7",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition: "width 0.2s, height 0.2s, margin 0.2s, background-color 0.2s, mix-blend-mode 0s",
          willChange: "left, top",
        }}
      />
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          aria-hidden
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: `${6 - i}px`,
            height: `${6 - i}px`,
            marginLeft: `-${(6 - i) / 2}px`,
            marginTop: `-${(6 - i) / 2}px`,
            borderRadius: "50%",
            backgroundColor: "#4f6ef7",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 9998,
            willChange: "left, top",
            transition: `opacity 0.3s ${i * TRAIL_DELAY_MS}ms`,
          }}
        />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Add `<CustomCursor />` to `app/layout.tsx`**

```tsx
// Add import:
import CustomCursor from "@/components/CustomCursor";

// Inside <body>, before <SmoothScroll>:
<CustomCursor />
<SmoothScroll>
  ...
</SmoothScroll>
```

- [ ] **Step 3: Add `data-cursor-hover` to interactive elements**

In `components/MagneticButton.tsx`, add `data-cursor-hover` to the `motion.div`:
```tsx
// Find:
<motion.div
  ref={ref}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  onClick={onClick}
  whileTap={{ scale: 0.96 }}
// Change to:
<motion.div
  ref={ref}
  data-cursor-hover
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  onClick={onClick}
  whileTap={{ scale: 0.96 }}
```

In `components/Services.tsx`, add `data-cursor-hover` to the `motion.div` in `TiltCard`:
```tsx
// Find the outermost motion.div in TiltCard:
<motion.div
  ref={ref}
  onMouseMove={onMove}
  onMouseLeave={() => { ... }}
// Add data-cursor-hover:
<motion.div
  ref={ref}
  data-cursor-hover
  onMouseMove={onMove}
  onMouseLeave={() => { ... }}
```

In `components/Pricing.tsx`, add `data-cursor-hover` to the `motion.div` that wraps each plan card (line ~74):
```tsx
// Before:
<motion.div
  key={p.name}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
// After:
<motion.div
  key={p.name}
  data-cursor-hover
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Move the mouse around the page. You should see:
- A small blue circle following the cursor with slight lag
- 4 smaller dots trailing behind it
- When hovering over buttons or service cards: cursor expands to 40px and inverts colors (mix-blend-mode: difference)
- On mobile simulation (Chrome DevTools mobile mode): cursor is not rendered

- [ ] **Step 5: Commit**

```bash
git add components/CustomCursor.tsx app/layout.tsx components/MagneticButton.tsx components/Services.tsx components/Pricing.tsx
git commit -m "feat: add custom cursor with trail and hover blend mode effect"
```

---

## Task 6: HeroScene Rewrite — Code Orbit

**Files:**
- Rewrite: `components/three/HeroScene.tsx`

**Note:** `@react-three/drei` is already installed and provides the `<Text>` component needed for rendering code tokens in 3D. GSAP is already a project dependency. The existing `Canvas` setup (dpr, camera, gl) is preserved — only the scene contents change.

- [ ] **Step 1: Rewrite `components/three/HeroScene.tsx`**

Replace the entire file content:

```tsx
"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Text, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Whole-scene parallax group (mouse tilt on entire scene) ───
function SceneGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.15, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.1, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

// ── Central core ──────────────────────────────────────────────
function CoreOrb() {
  return (
    <Float speed={1.0} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh>
        <sphereGeometry args={[0.7, 64, 64]} />
        <MeshDistortMaterial
          color="#4f6ef7"
          emissive="#2a45d4"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

// ── Single code token on an orbital ring ──────────────────────
function OrbitToken({
  token,
  radius,
  angle,
  color,
  ringSpeed,
  tiltX,
  tiltZ,
}: {
  token: string;
  radius: number;
  angle: number;
  color: string;
  ringSpeed: number;
  tiltX: number;
  tiltZ: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const startAngle = useRef(angle);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const currentAngle = startAngle.current + t * ringSpeed;
    groupRef.current.position.x = Math.cos(currentAngle) * radius;
    groupRef.current.position.z = Math.sin(currentAngle) * radius * Math.cos(tiltX);
    groupRef.current.position.y = Math.sin(currentAngle) * radius * Math.sin(tiltX);
    // Billboard — always face camera (handled by Text itself)
  });

  return (
    <group ref={groupRef} rotation={[0, 0, tiltZ]}>
      <Text
        fontSize={0.22}
        color={color}
        font={undefined}
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
      >
        {token}
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </Text>
      <pointLight color={color} intensity={0.4} distance={1.2} />
    </group>
  );
}

// ── Three orbital rings ────────────────────────────────────────
const RINGS = [
  {
    radius: 1.6,
    speed: 0.7,
    tiltX: 0.26,  // ~15°
    tiltZ: 0,
    color: "#4f6ef7",
    tokens: ["{ }", "( )", "[ ]"],
  },
  {
    radius: 2.3,
    speed: 0.45,
    tiltX: 0.87,  // ~50°
    tiltZ: 0.3,
    color: "#00d4ff",
    tokens: ["</>", "=>", "&&"],
  },
  {
    radius: 3.0,
    speed: 0.28,
    tiltX: -0.52, // ~-30°
    tiltZ: -0.2,
    color: "#8b5cf6",
    tokens: ["const", "async", "type"],
  },
];

function OrbitalSystem() {
  return (
    <>
      {RINGS.map((ring) =>
        ring.tokens.map((token, i) => (
          <OrbitToken
            key={`${ring.color}-${token}`}
            token={token}
            radius={ring.radius}
            angle={(i / ring.tokens.length) * Math.PI * 2}
            color={ring.color}
            ringSpeed={ring.speed}
            tiltX={ring.tiltX}
            tiltZ={ring.tiltZ}
          />
        ))
      )}
    </>
  );
}

// ── Sparse particle field ──────────────────────────────────────
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 60;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial size={0.022} color="#00d4ff" transparent opacity={0.6} sizeAttenuation />
    </Points>
  );
}

// ── Canvas export ──────────────────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={1.0} color="#4f6ef7" />
        <pointLight position={[-4, -2, -4]} intensity={0.8} color="#8b5cf6" />
        <SceneGroup>
          <CoreOrb />
          <OrbitalSystem />
          <ParticleField />
        </SceneGroup>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Check the Hero section. The 3D scene should show:
- A central blue distorted sphere floating gently
- Three sets of code tokens (`{ }`, `( )`, `[ ]` / `</>`, `=>`, `&&` / `const`, `async`, `type`) orbiting at different speeds and angles
- Each token glows with its ring color (blue / cyan / violet)
- Sparse particles rotating slowly in the background
- The scene responds to mouse movement (subtle parallax from lerp on core)

If tokens appear very small or overlapping, adjust `fontSize` in `OrbitToken` (try `0.28`) or `radius` values in `RINGS`.

- [ ] **Step 3: Commit**

```bash
git add components/three/HeroScene.tsx
git commit -m "feat: replace hero 3D scene with code-orbit visualization (Three.js)"
```

---

## Final Verification

- [ ] **Full scroll-through test**

```bash
npm run dev
```

Open http://localhost:3000. Verify the complete page:

1. **Navbar** — unchanged, renders correctly
2. **Hero** — badge scrambles on load, headline animates with GSAP, 3D code orbit visible, custom cursor active
3. **Services** — slightly lighter background (`#080810`), gradient separator at bottom, cursor expands on card hover
4. **Process** — darker tinted background (`#0c0c18`), violet glow texture visible
5. **WhyChooseUs** — lighter background, stat counters animate from 0 on scroll
6. **FeaturedWork** — base background (`#050508`), unchanged
7. **Testimonials** — darker background with violet depth
8. **Pricing** — lighter background, cursor expands on plan card hover
9. **FAQ** — base background, unchanged
10. **FinalCTA** — darkest background with violet glow
11. **Footer** — unchanged

Check on mobile viewport (375px): custom cursor absent, all sections render correctly, fluid type scales down.

- [ ] **Build check**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. Warnings about Three.js/R3F dynamic imports are expected and benign.
