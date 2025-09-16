import React from 'react';

interface CircularProgressProps {
  value: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
  trailColorClass?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  strokeWidth = 8,
  className = 'w-24 h-24',
  colorClass = 'stroke-primary',
  trailColorClass = 'stroke-secondary',
}) => {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative ${className} inline-flex items-center justify-center`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className={trailColorClass}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="absolute text-xl font-bold">{Math.round(value)}%</span>
    </div>
  );
};

export default CircularProgress;