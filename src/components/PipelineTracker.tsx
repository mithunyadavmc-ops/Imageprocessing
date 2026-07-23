import React from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Cpu,
  Layers,
  FileCheck,
  Zap,
} from 'lucide-react';
import { PipelineStepStatus } from '../types';

interface PipelineTrackerProps {
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  progress: number;
  steps: PipelineStepStatus[];
  processingId: string;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  status,
  progress,
  steps,
  processingId,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-5">
      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100">
                AI Media Processing Pipeline
              </h3>
              <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                ID: {processingId}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Asynchronous Computer Vision, OCR & Gemini LLM Agent Execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'Processing' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Pipeline Active ({progress}%)</span>
            </span>
          )}
          {status === 'Pending' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
              <Clock className="h-3.5 w-3.5" />
              <span>Queued in Redis Task Queue</span>
            </span>
          )}
          {status === 'Completed' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Pipeline Complete (100%)</span>
            </span>
          )}
          {status === 'Failed' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Pipeline Failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Processing Pipeline Progress</span>
          <span className="text-blue-400 font-bold">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 pt-2">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.step}
              className={`relative flex flex-col justify-between rounded-xl p-3 border text-xs transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-200'
                  : isCurrent
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10 scale-[1.02]'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-mono text-[10px] opacity-70 font-bold">Step {idx + 1}</span>
                {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                {isCurrent && <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin shrink-0" />}
                {isPending && <Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" />}
              </div>

              <div className="font-semibold leading-tight line-clamp-2">{step.label}</div>

              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                {isDone ? 'Finished' : isCurrent ? 'Running...' : 'Waiting'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
