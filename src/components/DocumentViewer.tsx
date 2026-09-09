import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Crosshair,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  FileUp,
  FolderOpen,
  FileText
} from 'lucide-react';
import { SelectionBox, ToolType } from '../types';

interface DocumentViewerProps {
  imageSource: HTMLImageElement | HTMLCanvasElement | null;
  imageRotation: number;
  selectionBox: SelectionBox | null;
  onSelectionBoxChange: (box: SelectionBox | null) => void;
  pdfCurrentPage: number;
  pdfTotalPages: number;
  isPdf: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFileUpload: (file: File) => void;
  onLoadSample: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  imageSource,
  imageRotation,
  selectionBox,
  onSelectionBoxChange,
  pdfCurrentPage,
  pdfTotalPages,
  isPdf,
  onPrevPage,
  onNextPage,
  onFileUpload,
  onLoadSample
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<ToolType>('draw');
  const [isSpaceDown, setIsSpaceDown] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const panStateRef = useRef<{
    isPanning: boolean;
    panStart: { x: number; y: number };
  }>({ isPanning: false, panStart: { x: 0, y: 0 } });

  const drawStateRef = useRef<{
    isDrawing: boolean;
    tempDrawStart: { x: number; y: number } | null;
  }>({ isDrawing: false, tempDrawStart: null });

  // Ref to always have latest state in event listeners
  const stateRef = useRef({
    zoom,
    pan,
    activeTool,
    isSpaceDown,
    imageSource,
    imageRotation,
    selectionBox
  });

  useEffect(() => {
    stateRef.current = {
      zoom,
      pan,
      activeTool,
      isSpaceDown,
      imageSource,
      imageRotation,
      selectionBox
    };
  }, [zoom, pan, activeTool, isSpaceDown, imageSource, imageRotation, selectionBox]);

  // Fit to screen calculation
  const fitImage = useCallback(() => {
    if (!imageSource || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const isRotatedQuarter = imageRotation === 90 || imageRotation === 270;
    const w = isRotatedQuarter ? imageSource.height : imageSource.width;
    const h = isRotatedQuarter ? imageSource.width : imageSource.height;

    const scaleX = (rect.width - 40) / w;
    const scaleY = (rect.height - 40) / h;
    const newZoom = Math.min(scaleX, scaleY, 1.2);
    const newPanX = (rect.width - w * newZoom) / 2;
    const newPanY = (rect.height - h * newZoom) / 2;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [imageSource, imageRotation]);

  // Auto-fit on new image loaded or rotation changed
  useEffect(() => {
    if (imageSource) {
      fitImage();
    }
  }, [imageSource, imageRotation, fitImage]);

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = viewport.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Check if canvas dimensions need update
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!imageSource) return;

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    const w = imageSource.width;
    const h = imageSource.height;

    ctx.save();
    if (imageRotation === 90) {
      ctx.translate(h, 0);
      ctx.rotate((90 * Math.PI) / 180);
    } else if (imageRotation === 180) {
      ctx.translate(w, h);
      ctx.rotate((180 * Math.PI) / 180);
    } else if (imageRotation === 270) {
      ctx.translate(0, w);
      ctx.rotate((270 * Math.PI) / 180);
    }
    ctx.drawImage(imageSource, 0, 0);
    ctx.restore();

    // Render selection bounding box
    if (selectionBox) {
      const box = selectionBox;
      ctx.save();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([5 / zoom, 3 / zoom]);
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);

      ctx.setLineDash([]);
      ctx.fillStyle = '#f59e0b';
      const hs = 6 / zoom;
      ctx.fillRect(box.x - hs / 2, box.y - hs / 2, hs, hs);
      ctx.fillRect(box.x + box.w - hs / 2, box.y - hs / 2, hs, hs);
      ctx.fillRect(box.x - hs / 2, box.y + box.h - hs / 2, hs, hs);
      ctx.fillRect(box.x + box.w - hs / 2, box.y + box.h - hs / 2, hs, hs);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(box.x, box.y - 18 / zoom, 100 / zoom, 16 / zoom);
      ctx.font = `${Math.max(10 / zoom, 10)}px sans-serif`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Focus Region', box.x + 4 / zoom, box.y - 5 / zoom);
      ctx.restore();
    }

