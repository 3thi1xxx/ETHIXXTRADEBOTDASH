import { ViewType, Strategy } from './types';

export const API_BASE_URL = 'http://localhost:7071';
export const PROCESS_STATS_ENDPOINT = `${API_BASE_URL}/process-stats`;
export const EXEC_ENDPOINT = `${API_BASE_URL}/exec`;
export const EVENTS_ENDPOINT = `${API_BASE_URL}/events`;

export const POLLING_INTERVAL_MS = 2000;

export const NAVIGATION_ITEMS = [
  { id: ViewType.UNIFIED_DASHBOARD, label: 'Unified Dashboard', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: ViewType.DASHBOARD, label: 'Dashboard (Legacy)', icon: 'M9 17v-2a4 4 0 00-4-4H3V9h2a4 4 0 004-4V3l7 7-7 7z' },
  { id: ViewType.STRATEGIES, label: 'Strategies', icon: 'M17.218 10.395L12.001 2l-5.217 8.395-8.782 1.277L6.39 17.929l-1.486 8.746L12.001 22l7.1-4.325-1.486-8.746 6.39-6.257-8.782-1.277z' },
  { id: ViewType.LOGS, label: 'Logs (Legacy)', icon: 'M4 6h16M4 12h16M4 18h7' },
];

// FIX: Explicitly type MOCK_STRATEGIES with Strategy[] to ensure type correctness.
export const MOCK_STRATEGIES: Strategy[] = [
    { id: 'rsi_divergence_eth', name: 'RSI Divergence ETH/USD', description: 'Long/short ETH based on 4h RSI divergence.', status: 'STOPPED' },
    { id: 'mean_reversion_btc', name: 'Mean Reversion BTC/USD', description: 'Trades BTC on 15m timeframe, expecting reversion to the mean.', status: 'RUNNING' },
    { id: 'grid_bot_sol', name: 'Grid Bot SOL/USDT', description: 'Places buy/sell orders in a grid around a static price.', status: 'ERROR' },
];

// OG Dashboard constants
export const MAX_TOKENS = 500;
export const MAX_LOGS = 500;
export const MAX_OPPORTUNITIES = 200;
export const TOKEN_SCORE_HISTORY_LENGTH = 50;
