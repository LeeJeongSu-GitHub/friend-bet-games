const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const serviceWorker = fs.readFileSync("sw.js", "utf8");
const { tiers } = require("../fruit-logic.js");

const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
assert.deepEqual(duplicateIds, [], "HTML ids must be unique");

const selectorIds = Array.from(
  app.matchAll(/querySelector\("#([^"]+)"\)/g),
  (match) => match[1],
);
const missingIds = [...new Set(selectorIds.filter((id) => !ids.includes(id)))];
assert.deepEqual(missingIds, [], "Every JavaScript id selector must exist");

assert.match(
  html,
  /id="fruitCanvas"\s+width="720"\s+height="900"/,
  "Fruit canvas must retain its 4:5 drawing resolution",
);
assert.match(
  styles,
  /\.fruit-arena\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*5/,
  "Fruit arena CSS must match the canvas ratio",
);

let braceDepth = 0;
for (const character of styles) {
  if (character === "{") braceDepth += 1;
  if (character === "}") braceDepth -= 1;
  assert.ok(braceDepth >= 0, "CSS must not contain an unmatched closing brace");
}
assert.equal(braceDepth, 0, "CSS braces must be balanced");

const scripts = Array.from(
  html.matchAll(/<script src="\.\/([^"]+)"/g),
  (match) => match[1],
);
assert.deepEqual(
  scripts.slice(-4),
  [
    "vendor/matter-js/matter.min.js",
    "fruit-logic.js",
    "stack-logic.js",
    "app.js",
  ],
  "Physics and game logic must load before app.js",
);
for (const script of scripts) {
  assert.ok(
    serviceWorker.includes(`"./${script}"`),
    `${script} must be available offline`,
  );
}

assert.deepEqual(
  tiers.map((tier) => tier.name),
  [
    "블루베리",
    "체리",
    "딸기",
    "귤",
    "사과",
    "복숭아",
    "멜론",
    "수박",
    "과일 왕관",
  ],
);

console.log(
  `fruit structure tests passed (${ids.length} ids, ${selectorIds.length} selectors)`,
);
