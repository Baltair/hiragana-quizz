import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, QuizConfig } from '../types';
import { Volume2, CheckCircle2, XCircle, Flame, Square, Target } from 'lucide-react';
import { playKanaSound } from '../data/hiragana';

interface QuizCardProps {
  question: Question;
  config: QuizConfig;
  totalAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  isDrillMode?: boolean;
  onAnswer: (selectedChoice: string, isCorrect: boolean) => void;
  onStopSession: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  config,
  totalAnswered,
  totalCorrect,
  currentStreak,
  isDrillMode = false,
  onAnswer,
  onStopSession,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Determine prompt helper labels
  const isCharPrompt = question.promptType === 'char_to_romaji';
  const promptInstruction = isCharPrompt
    ? 'What is the Romaji for this character?'
    : 'Select the matching Hiragana character for this Romaji';

  // Reset selection and answering state on new question, clearing any active delay timer
  useEffect(() => {
    setSelectedChoice(null);
    setIsAnswering(false);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [question.id]);

  const handleSelectChoice = useCallback(
    (choice: string) => {
      if (isAnswering) return; // Prevent multiple clicks during transition

      setSelectedChoice(choice);
      setIsAnswering(true);

      const isCorrect = choice === question.correctAnswer;

      // Dynamic learning rhythm: snappy 380ms on correct, deliberate 1000ms on mistake to digest feedback
      const delay = isCorrect ? 380 : 1000;

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        onAnswer(choice, isCorrect);
      }, delay);
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
        return 'grid-cols-1 sm:grid-cols-3 max-w-sm sm:max-w-xl mx-auto';
      case 4:
        return 'grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto';
      case 5:
        return 'grid-cols-2 sm:grid-cols-5 max-w-2xl mx-auto';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 max-w-2xl mx-auto';
      case 7:
        return 'grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto';
      case 8:
        return 'grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto';
      case 9:
        return 'grid-cols-2 sm:grid-cols-3 max-w-xl mx-auto';
      case 10:
      default:
        return 'grid-cols-2 sm:grid-cols-5 max-w-3xl mx-auto';
    }
  };

  const accuracyPercent =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Status Bar */}
      <div className="bg-white dark:bg-zen-800 rounded-2xl p-4 shadow-md border border-zen-200 dark:border-zen-700 flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Round info & Drill badge */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isDrillMode ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center shadow-sm">
              <Target className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
              <span>Drill ({question.roundNumber}/{config.rounds})</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-zen-100 dark:bg-zen-700 text-zen-700 dark:text-zen-300">
              {config.rounds === 0
                ? `Round ${question.roundNumber} (∞)`
                : `Round ${question.roundNumber} / ${config.rounds}`}
            </span>
          )}

          {/* Tiered Streak Milestones */}
          {currentStreak >= 10 ? (
            <span className="flex items-center text-xs font-bold text-sakura-700 dark:text-sakura-300 bg-sakura-50 dark:bg-sakura-500/15 px-2.5 py-1 rounded-full border border-sakura-300 dark:border-sakura-700 shadow-sm animate-pulse">
              <span className="mr-1">🌸</span>
              Masterful! {currentStreak}
            </span>
          ) : currentStreak >= 5 ? (
            <span className="flex items-center text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800 animate-pulse shadow-sm">
              <Flame className="w-3.5 h-3.5 mr-1 fill-orange-500 text-orange-500" />
              On Fire! {currentStreak}
            </span>
          ) : currentStreak > 1 ? (
            <span className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500" />
              {currentStreak} Streak!
            </span>
          ) : null}
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
            onClick={() => {
              if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
              }
              onStopSession();
            }}
            title="End this session and view your scores"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Training</span>
          </button>
        </div>
      </div>

      {/* Main Question / Prompt Card with Progress & Watermark */}
      <div className="bg-white dark:bg-zen-800 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-zen-200 dark:border-zen-700 text-center relative overflow-hidden mb-6 sm:mb-8">
        {/* Sleek Segmented Progress Bar */}
        {config.rounds > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-zen-100 dark:bg-zen-700/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sakura-500 via-sakura-400 to-amber-400 transition-all duration-300 ease-out"
              style={{
                width: `${Math.min(100, Math.round((question.roundNumber / config.rounds) * 100))}%`,
              }}
            />
          </div>
        )}

        {/* Instruction badge */}
        <p className="text-xs sm:text-sm font-medium text-zen-500 dark:text-zen-400 mb-2 sm:mb-3 relative z-10">
          {promptInstruction}
        </p>

        {/* Big Prompt Display */}
        <div className="flex flex-col items-center justify-center my-2 sm:my-4 relative z-10">
          <div
            className={`font-black text-6xl sm:text-8xl md:text-9xl text-zen-900 dark:text-white transition-all select-none leading-none ${
              isCharPrompt ? 'font-japanese tracking-normal' : 'font-sans tracking-wide'
            }`}
          >
            {question.prompt}
          </div>

          {/* Sound Repeat Button - Only displayed when prompt is Romaji */}
          {!isCharPrompt && (
            <button
              type="button"
              onClick={() => playKanaSound(question.targetKana.char)}
              title="Listen to audio"
              className="mt-3.5 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-zen-100 dark:bg-zen-700/90 hover:bg-sakura-100 dark:hover:bg-sakura-900/40 text-zen-700 dark:text-zen-200 hover:text-sakura-600 dark:hover:text-sakura-300 text-xs font-semibold transition-all shadow-xs active:scale-95 border border-zen-200/60 dark:border-zen-600/60 focus:outline-none focus:ring-2 focus:ring-sakura-400"
              aria-label="Listen to audio"
            >
              <Volume2 className="w-3.5 h-3.5 text-sakura-500" />
              <span>Listen Audio</span>
            </button>
          )}
        </div>
      </div>

      {/* Choices Grid */}
      <div className={`grid gap-2.5 sm:gap-3.5 ${getGridColsClass(question.choices.length)}`}>
        {question.choices.map((choice, index) => {
          const isSelected = selectedChoice === choice;
          const isCorrect = choice === question.correctAnswer;
          const shortcutKey = index < 9 ? index + 1 : index === 9 ? 0 : null;
          const isLastOdd =
            question.choices.length % 2 === 1 &&
            index === question.choices.length - 1;

          let buttonStyle =
            'border-zen-200 dark:border-zen-700 bg-white dark:bg-zen-800 text-zen-800 dark:text-zen-100 hover:border-sakura-400 hover:bg-sakura-50/40 dark:hover:bg-sakura-500/10 shadow-sm';

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
              className={`relative flex items-center justify-between px-2.5 sm:px-3.5 py-3 sm:py-3.5 rounded-2xl border-2 font-bold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sakura-400 min-h-[58px] sm:min-h-[64px] ${
                isLastOdd
                  ? 'col-span-2 sm:col-span-1 w-full max-w-[260px] mx-auto sm:max-w-none'
                  : ''
              } ${
                isCharPrompt
                  ? 'font-sans text-xl sm:text-2xl'
                  : 'font-japanese text-2xl sm:text-3xl'
              } ${buttonStyle}`}
            >
              {/* Left Slot: Shortcut Key Badge */}
              <div className="w-6 sm:w-7 flex items-center justify-center shrink-0 self-center">
                {shortcutKey !== null && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-zen-500 dark:text-zen-400 bg-zen-100 dark:bg-zen-700/80 w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center select-none shadow-xs border border-zen-200/60 dark:border-zen-600/50 leading-none">
                    {shortcutKey}
                  </span>
                )}
              </div>

              {/* Center Slot: Choice Label with Optical Baseline Centering */}
              <div className="flex-1 flex items-center justify-center text-center px-1 min-w-0 self-center">
                <span className="inline-block leading-none tracking-tight select-none truncate -translate-y-[2px] sm:-translate-y-[2.5px]">
                  {choice}
                </span>
              </div>

              {/* Right Slot: Status Icons */}
              <div className="w-6 sm:w-7 flex items-center justify-center shrink-0 self-center">
                {isAnswering && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pop shrink-0" />
                )}
                {isAnswering && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pop shrink-0" />
                )}
              </div>
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
