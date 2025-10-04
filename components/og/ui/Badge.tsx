import React from 'react';
import { cn } from '../../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'bullish' | 'neutral' | 'bearish';
}

// FIX: Changed to a const typed with React.FC to ensure proper prop type inference, including 'className'.
const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    success: 'border-transparent bg-success text-white',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    warning: 'border-transparent bg-warning text-black',
    bullish: 'border-transparent bg-green-500/20 text-green-300',
    neutral: 'border-transparent bg-sky-500/20 text-sky-300',
    bearish: 'border-transparent bg-red-500/20 text-red-300',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };