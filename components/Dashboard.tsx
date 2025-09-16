
import React from 'react';
import { ProcessStats } from '../types';
import { StatCard } from './StatCard';
import { PnlChart } from './PnlChart';
import { PositionsTable } from './PositionsTable';

interface DashboardProps {
  data: ProcessStats | null;
  loading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ data, loading, error }) => {
  if (loading && !data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        {error && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Warning: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Balance" value={`$${data?.balance.toFixed(2)}`} />
        <StatCard title="Equity" value={`$${data?.equity.toFixed(2)}`} />
        <StatCard title="Daily PnL" value={`$${data?.dailyPnl.toFixed(2)}`} change={`${data?.dailyPnlPercent.toFixed(2)}%`} isPositive={data?.dailyPnl ? data.dailyPnl >= 0 : true} />
        <StatCard title="Active Processes" value={`${data?.activeProcesses} / ${data?.maxConcurrency}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">PnL History</h3>
            <PnlChart data={data?.pnlHistory || []} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">System Status</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-400">Uptime</p>
                    <p className="text-2xl font-mono">{data?.uptime}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Health</p>
                    <div className="flex items-center">
                        <span className="h-4 w-4 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <p className="text-2xl font-semibold text-green-400">Healthy</p>
                    </div>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">Max Concurrency</p>
                    <p className="text-2xl font-mono">{data?.maxConcurrency}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
        <PositionsTable positions={data?.openPositions || []} />
      </div>
    </div>
  );
};
