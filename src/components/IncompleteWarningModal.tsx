import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CategoryStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface IncompleteWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  incompleteCategories: CategoryStatus[];
  onForceExport: () => void;
}

export const IncompleteWarningModal: React.FC<IncompleteWarningModalProps> = ({
  isOpen,
  onClose,
  incompleteCategories,
  onForceExport
}) => {
  const { t, tCat } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      id="incompleteConfirmModal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="incompleteDialogTitle"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 notranslate select-none"
    >
      <div className="bg-[#111827] border border-amber-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl">
        <div className="flex items-start space-x-3 mb-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="incompleteDialogTitle" className="font-bold text-sm text-amber-300">
              {t('modal.warningTitle')}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {t('modal.warningDesc')}
            </p>
          </div>
        </div>

        {/* Incomplete Categories Summary Banner */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs">
          <span className="font-medium text-amber-200">
            {t('modal.incompleteCount', { count: incompleteCategories.length })}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {incompleteCategories.reduce((acc, c) => acc + c.filled, 0)} / {incompleteCategories.reduce((acc, c) => acc + c.total, 0)}
          </span>
        </div>

        <div
          id="missingCategoriesList"
          className="my-3 max-h-48 overflow-y-auto p-2 bg-[#090d16] rounded-lg border border-slate-800 space-y-1 text-xs"
        >
          {incompleteCategories.map((stat) => (
            <div
              key={stat.cat}
              className="flex items-center justify-between py-1 px-2 hover:bg-slate-900 rounded transition"
            >
              <span className="font-medium text-slate-200">{tCat(stat.cat)}</span>
              <span className="font-mono text-amber-300 font-bold">
                {t('modal.warningFilled', { filled: stat.filled, total: stat.total })}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
          <button
            id="cancelExportBtn"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-lg transition cursor-pointer"
          >
            {t('modal.cancelBtn')}
          </button>
          <button
            id="forceExportCsvBtn"
            onClick={onForceExport}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md transition cursor-pointer border border-amber-400/40"
          >
            {t('modal.confirmBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
