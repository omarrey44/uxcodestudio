/**
 * OrbitHero.jsx
 * ---------------------------------------------------------------------------
 * Hero 3D — Robot ORBIT  (referencia standalone, sincronizado con HeroScene.tsx)
 *
 * EXPORTAR DESDE BLENDER:
 *   File → Export → glTF 2.0 (.glb)
 *   - Include → Selected Objects: OFF (exporta todo)
 *   - Geometry → Apply Modifiers: ON
 *   - Animation → ✓ (para que los clips NLA se incluyan)
 *   - Materials: Export
 *   Guardar como "orbit_robot.glb" en /public del proyecto Next.js
 *
 * MATERIALES EN EL GLB (el nombre en Blender debe contener estas cadenas):
 *   "glossy" / "gloss"  → casco, orejas, cuello, base  (titanio oscuro metálico)
 *   "visor"             → visor frontal (negro casi puro, misma metalness que glossy)
 *   "cyan" / "led" / "eye" → ojos rectangulares + anillo LED (emisión cyan)
 *   cualquier otro material con color claro → se fuerza a oscuro automáticamente
 *
 * DEPENDENCIAS:
 *   npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
 *
 * USO (en un proyecto React / Next.js con "use client"):
 *   import HeroScene from "@/components/three/HeroScene";
 *   <HeroScene eyeColor="#00d4ff" uxOn={false} />
 * ---------------------------------------------------------------------------
 */

import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  Environment,
  Lightformer,
  Float,
  Html,
  Text,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const MODEL_URL = "/orbit_robot.glb";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Loader                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function Loader() {
  return (
    <Html center>
      <div
        style={{
          color: "#00d8ff",
          font: "500 13px 'SF Mono', monospace",
          letterSpacing: ".12em",
          opacity: 0.8,
        }}
      >
        ORBIT INITIALIZING…
      </div>
    </Html>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Modelo                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function OrbitRobot({ ledColor = "#00d8ff", uxOn = false, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const { pointer } = useThree();
  const ledMats = useRef([]);

  const model = useMemo(() => scene.clone(true), [scene]);

  // Reproducir todos los clips de animación del GLB (blink, hover, etc.)
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => {
      if (a) a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    });
  }, [actions]);

  // Asignar materiales
  useEffect(() => {
    ledMats.current = [];
    model.traverse((o) => {
      if (!o.isMesh) return;
      const m = o.material;
      if (!m) return;
      const name = (m.name ?? "").toLowerCase();

      // Titanio oscuro — casco, orejas, cuello, base
      if (name.includes("glossy") || name.includes("gloss")) {
        m.color           = new THREE.Color(0x10121e);
        m.metalness       = 0.85;
        m.roughness       = 0.28;
        m.envMapIntensity = 0.40;
        m.needsUpdate     = true;
      }

      // Visor frontal — negro casi puro, mismo estilo que glossy
      if (name.includes("visor")) {
        m.color           = new THREE.Color(0x020305);
        m.metalness       = 0.85;
        m.roughness       = 0.28;
        m.envMapIntensity = 0.40;
        m.needsUpdate     = true;
      }

      // CyanLED — ojos + anillo LED (alta emisión para Bloom)
      if (name.includes("cyan") || name.includes("led") || name.includes("eye")) {
        m.emissive          = new THREE.Color(0x00d8ff);
        m.emissiveIntensity = 10.0;
        m.toneMapped        = false;
        m.metalness         = 0.0;
        m.roughness         = 0.0;
        m.envMapIntensity   = 0.0;
        m.needsUpdate       = true;
        ledMats.current.push(m);
      }

      // Fuerza oscuro cualquier material claro que no sea LED
      if (!name.includes("cyan") && !name.includes("led") && !name.includes("eye")) {
        const col = m.color;
        if (col && col.r > 0.7 && col.g > 0.7 && col.b > 0.7) {
          m.color = new THREE.Color(0x05050f);
          m.needsUpdate = true;
        }
      }
    });
  }, [model]);

  // Actualizar color LED cuando cambia ledColor
  useEffect(() => {
    const col = new THREE.Color(ledColor);
    ledMats.current.forEach((m) => {
      m.emissive = col;
      m.needsUpdate = true;
    });
  }, [ledColor]);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Parallax suave al cursor
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.x * 0.32,
      4,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.y * 0.18,
      4,
      delta
    );

    // Blink LED: apagón rápido cada ~4 s
    const t = state.clock.getElapsedTime();
    const blinkCycle = t % 4.0;
    const isBlink = blinkCycle > 3.85;
    ledMats.current.forEach((m) => {
      m.emissiveIntensity = isBlink ? 0.0 : 10.0;
    });
  });

  return (
    <group ref={group} {...props}>
      <primitive object={model} />

      {/* Texto UX en el visor — se muestra cuando uxOn=true */}
      <Text
        position={[0, 0.38, 0.82]}
        fontSize={0.26}
        letterSpacing={0.16}
        color={ledColor}
        anchorX="center"
        anchorY="middle"
        fillOpacity={uxOn ? 0.55 : 0}
        outlineColor={ledColor}
        outlineOpacity={uxOn ? 0.15 : 0}
        outlineWidth={0.008}
        renderOrder={999}
      >
        UX
      </Text>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

/* ─────────────────────────────────────────────────────────────────────────── */
/* Hero                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function OrbitHero({ eyeColor = "#00d4ff", uxOn = false }) {
  const wrapRef = useRef();
  const [frameloop, setFrameloop] = useState("always");

  // Pausa el render loop cuando el canvas sale del viewport (ahorro de GPU)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setFrameloop(e.isIntersecting ? "always" : "never"),
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        camera={{ position: [0, -0.20, 5.5], fov: 46, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <ambientLight intensity={0.22} />

        {/* Key light — define forma del casco */}
        <spotLight
          position={[2.5, 5.0, 4.0]}
          angle={0.50}
          penumbra={1}
          intensity={90}
          color="#c8dce8"
        />

        {/* Fill frontal suave */}
        <pointLight position={[0, 1.5, 4.5]} intensity={30} color="#7ab8d8" />

        {/* Rim lights cyan — silueta lateral */}
        <pointLight position={[-4.0, 1.0, 1.5]} intensity={22} color="#00c8ff" />
        <pointLight position={[ 4.0, 1.0, 1.5]} intensity={22} color="#00c8ff" />

        {/* LED base glow */}
        <pointLight position={[0, -2.0, 1.8]} intensity={35} color="#00aaff" />

        <Suspense fallback={<Loader />}>
          <Float speed={0.9} rotationIntensity={0.04} floatIntensity={0.30}>
            <OrbitRobot
              position={[0, -1.1, 0]}
              scale={1.18}
              ledColor={eyeColor}
              uxOn={uxOn}
            />
          </Float>

          <Environment resolution={256}>
            <color attach="background" args={["#03050a"]} />
            <Lightformer intensity={2.0} color="#b0c8d8" position={[0, 5, 1]} scale={[8, 2, 1]} />
            <Lightformer intensity={2.2} color="#00d8ff" position={[-6, 0.5, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 6, 1]} />
            <Lightformer intensity={2.2} color="#0090ff" position={[6, 0.5, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 6, 1]} />
            <Lightformer intensity={1.6} color="#00c8ff" position={[0, -4, 1.5]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 3, 1]} />
          </Environment>
        </Suspense>

        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={1.2} luminanceThreshold={0.72} luminanceSmoothing={0.15} mipmapBlur />
          <Vignette eskil={false} offset={0.20} darkness={0.92} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
