import React, { useEffect, useRef, useMemo } from 'react';
import {
  LayoutGrid,
  ChevronsRight,
  Copy,
  Download,
  Check,
  RotateCcw
} from 'lucide-react';
import { CategorySpec, SurveyItem, SurveyRowAnswer } from '../types';
import {
  FREQUENCY_OPTIONS,
  OCCASION_OPTIONS,
  isRowComplete,
  isRowStarted
} from '../data/surveySchema';

interface FrequencyOptionButtonProps {
  itemId: number;
  value: 1 | 2 | 3;
  label: string;
  isSelected: boolean;
  onSelect: (itemId: number, freq: 1 | 2 | 3) => void;
}

const FrequencyOptionButton = React.memo<FrequencyOptionButtonProps>(({
  itemId,
  value,
  label,
  isSelected,
  onSelect
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(itemId, value);
  };

  return (
    <button
      type="button"
      role="button"
      aria-pressed={isSelected}
      aria-label={`行番号 ${itemId} ② 頻度: ${label}`}
      onClick={handleClick}
      className={`py-1.5 px-1 text-center font-medium text-[11px] rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 cursor-pointer ${
        isSelected
          ? 'bg-amber-400 text-slate-950 font-bold border-2 border-amber-200 shadow-sm ring-1 ring-amber-300'
          : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700'
      }`}
    >
      {label}
    </button>
  );
});
FrequencyOptionButton.displayName = 'FrequencyOptionButton';

interface OccasionOptionButtonProps {
  itemId: number;
  value: 1 | 2 | 3;
  label: string;
  isSelected: boolean;
  onSelect: (itemId: number, occ: 1 | 2 | 3) => void;
}

const OccasionOptionButton = React.memo<OccasionOptionButtonProps>(({
  itemId,
  value,
  label,
  isSelected,
  onSelect
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(itemId, value);
  };

  return (
    <button
      type="button"
      role="button"
      aria-pressed={isSelected}
      aria-label={`行番号 ${itemId} ③ 機会: ${label}`}
      onClick={handleClick}
      className={`py-1.5 px-1 text-center font-medium text-[11px] rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 cursor-pointer ${
        isSelected
          ? 'bg-emerald-400 text-slate-950 font-bold border-2 border-emerald-200 shadow-sm ring-1 ring-emerald-300'
          : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700'
      }`}
    >
      {label}
    </button>
  );
});
OccasionOptionButton.displayName = 'OccasionOptionButton';

interface SurveyRowItemProps {
  item: SurveyItem;
  rowIndex: number;
  isActive: boolean;
  ans?: SurveyRowAnswer;
  onSelectRowIndex: (idx: number) => void;
  onToggleNeverEaten: (itemId: number) => void;
  onSelectFrequency: (itemId: number, freq: 1 | 2 | 3) => void;
  onSelectOccasion: (itemId: number, occ: 1 | 2 | 3) => void;
  onClearRow: (itemId: number) => void;
}

