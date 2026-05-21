# Visual Polish — Design Spec
**Date:** 2026-05-21
**Scope:** Three targeted improvements: noise texture tweak, unified scroll reveal system, and a cinematic page loader with logo.

---

## Context

UXCodeStudio (Next.js 16, React 19, TailwindCSS, GSAP 3, Framer Motion 12) already has a noise texture class and scroll reveals in some sections. This spec adds the missing pieces: bump noise visibility, unify reveal patterns across sections that lack them, and introduce a cinematic `PageLoader` component that plays once per session.

---

## 1. Noise Texture Tweak — `globals.css`

**Problem:** `.noise::after` is set to `opacity: 0.04` with `mix-blend-mode: overlay`. On the near-black background (`#050508`), `overlay` blending has negligible effect because both source and destination are dark.

**Solution:** Two CSS-only changes in `globals.css`:
- `opacity: 0.04 → 0.06`
- `mix-blend-mode: overlay → screen`

`screen` blend mode lightens the image on dark surfaces, making the grain perceptible without being distracting.

**Files affected:** `app/globals.css` only.

---

## 2. Scroll Reveal System — `RevealOnScroll` component

**Problem:** Process and WhyChooseUs have scroll-triggered entrance animations. Services, FeaturedWork, Pricing, FAQ, and FinalCTA are inconsistent — missing reveals or using static rendering.

**Solution:** A single reusable `RevealOnScroll` wrapper component. Sections that already have working reveals are left untouched.

### Component API

```tsx
// components/RevealOnScroll.tsx
interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;     // seconds, default 0
  y?: number;         // translateY start distance px, default 40
  className?: string; // forwarded to the motion.div — use for grid/flex item classes
}
```

**Rendering:** Always renders as `motion.div`. No `as` prop. Callers place grid/flex layout classes (e.g. `col-span-1`) on `RevealOnScroll` via `className`; they are forwarded to the wrapper element so grid/flex placement is preserved without extra DOM nesting.

### Animation spec

```tsx
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.15 }}
  transition={{ duration: prefersReducedMotion ? 0.01 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  className={className}
>
  {children}
</motion.div>
```

- `once: true` — fires once, never replays on scroll back
- `amount: 0.15` — triggers when 15% of element is visible
- **Stagger:** section headers at `delay=0`, each list item at `delay={Math.min(index * 0.1, 0.4)}` — cap at 0.4s to avoid last items feeling broken on long lists
- `prefersReducedMotion` check disables y movement and cuts duration to near-zero (opacity still fades, no positional shift)

### Sections to update

| Section | What to wrap |
|---|---|
| `Services` | `SectionHeader` + each service card in the grid (pass grid-cell `className` to `RevealOnScroll`) |
| `FeaturedWork` | `SectionHeader` + each work item |
| `Pricing` | `SectionHeader` + each pricing card |
| `FAQ` | `SectionHeader` + each FAQ item |
| `FinalCTA` | The entire CTA content block |

**Do not touch:** `Process` (GSAP ScrollTrigger working), `WhyChooseUs` (Framer Motion whileInView working), `Testimonials` (Framer Motion working).

---

## 3. PageLoader — Cinematic Intro

**Problem:** Hero GSAP animations start immediately on mount (delay 0.2s), with no visual gate. First-time visitors see an unstyled flash before fonts and Three.js load.

**Solution:** A `PageLoader` component rendered in `layout.tsx` that shows a full-screen branded overlay, plays a logo entrance + slide-up exit animation via an async `useAnimationControls` sequence, then signals completion to Hero via a custom DOM event.

### Logo file

`public/logo.png` must be placed in the `public/` directory before running the dev server or build. If the file is absent, `next/image` will throw a build error. The component renders it with:
```tsx
<Image src="/logo.png" width={160} height={80} alt="UXCODESTUDIO" priority />
```

### Session skip logic

`PageLoader` is `"use client"`. Inside `useEffect` (SSR-safe):
- `sessionStorage.getItem('loader-shown') === '1'` → skip: dispatch `loader:done` synchronously, call `setVisible(false)`, return without playing animation
- Otherwise → play animation sequence, dispatch `loader:done` at completion, call `setVisible(false)`

`sessionStorage.setItem('loader-shown', '1')` is called at the **start** of the exit phase (`t=800ms`), not at completion, so navigating away mid-animation still marks the session as shown.

### Animation sequence (first visit only, total ~1.4s)

Uses `useAnimationControls` from Framer Motion for an imperative async sequence — no `onAnimationComplete` fragility.

| Phase | Timing | What |
|---|---|---|
| Initial state | `t=0` | Overlay: `y: 0` (visible). Logo: `opacity: 0, scale: 0.85` |
| Logo in | `t=0 → 500ms` | `logoControls.start({ opacity: 1, scale: 1 })`, ease `[0.16, 1, 0.3, 1]` (expo.out equivalent) |
| Hold | `t=500 → 800ms` | `await new Promise(r => setTimeout(r, 300))` |
| Mark session | `t=800ms` | `sessionStorage.setItem('loader-shown', '1')` |
| Exit | `t=800 → 1400ms` | `overlayControls.start({ y: '-100%' })`, duration 600ms, ease `[0.7, 0, 0.84, 0]` (expo.in equivalent) |
| Done | `t=1400ms` | `window.dispatchEvent(new Event('loader:done'))`, `setVisible(false)` |

