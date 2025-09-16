import React, { useState, useMemo } from 'react';
import { useOGStore } from '../../store/useOG';
import { TokenState } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { cn } from '../../lib/utils';
import { TokenDrawer } from './TokenDrawer';

const getBand = (score: number): 'bullish' | 'neutral' | 'bearish' => {
  if (score >= 70) return 'bullish';
  if (score < 30) return 'bearish';
  return 'neutral';
};

interface TokenTileProps {
  ticker: string;
  token: TokenState;
  onClick: () => void;
}

const TokenTile: React.FC<TokenTileProps> = React.memo(({ ticker, token, onClick }) => {
    const band = getBand(token.score);

    const bandClasses = {
        bullish: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
        neutral: 'bg-sky-500/10 border-sky-500/30 hover:bg-sky-500/20',
        bearish: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                'relative p-1.5 rounded-md cursor-pointer transition-all duration-200 border text-center flex flex-col justify-center items-center aspect-square',
                bandClasses[band]
            )}
        >
            <div className="font-bold text-xs truncate text-foreground">{ticker}</div>
            <div className="text-lg font-mono font-extrabold">{token.score}</div>
            {token.tags?.includes('NEW') && (
                <Badge variant="warning" className="absolute -top-1 -right-1 text-xs px-1 py-0">NEW</Badge>
            )}
        </div>
    );
});

const TokenMatrix: React.FC = () => {
  const tokens = useOGStore((state) => state.tokens);
  const [selectedToken, setSelectedToken] = useState<{ ticker: string; token: TokenState } | null>(null);

  const sortedTokens = useMemo(() => {
    return Array.from(tokens.entries())
           .sort(([, a], [, b]) => b.updatedAt - a.updatedAt);
  }, [tokens]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>Live Token Matrix</span>
            <span className="text-sm font-normal text-muted-foreground">{tokens.size} / 500 Slots</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 gap-2">
          {sortedTokens.map(([ticker, token]) => (
            <TokenTile
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
