(function attachOnlineRoom(root, factory) {
  const activityLogic = root?.OnlineActivityLogic ||
    (typeof module === "object" && module.exports
      ? require("./online-activity-logic.js")
      : null);
  const api = factory(activityLogic);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OnlineRoom = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createOnlineRoomApi(ActivityLogic) {
  "use strict";

  if (!ActivityLogic) throw new Error("Online activity logic is required");

  const VERSION = 3;
  const ROOM_PREFIX = "ddak-room-";
  const ROOM_CODE_LENGTH = 6;
  const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const MAX_PLAYERS = 8;
  const QUIZ_TARGET_SCORE = 3;
  const QUIZ_REVEAL_DELAY = 1600;
  const GAME_RULES = Object.freeze({
    reaction: {
      label: "반응속도",
      unit: "ms",
      lowerIsBetter: true,
      minimum: 1,
      maximum: 5000,
    },
    timer: {
      label: "5초 타이머",
      unit: "초",
      lowerIsBetter: true,
      minimum: 0,
      maximum: 5000,
    },
    tap: {
      label: "10초 연타",
      unit: "회",
      lowerIsBetter: false,
      minimum: 0,
      maximum: 1000,
    },
    dodge: {
      label: "장애물 피하기",
      unit: "ms",
      lowerIsBetter: false,
      minimum: 0,
      maximum: 3600000,
    },
    runner: {
      label: "간식 러너",
      unit: "점",
      lowerIsBetter: false,
      minimum: 0,
      maximum: 100000000,
    },
    stack: {
      label: "탑 쌓기",
      unit: "층",
      lowerIsBetter: false,
      minimum: 0,
      maximum: 100000,
    },
    fruit: {
      label: "과일 합치기",
      unit: "점",
      lowerIsBetter: false,
      minimum: 0,
      maximum: 100000000,
      duration: 90000,
    },
    initialQuiz: {
      label: "초성 퀴즈",
      unit: "정답",
      lowerIsBetter: false,
      minimum: 0,
      maximum: QUIZ_TARGET_SCORE,
      activity: "quiz",
    },
    triviaQuiz: {
      label: "상식 퀴즈",
      unit: "정답",
      lowerIsBetter: false,
      minimum: 0,
      maximum: QUIZ_TARGET_SCORE,
      activity: "quiz",
    },
    rps: {
      label: "가위바위보 토너먼트",
      unit: "승",
      lowerIsBetter: false,
      minimum: 0,
      maximum: 1100,
      activity: "rps",
    },
  });
  const DIFFICULTIES = Object.freeze(["easy", "normal", "hard"]);

  function sanitizeNickname(value) {
    return String(value || "친구")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 12) || "친구";
  }

  function normalizeRoomCode(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .replace(/[01IO]/g, "")
      .slice(0, ROOM_CODE_LENGTH);
  }

  function isValidRoomCode(value) {
    const code = normalizeRoomCode(value);
    return code.length === ROOM_CODE_LENGTH && [...code].every((letter) => ROOM_ALPHABET.includes(letter));
  }

  function createRoomCode(random = Math.random) {
    let code = "";
    for (let index = 0; index < ROOM_CODE_LENGTH; index += 1) {
      code += ROOM_ALPHABET[Math.floor(random() * ROOM_ALPHABET.length)];
    }
    return code;
  }

  function buildInviteUrl(baseUrl, roomCode) {
    const code = normalizeRoomCode(roomCode);
    if (!isValidRoomCode(code)) return "";
    const url = new URL(baseUrl);
    url.search = "";
    url.hash = "";
    url.searchParams.set("room", code);
    return url.toString();
  }

  function parseInviteUrl(urlValue) {
    try {
      const url = new URL(urlValue, "https://room.invalid/");
      const code = normalizeRoomCode(url.searchParams.get("room"));
      return isValidRoomCode(code) ? code : "";
    } catch {
      return "";
    }
  }

  function normalizeGame(game) {
    return GAME_RULES[game] ? game : "reaction";
  }

  function normalizeDifficulty(difficulty) {
    return DIFFICULTIES.includes(difficulty) ? difficulty : "normal";
  }

  function normalizeScore(game, value) {
    const rule = GAME_RULES[game];
    if (value === null || value === undefined || value === "") return null;
    const score = Number(value);
    if (!rule || !Number.isFinite(score)) return null;
    if (score < rule.minimum || score > rule.maximum) return null;
    return ["tap", "runner", "stack", "fruit", "initialQuiz", "triviaQuiz", "rps"].includes(game)
      ? Math.round(score)
      : Math.round(score * 100) / 100;
  }

  function formatScore(game, value) {
    const score = normalizeScore(game, value);
    if (score === null) return "도전 중";
    if (game === "timer") return `${(score / 1000).toFixed(2)}초 오차`;
    if (game === "reaction") return `${Math.round(score)}ms`;
    if (game === "dodge") return `${(score / 1000).toFixed(2)}초`;
    if (game === "stack") return `${Math.round(score)}층`;
    if (game === "tap") return `${Math.round(score)}회`;
    if (["initialQuiz", "triviaQuiz"].includes(game)) {
      return `${score}/${QUIZ_TARGET_SCORE} 정답`;
    }
    if (game === "rps") {
      return score >= 1000 ? "우승" : `${Math.round(score)}승`;
    }
    return `${Math.round(score).toLocaleString()}점`;
  }

  function rankPlayers(players, game) {
    const lowerIsBetter = GAME_RULES[normalizeGame(game)].lowerIsBetter;
    const completed = players
      .filter((player) => normalizeScore(game, player.score) !== null)
      .sort((left, right) =>
        lowerIsBetter ? left.score - right.score : right.score - left.score,
      );
    const waiting = players.filter((player) => normalizeScore(game, player.score) === null);
    let previousScore = null;
    let previousRank = 0;
    const ranked = completed.map((player, index) => {
      const rank = previousScore === player.score ? previousRank : index + 1;
      previousScore = player.score;
      previousRank = rank;
      return { ...player, rank };
    });
    return [...ranked, ...waiting.map((player) => ({ ...player, rank: null }))];
  }

  function canStartRoom(room) {
    return Boolean(
      ["lobby", "choosing"].includes(room?.status) &&
        room.players?.length >= 2 &&
        room.players.every((player) => player.ready),
    );
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  class RoomSession {
    constructor({ PeerCtor, now = () => Date.now(), random = Math.random, onState, onEvent } = {}) {
      this.PeerCtor = PeerCtor;
      this.now = now;
      this.random = random;
      this.onState = typeof onState === "function" ? onState : () => {};
      this.onEvent = typeof onEvent === "function" ? onEvent : () => {};
      this.peer = null;
      this.hostConnection = null;
      this.connections = new Map();
      this.room = null;
      this.localPeerId = "";
      this.isHost = false;
      this.startTimer = null;
      this.connectionTimer = null;
      this.activityTimers = new Set();
      this.quizAnswer = null;
      this.quizQuestionNumber = 0;
      this.rpsChoices = new Map();
      this.rpsWins = new Map();
      this.closed = false;
    }

    snapshot() {
      if (!this.room) return null;
      return {
        ...clone(this.room),
        isHost: this.isHost,
        localPeerId: this.localPeerId,
      };
    }

    emitState() {
      this.onState(this.snapshot());
    }

    emitEvent(type, detail = {}) {
      this.onEvent({ type, ...detail });
    }

    makePeer(peerId) {
      if (typeof this.PeerCtor !== "function") {
        throw new Error("이 브라우저에서는 온라인 연결을 시작할 수 없어요.");
      }
      return new this.PeerCtor(peerId, { debug: 1 });
    }

    create({ nickname, game = "reaction", difficulty = "normal", code } = {}) {
      this.leave(false);
      this.closed = false;
      this.isHost = true;
      const roomCode = isValidRoomCode(code) ? normalizeRoomCode(code) : createRoomCode(this.random);
      const peerId = `${ROOM_PREFIX}${roomCode.toLowerCase()}`;

      return new Promise((resolve, reject) => {
        try {
          this.peer = this.makePeer(peerId);
        } catch (error) {
          reject(error);
          return;
        }

        const fail = (error) => {
          if (this.room) {
            this.emitEvent("error", { message: error?.message || "온라인 연결이 끊겼어요." });
            return;
          }
          this.leave(false);
          reject(error instanceof Error ? error : new Error("방을 만들지 못했어요."));
        };

        this.peer.on("open", (openedId) => {
          this.localPeerId = String(openedId || peerId);
          this.room = {
            version: VERSION,
            code: roomCode,
            game: normalizeGame(game),
            difficulty: normalizeDifficulty(difficulty),
            status: "lobby",
            round: 1,
            startsAt: null,
            seed: null,
            activity: null,
            players: [
              {
                id: this.localPeerId,
                nickname: sanitizeNickname(nickname),
                ready: true,
                score: null,
                detail: "",
                isHost: true,
              },
            ],
          };
          this.emitState();
          this.emitEvent("created", { code: roomCode });
          resolve(this.snapshot());
        });
        this.peer.on("connection", (connection) => this.acceptConnection(connection));
        this.peer.on("error", fail);
        this.peer.on("disconnected", () => this.emitEvent("network-lost"));
      });
    }

    join({ nickname, code } = {}) {
      this.leave(false);
      this.closed = false;
      this.isHost = false;
      const roomCode = normalizeRoomCode(code);
      if (!isValidRoomCode(roomCode)) return Promise.reject(new Error("6자리 방 코드를 확인해 주세요."));

      return new Promise((resolve, reject) => {
        let settled = false;
        const rejectOnce = (error) => {
          if (settled) {
            this.emitEvent("error", { message: error?.message || "온라인 연결이 끊겼어요." });
            return;
          }
          settled = true;
          this.leave(false);
          reject(error instanceof Error ? error : new Error("방에 참가하지 못했어요."));
        };

        try {
          this.peer = this.makePeer();
        } catch (error) {
          rejectOnce(error);
          return;
        }

        this.connectionTimer = setTimeout(() => {
          rejectOnce(new Error("방을 찾지 못했어요. 코드와 방장 접속 상태를 확인해 주세요."));
        }, 12000);

        this.peer.on("open", (openedId) => {
          this.localPeerId = String(openedId || "");
          const hostId = `${ROOM_PREFIX}${roomCode.toLowerCase()}`;
          const connection = this.peer.connect(hostId, { reliable: true });
          this.hostConnection = connection;
          connection.on("open", () => {
            connection.send({
              type: "join",
              version: VERSION,
              nickname: sanitizeNickname(nickname),
            });
          });
          connection.on("data", (message) => {
            if (message?.type === "reject") {
              rejectOnce(new Error(String(message.message || "방에 참가할 수 없어요.")));
              return;
            }
            if (message?.type === "closed") {
              this.emitEvent("host-left");
              this.leave(false);
              return;
            }
            if (message?.type !== "state" || !message.room) return;
            if (message.room.version !== VERSION) {
              rejectOnce(new Error("게임 버전이 달라요. 페이지를 새로고침해 주세요."));
              return;
            }
            this.room = message.room;
            this.emitState();
            if (!settled) {
              settled = true;
              clearTimeout(this.connectionTimer);
              this.connectionTimer = null;
              this.emitEvent("joined", { code: roomCode });
              resolve(this.snapshot());
            }
          });
          connection.on("close", () => {
            if (this.closed) return;
            this.emitEvent("host-left");
            this.leave(false);
          });
          connection.on("error", rejectOnce);
        });
        this.peer.on("error", rejectOnce);
        this.peer.on("disconnected", () => this.emitEvent("network-lost"));
      });
    }

    acceptConnection(connection) {
      if (!this.isHost || !this.room) {
        connection.close();
        return;
      }
      this.connections.set(connection.peer, connection);
      connection.on("data", (message) => this.handleHostMessage(connection, message));
      connection.on("close", () => this.removeGuest(connection.peer));
      connection.on("error", () => this.removeGuest(connection.peer));
    }

    handleHostMessage(connection, message) {
      if (!this.isHost || !this.room || !message || typeof message !== "object") return;
      if (message.type === "join") {
        if (message.version !== VERSION) {
          connection.send({
            type: "reject",
            message: "게임 버전이 달라요. 페이지를 새로고침해 주세요.",
          });
          connection.close();
          return;
        }
        if (this.room.status !== "lobby") {
          connection.send({ type: "reject", message: "이미 대결이 시작된 방이에요." });
          connection.close();
          return;
        }
        if (this.room.players.length >= MAX_PLAYERS) {
          connection.send({ type: "reject", message: "방이 가득 찼어요. 최대 8명까지 참가할 수 있어요." });
          connection.close();
          return;
        }
        const existing = this.room.players.find((player) => player.id === connection.peer);
        if (!existing) {
          this.room.players.push({
            id: connection.peer,
            nickname: sanitizeNickname(message.nickname),
            ready: false,
            score: null,
            detail: "",
            isHost: false,
          });
        }
        this.broadcastState();
        return;
      }
      const player = this.room.players.find((entry) => entry.id === connection.peer);
      if (!player) return;
      if (message.type === "ready" && this.room.status === "lobby") {
        player.ready = Boolean(message.ready);
        this.broadcastState();
      }
      if (message.type === "score") {
        this.recordScore(connection.peer, message.score, message.detail);
      }
      if (message.type === "action") {
        this.handleActivityAction(
          connection.peer,
          String(message.action || ""),
          message.payload,
        );
      }
      if (message.type === "leave") this.removeGuest(connection.peer);
    }

    removeGuest(peerId) {
      if (!this.isHost || !this.room) return;
      const nextPlayers = this.room.players.filter((player) => player.id !== peerId);
      this.connections.delete(peerId);
      if (nextPlayers.length === this.room.players.length) return;
      const activity = this.room.activity;
      if (this.room.status === "playing" && activity?.kind === "quiz") {
        activity.lockedOut = activity.lockedOut.filter((id) => id !== peerId);
        if (activity.buzzedBy === peerId) {
          activity.buzzedBy = "";
          activity.message = "답변자가 나가 다른 참가자에게 기회가 넘어갔어요.";
        }
      }
      if (this.room.status === "playing" && activity?.kind === "rps") {
        activity.byeIds = activity.byeIds.filter((id) => id !== peerId);
        const match = activity.matches.find(
          (entry) =>
            !entry.winnerId &&
            (entry.leftId === peerId || entry.rightId === peerId),
        );
        if (match) {
          const winnerId = match.leftId === peerId ? match.rightId : match.leftId;
          match.winnerId = winnerId;
          match.phase = "reveal";
          this.rpsWins.set(winnerId, (this.rpsWins.get(winnerId) || 0) + 1);
          activity.message = `${nextPlayers.find((player) => player.id === winnerId)?.nickname || "친구"} 부전승`;
          const stage = activity.stage;
          this.scheduleActivity(() => this.advanceRpsStage(stage), 500);
        }
      }
      this.room.players = nextPlayers;
      if (
        this.room.status === "playing" &&
        activity?.kind === "quiz" &&
        activity.lockedOut.length >= nextPlayers.length
      ) {
        this.finishQuizQuestion("");
        return;
      }
      if (!activity) this.finishRoundIfReady();
      this.broadcastState();
    }

    publicRoom() {
      if (!this.room) return null;
      return clone(this.room);
    }

    send(connection, payload) {
      if (!connection?.open) return;
      try {
        connection.send(payload);
      } catch {
        // Connection close handlers update the room.
      }
    }

    broadcastState() {
      if (!this.isHost || !this.room) return;
      const payload = { type: "state", room: this.publicRoom() };
      this.connections.forEach((connection) => this.send(connection, payload));
      this.emitState();
    }

    setGame(game) {
      if (!this.isHost || !["lobby", "choosing"].includes(this.room?.status)) return false;
      if (this.room.status === "choosing") {
        this.room.pendingGame = normalizeGame(game);
      } else {
        this.room.game = normalizeGame(game);
      }
      this.broadcastState();
      return true;
    }

    setDifficulty(difficulty) {
      if (!this.isHost || !["lobby", "choosing"].includes(this.room?.status)) return false;
      if (this.room.status === "choosing") {
        this.room.pendingDifficulty = normalizeDifficulty(difficulty);
      } else {
        this.room.difficulty = normalizeDifficulty(difficulty);
      }
      this.broadcastState();
      return true;
    }

    scheduleActivity(callback, delay) {
      const timer = setTimeout(() => {
        this.activityTimers.delete(timer);
        callback();
      }, delay);
      this.activityTimers.add(timer);
    }

    clearActivity() {
      this.activityTimers.forEach((timer) => clearTimeout(timer));
      this.activityTimers.clear();
      this.quizAnswer = null;
      this.quizQuestionNumber = 0;
      this.rpsChoices.clear();
      this.rpsWins.clear();
      if (this.room) this.room.activity = null;
    }

    prepareActivity() {
      if (!this.room) return;
      if (["initialQuiz", "triviaQuiz"].includes(this.room.game)) {
        this.quizQuestionNumber = 0;
        this.prepareQuizQuestion();
        return;
      }
      if (this.room.game === "rps") {
        const stage = ActivityLogic.buildRpsStage(
          this.room.players.map((player) => player.id),
          1,
        );
        this.room.activity = {
          kind: "rps",
          ...stage,
          history: [],
          championId: "",
          message: "상대에게 보이지 않게 하나를 선택하세요.",
        };
      }
    }

    submitAction(action, payload = {}) {
      if (!this.room || this.room.status !== "playing") return false;
      if (this.isHost) {
        return this.handleActivityAction(this.localPeerId, action, payload);
      }
      this.send(this.hostConnection, {
        type: "action",
        action: String(action || "").slice(0, 30),
        payload,
      });
      return true;
    }

    handleActivityAction(peerId, action, payload = {}) {
      if (!this.isHost || this.room?.status !== "playing") return false;
      if (!this.room.players.some((player) => player.id === peerId)) return false;
      if (this.room.activity?.kind === "quiz") {
        return this.handleQuizAction(peerId, action, payload);
      }
      if (this.room.activity?.kind === "rps") {
        return this.handleRpsAction(peerId, action, payload);
      }
      return false;
    }

    prepareQuizQuestion() {
      if (!this.room || !["initialQuiz", "triviaQuiz"].includes(this.room.game)) return;
      this.quizQuestionNumber += 1;
      const question = ActivityLogic.getQuizQuestion(
        this.room.game,
        this.room.seed,
        this.quizQuestionNumber - 1,
      );
      this.quizAnswer = question;
      this.room.activity = {
        kind: "quiz",
        phase: "question",
        questionNumber: this.quizQuestionNumber,
        targetScore: QUIZ_TARGET_SCORE,
        questionId: question.id,
        prompt: question.prompt,
        clue: question.clue,
        buzzedBy: "",
        lockedOut: [],
        roundWinnerId: "",
        winnerId: "",
        championId: "",
        answer: "",
        message: `${this.quizQuestionNumber}번째 문제 · 먼저 ${QUIZ_TARGET_SCORE}점을 모으세요.`,
      };
    }

    finishQuizQuestion(winnerId = "") {
      if (!this.room || this.room.activity?.kind !== "quiz") return;
      const activity = this.room.activity;
      const answer = this.quizAnswer?.answers?.[0] || "";
      const winner = this.room.players.find((player) => player.id === winnerId);
      activity.phase = "reveal";
      activity.roundWinnerId = winnerId;
      activity.answer = answer;
      activity.buzzedBy = "";
      if (winner) {
        winner.score = Math.min(QUIZ_TARGET_SCORE, (Number(winner.score) || 0) + 1);
        winner.detail = `${winner.score}문제 정답`;
      }
      if (winner?.score >= QUIZ_TARGET_SCORE) {
        activity.winnerId = winnerId;
        activity.championId = winnerId;
        activity.message = `${winner.nickname}님이 ${QUIZ_TARGET_SCORE}문제를 먼저 맞혔어요. 다음 게임도 이어서 골라보세요!`;
        this.room.players.forEach((player) => {
          if (player.id !== winnerId) player.detail = `${player.score || 0}문제 정답`;
        });
        this.room.status = "results";
        this.broadcastState();
        return;
      }
      activity.message = winner
        ? `${winner.nickname} 정답! ${winner.score}/${QUIZ_TARGET_SCORE} · 다음 문제를 준비해요.`
        : `정답은 ${answer}였어요. 다음 문제를 준비해요.`;
      this.broadcastState();
      const questionNumber = activity.questionNumber;
      this.scheduleActivity(() => {
        if (
          this.room?.status !== "playing" ||
          this.room.activity?.kind !== "quiz" ||
          this.room.activity.questionNumber !== questionNumber
        ) return;
        this.prepareQuizQuestion();
        this.broadcastState();
      }, QUIZ_REVEAL_DELAY);
    }

    handleQuizAction(peerId, action, payload) {
      const activity = this.room.activity;
      if (activity.phase !== "question") return false;
      if (action === "quiz-buzz") {
        if (activity.buzzedBy || activity.lockedOut.includes(peerId)) return false;
        activity.buzzedBy = peerId;
        const player = this.room.players.find((entry) => entry.id === peerId);
        activity.message = `${player?.nickname || "친구"} 답변 차례예요.`;
        this.broadcastState();
        return true;
      }
      if (action !== "quiz-answer" || activity.buzzedBy !== peerId) return false;
      const answer = String(payload?.answer || "").slice(0, 40);
      if (!answer.trim()) return false;
      if (ActivityLogic.isCorrectAnswer(this.quizAnswer, answer)) {
        this.finishQuizQuestion(peerId);
        return true;
      }
      activity.lockedOut.push(peerId);
      activity.buzzedBy = "";
      const player = this.room.players.find((entry) => entry.id === peerId);
      activity.message = `${player?.nickname || "친구"} 오답! 다른 참가자에게 기회가 넘어갔어요.`;
      if (activity.lockedOut.length >= this.room.players.length) {
        this.finishQuizQuestion("");
      } else {
        this.broadcastState();
      }
      return true;
    }

    handleRpsAction(peerId, action, payload) {
      if (action !== "rps-choice") return false;
      const choice = ActivityLogic.normalizeRpsChoice(payload?.choice);
      if (!choice) return false;
      const activity = this.room.activity;
      const match = activity.matches.find(
        (entry) =>
          entry.phase === "choosing" &&
          (entry.leftId === peerId || entry.rightId === peerId),
      );
      if (!match) return false;
      const choices = this.rpsChoices.get(match.id) || {};
      if (choices[peerId]) return false;
      choices[peerId] = choice;
      this.rpsChoices.set(match.id, choices);
      if (match.leftId === peerId) match.leftSubmitted = true;
      if (match.rightId === peerId) match.rightSubmitted = true;
      if (!match.leftSubmitted || !match.rightSubmitted) {
        this.broadcastState();
        return true;
      }

      const result = ActivityLogic.resolveRps(
        choices[match.leftId],
        choices[match.rightId],
      );
      match.leftChoice = choices[match.leftId];
      match.rightChoice = choices[match.rightId];
      match.phase = "reveal";
      this.rpsChoices.delete(match.id);

      if (result === "tie") {
        activity.message = "무승부! 같은 상대와 다시 선택하세요.";
        this.broadcastState();
        const stage = activity.stage;
        this.scheduleActivity(() => {
          if (
            this.room?.status !== "playing" ||
            this.room.activity?.stage !== stage
          ) return;
          const current = this.room.activity.matches.find(
            (entry) => entry.id === match.id,
          );
          if (!current || current.winnerId) return;
          Object.assign(current, {
            leftSubmitted: false,
            rightSubmitted: false,
            leftChoice: "",
            rightChoice: "",
            phase: "choosing",
          });
          this.room.activity.message = "무승부 재대결! 다시 선택하세요.";
          this.broadcastState();
        }, 1000);
        return true;
      }

      const winnerId = result === "left" ? match.leftId : match.rightId;
      match.winnerId = winnerId;
      this.rpsWins.set(winnerId, (this.rpsWins.get(winnerId) || 0) + 1);
      activity.message = `${this.room.players.find((player) => player.id === winnerId)?.nickname || "친구"} 승리!`;
      this.broadcastState();
      const stage = activity.stage;
      this.scheduleActivity(() => this.advanceRpsStage(stage), 1100);
      return true;
    }

    advanceRpsStage(stage) {
      if (
        !this.room ||
        this.room.status !== "playing" ||
        this.room.activity?.kind !== "rps" ||
        this.room.activity.stage !== stage ||
        this.room.activity.matches.some((match) => !match.winnerId)
      ) return;
      const activity = this.room.activity;
      const winners = [
        ...activity.matches.map((match) => match.winnerId),
        ...activity.byeIds,
      ];
      activity.history.push(
        ...activity.matches.map((match) => ({ ...match, stage })),
      );
      if (winners.length === 1) {
        const championId = winners[0];
        activity.championId = championId;
        activity.message = `${this.room.players.find((player) => player.id === championId)?.nickname || "친구"} 최종 우승!`;
        activity.matches = [];
        activity.byeIds = [];
        this.room.players.forEach((player) => {
          const wins = this.rpsWins.get(player.id) || 0;
          player.score = player.id === championId ? 1000 + wins : wins;
          player.detail = player.id === championId ? "토너먼트 우승" : `${wins}승`;
        });
        this.room.status = "results";
        this.broadcastState();
        return;
      }
      const next = ActivityLogic.buildRpsStage(winners, stage + 1);
      activity.stage = next.stage;
      activity.matches = next.matches;
      activity.byeIds = next.byeIds;
      activity.message = `${next.stage}라운드가 시작됐어요. 동시에 선택하세요.`;
      this.broadcastState();
    }

    setReady(ready) {
      if (!this.room || this.room.status !== "lobby") return false;
      if (this.isHost) {
        const host = this.room.players.find((player) => player.id === this.localPeerId);
        if (!host) return false;
        host.ready = Boolean(ready);
        this.broadcastState();
        return true;
      }
      this.send(this.hostConnection, { type: "ready", ready: Boolean(ready) });
      return true;
    }

    startRound(delay = 3200) {
      if (!this.isHost || !canStartRoom(this.room)) return false;
      if (this.room.status === "choosing") {
        this.room.game = normalizeGame(this.room.pendingGame);
        this.room.difficulty = normalizeDifficulty(this.room.pendingDifficulty);
        delete this.room.pendingGame;
        delete this.room.pendingDifficulty;
      }
      this.clearActivity();
      this.room.status = "countdown";
      this.room.startsAt = this.now() + Math.max(1500, Math.min(Number(delay) || 3200, 8000));
      this.room.seed = Math.floor(this.random() * 0x100000000) >>> 0;
      this.room.players.forEach((player) => {
        player.score = ["initialQuiz", "triviaQuiz"].includes(this.room.game) ? 0 : null;
        player.detail = "";
      });
      this.broadcastState();
      clearTimeout(this.startTimer);
      this.startTimer = setTimeout(() => {
        if (!this.room || this.room.status !== "countdown") return;
        this.room.status = "playing";
        this.prepareActivity();
        this.broadcastState();
      }, Math.max(0, this.room.startsAt - this.now()));
      return true;
    }

    submitScore(score, detail = "") {
      if (!this.room || !["countdown", "playing"].includes(this.room.status)) return false;
      if (this.isHost) return this.recordScore(this.localPeerId, score, detail);
      const normalized = normalizeScore(this.room.game, score);
      if (normalized === null) return false;
      this.send(this.hostConnection, {
        type: "score",
        score: normalized,
        detail: String(detail || "").slice(0, 40),
      });
      return true;
    }

    recordScore(peerId, score, detail = "") {
      if (!this.isHost || !this.room || !["countdown", "playing"].includes(this.room.status)) return false;
      const normalized = normalizeScore(this.room.game, score);
      const player = this.room.players.find((entry) => entry.id === peerId);
      if (!player || normalized === null || player.score !== null) return false;
      player.score = normalized;
      player.detail = String(detail || "").slice(0, 40);
      this.finishRoundIfReady();
      this.broadcastState();
      return true;
    }

    finishRoundIfReady() {
      if (!this.room || !this.room.players.length) return;
      if (!["countdown", "playing"].includes(this.room.status)) return;
      if (GAME_RULES[this.room.game]?.activity) return;
      if (this.room.players.every((player) => normalizeScore(this.room.game, player.score) !== null)) {
        this.room.status = "results";
      }
    }

    chooseNextGame() {
      if (!this.isHost || this.room?.status !== "results") return false;
      this.room.status = "choosing";
      this.room.round += 1;
      this.room.startsAt = null;
      this.room.seed = null;
      this.room.pendingGame = this.room.game;
      this.room.pendingDifficulty = this.room.difficulty;
      this.room.players.forEach((player) => {
        player.ready = true;
      });
      this.broadcastState();
      return true;
    }

    rematch() {
      return this.chooseNextGame();
    }

    leave(notify = true) {
      this.closed = true;
      clearTimeout(this.startTimer);
      clearTimeout(this.connectionTimer);
      this.activityTimers.forEach((timer) => clearTimeout(timer));
      this.activityTimers.clear();
      this.startTimer = null;
      this.connectionTimer = null;
      this.quizAnswer = null;
      this.quizQuestionNumber = 0;
      this.rpsChoices.clear();
      this.rpsWins.clear();
      if (notify && this.isHost) {
        this.connections.forEach((connection) => this.send(connection, { type: "closed" }));
      } else if (notify) {
        this.send(this.hostConnection, { type: "leave" });
      }
      this.connections.forEach((connection) => connection.close?.());
      this.connections.clear();
      this.hostConnection?.close?.();
      this.hostConnection = null;
      this.peer?.destroy?.();
      this.peer = null;
      this.room = null;
      this.localPeerId = "";
      this.isHost = false;
      this.emitState();
    }
  }

  return {
    VERSION,
    ROOM_PREFIX,
    ROOM_CODE_LENGTH,
    ROOM_ALPHABET,
    MAX_PLAYERS,
    QUIZ_TARGET_SCORE,
    GAME_RULES,
    DIFFICULTIES,
    sanitizeNickname,
    normalizeRoomCode,
    isValidRoomCode,
    createRoomCode,
    buildInviteUrl,
    parseInviteUrl,
    normalizeGame,
    normalizeDifficulty,
    normalizeScore,
    formatScore,
    rankPlayers,
    canStartRoom,
    createSession: (options) => new RoomSession(options),
  };
});
