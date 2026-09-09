import React, { useState } from 'react';
import { MAIN_KANA, DAKUTEN_KANA, COMBINATION_KANA, playKanaSound } from '../data/hiragana';
import { KanaItem } from '../types';
import { X, Search, Volume2, BookOpen } from 'lucide-react';

interface CheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatsheetModal: React.FC<CheatsheetModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'dakuten' | 'combination'>('main');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter kana according to search query or tab
  const getListForCurrentTab = (): KanaItem[] => {
    switch (activeTab) {
      case 'main':
        return MAIN_KANA;
      case 'dakuten':
        return DAKUTEN_KANA;
      case 'combination':
        return COMBINATION_KANA;
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const currentList = getListForCurrentTab();

  const filteredList = query
    ? currentList.filter(
        (k) =>
          k.romaji.toLowerCase().includes(query) ||
          (k.altRomaji && k.altRomaji.toLowerCase().includes(query)) ||
          k.char.includes(query) ||
          k.group.toLowerCase().includes(query)
      )
    : currentList;

  // Group items by their group for clean sectioned layout
  const groupedItems = filteredList.reduce<Record<string, KanaItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white dark:bg-zen-850 rounded-3xl shadow-2xl border border-zen-200 dark:border-zen-700 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zen-200 dark:border-zen-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zen-900 dark:text-white">
                Hiragana Cheatsheet
              </h2>
              <p className="text-xs text-zen-500 dark:text-zen-400">
                Click any character to hear its Japanese pronunciation
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

        {/* Filter and Tab Bar */}
        <div className="p-4 sm:px-6 bg-zen-50 dark:bg-zen-800 border-b border-zen-200 dark:border-zen-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-zen-200/60 dark:bg-zen-700/60 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('main')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'main'
                  ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              Main ({MAIN_KANA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dakuten')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dakuten'
                  ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              Dakuten ({DAKUTEN_KANA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('combination')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'combination'
                  ? 'bg-white dark:bg-zen-850 text-zen-900 dark:text-white shadow-sm'
                  : 'text-zen-600 dark:text-zen-400 hover:text-zen-900'
              }`}
            >
              Combination ({COMBINATION_KANA.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zen-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search romaji or character..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-zen-200 dark:border-zen-600 bg-white dark:bg-zen-850 text-zen-900 dark:text-white placeholder-zen-400 focus:outline-none focus:ring-2 focus:ring-sakura-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zen-400 hover:text-zen-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Characters Grid Area (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {Object.entries(groupedItems).length === 0 ? (
            <div className="text-center py-16 text-zen-400 text-sm">
              No Hiragana matched your search &quot;{searchQuery}&quot;.
            </div>
          ) : (
            Object.entries(groupedItems).map(([groupName, items]) => (
              <div key={groupName}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zen-400 dark:text-zen-500 mb-2.5 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-sakura-400 mr-2" />
                  {groupName}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      title={`Click to listen to ${item.romaji}`}
                      className="group p-3 rounded-2xl border border-zen-200 dark:border-zen-750 bg-zen-50/50 dark:bg-zen-800 hover:bg-white dark:hover:bg-zen-700 hover:border-sakura-400 dark:hover:border-sakura-500 transition-all text-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <div className="font-japanese font-black text-2xl sm:text-3xl text-zen-900 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                        {item.char}
                      </div>
                      <div className="text-xs font-mono font-bold text-sakura-600 dark:text-sakura-400">
                        {item.romaji}
                        {item.altRomaji && (
                          <span className="text-[10px] text-zen-400 dark:text-zen-500 font-normal ml-0.5">
                            ({item.altRomaji})
                          </span>
                        )}
                      </div>
                      <Volume2 className="w-3 h-3 text-zen-300 dark:text-zen-600 group-hover:text-sakura-500 absolute top-2 right-2 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zen-50 dark:bg-zen-800 border-t border-zen-200 dark:border-zen-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zen-200 dark:bg-zen-700 text-zen-800 dark:text-zen-200 font-semibold text-sm hover:bg-zen-300 dark:hover:bg-zen-600 transition-colors"
          >
            Close Cheatsheet
          </button>
        </div>
      </div>
    </div>
  );
};
