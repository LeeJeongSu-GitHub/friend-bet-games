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
      { prompt: "ㄷㄲㅂ", clue: "한국 전래동화에 자주 등장해요", answers: ["도깨비"] },
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
  const TELEPATHY_ROUNDS = Object.freeze([
    { prompt: "야식으로 하나만 고른다면?", choices: ["치킨", "피자", "떡볶이", "라면"] },
    { prompt: "갑자기 하루가 비었다면?", choices: ["집에서 휴식", "맛집 탐방", "근교 여행", "게임 몰입"] },
    { prompt: "카페에서 가장 먼저 보는 것은?", choices: ["커피", "디저트", "분위기", "가격"] },
    { prompt: "여름 휴가 장소를 고른다면?", choices: ["바다", "계곡", "도시", "집"] },
    { prompt: "친구에게 받고 싶은 선물은?", choices: ["간식", "현금", "편지", "깜짝 이벤트"] },
    { prompt: "영화관에서 꼭 필요한 것은?", choices: ["팝콘", "콜라", "좋은 자리", "조용한 관객"] },
    { prompt: "스트레스를 풀 때 하는 것은?", choices: ["잠자기", "먹기", "운동", "수다"] },
    { prompt: "하나만 평생 무료라면?", choices: ["커피", "배달", "여행", "영화"] },
    { prompt: "친구 모임에서 맡는 역할은?", choices: ["계획", "예약", "분위기", "따라가기"] },
    { prompt: "비 오는 날 생각나는 것은?", choices: ["파전", "라면", "영화", "낮잠"] },
  ]);
  const DRAWING_WORDS = Object.freeze([
    { answer: "고양이", clue: "동물" },
    { answer: "우산", clue: "비 오는 날" },
    { answer: "피자", clue: "음식" },
    { answer: "비행기", clue: "교통수단" },
    { answer: "선인장", clue: "식물" },
    { answer: "눈사람", clue: "겨울" },
    { answer: "자전거", clue: "두 바퀴" },
    { answer: "햄버거", clue: "음식" },
    { answer: "문어", clue: "바다 동물" },
    { answer: "로봇", clue: "기계" },
    { answer: "딸기", clue: "과일" },
    { answer: "기타", clue: "악기" },
    { answer: "소방차", clue: "자동차" },
    { answer: "해바라기", clue: "꽃" },
    { answer: "안경", clue: "생활용품" },
    { answer: "케이크", clue: "디저트" },
  ]);
  const KOREAN_INITIALS = Object.freeze([
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  ]);

  function hashSeed(seed) {
    const value = Number(seed);
    return Number.isFinite(value) ? Math.abs(Math.floor(value)) >>> 0 : 0;
  }

  function getKoreanInitials(value) {
    return Array.from(String(value || ""))
      .map((character) => {
        const code = character.charCodeAt(0) - 0xac00;
        return code >= 0 && code <= 11171
          ? KOREAN_INITIALS[Math.floor(code / 588)]
          : character;
      })
      .join("")
      .replace(/\s+/g, "");
  }

  function getQuizQuestion(game, seed, offset = 0) {
    const bank = QUIZ_BANKS[game];
    if (!bank?.length) return null;
    const mixed = Math.imul(hashSeed(seed) ^ (game === "initialQuiz" ? 0x45d9f3b : 0x119de1f3), 2654435761) >>> 0;
    const index = (mixed + Math.max(0, Math.floor(Number(offset) || 0))) % bank.length;
    const question = bank[index];
    return {
      id: `${game}-${index}`,
      prompt: game === "initialQuiz"
        ? getKoreanInitials(question.answers[0])
        : question.prompt,
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

  function getSeededItem(items, seed, offset = 0, salt = 0) {
    if (!items?.length) return null;
    const mixed = Math.imul(hashSeed(seed) ^ salt, 2654435761) >>> 0;
    const index = (mixed + Math.max(0, Math.floor(Number(offset) || 0))) % items.length;
    return { index, item: items[index] };
  }

  function getTelepathyRound(seed, offset = 0) {
    const selected = getSeededItem(TELEPATHY_ROUNDS, seed, offset, 0x27d4eb2d);
    return selected
      ? {
          id: `telepathy-${selected.index}`,
          prompt: selected.item.prompt,
          choices: [...selected.item.choices],
        }
      : null;
  }

  function resolveTelepathyChoices(entries) {
    const normalized = (entries || [])
      .map((entry) => ({
        peerId: String(entry?.peerId || ""),
        choice: Math.floor(Number(entry?.choice)),
      }))
      .filter((entry) => entry.peerId && Number.isInteger(entry.choice) && entry.choice >= 0 && entry.choice < 4);
    const counts = [0, 0, 0, 0];
    normalized.forEach((entry) => {
      counts[entry.choice] += 1;
    });
    const matchSize = Math.max(...counts);
    const matchingChoices = matchSize >= 2
      ? counts.flatMap((count, choice) => count === matchSize ? [choice] : [])
      : [];
    return {
      counts,
      matchSize,
      matchingChoices,
      scorerIds: normalized
        .filter((entry) => matchingChoices.includes(entry.choice))
        .map((entry) => entry.peerId),
    };
  }

  function getDrawingWord(seed, offset = 0) {
    const selected = getSeededItem(DRAWING_WORDS, seed, offset, 0x165667b1);
    return selected
      ? {
          id: `drawing-${selected.index}`,
          answer: selected.item.answer,
          clue: selected.item.clue,
        }
      : null;
  }

  return {
    QUIZ_BANKS,
    RPS_CHOICES,
    TELEPATHY_ROUNDS,
    DRAWING_WORDS,
    KOREAN_INITIALS,
    getKoreanInitials,
    getQuizQuestion,
    normalizeAnswer,
    isCorrectAnswer,
    normalizeRpsChoice,
    resolveRps,
    buildRpsStage,
    getTelepathyRound,
    resolveTelepathyChoices,
    getDrawingWord,
  };
});