    ctx.restore();
  }, [imageSource, imageRotation, pan, zoom, selectionBox]);

  // Request Animation Frame rendering loop
  useEffect(() => {
    let animId = requestAnimationFrame(renderCanvas);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Resize observer
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(() => {
      renderCanvas();
    });
    ro.observe(vp);
    return () => ro.disconnect();
  }, [renderCanvas]);

  // Helper for coordinates
  const getViewportCoords = (e: MouseEvent | React.MouseEvent) => {
    if (!viewportRef.current) return { screenX: 0, screenY: 0, imgX: 0, imgY: 0 };
    const rect = viewportRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const imgX = (screenX - stateRef.current.pan.x) / stateRef.current.zoom;
    const imgY = (screenY - stateRef.current.pan.y) / stateRef.current.zoom;
    return { screenX, screenY, imgX, imgY };
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!imageSource || !viewportRef.current) return;
    e.preventDefault();
    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newZoom = Math.max(0.1, Math.min(zoom * zoomFactor, 8.0));

    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Mouse down on viewport
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSource) return;
    const coords = getViewportCoords(e);

    if (e.button === 1 || isSpaceDown || activeTool === 'pan') {
      panStateRef.current.isPanning = true;
      panStateRef.current.panStart = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      };
      return;
    }

    if (e.button === 0 && activeTool === 'draw') {
      drawStateRef.current.isDrawing = true;
      drawStateRef.current.tempDrawStart = { x: coords.imgX, y: coords.imgY };
      onSelectionBoxChange({ x: coords.imgX, y: coords.imgY, w: 0, h: 0 });
    }
  };

  // Global mouse move & mouse up
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (panStateRef.current.isPanning) {
        setPan({
          x: e.clientX - panStateRef.current.panStart.x,
          y: e.clientY - panStateRef.current.panStart.y
        });
        return;
      }

      if (drawStateRef.current.isDrawing && drawStateRef.current.tempDrawStart) {
        const coords = getViewportCoords(e);
        const start = drawStateRef.current.tempDrawStart;
        const x = Math.min(start.x, coords.imgX);
        const y = Math.min(start.y, coords.imgY);
        const w = Math.abs(coords.imgX - start.x);
        const h = Math.abs(coords.imgY - start.y);

        onSelectionBoxChange({ x, y, w, h });
      }
    };

    const handleWindowMouseUp = () => {
      if (panStateRef.current.isPanning) {
        panStateRef.current.isPanning = false;
      }
      if (drawStateRef.current.isDrawing) {
        drawStateRef.current.isDrawing = false;
        drawStateRef.current.tempDrawStart = null;
        const box = stateRef.current.selectionBox;
        if (box && (box.w < 10 || box.h < 10)) {
          onSelectionBoxChange(null);
        }
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [onSelectionBoxChange]);

  // Spacebar toggle for quick panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !isSpaceDown &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        setIsSpaceDown(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpaceDown]);

  // Drag & drop file handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer?.files?.[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const cursorClass = panStateRef.current.isPanning
    ? 'cursor-grabbing'
    : isSpaceDown || activeTool === 'pan'
    ? 'cursor-grab'
    : 'cursor-crosshair';

  return (
    <section
      aria-label="Document Viewer Canvas"
      className="w-full md:w-[63%] h-full flex flex-col bg-[#090d16] border-r border-slate-800 relative select-none"
    >
      {/* Floating Canvas Navigation Controls */}
      <div
        role="toolbar"
        aria-label="Canvas Viewer Toolbar"
        className="absolute top-3 left-3 z-20 flex items-center bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-1 shadow-xl space-x-1"
      >
        <button
          id="toolDrawBtn"
          onClick={() => setActiveTool('draw')}
          aria-label="Selection Box Tool"
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
            activeTool === 'draw'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Draw Box</span>
        </button>
        <button
          id="toolPanBtn"
          onClick={() => setActiveTool('pan')}
          aria-label="Pan Canvas Tool"
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
            activeTool === 'pan'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>Pan</span>
        </button>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <button
          id="zoomOutBtn"
          onClick={() => setZoom(prev => Math.max(prev * 0.8, 0.1))}
          aria-label="Zoom Out"
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span
          id="zoomLabel"
          aria-live="polite"
          className="text-[11px] font-mono text-slate-300 w-12 text-center"
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          id="zoomInBtn"
          onClick={() => setZoom(prev => Math.min(prev * 1.25, 8.0))}
          aria-label="Zoom In"
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          id="zoomFitBtn"
          onClick={fitImage}
          title="Fit to Screen"
          aria-label="Fit Document to Screen"
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PDF Pagination Controls */}
      {isPdf && (
        <div
          id="pdfPagination"
          className="absolute top-3 right-3 z-20 flex items-center bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg px-2.5 py-1 space-x-2 text-xs shadow-xl"
        >
          <button
            id="prevPageBtn"
            onClick={onPrevPage}
            disabled={pdfCurrentPage <= 1}
            aria-label="Previous Page"
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span id="pageIndicator" className="font-mono text-slate-200">
            {pdfCurrentPage} / {pdfTotalPages}
          </span>
          <button
            id="nextPageBtn"
            onClick={onNextPage}
            disabled={pdfCurrentPage >= pdfTotalPages}
            aria-label="Next Page"
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Viewport Canvas Container */}
      <div
        id="viewport"
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 w-full h-full overflow-hidden relative bg-slate-950 ${cursorClass} ${
          isDraggingOver ? 'ring-2 ring-blue-500 ring-inset' : ''
        }`}
      >
        <canvas
          id="docCanvas"
          ref={canvasRef}
          className="absolute top-0 left-0"
          aria-label="Survey Document Viewer"
        />

        {/* Empty State & Upload Dropzone */}
        {!imageSource && (
          <div
            id="emptyUploadPrompt"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label="Drag and Drop or Click to upload survey document"
              onClick={() => document.getElementById('uploadBtn')?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('uploadBtn')?.click();
                }
              }}
              className="max-w-md w-full p-8 rounded-2xl bg-slate-900/90 border-2 border-dashed border-slate-700 hover:border-blue-500 transition-all flex flex-col items-center shadow-2xl backdrop-blur-sm cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="dropzoneClickTarget"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition transform">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-1">
                調査票PDF / 画像をアップロード
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                クリックまたはPDF・画像ファイルをここにドラッグ＆ドロップしてください。
                <br />
                （PDFは複数ページの閲覧・拡大縮小に対応）
              </p>
              
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-900/30 transition flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4" /> ファイルを選択
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadSample();
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-sky-400" /> サンプル調査票を開く
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selection Coordinates Badge */}
        {selectionBox && (
          <div
            id="boxCoordsBadge"
            className="absolute bottom-3 left-3 z-20 bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 px-2.5 py-1 rounded-md shadow pointer-events-none"
          >
            Crop Region:{' '}
            <span id="boxCoordsText">
              X:{Math.round(selectionBox.x)} Y:{Math.round(selectionBox.y)}{' '}
              {Math.round(selectionBox.w)}x{Math.round(selectionBox.h)}px
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
