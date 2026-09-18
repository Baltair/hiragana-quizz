# AI Agent Guidelines — Hiragana Quiz (ひらがなクイズ)

This document serves as the authoritative guide for AI coding assistants (Antigravity, Cursor, Claude Code, GitHub Copilot, Windsurf, etc.) working on this repository. Follow these guidelines to maintain architectural purity, UX consistency, and deployment integrity.

---

## 🏛️ 1. Architecture & Constraints

- **100% Client-Side Architecture**:
  - This application is a completely client-side Single Page Application (SPA).
  - **NEVER** introduce a Node.js/Express backend server, cloud database, or external backend API for core features.
  - All state persistence (session history, theme preference, character mastery metrics) is stored in the browser's `localStorage` via [`src/services/storage.ts`](file:///src/services/storage.ts).
- **Deployment Platform**:
  - Designed for **Cloudflare Workers** with Static Assets via [`wrangler.jsonc`](file:///wrangler.jsonc) and [`src/worker.ts`](file:///src/worker.ts).
  - **DO NOT run `wrangler deploy`**: Deployment is fully automated via Cloudflare's GitHub Git integration upon pushing to the `main` branch.
- **Technology Stack**:
  - **React 19** with TypeScript (~5.7).
  - **Vite 6** bundler with `@vitejs/plugin-react`.
  - **Tailwind CSS 3** with custom theme extensions.
  - **Lucide React** for iconography.

---

## ⌨️ 2. Commands & Workflow

Always verify your changes before reporting completion:

```bash
# Start local development server
npm run dev

# Run TypeScript typecheck and production build
npm run build

# Preview production build locally
npm run preview
```

> [!IMPORTANT]
> Always ensure `npm run build` (`tsc -b && vite build`) exits with code `0` before completing any task.

---

## 🔤 3. Dataset & Kana Rules

The canonical Kana dataset is defined in [`src/data/hiragana.ts`](file:///src/data/hiragana.ts) and must satisfy the following invariants:

1. **Exact 107-Kana Pool**:
   - **Main Kana (Gojūon)**: 46 characters (あ to ん).
   - **Dakuten & Handakuten**: 25 characters (が, ざ, だ, ば, ぱ lines).
   - **Combination Kana (Yōon)**: 36 characters (きゃ, しゃ, etc.).
2. **Romanization Invariants (`ぢ` and `づ`)**:
   - `ぢ` (`dji`): `romaji: 'di'`, `altRomaji: 'ji'`.
   - `づ` (`dzu`): `romaji: 'du'`, `altRomaji: 'zu'`.
   - *Rationale*: D-line kana must have unique romaji (`di`, `du`) to prevent duplicate choices or ambiguous prompts in the quiz, while `altRomaji` enables Cheatsheet display and search to support both forms without collision.
3. **Cumulative Stats Migration Integrity**:
   - Whenever reading or migrating cumulative stats in `storage.ts`, always initialize the complete 107-character map from `ALL_KANA` and merge user history on top. Never allow missing characters to be `undefined`.

---

## ⏱️ 4. Active Quiz Mechanics & Learning Rhythm

1. **Dynamic Feedback Rhythm**:
   - **Correct Answer Transition**: Rapid **380ms** delay to maintain flow state.
   - **Incorrect Answer Transition**: Deliberate **1000ms** delay to give the learner time to digest the mistake.
2. **Timer Race Condition Safeguards**:
   - Always track transitions in a `timerRef = useRef<number | null>(null)` in [`src/components/QuizCard.tsx`](file:///src/components/QuizCard.tsx).
   - Any active timer **must** be cleared on question change, component unmount, or when the user clicks "Stop Training".
   - Never call `onAnswer` after session termination.
3. **Keyboard Shortcuts**:
   - Keys `1` through `9` correspond to choices `0` through `8`.
   - Key `0` corresponds to choice `9` (the 10th option).
   - Shortcut badges must remain vertically centered with choice labels.

---

## 🔊 5. Speech Synthesis Guidelines

Audio pronunciation uses the browser's Web Speech API (`playKanaSound` in [`src/data/hiragana.ts`](file:///src/data/hiragana.ts)):

1. **Text Sanitization**:
   - Always strip parenthetical notes or punctuation (`text.replace(/\s*\(.*?\)/g, '')`) before calling `.speak()`.
2. **WebKit / iOS Safari Compatibility**:
   - Resume speech context if paused (`window.speechSynthesis.resume()`).
   - Allow a brief timeout (~20ms) after `.cancel()` before calling `.speak()` to avoid WebKit queue-clearing freezes.
3. **Chromium Garbage Collection Fix**:
   - Maintain a module-scoped reference (`activeUtterance`) to the playing utterance so Chrome's V8 garbage collector does not dispose of the utterance mid-playback.
4. **Prompt Audio Policy**:
   - Audio repeat buttons are rendered **only** for Romaji prompts in the quiz to avoid spoiling Hiragana visual recognition questions.

---

## 🎨 6. Design System & Typography

The application follows the **"Modern Kyoto Craft"** visual identity:

- **Color Palette** (defined in [`tailwind.config.js`](file:///tailwind.config.js)):
  - `washi-50` (`#faf8f5`): Textured, warm Washi paper canvas for light mode.
  - `sumi-900` (`#1c1917`): Deep Japanese Sumi ink for high-legibility text.
  - `sakura-500` (`#f43f72`): Subtle cherry blossom pink for active highlights and primary accents.
  - `zen-950` (`#080d1a`): Soothing dark mode canvas.
- **Typography Stack**:
  - Primary Japanese font: Google Fonts **Zen Maru Gothic** (soft, rounded, highly legible kana).
  - Fallback stack: `"Hiragino Sans"`, `"Yu Gothic"`, `"Meiryo"`, `"Noto Sans JP"`.
- **Watermark & Accents**:
  - Prompts feature an Enso (⭕) brush calligraphy SVG watermark in the background.
  - Modals use `backdrop-blur-sm` and smooth fade-in animations (`animate-fade-in`).