export const SurveyRowItem = React.memo<SurveyRowItemProps>(({
  item,
  rowIndex,
  isActive,
  ans,
  onSelectRowIndex,
  onToggleNeverEaten,
  onSelectFrequency,
  onSelectOccasion,
  onClearRow
}) => {
  const isNeverEaten = ans ? (ans.neverEaten || !!ans.notEaten) : false;
  const complete = isRowComplete(ans);
  const started = isRowStarted(ans);

  const handleRowClick = () => {
    onSelectRowIndex(rowIndex);
  };

  const handleNeverEatenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectRowIndex(rowIndex);
    onToggleNeverEaten(item.id);
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearRow(item.id);
  };

  return (
    <div
      id={`entry-row-${rowIndex}`}
      data-idx={rowIndex}
      data-id={item.id}
      onClick={handleRowClick}
      className={`entry-row p-3 rounded-lg border text-xs transition cursor-pointer flex flex-col space-y-2 notranslate ${
        isActive
          ? 'active-row border-sky-400 bg-sky-950/40 ring-1 ring-sky-400/50 shadow-md'
          : complete
          ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`font-mono text-xs px-2.5 py-0.5 rounded border font-extrabold tracking-wide ${
              isActive
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

        {/* State Tag & Quick Reset */}
        <div className="flex items-center gap-1.5">
          {isNeverEaten && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-200 border border-rose-400/80 flex items-center gap-1"
              aria-label={`行番号 ${item.id} 未食選択済`}
            >
              <Check className="w-3 h-3 text-rose-300" aria-hidden="true" /> 未食
            </span>
          )}

          {ans && (ans.frequency !== null || ans.occasion !== null) && (
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {ans.frequency !== null && (
                <span
                  className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-200 font-bold border border-amber-400/80"
                  aria-label={`行番号 ${item.id} 頻度 ${ans.frequency}`}
                >
                  頻度:{ans.frequency}
                </span>
              )}
              {ans.occasion !== null && (
                <span
                  className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-200 font-bold border border-emerald-400/80"
                  aria-label={`行番号 ${item.id} 機会 ${ans.occasion}`}
                >
                  機会:{ans.occasion}
                </span>
              )}
            </div>
          )}

          {!started && (
            <span className="text-[10px] text-slate-400 font-mono">
              -- 未選択 --
            </span>
          )}

          {started && (
            <button
              type="button"
              title="この行の選択をクリア (Space)"
              aria-label={`行番号 ${item.id} の選択をクリア`}
              onClick={handleClearClick}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Independent Toggle Button for "① 食べたことがない" */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isNeverEaten}
        aria-label={`行番号 ${item.id}: ① 食べたことがない`}
        onClick={handleNeverEatenClick}
        className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-between transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 cursor-pointer ${
          isNeverEaten
            ? 'bg-rose-700 hover:bg-rose-600 text-white border-2 border-rose-300 shadow-md ring-1 ring-rose-400/50'
            : 'bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
              isNeverEaten
                ? 'bg-white text-rose-800 border-white font-black'
                : 'border-slate-500 bg-slate-900'
            }`}
            aria-hidden="true"
          >
            {isNeverEaten ? '✓' : ''}
          </span>
          <span>① 食べたことがない</span>
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-slate-300 border border-slate-700">
          Key: 0
        </span>
      </button>

      {/* 2. Independent Grouped Sub-rows for 頻度 and 機会 (Multi-selection enabled, never disabled) */}
      <div className="space-y-1.5">
        {/* Group A (頻度): 3 buttons */}
        <div
          role="group"
          aria-label={`行番号 ${item.id} ② 頻度選択`}
          className="flex items-center gap-1.5"
        >
          <div className="w-14 shrink-0 py-1 text-center font-bold text-[10px] rounded bg-amber-500/20 border border-amber-400/40 text-amber-200">
            ② 頻度
          </div>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {FREQUENCY_OPTIONS.map((opt) => (
              <FrequencyOptionButton
                key={opt.value}
                itemId={item.id}
                value={opt.value}
                label={opt.label}
                isSelected={ans?.frequency === opt.value}
                onSelect={onSelectFrequency}
              />
            ))}
          </div>
        </div>

        {/* Group B (機会): 3 buttons */}
        <div
          role="group"
          aria-label={`行番号 ${item.id} ③ 機会選択`}
          className="flex items-center gap-1.5"
        >
          <div className="w-14 shrink-0 py-1 text-center font-bold text-[10px] rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200">
            ③ 機会
          </div>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {OCCASION_OPTIONS.map((opt) => (
              <OccasionOptionButton
                key={opt.value}
                itemId={item.id}
                value={opt.value}
                label={opt.label}
                isSelected={ans?.occasion === opt.value}
                onSelect={onSelectOccasion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
SurveyRowItem.displayName = 'SurveyRowItem';

export interface FormPanelProps {
  categories: CategorySpec[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeRowIndex: number;
  onSelectRowIndex: (idx: number) => void;
  answers: Record<number, SurveyRowAnswer>;
  onToggleNeverEaten?: (itemId: number) => void;
  onToggleNotEaten?: (itemId: number) => void;
  onSelectFrequency: (itemId: number, freq: 1 | 2 | 3) => void;
  onSelectOccasion: (itemId: number, occ: 1 | 2 | 3) => void;
  onClearRow: (itemId: number) => void;
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
  onToggleNeverEaten,
  onToggleNotEaten,
  onSelectFrequency,
  onSelectOccasion,
  onClearRow,
  onJumpNextIncomplete,
  onOpenMatrixModal,
  onCopyTsv,
  onClearActiveCategory,
  onDownloadCsv,
  schemaItems
}) => {
  const streamListRef = useRef<HTMLDivElement>(null);

  const toggleHandler = onToggleNeverEaten || onToggleNotEaten || (() => {});

  const currentCategorySpec = categories.find(c => c.cat === activeCategory) || categories[0];
  const currentCategoryItems = useMemo(
    () => schemaItems.filter(i => i.cat === activeCategory),
    [schemaItems, activeCategory]
  );

  // Auto-scroll active row into view
  useEffect(() => {
    const activeEl = document.getElementById(`entry-row-${activeRowIndex}`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeRowIndex, activeCategory]);

  // Calculate completion metrics efficiently
  const { totalFilledItems, completeCategoriesCount } = useMemo(() => {
    let filledCount = 0;
    let completeCount = 0;

    categories.forEach(spec => {
      let catFilled = 0;
      spec.ids.forEach(id => {
        if (isRowComplete(answers[id])) catFilled++;
      });
      if (catFilled === spec.ids.length && spec.ids.length > 0) {
        completeCount++;
      }
      filledCount += catFilled;
    });

    return { totalFilledItems: filledCount, completeCategoriesCount: completeCount };
  }, [categories, answers]);

  const isCurrentCategoryComplete = useMemo(() => {
    return (
      currentCategorySpec &&
      currentCategorySpec.ids.every(id => isRowComplete(answers[id]))
    );
  }, [currentCategorySpec, answers]);

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
              Rapid Entry Mode
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="openMatrixBtn"
              type="button"
              onClick={onOpenMatrixModal}
              aria-label="Open 54 Category Progress Matrix"
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 transition flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
            >
              <LayoutGrid className="w-3 h-3" aria-hidden="true" />
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
              type="button"
              onClick={onJumpNextIncomplete}
              className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            >
              <ChevronsRight className="w-3 h-3" aria-hidden="true" />
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
              let started = 0;
              spec.ids.forEach(id => {
                if (isRowComplete(answers[id])) filled++;
                if (isRowStarted(answers[id])) started++;
              });
              const isComplete = filled === spec.ids.length && spec.ids.length > 0;
              const markIcon = isComplete ? '✅' : started > 0 ? '⏳' : '⚪';

              return (
                <option key={spec.cat} value={spec.cat}>
                  {markIcon} [{filled}/{spec.ids.length}] {spec.cat}（行番号 {spec.ids[0]}～{spec.ids[spec.ids.length - 1]}）
                </option>
              );
            })}
          </select>
        </div>

        {/* Form Structure Reference Guide */}
        <div className="flex items-center gap-1.5 text-[10px] pt-0.5 notranslate font-medium">
          <div className="flex-1 py-1 px-2 rounded bg-rose-500/15 border border-rose-400/40 text-rose-200 text-center font-mono">
            ①未食: [0]
          </div>
          <div className="flex-[1.4] py-1 px-2 rounded bg-amber-500/15 border border-amber-400/40 text-amber-200 text-center font-mono">
            ②頻度: [1:よく 2:割と 3:稀]
          </div>
          <div className="flex-[1.4] py-1 px-2 rounded bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-center font-mono">
            ③機会: [1:手作 2:惣菜 3:外食]
          </div>
        </div>
      </div>

      {/* Item Form Stream (Memoized row rendering) */}
      <div
        id="itemStreamList"
        ref={streamListRef}
        role="region"
        aria-label="Survey Questions List"
        className="flex-1 overflow-y-auto p-3 space-y-2.5 focus:outline-none notranslate"
        tabIndex={0}
      >
        {currentCategoryItems.map((item, idx) => (
          <SurveyRowItem
            key={item.id}
            item={item}
            rowIndex={idx}
            isActive={idx === activeRowIndex}
            ans={answers[item.id]}
            onSelectRowIndex={onSelectRowIndex}
            onToggleNeverEaten={toggleHandler}
            onSelectFrequency={onSelectFrequency}
            onSelectOccasion={onSelectOccasion}
            onClearRow={onClearRow}
          />
        ))}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#090d16] border-t border-slate-800 space-y-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="copyTsvBtn"
            type="button"
            onClick={onCopyTsv}
            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5 notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" /> Copy TSV (Excel 3-Cols)
          </button>
          <button
            id="clearCategoryMarksBtn"
            type="button"
            onClick={onClearActiveCategory}
            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 text-xs font-medium rounded-lg border border-slate-700 transition notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
          >
            Clear Active Cat
          </button>
        </div>

        <button
          id="downloadCsvBtn"
          type="button"
          onClick={onDownloadCsv}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Download 1984 Food Survey CSV (3 Columns / Item)</span>
        </button>
      </div>
    </section>
  );
};
