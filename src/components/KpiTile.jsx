import Sparkline from './Sparkline.jsx';

// Tier-1 KPI tile: deliberately smaller and quieter than the account module.
// Each tile gets its own number, delta and trend strip (sample data).
const KpiTile = ({ label, value, valueClass = 'text-white', delta, deltaTone = 'up', sub, spark }) => (
  <div className="cx-t1 rounded-xl border p-3.5 sm:p-4 flex flex-col min-w-0">
    <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 leading-tight">{label}</span>
      {delta && (
        <span className={`shrink-0 inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold ${deltaTone === 'down' ? 'text-fin-loss' : deltaTone === 'flat' ? 'text-slate-400' : 'text-fin-profit'}`}>
          <span aria-hidden="true" className="text-[8px]">{deltaTone === 'down' ? '▼' : deltaTone === 'flat' ? '•' : '▲'}</span>{delta}
        </span>
      )}
    </div>
    <span className={`mt-1.5 font-sora text-[15px] min-[400px]:text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap ${valueClass}`}>{value}</span>
    <Sparkline data={spark} className="mt-2 w-full h-7" stretch />
    {sub && <span className="mt-1.5 text-[10px] font-mono text-slate-500 leading-snug">{sub}</span>}
  </div>
);

export default KpiTile;
