const STORAGE_KEY = "friend-bet-games-v2";
const LEGACY_STORAGE_KEY = "friend-bet-games-v1";
const MAX_PARTICIPANTS = 12;
const MAX_OPTIONS = 12;
const MAX_MISSIONS = 16;
const MAX_SAVED_GROUPS = 5;
const HISTORY_LIMIT = 5;
const DODGE_WIDTH = 800;
const DODGE_HEIGHT = 1000;
const DODGE_SIDE_START = 5000;
const RUNNER_WIDTH = 960;
const RUNNER_HEIGHT = 800;
const RUNNER_GROUND_Y = 670;
const RUNNER_FEVER_DURATION = 6000;
const RUNNER_MAGNET_DURATION = 7000;
const RUNNER_INGREDIENT_TYPES = ["bread", "cream", "berry"];
const STACK_WIDTH = 720;
const STACK_HEIGHT = 900;
const STACK_BLOCK_HEIGHT = 58;
const STACK_BASE_Y = 760;
const STACK_PERFECT_TOLERANCE = 7;
const STACK_COLORS = ["#ff786e", "#ffd45b", "#5fc7bb", "#6f8ee8", "#ef9f53"];
const FRUIT_WIDTH = 720;
const FRUIT_HEIGHT = 900;
const FRUIT_DROP_Y = 275;
const FRUIT_DANGER_Y = 370;
const FRUIT_DROP_COOLDOWN = 460;
const FRUIT_DANGER_DURATION = 1800;
const FRUIT_TIERS = FruitGameLogic.tiers;
const DEFAULT_PARTICIPANTS = ["민지", "준호", "서연", "태윤"];
const DEFAULT_OPTIONS = ["한식", "분식", "중식", "일식", "치킨", "피자"];
const DEFAULT_MISSIONS = [
  "노래 한 소절 부르기",
  "단체 사진 포즈 정하기",
  "다음 게임 진행 맡기",
  "모두에게 칭찬 한마디 하기",
  "재미있는 표정으로 사진 찍기",
  "간식 메뉴 정하기",
  "10초 동안 춤추기",
  "다음 모임 장소 정하기",
];
const DEFAULT_STAKE = "커피 사기";
const WHEEL_COLORS = [
  "#ff5d4c",
  "#ffd54a",
  "#179f92",
  "#4676e8",
  "#9b6fe8",
  "#ff9f3f",
];
const TEAM_COLORS = ["#ffd54a", "#90ddd6", "#a9c0f5", "#ff9f92"];
const FINGER_COLORS = ["#ff5d4c", "#ffd54a", "#179f92", "#4676e8", "#9b6fe8"];
const PARTY_SCORE_GAMES = new Set([
  "wheel",
  "bomb",
  "cards",
  "draw",
  "finger",
  "reaction",
  "timer",
]);
const GAME_LABELS = {
  wheel: "돌려돌려 룰렛",
  bomb: "폭탄 돌리기",
  cards: "복불복 카드",
  order: "순서 정하기",
  teams: "팀 나누기",
  draw: "제비뽑기",
  ladder: "사다리 타기",
  menu: "메뉴 룰렛",
  seats: "자리 배치",
  tournament: "선택 토너먼트",
  finger: "손가락 뽑기",
  reaction: "반응속도 대결",
  timer: "5초 타이머",
  dodge: "장애물 피하기",
  tap: "10초 연타",
  runner: "간식 재료 러너",
  stack: "아슬아슬 탑 쌓기",
  fruit: "몽글 과일 합치기",
};

const elements = {
  setupPanel: document.querySelector("#setupPanel"),
  setupToggle: document.querySelector("#setupToggle"),
  setupToggleLabel: document.querySelector(".setup-toggle-label"),
  setupContent: document.querySelector("#setupContent"),
  setupSummary: document.querySelector("#setupSummary"),
  setupSummaryMembers: document.querySelector("#setupSummaryMembers"),
  setupSummaryStake: document.querySelector("#setupSummaryStake"),
  participantForm: document.querySelector("#participantForm"),
  participantInput: document.querySelector("#participantInput"),
  participantList: document.querySelector("#participantList"),
  participantCount: document.querySelector("#participantCount"),
  bulkToggle: document.querySelector("#bulkToggle"),
  bulkEditor: document.querySelector("#bulkEditor"),
  bulkParticipantInput: document.querySelector("#bulkParticipantInput"),
  bulkReplace: document.querySelector("#bulkReplace"),
  bulkAppend: document.querySelector("#bulkAppend"),
  shuffleParticipants: document.querySelector("#shuffleParticipants"),
  clearParticipants: document.querySelector("#clearParticipants"),
  savedGroupSelect: document.querySelector("#savedGroupSelect"),
  loadGroup: document.querySelector("#loadGroup"),
  saveGroup: document.querySelector("#saveGroup"),
  deleteGroup: document.querySelector("#deleteGroup"),
  noRepeatToggle: document.querySelector("#noRepeatToggle"),
  stakePresets: document.querySelector("#stakePresets"),
  customStake: document.querySelector("#customStake"),
  missionForm: document.querySelector("#missionForm"),
  missionInput: document.querySelector("#missionInput"),
  missionList: document.querySelector("#missionList"),
  resetMissions: document.querySelector("#resetMissions"),
  gameChoiceTitle: document.querySelector("#game-choice-title"),
  currentStakeBadge: document.querySelector("#currentStakeBadge"),
  resultHistory: document.querySelector("#resultHistory"),
  clearHistory: document.querySelector("#clearHistory"),
  playModeButtons: [...document.querySelectorAll("[data-play-mode]")],
  gameCategoryControl: document.querySelector("#gameCategoryControl"),
  soloModeNote: document.querySelector("#soloModeNote"),
  partySession: document.querySelector("#partySession"),
  partySessionStatus: document.querySelector("#party-session-title"),
  partyStartButtons: [...document.querySelectorAll("[data-party-rounds]")],
  endPartySession: document.querySelector("#endPartySession"),
  partyScoreboard: document.querySelector("#partyScoreboard"),
  gameCategoryButtons: [
    ...document.querySelectorAll("[data-game-category]"),
  ],
  gameTabs: [...document.querySelectorAll(".game-tab")],
  gameViews: {
    wheel: document.querySelector("#wheelGame"),
    bomb: document.querySelector("#bombGame"),
    cards: document.querySelector("#cardsGame"),
    order: document.querySelector("#orderGame"),
    teams: document.querySelector("#teamsGame"),
    draw: document.querySelector("#drawGame"),
    ladder: document.querySelector("#ladderGame"),
    menu: document.querySelector("#menuGame"),
    seats: document.querySelector("#seatsGame"),
    tournament: document.querySelector("#tournamentGame"),
    finger: document.querySelector("#fingerGame"),
    reaction: document.querySelector("#reactionGame"),
    timer: document.querySelector("#timerGame"),
    dodge: document.querySelector("#dodgeGame"),
    tap: document.querySelector("#tapGame"),
    runner: document.querySelector("#runnerGame"),
    stack: document.querySelector("#stackGame"),
    fruit: document.querySelector("#fruitGame"),
  },
  wheelCanvas: document.querySelector("#wheelCanvas"),
  wheelStatus: document.querySelector("#wheelStatus"),
  spinButton: document.querySelector("#spinButton"),
  bombVisual: document.querySelector("#bombVisual"),
  bombStatus: document.querySelector("#bombStatus"),
  bombHolder: document.querySelector("#bombHolder"),
  bombButton: document.querySelector("#bombButton"),
  cardGrid: document.querySelector("#cardGrid"),
  cardStatus: document.querySelector("#cardStatus"),
  shuffleButton: document.querySelector("#shuffleButton"),
  orderList: document.querySelector("#orderList"),
  orderStatus: document.querySelector("#orderStatus"),
  orderButton: document.querySelector("#orderButton"),
  teamCountControl: document.querySelector("#teamCountControl"),
  teamBoard: document.querySelector("#teamBoard"),
  teamStatus: document.querySelector("#teamStatus"),
  teamButton: document.querySelector("#teamButton"),
  drawStatus: document.querySelector("#drawStatus"),
  drawCount: document.querySelector("#drawCount"),
  drawMinus: document.querySelector("#drawMinus"),
  drawPlus: document.querySelector("#drawPlus"),
  drawTicketBoard: document.querySelector("#drawTicketBoard"),
  drawButton: document.querySelector("#drawButton"),
  ladderStatus: document.querySelector("#ladderStatus"),
  ladderPlayers: document.querySelector("#ladderPlayers"),
  ladderCanvas: document.querySelector("#ladderCanvas"),
  ladderResult: document.querySelector("#ladderResult"),
  ladderButton: document.querySelector("#ladderButton"),
  optionForms: [...document.querySelectorAll("[data-option-form]")],
  optionInputs: [...document.querySelectorAll("[data-option-input]")],
  optionLists: [...document.querySelectorAll("[data-option-list]")],
  optionResetButtons: [...document.querySelectorAll("[data-option-reset]")],
  menuStatus: document.querySelector("#menuStatus"),
  menuWheelCanvas: document.querySelector("#menuWheelCanvas"),
  menuButton: document.querySelector("#menuButton"),
  seatStatus: document.querySelector("#seatStatus"),
  seatColumnControl: document.querySelector("#seatColumnControl"),
  seatBoard: document.querySelector("#seatBoard"),
  seatButton: document.querySelector("#seatButton"),
  tournamentStatus: document.querySelector("#tournamentStatus"),
  tournamentProgress: document.querySelector("#tournamentProgress"),
  tournamentMatch: document.querySelector("#tournamentMatch"),
  tournamentButton: document.querySelector("#tournamentButton"),
  fingerStatus: document.querySelector("#fingerStatus"),
  fingerArena: document.querySelector("#fingerArena"),
  fingerCount: document.querySelector("#fingerCount"),
  fingerReset: document.querySelector("#fingerReset"),
  fingerFallback: document.querySelector("#fingerFallback"),
  reactionStatus: document.querySelector("#reactionStatus"),
  reactionKicker: document.querySelector("#reactionKicker"),
  reactionHeading: document.querySelector("#reactionHeading"),
  reactionTabTitle: document.querySelector("#reactionTabTitle"),
  reactionTabDescription: document.querySelector("#reactionTabDescription"),
  reactionDuelStage: document.querySelector("#reactionDuelStage"),
  reactionSoloStage: document.querySelector("#reactionSoloStage"),
  reactionArena: document.querySelector("#reactionArena"),
  reactionSignal: document.querySelector("#reactionSignal"),
  reactionLeft: document.querySelector("#reactionLeft"),
  reactionRight: document.querySelector("#reactionRight"),
  reactionLeftName: document.querySelector("#reactionLeftName"),
  reactionRightName: document.querySelector("#reactionRightName"),
  reactionLeftScore: document.querySelector("#reactionLeftScore"),
  reactionRightScore: document.querySelector("#reactionRightScore"),
  reactionReset: document.querySelector("#reactionReset"),
  reactionStart: document.querySelector("#reactionStart"),
  reactionSoloPad: document.querySelector("#reactionSoloPad"),
  reactionSoloSignal: document.querySelector("#reactionSoloSignal"),
  reactionSoloHint: document.querySelector("#reactionSoloHint"),
  reactionSoloBest: document.querySelector("#reactionSoloBest"),
  reactionSoloLast: document.querySelector("#reactionSoloLast"),
  reactionSoloReset: document.querySelector("#reactionSoloReset"),
  reactionSoloStart: document.querySelector("#reactionSoloStart"),
  timerStatus: document.querySelector("#timerStatus"),
  timerKicker: document.querySelector("#timerKicker"),
  timerHeading: document.querySelector("#timerHeading"),
  timerTabTitle: document.querySelector("#timerTabTitle"),
  timerTabDescription: document.querySelector("#timerTabDescription"),
  timerGroupStage: document.querySelector("#timerGroupStage"),
  timerSoloStage: document.querySelector("#timerSoloStage"),
  timerBoard: document.querySelector("#timerBoard"),
  timerPlayer: document.querySelector("#timerPlayer"),
  timerDisplay: document.querySelector("#timerDisplay"),
  timerResults: document.querySelector("#timerResults"),
  timerReset: document.querySelector("#timerReset"),
  timerStart: document.querySelector("#timerStart"),
  timerSoloBoard: document.querySelector("#timerSoloBoard"),
  timerSoloDisplay: document.querySelector("#timerSoloDisplay"),
  timerSoloRoundLabel: document.querySelector("#timerSoloRoundLabel"),
  timerSoloResults: document.querySelector("#timerSoloResults"),
  timerSoloBest: document.querySelector("#timerSoloBest"),
  timerSoloProgress: document.querySelector("#timerSoloProgress"),
  timerSoloReset: document.querySelector("#timerSoloReset"),
  timerSoloStart: document.querySelector("#timerSoloStart"),
  dodgeStatus: document.querySelector("#dodgeStatus"),
  dodgeArena: document.querySelector("#dodgeArena"),
  dodgeCanvas: document.querySelector("#dodgeCanvas"),
  dodgeTime: document.querySelector("#dodgeTime"),
  dodgeBest: document.querySelector("#dodgeBest"),
  dodgePrompt: document.querySelector("#dodgePrompt"),
  dodgeReset: document.querySelector("#dodgeReset"),
  dodgeStart: document.querySelector("#dodgeStart"),
  tapStatus: document.querySelector("#tapStatus"),
  tapPad: document.querySelector("#tapPad"),
  tapCount: document.querySelector("#tapCount"),
  tapPrompt: document.querySelector("#tapPrompt"),
  tapTime: document.querySelector("#tapTime"),
  tapBest: document.querySelector("#tapBest"),
  tapSpeed: document.querySelector("#tapSpeed"),
  tapReset: document.querySelector("#tapReset"),
  tapStart: document.querySelector("#tapStart"),
  runnerStatus: document.querySelector("#runnerStatus"),
  runnerArena: document.querySelector("#runnerArena"),
  runnerCanvas: document.querySelector("#runnerCanvas"),
  runnerScore: document.querySelector("#runnerScore"),
  runnerDistance: document.querySelector("#runnerDistance"),
  runnerBest: document.querySelector("#runnerBest"),
  runnerBread: document.querySelector("#runnerBread"),
  runnerCream: document.querySelector("#runnerCream"),
  runnerBerry: document.querySelector("#runnerBerry"),
  runnerSnacks: document.querySelector("#runnerSnacks"),
  runnerFever: document.querySelector("#runnerFever"),
  runnerFeverBar: document.querySelector("#runnerFeverBar"),
  runnerEffect: document.querySelector("#runnerEffect"),
  runnerPrompt: document.querySelector("#runnerPrompt"),
  runnerReset: document.querySelector("#runnerReset"),
  runnerStart: document.querySelector("#runnerStart"),
  stackStatus: document.querySelector("#stackStatus"),
  stackArena: document.querySelector("#stackArena"),
  stackCanvas: document.querySelector("#stackCanvas"),
  stackScore: document.querySelector("#stackScore"),
  stackBest: document.querySelector("#stackBest"),
  stackCombo: document.querySelector("#stackCombo"),
  stackPrompt: document.querySelector("#stackPrompt"),
  stackReset: document.querySelector("#stackReset"),
  stackStart: document.querySelector("#stackStart"),
  fruitStatus: document.querySelector("#fruitStatus"),
  fruitArena: document.querySelector("#fruitArena"),
  fruitCanvas: document.querySelector("#fruitCanvas"),
  fruitScore: document.querySelector("#fruitScore"),
  fruitBest: document.querySelector("#fruitBest"),
  fruitTop: document.querySelector("#fruitTop"),
  fruitDanger: document.querySelector("#fruitDanger"),
  fruitPrompt: document.querySelector("#fruitPrompt"),
  fruitNextCanvas: document.querySelector("#fruitNextCanvas"),
  fruitNextName: document.querySelector("#fruitNextName"),
  fruitReset: document.querySelector("#fruitReset"),
  fruitStart: document.querySelector("#fruitStart"),
  resultDialog: document.querySelector("#resultDialog"),
  closeResult: document.querySelector("#closeResult"),
  resultGameLabel: document.querySelector("#resultGameLabel"),
  resultLead: document.querySelector("#resultLead"),
  resultName: document.querySelector("#resultName"),
  resultStakeLabel: document.querySelector("#resultStakeLabel"),
  resultStake: document.querySelector("#resultStake"),
  resultParty: document.querySelector("#resultParty"),
  resultMission: document.querySelector("#resultMission"),
  resultMissionText: document.querySelector("#resultMissionText"),
  drawMission: document.querySelector("#drawMission"),
  playAgain: document.querySelector("#playAgain"),
  shareResult: document.querySelector("#shareResult"),
  copyResult: document.querySelector("#copyResult"),
  changeGame: document.querySelector("#changeGame"),
  toast: document.querySelector("#toast"),
};

const savedState = loadState();
const state = {
  participants: savedState.participants,
  options: savedState.options,
  missions: savedState.missions,
  stake: savedState.stake,
  teamCount: savedState.teamCount,
  drawCount: savedState.drawCount,
  seatColumns: savedState.seatColumns,
  savedGroups: savedState.savedGroups,
  noRepeat: savedState.noRepeat,
  history: savedState.history,
  dodgeBest: savedState.dodgeBest,
  reactionSoloBest: savedState.reactionSoloBest,
  timerSoloBest: savedState.timerSoloBest,
  tapBest: savedState.tapBest,
  runnerBest: savedState.runnerBest,
  runnerBestDistance: savedState.runnerBestDistance,
  stackBest: savedState.stackBest,
  fruitBest: savedState.fruitBest,
  fruitBestTier: savedState.fruitBestTier,
  currentGame: "wheel",
  currentMode: "together",
  currentCategory: "quick",
  lastResult: null,
  lastMission: null,
  partySession: null,
  excludedWinners: [],
  setupCollapsed: false,
};

let wheelRotation = 0;
let wheelSpinning = false;
let menuWheelRotation = 0;
let menuWheelSpinning = false;
let bombRunning = false;
let bombTimer = null;
let bombRevealTimer = null;
let bombHolderIndex = 0;
let cardRound = null;
let orderRound = null;
let teamRound = null;
let drawRound = null;
let drawTimer = null;
let ladderRound = null;
let ladderRevealTimer = null;
let seatRound = null;
let tournamentRound = null;
let fingerTouches = new Map();
let fingerPickTimer = null;
let fingerSequence = 0;
let fingerWinner = null;
let reactionTimer = null;
let reactionPhase = "idle";
let reactionGoAt = 0;
let reactionScores = [0, 0];
let reactionSoloTimer = null;
let reactionSoloPhase = "idle";
let reactionSoloGoAt = 0;
let reactionSoloLast = null;
let timerRound = null;
let timerRunning = false;
let timerStartedAt = 0;
let timerAnimationFrame = null;
let timerSoloRound = null;
let timerSoloRunning = false;
let timerSoloStartedAt = 0;
let timerSoloAnimationFrame = null;
let dodgePhase = "idle";
let dodgeAnimationFrame = null;
let dodgeLastFrame = 0;
let dodgeCountdown = 0;
let dodgeElapsed = 0;
let dodgeNextDrop = 0;
let dodgeNextSide = DODGE_SIDE_START;
let dodgeNextDoubleWave = 10000;
let dodgeNextDangerWave = 25000;
let dodgePendingSideWave = null;
let dodgePlayer = null;
let dodgeObstacles = [];
let dodgeWarnings = [];
let dodgePointerId = null;
let dodgeDifficultyTier = -1;
const dodgeKeys = new Set();
let tapPhase = "idle";
let tapPhaseStartedAt = 0;
let tapCount = 0;
let tapAnimationFrame = null;
let runnerPhase = "idle";
let runnerAnimationFrame = null;
let runnerLastFrame = 0;
let runnerCountdown = 0;
let runnerElapsed = 0;
let runnerDistanceValue = 0;
let runnerScoreValue = 0;
let runnerIngredientScore = 0;
let runnerSpeed = 430;
let runnerNextObstacle = 0;
let runnerNextIngredient = 0;
let runnerNextItem = 0;
let runnerPlayer = null;
let runnerObstacles = [];
let runnerIngredients = [];
let runnerItems = [];
let runnerRecipe = { bread: 0, cream: 0, berry: 0 };
let runnerSnackCount = 0;
let runnerCombo = 0;
let runnerFever = 0;
let runnerFeverUntil = 0;
let runnerFeverCount = 0;
let runnerMagnetUntil = 0;
let runnerShield = 0;
let runnerInvulnerableUntil = 0;
let stackPhase = "idle";
let stackAnimationFrame = null;
let stackLastFrame = 0;
let stackBlocks = [];
let stackActive = null;
let stackFragments = [];
let stackScoreValue = 0;
let stackComboValue = 0;
let stackPeakCombo = 0;
let stackCamera = 0;
let stackFeedback = null;
let fruitPhase = "idle";
let fruitEngine = null;
let fruitAnimationFrame = null;
let fruitLastFrame = 0;
let fruitBodies = [];
let fruitMergeQueue = [];
let fruitEffects = [];
let fruitScoreValue = 0;
let fruitHighestTier = 0;
let fruitCurrentTier = 0;
let fruitNextTier = 0;
let fruitAimX = FRUIT_WIDTH / 2;
let fruitCanDropAt = 0;
let fruitDropSequence = 0;
let fruitDangerValue = 0;
let fruitCompletionTimer = null;
let resultRevealTimer = null;
let toastTimer = null;

function sanitizeTextList(values, maxItems, maxLength) {
  if (!Array.isArray(values)) return [];

  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    if (typeof value !== "string") return;
    const text = value.trim().slice(0, maxLength);
    const key = text.toLocaleLowerCase("ko");
    if (!text || seen.has(key) || result.length >= maxItems) return;
    seen.add(key);
    result.push(text);
  });
  return result;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsed = JSON.parse(stored || legacy || "null");
    const hasStoredState = Boolean(stored || legacy);
    const participants = sanitizeTextList(
      parsed?.participants,
      MAX_PARTICIPANTS,
      12,
    );
    const options = sanitizeTextList(parsed?.options, MAX_OPTIONS, 18);
    const missions = Array.isArray(parsed?.missions)
      ? sanitizeTextList(parsed.missions, MAX_MISSIONS, 30)
      : [...DEFAULT_MISSIONS];
    const stake =
      typeof parsed?.stake === "string" && parsed.stake.trim()
        ? parsed.stake.trim().slice(0, 30)
        : DEFAULT_STAKE;
    const teamCount = [2, 3, 4].includes(parsed?.teamCount) ? parsed.teamCount : 2;
    const drawCount = Number.isInteger(parsed?.drawCount)
      ? Math.min(Math.max(parsed.drawCount, 1), 5)
      : 1;
    const seatColumns = [2, 3, 4].includes(parsed?.seatColumns)
      ? parsed.seatColumns
      : 3;
    const savedGroups = Array.isArray(parsed?.savedGroups)
      ? parsed.savedGroups
          .map((group, index) => ({
            id:
              typeof group?.id === "string" && group.id
                ? group.id
                : `saved-${index}`,
            name:
              typeof group?.name === "string" && group.name.trim()
                ? group.name.trim().slice(0, 30)
                : `저장한 멤버 ${index + 1}`,
            members: sanitizeTextList(
              group?.members,
              MAX_PARTICIPANTS,
              12,
            ),
          }))
          .filter((group) => group.members.length >= 2)
          .slice(0, MAX_SAVED_GROUPS)
      : [];
    const history = Array.isArray(parsed?.history)
      ? parsed.history
          .filter(
            (entry) =>
              typeof entry?.game === "string" &&
              typeof entry?.summary === "string" &&
              typeof entry?.copyText === "string",
          )
          .map((entry, index) => ({
            id:
              typeof entry.id === "string"
                ? entry.id
                : `history-${Date.now()}-${index}`,
            game: entry.game,
            gameLabel:
              typeof entry.gameLabel === "string"
                ? entry.gameLabel.slice(0, 30)
                : "",
            summary: entry.summary.slice(0, 120),
            copyText: entry.copyText.slice(0, 1000),
            mission:
              typeof entry.mission === "string"
                ? entry.mission.slice(0, 30)
                : "",
            createdAt: Number(entry.createdAt) || Date.now(),
          }))
          .slice(0, HISTORY_LIMIT)
      : [];
    const readOptionalRecord = (value, maximum) => {
      if (value === null || value === undefined || value === "") return null;
      const number = Number(value);
      return Number.isFinite(number)
        ? Math.min(Math.max(number, 0), maximum)
        : null;
    };
    const dodgeBest = readOptionalRecord(parsed?.dodgeBest, 3600000) || 0;
    const reactionSoloBest = readOptionalRecord(
      parsed?.reactionSoloBest,
      10000,
    );
    const timerSoloBest = readOptionalRecord(parsed?.timerSoloBest, 5000);
    const tapBest = Math.round(
      readOptionalRecord(parsed?.tapBest, 10000) || 0,
    );
    const runnerBest = Math.round(
      readOptionalRecord(parsed?.runnerBest, 999999999) || 0,
    );
    const runnerBestDistance = Math.round(
      readOptionalRecord(parsed?.runnerBestDistance, 10000000) || 0,
    );
    const stackBest = Math.round(
      readOptionalRecord(parsed?.stackBest, 10000) || 0,
    );
    const fruitBest = Math.round(
      readOptionalRecord(parsed?.fruitBest, 999999999) || 0,
    );
    const fruitBestTier = Math.round(
      readOptionalRecord(parsed?.fruitBestTier, FRUIT_TIERS.length - 1) || 0,
    );

    return {
      participants: hasStoredState ? participants : [...DEFAULT_PARTICIPANTS],
      options: options.length ? options : [...DEFAULT_OPTIONS],
      missions,
      stake,
      teamCount,
      drawCount,
      seatColumns,
      savedGroups,
      noRepeat: Boolean(parsed?.noRepeat),
      history,
      dodgeBest,
      reactionSoloBest,
      timerSoloBest,
      tapBest,
      runnerBest,
      runnerBestDistance,
      stackBest,
      fruitBest,
      fruitBestTier,
      hasStoredState,
    };
  } catch {
    return {
      participants: [...DEFAULT_PARTICIPANTS],
      options: [...DEFAULT_OPTIONS],
      missions: [...DEFAULT_MISSIONS],
      stake: DEFAULT_STAKE,
      teamCount: 2,
      drawCount: 1,
      seatColumns: 3,
      savedGroups: [],
      noRepeat: false,
      history: [],
      dodgeBest: 0,
      reactionSoloBest: null,
      timerSoloBest: null,
      tapBest: 0,
      runnerBest: 0,
      runnerBestDistance: 0,
      stackBest: 0,
      fruitBest: 0,
      fruitBestTier: 0,
      hasStoredState: false,
    };
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        participants: state.participants,
        options: state.options,
        missions: state.missions,
        stake: state.stake,
        teamCount: state.teamCount,
        drawCount: state.drawCount,
        seatColumns: state.seatColumns,
        savedGroups: state.savedGroups,
        noRepeat: state.noRepeat,
        history: state.history,
        dodgeBest: state.dodgeBest,
        reactionSoloBest: state.reactionSoloBest,
        timerSoloBest: state.timerSoloBest,
        tapBest: state.tapBest,
        runnerBest: state.runnerBest,
        runnerBestDistance: state.runnerBestDistance,
        stackBest: state.stackBest,
        fruitBest: state.fruitBest,
        fruitBestTier: state.fruitBestTier,
      }),
    );
  } catch {
    // The games remain usable when browser storage is unavailable.
  }
}

