import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/Sheet';
import { TokenState } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TokenDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenData: { ticker: string; token: TokenState } | null;
}

export const TokenDrawer: React.FC<TokenDrawerProps> = ({ open, onOpenChange, tokenData }) => {
  if (!tokenData) return null;

  const { ticker, token } = tokenData;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader>
        <SheetTitle>{ticker} Details</SheetTitle>
        <SheetDescription>Last updated: {new Date(token.updatedAt).toLocaleTimeString()}</SheetDescription>
      </SheetHeader>
      <SheetContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-secondary p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Current Score</div>
                <div className="text-2xl font-bold">{token.score}</div>
            </div>
            <div className="bg-secondary p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Liquidity</div>
                <div className="text-2xl font-bold">{formatCurrency(token.liq, 0)}</div>
            </div>
          </div>

          <div>
              <h4 className="font-semibold mb-2">Score History</h4>
              <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={token.history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <XAxis dataKey="ts" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} className="text-xs"/>
                          <YAxis domain={[0, 100]}/>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#101629', border: '1px solid #2a314e' }}
                            labelStyle={{ color: '#e0e0e0' }}
                            formatter={(value, name, props) => [value, 'Score']}
                          />
                          <Line type="monotone" dataKey="score" stroke="#00aaff" strokeWidth={2} dot={false} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>
          
          <div>
              <h4 className="font-semibold mb-2">Recent Events</h4>
              <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-md h-40 overflow-y-auto">
                {/* Dummy events */}
                <p>> Score increased to 85</p>
                <p>> New liquidity pool detected</p>
                <p>> Whale wallet interaction</p>
              </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
