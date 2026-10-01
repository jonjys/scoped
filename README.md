# ClientProof

Paste an inbound client/hiring message. Get a **go/no-go risk score** before you quote or start work.

**Live:** [clientproof.nyttolabs.com](https://clientproof.nyttolabs.com)

## Why this product

This is not a marketplace and not another freelancing CRM.

- The person with the stomach-drop email **is** the customer
- Free scan in seconds → **49 kr** sealed report (actions + reply script)
- No account

Same shape as LiveProof / Vatidence: acute pain, pay-per-use, done.

## Run locally

```bash
npm install
npm run dev -- --port 3847
```

Open [http://localhost:3847](http://localhost:3847).

### Stripe (optional)

```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
BLOB_READ_WRITE_TOKEN=...
```

Without Stripe keys, unlock uses a local mock so you can demo the full flow.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
