const assert = require("node:assert/strict");
const {
  tiers,
  pickDropTier,
  getMergeResult,
  getMergedMotion,
} = require("../fruit-logic.js");

assert.equal(tiers.length, 9);
assert.equal(pickDropTier(0), 0);
assert.equal(pickDropTier(0.5), 1);
assert.equal(pickDropTier(0.78), 2);
assert.equal(pickDropTier(0.94), 3);

assert.deepEqual(getMergeResult(0, 0), {
  nextTier: 1,
  points: 3,
  complete: false,
});
assert.deepEqual(getMergeResult(7, 7), {
  nextTier: 8,
  points: 80,
  complete: true,
});
assert.equal(getMergeResult(1, 2), null);
assert.equal(getMergeResult(8, 8), null);

assert.deepEqual(
  getMergedMotion(
    { x: 4, y: -3 },
    { x: 2, y: 1 },
    0.1,
    0.05,
  ),
  {
    velocity: { x: 0.65, y: 0.08 },
    angularVelocity: 0.01,
  },
);
assert.deepEqual(
  getMergedMotion(
    { x: -8, y: 12 },
    { x: -4, y: 8 },
    -0.2,
    -0.1,
  ),
  {
    velocity: { x: -0.65, y: 0.65 },
    angularVelocity: -0.01,
  },
);

console.log("fruit merge rule tests passed");
