export const ACTION_DURATION = {
  hello: 2.6, orbit: 6.4, dance: 4.8, wink: 2.2, love: 3.6, spin: 4.2, cosmic: 6,
} as const;

export type OrbitAction = keyof typeof ACTION_DURATION;
export type OrbitPerformance = { kind: OrbitAction; id: number; startedAt: number };
export type OrbitSecret = "love" | "spin" | "cosmic";
export const SECRET_IDS: OrbitSecret[] = ["love", "spin", "cosmic"];

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

/** Bounded choreography. Every flight starts and lands at the same dock position. */
export function orbitPose(kind: OrbitAction | null, age: number, reduced: boolean) {
  const duration = kind ? ACTION_DURATION[kind] : 1;
  const progress = clamp(age / duration);
  const active = kind !== null && age >= 0 && age < duration;
  const envelope = active ? smooth(age / 0.55) * smooth((duration - age) / 0.7) : 0;
  const motion = reduced ? 0 : envelope;
  const phase = smooth(progress) * Math.PI * 2;
  const pose = {
    x: 0, y: 0, z: 0, yaw: 0, roll: 0, pitch: 0,
    headTilt: 0, headNod: 0, leftArm: 0, rightArm: 0,
    happy: active && ["hello", "dance", "love", "spin", "cosmic"].includes(kind!),
    wink: active && kind === "wink",
    love: active && kind === "love",
    energy: envelope, flight: 0, stars: 0,
  };
  if (kind === "hello") {
    pose.rightArm = motion * (0.95 + Math.sin(age * 13) * 0.28);
    pose.headTilt = motion * 0.12;
    pose.headNod = Math.sin(age * 7) * motion * 0.07;
  } else if (kind === "orbit" || kind === "cosmic") {
    pose.x = Math.sin(phase) * motion * 0.48;
    pose.z = (Math.cos(phase) - 1) * motion * 0.22;
    pose.y = motion * (0.18 + Math.sin(phase * 2) * 0.06);
    pose.yaw = Math.sin(phase + 0.4) * motion * 0.3;
    pose.roll = -Math.cos(phase) * motion * 0.12;
    pose.leftArm = -motion * 0.5;
    pose.rightArm = motion * 0.5;
    pose.flight = envelope;
    pose.stars = kind === "cosmic" ? envelope : 0;
  } else if (kind === "dance") {
    pose.x = Math.sin(age * 5.5) * motion * 0.15;
    pose.y = Math.pow(Math.sin(age * 5.5), 2) * motion * 0.12;
    pose.roll = Math.sin(age * 5.5) * motion * 0.12;
    pose.yaw = Math.sin(age * 2.75) * motion * 0.2;
    pose.headTilt = -pose.roll * 0.6;
    pose.leftArm = -motion * (0.65 + Math.sin(age * 5.5) * 0.4);
    pose.rightArm = motion * (0.65 - Math.sin(age * 5.5) * 0.4);
  } else if (kind === "spin") {
    // A complete turn has an equivalent resting orientation; never unwind on landing.
    pose.yaw = reduced || !active ? 0 : phase;
    pose.y = motion * 0.2;
    pose.leftArm = -motion * 0.85;
    pose.rightArm = motion * 0.85;
    pose.stars = envelope;
  } else if (kind === "love") {
    pose.headTilt = motion * -0.14;
    pose.headNod = motion * 0.08;
    pose.leftArm = -motion * 0.2;
    pose.rightArm = motion * 0.2;
  } else if (kind === "wink") {
    pose.headTilt = motion * 0.14;
    pose.rightArm = motion * 0.4;
  }
  return pose;
}
