import { useState, useMemo } from 'react';
import { CHALLENGE_DATA } from '../data/challenges.js';
import { playFinAudio } from '../lib/audio.js';
import RuleInfo from './RuleInfo.jsx';

// tier: 'primary' (hero centrepiece) | 'default' | 'quiet' (secondary placements)
const CaptrixCorridor = ({ challenge, interactive = true, onSelectSize, tier = 'default', lambo = false }) => {
  const [hoverPoint, setHoverPoint] = useState(null);

  const targetValue = challenge.size + challenge.targetAmount;
  const dailyDdValue = challenge.size - challenge.dailyDrawdown;
  const maxDdValue = challenge.size - challenge.maxDrawdown;

  // Simulated equity curve traversing safely within the corridor
  const equityPoints = useMemo(() => {
    const points = [
      { p: 0, val: challenge.size },
      { p: 15, val: challenge.size + challenge.targetAmount * 0.18 },
      { p: 32, val: challenge.size - challenge.dailyDrawdown * 0.35 },
      { p: 48, val: challenge.size + challenge.targetAmount * 0.45 },
      { p: 65, val: challenge.size + challenge.targetAmount * 0.32 },
      { p: 82, val: challenge.size + challenge.targetAmount * 0.78 },
      { p: 100, val: challenge.size + challenge.targetAmount * 0.94 }
    ];
    return points;
  }, [challenge]);

  // Generate SVG path string
  const svgHeight = 220;
  const svgWidth = 720;
  const range = (targetValue * 1.05) - (maxDdValue * 0.95);
  
  const getY = (val) => {
    const norm = (targetValue * 1.04 - val) / range;
    return 18 + norm * (svgHeight - 36);
  };

  const pathData = equityPoints.reduce((acc, pt, idx) => {
    const x = (pt.p / 100) * svgWidth;
    const y = getY(pt.val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  return (
    <div className={`cx-t2 ${tier === 'primary' ? 'cx-t2--primary' : tier === 'quiet' ? 'cx-t2--quiet' : ''} ${lambo ? 'cx-lambo' : ''} relative w-full rounded-2xl p-4 sm:p-6 lg:p-7 overflow-hidden`}>
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-fin-loss/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Corridor Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
              THE CAPTRIX CORRIDOR
            </span>
            <span className="text-xs text-slate-400 font-mono tracking-tight">DYNAMIC RISK ENGINE</span>
          </div>
          <h3 className="font-sora text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Account Architecture: <span className="text-brand-cyan">{challenge.label}</span>
          </h3>
        </div>

        {/* Quick account tier switcher pills */}
        {interactive && onSelectSize && (
          <div className="flex flex-wrap items-center gap-1.5 cx-inset p-1 rounded-xl" role="group" aria-label="Account size">
            {CHALLENGE_DATA.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  playFinAudio('tick');
                  onSelectSize(c);
                }}
                aria-pressed={c.id === challenge.id}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  c.id === challenge.id
                    ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-semibold shadow-cyan-sm'
                    : 'text-slate-400 hover:text-white hover:bg-surface-elevated'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Visual Financial Corridor */}
      <div className="relative w-full overflow-x-auto pb-2 cx-scroll-fade" tabIndex={0} role="region" aria-label="Corridor graph — scrolls sideways">
        <div className="min-w-[560px] relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56 select-none overflow-visible">
            <defs>
              {/* Linear gradients */}
              <linearGradient id="corridorSafeZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2EE6A6" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#11D6FF" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#FF5C6C" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="equityStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1478FF" />
                <stop offset="70%" stopColor="#11D6FF" />
                <stop offset="100%" stopColor="#2EE6A6" />
              </linearGradient>
            </defs>

            {/* Corridor Safe Boundary Fill */}
            <rect 
              x="0" 
              y={getY(targetValue)} 
              width={svgWidth} 
              height={Math.max(0, getY(maxDdValue) - getY(targetValue))} 
              fill="url(#corridorSafeZone)"
            />

            {/* Upper Limit: Profit Target Line */}
            <line 
              x1="0" y1={getY(targetValue)} 
              x2={svgWidth} y2={getY(targetValue)} 
              stroke="#2EE6A6" strokeWidth="1.5" strokeDasharray="5 5" 
            />
            
            {/* Center Baseline: Starting Balance */}
            <line 
              x1="0" y1={getY(challenge.size)} 
              x2={svgWidth} y2={getY(challenge.size)} 
              stroke="#11D6FF" strokeWidth="1.2" strokeOpacity="0.6" 
            />

            {/* Intermediate Warning: Daily Drawdown Limit */}
            <line 
              x1="0" y1={getY(dailyDdValue)} 
              x2={svgWidth} y2={getY(dailyDdValue)} 
              stroke="#FFB547" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7"
            />

            {/* Lower Boundary: Max Drawdown Liquidation Barrier */}
            <line 
              x1="0" y1={getY(maxDdValue)} 
              x2={svgWidth} y2={getY(maxDdValue)} 
              stroke="#FF5C6C" strokeWidth="1.8" 
            />

            {/* Dynamic Equity Curve */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="url(#equityStroke)" 
              strokeWidth="3.2" 
              strokeLinecap="round"
              className="transition-all duration-700 ease-out drop-shadow-[0_2px_12px_rgba(17,214,255,0.4)]"
            />

            {/* Target achieved halo marker */}
            {equityPoints.map((pt, i) => {
              const cx = (pt.p / 100) * svgWidth;
              const cy = getY(pt.val);
              return (
                <g key={i} className="cursor-pointer group" onMouseEnter={() => setHoverPoint(pt)}>
                  <circle cx={cx} cy={cy} r="4.5" fill="#0b0c10" stroke="#11D6FF" strokeWidth="2.5" />
                  <circle cx={cx} cy={cy} r="9" fill="#11D6FF" opacity="0.15" className="group-hover:opacity-40 transition-opacity" />
                </g>
              );
            })}
          </svg>

          {/* Float Labels for Markers */}
          <div className="absolute left-2 top-1 font-mono text-[10px] sm:text-[11px] leading-snug max-w-[calc(100%-1rem)] text-fin-profit flex items-center gap-1.5 cx-chip px-2 py-0.5 rounded border border-fin-profit/30">
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-fin-profit"></span>
            PROFIT TARGET: +${challenge.targetAmount.toLocaleString()} ({challenge.targetPercent}%) → ${targetValue.toLocaleString()}
          </div>

          <div className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] sm:text-[11px] leading-snug max-w-[calc(100%-1rem)] text-brand-cyan flex items-center gap-1.5 cx-chip px-2 py-0.5 rounded border border-brand-cyan/30">
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-brand-cyan"></span>
            START BALANCE: ${challenge.size.toLocaleString()}
          </div>

          <div className="absolute left-2 bottom-1 font-mono text-[10px] sm:text-[11px] leading-snug max-w-[calc(100%-1rem)] text-fin-loss flex items-center gap-1.5 cx-chip px-2 py-0.5 rounded border border-fin-loss/30">
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-fin-loss"></span>
            MAX DRAWDOWN FLOOR: -${challenge.maxDrawdown.toLocaleString()} → ${maxDdValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Interactive Metric Cards beneath the corridor */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-surface-border">
        <div className="cx-t1 p-3 rounded-xl border">
          <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Starting Capital</span>
          <span className="font-mono text-base sm:text-lg font-bold text-white mt-0.5 block">
            ${challenge.size.toLocaleString()}
          </span>
          <span className="text-[10px] text-brand-cyan font-mono">100% Capital Base</span>
        </div>

        <div className="cx-t1 p-3 rounded-xl border">
          <span className="text-[11px] font-mono text-fin-profit block uppercase tracking-wider">Profit Objective<RuleInfo rule="profitTarget" className="ml-1.5 -mt-0.5" /></span>
          <span className="font-mono text-base sm:text-lg font-bold text-fin-profit mt-0.5 block">
            +${challenge.targetAmount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Target: {challenge.targetPercent}%</span>
        </div>

        <div className="cx-t1 p-3 rounded-xl border">
          <span className="text-[11px] font-mono text-fin-warning block uppercase tracking-wider">Daily Loss Limit<RuleInfo rule="dailyDrawdown" className="ml-1.5 -mt-0.5" /></span>
          <span className="font-mono text-base sm:text-lg font-bold text-fin-warning mt-0.5 block">
            -${challenge.dailyDrawdown.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Server reset @ 00:00 UTC</span>
        </div>

        <div className="cx-t1 p-3 rounded-xl border">
          <span className="text-[11px] font-mono text-fin-loss block uppercase tracking-wider">Max Drawdown Guard<RuleInfo rule="maxDrawdown" className="ml-1.5 -mt-0.5" /></span>
          <span className="font-mono text-base sm:text-lg font-bold text-fin-loss mt-0.5 block">
            -${challenge.maxDrawdown.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Dynamic trailing floor</span>
        </div>
      </div>
    </div>
  );
};

export default CaptrixCorridor;
