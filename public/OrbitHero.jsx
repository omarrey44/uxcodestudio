/**
 * OrbitHero.jsx
 * ---------------------------------------------------------------------------
 * v1.0 — Adaptado del RobotHeadHero al modelo ORBIT v7
 *
 * DIFERENCIAS vs RobotHeadHero:
 *  • MODEL_URL → "/orbit_robot.glb"  (exporta desde Blender: File → Export → glTF 2.0)
 *  • Materiales ORBIT: "GlossyBlack", "CyanLED", "VisorBlack"
 *    (ya no hay BrushedMetal / Holo_Base / Visor_Frame)
 *  • Sin Eye_Rig — los ojos son geometría estática, no hay armature
 *  • Parallax solo en group (cabeza sigue al cursor), sin eye tracking
 *  • Cámara más alejada (z=5.5) y centrada (y=-0.2) — el ORBIT es
 *    un robot completo (base + cuello + cabeza), más alto que la cabeza sola
 *  • FOV 44→46 para encuadrar el cuerpo completo
 *  • ContactShadows bajada a y=-1.80 (la base del ORBIT está más abajo)
 *  • Float: rotationIntensity 0.06→0.04 — el cuerpo completo se ve
 *    extraño con mucho movimiento, sutil es más elegante
 *  • Bloom threshold 0.78→0.72: los LEDs cyan del ORBIT son muy brillantes
 *  • Lightformer inferior intensificado para el glow del anillo LED base
 *
 * CÓMO EXPORTAR DESDE BLENDER:
 *   1. Ejecuta orbit_robot_v7.py en Blender
 *   2. File → Export → glTF 2.0 (.glb)
 *   3. Settings: Include → Selected Objects: OFF (exporta todo)
 *                Geometry → Apply Modifiers: ON
 *                Materials: Export
 *   4. Guarda como "orbit_robot.glb" en /public de tu proyecto React
 *
 * DEPENDENCIAS
 *   npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
 * ---------------------------------------------------------------------------
 */

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  Environment,
  Lightformer,
  ContactShadows,
  Float,
  Html,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const MODEL_URL = "/ORBIT_final.glb";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Modelo ORBIT                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function OrbitRobot(props) {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const { pointer } = useThree();

  // Clonar escena para permitir múltiples instancias
  const model = useMemo(() => scene.clone(true), [scene]);

  // Reproducir animaciones si las hay (el modelo base no las tiene,
  // pero quedan listas si añades animaciones en Blender)
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => {
      if (a) a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    });
  }, [actions]);

  // ── Overrides de materiales para el modelo ORBIT ─────────────────────────
  useEffect(() => {
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow    = true;
      o.receiveShadow = true;
      const m = o.material;
      if (!m) return;

      // ── GLOSSY BLACK: casco, orejas, cuello, base ──────────────────────
      // Titanio oscuro muy reflectante — casi espejo, con toque azul-noche
      if (m.name === "GlossyBlack") {
        m.color            = new THREE.Color(0x05050f);
        m.metalness        = 0.95;
        m.roughness        = 0.07;
        m.envMapIntensity  = 0.55;   // Refleja el environment cyan sutilmente
        m.needsUpdate      = true;
      }

      // ── VISOR BLACK: panel frontal de la cabeza ─────────────────────────
      // Espejo negro profundo — refleja el entorno sin punto blanco
      if (m.name === "VisorBlack") {
        m.color            = new THREE.Color(0x010105);
        m.metalness        = 0.0;
        m.roughness        = 0.01;   // Casi espejo
        m.envMapIntensity  = 0.35;
        m.clearcoat        = 0.0;    // Elimina punto blanco de clearcoat
        m.needsUpdate      = true;
      }

      // ── CYAN LED: ojos + anillo base + anillos orejas ──────────────────
      // Emisión cyan intensa — toneMapped:false para que Bloom los agarre
      if (m.name === "CyanLED") {
        m.emissive          = new THREE.Color(0x00d8ff);
        m.emissiveIntensity = 7.0;    // Alto → glow fuerte en post-processing
        m.toneMapped        = false;  // Bloom los captura con máxima fuerza
        m.metalness         = 0.0;
        m.roughness         = 0.0;
        m.envMapIntensity   = 0.0;
        m.needsUpdate       = true;
      }
    });
  }, [model]);

  // ── Parallax al cursor (sin eye tracking — ORBIT no tiene Eye_Rig) ───────
  useFrame((_state, delta) => {
    if (!group.current) return;
    const targetY =  pointer.x * 0.08;   // Yaw suave
    const targetX = -pointer.y * 0.05;   // Pitch suave
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y, targetY, 4, delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x, targetX, 4, delta
    );
  });

  return (
    <group ref={group} {...props}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

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
/* Hero                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function OrbitHero() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        // Fondo azul-noche profundo, más oscuro en la base para el glow LED
        background:
          "radial-gradient(110% 80% at 50% 20%, #080d14 0%, #040709 55%, #020304 100%)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{
          // Más alejada que el hero anterior — el ORBIT es cuerpo completo
          // y=-0.20 para centrar verticalmente (la base baja hasta z≈0 en Blender)
          position: [0, -0.20, 5.5],
          fov: 46,
          near: 0.1,
          far: 50,
        }}
      >
        {/* ── Iluminación principal ──────────────────────────────────────────
            SpotLight desde arriba-derecha: revela la superficie del casco.
            Point lights cyan laterales: rim glow en los bordes del casco.
            Point light inferior: ilumina el anillo LED de la base hacia arriba. */}
        <ambientLight intensity={0.10} />

        {/* Key light — diagonal superior derecha */}
        <spotLight
          position={[2.5, 5.0, 4.0]}
          angle={0.50}
          penumbra={1}
          intensity={40}
          color="#b8ccd8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Rim lights cyan — perfilan las orejas y los bordes del casco */}
        <pointLight position={[-3.5, 0.8, 2.0]} intensity={18} color="#00c8ff" />
        <pointLight position={[ 3.5, 0.8, 2.0]} intensity={18} color="#00c8ff" />

        {/* Luz inferior — hace que el anillo LED de la base glow hacia arriba */}
        <pointLight position={[0, -2.2, 1.8]} intensity={14} color="#00aaff" />

        <Suspense fallback={<Loader />}>
          {/*
            Float ajustado para cuerpo completo:
              - rotationIntensity 0.04 (muy bajo) → el robot no se bambolea
              - floatIntensity 0.30 → levitación suave
              - speed 0.9 → ligeramente más lento, más solemne
          */}
          <Float speed={0.9} rotationIntensity={0.04} floatIntensity={0.30}>
            {/*
              El modelo ORBIT en Blender tiene su base en z=0 y la cabeza
              en z≈2.2. En Three.js el eje Y es vertical, así que el GLB
              exportado puede necesitar rotación -90° en X o ajuste de posición.
              Prueba position={[0, -1.1, 0]} para centrar verticalmente.
            */}
            <OrbitRobot position={[0, -1.1, 0]} scale={0.95} />
          </Float>

          {/* ── Environment IBL ─────────────────────────────────────────────
              4 Lightformers: techo suave + rims cyan laterales + base LED.
              Intensidades moderadas — el GlossyBlack no debe verse plateado. */}
          <Environment resolution={256}>
            <color attach="background" args={["#03050a"]} />

            {/* Luz de techo — ilumina la parte superior del casco */}
            <Lightformer
              intensity={1.2}
              color="#b0c8d8"
              position={[0, 5, 1]}
              scale={[8, 2, 1]}
            />

            {/* Rim izquierda — perfila el borde izquierdo del casco y oreja */}
            <Lightformer
              intensity={1.1}
              color="#00d8ff"
              position={[-6, 0.5, 2]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[3, 6, 1]}
            />

            {/* Rim derecha — simétrico */}
            <Lightformer
              intensity={1.1}
              color="#0090ff"
              position={[6, 0.5, 2]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[3, 6, 1]}
            />

            {/* Luz de base — el anillo LED emite y se refleja en el suelo */}
            <Lightformer
              intensity={0.8}
              color="#00c8ff"
              position={[0, -4, 1.5]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[5, 3, 1]}
            />
          </Environment>
        </Suspense>

        {/*
          ContactShadows alineada con la base del ORBIT (y=-1.80).
          La base del robot llega hasta y≈-1.80 con position={[0,-1.1,0]}.
        */}
        <ContactShadows
          position={[0, -1.80, 0]}
          opacity={0.60}
          scale={8}
          blur={3.5}
          far={4.0}
          color="#000810"
        />

        {/* ── Post-processing ──────────────────────────────────────────────
            Bloom threshold 0.72 → los LEDs cyan (emissiveIntensity=7, toneMapped=false)
            generan glow fuerte sin quemar el casco negro.
            Vignette 0.92 → enfoca el robot en el centro oscuro. */}
        <EffectComposer disableNormalPass>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.15}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.20} darkness={0.92} />
        </EffectComposer>
      </Canvas>

      {/* ── Copy HTML encima del canvas ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "8vw",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            color: "#eaf6ff",
            font: "700 clamp(32px, 6vw, 72px)/1.04 system-ui, sans-serif",
            letterSpacing: "-0.02em",
            margin: 0,
            maxWidth: "16ch",
          }}
        >
          Software, reimagined by intelligence.
        </h1>
        <p
          style={{
            color: "#5a8090",
            font: "400 clamp(15px, 1.6vw, 20px)/1.55 system-ui, sans-serif",
            marginTop: "1.2rem",
            maxWidth: "42ch",
          }}
        >
          We design and ship premium digital products for ambitious teams.
        </p>
      </div>
    </div>
  );
}
