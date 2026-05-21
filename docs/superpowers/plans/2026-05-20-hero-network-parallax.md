# Hero Network Mesh & Parallax Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated polygon mesh network to the 3D hero scene and mouse-parallax depth effect with continuous float animation to the three floating HTML cards.

**Architecture:** Three independent tasks in order: (1) NetworkMesh R3F component added to the existing HeroScene; (2) useMouseParallax hook using a continuous RAF loop returning a plain ref; (3) FloatingDashboard restructured into a three-layer motion.div pattern and wired to the parallax hook via a direct DOM RAF loop — zero re-renders.

**Tech Stack:** React Three Fiber 9, Three.js 0.184, Framer Motion 12, React 19, TypeScript 5.7, Next.js 16 App Router

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/three/HeroScene.tsx` | Modify | Add `NetworkMesh` component; add to `<SceneGroup>` |
| `lib/hooks/useMouseParallax.ts` | Create | Continuous RAF lerp over normalized mouse position; returns a plain ref |
| `components/Hero.tsx` | Modify | Restructure `FloatingDashboard` cards into 3-layer pattern; add parallax RAF loop |

---

## Task 1: NetworkMesh Component

**Files:**
- Modify: `components/three/HeroScene.tsx`

**Context:** `HeroScene.tsx` currently exports a `Canvas` containing `SceneGroup > CoreOrb + OrbitalSystem + ParticleField`. Add `NetworkMesh` as a fourth child of `SceneGroup`. Use imperative `THREE.BufferGeometry` (created once in `useMemo`, never reallocated) with a `drawRange` approach for the dynamic line segments — this avoids garbage collection pressure from per-frame allocation.

- [ ] **Step 1: Add imports at the top of `HeroScene.tsx`**

The file already imports `useRef, useMemo, Suspense` from React and `THREE` from three. No new imports needed — `THREE.BufferGeometry`, `THREE.BufferAttribute`, `THREE.Points`, `THREE.LineSegments` are all available via the existing `* as THREE` import.

- [ ] **Step 2: Add the `NetworkMesh` component above `OrbitalSystem`**

Insert this complete component after the `ParticleField` function (around line 153) and before `export default function HeroScene()`:

```tsx
const MAX_NODES = 80;
const MAX_LINES = 200;
const CONNECTION_DIST = 2.8;

function NetworkMesh() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { nodes, pointsGeo, linesGeo } = useMemo(() => {
    // Generate nodes with random positions (radius 5–8) and drift velocities
    const nodes: Array<{ pos: [number, number, number]; vel: [number, number, number] }> = [];
    for (let i = 0; i < MAX_NODES; i++) {
      const r = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodes.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        vel: [
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
        ],
      });
    }

    // Pre-allocate buffers — never resized; drawRange controls visible segments
    const pointsPositions = new Float32Array(MAX_NODES * 3);
    const linesPositions = new Float32Array(MAX_LINES * 2 * 3);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(pointsPositions, 3));

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(linesPositions, 3));
    linesGeo.setDrawRange(0, 0);

    return { nodes, pointsGeo, linesGeo };
  }, []);

  useFrame(() => {
    const pAttr = pointsGeo.attributes.position as THREE.BufferAttribute;
    const lAttr = linesGeo.attributes.position as THREE.BufferAttribute;
    const lArr = lAttr.array as Float32Array;

    // Advance node positions; reflect off sphere of radius 8
    for (let i = 0; i < MAX_NODES; i++) {
      const n = nodes[i];
      for (let axis = 0; axis < 3; axis++) {
        n.pos[axis] += n.vel[axis];
        if (Math.abs(n.pos[axis]) > 8) n.vel[axis] *= -1;
        (pAttr.array as Float32Array)[i * 3 + axis] = n.pos[axis];
      }
    }

    // Find pairs within connection threshold (capped at MAX_LINES)
    let lineCount = 0;
    outer: for (let i = 0; i < MAX_NODES; i++) {
      for (let j = i + 1; j < MAX_NODES; j++) {
        if (lineCount >= MAX_LINES) break outer;
        const dx = nodes[i].pos[0] - nodes[j].pos[0];
        const dy = nodes[i].pos[1] - nodes[j].pos[1];
        const dz = nodes[i].pos[2] - nodes[j].pos[2];
        if (dx * dx + dy * dy + dz * dz < CONNECTION_DIST * CONNECTION_DIST) {
          const b = lineCount * 6;
          lArr[b]     = nodes[i].pos[0]; lArr[b + 1] = nodes[i].pos[1]; lArr[b + 2] = nodes[i].pos[2];
          lArr[b + 3] = nodes[j].pos[0]; lArr[b + 4] = nodes[j].pos[1]; lArr[b + 5] = nodes[j].pos[2];
          lineCount++;
        }
      }
    }

    linesGeo.setDrawRange(0, lineCount * 2);
    pAttr.needsUpdate = true;
    lAttr.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial size={0.04} color="#4f6ef7" transparent opacity={0.6} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial color="#4f6ef7" transparent opacity={0.2} />
      </lineSegments>
    </>
  );
}
```

- [ ] **Step 3: Add `<NetworkMesh />` inside `<SceneGroup>` in `HeroScene`**

Find the `<SceneGroup>` block (around line 166–170):

```tsx
// Before:
<SceneGroup>
  <CoreOrb />
  <OrbitalSystem />
  <ParticleField />
