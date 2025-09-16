
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PnlEntry } from '../types';

interface PnlChartProps {
  data: PnlEntry[];
}

export const PnlChart: React.FC<PnlChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <LineChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="time" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip
                contentStyle={{
                    backgroundColor: '#1a202c',
                    borderColor: '#2d3748'
                }}
                labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ color: '#e2e8f0' }}/>
            <Line type="monotone" dataKey="pnl" stroke="#4c51bf" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};
