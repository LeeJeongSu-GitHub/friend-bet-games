(function attachOnlineActivityLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OnlineActivityLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createOnlineActivityLogic() {
  "use strict";

  const QUIZ_BANKS = Object.freeze({
    initialQuiz: Object.freeze([
      { prompt: "ㅂㄴㄴ", clue: "노란색 과일", answers: ["바나나"] },
      { prompt: "ㅊㅋㄹ", clue: "달콤한 간식", answers: ["초콜릿", "초콜렛"] },
      { prompt: "ㅇㅇㅅㅋㄹ", clue: "차갑고 달콤한 디저트", answers: ["아이스크림"] },
      { prompt: "ㅎㄷㅍ", clue: "매일 들고 다니는 전자기기", answers: ["휴대폰", "핸드폰"] },
      { prompt: "ㅈㅈㄱ", clue: "두 바퀴로 달리는 탈것", answers: ["자전거"] },
      { prompt: "ㄷㅅㄱ", clue: "책을 빌리는 장소", answers: ["도서관"] },
      { prompt: "ㅂㅎㄱ", clue: "하늘을 나는 교통수단", answers: ["비행기"] },
      { prompt: "ㅅㅂ", clue: "여름철 대표 과일", answers: ["수박"] },
      { prompt: "ㅇㅎㄱ", clue: "영화를 보는 장소", answers: ["영화관"] },
      { prompt: "ㅇㄱㅇㅂ", clue: "비나 눈이 내릴 가능성을 알려줘요", answers: ["일기예보"] },
      { prompt: "ㅌㄲㅂ", clue: "한국 전래동화에 자주 등장해요", answers: ["도깨비"] },
      { prompt: "ㅂㅊㅂㄹㅂ", clue: "바닷가에서 하는 공놀이", answers: ["비치발리볼"] },
      { prompt: "ㅋㅍ", clue: "친구와 마시는 대표 음료", answers: ["커피"] },
      { prompt: "ㄱㅇㅇ", clue: "야옹 하고 우는 동물", answers: ["고양이"] },
      { prompt: "ㄸㅂㅇ", clue: "매콤한 분식 메뉴", answers: ["떡볶이"] },
      { prompt: "ㄴㄹㅂ", clue: "노래를 부르는 방", answers: ["노래방"] },
    ]),
    triviaQuiz: Object.freeze([
      { prompt: "대한민국의 수도는 어디일까요?", clue: "도시", answers: ["서울", "서울특별시"] },
      { prompt: "1년은 모두 몇 개월일까요?", clue: "숫자", answers: ["12", "12개월", "열두달", "열두 달"] },
      { prompt: "지구의 유일한 자연위성은 무엇일까요?", clue: "밤하늘", answers: ["달"] },
      { prompt: "물의 화학식은 무엇일까요?", clue: "영문과 숫자", answers: ["h2o", "H2O"] },
      { prompt: "올림픽의 오륜기는 고리가 몇 개일까요?", clue: "숫자", answers: ["5", "5개", "다섯개", "다섯 개"] },
      { prompt: "세종대왕이 창제한 우리 문자는 무엇일까요?", clue: "문자", answers: ["훈민정음", "한글"] },
      { prompt: "태양계에서 가장 큰 행성은 무엇일까요?", clue: "행성", answers: ["목성"] },
      { prompt: "무지개는 일반적으로 몇 가지 색일까요?", clue: "숫자", answers: ["7", "7가지", "일곱", "일곱가지"] },
      { prompt: "우리 몸에서 피를 순환시키는 기관은 무엇일까요?", clue: "신체 기관", answers: ["심장"] },
      { prompt: "삼각형의 내각의 합은 몇 도일까요?", clue: "각도", answers: ["180", "180도", "백팔십도"] },
      { prompt: "세계에서 가장 넓은 바다는 어디일까요?", clue: "대양", answers: ["태평양"] },
      { prompt: "식물이 빛을 이용해 양분을 만드는 작용은 무엇일까요?", clue: "과학", answers: ["광합성"] },
      { prompt: "한글날은 몇 월 며칠일까요?", clue: "날짜", answers: ["10월9일", "10월 9일", "십월구일"] },
      { prompt: "축구 경기에서 한 팀이 동시에 뛰는 선수는 몇 명일까요?", clue: "숫자", answers: ["11", "11명", "열한명", "열한 명"] },
      { prompt: "대한민국 국기의 이름은 무엇일까요?", clue: "국기", answers: ["태극기"] },
      { prompt: "지구가 태양을 한 바퀴 도는 데 걸리는 시간은 무엇일까요?", clue: "기간", answers: ["1년", "일년", "365일"] },
    ]),
  });

  const RPS_CHOICES = Object.freeze(["rock", "paper", "scissors"]);

  function hashSeed(seed) {
    const value = Number(seed);
    return Number.isFinite(value) ? Math.abs(Math.floor(value)) >>> 0 : 0;
  }

  function getQuizQuestion(game, seed) {
    const bank = QUIZ_BANKS[game];
    if (!bank?.length) return null;
    const mixed = Math.imul(hashSeed(seed) ^ (game === "initialQuiz" ? 0x45d9f3b : 0x119de1f3), 2654435761) >>> 0;
    const question = bank[mixed % bank.length];
    return {
      id: `${game}-${mixed % bank.length}`,
      prompt: question.prompt,
      clue: question.clue,
      answers: [...question.answers],
    };
  }

  function normalizeAnswer(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^0-9a-z가-힣]/g, "");
  }

  function isCorrectAnswer(question, value) {
    const answer = normalizeAnswer(value);
    if (!answer || !question?.answers?.length) return false;
    return question.answers.some((candidate) => normalizeAnswer(candidate) === answer);
  }

  function normalizeRpsChoice(choice) {
    return RPS_CHOICES.includes(choice) ? choice : "";
  }

  function resolveRps(leftChoice, rightChoice) {
    const left = normalizeRpsChoice(leftChoice);
    const right = normalizeRpsChoice(rightChoice);
    if (!left || !right) return null;
    if (left === right) return "tie";
    if (
      (left === "rock" && right === "scissors") ||
      (left === "paper" && right === "rock") ||
      (left === "scissors" && right === "paper")
    ) {
      return "left";
    }
    return "right";
  }

  function buildRpsStage(playerIds, stage = 1) {
    const ids = [...new Set((playerIds || []).filter(Boolean))];
    const matches = [];
    for (let index = 0; index + 1 < ids.length; index += 2) {
      matches.push({
        id: `${stage}-${Math.floor(index / 2) + 1}`,
        leftId: ids[index],
        rightId: ids[index + 1],
        leftSubmitted: false,
        rightSubmitted: false,
        leftChoice: "",
        rightChoice: "",
        winnerId: "",
        phase: "choosing",
      });
    }
    return {
      stage,
      matches,
      byeIds: ids.length % 2 === 1 ? [ids[ids.length - 1]] : [],
    };
  }

  return {
    QUIZ_BANKS,
    RPS_CHOICES,
    getQuizQuestion,
    normalizeAnswer,
    isCorrectAnswer,
    normalizeRpsChoice,
    resolveRps,
    buildRpsStage,
  };
});
