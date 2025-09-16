import { EVENTS_ENDPOINT } from '../constants';
import { HubStatus, HubEvent, CouncilDecisionStatus, CouncilVote, CouncilDecision } from '../types';

type Subscriber = (event: HubEvent) => void;
type StatusUpdater = (status: HubStatus) => void;

// --- Mock Data Generator ---
const mockGenerator = {
    lastKpi: { portfolio: 9500, pnl: 210, edgeMs: 19, cu: { used: 6_000_000, total: 20_000_000 }, strategies: { enabled: 4, total: 5 }, uptimeSec: 0 },
    lastPerf: { line: Array.from({length: 50}, (_, i) => ({time: Date.now() - (50-i)*1000, value: 50 + Math.sin(i/5)*20})), bar: Array.from({length: 50}, (_, i) => ({time: Date.now() - (50-i)*1000, value: (Math.random()-0.5)*20}))},
    mockDecisionCounter: 0,
    
    createEvent(): HubEvent {
        const rand = Math.random();
        if (rand < 0.2) { // KPI
            this.lastKpi.pnl += (Math.random() - 0.5) * 10;
            this.lastKpi.edgeMs = 18 + Math.floor(Math.random() * 5);
            this.lastKpi.uptimeSec += 2;
            return { type: 'KPI', data: { ...this.lastKpi } };
        } else if (rand < 0.4) { // Analytics
            return { type: 'ANALYTICS', data: { volatility: 75 + Math.random()*5, liquidity: 90 + Math.random()*5, stability: 30 + Math.random()*5 } };
        } else if (rand < 0.6) { // Perf History
             const newLine = [...this.lastPerf.line.slice(1), { time: Date.now(), value: 50 + Math.sin(Date.now()/5000)*20 }];
             const newBar = [...this.lastPerf.bar.slice(1), { time: Date.now(), value: (Math.random()-0.5)*20 }];
             this.lastPerf = { line: newLine, bar: newBar };
             return { type: 'PERF_HISTORY', data: this.lastPerf };
        } else if (rand < 0.8) { // Log
             const levels = ['INFO', 'WARN', 'ERROR'] as const;
             return { type: 'LOG', data: { ts: Date.now(), level: levels[Math.floor(Math.random()*3)], msg: `Mock event of type ${Math.random().toString(36).substring(7)}` } };
        } else { // New Council Decision
             this.mockDecisionCounter++;
             const id = `d_mock_${this.mockDecisionCounter}`;
             const decision: CouncilDecision = {
                id,
                title: `Proposal #${this.mockDecisionCounter}: Long SOL`,
                description: 'High momentum spike detected.',
                status: CouncilDecisionStatus.VOTING,
                votes: [],
                expiresAt: Date.now() + 15000,
                evidence: ['proof://backtest/sol-long-2024q4']
             };
             // Simulate votes and finalization
             setTimeout(() => this.publishVote(id, { agent: 'Alpha', vote: 'YES', confidence: 0.9, reason: 'Strong signal'}), 3000);
             setTimeout(() => this.publishVote(id, { agent: 'Risk', vote: 'YES', confidence: 0.7, reason: 'Within risk limits'}), 6000);
             setTimeout(() => this.publishFinalization(id, 'PASSED'), 15000);
             return { type: 'decision.proposed', data: decision };
        }
    },
    // These methods will be bound to the hub instance to publish events
    publishVote(decisionId: string, vote: CouncilVote) {},
    publishFinalization(decisionId: string, result: 'PASSED' | 'REJECTED') {}
};


class Hub {
    private eventSource: EventSource | null = null;
    private subscribers: Set<Subscriber> = new Set();
    private statusUpdater: StatusUpdater = () => {};
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 3;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private mockInterval: NodeJS.Timeout | null = null;

    constructor() {
        mockGenerator.publishVote = (decisionId, vote) => {
            this.broadcast({ type: 'decision.vote', data: { decisionId, vote } });
        };
        mockGenerator.publishFinalization = (decisionId, result) => {
             this.broadcast({ type: 'decision.finalized', data: { decisionId, result } });
        };
    }

    start(statusUpdater: StatusUpdater) {
        this.statusUpdater = statusUpdater;
        this.stopMocking();
        this.connect();
    }
    
    private broadcast(event: HubEvent) {
        this.subscribers.forEach(sub => sub(event));
    }

    private connect() {
        if (this.eventSource) {
            this.eventSource.close();
        }

        this.statusUpdater(HubStatus.CONNECTING);
        this.eventSource = new EventSource(EVENTS_ENDPOINT);

        this.eventSource.onopen = () => {
            console.log("Hub connection opened.");
            this.statusUpdater(HubStatus.CONNECTED);
            this.reconnectAttempts = 0;
            if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        };

        this.eventSource.onmessage = (event) => {
            try {
                const parsedData: HubEvent = JSON.parse(event.data);
                this.broadcast(parsedData);
            } catch (error) {
                console.error("Failed to parse hub event:", error);
            }
        };

        this.eventSource.onerror = () => {
            this.eventSource?.close();
            this.handleReconnect();
        };
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = 1000 * this.reconnectAttempts;
            console.warn(`Hub connection failed. Retrying in ${delay}ms... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.statusUpdater(HubStatus.CONNECTING);
            this.reconnectTimeout = setTimeout(() => this.connect(), delay);
        } else {
            console.warn(`Max reconnect attempts reached. Falling back to mock data provider. The app will be functional but will not use live data.`);
            this.startMocking();
        }
    }
    
    private startMocking() {
        this.statusUpdater(HubStatus.DEGRADED);
        if (this.mockInterval) clearInterval(this.mockInterval);
        this.mockInterval = setInterval(() => {
            const event = mockGenerator.createEvent();
            this.broadcast(event);
        }, 2000);
    }
    
    private stopMocking() {
        if(this.mockInterval) clearInterval(this.mockInterval);
        this.mockInterval = null;
    }

    stop() {
        this.stopMocking();
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        this.eventSource?.close();
        this.eventSource = null;
        this.statusUpdater(HubStatus.DISCONNECTED);
        console.log("Hub connection closed.");
    }

    subscribe(callback: Subscriber) {
        this.subscribers.add(callback);
    }

    unsubscribe(callback: Subscriber) {
        this.subscribers.delete(callback);
    }
}

export const hub = new Hub();