</SceneGroup>

// After:
<SceneGroup>
  <CoreOrb />
  <OrbitalSystem />
  <ParticleField />
  <NetworkMesh />
</SceneGroup>
```

- [ ] **Step 4: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit 2>&1 | head -30
```

Expected: no output (clean). Common issue: TypeScript may complain about `(pAttr.array as Float32Array)` — if so, store the array in a variable before the loop: `const pArr = pAttr.array as Float32Array`.

- [ ] **Step 5: Visual check**

```bash
npm run dev
```

Open http://localhost:3000. In the Hero section, the 3D scene should now show thin blue lines connecting nodes in the background, with the nodes slowly drifting. The lines should appear and disappear as nodes move in and out of connection range. The existing code orbit and sphere are unaffected.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio
git add components/three/HeroScene.tsx
git commit -m "feat: add NetworkMesh polygon network to hero 3D scene"
```

---

## Task 2: useMouseParallax Hook

**Files:**
- Create: `lib/hooks/useMouseParallax.ts`

**Context:** Follow the pattern of `lib/hooks/useTextScramble.ts` — a `"use client"` module. This hook runs a continuous `requestAnimationFrame` loop that lerps `smooth` toward `raw` mouse position every frame (even when the mouse is still, so the value eases to rest). Returns a plain `React.RefObject` — not state — so no re-renders occur.

- [ ] **Step 1: Create `lib/hooks/useMouseParallax.ts`**

```ts
"use client";

import { useEffect, useRef } from "react";

const LERP = 0.08;

