import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { VehicleProcessingReport } from '../types';

interface AiAgentSummaryCardProps {
  report: VehicleProcessingReport;
}

export const AiAgentSummaryCard: React.FC<AiAgentSummaryCardProps> = ({ report }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'agent'; text: string }[]
  >([]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userText = question.trim();
    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ask-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processing_id: report.processing_id,
          report,
          question: userText,
        }),
      });

      const data = await response.json();
      if (data.answer) {
        setChatHistory((prev) => [...prev, { role: 'agent', text: data.answer }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: 'agent', text: 'Unable to process query. Please try again.' },
        ]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'agent',
          text: 'Error communicating with AI Agent backend.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isApproved =
    !report.tampered && report.plate_valid && report.image_quality !== 'Poor';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                Gemini AI Agent Reasoning Report
              </h3>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                LLM Synthesis
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Contextual reasoning over CV features, OCR, Blur & Forensics
            </p>
          </div>
        </div>

        {/* Verdict Badge */}
        {isApproved ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" />
            <span>Approved Verification</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <span>Audit / Fraud Flagged</span>
          </span>
        )}
      </div>

      {/* Main AI Summary Box */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Executive Agent Findings & Justification</span>
          </div>
          <span className="text-[10px] text-slate-400">Gemini 3.6 Flash</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {report.ai_summary}
        </p>

        {(!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'MY_GEMINI_API_KEY') && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
            Gemini is running in fallback mode. Add a real GEMINI_API_KEY in your environment to enable live AI reasoning.
          </div>
        )}

        {report.ai_suitability && (
          <div className="pt-2 border-t border-indigo-500/20 flex items-center gap-2 text-xs font-bold text-amber-300">
            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Suitability Determination: {report.ai_suitability}</span>
          </div>
        )}
      </div>

      {/* Interactive AI Chat Prompt */}
      <div className="space-y-3 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <span>Ask AI Agent About This Vehicle Inspection</span>
          </div>
          <span className="text-[10px] text-slate-500">Interactive Assistant</span>
        </div>

        {/* Chat History Messages */}
        {chatHistory.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}
                >
                  <p className="font-semibold text-[10px] opacity-70 mb-0.5">
                    {msg.role === 'user' ? 'You' : 'Gemini AI Agent'}
                  </p>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>AI Agent reasoning over inspection data...</span>
              </div>
            )}
          </div>
        )}

        {/* Question Form Input */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Why was the plate marked as valid? Explain blur score..."
            className="flex-1 rounded-xl bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
