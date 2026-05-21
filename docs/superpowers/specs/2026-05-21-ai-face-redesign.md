# AI Face Redesign — Design Spec
**Date:** 2026-05-21
**Scope:** Replace the entire `components/three/HeroScene.tsx` with a hexagonal prism AI robot face.

---

## Context

`components/three/HeroScene.tsx` currently renders an IcosahedronGeometry wireframe skull. This entire file is replaced. The Canvas props, export name (`HeroScene`), and how `Hero.tsx` consumes it remain unchanged — only the visual content changes.

**Current Canvas config (preserved exactly):**
```tsx
<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
```

**Stack:** React Three Fiber 9, Three.js 0.184, TypeScript 5.7
**Brand colors:** accent-cyan `#00d4ff`, accent-blue `#4f6ef7`, accent-violet `#8b5cf6`, background `#050508`

---

## Style Reference

Iron Man helmet / Jarvis / Daft Punk / Tesla Optimus aesthetic: geometric, cold, industrial precision. NOT human-like. The head reads as a machine intelligence — dark metallic structure, glossy black visor face panel, glowing cyan slit eyes. No mouth, no nose, no organic features.

---

## Component Architecture

All components live in the single `components/three/HeroScene.tsx` file. No sub-files.

```
HeroScene (Canvas)
└── Suspense fallback={null}
    ├── Lights
    │   ├── ambientLight intensity=0.06
    │   ├── PointLight cyan   pos=(-2.5, 1.5, -2)  intensity=5    color="#00d4ff"
    │   ├── PointLight violet pos=(2.5, -1, -2)     intensity=3.5  color="#8b5cf6"
    │   └── PointLight fill   pos=(0, 2, 3)         intensity=0.8  color="#ffffff"
    └── HeadGroup (THREE.Group ref)
        ├── scale group [0.92, 1.35, 0.88]
        │   ├── HexPrismBody  (hex prism + crown + edges)
        │   ├── VisorPanel    (glossy black face panel)
        │   ├── BrowAccents   (4 thin strips, 2 per eye)
        │   ├── ScanLine      (sweeps visor)
        │   └── NeckStub      (edges only)
        └── [outside scale group — world-space positions]
            ├── EyeSlit left   pos=[-0.26, 0.20, 0.52]
            └── EyeSlit right  pos=[ 0.26, 0.20, 0.52]
```

**Why outside scale group:** The scale `[0.92, 1.35, 0.88]` is non-uniform. Eye slits placed inside it would be distorted (squashed height, narrowed width). Placing them outside preserves exact box dimensions. World-space positions are local × scale: `x × 0.92`, `y × 1.35`, `z × 0.88`.

---

## HexPrismBody

**Prism geometry:** `CylinderGeometry(0.75, 0.68, 1.5, 6)` — 6-sided, top radius 0.75, bottom radius 0.68 (slight taper), height 1.5.

**Crown cap:** `SphereGeometry(0.72, 6, 4)` scaled `[1, 0.4, 1]` positioned at `[0, 0.75, 0]` (flush with prism top). Same material as prism.

**Prism material:** `MeshStandardMaterial({ color: "#080b10", metalness: 0.92, roughness: 0.18 })`

**Edge overlay:** `EdgesGeometry` on the prism geometry → `LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.30 })`

**Geometry cleanup:** All imperatively created geometries disposed in `useEffect` return.

---

## VisorPanel

A flat panel representing the glossy black face of the robot.

**Geometry:** `BoxGeometry(1.05, 0.85, 0.04)` — covers the front face of the hex prism.

**Position:** `[0, 0.05, 0.50]` (local space, inside scale group) — centered slightly above mid-height, flush against front face.

**Material:** `MeshStandardMaterial({ color: "#020508", metalness: 0.0, roughness: 0.0, transparent: true, opacity: 0.88 })`

The zero-roughness metalness-0 combo produces a mirror-like dark glass reflection that picks up the cyan/violet rim lights.

---

## BrowAccents

Two thin angled strips above each eye, creating a stern angular brow line.

**Per eye:** 2 strips — inner and outer brow segment.

**Geometry (each):** `BoxGeometry(0.28, 0.016, 0.005)`

**Material:** `MeshBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.45 })`

