import React from 'react';
import { cn } from '../../../lib/utils';

const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        className={cn(
          'w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer',
          'accent-primary', // Simple styling for the thumb
          className
        )}
        {...props}
      />
    );
  }
);

export { Slider };
