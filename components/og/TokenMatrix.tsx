import React, { useState, useMemo } from 'react';
import { useOGStore } from '../../store/useOG';
import { TokenState } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { cn } from '../../lib/utils';
import { TokenDrawer } from './TokenDrawer';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils';


const getBand = (score: number): 'bullish' | 'neutral' | 'bearish' => {
  if (score >= 70) return 'bullish';
  if (score < 30) return 'bearish';
  return 'neutral';
};

interface TokenRowProps {
  ticker: string;
  token: TokenState;
  onClick: () => void;
}

const TokenRow: React.FC<TokenRowProps> = React.memo(({ ticker, token, onClick }) => {
    const band = getBand(token.score);
    const bandClasses = {
        bullish: 'border-l-green-500/80',
        neutral: 'border-l-sky-500/80',
        bearish: 'border-l-red-500/80'
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                'grid grid-cols-12 items-center p-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-accent/50 border-l-4',
                bandClasses[band]
            )}
        >
            <div className="col-span-3 font-bold text-sm truncate text-foreground">{ticker}</div>
            <div className="col-span-3 text-xs text-muted-foreground text-right">{formatCurrency(token.liq, 0)}</div>
            <div className="col-span-3 h-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={token.history} margin={{ top: 5, right: 5, bottom: 5, left: 5}}>
                         <defs>
                            <linearGradient id={`chartGrad-${band}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={band === 'bullish' ? '#22c55e' : band === 'neutral' ? '#3b82f6' : '#ff5555'} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={band === 'bullish' ? '#22c55e' : band === 'neutral' ? '#3b82f6' : '#ff5555'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="score" stroke={band === 'bullish' ? '#22c55e' : band === 'neutral' ? '#3b82f6' : '#ff5555'} strokeWidth={2} fill={`url(#chartGrad-${band})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="col-span-3 text-lg font-mono font-extrabold text-right">{token.score}</div>
        </div>
    );
});

const TokenMatrix: React.FC = () => {
  const tokens = useOGStore((state) => state.tokens);
  const [selectedToken, setSelectedToken] = useState<{ ticker: string; token: TokenState } | null>(null);

  const sortedTokens = useMemo(() => {
    return Array.from(tokens.entries())
           .sort(([, a], [, b]) => b.score - a.score);
  }, [tokens]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>Live Token Matrix</span>
            <span className="text-sm font-normal text-muted-foreground">{tokens.size} / 500 Slots</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-1">
          {/* Header */}
           <div className="grid grid-cols-12 items-center px-2 py-1 text-xs text-muted-foreground font-semibold">
                <div className="col-span-3">Asset</div>
                <div className="col-span-3 text-right">Liquidity</div>
                <div className="col-span-3 text-center">Trend</div>
                <div className="col-span-3 text-right">Score</div>
            </div>
          {sortedTokens.map(([ticker, token]) => (
            <TokenRow
              key={ticker}
              ticker={ticker}
              token={token}
              onClick={() => setSelectedToken({ ticker, token })}
            />
          ))}
        </div>
      </CardContent>
      <TokenDrawer
        open={!!selectedToken}
        onOpenChange={(isOpen) => !isOpen && setSelectedToken(null)}
        tokenData={selectedToken}
      />
    </Card>
  );
};

export default TokenMatrix;