**Positions and rotations** (local space, inside scale group):
| Strip | Position | Rotation Z |
|---|---|---|
| Left inner  | [-0.18, 0.38, 0.525] | +0.28 rad |
| Left outer  | [-0.34, 0.35, 0.525] | +0.22 rad |
| Right inner | [+0.18, 0.38, 0.525] | -0.28 rad |
| Right outer | [+0.34, 0.35, 0.525] | -0.22 rad |

Inward tilt (inner brow higher, outer lower) produces a stern, focused AI expression.

---

## EyeSlit

Each eye is a `THREE.Group` acting as a tracking pivot placed **outside the scale group**.

**Eye positions** (world-space, pre-computed from local `[±0.28, 0.15, 0.59]` × scale `[0.92, 1.35, 0.88]`):
- Left:  `[-0.26, 0.20, 0.52]`
- Right: `[+0.26, 0.20, 0.52]`

**Eye layers** (children of the pivot group):

| Layer | Geometry | Material | z offset |
|---|---|---|---|
| Outer slit | `BoxGeometry(0.38, 0.048, 0.006)` | `MeshBasicMaterial color="#00d4ff" transparent opacity=0.65` | 0 |
| Inner core | `BoxGeometry(0.22, 0.026, 0.005)` | `MeshBasicMaterial color="#00eeff" opacity=1.0` | 0.001 |
| Pupil dot  | `BoxGeometry(0.07, 0.018, 0.004)` | `MeshBasicMaterial color="#c0ffff"` | 0.002 |
| Glow light | `<pointLight>` | `color="#00d4ff" intensity=2.0 distance=1.2` | `[0,0,0.06]` |

**All layers always face camera** — placed inside the pivot group which only rotates around X/Y, so boxes always face +Z locally.

### Pupil Tracking

The pupil dot slides along the X axis to track cursor position:

```ts
useFrame(({ mouse }, delta) => {
  if (!pupilRef.current) return;
  const targetX = THREE.MathUtils.clamp(mouse.x * 0.12, -0.12, 0.12);
  pupilRef.current.position.x = THREE.MathUtils.lerp(pupilRef.current.position.x, targetX, 0.10);
  // ... blink, squint, pulse below
});
```

### Blink

Three refs drive blinking:
- `blinkTimer`: `useRef<number>(3 + Math.random() * 5)` — countdown to next blink
- `blinkScale`: `useRef<number>(1.0)` — current scaleY
- `blinkClosing`: `useRef<boolean>(false)` — direction flag

```ts
blinkTimer.current -= delta;
if (blinkTimer.current <= 0) {
  blinkTimer.current = 3 + Math.random() * 5;
  blinkClosing.current = true;
}
if (blinkClosing.current) {
  blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 0.05, 0.20);
  if (blinkScale.current < 0.08) blinkClosing.current = false;
} else {
  blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 1.0, 0.14);
}
if (outerRef.current) outerRef.current.scale.y = blinkScale.current;
if (innerRef.current) innerRef.current.scale.y = blinkScale.current;
```

### Squint

A periodic "thinking" half-close, every 12–20s:

```ts
// squintTimer: useRef<number>(12 + Math.random() * 8)
// squintActive: useRef<boolean>(false)
// squintHoldTimer: useRef<number>(0)

squintTimer.current -= delta;
if (squintTimer.current <= 0 && !squintActive.current) {
  squintActive.current = true;
  squintHoldTimer.current = 1.5; // hold squint for 1.5s
  squintTimer.current = 12 + Math.random() * 8;
}
// Blink takes priority — skip squint logic while a blink is in progress
if (squintActive.current && !blinkClosing.current) {
  squintHoldTimer.current -= delta;
  // scaleY target = 0.35 while active, 1.0 after
  const target = squintHoldTimer.current > 0 ? 0.35 : 1.0;
  blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, target, 0.12);
  if (squintHoldTimer.current <= 0 && blinkScale.current > 0.92) {
    squintActive.current = false;
  }
}
```

**Priority:** The squint block is guarded by `!blinkClosing.current`, so a blink firing mid-squint fully takes over `blinkScale`. After the blink completes (`blinkClosing` goes false), the squint resumes from wherever `blinkScale` left off and lerps back to 1.0 naturally.

### LED Pulse

Inner core opacity pulses between 0.70 and 1.0 on a ~2s sine cycle:

```ts
// In useFrame (inside the same useFrame as blink/squint):
const pulse = 0.85 + Math.sin(clock.getElapsedTime() * 3.14) * 0.15;
if (innerRef.current) {
  (innerRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
}
```

