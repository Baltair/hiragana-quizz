import { KanaItem, QuizConfig, Question, QuestionPromptType } from '../types';

export const MAIN_KANA: KanaItem[] = [
  // Vowels
  { id: 'a', char: 'あ', romaji: 'a', category: 'main', group: 'vowel' },
  { id: 'i', char: 'い', romaji: 'i', category: 'main', group: 'vowel' },
  { id: 'u', char: 'う', romaji: 'u', category: 'main', group: 'vowel' },
  { id: 'e', char: 'え', romaji: 'e', category: 'main', group: 'vowel' },
  { id: 'o', char: 'お', romaji: 'o', category: 'main', group: 'vowel' },

  // K-line
  { id: 'ka', char: 'か', romaji: 'ka', category: 'main', group: 'k-line' },
  { id: 'ki', char: 'き', romaji: 'ki', category: 'main', group: 'k-line' },
  { id: 'ku', char: 'く', romaji: 'ku', category: 'main', group: 'k-line' },
  { id: 'ke', char: 'け', romaji: 'ke', category: 'main', group: 'k-line' },
  { id: 'ko', char: 'こ', romaji: 'ko', category: 'main', group: 'k-line' },

  // S-line
  { id: 'sa', char: 'さ', romaji: 'sa', category: 'main', group: 's-line' },
  { id: 'shi', char: 'し', romaji: 'shi', category: 'main', group: 's-line' },
  { id: 'su', char: 'す', romaji: 'su', category: 'main', group: 's-line' },
  { id: 'se', char: 'せ', romaji: 'se', category: 'main', group: 's-line' },
  { id: 'so', char: 'そ', romaji: 'so', category: 'main', group: 's-line' },

  // T-line
  { id: 'ta', char: 'た', romaji: 'ta', category: 'main', group: 't-line' },
  { id: 'chi', char: 'ち', romaji: 'chi', category: 'main', group: 't-line' },
  { id: 'tsu', char: 'つ', romaji: 'tsu', category: 'main', group: 't-line' },
  { id: 'te', char: 'て', romaji: 'te', category: 'main', group: 't-line' },
  { id: 'to', char: 'と', romaji: 'to', category: 'main', group: 't-line' },

  // N-line
  { id: 'na', char: 'な', romaji: 'na', category: 'main', group: 'n-line' },
  { id: 'ni', char: 'に', romaji: 'ni', category: 'main', group: 'n-line' },
  { id: 'nu', char: 'ぬ', romaji: 'nu', category: 'main', group: 'n-line' },
  { id: 'ne', char: 'ね', romaji: 'ne', category: 'main', group: 'n-line' },
  { id: 'no', char: 'の', romaji: 'no', category: 'main', group: 'n-line' },

  // H-line
  { id: 'ha', char: 'は', romaji: 'ha', category: 'main', group: 'h-line' },
  { id: 'hi', char: 'ひ', romaji: 'hi', category: 'main', group: 'h-line' },
  { id: 'fu', char: 'ふ', romaji: 'fu', category: 'main', group: 'h-line' },
  { id: 'he', char: 'へ', romaji: 'he', category: 'main', group: 'h-line' },
  { id: 'ho', char: 'ほ', romaji: 'ho', category: 'main', group: 'h-line' },

  // M-line
  { id: 'ma', char: 'ま', romaji: 'ma', category: 'main', group: 'm-line' },
  { id: 'mi', char: 'み', romaji: 'mi', category: 'main', group: 'm-line' },
  { id: 'mu', char: 'む', romaji: 'mu', category: 'main', group: 'm-line' },
  { id: 'me', char: 'め', romaji: 'me', category: 'main', group: 'm-line' },
  { id: 'mo', char: 'も', romaji: 'mo', category: 'main', group: 'm-line' },

  // Y-line
  { id: 'ya', char: 'や', romaji: 'ya', category: 'main', group: 'y-line' },
  { id: 'yu', char: 'ゆ', romaji: 'yu', category: 'main', group: 'y-line' },
  { id: 'yo', char: 'よ', romaji: 'yo', category: 'main', group: 'y-line' },

  // R-line
  { id: 'ra', char: 'ら', romaji: 'ra', category: 'main', group: 'r-line' },
  { id: 'ri', char: 'り', romaji: 'ri', category: 'main', group: 'r-line' },
  { id: 'ru', char: 'る', romaji: 'ru', category: 'main', group: 'r-line' },
  { id: 're', char: 'れ', romaji: 're', category: 'main', group: 'r-line' },
  { id: 'ro', char: 'ろ', romaji: 'ro', category: 'main', group: 'r-line' },

  // W-line & N
  { id: 'wa', char: 'わ', romaji: 'wa', category: 'main', group: 'w-line' },
  { id: 'wo', char: 'を', romaji: 'wo', category: 'main', group: 'w-line' },
  { id: 'n', char: 'ん', romaji: 'n', category: 'main', group: 'special' },
];

