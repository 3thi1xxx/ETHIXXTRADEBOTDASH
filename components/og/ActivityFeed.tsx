import React, { useState, useEffect } from 'react';
import { useOGStore } from '../../store/useOG';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { LogEvent } from '../../types';
import { useAutoscroll } from '../../hooks/useAutoscroll';
import { cn } from '../../lib/utils';

const LogLine: React.FC<{ log: LogEvent, isNew: boolean }> = ({ log, isNew }) => {
    const colorMap = {
        INFO: 'text-sky-400',
        WARN: 'text-yellow-400',
        ERROR: 'text-red-400'
    };

    return (
        <div className={cn("flex", isNew ? 'animate-fade-in-up' : '')}>
            <span className="text-muted-foreground/50 mr-2">{new Date(log.ts).toLocaleTimeString()}</span>
            <span className={cn('font-bold mr-2', colorMap[log.level])}>{log.level.padEnd(5)}</span>
            <span className="flex-1">{log.msg}</span>
        </div>
    );
}

const ActivityFeed: React.FC = () => {
    const logs = useOGStore(state => state.logs);
    const autoscrollEnabled = useOGStore(state => state.autoscroll);
    const scrollRef = useAutoscroll<HTMLDivElement>(logs, autoscrollEnabled);
    const [newLogTimestamps, setNewLogTimestamps] = useState<Set<number>>(new Set());

    useEffect(() => {
        const newLogs = logs.filter(log => !newLogTimestamps.has(log.ts));
        if (newLogs.length > 0) {
            const newTimestamps = new Set(newLogTimestamps);
            newLogs.forEach(log => newTimestamps.add(log.ts));
            setNewLogTimestamps(newTimestamps);

            // Remove the 'new' status after the animation duration
            setTimeout(() => {
                setNewLogTimestamps(prev => {
                    const updated = new Set(prev);
                    newLogs.forEach(log => updated.delete(log.ts));
                    return updated;
                });
            }, 1000); // A bit longer than the animation
        }
    }, [logs]);

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <CardHeader>
        <CardTitle>Live Activity Feed</CardTitle>
      </CardHeader>
      <CardContent ref={scrollRef} className="flex-grow overflow-y-auto font-mono text-xs pr-2">
        {logs.length > 0 ? (
            <div className="space-y-1">
                {logs.map((log, i) => <LogLine key={`${log.ts}-${i}`} log={log} isNew={newLogTimestamps.has(log.ts)} />)}
            </div>
        ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Awaiting activity...
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;