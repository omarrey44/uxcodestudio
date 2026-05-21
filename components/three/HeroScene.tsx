"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

function VisorPanel() {
  const visorGeo = useMemo(() => new THREE.BoxGeometry(1.05, 0.85, 0.04), []);
  const visorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#020508",
        metalness: 0.0,
        roughness: 0.0,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );
  useEffect(() => () => { visorGeo.dispose(); visorMat.dispose(); }, []);

  return (
    <mesh geometry={visorGeo} position={[0, 0.05, 0.50]}>
      <primitive object={visorMat} attach="material" />
    </mesh>
  );
}

const BROW_STRIPS: { position: [number, number, number]; rotZ: number }[] = [
  { position: [-0.18, 0.38, 0.525], rotZ:  0.28 },
  { position: [-0.34, 0.35, 0.525], rotZ:  0.22 },
  { position: [ 0.18, 0.38, 0.525], rotZ: -0.28 },
  { position: [ 0.34, 0.35, 0.525], rotZ: -0.22 },
];

function BrowAccents() {
  const browMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.45 }),
    []
  );
  useEffect(() => () => { browMat.dispose(); }, []);

  return (
    <>
      {BROW_STRIPS.map(({ position, rotZ }, i) => (
        <mesh key={i} position={position} rotation={[0, 0, rotZ]}>
          <boxGeometry args={[0.28, 0.016, 0.005]} />
          <primitive object={browMat} attach="material" />
        </mesh>
      ))}
    </>
  );
}

function EyeSlit({ position }: { position: [number, number, number] }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  // Imperative material — opacity is mutated in useFrame for LED pulse
  const innerCoreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00eeff", transparent: true, opacity: 1.0 }),
    []
  );
  useEffect(() => () => { innerCoreMat.dispose(); }, []);

  // Blink state
  const blinkTimer = useRef(3 + Math.random() * 5);
  const blinkScale = useRef(1.0);
  const blinkClosing = useRef(false);

  // Squint state
  const squintTimer = useRef(12 + Math.random() * 8);
  const squintActive = useRef(false);
  const squintHoldTimer = useRef(0);

  useFrame(({ mouse, clock }: { mouse: THREE.Vector2; clock: THREE.Clock }, delta: number) => {
    // --- Pupil tracking ---
    if (pupilRef.current) {
      const targetX = THREE.MathUtils.clamp(mouse.x * 0.12, -0.12, 0.12);
      pupilRef.current.position.x = THREE.MathUtils.lerp(
        pupilRef.current.position.x,
        targetX,
        0.10
      );
    }

    // --- Blink ---
    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0) {
      blinkTimer.current = 3 + Math.random() * 5;
      blinkClosing.current = true;
    }
    if (blinkClosing.current) {
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 0.05, 0.20);
      if (blinkScale.current < 0.08) blinkClosing.current = false;
    } else {
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 1.0, 0.14);
    }
    if (outerRef.current) outerRef.current.scale.y = blinkScale.current;
    if (innerRef.current) innerRef.current.scale.y = blinkScale.current;

    // --- Squint (blink takes priority) ---
    squintTimer.current -= delta;
    if (squintTimer.current <= 0 && !squintActive.current) {
      squintActive.current = true;
      squintHoldTimer.current = 1.5;
      squintTimer.current = 12 + Math.random() * 8;
    }
    if (squintActive.current && !blinkClosing.current) {
      squintHoldTimer.current -= delta;
      const target = squintHoldTimer.current > 0 ? 0.35 : 1.0;
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, target, 0.12);
      if (squintHoldTimer.current <= 0 && blinkScale.current > 0.92) {
        squintActive.current = false;
      }
    }

    // --- LED pulse ---
    if (innerRef.current) {
      (innerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.85 + Math.sin(clock.getElapsedTime() * 3.14) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Outer slit */}
      <mesh ref={outerRef}>
        <boxGeometry args={[0.38, 0.048, 0.006]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.65} />
      </mesh>
      {/* Inner core — uses imperative mat for opacity mutation */}
      <mesh ref={innerRef} position={[0, 0, 0.001]}>
        <boxGeometry args={[0.22, 0.026, 0.005]} />
        <primitive object={innerCoreMat} attach="material" />
      </mesh>
      {/* Pupil dot — slides on X axis */}
      <mesh ref={pupilRef} position={[0, 0, 0.002]}>
        <boxGeometry args={[0.07, 0.018, 0.004]} />
        <meshBasicMaterial color="#c0ffff" />
      </mesh>
      {/* Glow */}
      <pointLight color="#00d4ff" intensity={2.0} distance={1.2} position={[0, 0, 0.06]} />
    </group>
  );
}

function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <HexPrismBody />
        <VisorPanel />
        <BrowAccents />
      </group>
      {/* Eyes outside scale group — preserves exact box proportions */}
      <EyeSlit position={[-0.26, 0.20, 0.52]} />
      <EyeSlit position={[ 0.26, 0.20, 0.52]} />
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
