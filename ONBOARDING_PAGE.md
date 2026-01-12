# Trilo Website - Onboarding Page Specification

## Overview

An interactive onboarding/setup guide page for new Trilo users. This page helps commissioners set up their league step-by-step with progress tracking, command copying, and a polished UI.

---

## Page Goal

Guide new users through:
1. Adding Trilo to their Discord server
2. Configuring essential settings
3. Assigning teams
4. Creating first matchups
5. Using the attribute points system

---

## Page Route

`/setup` or `/onboarding`

---

## ⚡ Quick Path (Minimum Setup)

For users who just want to get running fast:

| Step | Command |
|------|---------|
| 1. Set commissioner roles | `/settings set setting:commissioner_roles new_value:Commish,Admin` |
| 2. Set league type | `/settings set setting:league_type new_value:cfb` |
| 3. Assign teams | `/teams assign-user user:@username team_name:Oregon` |
| 4. Create matchups | `/matchups create-from-text` or `/matchups create-from-image` |

**That's it — 4 commands and your league is live.** Everything else is enhancement.

**Weekly operations:**
- `/matchups tag-users` — Notify players in their game channels
- `/matchups delete category_name:Week 1` — Clean up after the week ends

---

## Features

### Progress Tracking
- Sidebar showing all sections with completion checkmarks
- Overall progress percentage at top
- State persisted in localStorage

### "Quick Start" Checklist
- Quick checklist on sidebar that users can manually check
- Items:
  - [ ] Have an admin invite Trilo to Discord
  - [ ] Get access (contact @trillsapp)
  - [ ] Set commissioner roles
  - [ ] Set league type (CFB or NFL)
  - [ ] Assign teams to users
  - [ ] Create first week matchups

### Interactive Steps
- Each step has:
  - Title + description
  - Copy-to-clipboard command box (styled as terminal)
  - Optional "Pro Tier" badge
  - Optional warning callout
  - "Mark Complete" button (toggleable)

### Search
- Search bar to find commands quickly
- Filters by command text

### Mobile Support
- Bottom navigation bar on mobile
- Sticky header with progress

---

## Content Sections

### Section 1: Introduction
- Brief overview of what the guide covers
- Estimated time: 10-15 minutes

### Section 2: Initial Setup

| Step | Title | Command | Notes |
|------|-------|---------|-------|
| 2.1 | Invite Trilo | - | Admin must invite the bot |
| 2.2 | Get Access | - | Contact **@trillsapp** on Discord (trials/purchases disabled) |
| 2.3 | Check Subscription Status | `/admin check-subscription` | Verify access is active |

> **Note:** `/admin trial` and `/admin purchase` are temporarily disabled. Contact @trillsapp on Discord for access.

> **Already whitelisted?** Skip Step 2.2 and go directly to Step 2.3 (`/admin check-subscription`) to verify your access is active.

### Section 3: Essential Configuration

| Step | Title | Command | Notes |
|------|-------|---------|-------|
| 3.1 | Set Commissioner Roles | `/settings set setting:commissioner_roles new_value:Commish,Admin` | REQUIRED |
| 3.2 | Set League Type | `/settings set setting:league_type new_value:cfb` | REQUIRED (cfb or nfl) |
| 3.3 | Enable Stream Detection | `/settings set setting:stream_announcements_enabled new_value:on` | Optional |
| 3.4 | Set Stream Channel | `/settings set setting:stream_watch_channel new_value:#streams` | Optional |
| 3.5 | Set Stream Notify Role | `/settings set setting:stream_notify_role new_value:Streamers` | Optional, can be @everyone |
| 3.6 | Set Attributes Log Channel | `/settings set setting:attributes_log_channel new_value:#logs` | Optional |
| 3.7 | Enable Auto-Confirm Matchups | `/settings set setting:matchup_auto_confirm new_value:on` | Optional, Pro Tier |
| 3.8 | Enable Auto Force Win vs CPU | `/settings set setting:auto_fw_vs_cpu new_value:on` | Optional, NEW in v2.0 |

### Section 4: Team Management

