# Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a noise texture tweak, and a cinematic page loader with sessionStorage skip and Hero GSAP coordination.

**Architecture:** Three independent tasks in order. (1) CSS-only noise bump in globals.css — two property changes, no new files. (2) New `PageLoader` component using `useAnimationControls` async sequence; mounted in layout.tsx before CustomCursor. (3) Hero GSAP `useEffect` refactored into an `initGsap` helper, gated behind a `loader:done` window event on first visit and an immediate sessionStorage check on repeat visits.

**Note — scroll reveals:** After reading all five target sections (Services, FeaturedWork, Pricing, FAQ, FinalCTA), every section already has `whileInView` scroll reveals implemented via `SectionHeader`, `TiltCard`, `motion.article`, or `motion.div`. The `RevealOnScroll` component from the spec is not needed.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.7, Framer Motion 12, GSAP 3, TailwindCSS 3

**Prerequisite — logo file:** Before starting Task 2, copy the studio logo PNG to `public/logo.png`. If this file is absent, `next/image` will throw a build error. The file must be present before running `npm run dev` or `npm run build`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Bump noise opacity + blend-mode |
| `components/PageLoader.tsx` | Create | Cinematic intro overlay with async Framer Motion sequence |
| `app/layout.tsx` | Modify | Mount PageLoader as first child of body |
| `components/Hero.tsx` | Modify | Gate GSAP init behind loader:done event / sessionStorage check |

---

## Task 1: Noise Texture Tweak

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Edit `.noise::after` in globals.css**

Find the `.noise::after` rule (around line 115). Change two properties:

```css
/* Before */
.noise::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,...");
}

/* After — only these two lines change */
  opacity: 0.06;
  mix-blend-mode: screen;
```

`screen` blend mode is visible on dark backgrounds (`#050508`) whereas `overlay` has near-zero effect when both source and destination are dark. Opacity 0.06 is still subtle — if it feels too strong, back off to 0.055.

- [ ] **Step 2: Visual verify**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npm run dev
```

Open http://localhost:3000. The background should have a faint film-grain texture visible when looking closely at the dark areas between sections. It should not be distracting or visible from arm's length.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: bump noise opacity and blend-mode for dark-background visibility"
```

---

## Task 2: PageLoader Component

**Files:**
- Create: `components/PageLoader.tsx`
- Modify: `app/layout.tsx`

**Prerequisite:** `public/logo.png` must exist. Verify before starting:
```bash
ls C:/Users/Omar/IdeaProjects/uxcodestudio/public/logo.png
```
If missing, place the logo file there now.

- [ ] **Step 1: Create `components/PageLoader.tsx`**

Write this exact file:

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
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyShown = sessionStorage.getItem("loader-shown") === "1";

    if (alreadyShown || prefersReduced) {
      window.dispatchEvent(new Event("loader:done"));
      setVisible(false);
      return;
    }

    async function sequence() {
      await logoControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      });
      await new Promise<void>((r) => setTimeout(r, 300));
      sessionStorage.setItem("loader-shown", "1");
      await overlayControls.start({
        y: "-100%",
        transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] },
      });
      window.dispatchEvent(new Event("loader:done"));
      setVisible(false);
    }

    sequence();
  }, [logoControls, overlayControls]);

  if (!visible) return null;

  return (
    <motion.div
      animate={overlayControls}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
    >
      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.85 }}
      >
        <Image
          src="/logo.png"
          width={160}
          height={80}
          alt="UXCODESTUDIO"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add PageLoader to `app/layout.tsx`**

Current `layout.tsx` body:
```tsx
<body className="bg-background text-white antialiased noise">
  <CustomCursor />
  <SmoothScroll>
    <Navbar />
    {children}
  </SmoothScroll>
</body>
```

Add import and PageLoader as first child:
```tsx
import PageLoader from "@/components/PageLoader";

// ...

<body className="bg-background text-white antialiased noise">
  <PageLoader />
  <CustomCursor />
  <SmoothScroll>
    <Navbar />
    {children}
  </SmoothScroll>
</body>
```

`PageLoader` renders before `CustomCursor` at `z-[9999]`, above `CustomCursor`'s `z-50`. This is intentional — the cursor is irrelevant while the loader is active.

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors. Common issue — if `logo.png` has wrong dimensions, TypeScript won't catch it (it's a runtime `next/image` error), but the TS check will still pass.

