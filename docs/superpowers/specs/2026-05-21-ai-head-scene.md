# AI Assistant 3D Head Scene — Design Spec
**Date:** 2026-05-21
**Scope:** Replace the entire HeroScene.tsx 3D visual with a premium interactive AI head/bust.

---

## Context

`components/three/HeroScene.tsx` currently renders CoreOrb + OrbitalSystem + ParticleField + NetworkMesh inside a single Canvas. This entire file is replaced. The Canvas props, export name (`HeroScene`), and how Hero.tsx consumes it remain unchanged — only the visual content changes.

**Current Canvas config (preserved exactly):**
```tsx
<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
```

**Stack:** React Three Fiber 9, Three.js 0.184, TypeScript 5.7, Drei 10
**Brand colors:** accent-cyan `#00d4ff`, accent-blue `#4f6ef7`, accent-violet `#8b5cf6`, background `#050508`

---

## Style Reference

Jarvis/OpenAI aesthetic: geometric, cold, precise. NOT cartoonish or soft. The head should read as an artificial intelligence rendered in light — partially real, partially holographic.

---

## Component Architecture

All components live in the single `components/three/HeroScene.tsx` file. No sub-files.

```
HeroScene (Canvas)
└── Suspense fallback={null}
    ├── Lights
    │   ├── ambientLight intensity=0.08
    │   ├── PointLight cyan  pos=(-2.5, 1.5, -2)  intensity=4  color="#00d4ff"
    │   └── PointLight violet pos=(2.5, -1, -2)    intensity=3  color="#8b5cf6"
    └── HeadGroup (THREE.Group ref)
        ├── SkullWireframe
        ├── SkullFill (fresnel-like transparent mesh)
        ├── EyeAssemblyL  (left eye: pivot + orb)
        ├── EyeAssemblyR  (right eye: pivot + orb)
        ├── ScanLine
        ├── GlitchPatches (8 patches)
        └── NeckStub
```

---

## HeadGroup — Geometry & Transform

**Base geometry:** `IcosahedronGeometry(1.1, 2)` — 80 triangles, detail level 2.

**Shape scale (applied to HeadGroup):**
```
scaleX: 0.92   // slightly narrower than tall
scaleY: 1.35   // elongated vertically for head silhouette
scaleZ: 0.88   // slightly flatter front-to-back
position: [0, 0.3, 0]  // slight upward offset to center head in viewport
```

---

## SkullWireframe

Convert the icosahedron to visible edges:
```ts
const skullGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 2), []);
const edgesGeo = useMemo(() => new THREE.EdgesGeometry(skullGeo), [skullGeo]);
// cleanup in useEffect return
```

**Material:** `LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.4 })`

**Render:** `<lineSegments geometry={edgesGeo}><primitive object={wireMaterial} /></lineSegments>`

---

## SkullFill (Fresnel Glow Effect)

A transparent mesh on the same geometry creates the holographic fill. Use a `ShaderMaterial` that computes view-angle opacity (fresnel) so the skull appears bright at silhouette edges and nearly invisible in the center.

```ts
const fresnelMaterial = useMemo(() => new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-worldPos.xyz);
      gl_Position = projectionMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
      vec3 col = mix(vec3(0.0, 0.83, 1.0), vec3(0.31, 0.22, 0.96), 1.0 - fresnel);
      gl_FragColor = vec4(col, fresnel * 0.55);
    }
  `,
  transparent: true,
  side: THREE.FrontSide,
  depthWrite: false,
}), []);
```

**Render:** `<mesh geometry={skullGeo}><primitive object={fresnelMaterial} attach="material" /></mesh>`

---

## EyeAssembly (Left and Right)

Each eye is a THREE.Group acting as pivot. The group itself rotates to track the cursor. Inside the group are three stacked circle meshes.

**Eye socket positions** (in local HeadGroup space, before HeadGroup scale is applied):
- Left:  `[-0.33, 0.12, 0.92]`
- Right: `[+0.33, 0.12, 0.92]`

**Eye orb layers** (each a child of the pivot group, offset z slightly):
| Layer | Geometry | Material | z offset |
|---|---|---|---|
| Outer glow | CircleGeometry(0.13, 32) | MeshBasicMaterial color="#00d4ff" transparent opacity=0.25 | 0 |
| Iris | CircleGeometry(0.095, 32) | MeshBasicMaterial color="#4f6ef7" transparent opacity=0.9 | 0.001 |
| Pupil | CircleGeometry(0.04, 32) | MeshBasicMaterial color="#010a20" | 0.002 |
| Glow light | `<pointLight>` color="#00d4ff" intensity=1.5 distance=1.5 | — | 0.05 |

**All eye layers always face camera** (billboarded) — achieved by placing them inside the pivot group which only rotates around X/Y (no Z), so the circles always face +Z locally.

### Eye Tracking Logic

In `useFrame`:
```ts
// For each eye pivot (lEyeRef, rEyeRef):
const target = new THREE.Vector3(mouse.x * 3.5, mouse.y * 3.5, 5);
const localTarget = eyePivotRef.current.worldToLocal(target.clone());
const targetRot = new THREE.Euler(
  Math.max(-0.35, Math.min(0.35, -Math.atan2(localTarget.y, localTarget.z))),
  Math.max(-0.35, Math.min(0.35,  Math.atan2(localTarget.x, localTarget.z))),
  0
);
eyePivotRef.current.rotation.x = THREE.MathUtils.lerp(eyePivotRef.current.rotation.x, targetRot.x, 0.08);
eyePivotRef.current.rotation.y = THREE.MathUtils.lerp(eyePivotRef.current.rotation.y, targetRot.y, 0.08);
```

### Blinking

Two refs drive blinking:
- `blinkTimer` (`useRef<number>(3 + Math.random() * 5)`) — countdown to next blink in seconds
- `blinkScale` (`useRef<number>(1.0)`) — current eye scaleY, applied to iris + outer glow each frame

In `useFrame`:
```ts
blinkTimer.current -= delta;
if (blinkTimer.current <= 0) {
  blinkTimer.current = 3 + Math.random() * 5; // reschedule 3–8s later
  // blinkScale now ramps down; the lerp below handles it next frames
}
// If blinkScale < 0.15, ramp back up; else ramp down if timer just reset
// Simplified: use a blinking boolean ref to track direction
// blinkClosing.current = true when timer fires; false once scale < 0.1
// Scale lerp:
if (blinkClosing.current) {
  blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 0.08, 0.18);
  if (blinkScale.current < 0.1) blinkClosing.current = false;
} else {
  blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 1.0, 0.12);
}
iris.current.scale.y = blinkScale.current;
outerGlow.current.scale.y = blinkScale.current;
```

Three refs total: `blinkTimer`, `blinkScale`, `blinkClosing` (`useRef<boolean>(false)`).

---

## ScanLine

A thin horizontal plane that animates from top to bottom of the head, looping every 4s.

```ts
// geometry
new THREE.PlaneGeometry(2.2, 0.04)  // width covers full head, very thin

