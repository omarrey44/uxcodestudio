# UXCodeStudio Visual Refresh — Design Spec
**Date:** 2026-05-20  
**Scope:** Background system, typography system, animation effects, 3D hero scene

---

## 1. Background System

**Problem:** All sections share the same `#050508` background, eliminating visual rhythm when scrolling.

**Solution:** Three-token alternating system within the dark universe:

| Token | Value | Applied to |
|---|---|---|
| `--bg-base` | `#050508` | Hero, FeaturedWork, FAQ |
| `--bg-section` | `#080810` | Services, WhyChooseUs, Pricing |
| `--bg-section-deep` | `#0c0c18` | Process, Testimonials, FinalCTA |

**Section separators:** 1px gradient line between sections — `transparent → rgba(79,110,247,0.2) → transparent` — replaces hard cuts.

**Section texture:** `--bg-section-deep` sections receive a subtle radial glow: `radial-gradient(ellipse at 50% -20%, rgba(139,92,246,0.06), transparent 60%)` applied as a `::before` pseudo-element.

**Implementation:**
- Add the 3 CSS custom properties to `:root` in `globals.css`
- Add `.section-alt` and `.section-deep` utility classes in `@layer components`
- Apply the appropriate class to each section component's wrapper `<section>` element
- Add `.section-separator` class using a `::before` pseudo with the gradient line

---

## 2. Typography System

**Problem:** Uniform Syne 700/800 across all headings with no weight variation, tight tracking on labels, and loose line-height on large display text.

**Solution:** Improve the existing Syne + Inter combination without changing fonts.

### 2a. Fluid Type Scale (clamp)
Add to `tailwind.config.ts` under `fontSize`:

```
display:  clamp(3rem, 6vw, 5.5rem)    // 48px → 88px
h2:       clamp(2rem, 4vw, 3.5rem)    // 32px → 56px
h3:       clamp(1.25rem, 2vw, 1.75rem)
```

### 2b. Weight + Italic Mixing
On section headlines, the key noun gets Syne 800 while the rest uses Syne 500 italic:
- Example: `What We` (500 italic) + `Build` (800 upright) + `For You` (500 italic)
- Applied via `<em>` with a `.display-em` class: `font-style: italic; font-weight: 500; color: var(--color-muted)`

### 2c. Label Tracking
Section labels (`SERVICES`, `PROCESS`, `WHY US`) update from `tracking-wide` to `tracking-[0.2em]` at `11px` / `font-weight: 500`. This matches the pattern used by Linear, Vercel, and Loom.

### 2d. Tighter Display Line-Height
Large headings (display size) move from `leading-tight` (1.25) to `leading-[0.95]` on `md:` and above. Creates a solid typographic block feel.

**Files to update:** `tailwind.config.ts` (fontSize scale), `globals.css` (`.display-em` class), and each section component's heading markup.

---

## 3. Animation Effects

Three new self-contained components/hooks. Each is independently importable with no side effects on existing animations.

### 3a. Text Scramble — `useTextScramble` hook
- **Location:** `lib/hooks/useTextScramble.ts`
- **Behavior:** Accepts `text: string` and `duration: number` (default 1200ms). Returns a `displayText: string` that starts as randomized ASCII characters (`#@&%!`) and resolves letter-by-letter to the real text using `requestAnimationFrame`.
- **Applied to:** The main headline in `Hero.tsx` only. Triggered once on mount.
- **No GSAP dependency** — pure `requestAnimationFrame` loop.

### 3b. Animated Counter — `<AnimatedCounter />` component
- **Location:** `components/AnimatedCounter.tsx`
- **Props:** `value: number`, `suffix?: string`, `prefix?: string`, `duration?: number` (default 1500ms)
- **Behavior:** Starts at 0, animates to `value` using GSAP `expo.out` easing when the element enters the viewport (IntersectionObserver, `threshold: 0.5`). Fires once (`once: true`).
- **Applied to:** Numeric stats in `WhyChooseUs.tsx`.

