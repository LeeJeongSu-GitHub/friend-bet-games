(function attachOnlineSessionLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OnlineSessionLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createApi() {
  "use strict";

  const MODES = Object.freeze({
    single: { label: "한 게임", totalRounds: 1 },
    bestOf3: { label: "3판 2선승", totalRounds: 3, targetWins: 2 },
    five: { label: "5게임 종합전", totalRounds: 5 },
    random: { label: "랜덤 게임전", totalRounds: 5 },
  });
  const DEFAULT_PENALTIES = Object.freeze([
    "다음 간식 사기",
    "커피 한 잔 사기",
    "단체 사진 포즈 정하기",
    "다음 게임 진행 맡기",
    "칭찬 한마디씩 하기",
  ]);

  function normalizeMode(mode) {
    return MODES[mode] ? mode : "single";
  }

  function shuffleGames(games, random = Math.random) {
    const shuffled = [...new Set(games)].filter(Boolean);
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
    }
    return shuffled;
  }

  function createSeries({ mode, players = [], games = [], random = Math.random, penalty = "" } = {}) {
    const normalizedMode = normalizeMode(mode);
    const rule = MODES[normalizedMode];
    return {
      mode: normalizedMode,
      label: rule.label,
      totalRounds: rule.totalRounds,
      currentRound: 1,
      targetWins: rule.targetWins || null,
      gameOrder: normalizedMode === "random"
        ? shuffleGames(games, random).slice(0, rule.totalRounds)
        : [],
      standings: players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
        points: 0,
        wins: 0,
        played: 0,
      })),
      rounds: [],
      finished: false,
      championIds: [],
      lastPlaceIds: [],
      penalty: String(penalty || "").trim(),
    };
  }

  function syncPlayers(series, players = []) {
    const standings = series.standings || [];
    players.forEach((player) => {
      const existing = standings.find((entry) => entry.id === player.id);
      if (existing) existing.nickname = player.nickname;
      else standings.push({
        id: player.id,
        nickname: player.nickname,
        points: 0,
        wins: 0,
        played: 0,
      });
    });
    series.standings = standings.filter((entry) =>
      players.some((player) => player.id === entry.id),
    );
  }

  function sortedStandings(series) {
    return [...(series?.standings || [])].sort((left, right) =>
      right.wins - left.wins || right.points - left.points || left.nickname.localeCompare(right.nickname),
    );
  }

  function completeRound(series, rankedPlayers, game, random = Math.random) {
    if (!series || series.finished || !rankedPlayers?.length) return series;
    syncPlayers(series, rankedPlayers);
    const roundNumber = series.currentRound;
    if (series.rounds.some((round) => round.number === roundNumber)) return series;
    const winners = rankedPlayers.filter((player) => player.rank === 1);
    const playerCount = rankedPlayers.length;
    rankedPlayers.forEach((player) => {
      const standing = series.standings.find((entry) => entry.id === player.id);
      if (!standing) return;
      standing.played += 1;
      if (player.rank === 1) standing.wins += 1;
      standing.points += Math.max(1, playerCount - (player.rank || playerCount) + 1);
    });
    series.rounds.push({
      number: roundNumber,
      game,
      winnerIds: winners.map((player) => player.id),
      ranking: rankedPlayers.map((player) => ({
        id: player.id,
        nickname: player.nickname,
        rank: player.rank,
        score: player.score,
      })),
    });

    const leaders = sortedStandings(series);
    if (series.mode === "single") series.finished = true;
    if (series.mode === "bestOf3" && leaders[0]?.wins >= series.targetWins) {
      series.finished = true;
    }
    if (["five", "random"].includes(series.mode) && roundNumber >= series.totalRounds) {
      series.finished = true;
    }

    if (series.finished) {
      const topWins = leaders[0]?.wins || 0;
      const topPoints = leaders[0]?.points || 0;
      series.championIds = leaders
        .filter((entry) => entry.wins === topWins && entry.points === topPoints)
        .map((entry) => entry.id);
      const bottom = leaders[leaders.length - 1];
      series.lastPlaceIds = leaders
        .filter((entry) => entry.wins === bottom?.wins && entry.points === bottom?.points)
        .map((entry) => entry.id);
      if (!series.penalty) {
        series.penalty = DEFAULT_PENALTIES[Math.floor(random() * DEFAULT_PENALTIES.length)];
      }
    } else {
      series.currentRound += 1;
    }
    series.standings = sortedStandings(series);
    return series;
  }

  return {
    MODES,
    DEFAULT_PENALTIES,
    normalizeMode,
    shuffleGames,
    createSeries,
    syncPlayers,
    sortedStandings,
    completeRound,
  };
});
