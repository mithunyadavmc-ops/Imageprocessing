import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  Camera,
  MapPin,
  Clock,
  Cpu,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { AuthenticityMetrics, ExifMetadata } from '../types';

interface AuthenticityCardProps {
  tampered: boolean;
  duplicate: boolean;
  screenshot: boolean;
  authenticityDetails?: AuthenticityMetrics;
  metadata?: ExifMetadata;
}

export const AuthenticityCard: React.FC<AuthenticityCardProps> = ({
  tampered,
  duplicate,
  screenshot,
  authenticityDetails,
  metadata,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              tampered
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {tampered ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Media Forensics & Authenticity Inspector
            </h3>
            <p className="text-[11px] text-slate-400">
              Error Level Analysis (ELA), Screenshot & Perceptual Hash (pHash)
            </p>
          </div>
        </div>

        {tampered ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Tampering Detected</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Authentic Photo</span>
          </span>
        )}
      </div>

      {/* Security Check Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Tamper Card */}
        <div
          className={`rounded-xl border p-3 ${
            tampered
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : 'border-slate-800 bg-slate-950/60 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">Digital Tampering (ELA)</span>
            {tampered ? (
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            )}
          </div>
          <div className="text-sm font-bold">
            {tampered ? 'TAMPERED / EDITED' : 'CLEAN (No Edit)'}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
            {authenticityDetails?.tampering_details || 'Compression & pixel noise distribution uniform.'}
          </p>
        </div>

        {/* Screenshot Card */}
        <div
          className={`rounded-xl border p-3 ${
            screenshot
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
              : 'border-slate-800 bg-slate-950/60 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">Screen Capture Check</span>
            <Smartphone className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold">
            {screenshot ? 'SCREENSHOT DETECTED' : 'CAMERA ORIGINAL'}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {screenshot
              ? 'Moiré grid pattern and screen aspect ratio detected.'
              : 'Original sensor EXIF metrics present.'}
          </p>
        </div>

        {/* Duplicate Card */}
        <div
          className={`rounded-xl border p-3 ${
            duplicate
              ? 'border-purple-500/30 bg-purple-500/10 text-purple-200'
              : 'border-slate-800 bg-slate-950/60 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">Duplicate Check (pHash)</span>
            <Copy className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold">
            {duplicate ? 'DUPLICATE RECORD MATCH' : 'UNIQUE ENTRY'}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono truncate">
            pHash: {authenticityDetails?.phash || '8f9e1a2b3c4d5e6f'}
          </p>
        </div>
      </div>

      {/* EXIF Metadata Box */}
      {metadata && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold border-b border-slate-800/80 pb-2">
            <Camera className="h-4 w-4 text-blue-400" />
            <span>EXIF Camera & Sensor Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-500">Camera:</span>
              <span className="font-mono font-medium truncate">{metadata.camera}</span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-500">GPS Coords:</span>
              <span className="font-mono font-medium truncate text-emerald-400">
                {metadata.gps}
              </span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-500">Capture Time:</span>
              <span className="font-mono font-medium truncate">{metadata.capture_time}</span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-500">Software:</span>
              <span className="font-mono font-medium truncate text-indigo-300">
                {metadata.software || 'Camera Hardware'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
