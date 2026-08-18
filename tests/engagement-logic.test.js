const assert = require("node:assert/strict");
const {
  getDailyChallenge,
  getDailyChallenges,
  recentDateKeys,
  createSeededRandom,
  updateStreak,
  rankScores,
} = require("../engagement-logic.js");

const challenge = getDailyChallenge("2026-08-03");
assert.deepEqual(challenge, getDailyChallenge("2026-08-03"));
assert.ok(["dodge", "runner", "stack", "fruit"].includes(challenge.game));
assert.ok(["easy", "normal", "hard"].includes(challenge.difficulty));
const dailyThree = getDailyChallenges("2026-08-03", 3);
assert.equal(dailyThree.length, 3);
assert.equal(new Set(dailyThree.map((entry) => entry.game)).size, 3);
assert.deepEqual(dailyThree, getDailyChallenges("2026-08-03", 3));
assert.deepEqual(recentDateKeys("2026-08-03", 3), [
  "2026-08-01",
  "2026-08-02",
  "2026-08-03",
]);

const firstRandom = createSeededRandom(challenge.seed);
const secondRandom = createSeededRandom(challenge.seed);
assert.deepEqual(
  Array.from({ length: 8 }, () => firstRandom()),
  Array.from({ length: 8 }, () => secondRandom()),
  "A challenge seed must reproduce the same random sequence",
);

assert.equal(updateStreak(null, "2026-08-01", 0), 1);
assert.equal(updateStreak("2026-08-01", "2026-08-01", 4), 4);
assert.equal(updateStreak("2026-08-01", "2026-08-02", 4), 5);
assert.equal(updateStreak("2026-08-01", "2026-08-04", 4), 1);

assert.deepEqual(
  rankScores([
    { name: "민지", score: 30 },
    { name: "준호", score: 50 },
    { name: "서연", score: 30 },
  ]).map(({ name, score, rank }) => ({ name, score, rank })),
  [
    { name: "준호", score: 50, rank: 1 },
    { name: "민지", score: 30, rank: 2 },
    { name: "서연", score: 30, rank: 2 },
  ],
);

console.log("engagement logic tests passed");
