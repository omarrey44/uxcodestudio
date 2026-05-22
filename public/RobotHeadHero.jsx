/**
 * RobotHeadHero.jsx
 * ---------------------------------------------------------------------------
 * Hero interactivo para una agencia de software premium.
 * Carga el modelo robot_head.glb (exportado desde Blender) y añade:
 *   - eye tracking: los ojos siguen el cursor (rotando el nodo "Eye_Rig")
 *   - reproducción del clip "Idle" horneado (floating + breathing + blink)
 *   - parallax sutil de la cabeza con el puntero
 *   - iluminación dark futurista + bloom para el glow cyan
 *
 * DEPENDENCIAS
 *   npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
 *
 * Coloca robot_head.glb en /public  (se carga desde "/robot_head.glb").
 * ---------------------------------------------------------------------------
 * v3.6 — Materiales optimizados para eliminar:
 *   - Punto blanco de reflejo especular en el visor
 *   - Efecto cromado/plateado en el casco (ahora es titanio oscuro satinado)
 *   - Ojos diminutos (ahora son cápsulas LED anchas y brillantes)
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

const MODEL_URL = "/robot.glb";

/* ------------------------------------------------------------------ */
/* Modelo + comportamiento                                            */
/* ------------------------------------------------------------------ */
function RobotHead(props) {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const { pointer } = useThree();

  // Clona la escena para poder reutilizar el componente varias veces.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Localiza nodos clave por nombre.
  const eyeRig = useMemo(() => model.getObjectByName("Eye_Rig"), [model]);

  // Rotación base del rig de ojos (para volver al centro suavemente).
  const baseRot = useRef(new THREE.Euler());
  useEffect(() => {
    if (eyeRig) baseRot.current.copy(eyeRig.rotation);
  }, [eyeRig]);

  // Reproduce TODOS los clips horneados (flotación/breathing del root + blink de los ojos).
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => {
      if (a) a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    });
  }, [actions]);

  // ─── Mejora visual de materiales tras la carga ───────────────────
  // El glTF ya trae los valores optimizados desde Blender v3.6,
  // pero hacemos overrides finales para el contexto específico de
  // Three.js + React Three Fiber + nuestro Environment/Lightformers.
  useEffect(() => {
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const m = o.material;
      if (!m) return;

      // ── VISOR: negro profundo mate-satinado ──
      // CLAVE: clearcoat = 0, envMapIntensity bajo.
      // Esto elimina el punto blanco de reflejo de ventana/IBL.
      if (m.name && m.name.includes("Visor")) {
        m.transmission = 0;
        m.metalness = 0.08;
        m.roughness = 0.18;
        m.envMapIntensity = 0.35;     // Muy bajo: el visor es negro, no un espejo
        m.clearcoat = 0.0;            // CERO: elimina el punto blanco reflejado
        m.clearcoatRoughness = 0.0;
      }

      // ── METAL DEL CASCO: titanio oscuro satinado ──
      // envMapIntensity controlado para que no se convierta en cromo.
      if (m.name && m.name.includes("BrushedMetal")) {
        m.envMapIntensity = 0.45;     // Reflejos sutiles, no cromado
        m.roughness = Math.max(m.roughness ?? 0.4, 0.42);
        m.metalness = Math.min(m.metalness ?? 0.72, 0.72);
      }

      // ── PANEL ACCENT: acento oscuro mate ──
      if (m.name && m.name.includes("Panel")) {
        m.envMapIntensity = 0.3;
        m.roughness = Math.max(m.roughness ?? 0.5, 0.50);
      }

      // ── OJOS: emisión cyan ultra intensa ──
      // toneMapped=false es CRÍTICO para que el bloom los agarre
      // y genere el halo de neón soberbio.
      if (m.name && m.name.includes("Eye")) {
        m.emissive = new THREE.Color(0x00d8ff);
        m.emissiveIntensity = 6.0;
        m.toneMapped = false;         // Bypass del tonemapper para brillo puro
        m.envMapIntensity = 0.0;      // Los ojos brillan por sí solos, no reflejan entorno
      }

      // ── HOLO: anillo de base cyan ──
      if (m.name && m.name.includes("Holo")) {
        m.emissive = new THREE.Color(0x00d8ff);
        m.emissiveIntensity = 4.0;
        m.toneMapped = false;
        m.envMapIntensity = 0.0;
      }

      // Default para cualquier otro material
      if (
        m.isMeshStandardMaterial &&
        m.envMapIntensity == null &&
        !m.name?.includes("Eye") &&
        !m.name?.includes("Holo")
      ) {
        m.envMapIntensity = 0.5;
      }
    });
  }, [model]);

  const target = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const px = pointer.x; // -1..1
    const py = pointer.y; // -1..1

    // Eye tracking: rota Eye_Rig hacia el cursor.
    if (eyeRig) {
      const maxYaw = 0.35;   // rad
      const maxPitch = 0.22; // rad
      const targetYaw = baseRot.current.y + px * maxYaw;
      const targetPitch = baseRot.current.x - py * maxPitch;
      eyeRig.rotation.y = THREE.MathUtils.damp(eyeRig.rotation.y, targetYaw, 6, delta);
      eyeRig.rotation.x = THREE.MathUtils.damp(eyeRig.rotation.x, targetPitch, 6, delta);
    }

    // Parallax sutil de toda la cabeza (se suma al floating horneado).
    if (group.current) {
      const ty = px * 0.18;
      const tx = -py * 0.10;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ty, 4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tx, 4, delta);
    }
  });

  return (
    <group ref={group} {...props}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

/* ------------------------------------------------------------------ */
/* Escena                                                             */
/* ------------------------------------------------------------------ */
function Loader() {
  return (
    <Html center>
      <div style={{ color: "#7fe9ff", font: "500 14px system-ui", letterSpacing: ".08em" }}>
        LOADING…
      </div>
    </Html>
  );
}

export default function RobotHeadHero() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background:
          "radial-gradient(120% 120% at 50% 30%, #0b1118 0%, #05070b 60%, #020305 100%)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.25, 3.4], fov: 38, near: 0.1, far: 50 }}
      >
        {/* ── Iluminación dark futurista ──
            Spotlight reducido para evitar el punto blanco en el visor.
            Point lights cyan simétricas para el rim glow lateral. */}
        <ambientLight intensity={0.18} />
        <spotLight
          position={[2.5, 4, 4]}
          angle={0.6}
          penumbra={1}
          intensity={40}
          color="#c8d8e8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 0.5, 2]} intensity={18} color="#23c9ff" />
        <pointLight position={[3, 0.5, 2]} intensity={18} color="#23c9ff" />

        <Suspense fallback={<Loader />}>
          <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
            <RobotHead position={[0, -0.15, 0]} scale={1.0} />
          </Float>

          {/* ── Environment CONTROLADO ──
              Lightformers con intensidad moderada para iluminar la forma
              del casco sin crear ventanas blancas gigantes reflejadas.
              La clave es mantener intensidades bajas (< 2.0). */}
          <Environment resolution={256}>
            <color attach="background" args={["#05070b"]} />
            {/* Luz superior suave — revela la coronilla del casco */}
            <Lightformer
              intensity={1.4}
              color="#d0dce8"
              position={[0, 3, 2]}
              scale={[5, 2, 1]}
            />
            {/* Rim cyan izquierda — perfila el borde metálico */}
            <Lightformer
              intensity={1.2}
              color="#2fd2ff"
              position={[-4, 0, 2]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[3, 4, 1]}
            />
            {/* Rim cyan derecha — simétrico */}
            <Lightformer
              intensity={1.2}
              color="#2f9bff"
              position={[4, 0, 2]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[3, 4, 1]}
            />
          </Environment>
        </Suspense>

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.5}
          scale={6}
          blur={2.6}
          far={3}
          color="#000000"
        />

        {/* ── Post-processing ──
            Bloom: threshold ajustado para que SOLO los ojos y el holo ring
            generen glow (no el reflejo blanco del casco).
            Viñeta cinematográfica para enfocar la atención en el robot. */}
        <EffectComposer disableNormalPass>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.15}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>

      {/* Capa de copy del hero (HTML normal encima del canvas) */}
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
            color: "#8aa0b3",
            font: "400 clamp(15px,1.6vw,20px)/1.5 system-ui, sans-serif",
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
