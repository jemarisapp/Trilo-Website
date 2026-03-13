# Trilo Site - Implementation Prompt

Use this prompt when extending or redesigning the existing Trilo site. It reflects the current codebase, not the original greenfield concept.

## Goal

Evolve the current Trilo marketing and billing site without changing the core architecture or product flow.

## Technical Constraints

- **Framework:** Vite 6 + React 19 SPA
- **Language:** TypeScript
- **Routing:** `react-router-dom` 7
- **Styling:** existing utility-class approach and theme config in `index.html`
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel static frontend plus `/api/*` serverless functions
- **Do not switch the project to Next.js unless that migration is an explicit requirement**

## Existing Routes To Preserve

- `/`
- `/features`
- `/pricing`
- `/setup`
- `/success`
- `/privacy`
- `/terms`
- `/auth/callback`

## Product Constraints

- The home page should stay conversion-focused and commissioner-oriented.
- The pricing page is live, not conceptual.
- The purchase flow includes Discord OAuth, Stripe checkout, a success page, and license activation guidance.
- The setup guide is interactive and should continue supporting progress tracking, command search, and copy-to-clipboard actions.
- Legal pages should remain accessible from the main site navigation/footer.

## Current Pricing Model

- free trial option
- one paid Trilo subscription
- monthly and annual billing toggle
- billing managed through Stripe customer portal

## Brand Direction

### Colors

- Trilo Orange: `#FF6B35`
- Trilo Yellow: `#F3AA07`
- Background: `#121212`
- Elevated surfaces: `#1A1A1A` to `#2D2D2D`
- Discord accent: `#5865F2`

### Typography

- Headings: Outfit
- Body: Geist Sans
- Mono/code: Geist Mono

### Style

- electric dark-mode aesthetic
- strong gradients and glow treatments
- glassy dark cards
- sports-tech tone instead of generic SaaS minimalism
- clear, bold CTAs

## Core Experiences

### Home

- headline-driven hero
- invite/community CTAs
- feature summary
- quick "how it works" explanation

### Features

- deeper explanation of Trilo capabilities
- screenshots or previews where helpful

### Pricing

- Discord connect state
- monthly/annual toggle
- clear subscription CTA
- support for manage-subscription state

### Setup

- sectioned onboarding
- command copy actions
- progress saved in local storage

### Success

- post-checkout confirmation
- license retrieval
- clear next steps for Discord activation

## Implementation Guidance

- reuse existing components, routes, and constants where possible
- prefer enhancing the current structure over rebuilding from scratch
- keep `/api/*` expectations intact for Stripe and Discord
- keep copy and design aligned with the live product, not an earlier "Stripe coming soon" concept

## Nice Follow-Ups

- improve local full-stack developer workflow
- consolidate duplicate legacy API handlers
- move styling config from CDN runtime setup into a local build pipeline
- add analytics and test coverage around auth and checkout flows
