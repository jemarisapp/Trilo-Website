# Trilo Website

The official marketing and documentation website for **Trilo**, the Discord bot that automates dynasty fantasy football leagues.

![Trilo Banner](public/trilo-logo.JPG)

## 🚀 Overview

This site serves as the central hub for Trilo users, featuring:
- **Interactive Setup Guide:** Step-by-step onboarding with progress tracking.
- **Feature Showcase:** Breakdown of AI matchups, team management, and attribute points.
- **Pricing:** Overview of subscription tiers (Core vs Pro).
- **Documentation:** Detailed command usage and configuration steps.

## 🛠️ Tech Stack

Built with a focus on performance and modern aesthetics:
- **Framework:** [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom "Neo-Dark" theme)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jemarisapp/Trilo-Website.git
   ```

2. Install dependencies:
   ```bash
   cd Trilo-Website
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000` (or the port shown in terminal).

## 📂 Project Structure

```
Trilo-Site/
├── src/
│   ├── components/
│   │   ├── Layout/      # Header, Footer
│   │   └── UI/          # Reusable UI components (Card, Button)
│   ├── pages/           # Route components (Home, Setup, Pricing)
│   ├── constants.tsx    # Configuration data & content
│   └── App.tsx          # Main routing & layout
├── public/              # Static assets (images, logos)
└── tailwind.config.js   # Theme configuration
```

## 🚢 Deployment

This project is optimized for deployment on **Vercel**:

1. Push changes to `main` branch.
2. Import repository in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## 📜 License

© 2026 Trilo. All rights reserved.
