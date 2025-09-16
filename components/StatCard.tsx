
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive }) => {
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeIcon = isPositive ? '▲' : '▼';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h4 className="text-sm text-gray-400 font-medium">{title}</h4>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-3xl font-semibold text-white">{value}</p>
        {change && (
          <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
            <span>{changeIcon}</span>
            <span className="ml-1">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};
