import React from 'react';
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Building2,
  Hash,
  AlertTriangle,
  FileText,
  Eye,
  Sparkles,
} from 'lucide-react';

interface OcrAnalysisCardProps {
  numberPlate: string;
  plateValid: boolean;
  invalidReason?: string;
  ocrConfidence: number;
  stateCode?: string;
  stateName?: string;
  districtCode?: string;
  districtName?: string;
  plateType?: string;
  plateColor?: string;
}

export const OcrAnalysisCard: React.FC<OcrAnalysisCardProps> = ({
  numberPlate,
  plateValid,
  invalidReason,
  ocrConfidence,
  stateCode,
  stateName,
  districtCode,
  districtName,
  plateType = 'Standard High Security Registration Plate (HSRP White)',
  plateColor = 'White',
}) => {
  // Determine dynamic plate styling based on plateColor
  let plateBgClass = 'bg-amber-300 text-slate-950 border-slate-900'; // Default HSRP/Yellow
  let indBgClass = 'border-slate-900 text-blue-900';

  if (plateColor === 'White') {
    plateBgClass = 'bg-slate-100 text-slate-950 border-slate-900 shadow-white/10';
  } else if (plateColor === 'Green') {
    plateBgClass = 'bg-emerald-700 text-emerald-50 border-slate-900 shadow-emerald-900/30';
    indBgClass = 'border-emerald-300 text-emerald-100';
  } else if (plateColor === 'Black') {
    plateBgClass = 'bg-slate-950 text-amber-300 border-amber-500/50 shadow-slate-900/50';
    indBgClass = 'border-amber-500/30 text-amber-400';
  } else if (plateColor === 'Yellow') {
    plateBgClass = 'bg-amber-400 text-slate-950 border-slate-900 shadow-amber-500/20';
  }

  const isDetected = numberPlate && !numberPlate.toLowerCase().includes('detected') && !numberPlate.toLowerCase().includes('unable');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              License Plate OCR & RTO Validation
            </h3>
            <p className="text-[11px] text-slate-400">
              {plateType}
            </p>
          </div>
        </div>

        {/* Validity Badge */}
        {plateValid ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Valid Indian Plate</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" />
            <span>{isDetected ? 'Invalid Format' : 'Not Detected'}</span>
          </span>
        )}
      </div>

      {/* Stylized Indian License Plate Render */}
      <div className={`relative mx-auto max-w-sm rounded-xl border-4 p-3 shadow-2xl flex items-center justify-between gap-3 font-mono font-black tracking-widest text-xl sm:text-2xl select-none overflow-hidden transition-all ${plateBgClass}`}>
        {/* Left IND Emblem Strip */}
        <div className={`flex flex-col items-center justify-center border-r-2 pr-2 pl-1 text-[10px] font-sans font-extrabold leading-none ${indBgClass}`}>
          <div className="h-3 w-3 rounded-full bg-blue-900 flex items-center justify-center text-[7px] text-amber-300 font-bold mb-0.5">
            ☸
          </div>
          <span>IND</span>
        </div>

        {/* Center Registration Text */}
        <div className="flex-1 text-center font-bold tracking-widest drop-shadow-sm">
          {isDetected ? numberPlate : 'Not Detected'}
        </div>

        {/* Hologram Stamp */}
        <div className="h-4 w-4 rounded-full border border-amber-600 bg-amber-400/80 shadow-inner flex items-center justify-center text-[8px]">
          🔒
        </div>
      </div>

      {/* Uploaded Image OCR & Inspection Report Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
          <span className="text-slate-200 font-semibold flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span>Uploaded Image Extraction Report</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Eye className="h-3 w-3 text-cyan-400" />
            <span>Direct Photo OCR</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Plate Characters Read</div>
            <div className="font-mono font-bold text-amber-300 text-sm tracking-widest truncate">
              {isDetected ? numberPlate : 'Not Detected'}
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">OCR Status</div>
            <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-200">
              {plateValid ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">Verified Plate Text</span>
                </>
              ) : isDetected ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-amber-300">Format Pending Verification</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="text-rose-400">Unreadable / Hidden</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80 leading-relaxed flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-100">OCR Report Summary: </span>
            {isDetected ? (
              <>
                Registration string <strong className="text-amber-300 font-mono">{numberPlate}</strong> was directly extracted from the uploaded image with {ocrConfidence}% confidence and mapped to <span className="text-slate-100 font-medium">{stateName || 'RTO Region'} ({stateCode || 'RTO'})</span>.
              </>
            ) : (
              <>
                No clear registration characters were recognized in the uploaded image. Please ensure the vehicle photo has a clear, unobstructed license plate.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Invalid Reason Warning if applicable */}
      {!plateValid && invalidReason && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Validation Status:</span> {invalidReason}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        {/* State */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span>State / Union Territory</span>
          </div>
          <div className="font-bold text-slate-100 text-sm">
            {stateName || 'Unknown'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Registration Code: {stateCode || 'Unknown'}
          </div>
        </div>

        {/* District RTO */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>RTO Authority Office</span>
          </div>
          <div className="font-bold text-slate-100 text-sm truncate">
            {districtName || 'Unknown'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            RTO Code: {districtCode || 'Unknown'}
          </div>
        </div>
      </div>

      {/* OCR Confidence Gauge */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>OCR Extraction Confidence</span>
          <span className="text-amber-400 font-bold">{ocrConfidence}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
            style={{ width: `${ocrConfidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
