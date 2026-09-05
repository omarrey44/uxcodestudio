import assert from "node:assert/strict";
import test from "node:test";
import { ACTION_DURATION, orbitPose } from "../../components/three/orbitBehavior.ts";

const transforms = ["x", "y", "z", "yaw", "roll", "pitch", "headTilt", "headNod", "leftArm", "rightArm"];

test("every choreography stays finite and returns to its resting pose", () => {
  for (const [action, duration] of Object.entries(ACTION_DURATION)) {
    for (let age = 0; age <= duration + 1; age += 1 / 60) {
      const pose = orbitPose(action, age, false);
      for (const key of transforms) assert.ok(Number.isFinite(pose[key]), `${action}: ${key} at ${age}`);
      assert.ok(Math.abs(pose.x) <= 0.49 && Math.abs(pose.z) <= 0.45 && pose.y <= 0.25, `${action} stays in the camera's flight area`);
    }
    for (const age of [0, duration, duration + 20]) {
      const pose = orbitPose(action, age, false);
      for (const key of transforms) assert.ok(Math.abs(pose[key]) < 1e-8, `${action}: ${key} rests at ${age}`);
    }
  }
});

test("reduced motion keeps every transform still while preserving expressions", () => {
  for (const [action, duration] of Object.entries(ACTION_DURATION)) {
    for (const age of [0, duration / 2, duration]) {
      const pose = orbitPose(action, age, true);
      for (const key of transforms) assert.equal(Math.abs(pose[key]), 0, `${action}: ${key}`);
    }
  }
  assert.equal(orbitPose("love", 1, true).love, true);
  assert.equal(orbitPose("hello", 1, true).happy, true);
  assert.equal(orbitPose("wink", 1, true).wink, true);
});

test("the secret spin completes one forward revolution without a reverse landing", () => {
  const duration = ACTION_DURATION.spin;
  let previous = 0;
  for (let age = 0; age < duration; age += 0.02) {
    const yaw = orbitPose("spin", age, false).yaw;
    assert.ok(yaw >= previous);
    previous = yaw;
  }
  assert.ok(Math.abs(Math.sin(previous)) < 0.01);
  assert.equal(orbitPose("spin", duration, false).yaw, 0);
});

test("expired, cancelled and idle performances do not retain expressions or effects", () => {
  for (const action of [null, ...Object.keys(ACTION_DURATION)]) {
    const pose = orbitPose(action, 100, false);
    for (const key of ["happy", "wink", "love"]) assert.equal(pose[key], false);
    for (const key of ["energy", "flight", "stars"]) assert.equal(pose[key], 0);
  }
});
