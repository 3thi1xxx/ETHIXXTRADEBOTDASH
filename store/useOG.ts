// FIX: Create the Zustand store for the Unified Dashboard.
import { create } from 'zustand';
import {
  HubStatus,
  KpiState,
  TokenState,
  LogEvent,
  OpportunityEvent,
  CouncilDecision,
  AnalyticsState,
  CouncilDecisionStatus,
} from '../types';
import { MAX_LOGS, TOKEN_SCORE_HISTORY_LENGTH } from '../constants';

interface PerformanceHistory {
    line: { time: string; value: number }[];
    bar: { time: string; value: number }[];
}

interface OGState {
  status: HubStatus;
  kpi: KpiState | null;
  tokens: Map<string, TokenState>;
  logs: LogEvent[];
  opportunities: OpportunityEvent[];
  decisions: CouncilDecision[];
  analytics: AnalyticsState;
  performanceHistory: PerformanceHistory;
  autoscroll: boolean;
  actions: {
    ingest: (event: any) => void;
    setStatus: (status: HubStatus) => void;
    clearData: () => void;
    toggleAutoscroll: () => void;
  };
}

// MOCK DATA GENERATION
const generateMockKpi = (): KpiState => ({
    portfolio: 100000,
    pnl: 1250.55,
    edgeMs: Math.floor(Math.random() * 10) + 5,
    cu: { used: 780000, total: 1000000 },
    strategies: { enabled: 8, total: 12 },
    uptimeSec: 172800 + Math.floor(Date.now() / 1000) % 3600,
});

const generateMockToken = (): TokenState => {
    const score = Math.floor(Math.random() * 100);
    return {
        score,
        liq: Math.floor(Math.random() * 500000) + 10000,
        history: Array.from({ length: TOKEN_SCORE_HISTORY_LENGTH }, (_, i) => ({
            ts: Date.now() - (TOKEN_SCORE_HISTORY_LENGTH - i) * 1000,
            score: Math.max(0, Math.min(100, score - 10 + Math.floor(Math.random() * 20))),
        })),
        tags: Math.random() > 0.9 ? ['NEW'] : [],
        updatedAt: Date.now(),
    };
};

const mockTokens = new Map<string, TokenState>([
    ['SOL/USDC', generateMockToken()],
    ['BTC/USDT', generateMockToken()],
    ['ETH/USDT', generateMockToken()],
    ['JUP/USDC', generateMockToken()],
    ['WIF/USDC', generateMockToken()],
]);

const mockDecisions: CouncilDecision[] = [
    {
        id: 'decision-1',
        title: 'Increase SOL/USDC Long Exposure',
        description: 'High momentum detected. Proposing to increase position size by 20%.',
        status: CouncilDecisionStatus.VOTING,
        votes: [
            { agent: 'VOLATILITY', vote: 'YES', confidence: 0.92 },
            { agent: 'SENTIMENT', vote: 'YES', confidence: 0.85 },
            { agent: 'RISK', vote: 'NO', confidence: 0.60 },
        ],
        expiresAt: Date.now() + 120 * 1000,
    },
    {
        id: 'decision-2',
        title: 'Hedge ETH with Short Position',
        description: 'Negative funding rate and bearish divergence suggest downside risk.',
        status: CouncilDecisionStatus.PASSED,
        votes: [
            { agent: 'TECHNICAL', vote: 'YES', confidence: 0.95 },
            { agent: 'RISK', vote: 'YES', confidence: 0.88 },
        ],
        expiresAt: Date.now() - 60000,
    }
];

const useOGStore = create<OGState>((set, get) => ({
  status: HubStatus.CONNECTING,
  kpi: generateMockKpi(),
  tokens: mockTokens,
  logs: [
      { ts: Date.now() - 2000, level: 'INFO', msg: 'OG Engine Initialized. Connecting to event stream.'},
      { ts: Date.now() - 1000, level: 'INFO', msg: 'Connection established. Awaiting market data...'},
  ],
  opportunities: [],
  decisions: mockDecisions,
  analytics: {
      volatility: 68,
      liquidity: 85,
      stability: 45,
  },
  performanceHistory: {
      line: Array.from({length: 50}, (_, i) => ({ time: `${i}`, value: 50 + Math.sin(i / 5) * 20 + Math.random() * 10})),
      bar: Array.from({length: 50}, (_, i) => ({ time: `${i}`, value: (Math.random() - 0.5) * 20 })),
  },
  autoscroll: true,
  actions: {
    ingest: (event) => {
      // This is where real data would update the store
      // For now, we can simulate updates
      if (Math.random() > 0.8) {
        // FIX: Explicitly type the new log object to ensure it conforms to the LogEvent interface,
        // preventing TypeScript from widening the 'level' property to a generic 'string'.
        const newLog: LogEvent = { ts: Date.now(), level: 'INFO', msg: 'Simulated new token analysis complete.' };
        set(state => ({
          logs: [...state.logs, newLog].slice(-MAX_LOGS)
        }));
      }
    },
    setStatus: (status) => set({ status }),
    clearData: () => set({
        tokens: new Map(),
        logs: [],
        opportunities: [],
        decisions: [],
        kpi: null,
    }),
    toggleAutoscroll: () => set(state => ({ autoscroll: !state.autoscroll })),
  },
}));

// Selectors
export const useHubStatus = () => useOGStore((state) => state.status);
export const useKpi = () => useOGStore((state) => state.kpi);
export const useOGStoreActions = () => useOGStore((state) => state.actions);
export const useAnalytics = () => useOGStore((state) => state.analytics);
export const usePerformanceHistory = () => useOGStore((state) => state.performanceHistory);
export const useCouncilDecisions = () => useOGStore((state) => state.decisions);

export { useOGStore };