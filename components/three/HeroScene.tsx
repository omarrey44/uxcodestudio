"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SkullWireframe({ geo }: { geo: THREE.IcosahedronGeometry }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", transparent: true, opacity: 0.4 }),
    []
  );
  useEffect(() => () => { edges.dispose(); mat.dispose(); }, [edges, mat]);
  return (
    <lineSegments geometry={edges}>
      <primitive object={mat} attach="material" />
    </lineSegments>
  );
}

function SkullFill({ geo }: { geo: THREE.IcosahedronGeometry }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
            vViewDir = normalize(-worldPos.xyz);
            gl_Position = projectionMatrix * worldPos;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
            vec3 col = mix(vec3(0.0, 0.83, 1.0), vec3(0.31, 0.22, 0.96), 1.0 - fresnel);
            gl_FragColor = vec4(col, fresnel * 0.55);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    []
  );
  useEffect(() => () => { mat.dispose(); }, [mat]);
  return (
    <mesh geometry={geo}>
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function EyeAssembly({ position }: { position: [number, number, number] }) {
  const pivotRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Blink state
  const blinkTimer = useRef(3 + Math.random() * 5);
  const blinkScale = useRef(1.0);
  const blinkClosing = useRef(false);

  useFrame(({ mouse }, delta) => {
    if (!pivotRef.current) return;

    // Cursor tracking: map mouse NDC (-1..1) to eye rotation (±0.35 rad = ±20°)
    const targetRotX = Math.max(-0.35, Math.min(0.35, -mouse.y * 0.5));
    const targetRotY = Math.max(-0.35, Math.min(0.35,  mouse.x * 0.5));
    pivotRef.current.rotation.x = THREE.MathUtils.lerp(pivotRef.current.rotation.x, targetRotX, 0.08);
    pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, targetRotY, 0.08);

    // Blinking
    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0) {
      blinkTimer.current = 3 + Math.random() * 5;
      blinkClosing.current = true;
    }
    if (blinkClosing.current) {
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 0.08, 0.18);
      if (blinkScale.current < 0.1) blinkClosing.current = false;
    } else {
      blinkScale.current = THREE.MathUtils.lerp(blinkScale.current, 1.0, 0.12);
    }
    if (irisRef.current)  irisRef.current.scale.y  = blinkScale.current;
    if (outerRef.current) outerRef.current.scale.y = blinkScale.current;
  });

  return (
    <group ref={pivotRef} position={position}>
      {/* Outer glow ring */}
      <mesh ref={outerRef}>
        <circleGeometry args={[0.13, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} />
      </mesh>
      {/* Iris */}
      <mesh ref={irisRef} position={[0, 0, 0.001]}>
        <circleGeometry args={[0.095, 32]} />
        <meshBasicMaterial color="#4f6ef7" transparent opacity={0.9} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[0.04, 32]} />
        <meshBasicMaterial color="#010a20" />
      </mesh>
      {/* Glow point light */}
      <pointLight color="#00d4ff" intensity={1.5} distance={1.5} position={[0, 0, 0.05]} />
    </group>
  );
}

function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const skullGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 2), []);
  useEffect(() => () => { skullGeo.dispose(); }, [skullGeo]);

  useFrame(({ mouse, clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Breathing: gentle y-float + subtle Z-axis sway
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.8) * 0.04;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.012;
    // Mouse tilt: ±12° yaw, ±8° pitch
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.21,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.y * 0.14,
      0.06
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group scale={[0.92, 1.35, 0.88]}>
        <SkullWireframe geo={skullGeo} />
        <SkullFill geo={skullGeo} />
      </group>
      {/* Eyes outside scale group — preserves circular shape */}
      <EyeAssembly position={[-0.30, 0.16, 0.81]} />
      <EyeAssembly position={[ 0.30, 0.16, 0.81]} />
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
        <ambientLight intensity={0.08} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={4} color="#00d4ff" />
        <pointLight position={[2.5, -1, -2]} intensity={3} color="#8b5cf6" />
        <HeadGroup />
      </Suspense>
    </Canvas>
  );
}
