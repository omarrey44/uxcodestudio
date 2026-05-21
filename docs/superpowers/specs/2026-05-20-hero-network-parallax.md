# Hero Network Mesh & Parallax Cards — Design Spec
**Date:** 2026-05-20
**Scope:** Two targeted changes to the Hero section: animated polygon mesh network in the 3D scene, and mouse-parallax floating cards in the HTML layer.

---

## Context

The Hero already has a working split layout (7:5 columns), a `FloatingDashboard` with three cards (Conversion chart, App.tsx code editor, Lighthouse badge), a code-orbit 3D scene, and GSAP/Framer Motion entrance animations. This spec adds two enhancements on top without touching the existing structure.

---

## 1. Polygon Network Mesh — `NetworkMesh` in `HeroScene.tsx`

**Problem:** The current background is a sparse `ParticleField` (60 points rotating slowly). The reference design has a dense animated polygon mesh network — nodes connected by glowing lines that shift as nodes drift — giving the scene atmospheric depth and a "living tech" quality.

**Solution:** Add a `NetworkMesh` component inside `HeroScene.tsx`, rendered inside `<SceneGroup>` alongside `CoreOrb`, `OrbitalSystem`, and `ParticleField`. Because `NetworkMesh` lives inside `SceneGroup`, it inherits the mouse-driven tilt applied to the whole group — this is intentional and desirable.

### Node data (useMemo, runs once)

- 80 nodes placed randomly in a sphere of radius 5–8
- Each node stores a base position `[x, y, z]` and a slow drift velocity `[vx, vy, vz]` in range `±0.002`
- Stored as a plain JS array of objects: `{ pos: [x,y,z], vel: [vx,vy,vz] }`
- Node positions for rendering stored in a `Float32Array(80 * 3)` (`pointsPositions`)

### Line buffer pre-allocation (drawRange pattern)

Pre-allocate a `Float32Array(MAX_LINES * 2 * 3)` where `MAX_LINES = 200`. This buffer is created once in `useMemo` and never resized. Each frame, the buffer is filled from index 0 with valid line segments; unused slots at the end remain from the previous frame but are hidden using `geometry.setDrawRange(0, actualSegmentCount * 2)`. Mark `geometry.attributes.position.needsUpdate = true` each frame.

### Per-frame update (useFrame)

1. Advance each node: `pos[i] += vel[i]`. If `|pos[i]| > 8`, reflect: `vel[i] *= -1`.
2. Scan all pairs `(i, j)` where `i < j`. For each pair within distance threshold **2.8 units**, write both node positions into the line buffer. Stop when `MAX_LINES` is reached.
3. Set `drawRange(0, lineCount * 2)` and `needsUpdate = true` on the line geometry's position attribute.
4. Update the points geometry positions from the same node array.

### Rendering

**Nodes:**
```tsx
<points ref={pointsRef}>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" args={[pointsPositions, 3]} />
  </bufferGeometry>
  <pointsMaterial size={0.04} color="#4f6ef7" transparent opacity={0.6} sizeAttenuation />
</points>
```

**Lines (flat opacity — no per-vertex color modulation):**
```tsx
<lineSegments ref={linesRef}>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position" args={[linesPositions, 3]} />
  </bufferGeometry>
  <lineBasicMaterial color="#4f6ef7" transparent opacity={0.2} />
</lineSegments>
```

The per-line distance-based opacity described in earlier drafts is dropped — `lineBasicMaterial` has no per-segment opacity capability without vertex colors, and the visual difference at this scale is negligible. Flat `opacity={0.2}` is the spec.

---

## 2. Mouse Parallax Cards — `FloatingDashboard` in `Hero.tsx`

**Problem:** The three floating cards appear with a fade+slide entrance but then stay fully static. The reference shows cards that react to mouse movement with different depths.

**Solution:** Add a `useMouseParallax` hook for the parallax offset, and wrap each card in a second `motion.div` for the continuous float loop — keeping the existing entrance `motion.div` untouched to avoid Framer Motion animation conflicts.

### `useMouseParallax` hook — `lib/hooks/useMouseParallax.ts`

**Returns:** `ref` object `{ x: number, y: number }` — **not reactive state** — to avoid 60fps re-renders. The hook updates this ref in a continuous RAF loop and separately mutates the card DOM elements via refs passed as arguments. Callers read the ref's current value but do not subscribe to it.

