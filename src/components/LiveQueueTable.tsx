import React, { useState } from 'react';
import {
  Activity,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  Car,
  Hash,
} from 'lucide-react';
import { VehicleProcessingReport } from '../types';

interface LiveQueueTableProps {
  jobs: VehicleProcessingReport[];
  selectedJobId?: string;
  onSelectJob: (report: VehicleProcessingReport) => void;
}

export const LiveQueueTable: React.FC<LiveQueueTableProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(
    (job) =>
      job.processing_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.number_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="text-base font-bold text-slate-100">
            Live Queue & Batch History ({jobs.length} Items)
          </h3>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plate, model, ID..."
            className="w-full rounded-xl bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-3.5 py-2.5">Processing ID</th>
              <th className="px-3.5 py-2.5">Vehicle Model</th>
              <th className="px-3.5 py-2.5">Number Plate</th>
              <th className="px-3.5 py-2.5">Plate Format</th>
              <th className="px-3.5 py-2.5">Blur / Quality</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No vehicle processing jobs found matching '{searchTerm}'.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJobId === job.processing_id;

                return (
                  <tr
                    key={job.processing_id}
                    onClick={() => onSelectJob(job)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600/10 hover:bg-blue-600/20'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="px-3.5 py-3 font-mono font-medium text-blue-400">
                      {job.processing_id}
                    </td>

                    <td className="px-3.5 py-3 font-medium text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {job.manufacturer} {job.model}
                        </span>
                      </div>
                    </td>

                    <td className="px-3.5 py-3 font-mono font-bold text-amber-300">
                      {job.number_plate}
                    </td>

                    <td className="px-3.5 py-3">
                      {job.plate_valid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                          <AlertCircle className="h-3 w-3" /> Invalid
                        </span>
                      )}
                    </td>

                    <td className="px-3.5 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">
                          {job.blur_category || 'Sharp'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Score: {job.blur_score}
                        </span>
                      </div>
                    </td>

                    <td className="px-3.5 py-3">
                      {job.status === 'Completed' && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                          Completed
                        </span>
                      )}
                      {job.status === 'Processing' && (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20 animate-pulse">
                          Processing
                        </span>
                      )}
                      {job.status === 'Pending' && (
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400 border border-slate-700">
                          Queued
                        </span>
                      )}
                    </td>

                    <td className="px-3.5 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJob(job);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
