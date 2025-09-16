import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import CircularProgress from './ui/CircularProgress';
import { useAnalytics } from '../../store/useOG';


const Analytics: React.FC = () => {
    const analytics = useAnalytics();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiip Ttaag Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-around text-center">
            <div>
                <CircularProgress value={analytics.volatility} colorClass="stroke-accent-yellow" />
                <p className="text-sm mt-2">Volatility</p>
            </div>
             <div>
                <CircularProgress value={analytics.liquidity} colorClass="stroke-primary" />
                <p className="text-sm mt-2">Liquidity Pool</p>
            </div>
             <div>
                <CircularProgress value={analytics.stability} colorClass="stroke-success" />
                <p className="text-sm mt-2">Price Stability</p>
            </div>
        </div>
        <div className="bg-secondary p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm">High Momentum Spike</h4>
            <p className="text-xs text-muted-foreground">SOL/USDC threaxing umusual volume</p>
            <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">Simulate</Button>
                <Button size="sm" className="flex-1 text-xs bg-primary hover:bg-primary/90">Execute</Button>
            </div>
        </div>
        <div className="flex justify-around">
            <Button variant="ghost" size="sm">Top Gainers</Button>
            <Button variant="ghost" size="sm">New Pairs</Button>
            <Button variant="ghost" size="sm">Backtest</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;