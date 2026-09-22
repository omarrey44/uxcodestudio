import type { OrbitAction, OrbitLine } from "@/components/three/orbitBehavior";

/** Lets any section make ORBIT react without importing the 3D code. */
export type OrbitCue = { kind: OrbitAction; line?: OrbitLine };
export const ORBIT_CUE = "orbit:cue";
export const ORBIT_PREFILL = "orbit:prefill";

export const cueOrbit = (cue: OrbitCue) => window.dispatchEvent(new CustomEvent<OrbitCue>(ORBIT_CUE, { detail: cue }));
