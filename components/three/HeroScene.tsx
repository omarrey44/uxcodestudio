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

function HeadGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const skullGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 2), []);
  useEffect(() => () => { skullGeo.dispose(); }, [skullGeo]);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Skull geometry — scaled to head proportions */}
      <group scale={[0.92, 1.35, 0.88]}>
        <SkullWireframe geo={skullGeo} />
        <SkullFill geo={skullGeo} />
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
        <ambientLight intensity={0.08} />
        <pointLight position={[-2.5, 1.5, -2]} intensity={4} color="#00d4ff" />
        <pointLight position={[2.5, -1, -2]} intensity={3} color="#8b5cf6" />
        <HeadGroup />
      </Suspense>
    </Canvas>
  );
}
