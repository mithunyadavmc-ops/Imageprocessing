import React from 'react';
import {
  Image as ImageIcon,
  ScanSearch,
  ShieldCheck,
  Camera,
  BadgeCheck,
} from 'lucide-react';
import { VehicleProcessingReport } from '../types';

interface ImageDescriptionCardProps {
  report: VehicleProcessingReport;
}

export const ImageDescriptionCard: React.FC<ImageDescriptionCardProps> = ({ report }) => {
  const hasIdentifiedVehicle = [report.vehicle_type, report.manufacturer, report.model].some(
    (value) => value && !value.toLowerCase().includes('unable to identify') && !value.toLowerCase().includes('unable to determine')
  );

  const description =
    report.ai_summary ||
    `This image contains a ${report.vehicle_color} ${report.manufacturer} ${report.model} (${report.vehicle_category}). The plate was ${report.plate_valid ? 'successfully read' : 'reviewed for validation'} and the image quality was assessed as ${report.image_quality}.`;

  const details = [
    {
      label: 'Detected subject',
      value: hasIdentifiedVehicle
        ? `${report.vehicle_color} ${report.manufacturer} ${report.model}`.replace(/\s+/g, ' ').trim()
        : 'Unable to identify vehicle.',
    },
    {
      label: 'Vehicle type',
      value: report.vehicle_category,
    },
    {
      label: 'Plate reading',
      value: report.number_plate || 'Unreadable',
    },
    {
      label: 'OCR confidence',
      value: `${report.ocr_confidence}%`,
    },
    {
      label: 'Image quality',
      value: `${report.image_quality} • ${report.blur_category || 'Sharp'}`,
    },
    {
      label: 'Authenticity',
      value: report.tampered
        ? 'Tampering detected'
        : report.screenshot
        ? 'Screenshot detected'
        : report.duplicate
        ? 'Duplicate flagged'
        : 'No obvious fraud signals',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Image Content Description
            </h3>
            <p className="text-[11px] text-slate-400">
              What the uploaded photo contains and its key details
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          <BadgeCheck className="h-3 w-3" />
          <span>Detected</span>
        </span>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
          <ScanSearch className="h-4 w-4 text-emerald-400" />
          <span>AI Image Description</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {details.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
              {item.label === 'Authenticity' ? (
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Camera className="h-3.5 w-3.5 text-cyan-400" />
              )}
              <span>{item.label}</span>
            </div>
            <div className="text-sm font-semibold text-slate-100">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
