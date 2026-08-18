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

  const VERSION = 4;
  const ROOM_PREFIX = "ddak-room-";
  const ROOM_CODE_LENGTH = 6;
  const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const MAX_PLAYERS = 8;
  const QUIZ_TARGET_SCORE = 3;
  const QUIZ_REVEAL_DELAY = 2400;
  const TELEPATHY_TOTAL_ROUNDS = 5;
  const DRAWING_TOTAL_ROUNDS = 3;
  const ACTIVITY_REVEAL_DELAY = 2200;
  const DRAWING_ROUND_DURATION = 60000;
  const DRAWING_COLORS = Object.freeze(["#17191d", "#e85d4a", "#4676e8", "#239a8b"]);
  const DRAWING_WIDTHS = Object.freeze([3, 6, 10]);
  const ERROR_CODES = Object.freeze({
    VERSION_MISMATCH: "version-mismatch",
    ROOM_UNAVAILABLE: "room-unavailable",
    NETWORK: "network",
    BROWSER_INCOMPATIBLE: "browser-incompatible",
  });
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
    telepathy: {
      label: "텔레파시 일치",
      unit: "점",
      lowerIsBetter: false,
      minimum: 0,
      maximum: TELEPATHY_TOTAL_ROUNDS,
      activity: "telepathy",
    },
    drawing: {
      label: "그림 맞히기",
      unit: "점",
      lowerIsBetter: false,
      minimum: 0,
      maximum: DRAWING_TOTAL_ROUNDS * 2,
      activity: "drawing",
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
    return ["tap", "runner", "stack", "fruit", "initialQuiz", "triviaQuiz", "rps", "telepathy", "drawing"].includes(game)
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
    if (["telepathy", "drawing"].includes(game)) return `${Math.round(score)}점`;
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

  function createRoomError(message, code = "") {
    const error = new Error(message);
    if (code) error.code = code;
    return error;
  }

  function normalizePeerError(error, fallbackMessage = "온라인 연결이 끊겼어요.") {
    const type = String(error?.type || error?.code || "").toLowerCase();
    if (type.includes("peer-unavailable")) {
      return createRoomError(
        "방을 찾지 못했어요. 방장 화면이 열려 있는지와 방 코드를 확인해 주세요.",
        ERROR_CODES.ROOM_UNAVAILABLE,
      );
    }
    if (type.includes("browser-incompatible")) {
      return createRoomError(
        "이 브라우저는 실시간 연결을 지원하지 않아요. 삼성 인터넷이나 Chrome을 최신 버전으로 업데이트해 주세요.",
        ERROR_CODES.BROWSER_INCOMPATIBLE,
      );
    }
    if (
      type.includes("network") ||
      type.includes("socket") ||
      type.includes("server-error") ||
      type.includes("webrtc")
    ) {
      return createRoomError(
        "실시간 연결에 실패했어요. Wi-Fi와 모바일 데이터를 바꿔 다시 시도해 주세요.",
        ERROR_CODES.NETWORK,
      );
    }
    if (error instanceof Error) return error;
    return createRoomError(fallbackMessage, ERROR_CODES.NETWORK);
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
      this.telepathyChoices = new Map();
      this.drawingWord = null;
      this.drawingSeed = 0;
      this.closed = false;
    }

    snapshot() {
      if (!this.room) return null;
      const room = this.isHost
        ? this.publicRoom(this.localPeerId)
        : clone(this.room);
      return {
        ...room,
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
      return new this.PeerCtor(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun.cloudflare.com:3478" },
          ],
          iceCandidatePoolSize: 4,
          sdpSemantics: "unified-plan",
        },
      });
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
          const roomError = normalizePeerError(error, "방을 만들지 못했어요.");
          if (this.room) {
            this.emitEvent("error", { code: roomError.code, message: roomError.message });
            return;
          }
          this.leave(false);
          reject(roomError);
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
          const roomError = normalizePeerError(error, "방에 참가하지 못했어요.");
          if (settled) {
            this.emitEvent("error", { code: roomError.code, message: roomError.message });
            return;
          }
          settled = true;
          this.leave(false);
          reject(roomError);
        };

        try {
          this.peer = this.makePeer();
        } catch (error) {
          rejectOnce(error);
          return;
        }

        this.connectionTimer = setTimeout(() => {
          rejectOnce(createRoomError(
            "방을 찾지 못했어요. 방장 화면이 열려 있는지와 방 코드를 확인해 주세요.",
            ERROR_CODES.ROOM_UNAVAILABLE,
          ));
        }, 18000);

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
              rejectOnce(createRoomError(
                String(message.message || "방에 참가할 수 없어요."),
                String(message.code || ""),
              ));
              return;
            }
            if (message?.type === "closed") {
              this.emitEvent("host-left");
              this.leave(false);
              return;
            }
            if (message?.type !== "state" || !message.room) return;
            if (message.room.version !== VERSION) {
              rejectOnce(createRoomError(
                "게임 버전이 달라요. 최신 버전으로 다시 연결할게요.",
                ERROR_CODES.VERSION_MISMATCH,
              ));
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
            code: ERROR_CODES.VERSION_MISMATCH,
            message: "게임 버전이 달라요. 페이지를 새로고침해 주세요.",
          });
          this.emitEvent("version-mismatch", { peerId: connection.peer });
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
      if (this.room.status === "playing" && activity?.kind === "telepathy") {
        this.telepathyChoices.delete(peerId);
        activity.submittedIds = activity.submittedIds.filter((id) => id !== peerId);
        if (
          activity.phase === "choosing" &&
          this.telepathyChoices.size >= nextPlayers.length
        ) {
          this.revealTelepathyRound();
          return;
        }
      }
      if (this.room.status === "playing" && activity?.kind === "drawing") {
        if (activity.drawerId === peerId) {
          this.finishDrawingRound("");
          return;
        }
        if (nextPlayers.length < 2) {
          this.finishDrawingGame();
          return;
        }
      }
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

    publicRoom(viewerId = "") {
      if (!this.room) return null;
      const room = clone(this.room);
      if (
        room.activity?.kind === "drawing" &&
        room.activity.phase === "drawing" &&
        room.activity.drawerId === viewerId &&
        this.drawingWord?.answer
      ) {
        room.activity.secretWord = this.drawingWord.answer;
      }
      return room;
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
      this.connections.forEach((connection) => this.send(connection, {
        type: "state",
        room: this.publicRoom(connection.peer),
      }));
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
      this.telepathyChoices.clear();
      this.drawingWord = null;
      this.drawingSeed = 0;
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
        return;
      }
      if (this.room.game === "telepathy") {
        this.room.players.forEach((player) => {
          player.score = 0;
          player.detail = "0점";
        });
        this.prepareTelepathyRound(1);
        return;
      }
      if (this.room.game === "drawing") {
        this.drawingSeed = Math.floor(this.random() * 0x100000000) >>> 0;
        this.room.players.forEach((player) => {
          player.score = 0;
          player.detail = "0점";
        });
        this.prepareDrawingRound(1);
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
      if (this.room.activity?.kind === "telepathy") {
        return this.handleTelepathyAction(peerId, action, payload);
      }
      if (this.room.activity?.kind === "drawing") {
        return this.handleDrawingAction(peerId, action, payload);
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

    prepareTelepathyRound(round) {
      if (!this.room || this.room.game !== "telepathy") return;
      const question = ActivityLogic.getTelepathyRound(this.room.seed, round - 1);
      this.telepathyChoices.clear();
      this.room.activity = {
        kind: "telepathy",
        phase: "choosing",
        round,
        totalRounds: TELEPATHY_TOTAL_ROUNDS,
        questionId: question.id,
        prompt: question.prompt,
        choices: question.choices,
        submittedIds: [],
        revealedChoices: [],
        matchingChoices: [],
        championIds: [],
        message: `${round}/${TELEPATHY_TOTAL_ROUNDS} 라운드 · 친구와 같은 답을 골라보세요.`,
      };
    }

    handleTelepathyAction(peerId, action, payload) {
      const activity = this.room.activity;
      if (action !== "telepathy-choice" || activity.phase !== "choosing") return false;
      const choice = Math.floor(Number(payload?.choice));
      if (!Number.isInteger(choice) || choice < 0 || choice >= activity.choices.length) return false;
      if (this.telepathyChoices.has(peerId)) return false;
      this.telepathyChoices.set(peerId, choice);
      activity.submittedIds.push(peerId);
      activity.message = `${activity.submittedIds.length}/${this.room.players.length}명 선택 완료`;
      if (this.telepathyChoices.size >= this.room.players.length) {
        this.revealTelepathyRound();
      } else {
        this.broadcastState();
      }
      return true;
    }

    revealTelepathyRound() {
      const activity = this.room?.activity;
      if (!activity || activity.kind !== "telepathy" || activity.phase !== "choosing") return;
      const entries = this.room.players.map((player) => ({
        peerId: player.id,
        choice: this.telepathyChoices.get(player.id),
      }));
      const result = ActivityLogic.resolveTelepathyChoices(entries);
      activity.phase = "reveal";
      activity.revealedChoices = entries;
      activity.matchingChoices = result.matchingChoices;
      result.scorerIds.forEach((peerId) => {
        const player = this.room.players.find((entry) => entry.id === peerId);
        if (!player) return;
        player.score = (Number(player.score) || 0) + 1;
        player.detail = `${player.score}점`;
      });
      activity.message = result.scorerIds.length
        ? `${result.matchSize}명 텔레파시 성공! 일치한 친구에게 1점`
        : "이번에는 모두 달랐어요. 다음 문제에서 다시 맞춰보세요.";
      this.broadcastState();
      const currentRound = activity.round;
      this.scheduleActivity(() => {
        if (
          this.room?.status !== "playing" ||
          this.room.activity?.kind !== "telepathy" ||
          this.room.activity.round !== currentRound
        ) return;
        if (currentRound >= TELEPATHY_TOTAL_ROUNDS) {
          this.finishTelepathyGame();
        } else {
          this.prepareTelepathyRound(currentRound + 1);
          this.broadcastState();
        }
      }, ACTIVITY_REVEAL_DELAY);
    }

    finishTelepathyGame() {
      const activity = this.room?.activity;
      if (!activity || activity.kind !== "telepathy") return;
      const topScore = Math.max(...this.room.players.map((player) => Number(player.score) || 0));
      activity.phase = "finished";
      activity.championIds = this.room.players
        .filter((player) => (Number(player.score) || 0) === topScore)
        .map((player) => player.id);
      activity.message = activity.championIds.length > 1
        ? `${topScore}점 공동 우승! 마음이 제대로 통했어요.`
        : `${this.room.players.find((player) => player.id === activity.championIds[0])?.nickname || "친구"} ${topScore}점 우승!`;
      this.room.status = "results";
      this.broadcastState();
    }

    prepareDrawingRound(round) {
      if (!this.room || this.room.game !== "drawing" || this.room.players.length < 2) return;
      const word = ActivityLogic.getDrawingWord(this.drawingSeed, round - 1);
      const drawer = this.room.players[(round - 1) % this.room.players.length];
      this.drawingWord = word;
      this.room.activity = {
        kind: "drawing",
        phase: "drawing",
        round,
        totalRounds: DRAWING_TOTAL_ROUNDS,
        drawerId: drawer.id,
        wordId: `drawing-round-${round}`,
        clue: word.clue,
        wordLength: Array.from(word.answer.replace(/\s+/g, "")).length,
        strokes: [],
        answer: "",
        winnerId: "",
        championIds: [],
        endsAt: this.now() + DRAWING_ROUND_DURATION,
        lastGuess: "",
        message: `${drawer.nickname}님이 그림을 그리고 있어요.`,
      };
      const currentRound = round;
      this.scheduleActivity(() => {
        if (
          this.room?.status !== "playing" ||
          this.room.activity?.kind !== "drawing" ||
          this.room.activity.phase !== "drawing" ||
          this.room.activity.round !== currentRound
        ) return;
        this.finishDrawingRound("");
      }, DRAWING_ROUND_DURATION);
    }

    normalizeDrawingStroke(payload) {
      const rawPoints = Array.isArray(payload?.points) ? payload.points.slice(0, 32) : [];
      const points = rawPoints
        .map((point) => ({
          x: Math.max(0, Math.min(1, Number(point?.x))),
          y: Math.max(0, Math.min(1, Number(point?.y))),
        }))
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
      const color = DRAWING_COLORS.includes(payload?.color) ? payload.color : DRAWING_COLORS[0];
      const width = DRAWING_WIDTHS.includes(Number(payload?.width)) ? Number(payload.width) : DRAWING_WIDTHS[1];
      return points.length >= 2 ? { points, color, width } : null;
    }

    handleDrawingAction(peerId, action, payload) {
      const activity = this.room.activity;
      if (activity.phase !== "drawing") return false;
      if (action === "drawing-stroke") {
        if (activity.drawerId !== peerId || activity.strokes.length >= 800) return false;
        const stroke = this.normalizeDrawingStroke(payload);
        if (!stroke) return false;
        activity.strokes.push(stroke);
        this.broadcastState();
        return true;
      }
      if (action === "drawing-clear") {
        if (activity.drawerId !== peerId) return false;
        activity.strokes = [];
        this.broadcastState();
        return true;
      }
      if (action !== "drawing-guess" || activity.drawerId === peerId) return false;
      const guess = String(payload?.guess || "").trim().slice(0, 30);
      if (!guess) return false;
      if (ActivityLogic.isCorrectAnswer({ answers: [this.drawingWord?.answer] }, guess)) {
        this.finishDrawingRound(peerId);
        return true;
      }
      const player = this.room.players.find((entry) => entry.id === peerId);
      activity.lastGuess = `${player?.nickname || "친구"}: ${guess}`;
      activity.message = `${activity.lastGuess} · 아쉬워요!`;
      this.broadcastState();
      return true;
    }

    finishDrawingRound(winnerId = "") {
      const activity = this.room?.activity;
      if (!activity || activity.kind !== "drawing" || activity.phase !== "drawing") return;
      const winner = this.room.players.find((player) => player.id === winnerId);
      const drawer = this.room.players.find((player) => player.id === activity.drawerId);
      activity.phase = "reveal";
      activity.answer = this.drawingWord?.answer || "";
      activity.winnerId = winnerId;
      activity.endsAt = null;
      if (winner) {
        winner.score = (Number(winner.score) || 0) + 2;
        winner.detail = `${winner.score}점`;
        if (drawer) {
          drawer.score = (Number(drawer.score) || 0) + 1;
          drawer.detail = `${drawer.score}점`;
        }
        activity.message = `${winner.nickname} 정답! 정답은 ${activity.answer}`;
      } else {
        activity.message = `시간 종료 · 정답은 ${activity.answer}`;
      }
      this.broadcastState();
      const currentRound = activity.round;
      this.scheduleActivity(() => {
        if (
          this.room?.status !== "playing" ||
          this.room.activity?.kind !== "drawing" ||
          this.room.activity.round !== currentRound
        ) return;
        if (currentRound >= DRAWING_TOTAL_ROUNDS || this.room.players.length < 2) {
          this.finishDrawingGame();
        } else {
          this.prepareDrawingRound(currentRound + 1);
          this.broadcastState();
        }
      }, ACTIVITY_REVEAL_DELAY);
    }

    finishDrawingGame() {
      const activity = this.room?.activity;
      if (!activity || activity.kind !== "drawing") return;
      const topScore = Math.max(...this.room.players.map((player) => Number(player.score) || 0));
      activity.phase = "finished";
      activity.championIds = this.room.players
        .filter((player) => (Number(player.score) || 0) === topScore)
        .map((player) => player.id);
      activity.message = activity.championIds.length > 1
        ? `${topScore}점 공동 우승!`
        : `${this.room.players.find((player) => player.id === activity.championIds[0])?.nickname || "친구"} ${topScore}점 우승!`;
      this.room.status = "results";
      this.broadcastState();
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
      this.telepathyChoices.clear();
      this.drawingWord = null;
      this.drawingSeed = 0;
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
    ERROR_CODES,
    ROOM_PREFIX,
    ROOM_CODE_LENGTH,
    ROOM_ALPHABET,
    MAX_PLAYERS,
    QUIZ_TARGET_SCORE,
    TELEPATHY_TOTAL_ROUNDS,
    DRAWING_TOTAL_ROUNDS,
    DRAWING_ROUND_DURATION,
    DRAWING_COLORS,
    DRAWING_WIDTHS,
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
