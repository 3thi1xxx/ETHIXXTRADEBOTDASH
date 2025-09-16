
import React from 'react';
import { Position } from '../types';

interface PositionsTableProps {
  positions: Position[];
}

export const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  if (positions.length === 0) {
    return <p className="text-gray-400 text-center py-4">No open positions.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3">Symbol</th>
            <th scope="col" className="px-6 py-3">Side</th>
            <th scope="col" className="px-6 py-3">Size</th>
            <th scope="col" className="px-6 py-3">Entry Price</th>
            <th scope="col" className="px-6 py-3">PnL</th>
            <th scope="col" className="px-6 py-3">PnL %</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => (
            <tr key={pos.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
              <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{pos.symbol}</td>
              <td className={`px-6 py-4 font-bold ${pos.side === 'LONG' ? 'text-green-400' : 'text-red-400'}`}>{pos.side}</td>
              <td className="px-6 py-4">{pos.size}</td>
              <td className="px-6 py-4">${pos.entryPrice.toLocaleString()}</td>
              <td className={`px-6 py-4 ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>${pos.pnl.toFixed(2)}</td>
               <td className={`px-6 py-4 ${pos.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnlPercent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
