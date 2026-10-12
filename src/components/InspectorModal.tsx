import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Copy,
  CreditCard,
  DollarSign,
  FileCode,
  GitBranch,
  Key,
  Layers,
  Send,
  Terminal,
  X,
} from 'lucide-react';
import { CheckpointData, IntegrationTrace, PaymentRecord } from '../types/agent';

interface InspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  traces: IntegrationTrace[];
  checkpoints: CheckpointData[];
  payments: PaymentRecord[];
  activeTab?: 'traces' | 'entire' | 'cfo' | 'neatlogs' | 'keys';
  keys: {
    gemini: string;
    neatlogs: string;
    entire: string;
    cfo: string;
  };
  onSaveKeys: (keys: { gemini: string; neatlogs: string; entire: string; cfo: string }) => void;
  treasuryBalance: number;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  isOpen,
  onClose,
  traces,
  checkpoints,
  payments,
  activeTab: initialTab = 'traces',
  keys,
  onSaveKeys,
  treasuryBalance,
}) => {
  const [tab, setTab] = useState<'traces' | 'entire' | 'cfo' | 'neatlogs' | 'keys'>(initialTab);
  const [selectedTrace, setSelectedTrace] = useState<IntegrationTrace | null>(traces[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state for keys
  const [inputKeys, setInputKeys] = useState(keys);
  const [testStatus, setTestStatus] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestKey = async (service: 'gemini' | 'neatlogs' | 'entire' | 'cfo') => {
    setTestStatus((prev) => ({ ...prev, [service]: 'testing' }));
    try {
      const res = await fetch('/api/test-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, key: inputKeys[service] }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestStatus((prev) => ({ ...prev, [service]: 'success' }));
      } else {
        setTestStatus((prev) => ({ ...prev, [service]: `error: ${data.error || 'Failed'}` }));
      }
    } catch (err: any) {
      setTestStatus((prev) => ({ ...prev, [service]: `error: ${err.message}` }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-xs text-amber-400">⚡</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
                Live Integrations &amp; Dashboards Inspector
              </h2>
              <p className="font-code text-[10px] text-slate-400">
                Inspect raw HTTP requests, headers &amp; receipts sent to Gemini, Neatlogs, Entire.io &amp; CFO.ai
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setTab('traces')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-code text-xs transition-colors whitespace-nowrap ${
              tab === 'traces'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live HTTP Traces ({traces.length})
          </button>

          <button
            onClick={() => setTab('entire')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-code text-xs transition-colors whitespace-nowrap ${
              tab === 'entire'
                ? 'bg-purple-500 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Entire.io Checkpoints ({checkpoints.length})
          </button>

          <button
            onClick={() => setTab('cfo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-code text-xs transition-colors whitespace-nowrap ${
              tab === 'cfo'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            CFO.ai Ledger &amp; Bounties ({payments.length})
          </button>

          <button
            onClick={() => setTab('neatlogs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-code text-xs transition-colors whitespace-nowrap ${
              tab === 'neatlogs'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Neatlogs Observability
          </button>

          <button
            onClick={() => setTab('keys')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-code text-xs transition-colors whitespace-nowrap ${
              tab === 'keys'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            API Keys &amp; Setup
          </button>
        </div>

        {/* Tab 1: Live HTTP Traces */}
        {tab === 'traces' && (
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Trace List on Left */}
            <div className="w-full sm:w-80 border-r border-slate-800 overflow-y-auto p-3 space-y-2">
              <div className="text-[10px] font-pixel text-slate-400 px-1 uppercase">
                Captured Requests
              </div>
              {traces.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-code text-xs">
                  No traces yet. Click "Run Agents" to dispatch API requests!
                </div>
              ) : (
                traces.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => setSelectedTrace(tr)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedTrace?.id === tr.id
                        ? 'bg-slate-800 border-amber-500/80 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-pixel px-1.5 py-0.5 rounded uppercase ${
                          tr.service === 'gemini'
                            ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                            : tr.service === 'entire'
                            ? 'bg-purple-950 text-purple-400 border border-purple-500/40'
                            : tr.service === 'cfo'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
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
                      <span className="capitalize text-slate-500">{tr.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Trace Detail View on Right */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
              {selectedTrace ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-xs text-amber-400 uppercase">
                          {selectedTrace.service}
                        </span>
                        <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {selectedTrace.method}
                        </span>
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                            selectedTrace.statusCode < 300
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          }`}
                        >
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
                              endpoint: selectedTrace.endpoint,
                              headers: selectedTrace.headers,
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

                  {/* Headers */}
                  <div className="mt-3">
                    <div className="text-[10px] font-pixel text-slate-400 mb-1">
                      Request Headers
                    </div>
                    <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                      {JSON.stringify(selectedTrace.headers, null, 2)}
                    </pre>
                  </div>

                  {/* Outgoing Request Payload */}
                  <div className="mt-3">
                    <div className="text-[10px] font-pixel text-slate-400 mb-1">
                      Outgoing Request Payload
                    </div>
                    <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-52">
                      {JSON.stringify(selectedTrace.requestBody, null, 2)}
                    </pre>
                  </div>

                  {/* Incoming Response */}
                  <div className="mt-3">
                    <div className="text-[10px] font-pixel text-slate-400 mb-1">
                      Incoming Response Body
                    </div>
                    <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56">
                      {JSON.stringify(selectedTrace.responseBody, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 font-code text-xs">
                  Select a trace from the left to view full request and response payloads.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Entire.io Checkpoints */}
        {tab === 'entire' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-pixel text-xs text-purple-400">
                  Entire.io Context &amp; Checkpoints Registry
                </h3>
                <p className="font-code text-xs text-slate-400">
                  Autonomous sessions captured and linked to git commits
                </p>
              </div>
              <span className="font-pixel text-[10px] bg-purple-950 text-purple-300 px-2.5 py-1 rounded border border-purple-500/40">
                entire enable (Active)
              </span>
            </div>

            {checkpoints.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-code text-xs">
                No checkpoints stored yet. Run the agents to see QA Agent 1 publish a session checkpoint!
              </div>
            ) : (
              checkpoints.map((chk) => (
                <div
                  key={chk.id}
                  className="bg-slate-950 border-2 border-purple-500/30 rounded-xl p-4 space-y-3 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-purple-400" />
                      <span className="font-mono text-sm font-bold text-slate-100">
                        {chk.id}
                      </span>
                      <span className="font-mono text-xs bg-slate-800 text-purple-300 px-2 py-0.5 rounded">
                        {chk.branch}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Commit: <span className="text-slate-200">{chk.commitHash}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-code">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-pixel text-slate-400 block mb-1">
                        DIAGNOSIS (QA)
                      </span>
                      <p className="text-slate-200 font-medium">{chk.diagnosis}</p>
                      <p className="text-slate-400 text-[11px] mt-1">{chk.rootCause}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-pixel text-slate-400 block mb-1">
                        UNIT TEST HARNESS
                      </span>
                      <pre className="text-[10px] font-mono text-emerald-400 overflow-x-auto">
                        {chk.testCase}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-pixel text-slate-400 block mb-1">
                      PROPOSED REMEDIATION
                    </span>
                    <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                      {chk.proposedFix}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: CFO.ai Ledger & Bounties */}
        {tab === 'cfo' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {/* Header & Balance */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/40 rounded-xl">
              <div>
                <span className="text-[10px] font-pixel text-amber-400 uppercase">
                  CFO.ai Autonomous Treasury
                </span>
                <div className="font-pixel text-xl sm:text-2xl text-amber-300 mt-1">
                  ${treasuryBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </div>
                <p className="text-[10px] font-code text-slate-400 mt-0.5">
                  Automated bounty payout system powered by CFO.ai MCP tools
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-pixel text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40">
                  INSTANT SETTLEMENT: ACTIVE
                </span>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Bounty Rate: $50.00 / verified bug
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="text-[10px] font-pixel text-slate-400 px-1 uppercase">
              Bounty Transactions
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-code text-xs">
                No bounty payments yet. Run the workflow to watch the CFO Agent disburse a $50 reward!
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

        {/* Tab 4: Neatlogs Telemetry */}
        {tab === 'neatlogs' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-pixel text-xs text-emerald-400">
                  Neatlogs Observability Stream
                </h3>
                <p className="font-code text-xs text-slate-400">
                  Real-time telemetry and decision tracing for autonomous agents
                </p>
              </div>
              <span className="font-pixel text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/40">
                Ingestion: api.neatlogs.com/v1/traces
              </span>
            </div>

            <div className="space-y-2">
              {traces.length === 0 ? (
                <div className="text-center py-16 text-slate-500 font-code text-xs">
                  No telemetry logged yet. Start the agent cycle to stream Neatlogs traces!
                </div>
              ) : (
                traces.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs flex items-start gap-3"
                  >
                    <span className="text-slate-500 shrink-0">
                      {new Date(tr.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`text-[9px] font-pixel px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        tr.status === 'success'
                          ? 'bg-emerald-950 text-emerald-400'
                          : tr.status === 'simulated'
                          ? 'bg-blue-950 text-blue-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {tr.status}
                    </span>
                    <div className="flex-1">
                      <div className="text-slate-200 font-medium">{tr.summary}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                        ID: {tr.id} | Latency: {tr.latencyMs}ms | HTTP {tr.statusCode}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: API Keys & Setup */}
        {tab === 'keys' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            <div>
              <h3 className="font-pixel text-xs text-cyan-400">
                API Keys &amp; Live Integration Settings
              </h3>
              <p className="font-code text-xs text-slate-400">
                Enter your sponsor API keys to sync data directly to your live Entire, CFO.ai, and Neatlogs dashboards.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Gemini */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-pixel text-xs text-blue-400">
                    Google Gemini API Key
                  </label>
                  <button
                    onClick={() => handleTestKey('gemini')}
                    className="text-[10px] font-code px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    Test Ping
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Defaults to server process.env.GEMINI_API_KEY"
                  value={inputKeys.gemini}
                  onChange={(e) => setInputKeys({ ...inputKeys, gemini: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
                {testStatus.gemini && (
                  <div className="text-[10px] font-mono text-cyan-300">
                    Status: {testStatus.gemini}
                  </div>
                )}
              </div>

              {/* Neatlogs */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-pixel text-xs text-emerald-400">
                    Neatlogs API Key
                  </label>
                  <button
                    onClick={() => handleTestKey('neatlogs')}
                    className="text-[10px] font-code px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    Test Ping
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Defaults to server process.env.NEATLOGS_API_KEY"
                  value={inputKeys.neatlogs}
                  onChange={(e) => setInputKeys({ ...inputKeys, neatlogs: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
                {testStatus.neatlogs && (
                  <div className="text-[10px] font-mono text-emerald-300">
                    Status: {testStatus.neatlogs}
                  </div>
                )}
              </div>

              {/* Entire.io */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-pixel text-xs text-purple-400">
                    Entire.io API Key
                  </label>
                  <button
                    onClick={() => handleTestKey('entire')}
                    className="text-[10px] font-code px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    Test Ping
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Defaults to server process.env.ENTIRE_API_KEY"
                  value={inputKeys.entire}
                  onChange={(e) => setInputKeys({ ...inputKeys, entire: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                />
                {testStatus.entire && (
                  <div className="text-[10px] font-mono text-purple-300">
                    Status: {testStatus.entire}
                  </div>
                )}
              </div>

              {/* CFO.ai */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-pixel text-xs text-amber-400">
                    CFO.ai API Key
                  </label>
                  <button
                    onClick={() => handleTestKey('cfo')}
                    className="text-[10px] font-code px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    Test Ping
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Defaults to server process.env.CFO_API_KEY"
                  value={inputKeys.cfo}
                  onChange={(e) => setInputKeys({ ...inputKeys, cfo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                {testStatus.cfo && (
                  <div className="text-[10px] font-mono text-amber-300">
                    Status: {testStatus.cfo}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  onSaveKeys(inputKeys);
                  onClose();
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs rounded-lg font-bold shadow-lg shadow-amber-500/20"
              >
                SAVE &amp; APPLY KEYS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
