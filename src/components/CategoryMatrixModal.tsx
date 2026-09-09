import React, { useState } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import { CategorySpec, CategoryStatus, SurveyRowAnswer } from '../types';
import { isRowComplete, isRowStarted } from '../data/surveySchema';

interface CategoryMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategorySpec[];
  answers: Record<number, SurveyRowAnswer>;
  onSelectCategory: (cat: string) => void;
}

export const CategoryMatrixModal: React.FC<CategoryMatrixModalProps> = ({
  isOpen,
  onClose,
  categories,
  answers,
  onSelectCategory
}) => {
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'complete'>('all');

  if (!isOpen) return null;

  const statuses: CategoryStatus[] = categories.map(spec => {
    let filled = 0;
    let started = 0;
    spec.ids.forEach(id => {
      if (isRowComplete(answers[id])) filled++;
      if (isRowStarted(answers[id])) started++;
    });
    return {
      cat: spec.cat,
      filled,
      total: spec.ids.length,
      isComplete: filled === spec.ids.length && spec.ids.length > 0,
      isStarted: started > 0
    };
  });

  const completeCount = statuses.filter(s => s.isComplete).length;
  const percentComplete = Math.round((completeCount / categories.length) * 100);

  const filteredStatuses = statuses.filter(stat => {
    if (filter === 'incomplete') return !stat.isComplete;
    if (filter === 'complete') return stat.isComplete;
    return true;
  });

  return (
    <div
      id="categoryMatrixModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matrixModalTitle"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 notranslate select-none"
    >
      <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 id="matrixModalTitle" className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-sky-400" />
              <span>全54カテゴリ 入力進捗状況マトリクス</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">クリックすると対象カテゴリの入力画面に即座にジャンプします</p>
          </div>
          <button
            id="closeMatrixModalBtn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              id="filterAllMatrixBtn"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              すべて ({categories.length})
            </button>
            <button
              id="filterIncompleteMatrixBtn"
              onClick={() => setFilter('incomplete')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                filter === 'incomplete'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              未完了のみ
            </button>
            <button
              id="filterCompleteMatrixBtn"
              onClick={() => setFilter('complete')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                filter === 'complete'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              完了のみ
            </button>
          </div>
          <span id="matrixPercentBadge" className="font-mono text-emerald-400 font-bold">
            {percentComplete}% 完了 ({completeCount}/{categories.length})
          </span>
        </div>

        {/* Grid list */}
        <div id="categoryMatrixGrid" className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {filteredStatuses.map((stat) => {
            const spec = categories.find(c => c.cat === stat.cat)!;
            const pct = Math.round((stat.filled / stat.total) * 100);

            return (
              <button
                key={stat.cat}
                type="button"
                onClick={() => {
                  onSelectCategory(stat.cat);
                  onClose();
                }}
                className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between text-left w-full focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                  stat.isComplete
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                    : stat.isStarted
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-slate-200">
                    {stat.isComplete ? '✅' : stat.isStarted ? '⏳' : '⚪'} {stat.cat}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    行番号 {spec.ids[0]}～{spec.ids[spec.ids.length - 1]} ({spec.ids.length}項目)
                  </span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className={`font-mono text-xs font-bold ${stat.isComplete ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {stat.filled} / {stat.total}
                  </span>
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${stat.isComplete ? 'bg-emerald-500' : 'bg-sky-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
