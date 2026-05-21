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
  delay?: number;       // seconds, default 0
  y?: number;           // translateY distance, default 40
  className?: string;
}
```

### Animation spec

```tsx
<motion.div
  initial={{ opacity: 0, y }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.15 }}
  transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  className={className}
>
  {children}
</motion.div>
```

- `once: true` — animation fires once, never replays on scroll back
- `amount: 0.15` — triggers when 15% of the element is visible
- Stagger pattern: section headers at `delay=0`, each card in a list at `delay={index * 0.1}`

### Sections to update

| Section | What to wrap |
|---|---|
| `Services` | `SectionHeader` + each service card in the grid |
| `FeaturedWork` | `SectionHeader` + each work item |
| `Pricing` | `SectionHeader` + each pricing card |
| `FAQ` | `SectionHeader` + each FAQ item |
| `FinalCTA` | The entire CTA content block |

**Do not touch:** `Process` (GSAP ScrollTrigger already working), `WhyChooseUs` (Framer Motion whileInView already working), `Testimonials` (Framer Motion already working).

---

## 3. PageLoader — Cinematic Intro

**Problem:** Hero GSAP animations start immediately on mount (delay 0.2s), with no visual gate. First-time visitors see an unstyled flash before fonts and Three.js load.

**Solution:** A `PageLoader` component rendered in `layout.tsx` that shows a full-screen branded overlay, plays a logo entrance + slide-up exit animation, then signals completion to the Hero via a custom DOM event.

### Logo file

The logo PNG (`public/logo.png`) must be placed in the `public/` directory by the developer before implementation. The component renders it with `<Image src="/logo.png" width={160} height={80} alt="UXCODESTUDIO" priority />`.

### Session skip logic

On mount, `PageLoader` checks `sessionStorage.getItem('loader-shown')`:
- `null` (first visit this session): play full animation sequence, then `sessionStorage.setItem('loader-shown', '1')`
- `'1'` (already shown): set `visible = false` immediately, fire `loader:done` event synchronously, unmount

### Animation sequence (first visit only, total ~1.4s)

| Phase | Timing | What happens |
|---|---|---|
| Enter | `t=0` | Overlay already visible (`opacity: 1`, `y: 0`). Logo at `scale: 0.85, opacity: 0` |
| Logo in | `t=0 → 500ms` | Logo animates to `scale: 1.0, opacity: 1`. Ease: `expo.out` |
| Hold | `t=500 → 800ms` | Static |
| Exit | `t=800 → 1400ms` | Entire overlay + logo slides up `y: -100%`. Ease: `expo.in` |
| Done | `t=1400ms` | `window.dispatchEvent(new Event('loader:done'))`, component unmounts |

### Component structure

```tsx
// components/PageLoader.tsx
"use client";
export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('loader-shown')) {
      setVisible(false);
      window.dispatchEvent(new Event('loader:done'));
      return;
    }
    // animation handled by Framer Motion — onAnimationComplete fires loader:done
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      animate={/* exit: y: '-100%' triggered after hold */}
      onAnimationComplete={() => {
        sessionStorage.setItem('loader-shown', '1');
        window.dispatchEvent(new Event('loader:done'));
        setVisible(false);
      }}
    >
      {/* Logo with scale-in entrance */}
    </motion.div>
  );
}
```

### Hero coordination

`Hero.tsx` adds a `useEffect` that listens for `loader:done`. Before that event fires, Hero defers its GSAP context initialization. On repeat visits (no loader), the event fires synchronously on mount so GSAP starts immediately.

```ts
// Hero.tsx — inside the component, before existing useEffect
const [loaderDone, setLoaderDone] = useState(
  typeof window !== 'undefined' && !!sessionStorage.getItem('loader-shown')
);

useEffect(() => {
  if (loaderDone) return; // already done
  const handler = () => setLoaderDone(true);
  window.addEventListener('loader:done', handler);
  return () => window.removeEventListener('loader:done', handler);
}, [loaderDone]);
```

The existing GSAP `useEffect` in Hero is gated on `loaderDone`:
```ts
useEffect(() => {
  if (!loaderDone) return;
  // ... existing GSAP code unchanged ...
}, [loaderDone]);
```

### Files affected

| File | Change |
|---|---|
| `public/logo.png` | Developer places logo file here |
| `components/PageLoader.tsx` | New component |
| `app/layout.tsx` | Add `<PageLoader />` before `<SmoothScroll>` |
| `components/Hero.tsx` | Add `loaderDone` state + gate existing GSAP useEffect on it |

---

## Out of Scope

- No changes to `CustomCursor`, `Navbar`, `SmoothScroll`, or any three.js code
- No changes to `Hero.tsx` entrance animations themselves — only the timing gate
- No new third-party libraries
- No dark/light toggle
- No mobile-specific loader changes (loader plays on all viewports)
- Footer: no scroll reveal added (footer is always visible at page bottom, not a reveal candidate)
