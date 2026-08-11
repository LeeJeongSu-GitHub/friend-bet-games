const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const challengeLogic = fs.readFileSync("challenge-logic.js", "utf8");
const onlineRoom = fs.readFileSync("online-room.js", "utf8");
const resultShare = fs.readFileSync("result-share.js", "utf8");
const pwaManager = fs.readFileSync("pwa-manager.js", "utf8");
const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));

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
  "openRecords",
  "randomGame",
  "openGameSettings",
  "gameSettingsDialog",
  "recordsDialog",
  "recordsGrid",
  "gameGuideDialog",
  "startFromGuide",
  "engagementHub",
  "startDailyChallenge",
  "openFriendChallenge",
  "openOnlineRoom",
  "sharedChallengeBar",
  "startSharedChallenge",
  "dismissSharedChallenge",
  "friendChallengeDialog",
  "friendChallengeBar",
  "onlineRoomDialog",
  "onlineRoomBar",
  "onlineMatchTimer",
  "createOnlineRoom",
  "joinOnlineRoomForm",
  "onlinePlayerList",
  "onlineGameRule",
  "onlineDifficultyControl",
  "startOnlineMatch",
  "onlineCountdownOverlay",
  "onlineActivityArena",
  "onlineQuizBuzz",
  "onlineQuizAnswerForm",
  "onlineRpsChoices",
  "onlineRpsBracket",
  "saveResultImage",
  "installApp",
  "appUpdateBanner",
  "applyAppUpdate",
  "soundToggle",
  "vibrationToggle",
  "tryAnotherGame",
].forEach((id) => {
  assert.match(html, new RegExp(`id="${id}"`), `${id} must exist`);
});
assert.match(
  html,
  /class="online-entry-intro"/,
  "The online room intro must have its own layout hook",
);
assert.doesNotMatch(
  styles,
  /\.online-entry-view\s*>\s*p/,
  "Online room paragraph styles must not affect the status message",
);
assert.equal(
  (html.match(/data-online-game="[^"]+"/g) || []).length,
  10,
  "All ten online match games must be selectable",
);
assert.equal(
  (html.match(/data-rps-choice="(rock|paper|scissors)"/g) || []).length,
  3,
  "All three rock-paper-scissors choices must be available",
);
assert.equal(
  (html.match(/data-online-difficulty="(easy|normal|hard)"/g) || []).length,
  3,
  "Online matches must expose all three difficulty choices",
);
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
assert.match(app, /difficultyRecords: state\.difficultyRecords/);
assert.match(app, /seenGuides: state\.seenGuides/);
assert.match(app, /dailyProgress: state\.dailyProgress/);
assert.match(app, /achievementStats: state\.achievementStats/);
assert.match(app, /unlockedAchievements: state\.unlockedAchievements/);
assert.match(app, /soundEnabled: state\.soundEnabled/);
assert.match(app, /vibrationEnabled: state\.vibrationEnabled/);
assert.match(app, /restartControl\?\.click\(\)/);
assert.match(app, /getDifficultyProfile\(\)\.stackTolerance/);
assert.match(app, /getDifficultyProfile\(\)\.fruitDangerDuration/);
assert.match(app, /function storeActiveDifficultyRecords\(/);
assert.match(app, /function loadActiveDifficultyRecords\(/);
assert.match(app, /function renderRecords\(\)/);
assert.match(app, /function requestGuidedStart\(game, starter\)/);
assert.match(app, /function pauseDodge\(\)/);
assert.match(app, /function pauseRunner\(\)/);
assert.match(app, /function pauseStack\(\)/);
assert.match(app, /function pauseFruit\(\)/);
assert.match(app, /function startDailyChallenge\(\)/);
assert.match(app, /function startFriendChallenge\(\)/);
assert.match(app, /function startSharedChallenge\(\)/);
assert.match(app, /function createOnlineRoom\(\)/);
assert.match(app, /function scheduleOnlineMatch\(snapshot\)/);
assert.match(app, /function renderOnlineQuiz\(snapshot\)/);
assert.match(app, /function renderOnlineRps\(snapshot\)/);
assert.match(app, /submitOnlineScore\("reaction", record/);
assert.match(app, /submitOnlineScore\(\s*"timer",\s*averageDifference/);
assert.match(app, /submitOnlineScore\("tap", tapCount/);
assert.match(app, /submitOnlineScore\(\s*"dodge",\s*record/);
assert.match(app, /submitOnlineScore\(\s*"runner",\s*runnerScoreValue/);
assert.match(app, /submitOnlineScore\(\s*"stack",\s*stackScoreValue/);
assert.match(app, /submitOnlineScore\(\s*"fruit",\s*fruitScoreValue/);
assert.match(app, /function applyEngagementResult\(rawResult\)/);
assert.match(app, /ResultShare\.createFile\(result,/);
assert.match(app, /function saveResultImage\(\)/);
assert.match(app, /function updateAchievements\(notify = true\)/);
assert.match(challengeLogic, /function buildUrl\(baseUrl, payload\)/);
assert.match(challengeLogic, /function parseUrl\(urlValue\)/);
assert.match(onlineRoom, /class RoomSession/);
assert.match(onlineRoom, /function buildInviteUrl\(baseUrl, roomCode\)/);
assert.match(onlineRoom, /function rankPlayers\(players, game\)/);
assert.match(resultShare, /function createCanvas\(result, options = \{\}\)/);
assert.match(pwaManager, /beforeinstallprompt/);
assert.match(pwaManager, /registration\.waiting\.postMessage/);
assert.deepEqual(
  manifest.icons.map((icon) => icon.sizes),
  ["192x192", "512x512", "512x512"],
  "PWA must provide install and maskable PNG icons",
);
assert.equal(manifest.shortcuts.length, 4, "PWA must expose four quick actions");
assert.equal(
  (app.match(/scoreValue:/g) || []).length,
  4,
  "All four challenge games must expose a comparable score",
);
assert.equal(
  (html.match(/data-friend-game="(dodge|runner|stack|fruit)"/g) || []).length,
  4,
  "Friend challenges must offer all four seeded games",
);
assert.match(
  styles,
  /\.friend-challenge-bar\[hidden\]\s*\{\s*display:\s*none;/,
  "Inactive friend challenges must stay visually hidden",
);
assert.match(
  styles,
  /\.online-room-bar\[hidden\]\s*\{\s*display:\s*none;/,
  "Inactive online rooms must stay visually hidden",
);
assert.match(
  html,
  /vendor\/peerjs\/peerjs\.min\.js\?v=40/,
  "PeerJS must be served locally for online rooms",
);
assert.match(
  styles,
  /\.engagement-actions \.primary-action,\s*\.engagement-actions \.secondary-action\s*\{\s*min-width:\s*0;\s*flex:\s*1;/,
  "Mobile engagement actions must fit inside the challenge card",
);
assert.match(app, /document\.addEventListener\("visibilitychange"/);
assert.equal(
  (html.match(/data-game-help="(dodge|runner|stack|fruit)"/g) || []).length,
  4,
  "Every long-form canvas game must expose its help button",
);
assert.equal(
  (app.match(/navigator\.vibrate/g) || []).length,
  2,
  "Vibration calls must be centralized in the preference-aware helper",
);

console.log("ux structure tests passed");
