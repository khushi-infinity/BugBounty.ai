/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  DollarSign,
  FileCode,
  GitBranch,
  Github,
  Key,
  Layers,
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CodeDiffModal } from './components/CodeDiffModal';
import { CodeInputPanel } from './components/CodeInputPanel';
import { DollhouseBuilding } from './components/dollhouse/DollhouseBuilding';
import { InspectorModal } from './components/InspectorModal';
import {
  AgentFloor,
  AgentId,
  AgentPosition,
  AgentState,
  CheckpointData,
  ElevatorState,
  GitHubPushRecord,
  IntegrationTrace,
  PaymentRecord,
  WorkflowProgressStep,
  WorkflowStreamEvent,
} from './types/agent.ts';
import { sfx } from './utils/sound';

const INITIAL_AGENTS: AgentState[] = [
  {
    id: 'qa',
    name: 'Bugsy',
    role: 'QA Specialist (Agent 1)',
    floor: 3,
    position: 'qa_desk',
    xPercent: 75,
    message: 'Standing by at QA Lab. Paste buggy code below!',
    action: 'idle',
    direction: 'right',
    badgeColor: '#38bdf8',
    avatarSeed: 'qa_01',
  },
  {
    id: 'reviewer',
    name: 'Dr. Patch',
    role: 'Code Reviewer (Agent 2)',
    floor: 2,
    position: 'review_desk',
    xPercent: 68,
    message: 'Awaiting Entire.io checkpoints to conduct code review...',
    action: 'idle',
    direction: 'left',
    badgeColor: '#a855f7',
    avatarSeed: 'rev_02',
  },
  {
    id: 'cfo',
    name: 'Ledger-9000',
    role: 'CFO Bot (Agent 3)',
    floor: 1,
    position: 'cfo_desk',
    xPercent: 78,
    message: 'Treasury unlocked. Ready to disburse $50 bounty via CFO.ai.',
    action: 'idle',
    direction: 'left',
    badgeColor: '#f59e0b',
    avatarSeed: 'cfo_03',
  },
];

const INITIAL_ELEVATOR: ElevatorState = {
  currentFloor: 3,
  targetFloor: 3,
  doorState: 'closed',
  passengerId: null,
  direction: 'idle',
};

const DEFAULT_CODE = `// Buggy loop: index out of bounds
function calculateBatchTotal(items) {
  let total = 0;
  // BUG: using <= items.length causes items[items.length] to be undefined!
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price; // TypeError: Cannot read property 'price' of undefined
  }
  return total;
}`;