function randomInt(max) {
  if (!Number.isInteger(max) || max <= 0) return 0;
  if (window.crypto?.getRandomValues) {
    const range = 0x100000000;
    const limit = range - (range % max);
    const values = new Uint32Array(1);
    do {
      window.crypto.getRandomValues(values);
    } while (values[0] >= limit);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2200);
}

function hasEnoughParticipants(minimum = 2) {
  if (state.participants.length >= minimum) return true;
  showToast(`참가자를 ${minimum}명 이상 추가해 주세요.`);
  if (window.matchMedia("(max-width: 1240px)").matches) {
    setSetupCollapsed(false);
  }
  elements.participantInput.focus();
  return false;
}

function hasEnoughOptions(minimum = 2) {
  if (state.options.length >= minimum) return true;
  showToast(`후보를 ${minimum}개 이상 추가해 주세요.`);
  return false;
}

function updateSetupSummary() {
  const members =
    state.participants.length > 0
      ? `${state.participants.length}명 · ${state.participants.slice(0, 3).join(", ")}${
          state.participants.length > 3 ? " 외" : ""
        }`
      : "참가자 없음";
  elements.setupSummaryMembers.textContent = members;
  elements.setupSummaryStake.textContent = state.stake;
}

function setSetupCollapsed(collapsed) {
  const mobile = window.matchMedia("(max-width: 1240px)").matches;
  state.setupCollapsed = mobile && collapsed;
  elements.setupContent.hidden = state.setupCollapsed;
  elements.setupSummary.hidden = !state.setupCollapsed;
  elements.setupToggle.setAttribute(
    "aria-expanded",
    String(!state.setupCollapsed),
  );
  elements.setupToggle.setAttribute(
    "aria-label",
    state.setupCollapsed ? "설정 열기" : "설정 접기",
  );
  elements.setupToggleLabel.textContent = state.setupCollapsed
    ? "설정 열기"
    : "설정 접기";
  elements.setupPanel.classList.toggle("is-collapsed", state.setupCollapsed);
  updateSetupSummary();
}

function renderParticipants() {
  window.clearTimeout(resultRevealTimer);
  if (state.partySession) stopPartySession(false);
  elements.participantList.replaceChildren();

  if (state.participants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "inline-empty";
    empty.textContent = "이름을 추가하면 게임을 시작할 수 있어요.";
    elements.participantList.append(empty);
  } else {
    state.participants.forEach((name, index) => {
      const chip = document.createElement("span");
      chip.className = "participant-chip";

      const label = document.createElement("span");
      label.textContent = name;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.setAttribute("aria-label", `${name} 삭제`);
      removeButton.textContent = "×";
      removeButton.addEventListener("click", () => removeParticipant(index));

      chip.append(label, removeButton);
      elements.participantList.append(chip);
    });
  }

  elements.participantCount.textContent = `${state.participants.length}명 참여 · 최소 2명, 최대 ${MAX_PARTICIPANTS}명`;
  state.excludedWinners = state.excludedWinners.filter((name) =>
    state.participants.includes(name),
  );
  updateSetupSummary();
  normalizeDrawCount();
  normalizeTeamCount();
  drawWheel();
  resetBomb();
  dealCards();
  resetOrder();
  resetTeams();
  resetDraw();
  resetLadder();
  resetSeats();
  resetFinger();
  resetReaction(true);
  resetTimer();
  updateGameAvailability();
}

function addParticipant(rawName) {
  const name = rawName.trim().slice(0, 12);
  if (!name) {
    showToast("이름을 입력해 주세요.");
    return;
  }
  if (state.participants.length >= MAX_PARTICIPANTS) {
    showToast(`참가자는 최대 ${MAX_PARTICIPANTS}명까지 추가할 수 있어요.`);
    return;
  }
  if (
    state.participants.some(
      (participant) =>
        participant.toLocaleLowerCase("ko") === name.toLocaleLowerCase("ko"),
    )
  ) {
    showToast("같은 이름이 이미 있어요.");
    return;
  }

  state.participants.push(name);
  elements.participantInput.value = "";
  saveState();
  renderParticipants();
  elements.participantInput.focus();
}

function removeParticipant(index) {
  state.participants.splice(index, 1);
  saveState();
  renderParticipants();
}

function parseBulkParticipants() {
  return sanitizeTextList(
    elements.bulkParticipantInput.value.split(/[\n,;]+/),
    MAX_PARTICIPANTS,
    12,
  );
}

function applyBulkParticipants(mode) {
  const names = parseBulkParticipants();
  if (!names.length) {
    showToast("추가할 이름을 입력해 주세요.");
    return;
  }

  if (mode === "replace") {
    state.participants = names;
  } else {
    state.participants = sanitizeTextList(
      [...state.participants, ...names],
      MAX_PARTICIPANTS,
      12,
    );
  }

  elements.bulkParticipantInput.value = "";
  state.excludedWinners = [];
  saveState();
  renderParticipants();
  showToast(
    mode === "replace"
      ? `${state.participants.length}명의 명단으로 바꿨어요.`
      : `${state.participants.length}명이 준비됐어요.`,
  );
}

function clearAllParticipants() {
  if (
    state.participants.length > 0 &&
    !window.confirm("현재 참가자 명단을 모두 삭제할까요?")
  ) {
    return;
  }
  state.participants = [];
  state.excludedWinners = [];
  saveState();
  renderParticipants();
  elements.participantInput.focus();
}

function shuffleParticipantOrder() {
  if (!state.participants.length) {
    showToast("먼저 참가자를 추가해 주세요.");
    return;
  }
  state.participants = shuffle(state.participants);
  saveState();
  renderParticipants();
  showToast("참가자 순서를 섞었어요.");
}

function groupSignature(members) {
  return [...members]
    .map((name) => name.toLocaleLowerCase("ko"))
    .sort()
    .join("|");
}

function renderSavedGroups() {
  const selectedId = elements.savedGroupSelect.value;
  elements.savedGroupSelect.replaceChildren();

  if (!state.savedGroups.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "저장한 멤버 없음";
    elements.savedGroupSelect.append(option);
  } else {
    state.savedGroups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = `${group.name} · ${group.members.length}명`;
      elements.savedGroupSelect.append(option);
    });
    if (state.savedGroups.some((group) => group.id === selectedId)) {
      elements.savedGroupSelect.value = selectedId;
    }
  }

  const disabled = !state.savedGroups.length;
  elements.savedGroupSelect.disabled = disabled;
  elements.loadGroup.disabled = disabled;
  elements.deleteGroup.disabled = disabled;
  elements.saveGroup.disabled = state.participants.length < 2;
}

function saveCurrentGroup() {
  if (state.participants.length < 2) {
    showToast("저장할 참가자를 2명 이상 준비해 주세요.");
    return;
  }

  const signature = groupSignature(state.participants);
  const existing = state.savedGroups.find(
    (group) => groupSignature(group.members) === signature,
  );
  if (existing) {
    existing.members = [...state.participants];
    existing.name =
      state.participants.length > 2
        ? `${state.participants[0]}, ${state.participants[1]} 외 ${
            state.participants.length - 2
          }명`
        : state.participants.join(", ");
    elements.savedGroupSelect.value = existing.id;
    saveState();
    renderSavedGroups();
    showToast("저장한 멤버를 업데이트했어요.");
    return;
  }

  const group = {
    id: `group-${Date.now()}-${randomInt(10000)}`,
    name:
      state.participants.length > 2
        ? `${state.participants[0]}, ${state.participants[1]} 외 ${
            state.participants.length - 2
          }명`
        : state.participants.join(", "),
    members: [...state.participants],
  };
  state.savedGroups.unshift(group);
  state.savedGroups = state.savedGroups.slice(0, MAX_SAVED_GROUPS);
  saveState();
  renderSavedGroups();
  elements.savedGroupSelect.value = group.id;
  showToast("현재 멤버를 저장했어요.");
}

function loadSelectedGroup() {
  const group = state.savedGroups.find(
    (item) => item.id === elements.savedGroupSelect.value,
  );
  if (!group) return;
  state.participants = [...group.members];
  state.excludedWinners = [];
  saveState();
  renderParticipants();
  showToast(`${group.name} 멤버를 불러왔어요.`);
}

function deleteSelectedGroup() {
  const group = state.savedGroups.find(
    (item) => item.id === elements.savedGroupSelect.value,
  );
  if (!group) return;
  state.savedGroups = state.savedGroups.filter((item) => item.id !== group.id);
  saveState();
  renderSavedGroups();
  showToast("저장한 멤버를 삭제했어요.");
}

function setStake(value, source = "preset") {
  const stake = value.trim().slice(0, 30);
  if (!stake) return;

  state.stake = stake;
  elements.currentStakeBadge.textContent = stake;
  [...elements.stakePresets.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle(
      "is-active",
      source === "preset" && button.dataset.stake === stake,
    );
  });

  if (source === "preset") {
    elements.customStake.value = "";
  }
  updateSetupSummary();
  if (!ladderRound) drawLadderCanvas();
  saveState();
}

function renderMissions() {
  elements.missionList.replaceChildren();

  if (!state.missions.length) {
    const empty = document.createElement("span");
    empty.className = "inline-empty";
    empty.textContent = "미션을 추가하면 결과에서 카드를 뽑을 수 있어요.";
    elements.missionList.append(empty);
  } else {
    state.missions.forEach((mission, index) => {
      const chip = document.createElement("span");
      chip.className = "mission-chip";
      const label = document.createElement("span");
      label.textContent = mission;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${mission} 미션 삭제`);
      remove.addEventListener("click", () => removeMission(index));
      chip.append(label, remove);
      elements.missionList.append(chip);
    });
  }

  elements.drawMission.disabled = state.missions.length === 0;
}

function addMission(rawValue) {
  const mission = rawValue.trim().slice(0, 30);
  if (!mission) {
    showToast("미션을 입력해 주세요.");
    return;
  }
  if (state.missions.length >= MAX_MISSIONS) {
    showToast(`미션은 최대 ${MAX_MISSIONS}개까지 추가할 수 있어요.`);
    return;
  }
  if (
    state.missions.some(
      (value) =>
        value.toLocaleLowerCase("ko") === mission.toLocaleLowerCase("ko"),
    )
  ) {
    showToast("같은 미션이 이미 있어요.");
    return;
  }

  state.missions.push(mission);
  elements.missionInput.value = "";
  saveState();
  renderMissions();
}

function removeMission(index) {
  state.missions.splice(index, 1);
  saveState();
  renderMissions();
}

function restoreDefaultMissions() {
  state.missions = [...DEFAULT_MISSIONS];
  state.lastMission = null;
  saveState();
  renderMissions();
  showToast("기본 미션으로 되돌렸어요.");
}

function resetResultMission() {
  elements.drawMission.hidden = false;
  elements.resultMission.hidden = true;
  elements.resultMission.classList.remove("is-revealed");
  elements.resultMissionText.textContent = "";
  elements.drawMission.textContent = "미션 카드 뽑기";
  elements.drawMission.disabled = state.missions.length === 0;
}

function drawMissionCard() {
  if (
    !state.lastResult ||
    state.lastResult.allowMission === false ||
    !state.missions.length
  ) {
    return;
  }
  const candidates =
    state.missions.length > 1
      ? state.missions.filter((mission) => mission !== state.lastMission)
      : state.missions;
  const mission = candidates[randomInt(candidates.length)];
  state.lastMission = mission;
  state.lastResult.mission = mission;
  state.lastResult.copyText = `${state.lastResult.baseCopyText}\n랜덤 미션: ${mission}`;

  elements.resultMission.hidden = false;
  elements.resultMissionText.textContent = mission;
  elements.resultMission.classList.remove("is-revealed");
  window.requestAnimationFrame(() => {
    elements.resultMission.classList.add("is-revealed");
  });
  elements.drawMission.textContent = "미션 다시 뽑기";

  const historyEntry = state.history.find(
    (entry) => entry.id === state.lastResult.historyId,
  );
  if (historyEntry) {
    historyEntry.mission = mission;
    historyEntry.copyText = state.lastResult.copyText;
    saveState();
    renderHistory();
  }
}

function renderPartySession() {
  const session = state.partySession;
  const finished = Boolean(session?.finished);

  elements.partyStartButtons.forEach((button) => {
    const rounds = Number(button.dataset.partyRounds);
    button.hidden = Boolean(session) && !finished;
    button.disabled = state.participants.length < 2;
    button.textContent = `${rounds}판 ${finished ? "다시" : "시작"}`;
  });
  elements.endPartySession.hidden = !session;
  elements.endPartySession.textContent = finished ? "닫기" : "종료";

  if (!session) {
    elements.partySessionStatus.textContent = "파티 세션 준비";
    elements.partyScoreboard.hidden = true;
    elements.partyScoreboard.replaceChildren();
    return;
  }

  elements.partySessionStatus.textContent = session.finished
    ? `${session.totalRounds}판 완료`
    : `${session.round} / ${session.totalRounds}판 진행`;
  elements.partyScoreboard.hidden = false;
  elements.partyScoreboard.replaceChildren();
  session.members.forEach((name) => {
    const score = document.createElement("span");
    score.className = "party-score";
    const label = document.createElement("span");
    label.textContent = name;
    const value = document.createElement("strong");
    value.textContent = `★ ${session.scores[name] || 0}`;
    score.append(label, value);
    elements.partyScoreboard.append(score);
  });
}

function startPartySession(totalRounds) {
  if (![3, 5].includes(totalRounds) || !hasEnoughParticipants()) return;
  state.partySession = {
    totalRounds,
    round: 0,
    members: [...state.participants],
    scores: Object.fromEntries(state.participants.map((name) => [name, 0])),
    finished: false,
  };
  renderPartySession();
  showToast(`${totalRounds}판 파티 세션을 시작했어요.`);
}

function stopPartySession(notify = true) {
  if (!state.partySession) return;
  state.partySession = null;
  renderPartySession();
  if (notify) showToast("파티 세션을 종료했어요.");
}

function applyPartyResult(result) {
  if (result.skipParty) return "";
  const session = state.partySession;
  if (!session || session.finished) return "";

  session.round += 1;
  const resultName = result.displayText.trim();
  const scorer =
    !result.list && PARTY_SCORE_GAMES.has(result.game)
      ? session.members.find((name) => name === resultName)
      : null;
  if (scorer) session.scores[scorer] += 1;

  if (session.round >= session.totalRounds) {
    session.finished = true;
  }
  renderPartySession();

  if (session.finished) {
    const topScore = Math.max(...Object.values(session.scores));
    const leaders = session.members.filter(
      (name) => session.scores[name] === topScore,
    );
    return `세션 종료 · ${leaders.join(", ")} ${topScore}점`;
  }

  return scorer
    ? `파티 ${session.round}/${session.totalRounds} · ${scorer} +1점`
    : `파티 ${session.round}/${session.totalRounds} · 점수 없음`;
}

function tabSupportsMode(tab, mode) {
  const modes = (tab.dataset.mode || "together").split(/\s+/);
  return modes.includes(mode);
}

function getVisibleGameTabs() {
  return elements.gameTabs.filter((tab) => !tab.hidden);
}

function updateModeLabels() {
  const solo = state.currentMode === "solo";
  elements.gameChoiceTitle.textContent = solo
    ? "어떤 기록에 도전할까요?"
    : "어떤 게임으로 정할까요?";
  elements.reactionTabTitle.textContent = solo
    ? "반응속도 기록"
    : "반응속도 대결";
  elements.reactionTabDescription.textContent = solo
    ? "빛나는 순간 바로 터치"
    : "먼저 누르면 1점";
  elements.reactionKicker.textContent = solo
    ? "12 · SOLO REACTION"
    : "12 · REACTION DUEL";
  elements.reactionHeading.textContent = solo
    ? "개인 반응속도"
    : "반응속도 대결";
  elements.timerTabTitle.textContent = solo ? "5초 기록 도전" : "5초 타이머";
  elements.timerTabDescription.textContent = solo
    ? "3번의 감각을 측정해요"
    : "감으로 정확히 멈춰요";
  elements.timerKicker.textContent = solo
    ? "13 · SOLO FIVE SECONDS"
    : "13 · STOP AT FIVE";
  elements.timerHeading.textContent = solo ? "개인 5초 기록" : "5초 타이머";
}

function applyGameFilters() {
  elements.gameTabs.forEach((tab) => {
    const modeVisible = tabSupportsMode(tab, state.currentMode);
    const categoryVisible =
      state.currentMode === "solo" ||
      state.currentCategory === "all" ||
      tab.dataset.category === state.currentCategory;
    tab.hidden = !modeVisible || !categoryVisible;
  });
}

function setPlayMode(mode) {
  if (!["together", "solo"].includes(mode)) return;
  const changed = state.currentMode !== mode;

  if (changed && state.currentGame === "reaction") {
    resetReaction(false);
    resetReactionSolo();
  }
  if (changed && state.currentGame === "timer") {
    resetTimer();
    resetTimerSolo();
  }

  state.currentMode = mode;
  const solo = mode === "solo";
  elements.playModeButtons.forEach((button) => {
    const active = button.dataset.playMode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.gameCategoryControl.hidden = solo;
  elements.soloModeNote.hidden = !solo;
  elements.partySession.hidden = solo;
  elements.currentStakeBadge.hidden = solo;
  updateModeLabels();
  applyGameFilters();

  const visibleTabs = getVisibleGameTabs();
  if (!visibleTabs.some((tab) => tab.dataset.game === state.currentGame)) {
    selectGame(visibleTabs[0]?.dataset.game);
  } else if (state.currentGame === "reaction") {
    configureReactionMode();
  } else if (state.currentGame === "timer") {
    configureTimerMode();
  }
}

function selectGame(game) {
  if (!elements.gameViews[game]) return;

  const changingGame = state.currentGame !== game;
  const enteringDodge = changingGame && game === "dodge";
  const enteringTap = changingGame && game === "tap";
  const enteringRunner = changingGame && game === "runner";
  const enteringStack = changingGame && game === "stack";
  const enteringFruit = changingGame && game === "fruit";
  window.clearTimeout(resultRevealTimer);
  if (state.currentGame === "bomb" && game !== "bomb") resetBomb();
  if (state.currentGame === "finger" && game !== "finger") resetFinger();
  if (state.currentGame === "reaction" && game !== "reaction") {
    resetReaction(false);
    resetReactionSolo();
  }
  if (state.currentGame === "timer" && game !== "timer") {
    resetTimer();
    resetTimerSolo();
  }
  if (state.currentGame === "dodge" && game !== "dodge") resetDodge();
  if (state.currentGame === "tap" && game !== "tap") resetTap();
  if (state.currentGame === "runner" && game !== "runner") resetRunner();
  if (state.currentGame === "stack" && game !== "stack") resetStack();
  if (state.currentGame === "fruit" && game !== "fruit") resetFruit();
  state.currentGame = game;

  elements.gameTabs.forEach((tab) => {
    const active = tab.dataset.game === game;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  Object.entries(elements.gameViews).forEach(([name, view]) => {
    const active = name === game;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });

  if (game === "wheel") drawWheel();
  if (game === "cards" && !cardRound) dealCards();
  if (game === "menu") drawMenuWheel();
  if (game === "ladder") drawLadderCanvas(ladderRound?.selectedIndex);
  if (game === "reaction" && changingGame) configureReactionMode();
  if (game === "timer" && changingGame) configureTimerMode();
  if (enteringDodge) resetDodge();
  if (enteringTap) resetTap();
  if (enteringRunner) resetRunner();
  if (enteringStack) resetStack();
  if (enteringFruit) resetFruit();

  const activeTab = elements.gameTabs.find((tab) => tab.dataset.game === game);
  activeTab?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

function setGameCategory(category) {
  const valid = ["all", "quick", "mini", "party"];
  if (!valid.includes(category)) return;

  state.currentCategory = category;
  elements.gameCategoryButtons.forEach((button) => {
    const active = button.dataset.gameCategory === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  applyGameFilters();

  const visibleTabs = getVisibleGameTabs();
  if (!visibleTabs.some((tab) => tab.dataset.game === state.currentGame)) {
    selectGame(visibleTabs[0]?.dataset.game);
  }
}
function drawWheelCanvas(canvas, items, rotation, centerText) {
  const context = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const outerRadius = center - 18;

  context.clearRect(0, 0, size, size);
  context.save();
  context.translate(center, center);

  if (!items.length) {
    context.beginPath();
    context.arc(0, 0, outerRadius, 0, Math.PI * 2);
    context.fillStyle = "#f1f3f5";
    context.fill();
    context.strokeStyle = "#17191d";
    context.lineWidth = 6;
    context.stroke();
    context.fillStyle = "#656b75";
    context.font = '800 27px "Malgun Gothic", Arial, sans-serif';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("항목을 추가해 주세요", 0, 0);
    context.restore();
    return;
  }

  const slice = (Math.PI * 2) / items.length;
  items.forEach((name, index) => {
    const start = -Math.PI / 2 + index * slice + rotation;
    const end = start + slice;
    const middle = start + slice / 2;

    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, outerRadius, start, end);
    context.closePath();
    context.fillStyle = WHEEL_COLORS[index % WHEEL_COLORS.length];
    context.fill();
    context.strokeStyle = "#17191d";
    context.lineWidth = 6;
    context.stroke();

    context.save();
    context.rotate(middle);
    context.translate(outerRadius * 0.62, 0);
    const normalizedAngle = modulo(middle, Math.PI * 2);
    context.rotate(
      normalizedAngle > Math.PI / 2 &&
        normalizedAngle < (Math.PI * 3) / 2
        ? Math.PI
        : 0,
    );
    context.fillStyle = [0, 2, 3, 4].includes(
      index % WHEEL_COLORS.length,
    )
      ? "#ffffff"
      : "#17191d";
    context.font = `900 ${
      items.length > 8 ? 22 : 28
    }px "Malgun Gothic", Arial, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(name, 0, 0, outerRadius * 0.43);
    context.restore();
  });

  context.beginPath();
  context.arc(0, 0, 66, 0, Math.PI * 2);
  context.fillStyle = "#ffffff";
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 8;
  context.stroke();
  context.fillStyle = "#17191d";
  context.font = '900 26px "Malgun Gothic", Arial, sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(centerText, 0, 2);
  context.restore();
}

function drawWheel(rotation = wheelRotation) {
  drawWheelCanvas(
    elements.wheelCanvas,
    state.participants,
    rotation,
    "GO",
  );
}

function getEligibleParticipants(count) {
  if (!state.noRepeat) return [...state.participants];

  state.excludedWinners = state.excludedWinners.filter((name) =>
    state.participants.includes(name),
  );
  let pool = state.participants.filter(
    (name) => !state.excludedWinners.includes(name),
  );
  if (pool.length < count) {
    state.excludedWinners = [];
    pool = [...state.participants];
    showToast("모두 한 번씩 뽑혀서 제외 기록을 새로 시작해요.");
  }
  return pool;
}

function markWinners(names) {
  if (!state.noRepeat) return;
  names.forEach((name) => {
    if (!state.excludedWinners.includes(name)) {
      state.excludedWinners.push(name);
    }
  });
}

function spinWheel() {
  if (wheelSpinning || !hasEnoughParticipants()) return;

  wheelSpinning = true;
  elements.spinButton.disabled = true;
  elements.wheelStatus.textContent = "룰렛이 돌고 있어요...";

  const eligible = getEligibleParticipants(1);
  const winner = eligible[randomInt(eligible.length)];
  const winnerIndex = state.participants.indexOf(winner);
  const slice = (Math.PI * 2) / state.participants.length;
  const fullTurn = Math.PI * 2;
  const currentMod = modulo(wheelRotation, fullTurn);
  const desiredMod = modulo(-(winnerIndex + 0.5) * slice, fullTurn);
  const extraTurns = 5 + randomInt(3);
  const targetRotation =
    wheelRotation +
    extraTurns * fullTurn +
    modulo(desiredMod - currentMod, fullTurn);
  const startRotation = wheelRotation;
  const startTime = performance.now();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const duration = reduceMotion ? 900 : 4200;

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 5);
    wheelRotation = startRotation + (targetRotation - startRotation) * eased;
    drawWheel(wheelRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    wheelRotation = modulo(targetRotation, fullTurn);
    wheelSpinning = false;
    elements.spinButton.disabled = false;
    markWinners([winner]);
    elements.wheelStatus.textContent = `${winner} 당첨!`;
    showResult(winner, "wheel");
  }

  requestAnimationFrame(animate);
}

function startBomb() {
  if (!hasEnoughParticipants()) return;
  if (bombRunning) {
    passBomb();
    return;
  }

  window.clearTimeout(bombRevealTimer);
  bombRunning = true;
  bombHolderIndex = randomInt(state.participants.length);
  elements.bombVisual.classList.remove("is-boom");
  elements.bombVisual.classList.add("is-live");
  elements.bombStatus.textContent =
    "폭탄이 움직이고 있어요. 빠르게 넘기세요!";
  updateBombHolder();

  const duration = 8500 + randomInt(9500);
  bombTimer = window.setTimeout(explodeBomb, duration);
}

function passBomb() {
  if (!state.participants.length) return;
  bombHolderIndex = (bombHolderIndex + 1) % state.participants.length;
  if (navigator.vibrate) navigator.vibrate(30);
  updateBombHolder();
}

function updateBombHolder() {
  const holder = state.participants[bombHolderIndex];
  const next =
    state.participants[(bombHolderIndex + 1) % state.participants.length];
  elements.bombHolder.textContent = `지금 폭탄: ${holder}`;
  elements.bombButton.textContent = `${next}에게 넘기기`;
}

function explodeBomb() {
  if (!state.participants.length) {
    resetBomb();
    return;
  }
  bombRunning = false;
  elements.bombVisual.classList.remove("is-live");
  elements.bombVisual.classList.add("is-boom");
  const loser = state.participants[bombHolderIndex];
  elements.bombHolder.textContent = `${loser}에서 멈췄어요!`;
  elements.bombStatus.textContent =
    "펑! 폭탄이 멈춘 사람이 오늘의 주인공이에요.";
  elements.bombButton.textContent = "폭탄 다시 시작";
  if (navigator.vibrate) navigator.vibrate([120, 60, 180]);
  bombRevealTimer = window.setTimeout(
    () => showResult(loser, "bomb"),
    650,
  );
}

function resetBomb() {
  window.clearTimeout(bombTimer);
  window.clearTimeout(bombRevealTimer);
  bombRunning = false;
  elements.bombVisual.classList.remove("is-live", "is-boom");
  if (state.participants.length >= 2) {
    elements.bombStatus.textContent =
      "시작하면 휴대폰을 차례대로 넘겨주세요.";
    elements.bombHolder.textContent = "누구에게서 멈출까요?";
  } else {
    elements.bombStatus.textContent = "참가자를 2명 이상 추가해 주세요.";
    elements.bombHolder.textContent = "참가자 대기 중";
  }
  elements.bombButton.textContent = "폭탄 시작";
}

