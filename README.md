# Scoped

Turn a messy client brief into a **fixed-scope offer page** and collect a deposit before you start work.

The hole: freelancers burn time on vague Slack dumps, scope creep, and unpaid “quick projects.” Scoped locks what’s in, what’s out, the price, and a pay-to-start deposit link.

## Features

- Offer builder with live client preview
- Shareable offer pages at `/o/[id]`
- Deposit checkout (Stripe when keys are set, otherwise local mock that records payment)
- **Scoped Pro — $19** one-time unlock (unlimited offers, no watermark)

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
