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
 */
import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  Environment,
  ContactShadows,
  Float,
  Html,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const MODEL_URL = "/robot_head.glb";

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

  // Reproduce el clip Idle horneado (si existe).
  useEffect(() => {
    const first = actions && Object.values(actions)[0];
    if (first) {
      first.reset().setLoop(THREE.LoopRepeat, Infinity).play();
      first.timeScale = 1.0;
    }
  }, [actions]);

  // Mejora visual de materiales tras la carga.
  useEffect(() => {
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const m = o.material;
      if (!m) return;
      // Refuerza el visor como vidrio negro reflectante.
      if (m.name && m.name.includes("Visor")) {
        m.transmission = Math.max(m.transmission ?? 0, 0.5);
        m.thickness = 0.4;
        m.roughness = 0.04;
        m.envMapIntensity = 1.4;
        m.clearcoat = 1.0;
        m.clearcoatRoughness = 0.03;
      }
      // Refuerza la emisión cyan de los LEDs.
      if (m.name && m.name.includes("Eye")) {
        m.emissive = new THREE.Color(0x00d8ff);
        m.emissiveIntensity = 4.0;
        m.toneMapped = false;
      }
      if (m.isMeshStandardMaterial) m.envMapIntensity = m.envMapIntensity ?? 1.0;
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
        {/* Iluminación dark futurista */}
        <ambientLight intensity={0.15} />
        <spotLight
          position={[3, 4, 3]}
          angle={0.5}
          penumbra={1}
          intensity={120}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 1, 2]} intensity={40} color="#1fbfff" />
        <pointLight position={[0, -1.5, 2.5]} intensity={12} color="#3a6cff" />

        <Suspense fallback={<Loader />}>
          <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
            <RobotHead position={[0, -0.15, 0]} scale={1.0} />
          </Float>
          <Environment preset="night" environmentIntensity={0.6} />
        </Suspense>

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.5}
          scale={6}
          blur={2.6}
          far={3}
          color="#000000"
        />

        {/* Post: bloom para el glow cyan + viñeta cinematográfica */}
        <EffectComposer disableNormalPass>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.25}
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
