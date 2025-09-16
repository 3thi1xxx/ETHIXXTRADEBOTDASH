// FIX: Create the RiskCockpit component.
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Progress } from './ui/Progress';
import { Badge } from './ui/Badge';

const RiskMetric: React.FC<{ title: string; value: number; level: 'low' | 'medium' | 'high' }> = ({ title, value, level }) => {
    const levelConfig = {
        low: { color: 'bg-success', text: 'LOW' },
        medium: { color: 'bg-warning', text: 'MED' },
        high: { color: 'bg-destructive', text: 'HIGH' },
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{title}</span>
                <Badge variant={level === 'low' ? 'success' : level === 'medium' ? 'warning' : 'destructive'}>{levelConfig[level].text}</Badge>
            </div>
            <Progress value={value} />
        </div>
    );
};

const RiskCockpit: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Cockpit</CardTitle>
        <CardDescription>Live risk assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskMetric title="Market Exposure" value={65} level="medium" />
        <RiskMetric title="Concentration" value={80} level="high" />
        <RiskMetric title="Volatility Drift" value={30} level="low" />
      </CardContent>
    </Card>
  );
};

export default RiskCockpit;
