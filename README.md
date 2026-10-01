# Scoped

Turn a messy client brief into a **fixed-scope offer page** and collect a deposit before you start work.

**Live:** [scoped.nyttolabs.com](https://scoped.nyttolabs.com)

The hole: freelancers burn time on vague Slack dumps, scope creep, and unpaid “quick projects.” Scoped locks what’s in, what’s out, the price, and a pay-to-start deposit link.

## Features

- Offer builder with live client preview
- Shareable offer pages at `/o/[id]`
- Deposit checkout (Stripe when keys are set, otherwise local mock that records payment)
- **Scoped Pro — $19** one-time unlock (unlimited offers, no watermark)
- **Connect AI** at `/connect` — API keys, Cursor MCP, OpenAPI for ChatGPT Actions

## AI connection

1. Open `/connect` and create an API key (`sk_scoped_...`)
2. **Cursor:** paste the MCP config (Settings → MCP), or install as a plugin
3. **ChatGPT / other agents:** use `/api/openapi` as an Action schema with Bearer auth
4. Tools: `create_scoped_offer`, `get_scoped_offer`, `list_scoped_offers`

Endpoints:

- `POST /api/keys` — mint a key
- `GET|POST /api/v1/offers` — list / create (Bearer)
- `GET /api/v1/offers/:id` — fetch one
- `POST /api/mcp` — MCP JSON-RPC
- `GET /api/openapi` — OpenAPI 3.1

### Cursor Marketplace plugin

This repo is packaged as a Cursor plugin:

- [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json)
- [`mcp.json`](mcp.json) → `https://scoped.nyttolabs.com/api/mcp`
- [`skills/create-scoped-offer/`](skills/create-scoped-offer/)

To appear as a selectable plugin in Cursor Customize / Marketplace:

1. Make [github.com/jonjys/scoped](https://github.com/jonjys/scoped) **public**
2. Submit the repo at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
3. After Cursor’s review, users install it and set `SCOPED_API_KEY` under Plugins → Configure

Until approved, users can still add MCP manually from `/connect`.

## Run locally

```bash
npm install
npm run dev -- --port 3847
```

Open [http://localhost:3847](http://localhost:3847).

### Live Stripe (optional)

Create `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Without these, Pro unlock and client deposits use mock checkout so you can demo end-to-end payment flows locally.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint

Offers are stored in `.data/offers.json` (gitignored).