### 3c. Custom Cursor — `<CustomCursor />` component
- **Location:** `components/CustomCursor.tsx`
- **Behavior:**
  - 12px circle, `border: 1.5px solid #4f6ef7`, `border-radius: 50%`, follows mouse with lerp `0.12`
  - Trail: 4 smaller dots following with incremental delay (20ms, 40ms, 60ms, 80ms)
  - Hover state: scales to 40px + `mix-blend-mode: difference` when over `[data-cursor-hover]` elements (buttons, cards)
  - Desktop only: renders `null` when `matchMedia('(pointer: coarse)').matches`
- **Applied to:** `app/layout.tsx` (global), `data-cursor-hover` added to `MagneticButton`, service cards, pricing cards.

---

## 4. 3D Hero Scene — Code Orbit

**Replaces:** Current floating orb with glow rings and particle field in `components/three/HeroScene.tsx`

**Concept:** Software development represented as code tokens orbiting a central glowing core — three orbital rings at different inclinations and speeds, each carrying syntax characters.

### Scene Structure (React Three Fiber)

**Central core:**
- `<Sphere>` with `<MeshDistortMaterial>` (distort=0.3, speed=1.5)
- Material: `#4f6ef7` base, emissive `#2a45d4`, emissiveIntensity 0.4
- Animated `PointLight` pulsing glow around it

**Three orbital rings:**

| Ring | Tokens | Speed | Inclination | Color |
|---|---|---|---|---|
| Inner | `{ }` `( )` `[ ]` | 0.8 rad/s | 15° tilt | `#4f6ef7` (blue) |
| Middle | `</>` `=>` `&&` | 0.5 rad/s | 50° tilt | `#00d4ff` (cyan) |
| Outer | `const` `async` `type` | 0.3 rad/s | -30° tilt | `#8b5cf6` (violet) |

Each ring is a `<group>` rotating on Y-axis. Tokens are `<Text>` components from `@react-three/drei` placed at equal angular intervals on the ring radius. They face the camera with `billboard` behavior.

**Token glow:** Each `<Text>` has a matching `<PointLight>` at intensity 0.3, distance 1.5, matching ring color.

**Particle field:** 60 random points in a sphere of radius 4, rendered as small `<Points>` with `<PointMaterial>` — same as current but sparser.

**Mouse interaction:** Existing `useFrame` parallax tilt on the whole scene group — preserved from current implementation.

---

## Files Affected

| File | Change |
|---|---|
| `app/globals.css` | Add background tokens, `.section-alt`, `.section-deep`, `.section-separator`, `.display-em` |
| `tailwind.config.ts` | Add fluid `fontSize` scale entries |
| `app/layout.tsx` | Import and render `<CustomCursor />` |
| `components/three/HeroScene.tsx` | Full rewrite — code orbit scene |
| `components/Hero.tsx` | Apply `useTextScramble` to headline, update label tracking + line-height |
| `components/Services.tsx` | Apply `.section-alt`, update label + heading markup |
| `components/Process.tsx` | Apply `.section-deep`, update label + heading markup |
| `components/WhyChooseUs.tsx` | Apply `.section-alt`, add `<AnimatedCounter />` to stats |
| `components/FeaturedWork.tsx` | Update label + heading markup |
| `components/Testimonials.tsx` | Apply `.section-deep`, update heading markup |
| `components/Pricing.tsx` | Apply `.section-alt`, add `data-cursor-hover` to cards |
| `components/FAQ.tsx` | Update label + heading markup |
| `components/FinalCTA.tsx` | Apply `.section-deep`, update heading markup |
| `components/MagneticButton.tsx` | Add `data-cursor-hover` attribute |
| `lib/hooks/useTextScramble.ts` | New file |
| `components/AnimatedCounter.tsx` | New file |
| `components/CustomCursor.tsx` | New file |

---

## Out of Scope
- No font changes (Syne + Inter stays)
- No new third-party animation libraries
- No changes to routing, API, or data layer
- No changes to Navbar or Footer typography (already correct scale)
- No mobile-specific layout changes beyond what fluid type handles automatically
