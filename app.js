const STORAGE_KEY = "friend-bet-games-v1";
const DEFAULT_PARTICIPANTS = ["민지", "준호", "서연", "태윤"];
const DEFAULT_STAKE = "커피 사기";
const WHEEL_COLORS = ["#ff5d4c", "#ffd54a", "#179f92", "#4676e8", "#9b6fe8", "#ff9f3f"];
const GAME_LABELS = {
  wheel: "돌려돌려 룰렛",
  bomb: "폭탄 돌리기",
  cards: "복불복 카드",
  order: "순서 정하기",
  teams: "팀 나누기",
};
const TEAM_COLORS = ["#ffd54a", "#90ddd6", "#a9c0f5", "#ff9f92"];

const elements = {
  participantForm: document.querySelector("#participantForm"),
  participantInput: document.querySelector("#participantInput"),
  participantList: document.querySelector("#participantList"),
  participantCount: document.querySelector("#participantCount"),
  stakePresets: document.querySelector("#stakePresets"),
  customStake: document.querySelector("#customStake"),
  currentStakeBadge: document.querySelector("#currentStakeBadge"),
  gameTabs: [...document.querySelectorAll(".game-tab")],
  gameViews: {
    wheel: document.querySelector("#wheelGame"),
    bomb: document.querySelector("#bombGame"),
    cards: document.querySelector("#cardsGame"),
    order: document.querySelector("#orderGame"),
    teams: document.querySelector("#teamsGame"),
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
  resultDialog: document.querySelector("#resultDialog"),
  closeResult: document.querySelector("#closeResult"),
  resultGameLabel: document.querySelector("#resultGameLabel"),
  resultLead: document.querySelector("#resultLead"),
  resultName: document.querySelector("#resultName"),
  resultStakeLabel: document.querySelector("#resultStakeLabel"),
  resultStake: document.querySelector("#resultStake"),
  playAgain: document.querySelector("#playAgain"),
  copyResult: document.querySelector("#copyResult"),
  changeGame: document.querySelector("#changeGame"),
  toast: document.querySelector("#toast"),
};

const savedState = loadState();
const state = {
  participants: savedState.participants,
  stake: savedState.stake,
  teamCount: savedState.teamCount,
  currentGame: "wheel",
  lastResult: null,
};

let wheelRotation = 0;
let wheelSpinning = false;
let bombRunning = false;
let bombTimer = null;
let bombRevealTimer = null;
let bombHolderIndex = 0;
let cardRound = null;
let orderRound = null;
let teamRound = null;
let resultRevealTimer = null;
let toastTimer = null;

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const participants = Array.isArray(parsed?.participants)
      ? parsed.participants
          .filter((name) => typeof name === "string" && name.trim())
          .map((name) => name.trim().slice(0, 12))
          .slice(0, 12)
      : [];
    const stake =
      typeof parsed?.stake === "string" && parsed.stake.trim()
        ? parsed.stake.trim().slice(0, 30)
        : DEFAULT_STAKE;
    const teamCount = [2, 3, 4].includes(parsed?.teamCount) ? parsed.teamCount : 2;

    return {
      participants: participants.length >= 2 ? participants : [...DEFAULT_PARTICIPANTS],
      stake,
      teamCount,
    };
  } catch {
    return {
      participants: [...DEFAULT_PARTICIPANTS],
      stake: DEFAULT_STAKE,
      teamCount: 2,
    };
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        participants: state.participants,
        stake: state.stake,
        teamCount: state.teamCount,
      }),
    );
  } catch {
    // The games still work when browser storage is unavailable.
  }
}

function randomInt(max) {
  if (max <= 0) return 0;
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
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

function renderParticipants() {
  window.clearTimeout(resultRevealTimer);
  elements.participantList.replaceChildren();

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

  elements.participantCount.textContent = `${state.participants.length}명 참여 · 최대 12명`;
  drawWheel();
  resetBomb();
  dealCards();
  resetOrder();
  normalizeTeamCount();
  resetTeams();
}

function addParticipant(rawName) {
  const name = rawName.trim().slice(0, 12);
  if (!name) {
    showToast("이름을 입력해 주세요.");
    return;
  }
  if (state.participants.length >= 12) {
    showToast("참가자는 최대 12명까지 추가할 수 있어요.");
    return;
  }
  if (state.participants.some((participant) => participant.toLowerCase() === name.toLowerCase())) {
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
  if (state.participants.length <= 2) {
    showToast("게임에는 최소 2명이 필요해요.");
    return;
  }
  state.participants.splice(index, 1);
  saveState();
  renderParticipants();
}

function setStake(value, source = "preset") {
  const stake = value.trim().slice(0, 30);
  if (!stake) return;

  state.stake = stake;
  elements.currentStakeBadge.textContent = stake;
  [...elements.stakePresets.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("is-active", source === "preset" && button.dataset.stake === stake);
  });

  if (source === "preset") {
    elements.customStake.value = "";
  }
  saveState();
}

function selectGame(game) {
  if (!elements.gameViews[game] || state.currentGame === game) return;

  window.clearTimeout(resultRevealTimer);
  if (state.currentGame === "bomb") resetBomb();
  state.currentGame = game;

  elements.gameTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.game === game);
    tab.setAttribute("aria-current", tab.dataset.game === game ? "page" : "false");
  });

  Object.entries(elements.gameViews).forEach(([name, view]) => {
    const active = name === game;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });

  if (game === "wheel") drawWheel();
  if (game === "cards" && !cardRound) dealCards();
}

