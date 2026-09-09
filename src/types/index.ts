export type KanaCategory = 'main' | 'dakuten' | 'combination';

export interface KanaItem {
  id: string;
  char: string;
  romaji: string;
  altRomaji?: string;
  category: KanaCategory;
  group: string;
}

export interface KanaSubset {
  id: string;
  name: string;
  category: KanaCategory;
  kanaIds: string[];
  characters: string[];
}

export type QuizMode = 'learn_char' | 'learn_romaji' | 'learn_pronunciation' | 'learn_both';

export interface QuizConfig {
  choicesCount: number; // 2 to 10
  includeDakuten: boolean;
  includeCombination: boolean;
  rounds: number; // 0 for infinite, >0 for fixed rounds
  mode: QuizMode;
  selectedSubsets?: string[];
}

export type QuestionPromptType = 'char_to_romaji' | 'romaji_to_char';

export interface Question {
  id: string;
  targetKana: KanaItem;
  promptType: QuestionPromptType;
  prompt: string; // The character or romaji displayed prominently
  correctAnswer: string; // The correct choice
  choices: string[]; // List of options (length: choicesCount)
  roundNumber: number;
}

export interface AnswerRecord {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: number;
}

export interface CharacterSessionScore {
  kana: KanaItem;
  timesSeen: number;
  timesCorrect: number;
  accuracy: number;
}

export interface SessionResult {
  id: string;
  date: string;
  config: QuizConfig;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  maxStreak: number;
  durationSeconds: number;
  characterScores: Record<string, CharacterSessionScore>;
}

export interface CumulativeCharacterStat {
  kana: KanaItem;
  totalSeen: number;
  totalCorrect: number;
  accuracy: number;
  lastPracticed: string;
}
