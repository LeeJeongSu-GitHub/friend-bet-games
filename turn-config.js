(function attachTurnConfig(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.TurnConfig = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createApi() {
  "use strict";

  const CACHE_KEY = "ddak-turn-ice-v1";

  function sanitizeIceServers(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((server) => {
      const urls = Array.isArray(server?.urls) ? server.urls : [server?.urls];
      return urls.some((url) => /^(stun|turn|turns):/i.test(String(url || ""))) &&
        (!urls.some((url) => /^turns?:/i.test(String(url || ""))) ||
          (typeof server.username === "string" && typeof server.credential === "string"));
    }).map((server) => ({
      urls: server.urls,
      ...(server.username ? { username: server.username } : {}),
      ...(server.credential ? { credential: server.credential } : {}),
    }));
  }

  async function load({ endpoint = "", fetchImpl = globalThis.fetch, storage = null } = {}) {
    if (!endpoint || typeof fetchImpl !== "function") return { iceServers: [], source: "stun" };
    try {
      const cached = JSON.parse(storage?.getItem(CACHE_KEY) || "null");
      if (cached?.expiresAt > Date.now() && sanitizeIceServers(cached.iceServers).length) {
        return { iceServers: sanitizeIceServers(cached.iceServers), source: "turn-cache" };
      }
    } catch {
      // Continue with a fresh request.
    }
    try {
      const response = await fetchImpl(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`TURN credentials request failed: ${response.status}`);
      const payload = await response.json();
      const iceServers = sanitizeIceServers(payload.iceServers);
      if (!iceServers.some((server) =>
        (Array.isArray(server.urls) ? server.urls : [server.urls])
          .some((url) => /^turns?:/i.test(String(url))),
      )) throw new Error("TURN response did not contain a relay server");
      try {
        storage?.setItem(CACHE_KEY, JSON.stringify({
          iceServers,
          expiresAt: Date.now() + Math.max(60000, Number(payload.ttl || 3600) * 800),
        }));
      } catch {
        // Credential caching is optional.
      }
      return { iceServers, source: "turn" };
    } catch (error) {
      return { iceServers: [], source: "stun", error };
    }
  }

  return { CACHE_KEY, sanitizeIceServers, load };
});
