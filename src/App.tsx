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
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import {
  RAW_1984_SPEC,
  FULL_175_SCHEMA,
  createSampleSurveyFormImage,
  isRowComplete
} from './data/surveySchema';
import { SelectionBox, ToastMessage, CategoryStatus, SurveyRowAnswer } from './types';

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

function SurveyAppContent() {
  const { t, tCat } = useLanguage();

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
  const [tsvExportMode, setTsvExportMode] = useState<'horizontal' | 'vertical'>('horizontal');

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
      showToast(t('toast.pdfRenderError'), 'warning');
    }
  }, [showToast, t]);

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
        } else {
          showToast('PDF.js library not loaded yet', 'warning');
        }
      } catch (err) {
        console.error('PDF parsing error:', err);
        showToast('PDF read failure', 'warning');
      }
    } else {
      // Standard image
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageSource(img);
          setImageRotation(0);
          setSelectionBox(null);
          setPdfDoc(null);
          setPdfCurrentPage(1);
          setPdfTotalPages(1);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [renderPdfPage, showToast]);

  // Load Built-in 1984 Sample Survey Form
  const handleLoadSample = useCallback(() => {
    const sampleCanvas = createSampleSurveyFormImage();
    setImageSource(sampleCanvas);
    setImageRotation(0);
    setSelectionBox(null);
    setPdfDoc(null);
    setPdfCurrentPage(1);
    setPdfTotalPages(1);
    setDocName('昭和59年_国民栄養調査_食物摂取頻度調査票(サンプル).png');
    showToast(t('toast.sampleLoaded'), 'info');
  }, [showToast, t]);

  // Rotate Image 90 deg
  const handleRotate = useCallback(() => {
    setImageRotation(prev => (prev + 90) % 360);
  }, []);

  // Clear Selection Box
  const handleClearBox = useCallback(() => {
    setSelectionBox(null);
    showToast(t('toast.selectionBoxCleared'), 'info');
  }, [showToast, t]);

  // 1. Independent Toggle for "① 食べたことがない" (Never eaten)
  const handleToggleNeverEaten = useCallback((itemId: number) => {
    setAnswers(prev => {
      const cur = prev[itemId];
      const isCurrentlyNever = cur ? Boolean(cur.neverEaten || cur.never_eaten || cur.notEaten) : false;
      const nextNever = !isCurrentlyNever;

      return {
        ...prev,
        [itemId]: {
          neverEaten: nextNever,
          never_eaten: nextNever,
          notEaten: nextNever,
          frequency: cur?.frequency ?? null,
          occasion: cur?.occasion ?? null
        }
      };
    });
  }, []);

  // 2. Independent Select for "② 頻度" (Frequency)
  const handleSelectFrequency = useCallback((itemId: number, freq: 1 | 2 | 3) => {
    setAnswers(prev => {
      const cur = prev[itemId];
      const isCurrentlyNever = cur ? Boolean(cur.neverEaten || cur.never_eaten || cur.notEaten) : false;
      return {
        ...prev,
        [itemId]: {
          neverEaten: isCurrentlyNever,
          never_eaten: isCurrentlyNever,
          notEaten: isCurrentlyNever,
          frequency: cur?.frequency === freq ? null : freq,
          occasion: cur?.occasion ?? null
        }
      };
    });
  }, []);

  // 3. Independent Multi-Toggle for "③ 機会" (Occasion: 1: Homemade, 2: Prepared/Store, 3: Dining out)
  const handleToggleOccasion = useCallback((itemId: number, occ: 'home' | 'store' | 'out' | 1 | 2 | 3) => {
    setAnswers(prev => {
      const cur = prev[itemId];
      const isCurrentlyNever = cur ? Boolean(cur.never_eaten || cur.neverEaten || cur.notEaten) : false;

      let nextHome = Boolean(cur?.occasion_home);
      let nextStore = Boolean(cur?.occasion_store);
      let nextOut = Boolean(cur?.occasion_out);

      if (occ === 'home' || occ === 1) {
        nextHome = !nextHome;
      } else if (occ === 'store' || occ === 2) {
        nextStore = !nextStore;
      } else if (occ === 'out' || occ === 3) {
        nextOut = !nextOut;
      }

      return {
        ...prev,
        [itemId]: {
          neverEaten: isCurrentlyNever,
          never_eaten: isCurrentlyNever,
          notEaten: isCurrentlyNever,
          frequency: cur?.frequency ?? null,
          occasion_home: nextHome,
          occasion_store: nextStore,
          occasion_out: nextOut,
          // Compatibility
          occasion: nextHome ? 1 : nextStore ? 2 : nextOut ? 3 : null
        }
      };
    });
  }, []);

  // Clear single row with explicit false and null values across all 5 fields
  const handleClearRow = useCallback((itemId: number) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: {
        neverEaten: false,
        never_eaten: false,
        notEaten: false,
        frequency: null,
        occasion_home: false,
        occasion_store: false,
        occasion_out: false,
        occasion: null
      }
    }));
    showToast(t('toast.rowReset', { id: itemId }), 'info');
  }, [showToast, t]);

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
        showToast(t('toast.jumpNext', { cat: tCat(spec.cat) }), 'info');
        return;
      }
    }
    showToast(t('toast.allCompleted'), 'success');
  }, [activeCategory, answers, showToast, t, tCat]);

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
    showToast(t('toast.categoryCleared', { cat: tCat(spec.cat) }), 'info');
  }, [activeCategory, showToast, t, tCat]);

  // Generate Survey Export Data mapped to customer's 5 columns per item:
  // [Never Eaten, Frequency, Occasion-Home, Occasion-Store, Occasion-DiningOut]
  const generateSurveyExportData = useCallback((delimiter: string = ',') => {
    const header1 = ['Survey File', 'Category'];
    const header2 = ['Filename / Page', 'Field'];
    const dataRow = [
      pdfDoc ? `${docName} (Page ${pdfCurrentPage})` : docName,
      '1984 Survey Form'
    ];

    FULL_175_SCHEMA.forEach(item => {
      // 5 Columns per item: [Never Eaten] [Frequency] [Occasion-Home] [Occasion-Store] [Occasion-DiningOut]
      header1.push(`"${item.cat}"`, `"${item.cat}"`, `"${item.cat}"`, `"${item.cat}"`, `"${item.cat}"`);
      header2.push(
        `"行${item.id}_未食"`,
        `"行${item.id}_頻度"`,
        `"行${item.id}_機会_家"`,
        `"行${item.id}_機会_調理"`,
        `"行${item.id}_機会_外食"`
      );

      const ans = answers[item.id];
      const isNever = ans ? Boolean(ans.never_eaten || ans.neverEaten || ans.notEaten) : false;
      const isTab = delimiter === '\t';

      // Col 1 (食べたことない): row.never_eaten ? "1" : ""
      const col1 = isNever ? (isTab ? '1' : '"1"') : (isTab ? '' : '""');
      // Col 2 (頻度): row.frequency ? row.frequency.toString() : ""
      const col2 = ans && ans.frequency !== null && ans.frequency !== undefined ? (isTab ? String(ans.frequency) : `"${ans.frequency}"`) : (isTab ? '' : '""');
      // Col 3 (機会 家): row.occasion_home ? "1" : ""
      const col3 = ans && ans.occasion_home ? (isTab ? '1' : '"1"') : (isTab ? '' : '""');
      // Col 4 (機会 調理): row.occasion_store ? "1" : ""
      const col4 = ans && ans.occasion_store ? (isTab ? '1' : '"1"') : (isTab ? '' : '""');
      // Col 5 (機会 外食): row.occasion_out ? "1" : ""
      const col5 = ans && ans.occasion_out ? (isTab ? '1' : '"1"') : (isTab ? '' : '""');

      dataRow.push(col1, col2, col3, col4, col5);
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
    showToast(t('toast.csvDownloaded'), 'success');
  }, [generateSurveyExportData, showToast, t]);

  // Helper to copy text to clipboard across all browser environments
  const copyTextToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-999999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      return success;
    } catch {
      return false;
    }
  }, []);

  // Helper to extract 5 Excel columns per survey item
  // Col 1: 食べたことない (1 or empty)
  // Col 2: 頻度 (1, 2, 3 or empty)
  // Col 3: 機会 家 (1 or empty)
  // Col 4: 機会 調理 (1 or empty)
  // Col 5: 機会 外食 (1 or empty)
  const getItemFiveColumns = useCallback((itemId: number) => {
    const ans = answers[itemId];
    const isNever = ans ? Boolean(ans.never_eaten || ans.neverEaten || ans.notEaten) : false;
    return [
      isNever ? '1' : '',
      ans && ans.frequency !== null && ans.frequency !== undefined ? String(ans.frequency) : '',
      ans && ans.occasion_home ? '1' : '',
      ans && ans.occasion_store ? '1' : '',
      ans && ans.occasion_out ? '1' : ''
    ];
  }, [answers]);

  // Copy Horizontal TSV for Current Category (Single line, tab-separated for Excel Cell C4)
  const handleCopyHorizontalTsv = useCallback(async () => {
    const currentCategoryItems = FULL_175_SCHEMA.filter(i => i.cat === activeCategory);
    const cells: string[] = [];
    currentCategoryItems.forEach(item => {
      cells.push(...getItemFiveColumns(item.id));
    });
    const tsvContent = cells.join('\t');
    const ok = await copyTextToClipboard(tsvContent);
    if (ok) {
      showToast(
        t('toast.horizontalTsvCopied', {
          cat: tCat(activeCategory),
          cols: cells.length
        }),
        'success'
      );
    } else {
      showToast('Failed to copy TSV to clipboard', 'warning');
    }
  }, [activeCategory, copyTextToClipboard, getItemFiveColumns, showToast, t, tCat]);

  // Copy Vertical TSV for Current Category (Lines of 5 columns, debug view)
  const handleCopyVerticalTsv = useCallback(async () => {
    const currentCategoryItems = FULL_175_SCHEMA.filter(i => i.cat === activeCategory);
    const lines = currentCategoryItems.map(item => getItemFiveColumns(item.id).join('\t'));
    const tsvContent = lines.join('\r\n');
    const ok = await copyTextToClipboard(tsvContent);
    if (ok) {
      showToast(
        t('toast.verticalTsvCopied', {
          cat: tCat(activeCategory),
          count: currentCategoryItems.length
        }),
        'success'
      );
    } else {
      showToast('Failed to copy TSV to clipboard', 'warning');
    }
  }, [activeCategory, copyTextToClipboard, getItemFiveColumns, showToast, t, tCat]);

  // Copy All 175 Items as ONE HORIZONTAL ROW (875 columns tab-separated for Cell C4)
  const handleCopyAllHorizontalTsv = useCallback(async () => {
    const cells: string[] = [];
    FULL_175_SCHEMA.forEach(item => {
      cells.push(...getItemFiveColumns(item.id));
    });
    const tsvContent = cells.join('\t');
    const ok = await copyTextToClipboard(tsvContent);
    if (ok) {
      showToast(t('toast.allHorizontalTsvCopied'), 'success');
    } else {
      showToast('Failed to copy TSV to clipboard', 'warning');
    }
  }, [copyTextToClipboard, getItemFiveColumns, showToast, t]);

  // Primary Copy Handler dispatched based on tsvExportMode
  const handleCopyTsv = useCallback(() => {
    if (tsvExportMode === 'horizontal') {
      handleCopyHorizontalTsv();
    } else {
      handleCopyVerticalTsv();
    }
  }, [tsvExportMode, handleCopyHorizontalTsv, handleCopyVerticalTsv]);

  // CSV Download with validation
  const handleDownloadCsv = useCallback(() => {
    const incomplete: CategoryStatus[] = [];
    RAW_1984_SPEC.forEach(spec => {
      let filled = 0;
      let started = 0;
      spec.ids.forEach(id => {
        if (isRowComplete(answers[id])) filled++;
        if (answers[id] !== undefined) started++;
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
      const targetTag = document.activeElement?.tagName;
      if (
        targetTag === 'INPUT' ||
        targetTag === 'SELECT' ||
        targetTag === 'BUTTON' ||
        targetTag === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        setSelectionBox(null);
        showToast(t('toast.selectionBoxCleared'), 'info');
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
      const currentNever = curAns ? Boolean(curAns.neverEaten || curAns.never_eaten || curAns.notEaten) : false;

      // 1. '0': Toggles Option 1 ("食べたことがない") independently WITHOUT advancing
      if (e.key === '0') {
        e.preventDefault();
        const nextNever = !currentNever;
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            neverEaten: nextNever,
            never_eaten: nextNever,
            notEaten: nextNever,
            frequency: curAns?.frequency ?? null,
            occasion_home: curAns?.occasion_home ?? false,
            occasion_store: curAns?.occasion_store ?? false,
            occasion_out: curAns?.occasion_out ?? false,
            occasion: curAns?.occasion ?? null
          }
        }));
        return;
      }

      // 2. Numbers 1, 2, 3: Frequency buttons (1: よく食べる, 2: 割合よく, 3: あまり)
      if (e.key === '1' || e.key === '2' || e.key === '3') {
        e.preventDefault();
        const val = parseInt(e.key, 10) as 1 | 2 | 3;
        const nextFreq = curAns?.frequency === val ? null : val;
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            neverEaten: currentNever,
            never_eaten: currentNever,
            notEaten: currentNever,
            frequency: nextFreq,
            occasion_home: curAns?.occasion_home ?? false,
            occasion_store: curAns?.occasion_store ?? false,
            occasion_out: curAns?.occasion_out ?? false,
            occasion: curAns?.occasion ?? null
          }
        }));
        return;
      }

      // 3. Occasion 1 (家 / Homemade): Key 7 (or 'h')
      if (e.key === '7' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        const nextHome = !Boolean(curAns?.occasion_home);
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            neverEaten: currentNever,
            never_eaten: currentNever,
            notEaten: currentNever,
            frequency: curAns?.frequency ?? null,
            occasion_home: nextHome,
            occasion_store: curAns?.occasion_store ?? false,
            occasion_out: curAns?.occasion_out ?? false,
            occasion: nextHome ? 1 : curAns?.occasion_store ? 2 : curAns?.occasion_out ? 3 : null
          }
        }));
        return;
      }

      // 4. Occasion 2 (調理・惣菜 / Store Prepared): Key 8 (or 's')
      if (e.key === '8' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const nextStore = !Boolean(curAns?.occasion_store);
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            neverEaten: currentNever,
            never_eaten: currentNever,
            notEaten: currentNever,
            frequency: curAns?.frequency ?? null,
            occasion_home: curAns?.occasion_home ?? false,
            occasion_store: nextStore,
            occasion_out: curAns?.occasion_out ?? false,
            occasion: curAns?.occasion_home ? 1 : nextStore ? 2 : curAns?.occasion_out ? 3 : null
          }
        }));
        return;
      }

      // 5. Occasion 3 (外食 / Dining out): Key 9 (or 'o')
      if (e.key === '9' || e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        const nextOut = !Boolean(curAns?.occasion_out);
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            neverEaten: currentNever,
            never_eaten: currentNever,
            notEaten: currentNever,
            frequency: curAns?.frequency ?? null,
            occasion_home: curAns?.occasion_home ?? false,
            occasion_store: curAns?.occasion_store ?? false,
            occasion_out: nextOut,
            occasion: curAns?.occasion_home ? 1 : curAns?.occasion_store ? 2 : nextOut ? 3 : null
          }
        }));
        return;
      }

      // 6. Enter or ArrowDown: Move focus to next row
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (stateRef.current.activeRowIndex < currentCategoryItems.length - 1) {
          setActiveRowIndex(prev => prev + 1);
        }
        return;
      }

      // 7. ArrowUp: Move focus to previous row
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (stateRef.current.activeRowIndex > 0) {
          setActiveRowIndex(prev => prev - 1);
        }
        return;
      }

      // 8. Backspace, Delete, or Space: Resets the current row across all 5 fields
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setAnswers(prev => ({
          ...prev,
          [item.id]: {
            neverEaten: false,
            never_eaten: false,
            notEaten: false,
            frequency: null,
            occasion_home: false,
            occasion_store: false,
            occasion_out: false,
            occasion: null
          }
        }));
        showToast(t('toast.rowReset', { id: item.id }), 'info');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast, t]);

  return (
    <div className="bg-[#090d16] text-slate-100 h-screen w-screen overflow-hidden flex flex-col font-sans select-none notranslate">
      {/* Top Header */}
      <Header
        onFileUpload={handleFileUpload}
        onLoadSample={handleLoadSample}
        onRotate={handleRotate}
        onClearBox={handleClearBox}
        hasDocument={!!imageSource}
      />

      {/* Main Split Interface */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Document Viewer (63%) */}
        <DocumentViewer
          imageSource={imageSource}
          imageRotation={imageRotation}
          selectionBox={selectionBox}
          onSelectionBoxChange={setSelectionBox}
          pdfCurrentPage={pdfCurrentPage}
          pdfTotalPages={pdfTotalPages}
          isPdf={!!pdfDoc}
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
          onToggleNeverEaten={handleToggleNeverEaten}
          onToggleNotEaten={handleToggleNeverEaten}
          onSelectFrequency={handleSelectFrequency}
          onToggleOccasion={handleToggleOccasion}
          onSelectOccasion={handleToggleOccasion}
          onClearRow={handleClearRow}
          onJumpNextIncomplete={handleJumpNextIncomplete}
          onOpenMatrixModal={() => setIsMatrixOpen(true)}
          tsvExportMode={tsvExportMode}
          onToggleTsvExportMode={setTsvExportMode}
          onCopyTsv={handleCopyTsv}
          onCopyHorizontalTsv={handleCopyHorizontalTsv}
          onCopyVerticalTsv={handleCopyVerticalTsv}
          onCopyAllHorizontalTsv={handleCopyAllHorizontalTsv}
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

export default function App() {
  return (
    <LanguageProvider>
      <SurveyAppContent />
    </LanguageProvider>
  );
}
