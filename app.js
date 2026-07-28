const STORAGE_KEY = "friend-bet-games-v2";
const LEGACY_STORAGE_KEY = "friend-bet-games-v1";
const MAX_PARTICIPANTS = 12;
const MAX_OPTIONS = 12;
const MAX_SAVED_GROUPS = 5;
const HISTORY_LIMIT = 5;
const DEFAULT_PARTICIPANTS = ["민지", "준호", "서연", "태윤"];
const DEFAULT_OPTIONS = ["한식", "분식", "중식", "일식", "치킨", "피자"];
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
};

const elements = {
  setupPanel: document.querySelector("#setupPanel"),
  setupToggle: document.querySelector("#setupToggle"),
  setupToggleLabel: document.querySelector(".setup-toggle-label"),
  setupToggleIcon: document.querySelector(".setup-toggle-icon"),
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
  currentStakeBadge: document.querySelector("#currentStakeBadge"),
  resultHistory: document.querySelector("#resultHistory"),
  clearHistory: document.querySelector("#clearHistory"),
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
  resultDialog: document.querySelector("#resultDialog"),
  closeResult: document.querySelector("#closeResult"),
  resultGameLabel: document.querySelector("#resultGameLabel"),
  resultLead: document.querySelector("#resultLead"),
  resultName: document.querySelector("#resultName"),
  resultStakeLabel: document.querySelector("#resultStakeLabel"),
  resultStake: document.querySelector("#resultStake"),
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
  stake: savedState.stake,
  teamCount: savedState.teamCount,
  drawCount: savedState.drawCount,
  seatColumns: savedState.seatColumns,
  savedGroups: savedState.savedGroups,
  noRepeat: savedState.noRepeat,
  history: savedState.history,
  currentGame: "wheel",
  currentCategory: "quick",
  lastResult: null,
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
            summary: entry.summary.slice(0, 120),
            copyText: entry.copyText.slice(0, 1000),
            createdAt: Number(entry.createdAt) || Date.now(),
          }))
          .slice(0, HISTORY_LIMIT)
      : [];

    return {
      participants: hasStoredState ? participants : [...DEFAULT_PARTICIPANTS],
      options: options.length ? options : [...DEFAULT_OPTIONS],
      stake,
      teamCount,
      drawCount,
      seatColumns,
      savedGroups,
      noRepeat: Boolean(parsed?.noRepeat),
      history,
      hasStoredState,
    };
  } catch {
    return {
      participants: [...DEFAULT_PARTICIPANTS],
      options: [...DEFAULT_OPTIONS],
      stake: DEFAULT_STAKE,
      teamCount: 2,
      drawCount: 1,
      seatColumns: 3,
      savedGroups: [],
      noRepeat: false,
      history: [],
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
        stake: state.stake,
        teamCount: state.teamCount,
        drawCount: state.drawCount,
        seatColumns: state.seatColumns,
        savedGroups: state.savedGroups,
        noRepeat: state.noRepeat,
        history: state.history,
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
  elements.setupToggleIcon.textContent = state.setupCollapsed ? "⌄" : "⌃";
  elements.setupPanel.classList.toggle("is-collapsed", state.setupCollapsed);
  updateSetupSummary();
}

function renderParticipants() {
  window.clearTimeout(resultRevealTimer);
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

function selectGame(game) {
  if (!elements.gameViews[game]) return;

  window.clearTimeout(resultRevealTimer);
  if (state.currentGame === "bomb" && game !== "bomb") resetBomb();
  if (state.currentGame === "finger" && game !== "finger") resetFinger();
  if (state.currentGame === "reaction" && game !== "reaction") {
    resetReaction(false);
  }
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

  elements.gameTabs.forEach((tab) => {
    tab.hidden = category !== "all" && tab.dataset.category !== category;
  });

  const visibleTabs = elements.gameTabs.filter((tab) => !tab.hidden);
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
}

function recordResult(result) {
  const summary = result.displayText.replace(/\n+/g, " / ").slice(0, 120);
  state.history.unshift({
    id: `result-${Date.now()}-${randomInt(10000)}`,
    game: result.game,
    summary,
    copyText: result.copyText,
    createdAt: Date.now(),
  });
  state.history = state.history.slice(0, HISTORY_LIMIT);
  saveState();
  renderHistory();
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
    game.textContent = GAME_LABELS[entry.game] || "게임 결과";
    const summary = document.createElement("strong");
    summary.textContent = entry.summary;
    text.append(game, summary);

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
  const result =
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

  state.lastResult = result;
  elements.resultGameLabel.textContent = GAME_LABELS[result.game];
  elements.resultLead.textContent = result.lead;
  elements.resultName.textContent = result.displayText;
  elements.resultName.classList.toggle("is-list", Boolean(result.list));
  elements.resultStakeLabel.textContent = result.stakeLabel;
  elements.resultStake.textContent = result.stake;
  recordResult(result);

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
    reaction: elements.reactionStart,
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
    resetReaction(true);
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

elements.clearHistory.addEventListener("click", () => {
  state.history = [];
  saveState();
  renderHistory();
  showToast("최근 결과를 비웠어요.");
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
});

elements.noRepeatToggle.checked = state.noRepeat;
renderSavedGroups();
renderHistory();
renderOptionEditors();
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