function drawWheel(rotation = wheelRotation) {
  const canvas = elements.wheelCanvas;
  const context = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const outerRadius = center - 18;
  const count = state.participants.length;
  const slice = (Math.PI * 2) / count;

  context.clearRect(0, 0, size, size);
  context.save();
  context.translate(center, center);

  state.participants.forEach((name, index) => {
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
      normalizedAngle > Math.PI / 2 && normalizedAngle < (Math.PI * 3) / 2
        ? Math.PI
        : 0,
    );
    context.fillStyle =
      index % WHEEL_COLORS.length === 0 ||
      index % WHEEL_COLORS.length === 2 ||
      index % WHEEL_COLORS.length === 3 ||
      index % WHEEL_COLORS.length === 4
        ? "#ffffff"
        : "#17191d";
    context.font = `900 ${count > 8 ? 22 : 28}px "Malgun Gothic", Arial, sans-serif`;
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
  context.font = '900 28px Arial, sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GO", 0, 2);
  context.restore();
}

function spinWheel() {
  if (wheelSpinning) return;

  wheelSpinning = true;
  elements.spinButton.disabled = true;
  elements.wheelStatus.textContent = "룰렛이 돌고 있어요...";

  const winnerIndex = randomInt(state.participants.length);
  const slice = (Math.PI * 2) / state.participants.length;
  const fullTurn = Math.PI * 2;
  const currentMod = modulo(wheelRotation, fullTurn);
  const desiredMod = modulo(-(winnerIndex + 0.5) * slice, fullTurn);
  const extraTurns = 5 + randomInt(3);
  const targetRotation =
    wheelRotation + extraTurns * fullTurn + modulo(desiredMod - currentMod, fullTurn);
  const startRotation = wheelRotation;
  const startTime = performance.now();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const winner = state.participants[winnerIndex];
    elements.wheelStatus.textContent = `${winner} 당첨!`;
    showResult(winner, "wheel");
  }

  requestAnimationFrame(animate);
}

function startBomb() {
  if (bombRunning) {
    passBomb();
    return;
  }

  window.clearTimeout(bombRevealTimer);
  bombRunning = true;
  bombHolderIndex = randomInt(state.participants.length);
  elements.bombVisual.classList.remove("is-boom");
  elements.bombVisual.classList.add("is-live");
  elements.bombStatus.textContent = "폭탄이 움직이고 있어요. 빠르게 넘기세요!";
  updateBombHolder();

  const duration = 8500 + randomInt(9500);
  bombTimer = window.setTimeout(explodeBomb, duration);
}

function passBomb() {
  bombHolderIndex = (bombHolderIndex + 1) % state.participants.length;
  if (navigator.vibrate) navigator.vibrate(30);
  updateBombHolder();
}

function updateBombHolder() {
  const holder = state.participants[bombHolderIndex];
  const next = state.participants[(bombHolderIndex + 1) % state.participants.length];
  elements.bombHolder.textContent = `지금 폭탄: ${holder}`;
  elements.bombButton.textContent = `${next}에게 넘기기`;
}

function explodeBomb() {
  bombRunning = false;
  elements.bombVisual.classList.remove("is-live");
  elements.bombVisual.classList.add("is-boom");
  const loser = state.participants[bombHolderIndex];
  elements.bombHolder.textContent = `${loser}에서 멈췄어요!`;
  elements.bombStatus.textContent = "펑! 폭탄이 멈춘 사람이 오늘의 주인공이에요.";
  elements.bombButton.textContent = "폭탄 다시 시작";
  if (navigator.vibrate) navigator.vibrate([120, 60, 180]);
  bombRevealTimer = window.setTimeout(() => showResult(loser, "bomb"), 650);
}

function resetBomb() {
  window.clearTimeout(bombTimer);
  window.clearTimeout(bombRevealTimer);
  bombRunning = false;
  elements.bombVisual.classList.remove("is-live", "is-boom");
  elements.bombStatus.textContent = "시작하면 휴대폰을 차례대로 넘겨주세요.";
  elements.bombHolder.textContent = "누구에게서 멈출까요?";
  elements.bombButton.textContent = "폭탄 시작";
}

