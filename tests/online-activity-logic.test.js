const assert = require("node:assert/strict");
const OnlineActivityLogic = require("../online-activity-logic.js");

const initialQuestion = OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345);
const sameInitialQuestion = OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345);
assert.deepEqual(initialQuestion, sameInitialQuestion);
assert.ok(initialQuestion.prompt);
assert.ok(initialQuestion.clue);
assert.ok(initialQuestion.answers.length > 0);
assert.equal(
  OnlineActivityLogic.isCorrectAnswer(
    { answers: ["10월 9일"] },
    " 10월9일! ",
  ),
  true,
);
assert.equal(
  OnlineActivityLogic.isCorrectAnswer({ answers: ["서울"] }, "부산"),
  false,
);

assert.equal(OnlineActivityLogic.resolveRps("rock", "scissors"), "left");
assert.equal(OnlineActivityLogic.resolveRps("rock", "paper"), "right");
assert.equal(OnlineActivityLogic.resolveRps("paper", "paper"), "tie");
assert.equal(OnlineActivityLogic.resolveRps("invalid", "paper"), null);

assert.deepEqual(
  OnlineActivityLogic.buildRpsStage(["a", "b", "c"], 2),
  {
    stage: 2,
    matches: [
      {
        id: "2-1",
        leftId: "a",
        rightId: "b",
        leftSubmitted: false,
        rightSubmitted: false,
        leftChoice: "",
        rightChoice: "",
        winnerId: "",
        phase: "choosing",
      },
    ],
    byeIds: ["c"],
  },
);
const fivePlayerOpening = OnlineActivityLogic.buildRpsStage(
  ["a", "b", "c", "d", "e"],
  1,
);
assert.equal(fivePlayerOpening.matches.length, 2);
assert.deepEqual(fivePlayerOpening.byeIds, ["e"]);
const threePlayerNext = OnlineActivityLogic.buildRpsStage(
  ["a", "c", "e"],
  2,
);
assert.equal(threePlayerNext.matches.length, 1);
assert.deepEqual(threePlayerNext.byeIds, ["e"]);

console.log("online activity logic tests passed");