**`prefers-reduced-motion`:** If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, skip animation entirely — call `onDone()` immediately without playing any motion.

### Concrete component structure

```tsx
"use client";
import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const overlayControls = useAnimationControls();
  const logoControls = useAnimationControls();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyShown = sessionStorage.getItem('loader-shown') === '1';

    if (alreadyShown || prefersReduced) {
      window.dispatchEvent(new Event('loader:done'));
      setVisible(false);
      return;
    }

    async function sequence() {
      await logoControls.start({
        opacity: 1, scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      });
      await new Promise(r => setTimeout(r, 300));
      sessionStorage.setItem('loader-shown', '1');
      await overlayControls.start({
        y: '-100%',
        transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] },
      });
      window.dispatchEvent(new Event('loader:done'));
      setVisible(false);
    }
    sequence();
  }, [logoControls, overlayControls]);

  if (!visible) return null;

  return (
    <motion.div
      animate={overlayControls}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      {/* bg-background resolves to #050508 — confirmed in tailwind.config.ts */}
    >
      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.85 }}
      >
        <Image src="/logo.png" width={160} height={80} alt="UXCODESTUDIO" priority />
      </motion.div>
    </motion.div>
  );
}
```

### Hero coordination — SSR-safe, race-condition-free

Hero's existing GSAP `useEffect` is refactored to call a shared `initGsap()` function. A new `useEffect` determines when to call it:

```ts
// Hero.tsx — replace the existing single GSAP useEffect with this pattern:

function Hero() {
  // ... existing refs and hooks ...

  // Extracted: all GSAP setup in a named function (no change to internals)
  function initGsap() {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // ... existing GSAP code unchanged ...
    }, rootRef);
    return () => ctx.revert();
  }

  useEffect(() => {
    // SSR-safe: runs only on client
    const alreadyShown = sessionStorage.getItem('loader-shown') === '1';

    if (alreadyShown) {
      // Repeat visit: no loader shown, start GSAP immediately
      return initGsap();
    }

    // First visit: wait for loader:done event
    let cleanup: (() => void) | undefined;
    const handler = () => { cleanup = initGsap(); };
    window.addEventListener('loader:done', handler, { once: true });
    return () => {
      window.removeEventListener('loader:done', handler);
      cleanup?.();
    };
  }, []); // empty deps — runs once on mount, never re-fires

  // ... rest of Hero JSX unchanged ...
}
```

**No `useState` for `loaderDone`** — avoids SSR hydration mismatch entirely. GSAP is triggered imperatively inside `useEffect`, so no render cycle is needed.

**`initGsap` dependency note:** `initGsap` is declared inside the component body and captured by the empty-deps `useEffect`. It must **not** be added to the `useEffect` dep array (it is re-created every render). If a future edit requires it in the dep array, wrap it in `useCallback` or move it outside the component first.

**`gsap.registerPlugin(ScrollTrigger)` timing note:** `registerPlugin` is idempotent — calling it multiple times is safe. `Process.tsx` registers ScrollTrigger in its own `useEffect` and is unaffected by when Hero's `useEffect` fires. No ordering dependency.

**Race condition resolved:** On repeat visits, `alreadyShown` is checked synchronously inside `useEffect` — no event needed. On first visits, `PageLoader` dispatches `loader:done` at `t=1400ms`, which is well after Hero's `useEffect` has had time to attach the listener (Hero mounts at `t=0` while loader plays).

**`{ once: true }` on addEventListener** ensures the handler auto-removes after firing — no manual cleanup needed for the happy path (cleanup still handles the unmount-before-fire case).

### `CustomCursor` layering

`CustomCursor` renders with `z-50` class (z-index 50). `PageLoader` uses `z-[9999]`. Loader renders on top of cursor — acceptable since the cursor is irrelevant while the loader is active. No change needed to `CustomCursor`.

### Files affected

| File | Change |
|---|---|
| `public/logo.png` | Developer places logo file before build |
| `components/PageLoader.tsx` | New component |
| `app/layout.tsx` | Add `<PageLoader />` as first child of `<body>`, before `<CustomCursor />` |
| `components/Hero.tsx` | Refactor GSAP useEffect into `initGsap()`, add loader coordination |

---

## Out of Scope

- No changes to `CustomCursor`, `Navbar`, `SmoothScroll`, or any three.js code
- No changes to Hero entrance animation values — only the timing gate
- No new third-party libraries
- No dark/light toggle
- No mobile-specific loader changes (loader plays on all viewports)
- Footer: no scroll reveal (always visible at page bottom, not a reveal candidate)
