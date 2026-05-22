# AI Assistant 3D Head Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the entire `components/three/HeroScene.tsx` with a premium interactive AI head: IcosahedronGeometry wireframe skull with fresnel fill, glowing iris eye orbs that track the cursor, breathing idle, blinking, scanline, glitch patches, and rim lights.

**Architecture:** Single file replacement — all components live in `components/three/HeroScene.tsx`. The outer `HeadGroup` manages breathing + mouse tilt; an inner `SkullGroup` applies skull scale `[0.92, 1.35, 0.88]` and contains the skull meshes, scanline, patches, and neck stub; eye assemblies sit outside the scale group to preserve their circular shape. All animation runs in `useFrame` with `useRef` — no `useState` in the render loop.

**Tech Stack:** React Three Fiber 9, Three.js 0.184, TypeScript 5.7, Next.js 16 App Router

**File map:**
| File | Action |
|---|---|
| `components/three/HeroScene.tsx` | Complete replacement — only file that changes |

**No other files change.** Canvas config, export name `HeroScene`, and how Hero.tsx imports it are all preserved exactly.

**TypeScript check command (run after each task):**
```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```
Expected: zero errors.

**Dev server:**
```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npm run dev
```
Open http://localhost:3000 to visually verify.

---

## Task 1: Canvas Shell + Lights

Write the new file skeleton with the Canvas, lights, and a temporary gray sphere placeholder. This verifies the Canvas config and lighting are correct before adding any complex geometry.

**Files:**
- Replace: `components/three/HeroScene.tsx`

- [ ] **Step 1: Write the new skeleton**

Replace the entire file content with:

