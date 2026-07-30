const assert = require("node:assert/strict");
const { calculatePlacement } = require("../stack-logic.js");

const top = { x: 160, width: 400 };

assert.deepEqual(calculatePlacement({ x: 164, width: 400 }, top, 7), {
  hit: true,
  perfect: true,
  placed: { x: 160, width: 400 },
  fragment: null,
});

assert.deepEqual(calculatePlacement({ x: 120, width: 400 }, top, 7), {
  hit: true,
  perfect: false,
  placed: { x: 160, width: 360 },
  fragment: { x: 120, width: 40 },
});

assert.deepEqual(calculatePlacement({ x: 200, width: 400 }, top, 7), {
  hit: true,
  perfect: false,
  placed: { x: 200, width: 360 },
  fragment: { x: 560, width: 40 },
});

assert.deepEqual(calculatePlacement({ x: 560, width: 400 }, top, 7), {
  hit: false,
  perfect: false,
  placed: null,
  fragment: { x: 560, width: 400 },
});

console.log("stack placement tests passed");
