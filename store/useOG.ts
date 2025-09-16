import { create } from 'zustand';
import {
    HubStatus,
    KpiState,
    TokenState,
    OpportunityEvent,
    LogEvent,
    AnalyticsState,
    PerformanceHistoryState,
    CouncilDecision,
    HubEvent,
    CouncilDecisionStatus,
    CouncilVote,
} from '../types';
import { MAX_LOGS, MAX_OPPORTUNITIES, TOKEN_SCORE_HISTORY_LENGTH } from '../constants';

interface OGState {
    status: HubStatus;
    kpi: KpiState | null;
    tokens: Map<string, TokenState>;
    opportunities: OpportunityEvent[];
    logs: LogEvent[];
    autoscroll: boolean;
    analytics: AnalyticsState;
    performanceHistory: PerformanceHistoryState;
    decisions: Map<string, CouncilDecision>;
    
    // Actions
    setStatus: (status: HubStatus) => void;
    ingest: (event: HubEvent) => void;
    clearData: () => void;
    toggleAutoscroll: () => void;
}

const useOGStore = create<OGState>((set, get) => ({
    status: HubStatus.CONNECTING,
    kpi: null,
    tokens: new Map(),
    opportunities: [],
    logs: [],
    autoscroll: true,
    analytics: { volatility: 0, liquidity: 0, stability: 0 },
    performanceHistory: { line: [], bar: [] },
    decisions: new Map(),

    setStatus: (status) => set({ status }),

    ingest: (event) => {
        switch (event.type) {
            case 'KPI':
                set({ kpi: event.data });
                break;
            case 'TOKEN_UPDATE':
                {
                    const { tokens } = get();
                    const newTokens = new Map(tokens);
                    for (const [ticker, data] of Object.entries<any>(event.data)) {
                        const existing = newTokens.get(ticker) || { history: [], updatedAt: 0 };
                        const newHistory = [...existing.history, { ts: Date.now(), score: data.score }];
                        newTokens.set(ticker, {
                            ...data,
                            updatedAt: Date.now(),
                            history: newHistory.slice(-TOKEN_SCORE_HISTORY_LENGTH),
                        });
                    }
                    set({ tokens: newTokens });
                    break;
                }
            case 'OPPORTUNITY':
                set(state => ({
                    opportunities: [event.data, ...state.opportunities].slice(0, MAX_OPPORTUNITIES)
                }));
                break;
            case 'LOG':
                set(state => ({
                    logs: [...state.logs, event.data].slice(-MAX_LOGS)
                }));
                break;
            case 'ANALYTICS':
                 set({ analytics: event.data });
                 break;
            case 'PERF_HISTORY':
                set({ performanceHistory: event.data });
                break;
            case 'decision.proposed':
                {
                    const newDecisions = new Map(get().decisions);
                    newDecisions.set(event.data.id, event.data);
                    set({ decisions: newDecisions });
                    break;
                }
            case 'decision.vote':
                {
                    const { decisionId, vote } = event.data;
                    const newDecisions = new Map(get().decisions);
                    const decision = newDecisions.get(decisionId);
                    if (decision) {
                        const updatedDecision = { ...decision, votes: [...decision.votes, vote] };
                        newDecisions.set(decisionId, updatedDecision);
                        set({ decisions: newDecisions });
                    }
                    break;
                }
            case 'decision.finalized':
                 {
                    const { decisionId, result } = event.data;
                    const newDecisions = new Map(get().decisions);
                    const decision = newDecisions.get(decisionId);
                    if (decision) {
                        const newStatus = result === 'PASSED' ? CouncilDecisionStatus.PASSED : CouncilDecisionStatus.REJECTED;
                        const updatedDecision = { ...decision, status: newStatus };
                        newDecisions.set(decisionId, updatedDecision);
                        set({ decisions: newDecisions });
                    }
                    break;
                }
        }
    },
    
    clearData: () => set({
        kpi: null,
        tokens: new Map(),
        opportunities: [],
        logs: [],
        analytics: { volatility: 0, liquidity: 0, stability: 0 },
        performanceHistory: { line: [], bar: [] },
        decisions: new Map(),
    }),

    toggleAutoscroll: () => set(state => ({ autoscroll: !state.autoscroll })),
}));

// Selectors
export const useHubStatus = () => useOGStore((state) => state.status);
export const useKpi = () => useOGStore((state) => state.kpi);
export const useAnalytics = () => useOGStore((state) => state.analytics);
export const usePerformanceHistory = () => useOGStore((state) => state.performanceHistory);
export const useCouncilDecisions = () => useOGStore((state) => Array.from(state.decisions.values()).sort((a,b) => b.expiresAt - a.expiresAt));
export const useOGStoreActions = () => useOGStore((state) => ({
    ingest: state.ingest,
    setStatus: state.setStatus,
    clearData: state.clearData,
}));

export { useOGStore };