```tsx
"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Placeholder() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.08} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={4} color="#00d4ff" />
        <pointLight position={[2.5, -1, -2]} intensity={3} color="#8b5cf6" />
        <Placeholder />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Visual verify**

Start dev server, open http://localhost:3000. The right side of the Hero section should show a gray wireframe sphere with faint cyan/violet lighting. No console errors.

- [ ] **Step 4: Commit**

```bash
git add components/three/HeroScene.tsx
git commit -m "feat: start AI head scene — canvas shell + lights"
```

---

## Task 2: Skull Geometry

Add `SkullWireframe` (glowing edges) and `SkullFill` (fresnel shader), wrapped in `HeadGroup` with the correct scale transform. The Placeholder is removed.

**Files:**
- Modify: `components/three/HeroScene.tsx`

- [ ] **Step 1: Add `SkullWireframe` component above `HeroScene`**

```tsx
function SkullWireframe({ geo }: { geo: THREE.IcosahedronGeometry }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.4 }),
    []
  );
  useEffect(() => () => { edges.dispose(); mat.dispose(); }, [edges, mat]);
  return (
    <lineSegments geometry={edges}>
      <primitive object={mat} attach="material" />
    </lineSegments>
  );
}
```

- [ ] **Step 2: Add `SkullFill` component**

```tsx
function SkullFill({ geo }: { geo: THREE.IcosahedronGeometry }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
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
      }),
    []
  );
  useEffect(() => () => { mat.dispose(); }, [mat]);
  return (
    <mesh geometry={geo}>
      <primitive object={mat} attach="material" />
    </mesh>
  );
}
```

- [ ] **Step 3: Add `HeadGroup` with skull children, replace `Placeholder`**

Add `HeadGroup` component (no animation yet — just structure and scale):

```tsx
function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const skullGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 2), []);
  useEffect(() => () => { skullGeo.dispose(); }, [skullGeo]);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Skull geometry — scaled to head proportions */}
      <group scale={[0.92, 1.35, 0.88]}>
        <SkullWireframe geo={skullGeo} />
        <SkullFill geo={skullGeo} />
      </group>
    </group>
  );
}
```

Replace `<Placeholder />` with `<HeadGroup />` inside the Canvas Suspense block. Remove the `Placeholder` function. Remove unused imports if any.

- [ ] **Step 4: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 5: Visual verify**

Reload http://localhost:3000. You should see:
- A glowing cyan wireframe icosahedron skull (slightly tall/narrow due to scale)
- Soft holographic glow on the edges from the fresnel fill
- The shape should be taller than wide (1.35 y-scale)
- Cyan rim light visible on the left side of the skull, violet on the right

- [ ] **Step 6: Commit**

```bash
git add components/three/HeroScene.tsx
git commit -m "feat: add SkullWireframe + SkullFill with fresnel shader"
```

---

## Task 3: HeadGroup Animations

Add breathing idle and mouse-tracking head tilt to `HeadGroup` via `useFrame`. No new components — this adds the animation loop to the existing HeadGroup.

**Files:**
- Modify: `components/three/HeroScene.tsx`

- [ ] **Step 1: Add `useFrame` to `HeadGroup`**

Inside `HeadGroup`, add the animation loop. The complete updated `HeadGroup` (replace the existing one):

```tsx
function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const skullGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 2), []);
  useEffect(() => () => { skullGeo.dispose(); }, [skullGeo]);

  useFrame(({ mouse, clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Breathing: gentle y-float + subtle Z-axis sway
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.8) * 0.04;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.012;
    // Mouse tilt: ±12° yaw, ±8° pitch
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.21,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.y * 0.14,
      0.06
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <SkullWireframe geo={skullGeo} />
        <SkullFill geo={skullGeo} />
      </group>
    </group>
  );
}
```

**Note:** `groupRef.current.position.y` overwrites the JSX `position` prop each frame — this is intentional, the breathing animation owns y. The initial `position={[0, 0.3, 0]}` is a starting value that gets replaced immediately on the first frame.

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Visual verify**

Reload http://localhost:3000 and observe:
1. Skull gently bobs up and down (~every 8s cycle)
2. Moving the mouse left/right tilts the head ±12°
3. Moving the mouse up/down tilts the head ±8°
4. Motion feels smooth (LERP 0.06 gives slight lag)

- [ ] **Step 4: Commit**

```bash
git add components/three/HeroScene.tsx
git commit -m "feat: add breathing idle + mouse head tilt to HeadGroup"
```

---

## Task 4: Eye Assembly

Add the `EyeAssembly` component — glowing iris eye orbs with independent cursor tracking and random blinking. Two instances are added to `HeadGroup` outside the skull scale group so the circles stay round.

**Files:**
- Modify: `components/three/HeroScene.tsx`

- [ ] **Step 1: Add `EyeAssembly` component**

Add before `HeadGroup`:

```tsx
function EyeAssembly({ position }: { position: [number, number, number] }) {
  const pivotRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Blink state
  const blinkTimer = useRef(3 + Math.random() * 5);
  const blinkScale = useRef(1.0);
  const blinkClosing = useRef(false);

  useFrame(({ mouse, delta }) => {
    if (!pivotRef.current) return;

    // Cursor tracking: map mouse NDC (-1..1) to eye rotation (±0.35 rad = ±20°)
    const targetRotX = Math.max(-0.35, Math.min(0.35, -mouse.y * 0.5));
    const targetRotY = Math.max(-0.35, Math.min(0.35,  mouse.x * 0.5));
    pivotRef.current.rotation.x = THREE.MathUtils.lerp(pivotRef.current.rotation.x, targetRotX, 0.08);
    pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, targetRotY, 0.08);

    // Blinking
    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0) {
      blinkTimer.current = 3 + Math.random() * 5;
      blinkClosing.current = true;
    }
    if (blinkClosing.current) {
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 0.08, 0.18);
      if (blinkScale.current < 0.1) blinkClosing.current = false;
    } else {
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 1.0, 0.12);
    }
    if (irisRef.current)  irisRef.current.scale.y  = blinkScale.current;
    if (outerRef.current) outerRef.current.scale.y = blinkScale.current;
  });

  return (
    <group ref={pivotRef} position={position}>
      {/* Outer glow ring */}
      <mesh ref={outerRef}>
        <circleGeometry args={[0.13, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} />
      </mesh>
      {/* Iris */}
      <mesh ref={irisRef} position={[0, 0, 0.001]}>
        <circleGeometry args={[0.095, 32]} />
        <meshBasicMaterial color="#4f6ef7" transparent opacity={0.9} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[0.04, 32]} />
        <meshBasicMaterial color="#010a20" />
      </mesh>
      {/* Glow point light */}
      <pointLight color="#00d4ff" intensity={1.5} distance={1.5} position={[0, 0, 0.05]} />
    </group>
  );
}
```

- [ ] **Step 2: Add two `EyeAssembly` instances to `HeadGroup`**

In `HeadGroup`'s return, add both eyes as siblings of the skull scale group (NOT inside the `scale` group — they need to stay round):

```tsx
return (
  <group ref={groupRef} position={[0, 0.3, 0]}>
    <group scale={[0.92, 1.35, 0.88]}>
      <SkullWireframe geo={skullGeo} />
      <SkullFill geo={skullGeo} />
    </group>
    {/* Eyes outside scale group — preserves circular shape */}
    <EyeAssembly position={[-0.30, 0.16, 0.81]} />
    <EyeAssembly position={[ 0.30, 0.16, 0.81]} />
  </group>
);
```

The eye positions `[±0.30, 0.16, 0.81]` are the skull's eye socket positions in HeadGroup world space. They are the pre-computed equivalents of the spec's local scale-group positions `[±0.33, 0.12, 0.92]` after applying the skull scale `[0.92, 1.35, 0.88]`: x: 0.33×0.92=0.30, y: 0.12×1.35=0.16, z: 0.92×0.88=0.81. The eyes sit outside the scale group so the circles keep their circular shape — this requires using world-space coordinates directly.

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Visual verify**

Reload http://localhost:3000 and check:
1. Two glowing blue/cyan eye orbs visible in the skull face area
2. Eyes track cursor — move mouse left, eyes look left; move up, eyes look up
3. Eyes blink every 3–8 seconds (scaleY collapses to nearly 0 then reopens)
4. Head still breathes and tilts with mouse
5. Eyes stay circular (not distorted by skull scale)

- [ ] **Step 5: Commit**

```bash
git add components/three/HeroScene.tsx
git commit -m "feat: add EyeAssembly with cursor tracking and blinking"
```

---

## Task 5: Decorative Elements

Add `ScanLine`, `GlitchPatches`, and `NeckStub`. These go inside the skull scale group.

**Files:**
- Modify: `components/three/HeroScene.tsx`

- [ ] **Step 1: Add `ScanLine` component**

Add before `HeadGroup`:

```tsx
function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#00d4ff",
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    []
  );
  useEffect(() => () => { mat.dispose(); }, [mat]);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Full sine period ~8s; one top→bottom pass ≈ 4s
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.785) * 1.1;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.98]}>
      <planeGeometry args={[2.2, 0.04]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}
