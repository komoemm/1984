import React from 'react';
import {
  FileSpreadsheet,
  FileUp,
  RotateCw,
  Scan,
  FileText,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onFileUpload: (file: File) => void;
  onLoadSample: () => void;
  onRotate: () => void;
  onClearBox: () => void;
  hasDocument: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onFileUpload,
  onLoadSample,
  onRotate,
  onClearBox,
  hasDocument
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { lang, setLang, t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <header className="h-14 bg-[#111827] border-b border-slate-800 px-4 flex items-center justify-between shrink-0 shadow-lg z-30 notranslate select-none">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-lg shadow-md" aria-hidden="true">
          <FileSpreadsheet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 notranslate">
            <span>{t('header.appTitle')}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {t('header.badge')}
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 hidden sm:block notranslate">
            {t('header.appSubtitle')}
          </p>
        </div>
      </div>

      {/* Action Controls & Language Switcher & Quick Shortcuts */}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          aria-label={t('header.loadSurvey')}
          onChange={handleFileChange}
        />

        {/* Compact Modern Language Switcher Pill */}
        <div
          role="group"
          aria-label="Language switcher"
          className="flex items-center bg-slate-900 border border-slate-700/80 rounded-full p-0.5 shadow-inner"
        >
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 hidden sm:inline-block" aria-hidden="true" />
          <button
            id="langJaBtn"
            type="button"
            role="button"
            aria-pressed={lang === 'ja'}
            aria-label="日本語 (Japanese)"
            onClick={() => setLang('ja')}
            className={`px-2 py-0.5 rounded-full transition text-[11px] font-bold tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
              lang === 'ja'
                ? 'bg-sky-400 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            JA
          </button>
          <button
            id="langEnBtn"
            type="button"
            role="button"
            aria-pressed={lang === 'en'}
            aria-label="English"
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded-full transition text-[11px] font-bold tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
              lang === 'en'
                ? 'bg-sky-400 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        <button
          id="uploadBtn"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-lg text-white shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          <FileUp className="w-4 h-4" />
          <span className="hidden sm:inline">{t('header.loadSurvey')}</span>
          <span className="sm:hidden">{t('header.load')}</span>
        </button>

        {!hasDocument && (
          <button
            id="loadSampleBtn"
            onClick={onLoadSample}
            title={t('header.sampleForm')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">{t('header.sampleForm')}</span>
          </button>
        )}

        <button
          id="rotateBtn"
          onClick={onRotate}
          title={t('header.rotate')}
          aria-label={t('header.rotate')}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          id="clearBoxBtn"
          onClick={onClearBox}
          title={t('header.clearBox')}
          aria-label={t('header.clearBox')}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
        >
          <Scan className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden lg:block" />

        {/* Quick Key Badges */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400" aria-label="Keyboard Shortcuts">
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-rose-300 font-mono">
            {t('header.key0')}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono">
            {t('header.key13')}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono">
            {t('header.key79')}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">
            {t('header.keySpace')}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono">
            {t('header.keyEnter')}
          </span>
        </div>
      </div>
    </header>
  );
};
