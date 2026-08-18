# Cloudflare TURN credential Worker

The browser must never receive the long-lived TURN API token. This Worker exchanges the two encrypted secrets for one-hour WebRTC credentials and only accepts the production site origin.

1. Create a Cloudflare Realtime TURN key.
2. In this directory run `npx wrangler secret put TURN_KEY_ID` and `npx wrangler secret put TURN_KEY_API_TOKEN`.
3. Confirm `ALLOWED_ORIGIN` in `wrangler.toml`, then run `npx wrangler deploy`.
4. Put the deployed Worker URL in the `turn-credentials-url` meta tag in `index.html`.

For local testing, use `.dev.vars`; it is ignored by Git and must never be committed.
