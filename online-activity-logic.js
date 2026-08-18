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
      { prompt: "ㅅㄱ", clue: "아삭한 빨간 과일", answers: ["사과"] },
      { prompt: "ㄱㅇㅈ", clue: "멍멍 하고 우는 동물", answers: ["강아지"] },
      { prompt: "ㄴㅈㄱ", clue: "음식을 차갑게 보관해요", answers: ["냉장고"] },
      { prompt: "ㅈㅎㅊ", clue: "도시의 땅속을 달리는 교통수단", answers: ["지하철"] },
      { prompt: "ㅅㅍㄱ", clue: "바람을 만들어 주는 여름 가전", answers: ["선풍기"] },
      { prompt: "ㅌㄱㄷ", clue: "대한민국의 대표 무술", answers: ["태권도"] },
      { prompt: "ㅅㅂㅊ", clue: "불을 끄러 출동하는 자동차", answers: ["소방차"] },
      { prompt: "ㄷㅌㄹ", clue: "다람쥐가 좋아하는 열매", answers: ["도토리"] },
      { prompt: "ㅁㅋㄹ", clue: "알록달록한 프랑스 디저트", answers: ["마카롱"] },
      { prompt: "ㄴㅇㄱㅇ", clue: "놀이기구가 모여 있는 곳", answers: ["놀이공원"] },
      { prompt: "ㅁㅈㄱ", clue: "비가 그친 뒤 하늘의 일곱 빛깔", answers: ["무지개"] },
      { prompt: "ㅍㅇㅈ", clue: "24시간 물건을 살 수 있는 가게", answers: ["편의점"] },
      { prompt: "ㅋㄹㅅㅁㅅ", clue: "12월 25일의 기념일", answers: ["크리스마스"] },
      { prompt: "ㅇㅇㅍ", clue: "귀에 꽂아 음악을 들어요", answers: ["이어폰"] },
      { prompt: "ㅈㅁㅂ", clue: "손으로 뭉쳐 만든 밥", answers: ["주먹밥"] },
      { prompt: "ㅎㅂㄱ", clue: "빵 사이에 고기와 채소를 넣은 음식", answers: ["햄버거"] },
      { prompt: "ㅇㄱㅈㄴ", clue: "사람처럼 학습하고 판단하는 기술", answers: ["인공지능"] },
      { prompt: "ㄱㅎㅂㅎ", clue: "장기간에 걸쳐 기후 특성이 달라지는 현상", answers: ["기후변화", "기후 변화"] },
      { prompt: "ㄱㅈㅇㅈㅈㄱㅈ", clue: "여러 나라가 함께 운영하는 지구 궤도의 연구 시설", answers: ["국제우주정거장", "국제 우주 정거장"] },
      { prompt: "ㅂㄷㅊㅈㅈㅎㄹ", clue: "아주 작은 칩 안에 많은 전자 부품을 모은 회로", answers: ["반도체집적회로", "반도체 집적 회로"] },
      { prompt: "ㅈㅅㄱㄴㅂㅈ", clue: "미래 세대의 필요를 해치지 않는 발전 방식", answers: ["지속가능발전", "지속 가능한 발전"] },
      { prompt: "ㅇㅈㅇㅎ", clue: "원자보다 작은 세계의 현상을 다루는 물리학", answers: ["양자역학", "양자 역학"] },
      { prompt: "ㅅㅁㄷㅇㅅ", clue: "생물 종과 유전적 차이가 다양하게 존재하는 상태", answers: ["생물다양성", "생물 다양성"] },
      { prompt: "ㅈㅈㄱㅇㄷ", clue: "자기장의 변화로 전류가 생기는 현상", answers: ["전자기유도", "전자기 유도"] },
      { prompt: "ㄷㄹㅇㄷㅅ", clue: "대륙이 오랜 시간 이동한다는 학설", answers: ["대륙이동설", "대륙 이동설"] },
      { prompt: "ㅅㄷㅅㅇㄹ", clue: "아인슈타인이 정립한 시간과 공간에 관한 이론", answers: ["상대성이론", "상대성 이론"] },
      { prompt: "ㅁㅎㅅㄷㅈㅇ", clue: "문화를 그 사회의 맥락에서 이해하려는 태도", answers: ["문화상대주의", "문화 상대주의"] },
      { prompt: "ㅌㅅㅈㄹ", clue: "배출한 탄소와 흡수한 탄소의 양을 같게 만드는 목표", answers: ["탄소중립", "탄소 중립"] },
      { prompt: "ㄱㅈㅌㅎㄱㄱ", clue: "국가 간 통화 협력을 돕는 IMF의 우리말 이름", answers: ["국제통화기금", "국제 통화 기금"] },
      { prompt: "ㅇㅈㅈㅈㅈㅎ", clue: "유전 물질을 인위적으로 결합하는 생명공학 기술", answers: ["유전자재조합", "유전자 재조합"] },
      { prompt: "ㅎㅈㅇㅈㅂ", clue: "재난 안전과 지방 행정을 담당하는 중앙 행정기관", answers: ["행정안전부", "행정 안전부"] },
      { prompt: "ㄱㅇㄱㅎㅊㄷ", clue: "넓은 도시권을 빠르게 잇는 철도 체계", answers: ["광역급행철도", "광역 급행 철도"] },
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
      { prompt: "일주일은 모두 며칠일까요?", clue: "숫자", answers: ["7", "7일", "일주일", "칠일"] },
      { prompt: "봄, 여름, 가을, 겨울은 모두 몇 계절일까요?", clue: "숫자", answers: ["4", "4계절", "네계절", "네 계절"] },
      { prompt: "직각은 몇 도일까요?", clue: "각도", answers: ["90", "90도", "구십도"] },
      { prompt: "한 시간은 몇 분일까요?", clue: "시간", answers: ["60", "60분", "육십분"] },
      { prompt: "1킬로미터는 몇 미터일까요?", clue: "거리", answers: ["1000", "1000미터", "천미터", "천 미터"] },
      { prompt: "물이 얼어서 고체가 된 것을 무엇이라 할까요?", clue: "겨울", answers: ["얼음"] },
      { prompt: "해가 뜨는 방향은 어디일까요?", clue: "방향", answers: ["동쪽", "동"] },
      { prompt: "지구에서 가장 큰 육상 동물은 무엇일까요?", clue: "동물", answers: ["코끼리", "아프리카코끼리"] },
      { prompt: "빨간색과 파란색을 섞으면 일반적으로 어떤 색이 될까요?", clue: "색깔", answers: ["보라색", "보라"] },
      { prompt: "대한민국에서 사용하는 화폐 단위는 무엇일까요?", clue: "돈", answers: ["원", "원화"] },
      { prompt: "영어 알파벳은 모두 몇 글자일까요?", clue: "숫자", answers: ["26", "26개", "스물여섯", "스물여섯개"] },
      { prompt: "농구 경기에서 한 팀이 코트에서 뛰는 선수는 몇 명일까요?", clue: "스포츠", answers: ["5", "5명", "다섯명", "다섯 명"] },
      { prompt: "배구 경기에서 한 팀이 코트에서 뛰는 선수는 몇 명일까요?", clue: "스포츠", answers: ["6", "6명", "여섯명", "여섯 명"] },
      { prompt: "체스판의 칸은 모두 몇 개일까요?", clue: "보드게임", answers: ["64", "64칸", "육십사", "육십사칸"] },
      { prompt: "문어의 다리는 몇 개일까요?", clue: "바다 동물", answers: ["8", "8개", "여덟", "여덟개"] },
      { prompt: "우리나라의 새해 첫 달은 몇 월일까요?", clue: "달력", answers: ["1월", "일월", "1"] },
      { prompt: "지구 대기에서 가장 많은 비율을 차지하는 기체는 무엇일까요?", clue: "약 78%", answers: ["질소"] },
      { prompt: "원소 기호 Au는 어떤 원소일까요?", clue: "귀금속", answers: ["금"] },
      { prompt: "원소 기호 Na는 어떤 원소일까요?", clue: "소금의 주요 성분", answers: ["나트륨"] },
      { prompt: "적도의 위도는 몇 도일까요?", clue: "숫자", answers: ["0", "0도", "영도"] },
      { prompt: "세포 안에서 에너지를 생산해 '세포의 발전소'라 불리는 기관은 무엇일까요?", clue: "세포 소기관", answers: ["미토콘드리아"] },
      { prompt: "피가 날 때 혈액 응고에 중요한 역할을 하는 혈액 성분은 무엇일까요?", clue: "혈액", answers: ["혈소판"] },
      { prompt: "태양이 빛과 열을 내는 주된 에너지원은 어떤 반응일까요?", clue: "수소 원자핵이 결합해요", answers: ["핵융합", "핵융합반응", "핵융합 반응"] },
      { prompt: "직각삼각형에서 세 변의 길이 관계를 나타내는 정리는 무엇일까요?", clue: "수학자 이름", answers: ["피타고라스정리", "피타고라스의정리", "피타고라스 정리", "피타고라스의 정리"] },
      { prompt: "르네상스가 가장 먼저 시작된 유럽 국가는 어디일까요?", clue: "로마가 있는 나라", answers: ["이탈리아"] },
      { prompt: "수에즈 운하는 홍해와 어떤 바다를 연결할까요?", clue: "유럽 남쪽의 바다", answers: ["지중해"] },
      { prompt: "지구의 오존층이 주로 분포하는 대기층은 어디일까요?", clue: "대류권 위", answers: ["성층권"] },
      { prompt: "세계에서 가장 깊은 해구로 알려진 곳은 어디일까요?", clue: "태평양", answers: ["마리아나해구", "마리아나 해구"] },
      { prompt: "대륙 이동설을 주장한 독일의 과학자는 누구일까요?", clue: "알프레트", answers: ["베게너", "알프레트베게너", "알프레트 베게너"] },
      { prompt: "광합성 과정에서 식물이 흡수하는 대표적인 기체는 무엇일까요?", clue: "온실가스", answers: ["이산화탄소", "co2", "CO2"] },
      { prompt: "태양계 행성 중 자전 방향이 대부분의 행성과 반대인 행성은 무엇일까요?", clue: "샛별", answers: ["금성"] },
      { prompt: "소리가 전달되지 않는 공간 상태는 무엇일까요?", clue: "공기가 거의 없어요", answers: ["진공", "진공상태", "진공 상태"] },
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
    { answer: "강아지", clue: "동물" },
    { answer: "사과", clue: "과일" },
    { answer: "선풍기", clue: "여름 가전" },
    { answer: "기차", clue: "교통수단" },
    { answer: "거북이", clue: "동물" },
    { answer: "수박", clue: "여름 과일" },
    { answer: "마이크", clue: "노래" },
    { answer: "왕관", clue: "왕과 여왕" },
    { answer: "축구공", clue: "스포츠" },
    { answer: "달팽이", clue: "느린 동물" },
    { answer: "커피", clue: "음료" },
    { answer: "버스", clue: "교통수단" },
    { answer: "토끼", clue: "긴 귀" },
    { answer: "바나나", clue: "노란 과일" },
    { answer: "시계", clue: "시간" },
    { answer: "구름", clue: "하늘" },
    { answer: "롤러코스터", clue: "놀이공원" },
    { answer: "굴착기", clue: "건설 기계" },
    { answer: "천체망원경", clue: "우주 관측" },
    { answer: "풍력발전기", clue: "재생 에너지" },
    { answer: "잠수함", clue: "바닷속 교통수단" },
    { answer: "열기구", clue: "하늘을 나는 탈것" },
    { answer: "회전목마", clue: "놀이기구" },
    { answer: "신호등", clue: "도로 시설" },
    { answer: "소화기", clue: "화재 안전" },
    { answer: "드론", clue: "무인 비행체" },
    { answer: "인공위성", clue: "지구 궤도" },
    { answer: "에펠탑", clue: "프랑스 건축물" },
    { answer: "만리장성", clue: "중국의 유적" },
    { answer: "우주정거장", clue: "우주 연구 시설" },
    { answer: "현미경", clue: "과학 관찰 도구" },
    { answer: "태양광패널", clue: "재생 에너지 설비" },
  ]);
  const KOREAN_INITIALS = Object.freeze([
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  ]);
  const ACTIVITY_DIFFICULTIES = Object.freeze(["easy", "normal", "hard"]);
  const QUIZ_DIFFICULTY_RANGES = Object.freeze({
    initialQuiz: Object.freeze({ easy: [0, 16], normal: [16, 32], hard: [32, 48] }),
    triviaQuiz: Object.freeze({ easy: [16, 32], normal: [0, 16], hard: [32, 48] }),
  });
  const DRAWING_DIFFICULTY_RANGES = Object.freeze({
    easy: [0, 16],
    normal: [16, 32],
    hard: [32, 48],
  });

  function normalizeActivityDifficulty(difficulty) {
    return ACTIVITY_DIFFICULTIES.includes(difficulty) ? difficulty : "normal";
  }

  function getRangeItems(items, range) {
    if (!Array.isArray(range)) return [];
    return items.slice(range[0], range[1]).map((item, offset) => ({
      item,
      index: range[0] + offset,
    }));
  }

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

  function getQuizQuestion(game, seed, offset = 0, difficulty = "normal") {
    const bank = QUIZ_BANKS[game];
    if (!bank?.length) return null;
    const normalizedDifficulty = normalizeActivityDifficulty(difficulty);
    const pool = getRangeItems(bank, QUIZ_DIFFICULTY_RANGES[game]?.[normalizedDifficulty]);
    if (!pool.length) return null;
    const mixed = Math.imul(hashSeed(seed) ^ (game === "initialQuiz" ? 0x45d9f3b : 0x119de1f3), 2654435761) >>> 0;
    const poolIndex = (mixed + Math.max(0, Math.floor(Number(offset) || 0))) % pool.length;
    const { item: question, index } = pool[poolIndex];
    return {
      id: `${game}-${index}`,
      difficulty: normalizedDifficulty,
      prompt: game === "initialQuiz"
        ? getKoreanInitials(question.answers[0])
        : question.prompt,
      clue: question.clue,
      answers: [...question.answers],
    };
  }

  function getQuizQuestionAvoiding(game, seed, offset = 0, excludedIds = [], difficulty = "normal") {
    const excluded = new Set((excludedIds || []).map(String));
    const normalizedDifficulty = normalizeActivityDifficulty(difficulty);
    const range = QUIZ_DIFFICULTY_RANGES[game]?.[normalizedDifficulty];
    const poolLength = Array.isArray(range) ? range[1] - range[0] : 0;
    for (let step = 0; step < poolLength; step += 1) {
      const question = getQuizQuestion(game, seed, offset + step, normalizedDifficulty);
      if (question && !excluded.has(question.id)) return question;
    }
    return getQuizQuestion(game, seed, offset, normalizedDifficulty);
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

  function getDrawingWord(seed, offset = 0, difficulty = "normal") {
    const normalizedDifficulty = normalizeActivityDifficulty(difficulty);
    const pool = getRangeItems(DRAWING_WORDS, DRAWING_DIFFICULTY_RANGES[normalizedDifficulty]);
    const selected = getSeededItem(pool, seed, offset, 0x165667b1);
    return selected
      ? {
          id: `drawing-${selected.item.index}`,
          difficulty: normalizedDifficulty,
          answer: selected.item.item.answer,
          clue: selected.item.item.clue,
        }
      : null;
  }

  function getDrawingWordAvoiding(seed, offset = 0, excludedIds = [], difficulty = "normal") {
    const excluded = new Set((excludedIds || []).map(String));
    const normalizedDifficulty = normalizeActivityDifficulty(difficulty);
    const range = DRAWING_DIFFICULTY_RANGES[normalizedDifficulty];
    const poolLength = range[1] - range[0];
    for (let step = 0; step < poolLength; step += 1) {
      const word = getDrawingWord(seed, offset + step, normalizedDifficulty);
      if (word && !excluded.has(word.id)) return word;
    }
    return getDrawingWord(seed, offset, normalizedDifficulty);
  }

  return {
    QUIZ_BANKS,
    RPS_CHOICES,
    TELEPATHY_ROUNDS,
    DRAWING_WORDS,
    KOREAN_INITIALS,
    ACTIVITY_DIFFICULTIES,
    QUIZ_DIFFICULTY_RANGES,
    DRAWING_DIFFICULTY_RANGES,
    normalizeActivityDifficulty,
    getKoreanInitials,
    getQuizQuestion,
    getQuizQuestionAvoiding,
    normalizeAnswer,
    isCorrectAnswer,
    normalizeRpsChoice,
    resolveRps,
    buildRpsStage,
    getTelepathyRound,
    resolveTelepathyChoices,
    getDrawingWord,
    getDrawingWordAvoiding,
  };
});
