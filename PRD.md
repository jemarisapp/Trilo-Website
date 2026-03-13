# Trilo Site - Current Product Reference

This document reflects the current implementation in this repository, not the original pre-build plan.

## 1. Product Summary

Trilo Site is the public web experience for the Trilo Discord bot. It combines:

- marketing pages that explain the product
- a searchable setup guide for commissioners
- pricing and subscription purchase flows
- Discord OAuth for subscriber identity
- post-purchase license delivery and billing management

## 2. Product Goals

- explain Trilo's value within a few seconds of landing on the site
- convert commissioners into a trial or paid subscription
- help new customers activate and configure the bot quickly
- give returning customers a clear path to manage billing and licenses

## 3. Primary Users

- dynasty fantasy league commissioners
- Discord server administrators
- existing Trilo subscribers managing renewals or activation

## 4. Current Routes

| Route | Purpose |
|-------|---------|
| `/` | Primary landing page and top-level conversion CTA |
| `/features` | Expanded feature overview |
| `/pricing` | Free-trial and paid plan purchase flow |
| `/setup` | Interactive onboarding and command guide |
| `/success` | Post-checkout license retrieval page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/auth/callback` | Client route used after Discord OAuth |

## 5. Core User Journeys

### 5.1 First-Time Visitor

1. Land on the home page.
2. Understand the value proposition and supported workflows.
3. Choose between inviting the bot, reading more, or visiting pricing.

### 5.2 Subscriber Purchase Flow

1. Visit `/pricing`.
2. Connect Discord.
3. Start a Stripe checkout session.
4. Return to `/success`.
5. Retrieve license details and activate the bot in Discord.

### 5.3 New Customer Setup Flow

1. Invite Trilo to a server.
2. Buy or start access from the pricing flow.
3. Activate the license in Discord.
4. Follow `/setup` for roles, teams, matchups, and optional features.

### 5.4 Existing Customer Management

1. Reconnect Discord if needed.
2. Open the Stripe customer portal from the pricing page.
3. Review billing or renewals without leaving the site.

## 6. Product Surface

### 6.1 Marketing

- bold hero section
- feature cards and screenshots
- support/community CTA
- legal pages

### 6.2 Setup Guide

- section-based walkthrough
- progress tracked in `localStorage`
- command search
- copy-to-clipboard commands
- per-step completion toggles

### 6.3 Billing and Auth

- Discord OAuth callback and persisted user session
- Stripe checkout for subscriptions
- Stripe customer portal access
- license retrieval after successful checkout

## 7. Current Technical Architecture

| Layer | Implementation |
|-------|----------------|
| Frontend | Vite 6 + React 19 SPA |
| Routing | `react-router-dom` 7 |
| Language | TypeScript |
| Styling | Utility-class approach with theme config in `index.html` |
| Motion | Framer Motion |
| Icons | Lucide React |
| API runtime | Vercel serverless functions in `api/` |
| Payments | Stripe |
| Auth | Discord OAuth |
| Data | Supabase for subscription/license records |

## 8. Repository Structure

```text
Trilo-Site/
├── App.tsx
├── index.html
├── index.tsx
├── pages/
├── components/
├── contexts/
├── api/
├── api-server.js
├── constants.tsx
├── types.ts
├── public/
└── vercel.json
```

Notes:

- The site is client-rendered.
- Non-API routes are rewritten to `index.html` in production.
- `api-server.js` exists as a local helper path, but production traffic is intended to hit the Vercel functions in `api/`.

## 9. Operational Constraints

- `npm run dev` starts the frontend only.
- Production flows expect same-origin `/api/*` handlers.
- Full local testing for billing/auth is not fully scripted yet.
- There are duplicate legacy API files under `pages/api/`; the active production deployment model is the `api/` directory plus Vercel rewrites.

## 10. Recommended Follow-Up Work

- add a documented full-stack local dev workflow
- consolidate or remove duplicate legacy API handlers
- move the Tailwind runtime config into a local build pipeline
- add automated tests for pricing, success, and auth flows
- add analytics and conversion instrumentation if needed