function dealCards() {
  const count = state.participants.length;
  if (count < 2) {
    cardRound = null;
    renderCards();
    elements.cardStatus.textContent = "참가자를 2명 이상 추가해 주세요.";
    return;
  }

  const badIndex = randomInt(count);
  cardRound = {
    deck: Array.from({ length: count }, (_, index) => ({
      bad: index === badIndex,
      revealed: false,
    })),
    turnOrder: shuffle(state.participants),
    turnIndex: 0,
    ended: false,
  };

  renderCards();
  elements.cardStatus.textContent = `${cardRound.turnOrder[0]} 차례예요. 카드 한 장을 골라 주세요.`;
}

function renderCards() {
  elements.cardGrid.replaceChildren();
  if (!cardRound) {
    const empty = document.createElement("p");
    empty.className = "stage-empty";
    empty.textContent = "참가자를 추가하면 카드가 준비돼요.";
    elements.cardGrid.append(empty);
    return;
  }

  cardRound.deck.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "luck-card";
    button.disabled = card.revealed || cardRound.ended;
    button.setAttribute("aria-label", `${index + 1}번 카드`);
    if (card.revealed) {
      button.classList.add(
        "is-flipped",
        card.bad ? "is-loser" : "is-safe",
      );
    }

    const inner = document.createElement("span");
    inner.className = "card-inner";

    const back = document.createElement("span");
    back.className = "card-face card-back";
    const number = document.createElement("span");
    number.className = "card-number";
    number.textContent = String(index + 1);
    back.append(number);

    const front = document.createElement("span");
    front.className = "card-face card-front";
    const result = document.createElement("strong");
    result.textContent = card.bad ? "당첨!" : "통과";
    front.append(result);

    inner.append(back, front);
    button.append(inner);
    button.addEventListener("click", () => revealCard(index));
    elements.cardGrid.append(button);
  });
}

function revealCard(index) {
  if (!cardRound || cardRound.ended || cardRound.deck[index].revealed) return;

  const player = cardRound.turnOrder[cardRound.turnIndex];
  const card = cardRound.deck[index];
  card.revealed = true;

  if (card.bad) {
    cardRound.ended = true;
    elements.cardStatus.textContent = `${player} 당첨! 복불복 카드가 나왔어요.`;
  } else {
    cardRound.turnIndex += 1;
    const nextPlayer = cardRound.turnOrder[cardRound.turnIndex];
    elements.cardStatus.textContent = `${player} 통과! 다음은 ${nextPlayer} 차례예요.`;
  }

  renderCards();
  if (card.bad) {
    window.clearTimeout(resultRevealTimer);
    resultRevealTimer = window.setTimeout(
      () => showResult(player, "cards"),
      650,
    );
  }
}

function resetOrder() {
  orderRound = null;
  elements.orderStatus.textContent =
    state.participants.length >= 2
      ? "모두의 차례를 한 번에 정해요."
      : "참가자를 2명 이상 추가해 주세요.";
  renderOrder();
}

function renderOrder(order = null) {
  elements.orderList.replaceChildren();
  elements.orderList.classList.toggle("is-revealed", Boolean(order));

  if (!state.participants.length) {
    const empty = document.createElement("li");
    empty.className = "stage-empty";
    empty.textContent = "참가자 명단이 비어 있어요.";
    elements.orderList.append(empty);
    return;
  }

  (order || state.participants).forEach((name, index) => {
    const item = document.createElement("li");
    item.className = "order-item";
    item.style.setProperty("--reveal-delay", `${index * 45}ms`);
    if (!order) item.classList.add("is-placeholder");

    const rank = document.createElement("span");
    rank.className = "order-rank";
    rank.textContent = order ? String(index + 1) : "?";

    const label = document.createElement("strong");
    label.textContent = name;

    item.append(rank, label);
    elements.orderList.append(item);
  });
}

function makeOrder() {
  if (!hasEnoughParticipants()) return;
  window.clearTimeout(resultRevealTimer);
  orderRound = shuffle(state.participants);
  renderOrder(orderRound);
  elements.orderStatus.textContent = `${orderRound.length}명의 순서가 정해졌어요.`;

  const displayText = orderRound
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "order",
      lead: "정해진 순서는",
      displayText,
      stakeLabel: "항목",
      stake: state.stake,
      copyText: `딱! 정해 순서 · ${state.stake}\n${displayText}`,
      list: true,
    });
  }, 600);
}

function normalizeTeamCount() {
  if (state.participants.length >= 2) {
    state.teamCount = Math.min(state.teamCount, state.participants.length);
  }
  if (![2, 3, 4].includes(state.teamCount)) state.teamCount = 2;
  updateTeamControls();
}

function updateTeamControls() {
  [
    ...elements.teamCountControl.querySelectorAll("[data-team-count]"),
  ].forEach((button) => {
    const count = Number(button.dataset.teamCount);
    const active = count === state.teamCount;
    button.disabled = count > state.participants.length;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setTeamCount(count) {
  if (![2, 3, 4].includes(count) || count > state.participants.length) return;
  state.teamCount = count;
  saveState();
  updateTeamControls();
  resetTeams();
}

function resetTeams() {
  teamRound = null;
  elements.teamStatus.textContent =
    state.participants.length >= 2
      ? "팀 수를 고르고 멤버를 섞어 보세요."
      : "참가자를 2명 이상 추가해 주세요.";
  renderTeams();
}

function renderTeams(teams = null) {
  elements.teamBoard.replaceChildren();
  elements.teamBoard.classList.toggle("is-revealed", Boolean(teams));
  elements.teamBoard.style.setProperty(
    "--team-count",
    String(state.teamCount),
  );

  Array.from({ length: state.teamCount }, (_, index) => {
    const card = document.createElement("section");
    card.className = "team-card";
    card.style.setProperty("--team-color", TEAM_COLORS[index]);
    card.style.setProperty("--reveal-delay", `${index * 80}ms`);
    if (!teams) card.classList.add("is-placeholder");

    const title = document.createElement("h4");
    title.textContent = `${String.fromCharCode(65 + index)}팀`;

    const members = document.createElement("ul");
    members.className = "team-members";
    const names = teams?.[index] || ["대기 중"];
    names.forEach((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      members.append(item);
    });

    card.append(title, members);
    elements.teamBoard.append(card);
  });
}

function makeTeams() {
  if (!hasEnoughParticipants()) return;
  window.clearTimeout(resultRevealTimer);
  teamRound = Array.from({ length: state.teamCount }, () => []);
  shuffle(state.participants).forEach((name, index) => {
    teamRound[index % state.teamCount].push(name);
  });

  renderTeams(teamRound);
  elements.teamStatus.textContent = `${state.participants.length}명을 ${state.teamCount}팀으로 나눴어요.`;

  const displayText = teamRound
    .map(
      (members, index) =>
        `${String.fromCharCode(65 + index)}팀: ${members.join(", ")}`,
    )
    .join("\n");
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "teams",
      lead: "오늘의 팀 편성은",
      displayText,
      stakeLabel: "항목",
      stake: state.stake,
      copyText: `딱! 정해 팀 편성 · ${state.stake}\n${displayText}`,
      list: true,
    });
  }, 550);
}

function normalizeDrawCount() {
  const max = Math.max(1, Math.min(5, state.participants.length || 1));
  state.drawCount = Math.min(Math.max(state.drawCount, 1), max);
  elements.drawCount.textContent = `${state.drawCount}명`;
  elements.drawMinus.disabled = state.drawCount <= 1;
  elements.drawPlus.disabled = state.drawCount >= max;
}

function changeDrawCount(amount) {
  state.drawCount += amount;
  normalizeDrawCount();
  saveState();
}

function resetDraw() {
  window.clearTimeout(drawTimer);
  drawRound = null;
  elements.drawStatus.textContent =
    state.participants.length >= 2
      ? "뽑을 인원을 정하고 제비를 열어 보세요."
      : "참가자를 2명 이상 추가해 주세요.";
  renderDrawTickets();
}

function renderDrawTickets(winners = []) {
  elements.drawTicketBoard.replaceChildren();
  elements.drawTicketBoard.classList.toggle(
    "is-revealed",
    winners.length > 0,
  );

  if (!state.participants.length) {
    const empty = document.createElement("p");
    empty.className = "stage-empty";
    empty.textContent = "참가자를 추가하면 제비가 준비돼요.";
    elements.drawTicketBoard.append(empty);
    return;
  }

  state.participants.forEach((name, index) => {
    const ticket = document.createElement("span");
    ticket.className = "draw-ticket";
    ticket.style.setProperty("--reveal-delay", `${index * 35}ms`);
    if (winners.includes(name)) ticket.classList.add("is-winner");

    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("strong");
    label.textContent = winners.length ? name : "?";
    ticket.append(number, label);
    elements.drawTicketBoard.append(ticket);
  });
}

function makeDraw() {
  if (!hasEnoughParticipants()) return;
  const count = Math.min(state.drawCount, state.participants.length);
  const pool = getEligibleParticipants(count);
  const winners = shuffle(pool).slice(0, count);

  elements.drawButton.disabled = true;
  elements.drawTicketBoard.classList.add("is-shuffling");
  elements.drawStatus.textContent = "제비를 섞고 있어요...";
  window.clearTimeout(drawTimer);
  drawTimer = window.setTimeout(() => {
    drawRound = winners;
    markWinners(winners);
    elements.drawButton.disabled = false;
    elements.drawTicketBoard.classList.remove("is-shuffling");
    renderDrawTickets(winners);
    elements.drawStatus.textContent = `${winners.length}명을 뽑았어요.`;

    const displayText = winners
      .map((name, index) =>
        winners.length > 1 ? `${index + 1}. ${name}` : name,
      )
      .join("\n");
    showResult({
      game: "draw",
      lead: winners.length > 1 ? "뽑힌 사람은" : "뽑힌 사람은",
      displayText,
      stakeLabel: "항목",
      stake: state.stake,
      copyText: `딱! 정해 제비뽑기 · ${state.stake}\n${displayText}`,
      list: winners.length > 1,
    });
  }, 700);
}

function generateLadderRungs(count) {
  const rowCount = Math.max(8, Math.min(22, count * 2 + 4));
  const rungs = [];
  for (let row = 0; row < rowCount; row += 1) {
    const candidates = shuffle(
      Array.from({ length: count - 1 }, (_, index) => index),
    );
    const used = new Set();
    const desired = Math.min(
      1 + randomInt(Math.max(1, Math.floor(count / 3))),
      Math.floor(count / 2),
    );
    let added = 0;
    candidates.forEach((left) => {
      if (
        added >= desired ||
        used.has(left) ||
        used.has(left + 1)
      ) {
        return;
      }
      used.add(left);
      used.add(left + 1);
      rungs.push({ row, left });
      added += 1;
    });
  }
  return { rungs, rowCount };
}

function getLadderDestination(startIndex, round = ladderRound) {
  if (!round) return startIndex;
  let position = startIndex;
  const ordered = [...round.rungs].sort((a, b) => a.row - b.row);
  ordered.forEach((rung) => {
    if (rung.left === position) {
      position += 1;
    } else if (rung.left === position - 1) {
      position -= 1;
    }
  });
  return position;
}

function canvasLabel(text, maxLength = 8) {
  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1)}…`
    : text;
}

function drawLadderCanvas(selectedIndex = null) {
  const canvas = elements.ladderCanvas;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const count = state.participants.length;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f8f9fa";
  context.fillRect(0, 0, width, height);

  if (count < 2) {
    context.fillStyle = "#656b75";
    context.font = '800 30px "Malgun Gothic", Arial, sans-serif';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("참가자를 2명 이상 추가해 주세요", width / 2, height / 2);
    return;
  }

  const left = 68;
  const right = width - 68;
  const top = 78;
  const bottom = height - 78;
  const columnGap = count > 1 ? (right - left) / (count - 1) : 0;
  const xFor = (index) => left + index * columnGap;
  const previewRowCount = Math.max(8, Math.min(22, count * 2 + 4));
  const rowCount = ladderRound?.rowCount || previewRowCount;
  const rowGap = (bottom - top) / (rowCount + 1);
  const rungY = (row) => top + (row + 1) * rowGap;
  const outcomes =
    ladderRound?.outcomes ||
    Array.from({ length: count }, (_, index) =>
      index === 0 ? state.stake : "통과",
    );

  context.textAlign = "center";
  context.textBaseline = "middle";
  state.participants.forEach((name, index) => {
    context.fillStyle = "#17191d";
    context.font = `900 ${count > 8 ? 17 : 20}px "Malgun Gothic", Arial, sans-serif`;
    context.fillText(
      canvasLabel(name, count > 8 ? 5 : 7),
      xFor(index),
      36,
      Math.max(54, columnGap - 8),
    );
    context.fillStyle =
      outcomes[index] === state.stake ? "#d93f32" : "#656b75";
    context.font = `800 ${count > 8 ? 15 : 18}px "Malgun Gothic", Arial, sans-serif`;
    context.fillText(
      canvasLabel(outcomes[index], count > 8 ? 5 : 8),
      xFor(index),
      height - 34,
      Math.max(54, columnGap - 8),
    );
  });

  context.lineCap = "round";
  context.strokeStyle = "#c6cbd2";
  context.lineWidth = 6;
  context.beginPath();
  for (let index = 0; index < count; index += 1) {
    context.moveTo(xFor(index), top);
    context.lineTo(xFor(index), bottom);
  }
  (ladderRound?.rungs || []).forEach((rung) => {
    context.moveTo(xFor(rung.left), rungY(rung.row));
    context.lineTo(xFor(rung.left + 1), rungY(rung.row));
  });
  context.stroke();

  if (ladderRound && Number.isInteger(selectedIndex)) {
    let position = selectedIndex;
    const ordered = [...ladderRound.rungs].sort(
      (a, b) => a.row - b.row,
    );
    context.strokeStyle = "#ff5d4c";
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(xFor(position), top);
    ordered.forEach((rung) => {
      const y = rungY(rung.row);
      context.lineTo(xFor(position), y);
      if (rung.left === position) {
        context.lineTo(xFor(position + 1), y);
        position += 1;
      } else if (rung.left === position - 1) {
        context.lineTo(xFor(position - 1), y);
        position -= 1;
      }
    });
    context.lineTo(xFor(position), bottom);
    context.stroke();

    context.fillStyle = "#ff5d4c";
    context.beginPath();
    context.arc(xFor(selectedIndex), top, 12, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(xFor(position), bottom, 12, 0, Math.PI * 2);
    context.fill();
  }
}

function renderLadderPlayers() {
  elements.ladderPlayers.replaceChildren();
  state.participants.forEach((name, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.disabled = !ladderRound;
    button.classList.toggle(
      "is-active",
      ladderRound?.selectedIndex === index,
    );
    button.addEventListener("click", () => selectLadderPlayer(index));
    elements.ladderPlayers.append(button);
  });
}

function renderLadderResults() {
  elements.ladderResult.replaceChildren();
  if (!ladderRound) return;

  ladderRound.results.forEach((result, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ladder-result-item";
    button.classList.toggle("is-active", ladderRound.selectedIndex === index);
    const name = document.createElement("strong");
    name.textContent = state.participants[index];
    const outcome = document.createElement("span");
    outcome.textContent = result;
    button.append(name, outcome);
    button.addEventListener("click", () => selectLadderPlayer(index));
    elements.ladderResult.append(button);
  });
}

function selectLadderPlayer(index) {
  if (!ladderRound || !state.participants[index]) return;
  ladderRound.selectedIndex = index;
  const outcome = ladderRound.results[index];
  elements.ladderStatus.textContent = `${state.participants[index]} → ${outcome}`;
  drawLadderCanvas(index);
  renderLadderPlayers();
  renderLadderResults();
}

function resetLadder() {
  window.clearTimeout(ladderRevealTimer);
  ladderRound = null;
  elements.ladderStatus.textContent =
    state.participants.length >= 2
      ? "사다리를 만들고 이름을 눌러 경로를 확인하세요."
      : "참가자를 2명 이상 추가해 주세요.";
  renderLadderPlayers();
  renderLadderResults();
  drawLadderCanvas();
}

function makeLadder() {
  if (!hasEnoughParticipants()) return;
  const generated = generateLadderRungs(state.participants.length);
  const outcomes = shuffle([
    state.stake,
    ...Array.from(
      { length: state.participants.length - 1 },
      () => "통과",
    ),
  ]);
  ladderRound = {
    ...generated,
    outcomes,
    selectedIndex: 0,
    results: [],
  };
  ladderRound.results = state.participants.map(
    (_, index) => outcomes[getLadderDestination(index, ladderRound)],
  );

  renderLadderPlayers();
  renderLadderResults();
  selectLadderPlayer(0);
  elements.ladderStatus.textContent =
    "사다리가 완성됐어요. 이름을 눌러 경로를 바꿔 보세요.";

  const displayText = state.participants
    .map((name, index) => `${name} → ${ladderRound.results[index]}`)
    .join("\n");
  window.clearTimeout(ladderRevealTimer);
  ladderRevealTimer = window.setTimeout(() => {
    showResult({
      game: "ladder",
      lead: "사다리 결과는",
      displayText,
      stakeLabel: "당첨 항목",
      stake: state.stake,
      copyText: `딱! 정해 사다리 · ${state.stake}\n${displayText}`,
      list: true,
    });
  }, 750);
}

function renderOptionEditors() {
  elements.optionLists.forEach((list) => {
    list.replaceChildren();
    if (!state.options.length) {
      const empty = document.createElement("span");
      empty.className = "inline-empty";
      empty.textContent = "후보를 추가해 주세요.";
      list.append(empty);
      return;
    }

    state.options.forEach((option, index) => {
      const chip = document.createElement("span");
      chip.className = "option-chip";
      const label = document.createElement("span");
      label.textContent = option;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${option} 후보 삭제`);
      remove.addEventListener("click", () => removeOption(index));
      chip.append(label, remove);
      list.append(chip);
    });
  });

  drawMenuWheel();
  resetTournament();
  updateGameAvailability();
}

function addOption(rawValue) {
  const option = rawValue.trim().slice(0, 18);
  if (!option) {
    showToast("후보를 입력해 주세요.");
    return;
  }
  if (state.options.length >= MAX_OPTIONS) {
    showToast(`후보는 최대 ${MAX_OPTIONS}개까지 추가할 수 있어요.`);
    return;
  }
  if (
    state.options.some(
      (value) =>
        value.toLocaleLowerCase("ko") === option.toLocaleLowerCase("ko"),
    )
  ) {
    showToast("같은 후보가 이미 있어요.");
    return;
  }

  state.options.push(option);
  elements.optionInputs.forEach((input) => {
    input.value = "";
  });
  saveState();
  renderOptionEditors();
}

function removeOption(index) {
  state.options.splice(index, 1);
  saveState();
  renderOptionEditors();
}

function resetDefaultOptions() {
  state.options = [...DEFAULT_OPTIONS];
  saveState();
  renderOptionEditors();
  showToast("기본 후보로 되돌렸어요.");
}

function drawMenuWheel(rotation = menuWheelRotation) {
  drawWheelCanvas(
    elements.menuWheelCanvas,
    state.options,
    rotation,
    "PICK",
  );
}

function spinMenuWheel() {
  if (menuWheelSpinning || !hasEnoughOptions()) return;

  menuWheelSpinning = true;
  elements.menuButton.disabled = true;
  elements.menuStatus.textContent = "후보를 섞고 있어요...";

  const winnerIndex = randomInt(state.options.length);
  const winner = state.options[winnerIndex];
  const slice = (Math.PI * 2) / state.options.length;
  const fullTurn = Math.PI * 2;
  const currentMod = modulo(menuWheelRotation, fullTurn);
  const desiredMod = modulo(-(winnerIndex + 0.5) * slice, fullTurn);
  const targetRotation =
    menuWheelRotation +
    (5 + randomInt(3)) * fullTurn +
    modulo(desiredMod - currentMod, fullTurn);
  const startRotation = menuWheelRotation;
  const startTime = performance.now();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const duration = reduceMotion ? 800 : 3600;

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 5);
    menuWheelRotation =
      startRotation + (targetRotation - startRotation) * eased;
    drawMenuWheel(menuWheelRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    menuWheelRotation = modulo(targetRotation, fullTurn);
    menuWheelSpinning = false;
    elements.menuButton.disabled = false;
    elements.menuStatus.textContent = `오늘의 선택은 ${winner}!`;
    showResult({
      game: "menu",
      lead: "오늘의 선택은",
      displayText: winner,
      stakeLabel: "후보",
      stake: `${state.options.length}개 중 선택`,
      copyText: `딱! 정해 메뉴 룰렛: ${winner}`,
      list: false,
    });
  }

  requestAnimationFrame(animate);
}

function updateSeatControls() {
  [
    ...elements.seatColumnControl.querySelectorAll("[data-seat-columns]"),
  ].forEach((button) => {
    const columns = Number(button.dataset.seatColumns);
    const active = columns === state.seatColumns;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setSeatColumns(columns) {
  if (![2, 3, 4].includes(columns)) return;
  state.seatColumns = columns;
  saveState();
  updateSeatControls();
  resetSeats();
}

function resetSeats() {
  seatRound = null;
  elements.seatStatus.textContent =
    state.participants.length >= 2
      ? "열 수를 고르고 좌석을 무작위로 배치하세요."
      : "참가자를 2명 이상 추가해 주세요.";
  renderSeats();
}

function renderSeats(assignments = null) {
  elements.seatBoard.replaceChildren();
  elements.seatBoard.style.setProperty(
    "--seat-columns",
    String(state.seatColumns),
  );
  elements.seatBoard.classList.toggle("is-revealed", Boolean(assignments));

  if (!state.participants.length) {
    const empty = document.createElement("p");
    empty.className = "stage-empty";
    empty.textContent = "참가자를 추가하면 좌석이 준비돼요.";
    elements.seatBoard.append(empty);
    return;
  }

  const names = assignments || state.participants;
  names.forEach((name, index) => {
    const seat = document.createElement("div");
    seat.className = "seat-item";
    if (!assignments) seat.classList.add("is-placeholder");
    seat.style.setProperty("--reveal-delay", `${index * 35}ms`);
    const number = document.createElement("span");
    number.textContent = `${index + 1}번`;
    const label = document.createElement("strong");
    label.textContent = assignments ? name : "?";
    seat.append(number, label);
    elements.seatBoard.append(seat);
  });
}

function makeSeats() {
  if (!hasEnoughParticipants()) return;
  seatRound = shuffle(state.participants);
  renderSeats(seatRound);
  elements.seatStatus.textContent = `${seatRound.length}명의 자리를 배치했어요.`;
  const displayText = seatRound
    .map((name, index) => `${index + 1}번 자리: ${name}`)
    .join("\n");
  window.clearTimeout(resultRevealTimer);
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "seats",
      lead: "자리 배치 결과는",
      displayText,
      stakeLabel: "배치",
      stake: `${state.seatColumns}열`,
      copyText: `딱! 정해 자리 배치\n${displayText}`,
      list: true,
    });
  }, 600);
}

function resetTournament() {
  tournamentRound = null;
  elements.tournamentProgress.textContent = "";
  elements.tournamentStatus.textContent =
    state.options.length >= 2
      ? "후보를 준비하고 둘 중 하나씩 골라 보세요."
      : "후보를 2개 이상 추가해 주세요.";
  elements.tournamentButton.textContent = "토너먼트 시작";
  elements.tournamentMatch.replaceChildren();
  const left = document.createElement("button");
  left.className = "choice-button";
  left.type = "button";
  left.disabled = true;
  left.textContent = "?";
  const versus = document.createElement("span");
  versus.className = "versus";
  versus.setAttribute("aria-hidden", "true");
  versus.textContent = "VS";
  const right = left.cloneNode(true);
  elements.tournamentMatch.append(left, versus, right);
}

function prepareTournamentRound(entrants, roundNumber) {
  const pairs = [];
  const next = [];
  for (let index = 0; index < entrants.length; index += 2) {
    if (entrants[index + 1]) {
      pairs.push([entrants[index], entrants[index + 1]]);
    } else {
      next.push(entrants[index]);
    }
  }

  tournamentRound = {
    entrants,
    roundNumber,
    pairs,
    matchIndex: 0,
    next,
  };

  if (!pairs.length && next.length === 1) {
    finishTournament(next[0]);
    return;
  }
  renderTournamentMatch();
}

function startTournament() {
  if (!hasEnoughOptions()) return;
  prepareTournamentRound(shuffle(state.options), 1);
  elements.tournamentButton.textContent = "처음부터";
}

