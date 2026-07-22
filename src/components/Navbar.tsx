import React from 'react';
import {
  Car,
  Cpu,
  Eye,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'queue' | 'architecture';
  setActiveTab: (tab: 'analyzer' | 'queue' | 'architecture') => void;
  totalProcessed: number;
  activeProcessing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalProcessed,
  activeProcessing,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <Car className="h-5 w-5 text-white" />
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950">
                <Zap className="h-2.5 w-2.5 text-slate-950 fill-current" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-lg">AutoVision</span>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
                  AI CV Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Computer Vision • OCR • Laplacian Blur • Fraud & Gemini AI Agent
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium ${
                activeTab === 'analyzer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Live Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium ${
                activeTab === 'queue'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Live Queue</span>
              {totalProcessed > 0 && (
                <span className="ml-1 rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-blue-300">
                  {totalProcessed}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium hidden md:flex ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Pipeline Specs</span>
            </button>
          </nav>

          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${activeProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${activeProcessing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-slate-300 font-medium">
                {activeProcessing ? 'Processing Active' : 'Pipeline Idle'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Gemini 3.6 Agent</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
