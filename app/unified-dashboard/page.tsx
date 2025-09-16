import React from 'react';
import { useHub } from '../../hooks/useHub';
import TopBar from '../../components/og/TopBar';
import KpiStrip from '../../components/og/KpiStrip';
import ControlPanel from '../../components/og/ControlPanel';
import ActivityFeed from '../../components/og/ActivityFeed';
import PerformanceCharts from '../../components/og/PerformanceCharts';
import CouncilDecisions from '../../components/og/CouncilDecisions';

const UnifiedDashboard: React.FC = () => {
  useHub(); // Initialize the data connection

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <TopBar />
      <div className="flex-grow p-4 lg:p-6 overflow-y-auto space-y-6">
        <KpiStrip />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100%-110px)]">
            {/* Left Column */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                <ControlPanel />
            </div>

            {/* Center Column */}
            <div className="lg:col-span-6 flex flex-col">
                <PerformanceCharts />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
                <CouncilDecisions />
                <ActivityFeed />
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;