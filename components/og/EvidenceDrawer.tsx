// FIX: Create the EvidenceDrawer component.
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/Sheet';
import { CouncilDecision } from '../../types';

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision: CouncilDecision | null;
}

const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ open, onOpenChange, decision }) => {
  if (!decision) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader>
        <SheetTitle>Evidence for: {decision.title}</SheetTitle>
        <SheetDescription>Review the data backing this council decision.</SheetDescription>
      </SheetHeader>
      <SheetContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Summary</h4>
            <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
              The AI council proposed this action based on a confluence of high-volume trading, positive social media sentiment, and a breakout pattern on the 4-hour chart.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Key Metrics</h4>
            <ul className="text-sm space-y-2 list-disc list-inside bg-secondary p-3 rounded-md">
                <li>Volume Spike: +350% over 24h average</li>
                <li>Sentiment Score: 8.2/10 (Bullish)</li>
                <li>Technical Indicator: RSI crossed 70</li>
                <li>Whale Activity: 3 new large wallets detected</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Raw Data Links</h4>
            <div className="text-sm text-primary underline space-y-1">
                <p><a href="#" target="_blank" rel="noopener noreferrer">View transaction logs</a></p>
                <p><a href="#" target="_blank" rel="noopener noreferrer">Social sentiment report</a></p>
                <p><a href="#" target="_blank" rel="noopener noreferrer">Chart analysis snapshot</a></p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EvidenceDrawer;
