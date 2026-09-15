import React, { useState } from 'react';
import { QuizConfig, QuizMode, KanaCategory } from '../types';
import {
  playKanaSound,
  SUBSETS_BY_CATEGORY,
  ALL_SUBSET_IDS,
  MAIN_SUBSET_IDS,
  DAKUTEN_SUBSET_IDS,
  COMBINATION_SUBSET_IDS,
  getActiveKanaPool,
} from '../data/hiragana';
import {
  Play,
  Sparkles,
  Sliders,
  Layers,
  Infinity,
  BookOpen,
  History,
  Type,
  Shuffle,
  Zap,
  Flame,
  Info,
  Volume2,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Keyboard,
  Brain,
  HelpCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

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
  // Collapsible category drawer state
  const [openCategories, setOpenCategories] = useState<Record<KanaCategory, boolean>>({
    main: false,
    dakuten: false,
    combination: false,
  });

  const toggleCategoryAccordion = (cat: KanaCategory) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Resolve active selected sub-sets
  const activeSubsets =
    config.selectedSubsets && Array.isArray(config.selectedSubsets)
      ? config.selectedSubsets
      : [
          ...MAIN_SUBSET_IDS,
          ...(config.includeDakuten ? DAKUTEN_SUBSET_IDS : []),
          ...(config.includeCombination ? COMBINATION_SUBSET_IDS : []),
        ];

  // Active pool calculation and minimum-character validation
  const activeKanaPool = getActiveKanaPool({
    ...config,
    selectedSubsets: activeSubsets,
  });
  const totalActive = activeKanaPool.length;
  const isPoolValid = totalActive >= 4;

  const handleToggleSubset = (subsetId: string) => {
    let nextSubsets: string[];
    if (activeSubsets.includes(subsetId)) {
      nextSubsets = activeSubsets.filter((id) => id !== subsetId);
    } else {
      nextSubsets = [...activeSubsets, subsetId];
    }
    const hasDakuten = nextSubsets.some((id) => DAKUTEN_SUBSET_IDS.includes(id));
    const hasCombination = nextSubsets.some((id) => COMBINATION_SUBSET_IDS.includes(id));

    onChangeConfig({
      ...config,
      selectedSubsets: nextSubsets,
      includeDakuten: hasDakuten,
      includeCombination: hasCombination,
    });
  };

  const handleToggleCategory = (cat: KanaCategory) => {
    const catSubsetIds = SUBSETS_BY_CATEGORY[cat].map((s) => s.id);
    const allSelected = catSubsetIds.every((id) => activeSubsets.includes(id));

    let nextSubsets: string[];
    if (allSelected) {
      nextSubsets = activeSubsets.filter((id) => !catSubsetIds.includes(id));
    } else {
      const remaining = activeSubsets.filter((id) => !catSubsetIds.includes(id));
      nextSubsets = [...remaining, ...catSubsetIds];
    }
    const hasDakuten = nextSubsets.some((id) => DAKUTEN_SUBSET_IDS.includes(id));
    const hasCombination = nextSubsets.some((id) => COMBINATION_SUBSET_IDS.includes(id));

    onChangeConfig({
      ...config,
      selectedSubsets: nextSubsets,
      includeDakuten: hasDakuten,
      includeCombination: hasCombination,
    });
  };

  const handleSelectAllCategory = (cat: KanaCategory) => {
    const catSubsetIds = SUBSETS_BY_CATEGORY[cat].map((s) => s.id);
    const remaining = activeSubsets.filter((id) => !catSubsetIds.includes(id));
    const nextSubsets = [...remaining, ...catSubsetIds];
    const hasDakuten = nextSubsets.some((id) => DAKUTEN_SUBSET_IDS.includes(id));
    const hasCombination = nextSubsets.some((id) => COMBINATION_SUBSET_IDS.includes(id));

    onChangeConfig({
      ...config,
      selectedSubsets: nextSubsets,
      includeDakuten: hasDakuten,
      includeCombination: hasCombination,
    });
  };

  const handleClearCategory = (cat: KanaCategory) => {
    const catSubsetIds = SUBSETS_BY_CATEGORY[cat].map((s) => s.id);
    const nextSubsets = activeSubsets.filter((id) => !catSubsetIds.includes(id));
    const hasDakuten = nextSubsets.some((id) => DAKUTEN_SUBSET_IDS.includes(id));
    const hasCombination = nextSubsets.some((id) => COMBINATION_SUBSET_IDS.includes(id));

    onChangeConfig({
      ...config,
      selectedSubsets: nextSubsets,
      includeDakuten: hasDakuten,
      includeCombination: hasCombination,
    });
  };

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeAudioChar, setActiveAudioChar] = useState<string | null>(null);

  const handlePlayKanaAudio = (char: string) => {
    setActiveAudioChar(char);
    playKanaSound(char);
    setTimeout(() => {
      setActiveAudioChar((prev) => (prev === char ? null : prev));
    }, 600);
  };

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

  // Predefined Quick-Start configurations with explicit sub-sets
  const WARMUP_CONFIG: QuizConfig = {
    rounds: 10,
    choicesCount: 4,
    includeDakuten: false,
    includeCombination: false,
    mode: 'learn_char',
    selectedSubsets: MAIN_SUBSET_IDS,
  };

  const SPRINT_CONFIG: QuizConfig = {
    rounds: 25,
    choicesCount: 6,
    includeDakuten: true,
    includeCombination: true,
    mode: 'learn_both',
    selectedSubsets: ALL_SUBSET_IDS,
  };

  const ZEN_CONFIG: QuizConfig = {
    rounds: 0,
    choicesCount: 4,
    includeDakuten: false,
    includeCombination: false,
    mode: 'learn_char',
    selectedSubsets: MAIN_SUBSET_IDS,
  };

  const areSubsetsMatching = (a: string[], b: string[]) =>
    a.length === b.length && a.every((id) => b.includes(id));

  // Preset match checks for active styling
  const isWarmup =
    config.rounds === 10 &&
    config.choicesCount === 4 &&
    config.mode === 'learn_char' &&
    areSubsetsMatching(activeSubsets, MAIN_SUBSET_IDS);

  const isSprint =
    config.rounds === 25 &&
    config.choicesCount === 6 &&
    config.mode === 'learn_both' &&
    areSubsetsMatching(activeSubsets, ALL_SUBSET_IDS);

  const isZen =
    config.rounds === 0 &&
    config.choicesCount === 4 &&
    config.mode === 'learn_char' &&
    areSubsetsMatching(activeSubsets, MAIN_SUBSET_IDS);

  // Helper to render collapsible category accordion card
  const renderCategoryCard = (
    categoryKey: KanaCategory,
    title: string,
    description: string
  ) => {
    const categorySubsets = SUBSETS_BY_CATEGORY[categoryKey];
    const selectedInCategory = categorySubsets.filter((s) => activeSubsets.includes(s.id));
    const selectedKanaCount = selectedInCategory.reduce((sum, s) => sum + s.kanaIds.length, 0);
    const totalCategoryKana = categorySubsets.reduce((sum, s) => sum + s.kanaIds.length, 0);
    const allSelected = selectedInCategory.length === categorySubsets.length;
    const someSelected = selectedInCategory.length > 0 && !allSelected;
    const isOpen = openCategories[categoryKey];

    return (
      <div
        key={categoryKey}
        className="rounded-2xl border border-zen-200 dark:border-zen-700/80 overflow-hidden bg-white/70 dark:bg-zen-800/70 backdrop-blur-sm transition-all shadow-xs"
      >
        {/* Category Header Row */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 select-none">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleCategory(categoryKey);
              }}
              className="w-4 h-4 rounded text-sakura-600 accent-sakura-600 cursor-pointer shrink-0"
              title={allSelected ? `Deselect all ${title}` : `Select all ${title}`}
            />
            <div
              className="cursor-pointer flex-1 min-w-0"
              onClick={() => toggleCategoryAccordion(categoryKey)}
            >
              <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
                <span className="font-bold text-sm text-zen-800 dark:text-zen-200 truncate">
                  {title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                    selectedKanaCount > 0
                      ? 'bg-sakura-50 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 border border-sakura-200/60 dark:border-sakura-500/30'
                      : 'bg-zen-100 dark:bg-zen-700 text-zen-500 dark:text-zen-400'
                  }`}
                >
                  {selectedKanaCount}/{totalCategoryKana} kana
                </span>
              </div>
              <p className="text-xs text-zen-500 dark:text-zen-400 truncate mt-0.5">
                {description}
              </p>
            </div>
          </div>

          {/* Collapsible toggle button */}
          <button
            type="button"
            onClick={() => toggleCategoryAccordion(categoryKey)}
            aria-expanded={isOpen}
            className="p-1.5 rounded-xl text-zen-400 hover:text-zen-700 dark:hover:text-zen-200 hover:bg-zen-100 dark:hover:bg-zen-700/60 transition-colors shrink-0 cursor-pointer"
            title={isOpen ? `Collapse ${title} sub-sets` : `Expand ${title} sub-sets`}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-sakura-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Collapsible Sub-sets Panel */}
        {isOpen && (
          <div className="px-3.5 sm:px-4 pb-4 pt-2 border-t border-zen-100 dark:border-zen-700/60 bg-zen-50/50 dark:bg-zen-850/40 animate-fade-in">
            {/* Sub-set Action Bar */}
            <div className="flex items-center justify-between py-1.5 mb-2 text-xs">
              <span className="font-semibold text-zen-500 dark:text-zen-400 uppercase tracking-wider text-[11px]">
                Sub-sets ({categorySubsets.length})
              </span>
              <div className="flex items-center space-x-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSelectAllCategory(categoryKey)}
                  className="text-sakura-600 dark:text-sakura-400 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-zen-300 dark:text-zen-600">•</span>
                <button
                  type="button"
                  onClick={() => handleClearCategory(categoryKey)}
                  className="text-zen-500 hover:text-zen-700 dark:text-zen-400 dark:hover:text-zen-200 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Grid of Sub-sets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categorySubsets.map((subset) => {
                const isSubsetSelected = activeSubsets.includes(subset.id);
                return (
                  <button
                    key={subset.id}
                    type="button"
                    onClick={() => handleToggleSubset(subset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSubsetSelected
                        ? 'border-sakura-400/80 bg-sakura-50/70 dark:bg-sakura-500/15 text-zen-900 dark:text-white shadow-xs'
                        : 'border-zen-200 dark:border-zen-700/70 bg-white/70 dark:bg-zen-800/40 text-zen-600 dark:text-zen-400 hover:border-zen-300 dark:hover:border-zen-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSubsetSelected}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded text-sakura-600 accent-sakura-600 cursor-pointer pointer-events-none"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {subset.name}
                        </div>
                        <div className="font-japanese text-xs text-zen-500 dark:text-zen-400 truncate tracking-wider mt-0.5">
                          {subset.characters.join(' ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zen-100 dark:bg-zen-700 text-zen-500 dark:text-zen-400 shrink-0 ml-1.5">
                      {subset.kanaIds.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-12 animate-fade-in w-full">
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
        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
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
                  Shows <span className="font-semibold text-zen-800 dark:text-zen-200">Hiragana</span>, pick the matching Romaji.
                </p>
              </button>

              {/* Learn Romaji */}
              <button
                type="button"
                onClick={() => handleModeSelect('learn_romaji')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  config.mode === 'learn_romaji' || config.mode === 'learn_pronunciation'
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
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                  isPoolValid
                    ? 'bg-zen-100 dark:bg-zen-700 text-zen-700 dark:text-zen-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {totalActive} characters in pool
              </span>
            </div>

            <div className="space-y-3">
              {renderCategoryCard(
                'main',
                'Main Kana (Gojūon)',
                'あ, か, さ, た, な, は, ま, や, ら, わ, ん (46 basic characters)'
              )}

              {renderCategoryCard(
                'dakuten',
                'Dakuten & Handakuten Kana',
                'が, ざ, だ, ば, ぱ, etc. (+25 voiced sounds)'
              )}

              {renderCategoryCard(
                'combination',
                'Combination Kana (Yōon)',
                'きゃ, しゃ, ちゃ, にゃ, etc. (+36 compound characters)'
              )}
            </div>

            {/* Validation warning if fewer than 4 characters selected */}
            {!isPoolValid && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>
                  Please select at least <strong>4 characters</strong> (currently {totalActive} selected) to start training.
                </span>
              </div>
            )}
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
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 sm:gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleChoicesChange(num)}
                  className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs text-zen-500 whitespace-nowrap">Or custom rounds:</span>
              <input
                type="number"
                min="0"
                max="500"
                value={config.rounds}
                onChange={(e) => handleRoundsChange(parseInt(e.target.value || '0', 10))}
                className="w-24 sm:w-28 px-2.5 sm:px-3 py-1.5 text-sm font-semibold text-zen-900 dark:text-white bg-zen-50 dark:bg-zen-700 border border-zen-200 dark:border-zen-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-400"
                placeholder="0 = Infinite"
              />
              <span className="text-xs text-zen-400">
                (Enter 0 for endless practice)
              </span>
            </div>
          </div>
        </div>

        {/* Start Button & Footer Quick Actions */}
        <div className="p-4 sm:p-6 md:p-8 bg-zen-50/80 dark:bg-zen-800 border-t border-zen-200 dark:border-zen-700 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenCheatsheet}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 text-zen-700 dark:text-zen-200 hover:bg-white dark:hover:bg-zen-700 text-xs sm:text-sm font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sakura-500 shrink-0" />
              <span>Cheatsheet</span>
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 text-zen-700 dark:text-zen-200 hover:bg-white dark:hover:bg-zen-700 text-xs sm:text-sm font-medium transition-colors"
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zen-500 shrink-0" />
              <span>Past Scores</span>
            </button>
          </div>

          <button
            type="button"
            disabled={!isPoolValid}
            onClick={() => onStartQuiz()}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
              isPoolValid
                ? 'bg-gradient-to-r from-sakura-600 to-sakura-500 hover:from-sakura-700 hover:to-sakura-600 text-white shadow-lg shadow-sakura-500/25 hover:shadow-sakura-500/40 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-sakura-300'
                : 'bg-zen-200 dark:bg-zen-700 text-zen-400 dark:text-zen-500 cursor-not-allowed opacity-60 shadow-none'
            }`}
            title={!isPoolValid ? 'Select at least 4 characters to start' : 'Start Training Session'}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Training</span>
          </button>
        </div>
      </div>

      {/* ─── SEO & Educational Content Architecture ─── */}
      <div className="mt-14 space-y-10 text-zen-800 dark:text-zen-200">
        {/* Section 1: Learning Methodology & Key Benefits */}
        <section className="bg-white/80 dark:bg-zen-850/80 rounded-3xl p-6 sm:p-8 border border-zen-200/80 dark:border-zen-700/80 backdrop-blur-sm shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sakura-100 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 mb-2 border border-sakura-200 dark:border-sakura-500/30">
              <Brain className="w-3.5 h-3.5 mr-1" />
              Cognitive Retention Method
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zen-900 dark:text-white tracking-tight">
              Why Learn Japanese with Hiragana Quiz?
            </h2>
            <p className="text-sm text-zen-600 dark:text-zen-400 mt-2">
              Designed for speed, active recall, and distraction-free kana mastery without accounts or ads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-zen-50/70 dark:bg-zen-800/60 border border-zen-200/60 dark:border-zen-700/60">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zen-900 dark:text-white mb-1">
                Adaptive Feedback Rhythm
              </h3>
              <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                Enjoy a rapid 380ms transition on correct answers to sustain flow state, paired with a deliberate 1000ms pause on mistakes so you absorb the correct kana.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zen-50/70 dark:bg-zen-800/60 border border-zen-200/60 dark:border-zen-700/60">
              <div className="w-9 h-9 rounded-xl bg-sakura-100 dark:bg-sakura-900/40 text-sakura-600 dark:text-sakura-300 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zen-900 dark:text-white mb-1">
                Targeted Mistake Drill Loop
              </h3>
              <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                Never waste time repeating characters you have mastered. Click "Drill Missed Kana" after any session to immediately re-test only your weak characters.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zen-50/70 dark:bg-zen-800/60 border border-zen-200/60 dark:border-zen-700/60">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3">
                <Keyboard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zen-900 dark:text-white mb-1">
                Rapid Keyboard Shortcuts
              </h3>
              <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                Drill at typing speed. Keys 1 through 9 select choices 1 to 9, and the 0 key selects choice 10, letting you practice with zero mouse latency.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-zen-50/70 dark:bg-zen-800/60 border border-zen-200/60 dark:border-zen-700/60">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zen-900 dark:text-white mb-1">
                100% Free &amp; Private
              </h3>
              <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                Zero paywalls, zero banner ads, and no sign-up required. Your session history and character mastery metrics are stored strictly in your browser.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Kana Pool Overview with Audio */}
        <section className="bg-white/80 dark:bg-zen-850/80 rounded-3xl p-6 sm:p-8 border border-zen-200/80 dark:border-zen-700/80 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sakura-100 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 mb-2 border border-sakura-200 dark:border-sakura-500/30">
                <Volume2 className="w-3.5 h-3.5 mr-1" />
                Audio Pronunciation Reference
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zen-900 dark:text-white tracking-tight">
                Explore the 107 Japanese Kana
              </h2>
              <p className="text-sm text-zen-600 dark:text-zen-400 mt-1">
                Tap any card below to listen to its native Japanese pronunciation:
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenCheatsheet}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sakura-50 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 hover:bg-sakura-100 dark:hover:bg-sakura-500/25 text-xs font-bold transition-all border border-sakura-200 dark:border-sakura-500/30 self-stretch sm:self-auto justify-center"
            >
              <span>View Full 107 Chart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {[
              { char: 'あ', romaji: 'a' },
              { char: 'い', romaji: 'i' },
              { char: 'う', romaji: 'u' },
              { char: 'え', romaji: 'e' },
              { char: 'お', romaji: 'o' },
              { char: 'か', romaji: 'ka' },
              { char: 'き', romaji: 'ki' },
              { char: 'く', romaji: 'ku' },
              { char: 'け', romaji: 'ke' },
              { char: 'こ', romaji: 'ko' },
              { char: 'さ', romaji: 'sa' },
              { char: 'し', romaji: 'shi' },
              { char: 'す', romaji: 'su' },
              { char: 'せ', romaji: 'se' },
              { char: 'そ', romaji: 'so' },
              { char: 'が', romaji: 'ga' },
              { char: 'ざ', romaji: 'za' },
              { char: 'だ', romaji: 'da' },
              { char: 'ば', romaji: 'ba' },
              { char: 'ぱ', romaji: 'pa' },
            ].map((item) => (
              <button
                key={item.char}
                type="button"
                onClick={() => handlePlayKanaAudio(item.char)}
                title={`Listen to ${item.char} (${item.romaji})`}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center group ${
                  activeAudioChar === item.char
                    ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-500/20 ring-2 ring-sakura-400 scale-105'
                    : 'border-zen-200 dark:border-zen-700 bg-zen-50/60 dark:bg-zen-800/50 hover:border-sakura-300 hover:bg-white dark:hover:bg-zen-700/60'
                }`}
              >
                <span className="font-japanese text-xl font-bold text-zen-900 dark:text-white group-hover:text-sakura-600 dark:group-hover:text-sakura-400">
                  {item.char}
                </span>
                <span className="text-[11px] font-semibold text-zen-500 dark:text-zen-400 mt-0.5">
                  {item.romaji}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs text-zen-500 dark:text-zen-400">
              Includes all 46 Gojūon, 25 voiced Dakuten/Handakuten, and 36 compound Yōon kana.
            </span>
          </div>
        </section>

        {/* Section 3: Hiragana 101 Beginner Guide */}
        <section className="bg-white/80 dark:bg-zen-850/80 rounded-3xl p-6 sm:p-8 border border-zen-200/80 dark:border-zen-700/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zen-900 dark:text-white tracking-tight mb-4 text-center">
              Hiragana 101: The Beginner's Guide
            </h2>
            <p className="text-sm text-zen-600 dark:text-zen-400 leading-relaxed mb-6">
              Hiragana (ひらがな) is the cornerstone of Japanese literacy. It is a phonetic syllabary where every symbol represents an exact mora (vowel or consonant-vowel syllable). Learning Hiragana is universally recommended as the essential first step before attempting Katakana or Kanji.
            </p>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-zen-50/80 dark:bg-zen-800/50 border border-zen-200/60 dark:border-zen-700/60">
                <h3 className="font-bold text-zen-900 dark:text-white flex items-center mb-1">
                  <CheckCircle2 className="w-4 h-4 text-sakura-500 mr-2" />
                  1. The 5 Foundation Vowels
                </h3>
                <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                  Every Japanese sound stems from five pure vowels: <strong>A</strong> (あ, like <em>father</em>), <strong>I</strong> (い, like <em>see</em>), <strong>U</strong> (う, like <em>boot</em>), <strong>E</strong> (え, like <em>bed</em>), and <strong>O</strong> (お, like <em>boat</em>). Consonants (K, S, T, N, H, M, Y, R, W) follow this exact vowel order.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-50/80 dark:bg-zen-800/50 border border-zen-200/60 dark:border-zen-700/60">
                <h3 className="font-bold text-zen-900 dark:text-white flex items-center mb-1">
                  <CheckCircle2 className="w-4 h-4 text-sakura-500 mr-2" />
                  2. Voiced Kana (Dakuten &amp; Handakuten)
                </h3>
                <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                  Adding two small ticks (<strong>"</strong>, <em>dakuten</em>) vibrates your vocal cords: K becomes <strong>G</strong> (が), S becomes <strong>Z</strong> (ざ), T becomes <strong>D</strong> (だ), and H becomes <strong>B</strong> (ば). Adding a small circle (<strong>°</strong>, <em>handakuten</em>) transforms H into crisp <strong>P</strong> sounds (ぱ).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zen-50/80 dark:bg-zen-800/50 border border-zen-200/60 dark:border-zen-700/60">
                <h3 className="font-bold text-zen-900 dark:text-white flex items-center mb-1">
                  <CheckCircle2 className="w-4 h-4 text-sakura-500 mr-2" />
                  3. Combination Kana (Yōon Glide Sounds)
                </h3>
                <p className="text-xs sm:text-sm text-zen-600 dark:text-zen-400 leading-relaxed">
                  Pairing an i-column character with a small <strong>ゃ</strong> (ya), <strong>ゅ</strong> (yu), or <strong>ょ</strong> (yo) produces single compound glide syllables such as <strong>きゃ</strong> (kya), <strong>しゃ</strong> (sha), and <strong>ちゃ</strong> (cha)—accounting for 36 essential Japanese combinations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Frequently Asked Questions (FAQ Accordion) */}
        <section className="bg-white/80 dark:bg-zen-850/80 rounded-3xl p-6 sm:p-8 border border-zen-200/80 dark:border-zen-700/80 backdrop-blur-sm shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sakura-100 dark:bg-sakura-500/15 text-sakura-700 dark:text-sakura-300 mb-2 border border-sakura-200 dark:border-sakura-500/30">
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zen-900 dark:text-white tracking-tight">
              Japanese Kana Learning FAQ
            </h2>
            <p className="text-sm text-zen-600 dark:text-zen-400 mt-2">
              Common questions on studying Hiragana, memory retention, and quiz configuration.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              {
                q: 'How long does it take to learn all 107 Japanese Hiragana characters?',
                a: 'Most learners memorize the 46 fundamental Gojūon characters in 3 to 7 days by practicing 15–20 minutes daily with active recall quizzes. Mastering the full 107-character pool (including Dakuten and Yōon combinations) typically takes 1 to 2 weeks of consistent daily practice.',
              },
              {
                q: 'What is the difference between Main Kana, Dakuten, and Combination Kana?',
                a: 'Main Kana (Gojūon) are the 46 base characters (あ to ん). Dakuten (voicing marks ") and Handakuten (half-voicing marks °) turn consonants like k/s/t/h into g/z/d/b/p (+25 characters). Combination Kana (Yōon) merge standard kana with small ya, yu, or yo to create 36 glide sounds like kya (きゃ), sha (しゃ), and cha (ちゃ).',
              },
              {
                q: 'Why is active recall testing more effective than static flashcards?',
                a: 'Active recall forces your brain to retrieve sound-character mappings under time pressure rather than passively recognizing them. Hiragana Quiz sharpens this with dynamic feedback timing (a rapid 380ms transition on correct answers, and a deliberate 1000ms pause on mistakes) plus a dedicated "Drill Missed Kana" loop to isolate your weak characters.',
              },
              {
                q: 'Is Hiragana Quiz free, and is my progress private?',
                a: 'Yes, Hiragana Quiz is 100% free with zero ads, zero tracking cookies, and no account creation required. All session histories and cumulative character mastery statistics are stored strictly on your device in browser localStorage.',
              },
              {
                q: 'Can I use keyboard shortcuts to practice faster on desktop?',
                a: 'Yes! Use number keys 1 through 9 for choices 1 to 9, and key 0 for the 10th option. Shortcut badges are displayed directly beside each choice button so you can drill at lightning speed without lifting your hands to the mouse.',
              },
              {
                q: 'Can I install Hiragana Quiz on my phone or tablet as an offline app?',
                a: 'Yes! Hiragana Quiz is configured with a Progressive Web App (PWA) manifest. In Safari on iPhone/iPad tap "Share" > "Add to Home Screen", or in Chrome on Android select "Install App" to access full-screen, distraction-free practice anytime.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-zen-200/80 dark:border-zen-700/80 bg-zen-50/60 dark:bg-zen-800/40 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zen-900 dark:text-white hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zen-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sakura-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-zen-600 dark:text-zen-300 leading-relaxed border-t border-zen-100 dark:border-zen-700/50">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
