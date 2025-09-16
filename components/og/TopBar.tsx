import React, { useState } from 'react';
import { HubStatus } from '../../types';
import { useHubStatus } from '../../store/useOG';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { execTask } from '../../lib/orchestrator';
import { useToast } from '../../hooks/use-toast';

const StatusPill: React.FC = () => {
    const status = useHubStatus();
    
    const statusConfig = {
        [HubStatus.CONNECTED]: { text: "CONNECTED", className: "bg-success text-white" },
        [HubStatus.DEGRADED]: { text: "DEGRADED", className: "bg-warning text-black" },
        [HubStatus.DISCONNECTED]: { text: "DISCONNECTED", className: "bg-destructive text-destructive-foreground" },
        [HubStatus.CONNECTING]: { text: "CONNECTING...", className: "bg-sky-500 text-white animate-pulse" },
    };

    const { text, className } = statusConfig[status];

    return <Badge className={className}>{text}</Badge>;
};

const TopBar: React.FC = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState< 'start' | 'stop' | null>(null);

    const handleAction = async (action: 'start' | 'stop') => {
        setIsLoading(action);
        const result = await execTask({ kind: 'bash', cmd: `${action}_og_runner` });
        if (result.success) {
            toast({ type: 'success', title: `Command Sent`, description: `Successfully dispatched '${action}' command.` });
        } else {
            toast({ type: 'error', title: `Command Failed`, description: result.error });
        }
        setIsLoading(null);
    }

  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-card">
      <h1 className="text-lg font-bold text-foreground">
        EthixxTradeBot — <span className="text-primary">Unified Intelligence</span>
      </h1>
      <div className="flex items-center gap-4">
        <StatusPill />
        <Button 
            onClick={() => handleAction('start')} 
            disabled={!!isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            {isLoading === 'start' ? 'Starting...' : 'START'}
        </Button>
        <Button 
            onClick={() => handleAction('stop')} 
            disabled={!!isLoading}
            variant="destructive"
        >
            {isLoading === 'stop' ? 'Stopping...' : 'STOP'}
        </Button>
      </div>
    </header>
  );
};

export default TopBar;