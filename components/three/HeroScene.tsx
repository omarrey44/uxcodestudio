"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { orbitPose, type OrbitPerformance } from "./orbitBehavior";

const MODEL_URL = "/models/orbit-v2.glb";
export function clearOrbitModel() { useGLTF.clear(MODEL_URL); }
type Gaze = { x: number; y: number; lastMove: number };
export type HeroSceneProps = {
  eyeColor: string;
  uxOn: boolean;
  performance: OrbitPerformance | null;
  reducedMotion: boolean;
  onReady: () => void;
  onError: () => void;
};

function OrbitRobot({ eyeColor, uxOn, performance: act, reducedMotion, onReady, gaze, visible }: Omit<HeroSceneProps, "onError"> & { gaze: RefObject<Gaze>; visible: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const halfWidth = useThree((state) => state.viewport.width / 2);
  const invalidate = useThree((state) => state.invalidate);
  const elapsed = useRef(0);
  const power = useRef(uxOn ? 1 : 0);
  const particles = useRef<THREE.Group>(null);
  const flightRing = useRef<THREE.Mesh>(null);
  const accent = useMemo(() => new THREE.Color(eyeColor), [eyeColor]);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const materials = new Map<THREE.Material, THREE.MeshStandardMaterial>();
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const original = object.material as THREE.MeshStandardMaterial;
      let material = materials.get(original);
      if (!material) {
        material = original.clone();
        material.envMapIntensity = material.name === "Visor_Glass" ? 0.25 : 0.85;
        if (material.name.endsWith("_LED")) material.toneMapped = false;
        materials.set(original, material);
      }
      object.material = material;
    });
    const node = (name: string) => {
      const object = clone.getObjectByName(name);
      if (!object) throw new Error(`ORBIT model is missing ${name}`);
      return object;
    };
    const head = node("Head"), body = node("Body");
    const eyes = [node("Eye_L"), node("Eye_R")];
    const happyEyes = [node("Happy_L"), node("Happy_R")];
    happyEyes.forEach((eye) => { eye.visible = false; });
    const heart = new THREE.Shape();
    heart.moveTo(0, 0.08);
    heart.bezierCurveTo(-0.2, 0.26, -0.26, -0.01, 0, -0.2);
    heart.bezierCurveTo(0.26, -0.01, 0.2, 0.26, 0, 0.08);
    const heartGeometry = new THREE.ShapeGeometry(heart, 18);
    const eyeMaterial = Array.from(materials.values()).find((material) => material.name === "Eye_LED")!;
    const hearts = eyes.map((eye) => {
      const mesh = new THREE.Mesh(heartGeometry, eyeMaterial);
      mesh.position.copy(eye.position);
      mesh.position.z += 0.025;
      mesh.visible = false;
      head.add(mesh);
      return mesh;
    });
    return {
      scene: clone, rig: node("ORBIT_Root"), head, body, eyes, happyEyes, hearts, heartGeometry,
      smile: node("Smile"), arms: [node("Arm_L"), node("Arm_R")],
      equalizer: Array.from({ length: 5 }, (_, index) => node(`Chest_Equalizer_${index}`)),
      eyePositions: eyes.map((eye) => eye.position.clone()),
      materials: Array.from(materials.values()),
    };
  }, [scene]);

  useEffect(() => {
    onReady();
    return () => {
      model.materials.forEach((material) => material.dispose());
      model.heartGeometry.dispose();
    };
  }, [model, onReady]);

  // These props affect the model imperatively in useFrame, so demand mode needs
  // an explicit frame on each change and when returning from offscreen.
  useEffect(() => { invalidate(); }, [act, eyeColor, uxOn, reducedMotion, visible, invalidate]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!reducedMotion) elapsed.current += delta;
    const time = elapsed.current;
    const age = act ? (performance.now() - act.startedAt) / 1000 : 0;
    const pose = orbitPose(uxOn ? act?.kind ?? null : null, age, reducedMotion);
    // Demand rendering settles immediately; no hidden animation loop for reduced motion.
    const settle = (from: number, to: number, speed = 7) => reducedMotion ? to : THREE.MathUtils.damp(from, to, speed, delta);
    const awake = settle(power.current, uxOn ? 1 : 0, 5);
    power.current = awake;
    const following = uxOn && !reducedMotion && performance.now() - gaze.current.lastMove < 5000;
    const idle = uxOn && !reducedMotion && !following && !act;
    const x = following ? gaze.current.x : idle ? Math.sin(time * 0.43) * 0.24 : 0;
    const y = following ? gaze.current.y : idle ? Math.sin(time * 0.65) * 0.18 : 0;
    const float = reducedMotion ? 0 : Math.sin(time * 1.65) * 0.045 * awake;
    const stretchPhase = (time % 23 - 17) / 3;
    const stretch = idle && stretchPhase > 0 && stretchPhase < 1 ? Math.sin(stretchPhase * Math.PI) ** 2 : 0;
    const travelScale = THREE.MathUtils.clamp((halfWidth - 1.3) / 0.48, 0.15, 1);
    model.rig.position.x = settle(model.rig.position.x, pose.x * travelScale, 6);
    model.rig.position.y = settle(model.rig.position.y, float + pose.y + stretch * 0.06, 8);
    model.rig.position.z = settle(model.rig.position.z, pose.z, 6);
    const yaw = pose.yaw - model.rig.rotation.y;
    model.rig.rotation.y += reducedMotion ? -model.rig.rotation.y : Math.atan2(Math.sin(yaw), Math.cos(yaw)) * (1 - Math.exp(-9 * delta));
    model.rig.rotation.y = Math.atan2(Math.sin(model.rig.rotation.y), Math.cos(model.rig.rotation.y));
    model.rig.rotation.z = settle(model.rig.rotation.z, pose.roll * Math.max(0.5, travelScale));
    model.head.rotation.y = settle(model.head.rotation.y, x * 0.48 * awake, 5);
    model.head.rotation.x = settle(model.head.rotation.x, -y * 0.24 * awake + (1-awake) * 0.18 + pose.headNod - stretch * 0.12, 5);
    model.head.rotation.z = settle(model.head.rotation.z, -x * 0.075 * awake + pose.headTilt, 5);
    model.body.rotation.y = settle(model.body.rotation.y, x * 0.10 * awake, 3);
    model.body.rotation.z = settle(model.body.rotation.z, reducedMotion ? 0 : Math.sin(time * 0.8) * 0.018 * awake, 3);
    model.arms[0].rotation.z = settle(model.arms[0].rotation.z, pose.leftArm - stretch * 0.8 - Math.max(float, 0) * 0.8, 12);
    model.arms[1].rotation.z = settle(model.arms[1].rotation.z, pose.rightArm + stretch * 0.8 + Math.max(float, 0) * 0.8, 12);

    // The eyes lead the heavier head, with independent pivots for natural blinks.
    const phase = time % 7.7;
    const blinkAge = phase > 7.42 ? phase - 7.42 : phase > 7.08 && phase < 7.3 ? phase - 7.08 : -1;
    const blink = !reducedMotion && blinkAge >= 0 && blinkAge < 0.22 ? 1 - Math.sin(blinkAge / 0.22 * Math.PI) * 0.94 : 1;
    model.eyes.forEach((eye, index) => {
      eye.visible = !pose.happy && !pose.love;
      eye.scale.y = settle(eye.scale.y, uxOn ? pose.wink && index === 1 ? 0.08 : blink : 0.09, 24);
      eye.position.x = settle(eye.position.x, model.eyePositions[index].x + x * 0.07 * awake, 12);
      eye.position.y = settle(eye.position.y, model.eyePositions[index].y + y * 0.045 * awake, 12);
    });
    model.happyEyes.forEach((eye) => { eye.visible = pose.happy && !pose.love; });
    model.hearts.forEach((heart) => {
      heart.visible = pose.love;
      heart.scale.setScalar(reducedMotion ? 1 : 0.92 + Math.sin(time * 5) * 0.08);
    });
    model.smile.scale.y = settle(model.smile.scale.y, uxOn ? 1 + pose.energy * 0.3 : 0.15, 8);
    model.equalizer.forEach((bar, index) => {
      bar.scale.y = reducedMotion || !uxOn ? 1 : 1 + (Math.sin(time * (act?.kind === "dance" ? 10 : 3) + index * 1.2) + 1) * (0.2 + pose.energy * 0.5);
    });
    model.materials.forEach((material) => {
      if (!material.name.endsWith("_LED")) return;
      material.emissive.lerp(accent, reducedMotion ? 1 : 1 - Math.exp(-7 * delta));
      material.color.copy(material.emissive).multiplyScalar(0.35);
      const pulse = reducedMotion ? 0 : Math.sin(time * 2) * 0.12;
      material.emissiveIntensity = material.name === "Eye_LED" ? 0.12 + awake * (2.7 + pose.energy * 0.5) : 0.04 + awake * (1.4 + pulse);
    });
    if (particles.current) {
      particles.current.visible = uxOn && (pose.flight > 0 || pose.stars > 0) && !reducedMotion;
      particles.current.children.forEach((child, index) => {
        const angle = time * 1.6 - index * 0.55;
        const radius = Math.min(halfWidth - 0.08, pose.stars > 0 ? 1.45 : 1.05);
        child.position.set(Math.cos(angle) * radius, -0.65 + Math.sin(angle * 1.4) * 0.5, Math.sin(angle) * radius * 0.6);
        child.rotation.set(time, time + index, time * 0.5);
        child.scale.setScalar((pose.flight + pose.stars) * (1 - index * 0.075));
      });
    }
    if (flightRing.current) {
      flightRing.current.visible = uxOn && pose.flight > 0 && !reducedMotion;
      (flightRing.current.material as THREE.MeshBasicMaterial).opacity = pose.flight * 0.35;
    }
  });
  return <>
    <primitive object={model.scene} dispose={null} />
    <group ref={particles} visible={false}>
      {Array.from({ length: 8 }, (_, index) => <mesh key={index}>
        <octahedronGeometry args={[index < 2 ? 0.045 : 0.027]} />
        <meshBasicMaterial color={eyeColor} toneMapped={false} />
      </mesh>)}
    </group>
    <mesh ref={flightRing} visible={false} position={[0, -1.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.08, 1.09, 96]} />
      <meshBasicMaterial color={eyeColor} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  </>;
}

