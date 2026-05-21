# AI Face Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `components/three/HeroScene.tsx` with a hexagonal prism AI robot face featuring a dark metallic body, glossy black visor, horizontal slit LED eyes with pupil tracking, blink, squint, LED pulse, and breathing/mouse-tilt idle animations.

**Architecture:** Single file replacement — all components live in `components/three/HeroScene.tsx`. The file is built incrementally across 5 tasks, each adding one visual layer and committing a working intermediate state. The Canvas props and default export name are unchanged so `Hero.tsx` continues to work without modification.

**Tech Stack:** React Three Fiber 9, Three.js 0.184, TypeScript 5.7, Next.js App Router (`"use client"`)

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `components/three/HeroScene.tsx` | **Overwrite** | Entire scene — all components in one file |

No other files are touched.

---

## Critical Rules (read before touching any code)

1. **`useFrame` signature:** `(state, delta)` — `delta` is the **second argument**. Never destructure delta from state: `useFrame(({ mouse, clock }, delta) => ...)` ✓ / `useFrame(({ mouse, clock, delta }) => ...)` ✗
2. **Eyes outside scale group:** The scale `[0.92, 1.35, 0.88]` is non-uniform. EyeSlit components live **outside** the `<group scale={...}>` to preserve exact box proportions. World-space positions = local × scale: `x×0.92`, `y×1.35`, `z×0.88`.
3. **Imperative materials for mutation:** The inner core material is created via `useMemo` (not JSX) because its opacity is mutated each frame. It must be disposed in `useEffect` cleanup.
4. **`useEffect` deps for disposal:** Always `[]` — geometries/materials are `useMemo` values that never change. Correct: `useEffect(() => () => { geo.dispose(); }, [])`.
5. **JSX geometries auto-dispose:** `<boxGeometry>`, `<planeGeometry>` etc declared in JSX are disposed automatically by R3F on unmount — no manual cleanup needed for those.
6. **No `useState` in animation:** All animation state lives in `useRef`. Never call `setState` inside `useFrame`.
7. **Initial group position:** `HeadGroup` JSX must declare `position={[0, 0.3, 0]}` to avoid a 1-frame pop before the first `useFrame` fires.

---

## Task 1: Canvas Scaffold + HexPrismBody

**Files:**
- Overwrite: `components/three/HeroScene.tsx`

Replace the entire file with a minimal working scene that renders the dark metallic hexagonal prism head structure (prism body + flattened crown cap + cyan edge overlay). This establishes the core geometry that all subsequent tasks build on.

- [ ] **Step 1: Overwrite `components/three/HeroScene.tsx` with the following**

