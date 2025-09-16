// FIX: Create the Dialog component.
import React from 'react';
import { cn } from '../../../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("p-6", className)}>
        {children}
    </div>
);

const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("p-6 border-b border-border", className)}>
        {children}
    </div>
);

const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h2>
);

const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);

const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("p-6 border-t border-border flex justify-end gap-2", className)}>
        {children}
    </div>
);


export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