export function useMouseParallax() {
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const raw = { x: 0, y: 0 };
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1] relative to viewport center
      raw.x = (e.clientX / window.innerWidth) * 2 - 1;
      raw.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      // Continuous lerp — eases to rest even when mouse is stationary
      smooth.current.x += (raw.x - smooth.current.x) * LERP;
      smooth.current.y += (raw.y - smooth.current.y) * LERP;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return smooth;
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio
git add lib/hooks/useMouseParallax.ts
git commit -m "feat: add useMouseParallax hook with continuous RAF lerp"
```

---

## Task 3: FloatingDashboard — Parallax + Float

**Files:**
- Modify: `components/Hero.tsx`

**Context:** The current `FloatingDashboard` in `Hero.tsx` (lines 236–308) has three cards, each as a single `motion.div` with `position: absolute`, entrance animation (`initial/animate/transition`), and card content. 

This task restructures each card into **three layers**:
1. **Outer plain `div`** — holds `position: absolute` and the `ref` for parallax mutation (top/left/right/bottom via direct style). Plain div avoids transform-induced stacking context issues while the card is still absolutely positioned relative to the `relative` container.
2. **Middle `motion.div`** — float loop (`y: [0, -7, 0]`, infinite repeat), no positioning.
3. **Inner `motion.div`** — entrance animation (opacity + y), card styling — same as today.

A separate `useEffect` RAF loop in `FloatingDashboard` reads `parallax.current` each frame and directly mutates each outer div's `style.top`/`style.left` (or `style.right`/`style.bottom` for right-anchored cards).

**CSS unit reference for base positions (current Tailwind → rem → px):**
- Card 1: `-left-6` = `-1.5rem`, `top-10` = `2.5rem`
- Card 2: `-right-4` = `-1rem`, `bottom-24` = `6rem`
- Card 3: `bottom-2` = `0.5rem`, `left-4` = `1rem`

- [ ] **Step 1: Add `useMouseParallax` import to `Hero.tsx`**

At the top of `components/Hero.tsx`, after the existing imports, add:

```tsx
import { useMouseParallax } from "@/lib/hooks/useMouseParallax";
```

- [ ] **Step 2: Rewrite `FloatingDashboard` function**

Replace the entire `FloatingDashboard` function (lines 236–308) with:

```tsx
function FloatingDashboard() {
  const parallax = useMouseParallax();
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const px = parallax.current.x;
      const py = parallax.current.y;
      // GPU-composited transform — no layout recalculation, all cards follow mouse in same direction
      if (card1Ref.current)
        card1Ref.current.style.transform = `translate(${px * 1.2 * 18}px, ${py * 1.2 * 12}px)`;
      if (card2Ref.current)
        card2Ref.current.style.transform = `translate(${px * 0.6 * 18}px, ${py * 0.6 * 12}px)`;
      if (card3Ref.current)
        card3Ref.current.style.transform = `translate(${px * 0.9 * 18}px, ${py * 0.9 * 12}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [parallax]);

  return (
    <>
      {/* Card 1: Conversion chart — depth 1.2× (closest) */}
      <div
        ref={card1Ref}
        className="absolute"
        style={{ top: "2.5rem", left: "-1.5rem", willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="w-[220px] rounded-2xl glass-strong p-4 neon-border glow-blue"
          >
            <div className="flex items-center justify-between text-[10px] text-white/50">
              <span>Conversion</span>
              <span className="text-accent-cyan">+318%</span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              {[40, 55, 38, 70, 50, 82, 65, 92].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: 1.3 + i * 0.06, duration: 0.6 }}
                  className="w-2.5 rounded-sm bg-gradient-to-t from-accent-blue to-accent-cyan"
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="mt-3 font-display text-2xl font-bold text-white">
              12,847
            </div>
            <div className="text-[10px] text-white/40">unique sessions / 24h</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Card 2: Code editor — depth 0.6× (furthest) */}
      <div
        ref={card2Ref}
        className="absolute"
        style={{ bottom: "6rem", right: "-1rem", willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="w-[260px] rounded-2xl glass-strong p-3 neon-border"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-auto text-[10px] text-white/40">App.tsx</span>
            </div>
            <pre className="mt-3 overflow-hidden text-[10.5px] leading-relaxed text-white/70">
{`export default function Ship() {
  const ui = useDesign({
    polish: 100,
    motion: "cinematic",
  });
  return <Beautiful {...ui} />;
}`}
            </pre>
          </motion.div>
        </motion.div>
      </div>

      {/* Card 3: Lighthouse badge — depth 0.9× (medium) */}
      <div
        ref={card3Ref}
        className="absolute"
        style={{ bottom: "0.5rem", left: "1rem", willChange: "transform" }}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex items-center gap-3 rounded-full glass-strong px-4 py-2.5 glow-violet"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent-violet to-accent-blue text-xs">
              ✦
            </span>
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-white">Lighthouse 100</div>
              <div className="text-[9px] text-white/40">Perf · A11y · SEO</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
```

Note: `useRef` is already imported in `Hero.tsx`. `useEffect` is also already imported. No new React imports needed.

- [ ] **Step 3: TypeScript check**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npx tsc --noEmit 2>&1 | head -30
```

Expected: no output. If `parallax` is flagged in the `useEffect` dependency array, add `// eslint-disable-next-line react-hooks/exhaustive-deps` above the `useEffect` — the ref is stable and intentionally omitted.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
1. All three cards appear with their entrance animations (fade + slide up)
2. Moving the mouse causes the cards to shift at different depths — Conversion card moves most, App.tsx moves least
3. Cards gently float up and down continuously after ~2 seconds
4. On mobile viewport (Chrome DevTools 375px): parallax inactive, cards appear and stay static
5. No layout breaks or card overlap at any viewport

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio
git add components/Hero.tsx
git commit -m "feat: add mouse parallax depth and float animation to hero cards"
```

---

## Final Build Check

- [ ] **Run production build**

```bash
cd C:/Users/Omar/IdeaProjects/uxcodestudio && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. TypeScript errors are caught during build; Three.js dynamic import warnings are expected and benign.
