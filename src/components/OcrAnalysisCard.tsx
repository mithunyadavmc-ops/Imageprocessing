import React from 'react';
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Building2,
  Hash,
  ShieldCheck,
  AlertTriangle,
  Zap,
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
}) => {
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
              Indian High-Security Registration Plate (HSRP) Format Matcher
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
            <span>Invalid Plate Format</span>
          </span>
        )}
      </div>

      {/* Stylized Indian License Plate Render */}
      <div className="relative mx-auto max-w-sm rounded-xl border-4 border-slate-900 bg-amber-300 p-3 shadow-2xl text-slate-950 flex items-center justify-between gap-3 font-mono font-black tracking-widest text-xl sm:text-2xl select-none overflow-hidden">
        {/* Left IND Emblem Strip */}
        <div className="flex flex-col items-center justify-center border-r-2 border-slate-900 pr-2 pl-1 text-[10px] font-sans font-extrabold text-blue-900 leading-none">
          <div className="h-3 w-3 rounded-full bg-blue-900 flex items-center justify-center text-[7px] text-amber-300 font-bold mb-0.5">
            ☸
          </div>
          <span>IND</span>
        </div>

        {/* Center Registration Text */}
        <div className="flex-1 text-center font-bold tracking-widest drop-shadow-sm">
          {numberPlate || 'KA01AB1234'}
        </div>

        {/* Hologram Stamp */}
        <div className="h-4 w-4 rounded-full border border-amber-600 bg-amber-400/80 shadow-inner flex items-center justify-center text-[8px]">
          🔒
        </div>
      </div>

      {/* Invalid Reason Warning if applicable */}
      {!plateValid && invalidReason && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Validation Error:</span> {invalidReason}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        {/* State */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span>State / Territory</span>
          </div>
          <div className="font-bold text-slate-100 text-sm">
            {stateName || 'Karnataka'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Code: {stateCode || 'KA'}
          </div>
        </div>

        {/* District RTO */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>RTO Authority Office</span>
          </div>
          <div className="font-bold text-slate-100 text-sm truncate">
            {districtName || 'Bengaluru Central'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            RTO Code: {districtCode || '01'}
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
