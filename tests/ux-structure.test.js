const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");

const gameTabs = Array.from(
  html.matchAll(/<button(?=[^>]*class="game-tab)[\s\S]*?<\/button>/g),
  (match) => match[0],
);

const supportsMode = (tab, mode) => {
  const modes = tab.match(/data-mode="([^"]+)"/)?.[1] || "together";
  return modes.split(/\s+/).includes(mode);
};

const categoryOf = (tab) => tab.match(/data-category="([^"]+)"/)?.[1] || "";

assert.equal(gameTabs.length, 18, "All game tabs must be discoverable");
assert.equal(
  gameTabs.filter((tab) => supportsMode(tab, "together")).length,
  13,
  "Together mode count must match its tabs",
);
assert.equal(
  gameTabs.filter((tab) => supportsMode(tab, "solo")).length,
  7,
  "Solo mode count must match its tabs",
);
assert.deepEqual(
  Object.fromEntries(
    ["quick", "mini", "party"].map((category) => [
      category,
      gameTabs.filter(
        (tab) => supportsMode(tab, "together") && categoryOf(tab) === category,
      ).length,
    ]),
  ),
  { quick: 8, mini: 3, party: 2 },
  "Together categories must match their visible game tabs",
);

assert.match(html, /data-mode-count="together"/);
assert.match(html, /data-mode-count="solo"/);
assert.match(html, /data-category-count="all"/);
assert.match(app, /function updateGameCounts\(\)/);

[
  ["spinButton", "wheelCanvas"],
  ["bombButton", "bombVisual"],
  ["shuffleButton", "cardGrid"],
  ["orderButton", "orderList"],
  ["teamButton", "teamBoard"],
  ["drawButton", "drawTicketBoard"],
  ["ladderButton", "ladderCanvas"],
  ["menuButton", "menuWheelCanvas"],
  ["seatButton", "seatBoard"],
  ["tournamentButton", "tournamentMatch"],
  ["fingerFallback", "fingerArena"],
  ["reactionStart", "reactionArena"],
  ["reactionSoloStart", "reactionSoloPad"],
  ["timerStart", "timerBoard"],
  ["timerSoloStart", "timerSoloBoard"],
  ["dodgeStart", "dodgeArena"],
  ["tapStart", "tapPad"],
  ["runnerStart", "runnerArena"],
  ["stackStart", "stackArena"],
  ["fruitStart", "fruitArena"],
].forEach(([startId, arenaId]) => {
  assert.ok(
    html.indexOf(`id="${startId}"`) < html.indexOf(`id="${arenaId}"`),
    `${startId} must appear before the large game area`,
  );
});

assert.match(
  html,
  /<details id="partySession" class="party-session">/,
  "Party sessions should start as an optional collapsed control",
);
assert.match(app, /function updatePartySessionVisibility\(\)/);
assert.match(app, /state\.currentCategory !== "party"/);
assert.match(app, /currentMode: state\.currentMode/);
assert.match(app, /currentCategory: state\.currentCategory/);
assert.match(app, /currentGame: state\.currentGame/);
assert.match(app, /setPlayMode\(state\.currentMode\)/);
assert.match(app, /setGameCategory\(state\.currentCategory\)/);
assert.match(app, /selectGame\(state\.currentGame\)/);
assert.doesNotMatch(
  app,
  /savedState\.hasStoredState\s*&&\s*window\.matchMedia\("\(max-width: 1240px\)"\)/,
  "Mobile setup should be compact even on the first visit",
);

[
  "quickGameList",
  "favoriteGame",
  "randomGame",
  "openGameSettings",
  "gameSettingsDialog",
  "soundToggle",
  "vibrationToggle",
  "tryAnotherGame",
].forEach((id) => {
  assert.match(html, new RegExp(`id="${id}"`), `${id} must exist`);
});
assert.equal(
  (html.match(/data-difficulty="(easy|normal|hard)"/g) || []).length,
  3,
  "All three difficulty choices must be available",
);
assert.match(app, /function renderQuickLaunch\(\)/);
assert.match(app, /function launchGame\(game\)/);
assert.match(app, /function tryAnotherGame\(\)/);
assert.match(app, /recentGames: state\.recentGames/);
assert.match(app, /favoriteGames: state\.favoriteGames/);
assert.match(app, /difficulty: state\.difficulty/);
assert.match(app, /soundEnabled: state\.soundEnabled/);
assert.match(app, /vibrationEnabled: state\.vibrationEnabled/);
assert.match(app, /restartControl\?\.click\(\)/);
assert.match(app, /getDifficultyProfile\(\)\.stackTolerance/);
assert.match(app, /getDifficultyProfile\(\)\.fruitDangerDuration/);
assert.equal(
  (app.match(/navigator\.vibrate/g) || []).length,
  2,
  "Vibration calls must be centralized in the preference-aware helper",
);

console.log("ux structure tests passed");
