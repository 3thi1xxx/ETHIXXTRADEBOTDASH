import React from 'react';
import { cn } from '../../../lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg transition-transform transform translate-x-0">
        <div className="relative h-full flex flex-col">
            {children}
        </div>
      </div>
    </div>
  );
};

const SheetContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("flex-grow p-6 overflow-y-auto", className)}>
        {children}
    </div>
)

const SheetHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("p-6 border-b border-border", className)}>
        {children}
    </div>
);

const SheetTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h2>
);


const SheetDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription };
