import React from 'react';
import { useKpi } from '../../store/useOG';
import { formatCurrency, formatNumber, formatUptime } from '../../lib/utils';

const KpiCard: React.FC<{ title: string; value: React.ReactNode; subvalue?: React.ReactNode }> = ({ title, value, subvalue }) => (
  <div className="p-3 text-center bg-card rounded-lg">
    <h4 className="text-xs text-muted-foreground uppercase tracking-wider">{title}</h4>
    <p className="text-xl lg:text-2xl font-bold text-foreground mt-1">{value}</p>
    {subvalue && <p className="text-xs text-muted-foreground">{subvalue}</p>}
  </div>
);

const KpiStrip: React.FC = () => {
  const kpi = useKpi();
  
  const pnlPercent = kpi && kpi.portfolio ? (kpi.pnl / kpi.portfolio) * 100 : 0;
  const totalPnl = kpi ? kpi.portfolio + kpi.pnl : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <KpiCard title="Portfolio Value" value={formatCurrency(totalPnl)} subvalue={`Total PNL (${formatCurrency(kpi?.pnl, 2)})`} />
      <KpiCard 
        title="Daily PnL" 
        value={<span className={pnlPercent >= 0 ? 'text-success' : 'text-destructive'}>+{pnlPercent.toFixed(1)}%</span>} 
        subvalue={<span className={pnlPercent >= 0 ? 'text-success' : 'text-destructive'}>{formatCurrency(kpi?.pnl)}</span>}
      />
      <KpiCard title="Auckland Edge" value={kpi ? `${kpi.edgeMs}ms` : '--'} />
      <KpiCard title="Live Tokens" value={formatNumber(kpi?.cu.used ? 488 : 0)} subvalue="/ 500" />
      <KpiCard title="Strategies" value={kpi ? `${kpi.strategies.enabled} / ${kpi.strategies.total}` : '--'} subvalue="enabled"/>
      <KpiCard title="CU Usage" value={kpi ? `${(kpi.cu.used / 1_000_000).toFixed(1)}M` : '--'} subvalue={kpi ? `${((kpi.cu.used / kpi.cu.total) * 100).toFixed(1)}% used` : ''} />
      <KpiCard title="Opportunities" value={formatNumber(0)} subvalue="active alerts" />
      <KpiCard title="System Uptime" value={formatUptime(kpi?.uptimeSec)} />
    </div>
  );
};

export default KpiStrip;