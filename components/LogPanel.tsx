
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const getLogLevelColor = (level: LogEntry['level']) => {
  switch (level) {
    case 'INFO':
      return 'text-blue-400';
    case 'WARN':
      return 'text-yellow-400';
    case 'ERROR':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-48 bg-gray-900 border-t border-gray-700 p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-gray-300 mb-2 flex-shrink-0">Process Logs</h3>
      <div ref={scrollRef} className="flex-grow overflow-y-auto font-mono text-xs text-gray-400 space-y-1 pr-2">
        {logs.map((log) => (
          <div key={log.timestamp} className="flex">
            <span className="text-gray-500 mr-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`font-bold mr-2 ${getLogLevelColor(log.level)}`}>{log.level.padEnd(5)}</span>
            <span>{log.message}</span>
          </div>
        ))}
         {logs.length === 0 && <p>No logs to display. Waiting for events...</p>}
      </div>
    </div>
  );
};
