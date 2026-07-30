const assert = require("node:assert/strict");
const {
  tiers,
  pickDropTier,
  getMergeResult,
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

console.log("fruit merge rule tests passed");
