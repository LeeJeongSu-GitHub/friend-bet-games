const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function corsHeaders(origin, allowedOrigin) {
  return origin === allowedOrigin
    ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
    : {};
}

function json(body, status, origin, allowedOrigin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders(origin, allowedOrigin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = String(env.ALLOWED_ORIGIN || "").replace(/\/$/, "");
    if (!allowedOrigin || origin.replace(/\/$/, "") !== allowedOrigin) {
      return json({ error: "origin-not-allowed" }, 403, origin, allowedOrigin);
    }
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin, allowedOrigin),
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    if (request.method !== "GET") return json({ error: "method-not-allowed" }, 405, origin, allowedOrigin);
    if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) {
      return json({ error: "turn-not-configured" }, 503, origin, allowedOrigin);
    }

    const ttl = 3600;
    const response = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(env.TURN_KEY_ID)}/credentials/generate-ice-servers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.TURN_KEY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ttl }),
      },
    );
    if (!response.ok) return json({ error: "credential-generation-failed" }, 502, origin, allowedOrigin);
    const payload = await response.json();
    return json({ iceServers: payload.iceServers, ttl }, 200, origin, allowedOrigin);
  },
};