function renderTournamentMatch() {
  if (!tournamentRound) return;
  const pair = tournamentRound.pairs[tournamentRound.matchIndex];
  if (!pair) {
    if (tournamentRound.next.length === 1) {
      finishTournament(tournamentRound.next[0]);
    } else {
      prepareTournamentRound(
        tournamentRound.next,
        tournamentRound.roundNumber + 1,
      );
    }
    return;
  }

  elements.tournamentProgress.textContent = `${tournamentRound.roundNumber}라운드 · ${
    tournamentRound.matchIndex + 1
  }/${tournamentRound.pairs.length}`;
  elements.tournamentStatus.textContent = "더 마음에 드는 후보를 선택하세요.";
  elements.tournamentMatch.replaceChildren();

  pair.forEach((option, index) => {
    if (index === 1) {
      const versus = document.createElement("span");
      versus.className = "versus";
      versus.setAttribute("aria-hidden", "true");
      versus.textContent = "VS";
      elements.tournamentMatch.append(versus);
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = option;
    button.addEventListener("click", () => chooseTournamentOption(option));
    elements.tournamentMatch.append(button);
  });
}

function chooseTournamentOption(option) {
  if (!tournamentRound) return;
  tournamentRound.next.push(option);
  tournamentRound.matchIndex += 1;
  renderTournamentMatch();
}

function finishTournament(winner) {
  tournamentRound = {
    winner,
    roundNumber: tournamentRound?.roundNumber || 1,
    pairs: [],
    matchIndex: 0,
    next: [winner],
  };
  elements.tournamentProgress.textContent = "최종 선택";
  elements.tournamentStatus.textContent = `${winner} 선택 완료!`;
  elements.tournamentMatch.replaceChildren();
  const winnerCard = document.createElement("strong");
  winnerCard.className = "tournament-winner";
  winnerCard.textContent = winner;
  elements.tournamentMatch.append(winnerCard);
  elements.tournamentButton.textContent = "다시 시작";
  showResult({
    game: "tournament",
    lead: "최종 선택은",
    displayText: winner,
    stakeLabel: "후보",
    stake: `${state.options.length}개 토너먼트`,
    copyText: `딱! 정해 선택 토너먼트: ${winner}`,
    list: false,
  });
}

function clearFingerPickTimer() {
  window.clearTimeout(fingerPickTimer);
  fingerPickTimer = null;
  elements.fingerArena.classList.remove("is-counting");
}

function renumberFingerTouches() {
  let order = 1;
  fingerTouches.forEach((touch) => {
    touch.order = order;
    touch.marker.textContent = String(order);
    order += 1;
  });
  fingerSequence = fingerTouches.size;
}

function updateFingerPosition(touch, event) {
  const rect = elements.fingerArena.getBoundingClientRect();
  const edge = 36;
  const x = Math.min(Math.max(event.clientX - rect.left, edge), rect.width - edge);
  const y = Math.min(Math.max(event.clientY - rect.top, edge), rect.height - edge);
  touch.marker.style.left = `${x}px`;
  touch.marker.style.top = `${y}px`;
}

function updateFingerStage() {
  const count = fingerTouches.size;
  elements.fingerCount.textContent = `${count} / 5`;
  elements.fingerArena.classList.toggle("has-fingers", count > 0);

  if (fingerWinner) return;
  if (count === 0) {
    elements.fingerStatus.textContent =
      "2~5명이 화면에 손가락을 동시에 올려 주세요.";
  } else if (count === 1) {
    elements.fingerStatus.textContent = "손가락을 하나 더 올려 주세요.";
  }
}

function scheduleFingerPick() {
  clearFingerPickTimer();
  updateFingerStage();
  if (fingerWinner || fingerTouches.size < 2) return;

  elements.fingerArena.classList.add("is-counting");
  elements.fingerStatus.textContent = `${fingerTouches.size}개 감지 · 그대로 유지하세요.`;
  fingerPickTimer = window.setTimeout(chooseFinger, 1800);
}

function addFinger(event) {
  if (
    fingerWinner ||
    fingerTouches.has(event.pointerId) ||
    (event.pointerType === "mouse" && event.button !== 0)
  ) {
    return;
  }
  event.preventDefault();

  if (fingerTouches.size >= 5) {
    elements.fingerStatus.textContent = "손가락은 최대 5개까지 인식해요.";
    return;
  }

  fingerSequence += 1;
  const marker = document.createElement("span");
  marker.className = "finger-marker";
  marker.textContent = String(fingerSequence);
  marker.setAttribute("aria-hidden", "true");
  marker.style.setProperty(
    "--finger-color",
    FINGER_COLORS[(fingerSequence - 1) % FINGER_COLORS.length],
  );
  elements.fingerArena.append(marker);

  const touch = {
    marker,
    order: fingerSequence,
  };
  fingerTouches.set(event.pointerId, touch);
  updateFingerPosition(touch, event);

  try {
    elements.fingerArena.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture is optional; the arena still receives ordinary touch events.
  }
  scheduleFingerPick();
}

function moveFinger(event) {
  const touch = fingerTouches.get(event.pointerId);
  if (!touch || fingerWinner) return;
  event.preventDefault();
  updateFingerPosition(touch, event);
}

function removeFinger(event) {
  const touch = fingerTouches.get(event.pointerId);
  if (!touch || fingerWinner) return;
  touch.marker.remove();
  fingerTouches.delete(event.pointerId);
  renumberFingerTouches();
  scheduleFingerPick();
}

function chooseFinger() {
  clearFingerPickTimer();
  const touches = [...fingerTouches.values()];
  if (touches.length < 2) {
    updateFingerStage();
    return;
  }

  fingerWinner = touches[randomInt(touches.length)];
  touches.forEach((touch) => {
    touch.marker.classList.toggle("is-winner", touch === fingerWinner);
    touch.marker.classList.toggle("is-out", touch !== fingerWinner);
  });
  elements.fingerArena.classList.add("is-complete");
  elements.fingerStatus.textContent = `${fingerWinner.order}번 손가락이 선택됐어요.`;
  if (navigator.vibrate) navigator.vibrate([80, 45, 140]);

  const displayText = `${fingerWinner.order}번 손가락`;
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "finger",
      lead: "선택된 손가락은",
      displayText,
      stakeLabel: "내기",
      stake: state.stake,
      copyText: `딱! 정해 손가락 뽑기: ${displayText} · ${state.stake}`,
      list: false,
    });
  }, 650);
}

function resetFinger() {
  window.clearTimeout(resultRevealTimer);
  clearFingerPickTimer();
  fingerTouches.forEach((touch) => touch.marker.remove());
  fingerTouches = new Map();
  fingerSequence = 0;
  fingerWinner = null;
  elements.fingerArena.classList.remove(
    "has-fingers",
    "is-counting",
    "is-complete",
  );
  elements.fingerCount.textContent = "0 / 5";
  elements.fingerStatus.textContent =
    "2~5명이 화면에 손가락을 동시에 올려 주세요.";
}

function chooseFingerFromNames() {
  if (!hasEnoughParticipants()) return;
  resetFinger();
  const winner = state.participants[randomInt(state.participants.length)];
  showResult({
    game: "finger",
    lead: "명단에서 뽑힌 사람은",
    displayText: winner,
    stakeLabel: "내기",
    stake: state.stake,
    copyText: `딱! 정해 손가락 뽑기 대체 추첨: ${winner} · ${state.stake}`,
    list: false,
  });
}

function getReactionNames() {
  return [
    state.participants[0] || "왼쪽",
    state.participants[1] || "오른쪽",
  ];
}

function setReactionSignal(title, detail) {
  elements.reactionSignal.querySelector("strong").textContent = title;
  elements.reactionSignal.querySelector("span").textContent = detail;
}

function renderReactionScore() {
  const names = getReactionNames();
  elements.reactionLeftName.textContent = names[0];
  elements.reactionRightName.textContent = names[1];
  elements.reactionLeftScore.textContent = String(reactionScores[0]);
  elements.reactionRightScore.textContent = String(reactionScores[1]);
}

function resetReaction(resetScores = true) {
  window.clearTimeout(resultRevealTimer);
  window.clearTimeout(reactionTimer);
  reactionTimer = null;
  reactionPhase = "idle";
  reactionGoAt = 0;
  if (resetScores) reactionScores = [0, 0];

  elements.reactionArena.dataset.phase = "idle";
  elements.reactionLeft.disabled = true;
  elements.reactionRight.disabled = true;
  elements.reactionStart.disabled = false;
  elements.reactionStart.textContent =
    reactionScores[0] + reactionScores[1] > 0 ? "다음 라운드" : "대결 시작";
  setReactionSignal("준비", "3점 먼저");
  renderReactionScore();

  const names = getReactionNames();
  elements.reactionStatus.textContent = `${names[0]} vs ${names[1]} · 먼저 3점`;
}

function startReactionRound() {
  if (reactionPhase === "waiting" || reactionPhase === "go") return;
  if (reactionScores.some((score) => score >= 3)) {
    resetReaction(true);
  }

  window.clearTimeout(reactionTimer);
  reactionPhase = "waiting";
  elements.reactionArena.dataset.phase = "waiting";
  elements.reactionLeft.disabled = false;
  elements.reactionRight.disabled = false;
  elements.reactionStart.disabled = true;
  setReactionSignal("기다려요", "아직 누르지 마세요");
  elements.reactionStatus.textContent = "신호가 바뀔 때까지 기다리세요.";

  reactionTimer = window.setTimeout(
    () => {
      reactionTimer = null;
      reactionPhase = "go";
      reactionGoAt = performance.now();
      elements.reactionArena.dataset.phase = "go";
      setReactionSignal("지금!", "먼저 터치");
      elements.reactionStatus.textContent = "지금 누르세요!";
      if (navigator.vibrate) navigator.vibrate(45);
    },
    1600 + randomInt(2600),
  );
}

function finishReactionRound(winnerIndex, reactionTime = null) {
  if (!["waiting", "go"].includes(reactionPhase)) return;

  const falseStart = reactionPhase === "waiting";
  window.clearTimeout(reactionTimer);
  reactionTimer = null;
  reactionPhase = "complete";
  elements.reactionArena.dataset.phase = "complete";
  elements.reactionLeft.disabled = true;
  elements.reactionRight.disabled = true;

  reactionScores[winnerIndex] += 1;
  renderReactionScore();
  const names = getReactionNames();

  if (falseStart) {
    const loserIndex = winnerIndex === 0 ? 1 : 0;
    setReactionSignal("부정 출발", `${names[winnerIndex]} +1`);
    elements.reactionStatus.textContent = `${names[loserIndex]} 부정 출발 · ${names[winnerIndex]} 1점`;
  } else {
    setReactionSignal(`${reactionTime}ms`, `${names[winnerIndex]} +1`);
    elements.reactionStatus.textContent = `${names[winnerIndex]} · ${reactionTime}ms로 먼저 터치했어요.`;
  }

  if (navigator.vibrate) navigator.vibrate([45, 30, 80]);
  if (reactionScores[winnerIndex] >= 3) {
    elements.reactionStart.disabled = true;
    elements.reactionStart.textContent = "대결 완료";
    const scoreText = `${names[0]} ${reactionScores[0]} : ${reactionScores[1]} ${names[1]}`;
    resultRevealTimer = window.setTimeout(() => {
      showResult({
        game: "reaction",
        lead: "반응속도 대결 승자는",
        displayText: names[winnerIndex],
        stakeLabel: "최종 점수",
        stake: scoreText,
        copyText: `딱! 정해 반응속도 대결: ${names[winnerIndex]} 승리 · ${scoreText}`,
        list: false,
      });
    }, 650);
    return;
  }

  elements.reactionStart.disabled = false;
  elements.reactionStart.textContent = "다음 라운드";
}

function handleReactionTap(side) {
  if (reactionPhase === "waiting") {
    finishReactionRound(side === 0 ? 1 : 0);
  } else if (reactionPhase === "go") {
    const reactionTime = Math.max(1, Math.round(performance.now() - reactionGoAt));
    finishReactionRound(side, reactionTime);
  }
}

function formatReactionRecord(value) {
  return value === null ? "--" : `${Math.round(value)}ms`;
}

function renderReactionSoloRecords() {
  elements.reactionSoloBest.textContent = formatReactionRecord(
    state.reactionSoloBest,
  );
  elements.reactionSoloLast.textContent = formatReactionRecord(
    reactionSoloLast,
  );
  elements.reactionSoloReset.disabled =
    state.reactionSoloBest === null ||
    ["waiting", "go"].includes(reactionSoloPhase);
}

function resetReactionSolo() {
  window.clearTimeout(resultRevealTimer);
  window.clearTimeout(reactionSoloTimer);
  reactionSoloTimer = null;
  reactionSoloPhase = "idle";
  reactionSoloGoAt = 0;
  elements.reactionSoloPad.dataset.phase = "idle";
  elements.reactionSoloPad.disabled = true;
  elements.reactionSoloSignal.textContent = "준비";
  elements.reactionSoloHint.textContent = "시작 버튼을 눌러 주세요";
  elements.reactionSoloStart.disabled = false;
  elements.reactionSoloStart.textContent = "기록 도전";
  renderReactionSoloRecords();
  if (state.currentMode === "solo" && state.currentGame === "reaction") {
    elements.reactionStatus.textContent =
      "신호가 빛나는 순간 최대한 빠르게 눌러 주세요.";
  }
}

function configureReactionMode() {
  const solo = state.currentMode === "solo";
  elements.reactionDuelStage.hidden = solo;
  elements.reactionSoloStage.hidden = !solo;
  if (solo) {
    resetReaction(false);
    resetReactionSolo();
  } else {
    resetReactionSolo();
    resetReaction(false);
  }
}

function startReactionSolo() {
  if (["waiting", "go"].includes(reactionSoloPhase)) return;
  window.clearTimeout(reactionSoloTimer);
  reactionSoloPhase = "waiting";
  elements.reactionSoloPad.dataset.phase = "waiting";
  elements.reactionSoloPad.disabled = false;
  elements.reactionSoloSignal.textContent = "기다려요";
  elements.reactionSoloHint.textContent = "아직 누르지 마세요";
  elements.reactionSoloStart.disabled = true;
  elements.reactionStatus.textContent = "색이 바뀔 때까지 기다리세요.";
  renderReactionSoloRecords();

  reactionSoloTimer = window.setTimeout(
    () => {
      reactionSoloTimer = null;
      reactionSoloPhase = "go";
      reactionSoloGoAt = performance.now();
      elements.reactionSoloPad.dataset.phase = "go";
      elements.reactionSoloSignal.textContent = "지금!";
      elements.reactionSoloHint.textContent = "바로 터치하세요";
      elements.reactionStatus.textContent = "지금 누르세요!";
      if (navigator.vibrate) navigator.vibrate(35);
    },
    1400 + randomInt(2800),
  );
}

function handleReactionSoloTap() {
  if (reactionSoloPhase === "waiting") {
    window.clearTimeout(reactionSoloTimer);
    reactionSoloTimer = null;
    reactionSoloPhase = "false-start";
    elements.reactionSoloPad.dataset.phase = "false-start";
    elements.reactionSoloPad.disabled = true;
    elements.reactionSoloSignal.textContent = "너무 빨라요";
    elements.reactionSoloHint.textContent = "신호 전에 눌렀어요";
    elements.reactionSoloStart.disabled = false;
    elements.reactionSoloStart.textContent = "다시 시도";
    elements.reactionStatus.textContent = "부정 출발 · 기록되지 않았어요.";
    renderReactionSoloRecords();
    return;
  }
  if (reactionSoloPhase !== "go") return;

  const record = Math.max(
    1,
    Math.round(performance.now() - reactionSoloGoAt),
  );
  reactionSoloPhase = "complete";
  reactionSoloLast = record;
  elements.reactionSoloPad.dataset.phase = "complete";
  elements.reactionSoloPad.disabled = true;
  elements.reactionSoloSignal.textContent = `${record}ms`;
  elements.reactionSoloHint.textContent = "반응 기록";
  elements.reactionSoloStart.disabled = false;
  elements.reactionSoloStart.textContent = "다시 도전";

  const newBest =
    state.reactionSoloBest === null || record < state.reactionSoloBest;
  if (newBest) {
    state.reactionSoloBest = record;
    saveState();
  }
  renderReactionSoloRecords();
  elements.reactionStatus.textContent = newBest
    ? `${record}ms · 새로운 최고 기록이에요!`
    : `${record}ms · 최고 ${state.reactionSoloBest}ms`;
  if (navigator.vibrate) navigator.vibrate([35, 25, 60]);

  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "reaction",
      gameLabel: "개인 반응속도",
      lead: newBest ? "새로운 최고 기록" : "이번 반응 기록",
      displayText: `${record}ms`,
      stakeLabel: "개인 최고",
      stake: `${state.reactionSoloBest}ms`,
      copyText: `딱! 정해 개인 반응속도: ${record}ms · 최고 ${state.reactionSoloBest}ms`,
      list: false,
      playMode: "solo",
      skipParty: true,
      allowMission: false,
    });
  }, 450);
}

function clearReactionSoloBest() {
  if (["waiting", "go"].includes(reactionSoloPhase)) return;
  state.reactionSoloBest = null;
  saveState();
  renderReactionSoloRecords();
  showToast("개인 반응속도 최고 기록을 초기화했어요.");
}
function timerPlayersMatch() {
  return (
    timerRound?.players.length === state.participants.length &&
    timerRound.players.every((name, index) => name === state.participants[index])
  );
}

function renderTimerResults() {
  elements.timerResults.replaceChildren();
  if (!timerRound?.results.length) {
    const empty = document.createElement("li");
    empty.className = "timer-result-empty";
    empty.textContent = "아직 기록이 없어요.";
    elements.timerResults.append(empty);
    return;
  }

  timerRound.results.forEach((result) => {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = result.name;
    const record = document.createElement("span");
    record.textContent = `${(result.elapsed / 1000).toFixed(2)}초`;
    const difference = document.createElement("small");
    difference.textContent = `오차 ${(result.difference / 1000).toFixed(2)}초`;
    item.append(name, record, difference);
    elements.timerResults.append(item);
  });
}

function resetTimer() {
  window.clearTimeout(resultRevealTimer);
  if (timerAnimationFrame !== null) {
    cancelAnimationFrame(timerAnimationFrame);
  }
  timerAnimationFrame = null;
  timerRunning = false;
  timerStartedAt = 0;
  timerRound =
    state.participants.length >= 2
      ? {
          players: [...state.participants],
          index: 0,
          results: [],
          complete: false,
        }
      : null;
  elements.timerBoard.dataset.phase = "idle";
  elements.timerDisplay.textContent = "0.00";
  elements.timerPlayer.textContent = timerRound
    ? timerRound.players[0]
    : "도전자 대기";
  elements.timerStatus.textContent = timerRound
    ? "참가자마다 한 번씩 5초에 도전해요."
    : "참가자를 2명 이상 추가해 주세요.";
  elements.timerStart.textContent = "도전 시작";
  elements.timerStart.disabled = !timerRound;
  elements.timerReset.disabled = !timerRound;
  renderTimerResults();
}

function updateTimerFrame(now) {
  if (!timerRunning) return;
  const elapsed = now - timerStartedAt;
  if (elapsed >= 10000) {
    finishTimerTurn(10000);
    return;
  }
  elements.timerDisplay.textContent =
    elapsed < 900 ? (elapsed / 1000).toFixed(2) : "•••";
  timerAnimationFrame = requestAnimationFrame(updateTimerFrame);
}

function finishTimerTurn(forcedElapsed = null) {
  if (!timerRunning || !timerRound) return;
  const elapsed = Math.min(
    forcedElapsed ?? performance.now() - timerStartedAt,
    10000,
  );
  timerRunning = false;
  if (timerAnimationFrame !== null) cancelAnimationFrame(timerAnimationFrame);
  timerAnimationFrame = null;

  const name = timerRound.players[timerRound.index];
  const result = {
    name,
    elapsed,
    difference: Math.abs(elapsed - 5000),
  };
  timerRound.results.push(result);
  elements.timerBoard.dataset.phase = "stopped";
  elements.timerDisplay.textContent = (elapsed / 1000).toFixed(2);
  elements.timerReset.disabled = false;
  if (navigator.vibrate) navigator.vibrate(45);
  renderTimerResults();

  if (timerRound.results.length < timerRound.players.length) {
    timerRound.index = timerRound.results.length;
    const nextName = timerRound.players[timerRound.index];
    elements.timerPlayer.textContent = nextName;
    elements.timerStatus.textContent = `${name} ${(elapsed / 1000).toFixed(2)}초 · 다음은 ${nextName}`;
    elements.timerStart.textContent = "다음 도전";
    return;
  }

  timerRound.complete = true;
  const bestDifference = Math.min(
    ...timerRound.results.map((entry) => entry.difference),
  );
  const winners = timerRound.results.filter(
    (entry) => Math.abs(entry.difference - bestDifference) < 1,
  );
  const winnerText = winners.map((entry) => entry.name).join("\n");
  const bestRecord = winners[0];
  elements.timerPlayer.textContent = winners.map((entry) => entry.name).join(", ");
  elements.timerStatus.textContent = `${elements.timerPlayer.textContent} 승리 · 오차 ${(bestDifference / 1000).toFixed(2)}초`;
  elements.timerStart.textContent = "다시 도전";

  window.clearTimeout(resultRevealTimer);
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "timer",
      lead: winners.length > 1 ? "5초 공동 우승은" : "5초에 가장 가까운 사람은",
      displayText: winnerText,
      stakeLabel: "최고 기록",
      stake: `${(bestRecord.elapsed / 1000).toFixed(2)}초 · 오차 ${(bestDifference / 1000).toFixed(2)}초`,
      copyText: `딱! 정해 5초 타이머: ${winners.map((entry) => entry.name).join(", ")} 승리 · ${(bestRecord.elapsed / 1000).toFixed(2)}초`,
      list: winners.length > 1,
    });
  }, 550);
}

function startTimerTurn() {
  if (timerRunning) {
    finishTimerTurn();
    return;
  }
  if (!hasEnoughParticipants()) return;
  if (!timerRound || timerRound.complete || !timerPlayersMatch()) resetTimer();
  if (!timerRound) return;

  timerRunning = true;
  timerStartedAt = performance.now();
  elements.timerBoard.dataset.phase = "running";
  elements.timerPlayer.textContent = timerRound.players[timerRound.index];
  elements.timerDisplay.textContent = "0.00";
  elements.timerStatus.textContent = "5초라고 느껴지는 순간 멈추세요.";
  elements.timerStart.textContent = "멈추기";
  elements.timerReset.disabled = true;
  timerAnimationFrame = requestAnimationFrame(updateTimerFrame);
}

function formatTimerSoloBest(value) {
  return value === null ? "--" : `${(value / 1000).toFixed(2)}초`;
}

function renderTimerSoloResults() {
  elements.timerSoloResults.replaceChildren();
  const attempts = timerSoloRound?.attempts || [];
  elements.timerSoloProgress.textContent = `${attempts.length} / 3`;
  elements.timerSoloBest.textContent = formatTimerSoloBest(state.timerSoloBest);
  elements.timerSoloReset.disabled =
    state.timerSoloBest === null || timerSoloRunning;

  if (!attempts.length) {
    const empty = document.createElement("li");
    empty.className = "timer-result-empty";
    empty.textContent = "3번의 기록이 여기에 쌓여요.";
    elements.timerSoloResults.append(empty);
    return;
  }

  attempts.forEach((attempt, index) => {
    const item = document.createElement("li");
    const round = document.createElement("strong");
    round.textContent = `${index + 1}회`;
    const record = document.createElement("span");
    record.textContent = `${(attempt.elapsed / 1000).toFixed(2)}초`;
    const difference = document.createElement("small");
    difference.textContent = `오차 ${(attempt.difference / 1000).toFixed(2)}초`;
    item.append(round, record, difference);
    elements.timerSoloResults.append(item);
  });
}

function resetTimerSolo() {
  window.clearTimeout(resultRevealTimer);
  if (timerSoloAnimationFrame !== null) {
    cancelAnimationFrame(timerSoloAnimationFrame);
  }
  timerSoloAnimationFrame = null;
  timerSoloRunning = false;
  timerSoloStartedAt = 0;
  timerSoloRound = { attempts: [], complete: false };
  elements.timerSoloBoard.dataset.phase = "idle";
  elements.timerSoloDisplay.textContent = "0.00";
  elements.timerSoloRoundLabel.textContent = "ROUND 1 / 3";
  elements.timerSoloStart.disabled = false;
  elements.timerSoloStart.textContent = "기록 도전";
  renderTimerSoloResults();
  if (state.currentMode === "solo" && state.currentGame === "timer") {
    elements.timerStatus.textContent =
      "세 번 도전해 평균 오차와 최고 기록을 확인하세요.";
  }
}

function configureTimerMode() {
  const solo = state.currentMode === "solo";
  elements.timerGroupStage.hidden = solo;
  elements.timerSoloStage.hidden = !solo;
  if (solo) {
    resetTimer();
    resetTimerSolo();
  } else {
    resetTimerSolo();
    resetTimer();
  }
}

function updateTimerSoloFrame(now) {
  if (!timerSoloRunning) return;
  const elapsed = now - timerSoloStartedAt;
  if (elapsed >= 10000) {
    finishTimerSoloTurn(10000);
    return;
  }
  elements.timerSoloDisplay.textContent =
    elapsed < 900 ? (elapsed / 1000).toFixed(2) : "•••";
  timerSoloAnimationFrame = requestAnimationFrame(updateTimerSoloFrame);
}

function finishTimerSoloTurn(forcedElapsed = null) {
  if (!timerSoloRunning || !timerSoloRound) return;
  const elapsed = Math.min(
    forcedElapsed ?? performance.now() - timerSoloStartedAt,
    10000,
  );
  timerSoloRunning = false;
  if (timerSoloAnimationFrame !== null) {
    cancelAnimationFrame(timerSoloAnimationFrame);
  }
  timerSoloAnimationFrame = null;

  const attempt = {
    elapsed,
    difference: Math.abs(elapsed - 5000),
  };
  timerSoloRound.attempts.push(attempt);
  const newBest =
    state.timerSoloBest === null || attempt.difference < state.timerSoloBest;
  if (newBest) {
    state.timerSoloBest = attempt.difference;
    saveState();
  }

  elements.timerSoloBoard.dataset.phase = "stopped";
  elements.timerSoloDisplay.textContent = (elapsed / 1000).toFixed(2);
  elements.timerSoloReset.disabled = false;
  renderTimerSoloResults();
  if (navigator.vibrate) navigator.vibrate(35);

  const count = timerSoloRound.attempts.length;
  if (count < 3) {
    elements.timerSoloRoundLabel.textContent = `ROUND ${count + 1} / 3`;
    elements.timerSoloStart.textContent = "다음 도전";
    elements.timerStatus.textContent = `${count}회 기록 ${(elapsed / 1000).toFixed(2)}초 · 오차 ${(attempt.difference / 1000).toFixed(2)}초`;
    return;
  }

  timerSoloRound.complete = true;
  const averageDifference =
    timerSoloRound.attempts.reduce(
      (total, entry) => total + entry.difference,
      0,
    ) / timerSoloRound.attempts.length;
  const bestAttempt = timerSoloRound.attempts.reduce((best, entry) =>
    entry.difference < best.difference ? entry : best,
  );
  elements.timerSoloRoundLabel.textContent = "3 ROUNDS COMPLETE";
  elements.timerSoloStart.textContent = "다시 도전";
  elements.timerStatus.textContent = `평균 오차 ${(averageDifference / 1000).toFixed(2)}초 · 최고 오차 ${(bestAttempt.difference / 1000).toFixed(2)}초`;

  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "timer",
      gameLabel: "개인 5초 기록",
      lead: "세 번의 평균 오차",
      displayText: `${(averageDifference / 1000).toFixed(2)}초`,
      stakeLabel: "개인 최고 오차",
      stake: formatTimerSoloBest(state.timerSoloBest),
      copyText: `딱! 정해 개인 5초 기록: 평균 오차 ${(averageDifference / 1000).toFixed(2)}초 · 최고 오차 ${formatTimerSoloBest(state.timerSoloBest)}`,
      list: false,
      playMode: "solo",
      skipParty: true,
      allowMission: false,
    });
  }, 550);
}

function startTimerSoloTurn() {
  if (timerSoloRunning) {
    finishTimerSoloTurn();
    return;
  }
  if (!timerSoloRound || timerSoloRound.complete) resetTimerSolo();

  timerSoloRunning = true;
  timerSoloStartedAt = performance.now();
  const round = timerSoloRound.attempts.length + 1;
  elements.timerSoloBoard.dataset.phase = "running";
  elements.timerSoloDisplay.textContent = "0.00";
  elements.timerSoloRoundLabel.textContent = `ROUND ${round} / 3`;
  elements.timerSoloStart.textContent = "멈추기";
  elements.timerSoloReset.disabled = true;
  elements.timerStatus.textContent = "5초라고 느껴지는 순간 멈추세요.";
  timerSoloAnimationFrame = requestAnimationFrame(updateTimerSoloFrame);
}

function clearTimerSoloBest() {
  if (timerSoloRunning) return;
  state.timerSoloBest = null;
  saveState();
  renderTimerSoloResults();
  showToast("개인 5초 최고 기록을 초기화했어요.");
}
function formatDodgeTime(milliseconds) {
  return (Math.max(0, milliseconds) / 1000).toFixed(2);
}

function clampDodge(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function makeRoundedRectPath(context, x, y, width, height, radius) {
  const corner = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + corner, y);
  context.lineTo(x + width - corner, y);
  context.arcTo(x + width, y, x + width, y + corner, corner);
  context.lineTo(x + width, y + height - corner);
  context.arcTo(
    x + width,
    y + height,
    x + width - corner,
    y + height,
    corner,
  );
  context.lineTo(x + corner, y + height);
  context.arcTo(x, y + height, x, y + height - corner, corner);
  context.lineTo(x, y + corner);
  context.arcTo(x, y, x + corner, y, corner);
  context.closePath();
}

function setDodgePrompt(title, detail) {
  elements.dodgePrompt.querySelector("strong").textContent = title;
  elements.dodgePrompt.querySelector("span").textContent = detail;
}

