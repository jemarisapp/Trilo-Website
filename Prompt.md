# Trilo Website - AI Builder Prompt

## Overview
Build a modern marketing website for **Trilo**, a Discord bot that automates dynasty sports league management. The site should be professional, dark-themed, and conversion-focused.

---

## Technical Requirements

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Fonts**: Outfit (Headings) + Geist Sans (Body) + Geist Mono (Code)
- **Icons**: Lucide React
- **Animations**: Framer Motion (subtle, professional)
- **Deployment**: Vercel
- **Dark Mode**: Default to dark theme

---

## Brand Guidelines

### Colors

**Primary Palette:**
- **Trilo Orange**: #FF6B35 (primary CTA, highlights)
- **Trilo Yellow**: #F3AA07 (accents, secondary highlights)
- **Gradient**: #FF6B35 → #F3AA07 at 135deg (hero backgrounds, buttons)

**Dark Theme:**
- **Body Background**: #121212
- **Cards/Header**: #1A1A1A
- **Sections**: #101010 or #090909
- **Card Elevated**: #2D2D2D

**Utility:**
- **Text Primary**: #FFFFFF
- **Text Secondary**: #9CA3AF (Tailwind gray-400)
- **Discord Button**: #5865F2
- **Success/Active**: #10B981
- **Standard Grays**: Tailwind gray scale

### Typography
- **Headings**: Outfit, Bold, tight tracking (Sports/Tech vibe)
- **Body**: Geist Sans, Normal weight, relaxed leading
- **Code/Technical**: Geist Mono

### Visual Style: "Electric Dark Mode"
- **Aesthetic**: High-impact sports tech × Modern dark mode SaaS. Think "Nike Tech meets Vercel".
- **Backgrounds**: Deep blacks with subtle "grid" or "noise" patterns to add texture.
- **Lighting**: Dramatic radial gradient glows using Trilo Orange/Yellow behind key elements (hero text, feature cards).
- **Cards**: Dark glassmorphism (backdrop-blur) with thin, subtle gradient borders that light up on hover.
- **Layout**: "Bento Grid" style for features (asymmetrical, highly structured grid).
- **Whitespace**: Generous breathing room to make the "pop" elements stand out.

### Animation & Effects
- **Glow Effects**: Conic gradient glows behind the "Add to Discord" button.
- **Scroll Reveal**: Elements fade up and scale in slightly as you scroll.
- **Hover States**:
  - Cards lift slightly and borders glow brighter.
  - Buttons have a subtle "shine" effect on hover.
- **Hero Animation**: Slow, drifting gradient mesh in the background (Orange/Yellow).
- **Numbers**: Animated number counters for "Stats" (if used).

---

## Pages to Build

### 1. Home Page (`/`)

**Hero Section:**
- Headline: "Dynasty League Management, Automated"
- Subheadline: "The Discord bot that handles matchups, teams, and points so you can focus on winning."
- Primary CTA: "Add to Discord" (links to Discord bot invite)
- Secondary CTA: "See Features"
- Background: Subtle animated gradient or grid pattern

**Features Section:**
- 4-6 feature cards with icons
- Features:
  - ⚡ AI-Powered Matchups (upload screenshots, get channels)
  - 👥 Team Management (assign users, track ownership)
  - 🎯 Attribute Points (award, track, approve upgrades)
  - 📢 Smart Messaging (announcements, advance notifications)
  - ⚙️ Customizable Settings (commissioner roles, log channels)
  - 🏈 CFB & NFL Support

**How It Works Section:**
- 3 steps:
  1. Add Trilo to your Discord server
  2. Configure your league settings
  3. Automate everything

**Social Proof (Optional):**
- "Used by X dynasty leagues"
- Discord server activity stats

**CTA Section:**
- "Ready to automate your league?"
- Repeat primary CTA

**Footer:**
- Links: Features, Pricing, Privacy Policy, Terms
- Discord invite link
- Copyright

---

### 2. Features Page (`/features`)

Detailed breakdown of each feature with:
- Icon
- Title
- Description
- Screenshot or demo GIF (placeholder for now)

---

### 3. Pricing Page (`/pricing`)

**Tiers:**

| Feature | Free Trial | Core | Pro |
|---------|------------|------|-----|
| Team Management | ✅ | ✅ | ✅ |
| Manual Matchups | ✅ | ✅ | ✅ |
| Messaging Tools | ✅ | ✅ | ✅ |
| AI Image Matchups | ❌ | ❌ | ✅ |
| Bulk Operations | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

**Pricing:**
- Free Trial: 10 days
- Core: $7.99/month or $35.99/year
- Pro: $14.99/month or $59.99/year

**Note:** Stripe integration coming soon. For now, CTA should say "Contact for Pricing" linking to Discord.

---

### 4. Privacy Policy (`/privacy`)

Static page with privacy policy content. Can pull from existing PRIVACY_POLICY.md.

---

### 5. Terms of Service (`/terms`)

Static page with terms. Simple placeholder for now.

---

## Components to Build

### Global
- `Header` - Logo, nav links, "Add to Discord" button
- `Footer` - Links, Discord, copyright
- `Button` - Primary/secondary variants
- `Card` - For features, pricing tiers
- `SectionHeader` - Consistent section title styling

### Home Page
- `Hero` - Full-width hero with CTAs
- `FeatureCard` - Icon + title + description
- `HowItWorks` - Numbered steps
- `CTABanner` - Full-width CTA section

### Pricing Page
- `PricingCard` - Per tier
- `PricingTable` - Feature comparison
- `Toggle` - Monthly/Annual switch

---

## Assets Needed

> **Note:** These are placeholders. Add actual assets after downloading the code.

- **Logo**: `[PLACEHOLDER]` - Replace with Trilo logo
- **OG Image**: `[PLACEHOLDER]` - 1200x630 for social sharing
- **Favicon**: `[PLACEHOLDER]` - 32x32 and 16x16
- **Screenshots**: `[PLACEHOLDER]` - Bot in action screenshots
- **Discord Invite**: `[PLACEHOLDER]` - Bot invite URL
- **Discord Support**: `[PLACEHOLDER]` - Support server invite

---

## SEO Requirements

- Meta title: "Trilo - Dynasty League Discord Bot | Automate Your League"
- Meta description: "Trilo is the Discord bot that automates matchups, teams, and attribute points for dynasty sports leagues. Save hours every week."
- OG image for social sharing
- Proper heading hierarchy (single h1 per page)

---

## Nice-to-Haves (Phase 2)

- [ ] Stripe checkout integration
- [ ] Customer portal link
- [ ] Blog/changelog (MDX)
- [ ] Interactive demo
- [ ] Discord server widget

---

## Reference Sites

For design inspiration:
- https://linear.app (clean SaaS)
- https://vercel.com (modern, dark)
- https://resend.com (developer-focused)
- https://cal.com (feature-rich landing)
