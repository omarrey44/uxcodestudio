"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

function Placeholder() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
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
        <ambientLight intensity={0.08} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={4} color="#00d4ff" />
        <pointLight position={[2.5, -1, -2]} intensity={3} color="#8b5cf6" />
        <Placeholder />
      </Suspense>
    </Canvas>
  );
}