```

- [ ] **Step 2: Add `GlitchPatches` component**

Add before `HeadGroup`:

```tsx
const PATCH_POSITIONS: [number, number, number][] = [
  [0.7, 0.8, 0.4],   [-0.6, 0.9, 0.5],  [0.9, -0.2, 0.3],
  [-0.8, -0.4, 0.4], [0.3, 1.0, 0.2],   [-0.2, -0.9, 0.4],
  [0.8, 0.5, -0.3],  [-0.7, 0.3, -0.4],
];

// Pre-calculate positions and quaternions once (outside component, stable)
const PATCH_TRANSFORMS = PATCH_POSITIONS.map((pos) => {
  const v = new THREE.Vector3(...pos).normalize().multiplyScalar(1.12);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    v.clone().normalize()
  );
  return { position: [v.x, v.y, v.z] as [number, number, number], quaternion: quat };
});

function GlitchPatches() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(8).fill(null));
  const patchTimers = useRef<number[]>(PATCH_POSITIONS.map(() => 1.5 + Math.random() * 2.5));
  const patchVisible = useRef<boolean[]>(Array(8).fill(false));

  useFrame(({ delta }) => {
    for (let i = 0; i < 8; i++) {
      patchTimers.current[i] -= delta;
      if (patchTimers.current[i] <= 0) {
        patchVisible.current[i] = !patchVisible.current[i];
        patchTimers.current[i] = 1.5 + Math.random() * 2.5;
        const mesh = meshRefs.current[i];
        if (mesh) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = patchVisible.current[i] ? 0.45 : 0;
        }
      }
    }
  });

  return (
    <>
      {PATCH_TRANSFORMS.map(({ position, quaternion }, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={position}
          quaternion={quaternion}
        >
          <planeGeometry args={[0.18, 0.12]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Add `NeckStub` component**

Add before `HeadGroup`:

```tsx
function NeckStub() {
  const geo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.28, 0.6, 6), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.25 }),
    []
  );
  useEffect(() => () => { geo.dispose(); edges.dispose(); mat.dispose(); }, [geo, edges, mat]);

  return (
    // position [0, -1.4, 0]: corrected from spec's [0, -1.1, 0].
    // The scale group applies y-scale 1.35 to BOTH position AND vertex heights.
    // Neck top in world space = (localY + cylinderHalfHeight) * 1.35 = (-1.4 + 0.3) * 1.35 = -1.485
    // Skull bottom in world space = -1.1 * 1.35 = -1.485 ✓ — they meet exactly.
    // Using spec's -1.1 would put the neck top at (-1.1 + 0.3) * 1.35 = -1.08,
    // embedding the neck trunk ~0.4 world units INTO the skull.
    <lineSegments geometry={edges} position={[0, -1.4, 0]}>
      <primitive object={mat} attach="material" />
    </lineSegments>
  );
}
```

- [ ] **Step 4: Add all three to `HeadGroup`'s skull scale group**

Update `HeadGroup`'s return to include the new components inside the scale group:

```tsx
return (
  <group ref={groupRef} position={[0, 0.3, 0]}>
    <group scale={[0.92, 1.35, 0.88]}>
      <SkullWireframe geo={skullGeo} />
      <SkullFill geo={skullGeo} />
      <ScanLine />
      <GlitchPatches />
      <NeckStub />
    </group>
    <EyeAssembly position={[-0.30, 0.16, 0.81]} />
    <EyeAssembly position={[ 0.30, 0.16, 0.81]} />
  </group>
);
```

- [ ] **Step 5: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors. Common issue: TypeScript may flag `mesh.material` cast — the `as THREE.MeshBasicMaterial` cast in GlitchPatches is intentional (we know the type).

- [ ] **Step 6: Visual verify**

Reload http://localhost:3000 and check:
1. A thin horizontal cyan line sweeps up and down through the skull (~4s per pass)
2. Occasional patches of cyan flash on the skull surface (random, 1.5–4s interval each)
3. A hexagonal wireframe neck stub is visible below the skull
4. All previous effects still work (wireframe, fresnel, eyes, tilt, breathing)

- [ ] **Step 7: Commit**

```bash
git add components/three/HeroScene.tsx
git commit -m "feat: add ScanLine, GlitchPatches, NeckStub decorative elements"
```

---

## Task 6: Final Verification

End-to-end check — TypeScript, visual, production build.

**Files:** None (verify only)

- [ ] **Step 1: TypeScript clean check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Full visual end-to-end in incognito window**

Open http://localhost:3000 in an incognito tab (clean sessionStorage):

1. PageLoader plays (~1.4s) — logo fades in, overlay slides up
2. As loader exits, Hero GSAP animations fire: headline words animate in, CTAs fade up
3. Right side shows the AI head scene:
   - Cyan wireframe icosahedron skull with holographic fresnel fill
   - Two glowing blue/cyan eye orbs in the skull face area
   - Scanline sweeping vertically
   - Random glitch patches flickering on skull surface
   - Neck stub below skull
4. Move mouse: head tilts ±12° yaw / ±8° pitch; eyes track cursor with tighter range
5. Wait 3–8s: eyes blink (scaleY collapses then reopens)
6. Head breathes (subtle y oscillation)
7. Reload same tab: no loader, GSAP fires immediately

**Regression check (left side should be unaffected):**
- Headline still has split-word GSAP animation
- FloatingDashboard cards still parallax with mouse
- Scroll down: hero fades (ScrollTrigger scrub still works)

- [ ] **Step 3: Production build**

```powershell
cd C:/Users/Omar/IdeaProjects/uxcodestudio; npm run build 2>&1 | Select-Object -Last 20
```

Expected: `✓ Compiled successfully`. If build fails, check for `next/image` issues or missing imports.

- [ ] **Step 4: Push to GitHub**

```bash
git push origin master
```