| Step | Title | Command | Notes |
|------|-------|---------|-------|
| 4.1 | Assign a Team | `/teams assign-user user:@username team_name:Oregon` | - |
| 4.2 | View All Assignments | `/teams list-all` | Auto-updates when assignments change |
| 4.3 | Check Team Owner | `/teams who-has team_name:Oregon` | Everyone can use |
| 4.4 | Unassign a User | `/teams unassign-user user:@username` | - |
| 4.5 | Clear a Team | `/teams clear-team team_name:Oregon` | - |

### Section 5: Matchup System

| Step | Title | Command | Notes |
|------|-------|---------|-------|
| 5.1 | Create from Image (Pro) | `/matchups create-from-image` | Upload schedule screenshots |
| 5.2 | Create Manually | `/matchups create-from-text` | Type matchups as "Team1 vs Team2" |
| 5.3 | Tag Users | `/matchups tag-users` | Ping users in their game channels |
| 5.4 | Add Game Status | `/matchups add-game-status` | Add reaction tracking (✅ 🎲 🟥 🟦) |
| 5.5 | Delete Category | `/matchups delete category_name:Week 1` | Clean up after week ends |

### Section 6: Attribute Points (Pro Tier)

#### For League Members

| Step | Title | Command |
|------|-------|---------|
| 6.1 | Check Your Points | `/attributes my-points` |
| 6.2 | Request an Upgrade | `/attributes request player:QB John Doe attribute:Speed (SPD) amount:5` |
| 6.3 | View Request History | `/attributes history` |
| 6.4 | Cancel a Request | `/attributes cancel-request request_number:123` |

#### For Commissioners

| Step | Title | Command |
|------|-------|---------|
| 6.5 | Give Points to Users | `/attributes give users:@User1 @User2 amount:100 reason:Weekly participation` |
| 6.6 | Give Points to Role | `/attributes give-role role:@RoleName amount:50 reason:Division winners` |
| 6.7 | View Pending Requests | `/attributes pending` |
| 6.8 | Approve All Requests | `/attributes approve-all` |
| 6.9 | Deny a Request | `/attributes deny request_number:123 reason:Invalid player` |
| 6.10 | Check All Points | `/attributes check-all` |

### Section 7: Command Reference

Full categorized command list:

#### Admin Commands
- `/admin check-subscription` - Check subscription status
- `/admin setup-league` - Create league channel structure

#### Settings Commands
- `/settings set` - Configure a setting
- `/settings view` - View all settings
- `/settings reset` - Remove a setting
- `/settings clear-all` - Clear all settings
- `/settings help` - Learn about settings

#### Team Commands
- `/teams assign-user`
- `/teams unassign-user`
- `/teams clear-team`
- `/teams list-all`
- `/teams who-has`
- `/teams clear-all-assignments`

#### Matchup Commands
- `/matchups create-from-image` (Pro)
- `/matchups create-from-text`
- `/matchups tag-users`
- `/matchups make-public`
- `/matchups make-private`
- `/matchups add-game-status`
- `/matchups delete`

#### Attribute Commands
- Member: `/attributes my-points`, `request`, `history`, `cancel-request`
- Commissioner: `give`, `give-role`, `pending`, `approve`, `approve-all`, `deny`, `deny-all`, `check-user`, `check-all`, `revoke`, `clear-all`

#### Message Commands
- `/message custom`
- `/message announce-advance`

#### Help Commands
- `/trilo help`
- `/trilo help overview`

---

## Removed/Outdated Commands (Do NOT include)

| Old Command | Status |
|-------------|--------|
| `/admin trial` | Disabled |
| `/admin purchase` | Disabled |
| `/admin activate-annual` | Removed |

---

## Design Notes

- Use the same "Electric Dark Mode" aesthetic from the marketing site
- Trilo Orange (#FF6B35) for progress bars, highlights, CTAs
- Outfit font for section headings
- Geist Sans for body text
- Dark code blocks with yellow command text
- Glassmorphism cards for each step
- Hover glow on "Mark Complete" buttons

---

## Technical Notes

- Use localStorage to persist progress
- Alpine.js (or React state) for interactivity
- Mobile bottom nav for section switching
- Command search filters in real-time
