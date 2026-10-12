import React, { useState } from 'react';
import { CheckCircle2, Copy, Shield, Sparkles, X } from 'lucide-react';

interface CodeDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    diagnosis?: any;
    review?: any;
    checkpoint?: any;
    payment?: any;
    originalCode?: string;
    finalCode?: string;
  } | null;
}

export const CodeDiffModal: React.FC<CodeDiffModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(result.finalCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 text-lg">✨</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
                Autonomous PR Resolved &amp; Verified
              </h2>
              <p className="font-code text-[10px] text-slate-400">
                Fix reviewed by Dr. Patch (Agent 2) &amp; verified by Gemini 3.8 Flash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-pixel text-xs text-emerald-300">
                  {result.diagnosis?.bugTitle || 'Bug Remediation Complete'}
                </span>
                <p className="font-code text-xs text-slate-300 mt-0.5">
                  {result.diagnosis?.rootCause}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-pixel bg-slate-900 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Score: {result.review?.securityScore || 'A+'}
              </span>
              <span className="text-[10px] font-pixel bg-amber-950 text-amber-300 px-2 py-1 rounded border border-amber-500/40">
                Bounty: $50.00 PAID
              </span>
            </div>
          </div>

          {/* Side-by-Side Diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Buggy Code */}
            <div>
              <div className="flex items-center justify-between pb-1 text-[10px] font-pixel text-rose-400">
                <span>BEFORE (BUGGY)</span>
                <span className="text-slate-500 font-mono">Original</span>
              </div>
              <pre className="p-3 bg-slate-950 border border-rose-900/60 rounded-lg text-xs font-mono text-rose-300 overflow-x-auto max-h-60 leading-relaxed">
                {result.originalCode}
              </pre>
            </div>

            {/* Fixed Code */}
            <div>
              <div className="flex items-center justify-between pb-1 text-[10px] font-pixel text-emerald-400">
                <span>AFTER (VERIFIED PATCH)</span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-[10px] font-code text-slate-400 hover:text-slate-200"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 border border-emerald-900/60 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-60 leading-relaxed">
                {result.finalCode}
              </pre>
            </div>
          </div>

          {/* Unit Test & Entire.io Checkpoint */}
          {result.diagnosis?.testCase && (
            <div>
              <div className="text-[10px] font-pixel text-slate-400 mb-1">
                VERIFICATION TEST CASE (ENTIRE.IO CHECKPOINT)
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto">
                {result.diagnosis.testCase}
              </pre>
            </div>
          )}

          {/* Review Notes */}
          {result.review?.reviewNotes && (
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-[10px] font-pixel text-purple-400 block mb-1">
                PEER REVIEW NOTES (DR. PATCH)
              </span>
              <p className="font-code text-xs text-slate-300 leading-relaxed">
                {result.review.reviewNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
