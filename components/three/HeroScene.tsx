"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Text, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Whole-scene parallax group (mouse tilt)
function SceneGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.15, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.1, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

// Central distorted sphere
const CoreOrb = React.memo(function CoreOrb() {
  return (
    <Float speed={1.0} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh>
        <sphereGeometry args={[0.7, 64, 64]} />
        <MeshDistortMaterial
          color="#4f6ef7"
          emissive="#2a45d4"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
});

// Single code token orbiting on a ring
const OrbitToken = React.memo(function OrbitToken({
  token,
  radius,
  angle,
  color,
  ringSpeed,
  tiltX,
}: {
  token: string;
  radius: number;
  angle: number;
  color: string;
  ringSpeed: number;
  tiltX: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const startAngle = useRef(angle);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const currentAngle = startAngle.current + t * ringSpeed;
    groupRef.current.position.x = Math.cos(currentAngle) * radius;
    groupRef.current.position.z = Math.sin(currentAngle) * radius * Math.cos(tiltX);
    groupRef.current.position.y = Math.sin(currentAngle) * radius * Math.sin(tiltX);
  });

  return (
    <group ref={groupRef}>
      <Text
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {token}
      </Text>
      <pointLight color={color} intensity={0.4} distance={1.2} />
    </group>
  );
});

// Three orbital rings with code tokens
const RINGS = [
  {
    radius: 1.6,
    speed: 0.7,
    tiltX: 0.26,
    color: "#4f6ef7",
    tokens: ["{ }", "( )", "[ ]"],
  },
  {
    radius: 2.3,
    speed: 0.45,
    tiltX: 0.87,
    color: "#00d4ff",
    tokens: ["</>", "=>", "&&"],
  },
  {
    radius: 3.0,
    speed: 0.28,
    tiltX: -0.52,
    color: "#8b5cf6",
    tokens: ["const", "async", "type"],
  },
];

function OrbitalSystem() {
  return (
    <>
      {RINGS.map((ring) =>
        ring.tokens.map((token, i) => (
          <OrbitToken
            key={`${ring.color}-${token}`}
            token={token}
            radius={ring.radius}
            angle={(i / ring.tokens.length) * Math.PI * 2}
            color={ring.color}
            ringSpeed={ring.speed}
            tiltX={ring.tiltX}
          />
        ))
      )}
    </>
  );
}

// Sparse particle field
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 60;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial size={0.022} color="#00d4ff" transparent opacity={0.6} sizeAttenuation />
    </Points>
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
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={1.0} color="#4f6ef7" />
        <pointLight position={[-4, -2, -4]} intensity={0.8} color="#8b5cf6" />
        <SceneGroup>
          <CoreOrb />
          <OrbitalSystem />
          <ParticleField />
        </SceneGroup>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
