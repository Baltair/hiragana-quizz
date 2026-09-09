# Hiragana Quiz (ひらがなクイズ) 🌸

A fast, beautiful, and distraction-free web application designed to help learners master Japanese Hiragana characters and pronunciations. 

Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**, and optimized for zero-maintenance deployment on **Cloudflare Workers** with Static Assets.

---

## ✨ Features

- **🎯 Configurable Multiple-Choice Options**:
  - Choose anywhere from **2 up to 10 choices** per question.
  - Keyboard shortcuts (`1` to `9` and `0`) enable lightning-fast practice without moving your hands to the mouse.

- **🔤 Comprehensive Kana Sets**:
  - **Main Kana (Gojūon)**: All 46 fundamental characters (あ, か, さ, た, etc.).
  - **Dakuten & Handakuten Kana**: +25 voiced characters (が, ざ, だ, ば, ぱ, etc.).
  - **Combination Kana (Yōon)**: +36 compound characters (きゃ, しゃ, ちゃ, etc.).
  - Total pool of **107 characters**.

- **⚙️ Flexible Practice Modes**:
  - **Learn Hiragana**: Displays the Hiragana character $\rightarrow$ select the corresponding Romaji sound.
  - **Learn Romaji**: Displays the Romaji sound $\rightarrow$ select the matching Hiragana character.
  - **Learn Both**: Alternates between Hiragana $\rightarrow$ Romaji and Romaji $\rightarrow$ Hiragana for dynamic testing.

- **⏱️ Round Control & Infinite Mode**:
  - Select quick presets (10, 20, 50 rounds), custom round counts, or enter **`0` for Infinite Mode**.
  - Safely pause or stop training at any time with the **Stop Training** button to immediately view results.

- **⚡ Instant Visual Feedback & Micro-Animations**:
  - Selecting an answer immediately highlights correct (green glow) and incorrect choices (red shake).
  - Automatically advances to the next question after a brief feedback delay.

- **📊 Comprehensive Session Results & Per-Character Breakdown**:
  - View overall score, accuracy percentage, time elapsed, and longest streak.
  - Character-level breakdown table displaying every tested Hiragana, times shown, times correct, accuracy badge, and click-to-listen audio.

- **📖 Interactive Cheatsheet**:
  - Full reference table for all 107 Hiragana characters categorized by Main, Dakuten, and Combination.
  - Live search filter by character, romaji, or line group.
  - Click any card to hear its native Japanese pronunciation.

- **📈 Local Scores History & Character Mastery**:
  - Automatically saves session results to `localStorage` (100% client-side, zero database or accounts required).
  - **Cumulative Character Mastery** identifies your most challenging kana ("Struggle Characters" with &lt;75% accuracy) so you know where to focus.
  - Option to clear history anytime.

- **🌗 Light & Dark Theme Modes**:
  - Full theme support with a dedicated toggle in the header (Sun/Moon icons).
  - Automatically respects your system preference with persistent local storage.

- **🔊 Native Audio Pronunciations**:
  - Uses the browser's native Japanese Speech Synthesis (`ja-JP`).
  - Interactive audio buttons on Romaji prompts, cheatsheet cards, and results items.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting / CDN**: [Cloudflare Workers](https://workers.cloudflare.com/) (Static Assets)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (included with Node.js)

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd hiragana-quizz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The compiled assets will be output to the `dist/` directory.

5. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## ☁️ Cloudflare Workers Deployment

This application is pre-configured with `wrangler.jsonc` using Cloudflare Workers with Static Assets.

### Option 1: Git Integration (Recommended)

When you are ready to publish:

1. Initialize a git repository and push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Hiragana Quiz app"
   git remote add origin https://github.com/<your-username>/hiragana-quizz.git
   git branch -M main
   git push -u origin main
   ```

2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/):
   - Navigate to **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** or **Workers**.
   - Select **Connect to Git** and choose your repository.
   - Configure the build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click **Save and Deploy**. Cloudflare will automatically build and deploy the app upon every push to `main`!

### Option 2: CLI Deployment with Wrangler

If you prefer deploying via the command line:

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy:
   ```bash
   npx wrangler deploy
   ```

---

## 📁 Project Structure

```
hiragana-quizz/
├── index.html                 # HTML entry with Japanese font integration
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS styling & custom Sakura theme
├── tsconfig.json              # TypeScript root configuration
├── tsconfig.app.json          # App TypeScript settings
├── tsconfig.node.json         # Node/Vite TypeScript settings
├── vite.config.ts             # Vite bundler configuration
├── wrangler.jsonc             # Cloudflare Workers configuration (Static Assets)
├── src/
│   ├── main.tsx               # React application entry point
│   ├── App.tsx                # Main state controller (setup, quiz, results, modals)
│   ├── index.css              # Global styles & animations
│   ├── worker.ts              # Lightweight Cloudflare Worker asset fetch handler
│   ├── types/
│   │   └── index.ts           # Type definitions (KanaItem, QuizConfig, SessionResult)
│   ├── data/
│   │   └── hiragana.ts        # 107 Hiragana characters, question generator, audio helper
│   ├── services/
│   │   └── storage.ts         # LocalStorage manager (sessions, mastery stats, preferences)
│   └── components/
│       ├── Header.tsx         # Navbar with audio toggle, cheatsheet & history buttons
│       ├── QuizSetup.tsx      # Configuration screen (choices, sets, rounds, mode)
│       ├── QuizCard.tsx       # Active quiz view with feedback & keyboard shortcuts
│       ├── QuizResults.tsx    # Results screen with general score & per-kana breakdown
│       ├── CheatsheetModal.tsx# Comprehensive reference table with search & audio
│       └── HistoryModal.tsx   # Past sessions and character mastery tracking
```

---

## 📜 License

MIT License. Free to use and modify for your Japanese learning journey!
