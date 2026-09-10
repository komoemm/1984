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
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="incompleteDialogTitle" className="font-bold text-sm text-amber-300">
              {t('modal.warningTitle')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('modal.warningSubtitle')}
            </p>
          </div>
        </div>

        <div
          id="missingCategoriesList"
          className="my-3 max-h-48 overflow-y-auto p-2 bg-[#090d16] rounded-lg border border-slate-800 space-y-1 text-xs"
        >
          {incompleteCategories.map((stat) => (
            <div
              key={stat.cat}
              className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-900 rounded transition"
            >
              <span className="font-medium text-slate-200">{tCat(stat.cat)}</span>
              <span className="font-mono text-amber-400 font-semibold">
                {t('modal.warningFilled', { filled: stat.filled, total: stat.total })}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            id="cancelExportBtn"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            {t('modal.returnToForm')}
          </button>
          <button
            id="forceExportCsvBtn"
            onClick={onForceExport}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer"
          >
            {t('modal.forceExport')}
          </button>
        </div>
      </div>
    </div>
  );
};
