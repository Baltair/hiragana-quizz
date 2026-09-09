import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizConfig } from '../types';
import { Volume2, CheckCircle2, XCircle, Flame, Square } from 'lucide-react';
import { playKanaSound } from '../data/hiragana';

interface QuizCardProps {
  question: Question;
  config: QuizConfig;
  totalAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  onAnswer: (selectedChoice: string, isCorrect: boolean) => void;
  onStopSession: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  config,
  totalAnswered,
  totalCorrect,
  currentStreak,
  onAnswer,
  onStopSession,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Determine prompt helper labels
  const isCharPrompt = question.promptType === 'char_to_romaji';
  const promptInstruction = isCharPrompt
    ? 'What is the pronunciation of this character?'
    : 'Select the matching Hiragana character for this sound';

  // Reset selection and answering state on new question
  useEffect(() => {
    setSelectedChoice(null);
    setIsAnswering(false);
  }, [question.id]);

  const handleSelectChoice = useCallback(
    (choice: string) => {
      if (isAnswering) return; // Prevent multiple clicks during transition

      setSelectedChoice(choice);
      setIsAnswering(true);

      const isCorrect = choice === question.correctAnswer;

      // Quick visual animation timeout (650ms) then pass to next question
      setTimeout(() => {
        onAnswer(choice, isCorrect);
      }, 650);
    },
    [isAnswering, question, onAnswer]
  );

  // Keyboard shortcut listener: Keys 1..9, 0
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswering) return;

      const num = parseInt(e.key, 10);
      let index = -1;
      if (!isNaN(num)) {
        if (num >= 1 && num <= 9) {
          index = num - 1;
        } else if (num === 0) {
          index = 9; // '0' key for 10th choice
        }
      }

      if (index >= 0 && index < question.choices.length) {
        e.preventDefault();
        handleSelectChoice(question.choices[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswering, question.choices, handleSelectChoice]);

  // Responsive grid class based on choice count
  const getGridColsClass = (count: number) => {
    switch (count) {
      case 2:
        return 'grid-cols-2 max-w-md mx-auto';
      case 3:
        return 'grid-cols-3 max-w-lg mx-auto';
      case 4:
        return 'grid-cols-2 sm:grid-cols-4 max-w-xl mx-auto';
      case 5:
        return 'grid-cols-2 sm:grid-cols-5 max-w-2xl mx-auto';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 max-w-2xl mx-auto';
      case 7:
      case 8:
        return 'grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto';
      case 9:
      case 10:
      default:
        return 'grid-cols-2 sm:grid-cols-5 max-w-3xl mx-auto';
    }
  };

  const accuracyPercent =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Status Bar */}
      <div className="bg-white dark:bg-zen-800 rounded-2xl p-4 shadow-md border border-zen-200 dark:border-zen-700 flex items-center justify-between mb-6">
        {/* Round info */}
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zen-100 dark:bg-zen-700 text-zen-700 dark:text-zen-300">
            {config.rounds === 0
              ? `Round ${question.roundNumber} (∞)`
              : `Round ${question.roundNumber} / ${config.rounds}`}
          </span>
          {currentStreak > 1 && (
            <span className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-pulse">
              <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500" />
              {currentStreak} Streak!
            </span>
          )}
        </div>

        {/* Live Score & Stop Action */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-zen-500 block">Score</span>
            <span className="text-sm font-bold text-zen-800 dark:text-zen-200">
              {totalCorrect} / {totalAnswered}{' '}
              <span className="text-xs font-normal text-zen-500">
                ({accuracyPercent}%)
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onStopSession}
            title="End this session and view your scores"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Training</span>
          </button>
        </div>
      </div>

      {/* Main Question / Prompt Card */}
      <div className="bg-white dark:bg-zen-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-zen-200 dark:border-zen-700 text-center relative overflow-hidden mb-8">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sakura-100/50 dark:bg-sakura-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Instruction badge */}
        <p className="text-xs sm:text-sm font-medium text-zen-500 dark:text-zen-400 mb-4">
          {promptInstruction}
        </p>

        {/* Big Prompt Display */}
        <div className="relative inline-flex items-center justify-center my-2 sm:my-4">
          <div
            className={`font-japanese font-black text-7xl sm:text-9xl text-zen-900 dark:text-white transition-all select-none ${
              isCharPrompt ? 'tracking-normal' : 'font-sans tracking-wide'
            }`}
          >
            {question.prompt}
          </div>

          {/* Sound Repeat Button - Only displayed when prompt is Romaji */}
          {!isCharPrompt && (
            <button
              type="button"
              onClick={() => playKanaSound(question.targetKana.char)}
              title="Listen to pronunciation"
              className="absolute -right-12 sm:-right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zen-100 dark:bg-zen-700 hover:bg-sakura-100 dark:hover:bg-sakura-900/40 text-zen-600 dark:text-zen-300 hover:text-sakura-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              aria-label="Listen to pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Choices Grid */}
      <div className={`grid gap-3 sm:gap-4 ${getGridColsClass(question.choices.length)}`}>
        {question.choices.map((choice, index) => {
          const isSelected = selectedChoice === choice;
          const isCorrect = choice === question.correctAnswer;
          const shortcutKey = index < 9 ? index + 1 : index === 9 ? 0 : null;

          let buttonStyle =
            'border-zen-200 dark:border-zen-700 bg-white dark:bg-zen-800 text-zen-800 dark:text-zen-100 hover:border-sakura-400 hover:bg-sakura-50/40 dark:hover:bg-sakura-950/20 shadow-sm';

          if (isAnswering) {
            if (isCorrect) {
              // Always show correct in green
              buttonStyle =
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 ring-4 ring-emerald-400/30 scale-[1.02] shadow-md';
            } else if (isSelected && !isCorrect) {
              // Chosen wrong choice in red with shake
              buttonStyle =
                'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 ring-4 ring-red-400/30 animate-shake shadow-md';
            } else {
              // Other choices fade slightly
              buttonStyle =
                'border-zen-200 dark:border-zen-800 bg-zen-50/50 dark:bg-zen-900/50 text-zen-400 opacity-50';
            }
          }

          return (
            <button
              key={`${question.id}-${choice}-${index}`}
              type="button"
              disabled={isAnswering}
              onClick={() => handleSelectChoice(choice)}
              className={`relative flex items-center justify-center p-4 sm:p-5 rounded-2xl border-2 font-bold text-xl sm:text-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sakura-400 ${
                isCharPrompt ? 'font-sans' : 'font-japanese text-2xl sm:text-3xl'
              } ${buttonStyle}`}
            >
              {/* Shortcut Key Badge */}
              {shortcutKey !== null && (
                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-mono font-medium text-zen-400 dark:text-zen-500 bg-zen-100 dark:bg-zen-700/60 px-1.5 py-0.5 rounded">
                  {shortcutKey}
                </span>
              )}

              {/* Choice Label */}
              <span>{choice}</span>

              {/* Status Icons on Selection */}
              {isAnswering && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 animate-pop" />
              )}
              {isAnswering && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 animate-pop" />
              )}
            </button>
          );
        })}
      </div>

      {/* Keyboard Helper Footer */}
      <div className="mt-6 text-center text-xs text-zen-400">
        <span className="hidden sm:inline">Tip: Use keyboard numbers </span>
        <span className="hidden sm:inline font-mono font-bold text-zen-500">
          [1 - {Math.min(9, question.choices.length)}
          {question.choices.length === 10 ? ', 0' : ''}]
        </span>
        <span className="hidden sm:inline"> to choose instantly!</span>
      </div>
    </div>
  );
};
