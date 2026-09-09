/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { DocumentViewer } from './components/DocumentViewer';
import { FormPanel } from './components/FormPanel';
import { CategoryMatrixModal } from './components/CategoryMatrixModal';
import { IncompleteWarningModal } from './components/IncompleteWarningModal';
import { ToastContainer } from './components/ToastContainer';
import {
  RAW_1984_SPEC,
  FULL_175_SCHEMA,
  createSampleSurveyFormImage,
  isRowComplete,
  isRowStarted
} from './data/surveySchema';
import { SelectionBox, ToastMessage, CategoryStatus, SurveyRowAnswer } from './types';

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export default function App() {
  // Survey and Image State
  const [imageSource, setImageSource] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  // PDF State
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfCurrentPage, setPdfCurrentPage] = useState<number>(1);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(1);
  const [docName, setDocName] = useState<string>('Survey Document');

  // Form State (Structured SurveyRowAnswer per row)
  const [activeCategory, setActiveCategory] = useState<string>(RAW_1984_SPEC[0].cat);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, SurveyRowAnswer>>({});

  // Modals & UI State
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);
  const [isIncompleteWarningOpen, setIsIncompleteWarningOpen] = useState<boolean>(false);
  const [incompleteList, setIncompleteList] = useState<CategoryStatus[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = useCallback((text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  // Configure PDF.js worker
  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }, []);

  // Render PDF Page helper
  const renderPdfPage = useCallback(async (doc: any, pageNo: number) => {
    try {
      const page = await doc.getPage(pageNo);
      const vp = page.getViewport({ scale: 2.2 });
      const off = document.createElement('canvas');
      off.width = vp.width;
      off.height = vp.height;
      const ctx = off.getContext('2d');
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        setImageSource(off);
        setImageRotation(0);
        setSelectionBox(null);
        setPdfCurrentPage(pageNo);
      }
    } catch (err) {
      console.error('Error rendering PDF page:', err);
      showToast('PDF ページの描画に失敗しました', 'warning');
    }
  }, [showToast]);

  // File Upload Processor
  const handleFileUpload = useCallback(async (file: File) => {
    setDocName(file.name);
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const buffer = await file.arrayBuffer();
        if (window.pdfjsLib) {
          const doc = await window.pdfjsLib.getDocument({ data: buffer }).promise;
          setPdfDoc(doc);
          setPdfTotalPages(doc.numPages);
          await renderPdfPage(doc, 1);
          showToast(`PDF loaded (${doc.numPages} pages)`, 'success');
        } else {
          showToast('PDF.js library is loading, please try again in a moment', 'warning');
        }
      } catch (err) {
        console.error('Failed to parse PDF:', err);
        showToast('PDFファイルの読み込みに失敗しました', 'warning');
      }
    } else {
      setPdfDoc(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageSource(img);
          setImageRotation(0);
          setSelectionBox(null);
          showToast('Survey scan loaded', 'success');
        };
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }, [renderPdfPage, showToast]);

  // Load Built-in Sample Survey Sheet
  const handleLoadSample = useCallback(() => {
    const sampleCanvas = createSampleSurveyFormImage();
    setImageSource(sampleCanvas);
    setImageRotation(0);
    setSelectionBox(null);
    setPdfDoc(null);
    setDocName('昭和59年 国民栄養調査 食物摂取状況標本票');
    showToast('サンプル調査票を読み込みました（すぐに操作テスト可能）', 'success');
  }, [showToast]);

  // Rotate Image
  const handleRotate = useCallback(() => {
    if (!imageSource) return;
    const newRot = (imageRotation + 90) % 360;
    setImageRotation(newRot);
    setSelectionBox(null);
    showToast(`Rotated to ${newRot}°`, 'info');
  }, [imageSource, imageRotation, showToast]);

  // Clear Box
  const handleClearBox = useCallback(() => {
    setSelectionBox(null);
    showToast('Cleared selection box', 'info');
  }, [showToast]);

  // Toggle "① 食べたことがない" - clears frequency and occasion
  const handleToggleNotEaten = useCallback((itemId: number) => {
    setAnswers(prev => {
      const cur = prev[itemId];
      if (cur?.notEaten) {
        return {
          ...prev,
          [itemId]: { notEaten: false, frequency: null, occasion: null }
        };
      } else {
        return {
          ...prev,
          [itemId]: { notEaten: true, frequency: null, occasion: null }
        };
      }
    });
  }, []);

  // Select Frequency
  const handleSelectFrequency = useCallback((itemId: number, freq: 1 | 2 | 3) => {
    setAnswers(prev => {
      const cur = prev[itemId];
      return {
        ...prev,
        [itemId]: {
          notEaten: false,
          frequency: cur?.frequency === freq ? null : freq,
          occasion: cur?.notEaten ? null : (cur?.occasion ?? null)
        }
      };
    });
  }, []);

  // Select Occasion
  const handleSelectOccasion = useCallback((itemId: number, occ: 1 | 2 | 3) => {
    setAnswers(prev => {
      const cur = prev[itemId];
      return {
        ...prev,
        [itemId]: {
          notEaten: false,
          frequency: cur?.notEaten ? null : (cur?.frequency ?? null),
          occasion: cur?.occasion === occ ? null : occ
        }
      };
    });
  }, []);

  // Clear single row
  const handleClearRow = useCallback((itemId: number) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  // Jump next incomplete category
  const handleJumpNextIncomplete = useCallback(() => {
    const currentIdx = RAW_1984_SPEC.findIndex(s => s.cat === activeCategory);
    for (let i = 1; i <= RAW_1984_SPEC.length; i++) {
      const checkIdx = (currentIdx + i) % RAW_1984_SPEC.length;
      const spec = RAW_1984_SPEC[checkIdx];
      const isComplete = spec.ids.every(id => isRowComplete(answers[id]));
      if (!isComplete) {
        setActiveCategory(spec.cat);
        setActiveRowIndex(0);
        showToast(`次の未完了へジャンプ: ${spec.cat}`, 'info');
        return;
      }
    }
    showToast('すべてのカテゴリの入力が完了しています！🎉', 'success');
  }, [activeCategory, answers, showToast]);

  // Clear active category marks
  const handleClearActiveCategory = useCallback(() => {
    const spec = RAW_1984_SPEC.find(s => s.cat === activeCategory);
    if (!spec) return;
    setAnswers(prev => {
      const next = { ...prev };
      spec.ids.forEach(id => {
        delete next[id];
      });
      return next;
    });
    showToast(`${spec.cat} の入力をクリアしました`, 'info');
  }, [activeCategory, showToast]);

  // Generate Survey Export Data mapped to 3 columns per row: [Not Eaten (1 or empty), Frequency (1-3), Occasion (1-3)]
  const generateSurveyExportData = useCallback((delimiter: string = ',') => {
    const header1 = ['Survey File', 'Category'];
    const header2 = ['Filename / Page', 'Field'];
    const dataRow = [
      pdfDoc ? `${docName} (Page ${pdfCurrentPage})` : docName,
      '1984 Survey Form'
    ];

    FULL_175_SCHEMA.forEach(item => {
      // 1. Not Eaten
      header1.push(`"${item.cat}"`);
      header2.push(`"行${item.id}_未食"`);

      // 2. Frequency
      header1.push(`"${item.cat}"`);
      header2.push(`"行${item.id}_頻度"`);

      // 3. Occasion
      header1.push(`"${item.cat}"`);
      header2.push(`"行${item.id}_機会"`);

      const ans = answers[item.id];
      // [Not Eaten (1 or empty), Frequency (1-3), Occasion (1-3)]
      dataRow.push(ans?.notEaten ? '"1"' : '""');
      dataRow.push(ans && !ans.notEaten && ans.frequency !== null ? `"${ans.frequency}"` : '""');
      dataRow.push(ans && !ans.notEaten && ans.occasion !== null ? `"${ans.occasion}"` : '""');
    });

    return [
      header1.join(delimiter),
      header2.join(delimiter),
      dataRow.join(delimiter)
    ].join('\r\n');
  }, [pdfDoc, docName, pdfCurrentPage, answers]);

  // Direct CSV trigger
  const triggerDirectCsvDownload = useCallback(() => {
    const csvContent = '\uFEFF' + generateSurveyExportData(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `1984_Japan_Food_Survey_Transcription_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('1984 Survey CSV downloaded successfully!', 'success');
  }, [generateSurveyExportData, showToast]);

  // Copy TSV to clipboard (3 columns per row)
  const handleCopyTsv = useCallback(async () => {
    const tsvContent = generateSurveyExportData('\t');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(tsvContent);
      } else {
        const ta = document.createElement('textarea');
        ta.value = tsvContent;
        ta.style.position = 'fixed';
        ta.style.left = '-999999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('Copied 1984 TSV to clipboard (Excel 3-Column format)!', 'success');
    } catch {
      showToast('Failed to copy TSV to clipboard', 'warning');
    }
  }, [generateSurveyExportData, showToast]);

  // CSV Download with validation
  const handleDownloadCsv = useCallback(() => {
    const incomplete: CategoryStatus[] = [];
    RAW_1984_SPEC.forEach(spec => {
      let filled = 0;
      let started = 0;
      spec.ids.forEach(id => {
        if (isRowComplete(answers[id])) filled++;
        if (isRowStarted(answers[id])) started++;
      });
      if (filled < spec.ids.length) {
        incomplete.push({
          cat: spec.cat,
          filled,
          total: spec.ids.length,
          isComplete: false,
          isStarted: started > 0
        });
      }
    });

    if (incomplete.length > 0) {
      setIncompleteList(incomplete);
      setIsIncompleteWarningOpen(true);
      return;
    }

    triggerDirectCsvDownload();
  }, [answers, triggerDirectCsvDownload]);

  // Force CSV Export from Warning Modal
  const handleForceExport = useCallback(() => {
    setIsIncompleteWarningOpen(false);
    triggerDirectCsvDownload();
  }, [triggerDirectCsvDownload]);

  // Keyboard navigation & rapid entry
  const stateRef = useRef({
    activeCategory,
    activeRowIndex,
    answers
  });

  useEffect(() => {
    stateRef.current = {
      activeCategory,
      activeRowIndex,
      answers
    };
  }, [activeCategory, activeRowIndex, answers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input or select
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        setSelectionBox(null);
        showToast('Cleared selection box', 'info');
        return;
      }

      const currentCategoryItems = FULL_175_SCHEMA.filter(
        i => i.cat === stateRef.current.activeCategory
      );
      if (
        currentCategoryItems.length === 0 ||
        stateRef.current.activeRowIndex >= currentCategoryItems.length
      ) {
        return;
      }

      const item = currentCategoryItems[stateRef.current.activeRowIndex];
      const curAns = stateRef.current.answers[item.id];

      // 1. '0': Toggles "食べたことがない" and immediately advances focus to the next row
      if (e.key === '0') {
        e.preventDefault();
        const nextNotEaten = !curAns?.notEaten;
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            notEaten: nextNotEaten,
            frequency: null,
            occasion: null
          }
        }));
        if (stateRef.current.activeRowIndex < currentCategoryItems.length - 1) {
          setActiveRowIndex(prev => prev + 1);
        }
        return;
      }

      // 2. Numbers 1-3 for Frequency and Occasion
      if (e.key === '1' || e.key === '2' || e.key === '3') {
        e.preventDefault();
        const val = parseInt(e.key, 10) as 1 | 2 | 3;

        // If frequency is unset (or notEaten was true, or both were already set and user is re-entering)
        if (
          !curAns ||
          curAns.notEaten ||
          curAns.frequency === null ||
          (curAns.frequency !== null && curAns.occasion !== null)
        ) {
          // Pressing numbers 1-3 when frequency is unset selects frequency
          setAnswers(prev => ({
            ...prev,
            [item.id]: {
              notEaten: false,
              frequency: val,
              occasion: null
            }
          }));
          // Waiting for occasion, do not advance row
        } else if (curAns && curAns.frequency !== null && curAns.occasion === null) {
          // Immediately after frequency is chosen, the next 1-3 keypress selects occasion and auto-advances
          setAnswers(prev => ({
            ...prev,
            [item.id]: {
              notEaten: false,
              frequency: curAns.frequency,
              occasion: val
            }
          }));
          if (stateRef.current.activeRowIndex < currentCategoryItems.length - 1) {
            setActiveRowIndex(prev => prev + 1);
          }
        }
        return;
      }

      // 3. Enter or ArrowDown: Next row
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (stateRef.current.activeRowIndex < currentCategoryItems.length - 1) {
          setActiveRowIndex(prev => prev + 1);
        }
        return;
      }

      // 4. ArrowUp: Previous row
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (stateRef.current.activeRowIndex > 0) {
          setActiveRowIndex(prev => prev - 1);
        }
        return;
      }

      // 5. Spacebar: Clears the current row
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setAnswers(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  return (
    <div className="bg-[#090d16] text-slate-100 h-screen w-screen overflow-hidden flex flex-col font-sans select-none notranslate">
      {/* Top Header */}
      <Header
        onFileUpload={handleFileUpload}
        onLoadSample={handleLoadSample}
        onRotate={handleRotate}
        onClearBox={handleClearBox}
        hasDocument={imageSource !== null}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Viewport Canvas (63%) */}
        <DocumentViewer
          imageSource={imageSource}
          imageRotation={imageRotation}
          selectionBox={selectionBox}
          onSelectionBoxChange={setSelectionBox}
          pdfCurrentPage={pdfCurrentPage}
          pdfTotalPages={pdfTotalPages}
          isPdf={pdfDoc !== null}
          onPrevPage={() => {
            if (pdfDoc && pdfCurrentPage > 1) {
              renderPdfPage(pdfDoc, pdfCurrentPage - 1);
            }
          }}
          onNextPage={() => {
            if (pdfDoc && pdfCurrentPage < pdfTotalPages) {
              renderPdfPage(pdfDoc, pdfCurrentPage + 1);
            }
          }}
          onFileUpload={handleFileUpload}
          onLoadSample={handleLoadSample}
        />

        {/* Right Survey Entry Panel (37%) */}
        <FormPanel
          categories={RAW_1984_SPEC}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setActiveRowIndex(0);
          }}
          activeRowIndex={activeRowIndex}
          onSelectRowIndex={setActiveRowIndex}
          answers={answers}
          onToggleNotEaten={handleToggleNotEaten}
          onSelectFrequency={handleSelectFrequency}
          onSelectOccasion={handleSelectOccasion}
          onClearRow={handleClearRow}
          onJumpNextIncomplete={handleJumpNextIncomplete}
          onOpenMatrixModal={() => setIsMatrixOpen(true)}
          onCopyTsv={handleCopyTsv}
          onClearActiveCategory={handleClearActiveCategory}
          onDownloadCsv={handleDownloadCsv}
          schemaItems={FULL_175_SCHEMA}
        />
      </main>

      {/* 54 Category Progress Matrix Modal */}
      <CategoryMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        categories={RAW_1984_SPEC}
        answers={answers}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveRowIndex(0);
        }}
      />

      {/* Incomplete Warning Modal */}
      <IncompleteWarningModal
        isOpen={isIncompleteWarningOpen}
        onClose={() => setIsIncompleteWarningOpen(false)}
        incompleteCategories={incompleteList}
        onForceExport={handleForceExport}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
