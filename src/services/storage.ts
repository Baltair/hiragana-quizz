import { SessionResult, CumulativeCharacterStat, QuizConfig } from '../types';
import { ALL_KANA } from '../data/hiragana';

const SESSIONS_STORAGE_KEY = 'hiragana_quiz_sessions_v1';
const CUMULATIVE_STORAGE_KEY = 'hiragana_quiz_cumulative_v1';
const CONFIG_STORAGE_KEY = 'hiragana_quiz_last_config_v1';
const THEME_STORAGE_KEY = 'hiragana_quiz_theme_v1';

export type ThemeMode = 'light' | 'dark';

export function getSavedTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore localStorage write error
  }
}

export function getSavedConfig(): Partial<QuizConfig> | null {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLastConfig(config: QuizConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore localStorage write error
  }
}


export function getHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCumulativeStats(): Record<string, CumulativeCharacterStat> {
  try {
    const raw = localStorage.getItem(CUMULATIVE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback to empty
  }

  // Initialize with all known kana with zero stats
  const initial: Record<string, CumulativeCharacterStat> = {};
  for (const kana of ALL_KANA) {
    initial[kana.id] = {
      kana,
      totalSeen: 0,
      totalCorrect: 0,
      accuracy: 0,
      lastPracticed: '',
    };
  }
  return initial;
}

export function saveSession(result: SessionResult): void {
  try {
    // 1. Save session list (keep up to 60 most recent sessions)
    const history = getHistory();
    const updatedHistory = [result, ...history].slice(0, 60);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedHistory));

    // 2. Update cumulative character stats
    const cumulative = getCumulativeStats();
    for (const [kanaId, sessionScore] of Object.entries(result.characterScores)) {
      const existing = cumulative[kanaId] || {
        kana: sessionScore.kana,
        totalSeen: 0,
        totalCorrect: 0,
        accuracy: 0,
        lastPracticed: '',
      };

      const newSeen = existing.totalSeen + sessionScore.timesSeen;
      const newCorrect = existing.totalCorrect + sessionScore.timesCorrect;
      const newAccuracy = newSeen > 0 ? Math.round((newCorrect / newSeen) * 100) : 0;

      cumulative[kanaId] = {
        kana: sessionScore.kana,
        totalSeen: newSeen,
        totalCorrect: newCorrect,
        accuracy: newAccuracy,
        lastPracticed: result.date,
      };
    }

    localStorage.setItem(CUMULATIVE_STORAGE_KEY, JSON.stringify(cumulative));
  } catch {
    // Ignore storage errors
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
    localStorage.removeItem(CUMULATIVE_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
