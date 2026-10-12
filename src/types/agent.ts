export type AgentId = 'qa' | 'reviewer' | 'cfo';

export type AgentFloor = 1 | 2 | 3;

export type AgentPosition =
  | 'desk'
  | 'elevator'
  | 'watercooler'
  | 'meeting'
  | 'vault'
  | 'review_desk'
  | 'qa_desk'
  | 'cfo_desk';

export type AgentAction =
  | 'idle'
  | 'walking'
  | 'typing'
  | 'inspecting'
  | 'riding_elevator'
  | 'celebrating'
  | 'paying'
  | 'reviewing';

export interface AgentState {
  id: AgentId;
  name: string;
  role: string;
  floor: AgentFloor;
  position: AgentPosition;
  xPercent: number; // horizontal % across floor (15% is elevator, 80% is desk)
  message: string;
  action: AgentAction;
  direction: 'left' | 'right';
  badgeColor: string;
  avatarSeed: string;
}

export interface ElevatorState {
  currentFloor: AgentFloor;
  targetFloor: AgentFloor;
  doorState: 'open' | 'closed' | 'moving';
  passengerId: AgentId | null;
  direction: 'up' | 'down' | 'idle';
}

export type IntegrationService = 'gemini' | 'neatlogs' | 'entire' | 'cfo';

export interface IntegrationTrace {
  id: string;
  service: IntegrationService;
  timestamp: string;
  status: 'success' | 'failed' | 'simulated' | 'pending';
  statusCode: number;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  requestBody: any;
  responseBody: any;
  latencyMs: number;
  summary: string;
}

export interface CheckpointData {
  id: string;
  timestamp: string;
  commitHash: string;
  branch: string;
  author: string;
  issueId: string;
  diagnosis: string;
  rootCause: string;
  originalCode: string;
  proposedFix: string;
  testCase: string;
}

export interface PaymentRecord {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  recipient: string;
  recipientAgent: string;
  payer: string;
  status: 'CLEARED' | 'PENDING';
  txHash: string;
  auditMemo: string;
  ledgerBalanceAfter: number;
}

export interface GitHubPushRecord {
  success: boolean;
  commitSha: string;
  commitUrl: string;
  repo: string;
  owner: string;
  branch: string;
  filePath: string;
  timestamp: string;
  simulated: boolean;
  message: string;
  error?: string;
}

export interface WorkflowProgressStep {
  step: number;
  totalSteps: number;
  title: string;
  agent: AgentId;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface WorkflowStreamEvent {
  type:
    | 'agent_move'
    | 'agent_speak'
    | 'elevator_move'
    | 'neatlogs_trace'
    | 'entire_checkpoint'
    | 'cfo_payment'
    | 'github_push'
    | 'gemini_result'
    | 'step_update'
    | 'workflow_complete'
    | 'error';
  timestamp: number;
  data: any;
}
