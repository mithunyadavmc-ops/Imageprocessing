import React, { useState } from 'react';
import {
  Eye,
  Maximize2,
  Sliders,
  Sparkles,
  Layers,
  ZoomIn,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';
import { BoundingBox } from '../types';

interface ImageBoundingBoxViewerProps {
  imageUrl?: string;
  filename: string;
  boundingBoxes?: BoundingBox[];
  plateText?: string;
  isTampered?: boolean;
  blurScore?: number;
}

export const ImageBoundingBoxViewer: React.FC<ImageBoundingBoxViewerProps> = ({
  imageUrl,
  filename,
  boundingBoxes = [],
  plateText,
  isTampered,
  blurScore,
}) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [filterMode, setFilterMode] = useState<'normal' | 'ocr_mask' | 'edge_blur'>('normal');
  const [selectedBoxLabel, setSelectedBoxLabel] = useState<string | null>(null);

  // Show a neutral placeholder until the user uploads an image.
  const displayImage = imageUrl || '';
  const hasImage = Boolean(displayImage);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Computer Vision Stage & Bounding Box Visualizer
          </h3>
        </div>

        {/* Filter Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterMode('normal')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'normal'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RGB Vision
            </button>
            <button
              onClick={() => setFilterMode('ocr_mask')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'ocr_mask'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OCR Binarized
            </button>
            <button
              onClick={() => setFilterMode('edge_blur')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'edge_blur'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Laplacian Edge
            </button>
          </div>

          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              showBoxes
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showBoxes ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            <span>Boxes ({boundingBoxes.length})</span>
          </button>
        </div>
      </div>

      {/* Image Stage Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-inner group">
        {hasImage ? (
          <img
            src={displayImage}
            alt={filename}
            className={`h-full w-full object-contain transition-all duration-300 ${
              filterMode === 'ocr_mask'
                ? 'contrast-[2.0] grayscale invert brightness-125'
                : filterMode === 'edge_blur'
                ? 'contrast-200 grayscale hue-rotate-180 brightness-90'
                : ''
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center text-sm text-slate-400">
            <div>
              <p className="font-semibold text-slate-200">No uploaded image yet</p>
              <p className="mt-1 text-xs text-slate-500">Upload a local photo to display it here.</p>
            </div>
          </div>
        )}

        {/* Bounding Box Overlays */}
        {showBoxes &&
          boundingBoxes.map((item, idx) => {
            const [ymin, xmin, ymax, xmax] = item.box;
            const width = xmax - xmin;
            const height = ymax - ymin;
            const borderColor = item.color || '#3b82f6';
            const isHovered = selectedBoxLabel === item.label;

            return (
              <div
                key={idx}
                onMouseEnter={() => setSelectedBoxLabel(item.label)}
                onMouseLeave={() => setSelectedBoxLabel(null)}
                style={{
                  top: `${ymin}%`,
                  left: `${xmin}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  borderColor,
                }}
                className={`absolute border-2 rounded-md transition-all duration-200 pointer-events-auto ${
                  isHovered ? 'bg-blue-500/20 shadow-2xl scale-[1.01] z-20' : 'bg-blue-500/5 z-10'
                }`}
              >
                {/* Box Label Tag */}
                <div
                  style={{ backgroundColor: borderColor }}
                  className="absolute -top-6 left-0 flex items-center gap-1.5 rounded-t-md px-2 py-0.5 text-[10px] font-bold text-white shadow whitespace-nowrap"
                >
                  <span>{item.label}</span>
                  <span className="opacity-80">({item.confidence}%)</span>
                </div>
              </div>
            );
          })}

        {/* Stage Floating Overlay Indicators */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {plateText && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 shadow-lg backdrop-blur">
              <span className="text-slate-400 font-medium">Plate Detected:</span>
              <span className="font-mono font-bold tracking-wider text-amber-400">{plateText}</span>
            </div>
          )}
          {isTampered && (
            <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Tampering Flagged</span>
            </div>
          )}
        </div>
      </div>

      {/* Bounding Box Legend Pills */}
      {boundingBoxes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Detected Objects:</span>
          {boundingBoxes.map((box, idx) => (
            <span
              key={idx}
              onMouseEnter={() => setSelectedBoxLabel(box.label)}
              onMouseLeave={() => setSelectedBoxLabel(null)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border text-[11px] font-medium transition-all ${
                selectedBoxLabel === box.label
                  ? 'bg-slate-800 text-white border-blue-400 scale-105'
                  : 'bg-slate-950 text-slate-300 border-slate-800'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: box.color || '#3b82f6' }}
              />
              <span>{box.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