function renderDodgeBest() {
  elements.dodgeBest.textContent = formatDodgeTime(state.dodgeBest);
  elements.dodgeReset.disabled =
    state.dodgeBest <= 0 || ["countdown", "running"].includes(dodgePhase);
}

function resetDodge() {
  window.clearTimeout(resultRevealTimer);
  if (dodgeAnimationFrame !== null) {
    cancelAnimationFrame(dodgeAnimationFrame);
  }
  dodgeAnimationFrame = null;
  dodgePhase = "idle";
  dodgeLastFrame = 0;
  dodgeCountdown = 0;
  dodgeElapsed = 0;
  dodgeNextDrop = 80;
  dodgeNextSide = DODGE_SIDE_START;
  dodgeNextDoubleWave = 10000;
  dodgeNextDangerWave = 25000;
  dodgePendingSideWave = null;
  dodgeDifficultyTier = -1;
  dodgeObstacles = [];
  dodgeWarnings = [];
  dodgePointerId = null;
  dodgeKeys.clear();
  dodgePlayer = {
    x: DODGE_WIDTH / 2,
    y: DODGE_HEIGHT * 0.82,
    width: 68,
    height: 68,
  };

  elements.dodgeArena.dataset.phase = "idle";
  elements.dodgeTime.textContent = "0.00";
  elements.dodgeStatus.textContent =
    "처음부터 빠르게 떨어지는 장애물을 피하며 기록에 도전하세요.";
  elements.dodgeStart.disabled = false;
  elements.dodgeStart.textContent = "도전 시작";
  setDodgePrompt("READY", "드래그 또는 방향키로 이동");
  renderDodgeBest();
  drawDodgeScene();
}

function drawDodgeScene() {
  const context = elements.dodgeCanvas.getContext("2d");
  context.clearRect(0, 0, DODGE_WIDTH, DODGE_HEIGHT);
  context.fillStyle = "#f8fbff";
  context.fillRect(0, 0, DODGE_WIDTH, DODGE_HEIGHT);

  context.save();
  context.strokeStyle = "#e2eaf2";
  context.lineWidth = 1;
  context.setLineDash([10, 14]);
  for (let x = 200; x < DODGE_WIDTH; x += 200) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, DODGE_HEIGHT);
    context.stroke();
  }
  for (let y = 200; y < DODGE_HEIGHT; y += 200) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(DODGE_WIDTH, y);
    context.stroke();
  }
  context.restore();

  dodgeWarnings.forEach((warning) => {
    const dangerWave = warning.wave === "danger";
    const warningWidth = dangerWave ? 22 : 16;
    const edgeX =
      warning.side === "left" ? 0 : DODGE_WIDTH - warningWidth;
    context.fillStyle = dangerWave
      ? "rgba(213, 54, 82, 0.94)"
      : "rgba(239, 91, 85, 0.9)";
    context.fillRect(
      edgeX,
      warning.y - 10,
      warningWidth,
      warning.height + 20,
    );
    context.fillStyle = "#17191d";
    context.font = dangerWave
      ? "900 21px Arial, sans-serif"
      : "900 26px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      dangerWave ? "!!" : "!",
      edgeX + warningWidth / 2,
      warning.y + warning.height / 2,
    );
  });

  dodgeObstacles.forEach((obstacle) => {
    makeRoundedRectPath(
      context,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height,
      Math.min(15, obstacle.height / 3),
    );
    context.fillStyle = obstacle.color;
    context.fill();
    context.strokeStyle = "#17191d";
    context.lineWidth = 5;
    context.stroke();

    if (obstacle.kind === "side") {
      context.fillStyle = "#ffffff";
      context.font = '900 22px Arial, sans-serif';
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        obstacle.velocityX > 0 ? ">" : "<",
        obstacle.x + obstacle.width / 2,
        obstacle.y + obstacle.height / 2,
      );
    }
  });

  if (!dodgePlayer) return;
  const playerX = dodgePlayer.x - dodgePlayer.width / 2;
  const playerY = dodgePlayer.y - dodgePlayer.height / 2;
  makeRoundedRectPath(
    context,
    playerX,
    playerY + 5,
    dodgePlayer.width,
    dodgePlayer.height - 5,
    23,
  );
  context.fillStyle = dodgePhase === "gameover" ? "#ff8a80" : "#5f7fe8";
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 5;
  context.stroke();

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(dodgePlayer.x - 13, dodgePlayer.y - 7, 7, 0, Math.PI * 2);
  context.arc(dodgePlayer.x + 13, dodgePlayer.y - 7, 7, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#17191d";
  context.beginPath();
  context.arc(dodgePlayer.x - 11, dodgePlayer.y - 6, 2.7, 0, Math.PI * 2);
  context.arc(dodgePlayer.x + 15, dodgePlayer.y - 6, 2.7, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 3;
  context.beginPath();
  context.arc(dodgePlayer.x, dodgePlayer.y + 7, 11, 0.15, Math.PI - 0.15);
  context.stroke();
}

function spawnDodgeDrop() {
  const tier = Math.min(12, Math.floor(dodgeElapsed / 5000));
  const width = 54 + randomInt(76);
  const height = 38 + randomInt(42);
  let x = 24 + randomInt(DODGE_WIDTH - width - 48);

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const blocked = dodgeObstacles.some(
      (obstacle) =>
        obstacle.kind === "drop" &&
        obstacle.y < 170 &&
        x < obstacle.x + obstacle.width + 34 &&
        x + width + 34 > obstacle.x,
    );
    if (!blocked) break;
    x = 24 + randomInt(DODGE_WIDTH - width - 48);
  }

  const colors = ["#ff7268", "#f4c84c", "#35aa9d", "#6682df"];
  dodgeObstacles.push({
    kind: "drop",
    x,
    y: -height - 12,
    width,
    height,
    velocityX:
      dodgeElapsed >= 8000 && randomInt(100) < 58
        ? (randomInt(2) === 0 ? -1 : 1) * (70 + tier * 12)
        : 0,
    velocityY: 380 + tier * 46 + randomInt(120),
    color: colors[randomInt(colors.length)],
  });
}

function spawnDodgeSideWave(count = 1, wave = "single") {
  const tier = Math.min(12, Math.floor(dodgeElapsed / 5000));
  const waveCount = Math.min(Math.max(count, 1), 3);
  const laneCenters = [220, 410, 600, 790];

  for (let index = laneCenters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [laneCenters[index], laneCenters[swapIndex]] = [
      laneCenters[swapIndex],
      laneCenters[index],
    ];
  }

  const fromLeft = randomInt(2) === 0;
  laneCenters.slice(0, waveCount).forEach((center, index) => {
    const height = wave === "danger" ? 54 : 44 + randomInt(28);
    const duration =
      wave === "danger"
        ? 850
        : wave === "double"
          ? 700
          : Math.max(360, 580 - tier * 16);
    dodgeWarnings.push({
      side: (index % 2 === 0) === fromLeft ? "left" : "right",
      y: clampDodge(
        center - height / 2,
        150,
        DODGE_HEIGHT - height - 150,
      ),
      height,
      elapsed: 0,
      duration,
      wave,
    });
  });
}

function releaseDodgeSideObstacle(warning) {
  const tier = Math.min(12, Math.floor(dodgeElapsed / 5000));
  const width = 132;
  const speed = 560 + tier * 48;
  const fromLeft = warning.side === "left";
  dodgeObstacles.push({
    kind: "side",
    x: fromLeft ? -width - 10 : DODGE_WIDTH + 10,
    y: warning.y,
    width,
    height: warning.height,
    velocityX: fromLeft ? speed : -speed,
    velocityY: 0,
    color: warning.wave === "danger" ? "#d53652" : "#ef5b55",
    wave: warning.wave,
  });
}

function moveDodgePlayer(delta) {
  let horizontal = 0;
  let vertical = 0;
  if (dodgeKeys.has("ArrowLeft") || dodgeKeys.has("a")) horizontal -= 1;
  if (dodgeKeys.has("ArrowRight") || dodgeKeys.has("d")) horizontal += 1;
  if (dodgeKeys.has("ArrowUp") || dodgeKeys.has("w")) vertical -= 1;
  if (dodgeKeys.has("ArrowDown") || dodgeKeys.has("s")) vertical += 1;

  if (horizontal || vertical) {
    const length = Math.hypot(horizontal, vertical) || 1;
    const speed = 640;
    dodgePlayer.x += (horizontal / length) * speed * delta;
    dodgePlayer.y += (vertical / length) * speed * delta;
  }

  const halfWidth = dodgePlayer.width / 2;
  const halfHeight = dodgePlayer.height / 2;
  dodgePlayer.x = clampDodge(
    dodgePlayer.x,
    halfWidth + 18,
    DODGE_WIDTH - halfWidth - 18,
  );
  dodgePlayer.y = clampDodge(
    dodgePlayer.y,
    halfHeight + 96,
    DODGE_HEIGHT - halfHeight - 18,
  );
}

function dodgeObjectsCollide(obstacle) {
  const playerInsetX = dodgePlayer.width * 0.18;
  const playerInsetY = dodgePlayer.height * 0.18;
  const playerLeft = dodgePlayer.x - dodgePlayer.width / 2 + playerInsetX;
  const playerTop = dodgePlayer.y - dodgePlayer.height / 2 + playerInsetY;
  const playerRight =
    dodgePlayer.x + dodgePlayer.width / 2 - playerInsetX;
  const playerBottom =
    dodgePlayer.y + dodgePlayer.height / 2 - playerInsetY;
  const obstacleInset = 3;

  return (
    playerLeft < obstacle.x + obstacle.width - obstacleInset &&
    playerRight > obstacle.x + obstacleInset &&
    playerTop < obstacle.y + obstacle.height - obstacleInset &&
    playerBottom > obstacle.y + obstacleInset
  );
}

function finishDodge() {
  if (dodgePhase !== "running") return;
  dodgePhase = "gameover";
  dodgeAnimationFrame = null;
  elements.dodgeArena.dataset.phase = "gameover";

  const record = Math.max(0, Math.round(dodgeElapsed));
  const newBest = record > state.dodgeBest;
  if (newBest) {
    state.dodgeBest = record;
    saveState();
  }
  renderDodgeBest();
  elements.dodgeStart.disabled = false;
  elements.dodgeStart.textContent = "다시 도전";
  elements.dodgeStatus.textContent = newBest
    ? `${formatDodgeTime(record)}초 · 새로운 최고 기록이에요!`
    : `${formatDodgeTime(record)}초 생존 · 최고 ${formatDodgeTime(state.dodgeBest)}초`;
  setDodgePrompt(
    "GAME OVER",
    newBest ? "NEW BEST" : `${formatDodgeTime(record)}초 생존`,
  );
  drawDodgeScene();
  if (navigator.vibrate) navigator.vibrate([70, 40, 110]);

  window.clearTimeout(resultRevealTimer);
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "dodge",
      lead: newBest ? "새로운 최고 기록" : "이번 생존 기록",
      displayText: `${formatDodgeTime(record)}초`,
      stakeLabel: "개인 최고",
      stake: `${formatDodgeTime(state.dodgeBest)}초`,
      copyText: `딱! 정해 장애물 피하기: ${formatDodgeTime(record)}초 생존 · 최고 ${formatDodgeTime(state.dodgeBest)}초`,
      list: false,
      skipParty: true,
      allowMission: false,
    });
  }, 500);
}

function updateDodgeGame(delta) {
  dodgeElapsed += delta * 1000;
  elements.dodgeTime.textContent = formatDodgeTime(dodgeElapsed);
  moveDodgePlayer(delta);

  const tier = Math.min(12, Math.floor(dodgeElapsed / 5000));
  if (tier !== dodgeDifficultyTier) {
    dodgeDifficultyTier = tier;
    elements.dodgeStatus.textContent =
      dodgeElapsed < DODGE_SIDE_START
        ? `${tier + 1}단계 · 위에서 떨어지는 장애물을 피하세요.`
        : `${tier + 1}단계 · 좌우 장애물까지 조심하세요.`;
  }

  if (dodgeElapsed >= dodgeNextDrop) {
    spawnDodgeDrop();
    if (randomInt(100) < Math.min(82, 16 + tier * 8)) {
      spawnDodgeDrop();
    }
    const interval = Math.max(120, 460 - tier * 28);
    dodgeNextDrop = dodgeElapsed + interval + randomInt(50);
  }

  if (dodgeElapsed >= dodgeNextSide) {
    const sidePressure =
      dodgeWarnings.length +
      dodgeObstacles.filter((obstacle) => obstacle.kind === "side").length;
    const sideLimit = tier >= 5 ? 3 : 2;
    if (!dodgePendingSideWave && dodgeElapsed >= dodgeNextDangerWave) {
      dodgePendingSideWave = { count: 3, wave: "danger" };
      dodgeNextDangerWave = dodgeElapsed + 20000 + randomInt(6000);
      dodgeNextDoubleWave = Math.max(
        dodgeNextDoubleWave,
        dodgeElapsed + 5000,
      );
    } else if (!dodgePendingSideWave && dodgeElapsed >= dodgeNextDoubleWave) {
      dodgePendingSideWave = { count: 2, wave: "double" };
      dodgeNextDoubleWave = dodgeElapsed + 7000 + randomInt(4000);
    }

    if (dodgePendingSideWave) {
      if (sidePressure === 0) {
        const pendingWave = dodgePendingSideWave;
        dodgePendingSideWave = null;
        spawnDodgeSideWave(pendingWave.count, pendingWave.wave);
        elements.dodgeStatus.textContent =
          pendingWave.wave === "danger"
            ? "위험 파도 · 비어 있는 높이로 이동하세요!"
            : tier + 1 + "단계 · 좌우 2개 동시 공격!";
        dodgeNextSide = dodgeElapsed + 900;
      } else {
        dodgeNextSide = dodgeElapsed + 120;
      }
    } else if (sidePressure < sideLimit) {
      spawnDodgeSideWave();
      elements.dodgeStatus.textContent =
        tier + 1 + "단계 · 좌우 경고를 확인하세요.";
      const interval = Math.max(700, 1600 - tier * 80);
      dodgeNextSide = dodgeElapsed + interval + randomInt(180);
    } else {
      dodgeNextSide = dodgeElapsed + 180;
    }
  }

  dodgeWarnings = dodgeWarnings.filter((warning) => {
    warning.elapsed += delta * 1000;
    if (warning.elapsed < warning.duration) return true;
    releaseDodgeSideObstacle(warning);
    return false;
  });

  dodgeObstacles.forEach((obstacle) => {
    obstacle.x += obstacle.velocityX * delta;
    obstacle.y += obstacle.velocityY * delta;
    if (
      obstacle.kind === "drop" &&
      obstacle.velocityX !== 0 &&
      (obstacle.x < 14 || obstacle.x + obstacle.width > DODGE_WIDTH - 14)
    ) {
      obstacle.velocityX *= -1;
      obstacle.x = clampDodge(
        obstacle.x,
        14,
        DODGE_WIDTH - obstacle.width - 14,
      );
    }
  });
  dodgeObstacles = dodgeObstacles.filter(
    (obstacle) =>
      obstacle.y < DODGE_HEIGHT + obstacle.height + 20 &&
      obstacle.x < DODGE_WIDTH + obstacle.width + 30 &&
      obstacle.x + obstacle.width > -30,
  );

  if (dodgeObstacles.some(dodgeObjectsCollide)) {
    finishDodge();
  }
}

function runDodgeFrame(now) {
  if (!["countdown", "running"].includes(dodgePhase)) return;
  if (!dodgeLastFrame) dodgeLastFrame = now;
  const delta = Math.min((now - dodgeLastFrame) / 1000, 0.034);
  dodgeLastFrame = now;

  if (dodgePhase === "countdown") {
    dodgeCountdown -= delta * 1000;
    setDodgePrompt(String(Math.max(1, Math.ceil(dodgeCountdown / 1000))), "곧 시작해요");
    if (dodgeCountdown <= 0) {
      dodgePhase = "running";
      elements.dodgeArena.dataset.phase = "running";
      elements.dodgeStart.textContent = "피하는 중";
      elements.dodgeStatus.textContent = "1단계 · 처음부터 빠른 장애물을 피하세요.";
      dodgeLastFrame = now;
    }
  } else {
    updateDodgeGame(delta);
  }

  drawDodgeScene();
  if (["countdown", "running"].includes(dodgePhase)) {
    dodgeAnimationFrame = requestAnimationFrame(runDodgeFrame);
  } else {
    dodgeAnimationFrame = null;
  }
}

function startDodge() {
  if (["countdown", "running"].includes(dodgePhase)) return;
  resetDodge();
  dodgePhase = "countdown";
  dodgeCountdown = 3000;
  dodgeLastFrame = 0;
  elements.dodgeArena.dataset.phase = "countdown";
  elements.dodgeStart.disabled = true;
  elements.dodgeStart.textContent = "준비 중";
  elements.dodgeReset.disabled = true;
  elements.dodgeStatus.textContent = "잠시 후 시작합니다. 움직일 준비를 하세요.";
  setDodgePrompt("3", "곧 시작해요");
  elements.dodgeCanvas.focus({ preventScroll: true });
  dodgeAnimationFrame = requestAnimationFrame(runDodgeFrame);
}

function clearDodgeBest() {
  if (["countdown", "running"].includes(dodgePhase)) return;
  state.dodgeBest = 0;
  saveState();
  renderDodgeBest();
  elements.dodgeStatus.textContent = "최고 기록을 초기화했어요.";
  showToast("장애물 피하기 최고 기록을 초기화했어요.");
}

function moveDodgeWithPointer(event) {
  if (!["countdown", "running"].includes(dodgePhase) || !dodgePlayer) return;
  const rect = elements.dodgeCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = ((event.clientX - rect.left) / rect.width) * DODGE_WIDTH;
  const touchLift = event.pointerType === "touch" ? 78 : 0;
  const y =
    ((event.clientY - rect.top) / rect.height) * DODGE_HEIGHT - touchLift;
  dodgePlayer.x = x;
  dodgePlayer.y = y;
  moveDodgePlayer(0);
}
function renderTapBest() {
  elements.tapBest.textContent = String(state.tapBest);
  elements.tapReset.disabled =
    state.tapBest <= 0 || ["countdown", "running"].includes(tapPhase);
}

function resetTap() {
  window.clearTimeout(resultRevealTimer);
  if (tapAnimationFrame !== null) cancelAnimationFrame(tapAnimationFrame);
  tapAnimationFrame = null;
  tapPhase = "idle";
  tapPhaseStartedAt = 0;
  tapCount = 0;
  elements.tapPad.dataset.phase = "idle";
  elements.tapPad.disabled = true;
  elements.tapCount.textContent = "0";
  elements.tapPrompt.textContent = "시작하면 여기를 빠르게 누르세요";
  elements.tapTime.textContent = "10.0";
  elements.tapSpeed.textContent = "0.0/s";
  elements.tapStart.disabled = false;
  elements.tapStart.textContent = "도전 시작";
  elements.tapStatus.textContent = "10초 동안 얼마나 빠르게 누를 수 있을까요?";
  renderTapBest();
}

function finishTap() {
  if (tapPhase !== "running") return;
  tapPhase = "complete";
  tapAnimationFrame = null;
  elements.tapPad.dataset.phase = "complete";
  elements.tapPad.disabled = true;
  elements.tapTime.textContent = "0.0";
  elements.tapSpeed.textContent = `${(tapCount / 10).toFixed(1)}/s`;
  elements.tapPrompt.textContent = "도전 완료!";
  elements.tapStart.disabled = false;
  elements.tapStart.textContent = "다시 도전";

  const newBest = tapCount > state.tapBest;
  if (newBest) {
    state.tapBest = tapCount;
    saveState();
  }
  renderTapBest();
  elements.tapStatus.textContent = newBest
    ? `${tapCount}회 · 새로운 최고 기록이에요!`
    : `${tapCount}회 · 최고 ${state.tapBest}회`;
  if (navigator.vibrate) navigator.vibrate([45, 30, 80]);

  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "tap",
      gameLabel: "10초 연타",
      lead: newBest ? "새로운 최고 기록" : "이번 연타 기록",
      displayText: `${tapCount}회`,
      stakeLabel: "평균 속도",
      stake: `${(tapCount / 10).toFixed(1)}회/초 · 최고 ${state.tapBest}회`,
      copyText: `딱! 정해 10초 연타: ${tapCount}회 · ${(tapCount / 10).toFixed(1)}회/초 · 최고 ${state.tapBest}회`,
      list: false,
      playMode: "solo",
      skipParty: true,
      allowMission: false,
    });
  }, 500);
}

function runTapFrame(now) {
  if (tapPhase === "countdown") {
    const elapsed = now - tapPhaseStartedAt;
    const remaining = Math.max(0, 3000 - elapsed);
    elements.tapPrompt.textContent = `${Math.max(1, Math.ceil(remaining / 1000))}`;
    if (remaining <= 0) {
      tapPhase = "running";
      tapPhaseStartedAt = now;
      elements.tapPad.dataset.phase = "running";
      elements.tapPad.disabled = false;
      elements.tapPrompt.textContent = "빠르게 눌러요!";
      elements.tapStatus.textContent = "지금부터 10초! 최대한 빠르게 누르세요.";
      if (navigator.vibrate) navigator.vibrate(35);
    }
  } else if (tapPhase === "running") {
    const elapsed = now - tapPhaseStartedAt;
    const remaining = Math.max(0, 10000 - elapsed);
    elements.tapTime.textContent = (remaining / 1000).toFixed(1);
    const seconds = Math.max(elapsed / 1000, 0.1);
    elements.tapSpeed.textContent = `${(tapCount / seconds).toFixed(1)}/s`;
    if (remaining <= 0) {
      finishTap();
      return;
    }
  } else {
    return;
  }

  tapAnimationFrame = requestAnimationFrame(runTapFrame);
}

function startTap() {
  if (["countdown", "running"].includes(tapPhase)) return;
  resetTap();
  tapPhase = "countdown";
  tapPhaseStartedAt = performance.now();
  elements.tapPad.dataset.phase = "countdown";
  elements.tapPad.disabled = false;
  elements.tapCount.textContent = "0";
  elements.tapPrompt.textContent = "3";
  elements.tapStart.disabled = true;
  elements.tapStart.textContent = "준비 중";
  elements.tapReset.disabled = true;
  elements.tapStatus.textContent = "손가락을 준비하세요. 곧 시작합니다.";
  elements.tapPad.focus({ preventScroll: true });
  tapAnimationFrame = requestAnimationFrame(runTapFrame);
}

function handleTapPress() {
  if (tapPhase !== "running") return;
  tapCount += 1;
  elements.tapCount.textContent = String(tapCount);
  elements.tapPad.classList.remove("is-hit");
  window.requestAnimationFrame(() => {
    elements.tapPad.classList.add("is-hit");
  });
  if (navigator.vibrate && tapCount % 10 === 0) navigator.vibrate(8);
}

function clearTapBest() {
  if (["countdown", "running"].includes(tapPhase)) return;
  state.tapBest = 0;
  saveState();
  renderTapBest();
  showToast("10초 연타 최고 기록을 초기화했어요.");
}

function getRunnerScore() {
  return Math.floor(runnerDistanceValue * 10) + runnerIngredientScore;
}

function isRunnerFeverActive() {
  return runnerPhase === "running" && runnerElapsed < runnerFeverUntil;
}

function isRunnerMagnetActive() {
  return isRunnerFeverActive() || runnerElapsed < runnerMagnetUntil;
}

function setRunnerPrompt(title, detail) {
  elements.runnerPrompt.querySelector("strong").textContent = title;
  elements.runnerPrompt.querySelector("span").textContent = detail;
}

function renderRunnerHud() {
  const feverActive = isRunnerFeverActive();
  const magnetActive = runnerElapsed < runnerMagnetUntil;
  const feverRemaining = Math.max(0, runnerFeverUntil - runnerElapsed);
  const feverPercent = feverActive
    ? (feverRemaining / RUNNER_FEVER_DURATION) * 100
    : runnerFever;
  const effects = [];
  if (feverActive) {
    effects.push("무적", "자석", "2배");
  } else {
    if (runnerShield > 0) effects.push("보호막");
    if (magnetActive) {
      effects.push(
        "자석 " +
          ((runnerMagnetUntil - runnerElapsed) / 1000).toFixed(1) +
          "초",
      );
    }
  }

  runnerScoreValue = getRunnerScore();
  elements.runnerScore.textContent = runnerScoreValue.toLocaleString();
  elements.runnerDistance.textContent = Math.floor(runnerDistanceValue) + "m";
  elements.runnerBest.textContent = state.runnerBest.toLocaleString();
  elements.runnerBread.textContent = String(runnerRecipe.bread);
  elements.runnerCream.textContent = String(runnerRecipe.cream);
  elements.runnerBerry.textContent = String(runnerRecipe.berry);
  elements.runnerSnacks.textContent = String(runnerSnackCount);
  elements.runnerFever.textContent = feverActive
    ? (feverRemaining / 1000).toFixed(1) + "초"
    : Math.floor(runnerFever) + "%";
  elements.runnerFeverBar.style.width = Math.max(0, feverPercent) + "%";
  elements.runnerEffect.textContent = effects.length
    ? effects.join(" · ")
    : "속도 " + Math.round(runnerSpeed);
  elements.runnerArena.classList.toggle("is-fever", feverActive);
  elements.runnerArena.classList.toggle("has-shield", runnerShield > 0);
  elements.runnerReset.disabled =
    (state.runnerBest <= 0 && state.runnerBestDistance <= 0) ||
    ["countdown", "running"].includes(runnerPhase);
}

function resetRunner() {
  window.clearTimeout(resultRevealTimer);
  if (runnerAnimationFrame !== null) {
    cancelAnimationFrame(runnerAnimationFrame);
  }
  runnerAnimationFrame = null;
  runnerPhase = "idle";
  runnerLastFrame = 0;
  runnerCountdown = 0;
  runnerElapsed = 0;
  runnerDistanceValue = 0;
  runnerScoreValue = 0;
  runnerIngredientScore = 0;
  runnerSpeed = 430;
  runnerNextObstacle = 850;
  runnerNextIngredient = 560;
  runnerNextItem = 4500;
  runnerObstacles = [];
  runnerIngredients = [];
  runnerItems = [];
  runnerRecipe = { bread: 0, cream: 0, berry: 0 };
  runnerSnackCount = 0;
  runnerCombo = 0;
  runnerFever = 0;
  runnerFeverUntil = 0;
  runnerFeverCount = 0;
  runnerMagnetUntil = 0;
  runnerShield = 0;
  runnerInvulnerableUntil = 0;
  runnerPlayer = {
    x: 150,
    y: RUNNER_GROUND_Y - 72,
    width: 62,
    height: 72,
    velocityY: 0,
    jumps: 0,
  };
  elements.runnerArena.dataset.phase = "idle";
  elements.runnerArena.classList.remove("is-fever", "has-shield");
  elements.runnerStart.disabled = false;
  elements.runnerStart.textContent = "달리기 시작";
  elements.runnerStatus.textContent =
    "함정과 공중 장애물을 구분해 피하고 피버를 완성하세요.";
  setRunnerPrompt("READY", "화면을 눌러 2단 점프");
  renderRunnerHud();
  drawRunnerScene();
}

function jumpRunner() {
  if (runnerPhase !== "running" || !runnerPlayer) return;
  if (runnerPlayer.jumps >= 2) return;
  runnerPlayer.velocityY = runnerPlayer.jumps === 0 ? -900 : -760;
  runnerPlayer.jumps += 1;
  if (navigator.vibrate) navigator.vibrate(8);
}

function createRunnerObstacle(type, tier, x) {
  let width = 56 + randomInt(34);
  let height = Math.min(145, 70 + randomInt(44 + tier * 3));
  let y = RUNNER_GROUND_Y - height;
  let color = ["#ff7268", "#f4c84c", "#35aa9d"][randomInt(3)];

  if (type === "trap") {
    width = 110 + randomInt(60);
    height = 27 + randomInt(10);
    y = RUNNER_GROUND_Y - height;
    color = "#ef5f67";
  } else if (type === "air") {
    width = 90 + randomInt(40);
    height = 55 + randomInt(18);
    y = RUNNER_GROUND_Y - 178 - randomInt(24);
    color = "#6f72df";
  }

  return {
    x,
    y,
    width,
    height,
    color,
    type,
    bobOffset: randomInt(628) / 100,
  };
}

function spawnRunnerObstacle() {
  const tier = Math.min(12, Math.floor(runnerElapsed / 5000));
  const roll = randomInt(100);
  let type = "crate";
  if (runnerElapsed >= 4500 && roll < 38) type = "trap";
  if (runnerElapsed >= 7500 && roll >= 68) type = "air";

  const startX = RUNNER_WIDTH + 36;
  runnerObstacles.push(createRunnerObstacle(type, tier, startX));

  let trailingOffset = 0;
  if (runnerElapsed >= 18000 && randomInt(100) < 38) {
    const followType = randomInt(100) < 58 ? "trap" : "crate";
    const baseOffset = type === "air" ? 430 : 250;
    trailingOffset = baseOffset + randomInt(type === "air" ? 80 : 100);
    runnerObstacles.push(
      createRunnerObstacle(followType, tier, startX + trailingOffset),
    );
  }
  return trailingOffset;
}

function spawnRunnerIngredient() {
  const smallest = Math.min(
    ...RUNNER_INGREDIENT_TYPES.map((type) => runnerRecipe[type]),
  );
  const needed = RUNNER_INGREDIENT_TYPES.filter(
    (type) => runnerRecipe[type] === smallest,
  );
  const type =
    randomInt(100) < 72
      ? needed[randomInt(needed.length)]
      : RUNNER_INGREDIENT_TYPES[randomInt(RUNNER_INGREDIENT_TYPES.length)];
  const levels = [
    RUNNER_GROUND_Y - 82,
    RUNNER_GROUND_Y - 142,
    RUNNER_GROUND_Y - 205,
  ];
  runnerIngredients.push({
    x: RUNNER_WIDTH + 42,
    y: levels[randomInt(levels.length)],
    radius: 23,
    type,
  });
}

function spawnRunnerItem() {
  const levels = [
    RUNNER_GROUND_Y - 94,
    RUNNER_GROUND_Y - 154,
    RUNNER_GROUND_Y - 214,
  ];
  runnerItems.push({
    x: RUNNER_WIDTH + 48,
    y: levels[randomInt(levels.length)],
    radius: 27,
    type: randomInt(100) < 52 ? "shield" : "magnet",
    bobOffset: randomInt(628) / 100,
  });
}

function runnerObjectsCollide(object, circular = false) {
  const playerInsetX = 9;
  const playerInsetY = 7;
  const left = runnerPlayer.x + playerInsetX;
  const top = runnerPlayer.y + playerInsetY;
  const right = runnerPlayer.x + runnerPlayer.width - playerInsetX;
  const bottom = runnerPlayer.y + runnerPlayer.height - playerInsetY;
  const objectLeft = circular ? object.x - object.radius : object.x + 4;
  const objectTop = circular ? object.y - object.radius : object.y + 4;
  const objectRight = circular
    ? object.x + object.radius
    : object.x + object.width - 4;
  const objectBottom = circular
    ? object.y + object.radius
    : object.y + object.height - 3;
  return (
    left < objectRight &&
    right > objectLeft &&
    top < objectBottom &&
    bottom > objectTop
  );
}

function activateRunnerFever() {
  if (isRunnerFeverActive() || runnerFever < 100) return;
  runnerFever = 0;
  runnerFeverUntil = runnerElapsed + RUNNER_FEVER_DURATION;
  runnerFeverCount += 1;
  runnerIngredientScore += 600 + runnerFeverCount * 150;
  elements.runnerStatus.textContent =
    "FEVER! 6초 동안 무적·자석·점수 2배가 적용돼요.";
  if (navigator.vibrate) navigator.vibrate([35, 20, 35, 20, 70]);
}

function completeRunnerSnack() {
  const complete = RUNNER_INGREDIENT_TYPES.every(
    (type) => runnerRecipe[type] > 0,
  );
  if (!complete) return;
  RUNNER_INGREDIENT_TYPES.forEach((type) => {
    runnerRecipe[type] -= 1;
  });
  runnerSnackCount += 1;
  runnerCombo += 1;
  const multiplier = isRunnerFeverActive() ? 2 : 1;
  runnerIngredientScore += (450 + runnerCombo * 120) * multiplier;
  if (!isRunnerFeverActive()) runnerFever = Math.min(100, runnerFever + 13);
  elements.runnerStatus.textContent =
    runnerCombo + "콤보 · 간식 " + runnerSnackCount + "개 완성!";
  if (navigator.vibrate) navigator.vibrate([18, 18, 35]);
}

function collectRunnerIngredient(ingredient) {
  runnerRecipe[ingredient.type] += 1;
  const multiplier = isRunnerFeverActive() ? 2 : 1;
  runnerIngredientScore += (120 + runnerCombo * 30) * multiplier;
  if (!isRunnerFeverActive()) runnerFever = Math.min(100, runnerFever + 9);
  completeRunnerSnack();
  activateRunnerFever();
  renderRunnerHud();
}

function collectRunnerItem(item) {
  runnerIngredientScore += 250;
  if (item.type === "shield") {
    runnerShield = 1;
    elements.runnerStatus.textContent =
      "보호막 획득! 장애물 충돌을 한 번 막아줘요.";
  } else {
    runnerMagnetUntil =
      Math.max(runnerElapsed, runnerMagnetUntil) + RUNNER_MAGNET_DURATION;
    elements.runnerStatus.textContent =
      "재료 자석 획득! 7초 동안 재료를 끌어당겨요.";
  }
  if (navigator.vibrate) navigator.vibrate([20, 15, 25]);
}

function drawRunnerIngredient(context, ingredient) {
  context.save();
  context.translate(ingredient.x, ingredient.y);
  context.strokeStyle = "#17191d";
  context.lineWidth = 4;
  if (ingredient.type === "bread") {
    makeRoundedRectPath(context, -22, -18, 44, 36, 11);
    context.fillStyle = "#e9ad62";
    context.fill();
    context.stroke();
    context.strokeStyle = "#a96336";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-10, -5);
    context.lineTo(-4, 4);
    context.moveTo(3, -7);
    context.lineTo(9, 2);
    context.stroke();
  } else if (ingredient.type === "cream") {
    context.beginPath();
    context.moveTo(-22, 17);
    context.bezierCurveTo(-23, 4, -15, 1, -10, 2);
    context.bezierCurveTo(-11, -11, 0, -20, 7, -10);
    context.bezierCurveTo(17, -12, 24, -2, 18, 7);
    context.bezierCurveTo(25, 12, 19, 19, 8, 18);
    context.closePath();
    context.fillStyle = "#ffffff";
    context.fill();
    context.stroke();
    context.fillStyle = "#8edbd3";
    context.beginPath();
    context.arc(5, -5, 4, 0, Math.PI * 2);
    context.fill();
  } else {
    context.beginPath();
    context.moveTo(0, 23);
    context.bezierCurveTo(-27, 6, -22, -17, 0, -14);
    context.bezierCurveTo(22, -17, 27, 6, 0, 23);
    context.closePath();
    context.fillStyle = "#f45f5b";
    context.fill();
    context.stroke();
    context.fillStyle = "#2f9d78";
    context.beginPath();
    context.moveTo(-13, -12);
    context.lineTo(0, -25);
    context.lineTo(4, -12);
    context.lineTo(16, -18);
    context.lineTo(11, -8);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#ffe9a5";
    [-8, 7].forEach((x) => {
      context.beginPath();
      context.arc(x, 2, 2.2, 0, Math.PI * 2);
      context.fill();
    });
  }
  context.restore();
}

function drawRunnerItem(context, item) {
  const bob = Math.sin(runnerElapsed / 240 + item.bobOffset) * 6;
  context.save();
  context.translate(item.x, item.y + bob);
  context.fillStyle = item.type === "shield" ? "#64c8f0" : "#a875e8";
  context.strokeStyle = "#17191d";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(0, 0, item.radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = "rgba(255, 255, 255, 0.45)";
  context.beginPath();
  context.arc(-8, -9, 7, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#ffffff";
  context.fillStyle = "#ffffff";
  context.lineWidth = 6;
  context.lineCap = "round";
  context.lineJoin = "round";
  if (item.type === "shield") {
    context.beginPath();
    context.moveTo(0, -15);
    context.lineTo(14, -8);
    context.lineTo(10, 8);
    context.quadraticCurveTo(0, 18, -10, 8);
    context.lineTo(-14, -8);
    context.closePath();
    context.stroke();
  } else {
    context.beginPath();
    context.arc(0, -1, 12, Math.PI * 0.12, Math.PI * 0.88, true);
    context.stroke();
    context.beginPath();
    context.moveTo(-12, 7);
    context.lineTo(-12, 15);
    context.moveTo(12, 7);
    context.lineTo(12, 15);
    context.stroke();
  }
  context.restore();
}

function drawRunnerObstacle(context, obstacle) {
  context.save();
  context.strokeStyle = "#17191d";
  context.lineWidth = 5;

  if (obstacle.type === "trap") {
    const spikeWidth = 22;
    context.fillStyle = obstacle.color;
    context.beginPath();
    context.moveTo(obstacle.x, obstacle.y + obstacle.height);
    for (
      let x = obstacle.x;
      x < obstacle.x + obstacle.width;
      x += spikeWidth
    ) {
      context.lineTo(x + spikeWidth / 2, obstacle.y);
      context.lineTo(
        Math.min(x + spikeWidth, obstacle.x + obstacle.width),
        obstacle.y + obstacle.height,
      );
    }
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#ffd9d7";
    context.fillRect(
      obstacle.x + 7,
      obstacle.y + obstacle.height - 7,
      obstacle.width - 14,
      4,
    );
    context.restore();
    return;
  }

  if (obstacle.type === "air") {
    context.strokeStyle = "#5357bd";
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(obstacle.x + 16, obstacle.y - 16);
    context.lineTo(obstacle.x + 16, obstacle.y);
    context.moveTo(obstacle.x + obstacle.width - 16, obstacle.y - 16);
    context.lineTo(obstacle.x + obstacle.width - 16, obstacle.y);
    context.stroke();
    context.strokeStyle = "#17191d";
    context.lineWidth = 5;
  }

  makeRoundedRectPath(
    context,
    obstacle.x,
    obstacle.y,
    obstacle.width,
    obstacle.height,
    9,
  );
  context.fillStyle = obstacle.color;
  context.fill();
  context.stroke();
  context.save();
  context.beginPath();
  context.rect(
    obstacle.x + 5,
    obstacle.y + 5,
    obstacle.width - 10,
    obstacle.height - 10,
  );
  context.clip();
  context.strokeStyle = "rgba(255,255,255,0.7)";
  context.lineWidth = 8;
  for (let stripe = -obstacle.height; stripe < obstacle.width; stripe += 26) {
    context.beginPath();
    context.moveTo(obstacle.x + stripe, obstacle.y + obstacle.height);
    context.lineTo(obstacle.x + stripe + obstacle.height, obstacle.y);
    context.stroke();
  }
  context.restore();
  context.fillStyle = "#17191d";
  context.font = "900 22px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    obstacle.type === "air" ? "↓" : "!",
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 2,
  );
  context.restore();
}

function drawRunnerScene() {
  const context = elements.runnerCanvas.getContext("2d");
  const feverActive = isRunnerFeverActive();
  context.clearRect(0, 0, RUNNER_WIDTH, RUNNER_HEIGHT);
  context.fillStyle = feverActive ? "#fff4bd" : "#f7fbff";
  context.fillRect(0, 0, RUNNER_WIDTH, RUNNER_HEIGHT);

  context.fillStyle = "#ffe28a";
  context.beginPath();
  context.arc(832, 92, 38, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#ffffff";
  [[130, 96], [430, 135], [690, 78]].forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 28, 0, Math.PI * 2);
    context.arc(x + 30, y - 12, 34, 0, Math.PI * 2);
    context.arc(x + 64, y, 27, 0, Math.PI * 2);
    context.fill();
  });

  const horizonY = RUNNER_GROUND_Y - 130;
  context.fillStyle = "#dcecf1";
  context.fillRect(0, horizonY, RUNNER_WIDTH, RUNNER_GROUND_Y - horizonY);
  context.fillStyle = "#eaf5ec";
  context.fillRect(0, RUNNER_GROUND_Y, RUNNER_WIDTH, RUNNER_HEIGHT - RUNNER_GROUND_Y);
  context.fillStyle = "#4ca876";
  context.fillRect(0, RUNNER_GROUND_Y, RUNNER_WIDTH, 9);

  if (feverActive) {
    context.strokeStyle = "rgba(255, 161, 56, 0.28)";
    context.lineWidth = 8;
    for (let line = 0; line < 7; line += 1) {
      const x = (line * 170 - (runnerElapsed * 0.55) % 1190) + 160;
      context.beginPath();
      context.moveTo(x, 190 + line * 28);
      context.lineTo(x + 95, 190 + line * 28);
      context.stroke();
    }
  }

  const groundOffset = (runnerDistanceValue * 12) % 82;
  context.fillStyle = "#b8d7c1";
  for (let x = -groundOffset; x < RUNNER_WIDTH; x += 82) {
    context.fillRect(x, RUNNER_GROUND_Y + 38, 44, 7);
  }

  runnerObstacles.forEach((obstacle) => drawRunnerObstacle(context, obstacle));

  runnerIngredients.forEach((ingredient) => {
    drawRunnerIngredient(context, ingredient);
  });
  runnerItems.forEach((item) => drawRunnerItem(context, item));

  if (!runnerPlayer) return;
  context.fillStyle = "rgba(23, 25, 29, 0.16)";
  context.beginPath();
  context.ellipse(
    runnerPlayer.x + runnerPlayer.width / 2,
    RUNNER_GROUND_Y + 4,
    34,
    9,
    0,
    0,
    Math.PI * 2,
  );
  context.fill();

  if (feverActive || runnerShield > 0) {
    context.fillStyle = feverActive
      ? "rgba(255, 205, 63, 0.25)"
      : "rgba(73, 190, 239, 0.2)";
    context.strokeStyle = feverActive ? "#ffad33" : "#56bce6";
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(
      runnerPlayer.x + runnerPlayer.width / 2,
      runnerPlayer.y + runnerPlayer.height / 2,
      48,
      54,
      0,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.stroke();
  }

  context.save();
  if (
    runnerElapsed < runnerInvulnerableUntil &&
    Math.floor(runnerElapsed / 90) % 2 === 0
  ) {
    context.globalAlpha = 0.38;
  }
  makeRoundedRectPath(
    context,
    runnerPlayer.x,
    runnerPlayer.y + 12,
    runnerPlayer.width,
    runnerPlayer.height - 12,
    20,
  );
  context.fillStyle = runnerPhase === "gameover" ? "#ff8a80" : "#5f7fe8";
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 5;
  context.stroke();

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(runnerPlayer.x + 18, runnerPlayer.y + 35, 6, 0, Math.PI * 2);
  context.arc(runnerPlayer.x + 42, runnerPlayer.y + 35, 6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#17191d";
  context.beginPath();
  context.arc(runnerPlayer.x + 20, runnerPlayer.y + 36, 2.5, 0, Math.PI * 2);
  context.arc(runnerPlayer.x + 44, runnerPlayer.y + 36, 2.5, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(runnerPlayer.x + 20, runnerPlayer.y + 12, 15, Math.PI, 0);
  context.arc(runnerPlayer.x + 31, runnerPlayer.y + 5, 17, Math.PI, 0);
  context.arc(runnerPlayer.x + 44, runnerPlayer.y + 12, 15, Math.PI, 0);
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(runnerPlayer.x + 10, runnerPlayer.y + 13);
  context.lineTo(runnerPlayer.x + 52, runnerPlayer.y + 13);
  context.stroke();
  context.restore();
}

function finishRunner() {
  if (runnerPhase !== "running") return;
  runnerPhase = "gameover";
  runnerAnimationFrame = null;
  elements.runnerArena.dataset.phase = "gameover";
  runnerScoreValue = getRunnerScore();
  const distance = Math.floor(runnerDistanceValue);
  const newScoreBest = runnerScoreValue > state.runnerBest;
  const newDistanceBest = distance > state.runnerBestDistance;
  if (newScoreBest) state.runnerBest = runnerScoreValue;
  if (newDistanceBest) state.runnerBestDistance = distance;
  if (newScoreBest || newDistanceBest) saveState();
  renderRunnerHud();
  elements.runnerStart.disabled = false;
  elements.runnerStart.textContent = "다시 달리기";
  elements.runnerStatus.textContent =
    newScoreBest
      ? "새로운 최고 점수! " + runnerScoreValue.toLocaleString() + "점"
      : distance +
        "m · 간식 " +
        runnerSnackCount +
        "개 · 피버 " +
        runnerFeverCount +
        "회";
  setRunnerPrompt(
    newScoreBest ? "NEW BEST" : "FINISH",
    distance + "m · " + runnerSnackCount + " SNACKS",
  );
  drawRunnerScene();
  if (navigator.vibrate) navigator.vibrate([65, 35, 95]);

  window.clearTimeout(resultRevealTimer);
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "runner",
      lead: newScoreBest ? "새로운 최고 기록!" : "이번 달리기 기록",
      displayText: runnerScoreValue.toLocaleString() + "점",
      stakeLabel: "달린 기록",
      stake:
        distance +
        "m · 간식 " +
        runnerSnackCount +
        "개 · 피버 " +
        runnerFeverCount +
        "회",
      copyText:
        "딱! 정해 간식 러너: " +
        runnerScoreValue.toLocaleString() + "점 · " +
        distance +
        "m · 간식 " +
        runnerSnackCount +
        "개 · 피버 " +
        runnerFeverCount +
        "회",
      list: false,
      playMode: "solo",
      skipParty: true,
      allowMission: false,
    });
  }, 500);
}

function updateRunnerGame(delta) {
  runnerElapsed += delta * 1000;
  const baseSpeed = Math.min(1120, 430 + (runnerElapsed / 1000) * 18);
  runnerSpeed = baseSpeed + (isRunnerFeverActive() ? 140 : 0);
  runnerDistanceValue += (runnerSpeed * delta) / 10;

  runnerPlayer.velocityY += 2300 * delta;
  runnerPlayer.y += runnerPlayer.velocityY * delta;
  const groundTop = RUNNER_GROUND_Y - runnerPlayer.height;
  if (runnerPlayer.y >= groundTop) {
    runnerPlayer.y = groundTop;
    runnerPlayer.velocityY = 0;
    runnerPlayer.jumps = 0;
  }

  const tier = Math.min(12, Math.floor(runnerElapsed / 5000));
  if (runnerElapsed >= runnerNextObstacle) {
    const trailingOffset = spawnRunnerObstacle();
    const interval = Math.max(820, 1320 - tier * 55);
    const patternDelay =
      trailingOffset > 0
        ? (trailingOffset / Math.max(1, runnerSpeed)) * 1000
        : 0;
    runnerNextObstacle =
      runnerElapsed + interval + patternDelay + randomInt(220);
  }
  if (runnerElapsed >= runnerNextIngredient) {
    spawnRunnerIngredient();
    runnerNextIngredient = runnerElapsed + 700 + randomInt(430);
  }
  if (runnerElapsed >= runnerNextItem) {
    spawnRunnerItem();
    runnerNextItem = runnerElapsed + 7200 + randomInt(4200);
  }

  runnerObstacles.forEach((obstacle) => {
    obstacle.x -= runnerSpeed * delta;
  });
  runnerIngredients.forEach((ingredient) => {
    ingredient.x -= runnerSpeed * delta;
    const targetX = runnerPlayer.x + runnerPlayer.width / 2;
    if (
      isRunnerMagnetActive() &&
      (ingredient.magnetCaptured || ingredient.x >= targetX)
    ) {
      ingredient.magnetCaptured = true;
      const pull = 1 - Math.exp(-delta * 8.5);
      const targetY = runnerPlayer.y + runnerPlayer.height / 2;
      ingredient.x += (targetX - ingredient.x) * pull;
      ingredient.y += (targetY - ingredient.y) * pull;
      ingredient.x = Math.max(targetX, ingredient.x);
    }
  });
  runnerItems.forEach((item) => {
    item.x -= runnerSpeed * delta;
  });

  runnerIngredients = runnerIngredients.filter((ingredient) => {
    if (runnerObjectsCollide(ingredient, true)) {
      collectRunnerIngredient(ingredient);
      return false;
    }
    return ingredient.x + ingredient.radius > -20;
  });
  runnerItems = runnerItems.filter((item) => {
    if (runnerObjectsCollide(item, true)) {
      collectRunnerItem(item);
      return false;
    }
    return item.x + item.radius > -30;
  });
  runnerObstacles = runnerObstacles.filter(
    (obstacle) => obstacle.x + obstacle.width > -30,
  );

  const collisionIndex = runnerObstacles.findIndex((obstacle) =>
    runnerObjectsCollide(obstacle),
  );
  if (collisionIndex >= 0 && runnerElapsed >= runnerInvulnerableUntil) {
    if (isRunnerFeverActive()) {
      runnerObstacles.splice(collisionIndex, 1);
      runnerIngredientScore += 360;
      if (navigator.vibrate) navigator.vibrate(10);
    } else if (runnerShield > 0) {
      runnerShield = 0;
      runnerInvulnerableUntil = runnerElapsed + 900;
      runnerCombo = Math.max(0, runnerCombo - 1);
      runnerObstacles.splice(collisionIndex, 1);
      elements.runnerStatus.textContent =
        "보호막이 충돌을 막았어요. 다음 장애물을 조심하세요!";
      if (navigator.vibrate) navigator.vibrate([45, 20, 45]);
    } else {
      finishRunner();
      return;
    }
  }
  renderRunnerHud();
}

function runRunnerFrame(now) {
  if (!["countdown", "running"].includes(runnerPhase)) return;
  if (!runnerLastFrame) runnerLastFrame = now;
  const delta = Math.min((now - runnerLastFrame) / 1000, 0.034);
  runnerLastFrame = now;

  if (runnerPhase === "countdown") {
    runnerCountdown -= delta * 1000;
    setRunnerPrompt(
      String(Math.max(1, Math.ceil(runnerCountdown / 1000))),
      "점프할 준비!",
    );
    if (runnerCountdown <= 0) {
      runnerPhase = "running";
      elements.runnerArena.dataset.phase = "running";
      elements.runnerStart.textContent = "달리는 중";
      elements.runnerStatus.textContent =
        "낮은 함정은 점프, 공중 장애물은 낮게 통과하세요!";
      runnerLastFrame = now;
    }
  } else {
    updateRunnerGame(delta);
  }

  drawRunnerScene();
  if (["countdown", "running"].includes(runnerPhase)) {
    runnerAnimationFrame = requestAnimationFrame(runRunnerFrame);
  } else {
    runnerAnimationFrame = null;
  }
}

function startRunner() {
  if (["countdown", "running"].includes(runnerPhase)) return;
  resetRunner();
  runnerPhase = "countdown";
  runnerCountdown = 3000;
  runnerLastFrame = 0;
  elements.runnerArena.dataset.phase = "countdown";
  elements.runnerStart.disabled = true;
  elements.runnerStart.textContent = "준비 중";
  elements.runnerReset.disabled = true;
  elements.runnerStatus.textContent = "3초 뒤 달리기가 시작돼요.";
  setRunnerPrompt("3", "점프할 준비!");
  elements.runnerCanvas.focus({ preventScroll: true });
  runnerAnimationFrame = requestAnimationFrame(runRunnerFrame);
}

function clearRunnerBest() {
  if (["countdown", "running"].includes(runnerPhase)) return;
  state.runnerBest = 0;
  state.runnerBestDistance = 0;
  saveState();
  renderRunnerHud();
  elements.runnerStatus.textContent = "간식 러너 최고 기록을 초기화했어요.";
  showToast("간식 러너 최고 기록을 초기화했어요.");
}

function setStackPrompt(title, detail) {
  elements.stackPrompt.querySelector("strong").textContent = title;
  elements.stackPrompt.querySelector("span").textContent = detail;
}

function renderStackHud() {
  elements.stackScore.textContent = String(stackScoreValue);
  elements.stackBest.textContent = String(state.stackBest);
  elements.stackCombo.textContent = String(stackComboValue);
  elements.stackReset.disabled =
    state.stackBest <= 0 || stackPhase === "running";
}

function calculateStackPlacement(active, top) {
  return StackGameLogic.calculatePlacement(
    active,
    top,
    STACK_PERFECT_TOLERANCE,
  );
}

function createStackFragment(fragment, source) {
  if (!fragment || fragment.width <= 0) return;
  const placedCenter = source.x + source.width / 2;
  const fragmentCenter = fragment.x + fragment.width / 2;
  stackFragments.push({
    x: fragment.x,
    y: source.y,
    width: fragment.width,
    height: source.height,
    color: source.color,
    velocityX: fragmentCenter < placedCenter ? -75 : 75,
    velocityY: 80,
    rotation: 0,
    rotationSpeed: fragmentCenter < placedCenter ? -2.1 : 2.1,
  });
}

function spawnStackBlock() {
  const top = stackBlocks[stackBlocks.length - 1];
  const fromLeft = stackBlocks.length % 2 === 1;
  const width = top.width;
  stackActive = {
    x: fromLeft ? 0 : STACK_WIDTH - width,
    y: top.y - STACK_BLOCK_HEIGHT,
    width,
    height: STACK_BLOCK_HEIGHT,
    color: STACK_COLORS[stackScoreValue % STACK_COLORS.length],
    direction: fromLeft ? 1 : -1,
    speed: Math.min(620, 225 + stackScoreValue * 19),
  };
}

