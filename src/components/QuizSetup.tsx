import React from 'react';
import { QuizConfig, QuizMode } from '../types';
import { MAIN_KANA, DAKUTEN_KANA, COMBINATION_KANA } from '../data/hiragana';
import { Play, Sparkles, Sliders, Layers, Infinity, BookOpen, History, Type, Shuffle, Zap, Flame, Info } from 'lucide-react';

interface QuizSetupProps {
  config: QuizConfig;
  onChangeConfig: (newConfig: QuizConfig) => void;
  onStartQuiz: (overrideConfig?: QuizConfig) => void;
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

  // Predefined Quick-Start configurations
  const WARMUP_CONFIG: QuizConfig = {
    rounds: 10,
    choicesCount: 4,
    includeDakuten: false,
    includeCombination: false,
    mode: 'learn_char',
  };

  const SPRINT_CONFIG: QuizConfig = {
    rounds: 25,
    choicesCount: 6,
    includeDakuten: true,
    includeCombination: true,
    mode: 'learn_both',
  };

  const ZEN_CONFIG: QuizConfig = {
    rounds: 0,
    choicesCount: 4,
    includeDakuten: false,
    includeCombination: false,
    mode: 'learn_char',
  };

  // Preset match checks for active styling
  const isWarmup =
    config.rounds === 10 &&
    config.choicesCount === 4 &&
    !config.includeDakuten &&
    !config.includeCombination &&
    config.mode === 'learn_char';

  const isSprint =
    config.rounds === 25 &&
    config.choicesCount === 6 &&
    config.includeDakuten &&
    config.includeCombination &&
    config.mode === 'learn_both';

  const isZen =
    config.rounds === 0 &&
    config.choicesCount === 4 &&
    !config.includeDakuten &&
    !config.includeCombination &&
    config.mode === 'learn_char';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sakura-100 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 mb-3 border border-sakura-200 dark:border-sakura-500/30">
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

