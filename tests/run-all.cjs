const { spawnSync } = require("node:child_process");

const checks = [
  ["--check", "app.js"],
  ["--check", "sw.js"],
  ["--check", "engagement-logic.js"],
  ["--check", "challenge-logic.js"],
  ["--check", "online-room.js"],
  ["--check", "online-activity-logic.js"],
  ["--check", "online-session-logic.js"],
  ["--check", "turn-config.js"],
  ["--check", "cloudflare/turn-worker/src/index.js"],
  ["--check", "result-share.js"],
  ["--check", "pwa-manager.js"],
  ["tests/challenge-logic.test.js"],
  ["tests/online-room.test.js"],
  ["tests/online-activity-logic.test.js"],
  ["tests/online-session-logic.test.js"],
  ["tests/turn-config.test.js"],
  ["tests/engagement-logic.test.js"],
  ["tests/result-share.test.js"],
  ["tests/fruit-logic.test.js"],
  ["tests/fruit-physics.test.js"],
  ["tests/fruit-structure.test.js"],
  ["tests/stack-logic.test.js"],
  ["tests/ux-structure.test.js"],
];

for (const args of checks) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`all ${checks.length} automated checks passed`);
