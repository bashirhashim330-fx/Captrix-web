import { usd } from '../lib/format.js';
import RuleInfo from './RuleInfo.jsx';

// Compact risk widget (Overview). Uses the Corridor language: green dashed
// target, cyan start line, red solid floor, amber dashed daily limit.
const tone = (p) => (p >= 80 ? 'loss' : p >= 50 ? 'warning' : 'ok');

const Meter = ({ label, rule, used, allowance, limitStyle }) => {
  const p = Math.min(100, (used / allowance) * 100);
  const t = tone(p);
  const fill = t === 'loss' ? 'bg-fin-loss' : t === 'warning' ? 'bg-fin-warning' : 'cx-grad-fill';
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
        <span className="flex items-center gap-1.5 text-slate-300 uppercase tracking-wider text-[10px]">{label}<RuleInfo rule={rule} className="text-slate-400" /></span>
        <span className={`font-bold ${t === 'loss' ? 'text-fin-loss' : t === 'warning' ? 'text-fin-warning' : 'text-white'}`}>{p.toFixed(0)}%</span>
      </div>
      <div className="relative mt-2 h-2 rounded-full cx-inset" role="meter" aria-valuemin={0} aria-valuemax={allowance} aria-valuenow={used} aria-label={`${label}: ${usd(used)} of ${usd(allowance)} used`}>
        <div className={`${fill} cx-meter-fill h-full rounded-full`} style={{ width: `${Math.max(2, p)}%` }}></div>
        {/* the limit itself, drawn like the Corridor floor lines */}
        <span className={`absolute -top-1 -bottom-1 right-0 w-0 border-r-2 ${limitStyle}`} aria-hidden="true"></span>
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-500">
        <span>{usd(used)} of {usd(allowance)}</span>
        <span>{usd(allowance - used)} headroom</span>
      </div>
    </div>
  );
};

const RiskAtAGlance = ({ account, challenge, className = '' }) => {
  const target = account.size + challenge.targetAmount;
  const floor = account.size - challenge.maxDrawdown;
  const span = target - floor;
  const y = (v) => 8 + (1 - (v - floor) / span) * 124; // svg 0..140
  const eqY = Math.min(132, Math.max(8, y(account.equity)));
  const dailyP = (account.ddDaily / challenge.dailyDrawdown) * 100;
  const maxP = (account.ddMax / challenge.maxDrawdown) * 100;
  const worst = Math.max(dailyP, maxP);
  const levels = [
    { key: 'target', v: target, label: 'TARGET', cls: 'text-fin-profit', dash: '4 3' },
    { key: 'start', v: account.size, label: 'START', cls: 'text-brand-cyan' },
    { key: 'floor', v: floor, label: 'FLOOR', cls: 'text-fin-loss' },
  ];
  // label baselines follow their lines; nudge apart if two levels are too close
  const labelY = { target: y(target), start: y(account.size), floor: y(floor), equity: eqY };
  if (Math.abs(labelY.equity - labelY.target) < 16) labelY.equity = labelY.target + 16;
  if (Math.abs(labelY.equity - labelY.start) < 14) labelY.equity = labelY.start - 14;
  return (
    <section aria-label="Risk at a glance" className={`cx-t2 cx-t2--quiet rounded-2xl p-5 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h4 className="font-sora text-sm font-bold text-white">Risk at a glance</h4>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${worst >= 80 ? 'text-fin-loss border-fin-loss/40' : worst >= 50 ? 'text-fin-warning border-fin-warning/40' : 'text-fin-profit border-fin-profit/40'}`}>
          {worst >= 80 ? 'Near limit' : worst >= 50 ? 'Watch' : 'Within limits'}
        </span>
      </div>
      {/* Mini corridor: the same target / start / floor language as CaptrixCorridor,
          with each label sitting exactly on its level line. */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-8 xl:grid-cols-1 xl:gap-0">
      <svg viewBox="0 0 300 140" className="w-full max-w-[380px] h-auto overflow-visible self-center" role="img" aria-label={`Equity ${usd(account.equity, 2)} between floor ${usd(floor)} and target ${usd(target)}`}>
        <defs>
          <linearGradient id="cxRiskZone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2EE6A6" stopOpacity="0.16" />
            <stop offset="50%" stopColor="#11D6FF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FF5C6C" stopOpacity="0.14" />
          </linearGradient>
        </defs>
        <rect x="10" y={y(target)} width="44" height={y(floor) - y(target)} rx="3" fill="url(#cxRiskZone)" />
        {levels.map((l) => (
          <g key={l.key} className={l.cls}>
            <line x1="4" x2="300" y1={y(l.v)} y2={y(l.v)} stroke="currentColor" strokeOpacity={l.key === 'start' ? 0.55 : 0.85} strokeWidth={l.key === 'floor' ? 1.6 : 1.2} strokeDasharray={l.dash} />
            <text x="72" y={labelY[l.key] - 4} fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing=".8">{l.label}</text>
            <text x="300" y={labelY[l.key] - 4} textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600">{usd(l.v)}</text>
          </g>
        ))}
        <line x1="32" x2="32" y1={y(account.size)} y2={eqY} stroke="#11D6FF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy={eqY} r="10" fill="#11D6FF" opacity=".15" />
        <circle cx="32" cy={eqY} r="5" fill="#0b0c10" stroke="#11D6FF" strokeWidth="2.5" />
        <g className="text-white">
          <text x="72" y={labelY.equity + 4} fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" letterSpacing=".8">EQUITY</text>
          <text x="300" y={labelY.equity + 4} textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">{usd(account.equity, 2)}</text>
        </g>
      </svg>
      <div className="pt-4 border-t md:border-t-0 md:pt-0 xl:mt-5 xl:pt-4 xl:border-t border-surface-border/50 space-y-4">
        <Meter label="Daily drawdown used" rule="dailyDrawdown" used={account.ddDaily} allowance={challenge.dailyDrawdown} limitStyle="border-fin-warning border-dashed" />
        <Meter label="Max drawdown used" rule="maxDrawdown" used={account.ddMax} allowance={challenge.maxDrawdown} limitStyle="border-fin-loss" />
      </div>
      </div>
      <p className="mt-4 text-[10px] font-mono text-slate-500">Sample data · prototype</p>
    </section>
  );
};

export default RiskAtAGlance;
