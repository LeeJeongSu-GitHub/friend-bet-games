const assert = require("node:assert/strict");
const ChallengeLogic = require("../challenge-logic.js");

const challenge = {
  game: "runner",
  difficulty: "hard",
  seed: 4294967295,
  score: 1270,
  challenger: "  민지 친구  ",
};
const url = ChallengeLogic.buildUrl(
  "https://example.com/games/?old=value#result",
  challenge,
);
const parsed = ChallengeLogic.parseUrl(url);

assert.deepEqual(parsed, {
  version: "1",
  game: "runner",
  difficulty: "hard",
  seed: 4294967295,
  score: 1270,
  challenger: "민지 친구",
});
assert.equal(new URL(url).searchParams.has("old"), false);
assert.equal(new URL(url).hash, "");
assert.equal(ChallengeLogic.compare(1271, 1270), "win");
assert.equal(ChallengeLogic.compare(1270, 1270), "tie");
assert.equal(ChallengeLogic.compare(1269, 1270), "lose");
assert.equal(
  ChallengeLogic.parseUrl("https://example.com/?challenge=1&game=runner"),
  null,
);
assert.equal(
  ChallengeLogic.parseUrl(
    "https://example.com/?challenge=1&game=wheel&level=hard&seed=1&score=1",
  ),
  null,
);
assert.equal(
  ChallengeLogic.buildUrl("https://example.com/", {
    ...challenge,
    seed: -1,
  }),
  "",
);

console.log("challenge link logic tests passed");
