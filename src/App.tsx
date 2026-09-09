import React, { useState, useEffect, useCallback } from 'react';
import {
  QuizConfig,
  Question,
  SessionResult,
  CharacterSessionScore,
  CumulativeCharacterStat,
} from './types';
import {
  getActiveKanaPool,
  generateQuestion,
} from './data/hiragana';
import {
  getSavedConfig,
  saveLastConfig,
  getHistory,
  getCumulativeStats,
  saveSession,
  getSavedTheme,
  saveTheme,
  ThemeMode,
} from './services/storage';
import { Header } from './components/Header';
import { QuizSetup } from './components/QuizSetup';
import { QuizCard } from './components/QuizCard';
import { QuizResults } from './components/QuizResults';
import { CheatsheetModal } from './components/CheatsheetModal';
import { HistoryModal } from './components/HistoryModal';

const DEFAULT_CONFIG: QuizConfig = {
  choicesCount: 4,
  includeDakuten: false,
  includeCombination: false,
  rounds: 10,
  mode: 'learn_char',
};

export const App: React.FC = () => {
  // Navigation & Screen state
  const [screen, setScreen] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Theme state (Light / Dark mode)
  const [theme, setTheme] = useState<ThemeMode>(getSavedTheme);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Quiz Configuration
  const [config, setConfig] = useState<QuizConfig>(() => {
    const saved = getSavedConfig();
    return saved ? { ...DEFAULT_CONFIG, ...saved } : DEFAULT_CONFIG;
  });

  const handleConfigChange = (newConfig: QuizConfig) => {
    setConfig(newConfig);
    saveLastConfig(newConfig);
  };

  // Storage / History state
  const [historyList, setHistoryList] = useState<SessionResult[]>([]);
  const [cumulativeStats, setCumulativeStats] = useState<
    Record<string, CumulativeCharacterStat>
  >({});

  // Reload history and cumulative stats on mount
  const refreshStorageData = useCallback(() => {
    setHistoryList(getHistory());
    setCumulativeStats(getCumulativeStats());
  }, []);

  useEffect(() => {
    refreshStorageData();
  }, [refreshStorageData]);

  // Active Session State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [characterScores, setCharacterScores] = useState<
    Record<string, CharacterSessionScore>
  >({});
  const [latestResult, setLatestResult] = useState<SessionResult | null>(null);

  // Start a new Quiz Session
  const handleStartQuiz = useCallback(() => {
    const pool = getActiveKanaPool(config);
    if (pool.length === 0) return;

    saveLastConfig(config);

    // Initialize session state
    setCurrentRound(1);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setStartTime(Date.now());
    setCharacterScores({});

    // Generate first question
    const q1 = generateQuestion(config, pool, 1);
    setCurrentQuestion(q1);
    setScreen('quiz');
  }, [config]);

  // Finish session and record results
  const finishSession = useCallback(
    (
      finalAnswered: number,
      finalCorrect: number,
      finalMaxStreak: number,
      finalScores: Record<string, CharacterSessionScore>
    ) => {
      const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const accuracy =
        finalAnswered > 0 ? Math.round((finalCorrect / finalAnswered) * 100) : 0;

      const result: SessionResult = {
        id: `sess-${Date.now()}`,
        date: new Date().toISOString(),
        config,
        totalAnswered: finalAnswered,
        totalCorrect: finalCorrect,
        accuracy,
        maxStreak: finalMaxStreak,
        durationSeconds: elapsedSeconds,
        characterScores: finalScores,
      };

      // Persist in localStorage
      saveSession(result);
      refreshStorageData();

      setLatestResult(result);
      setScreen('results');
    },
    [config, startTime, refreshStorageData]
  );

  // Handle choice submission
  const handleAnswer = useCallback(
    (_selectedChoice: string, isCorrect: boolean) => {
      if (!currentQuestion) return;

      const newAnswered = totalAnswered + 1;
      const newCorrect = totalCorrect + (isCorrect ? 1 : 0);
      const newStreak = isCorrect ? currentStreak + 1 : 0;
      const newMaxStreak = Math.max(maxStreak, newStreak);

      setTotalAnswered(newAnswered);
      setTotalCorrect(newCorrect);
      setCurrentStreak(newStreak);
      setMaxStreak(newMaxStreak);

      // Update per-character score breakdown
      const kana = currentQuestion.targetKana;
      const existing = characterScores[kana.id] || {
        kana,
        timesSeen: 0,
        timesCorrect: 0,
        accuracy: 0,
      };

      const timesSeen = existing.timesSeen + 1;
      const timesCorrect = existing.timesCorrect + (isCorrect ? 1 : 0);
      const updatedScores = {
        ...characterScores,
        [kana.id]: {
          kana,
          timesSeen,
          timesCorrect,
          accuracy: Math.round((timesCorrect / timesSeen) * 100),
        },
      };
      setCharacterScores(updatedScores);

      // Check if session reached round limit (if not infinite)
      const reachedEnd = config.rounds > 0 && currentRound >= config.rounds;

      if (reachedEnd) {
        finishSession(newAnswered, newCorrect, newMaxStreak, updatedScores);
      } else {
        // Next round
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        const pool = getActiveKanaPool(config);
        const nextQ = generateQuestion(config, pool, nextRound, kana.id);
        setCurrentQuestion(nextQ);
      }
    },
    [
      currentQuestion,
      totalAnswered,
      totalCorrect,
      currentStreak,
      maxStreak,
      characterScores,
      config,
      currentRound,
      finishSession,
    ]
  );

  // Handle manual session stop
  const handleStopSession = useCallback(() => {
    if (totalAnswered > 0) {
      finishSession(totalAnswered, totalCorrect, maxStreak, characterScores);
    } else {
      // If stopped before answering any question, return to setup
      setScreen('setup');
    }
  }, [totalAnswered, totalCorrect, maxStreak, characterScores, finishSession]);

  return (
    <div className={`min-h-screen flex flex-col bg-zen-50 dark:bg-zen-950 text-zen-900 dark:text-zen-100 font-sans transition-colors selection:bg-sakura-500 selection:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Global Navbar */}
      <Header
        onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isQuizActive={screen === 'quiz'}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col justify-center">
        {screen === 'setup' && (
          <QuizSetup
            config={config}
            onChangeConfig={handleConfigChange}
            onStartQuiz={handleStartQuiz}
            onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}

        {screen === 'quiz' && currentQuestion && (
          <QuizCard
            question={currentQuestion}
            config={config}
            totalAnswered={totalAnswered}
            totalCorrect={totalCorrect}
            currentStreak={currentStreak}
            onAnswer={handleAnswer}
            onStopSession={handleStopSession}
          />
        )}

        {screen === 'results' && latestResult && (
          <QuizResults
            result={latestResult}
            onRestartSame={handleStartQuiz}
            onNewConfig={() => setScreen('setup')}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-xs text-zen-400 border-t border-zen-200/60 dark:border-zen-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Hiragana Quiz • Client-Side Japanese Learning</span>
          <span className="font-japanese text-zen-500">
            日本語の勉強を続けましょう (Keep studying Japanese)
          </span>
        </div>
      </footer>

      {/* Modals */}
      <CheatsheetModal
        isOpen={isCheatsheetOpen}
        onClose={() => setIsCheatsheetOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={historyList}
        cumulativeStats={cumulativeStats}
        onHistoryCleared={refreshStorageData}
      />
    </div>
  );
};

export default App;
