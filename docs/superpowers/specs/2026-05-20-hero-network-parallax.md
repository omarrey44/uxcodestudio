# Hero Network Mesh & Parallax Cards — Design Spec
**Date:** 2026-05-20
**Scope:** Two targeted changes to the Hero section: animated polygon mesh network in the 3D scene, and mouse-parallax floating cards in the HTML layer.

---

## Context

The Hero already has a working split layout (7:5 columns), a `FloatingDashboard` with three cards (Conversion chart, App.tsx code editor, Lighthouse badge), a code-orbit 3D scene, and GSAP/Framer Motion entrance animations. This spec adds two enhancements on top without touching the existing structure.

---

## 1. Polygon Network Mesh — `NetworkMesh` in `HeroScene.tsx`

**Problem:** The current background is a sparse `ParticleField` (60 points rotating slowly). The reference design has a dense animated polygon mesh network — nodes connected by glowing lines that shift as nodes drift — giving the scene atmospheric depth and a "living tech" quality.

**Solution:** Add a `NetworkMesh` component inside `HeroScene.tsx`, rendered inside `<SceneGroup>` alongside `CoreOrb`, `OrbitalSystem`, and `ParticleField`.

### Implementation

**Node generation (useMemo, runs once):**
- 80 nodes placed randomly in a sphere of radius 5–8
- Each node stores a base position and a slow drift velocity (`vx`, `vy`, `vz` in range ±0.002)
- Stored as a `Float32Array` for direct buffer use

**Per-frame update (useFrame):**
- Each node's position advances by its velocity, clamped to stay within radius 8 via reflection
- For every pair of nodes within connection distance threshold (default **2.8 units**), a line segment is added to the geometry
- Line opacity is modulated by distance: `opacity = 1 - (dist / threshold)` — closer nodes = brighter line
- The positions buffer is updated and marked `needsUpdate = true` each frame

**Rendering:**
- Nodes: `<Points>` with `<PointMaterial size={0.04} color="#4f6ef7" transparent opacity={0.6} sizeAttenuation />`
- Lines: `<lineSegments>` with `<bufferGeometry>` (positions attribute, updated each frame) + `<lineBasicMaterial color="#4f6ef7" transparent opacity={0.25} />`

**Performance:**
- Max connections capped at 200 per frame to avoid O(n²) cost at scale
- `dpr={[1, 1.5]}` is sufficient — the mesh is additive to an already-bounded canvas
- No additional Three.js objects needed; built purely from buffer geometry

**Colors:** Blue (`#4f6ef7`) for nodes and lines — consistent with the existing scene palette.

---

## 2. Mouse Parallax Cards — `FloatingDashboard` in `Hero.tsx`

**Problem:** The three floating cards appear with a fade+slide entrance but then stay fully static. The reference shows cards that react to mouse movement with different depths, creating a convincing sense of 3D layering.

**Solution:** Add a `useMouseParallax` hook and depth-based translation to each card in `FloatingDashboard`.

### `useMouseParallax` hook — `lib/hooks/useMouseParallax.ts`

- Listens to `mousemove` on the `window`
- Normalizes cursor to `[-1, 1]` relative to viewport center
- Applies lerp (`factor: 0.08`) to smooth the movement
- Returns `{ x, y }` as reactive state (updated via `requestAnimationFrame`)
- Cleans up on unmount (removes listener, cancels RAF)
- Desktop only: returns `{ x: 0, y: 0 }` when `(pointer: coarse)` matches

### Depth assignments

| Card | Depth factor | Direction |
|---|---|---|
| Conversion chart (top-left) | `1.2` | amplified — moves most |
| App.tsx code editor (bottom-right) | `0.6` | subdued — moves least |
| Lighthouse badge (bottom-left) | `0.9` | medium |

Each card's `transform` is `translate(mouse.x * depth * 18px, mouse.y * depth * 12px)` — applied via inline `style` prop, not Framer Motion (avoids conflict with the existing entrance animation).

### Continuous float animation

Each card also gets a persistent Framer Motion `animate` loop (independent of parallax):

```tsx
animate={{ y: [0, -7, 0] }}
transition={{ duration: 3.5 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
```

The `duration` varies per card so they never sync up and feel alive. This runs after the entrance animation completes (handled by `AnimatePresence` or `delay` offset).

---

## Files Affected

| File | Change |
|---|---|
| `components/three/HeroScene.tsx` | Add `NetworkMesh` component; render inside `<SceneGroup>` |
| `components/Hero.tsx` | Import `useMouseParallax`; apply depth transform + float loop to each card in `FloatingDashboard` |
| `lib/hooks/useMouseParallax.ts` | New file — normalized mouse position with lerp, desktop-only |

---

## Out of Scope

- No changes to headline GSAP animation, `useTextScramble`, `RotatingWord`, CTAs, or scroll indicator
- No changes to `CoreOrb`, `OrbitalSystem`, or `ParticleField` in the 3D scene
- No new third-party libraries
- No mobile layout changes (parallax is desktop-only via the `pointer: coarse` guard)
- No changes to any other section or component
