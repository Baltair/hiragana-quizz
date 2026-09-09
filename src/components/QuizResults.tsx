import React, { useState } from 'react';
import { SessionResult, CharacterSessionScore, KanaItem } from '../types';
import {
  RotateCcw,
  Sliders,
  History,
  Volume2,
  Clock,
  Flame,
  Award,
  Target,
  Share2,
  Check,
} from 'lucide-react';
import { playKanaSound } from '../data/hiragana';

interface QuizResultsProps {
  result: SessionResult;
  onRestartSame: () => void;
  onNewConfig: () => void;
  onOpenHistory: () => void;
  onDrillMissed?: (missedKana: KanaItem[]) => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRestartSame,
  onNewConfig,
  onOpenHistory,
  onDrillMissed,
}) => {
  const [filter, setFilter] = useState<'all' | 'perfect' | 'missed'>('all');
  const [isCopied, setIsCopied] = useState(false);

  const characterList: CharacterSessionScore[] = Object.values(
    result.characterScores
  );

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  const handleShare = async () => {
    const timeText = formatSeconds(result.durationSeconds);
    const shareText = `🌸 I scored ${result.accuracy}% (${result.totalCorrect}/${result.totalAnswered}) on Hiragana Quiz in ${timeText} with a max streak of ${result.maxStreak}! Test your Japanese Kana recall: https://hiragana-quizz.pages.dev/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hiragana Quiz Score',
          text: shareText,
          url: 'https://hiragana-quizz.pages.dev/',
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      // Ignore clipboard write errors
    }
  };

  const filteredKana = characterList.filter((item) => {
    if (filter === 'perfect') return item.accuracy === 100;
    if (filter === 'missed') return item.accuracy < 100;
    return true;
  });

  // Determine feedback message
  let feedbackBadge = 'Keep Practicing!';
  let badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
  if (result.accuracy === 100) {
    feedbackBadge = 'Perfect Score! 完璧';
    badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
  } else if (result.accuracy >= 85) {
    feedbackBadge = 'Great Job! よくできました';
    badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
  } else if (result.accuracy >= 65) {
    feedbackBadge = 'Good Effort! がんばった';
    badgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300';
  }

  const missedItems: KanaItem[] = characterList
    .filter((item) => item.accuracy < 100)
    .map((item) => item.kana);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Hero Summary Card */}
      <div className="bg-white dark:bg-zen-800 rounded-3xl shadow-xl border border-zen-200 dark:border-zen-700 overflow-hidden mb-8">
        <div className="p-6 sm:p-10 text-center relative">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-sakura-100/60 dark:bg-sakura-900/15 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4 shadow-sm border border-black/5 dark:border-white/10">
            <Award className="w-4 h-4 text-sakura-500" />
            <span className={badgeColor + ' px-2 py-0.5 rounded-full'}>
              {feedbackBadge}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zen-900 dark:text-white tracking-tight mb-2">
            Session Summary
          </h2>
          <p className="text-sm text-zen-500 dark:text-zen-400 max-w-md mx-auto mb-6">
            Review your overall performance and character-level mastery for this practice session.
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {/* Accuracy */}
            <div className="p-4 rounded-2xl bg-zen-50 dark:bg-zen-750/70 border border-zen-200 dark:border-zen-700">
              <span className="text-xs font-medium text-zen-500 block mb-1">Accuracy</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sakura-600 dark:text-sakura-400 font-mono">
                {result.accuracy}%
              </span>
            </div>

            {/* Score */}
            <div className="p-4 rounded-2xl bg-zen-50 dark:bg-zen-750/70 border border-zen-200 dark:border-zen-700">
              <span className="text-xs font-medium text-zen-500 block mb-1">Score</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-zen-900 dark:text-white font-mono">
                {result.totalCorrect} / {result.totalAnswered}
              </span>
            </div>

            {/* Longest Streak */}
            <div className="p-4 rounded-2xl bg-zen-50 dark:bg-zen-750/70 border border-zen-200 dark:border-zen-700">
              <span className="text-xs font-medium text-zen-500 block mb-1 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-amber-500 mr-1" />
                Max Streak
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                {result.maxStreak}
              </span>
            </div>

            {/* Duration */}
            <div className="p-4 rounded-2xl bg-zen-50 dark:bg-zen-750/70 border border-zen-200 dark:border-zen-700">
              <span className="text-xs font-medium text-zen-500 block mb-1 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-blue-500 mr-1" />
                Time Spent
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-zen-800 dark:text-zen-200 font-mono">
                {formatSeconds(result.durationSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-4 sm:p-6 bg-zen-50 dark:bg-zen-850 border-t border-zen-200 dark:border-zen-700 flex flex-wrap items-center justify-center gap-3">
          {missedItems.length > 0 && onDrillMissed && (
            <button
              type="button"
              onClick={() => onDrillMissed(missedItems)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-sakura-500 to-sakura-600 hover:from-amber-600 hover:to-sakura-700 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-sakura-500/25 transition-all active:scale-95 ring-2 ring-sakura-400/30"
            >
              <Target className="w-4 h-4" />
              <span>Drill Missed Kana ({missedItems.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestartSame}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Train Again</span>
          </button>

          <button
            type="button"
            onClick={onNewConfig}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 bg-white dark:bg-zen-800 text-zen-800 dark:text-zen-200 hover:bg-zen-100 dark:hover:bg-zen-700 font-semibold text-sm transition-colors shadow-sm"
          >
            <Sliders className="w-4 h-4 text-zen-500" />
            <span>Change Settings</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 bg-white dark:bg-zen-800 text-zen-800 dark:text-zen-200 hover:bg-zen-100 dark:hover:bg-zen-700 font-semibold text-sm transition-colors shadow-sm"
            title="Share your score with friends or on social media"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-sakura-500" />
                <span>Share Score</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-zen-300 dark:border-zen-600 bg-white dark:bg-zen-800 text-zen-800 dark:text-zen-200 hover:bg-zen-100 dark:hover:bg-zen-700 font-semibold text-sm transition-colors shadow-sm"
          >
            <History className="w-4 h-4 text-zen-500" />
            <span>View All History</span>
          </button>
        </div>
      </div>

      {/* Per Hiragana Character Breakdown Table */}
      <div className="bg-white dark:bg-zen-800 rounded-3xl shadow-xl border border-zen-200 dark:border-zen-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-zen-900 dark:text-white flex items-center">
              <span>Hiragana Score Breakdown</span>
              <span className="ml-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zen-100 dark:bg-zen-700 text-zen-700 dark:text-zen-300">
                {characterList.length} kana tested
              </span>
            </h3>
            <p className="text-xs text-zen-500 dark:text-zen-400 mt-1">
              Click any character card to hear its native audio pronunciation.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-1.5 p-1 bg-zen-100 dark:bg-zen-700/60 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-zen-800 text-zen-900 dark:text-white shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              All ({characterList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('perfect')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'perfect'
                  ? 'bg-white dark:bg-zen-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              Perfect ({characterList.filter((k) => k.accuracy === 100).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('missed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'missed'
                  ? 'bg-white dark:bg-zen-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              Missed ({characterList.filter((k) => k.accuracy < 100).length})
            </button>
          </div>
        </div>

        {/* Kana Cards Grid */}
        {filteredKana.length === 0 ? (
          <div className="text-center py-12 text-zen-400 text-sm">
            No characters in this filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredKana.map((item) => {
              const isPerfect = item.accuracy === 100;
              return (
                <div
                  key={item.kana.id}
                  onClick={() => playKanaSound(item.kana.char)}
                  className="group relative p-3.5 rounded-2xl border border-zen-200 dark:border-zen-700 hover:border-sakura-400 dark:hover:border-sakura-500 bg-zen-50/50 dark:bg-zen-750/50 hover:bg-white dark:hover:bg-zen-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-japanese font-black text-3xl text-zen-900 dark:text-white group-hover:scale-105 transition-transform">
                      {item.kana.char}
                    </span>
                    <button
                      type="button"
                      title="Play pronunciation"
                      className="p-1 text-zen-400 group-hover:text-sakura-500 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-semibold font-mono text-zen-600 dark:text-zen-300">
                      {item.kana.romaji}
                    </span>
                    <span className="text-[10px] font-medium text-zen-400 uppercase">
                      {item.kana.category}
                    </span>
                  </div>

                  {/* Score Indicator */}
                  <div className="pt-2 border-t border-zen-200 dark:border-zen-700/60 flex items-center justify-between text-xs">
                    <span className="text-zen-500 dark:text-zen-400">
                      {item.timesCorrect} / {item.timesSeen}
                    </span>
                    <span
                      className={`font-bold font-mono px-1.5 py-0.5 rounded text-[11px] ${
                        isPerfect
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {item.accuracy}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
