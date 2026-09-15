import React from 'react';
import { BookOpen, History, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenCheatsheet: () => void;
  onOpenHistory: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isQuizActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCheatsheet,
  onOpenHistory,
  theme,
  onToggleTheme,
  isQuizActive = false,
}) => {
  return (
    <header className="w-full bg-white/80 dark:bg-zen-900/80 backdrop-blur-md border-b border-zen-200 dark:border-zen-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sakura-500 to-sakura-400 text-white flex items-center justify-center font-japanese font-bold text-lg sm:text-xl shadow-md shadow-sakura-500/20 shrink-0">
            あ
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-zen-900 dark:text-white truncate">
                Hiragana<span className="text-sakura-600 dark:text-sakura-400">Quiz</span>
              </span>
              <span className="hidden min-[420px]:inline-block text-xs px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 font-japanese font-medium shrink-0">
                ひらがな
              </span>
            </div>
            <p className="text-xs text-zen-500 dark:text-zen-400 hidden sm:block truncate">
              Master Japanese Kana with interactive training
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 sm:p-2 rounded-lg text-zen-600 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sakura-400"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zen-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Cheatsheet button */}
          <button
            onClick={onOpenCheatsheet}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zen-200 dark:border-zen-700 text-zen-700 dark:text-zen-200 hover:bg-zen-50 dark:hover:bg-zen-800 text-xs sm:text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sakura-500 shrink-0" />
            <span className="hidden sm:inline">Cheatsheet</span>
          </button>

          {/* History button */}
          <button
            onClick={onOpenHistory}
            disabled={isQuizActive}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zen-200 dark:border-zen-700 text-zen-700 dark:text-zen-200 text-xs sm:text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 ${
              isQuizActive
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-zen-50 dark:hover:bg-zen-800'
            }`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zen-500 dark:text-zen-400 shrink-0" />
            <span className="hidden sm:inline">Scores History</span>
          </button>
        </div>
      </div>
    </header>
  );
};