function ContextEvents({ onError }: { onError: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onError(); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  return null;
}

export default function HeroScene(props: HeroSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const gaze = useRef<Gaze>({ x: 0, y: 0, lastMove: -Infinity });
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = wrap.current;
    if (!element) return;
    let intersecting = true;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    const element = wrap.current;
    if (!element || !visible || props.reducedMotion || !props.uxOn) return;
    let bounds = element.getBoundingClientRect();
    const measure = () => { bounds = element.getBoundingClientRect(); };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" && !element.closest("[data-orbit-stage]")?.contains(event.target as Node)) return;
      gaze.current = {
        x: THREE.MathUtils.clamp((event.clientX - bounds.left - bounds.width * 0.5) / (window.innerWidth * 0.48), -1, 1),
        y: THREE.MathUtils.clamp(-(event.clientY - bounds.top - bounds.height * 0.36) / (window.innerHeight * 0.45), -1, 1),
        lastMove: performance.now(),
      };
    };
    const reset = () => { gaze.current.lastMove = -Infinity; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("blur", reset);
    document.addEventListener("pointerleave", reset);
    return () => {
      resize.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerleave", reset);
    };
  }, [visible, props.reducedMotion, props.uxOn]);

  return (
    <div ref={wrap} style={{ width: "100%", height: "100%" }} aria-hidden="true">
      <Canvas frameloop={visible ? (props.reducedMotion ? "demand" : "always") : "never"} dpr={[1, 1.5]}
        camera={{ position: [0, 0.04, 6], fov: 36, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
        fallback={null}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMappingExposure = 1.1; }}>
        <ContextEvents onError={props.onError} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[-3, 5, 4]} intensity={2.5} color="#e4f2ff" />
        <directionalLight position={[3, 1, 2]} intensity={1} color="#75ceff" />
        <pointLight position={[2, 2, -2]} intensity={15} color="#918aff" />
        <pointLight position={[0, -1, 2]} intensity={2} color={props.eyeColor} />
        <Suspense fallback={null}>
          <OrbitRobot {...props} gaze={gaze} visible={visible} />
          <Environment resolution={128} frames={1}>
            <color attach="background" args={["#253544"]} />
            <Lightformer intensity={3} position={[-3, 4, 3]} scale={[4, 5, 1]} target={[0, 0, 0]} />
            <Lightformer intensity={1.5} color="#c4eaff" position={[4, 1, 2]} scale={[2, 4, 1]} target={[0, 0, 0]} />
            <Lightformer intensity={2} color="#727bff" position={[1, 3, -4]} scale={[3, 3, 1]} target={[0, 0, 0]} />
          </Environment>
          <ContactShadows position={[0, -1.69, 0]} opacity={0.35} scale={5} blur={2.8} far={3} resolution={256} frames={1} />
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={1.3} luminanceSmoothing={0.4} intensity={0.4} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
