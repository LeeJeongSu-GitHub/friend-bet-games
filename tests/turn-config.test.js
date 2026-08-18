const assert = require("node:assert/strict");
const TurnConfig = require("../turn-config.js");

assert.equal(TurnConfig.sanitizeIceServers([{ urls: "https://invalid" }]).length, 0);
assert.equal(TurnConfig.sanitizeIceServers([{ urls: "turn:example.com" }]).length, 0);
assert.equal(TurnConfig.sanitizeIceServers([{
  urls: ["turn:example.com", "turns:example.com"],
  username: "short-lived-user",
  credential: "short-lived-secret",
}]).length, 1);

(async () => {
  const fallback = await TurnConfig.load({ endpoint: "" });
  assert.equal(fallback.source, "stun");
  const loaded = await TurnConfig.load({
    endpoint: "https://worker.example/turn",
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        ttl: 3600,
        iceServers: [{
          urls: "turns:turn.cloudflare.com:443?transport=tcp",
          username: "user",
          credential: "credential",
        }],
      }),
    }),
  });
  assert.equal(loaded.source, "turn");
  assert.equal(loaded.iceServers.length, 1);
  console.log("TURN configuration tests passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