export const DAKUTEN_KANA: KanaItem[] = [
  // G-line (from K)
  { id: 'ga', char: 'が', romaji: 'ga', category: 'dakuten', group: 'g-line' },
  { id: 'gi', char: 'ぎ', romaji: 'gi', category: 'dakuten', group: 'g-line' },
  { id: 'gu', char: 'ぐ', romaji: 'gu', category: 'dakuten', group: 'g-line' },
  { id: 'ge', char: 'げ', romaji: 'ge', category: 'dakuten', group: 'g-line' },
  { id: 'go', char: 'ご', romaji: 'go', category: 'dakuten', group: 'g-line' },

  // Z-line (from S)
  { id: 'za', char: 'ざ', romaji: 'za', category: 'dakuten', group: 'z-line' },
  { id: 'ji', char: 'じ', romaji: 'ji', category: 'dakuten', group: 'z-line' },
  { id: 'zu', char: 'ず', romaji: 'zu', category: 'dakuten', group: 'z-line' },
  { id: 'ze', char: 'ぜ', romaji: 'ze', category: 'dakuten', group: 'z-line' },
  { id: 'zo', char: 'ぞ', romaji: 'zo', category: 'dakuten', group: 'z-line' },

  // D-line (from T)
  { id: 'da', char: 'だ', romaji: 'da', category: 'dakuten', group: 'd-line' },
  { id: 'dji', char: 'ぢ', romaji: 'di', altRomaji: 'ji', category: 'dakuten', group: 'd-line' },
  { id: 'dzu', char: 'づ', romaji: 'du', altRomaji: 'zu', category: 'dakuten', group: 'd-line' },
  { id: 'de', char: 'で', romaji: 'de', category: 'dakuten', group: 'd-line' },
  { id: 'do', char: 'ど', romaji: 'do', category: 'dakuten', group: 'd-line' },

  // B-line (from H)
  { id: 'ba', char: 'ば', romaji: 'ba', category: 'dakuten', group: 'b-line' },
  { id: 'bi', char: 'び', romaji: 'bi', category: 'dakuten', group: 'b-line' },
  { id: 'bu', char: 'ぶ', romaji: 'bu', category: 'dakuten', group: 'b-line' },
  { id: 'be', char: 'べ', romaji: 'be', category: 'dakuten', group: 'b-line' },
  { id: 'bo', char: 'ぼ', romaji: 'bo', category: 'dakuten', group: 'b-line' },

  // P-line (Handakuten from H)
  { id: 'pa', char: 'ぱ', romaji: 'pa', category: 'dakuten', group: 'p-line' },
  { id: 'pi', char: 'ぴ', romaji: 'pi', category: 'dakuten', group: 'p-line' },
  { id: 'pu', char: 'ぷ', romaji: 'pu', category: 'dakuten', group: 'p-line' },
  { id: 'pe', char: 'ぺ', romaji: 'pe', category: 'dakuten', group: 'p-line' },
  { id: 'po', char: 'ぽ', romaji: 'po', category: 'dakuten', group: 'p-line' },
];

