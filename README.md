# Trilo Site

Marketing site, setup guide, and billing surface for **Trilo**, the Discord bot for dynasty league automation.

![Trilo Banner](public/trilo-logo.JPG)

## Overview

This repository contains the current public website for Trilo, including:

- marketing pages for the product and feature set
- an interactive setup guide with progress tracking
- Discord OAuth for subscriber identity
- Stripe checkout, success, and customer portal flows
- Vercel API handlers for billing, licensing, and webhooks

## Current Stack

- **Frontend:** Vite 6, React 19, TypeScript
- **Routing:** `react-router-dom` 7
- **Styling:** Tailwind-style utility classes with theme config loaded in `index.html`
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Backend integrations:** Stripe, Discord OAuth, Supabase
- **Hosting:** Vercel static deployment with `/api/*` serverless functions

## Architecture

- `index.html`, `index.tsx`, and `App.tsx` bootstrap the SPA.
- Route components live in `pages/`.
- Shared UI lives in `components/`.
- Discord auth state is managed in `contexts/DiscordContext.tsx`.
- Production API handlers live in `api/`.
- `api-server.js` is a local helper server for Stripe/Discord work. It is not the primary production runtime.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run the frontend

```bash
npm run dev
```

The Vite dev server runs on `http://localhost:3000`.

### Local API note

`npm run dev` serves the frontend only. The production checkout/auth flows call same-origin `/api/*` routes that are implemented for Vercel in `api/`.

If you need to test billing or Discord auth locally, you currently need one of these approaches:

- run a Vercel-compatible local workflow for the `api/` handlers
- adapt the frontend to point at a local backend
- use the legacy helper server in `api-server.js`

There is no built-in npm script or Vite proxy wiring for full local end-to-end API testing yet.

## Environment Variables

Common variables used by the site and API handlers:

- `VITE_SITE_URL`
- `VITE_DISCORD_CLIENT_ID`
- `VITE_STRIPE_PRICE_ID_MONTHLY`
- `VITE_STRIPE_PRICE_ID_ANNUAL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

## Project Structure

```text
Trilo-Site/
├── App.tsx
├── index.html
├── index.tsx
├── vite.config.ts
├── pages/                  # Client routes
│   ├── Home.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   ├── Setup.tsx
│   ├── Legal.tsx
│   └── success.tsx
├── components/             # Layout and reusable UI
├── contexts/               # Client state providers
├── api/                    # Vercel serverless functions
├── api-server.js           # Local helper server
├── constants.tsx           # Product copy and setup guide content
├── types.ts
└── public/                 # Images and static assets
```

## Deployment

Production is designed around Vercel:

1. Build the SPA with `npm run build`.
2. Deploy the repository to Vercel.
3. Keep the non-API rewrite in `vercel.json` so client routes resolve to `index.html`.
4. Set the required environment variables for both client and server code.
5. Configure Discord OAuth and Stripe webhooks for the production domain.

## Notes

- Some older planning docs in this repo originally described a Next.js implementation. Those docs have been updated to reflect the current Vite SPA architecture.
- The site currently uses a live purchase flow: Discord connect, Stripe checkout, license delivery, and subscription management are all part of the intended product surface.

## License

© 2026 Trilo. All rights reserved.
