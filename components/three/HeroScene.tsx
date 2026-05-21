"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

function HexPrismBody() {
  const prismGeo = useMemo(() => new THREE.CylinderGeometry(0.75, 0.68, 1.5, 6), []);
  const prismEdgesGeo = useMemo(() => new THREE.EdgesGeometry(prismGeo), [prismGeo]);
  const crownGeo = useMemo(() => new THREE.SphereGeometry(0.72, 6, 4), []);
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#080b10", metalness: 0.92, roughness: 0.18 }),
    []
  );
  const prismEdgesMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.30 }),
    []
  );

  useEffect(() => () => {
    prismGeo.dispose(); prismEdgesGeo.dispose(); crownGeo.dispose();
    bodyMat.dispose(); prismEdgesMat.dispose();
  }, []);

  return (
    <>
      <mesh geometry={prismGeo}>
        <primitive object={bodyMat} attach="material" />
      </mesh>
      <lineSegments geometry={prismEdgesGeo}>
        <primitive object={prismEdgesMat} attach="material" />
      </lineSegments>
      <mesh geometry={crownGeo} position={[0, 0.75, 0]} scale={[1, 0.4, 1]}>
        <primitive object={bodyMat} attach="material" />
      </mesh>
    </>
  );
}

function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
      </group>
    </group>
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
        <ambientLight intensity={0.06} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={5}   color="#00d4ff" />
        <pointLight position={[ 2.5, -1,  -2]} intensity={3.5} color="#8b5cf6" />
        <pointLight position={[  0,   2,   3]} intensity={0.8} color="#ffffff" />
        <HeadGroup />
      </Suspense>
    </Canvas>
  );
}
