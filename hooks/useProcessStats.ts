
import { useState, useEffect } from 'react';
import { ProcessStats } from '../types';
import { PROCESS_STATS_ENDPOINT, POLLING_INTERVAL_MS } from '../constants';

const getMockData = (): ProcessStats => {
    const now = Date.now();
    return {
        balance: 10000 + Math.sin(now / 20000) * 500,
        equity: 10250 + Math.sin(now / 15000) * 600,
        dailyPnl: 250.75 + Math.cos(now / 10000) * 50,
        dailyPnlPercent: 2.51 + Math.cos(now / 10000) * 0.5,
        openPositions: [
            { id: '1', symbol: 'BTC/USD', side: 'LONG', size: 0.1, entryPrice: 68000, pnl: 150.25, pnlPercent: 2.21 },
            { id: '2', symbol: 'ETH/USD', side: 'SHORT', size: 2, entryPrice: 3500, pnl: -75.50, pnlPercent: -1.08 },
        ],
        pnlHistory: Array.from({ length: 30 }, (_, i) => ({
            time: new Date(now - (30 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pnl: 200 + Math.sin(i / 3) * 50 + (Math.random() - 0.5) * 20,
        })),
        logs: [
            { timestamp: now - 3000, level: 'INFO', message: 'Strategy rsi_divergence_eth checked for signals. No new entry.' },
            { timestamp: now - 2000, level: 'WARN', message: 'API latency high: 520ms response time.' },
            { timestamp: now - 1000, level: 'INFO', message: 'Fetching process stats...' },
        ],
        uptime: '2d 4h 15m',
        activeProcesses: 2,
        maxConcurrency: 4,
    };
};


export const useProcessStats = () => {
  const [data, setData] = useState<ProcessStats | null>(getMockData());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(PROCESS_STATS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ProcessStats = await response.json();
        setData(result);
        setError(null);
      } catch (e) {
        if (e instanceof Error) {
            setError(`Failed to fetch data: orchestrator offline. Displaying mock data.`);
        } else {
            setError("An unknown error occurred.");
        }
        setData(getMockData()); // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return { data, loading, error };
};
