# Trilo Site - Deployment Notes

## Current Deployment Model

The production site is split into two parts:

- a Vite-built React SPA for the frontend
- Vercel serverless functions in `api/` for Discord and Stripe operations

`vercel.json` rewrites all non-API routes to `index.html`, which lets client-side routes like `/pricing` and `/setup` work in production.

## API Surface

Production handlers currently live in:

```text
api/
├── _helpers.js
├── discord/
│   └── callback.js
└── stripe/
    ├── checkout.js
    ├── license.js
    ├── portal.js
    ├── webhook.js
    └── webhook-debug.js
```

The repository also contains `api-server.js`. That file is still useful as a local helper path, but it is not the main production deployment target.

## Required Environment Variables

Client-facing variables:

- `VITE_SITE_URL`
- `VITE_DISCORD_CLIENT_ID`
- `VITE_STRIPE_PRICE_ID_MONTHLY`
- `VITE_STRIPE_PRICE_ID_ANNUAL`

Server-side variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

## Production Setup Checklist

### 1. Deploy to Vercel

- connect the repository to Vercel
- use the Vite build output
- keep the SPA rewrite in `vercel.json`

### 2. Set the production site URL

- `VITE_SITE_URL=https://trilo.gg`

### 3. Configure Discord OAuth

Add this redirect URI in the Discord developer portal:

```text
https://trilo.gg/auth/callback
```

### 4. Configure Stripe

Use the production webhook endpoint:

```text
https://trilo.gg/api/stripe/webhook
```

Recommended event coverage:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Post-Deploy Smoke Test

- visit `/`
- visit `/features`
- visit `/pricing`
- connect Discord successfully
- start Stripe checkout successfully
- confirm `/success` loads the license details
- verify customer portal access from the pricing page
- verify webhook processing updates the backing data

## Local Development Caveat

`npm run dev` starts the frontend only. The site's purchase and auth flows expect same-origin `/api/*` endpoints, so there is not yet a fully documented one-command local full-stack workflow.

Today, local end-to-end API testing requires extra setup, such as:

- running a Vercel-compatible local workflow for the `api/` functions
- pointing the frontend to a local backend during development
- using `api-server.js` as a helper for Stripe and Discord experiments

## Recommended Cleanup

- add an npm script or documented workflow for local API testing
- consolidate legacy API files under `pages/api/`
- decide whether `api-server.js` stays as a supported local path or is removed after the local dev story is replaced