export const COMBINATION_KANA: KanaItem[] = [
  // K-combinations
  { id: 'kya', char: 'きゃ', romaji: 'kya', category: 'combination', group: 'ky-group' },
  { id: 'kyu', char: 'きゅ', romaji: 'kyu', category: 'combination', group: 'ky-group' },
  { id: 'kyo', char: 'きょ', romaji: 'kyo', category: 'combination', group: 'ky-group' },

  // S-combinations
  { id: 'sha', char: 'しゃ', romaji: 'sha', category: 'combination', group: 'sh-group' },
  { id: 'shu', char: 'しゅ', romaji: 'shu', category: 'combination', group: 'sh-group' },
  { id: 'sho', char: 'しょ', romaji: 'sho', category: 'combination', group: 'sh-group' },

  // T-combinations
  { id: 'cha', char: 'ちゃ', romaji: 'cha', category: 'combination', group: 'ch-group' },
  { id: 'chu', char: 'ちゅ', romaji: 'chu', category: 'combination', group: 'ch-group' },
  { id: 'cho', char: 'ちょ', romaji: 'cho', category: 'combination', group: 'ch-group' },

  // N-combinations
  { id: 'nya', char: 'にゃ', romaji: 'nya', category: 'combination', group: 'ny-group' },
  { id: 'nyu', char: 'にゅ', romaji: 'nyu', category: 'combination', group: 'ny-group' },
  { id: 'nyo', char: 'にょ', romaji: 'nyo', category: 'combination', group: 'ny-group' },

  // H-combinations
  { id: 'hya', char: 'ひゃ', romaji: 'hya', category: 'combination', group: 'hy-group' },
  { id: 'hyu', char: 'ひゅ', romaji: 'hyu', category: 'combination', group: 'hy-group' },
  { id: 'hyo', char: 'ひょ', romaji: 'hyo', category: 'combination', group: 'hy-group' },

  // M-combinations
  { id: 'mya', char: 'みゃ', romaji: 'mya', category: 'combination', group: 'my-group' },
  { id: 'myu', char: 'みゅ', romaji: 'myu', category: 'combination', group: 'my-group' },
  { id: 'myo', char: 'みょ', romaji: 'myo', category: 'combination', group: 'my-group' },

  // R-combinations
  { id: 'rya', char: 'りゃ', romaji: 'rya', category: 'combination', group: 'ry-group' },
  { id: 'ryu', char: 'りゅ', romaji: 'ryu', category: 'combination', group: 'ry-group' },
  { id: 'ryo', char: 'りょ', romaji: 'ryo', category: 'combination', group: 'ry-group' },

  // G-combinations
  { id: 'gya', char: 'ぎゃ', romaji: 'gya', category: 'combination', group: 'gy-group' },
  { id: 'gyu', char: 'ぎゅ', romaji: 'gyu', category: 'combination', group: 'gy-group' },
  { id: 'gyo', char: 'ぎょ', romaji: 'gyo', category: 'combination', group: 'gy-group' },

  // J-combinations
  { id: 'ja', char: 'じゃ', romaji: 'ja', category: 'combination', group: 'j-group' },
  { id: 'ju', char: 'じゅ', romaji: 'ju', category: 'combination', group: 'j-group' },
  { id: 'jo', char: 'じょ', romaji: 'jo', category: 'combination', group: 'j-group' },

  // D-combinations (from ぢ)
  { id: 'dja', char: 'ぢゃ', romaji: 'dja', altRomaji: 'ja', category: 'combination', group: 'dj-group' },
  { id: 'dju', char: 'ぢゅ', romaji: 'dju', altRomaji: 'ju', category: 'combination', group: 'dj-group' },
  { id: 'djo', char: 'ぢょ', romaji: 'djo', altRomaji: 'jo', category: 'combination', group: 'dj-group' },

  // B-combinations
  { id: 'bya', char: 'びゃ', romaji: 'bya', category: 'combination', group: 'by-group' },
  { id: 'byu', char: 'びゅ', romaji: 'byu', category: 'combination', group: 'by-group' },
  { id: 'byo', char: 'びょ', romaji: 'byo', category: 'combination', group: 'by-group' },

  // P-combinations
  { id: 'pya', char: 'ぴゃ', romaji: 'pya', category: 'combination', group: 'py-group' },
  { id: 'pyu', char: 'ぴゅ', romaji: 'pyu', category: 'combination', group: 'py-group' },
  { id: 'pyo', char: 'ぴょ', romaji: 'pyo', category: 'combination', group: 'py-group' },
];

export const ALL_KANA: KanaItem[] = [
  ...MAIN_KANA,
  ...DAKUTEN_KANA,
  ...COMBINATION_KANA,
];

export const KANA_BY_ID = new Map<string, KanaItem>(
  ALL_KANA.map(k => [k.id, k])
);

/**
 * Returns active Kana based on configuration options
 */
export function getActiveKanaPool(config: QuizConfig): KanaItem[] {
  const pool: KanaItem[] = [...MAIN_KANA];
  if (config.includeDakuten) {
    pool.push(...DAKUTEN_KANA);
  }
  if (config.includeCombination) {
    pool.push(...COMBINATION_KANA);
  }
  return pool;
}

/**
 * Fisher-Yates array shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a unique question given the quiz configuration, pool, and round number.
 */
