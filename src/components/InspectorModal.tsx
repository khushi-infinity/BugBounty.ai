import React, { useState } from 'react';
import {
  Copy,
  DollarSign,
  ExternalLink,
  Terminal,
  X,
} from 'lucide-react';
import { IntegrationTrace, PaymentRecord } from '../types/agent.ts';

interface InspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  traces: IntegrationTrace[];
  payments: PaymentRecord[];
  activeTab?: 'neatlogs' | 'cfo';
  treasuryBalance: number;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  isOpen,
  onClose,
  traces,
  payments,
  activeTab: initialTab = 'neatlogs',
  treasuryBalance,
}) => {
  const [tab, setTab] = useState<'neatlogs' | 'cfo'>(initialTab);
  const [selectedTrace, setSelectedTrace] = useState<IntegrationTrace | null>(
    traces.find((t) => t.service === 'neatlogs' || t.service === 'gemini') || traces[0] || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="font-pixel text-xs text-amber-400">⚡</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
                Live Sponsor Telemetry &amp; Audit Logs
              </h2>
              <p className="font-code text-[10px] text-slate-400">
                Live telemetry stream to Neatlogs &amp; autonomous bounty payouts via CFO.ai
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

        {/* Tab Navigation - ONLY Neatlogs and CFO.ai */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('neatlogs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-[11px] transition-colors ${
                tab === 'neatlogs'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              NEATLOGS OBSERVABILITY
            </button>

            <button
              onClick={() => setTab('cfo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-[11px] transition-colors ${
                tab === 'cfo'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              CFO.AI LEDGER &amp; BOUNTIES ({payments.length})
            </button>
          </div>

          {/* Quick link out to official dashboards */}
          <div>
            {tab === 'neatlogs' ? (
              <a
                href="https://app.neatlogs.com/projects/a52ebdf3-6dbb-448d-91cd-f8cb4090921b/traces"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 text-[11px] font-pixel text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40"
              >
                <span>OPEN NEATLOGS DASHBOARD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <a
                href="https://app.cfo.ai"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 text-[11px] font-pixel text-amber-400 hover:text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/40"
              >
                <span>OPEN CFO.AI DASHBOARD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Tab 1: Neatlogs Observability */}
        {tab === 'neatlogs' && (
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Left Column: Trace List */}
            <div className="w-full sm:w-80 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/50">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-[10px] font-pixel text-emerald-400 uppercase">
                  Project Traces
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  ID: a52ebdf3...
                </span>
              </div>

              {traces.length === 0 ? (
                <div className="text-center py-16 text-slate-500 font-code text-xs">
                  No telemetry logged yet. Click "RUN AGENTS" to dispatch traces to Neatlogs!
                </div>
              ) : (
                traces.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => setSelectedTrace(tr)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedTrace?.id === tr.id
                        ? 'bg-slate-800 border-emerald-500/80 shadow-md'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-pixel px-1.5 py-0.5 rounded uppercase ${
                          tr.status === 'success'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-blue-950 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {tr.service}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {tr.latencyMs}ms
                      </span>
                    </div>
                    <div className="text-xs font-code text-slate-200 font-medium truncate">
                      {tr.summary}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-400">
                      <span>HTTP {tr.statusCode}</span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(tr.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Column: Trace Details & JSON */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
              {selectedTrace ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-xs text-emerald-400 uppercase">
                          {selectedTrace.service}
                        </span>
                        <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {selectedTrace.method}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                          HTTP {selectedTrace.statusCode}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-400 mt-1 break-all">
                        {selectedTrace.endpoint}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            {
                              id: selectedTrace.id,
                              endpoint: selectedTrace.endpoint,
                              request: selectedTrace.requestBody,
                              response: selectedTrace.responseBody,
                            },
                            null,
                            2
                          ),
                          'trace_json'
                        )
                      }
                      className="flex items-center gap-1 text-xs font-code text-slate-400 hover:text-slate-200 bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedId === 'trace_json' ? 'Copied!' : 'Copy JSON'}
                    </button>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs font-code text-emerald-200">
                    {selectedTrace.summary}
                  </div>

                  {/* Payload */}
                  <div>
                    <div className="text-[10px] font-pixel text-slate-400 mb-1">
                      Event Metadata / Request Payload
                    </div>
                    <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
                      {JSON.stringify(selectedTrace.requestBody, null, 2)}
                    </pre>
                  </div>

                  {/* Response Body */}
                  <div>
                    <div className="text-[10px] font-pixel text-slate-400 mb-1">
                      Neatlogs Ingest Response
                    </div>
                    <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48 leading-relaxed">
                      {JSON.stringify(selectedTrace.responseBody, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 font-code text-xs">
                  Select a trace from the left to view payload details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: CFO.ai Ledger & Bounties */}
        {tab === 'cfo' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {/* Header & Balance */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/40 rounded-xl">
              <div>
                <span className="text-[10px] font-pixel text-amber-400 uppercase">
                  CFO.ai Autonomous Treasury Ledger
                </span>
                <div className="font-pixel text-xl sm:text-2xl text-amber-300 mt-1">
                  ${treasuryBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </div>
                <p className="text-[10px] font-code text-slate-400 mt-0.5">
                  Automated bounty payout system powered by CFO.ai MCP tools
                </p>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5">
                <span className="text-[10px] font-pixel text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40">
                  INSTANT SETTLEMENT: ACTIVE
                </span>
                <a
                  href="https://app.cfo.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-pixel text-amber-300 hover:text-amber-200 flex items-center gap-1 underline"
                >
                  View in CFO.ai Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Payout History */}
            <div className="text-[10px] font-pixel text-slate-400 px-1 uppercase">
              Bounty Transactions Cleared ({payments.length})
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-code text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                No bounty payments cleared yet. Click "RUN AGENTS" to watch the CFO Agent disburse a $50 reward!
              </div>
            ) : (
              payments.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-sm text-emerald-400">
                        +${p.amount.toFixed(2)} {p.currency}
                      </span>
                      <span className="text-[9px] font-pixel bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        {p.status}
                      </span>
                    </div>
                    <div className="text-xs font-code text-slate-200">
                      Recipient: <span className="text-amber-300">{p.recipientAgent}</span>
                    </div>
                    <div className="text-[11px] font-code text-slate-400">
                      Memo: {p.auditMemo}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      TxHash: {p.txHash}
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `CFO.AI RECEIPT\nID: ${p.id}\nAmount: $${p.amount} USD\nTxHash: ${p.txHash}\nRecipient: ${p.recipientAgent}\nStatus: ${p.status}`,
                          p.id
                        )
                      }
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-code rounded border border-slate-700 flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedId === p.id ? 'Receipt Copied!' : 'Copy Receipt'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
