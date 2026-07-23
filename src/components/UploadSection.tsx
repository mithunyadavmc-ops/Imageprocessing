import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileImage,
  Loader2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SAMPLE_VEHICLES, SampleVehiclePreset } from '../data/sampleVehicles';

interface UploadSectionProps {
  onUploadFile: (file: File) => void;
  onSelectPreset: (preset: SampleVehiclePreset) => void;
  isUploading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onUploadFile,
  onSelectPreset,
  isUploading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 shadow-2xl shadow-blue-500/20 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/50 hover:border-blue-500/50 hover:bg-slate-900/80 shadow-lg'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/80 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
              Upload Vehicle Image for AI Analysis
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Drag and drop any high-res image (JPEG, PNG, WebP) or click to browse.
              Supports Cars, Trucks, Bikes, Buses, Auto Rickshaws, EVs, and Construction Vehicles.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
              <span>{isUploading ? 'Processing Image...' : 'Select Local Image'}</span>
            </button>

            <span className="text-xs text-slate-500">or try preset scenarios below</span>
          </div>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-200">
              Sample Vehicle Scenarios (1-Click Instant Analysis)
            </h4>
          </div>
          <span className="text-xs text-slate-400">Select any preset to inspect pipeline</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAMPLE_VEHICLES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={isUploading}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left transition-all hover:border-blue-500/60 hover:bg-slate-800/80 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {/* Thumbnail header */}
              <div className="relative h-20 w-full overflow-hidden rounded-lg bg-slate-950">
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Badge overlay */}
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[10px] font-semibold text-slate-200">
                  <span className="truncate rounded bg-slate-900/90 px-1.5 py-0.5 border border-slate-700/80">
                    {preset.expectedPlate}
                  </span>
                </div>
              </div>

              {/* Card Footer info */}
              <div className="mt-2 space-y-1">
                <h5 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                  {preset.title}
                </h5>
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {preset.subtitle}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <Zap className="h-2.5 w-2.5" />
                    <span>Run AI Pipeline</span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
