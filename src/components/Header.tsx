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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sakura-500 to-sakura-400 text-white flex items-center justify-center font-japanese font-bold text-xl shadow-md shadow-sakura-500/20">
            あ
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zen-900 dark:text-white">
                Hiragana<span className="text-sakura-600 dark:text-sakura-400">Quiz</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 font-japanese font-medium">
                ひらがな
              </span>
            </div>
            <p className="text-xs text-zen-500 dark:text-zen-400 hidden sm:block">
              Master Japanese Kana with interactive training
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-zen-600 dark:text-zen-300 hover:bg-zen-100 dark:hover:bg-zen-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sakura-400"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-zen-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Cheatsheet button */}
          <button
            onClick={onOpenCheatsheet}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zen-200 dark:border-zen-700 text-zen-700 dark:text-zen-200 hover:bg-zen-50 dark:hover:bg-zen-800 text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
          >
            <BookOpen className="w-4 h-4 text-sakura-500" />
            <span className="hidden sm:inline">Cheatsheet</span>
          </button>

          {/* History button */}
          <button
            onClick={onOpenHistory}
            disabled={isQuizActive}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zen-200 dark:border-zen-700 text-zen-700 dark:text-zen-200 text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 ${
              isQuizActive
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-zen-50 dark:hover:bg-zen-800'
            }`}
          >
            <History className="w-4 h-4 text-zen-500 dark:text-zen-400" />
            <span className="hidden sm:inline">Scores History</span>
          </button>
        </div>
      </div>
    </header>
  );
};
