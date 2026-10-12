import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, Zap } from 'lucide-react';

interface CodeInputPanelProps {
  code: string;
  setCode: (code: string) => void;
  isRunning: boolean;
  onRunAgents: () => void;
  onReset: () => void;
  speed: 'normal' | 'fast';
  setSpeed: (speed: 'normal' | 'fast') => void;
}

const PRESETS = [
  {
    name: 'Loop Boundary Bug (JS)',
    lang: 'javascript',
    code: `// Buggy loop: index out of bounds
function calculateBatchTotal(items) {
  let total = 0;
  // BUG: using <= items.length causes items[items.length] to be undefined!
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price; // TypeError: Cannot read property 'price' of undefined
  }
  return total;
}`,
  },
  {
    name: 'SQL Injection Flaw (Python)',
    lang: 'python',
    code: `# Critical vulnerability: raw query concatenation
def authenticate_user(db, username, password):
    # BUG: SQL Injection vulnerability!
    query = f"SELECT * FROM accounts WHERE user = '{username}' AND pass = '{password}'"
    return db.execute(query).fetchone()`,
  },
  {
    name: 'Async Race Condition (React)',
    lang: 'typescript',
    code: `// Buggy React hook without cancellation
function useUserProfile(userId: string) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // BUG: Missing cleanup/abort controller; causes state race condition
    fetchUser(userId).then(data => {
      setProfile(data);
    });
  }, [userId]);

  return profile;
}`,
  },
  {
    name: 'Null Reference Crash (Node)',
    lang: 'javascript',
    code: `// Unhandled null reference
function parsePaymentWebhook(payload) {
  // BUG: crashes if payload.data or customer is null
  const email = payload.data.customer.billing_email;
  const amount = payload.data.transaction.amount_cents;
  return { email, amount };
}`,
  },
];

export const CodeInputPanel: React.FC<CodeInputPanelProps> = ({
  code,
  setCode,
  isRunning,
  onRunAgents,
  onReset,
  speed,
  setSpeed,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);

  const handleSelectPreset = (index: number) => {
    setSelectedPreset(index);
    setCode(PRESETS[index].code);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 bg-slate-900 border-2 border-slate-800 rounded-xl p-4 shadow-xl">
      {/* Header with Title and Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-amber-400">⚡</span>
          <h2 className="font-pixel text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
            Submit Buggy Code
          </h2>
          <span className="text-[10px] font-code text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Agent Autonomous Intake
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-code text-slate-400 shrink-0">
            Presets:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(idx)}
              disabled={isRunning}
              className={`text-[10px] font-code px-2 py-1 rounded transition-colors whitespace-nowrap ${
                selectedPreset === idx
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
              } disabled:opacity-50`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Code Textarea */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isRunning}
          placeholder="Paste buggy code or a GitHub issue snippet here..."
          rows={5}
          className="w-full bg-slate-950 border-2 border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-amber-500/70 transition-colors placeholder:text-slate-600 resize-y"
          spellCheck={false}
        />
        <div className="absolute top-2 right-2 flex items-center gap-2 pointer-events-none">
          <span className="text-[9px] font-code text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
            UTF-8
          </span>
        </div>
      </div>

      {/* Action Buttons & Speed Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
        {/* Speed & Helper Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[10px] font-code text-slate-400">
            <span>Walk Speed:</span>
            <button
              onClick={() => setSpeed('normal')}
              className={`px-1.5 py-0.5 rounded ${
                speed === 'normal'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1x Real
            </button>
            <button
              onClick={() => setSpeed('fast')}
              className={`px-1.5 py-0.5 rounded ${
                speed === 'fast'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2x Fast
            </button>
          </div>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-code text-slate-400 hover:text-slate-200 bg-slate-800/60 rounded border border-slate-700/60 disabled:opacity-50"
            title="Reset dollhouse agents to default positions"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Big "Run Agents" Button */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-2">
          <button
            onClick={onRunAgents}
            disabled={isRunning || !code.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 font-pixel text-xs px-6 py-3 rounded-lg transition-all ${
              isRunning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-2 border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold pixel-button border-2 border-amber-300 cursor-pointer shadow-lg shadow-amber-500/20 active:translate-y-1'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>AGENTS IN MOTION...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>RUN AGENTS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
