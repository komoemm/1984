import React, { useEffect, useRef, useMemo } from 'react';
import {
  LayoutGrid,
  ChevronsRight,
  Copy,
  Download,
  Check,
  RotateCcw
} from 'lucide-react';
import { CategorySpec, SurveyItem, SurveyRowData } from '../types';
import { isRowComplete, isRowStarted } from '../data/surveySchema';
import { useLanguage } from '../context/LanguageContext';

interface FrequencyOptionButtonProps {
  itemId: number;
  value: 1 | 2 | 3;
  label: string;
  isSelected: boolean;
  onSelect: (itemId: number, freq: 1 | 2 | 3) => void;
  ariaLabel: string;
}

const FrequencyOptionButton = React.memo<FrequencyOptionButtonProps>(({
  itemId,
  value,
  label,
  isSelected,
  onSelect,
  ariaLabel
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
      aria-label={ariaLabel}
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
  type: 'home' | 'store' | 'out';
  code: 1 | 2 | 3;
  label: string;
  badgeLabel: string;
  isSelected: boolean;
  onToggle: (itemId: number, occ: 'home' | 'store' | 'out' | 1 | 2 | 3) => void;
  ariaLabel: string;
}

const OccasionOptionButton = React.memo<OccasionOptionButtonProps>(({
  itemId,
  type,
  code,
  label,
  badgeLabel,
  isSelected,
  onToggle,
  ariaLabel
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(itemId, type);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`py-1.5 px-1 text-center font-medium text-[11px] rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 cursor-pointer flex items-center justify-center gap-1 ${
        isSelected
          ? 'bg-emerald-400 text-slate-950 font-bold border-2 border-emerald-200 shadow-sm ring-1 ring-emerald-300'
          : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700'
      }`}
    >
      <span className="truncate">{label}</span>
      {isSelected && (
        <span
          className="px-1 py-0.2 bg-slate-950 text-emerald-300 font-mono text-[10px] rounded font-black border border-emerald-300/60"
          aria-hidden="true"
        >
          : 1
        </span>
      )}
    </button>
  );
});
OccasionOptionButton.displayName = 'OccasionOptionButton';

interface SurveyRowItemProps {
  item: SurveyItem;
  rowIndex: number;
  isActive: boolean;
  ans?: SurveyRowData;
  onSelectRowIndex: (idx: number) => void;
  onToggleNeverEaten: (itemId: number) => void;
  onSelectFrequency: (itemId: number, freq: 1 | 2 | 3) => void;
  onToggleOccasion: (itemId: number, occ: 'home' | 'store' | 'out' | 1 | 2 | 3) => void;
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
  onToggleOccasion,
  onClearRow
}) => {
  const { t } = useLanguage();
  const isNeverEaten = ans ? Boolean(ans.never_eaten || ans.neverEaten || ans.notEaten) : false;
  const complete = isRowComplete(ans);
  const started = isRowStarted(ans);

  const isHome = Boolean(ans?.occasion_home);
  const isStore = Boolean(ans?.occasion_store);
  const isOut = Boolean(ans?.occasion_out);

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

  const freqOptions = [
    { value: 1 as const, label: t('form.freq1') },
    { value: 2 as const, label: t('form.freq2') },
    { value: 3 as const, label: t('form.freq3') }
  ];

  const occOptions = [
    { code: 1 as const, type: 'home' as const, label: t('form.occ1'), badge: t('form.occHomeBadge') },
    { code: 2 as const, type: 'store' as const, label: t('form.occ2'), badge: t('form.occStoreBadge') },
    { code: 3 as const, type: 'out' as const, label: t('form.occ3'), badge: t('form.occOutBadge') }
  ];

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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 shrink-0">
          <span
            className={`font-mono text-xs px-2.5 py-0.5 rounded border font-extrabold tracking-wide ${
              isActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-400/30'
                : 'bg-slate-950 border-slate-700 text-amber-300'
            }`}
          >
            {t('form.line', { id: item.id })}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            #{String(item.id).padStart(3, '0')}
          </span>
        </div>

        {/* State Tag & Quick Reset */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {isNeverEaten && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-200 border border-rose-400/80 flex items-center gap-1 font-mono"
              aria-label={`Item ${item.id} ${t('form.neverEatenBadge')}`}
            >
              <Check className="w-3 h-3 text-rose-300" aria-hidden="true" /> {t('form.neverEatenBadge')}
            </span>
          )}

          {ans && ans.frequency !== null && (
            <span
              className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-200 font-bold border border-amber-400/80 text-[10px] font-mono"
              aria-label={`Item ${item.id} Frequency ${ans.frequency}`}
            >
              {t('form.freqBadge', { val: ans.frequency })}
            </span>
          )}

          {isHome && (
            <span
              className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-200 font-bold border border-emerald-400/80 text-[10px] font-mono"
              aria-label={`Item ${item.id} ${t('form.occHomeBadge')}`}
            >
              {t('form.occHomeBadge')}
            </span>
          )}

          {isStore && (
            <span
              className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-200 font-bold border border-emerald-400/80 text-[10px] font-mono"
              aria-label={`Item ${item.id} ${t('form.occStoreBadge')}`}
            >
              {t('form.occStoreBadge')}
            </span>
          )}

          {isOut && (
            <span
              className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-200 font-bold border border-emerald-400/80 text-[10px] font-mono"
              aria-label={`Item ${item.id} ${t('form.occOutBadge')}`}
            >
              {t('form.occOutBadge')}
            </span>
          )}

          {!started && (
            <span className="text-[10px] text-slate-400 font-mono">
              {t('form.unselected')}
            </span>
          )}

          {started && (
            <button
              type="button"
              title={t('form.clearRowTitle')}
              aria-label={t('form.clearRowTitle')}
              onClick={handleClearClick}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Independent Toggle Button for "① 食べたことがない" / "① Never eaten" */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isNeverEaten}
        aria-label={`${t('form.line', { id: item.id })}: ${t('form.neverEatenOption')}`}
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
          <span>{t('form.neverEatenOption')}</span>
          {isNeverEaten && (
            <span className="px-1.5 py-0.2 bg-rose-950 text-rose-200 font-mono text-[10px] rounded font-black border border-rose-400/60">
              : 1
            </span>
          )}
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-slate-300 border border-slate-700">
          {t('form.key0Badge')}
        </span>
      </button>

      {/* 2. Independent Grouped Sub-rows for 頻度 (Frequency) and 機会 (Occasion) */}
      <div className="space-y-1.5">
        {/* Group A (Frequency): 3 buttons (Single choice) */}
        <div
          role="group"
          aria-label={`${t('form.line', { id: item.id })} ${t('form.freqGroupLabel')}`}
          className="flex items-center gap-1.5"
        >
          <div className="w-16 shrink-0 py-1 text-center font-bold text-[10px] rounded bg-amber-500/20 border border-amber-400/40 text-amber-200">
            {t('form.freqGroupLabel')}
          </div>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {freqOptions.map((opt) => (
              <FrequencyOptionButton
                key={opt.value}
                itemId={item.id}
                value={opt.value}
                label={opt.label}
                isSelected={ans?.frequency === opt.value}
                onSelect={onSelectFrequency}
                ariaLabel={`${t('form.line', { id: item.id })} ${t('form.freqGroupLabel')}: ${opt.label}`}
              />
            ))}
          </div>
        </div>

        {/* Group B (Occasion): 3 independent multi-toggle buttons */}
        <div
          role="group"
          aria-label={`${t('form.line', { id: item.id })} ${t('form.occGroupLabel')}`}
          className="flex items-center gap-1.5"
        >
          <div className="w-16 shrink-0 py-1 text-center font-bold text-[10px] rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200">
            {t('form.occGroupLabel')}
          </div>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {occOptions.map((opt) => {
              const isSelected =
                opt.type === 'home' ? isHome :
                opt.type === 'store' ? isStore :
                isOut;

              return (
                <OccasionOptionButton
                  key={opt.code}
                  itemId={item.id}
                  type={opt.type}
                  code={opt.code}
                  label={opt.label}
                  badgeLabel={opt.badge}
                  isSelected={isSelected}
                  onToggle={onToggleOccasion}
                  ariaLabel={`${t('form.line', { id: item.id })} ${t('form.occGroupLabel')}: ${opt.label}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  if (prev.isActive !== next.isActive) return false;
  if (prev.rowIndex !== next.rowIndex) return false;
  if (prev.item.id !== next.item.id) return false;

  const prevNever = Boolean(prev.ans?.never_eaten || prev.ans?.neverEaten || prev.ans?.notEaten);
  const nextNever = Boolean(next.ans?.never_eaten || next.ans?.neverEaten || next.ans?.notEaten);
  if (prevNever !== nextNever) return false;

  if ((prev.ans?.frequency ?? null) !== (next.ans?.frequency ?? null)) return false;
  if (Boolean(prev.ans?.occasion_home) !== Boolean(next.ans?.occasion_home)) return false;
  if (Boolean(prev.ans?.occasion_store) !== Boolean(next.ans?.occasion_store)) return false;
  if (Boolean(prev.ans?.occasion_out) !== Boolean(next.ans?.occasion_out)) return false;

  return true;
});
SurveyRowItem.displayName = 'SurveyRowItem';

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
  onToggleOccasion,
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
  const { t, tCat } = useLanguage();

  const toggleHandler = onToggleNeverEaten || onToggleNotEaten || (() => {});
  const occasionHandler = onToggleOccasion || ((id: number, occ: 'home' | 'store' | 'out' | 1 | 2 | 3) => {
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
                if (isRowStarted(answers[id])) started++;
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

        {/* Form Structure Reference Guide */}
        <div className="flex items-center gap-1.5 text-[10px] pt-0.5 notranslate font-medium">
          <div className="flex-1 py-1 px-2 rounded bg-rose-500/15 border border-rose-400/40 text-rose-200 text-center font-mono">
            {t('form.guideNever')}
          </div>
          <div className="flex-[1.4] py-1 px-2 rounded bg-amber-500/15 border border-amber-400/40 text-amber-200 text-center font-mono">
            {t('form.guideFreq')}
          </div>
          <div className="flex-[1.4] py-1 px-2 rounded bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-center font-mono">
            {t('form.guideOcc')}
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
            onToggleOccasion={occasionHandler}
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
            <Copy className="w-3.5 h-3.5" aria-hidden="true" /> {t('form.copyTsv')}
          </button>
          <button
            id="clearCategoryMarksBtn"
            type="button"
            onClick={onClearActiveCategory}
            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 text-xs font-medium rounded-lg border border-slate-700 transition notranslate focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
          >
            {t('form.clearCategory')}
          </button>
        </div>

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
