import React from 'react';
import {
  FileSpreadsheet,
  FileUp,
  RotateCw,
  Scan,
  FileText
} from 'lucide-react';

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
            <span>1984 Japan Food Survey Digitizer</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              190品目 定義済
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 hidden sm:block notranslate">
            昭和59年 国民栄養調査 食物摂取頻度調査票（人手照合 &amp; 列番号入力システム）
          </p>
        </div>
      </div>

      {/* Document Controls & Quick Shortcut Badges */}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          aria-label="Upload survey file"
          onChange={handleFileChange}
        />
        
        <button
          id="uploadBtn"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-lg text-white shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          <FileUp className="w-4 h-4" />
          <span className="hidden sm:inline">Load Survey (PDF/Img)</span>
          <span className="sm:hidden">Load</span>
        </button>

        {!hasDocument && (
          <button
            id="loadSampleBtn"
            onClick={onLoadSample}
            title="Load Sample 1984 Survey Form"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">Sample Form</span>
          </button>
        )}

        <button
          id="rotateBtn"
          onClick={onRotate}
          title="Rotate 90° Clockwise"
          aria-label="Rotate image 90 degrees clockwise"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          id="clearBoxBtn"
          onClick={onClearBox}
          title="Clear Bounding Box (C)"
          aria-label="Clear Crop Region Selection Box"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
        >
          <Scan className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden lg:block" />

        {/* Quick Key Badges */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400" aria-label="Keyboard Shortcuts">
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-rose-300 font-mono">0: 未食(Next)</span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono">1–3: 頻度→機会(Next)</span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Space: クリア</span>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono">Enter/↓: 次へ</span>
        </div>
      </div>
    </header>
  );
};
