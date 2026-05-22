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
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const MODEL_URL = "/robot.glb";

function Loader() {
  return (
    <Html center>
      <div style={{ color: "#7fe9ff", font: "500 14px system-ui", letterSpacing: ".08em" }}>
        LOADING…
      </div>
    </Html>
  );
}

type RobotHeadProps = {
  position?: [number, number, number];
  scale?: number | [number, number, number];
};

function RobotHead(props: RobotHeadProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const { pointer } = useThree();

  const model = useMemo(() => scene.clone(true), [scene]);
  const eyeRig = useMemo(() => model.getObjectByName("Eye_Rig") ?? null, [model]);

  const baseRot = useRef(new THREE.Euler());
  useEffect(() => {
    if (eyeRig) baseRot.current.copy(eyeRig.rotation);
  }, [eyeRig]);

  // Play ALL baked clips (root float/breathing + eye blink)
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => {
      if (a) a.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    });
  }, [actions]);

  useEffect(() => {
    model.traverse((o: THREE.Object3D) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const mesh = o as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial & {
          transmission?: number;
          clearcoat?: number;
          clearcoatRoughness?: number;
        };
        if (!m?.isMeshStandardMaterial) return;
        const name = (m.name ?? "").toLowerCase();

        // Visor: flat matte black — zero reflections, no mirror effect
        if (name.includes("visor")) {
          m.transmission = 0;
          m.metalness = 0.0;
          m.roughness = 0.92;
          m.envMapIntensity = 0.0;
          m.clearcoat = 0.0;
          m.clearcoatRoughness = 0.0;
        } else if (name.includes("brushedmetal")) {
          // Dark satin titanium — controlled reflections, not chrome
          m.envMapIntensity = 0.45;
          m.roughness = Math.max(m.roughness ?? 0.4, 0.42);
          m.metalness = Math.min(m.metalness ?? 0.72, 0.72);
        } else if (name.includes("panel")) {
          m.envMapIntensity = 0.3;
          m.roughness = Math.max(m.roughness ?? 0.5, 0.50);
        } else if (name.includes("eye")) {
          // toneMapped=false is critical so bloom captures the cyan glow
          m.emissive = new THREE.Color(0x00d8ff);
          m.emissiveIntensity = 6.0;
          m.toneMapped = false;
          m.envMapIntensity = 0.0;
        } else if (name.includes("holo")) {
          m.emissiveIntensity = 0.0;
          m.visible = false;
        } else {
          if (m.envMapIntensity == null) m.envMapIntensity = 0.5;
        }
        m.needsUpdate = true;
      });
    });
  }, [model]);

  useFrame((_: unknown, delta: number) => {
    if (eyeRig) {
      eyeRig.rotation.y = THREE.MathUtils.damp(
        eyeRig.rotation.y,
        baseRot.current.y + pointer.x * 0.35,
        6,
        delta
      );
      eyeRig.rotation.x = THREE.MathUtils.damp(
        eyeRig.rotation.x,
        baseRot.current.x - pointer.y * 0.22,
        6,
        delta
      );
    }
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        pointer.x * 0.18,
        4,
        delta
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -pointer.y * 0.10,
        4,
        delta
      );
    }
  });

  return (
    <group ref={group} {...props}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function HeroScene() {
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
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 5.2], fov: 36, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <ambientLight intensity={0.18} />
        <spotLight
          position={[2.5, 4, 4]}
          angle={0.6}
          penumbra={1}
          intensity={40}
          color="#c8d8e8"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <pointLight position={[-3, 0.5, 2]} intensity={18} color="#23c9ff" />
        <pointLight position={[3, 0.5, 2]} intensity={18} color="#23c9ff" />

        <Suspense fallback={<Loader />}>
          <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
            <RobotHead position={[0, 0.1, 0]} scale={0.88} />
          </Float>

          {/* Controlled environment — white top + cyan sides, no random color bleed */}
          <Environment resolution={256}>
            <color attach="background" args={["#05070b"]} />
            <Lightformer intensity={1.4} color="#d0dce8" position={[0, 3, 2]} scale={[5, 2, 1]} />
            <Lightformer
              intensity={1.2}
              color="#2fd2ff"
              position={[-4, 0, 2]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[3, 4, 1]}
            />
            <Lightformer
              intensity={1.2}
              color="#2f9bff"
              position={[4, 0, 2]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[3, 4, 1]}
            />
          </Environment>
        </Suspense>


        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.15}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.35} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
