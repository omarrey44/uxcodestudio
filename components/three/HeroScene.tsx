"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Text, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const MAX_NODES = 80;
const MAX_LINES = 200;
const CONNECTION_DIST = 2.8;

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

function NetworkMesh() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { nodes, pointsGeo, linesGeo } = useMemo(() => {
    const nodes: Array<{ pos: [number, number, number]; vel: [number, number, number] }> = [];
    for (let i = 0; i < MAX_NODES; i++) {
      const r = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodes.push({
        pos: [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)],
        vel: [(Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004],
      });
    }
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
    for (let i = 0; i < MAX_NODES; i++) {
      const n = nodes[i];
      for (let axis = 0; axis < 3; axis++) {
        n.pos[axis] += n.vel[axis];
        if (Math.abs(n.pos[axis]) > 8) n.vel[axis] *= -1;
        (pAttr.array as Float32Array)[i * 3 + axis] = n.pos[axis];
      }
    }
    let lineCount = 0;
    outer: for (let i = 0; i < MAX_NODES; i++) {
      for (let j = i + 1; j < MAX_NODES; j++) {
        if (lineCount >= MAX_LINES) break outer;
        const dx = nodes[i].pos[0] - nodes[j].pos[0];
        const dy = nodes[i].pos[1] - nodes[j].pos[1];
        const dz = nodes[i].pos[2] - nodes[j].pos[2];
        if (dx * dx + dy * dy + dz * dz < CONNECTION_DIST * CONNECTION_DIST) {
          const b = lineCount * 6;
          lArr[b] = nodes[i].pos[0]; lArr[b + 1] = nodes[i].pos[1]; lArr[b + 2] = nodes[i].pos[2];
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
          <NetworkMesh />
        </SceneGroup>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
