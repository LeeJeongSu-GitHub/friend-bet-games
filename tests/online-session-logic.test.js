const assert = require("node:assert/strict");
const SessionLogic = require("../online-session-logic.js");

const players = [
  { id: "a", nickname: "민지" },
  { id: "b", nickname: "준호" },
  { id: "c", nickname: "서연" },
];
const ranking = (winnerId) => players.map((player, index) => ({
  ...player,
  rank: player.id === winnerId ? 1 : index + 2,
  score: player.id === winnerId ? 100 : 50 - index,
}));

const bestOf3 = SessionLogic.createSeries({ mode: "bestOf3", players });
SessionLogic.completeRound(bestOf3, ranking("a"), "tap", () => 0);
assert.equal(bestOf3.finished, false);
assert.equal(bestOf3.currentRound, 2);
SessionLogic.completeRound(bestOf3, ranking("a"), "runner", () => 0);
assert.equal(bestOf3.finished, true);
assert.deepEqual(bestOf3.championIds, ["a"]);
assert.equal(bestOf3.penalty, SessionLogic.DEFAULT_PENALTIES[0]);

const five = SessionLogic.createSeries({ mode: "five", players, penalty: "간식 사기" });
for (let round = 0; round < 5; round += 1) {
  SessionLogic.completeRound(five, ranking(round < 3 ? "b" : "c"), "stack", () => 0);
}
assert.equal(five.finished, true);
assert.equal(five.rounds.length, 5);
assert.equal(five.standings[0].id, "b");
assert.equal(five.penalty, "간식 사기");

const random = SessionLogic.createSeries({
  mode: "random",
  players,
  games: ["reaction", "tap", "runner", "stack", "fruit", "dodge"],
  random: () => 0.25,
});
assert.equal(random.gameOrder.length, 5);
assert.equal(new Set(random.gameOrder).size, 5);

console.log("online session logic tests passed");
