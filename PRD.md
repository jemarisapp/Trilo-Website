# Trilo Website - Product Requirements Document

## 1. Product Overview

### 1.1 Purpose
Create a marketing and conversion website for Trilo, a Discord bot that automates dynasty sports league management. The website will serve as the primary landing page, feature showcase, and (future) payment portal.

### 1.2 Goals
- **Primary**: Establish credibility and explain Trilo's value proposition
- **Secondary**: Convert visitors to Discord bot installs
- **Future**: Enable Stripe payments for subscriptions

### 1.3 Target Audience
- Dynasty fantasy sports league commissioners (CFB, NFL)
- Discord server administrators
- Sports gaming community organizers

---

## 2. User Stories

### 2.1 First-Time Visitor
> "As a league commissioner, I want to quickly understand what Trilo does so I can decide if it's worth trying."

**Acceptance Criteria:**
- [ ] Value proposition clear within 5 seconds
- [ ] Features explained with concrete examples
- [ ] Easy path to add bot to Discord

### 2.2 Pricing Evaluator
> "As a potential customer, I want to compare pricing tiers so I can choose the right plan."

**Acceptance Criteria:**
- [ ] Clear feature comparison table
- [ ] Pricing displayed prominently
- [ ] No hidden fees or confusing terms

### 2.3 Existing User
> "As a current Trilo user, I want to quickly access support or manage my subscription."

**Acceptance Criteria:**
- [ ] Contact information easily findable
- [ ] Link to Discord support server
- [ ] (Future) Customer portal access

---

## 3. Functional Requirements

### 3.1 Pages

| Page | Route | Priority | Description |
|------|-------|----------|-------------|
| Home | `/` | P0 | Landing page with hero, features, CTAs |
| Features | `/features` | P1 | Detailed feature breakdown |
| Pricing | `/pricing` | P0 | Tier comparison and pricing |
| Privacy Policy | `/privacy` | P0 | Legal requirement |
| Terms of Service | `/terms` | P1 | Legal requirement |

### 3.2 Core Components

| Component | Description |
|-----------|-------------|
| Header | Logo, navigation, "Add to Discord" CTA |
| Footer | Links, Discord, copyright, legal |
| Hero | Full-width section with headline and CTAs |
| FeatureCard | Icon + title + description card |
| PricingCard | Tier card with features and price |
| Button | Primary/secondary/ghost variants |

### 3.3 Navigation

```
Header:
├── Logo (links to /)
├── Features
├── Pricing
└── [Add to Discord] (CTA button)

Footer:
├── Features
├── Pricing
├── Privacy Policy
├── Terms of Service
├── Discord (invite link)
└── © 2026 Trilo
```

---

## 4. Design Requirements

### 4.1 Visual Identity

**Primary Palette:**
| Token | Hex | Usage |
|-------|-----|-------|
| Trilo Orange | #FF6B35 | Primary CTA, highlights |
| Trilo Yellow | #F3AA07 | Accents, secondary highlights |
| Gradient | #FF6B35 → #F3AA07 | Hero backgrounds, buttons (135deg) |

**Dark Theme:**
| Token | Hex | Usage |
|-------|-----|-------|
| Body | #121212 | Page background |
| Cards/Header | #1A1A1A | Card backgrounds, header |
| Sections | #101010 | Alternate section backgrounds |
| Elevated | #2D2D2D | Elevated cards, hover states |

**Utility:**
| Token | Hex | Usage |
|-------|-----|-------|
| Text Primary | #FFFFFF | Headings, important text |
| Text Secondary | #9CA3AF | Body text, descriptions |
| Discord | #5865F2 | Discord button |
| Success | #10B981 | Checkmarks, active status |

### 4.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Outfit | Bold | 48-64px |
| H2 | Outfit | Bold | 32-40px |
| H3 | Outfit | Semibold | 24-28px |
| Body | Geist Sans | Normal | 16-18px |
| Code | Geist Mono | Normal | 14px |

### 4.3 Spacing
- Container max-width: 1200px
- Section padding: 80-120px vertical
- Card padding: 24-32px
- Gap between elements: 16-24px

### 4.4 Visual Effects: "Electric Dark Mode"
- **Backgrounds**: Deep blacks with subtle noise texture
- **Lighting**: Radial gradient glows (Trilo Orange) behind key focal points
- **Cards**: Glassmorphism with thin gradient borders (0.5px)
- **Hover**: Lift effect + border glow intensification
- **Layout**: Asymmetrical "Bento Grid" for feature sections
- **Animation**: Subtle floating mesh gradients in hero background

---

## 5. Technical Requirements

### 5.1 Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | Framework (App Router) |
| React | 19.x | UI Library |
| Tailwind CSS | 4.x | Styling |
| TypeScript | 5.x | Type safety |
| Lucide React | Latest | Icons |
| Framer Motion | Latest | Animations |
| Vercel | - | Hosting |

### 5.2 Project Structure

```
trilo-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Home
│   │   ├── features/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       └── Pricing.tsx
│   └── lib/
│       └── utils.ts
├── public/
│   ├── og-image.png
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### 5.3 SEO Requirements

| Page | Title | Description |
|------|-------|-------------|
| Home | "Trilo - Dynasty League Discord Bot" | "Automate matchups, teams, and attribute points for your dynasty sports league." |
| Features | "Features - Trilo" | "AI-powered matchups, team management, attribute points, and more." |
| Pricing | "Pricing - Trilo" | "Simple, transparent pricing for Trilo. Core and Pro plans available." |

### 5.4 Performance Targets
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

---

## 6. Content Requirements

### 6.1 Home Page Sections

1. **Hero**
   - Headline: "Dynasty League Management, Automated"
   - Subheadline: 1-2 sentences
   - CTAs: Add to Discord, See Features

2. **Features** (4-6 cards)
   - AI-Powered Matchups
   - Team Management
   - Attribute Points
   - Smart Messaging
   - Custom Settings
   - CFB & NFL Support

3. **How It Works** (3 steps)
   - Add Trilo to Discord
   - Configure settings
   - Enjoy automation

4. **Final CTA**
   - Reinforce value proposition
   - Repeat primary CTA

### 6.2 Pricing Content

| Tier | Price (Monthly) | Price (Annual) | Key Features |
|------|-----------------|----------------|--------------|
| Trial | Free | - | 10 days, all features |
| Core | $7.99 | $35.99 | Teams, messaging, manual matchups |
| Pro | $14.99 | $59.99 | AI matchups, bulk ops, priority support |

---

## 7. Future Considerations (Phase 2)

- [ ] Stripe checkout integration
- [ ] Customer subscription portal
- [ ] Blog/changelog with MDX
- [ ] Interactive demo
- [ ] Discord server widget embed
- [ ] Analytics (Vercel Analytics, Plausible)

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | <2s |
| Bounce Rate | <50% |
| Discord Bot Clicks | Track via UTM |
| Conversion Rate | Measure post-Stripe |

---

## 9. Timeline

| Phase | Scope | Duration |
|-------|-------|----------|
| Phase 1 | Landing, Features, Pricing, Legal | 1-2 days |
| Phase 2 | Stripe integration | TBD |
| Phase 3 | Blog/Changelog | TBD |

---

## 10. Links & Resources

- **Bot Invite**: `https://discord.com/oauth2/authorize?client_id=1312633145216077854`
- **Discord Support**: `https://discord.gg/...` (add actual link)
- **Current Domain**: trilo.gg
- **Privacy Policy Source**: `/Users/jsapp/Documents/Trilo/Trilo/PRIVACY_POLICY.md`
