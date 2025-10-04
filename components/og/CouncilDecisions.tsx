import React, { useState } from 'react';
import { useCouncilDecisions } from '../../store/useOG';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { CouncilDecision, CouncilDecisionStatus, CouncilVote } from '../../types';
import { Button } from './ui/Button';
import EvidenceDrawer from './EvidenceDrawer';
import ReasoningDialog from './ReasoningDialog';
import { useCountdown } from '../../hooks/useCountdown';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { cn } from '../../lib/utils';

const CountdownTimer: React.FC<{ expiresAt: number, status: CouncilDecisionStatus }> = ({ expiresAt, status }) => {
    const { minutes, seconds, isExpired } = useCountdown(expiresAt);
    if (isExpired || status !== CouncilDecisionStatus.VOTING) {
        return <span className="text-muted-foreground">{status === CouncilDecisionStatus.VOTING ? 'Finalizing...' : ''}</span>;
    }
    return <span className="font-mono">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>;
};

const VoteChip: React.FC<{vote: CouncilVote, onExplain: () => void}> = ({ vote, onExplain }) => (
    <div className="flex items-center gap-1.5 bg-accent/50 p-1 rounded-md text-xs">
        <span className={cn('font-bold', vote.vote === 'YES' ? 'text-success' : 'text-destructive')}>{vote.vote}</span>
        <span className="text-muted-foreground">{vote.agent}</span>
        <span className="font-mono text-foreground">{Math.round(vote.confidence*100)}%</span>
         <button onClick={onExplain} title="Get reasoning" className="ml-1 text-muted-foreground/60 hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
)


const DecisionItem: React.FC<{ 
    decision: CouncilDecision, 
    onShowEvidence: (decision: CouncilDecision) => void,
    onShowReasoning: (decision: CouncilDecision, vote: CouncilVote) => void
}> = ({ decision, onShowEvidence, onShowReasoning }) => {
    const votesFor = decision.votes.filter(v => v.vote === 'YES').length;
    const votesAgainst = decision.votes.filter(v => v.vote === 'NO').length;
    const totalVotes = votesFor + votesAgainst;
    const forPercentage = totalVotes > 0 ? (votesFor / (votesFor + votesAgainst)) * 100 : 0;
    
    const statusConfig = {
        [CouncilDecisionStatus.VOTING]: { text: "Voting", variant: 'warning' as const },
        [CouncilDecisionStatus.PASSED]: { text: "Passed", variant: 'success' as const },
        [CouncilDecisionStatus.REJECTED]: { text: "Rejected", variant: 'destructive' as const },
        [CouncilDecisionStatus.EXECUTING]: { text: "Executing", variant: 'bullish' as const },
        [CouncilDecisionStatus.COMPLETE]: { text: "Complete", variant: 'neutral' as const },
    };

    return (
        <div className="p-3 bg-secondary rounded-md space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-sm">{decision.title}</h4>
                    <p className="text-xs text-muted-foreground">{decision.description}</p>
                </div>
                <Badge variant={statusConfig[decision.status].variant}>{statusConfig[decision.status].text}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
                {decision.votes.map((vote, i) => <VoteChip key={i} vote={vote} onExplain={() => onShowReasoning(decision, vote)} />)}
            </div>
            
            {decision.status === 'VOTING' && (
                <div>
                    <Progress value={forPercentage} className="h-1.5" />
                    <div className="flex justify-between items-center text-xs mt-1 text-muted-foreground">
                        <span>{votesFor} FOR / {votesAgainst} AGAINST</span>
                        <CountdownTimer expiresAt={decision.expiresAt} status={decision.status} />
                    </div>
                </div>
            )}
            
            <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => onShowEvidence(decision)}>Evidence</Button>
                <Button size="sm" className={cn("flex-1 text-xs", {'bg-success/80 hover:bg-success': decision.status === 'VOTING'})} disabled={decision.status !== 'VOTING'}>Vote FOR</Button>
            </div>
        </div>
    );
};


const CouncilDecisions: React.FC = () => {
  const decisions = useCouncilDecisions();
  const [evidenceDecision, setEvidenceDecision] = useState<CouncilDecision | null>(null);
  const [reasoningContext, setReasoningContext] = useState<{ decision: CouncilDecision, vote: CouncilVote } | null>(null);

  return (
    <>
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader>
          <CardTitle>AI Council Decisions</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto pr-2">
          {decisions.length > 0 ? (
            <div className="space-y-3">
              {decisions.map(d => <DecisionItem 
                key={d.id} 
                decision={d} 
                onShowEvidence={setEvidenceDecision} 
                onShowReasoning={(decision, vote) => setReasoningContext({ decision, vote })}
                />)}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Awaiting council proposals...
            </div>
          )}
        </CardContent>
      </Card>
      <EvidenceDrawer
        open={!!evidenceDecision}
        onOpenChange={(isOpen) => !isOpen && setEvidenceDecision(null)}
        decision={evidenceDecision}
      />
      <ReasoningDialog
        open={!!reasoningContext}
        onOpenChange={(isOpen) => !isOpen && setReasoningContext(null)}
        decision={reasoningContext?.decision ?? null}
        vote={reasoningContext?.vote ?? null}
      />
    </>
  );
};

export default CouncilDecisions;
