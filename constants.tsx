
import React from 'react';
import {
  Zap, Users, Target, Megaphone, Settings, Trophy,
  Layout, CheckCircle, Terminal, BookOpen, Shield, HelpCircle
} from 'lucide-react';
import { SetupSection } from './types';

export const BOT_INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1312633145216077854&permissions=8&integration_type=0&scope=bot+applications.commands';
export const DISCORD_SUPPORT_URL = 'https://discord.com/invite/zRQzvJWnUt';

export const FEATURES = [
  {
    title: "AI-Powered Matchups",
    description: "Upload schedule screenshots and let Trilo automatically create channels and matchups.",
    icon: <Zap className="w-6 h-6 text-trilo-orange" />,
    isPro: true
  },
  {
    title: "Team Management",
    description: "Easily assign users to teams, track ownership, and clear assignments with one command.",
    icon: <Users className="w-6 h-6 text-trilo-orange" />
  },
  {
    title: "Attribute Points",
    description: "Automate the awarding, tracking, and approval of player upgrades for your dynasty league.",
    icon: <Target className="w-6 h-6 text-trilo-orange" />,
    isPro: true
  },
  {
    title: "Smart Messaging",
    description: "Automate advance notifications, announcements, and tagged user pings in game channels.",
    icon: <Megaphone className="w-6 h-6 text-trilo-orange" />
  },
  {
    title: "Custom Settings",
    description: "Fine-tune commissioner roles, log channels, and league types (CFB & NFL).",
    icon: <Settings className="w-6 h-6 text-trilo-orange" />
  },
  {
    title: "CFB & NFL Support",
    description: "Deep integration with major sports leagues for native feel and terminology.",
    icon: <Trophy className="w-6 h-6 text-trilo-orange" />
  }
];

export const SETUP_GUIDE: SetupSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    description: "Welcome to the Trilo automation guide. This walkthrough is designed to take you from a standard Discord server to a fully automated dynasty powerhouse. We recommend following these steps in sequence to ensure all permissions and configurations are correctly applied. Total estimated setup time: 10 minutes.",
    steps: []
  },
  {
    id: "initial",
    title: "2. Initial Setup",
    description: "First, we need to get the bot into your digital stadium and ensure your league has the right credentials.",
    steps: [
      {
        id: "2.1",
        title: "Add Trilo to your Discord server (admin must invite)",
        button: { label: "Add to Server", url: BOT_INVITE_URL },
        notes: "You must have Administrator permissions to invite Trilo to your server."
      },
      {
        id: "2.2",
        title: "Get subscription — go to trilo.gg/pricing or run /admin purchase",
        displayTitle: (
          <>
            Get subscription — go to <a href="#/pricing" className="text-trilo-orange hover:underline">trilo.gg/pricing</a> or run <code className="bg-white/10 px-1 rounded text-trilo-yellow font-mono text-sm">/admin purchase</code>
          </>
        ),
        command: "/admin purchase",
        notes: "All Trilo features and commands require an active subscription to function."
      },
      {
        id: "2.3",
        title: "Check Subscription",
        command: "/admin check-subscription",
        notes: "Verify that your server has access."
      }
    ]
  },
  {
    id: "config",
    title: "3. Essential Configuration",
    description: "Mandatory settings to make the bot functional in your specific server.",
    steps: [
      { id: "3.1", title: "Set Commissioner Roles", command: "/settings set setting:commissioner_roles new_value:Commish,Admin" },
      { id: "3.2", title: "Set League Type", command: "/settings set setting:league_type new_value:cfb", notes: "Use 'cfb' or 'nfl'." }
    ]
  },
  {
    id: "teams",
    title: "4. Team Management",
    description: "Assign users to teams so the bot knows who is playing where.",
    steps: [
      { id: "4.1", title: "Assign a Team", command: "/teams assign-user user:@username team_name:Oregon" },
      { id: "4.2", title: "Unassign a User", command: "/teams unassign-user user:@username" },
      { id: "4.3", title: "View All Assignments", command: "/teams list-all" }
    ]
  },
  {
    id: "matchups",
    title: "5. Matchup System",
    description: "The core engine for scheduling and tagging.",
    steps: [
      { id: "5.1", title: "Create from Image", command: "/matchups create-from-image", isPro: true },
      { id: "5.2", title: "Create Manually", command: "/matchups create-from-text" },
      { id: "5.3", title: "Tag Users", command: "/matchups tag-users" },
      { id: "5.4", title: "Delete Matchups", command: "/matchups delete" }
    ]
  },
  {
    id: "streams",
    title: "6. Stream Detection (Optional)",
    description: "Get notified when league members go live on Twitch or YouTube. All three settings are required for this feature to work.",
    steps: [
      { id: "6.1", title: "Enable Stream Announcements", command: "/settings set setting:stream_announcements_enabled new_value:on" },
      { id: "6.2", title: "Set Notify Role", command: "/settings set setting:stream_notify_role new_value:@StreamAlert", notes: "Role to ping when someone goes live." },
      { id: "6.3", title: "Set Watch Channel", command: "/settings set setting:stream_watch_channel new_value:#live-streams", notes: "Channel where stream notifications are posted." }
    ]
  },
  {
    id: "attributes",
    title: "7. Attribute Points (Optional)",
    description: "Track and manage player upgrade points. Commissioners award points, users request upgrades, and commissioners approve or deny.",
    steps: [
      { id: "7.1", title: "Set Log Channel", command: "/settings set setting:attributes_log_channel new_value:#attribute-logs", notes: "Channel where all point changes are logged.", isPro: true },
      { id: "7.2", title: "Give Points to User", command: "/attributes give user:@username amount:100", isPro: true },
      { id: "7.3", title: "View All Balances", command: "/attributes check-all", isPro: true },
      { id: "7.4", title: "User: Check Your Points", command: "/attributes my-points", notes: "Any user can check their own balance.", isPro: true },
      { id: "7.5", title: "User: Request Upgrade", command: "/attributes request", notes: "Users submit upgrade requests for commissioner approval.", isPro: true },
      { id: "7.6", title: "View Pending Requests", command: "/attributes requests-list", isPro: true },
      { id: "7.7", title: "Approve All Requests", command: "/attributes approve-all", isPro: true }
    ]
  }
];