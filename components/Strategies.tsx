
import React, { useState } from 'react';
import { Strategy } from '../types';
import { MOCK_STRATEGIES, EXEC_ENDPOINT } from '../constants';

const StatusPill: React.FC<{ status: Strategy['status'] }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-bold rounded-full inline-block";
    switch (status) {
        case 'RUNNING':
            return <span className={`${baseClasses} bg-green-500/20 text-green-300`}>Running</span>;
        case 'STOPPED':
            return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>Stopped</span>;
        case 'ERROR':
            return <span className={`${baseClasses} bg-red-500/20 text-red-300`}>Error</span>;
        case 'STARTING':
        case 'STOPPING':
            return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300 animate-pulse`}>{status}...</span>;
        default:
            return null;
    }
}

const StrategyCard: React.FC<{ strategy: Strategy, onAction: (id: string, action: 'start' | 'stop') => void }> = ({ strategy, onAction }) => {
    const isRunning = strategy.status === 'RUNNING' || strategy.status === 'STOPPING';
    const isStopped = strategy.status === 'STOPPED' || strategy.status === 'ERROR' || strategy.status === 'STARTING';
    const isTransitioning = strategy.status === 'STARTING' || strategy.status === 'STOPPING';

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white mb-2">{strategy.name}</h3>
                    <StatusPill status={strategy.status} />
                </div>
                <p className="text-gray-400 text-sm mb-4">{strategy.description}</p>
            </div>
            <div className="flex space-x-2 mt-4">
                <button
                    onClick={() => onAction(strategy.id, 'start')}
                    disabled={!isStopped || isTransitioning}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Start
                </button>
                <button
                    onClick={() => onAction(strategy.id, 'stop')}
                    disabled={!isRunning || isTransitioning}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    Stop
                </button>
            </div>
        </div>
    );
};

export const Strategies: React.FC = () => {
    const [strategies, setStrategies] = useState<Strategy[]>(MOCK_STRATEGIES);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleAction = async (id: string, action: 'start' | 'stop') => {
        const originalStatus = strategies.find(s => s.id === id)?.status;
        if (!originalStatus) return;

        setFeedback(null);
        setStrategies(prev => prev.map(s => s.id === id ? { ...s, status: action === 'start' ? 'STARTING' : 'STOPPING' } : s));
        
        try {
            const response = await fetch(EXEC_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kind: 'bash', cmd: `${action}_strategy.sh ${id}` })
            });

            if (!response.ok) {
                throw new Error(`Orchestrator returned status ${response.status}`);
            }
            
            const result = await response.json();
            setStrategies(prev => prev.map(s => s.id === id ? { ...s, status: action === 'start' ? 'RUNNING' : 'STOPPED' } : s));
            setFeedback({ type: 'success', message: `Strategy '${id}' ${action} command sent successfully.` });

        } catch (error) {
            console.error(`Failed to ${action} strategy ${id}:`, error);
            setStrategies(prev => prev.map(s => s.id === id ? { ...s, status: originalStatus === 'RUNNING' || originalStatus === 'STOPPING' ? 'RUNNING' : 'STOPPED' } : s)); // Revert on failure
             setFeedback({ type: 'error', message: `Failed to ${action} strategy '${id}'. Orchestrator may be offline.` });
        } finally {
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Strategies</h2>
            {feedback && (
                <div className={`p-4 rounded-md ${feedback.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {feedback.message}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map(strategy => (
                    <StrategyCard key={strategy.id} strategy={strategy} onAction={handleAction} />
                ))}
            </div>
        </div>
    );
};
