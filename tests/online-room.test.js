const assert = require("node:assert/strict");
const OnlineRoom = require("../online-room.js");
const OnlineActivityLogic = require("../online-activity-logic.js");

class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  emit(type, value) {
    (this.listeners.get(type) || []).forEach((listener) => listener(value));
  }
}

class FakeConnection extends Emitter {
  constructor(peer) {
    super();
    this.peer = peer;
    this.open = false;
    this.other = null;
    this.closed = false;
  }

  send(message) {
    if (!this.open || this.closed) return;
    const payload = JSON.parse(JSON.stringify(message));
    setTimeout(() => this.other?.emit("data", payload), 0);
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.open = false;
    const other = this.other;
    setTimeout(() => this.emit("close"), 0);
    if (other && !other.closed) {
      other.closed = true;
      other.open = false;
      setTimeout(() => other.emit("close"), 0);
    }
  }
}

class FakePeer extends Emitter {
  static peers = new Map();
  static sequence = 0;

  constructor(id) {
    super();
    this.id = id || `guest-${++FakePeer.sequence}`;
    this.destroyed = false;
    if (FakePeer.peers.has(this.id)) {
      setTimeout(() => this.emit("error", new Error("ID is already taken")), 0);
      return;
    }
    FakePeer.peers.set(this.id, this);
    setTimeout(() => this.emit("open", this.id), 0);
  }

  connect(targetId) {
    const clientConnection = new FakeConnection(targetId);
    const target = FakePeer.peers.get(targetId);
    if (!target) {
      setTimeout(() => clientConnection.emit("error", new Error("Peer unavailable")), 0);
      return clientConnection;
    }
    const hostConnection = new FakeConnection(this.id);
    clientConnection.other = hostConnection;
    hostConnection.other = clientConnection;
    setTimeout(() => {
      target.emit("connection", hostConnection);
      clientConnection.open = true;
      hostConnection.open = true;
      clientConnection.emit("open");
      hostConnection.emit("open");
    }, 0);
    return clientConnection;
  }

  destroy() {
    this.destroyed = true;
    FakePeer.peers.delete(this.id);
  }
}

function waitFor(predicate, timeout = 1000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (predicate()) {
        resolve();
        return;
      }
      if (Date.now() - startedAt >= timeout) {
        reject(new Error("Timed out waiting for room state"));
        return;
      }
      setTimeout(check, 5);
    }
    check();
  });
}

async function run() {
  assert.equal(OnlineRoom.VERSION, 4);
  assert.equal(OnlineRoom.normalizeRoomCode(" ab-01c234 "), "ABC234");
  assert.equal(OnlineRoom.isValidRoomCode("ABC234"), true);
  assert.equal(OnlineRoom.isValidRoomCode("ABC23"), false);
  assert.equal(OnlineRoom.createRoomCode(() => 0), "AAAAAA");
  assert.equal(
    OnlineRoom.buildInviteUrl("https://example.com/game/?challenge=1", "ABC234"),
    "https://example.com/game/?room=ABC234",
  );
  assert.equal(OnlineRoom.parseInviteUrl("https://example.com/?room=abc234"), "ABC234");
  assert.equal(OnlineRoom.formatScore("reaction", 242), "242ms");
  assert.equal(OnlineRoom.formatScore("timer", 84), "0.08초 오차");
  assert.equal(OnlineRoom.formatScore("tap", 73), "73회");
  assert.equal(OnlineRoom.formatScore("dodge", 12340), "12.34초");
  assert.equal(OnlineRoom.formatScore("runner", 4230), "4,230점");
  assert.equal(OnlineRoom.formatScore("stack", 17), "17층");
  assert.equal(OnlineRoom.formatScore("fruit", 12800), "12,800점");
  assert.equal(OnlineRoom.formatScore("initialQuiz", 1), "1/3 정답");
  assert.equal(OnlineRoom.formatScore("triviaQuiz", 0), "0/3 정답");
  assert.equal(OnlineRoom.formatScore("rps", 1002), "우승");
  assert.equal(OnlineRoom.formatScore("telepathy", 4), "4점");
  assert.equal(OnlineRoom.formatScore("drawing", 5), "5점");
  assert.equal(OnlineRoom.normalizeDifficulty("hard"), "hard");
  assert.equal(OnlineRoom.normalizeDifficulty("impossible"), "normal");

  const ranked = OnlineRoom.rankPlayers(
    [
      { id: "a", score: 250 },
      { id: "b", score: 180 },
      { id: "c", score: null },
    ],
    "reaction",
  );
  assert.deepEqual(ranked.map((player) => player.id), ["b", "a", "c"]);
  assert.deepEqual(ranked.map((player) => player.rank), [1, 2, null]);

  let hostState = null;
  let guestState = null;
  const guestEvents = [];
  const host = OnlineRoom.createSession({
    PeerCtor: FakePeer,
    random: () => 0.25,
    onState: (snapshot) => {
      hostState = snapshot;
    },
  });
  const guest = OnlineRoom.createSession({
    PeerCtor: FakePeer,
    onState: (snapshot) => {
      guestState = snapshot;
    },
    onEvent: (event) => guestEvents.push(event.type),
  });

  await host.create({ nickname: "민지", game: "tap", code: "ABC234" });
  await guest.join({ nickname: "준호", code: "abc234" });
  await waitFor(() => hostState?.players.length === 2 && guestState?.players.length === 2);
  assert.equal(hostState.players[0].nickname, "민지");
  assert.equal(hostState.players[1].nickname, "준호");

  guest.setReady(true);
  await waitFor(() => hostState.players.every((player) => player.ready));
  assert.equal(host.setGame("runner"), true);
  assert.equal(host.setDifficulty("hard"), true);
  await waitFor(
    () => guestState?.game === "runner" && guestState?.difficulty === "hard",
  );
  assert.equal(OnlineRoom.canStartRoom(hostState), true);
  assert.equal(host.startRound(), true);
  await waitFor(() => guestState?.status === "countdown");
  assert.equal(guestState.seed, 1073741824);

  assert.equal(host.submitScore(54, "5.4회/초"), true);
  assert.equal(guest.submitScore(68, "6.8회/초"), true);
  await waitFor(() => hostState?.status === "results" && guestState?.status === "results");
  const finalRanking = OnlineRoom.rankPlayers(hostState.players, "runner");
  assert.equal(finalRanking[0].nickname, "준호");
  assert.equal(finalRanking[0].score, 68);

  assert.equal(host.chooseNextGame(), true);
  await waitFor(() => guestState?.status === "choosing" && guestState.round === 2);
  assert.equal(guestState.game, "runner");
  assert.equal(guestState.pendingGame, "runner");
  assert.equal(guestState.players.find((player) => player.nickname === "준호").score, 68);
  assert.equal(guestState.players.every((player) => player.ready), true);
  assert.equal(guest.setGame?.("initialQuiz") || false, false);
  assert.equal(host.setGame("initialQuiz"), true);
  await waitFor(
    () => guestState?.pendingGame === "initialQuiz" && guestState?.game === "runner",
  );
  await waitFor(() => OnlineRoom.canStartRoom(hostState));
  assert.equal(host.startRound(1500), true);
  await waitFor(() => guestState?.status === "countdown");
  assert.equal(guestState.game, "initialQuiz");
  await waitFor(
    () => hostState?.status === "playing" && guestState?.status === "playing",
    2500,
  );
  const quizQuestion = OnlineActivityLogic.getQuizQuestion(
    "initialQuiz",
    hostState.seed,
  );
  assert.equal(host.submitAction("quiz-buzz"), true);
  await waitFor(() => guestState?.activity?.buzzedBy === hostState.localPeerId);
  assert.equal(host.submitAction("quiz-answer", { answer: "오답" }), true);
  await waitFor(() => guestState?.activity?.buzzedBy === "");
  assert.equal(guest.submitAction("quiz-buzz"), true);
  await waitFor(() => hostState?.activity?.buzzedBy === guestState.localPeerId);
  assert.equal(
    guest.submitAction("quiz-answer", { answer: quizQuestion.answers[0] }),
    true,
  );
  await waitFor(
    () => hostState?.status === "playing" && hostState?.activity?.questionNumber === 2,
    2500,
  );
  assert.equal(
    hostState.players.find((player) => player.id === guestState.localPeerId).score,
    1,
  );
  for (let questionNumber = 2; questionNumber <= OnlineRoom.QUIZ_TARGET_SCORE; questionNumber += 1) {
    const currentQuestion = OnlineActivityLogic.getQuizQuestion(
      "initialQuiz",
      hostState.seed,
      questionNumber - 1,
    );
    assert.equal(guest.submitAction("quiz-buzz"), true);
    await waitFor(() => hostState?.activity?.buzzedBy === guestState.localPeerId);
    assert.equal(
      guest.submitAction("quiz-answer", { answer: currentQuestion.answers[0] }),
      true,
    );
    if (questionNumber < OnlineRoom.QUIZ_TARGET_SCORE) {
      await waitFor(
        () => hostState?.activity?.questionNumber === questionNumber + 1,
        2500,
      );
    }
  }
  await waitFor(() => hostState?.status === "results" && guestState?.status === "results");
  assert.equal(hostState.activity.championId, guestState.localPeerId);
  assert.equal(
    hostState.players.find((player) => player.id === guestState.localPeerId).score,
    OnlineRoom.QUIZ_TARGET_SCORE,
  );

  assert.equal(host.chooseNextGame(), true);
  await waitFor(() => guestState?.status === "choosing" && guestState.round === 3);
  assert.equal(guestState.game, "initialQuiz");
  assert.equal(guestState.activity.championId, guestState.localPeerId);
  assert.equal(host.setGame("rps"), true);
  await waitFor(
    () => guestState?.pendingGame === "rps" && guestState?.game === "initialQuiz",
  );
  await waitFor(() => OnlineRoom.canStartRoom(hostState));
  assert.equal(host.startRound(1500), true);
  await waitFor(
    () => hostState?.status === "playing" && guestState?.status === "playing",
    2500,
  );
  assert.equal(host.submitAction("rps-choice", { choice: "rock" }), true);
  assert.equal(guest.submitAction("rps-choice", { choice: "scissors" }), true);
  await waitFor(() => hostState?.status === "results", 2500);
  assert.equal(hostState.activity.championId, hostState.localPeerId);
  assert.equal(hostState.activity.matches.length, 0);
  assert.equal(hostState.activity.history.length, 1);
  assert.ok(
    hostState.players.find((player) => player.id === hostState.localPeerId).score >= 1000,
  );

  assert.equal(host.chooseNextGame(), true);
  await waitFor(() => guestState?.status === "choosing" && guestState.round === 4);
  assert.equal(host.setGame("telepathy"), true);
  assert.equal(host.startRound(1500), true);
  await waitFor(
    () => hostState?.status === "playing" && hostState?.activity?.kind === "telepathy",
    2500,
  );
  for (let round = 1; round <= OnlineRoom.TELEPATHY_TOTAL_ROUNDS; round += 1) {
    assert.equal(host.submitAction("telepathy-choice", { choice: 0 }), true);
    assert.equal(guest.submitAction("telepathy-choice", { choice: 0 }), true);
    if (round < OnlineRoom.TELEPATHY_TOTAL_ROUNDS) {
      await waitFor(() => hostState?.activity?.round === round + 1, 3500);
    }
  }
  await waitFor(() => hostState?.status === "results", 3500);
  assert.deepEqual(
    hostState.players.map((player) => player.score),
    [OnlineRoom.TELEPATHY_TOTAL_ROUNDS, OnlineRoom.TELEPATHY_TOTAL_ROUNDS],
  );
  assert.equal(hostState.activity.championIds.length, 2);

  assert.equal(host.chooseNextGame(), true);
  await waitFor(() => guestState?.status === "choosing" && guestState.round === 5);
  assert.equal(host.setGame("drawing"), true);
  assert.equal(host.startRound(1500), true);
  await waitFor(
    () => hostState?.status === "playing" && hostState?.activity?.kind === "drawing",
    2500,
  );
  assert.equal(hostState.activity.drawerId, hostState.localPeerId);
  assert.ok(hostState.activity.secretWord);
  assert.equal(guestState.activity.secretWord, undefined);
  assert.equal(
    host.submitAction("drawing-stroke", {
      color: "#4676e8",
      width: 6,
      points: [{ x: 0.1, y: 0.2 }, { x: 0.8, y: 0.7 }],
    }),
    true,
  );
  await waitFor(() => guestState?.activity?.strokes?.length === 1);
  assert.equal(guest.submitAction("drawing-clear"), true);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(hostState.activity.strokes.length, 1);
  assert.equal(
    guest.submitAction("drawing-guess", { guess: hostState.activity.secretWord }),
    true,
  );
  await waitFor(() => hostState?.activity?.round === 2, 3500);
  assert.equal(guestState.activity.drawerId, guestState.localPeerId);
  assert.ok(guestState.activity.secretWord);
  assert.equal(hostState.activity.secretWord, undefined);
  assert.equal(
    host.submitAction("drawing-guess", { guess: guestState.activity.secretWord }),
    true,
  );
  await waitFor(() => hostState?.activity?.round === 3, 3500);
  assert.ok(hostState.activity.secretWord);
  assert.equal(
    guest.submitAction("drawing-guess", { guess: hostState.activity.secretWord }),
    true,
  );
  await waitFor(() => hostState?.status === "results", 3500);
  assert.equal(hostState.activity.answer.length > 0, true);
  assert.equal(hostState.activity.championIds[0], guestState.localPeerId);
  assert.deepEqual(hostState.players.map((player) => player.score), [4, 5]);

  host.leave();
  await waitFor(() => guestState === null);
  assert.ok(guestEvents.includes("host-left"));
  guest.leave();
  console.log("online room logic tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
