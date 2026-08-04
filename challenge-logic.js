(function attachChallengeLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChallengeLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createChallengeLogic() {
  "use strict";

  const VERSION = "1";
  const GAMES = new Set(["dodge", "runner", "stack", "fruit"]);
  const DIFFICULTIES = new Set(["easy", "normal", "hard"]);

  function sanitizeName(value) {
    return String(value || "친구").trim().replace(/\s+/g, " ").slice(0, 12) || "친구";
  }

  function normalize(payload) {
    const game = String(payload?.game || "");
    const difficulty = String(payload?.difficulty || "");
    const seed = Number(payload?.seed);
    const score = Number(payload?.score);
    if (
      !GAMES.has(game) ||
      !DIFFICULTIES.has(difficulty) ||
      !Number.isInteger(seed) ||
      seed < 0 ||
      seed > 0xffffffff ||
      !Number.isFinite(score) ||
      score < 0
    ) {
      return null;
    }
    return {
      version: VERSION,
      game,
      difficulty,
      seed: seed >>> 0,
      score,
      challenger: sanitizeName(payload?.challenger),
    };
  }

  function buildUrl(baseUrl, payload) {
    const challenge = normalize(payload);
    if (!challenge) return "";
    const url = new URL(baseUrl);
    url.search = "";
    url.hash = "";
    url.searchParams.set("challenge", challenge.version);
    url.searchParams.set("game", challenge.game);
    url.searchParams.set("level", challenge.difficulty);
    url.searchParams.set("seed", String(challenge.seed));
    url.searchParams.set("score", String(challenge.score));
    url.searchParams.set("by", challenge.challenger);
    return url.toString();
  }

  function parseUrl(urlValue) {
    try {
      const url = new URL(urlValue, "https://challenge.invalid/");
      if (url.searchParams.get("challenge") !== VERSION) return null;
      if (
        !url.searchParams.has("game") ||
        !url.searchParams.has("level") ||
        !url.searchParams.has("seed") ||
        !url.searchParams.has("score")
      ) {
        return null;
      }
      return normalize({
        game: url.searchParams.get("game"),
        difficulty: url.searchParams.get("level"),
        seed: Number(url.searchParams.get("seed")),
        score: Number(url.searchParams.get("score")),
        challenger: url.searchParams.get("by"),
      });
    } catch {
      return null;
    }
  }

  function compare(score, targetScore) {
    const current = Number(score) || 0;
    const target = Number(targetScore) || 0;
    if (current > target) return "win";
    if (current === target) return "tie";
    return "lose";
  }

  return {
    VERSION,
    GAMES: [...GAMES],
    DIFFICULTIES: [...DIFFICULTIES],
    normalize,
    buildUrl,
    parseUrl,
    compare,
  };
});
