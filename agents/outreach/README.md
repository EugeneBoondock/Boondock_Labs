# Boondock Labs outreach

The Cloudflare Worker in `worker.mjs` stores prospect, run, message, suppression, and quote records in D1. The Network Solutions VPS runs the three saved Earthie agent sessions, Gmail OAuth client, inbox poller, scheduled prospect sender, and reply sender. The database migrations are in the repository root `migrations/` directory.

The prospect timers run at 09:00, 13:00, 16:00, and 20:00 Africa/Johannesburg. The registry enforces 15 initial attempts per run, 60 per local day, and one initial contact per business. `scheduled-send.mjs` also checks live public contact evidence, Gmail Sent, agent availability, and the current slot. Businesses with no listed dedicated website rank first in the queue when a supported directory page can be verified. Small independent businesses are the lead research priority; larger businesses remain eligible when the observed fit is clear.

The persistent VPS environment, OAuth tokens, service token, and private keys stay outside Git. `deploy/outreach.env.example` shows variable names without values. The historical one-off recovery scripts and dated systemd overrides are excluded from this deployment source.

Run `node --test agents/outreach/outreach.test.mjs` for the local registry, mail, and scheduling checks. Run `npm test`, `npx tsc --noEmit`, and `npm run build` for the portfolio before merging site changes.