The inner core material is created imperatively via `useMemo` (required so the opacity mutation works). It must be disposed in `useEffect` cleanup alongside other imperative materials.

---

## ScanLine

A thin horizontal plane sweeping across the visor.

**Geometry:** `PlaneGeometry(1.0, 0.03)` — narrower than full head, fits within visor panel.

**Material:** `MeshBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.10, depthWrite: false })`

**Position:** `[0, 0, 0.53]` (local, inside scale group) — just in front of visor panel.

**Animation:**
```ts
// Sweeps visor height (-0.38 to +0.38), period ~6s
ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.047) * 0.38;
```

---

## NeckStub

A hex cylinder stub below the prism to visually ground the head.

**Geometry:** `CylinderGeometry(0.22, 0.30, 0.5, 6)`

**Render:** `EdgesGeometry` → `LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.20 })`

**Position** (inside scale group): `[0, -1.0, 0]`

*Position derivation:* prism half-height = `0.75`, so prism bottom vertices are at local `y = -0.75`. Neck half-height = `0.25`. Neck center local `y = -0.75 - 0.25 = -1.0`. The scale group's y-scale applies uniformly to both the prism and the neck, so both objects scale together — the neck top vertex (`-1.0 + 0.25 = -0.75`) matches the prism bottom vertex (`-0.75`) exactly in local space, and they remain flush at any y-scale.

---

## HeadGroup — Animation

### Breathing Idle

The HeadGroup JSX element must declare `position={[0, 0.3, 0]}` as initial position to avoid a 1-frame pop before the first `useFrame` fires.

```ts
const t = clock.getElapsedTime();
groupRef.current.position.y = 0.3 + Math.sin(t * 0.806) * 0.04;
groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.010;
```

### Mouse Head Tilt

```ts
groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y,  mouse.x * 0.18, 0.06);
groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.12, 0.06);
```

**Note:** `position.y` (breathing) and `rotation.x/y` (mouse tilt) operate on different transform properties — no conflict.

---

## Lighting

```tsx
<ambientLight intensity={0.06} />
<pointLight position={[-2.5, 1.5, -2]} intensity={5}   color="#00d4ff" />
<pointLight position={[ 2.5, -1,  -2]} intensity={3.5} color="#8b5cf6" />
<pointLight position={[  0,   2,   3]} intensity={0.8} color="#ffffff" />
```

The two rear rim lights (cyan + violet) reflect off the zero-roughness visor panel, creating holographic edge glows. The faint front fill keeps the dark prism body barely visible.

---

## Geometry Cleanup

All imperatively created geometries and materials must be disposed in `useEffect` cleanup. The `deps` array for unmount-only cleanup is `[]` — safe because all values are created via `useMemo` and never change.

**Per-component cleanup table:**

| Component | Imperative geometries | Imperative materials |
|---|---|---|
| `HexPrismBody` | `prismGeo`, `prismEdgesGeo`, `crownGeo` | `prismMat`, `prismEdgesMat`, `crownMat` |
| `VisorPanel` | `visorGeo` | `visorMat` |
| `NeckStub` | `neckGeo`, `neckEdgesGeo` | `neckEdgesMat` |
| `EyeSlit` (×2) | — | `innerCoreMat` (accessed by ref for opacity mutation) |
| `ScanLine` | — | `scanMat` |
| `BrowAccents` | — | `browMat` |

JSX-declared geometries (`<boxGeometry>`, `<planeGeometry>`) are auto-disposed by R3F on unmount — no manual cleanup needed for those.

Example cleanup pattern:
```ts
useEffect(() => {
  return () => {
    prismGeo.dispose();
    prismEdgesGeo.dispose();
    crownGeo.dispose();
    prismMat.dispose();
    prismEdgesMat.dispose();
    crownMat.dispose();
  };
}, []);
```

---

## Performance Constraints

- No postprocessing (no EffectComposer, no Bloom pass)
- No external assets — all geometry procedural
- No `useState` inside animation loops — all animation state in `useRef`
- `useMemo` for all imperatively created geometries and materials
- `dpr={[1, 2]}` (Canvas already set)
- `useFrame` delta: second argument `(state, delta)` — NOT destructured from state

---

## Out of Scope

- No GLTF/GLB model loading
- No postprocessing effects
- No changes to `Hero.tsx`, `layout.tsx`, or any file outside `components/three/HeroScene.tsx`
- No audio
- No mobile-specific variant
- No particle field
