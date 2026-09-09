import React from 'react';
import { QuizConfig, QuizMode } from '../types';
import { MAIN_KANA, DAKUTEN_KANA, COMBINATION_KANA } from '../data/hiragana';
import { Play, Sparkles, Sliders, Layers, Infinity, BookOpen, History, Type, Shuffle } from 'lucide-react';

interface QuizSetupProps {
  config: QuizConfig;
  onChangeConfig: (newConfig: QuizConfig) => void;
  onStartQuiz: () => void;
  onOpenCheatsheet: () => void;
  onOpenHistory: () => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({
  config,
  onChangeConfig,
  onStartQuiz,
  onOpenCheatsheet,
  onOpenHistory,
}) => {
  // Compute total active kana count based on toggles
  let totalActive = MAIN_KANA.length;
  if (config.includeDakuten) totalActive += DAKUTEN_KANA.length;
  if (config.includeCombination) totalActive += COMBINATION_KANA.length;

  const handleModeSelect = (mode: QuizMode) => {
    onChangeConfig({ ...config, mode });
  };

  const handleChoicesChange = (val: number) => {
    const clamped = Math.min(10, Math.max(2, val));
    onChangeConfig({ ...config, choicesCount: clamped });
  };

  const handleRoundsChange = (val: number) => {
    const clamped = Math.max(0, val);
    onChangeConfig({ ...config, rounds: clamped });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sakura-100 dark:bg-sakura-950/70 text-sakura-700 dark:text-sakura-300 mb-3 border border-sakura-200 dark:border-sakura-800">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Interactive Hiragana Training
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zen-900 dark:text-white tracking-tight mb-2">
          Configure Your Session
        </h1>
        <p className="text-zen-600 dark:text-zen-400 text-sm sm:text-base max-w-lg mx-auto">
          Customize your quiz options, select character sets, and begin testing your kana recognition.
        </p>
      </div>

      <div className="bg-white dark:bg-zen-800/90 rounded-2xl shadow-xl border border-zen-200 dark:border-zen-700 overflow-hidden backdrop-blur-sm">
        <div className="p-6 sm:p-8 space-y-8">
          {/* 1. Quiz Mode Selection */}
          <div>
            <label className="block text-sm font-bold text-zen-800 dark:text-zen-200 mb-3 flex items-center justify-between">
              <span className="flex items-center">
                <Layers className="w-4 h-4 mr-2 text-sakura-500" />
                1. Quiz Mode
              </span>
              <span className="text-xs font-normal text-zen-500">
                Choose learning direction
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Learn Hiragana */}
              <button
                type="button"
                onClick={() => handleModeSelect('learn_char')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  config.mode === 'learn_char'
                    ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-950/30 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                    : 'border-zen-200 dark:border-zen-700 hover:border-zen-300 dark:hover:border-zen-600 text-zen-700 dark:text-zen-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-300 flex items-center justify-center font-japanese font-bold text-base">
                    あ
                  </div>
                  <span className="font-bold text-sm">Learn Hiragana</span>
                </div>
                <p className="text-xs text-zen-500 dark:text-zen-400">
                  Shows <span className="font-semibold text-zen-800 dark:text-zen-200">Hiragana</span>, pick the Romaji sound.
                </p>
              </button>

              {/* Learn Romaji */}
              <button
                type="button"
                onClick={() => handleModeSelect('learn_pronunciation')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  config.mode === 'learn_pronunciation'
                    ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-950/30 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                    : 'border-zen-200 dark:border-zen-700 hover:border-zen-300 dark:hover:border-zen-600 text-zen-700 dark:text-zen-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-sans font-bold text-sm">
                    ka
                  </div>
                  <span className="font-bold text-sm">Learn Romaji</span>
                </div>
                <p className="text-xs text-zen-500 dark:text-zen-400">
                  Shows <span className="font-semibold text-zen-800 dark:text-zen-200">Romaji</span>, pick the Hiragana character.
                </p>
              </button>

              {/* Learn Both */}
              <button
                type="button"
                onClick={() => handleModeSelect('learn_both')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  config.mode === 'learn_both'
                    ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-950/30 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                    : 'border-zen-200 dark:border-zen-700 hover:border-zen-300 dark:hover:border-zen-600 text-zen-700 dark:text-zen-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">Learn Both</span>
                </div>
                <p className="text-xs text-zen-500 dark:text-zen-400">
                  Dynamically alternates between <span className="font-semibold text-zen-800 dark:text-zen-200">Hiragana</span> and <span className="font-semibold text-zen-800 dark:text-zen-200">Romaji</span>.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Character Sets (Main, Dakuten, Combination) */}
          <div className="pt-2 border-t border-zen-100 dark:border-zen-700/60">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-zen-800 dark:text-zen-200 flex items-center">
                <Type className="w-4 h-4 mr-2 text-sakura-500" />
                2. Character Sets
              </label>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zen-100 dark:bg-zen-700 text-zen-700 dark:text-zen-300">
                {totalActive} characters in pool
              </span>
            </div>

            <div className="space-y-3">
              {/* Main Kana (Always included) */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zen-50 dark:bg-zen-700/40 border border-zen-200 dark:border-zen-700">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className="w-4 h-4 rounded text-sakura-600 accent-sakura-600 cursor-not-allowed"
                  />
                  <div>
                    <span className="font-bold text-sm text-zen-800 dark:text-zen-200">
                      Main Kana (Gojūon)
                    </span>
                    <p className="text-xs text-zen-500 dark:text-zen-400">
                      あ, か, さ, た, な, は, ま, や, ら, わ, ん (46 basic characters)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                  Required
                </span>
              </div>

              {/* Dakuten Kana */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-zen-200 dark:border-zen-700 hover:bg-zen-50/70 dark:hover:bg-zen-700/30 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.includeDakuten}
                    onChange={(e) =>
                      onChangeConfig({ ...config, includeDakuten: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-sakura-600 accent-sakura-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-sm text-zen-800 dark:text-zen-200">
                      Dakuten & Handakuten Kana
                    </span>
                    <p className="text-xs text-zen-500 dark:text-zen-400">
                      が, ざ, だ, ば, ぱ, etc. (+25 voiced sounds)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-zen-400">
                  {config.includeDakuten ? '+25 kana' : 'off'}
                </span>
              </label>

              {/* Combination Kana */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-zen-200 dark:border-zen-700 hover:bg-zen-50/70 dark:hover:bg-zen-700/30 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.includeCombination}
                    onChange={(e) =>
                      onChangeConfig({ ...config, includeCombination: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-sakura-600 accent-sakura-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-sm text-zen-800 dark:text-zen-200">
                      Combination Kana (Yōon)
                    </span>
                    <p className="text-xs text-zen-500 dark:text-zen-400">
                      きゃ, しゃ, ちゃ, にゃ, etc. (+36 compound characters)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-zen-400">
                  {config.includeCombination ? '+36 kana' : 'off'}
                </span>
              </label>
            </div>
          </div>

          {/* 3. Number of Choices (2 to 10) */}
          <div className="pt-2 border-t border-zen-100 dark:border-zen-700/60">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-zen-800 dark:text-zen-200 flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-sakura-500" />
                3. Number of Choices
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-sakura-600 dark:text-sakura-400 font-mono">
                  {config.choicesCount}
                </span>
                <span className="text-xs text-zen-500">choices per question</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={config.choicesCount}
              onChange={(e) => handleChoicesChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-zen-200 dark:bg-zen-700 rounded-lg appearance-none cursor-pointer accent-sakura-500 mb-3"
            />

            {/* Quick Choice Buttons */}
            <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleChoicesChange(num)}
                  className={`py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    config.choicesCount === num
                      ? 'bg-sakura-500 text-white shadow-sm'
                      : 'bg-zen-100 dark:bg-zen-700/60 text-zen-700 dark:text-zen-300 hover:bg-zen-200 dark:hover:bg-zen-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Number of Rounds */}
          <div className="pt-2 border-t border-zen-100 dark:border-zen-700/60">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-zen-800 dark:text-zen-200 flex items-center">
                <Infinity className="w-4 h-4 mr-2 text-sakura-500" />
                4. Number of Rounds
              </label>
              <span className="text-xs text-zen-500">
                {config.rounds === 0 ? 'Infinite continuous mode' : `${config.rounds} rounds total`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[
                { label: '10 Rounds', value: 10 },
                { label: '20 Rounds', value: 20 },
                { label: '50 Rounds', value: 50 },
                { label: 'Infinite (0)', value: 0 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleRoundsChange(preset.value)}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                    config.rounds === preset.value
                      ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-950/40 text-sakura-700 dark:text-sakura-300'
                      : 'border-zen-200 dark:border-zen-700 text-zen-600 dark:text-zen-300 hover:bg-zen-50 dark:hover:bg-zen-700/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Rounds Input */}
            <div className="flex items-center space-x-3">
              <span className="text-xs text-zen-500 whitespace-nowrap">Or custom rounds:</span>
              <input
                type="number"
                min="0"
                max="500"
                value={config.rounds}
                onChange={(e) => handleRoundsChange(parseInt(e.target.value || '0', 10))}
                className="w-28 px-3 py-1.5 text-sm font-semibold text-zen-900 dark:text-white bg-zen-50 dark:bg-zen-700 border border-zen-200 dark:border-zen-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-400"
                placeholder="0 = Infinite"
              />
              <span className="text-xs text-zen-400">
                (Enter 0 for endless practice)
              </span>
            </div>
          </div>
        </div>

        {/* Start Button & Footer Quick Actions */}
        <div className="p-6 sm:p-8 bg-zen-50/80 dark:bg-zen-800 border-t border-zen-200 dark:border-zen-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenCheatsheet}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 text-zen-700 dark:text-zen-200 hover:bg-white dark:hover:bg-zen-700 text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4 text-sakura-500" />
              <span>Cheatsheet</span>
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 text-zen-700 dark:text-zen-200 hover:bg-white dark:hover:bg-zen-700 text-sm font-medium transition-colors"
            >
              <History className="w-4 h-4 text-zen-500" />
              <span>Past Scores</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onStartQuiz}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-sakura-600 to-sakura-500 hover:from-sakura-700 hover:to-sakura-600 text-white font-bold text-base shadow-lg shadow-sakura-500/25 hover:shadow-sakura-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-sakura-300"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Training</span>
          </button>
        </div>
      </div>
    </div>
  );
};
