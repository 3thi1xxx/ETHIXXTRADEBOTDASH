import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Strategies } from './components/Strategies';
import UnifiedDashboard from './app/unified-dashboard/page';
import { ViewType } from './types';
import { useProcessStats } from './hooks/useProcessStats';
import { Toaster } from './components/og/ui/Toast';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.UNIFIED_DASHBOARD);
  const { data, loading, error } = useProcessStats();

  const renderView = useCallback(() => {
    switch (activeView) {
      case ViewType.UNIFIED_DASHBOARD:
        return <UnifiedDashboard />;
      case ViewType.DASHBOARD:
        return <Dashboard data={data} loading={loading} error={error} />;
      case ViewType.STRATEGIES:
        return <Strategies />;
      case ViewType.LOGS:
        return <div className="p-8 text-center text-muted-foreground">Legacy log view. Please use the Unified Dashboard.</div>;
      default:
        return <UnifiedDashboard />;
    }
  }, [activeView, data, loading, error]);

  return (
    <>
      <div className="flex h-screen bg-background text-foreground font-sans">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderView()}
        </main>
      </div>
      <Toaster />
    </>
  );
};

export default App;