      {/* Standalone Quick-Start Presets Card */}
      <div className="mb-5 bg-white/90 dark:bg-zen-800/90 rounded-2xl p-4 sm:p-5 shadow-lg border border-zen-200/80 dark:border-zen-700/80 backdrop-blur-sm relative z-20">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zen-700 dark:text-zen-200">
              Quick Start Presets
            </span>
          </div>
          <span className="text-[11px] text-zen-400 dark:text-zen-500 font-medium">
            Tap to launch immediately
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Daily Warmup */}
          <button
            type="button"
            onClick={() => onStartQuiz(WARMUP_CONFIG)}
            className={`group p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all relative hover:z-30 focus-within:z-30 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              isWarmup
                ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-500/10 text-zen-900 dark:text-white shadow-sm ring-2 ring-amber-400/20'
                : 'border-zen-200 dark:border-zen-700 hover:border-amber-300 dark:hover:border-amber-600 bg-zen-50/50 dark:bg-zen-800/40 text-zen-700 dark:text-zen-300 hover:bg-white dark:hover:bg-zen-700/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-xs sm:text-sm truncate">Daily Warmup</span>
                <span
                  className="relative z-40 inline-flex items-center justify-center text-zen-400 hover:text-zen-600 dark:text-zen-500 dark:hover:text-zen-300 group/info transition-colors cursor-help p-0.5 rounded-full hover:bg-zen-200/50 dark:hover:bg-zen-700/50 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  title="10 rounds • 4 choices • Main Kana"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/info:opacity-100 transition-opacity duration-150 z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-zen-900 dark:bg-zen-100 dark:text-zen-900 rounded-md shadow-xl whitespace-nowrap drop-shadow-md">
                    10 rounds • 4 choices • Main Kana
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zen-900 dark:border-t-zen-100" />
                  </span>
                </span>
              </div>
              <Play className="w-3 h-3 text-zen-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 fill-current opacity-70 group-hover:opacity-100 transition-all shrink-0 ml-1" />
            </div>
          </button>

          {/* Mastery Sprint */}
          <button
            type="button"
            onClick={() => onStartQuiz(SPRINT_CONFIG)}
            className={`group p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all relative hover:z-30 focus-within:z-30 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              isSprint
                ? 'border-sakura-500 bg-sakura-50/80 dark:bg-sakura-500/10 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                : 'border-zen-200 dark:border-zen-700 hover:border-sakura-300 dark:hover:border-sakura-600 bg-zen-50/50 dark:bg-zen-800/40 text-zen-700 dark:text-zen-300 hover:bg-white dark:hover:bg-zen-700/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-300 flex items-center justify-center shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-xs sm:text-sm truncate">Mastery Sprint</span>
                <span
                  className="relative z-40 inline-flex items-center justify-center text-zen-400 hover:text-zen-600 dark:text-zen-500 dark:hover:text-zen-300 group/info transition-colors cursor-help p-0.5 rounded-full hover:bg-zen-200/50 dark:hover:bg-zen-700/50 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  title="25 rounds • 6 choices • All 107 Kana"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/info:opacity-100 transition-opacity duration-150 z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-zen-900 dark:bg-zen-100 dark:text-zen-900 rounded-md shadow-xl whitespace-nowrap drop-shadow-md">
                    25 rounds • 6 choices • All 107 Kana
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zen-900 dark:border-t-zen-100" />
                  </span>
                </span>
              </div>
              <Play className="w-3 h-3 text-zen-400 group-hover:text-sakura-600 dark:group-hover:text-sakura-400 fill-current opacity-70 group-hover:opacity-100 transition-all shrink-0 ml-1" />
            </div>
          </button>

          {/* Endless Zen */}
          <button
            type="button"
            onClick={() => onStartQuiz(ZEN_CONFIG)}
            className={`group p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all relative hover:z-30 focus-within:z-30 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              isZen
                ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10 text-zen-900 dark:text-white shadow-sm ring-2 ring-emerald-400/20'
                : 'border-zen-200 dark:border-zen-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-zen-50/50 dark:bg-zen-800/40 text-zen-700 dark:text-zen-300 hover:bg-white dark:hover:bg-zen-700/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Infinity className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-xs sm:text-sm truncate">Endless Zen</span>
                <span
                  className="relative z-40 inline-flex items-center justify-center text-zen-400 hover:text-zen-600 dark:text-zen-500 dark:hover:text-zen-300 group/info transition-colors cursor-help p-0.5 rounded-full hover:bg-zen-200/50 dark:hover:bg-zen-700/50 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  title="Infinite practice • 4 choices • Relaxed pace"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/info:opacity-100 transition-opacity duration-150 z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-zen-900 dark:bg-zen-100 dark:text-zen-900 rounded-md shadow-xl whitespace-nowrap drop-shadow-md">
                    Infinite practice • Relaxed pace
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zen-900 dark:border-t-zen-100" />
                  </span>
                </span>
              </div>
              <Play className="w-3 h-3 text-zen-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 fill-current opacity-70 group-hover:opacity-100 transition-all shrink-0 ml-1" />
            </div>
          </button>
        </div>
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
                    ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-500/10 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                    : 'border-zen-200 dark:border-zen-700 hover:border-zen-300 dark:hover:border-zen-600 bg-zen-50/40 dark:bg-zen-800/40 text-zen-700 dark:text-zen-300'
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
                    ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-500/10 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                    : 'border-zen-200 dark:border-zen-700 hover:border-zen-300 dark:hover:border-zen-600 bg-zen-50/40 dark:bg-zen-800/40 text-zen-700 dark:text-zen-300'
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
                    ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-500/10 text-zen-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                    : 'border-zen-200 dark:border-zen-700 hover:border-zen-300 dark:hover:border-zen-600 bg-zen-50/40 dark:bg-zen-800/40 text-zen-700 dark:text-zen-300'
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
                      ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300'
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
            onClick={() => onStartQuiz()}
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
