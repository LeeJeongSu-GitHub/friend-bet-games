const assert = require("node:assert/strict");
const OnlineActivityLogic = require("../online-activity-logic.js");

const initialQuestion = OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345);
const sameInitialQuestion = OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345);
assert.deepEqual(initialQuestion, sameInitialQuestion);
assert.ok(initialQuestion.prompt);
assert.ok(initialQuestion.clue);
assert.ok(initialQuestion.answers.length > 0);
assert.equal(OnlineActivityLogic.getKoreanInitials("도깨비"), "ㄷㄲㅂ");
assert.equal(OnlineActivityLogic.getKoreanInitials("아이스크림"), "ㅇㅇㅅㅋㄹ");
for (let offset = 0; offset < OnlineActivityLogic.QUIZ_BANKS.initialQuiz.length; offset += 1) {
  const question = OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345, offset);
  assert.equal(
    question.prompt,
    OnlineActivityLogic.getKoreanInitials(question.answers[0]),
    `${question.answers[0]}의 초성이 정답과 일치해야 합니다.`,
  );
}
assert.notEqual(
  OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345, 0).id,
  OnlineActivityLogic.getQuizQuestion("initialQuiz", 12345, 1).id,
);
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

const telepathyRound = OnlineActivityLogic.getTelepathyRound(12345, 0);
assert.equal(telepathyRound.choices.length, 4);
assert.notEqual(
  telepathyRound.id,
  OnlineActivityLogic.getTelepathyRound(12345, 1).id,
);
assert.deepEqual(
  OnlineActivityLogic.resolveTelepathyChoices([
    { peerId: "a", choice: 0 },
    { peerId: "b", choice: 0 },
    { peerId: "c", choice: 2 },
  ]),
  {
    counts: [2, 0, 1, 0],
    matchSize: 2,
    matchingChoices: [0],
    scorerIds: ["a", "b"],
  },
);
assert.deepEqual(
  OnlineActivityLogic.resolveTelepathyChoices([
    { peerId: "a", choice: 0 },
    { peerId: "b", choice: 1 },
  ]).scorerIds,
  [],
);

const drawingWord = OnlineActivityLogic.getDrawingWord(12345, 0);
assert.ok(drawingWord.answer);
assert.ok(drawingWord.clue);
assert.notEqual(
  drawingWord.id,
  OnlineActivityLogic.getDrawingWord(12345, 1).id,
);

console.log("online activity logic tests passed");