function drawStackBlock(context, block, active = false) {
  const screenY = block.y + stackCamera;
  if (screenY > STACK_HEIGHT + block.height || screenY < -block.height * 2) {
    return;
  }

  makeRoundedRectPath(
    context,
    block.x,
    screenY,
    block.width,
    block.height,
    Math.min(12, block.width / 4),
  );
  context.fillStyle = block.color;
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = active ? 5 : 4;
  context.stroke();

  if (block.width >= 24) {
    context.save();
    makeRoundedRectPath(
      context,
      block.x + 7,
      screenY + 7,
      block.width - 14,
      7,
      4,
    );
    context.fillStyle = "rgba(255, 255, 255, 0.36)";
    context.fill();
    context.restore();
  }

  if (block.width < 62) return;
  const centerX = block.x + block.width / 2;
  const faceY = screenY + block.height / 2 + 2;
  context.fillStyle = "#17191d";
  context.beginPath();
  context.arc(centerX - 11, faceY - 4, 3.2, 0, Math.PI * 2);
  context.arc(centerX + 11, faceY - 4, 3.2, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 3;
  context.beginPath();
  context.arc(centerX, faceY + 1, 9, 0.18 * Math.PI, 0.82 * Math.PI);
  context.stroke();
}

function drawStackFragment(context, fragment) {
  const screenY = fragment.y + stackCamera;
  context.save();
  context.translate(
    fragment.x + fragment.width / 2,
    screenY + fragment.height / 2,
  );
  context.rotate(fragment.rotation);
  makeRoundedRectPath(
    context,
    -fragment.width / 2,
    -fragment.height / 2,
    fragment.width,
    fragment.height,
    Math.min(8, fragment.width / 3),
  );
  context.fillStyle = fragment.color;
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = 4;
  context.stroke();
  context.restore();
}

function drawStackScene() {
  const context = elements.stackCanvas.getContext("2d");
  context.clearRect(0, 0, STACK_WIDTH, STACK_HEIGHT);
  context.fillStyle = "#edf9ff";
  context.fillRect(0, 0, STACK_WIDTH, STACK_HEIGHT);

  context.fillStyle = "#ffe28a";
  context.beginPath();
  context.arc(618, 120, 46, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.94)";
  [[90, 120], [330, 185], [510, 82]].forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 24, 0, Math.PI * 2);
    context.arc(x + 28, y - 9, 31, 0, Math.PI * 2);
    context.arc(x + 58, y, 22, 0, Math.PI * 2);
    context.fill();
  });

  context.fillStyle = "#dcecf1";
  [
    [0, 710, 92, 190],
    [75, 660, 110, 240],
    [170, 735, 84, 165],
    [245, 625, 128, 275],
    [360, 695, 96, 205],
    [445, 645, 122, 255],
    [552, 720, 78, 180],
    [620, 675, 100, 225],
  ].forEach(([x, y, width, height]) => {
    context.fillRect(x, y, width, height);
  });

  const platformY =
    STACK_BASE_Y + STACK_BLOCK_HEIGHT + stackCamera;
  if (platformY < STACK_HEIGHT) {
    context.fillStyle = "#85c99a";
    context.fillRect(0, platformY, STACK_WIDTH, STACK_HEIGHT - platformY);
    context.fillStyle = "#4f9d70";
    context.fillRect(0, platformY, STACK_WIDTH, 10);
  }

  stackBlocks.forEach((block) => drawStackBlock(context, block));
  if (stackActive) drawStackBlock(context, stackActive, true);
  stackFragments.forEach((fragment) => drawStackFragment(context, fragment));

  if (stackFeedback) {
    const feedbackY = Math.max(150, stackFeedback.y + stackCamera);
    context.save();
    context.globalAlpha = Math.min(1, stackFeedback.remaining / 260);
    context.fillStyle =
      stackFeedback.type === "perfect" ? "#d75d55" : "#17191d";
    context.font = "900 29px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(stackFeedback.text, STACK_WIDTH / 2, feedbackY);
    context.restore();
  }
}

function resetStack() {
  window.clearTimeout(resultRevealTimer);
  if (stackAnimationFrame !== null) {
    cancelAnimationFrame(stackAnimationFrame);
  }
  stackAnimationFrame = null;
  stackLastFrame = 0;
  stackPhase = "idle";
  stackScoreValue = 0;
  stackComboValue = 0;
  stackPeakCombo = 0;
  stackCamera = 0;
  stackFeedback = null;
  stackFragments = [];
  stackActive = null;
  stackBlocks = [
    {
      x: 160,
      y: STACK_BASE_Y,
      width: 400,
      height: STACK_BLOCK_HEIGHT,
      color: "#5fc7bb",
    },
  ];
  elements.stackArena.dataset.phase = "idle";
  elements.stackStart.disabled = false;
  elements.stackStart.textContent = "탑 쌓기 시작";
  elements.stackStatus.textContent =
    "움직이는 블록이 탑과 겹칠 때 화면을 눌러 놓으세요.";
  setStackPrompt("READY", "화면을 눌러 블록 놓기");
  renderStackHud();
  drawStackScene();
}

function updateStackGame(delta) {
  if (stackPhase === "running" && stackActive) {
    stackActive.x += stackActive.direction * stackActive.speed * delta;
    const maximumX = STACK_WIDTH - stackActive.width;
    if (stackActive.x <= 0) {
      stackActive.x = 0;
      stackActive.direction = 1;
    } else if (stackActive.x >= maximumX) {
      stackActive.x = maximumX;
      stackActive.direction = -1;
    }
  }

  stackFragments.forEach((fragment) => {
    fragment.velocityY += 1750 * delta;
    fragment.x += fragment.velocityX * delta;
    fragment.y += fragment.velocityY * delta;
    fragment.rotation += fragment.rotationSpeed * delta;
  });
  stackFragments = stackFragments.filter(
    (fragment) => fragment.y + stackCamera < STACK_HEIGHT + 180,
  );

  const focusY =
    stackActive?.y ??
    stackBlocks[stackBlocks.length - 1].y - STACK_BLOCK_HEIGHT;
  const targetCamera = Math.max(0, 245 - focusY);
  const cameraEase = 1 - Math.exp(-delta * 7);
  stackCamera += (targetCamera - stackCamera) * cameraEase;

  if (stackFeedback) {
    stackFeedback.remaining -= delta * 1000;
    if (stackFeedback.remaining <= 0) stackFeedback = null;
  }
}

function finishStack() {
  if (stackPhase !== "running") return;
  stackPhase = "gameover";
  elements.stackArena.dataset.phase = "gameover";
  const newBest = stackScoreValue > state.stackBest;
  if (newBest) {
    state.stackBest = stackScoreValue;
    saveState();
  }
  renderStackHud();
  elements.stackStart.disabled = false;
  elements.stackStart.textContent = "다시 쌓기";
  elements.stackStatus.textContent = newBest
    ? `${stackScoreValue}층 · 새로운 최고 기록이에요!`
    : `${stackScoreValue}층 완성 · 최고 ${state.stackBest}층`;
  setStackPrompt(
    newBest ? "NEW BEST" : "FINISH",
    `${stackScoreValue}층 · 퍼펙트 연속 ${stackPeakCombo}회`,
  );
  if (navigator.vibrate) navigator.vibrate([65, 35, 95]);

  window.clearTimeout(resultRevealTimer);
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "stack",
      lead: newBest ? "새로운 최고 기록" : "이번에 쌓은 높이",
      displayText: `${stackScoreValue}층`,
      stakeLabel: "퍼펙트 기록",
      stake: `최대 ${stackPeakCombo}회 연속 · 최고 ${state.stackBest}층`,
      copyText:
        `딱! 정해 탑 쌓기: ${stackScoreValue}층 · ` +
        `퍼펙트 최대 ${stackPeakCombo}회 · 최고 ${state.stackBest}층`,
      list: false,
      playMode: "solo",
      skipParty: true,
      allowMission: false,
    });
  }, 600);
}

function dropStackBlock() {
  if (stackPhase !== "running" || !stackActive) return;
  const top = stackBlocks[stackBlocks.length - 1];
  const source = { ...stackActive };
  const placement = calculateStackPlacement(source, top);

  if (!placement.hit) {
    createStackFragment(placement.fragment, source);
    stackActive = null;
    finishStack();
    return;
  }

  createStackFragment(placement.fragment, source);
  const placed = {
    x: placement.placed.x,
    y: source.y,
    width: placement.placed.width,
    height: source.height,
    color: source.color,
  };
  stackBlocks.push(placed);
  stackScoreValue += 1;

  if (placement.perfect) {
    stackComboValue += 1;
    stackPeakCombo = Math.max(stackPeakCombo, stackComboValue);
    stackFeedback = {
      type: "perfect",
      text: stackComboValue > 1 ? `PERFECT ×${stackComboValue}` : "PERFECT!",
      y: placed.y - 34,
      remaining: 720,
    };
    if (navigator.vibrate) navigator.vibrate(12);
  } else {
    stackComboValue = 0;
    stackFeedback = {
      type: "placed",
      text: `${stackScoreValue} FLOOR`,
      y: placed.y - 34,
      remaining: 430,
    };
    if (navigator.vibrate) navigator.vibrate(7);
  }

  renderStackHud();
  elements.stackStatus.textContent =
    placement.perfect
      ? `퍼펙트! 블록 크기를 유지했어요. ${stackScoreValue}층`
      : `${stackScoreValue}층 · 남은 폭 ${Math.round(placed.width)}`;
  spawnStackBlock();
}

function runStackFrame(now) {
  if (
    stackPhase !== "running" &&
    stackFragments.length === 0 &&
    !stackFeedback
  ) {
    stackAnimationFrame = null;
    return;
  }
  if (!stackLastFrame) stackLastFrame = now;
  const delta = Math.min((now - stackLastFrame) / 1000, 0.034);
  stackLastFrame = now;
  updateStackGame(delta);
  drawStackScene();

  if (
    stackPhase === "running" ||
    stackFragments.length > 0 ||
    stackFeedback
  ) {
    stackAnimationFrame = requestAnimationFrame(runStackFrame);
  } else {
    stackAnimationFrame = null;
  }
}

function startStack() {
  if (stackPhase === "running") return;
  resetStack();
  stackPhase = "running";
  elements.stackArena.dataset.phase = "running";
  elements.stackStart.disabled = true;
  elements.stackStart.textContent = "쌓는 중";
  elements.stackReset.disabled = true;
  elements.stackStatus.textContent =
    "블록이 탑 위에 겹치는 순간 화면을 누르세요.";
  setStackPrompt("GO!", "정확한 순간에 터치");
  spawnStackBlock();
  elements.stackCanvas.focus({ preventScroll: true });
  stackAnimationFrame = requestAnimationFrame(runStackFrame);
}

function clearStackBest() {
  if (stackPhase === "running") return;
  state.stackBest = 0;
  saveState();
  renderStackHud();
  elements.stackStatus.textContent = "탑 쌓기 최고 기록을 초기화했어요.";
  showToast("탑 쌓기 최고 기록을 초기화했어요.");
}

function setFruitPrompt(title, detail) {
  elements.fruitPrompt.querySelector("strong").textContent = title;
  elements.fruitPrompt.querySelector("span").textContent = detail;
}

function getFruitDropTier() {
  return FruitGameLogic.pickDropTier(Math.random());
}

function renderFruitDanger() {
  elements.fruitDanger.style.width =
    Math.min(100, Math.max(0, fruitDangerValue * 100)) + "%";
  elements.fruitArena.classList.toggle(
    "is-danger",
    fruitDangerValue > 0.05,
  );
}

function renderFruitHud() {
  elements.fruitScore.textContent = fruitScoreValue.toLocaleString();
  elements.fruitBest.textContent = state.fruitBest.toLocaleString();
  elements.fruitTop.textContent = FRUIT_TIERS[fruitHighestTier].name;
  renderFruitDanger();
  elements.fruitReset.disabled =
    (state.fruitBest <= 0 && state.fruitBestTier <= 0) ||
    ["running", "celebrating"].includes(fruitPhase);
  drawFruitNextPreview();
}

function drawFruitLeaf(context, radius, color = "#4f9d70") {
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(
    radius * 0.18,
    -radius * 0.82,
    radius * 0.3,
    radius * 0.14,
    -0.5,
    0,
    Math.PI * 2,
  );
  context.fill();
  context.strokeStyle = "#17191d";
  context.lineWidth = Math.max(2, radius * 0.045);
  context.stroke();
}

