const assert = require("node:assert/strict");
const Matter = require("../vendor/matter-js/matter.min.js");
const { getMergeResult } = require("../fruit-logic.js");

assert.equal(Matter.version, "0.20.0");

const engine = Matter.Engine.create();
engine.gravity.y = 0;
const first = Matter.Bodies.circle(100, 100, 22);
const second = Matter.Bodies.circle(132, 100, 22);
first.plugin.fruitTier = 0;
second.plugin.fruitTier = 0;
let merge = null;

Matter.Events.on(engine, "collisionStart", (event) => {
  const pair = event.pairs.find(
    (item) =>
      (item.bodyA === first && item.bodyB === second) ||
      (item.bodyA === second && item.bodyB === first),
  );
  if (pair) {
    merge = getMergeResult(
      pair.bodyA.plugin.fruitTier,
      pair.bodyB.plugin.fruitTier,
    );
  }
});

Matter.Composite.add(engine.world, [first, second]);
Matter.Engine.update(engine, 1000 / 60);

assert.deepEqual(merge, {
  nextTier: 1,
  points: 3,
  complete: false,
});

console.log("fruit physics collision test passed");