```tsx
"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function HexPrismBody() {
  const prismGeo = useMemo(() => new THREE.CylinderGeometry(0.75, 0.68, 1.5, 6), []);
  const prismEdgesGeo = useMemo(() => new THREE.EdgesGeometry(prismGeo), [prismGeo]);
  const crownGeo = useMemo(() => new THREE.SphereGeometry(0.72, 6, 4), []);
  const prismMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#080b10", metalness: 0.92, roughness: 0.18 }),
    []
  );
  const prismEdgesMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.30 }),
    []
  );
  const crownMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#080b10", metalness: 0.92, roughness: 0.18 }),
    []
  );

  useEffect(() => () => {
    prismGeo.dispose(); prismEdgesGeo.dispose(); crownGeo.dispose();
    prismMat.dispose(); prismEdgesMat.dispose(); crownMat.dispose();
  }, []);

  return (
    <>
      <mesh geometry={prismGeo}>
        <primitive object={prismMat} attach="material" />
      </mesh>
      <lineSegments geometry={prismEdgesGeo}>
        <primitive object={prismEdgesMat} attach="material" />
      </lineSegments>
      <mesh geometry={crownGeo} position={[0, 0.75, 0]} scale={[1, 0.4, 1]}>
        <primitive object={crownMat} attach="material" />
      </mesh>
    </>
  );
}

function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
      </group>
    </group>
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
        <ambientLight intensity={0.06} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={5}   color="#00d4ff" />
        <pointLight position={[ 2.5, -1,  -2]} intensity={3.5} color="#8b5cf6" />
        <pointLight position={[  0,   2,   3]} intensity={0.8} color="#ffffff" />
        <HeadGroup />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 2: Start the dev server and verify visually**

```powershell
npm run dev
```

Open http://localhost:3000. You should see:
- A tall dark hexagonal prism in the center of the hero section
- Faint cyan edge lines on the prism faces
- A flattened dome crown cap on top
- Cyan and violet rim lighting from behind

- [ ] **Step 3: Stop the dev server and commit**

```powershell
git add components/three/HeroScene.tsx
git commit -m "feat: hex prism body + canvas scaffold for AI face redesign"
```

---

## Task 2: VisorPanel + BrowAccents

**Files:**
- Modify: `components/three/HeroScene.tsx`

Add the glossy black visor panel (zero-roughness MeshStandardMaterial that reflects rim lights as a dark glass surface) and the 4 brow accent strips that create the stern angular expression. Both are placed inside the scale group.

- [ ] **Step 1: Add `VisorPanel` component after `HexPrismBody`**

Insert this block between `HexPrismBody` and `HeadGroup`:

```tsx
function VisorPanel() {
  const visorGeo = useMemo(() => new THREE.BoxGeometry(1.05, 0.85, 0.04), []);
  const visorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#020508",
        metalness: 0.0,
        roughness: 0.0,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );
  useEffect(() => () => { visorGeo.dispose(); visorMat.dispose(); }, []);

  return (
    <mesh geometry={visorGeo} position={[0, 0.05, 0.50]}>
      <primitive object={visorMat} attach="material" />
    </mesh>
  );
}
```

- [ ] **Step 2: Add `BrowAccents` component after `VisorPanel`**

```tsx
const BROW_STRIPS: { position: [number, number, number]; rotZ: number }[] = [
  { position: [-0.18, 0.38, 0.525], rotZ:  0.28 },
  { position: [-0.34, 0.35, 0.525], rotZ:  0.22 },
  { position: [ 0.18, 0.38, 0.525], rotZ: -0.28 },
  { position: [ 0.34, 0.35, 0.525], rotZ: -0.22 },
];