function dealCards() {
  const count = state.participants.length;
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

  cardRound.deck.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "luck-card";
    button.disabled = card.revealed || cardRound.ended;
    button.setAttribute("aria-label", `${index + 1}번 카드`);
    if (card.revealed) {
      button.classList.add("is-flipped", card.bad ? "is-loser" : "is-safe");
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
  if (cardRound.ended || cardRound.deck[index].revealed) return;

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
    resultRevealTimer = window.setTimeout(() => showResult(player, "cards"), 650);
  }
}

function resetOrder() {
  orderRound = null;
  elements.orderStatus.textContent = "모두의 차례를 한 번에 정해요.";
  renderOrder();
}

function renderOrder(order = null) {
  elements.orderList.replaceChildren();
  elements.orderList.classList.toggle("is-revealed", Boolean(order));

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
  window.clearTimeout(resultRevealTimer);
  orderRound = shuffle(state.participants);
  renderOrder(orderRound);
  elements.orderStatus.textContent = `${orderRound.length}명의 순서가 정해졌어요.`;

  const displayText = orderRound.map((name, index) => `${index + 1}. ${name}`).join("\n");
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
  const previousTeamCount = state.teamCount;
  state.teamCount = Math.min(state.teamCount, state.participants.length);
  if (state.teamCount < 2) state.teamCount = 2;
  if (state.teamCount !== previousTeamCount) saveState();
  updateTeamControls();
}

function updateTeamControls() {
  [...elements.teamCountControl.querySelectorAll("[data-team-count]")].forEach((button) => {
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
  elements.teamStatus.textContent = "팀 수를 고르고 멤버를 섞어 보세요.";
  renderTeams();
}

function renderTeams(teams = null) {
  elements.teamBoard.replaceChildren();
  elements.teamBoard.classList.toggle("is-revealed", Boolean(teams));
  elements.teamBoard.style.setProperty("--team-count", String(state.teamCount));

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
  window.clearTimeout(resultRevealTimer);
  teamRound = Array.from({ length: state.teamCount }, () => []);
  shuffle(state.participants).forEach((name, index) => {
    teamRound[index % state.teamCount].push(name);
  });

  renderTeams(teamRound);
  elements.teamStatus.textContent = `${state.participants.length}명을 ${state.teamCount}팀으로 나눴어요.`;

  const displayText = teamRound
    .map((members, index) => `${String.fromCharCode(65 + index)}팀: ${members.join(", ")}`)
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

  if (typeof elements.resultDialog.showModal === "function") {
    elements.resultDialog.showModal();
  } else {
    elements.resultDialog.setAttribute("open", "");
  }
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

  if (game === "wheel") {
    elements.wheelStatus.textContent = "한 번 더 돌려 보세요.";
    elements.spinButton.focus();
  } else if (game === "bomb") {
    resetBomb();
    elements.bombButton.focus();
  } else if (game === "cards") {
    dealCards();
    elements.shuffleButton.focus();
  } else if (game === "order") {
    elements.orderStatus.textContent = "한 번 더 순서를 정해 보세요.";
    elements.orderButton.focus();
  } else {
    elements.teamStatus.textContent = "한 번 더 팀을 나눠 보세요.";
    elements.teamButton.focus();
  }
}

async function copyResult() {
  if (!state.lastResult) return;
  const text = state.lastResult.copyText;

  try {
    await navigator.clipboard.writeText(text);
    showToast("결과를 복사했어요.");
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast("결과를 복사했어요.");
  }
}

elements.participantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addParticipant(elements.participantInput.value);
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

elements.gameTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectGame(tab.dataset.game));
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
elements.closeResult.addEventListener("click", closeResult);
elements.playAgain.addEventListener("click", playAgain);
elements.copyResult.addEventListener("click", copyResult);
elements.changeGame.addEventListener("click", () => {
  closeResult();
  document.querySelector(".game-tabs").scrollIntoView({ behavior: "smooth", block: "center" });
  elements.gameTabs[0].focus();
});

elements.resultDialog.addEventListener("click", (event) => {
  if (event.target === elements.resultDialog) closeResult();
});

window.addEventListener("beforeunload", () => {
  window.clearTimeout(bombTimer);
  window.clearTimeout(bombRevealTimer);
  window.clearTimeout(resultRevealTimer);
});

renderParticipants();
const savedStakeIsPreset = [...elements.stakePresets.querySelectorAll("[data-stake]")].some(
  (button) => button.dataset.stake === state.stake,
);
if (savedStakeIsPreset) {
  setStake(state.stake, "preset");
} else {
  elements.customStake.value = state.stake;
  setStake(state.stake, "custom");
}
elements.gameTabs[0].setAttribute("aria-current", "page");
