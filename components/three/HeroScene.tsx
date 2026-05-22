"use client";
//test
import { Suspense, useRef, useMemo, useEffect } from "react";
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

  useEffect(() => {
    const first = actions && Object.values(actions)[0];
    if (first) first.reset().setLoop(THREE.LoopRepeat, Infinity).play();
  }, [actions]);

  useEffect(() => {
    model.traverse((o: THREE.Object3D) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const mesh = o as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;
        if (!m?.isMeshStandardMaterial) return;
        const name = m.name?.toLowerCase() ?? "";
        if (name.includes("eye") || name.includes("led") || name.includes("emit")) {
          m.emissive = new THREE.Color(0x00d8ff);
          m.emissiveIntensity = 5.0;
          m.toneMapped = false;
        } else {
          // Force helmet body materials to be readable under light
          m.roughness = Math.max(m.roughness, 0.35);
          m.metalness = Math.min(m.metalness, 0.75);
          m.envMapIntensity = 0.4;
          m.needsUpdate = true;
        }
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
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5.2], fov: 36, near: 0.1, far: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      {/* Ambient — base fill so dark surfaces aren't pure black */}
      <ambientLight intensity={0.45} />
      {/* Key light — top-right front, reveals helmet geometry */}
      <spotLight
        position={[2, 5, 4]}
        angle={0.45}
        penumbra={0.8}
        intensity={180}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Front fill — soft white from camera direction to show detail */}
      <pointLight position={[0, 1, 5]} intensity={60} color="#e0eeff" />
      {/* Left cyan rim — edge highlight on helmet */}
      <pointLight position={[-4, 2, 1]} intensity={80} color="#1fbfff" />
      {/* Right violet rim — opposite edge */}
      <pointLight position={[4, 1, 1]} intensity={50} color="#7c3aed" />
      {/* Top down — defines the crown of the helmet */}
      <pointLight position={[0, 6, 2]} intensity={40} color="#ffffff" />

      <Suspense fallback={<Loader />}>
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
          <RobotHead position={[0, 0.35, 0]} scale={0.82} />
        </Float>
        <Environment preset="city" environmentIntensity={0.8} />
      </Suspense>

      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.5}
        scale={6}
        blur={2.6}
        far={3}
        color="#000000"
      />

      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.25}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
