// FIX: Create type definitions for the application.
export enum ViewType {
  UNIFIED_DASHBOARD = 'UNIFIED_DASHBOARD',
  DASHBOARD = 'DASHBOARD',
  STRATEGIES = 'STRATEGIES',
  LOGS = 'LOGS',
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

export interface LogEntry {
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
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

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR' | 'STARTING' | 'STOPPING';
}

// OG Dashboard Types

export enum HubStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DEGRADED = 'DEGRADED',
  DISCONNECTED = 'DISCONNECTED',
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
  history: TokenHistoryPoint[];
  tags: string[];
  updatedAt: number;
}

export interface LogEvent {
  ts: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  msg: string;
}

export interface OpportunityEvent {
  id: string;
  title: string;
  desc: string;
  score: number;
}

export enum CouncilDecisionStatus {
    VOTING = 'VOTING',
    PASSED = 'PASSED',
    REJECTED = 'REJECTED',
    EXECUTING = 'EXECUTING',
    COMPLETE = 'COMPLETE'
}

export interface CouncilVote {
    agent: string;
    vote: 'YES' | 'NO';
    confidence: number;
}

export interface CouncilDecision {
    id: string;
    title: string;
    description: string;
    status: CouncilDecisionStatus;
    votes: CouncilVote[];
    expiresAt: number;
}

export interface AnalyticsState {
    volatility: number;
    liquidity: number;
    stability: number;
}