function drawFruitFace(context, radius, tier) {
  const eyeY = radius * 0.08;
  const eyeGap = radius * 0.24;
  const eyeRadius = Math.max(2.4, radius * 0.045);
  context.fillStyle = "#17191d";
  context.beginPath();
  context.arc(-eyeGap, eyeY, eyeRadius, 0, Math.PI * 2);
  context.arc(eyeGap, eyeY, eyeRadius, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#17191d";
  context.lineWidth = Math.max(2, radius * 0.042);
  context.beginPath();
  if (tier === FRUIT_TIERS.length - 1) {
    context.arc(0, radius * 0.11, radius * 0.18, 0, Math.PI);
  } else {
    context.arc(0, radius * 0.13, radius * 0.16, 0.12 * Math.PI, 0.88 * Math.PI);
  }
  context.stroke();

  if (radius >= 34) {
    context.fillStyle = "rgba(255, 255, 255, 0.48)";
    context.beginPath();
    context.ellipse(
      -radius * 0.42,
      radius * 0.2,
      radius * 0.1,
      radius * 0.055,
      0,
      0,
      Math.PI * 2,
    );
    context.ellipse(
      radius * 0.42,
      radius * 0.2,
      radius * 0.1,
      radius * 0.055,
      0,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

function drawFruitIllustration(
  context,
  x,
  y,
  radius,
  tier,
  angle = 0,
  alpha = 1,
) {
  const fruit = FRUIT_TIERS[tier];
  context.save();
  context.globalAlpha = alpha;
  context.translate(x, y);
  context.rotate(angle);

  context.fillStyle = "rgba(23, 25, 29, 0.1)";
  context.beginPath();
  context.ellipse(0, radius * 0.74, radius * 0.7, radius * 0.2, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = fruit.color;
  context.strokeStyle = "#17191d";
  context.lineWidth = Math.max(3, radius * 0.065);
  context.beginPath();
  context.arc(0, 0, radius * 0.96, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = "rgba(255, 255, 255, 0.28)";
  context.beginPath();
  context.ellipse(
    -radius * 0.3,
    -radius * 0.3,
    radius * 0.18,
    radius * 0.29,
    0.6,
    0,
    Math.PI * 2,
  );
  context.fill();

  context.save();
  context.beginPath();
  context.arc(0, 0, radius * 0.91, 0, Math.PI * 2);
  context.clip();

  if (tier === 2) {
    context.fillStyle = "#ffe49a";
    [
      [-0.42, -0.12],
      [0.36, -0.2],
      [-0.22, 0.34],
      [0.34, 0.28],
      [0, -0.42],
    ].forEach(([seedX, seedY]) => {
      context.beginPath();
      context.ellipse(
        radius * seedX,
        radius * seedY,
        radius * 0.055,
        radius * 0.1,
        seedX,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  } else if (tier === 5) {
    context.strokeStyle = "rgba(174, 71, 86, 0.48)";
    context.lineWidth = Math.max(2, radius * 0.035);
    context.beginPath();
    context.arc(-radius * 0.1, 0, radius * 0.44, -0.85, 0.85);
    context.stroke();
  } else if (tier === 6) {
    context.strokeStyle = "rgba(72, 120, 62, 0.46)";
    context.lineWidth = Math.max(2, radius * 0.035);
    [-0.42, 0, 0.42].forEach((offset) => {
      context.beginPath();
      context.moveTo(-radius, radius * offset);
      context.lineTo(radius, -radius * offset);
      context.stroke();
      context.beginPath();
      context.moveTo(-radius, -radius * offset);
      context.lineTo(radius, radius * offset);
      context.stroke();
    });
  } else if (tier === 7) {
    context.strokeStyle = "rgba(34, 105, 65, 0.62)";
    context.lineWidth = Math.max(4, radius * 0.065);
    [-0.55, -0.18, 0.18, 0.55].forEach((offset) => {
      context.beginPath();
      context.arc(radius * offset, 0, radius * 0.58, -1.2, 1.2);
      context.stroke();
    });
  } else if (tier === 8) {
    context.fillStyle = "rgba(255, 255, 255, 0.34)";
    for (let ray = 0; ray < 8; ray += 1) {
      context.save();
      context.rotate((ray * Math.PI) / 4);
      context.fillRect(-radius * 0.035, -radius * 0.82, radius * 0.07, radius * 0.28);
      context.restore();
    }
  }
  context.restore();

  if ([1, 3, 4, 5, 6, 7].includes(tier)) {
    context.strokeStyle = "#654a35";
    context.lineWidth = Math.max(2, radius * 0.05);
    context.beginPath();
    context.moveTo(0, -radius * 0.74);
    context.quadraticCurveTo(
      radius * 0.02,
      -radius * 1.05,
      radius * 0.25,
      -radius * 1.02,
    );
    context.stroke();
    drawFruitLeaf(context, radius);
  } else if (tier === 0) {
    context.fillStyle = "#8da3e8";
    context.beginPath();
    for (let point = 0; point < 10; point += 1) {
      const pointRadius = point % 2 === 0 ? radius * 0.32 : radius * 0.14;
      const pointAngle = -Math.PI / 2 + (point * Math.PI) / 5;
      const pointX = Math.cos(pointAngle) * pointRadius;
      const pointY = -radius * 0.72 + Math.sin(pointAngle) * pointRadius;
      if (point === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    }
    context.closePath();
    context.fill();
  } else if (tier === 2) {
    drawFruitLeaf(context, radius);
  } else if (tier === 8) {
    context.fillStyle = "#ffd45b";
    context.strokeStyle = "#17191d";
    context.lineWidth = Math.max(3, radius * 0.05);
    context.beginPath();
    context.moveTo(-radius * 0.55, -radius * 0.62);
    context.lineTo(-radius * 0.46, -radius * 1.02);
    context.lineTo(-radius * 0.12, -radius * 0.78);
    context.lineTo(0, -radius * 1.12);
    context.lineTo(radius * 0.18, -radius * 0.78);
    context.lineTo(radius * 0.52, -radius * 1.02);
    context.lineTo(radius * 0.55, -radius * 0.62);
    context.closePath();
    context.fill();
    context.stroke();
  }

  drawFruitFace(context, radius, tier);
  context.restore();
}

function drawFruitNextPreview() {
  const context = elements.fruitNextCanvas.getContext("2d");
  context.clearRect(0, 0, 100, 100);
  const tier = FRUIT_TIERS[fruitNextTier];
  const radius = Math.min(33, 18 + tier.radius * 0.38);
  drawFruitIllustration(context, 50, 54, radius, fruitNextTier);
  elements.fruitNextName.textContent = tier.name;
}

function createFruitEngine() {
  fruitEngine = Matter.Engine.create({ enableSleeping: true });
  fruitEngine.gravity.y = 1.05;
  fruitEngine.gravity.scale = 0.001;
  fruitEngine.positionIterations = 9;
  fruitEngine.velocityIterations = 7;
  fruitEngine.constraintIterations = 3;

  const staticOptions = {
    isStatic: true,
    restitution: 0.03,
    friction: 0.45,
    label: "fruit-wall",
  };
  const walls = [
    Matter.Bodies.rectangle(-12, FRUIT_HEIGHT / 2, 64, FRUIT_HEIGHT * 2, staticOptions),
    Matter.Bodies.rectangle(
      FRUIT_WIDTH + 12,
      FRUIT_HEIGHT / 2,
      64,
      FRUIT_HEIGHT * 2,
      staticOptions,
    ),
    Matter.Bodies.rectangle(
      FRUIT_WIDTH / 2,
      FRUIT_HEIGHT + 8,
      FRUIT_WIDTH * 2,
      70,
      staticOptions,
    ),
  ];
  Matter.Composite.add(fruitEngine.world, walls);
  Matter.Events.on(fruitEngine, "collisionStart", queueFruitMerges);
}

function createFruitBody(tier, x, y) {
  const fruit = FRUIT_TIERS[tier];
  const safeX = Math.min(
    FRUIT_WIDTH - fruit.radius - 22,
    Math.max(fruit.radius + 22, x),
  );
  const body = Matter.Bodies.circle(safeX, y, fruit.radius, {
    label: `fruit-${tier}`,
    restitution: 0.06,
    friction: 0.16,
    frictionStatic: 0.52,
    frictionAir: 0.003,
    density: 0.0012,
    slop: 0.025,
  });
  body.plugin.gameType = "fruit";
  body.plugin.fruitTier = tier;
  body.plugin.createdAt = performance.now();
  body.plugin.dangerMs = 0;
  body.plugin.merging = false;
  fruitBodies.push(body);
  Matter.Composite.add(fruitEngine.world, body);
  return body;
}

function queueFruitMerges(event) {
  if (fruitPhase !== "running") return;
  event.pairs.forEach((pair) => {
    const first = pair.bodyA;
    const second = pair.bodyB;
    if (
      first.plugin?.gameType !== "fruit" ||
      second.plugin?.gameType !== "fruit" ||
      first.plugin.merging ||
      second.plugin.merging
    ) {
      return;
    }
    const result = FruitGameLogic.getMergeResult(
      first.plugin.fruitTier,
      second.plugin.fruitTier,
    );
    if (!result) return;
    first.plugin.merging = true;
    second.plugin.merging = true;
    fruitMergeQueue.push({ first, second, result });
  });
}

function addFruitMergeEffect(x, y, tier) {
  fruitEffects.push({
    x,
    y,
    tier,
    color: FRUIT_TIERS[tier].color,
    remaining: 760,
    duration: 760,
  });
}

function processFruitMerges() {
  while (fruitMergeQueue.length) {
    const merge = fruitMergeQueue.shift();
    if (
      !fruitBodies.includes(merge.first) ||
      !fruitBodies.includes(merge.second)
    ) {
      continue;
    }

    const x = (merge.first.position.x + merge.second.position.x) / 2;
    const y = (merge.first.position.y + merge.second.position.y) / 2;
    const velocity = {
      x: (merge.first.velocity.x + merge.second.velocity.x) / 2,
      y: (merge.first.velocity.y + merge.second.velocity.y) / 2 - 1.2,
    };
    Matter.Composite.remove(fruitEngine.world, merge.first);
    Matter.Composite.remove(fruitEngine.world, merge.second);
    fruitBodies = fruitBodies.filter(
      (body) => body !== merge.first && body !== merge.second,
    );

    const merged = createFruitBody(merge.result.nextTier, x, y);
    Matter.Body.setVelocity(merged, velocity);
    Matter.Body.setAngularVelocity(
      merged,
      (merge.first.angularVelocity + merge.second.angularVelocity) / 2,
    );
    fruitScoreValue += merge.result.points;
    fruitHighestTier = Math.max(fruitHighestTier, merge.result.nextTier);
    state.fruitBestTier = Math.max(state.fruitBestTier, fruitHighestTier);
    addFruitMergeEffect(x, y, merge.result.nextTier);
    elements.fruitStatus.textContent =
      `${FRUIT_TIERS[merge.result.nextTier].name} 완성! ` +
      `현재 ${fruitScoreValue.toLocaleString()}점`;
    renderFruitHud();
    if (navigator.vibrate) navigator.vibrate(merge.result.complete ? [35, 25, 80] : 10);

    if (merge.result.complete && fruitPhase === "running") {
      fruitPhase = "celebrating";
      elements.fruitArena.dataset.phase = "complete";
      elements.fruitStatus.textContent =
        "과일 왕관 완성! 마지막 합체에 성공했어요.";
      setFruitPrompt("COMPLETE!", "과일 왕관을 완성했어요");
      elements.fruitStart.disabled = true;
      window.clearTimeout(fruitCompletionTimer);
      fruitCompletionTimer = window.setTimeout(() => finishFruit(true), 900);
      fruitMergeQueue.length = 0;
      break;
    }
  }
}

function updateFruitDanger(delta, now) {
  let maximumDanger = 0;
  fruitBodies.forEach((body) => {
    const age = now - body.plugin.createdAt;
    const overLine =
      age > 1100 &&
      !body.plugin.merging &&
      body.bounds.min.y < FRUIT_DANGER_Y;
    if (overLine) {
      body.plugin.dangerMs += delta * 1000;
    } else {
      body.plugin.dangerMs = Math.max(
        0,
        body.plugin.dangerMs - delta * 1450,
      );
    }
    maximumDanger = Math.max(maximumDanger, body.plugin.dangerMs);
  });
  fruitDangerValue = maximumDanger / FRUIT_DANGER_DURATION;
  if (
    fruitPhase === "running" &&
    maximumDanger >= FRUIT_DANGER_DURATION
  ) {
    finishFruit(false);
  }
}

function updateFruitEffects(delta) {
  fruitEffects.forEach((effect) => {
    effect.remaining -= delta * 1000;
  });
  fruitEffects = fruitEffects.filter((effect) => effect.remaining > 0);
}

function drawFruitMergeEffect(context, effect) {
  const progress = 1 - effect.remaining / effect.duration;
  const alpha = Math.min(1, effect.remaining / 240);
  const radius = FRUIT_TIERS[effect.tier].radius * (0.9 + progress * 0.65);
  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = effect.color;
  context.lineWidth = 7 - progress * 4;
  context.beginPath();
  context.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#fff";
  for (let spark = 0; spark < 8; spark += 1) {
    const angle = (spark * Math.PI) / 4;
    const distance = radius + 16 + progress * 22;
    context.beginPath();
    context.arc(
      effect.x + Math.cos(angle) * distance,
      effect.y + Math.sin(angle) * distance,
      4,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.restore();
}

function drawFruitScene(now = performance.now()) {
  const context = elements.fruitCanvas.getContext("2d");
  context.clearRect(0, 0, FRUIT_WIDTH, FRUIT_HEIGHT);
  context.fillStyle = "#f5fbff";
  context.fillRect(0, 0, FRUIT_WIDTH, FRUIT_HEIGHT);

  context.fillStyle = "#fff2c9";
  context.beginPath();
  context.arc(628, 128, 50, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#e4f2f4";
  context.fillRect(0, 660, FRUIT_WIDTH, 240);

  context.fillStyle = "#ffffff";
  context.fillRect(22, 0, FRUIT_WIDTH - 44, FRUIT_HEIGHT - 24);
  context.fillStyle = "#d8e4e8";
  context.fillRect(0, 0, 22, FRUIT_HEIGHT);
  context.fillRect(FRUIT_WIDTH - 22, 0, 22, FRUIT_HEIGHT);
  context.fillStyle = "#83c79a";
  context.fillRect(0, FRUIT_HEIGHT - 24, FRUIT_WIDTH, 24);
  context.fillStyle = "#4f9d70";
  context.fillRect(0, FRUIT_HEIGHT - 28, FRUIT_WIDTH, 7);

  context.save();
  context.setLineDash([14, 10]);
  context.strokeStyle =
    fruitDangerValue > 0.05 ? "#e45d5d" : "rgba(215, 93, 85, 0.55)";
  context.lineWidth = fruitDangerValue > 0.05 ? 5 : 3;
  context.beginPath();
  context.moveTo(26, FRUIT_DANGER_Y);
  context.lineTo(FRUIT_WIDTH - 26, FRUIT_DANGER_Y);
  context.stroke();
  context.restore();

  context.fillStyle = "#b65353";
  context.font = "900 17px Arial, sans-serif";
  context.textAlign = "left";
  context.fillText("DANGER", 36, FRUIT_DANGER_Y - 12);

  if (fruitPhase === "running") {
    const current = FRUIT_TIERS[fruitCurrentTier];
    const ready = now >= fruitCanDropAt;
    context.save();
    context.setLineDash([7, 9]);
    context.strokeStyle = ready
      ? "rgba(70, 118, 232, 0.48)"
      : "rgba(135, 142, 153, 0.35)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(fruitAimX, FRUIT_DROP_Y + current.radius);
    context.lineTo(fruitAimX, FRUIT_DANGER_Y - 8);
    context.stroke();
    context.restore();
    drawFruitIllustration(
      context,
      fruitAimX,
      FRUIT_DROP_Y,
      current.radius,
      fruitCurrentTier,
      0,
      ready ? 0.82 : 0.42,
    );
  }

  fruitBodies.forEach((body) => {
    drawFruitIllustration(
      context,
      body.position.x,
      body.position.y,
      FRUIT_TIERS[body.plugin.fruitTier].radius,
      body.plugin.fruitTier,
      body.angle,
    );
  });
  fruitEffects.forEach((effect) => drawFruitMergeEffect(context, effect));
}

function resetFruit() {
  window.clearTimeout(resultRevealTimer);
  window.clearTimeout(fruitCompletionTimer);
  fruitCompletionTimer = null;
  if (fruitAnimationFrame !== null) {
    cancelAnimationFrame(fruitAnimationFrame);
  }
  fruitAnimationFrame = null;
  fruitLastFrame = 0;
  if (fruitEngine) {
    Matter.Events.off(fruitEngine);
    Matter.Composite.clear(fruitEngine.world, false, true);
    Matter.Engine.clear(fruitEngine);
  }
  fruitEngine = null;
  fruitPhase = "idle";
  fruitBodies = [];
  fruitMergeQueue = [];
  fruitEffects = [];
  fruitScoreValue = 0;
  fruitHighestTier = 0;
  fruitCurrentTier = getFruitDropTier();
  fruitNextTier = getFruitDropTier();
  fruitAimX = FRUIT_WIDTH / 2;
  fruitCanDropAt = 0;
  fruitDropSequence = 0;
  fruitDangerValue = 0;
  createFruitEngine();
  elements.fruitArena.dataset.phase = "idle";
  elements.fruitArena.classList.remove("is-danger");
  elements.fruitStart.disabled = false;
  elements.fruitStart.textContent = "합치기 시작";
  elements.fruitStatus.textContent =
    "떨어뜨릴 위치를 누르고 같은 과일끼리 합쳐 보세요.";
  setFruitPrompt("READY", "누른 위치로 과일이 떨어져요");
  renderFruitHud();
  drawFruitScene();
}

function finishFruit(completed) {
  if (!["running", "celebrating"].includes(fruitPhase)) return;
  window.clearTimeout(fruitCompletionTimer);
  fruitCompletionTimer = null;
  fruitPhase = completed ? "complete" : "gameover";
  elements.fruitArena.dataset.phase = fruitPhase;
  const newBest = fruitScoreValue > state.fruitBest;
  if (newBest) state.fruitBest = fruitScoreValue;
  state.fruitBestTier = Math.max(state.fruitBestTier, fruitHighestTier);
  saveState();
  renderFruitHud();
  elements.fruitStart.disabled = false;
  elements.fruitStart.textContent = "다시 합치기";
  elements.fruitStatus.textContent = completed
    ? `과일 왕관 완성 · ${fruitScoreValue.toLocaleString()}점`
    : newBest
      ? `${fruitScoreValue.toLocaleString()}점 · 새로운 최고 기록이에요!`
      : `${fruitScoreValue.toLocaleString()}점 · 최고 ${state.fruitBest.toLocaleString()}점`;
  setFruitPrompt(
    completed ? "COMPLETE!" : newBest ? "NEW BEST" : "GAME OVER",
    completed
      ? "마지막 과일까지 합쳤어요"
      : `${FRUIT_TIERS[fruitHighestTier].name} · ${fruitScoreValue.toLocaleString()}점`,
  );
  drawFruitScene();
  if (navigator.vibrate) {
    navigator.vibrate(completed ? [70, 35, 70, 35, 130] : [80, 45, 110]);
  }

  window.clearTimeout(resultRevealTimer);
  resultRevealTimer = window.setTimeout(() => {
    showResult({
      game: "fruit",
      lead: completed
        ? "과일 왕관을 완성했어요!"
        : newBest
          ? "새로운 최고 기록"
          : "이번 합치기 점수",
      displayText: completed
        ? "과일 왕관 완성!"
        : `${fruitScoreValue.toLocaleString()}점`,
      stakeLabel: "최고 과일",
      stake:
        `${FRUIT_TIERS[fruitHighestTier].name} · ` +
        `최고 ${state.fruitBest.toLocaleString()}점`,
      copyText:
        `딱! 정해 과일 합치기: ${completed ? "과일 왕관 완성 · " : ""}` +
        `${fruitScoreValue.toLocaleString()}점 · ` +
        `최고 과일 ${FRUIT_TIERS[fruitHighestTier].name}`,
      list: false,
      playMode: "solo",
      skipParty: true,
      allowMission: false,
    });
  }, 650);
}

function updateFruitGame(delta, now) {
  if (!fruitEngine) return;
  Matter.Engine.update(fruitEngine, delta * 1000);
  processFruitMerges();
  if (fruitPhase === "running") updateFruitDanger(delta, now);
  updateFruitEffects(delta);
  renderFruitDanger();
}

function runFruitFrame(now) {
  if (
    !["running", "celebrating"].includes(fruitPhase) &&
    fruitEffects.length === 0
  ) {
    fruitAnimationFrame = null;
    return;
  }
  if (!fruitLastFrame) fruitLastFrame = now;
  const delta = Math.min((now - fruitLastFrame) / 1000, 0.034);
  fruitLastFrame = now;
  updateFruitGame(delta, now);
  drawFruitScene(now);

  if (
    ["running", "celebrating"].includes(fruitPhase) ||
    fruitEffects.length > 0
  ) {
    fruitAnimationFrame = requestAnimationFrame(runFruitFrame);
  } else {
    fruitAnimationFrame = null;
  }
}

function dropFruit() {
  if (fruitPhase !== "running" || !fruitEngine) return;
  const now = performance.now();
  if (now < fruitCanDropAt) return;
  const body = createFruitBody(
    fruitCurrentTier,
    fruitAimX,
    FRUIT_DROP_Y,
  );
  Matter.Body.setVelocity(body, { x: 0, y: 0.6 });
  Matter.Body.setAngularVelocity(
    body,
    (fruitDropSequence % 2 === 0 ? 1 : -1) * 0.012,
  );
  fruitDropSequence += 1;
  fruitCurrentTier = fruitNextTier;
  fruitNextTier = getFruitDropTier();
  const currentRadius = FRUIT_TIERS[fruitCurrentTier].radius;
  fruitAimX = Math.min(
    FRUIT_WIDTH - currentRadius - 24,
    Math.max(currentRadius + 24, fruitAimX),
  );
  fruitCanDropAt = now + FRUIT_DROP_COOLDOWN;
  elements.fruitStatus.textContent =
    `${FRUIT_TIERS[body.plugin.fruitTier].name}을 떨어뜨렸어요. ` +
    `다음은 ${FRUIT_TIERS[fruitCurrentTier].name}!`;
  renderFruitHud();
}

function setFruitAimFromPointer(event) {
  const rect = elements.fruitCanvas.getBoundingClientRect();
  const tier = FRUIT_TIERS[fruitCurrentTier];
  const canvasX = ((event.clientX - rect.left) / rect.width) * FRUIT_WIDTH;
  fruitAimX = Math.min(
    FRUIT_WIDTH - tier.radius - 24,
    Math.max(tier.radius + 24, canvasX),
  );
}

function moveFruitAim(amount) {
  if (fruitPhase !== "running") return;
  const tier = FRUIT_TIERS[fruitCurrentTier];
  fruitAimX = Math.min(
    FRUIT_WIDTH - tier.radius - 24,
    Math.max(tier.radius + 24, fruitAimX + amount),
  );
}

function startFruit() {
  if (["running", "celebrating"].includes(fruitPhase)) return;
  resetFruit();
  fruitPhase = "running";
  fruitLastFrame = 0;
  fruitCanDropAt = performance.now();
  elements.fruitArena.dataset.phase = "running";
  elements.fruitStart.disabled = true;
  elements.fruitStart.textContent = "합치는 중";
  elements.fruitReset.disabled = true;
  elements.fruitStatus.textContent =
    "원하는 가로 위치를 누르면 과일이 떨어져요.";
  setFruitPrompt("GO!", "같은 과일끼리 합쳐 보세요");
  elements.fruitCanvas.focus({ preventScroll: true });
  fruitAnimationFrame = requestAnimationFrame(runFruitFrame);
}

function clearFruitBest() {
  if (["running", "celebrating"].includes(fruitPhase)) return;
  state.fruitBest = 0;
  state.fruitBestTier = 0;
  saveState();
  renderFruitHud();
  elements.fruitStatus.textContent = "과일 합치기 최고 기록을 초기화했어요.";
  showToast("과일 합치기 최고 기록을 초기화했어요.");
}

function updateGameAvailability() {
  const peopleReady = state.participants.length >= 2;
  const optionsReady = state.options.length >= 2;
  [
    elements.spinButton,
    elements.bombButton,
    elements.shuffleButton,
    elements.orderButton,
    elements.teamButton,
    elements.drawButton,
    elements.ladderButton,
    elements.seatButton,
    elements.timerStart,
  ].forEach((button) => {
    button.disabled = !peopleReady;
  });
  elements.shuffleParticipants.disabled = state.participants.length < 2;
  elements.clearParticipants.disabled = state.participants.length === 0;
  elements.menuButton.disabled = !optionsReady;
  elements.tournamentButton.disabled = !optionsReady;
  elements.fingerFallback.disabled = !peopleReady;
  renderSavedGroups();
  normalizeDrawCount();
  updateTeamControls();
  renderPartySession();
}

function recordResult(result) {
  const id = `result-${Date.now()}-${randomInt(10000)}`;
  const summary = result.displayText.replace(/\n+/g, " / ").slice(0, 120);
  state.history.unshift({
    id,
    game: result.game,
    gameLabel: result.gameLabel || "",
    summary,
    copyText: result.copyText,
    mission: result.mission || "",
    createdAt: Date.now(),
  });
  state.history = state.history.slice(0, HISTORY_LIMIT);
  saveState();
  renderHistory();
  return id;
}

function renderHistory() {
  elements.resultHistory.replaceChildren();
  elements.clearHistory.disabled = state.history.length === 0;

  if (!state.history.length) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "게임 결과가 여기에 쌓여요.";
    elements.resultHistory.append(empty);
    return;
  }

  state.history.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "history-item";
    const text = document.createElement("span");
    const game = document.createElement("small");
    game.textContent =
      entry.gameLabel || GAME_LABELS[entry.game] || "게임 결과";
    const summary = document.createElement("strong");
    summary.textContent = entry.summary;
    text.append(game, summary);
    if (entry.mission) {
      const mission = document.createElement("em");
      mission.textContent = `미션 · ${entry.mission}`;
      text.append(mission);
    }

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "icon-command";
    copy.textContent = "⧉";
    copy.setAttribute("aria-label", `${entry.summary} 결과 복사`);
    copy.addEventListener("click", async () => {
      await writeClipboard(entry.copyText);
      showToast("지난 결과를 복사했어요.");
    });
    item.append(text, copy);
    elements.resultHistory.append(item);
  });
}

function showResult(resultOrName, game) {
  const rawResult =
    typeof resultOrName === "string"
      ? {
          game,
          lead: "오늘의 주인공은",
          displayText: resultOrName,
          stakeLabel: "결과",
          stake: state.stake,
          copyText: `딱! 정해 결과: ${resultOrName} 당첨 · ${state.stake}`,
          list: false,
        }
      : resultOrName;
  const partyMessage = applyPartyResult(rawResult);
  const copyText = partyMessage
    ? `${rawResult.copyText}\n파티 세션: ${partyMessage}`
    : rawResult.copyText;
  const result = {
    ...rawResult,
    copyText,
    partyMessage,
    mission: "",
    baseCopyText: copyText,
  };

  state.lastResult = result;
  elements.resultGameLabel.textContent =
    result.gameLabel || GAME_LABELS[result.game];
  elements.resultLead.textContent = result.lead;
  elements.resultName.textContent = result.displayText;
  elements.resultName.classList.toggle("is-list", Boolean(result.list));
  elements.resultStakeLabel.textContent = result.stakeLabel;
  elements.resultStake.textContent = result.stake;
  elements.resultParty.hidden = !result.partyMessage;
  elements.resultParty.textContent = result.partyMessage;
  resetResultMission();
  elements.drawMission.hidden = result.allowMission === false;
  result.historyId = recordResult(result);

  if (typeof elements.resultDialog.showModal === "function") {
    elements.resultDialog.showModal();
  } else {
    elements.resultDialog.setAttribute("open", "");
  }
  window.requestAnimationFrame(() => elements.closeResult.focus());
}

function closeResult() {
  if (typeof elements.resultDialog.close === "function") {
    elements.resultDialog.close();
  } else {
    elements.resultDialog.removeAttribute("open");
  }
}

function playAgain() {
  const game = state.lastResult?.game || state.currentGame;
  closeResult();

  const focusByGame = {
    wheel: elements.spinButton,
    bomb: elements.bombButton,
    cards: elements.shuffleButton,
    order: elements.orderButton,
    teams: elements.teamButton,
    draw: elements.drawButton,
    ladder: elements.ladderButton,
    menu: elements.menuButton,
    seats: elements.seatButton,
    tournament: elements.tournamentButton,
    finger: elements.fingerReset,
    reaction:
      state.lastResult?.playMode === "solo"
        ? elements.reactionSoloStart
        : elements.reactionStart,
    timer:
      state.lastResult?.playMode === "solo"
        ? elements.timerSoloStart
        : elements.timerStart,
    dodge: elements.dodgeStart,
    tap: elements.tapStart,
    runner: elements.runnerStart,
    stack: elements.stackStart,
    fruit: elements.fruitStart,
  };

  if (game === "wheel") {
    elements.wheelStatus.textContent = "한 번 더 돌려 보세요.";
  } else if (game === "bomb") {
    resetBomb();
  } else if (game === "cards") {
    dealCards();
  } else if (game === "order") {
    elements.orderStatus.textContent = "한 번 더 순서를 정해 보세요.";
  } else if (game === "teams") {
    elements.teamStatus.textContent = "한 번 더 팀을 나눠 보세요.";
  } else if (game === "draw") {
    resetDraw();
  } else if (game === "ladder") {
    resetLadder();
  } else if (game === "menu") {
    elements.menuStatus.textContent = "한 번 더 메뉴를 정해 보세요.";
  } else if (game === "seats") {
    resetSeats();
  } else if (game === "tournament") {
    resetTournament();
  } else if (game === "finger") {
    resetFinger();
  } else if (game === "reaction") {
    if (state.lastResult?.playMode === "solo") {
      resetReactionSolo();
    } else {
      resetReaction(true);
    }
  } else if (game === "timer") {
    if (state.lastResult?.playMode === "solo") {
      resetTimerSolo();
    } else {
      resetTimer();
    }
  } else if (game === "dodge") {
    resetDodge();
  } else if (game === "tap") {
    resetTap();
  } else if (game === "runner") {
    resetRunner();
  } else if (game === "stack") {
    resetStack();
  } else if (game === "fruit") {
    resetFruit();
  }
  focusByGame[game]?.focus();
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }
}

async function copyResult() {
  if (!state.lastResult) return;
  await writeClipboard(state.lastResult.copyText);
  showToast("결과를 복사했어요.");
}

async function shareResult() {
  if (!state.lastResult) return;
  const shareData = {
    title: `딱! 정해 · ${GAME_LABELS[state.lastResult.game]}`,
    text: state.lastResult.copyText,
  };
  if (/^https?:$/.test(window.location.protocol)) {
    shareData.url = window.location.href;
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  await writeClipboard(state.lastResult.copyText);
  showToast("공유할 결과를 복사했어요.");
}

elements.participantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addParticipant(elements.participantInput.value);
});

elements.bulkToggle.addEventListener("click", () => {
  const opening = elements.bulkEditor.hidden;
  elements.bulkEditor.hidden = !opening;
  elements.bulkToggle.setAttribute("aria-expanded", String(opening));
  if (opening) elements.bulkParticipantInput.focus();
});
elements.bulkReplace.addEventListener("click", () =>
  applyBulkParticipants("replace"),
);
elements.bulkAppend.addEventListener("click", () =>
  applyBulkParticipants("append"),
);
elements.shuffleParticipants.addEventListener("click", shuffleParticipantOrder);
elements.clearParticipants.addEventListener("click", clearAllParticipants);
elements.saveGroup.addEventListener("click", saveCurrentGroup);
elements.loadGroup.addEventListener("click", loadSelectedGroup);
elements.deleteGroup.addEventListener("click", deleteSelectedGroup);
elements.noRepeatToggle.addEventListener("change", () => {
  state.noRepeat = elements.noRepeatToggle.checked;
  state.excludedWinners = [];
  saveState();
  showToast(
    state.noRepeat
      ? "연속 당첨 제외를 켰어요."
      : "연속 당첨 제외를 껐어요.",
  );
});

elements.setupToggle.addEventListener("click", () => {
  setSetupCollapsed(!state.setupCollapsed);
});
elements.setupSummary.addEventListener("click", () => setSetupCollapsed(false));
window
  .matchMedia("(max-width: 1240px)")
  .addEventListener("change", (event) => {
    if (!event.matches) setSetupCollapsed(false);
  });

elements.stakePresets.addEventListener("click", (event) => {
  const button = event.target.closest("[data-stake]");
  if (button) setStake(button.dataset.stake, "preset");
});
elements.customStake.addEventListener("input", () => {
  const value = elements.customStake.value.trim();
  if (value) setStake(value, "custom");
});
elements.customStake.addEventListener("blur", () => {
  if (!elements.customStake.value.trim()) {
    setStake(DEFAULT_STAKE, "preset");
  }
});
elements.missionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addMission(elements.missionInput.value);
});
elements.resetMissions.addEventListener("click", restoreDefaultMissions);

elements.clearHistory.addEventListener("click", () => {
  state.history = [];
  saveState();
  renderHistory();
  showToast("최근 결과를 비웠어요.");
});

elements.partyStartButtons.forEach((button) => {
  button.addEventListener("click", () =>
    startPartySession(Number(button.dataset.partyRounds)),
  );
});
elements.endPartySession.addEventListener("click", () => stopPartySession());

elements.playModeButtons.forEach((button) => {
  button.addEventListener("click", () => setPlayMode(button.dataset.playMode));
});

elements.gameCategoryButtons.forEach((button) => {
  button.addEventListener("click", () =>
    setGameCategory(button.dataset.gameCategory),
  );
});

elements.gameTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectGame(tab.dataset.game));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const visibleTabs = elements.gameTabs.filter((item) => !item.hidden);
    const current = visibleTabs.indexOf(tab);
    let next = current;
    if (event.key === "ArrowLeft") {
      next = modulo(current - 1, visibleTabs.length);
    } else if (event.key === "ArrowRight") {
      next = modulo(current + 1, visibleTabs.length);
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = visibleTabs.length - 1;
    }
    selectGame(visibleTabs[next].dataset.game);
    visibleTabs[next].focus();
  });
});

elements.spinButton.addEventListener("click", spinWheel);
elements.bombButton.addEventListener("click", startBomb);
elements.shuffleButton.addEventListener("click", dealCards);
elements.orderButton.addEventListener("click", makeOrder);
elements.teamButton.addEventListener("click", makeTeams);
elements.teamCountControl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-team-count]");
  if (button) setTeamCount(Number(button.dataset.teamCount));
});
elements.drawMinus.addEventListener("click", () => changeDrawCount(-1));
elements.drawPlus.addEventListener("click", () => changeDrawCount(1));
elements.drawButton.addEventListener("click", makeDraw);
elements.ladderButton.addEventListener("click", makeLadder);

elements.optionForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("[data-option-input]");
    addOption(input.value);
  });
});
elements.optionResetButtons.forEach((button) => {
  button.addEventListener("click", resetDefaultOptions);
});
elements.menuButton.addEventListener("click", spinMenuWheel);
elements.seatColumnControl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-seat-columns]");
  if (button) setSeatColumns(Number(button.dataset.seatColumns));
});
elements.seatButton.addEventListener("click", makeSeats);
elements.tournamentButton.addEventListener("click", startTournament);
elements.fingerArena.addEventListener("pointerdown", addFinger);
elements.fingerArena.addEventListener("pointermove", moveFinger);
elements.fingerArena.addEventListener("pointerup", removeFinger);
elements.fingerArena.addEventListener("pointercancel", removeFinger);
elements.fingerArena.addEventListener("contextmenu", (event) =>
  event.preventDefault(),
);
elements.fingerReset.addEventListener("click", resetFinger);
elements.fingerFallback.addEventListener("click", chooseFingerFromNames);
elements.reactionStart.addEventListener("click", startReactionRound);
elements.reactionReset.addEventListener("click", () => resetReaction(true));
elements.reactionSoloStart.addEventListener("click", startReactionSolo);
elements.reactionSoloReset.addEventListener("click", clearReactionSoloBest);
elements.reactionSoloPad.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  handleReactionSoloTap();
});
elements.reactionSoloPad.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  handleReactionSoloTap();
});
elements.timerStart.addEventListener("click", startTimerTurn);
elements.timerReset.addEventListener("click", resetTimer);
elements.timerSoloStart.addEventListener("click", startTimerSoloTurn);
elements.timerSoloReset.addEventListener("click", clearTimerSoloBest);
elements.dodgeStart.addEventListener("click", startDodge);
elements.dodgeReset.addEventListener("click", clearDodgeBest);
elements.dodgeCanvas.addEventListener("pointerdown", (event) => {
  if (!["countdown", "running"].includes(dodgePhase)) return;
  event.preventDefault();
  dodgePointerId = event.pointerId;
  elements.dodgeCanvas.setPointerCapture?.(event.pointerId);
  elements.dodgeCanvas.focus({ preventScroll: true });
  moveDodgeWithPointer(event);
});
elements.dodgeCanvas.addEventListener("pointermove", (event) => {
  if (event.pointerId !== dodgePointerId) return;
  event.preventDefault();
  moveDodgeWithPointer(event);
});
["pointerup", "pointercancel"].forEach((eventName) => {
  elements.dodgeCanvas.addEventListener(eventName, (event) => {
    if (event.pointerId === dodgePointerId) dodgePointerId = null;
  });
});
elements.dodgeCanvas.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d"].includes(key)) return;
  event.preventDefault();
  dodgeKeys.add(key);
});
elements.dodgeCanvas.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  dodgeKeys.delete(key);
});
elements.dodgeCanvas.addEventListener("blur", () => dodgeKeys.clear());
elements.dodgeCanvas.addEventListener("contextmenu", (event) =>
  event.preventDefault(),
);
elements.tapStart.addEventListener("click", startTap);
elements.tapReset.addEventListener("click", clearTapBest);
elements.tapPad.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  handleTapPress();
});
elements.tapPad.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  handleTapPress();
});
elements.runnerStart.addEventListener("click", startRunner);
elements.runnerReset.addEventListener("click", clearRunnerBest);
elements.runnerCanvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  jumpRunner();
});
elements.runnerCanvas.addEventListener("keydown", (event) => {
  if (!["Enter", " ", "ArrowUp"].includes(event.key)) return;
  event.preventDefault();
  jumpRunner();
});
elements.runnerCanvas.addEventListener("contextmenu", (event) =>
  event.preventDefault(),
);
elements.stackStart.addEventListener("click", startStack);
elements.stackReset.addEventListener("click", clearStackBest);
elements.stackCanvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  dropStackBlock();
});
elements.stackCanvas.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key) || event.repeat) return;
  event.preventDefault();
  dropStackBlock();
});
elements.stackCanvas.addEventListener("contextmenu", (event) =>
  event.preventDefault(),
);
elements.fruitStart.addEventListener("click", startFruit);
elements.fruitReset.addEventListener("click", clearFruitBest);
elements.fruitCanvas.addEventListener("pointermove", (event) => {
  if (fruitPhase !== "running") return;
  setFruitAimFromPointer(event);
});
elements.fruitCanvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  setFruitAimFromPointer(event);
  dropFruit();
});
elements.fruitCanvas.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    moveFruitAim(event.key === "ArrowLeft" ? -34 : 34);
    return;
  }
  if (!["Enter", " "].includes(event.key) || event.repeat) return;
  event.preventDefault();
  dropFruit();
});
elements.fruitCanvas.addEventListener("contextmenu", (event) =>
  event.preventDefault(),
);
[
  [elements.reactionLeft, 0],
  [elements.reactionRight, 1],
].forEach(([button, side]) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    handleReactionTap(side);
  });
  button.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    handleReactionTap(side);
  });
});

elements.closeResult.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeResult();
});
elements.drawMission.addEventListener("click", drawMissionCard);
elements.playAgain.addEventListener("click", playAgain);
elements.shareResult.addEventListener("click", shareResult);
elements.copyResult.addEventListener("click", copyResult);
elements.changeGame.addEventListener("click", () => {
  closeResult();
  document
    .querySelector(".game-category-control")
    .scrollIntoView({ behavior: "smooth", block: "center" });
  elements.gameTabs.find((tab) => tab.dataset.game === state.currentGame)?.focus();
});
window.addEventListener("beforeunload", () => {
  window.clearTimeout(bombTimer);
  window.clearTimeout(bombRevealTimer);
  window.clearTimeout(resultRevealTimer);
  window.clearTimeout(drawTimer);
  window.clearTimeout(ladderRevealTimer);
  window.clearTimeout(fingerPickTimer);
  window.clearTimeout(reactionTimer);
  window.clearTimeout(reactionSoloTimer);
  if (timerAnimationFrame !== null) cancelAnimationFrame(timerAnimationFrame);
  if (timerSoloAnimationFrame !== null) {
    cancelAnimationFrame(timerSoloAnimationFrame);
  }
  if (dodgeAnimationFrame !== null) cancelAnimationFrame(dodgeAnimationFrame);
  if (tapAnimationFrame !== null) cancelAnimationFrame(tapAnimationFrame);
  if (runnerAnimationFrame !== null) cancelAnimationFrame(runnerAnimationFrame);
  if (stackAnimationFrame !== null) cancelAnimationFrame(stackAnimationFrame);
  if (fruitAnimationFrame !== null) cancelAnimationFrame(fruitAnimationFrame);
  window.clearTimeout(fruitCompletionTimer);
});

elements.noRepeatToggle.checked = state.noRepeat;
renderSavedGroups();
renderHistory();
renderMissions();
renderPartySession();
renderOptionEditors();
resetReactionSolo();
resetTimerSolo();
resetDodge();
resetTap();
resetRunner();
resetStack();
resetFruit();
renderParticipants();
updateSeatControls();

const savedStakeIsPreset = [
  ...elements.stakePresets.querySelectorAll("[data-stake]"),
].some((button) => button.dataset.stake === state.stake);
if (savedStakeIsPreset) {
  setStake(state.stake, "preset");
} else {
  elements.customStake.value = state.stake;
  setStake(state.stake, "custom");
}

elements.gameTabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
});
setPlayMode("together");
setGameCategory("quick");
if (
  savedState.hasStoredState &&
  window.matchMedia("(max-width: 1240px)").matches
) {
  setSetupCollapsed(true);
} else {
  setSetupCollapsed(false);
}

if (
  "serviceWorker" in navigator &&
  /^https?:$/.test(window.location.protocol)
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline support is optional and does not block the games.
    });
  });
}