- [ ] **Step 4: Visual verify (first visit)**

```bash
npm run dev
```

Open http://localhost:3000 in an incognito window (clean sessionStorage). You should see:
1. Dark overlay covers the page
2. Logo fades in and scales from 0.85 → 1.0 over 500ms
3. Hold for 300ms
4. Entire overlay slides up off screen over 600ms
5. Hero content is revealed underneath
6. Total time: ~1.4s

Then reload the same tab — the loader should not appear (sessionStorage skip). Reload in a new incognito window — loader plays again.

- [ ] **Step 5: Commit**

```bash
git add components/PageLoader.tsx app/layout.tsx
git commit -m "feat: add cinematic PageLoader with sessionStorage skip"
```

---

## Task 3: Hero GSAP Coordination

**Files:**
- Modify: `components/Hero.tsx`

**Context:** Hero.tsx currently has one `useEffect` that runs all GSAP animations with a `delay: 0.2s` start. Without the loader gate, these animations start at mount (t=0) while the loader overlay is covering everything — the animations play unseen. This task refactors the effect so GSAP fires only after the loader exits.

- [ ] **Step 1: Read the current Hero.tsx GSAP useEffect**

The existing effect (lines 22–78 approximately) looks like:

```ts
useEffect(() => {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    // ... all GSAP animations ...
  }, rootRef);

  return () => ctx.revert();
}, []);
```

- [ ] **Step 2: Refactor `Hero.tsx` GSAP useEffect**

Replace the existing `useEffect` with this pattern. Everything inside `gsap.context()` stays **exactly the same** — only the outer structure changes:

```ts
useEffect(() => {
  // SSR-safe — this runs only on client
  const alreadyShown = sessionStorage.getItem("loader-shown") === "1";

  function initGsap() {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // --- PASTE THE EXISTING GSAP CODE HERE, UNCHANGED ---
      const split = (headlineRef.current?.querySelectorAll(".word") ??
        []) as NodeListOf<HTMLElement>;
      gsap.from(split, {
        yPercent: 110,
        opacity: 0,
        rotate: 3,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.2,
      });

      gsap.from(".hero-sub", {
        y: 24,
        opacity: 0,
        duration: 1,
        delay: 0.7,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        y: 18,
        opacity: 0,
        duration: 0.9,
        delay: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });

      gsap.from(".hero-scene", {
        opacity: 0,
        scale: 0.92,
        duration: 1.4,
        delay: 0.4,
        ease: "expo.out",
      });

      gsap.to(rootRef.current, {
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0.4,
        scale: 0.96,
        ease: "none",
      });
      // --- END OF GSAP CODE ---
    }, rootRef);

    return () => ctx.revert();
  }

  if (alreadyShown) {
    // Repeat visit — no loader shown, start GSAP immediately
    return initGsap();
  }

  // First visit — wait for loader:done event
  let cleanup: (() => void) | undefined;
  const handler = () => {
    cleanup = initGsap();
  };
  window.addEventListener("loader:done", handler, { once: true });

  return () => {
    window.removeEventListener("loader:done", handler);
    cleanup?.();
  };
}, []); // empty deps — runs once on mount, initGsap is not in dep array (see spec note)
```

**Important:** `initGsap` is declared inside the `useEffect` callback. Do NOT add it to the deps array — it is re-created each render and would cause an infinite loop. The `{ once: true }` option on `addEventListener` auto-removes the handler after it fires.

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors. If TypeScript flags `cleanup` as possibly undefined, the `cleanup?.()` optional call handles it.

- [ ] **Step 4: Visual verify — end-to-end**

Open http://localhost:3000 in incognito:

1. Loader plays (~1.4s)
2. As loader slides up, Hero headline words animate in (yPercent: 110 → 0)
3. Body text scrambles in, CTAs fade up
4. 3D scene fades in
5. Scroll down — hero fades to 0.4 opacity as expected (ScrollTrigger scrub)

Reload same tab (loader skipped):
1. No loader
2. Hero GSAP animations fire immediately on mount (delay 0.2s first word)
3. Everything works identically to before this change

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: gate Hero GSAP init behind loader:done event for cinematic reveal"
```

---

## Final Check

- [ ] **Production build**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. Common failure: missing `public/logo.png` causes a next/image error at build time.

- [ ] **Push to GitHub**

```bash
git push origin master
```
