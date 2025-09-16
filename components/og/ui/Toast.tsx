import React from 'react';
import { useToast } from '../../../hooks/use-toast';
import { cn } from '../../../lib/utils';

const Toaster: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[100] p-4">
      <div className="flex flex-col-reverse gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
                'w-full max-w-sm p-4 rounded-lg shadow-lg border text-sm',
                'bg-card border-border text-card-foreground',
                toast.type === 'success' && 'bg-green-500/10 border-green-500/20 text-green-300',
                toast.type === 'error' && 'bg-red-500/10 border-red-500/20 text-red-300'
            )}
          >
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-muted-foreground">{toast.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Toaster };
