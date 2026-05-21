"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function FloatingOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      mouse.x * 0.4,
      0.05
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      mouse.y * 0.3,
      0.05
    );
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.55, 6]} />
        <MeshDistortMaterial
          color="#4f6ef7"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          distort={0.45}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

function GlowRing({ radius = 2.4, color = "#8b5cf6", speed = 0.4, tilt = 0.6 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * speed;
    ref.current.rotation.x = tilt;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.012, 16, 200]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { positions, count } = useMemo(() => {
    const c = 600;
    const arr = new Float32Array(c * 3);
    for (let i = 0; i < c; i++) {
      const r = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions: arr, count: c };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#00d4ff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4f6ef7" />
        <pointLight position={[-5, -3, -5]} intensity={1} color="#8b5cf6" />
        <FloatingOrb />
        <GlowRing radius={2.2} color="#00d4ff" speed={0.3} tilt={0.4} />
        <GlowRing radius={2.7} color="#8b5cf6" speed={-0.25} tilt={1.1} />
        <GlowRing radius={3.1} color="#4f6ef7" speed={0.18} tilt={-0.4} />
        <ParticleField />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
