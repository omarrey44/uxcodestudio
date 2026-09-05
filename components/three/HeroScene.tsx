"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

const MODEL_URL = "/models/orbit-v2.glb";
export function clearOrbitModel() { useGLTF.clear(MODEL_URL); }
type Gaze = { x: number; y: number; lastMove: number };
export type HeroSceneProps = {
  eyeColor: string;
  uxOn: boolean;
  greeting: number;
  greetingActive: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  onError: () => void;
};

function OrbitRobot({ eyeColor, uxOn, greeting, greetingActive, reducedMotion, onReady, gaze }: Omit<HeroSceneProps, "onError"> & { gaze: RefObject<Gaze> }) {
  const { scene } = useGLTF(MODEL_URL);
  const elapsed = useRef(0);
  const greetingStarted = useRef(-100);
  const lastGreeting = useRef(greeting);
  const power = useRef(uxOn ? 1 : 0);
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
    return {
      scene: clone, head, body, eyes, happyEyes,
      smile: node("Smile"), arm: node("Arm_R"),
      headY: head.position.y, bodyY: body.position.y,
      eyePositions: eyes.map((eye) => eye.position.clone()),
      materials: Array.from(materials.values()),
    };
  }, [scene]);

  useEffect(() => {
    onReady();
    return () => model.materials.forEach((material) => material.dispose());
  }, [model, onReady]);

  useFrame((_, rawDelta) => {
    const delta = reducedMotion ? 1 : Math.min(rawDelta, 0.05);
    elapsed.current += delta;
    const time = elapsed.current;
    if (lastGreeting.current !== greeting) {
      lastGreeting.current = greeting;
      greetingStarted.current = time;
    }
    const greetingAge = time - greetingStarted.current;
    const sayingHello = uxOn && greetingActive;
    const expression = sayingHello ? Math.sin(Math.PI * Math.min(greetingAge, 2.4) / 2.4) : 0;
    const awake = THREE.MathUtils.damp(power.current, uxOn ? 1 : 0, 5, delta);
    power.current = awake;
    const following = uxOn && !reducedMotion && performance.now() - gaze.current.lastMove < 5000;
    const x = following ? gaze.current.x : 0;
    const y = following ? gaze.current.y : 0;
    const float = reducedMotion ? 0 : Math.sin(time * 1.65) * 0.036 * awake;
    const idleTurn = reducedMotion || following ? 0 : Math.sin(time * 0.55) * 0.07;
    const nod = reducedMotion ? 0 : Math.sin(greetingAge * 8) * expression * 0.10;
    model.head.rotation.y = THREE.MathUtils.damp(model.head.rotation.y, (x * 0.48 + idleTurn) * awake, 5, delta);
    model.head.rotation.x = THREE.MathUtils.damp(model.head.rotation.x, -y * 0.24 * awake + (1-awake) * 0.15 + nod, 5, delta);
    model.head.rotation.z = THREE.MathUtils.damp(model.head.rotation.z, -x * 0.055 * awake + (reducedMotion ? 0 : expression * 0.08), 4, delta);
    model.body.rotation.y = THREE.MathUtils.damp(model.body.rotation.y, x * 0.085 * awake, 3, delta);
    model.head.position.y = model.headY + float;
    model.body.position.y = model.bodyY + float;
    model.arm.rotation.z = reducedMotion ? 0 : expression * (0.8 + Math.sin(greetingAge * 13) * 0.22);

    // The eyes lead the heavier head, with independent pivots for natural blinks.
    const phase = time % 5.3;
    const blink = !reducedMotion && phase > 5.08 ? 1 - Math.sin((phase - 5.08) / 0.22 * Math.PI) * 0.94 : 1;
    model.eyes.forEach((eye, index) => {
      eye.visible = !sayingHello;
      eye.scale.y = THREE.MathUtils.damp(eye.scale.y, uxOn ? blink : 0.09, 24, delta);
      eye.position.x = THREE.MathUtils.damp(eye.position.x, model.eyePositions[index].x + x * 0.07 * awake, 12, delta);
      eye.position.y = THREE.MathUtils.damp(eye.position.y, model.eyePositions[index].y + y * 0.045 * awake, 12, delta);
    });
    model.happyEyes.forEach((eye) => { eye.visible = sayingHello; });
    model.smile.scale.y = THREE.MathUtils.damp(model.smile.scale.y, uxOn ? 1 + expression * 0.3 : 0.15, 8, delta);
    model.materials.forEach((material) => {
      if (!material.name.endsWith("_LED")) return;
      material.emissive.lerp(accent, 1 - Math.exp(-7 * delta));
      material.color.copy(material.emissive).multiplyScalar(0.35);
      const pulse = reducedMotion ? 0 : Math.sin(time * 2) * 0.12;
      material.emissiveIntensity = material.name === "Eye_LED" ? 0.12 + awake * (2.7 + expression * 0.7) : 0.04 + awake * (1.4 + pulse);
    });
  });
  return <primitive object={model.scene} dispose={null} />;
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
          <OrbitRobot {...props} gaze={gaze} />
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
