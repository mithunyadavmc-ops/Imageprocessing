import React from 'react';
import {
  Car,
  Tag,
  Calendar,
  Palette,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { DetectionCategory } from '../types';

interface VehicleInfoCardProps {
  vehicleType: string;
  vehicleCategory: DetectionCategory;
  manufacturer: string;
  model: string;
  bodyType?: string;
  vehicleColor: string;
  estimatedYear: string;
  confidence: number;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({
  vehicleType,
  vehicleCategory,
  manufacturer,
  model,
  bodyType,
  vehicleColor,
  estimatedYear,
  confidence,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Car className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              CNN Vehicle Classification & Specs
            </h3>
            <p className="text-[11px] text-slate-400">
              Deep Learning Model Categories (28+ Vehicle Types)
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
          <Zap className="h-3 w-3" />
          <span>{confidence}% Match</span>
        </span>
      </div>

      {/* Main Identified Title Box */}
      <div className="rounded-xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 p-4 border border-blue-500/20 space-y-1">
        <div className="flex items-center justify-between text-xs text-blue-300 font-semibold uppercase tracking-wider">
          <span>{vehicleCategory}</span>
          <span>~{estimatedYear} Model</span>
        </div>
        <h4 className="text-xl font-black text-white tracking-tight">
          {manufacturer} {model}
        </h4>
        <p className="text-xs text-slate-300">
          Variant / Body Spec: <span className="font-medium text-slate-100">{bodyType || vehicleType}</span>
        </p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <Tag className="h-3.5 w-3.5 text-indigo-400" />
            <span>Category</span>
          </div>
          <div className="font-bold text-slate-100">{vehicleCategory}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <Palette className="h-3.5 w-3.5 text-purple-400" />
            <span>Exterior Paint</span>
          </div>
          <div className="font-bold text-slate-100">{vehicleColor}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <Car className="h-3.5 w-3.5 text-cyan-400" />
            <span>Manufacturer</span>
          </div>
          <div className="font-bold text-slate-100">{manufacturer}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span>Estimated Year</span>
          </div>
          <div className="font-bold text-slate-100">{estimatedYear}</div>
        </div>
      </div>
    </div>
  );
};
