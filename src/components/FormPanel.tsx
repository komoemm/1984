import React, { useEffect, useRef, useMemo } from 'react';
import {
  LayoutGrid,
  ChevronsRight,
  Copy,
  Download,
  Rows,
  FileSpreadsheet
} from 'lucide-react';
import { CategorySpec, SurveyItem, SurveyRowData } from '../types';
import { isRowComplete } from '../data/surveySchema';
import { useLanguage } from '../context/LanguageContext';
import { SurveyRowItem } from './SurveyRowItem';

export interface FormPanelProps {
  categories: CategorySpec[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeRowIndex: number;
  onSelectRowIndex: (idx: number) => void;
  answers: Record<number, SurveyRowData>;
  onToggleNeverEaten?: (itemId: number) => void;
  onToggleNotEaten?: (itemId: number) => void;
  onSelectFrequency: (itemId: number, freq: 1 | 2 | 3) => void;
  onToggleOccasion: (itemId: number, occ: 'home' | 'store' | 'out' | 1 | 2 | 3) => void;
  onSelectOccasion?: (itemId: number, occ: 1 | 2 | 3) => void;
  onClearRow: (itemId: number) => void;
  onJumpNextIncomplete: () => void;
  onOpenMatrixModal: () => void;
  tsvExportMode: 'horizontal' | 'vertical';
  onToggleTsvExportMode: (mode: 'horizontal' | 'vertical') => void;
  onCopyTsv: () => void;
  onCopyHorizontalTsv: () => void;
  onCopyVerticalTsv: () => void;
  onCopyAllHorizontalTsv: () => void;
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
  onToggleOccasion,
  onSelectOccasion,
  onClearRow,
  onJumpNextIncomplete,
  onOpenMatrixModal,
  tsvExportMode,
  onToggleTsvExportMode,
  onCopyTsv,
  onCopyHorizontalTsv,
  onCopyVerticalTsv,
  onCopyAllHorizontalTsv,
  onClearActiveCategory,
  onDownloadCsv,
  schemaItems
}) => {
  const streamListRef = useRef<HTMLDivElement>(null);
  const { t, tCat } = useLanguage();

  const toggleNeverHandler = onToggleNeverEaten || onToggleNotEaten || (() => {});
  const toggleOccasionHandler = onToggleOccasion || ((id: number, occ: 'home' | 'store' | 'out' | 1 | 2 | 3) => {
    if (onSelectOccasion) {
      const numericCode: 1 | 2 | 3 = typeof occ === 'number' ? occ : occ === 'home' ? 1 : occ === 'store' ? 2 : 3;
      onSelectOccasion(id, numericCode);
    }
  });

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

  // Calculate completion metrics
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
              {t('form.rapidEntry')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="openMatrixBtn"
              type="button"
              onClick={onOpenMatrixModal}
              aria-label="Open Category Progress Matrix"
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 transition flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
            >
              <LayoutGrid className="w-3 h-3" aria-hidden="true" />
              <span id="matrixSummaryBadge">
                {t('form.matrixSummary', { count: completeCategoriesCount })}
              </span>
            </button>
            <span
              className="text-xs font-mono text-emerald-400 font-bold"
              id="progressBadge"
              aria-live="polite"
            >
              {t('form.itemsFilled', { filled: totalFilledItems, total: schemaItems.length })}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="categorySelector"
              className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 notranslate"
            >
              <span>{t('form.categorySelectorLabel')}</span>
            </label>
            <button
              id="jumpNextIncompleteBtn"
              type="button"
              onClick={onJumpNextIncomplete}
              className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            >
              <ChevronsRight className="w-3 h-3" aria-hidden="true" />
              <span>{t('form.nextIncomplete')}</span>
            </button>
          </div>
          
          <select
            id="categorySelector"
            value={activeCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            aria-label={t('form.categorySelectorLabel')}
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
                if (answers[id] && (answers[id].never_eaten || answers[id].frequency !== null || answers[id].occasion_home || answers[id].occasion_store || answers[id].occasion_out)) {
                  started++;
                }
              });
              const isComplete = filled === spec.ids.length && spec.ids.length > 0;
              const markIcon = isComplete ? '✅' : started > 0 ? '⏳' : '⚪';
              const localizedCat = tCat(spec.cat);

              return (
                <option key={spec.cat} value={spec.cat}>
                  {markIcon} [{filled}/{spec.ids.length}] {localizedCat} ({spec.ids[0]}～{spec.ids[spec.ids.length - 1]})
                </option>
              );
            })}
          </select>
        </div>

        {/* Form Structure & Shortcut Reference Guide */}
        <div className="grid grid-cols-4 gap-1 text-[10px] pt-0.5 notranslate font-medium">
          <div className="py-1 px-1 rounded bg-rose-500/15 border border-rose-400/40 text-rose-200 text-center font-mono truncate">
            {t('form.guideNever')}
          </div>
          <div className="py-1 px-1 rounded bg-amber-500/15 border border-amber-400/40 text-amber-200 text-center font-mono truncate">
            {t('form.guideFreq')}
          </div>
          <div className="py-1 px-1 rounded bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-center font-mono truncate">
            {t('form.guideOcc')}
          </div>
          <div className="py-1 px-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-center font-mono truncate">
            {t('form.guideReset')}
          </div>
        </div>
      </div>

      {/* Item Form Stream (Memoized individual survey row components) */}
      <div
        id="itemStreamList"
        ref={streamListRef}
        role="region"
        aria-label="Survey items list"
        className="flex-1 overflow-y-auto p-3.5 space-y-2.5 focus:outline-none"
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
            onToggleNeverEaten={toggleNeverHandler}
            onSelectFrequency={onSelectFrequency}
            onToggleOccasion={toggleOccasionHandler}
            onClearRow={onClearRow}
          />
        ))}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#090d16] border-t border-slate-800 space-y-2 shrink-0">
        {/* TSV Format Mode Selector (Horizontal 1-Row for Cell C4 vs Vertical for Debug) */}
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('form.tsvFormatLabel')}</span>
          </span>
          <div className="inline-flex rounded-md bg-slate-900 border border-slate-700 p-0.5" role="radiogroup" aria-label="TSV Export Format">
            <button
              id="tsvFormatHorizontalBtn"
              type="button"
              role="radio"
              aria-checked={tsvExportMode === 'horizontal'}
              onClick={() => onToggleTsvExportMode('horizontal')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                tsvExportMode === 'horizontal'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('form.tsvHorizontal')}
            </button>
            <button
              id="tsvFormatVerticalBtn"
              type="button"
              role="radio"
              aria-checked={tsvExportMode === 'vertical'}
              onClick={() => onToggleTsvExportMode('vertical')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                tsvExportMode === 'vertical'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('form.tsvVertical')}
            </button>
          </div>
        </div>

        {/* Primary TSV Action & Active Category Reset */}
        <div className="flex items-center gap-2">
          <button
            id="copyTsvBtn"
            type="button"
            onClick={onCopyTsv}
            title={tsvExportMode === 'horizontal' ? t('form.copyHorizontalTsv') : t('form.copyVerticalTsv')}
            className="flex-1 py-1.5 bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 hover:text-white text-xs font-semibold rounded-lg border border-sky-500/50 shadow-sm transition flex items-center justify-center gap-1.5 notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="truncate">
              {tsvExportMode === 'horizontal' ? t('form.copyHorizontalTsv') : t('form.copyVerticalTsv')}
            </span>
          </button>

          <button
            id="clearCategoryMarksBtn"
            type="button"
            onClick={onClearActiveCategory}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 text-xs font-medium rounded-lg border border-slate-700 hover:border-rose-700/60 transition notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer shrink-0"
          >
            {t('form.clearCategory')}
          </button>
        </div>

        {/* One-Click Full Survey 1-Row Copy for Excel Cell C4 */}
        <div className="flex items-center gap-2">
          <button
            id="copyAllHorizontalTsvBtn"
            type="button"
            onClick={onCopyAllHorizontalTsv}
            title="Excel C4セル貼付用: 全175項目を横1行のタブ区切り（875列）でコピー"
            className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-200 text-[11px] font-medium rounded-lg border border-slate-700/80 hover:border-sky-500/50 transition flex items-center justify-center gap-1.5 notranslate focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 cursor-pointer"
          >
            <Rows className="w-3 h-3 text-sky-400" aria-hidden="true" />
            <span className="truncate">{t('form.copyAllHorizontalTsv')}</span>
          </button>
        </div>

        {/* 1984 Nutrition Survey CSV Export */}
        <button
          id="downloadCsvBtn"
          type="button"
          onClick={onDownloadCsv}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>{t('form.downloadCsv')}</span>
        </button>
      </div>
    </section>
  );
};
