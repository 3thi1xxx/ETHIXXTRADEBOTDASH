import React from 'react';
import { useOGStore } from '../../store/useOG';
import { OpportunityEvent } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

const OpportunityItem: React.FC<{ opp: OpportunityEvent }> = ({ opp }) => (
    <div className="p-3 bg-secondary rounded-md">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-semibold text-sm">{opp.title}</h4>
                <p className="text-xs text-muted-foreground">{opp.desc}</p>
            </div>
            <div className="text-lg font-bold text-primary">{opp.score}</div>
        </div>
        <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs">Simulate</Button>
            <Button size="sm" className="flex-1 text-xs">Execute</Button>
        </div>
    </div>
);


const Opportunities: React.FC = () => {
    const opportunities = useOGStore(state => state.opportunities);
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Live Opportunities</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-2">
        {opportunities.length > 0 ? (
          <div className="space-y-3">
            {opportunities.map(opp => <OpportunityItem key={opp.id} opp={opp} />)}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Scanning for opportunities...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Opportunities;
