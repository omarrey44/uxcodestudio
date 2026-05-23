"use client";

import { Suspense, useRef, useMemo, useEffect, useState } from "react";
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

function Loader() {
  return (
    <Html center>
      <div style={{ color: "#00d8ff", font: "500 13px 'SF Mono', monospace", letterSpacing: ".12em", opacity: 0.8 }}>
        ORBIT INITIALIZING…
      </div>
    </Html>
  );
}

type OrbitRobotProps = {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  ledColor?: string;
  uxOn?: boolean;
};

function OrbitRobot({ ledColor = "#00d8ff", uxOn = false, ...props }: OrbitRobotProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const { pointer } = useThree();
  const ledMats = useRef<THREE.MeshStandardMaterial[]>([]);

  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => {
      if (a) a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    });
  }, [actions]);

  useEffect(() => {
    ledMats.current = [];
    model.traverse((o: THREE.Object3D) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const mesh = o as THREE.Mesh;
      const m = mesh.material as THREE.MeshStandardMaterial & {
        clearcoat?: number;
      };
      if (!m) return;

      const name = (m.name ?? "").toLowerCase();

      // GlossyBlack — dark titanium
      if (name.includes("glossy") || name.includes("gloss")) {
        m.color           = new THREE.Color(0x10121e);
        m.metalness       = 0.85;
        m.roughness       = 0.28;
        m.envMapIntensity = 0.40;
        m.needsUpdate     = true;
      }

      // VisorBlack — match GlossyBlack style, darker to read as visor
      if (name.includes("visor")) {
        m.color           = new THREE.Color(0x020305);
        m.metalness       = 0.85;
        m.roughness       = 0.28;
        m.envMapIntensity = 0.40;
        m.needsUpdate     = true;
      }

      // CyanLED — glowing eyes/rings
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

      // Catch-all: any near-white non-LED material → force dark
      if (!name.includes("cyan") && !name.includes("led") && !name.includes("eye")) {
        const col = m.color as THREE.Color | undefined;
        if (col && col.r > 0.7 && col.g > 0.7 && col.b > 0.7) {
          m.color = new THREE.Color(0x05050f);
          m.needsUpdate = true;
        }
      }
    });
  }, [model]);

  useEffect(() => {
    const col = new THREE.Color(ledColor);
    ledMats.current.forEach((m) => {
      m.emissive = col;
      m.needsUpdate = true;
    });
  }, [ledColor]);

  useFrame((state, delta) => {
    const clock = state.clock;
    if (!group.current) return;

    // Parallax
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y, pointer.x * 0.32, 4, delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x, -pointer.y * 0.18, 4, delta
    );

    // Fake LED blink: fast dip every ~4s
    const t = clock.getElapsedTime();
    const blinkCycle = t % 4.0;
    const isBlink = blinkCycle > 3.85;
    const intensity = isBlink ? 0.0 : 10.0;
    ledMats.current.forEach((m) => { m.emissiveIntensity = intensity; });

  });

  return (
    <group ref={group} {...props}>
      <primitive object={model} />

      {/* UX text — toggles via switch in HeroScene wrapper */}
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

export default function HeroScene({ eyeColor = "#00d4ff", uxOn = false }: { eyeColor?: string; uxOn?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

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

        {/* Fill light frontal suave — evita que el cuerpo sea puro negro */}
        <pointLight position={[0, 1.5, 4.5]} intensity={30} color="#7ab8d8" />

        {/* Rim lights cyan — silueta lateral del robot */}
        <pointLight position={[-4.0, 1.0, 1.5]} intensity={22} color="#00c8ff" />
        <pointLight position={[ 4.0, 1.0, 1.5]} intensity={22} color="#00c8ff" />

        {/* Base LED glow — ilumina plataforma hacia arriba */}
        <pointLight position={[0, -2.0, 1.8]} intensity={35} color="#00aaff" />

        <Suspense fallback={<Loader />}>
          <Float speed={0.9} rotationIntensity={0.04} floatIntensity={0.30}>
            <OrbitRobot position={[0, -1.1, 0]} scale={1.18} ledColor={eyeColor} uxOn={uxOn} />
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