export function generateQuestion(
  config: QuizConfig,
  pool: KanaItem[],
  roundNumber: number,
  previousKanaId?: string,
  distractorPool?: KanaItem[]
): Question {
  // Try to pick a target kana different from the immediate previous round if pool allows
  let candidatePool = pool;
  if (previousKanaId && pool.length > 1) {
    const filtered = pool.filter(k => k.id !== previousKanaId);
    if (filtered.length > 0) {
      candidatePool = filtered;
    }
  }

  const targetIndex = Math.floor(Math.random() * candidatePool.length);
  const targetKana = candidatePool[targetIndex];

  // Determine prompt direction
  let promptType: QuestionPromptType;
  if (config.mode === 'learn_char') {
    promptType = 'char_to_romaji';
  } else if (config.mode === 'learn_pronunciation') {
    promptType = 'romaji_to_char';
  } else {
    promptType = Math.random() < 0.5 ? 'char_to_romaji' : 'romaji_to_char';
  }

  const isCharToRomaji = promptType === 'char_to_romaji';
  const prompt = isCharToRomaji ? targetKana.char : targetKana.romaji;
  const correctAnswer = isCharToRomaji ? targetKana.romaji : targetKana.char;

  // Distractor sources: allow broader distractor pool when testing a small subset of kana
  const fullDistractorPool =
    distractorPool && distractorPool.length >= config.choicesCount
      ? distractorPool
      : pool.length >= config.choicesCount
      ? pool
      : ALL_KANA;

  const choicesCount = Math.min(Math.max(2, config.choicesCount), fullDistractorPool.length);

  // Generate unique distractors
  const potentialDistractors = fullDistractorPool.filter(k => k.id !== targetKana.id);
  const shuffledDistractors = shuffleArray(potentialDistractors);

  const selectedChoices = new Set<string>();
  selectedChoices.add(correctAnswer);

  for (const item of shuffledDistractors) {
    if (selectedChoices.size >= choicesCount) break;
    const choiceValue = isCharToRomaji ? item.romaji : item.char;
    if (!selectedChoices.has(choiceValue)) {
      selectedChoices.add(choiceValue);
    }
  }

  // If after the pool we still need unique choices (e.g. rare duplicate romaji string), fallback to all kana
  if (selectedChoices.size < choicesCount) {
    const fallbackShuffled = shuffleArray(ALL_KANA);
    for (const item of fallbackShuffled) {
      if (selectedChoices.size >= choicesCount) break;
      const choiceValue = isCharToRomaji ? item.romaji : item.char;
      if (!selectedChoices.has(choiceValue)) {
        selectedChoices.add(choiceValue);
      }
    }
  }

  const choices = shuffleArray(Array.from(selectedChoices));

  return {
    id: `q-${roundNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    targetKana,
    promptType,
    prompt,
    correctAnswer,
    choices,
    roundNumber,
  };
}

// Keep active utterance in module scope to prevent garbage collection mid-speech (Chromium issue)
let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedJaVoice: SpeechSynthesisVoice | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      const voices = window.speechSynthesis.getVoices();
      cachedJaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang === 'ja-JP') || null;
    } catch {
      // Ignore voice lookup errors
    }
  };
  loadVoices();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Audio synthesis helper using Web Speech API with Safari/iOS resilience
 */
export function playKanaSound(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Sanitize string to avoid synthesizer reading parenthesis or punctuation
    const cleanText = text.replace(/\s*\(.*?\)/g, '').trim();
    if (!cleanText) return;

    // Safari fix: Resume if speech context is in paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Clean up previous active utterance listeners
    if (activeUtterance) {
      activeUtterance.onend = null;
      activeUtterance.onerror = null;
      activeUtterance = null;
    }

    // Cancel any current utterance
    window.speechSynthesis.cancel();

    // Small delay after cancel prevents WebKit queue purge bug on iOS/Safari
    window.setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;

        // Try cached voice or lookup
        if (!cachedJaVoice) {
          const voices = window.speechSynthesis.getVoices();
          cachedJaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang === 'ja-JP') || null;
        }
        if (cachedJaVoice) {
          utterance.voice = cachedJaVoice;
        }

        // Retain reference to prevent premature garbage collection
        activeUtterance = utterance;
        utterance.onend = () => {
          activeUtterance = null;
        };
        utterance.onerror = () => {
          activeUtterance = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback gracefully
      }
    }, 20);
  } catch {
    // Ignore audio speech failures gracefully in unsupported browsers
  }
}
