import React from 'react';
import {
  Sparkles,
  Focus,
  Sun,
  Contrast as ContrastIcon,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { BlurCategory, QualityRating } from '../types';

interface QualityAndBlurCardProps {
  imageQuality: QualityRating;
  blurScore: number;
  blurCategory?: BlurCategory;
  brightness: string;
  contrast: string;
  noise: string;
  resolution?: string;
}

export const QualityAndBlurCard: React.FC<QualityAndBlurCardProps> = ({
  imageQuality,
  blurScore,
  blurCategory = 'Sharp',
  brightness,
  contrast,
  noise,
  resolution = '3840 x 2160',
}) => {
  // Normalize Laplacian score (0 - 300 scale) to percentage (0 - 100%)
  const blurPercentage = Math.min(Math.round((blurScore / 250) * 100), 100);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Focus className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Image Quality & Laplacian Blur Analysis
            </h3>
            <p className="text-[11px] text-slate-400">
              OpenCV Spatial Frequency & Blur Variance Engine
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${
            imageQuality === 'Excellent'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : imageQuality === 'Good'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          <span>{imageQuality} Quality</span>
        </span>
      </div>

      {/* Laplacian Blur Score Gauge Meter */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Focus className="h-4 w-4 text-blue-400" />
            <span className="text-slate-200">Laplacian Focus Score:</span>
            <span className="text-blue-400 font-mono text-sm">{blurScore.toFixed(1)}</span>
          </div>

          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              blurCategory === 'Sharp'
                ? 'bg-emerald-500/20 text-emerald-300'
                : blurCategory === 'Slight Blur'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {blurCategory}
          </span>
        </div>

        {/* Meter progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              blurScore > 120
                ? 'bg-gradient-to-r from-blue-500 to-emerald-400'
                : blurScore > 70
                ? 'bg-gradient-to-r from-amber-500 to-blue-400'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.max(blurPercentage, 12)}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
          <span>0 (Blurred)</span>
          <span>70 (Slight)</span>
          <span>120+ (Crisp / Sharp)</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium mb-0.5">
            <Sun className="h-3 w-3 text-amber-400" />
            <span>Brightness</span>
          </div>
          <div className="font-bold text-slate-100">{brightness}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium mb-0.5">
            <ContrastIcon className="h-3 w-3 text-cyan-400" />
            <span>Contrast</span>
          </div>
          <div className="font-bold text-slate-100">{contrast}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium mb-0.5">
            <Activity className="h-3 w-3 text-purple-400" />
            <span>Noise Level</span>
          </div>
          <div className="font-bold text-slate-100">{noise}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium mb-0.5">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>Resolution</span>
          </div>
          <div className="font-bold text-slate-100 font-mono text-[11px] truncate">
            {resolution}
          </div>
        </div>
      </div>
    </div>
  );
};