**Precise model:**
```ts
// Continuous RAF loop (not per-event scheduling)
const raw = useRef({ x: 0, y: 0 });   // updated on mousemove
const smooth = useRef({ x: 0, y: 0 }); // lerped each RAF tick
const LERP = 0.08;

// mousemove: normalize cursor to [-1, 1] relative to viewport center
// RAF tick: smooth.x = lerp(smooth.x, raw.x, LERP) — runs every frame even when mouse is still, so smooth eases to rest position naturally
```

**API:**
```ts
function useMouseParallax(): React.RefObject<{ x: number; y: number }>
```

The hook returns the `smooth` ref. `FloatingDashboard` reads `smooth.current.x / y` inside a separate `requestAnimationFrame` loop that directly mutates each card's `style.transform`.

**Guards:**
- Desktop only: if `window.matchMedia('(pointer: coarse)').matches`, the RAF loop never starts and `smooth` stays `{ x: 0, y: 0 }`
- SSR: `typeof window === 'undefined'` guard before accessing `window`
- Cleanup: `removeEventListener` + `cancelAnimationFrame` on unmount

### Applying parallax to cards (no re-renders)

`FloatingDashboard` holds three refs (`card1Ref`, `card2Ref`, `card3Ref`) pointing to wrapper `<div>` elements. A separate `useEffect` runs a RAF loop that reads `parallax.current` each frame and sets:
```ts
card1Ref.current.style.transform = `translate(${px * 1.2 * 18}px, ${py * 1.2 * 12}px)`;
card2Ref.current.style.transform = `translate(${px * 0.6 * 18}px, ${py * 0.6 * 12}px)`;
card3Ref.current.style.transform = `translate(${px * 0.9 * 18}px, ${py * 0.9 * 12}px)`;
```

where `px = parallax.current.x`, `py = parallax.current.y`. Direct DOM mutation — zero re-renders.

### Depth assignments

| Card | Depth factor | Visual effect |
|---|---|---|
| Conversion chart (top-left) | `1.2` | Moves most — feels closest to viewer |
| App.tsx code editor (bottom-right) | `0.6` | Moves least — feels furthest away |
| Lighthouse badge (bottom-left) | `0.9` | Medium depth |

### Continuous float animation — two-layer `motion.div`

**Problem with single `motion.div`:** Each existing card uses one `motion.div` with `animate={{ opacity: 1, y: 0 }}` for its entrance. Adding a second `animate` prop with `y: [0, -7, 0], repeat: Infinity` on the same element would silently override the entrance — Framer Motion 12 does not merge two `animate` props.

**Solution:** Wrap each card's existing `motion.div` in an outer `motion.div` that handles the float loop. The inner `motion.div` keeps its entrance animation unchanged:

```tsx
{/* Outer — float loop, no entrance */}
<motion.div
  animate={{ y: [0, -7, 0] }}
  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
>
  {/* Inner — entrance animation, unchanged */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1, duration: 0.8 }}
    className="absolute ..."
  >
    {/* card content */}
  </motion.div>
</motion.div>
```

Duration per card: `3.5s` (Conversion), `4.1s` (App.tsx), `4.7s` (Lighthouse) — never sync.

The parallax `ref` is attached to the outer `motion.div` so the direct DOM transform targets the float layer.

---

## Files Affected

| File | Change |
|---|---|
| `components/three/HeroScene.tsx` | Add `NetworkMesh` component (nodes + line segments, pre-allocated buffer with drawRange); render inside `<SceneGroup>` |
| `components/Hero.tsx` | Wrap each card in outer float `motion.div`; add parallax RAF loop with direct style mutation via refs |
| `lib/hooks/useMouseParallax.ts` | New file — continuous RAF lerp, returns smooth ref, desktop-only |

---

## Out of Scope

- No changes to headline GSAP animation, `useTextScramble`, `RotatingWord`, CTAs, or scroll indicator
- No changes to `CoreOrb`, `OrbitalSystem`, or `ParticleField` in the 3D scene
- No changes to Canvas `dpr` setting (stays `[1, 2]`)
- No new third-party libraries
- No mobile layout changes (parallax is desktop-only via the `pointer: coarse` guard)
- No changes to any other section or component
