import React, { useState, useMemo } from 'react';
import { SessionResult, CumulativeCharacterStat } from '../types';
import { clearAllHistory } from '../services/storage';
import { playKanaSound, ALL_KANA } from '../data/hiragana';
import {
  X,
  History,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BarChart2,
  Clock,
} from 'lucide-react';

export type MasteryTimeframe = 'all' | '30d' | '7d';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionResult[];
  cumulativeStats: Record<string, CumulativeCharacterStat>;
  onHistoryCleared: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  cumulativeStats,
  onHistoryCleared,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'mastery'>('sessions');
  const [masteryTimeframe, setMasteryTimeframe] = useState<MasteryTimeframe>('all');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClear = () => {
    clearAllHistory();
    onHistoryCleared();
    setConfirmClear(false);
  };

  const toggleExpandSession = (id: string) => {
    setExpandedSessionId((prev) => (prev === id ? null : id));
  };

  // Convert cumulative stats into list based on selected timeframe
  const statsList = useMemo(() => {
    if (masteryTimeframe === 'all') {
      return Object.values(cumulativeStats).filter((s) => s.totalSeen > 0);
    }

    const days = masteryTimeframe === '7d' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentSessions = sessions.filter((s) => {
      try {
        return new Date(s.date).getTime() >= cutoff;
      } catch {
        return false;
      }
    });

    const kanaMap = new Map(ALL_KANA.map((k) => [k.id, k]));
    const aggregated: Record<string, CumulativeCharacterStat> = {};

    for (const sess of recentSessions) {
      for (const [kanaId, score] of Object.entries(sess.characterScores || {})) {
        const kana = score.kana || kanaMap.get(kanaId);
        if (!kana) continue;

        if (!aggregated[kanaId]) {
          aggregated[kanaId] = {
            kana,
            totalSeen: 0,
            totalCorrect: 0,
            accuracy: 0,
            lastPracticed: sess.date,
          };
        }

        aggregated[kanaId].totalSeen += score.timesSeen;
        aggregated[kanaId].totalCorrect += score.timesCorrect;
        if (new Date(sess.date).getTime() > new Date(aggregated[kanaId].lastPracticed).getTime()) {
          aggregated[kanaId].lastPracticed = sess.date;
        }
      }
    }

    for (const stat of Object.values(aggregated)) {
      stat.accuracy = stat.totalSeen > 0 ? Math.round((stat.totalCorrect / stat.totalSeen) * 100) : 0;
    }

    return Object.values(aggregated).filter((s) => s.totalSeen > 0);
  }, [masteryTimeframe, cumulativeStats, sessions]);

  // Sort struggle kana (lowest accuracy first)
  const struggleKana = useMemo(() => {
    return [...statsList]
      .filter((s) => s.accuracy < 75 && s.totalSeen >= 2)
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [statsList]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'learn_char':
        return 'Learn Hiragana';
      case 'learn_romaji':
      case 'learn_pronunciation':
        return 'Learn Romaji';
      case 'learn_both':
        return 'Mixed Mode';
      default:
        return mode;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zen-850 rounded-3xl shadow-2xl border border-zen-200 dark:border-zen-700 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zen-200 dark:border-zen-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zen-900 dark:text-white">
                Scores & Training History
              </h2>
              <p className="text-xs text-zen-500 dark:text-zen-400">
                Track your learning progress and pinpoint challenging kana
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zen-400 hover:text-zen-700 dark:hover:text-zen-200 hover:bg-zen-100 dark:hover:bg-zen-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-4 sm:px-6 bg-zen-50 dark:bg-zen-800 border-b border-zen-200 dark:border-zen-700 flex items-center justify-between">
          <div className="flex items-center p-1 bg-zen-200/60 dark:bg-zen-700/60 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sessions'
                  ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Past Sessions ({sessions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mastery')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'mastery'
                  ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Character Mastery ({statsList.length})</span>
            </button>
          </div>

          {/* Clear history button */}
          {sessions.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-500 font-semibold">Confirm?</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 text-xs text-zen-500 hover:text-zen-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center space-x-1 text-xs font-semibold text-zen-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'sessions' ? (
            /* Sessions List */
            sessions.length === 0 ? (
              <div className="text-center py-16 text-zen-400">
                <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-sm">No training sessions recorded yet.</p>
                <p className="text-xs mt-1">Complete your first quiz to see your history here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((sess) => {
                  const isExpanded = expandedSessionId === sess.id;
                  const charList = Object.values(sess.characterScores || {});

                  return (
                    <div
                      key={sess.id}
                      className="border border-zen-200 dark:border-zen-750 bg-zen-50/60 dark:bg-zen-800 rounded-2xl overflow-hidden transition-all shadow-sm"
                    >
                      <div
                        onClick={() => toggleExpandSession(sess.id)}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white dark:hover:bg-zen-750 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono text-base ${
                              sess.accuracy >= 85
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : sess.accuracy >= 65
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {sess.accuracy}%
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-zen-900 dark:text-white">
                                {sess.totalCorrect} / {sess.totalAnswered} Correct
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zen-200 dark:bg-zen-700 text-zen-700 dark:text-zen-300 font-medium">
                                {getModeLabel(sess.config.mode)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-zen-400 mt-1">
                              <span>{formatDate(sess.date)}</span>
                              <span>•</span>
                              <span>{sess.config.choicesCount} choices</span>
                              <span>•</span>
                              <span>{formatSeconds(sess.durationSeconds)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-semibold text-zen-500">
                          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Expandable Character Breakdown */}
                      {isExpanded && (
                        <div className="p-4 bg-white dark:bg-zen-850 border-t border-zen-200 dark:border-zen-750">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zen-400 mb-3">
                            Session Kana Breakdown ({charList.length})
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {charList.map((c) => (
                              <div
                                key={c.kana.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playKanaSound(c.kana.char);
                                }}
                                className="p-2 rounded-xl border border-zen-200 dark:border-zen-700 bg-zen-50/50 dark:bg-zen-800 text-center cursor-pointer hover:border-sakura-400 transition-all flex items-center justify-between"
                              >
                                <span className="font-japanese font-bold text-lg text-zen-900 dark:text-white">
                                  {c.kana.char}
                                </span>
                                <div className="text-right">
                                  <span className="text-[11px] font-mono text-zen-500 block">
                                    {c.kana.romaji}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold font-mono ${
                                      c.accuracy === 100
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                    }`}
                                  >
                                    {c.timesCorrect}/{c.timesSeen} ({c.accuracy}%)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Character Mastery Tab */
            <div className="space-y-6">
              {/* Timeframe Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-zen-50/70 dark:bg-zen-800/60 border border-zen-200/80 dark:border-zen-700/70">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-sakura-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zen-700 dark:text-zen-300">
                    Mastery Period
                  </span>
                </div>

                <div className="flex items-center p-1 bg-zen-200/60 dark:bg-zen-700/60 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMasteryTimeframe('all')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      masteryTimeframe === 'all'
                        ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-xs'
                        : 'text-zen-600 dark:text-zen-400 hover:text-zen-900 dark:hover:text-zen-200'
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setMasteryTimeframe('30d')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      masteryTimeframe === '30d'
                        ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-xs'
                        : 'text-zen-600 dark:text-zen-400 hover:text-zen-900 dark:hover:text-zen-200'
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setMasteryTimeframe('7d')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      masteryTimeframe === '7d'
                        ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-xs'
                        : 'text-zen-600 dark:text-zen-400 hover:text-zen-900 dark:hover:text-zen-200'
                    }`}
                  >
                    Last 7 Days
                  </button>
                </div>
              </div>

              {/* Struggle Kana Alert Section */}
              {struggleKana.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Characters to Practice (Accuracy &lt; 75%)
                      {masteryTimeframe === '7d' ? ' — Last 7 Days' : masteryTimeframe === '30d' ? ' — Last 30 Days' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                    {struggleKana.map((stat) => (
                      <div
                        key={stat.kana.id}
                        onClick={() => playKanaSound(stat.kana.char)}
                        className="p-2.5 rounded-xl bg-white dark:bg-zen-800 border border-amber-200 dark:border-amber-700 text-center cursor-pointer hover:border-sakura-400 shadow-sm"
                      >
                        <span className="font-japanese font-black text-2xl text-zen-900 dark:text-white block mb-0.5">
                          {stat.kana.char}
                        </span>
                        <span className="text-xs font-mono font-bold text-zen-600 dark:text-zen-300 block">
                          {stat.kana.romaji}
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mt-1">
                          {stat.accuracy}% ({stat.totalCorrect}/{stat.totalSeen})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Practiced Kana */}
              <div>
                <h3 className="text-sm font-bold text-zen-800 dark:text-zen-200 mb-3 flex items-center justify-between">
                  <span>
                    {masteryTimeframe === '7d'
                      ? `Practiced Characters — Last 7 Days (${statsList.length})`
                      : masteryTimeframe === '30d'
                      ? `Practiced Characters — Last 30 Days (${statsList.length})`
                      : `All Practiced Characters (${statsList.length})`}
                  </span>
                  <span className="text-xs font-normal text-zen-400">
                    Click character to hear audio
                  </span>
                </h3>

                {statsList.length === 0 ? (
                  <div className="text-center py-12 text-zen-400 text-sm">
                    {masteryTimeframe === '7d'
                      ? 'No character stats recorded in the last 7 days.'
                      : masteryTimeframe === '30d'
                      ? 'No character stats recorded in the last 30 days.'
                      : 'No character stats recorded yet.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {[...statsList]
                      .sort((a, b) => b.totalSeen - a.totalSeen)
                      .map((stat) => (
                        <div
                          key={stat.kana.id}
                          onClick={() => playKanaSound(stat.kana.char)}
                          className="p-3 rounded-2xl border border-zen-200 dark:border-zen-700 bg-zen-50/50 dark:bg-zen-800 hover:bg-white dark:hover:bg-zen-750 transition-all cursor-pointer text-center relative group"
                        >
                          <span className="font-japanese font-black text-3xl text-zen-900 dark:text-white block mb-1">
                            {stat.kana.char}
                          </span>
                          <span className="text-xs font-mono font-bold text-zen-600 dark:text-zen-300 block mb-1">
                            {stat.kana.romaji}
                          </span>
                          <div className="text-[11px] font-mono font-semibold pt-1 border-t border-zen-200 dark:border-zen-700 flex justify-between items-center text-zen-500">
                            <span>{stat.totalCorrect}/{stat.totalSeen}</span>
                            <span
                              className={`font-bold ${
                                stat.accuracy >= 80
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : stat.accuracy >= 60
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {stat.accuracy}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zen-50 dark:bg-zen-800 border-t border-zen-200 dark:border-zen-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zen-200 dark:bg-zen-700 text-zen-800 dark:text-zen-200 font-semibold text-sm hover:bg-zen-300 dark:hover:bg-zen-600 transition-colors"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
