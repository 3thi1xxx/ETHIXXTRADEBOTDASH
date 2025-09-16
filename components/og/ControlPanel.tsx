import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { Slider } from './ui/Slider';
import { Progress } from './ui/Progress';
import { execTask } from '../../lib/orchestrator';
import { useToast } from '../../hooks/use-toast';

const WhaleDiscovery: React.FC = () => {
    const { toast } = useToast();
    const [minSize, setMinSize] = useState(500);
    const [minWinRate, setMinWinRate] = useState(70);
    const [autoAdd, setAutoAdd] = useState(true);
    const [isDiscovering, setIsDiscovering] = useState(false);

    const handleDiscover = async () => {
        setIsDiscovering(true);
        const result = await execTask({
            kind: "bash",
            cmd: "discover_whales",
            stdin: JSON.stringify({ minSize, minWinRate, autoAdd })
        });
        if (result.success) {
            toast({ type: 'success', title: 'Discovery Started' });
        } else {
            toast({ type: 'error', title: 'Discovery Failed', description: result.error });
        }
        setIsDiscovering(false);
    };

    return (
        <Card>
            <CardHeader><CardTitle>Whale Discovery</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleDiscover} disabled={isDiscovering} className="w-full text-white bg-primary hover:bg-primary/90">
                    {isDiscovering ? "Discovering..." : "DISCOVER WHALES"}
                </Button>
                <div className="flex items-center space-x-2">
                    <Checkbox id="auto-add" checked={autoAdd} onChange={(e) => setAutoAdd(e.target.checked)} />
                    <label htmlFor="auto-add" className="text-sm font-medium">Auto-add whales with &gt; 70% win rate</label>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span>Min wallet size: {minSize} SOL</span>
                    <span>Min win rate: {minWinRate}%</span>
                </div>
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm">Smart Filter</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const TokenCleanup: React.FC = () => {
    const alerts = [
        { id: 1, type: 'ALERT', text: 'SOL potential prake detected.', active: true },
        { id: 2, type: 'INFO', text: 'New whale added wabiickick.', active: false },
        { id: 3, type: 'WARNING', text: '58 min on Alpha 0 min.', active: false },
        { id: 4, type: 'WARNING', text: '1 Items inddev "AlphaBoset"', active: false },
    ];
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Token Cleanup</CardTitle>
                <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">5</div>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                             <span className={`mr-2 font-bold ${alert.type === 'ALERT' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {alert.type === 'INFO' ? '' : '🔔'}
                            </span>
                            <span className={alert.type === 'WARNING' ? 'text-yellow-400' : ''}>{alert.text}</span>
                        </div>
                        {alert.type === 'ALERT' && (
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" defaultChecked={alert.active} />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};


const AIStrategyAssistant: React.FC = () => {
    return (
        <Card>
            <CardHeader><CardTitle>AI Strategy Assistant</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                    <p>Live sentiment analysis suggests an opportunity in the meme coin sector based on recent social media trends.</p>
                </div>
                <Button variant="ghost" className="w-full justify-start">
                    <span className="text-lg mr-2">+</span> Generate Strategy...
                </Button>
                 <div>
                    <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                        <span>Monthly Budget</span>
                        <span>38.0% used</span>
                    </div>
                    <Progress value={38} />
                </div>
                 <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-accent-yellow/80 hover:bg-accent-yellow text-background font-bold">Generate Strategy</Button>
                    <Button variant="ghost" className="flex-1">Load Template</Button>
                </div>
            </CardContent>
        </Card>
    );
}

const ControlPanel: React.FC = () => {
  return (
    <>
      <WhaleDiscovery />
      <TokenCleanup />
      <AIStrategyAssistant />
    </>
  );
};

export default ControlPanel;