export default function App() {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [elevator, setElevator] = useState<ElevatorState>(INITIAL_ELEVATOR);
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Integrations state
  const [traces, setTraces] = useState<IntegrationTrace[]>([]);
  const [checkpoints, setCheckpoints] = useState<CheckpointData[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [githubPushes, setGithubPushes] = useState<GitHubPushRecord[]>([]);
  const [treasuryBalance, setTreasuryBalance] = useState<number>(12500);
  const [currentStep, setCurrentStep] = useState<WorkflowProgressStep | null>(null);

  // Modals state
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [inspectorTab, setInspectorTab] = useState<'traces' | 'entire' | 'cfo' | 'neatlogs' | 'github' | 'keys'>('traces');
  const [diffModalOpen, setDiffModalOpen] = useState<boolean>(false);
  const [completedResult, setCompletedResult] = useState<any>(null);

  // Recent toast notification
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  // User-provided API keys (in addition to process.env)
  const [keys, setKeys] = useState({
    gemini: '',
    neatlogs: '',
    entire: '',
    cfo: '',
    githubToken: '',
    githubOwner: '',
    githubRepo: '',
    githubBranch: 'main',
  });

  // Load configured keys status from server on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.keys?.gemini) {
          console.log('Server Gemini API key detected');
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  /**
   * The Agent Movement System requested by user:
   * moveAgent(id, floor, position, xPercent?, action?, message?, direction?)
   */
  const moveAgent = (
    id: AgentId,
    floor: AgentFloor,
    position: AgentPosition,
    xPercent?: number,
    action?: AgentState['action'],
    message?: string,
    direction?: 'left' | 'right'
  ) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const defaultX =
            position === 'elevator'
              ? 14
              : position === 'qa_desk'
              ? 75
              : position === 'review_desk'
              ? 68
              : position === 'cfo_desk'
              ? 78
              : 50;

          return {
            ...agent,
            floor,
            position,
            xPercent: xPercent !== undefined ? xPercent : defaultX,
            action: action || agent.action,
            message: message !== undefined ? message : agent.message,
            direction: direction || agent.direction,
          };
        }
        return agent;
      })
    );
  };

  const handleReset = () => {
    setAgents(INITIAL_AGENTS);
    setElevator(INITIAL_ELEVATOR);
    setCurrentStep(null);
    setIsRunning(false);
    showToast('Dollhouse simulation reset to starting positions', 'info');
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sfx.enabled = next;
    if (next) sfx.playCoinPayout();
  };

  /**
   * Run the Autonomous Agent Workflow with Real API Integrations & Streaming SSE
   */
  const handleRunAgents = async () => {
    if (isRunning || !code.trim()) return;

    setIsRunning(true);
    setCurrentStep({
      step: 1,
      totalSteps: 7,
      title: 'Connecting to Autonomous Agent HQ',
      agent: 'qa',
      status: 'in_progress',
    });

    sfx.playStep();
    showToast('Starting BugBounty autonomous agents...', 'info');

    try {
      const response = await fetch('/api/run-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          keys,
          animationDelay: speed === 'fast' ? 500 : 1100,
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported on this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') {
              break;
            }
            try {
              const event: WorkflowStreamEvent = JSON.parse(jsonStr);
              handleStreamEvent(event);
            } catch (parseErr) {
              // ignore malformed chunks
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Agent execution error:', err);
      showToast(err.message || 'Workflow connection error', 'warn');
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Process incoming SSE workflow events in real time
   */
  const handleStreamEvent = (event: WorkflowStreamEvent) => {
    const { type, data } = event;

    switch (type) {
      case 'agent_move':
        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.id === data.id) {
              return {
                ...agent,
                floor: data.floor,
                position: data.position,
                xPercent: data.xPercent ?? agent.xPercent,
                action: data.action ?? agent.action,
                direction: data.direction ?? agent.direction,
              };
            }
            return agent;
          })
        );
        sfx.playStep();
        break;

      case 'agent_speak':
        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.id === data.id) {
              return {
                ...agent,
                message: data.message,
              };
            }
            return agent;
          })
        );
        break;

      case 'elevator_move':
        setElevator((prev) => ({
          ...prev,
          currentFloor: data.currentFloor ?? prev.currentFloor,
          targetFloor: data.targetFloor ?? prev.targetFloor,
          doorState: data.doorState ?? prev.doorState,
          passengerId: data.passengerId !== undefined ? data.passengerId : prev.passengerId,
          direction: data.direction ?? prev.direction,
        }));
        if (data.doorState === 'open') {
          sfx.playElevatorDing();
        }
        break;

      case 'step_update':
        setCurrentStep(data);
        break;

      case 'neatlogs_trace':
        setTraces((prev) => [data, ...prev]);
        showToast(data.summary, data.status === 'success' ? 'success' : 'info');
        break;

      case 'entire_checkpoint':
        setCheckpoints((prev) => [data, ...prev]);
        showToast(`Entire.io Checkpoint published: ${data.id}`, 'info');
        sfx.playBugAlert();
        break;

      case 'cfo_payment':
        setPayments((prev) => [data, ...prev]);
        setTreasuryBalance((prev) => data.ledgerBalanceAfter ?? (prev + (data.amount || 50)));
        showToast(`CFO.ai: $50.00 bounty payment cleared!`, 'success');
        sfx.playCoinPayout();
        break;

      case 'github_push':
        setGithubPushes((prev) => [data, ...prev]);
        showToast(data.message || 'GitHub auto-push completed!', data.success ? 'success' : 'warn');
        break;

      case 'workflow_complete':
        setCompletedResult(data);
        showToast('Bug fix verified and bounty paid!', 'success');
        setTimeout(() => {
          setDiffModalOpen(true);
        }, 1200);
        break;

      case 'error':
        showToast(data.message || 'Agent error occurred', 'warn');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-code relative overflow-x-hidden">
      {/* Scanline CRT overlay effect */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-40" />

      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b-2 border-slate-800 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-pixel text-xs text-slate-950 border-2 border-amber-300 shadow-md">
              👾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-xs sm:text-sm text-slate-100 tracking-wide">
                  BugBounty.ai
                </h1>
                <span className="text-[9px] font-pixel bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                  v1.0 LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-code">
                Autonomous 2D Dollhouse Software Agency
              </p>
            </div>
          </div>

          {/* Integration Links & Quick Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setInspectorTab('traces');
                setInspectorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="Inspect real HTTP calls to Gemini, Neatlogs, Entire.io, and CFO.ai"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Inspect</span>
              <span className="font-mono text-[10px] bg-slate-800 px-1 py-0.2 rounded text-cyan-300">
                {traces.length}
              </span>
            </button>

            <button
              onClick={() => {
                setInspectorTab('github');
                setInspectorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="GitHub Commits & Auto-Pushes via Octokit"
            >
              <Github className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">GitHub</span>
              <span className="font-mono text-[10px] bg-slate-800 px-1 py-0.2 rounded text-blue-300">
                {githubPushes.length}
              </span>
            </button>

            <button
              onClick={() => {
                setInspectorTab('entire');
                setInspectorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="Entire.io Checkpoints"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Entire</span>
              <span className="font-mono text-[10px] bg-slate-800 px-1 py-0.2 rounded text-purple-300">
                {checkpoints.length}
              </span>
            </button>

            <button
              onClick={() => {
                setInspectorTab('cfo');
                setInspectorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="CFO.ai Bounties & Ledger"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">CFO.ai</span>
              <span className="font-mono text-[10px] bg-slate-800 px-1 py-0.2 rounded text-amber-300 font-bold">
                ${payments.length * 50}
              </span>
            </button>

            {completedResult && (
              <button
                onClick={() => setDiffModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-500/50 transition-colors animate-pulse"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>View PR Fix</span>
              </button>
            )}

            <button
              onClick={() => {
                setInspectorTab('keys');
                setInspectorOpen(true);
              }}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title="Configure API Keys"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={toggleSound}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title={soundEnabled ? 'Mute 8-bit sound fx' : 'Unmute 8-bit sound fx'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-4 flex flex-col justify-center">
        {/* Active Workflow Progress Indicator */}
        {currentStep && (
          <div className="w-full max-w-5xl mx-auto mb-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-pixel text-[10px] text-amber-300 uppercase">
                Step {currentStep.step}/{currentStep.totalSteps}:
              </span>
              <span className="font-code text-slate-200">{currentStep.title}</span>
            </div>
            <span className="text-[10px] font-pixel text-slate-400 uppercase">
              Agent: {currentStep.agent}
            </span>
          </div>
        )}

        {/* 2D Side-Scrolling Pixel Art Dollhouse Building */}
        <DollhouseBuilding
          agents={agents}
          elevator={elevator}
          treasuryBalance={treasuryBalance}
          activeFloorHighlight={
            currentStep?.agent === 'qa' ? 3 : currentStep?.agent === 'reviewer' ? 2 : currentStep?.agent === 'cfo' ? 1 : null
          }
        />

        {/* Bottom Code Input Panel titled 'Submit Buggy Code' and 'Run Agents' */}
        <CodeInputPanel
          code={code}
          setCode={setCode}
          isRunning={isRunning}
          onRunAgents={handleRunAgents}
          onReset={handleReset}
          speed={speed}
          setSpeed={setSpeed}
        />
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border-2 border-slate-700 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 font-code text-xs animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modals */}
      <InspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        traces={traces}
        checkpoints={checkpoints}
        payments={payments}
        githubPushes={githubPushes}
        activeTab={inspectorTab}
        keys={keys}
        onSaveKeys={(newKeys) => {
          setKeys(newKeys);
          showToast('API keys & GitHub settings saved', 'success');
        }}
        treasuryBalance={treasuryBalance}
      />

      <CodeDiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        result={completedResult}
      />
    </div>
  );
}
