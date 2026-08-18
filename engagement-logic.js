(function attachEngagementLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.EngagementLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createApi() {
  const DAILY_GAMES = ["dodge", "runner", "stack", "fruit"];
  const DIFFICULTIES = ["easy", "normal", "hard"];

  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function getDailyChallenge(key = dateKey()) {
    const seed = hashString(`friend-bet-games:${key}`);
    return {
      id: `${key}:0`,
      slot: 0,
      date: key,
      seed,
      game: DAILY_GAMES[seed % DAILY_GAMES.length],
      difficulty:
        DIFFICULTIES[Math.floor(seed / DAILY_GAMES.length) % DIFFICULTIES.length],
    };
  }

  function getDailyChallenges(key = dateKey(), count = 3) {
    const first = getDailyChallenge(key);
    const games = [first.game, ...DAILY_GAMES.filter((game) => game !== first.game)];
    const random = createSeededRandom(first.seed ^ 0x9e3779b9);
    for (let index = games.length - 1; index > 1; index -= 1) {
      const target = 1 + Math.floor(random() * index);
      [games[index], games[target]] = [games[target], games[index]];
    }
    return games.slice(0, Math.max(1, Math.min(Number(count) || 3, games.length)))
      .map((game, slot) => ({
        id: `${key}:${slot}`,
        slot,
        date: key,
        seed: slot === 0 ? first.seed : hashString(`friend-bet-games:${key}:${slot}:${game}`),
        game,
        difficulty: slot === 0
          ? first.difficulty
          : DIFFICULTIES[hashString(`${key}:${slot}`) % DIFFICULTIES.length],
      }));
  }

  function recentDateKeys(endDate = dateKey(), count = 7) {
    const end = dayNumber(endDate);
    if (end === null) return [];
    return Array.from({ length: Math.max(1, Number(count) || 7) }, (_, index) => {
      const date = new Date((end - index) * 86400000);
      return date.toISOString().slice(0, 10);
    }).reverse();
  }

  function createSeededRandom(seed) {
    let state = (Number(seed) || 1) >>> 0;
    return function nextRandom() {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function dayNumber(key) {
    const [year, month, day] = String(key).split("-").map(Number);
    if (![year, month, day].every(Number.isFinite)) return null;
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  }

  function updateStreak(lastDate, currentDate, currentStreak) {
    if (!lastDate) return 1;
    if (lastDate === currentDate) return Math.max(1, currentStreak || 1);
    const last = dayNumber(lastDate);
    const current = dayNumber(currentDate);
    if (last === null || current === null || current <= last) {
      return Math.max(1, currentStreak || 1);
    }
    return current - last === 1 ? Math.max(1, currentStreak || 0) + 1 : 1;
  }

  function rankScores(entries) {
    const sorted = [...entries]
      .map((entry, index) => ({
        ...entry,
        score: Number.isFinite(Number(entry.score)) ? Number(entry.score) : 0,
        order: index,
      }))
      .sort((left, right) => right.score - left.score || left.order - right.order);
    const ranked = [];
    sorted.forEach((entry, index) => {
      const rank =
        index > 0 && entry.score === sorted[index - 1].score
          ? ranked[index - 1].rank
          : index + 1;
      ranked.push({ ...entry, rank });
    });
    return ranked;
  }

  return {
    DAILY_GAMES,
    DIFFICULTIES,
    dateKey,
    hashString,
    getDailyChallenge,
    getDailyChallenges,
    recentDateKeys,
    createSeededRandom,
    updateStreak,
    rankScores,
  };
});
