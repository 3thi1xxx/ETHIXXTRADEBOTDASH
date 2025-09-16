import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { usePerformanceHistory } from '../../store/useOG';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

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

const RoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const radius = 6;
    return (
      <path d={`M${x},${y + radius} A${radius},${radius},0,0,1,${x + radius},${y} L${x + width - radius},${y} A${radius},${radius},0,0,1,${x + width},${y + radius} L${x + width},${y + height} L${x},${y + height} Z`} fill={fill} />
    );
};

const PerformanceCharts: React.FC = () => {
    const history = usePerformanceHistory();

    return(
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Performance Charts</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow grid grid-rows-2 gap-6">
                <div className="row-span-1">
                    <h3 className="text-sm font-semibold mb-2 px-1">Historical Performance</h3>
                    <ResponsiveContainer width="100%" height="90%">
                         <AreaChart data={history.line} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                 <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" tick={false} axisLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#a0a0a0', fontSize: 12 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            <Area type="monotone" dataKey={(d) => d.value * 0.8} stroke="#22c55e" strokeWidth={1} fillOpacity={1} fill="url(#colorBenchmark)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                 <div className="row-span-1">
                     <h3 className="text-sm font-semibold mb-2 px-1">Profit/Loss Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={history.bar} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="time" tick={false} axisLine={false} />
                            <YAxis tick={{ fill: '#a0a0a0', fontSize: 12 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} />
                            <ReferenceLine y={0} stroke="#4a5568" />
                            <Bar dataKey="value" shape={<RoundedBar/>}>
                                {history.bar.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#22c55e' : '#ff5555'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default PerformanceCharts;