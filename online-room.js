(function attachOnlineRoom(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OnlineRoom = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createOnlineRoomApi() {
  "use strict";

  const VERSION = 1;
  const ROOM_PREFIX = "ddak-room-";
  const ROOM_CODE_LENGTH = 6;
  const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const MAX_PLAYERS = 8;
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
    return ["tap", "runner", "stack", "fruit"].includes(game)
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
      room?.status === "lobby" &&
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
      if (message.type === "leave") this.removeGuest(connection.peer);
    }

    removeGuest(peerId) {
      if (!this.isHost || !this.room) return;
      const nextPlayers = this.room.players.filter((player) => player.id !== peerId);
      this.connections.delete(peerId);
      if (nextPlayers.length === this.room.players.length) return;
      this.room.players = nextPlayers;
      this.finishRoundIfReady();
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
      if (!this.isHost || this.room?.status !== "lobby") return false;
      this.room.game = normalizeGame(game);
      this.broadcastState();
      return true;
    }

    setDifficulty(difficulty) {
      if (!this.isHost || this.room?.status !== "lobby") return false;
      this.room.difficulty = normalizeDifficulty(difficulty);
      this.broadcastState();
      return true;
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
      this.room.status = "countdown";
      this.room.startsAt = this.now() + Math.max(1500, Math.min(Number(delay) || 3200, 8000));
      this.room.seed = Math.floor(this.random() * 0x100000000) >>> 0;
      this.room.players.forEach((player) => {
        player.score = null;
        player.detail = "";
      });
      this.broadcastState();
      clearTimeout(this.startTimer);
      this.startTimer = setTimeout(() => {
        if (!this.room || this.room.status !== "countdown") return;
        this.room.status = "playing";
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
      if (this.room.players.every((player) => normalizeScore(this.room.game, player.score) !== null)) {
        this.room.status = "results";
      }
    }

    rematch() {
      if (!this.isHost || this.room?.status !== "results") return false;
      this.room.status = "lobby";
      this.room.round += 1;
      this.room.startsAt = null;
      this.room.seed = null;
      this.room.players.forEach((player) => {
        player.ready = player.isHost;
        player.score = null;
        player.detail = "";
      });
      this.broadcastState();
      return true;
    }

    leave(notify = true) {
      this.closed = true;
      clearTimeout(this.startTimer);
      clearTimeout(this.connectionTimer);
      this.startTimer = null;
      this.connectionTimer = null;
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
