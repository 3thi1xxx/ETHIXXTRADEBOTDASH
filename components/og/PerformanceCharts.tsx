import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { usePerformanceHistory } from '../../store/useOG';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border p-2 rounded-md shadow-lg">
        <p className="label text-sm text-foreground">{`Value: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};


const PerformanceCharts: React.FC = () => {
    const history = usePerformanceHistory();

    return(
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Live Token Matrix</span>
                    <span className="text-sm font-normal text-muted-foreground">14 / 500 Slots</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow grid grid-rows-2 gap-4">
                <div className="row-span-1">
                    <h3 className="text-sm font-semibold mb-2">Historical Performance</h3>
                    <ResponsiveContainer width="100%" height="90%">
                         <LineChart data={history.line} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="time" tick={false} axisLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#a0a0a0', fontSize: 12 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey={(d) => d.value * 0.8} stroke="#22c55e" strokeWidth={1} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <div className="row-span-1">
                     <h3 className="text-sm font-semibold mb-2">Historical Performance (7%)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={history.bar} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="time" tick={false} axisLine={false} />
                            <YAxis tick={{ fill: '#a0a0a0', fontSize: 12 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} />
                            <ReferenceLine y={0} stroke="#4a5568" />
                            {history.bar.map((entry, index) => (
                                <Bar key={`bar-${index}`} dataKey="value" fill={entry.value >= 0 ? '#22c55e' : '#ff5555'} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default PerformanceCharts;