// material
new THREE.MeshBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.12, depthWrite: false })

// animation in useFrame
scanRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.785) * 1.1; // full sine period ~8s; one top→bottom pass ≈ 4s
```

Position: `[0, 0, 0.98]` (just in front of skull surface)

---

## GlitchPatches

8 small `PlaneGeometry(0.18, 0.12)` meshes positioned on the skull surface at fixed offsets from the head center. Each patch:
- Is a `MeshBasicMaterial` with `color="#00d4ff"`, `transparent: true`
- Timers tracked as a single `patchTimers` ref: `useRef<number[]>([...8 random values in 1.5–4s...])`, and patch opacity refs as `patchOpacities` ref: `useRef<number[]>(Array(8).fill(0))`
- Toggles opacity between 0 and `0.45` on a random 1.5–4s interval — toggled in `useFrame` by decrementing each timer, flipping opacity, resetting timer on zero

**Patch positions** (sphere surface sampling, hardcoded for determinism):
```ts
const PATCH_POSITIONS: [number, number, number][] = [
  [0.7, 0.8, 0.4],  [-0.6, 0.9, 0.5],  [0.9, -0.2, 0.3],
  [-0.8, -0.4, 0.4], [0.3, 1.0, 0.2],  [-0.2, -0.9, 0.4],
  [0.8, 0.5, -0.3], [-0.7, 0.3, -0.4],
];
// normalize each to skull surface radius (1.1) and apply head scale
```

Patches are rotated to face away from head center (normal outward).

---

## NeckStub

A CylinderGeometry stub below the skull to ground the floating head visually.

```ts
// geometry
new THREE.CylinderGeometry(0.18, 0.28, 0.6, 6)  // 6-sided hex cross-section

// same EdgesGeometry + LineBasicMaterial as skull wireframe but opacity 0.25
// position: [0, -1.1, 0] relative to HeadGroup origin (below skull)
```

---

## HeadGroup — Animation Systems

### Breathing Idle

In `useFrame`:
```ts
const t = clock.getElapsedTime();
headGroupRef.current.position.y = 0.3 + Math.sin(t * 0.8) * 0.04;
headGroupRef.current.rotation.z = Math.sin(t * 0.4) * 0.012; // very subtle side tilt
```

### Mouse Head Tilt

In `useFrame` (runs after breathing to not overwrite position):
```ts
const targetRotY =  mouse.x * 0.21;  // ±12° max
const targetRotX = -mouse.y * 0.14;  // ±8° max
headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotY, 0.06);
headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotX, 0.06);
```

**Note:** Breathing uses `position.y`; mouse tilt uses `rotation.x/y`. They operate on different transform properties — no conflict.

---

## Lighting

```tsx
<ambientLight intensity={0.08} />
<pointLight position={[-2.5, 1.5, -2]} intensity={4} color="#00d4ff" />
<pointLight position={[2.5, -1, -2]} intensity={3} color="#8b5cf6" />
```

No `<Environment>` preset needed. The two rim lights behind the head create the holographic edge glow that reinforces the fresnel material.

---

## Geometry Cleanup

All imperatively created geometries must be disposed in `useEffect` cleanup:
```ts
useEffect(() => {
  return () => {
    skullGeo.dispose();
    edgesGeo.dispose();
    fresnelMaterial.dispose();
    // per-patch geometries disposed in GlitchPatches cleanup
  };
}, [skullGeo, edgesGeo, fresnelMaterial]);
```

---

## Performance Constraints

- No postprocessing (no EffectComposer, no Bloom pass)
- No external assets — all geometry is procedural
- No `useState` inside animation loop — all animation state in `useRef`
- IcosahedronGeometry detail=2: 80 triangles — low draw call budget
- `useMemo` for all geometries and materials
- `dpr={[1, 2]}` (already set by Hero.tsx Canvas)

---

## Out of Scope

- No GLTF/GLB model loading
- No postprocessing effects (Bloom, Chromatic Aberration)
- No changes to Hero.tsx, layout.tsx, or any file outside `components/three/HeroScene.tsx`
- No audio
- No mobile-specific head variant (same scene on all viewports)
- No particle field around the head (kept minimal per design approval)
