import React, { useEffect, useRef } from 'react';
import {
  LayoutGrid,
  ChevronsRight,
  Copy,
  Download
} from 'lucide-react';
import { CategorySpec, SurveyItem } from '../types';
import { COLUMN_INFO } from '../data/surveySchema';

interface FormPanelProps {
  categories: CategorySpec[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeRowIndex: number;
  onSelectRowIndex: (idx: number) => void;
  answers: Record<number, number[]>;
  onToggleColumnMark: (itemId: number, colNum: number) => void;
  onJumpNextIncomplete: () => void;
  onOpenMatrixModal: () => void;
  onCopyTsv: () => void;
  onClearActiveCategory: () => void;
  onDownloadCsv: () => void;
  schemaItems: SurveyItem[];
}

export const FormPanel: React.FC<FormPanelProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  activeRowIndex,
  onSelectRowIndex,
  answers,
  onToggleColumnMark,
  onJumpNextIncomplete,
  onOpenMatrixModal,
  onCopyTsv,
  onClearActiveCategory,
  onDownloadCsv,
  schemaItems
}) => {
  const streamListRef = useRef<HTMLDivElement>(null);

  const currentCategorySpec = categories.find(c => c.cat === activeCategory) || categories[0];
  const currentCategoryItems = schemaItems.filter(i => i.cat === activeCategory);

  // Auto-scroll active row into view
  useEffect(() => {
    const activeEl = document.getElementById(`entry-row-${activeRowIndex}`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeRowIndex, activeCategory]);

  // Calculate completion metrics
  let totalFilledItems = 0;
  let completeCategoriesCount = 0;

  categories.forEach(spec => {
    let filled = 0;
    spec.ids.forEach(id => {
      if (answers[id] && answers[id].length > 0) filled++;
    });
    if (filled === spec.ids.length && spec.ids.length > 0) {
      completeCategoriesCount++;
    }
    totalFilledItems += filled;
  });

  const isCurrentCategoryComplete =
    currentCategorySpec &&
    currentCategorySpec.ids.every(id => answers[id] && answers[id].length > 0);

  return (
    <section
      aria-label="Survey Form Entry"
      className="w-full md:w-[37%] h-full flex flex-col bg-[#111827] border-t md:border-t-0 border-slate-800 select-none notranslate"
    >
      {/* Target Category & Progress Summary Banner */}
      <div className="p-3.5 border-b border-slate-800 space-y-2.5 shrink-0 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
              id="statusDot"
              aria-hidden="true"
            />
            <span
              className="text-xs font-bold uppercase tracking-wider text-slate-200"
              id="statusText"
            >
              Ready
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="openMatrixBtn"
              onClick={onOpenMatrixModal}
              aria-label="Open 54 Category Progress Matrix"
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 transition flex items-center gap-1 cursor-pointer"
            >
              <LayoutGrid className="w-3 h-3" />
              <span id="matrixSummaryBadge">
                {completeCategoriesCount} / 54 完了
              </span>
            </button>
            <span
              className="text-xs font-mono text-emerald-400 font-bold"
              id="progressBadge"
              aria-live="polite"
            >
              {totalFilledItems} / {schemaItems.length} 入力済
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="categorySelector"
              className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 notranslate"
            >
              <span>調査分類（54カテゴリ &amp; 190行番号定義）</span>
            </label>
            <button
              id="jumpNextIncompleteBtn"
              onClick={onJumpNextIncomplete}
              className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
            >
              <ChevronsRight className="w-3 h-3" />
              <span>次の未完了へ</span>
            </button>
          </div>
          
          <select
            id="categorySelector"
            value={activeCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            aria-label="調査分類選択"
            className={`w-full bg-[#090d16] border text-xs rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition notranslate font-sans cursor-pointer ${
              isCurrentCategoryComplete
                ? 'border-emerald-500 bg-emerald-950/20'
                : 'border-slate-700'
            }`}
          >
            {categories.map((spec) => {
              let filled = 0;
              spec.ids.forEach(id => {
                if (answers[id] && answers[id].length > 0) filled++;
              });
              const isComplete = filled === spec.ids.length && spec.ids.length > 0;
              const isStarted = filled > 0;
              const markIcon = isComplete ? '✅' : isStarted ? '⏳' : '⚪';

              return (
                <option key={spec.cat} value={spec.cat}>
                  {markIcon} [{filled}/{spec.ids.length}] {spec.cat}（行番号 {spec.ids[0]}～{spec.ids[spec.ids.length - 1]}）
                </option>
              );
            })}
          </select>
        </div>

        {/* Columns Reference Guide (Japanese Headers) */}
        <div
          className="grid grid-cols-7 gap-1 text-[10px] text-center font-mono pt-1 notranslate"
          aria-label="Column Meanings"
        >
          {COLUMN_INFO.map(col => (
            <div
              key={col.id}
              className={`bg-slate-800/80 py-1 rounded ${col.color} font-semibold`}
              title={col.title}
            >
              {col.label}
            </div>
          ))}
        </div>
      </div>

      {/* Item Form Stream */}
      <div
        id="itemStreamList"
        ref={streamListRef}
        role="region"
        aria-label="Survey Questions List"
        className="flex-1 overflow-y-auto p-3 space-y-2 focus:outline-none notranslate"
        tabIndex={0}
      >
        {currentCategoryItems.map((item, idx) => {
          const valArr = answers[item.id] || [];
          const isCurrentActive = idx === activeRowIndex;

          return (
            <div
              key={item.id}
              id={`entry-row-${idx}`}
              data-idx={idx}
              data-id={item.id}
              onClick={() => onSelectRowIndex(idx)}
              className={`entry-row p-2.5 rounded-lg border text-xs transition cursor-pointer flex flex-col space-y-2 notranslate ${
                isCurrentActive
                  ? 'active-row border-sky-400 bg-sky-950/40 ring-1 ring-sky-400/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`font-mono text-sm px-2.5 py-1 rounded-md border font-extrabold tracking-wide ${
                      isCurrentActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-400/30'
                        : 'bg-slate-950 border-slate-700 text-amber-300'
                    }`}
                  >
                    行番号 {item.id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    #{String(item.id).padStart(3, '0')}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-sky-400">
                  {valArr.length > 0 ? (
                    `列選択: [${valArr.join(',')}]`
                  ) : (
                    <span className="text-slate-400 font-normal">
                      -- 未選択 --
                    </span>
                  )}
                </div>
              </div>

              {/* Pill buttons 1 to 7 */}
              <div className="flex items-center gap-1 pt-0.5">
                {[1, 2, 3, 4, 5, 6, 7].map((c) => {
                  const isSelected = valArr.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      data-col={c}
                      aria-label={`Select column ${c}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRowIndex(idx);
                        onToggleColumnMark(item.id, c);
                      }}
                      className={`col-pill-btn flex-1 py-1.5 px-0.5 text-center font-mono font-bold text-xs rounded transition focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-300'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#090d16] border-t border-slate-800 space-y-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="copyTsvBtn"
            onClick={onCopyTsv}
            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5 notranslate focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copy TSV (Excel)
          </button>
          <button
            id="clearCategoryMarksBtn"
            onClick={onClearActiveCategory}
            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium rounded-lg border border-slate-700 transition notranslate cursor-pointer"
          >
            Clear Active Cat
          </button>
        </div>

        <button
          id="downloadCsvBtn"
          onClick={onDownloadCsv}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 notranslate focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download 1984 Food Survey CSV (190 Columns)</span>
        </button>
      </div>
    </section>
  );
};
