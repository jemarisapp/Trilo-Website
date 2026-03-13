# Trilo Website - Setup Guide Specification

This document reflects the current `/setup` experience implemented in `pages/Setup.tsx` and `constants.tsx`.

## Overview

The setup guide is an interactive onboarding page for commissioners who have already discovered Trilo and now need to:

1. invite the bot
2. purchase or start access
3. activate their license
4. configure the server
5. begin running matchups and optional advanced features

## Route

`/setup`

`/onboarding` is not currently implemented as a route.

## Primary UX Goals

- make setup feel approachable instead of documentation-heavy
- break the process into clear sections with copyable commands
- show visible progress as users complete steps
- support both quick scanning and detailed reference use

## Current Interactive Features

### Progress Tracking

- step completion is stored in `localStorage`
- the sidebar shows overall completion percentage
- completed sections display a success state in the nav

### Search

- filters steps by title and command text
- keeps the intro section visible even when results are filtered

### Command Actions

- commands can be copied to the clipboard
- action buttons are used for invite/pricing links when a command is not appropriate

### Layout

- sticky sidebar on desktop
- stacked layout on mobile
- card-based sections with step completion toggles

## Current Content Model

### 1. Introduction

- short explanation of the guide
- estimated setup time

### 2. Initial Setup

| Step | Current Content |
|------|-----------------|
| 2.1 | Invite Trilo to the Discord server |
| 2.2 | Purchase a license from `/pricing` |
| 2.3 | Activate with `/admin activate license_key:TRILO-XXXX-XXXX-XXXX` |
| 2.4 | Verify with `/admin license-info` |

Notes:

- the purchase flow is live
- license keys are delivered after purchase
- one license supports multiple Discord servers

### 3. Essential Configuration

| Step | Command |
|------|---------|
| 3.1 | `/settings set setting:commissioner_roles new_value:Commish,Admin` |
| 3.2 | `/settings set setting:league_type new_value:cfb` |

### 4. Team Management

| Step | Command |
|------|---------|
| 4.1 | `/teams assign-user user:@username team_name:Oregon` |
| 4.2 | `/teams unassign-user user:@username` |
| 4.3 | `/teams list-all` |

### 5. Matchup System

| Step | Command |
|------|---------|
| 5.1 | `/matchups create-from-image` |
| 5.2 | `/matchups create-from-text` |
| 5.3 | `/matchups tag-users` |
| 5.4 | `/matchups delete` |

### 6. Stream Detection (Optional)

| Step | Command |
|------|---------|
| 6.1 | `/settings set setting:stream_announcements_enabled new_value:on` |
| 6.2 | `/settings set setting:stream_notify_role new_value:@StreamAlert` |
| 6.3 | `/settings set setting:stream_watch_channel new_value:#live-streams` |

### 7. Attribute Points (Optional)

| Step | Command |
|------|---------|
| 7.1 | `/settings set setting:attributes_log_channel new_value:#attribute-logs` |
| 7.2 | `/attributes give user:@username amount:100` |
| 7.3 | `/attributes check-all` |
| 7.4 | `/attributes my-points` |
| 7.5 | `/attributes request` |
| 7.6 | `/attributes requests-list` |
| 7.7 | `/attributes approve-all` |

## Quick Path

For commissioners who want the shortest path to a working league:

1. invite Trilo
2. buy a license from `/pricing`
3. activate with `/admin activate`
4. set commissioner roles
5. set league type
6. assign teams
7. create matchups

## Commands That Should Not Reappear In Docs

Do not reintroduce older purchase/access instructions such as:

- "contact support for access" as the main path
- `/admin trial`
- `/admin purchase`

The current docs should point users to the live pricing flow instead.

## Design Notes

- keep the same electric dark visual language as the marketing pages
- use orange/yellow highlights for progress and emphasis
- style commands like a terminal surface
- keep card interactions lightweight and readable

## Implementation Notes

- source of truth for setup content lives in `constants.tsx`
- UI behavior lives in `pages/Setup.tsx`
- future doc edits should stay aligned with those files