function BrowAccents() {
  const browMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.45 }),
    []
  );
  useEffect(() => () => { browMat.dispose(); }, []);

  return (
    <>
      {BROW_STRIPS.map(({ position, rotZ }, i) => (
        <mesh key={i} position={position} rotation={[0, 0, rotZ]}>
          <boxGeometry args={[0.28, 0.016, 0.005]} />
          <primitive object={browMat} attach="material" />
        </mesh>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Add `VisorPanel` and `BrowAccents` to `HeadGroup` inside the scale group**

Update `HeadGroup`:

```tsx
function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
        <VisorPanel />
        <BrowAccents />
      </group>
    </group>
  );
}
```

- [ ] **Step 4: Verify visually**

Run `npm run dev`. Open http://localhost:3000. You should see:
- A dark glossy panel on the front face of the prism (reflects cyan/violet rim lights)
- 4 thin cyan diagonal lines above the eye area, angled inward like stern brows

- [ ] **Step 5: Stop the dev server and commit**

```powershell
git add components/three/HeroScene.tsx
git commit -m "feat: visor panel + brow accents"
```

---

## Task 3: EyeSlit

**Files:**
- Modify: `components/three/HeroScene.tsx`

Add the `EyeSlit` component — the most complex component. It renders 3 stacked box layers (outer slit, inner core, pupil) plus a point light, and runs all 4 animation systems: pupil cursor tracking, blink, squint, and LED pulse.

**Critical:** EyeSlit is placed **outside** the scale group. The inner core material must be created via `useMemo` (not JSX) because its opacity is mutated each frame for the LED pulse.

- [ ] **Step 1: Add `EyeSlit` component after `BrowAccents`**

```tsx
function EyeSlit({ position }: { position: [number, number, number] }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  // Imperative material — opacity is mutated in useFrame for LED pulse
  const innerCoreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00eeff", transparent: true, opacity: 1.0 }),
    []
  );
  useEffect(() => () => { innerCoreMat.dispose(); }, []);

  // Blink state
  const blinkTimer = useRef(3 + Math.random() * 5);
  const blinkScale = useRef(1.0);
  const blinkClosing = useRef(false);

  // Squint state
  const squintTimer = useRef(12 + Math.random() * 8);
  const squintActive = useRef(false);
  const squintHoldTimer = useRef(0);

  useFrame(({ mouse, clock }, delta) => {
    // --- Pupil tracking ---
    if (pupilRef.current) {
      const targetX = THREE.MathUtils.clamp(mouse.x * 0.12, -0.12, 0.12);
      pupilRef.current.position.x = THREE.MathUtils.lerp(
        pupilRef.current.position.x,
        targetX,
        0.10
      );
    }

    // --- Blink ---
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

    // --- Squint (blink takes priority) ---
    squintTimer.current -= delta;
    if (squintTimer.current <= 0 && !squintActive.current) {
      squintActive.current = true;
      squintHoldTimer.current = 1.5;
      squintTimer.current = 12 + Math.random() * 8;
    }
    if (squintActive.current && !blinkClosing.current) {
      squintHoldTimer.current -= delta;
      const target = squintHoldTimer.current > 0 ? 0.35 : 1.0;
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, target, 0.12);
      if (squintHoldTimer.current <= 0 && blinkScale.current > 0.92) {
        squintActive.current = false;
      }
    }

    // --- LED pulse ---
    if (innerRef.current) {
      (innerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.85 + Math.sin(clock.getElapsedTime() * 3.14) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Outer slit */}
      <mesh ref={outerRef}>
        <boxGeometry args={[0.38, 0.048, 0.006]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.65} />
      </mesh>
      {/* Inner core — uses imperative mat for opacity mutation */}
      <mesh ref={innerRef} position={[0, 0, 0.001]}>
        <boxGeometry args={[0.22, 0.026, 0.005]} />
        <primitive object={innerCoreMat} attach="material" />
      </mesh>
      {/* Pupil dot — slides on X axis */}
      <mesh ref={pupilRef} position={[0, 0, 0.002]}>
        <boxGeometry args={[0.07, 0.018, 0.004]} />
        <meshBasicMaterial color="#c0ffff" />
      </mesh>
      {/* Glow */}
      <pointLight color="#00d4ff" intensity={2.0} distance={1.2} position={[0, 0, 0.06]} />
    </group>
  );
}
```

- [ ] **Step 2: Add both `EyeSlit` instances to `HeadGroup` outside the scale group**

```tsx
function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
        <VisorPanel />
        <BrowAccents />
      </group>
      {/* Eyes outside scale group — preserves exact box proportions */}
      <EyeSlit position={[-0.26, 0.20, 0.52]} />
      <EyeSlit position={[ 0.26, 0.20, 0.52]} />
    </group>
  );
}
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`. Open http://localhost:3000. Verify:
- Two thin horizontal cyan slit eyes visible on the visor
- Bright white inner cores inside the slits
- Eyes blink closed and re-open at random intervals (3–8s)
- Moving the mouse left/right causes the white pupil dots to slide horizontally
- After ~12–20s, eyes briefly half-close (squint), then reopen
- Inner cores pulse slightly brighter/dimmer on a ~2s cycle

- [ ] **Step 4: Stop the dev server and commit**

```powershell
git add components/three/HeroScene.tsx
git commit -m "feat: eye slit with pupil tracking, blink, squint, LED pulse"
```

---

## Task 4: ScanLine + NeckStub

**Files:**
- Modify: `components/three/HeroScene.tsx`

Add the horizontal scan line that sweeps the visor (holographic UI effect) and the hexagonal neck stub that visually grounds the floating head.

- [ ] **Step 1: Add `ScanLine` component after `EyeSlit`**

```tsx
function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);
  const scanMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#00d4ff",
        transparent: true,
        opacity: 0.10,
        depthWrite: false,
      }),
    []
  );
  useEffect(() => () => { scanMat.dispose(); }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Sweeps visor height (-0.38 to +0.38), period ~6s
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.047) * 0.38;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.53]}>
      <planeGeometry args={[1.0, 0.03]} />
      <primitive object={scanMat} attach="material" />
    </mesh>
  );
}
```

- [ ] **Step 2: Add `NeckStub` component after `ScanLine`**

```tsx
function NeckStub() {
  const neckGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.30, 0.5, 6), []);
  const neckEdgesGeo = useMemo(() => new THREE.EdgesGeometry(neckGeo), [neckGeo]);
  const neckEdgesMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.20 }),
    []
  );
  useEffect(() => () => { neckGeo.dispose(); neckEdgesGeo.dispose(); neckEdgesMat.dispose(); }, []);

  return (
    <lineSegments geometry={neckEdgesGeo} position={[0, -1.0, 0]}>
      <primitive object={neckEdgesMat} attach="material" />
    </lineSegments>
  );
}
```

- [ ] **Step 3: Add both to `HeadGroup` inside the scale group**

```tsx
function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
        <VisorPanel />
        <BrowAccents />
        <ScanLine />
        <NeckStub />
      </group>
      <EyeSlit position={[-0.26, 0.20, 0.52]} />
      <EyeSlit position={[ 0.26, 0.20, 0.52]} />
    </group>
  );
}
```

- [ ] **Step 4: Verify visually**

Run `npm run dev`. Open http://localhost:3000. Verify:
- A faint cyan horizontal line sweeps up and down across the visor on a ~6s cycle
- A faint hexagonal wireframe neck stub appears below the head, connecting it to nothing (grounding visual)

- [ ] **Step 5: Stop the dev server and commit**

```powershell
git add components/three/HeroScene.tsx
git commit -m "feat: scan line + neck stub"
```

---

## Task 5: HeadGroup Animation (Breathing + Mouse Tilt)

**Files:**
- Modify: `components/three/HeroScene.tsx`

Add the two idle animation systems to `HeadGroup`: breathing (gentle Y-float + subtle Z-sway) and mouse-driven head tilt (yaw + pitch). This is the final task — the file reaches its complete state.

- [ ] **Step 1: Add `useFrame` to `HeadGroup`**

Replace the current `HeadGroup` (which has no `useFrame`) with:

```tsx
function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ mouse, clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Breathing idle
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.806) * 0.04;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.010;
    // Mouse head tilt — position.y (breathing) and rotation.x/y (tilt) don't conflict
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.18,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.y * 0.12,
      0.06
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
        <VisorPanel />
        <BrowAccents />
        <ScanLine />
        <NeckStub />
      </group>
      <EyeSlit position={[-0.26, 0.20, 0.52]} />
      <EyeSlit position={[ 0.26, 0.20, 0.52]} />
    </group>
  );
}
```

- [ ] **Step 2: Verify the complete scene**

Run `npm run dev`. Open http://localhost:3000. Full verification checklist:

**Structure:**
- [ ] Dark hexagonal prism with cyan edge lines visible
- [ ] Flattened dome crown cap on top
- [ ] Glossy dark visor panel reflects rim lighting
- [ ] 4 diagonal brow accent strips above eye area, angled inward
- [ ] 2 horizontal slit eyes on visor
- [ ] Faint hexagonal neck stub below head

**Lighting:**
- [ ] Cyan rim light glow on left side of head
- [ ] Violet rim light glow on right side
- [ ] Visor panel shows reflections from rim lights

**Eye animations:**
- [ ] Both eyes blink (close + reopen) at random ~3–8s intervals
- [ ] Eyes occasionally squint (half-close) for ~1.5s every 12–20s
- [ ] Inner cores pulse brighter/dimmer on ~2s cycle
- [ ] Moving mouse left/right: pupil dots slide horizontally
- [ ] Blink overrides squint if both fire at the same time

**Head animations:**
- [ ] Head gently floats up and down (breathing idle, ~7.8s period)
- [ ] Moving mouse: head tilts toward cursor (yaw + pitch), returns to center when mouse leaves
- [ ] Subtle Z-axis sway in the breathing motion

- [ ] **Step 3: Stop the dev server and commit**

```powershell
git add components/three/HeroScene.tsx
git commit -m "feat: breathing idle + mouse head tilt — AI face redesign complete"
```

---

## Final State: Complete `components/three/HeroScene.tsx`

The file after all 5 tasks:

```tsx
"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function HexPrismBody() {
  const prismGeo = useMemo(() => new THREE.CylinderGeometry(0.75, 0.68, 1.5, 6), []);
  const prismEdgesGeo = useMemo(() => new THREE.EdgesGeometry(prismGeo), [prismGeo]);
  const crownGeo = useMemo(() => new THREE.SphereGeometry(0.72, 6, 4), []);
  const prismMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#080b10", metalness: 0.92, roughness: 0.18 }),
    []
  );
  const prismEdgesMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.30 }),
    []
  );
  const crownMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#080b10", metalness: 0.92, roughness: 0.18 }),
    []
  );
  useEffect(() => () => {
    prismGeo.dispose(); prismEdgesGeo.dispose(); crownGeo.dispose();
    prismMat.dispose(); prismEdgesMat.dispose(); crownMat.dispose();
  }, []);

  return (
    <>
      <mesh geometry={prismGeo}>
        <primitive object={prismMat} attach="material" />
      </mesh>
      <lineSegments geometry={prismEdgesGeo}>
        <primitive object={prismEdgesMat} attach="material" />
      </lineSegments>
      <mesh geometry={crownGeo} position={[0, 0.75, 0]} scale={[1, 0.4, 1]}>
        <primitive object={crownMat} attach="material" />
      </mesh>
    </>
  );
}

function VisorPanel() {
  const visorGeo = useMemo(() => new THREE.BoxGeometry(1.05, 0.85, 0.04), []);
  const visorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#020508",
        metalness: 0.0,
        roughness: 0.0,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );
  useEffect(() => () => { visorGeo.dispose(); visorMat.dispose(); }, []);

  return (
    <mesh geometry={visorGeo} position={[0, 0.05, 0.50]}>
      <primitive object={visorMat} attach="material" />
    </mesh>
  );
}

const BROW_STRIPS: { position: [number, number, number]; rotZ: number }[] = [
  { position: [-0.18, 0.38, 0.525], rotZ:  0.28 },
  { position: [-0.34, 0.35, 0.525], rotZ:  0.22 },
  { position: [ 0.18, 0.38, 0.525], rotZ: -0.28 },
  { position: [ 0.34, 0.35, 0.525], rotZ: -0.22 },
];

function BrowAccents() {
  const browMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.45 }),
    []
  );
  useEffect(() => () => { browMat.dispose(); }, []);

  return (
    <>
      {BROW_STRIPS.map(({ position, rotZ }, i) => (
        <mesh key={i} position={position} rotation={[0, 0, rotZ]}>
          <boxGeometry args={[0.28, 0.016, 0.005]} />
          <primitive object={browMat} attach="material" />
        </mesh>
      ))}
    </>
  );
}

function EyeSlit({ position }: { position: [number, number, number] }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  const innerCoreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00eeff", transparent: true, opacity: 1.0 }),
    []
  );
  useEffect(() => () => { innerCoreMat.dispose(); }, []);

  const blinkTimer = useRef(3 + Math.random() * 5);
  const blinkScale = useRef(1.0);
  const blinkClosing = useRef(false);

  const squintTimer = useRef(12 + Math.random() * 8);
  const squintActive = useRef(false);
  const squintHoldTimer = useRef(0);

  useFrame(({ mouse, clock }, delta) => {
    if (pupilRef.current) {
      const targetX = THREE.MathUtils.clamp(mouse.x * 0.12, -0.12, 0.12);
      pupilRef.current.position.x = THREE.MathUtils.lerp(
        pupilRef.current.position.x,
        targetX,
        0.10
      );
    }

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

    squintTimer.current -= delta;
    if (squintTimer.current <= 0 && !squintActive.current) {
      squintActive.current = true;
      squintHoldTimer.current = 1.5;
      squintTimer.current = 12 + Math.random() * 8;
    }
    if (squintActive.current && !blinkClosing.current) {
      squintHoldTimer.current -= delta;
      const target = squintHoldTimer.current > 0 ? 0.35 : 1.0;
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, target, 0.12);
      if (squintHoldTimer.current <= 0 && blinkScale.current > 0.92) {
        squintActive.current = false;
      }
    }

    if (innerRef.current) {
      (innerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.85 + Math.sin(clock.getElapsedTime() * 3.14) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh ref={outerRef}>
        <boxGeometry args={[0.38, 0.048, 0.006]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.65} />
      </mesh>
      <mesh ref={innerRef} position={[0, 0, 0.001]}>
        <boxGeometry args={[0.22, 0.026, 0.005]} />
        <primitive object={innerCoreMat} attach="material" />
      </mesh>
      <mesh ref={pupilRef} position={[0, 0, 0.002]}>
        <boxGeometry args={[0.07, 0.018, 0.004]} />
        <meshBasicMaterial color="#c0ffff" />
      </mesh>
      <pointLight color="#00d4ff" intensity={2.0} distance={1.2} position={[0, 0, 0.06]} />
    </group>
  );
}

function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);
  const scanMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#00d4ff",
        transparent: true,
        opacity: 0.10,
        depthWrite: false,
      }),
    []
  );
  useEffect(() => () => { scanMat.dispose(); }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.047) * 0.38;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.53]}>
      <planeGeometry args={[1.0, 0.03]} />
      <primitive object={scanMat} attach="material" />
    </mesh>
  );
}

function NeckStub() {
  const neckGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.30, 0.5, 6), []);
  const neckEdgesGeo = useMemo(() => new THREE.EdgesGeometry(neckGeo), [neckGeo]);
  const neckEdgesMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.20 }),
    []
  );
  useEffect(() => () => { neckGeo.dispose(); neckEdgesGeo.dispose(); neckEdgesMat.dispose(); }, []);

  return (
    <lineSegments geometry={neckEdgesGeo} position={[0, -1.0, 0]}>
      <primitive object={neckEdgesMat} attach="material" />
    </lineSegments>
  );
}

function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ mouse, clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.806) * 0.04;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.010;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.18,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.y * 0.12,
      0.06
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
        <VisorPanel />
        <BrowAccents />
        <ScanLine />
        <NeckStub />
      </group>
      <EyeSlit position={[-0.26, 0.20, 0.52]} />
      <EyeSlit position={[ 0.26, 0.20, 0.52]} />
    </group>
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
        <ambientLight intensity={0.06} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={5}   color="#00d4ff" />
        <pointLight position={[ 2.5, -1,  -2]} intensity={3.5} color="#8b5cf6" />
        <pointLight position={[  0,   2,   3]} intensity={0.8} color="#ffffff" />
        <HeadGroup />
      </Suspense>
    </Canvas>
  );
}
```
