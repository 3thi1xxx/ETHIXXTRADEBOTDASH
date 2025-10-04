import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/Dialog';
import { CouncilDecision, CouncilVote } from '../../types';
import { getAgentReasoning } from '../../lib/gemini';

interface ReasoningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision: CouncilDecision | null;
  vote: CouncilVote | null;
}

const ReasoningDialog: React.FC<ReasoningDialogProps> = ({ open, onOpenChange, decision, vote }) => {
  const [reasoning, setReasoning] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && decision && vote) {
      const fetchReasoning = async () => {
        setIsLoading(true);
        setReasoning('');
        const result = await getAgentReasoning(decision, vote);
        setReasoning(result);
        setIsLoading(false);
      };
      fetchReasoning();
    }
  }, [open, decision, vote]);

  if (!decision || !vote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Reasoning from {vote.agent}</DialogTitle>
        <DialogDescription>
          On proposal: "{decision.title}"
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <div className="min-h-[100px] flex items-center justify-center">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-primary"></div>
          ) : (
            <p className="text-sm text-foreground">{reasoning}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReasoningDialog;
