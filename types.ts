// All type definitions used across the application.

export enum ViewType {
  UNIFIED_DASHBOARD = 'unified_dashboard',
  DASHBOARD = 'dashboard',
  STRATEGIES = 'strategies',
  LOGS = 'logs',
}

export type StrategyStatus = 'RUNNING' | 'STOPPED' | 'ERROR' | 'STARTING' | 'STOPPING';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: StrategyStatus;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface PnlEntry {
  time: string;
  pnl: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
}

export interface ProcessStats {
  balance: number;
  equity: number;
  dailyPnl: number;
  dailyPnlPercent: number;
  openPositions: Position[];
  pnlHistory: PnlEntry[];
  logs: LogEntry[];
  uptime: string;
  activeProcesses: number;
  maxConcurrency: number;
}

// OG Dashboard Types
export enum HubStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  DEGRADED = 'DEGRADED', // Using mock data
}

export interface KpiState {
    portfolio: number;
    pnl: number;
    edgeMs: number;
    cu: {
        used: number;
        total: number;
    };
    strategies: {
        enabled: number;
        total: number;
    };
    uptimeSec: number;
}

export interface TokenHistoryPoint {
    ts: number;
    score: number;
}

export interface TokenState {
    score: number;
    liq: number;
    tags?: string[];
    history: TokenHistoryPoint[];
    updatedAt: number;
}

export interface OpportunityEvent {
    id: string;
    title: string;
    desc: string;
    score: number;
}

export interface LogEvent {
    ts: number;
    level: LogLevel;
    msg: string;
}

export interface AnalyticsState {
    volatility: number;
    liquidity: number;
    stability: number;
}

export interface PerformanceHistoryState {
    line: { time: number; value: number }[];
    bar: { time: number; value: number }[];
}

export enum CouncilDecisionStatus {
    VOTING = 'VOTING',
    PASSED = 'PASSED',
    REJECTED = 'REJECTED',
    EXECUTING = 'EXECUTING',
    COMPLETE = 'COMPLETE'
}

export interface CouncilVote {
    agent: 'Risk' | 'Alpha' | 'Exec' | 'Compliance';
    vote: 'YES' | 'NO';
    confidence: number;
    reason: string;
}

export interface CouncilDecision {
    id: string;
    title: string;
    description: string;
    status: CouncilDecisionStatus;
    votes: CouncilVote[];
    expiresAt: number; // timestamp
    evidence: string[];
}

// Hub Event Types
export interface KpiEvent { type: 'KPI'; data: KpiState }
export interface TokenUpdateEvent { type: 'TOKEN_UPDATE'; data: Record<string, Omit<TokenState, 'history' | 'updatedAt'>> }
export interface OpportunityUpdateEvent { type: 'OPPORTUNITY'; data: OpportunityEvent }
export interface LogUpdateEvent { type: 'LOG'; data: LogEvent }
export interface AnalyticsEvent { type: 'ANALYTICS'; data: AnalyticsState }
export interface PerfHistoryEvent { type: 'PERF_HISTORY'; data: PerformanceHistoryState }

// Council Decision Events
export interface DecisionProposedEvent { type: 'decision.proposed', data: CouncilDecision }
export interface DecisionVoteEvent { type: 'decision.vote', data: { decisionId: string; vote: CouncilVote } }
export interface DecisionFinalizedEvent { type: 'decision.finalized', data: { decisionId: string; result: 'PASSED' | 'REJECTED' } }

export type HubEvent = 
    | KpiEvent 
    | TokenUpdateEvent 
    | OpportunityUpdateEvent 
    | LogUpdateEvent 
    | AnalyticsEvent 
    | PerfHistoryEvent
    | DecisionProposedEvent
    | DecisionVoteEvent
    | DecisionFinalizedEvent;