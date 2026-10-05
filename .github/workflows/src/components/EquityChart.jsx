import { useMemo, useState } from 'react';
import { usd, signedUsd } from '../lib/format.js';

// Upgraded "Equity & Watermark Progression" chart (lives where it always did:
// dashboard Overview). Adds Corridor level lines — target (green dashed),
// start balance (cyan), max-drawdown floor (red) — working period switcher,
// and a pointer/keyboard crosshair. Sample series only.
const W = 800, H = 240, TOP = 14, BOTTOM = 14;
const PERIODS = ['1D', '1W', '1M', 'ALL'];

const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildSeries = (account, challenge, period) => {
  const eq = account.equity;
  const cfg = {
    '1D': { n: 24, from: eq - account.sample.todayPL, seed: 11 },
    '1W': { n: 28, from: eq - (eq - account.size) * 0.4, seed: 23 },
    '1M': { n: 30, from: account.size + (eq - account.size) * 0.04, seed: 37 },
    ALL: { n: 44, from: account.size, seed: 53 },
  }[period];
  const r = rng(cfg.seed + account.size);
  const amp = Math.max(Math.abs(eq - cfg.from) * 0.22, account.size * 0.0035);
  const lo = account.size - challenge.maxDrawdown * 0.9, hi = account.size + challenge.targetAmount * 0.98;
  const out = [];
  for (let i = 0; i < cfg.n; i++) {
    const t = i / (cfg.n - 1);
    const trend = cfg.from + (eq - cfg.from) * (t * t * (3 - 2 * t));
    const noise = i === 0 || i === cfg.n - 1 ? 0 : (r() - 0.5) * 2 * amp * Math.sin(Math.PI * t);
    out.push(Math.min(hi, Math.max(lo, trend + noise)));
  }
  return out;
};

const EquityChart = ({ account, challenge }) => {
  const [period, setPeriod] = useState('1M');
  const [hover, setHover] = useState(null);
  const series = useMemo(() => buildSeries(account, challenge, period), [account, challenge, period]);

  const target = account.size + challenge.targetAmount;
  const floor = account.size - challenge.maxDrawdown;
  const pad = (target - floor) * 0.06;
  const min = floor - pad, max = target + pad;
  const y = (v) => TOP + (1 - (v - min) / (max - min)) * (H - TOP - BOTTOM);
  const x = (i) => (i / (series.length - 1)) * W;
  const line = series.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  const pctY = (v) => `${(y(v) / H) * 100}%`;

  const levels = [
    { key: 'target', v: target, label: 'TARGET', cls: 'text-fin-profit border-fin-profit/40', stroke: '#2EE6A6', dash: '6 5', w: 1.5 },
    { key: 'start', v: account.size, label: 'START', cls: 'text-brand-cyan border-brand-cyan/40', stroke: '#11D6FF', dash: undefined, w: 1.2, op: 0.65 },
    { key: 'floor', v: floor, label: 'FLOOR', cls: 'text-fin-loss border-fin-loss/40', stroke: '#FF5C6C', dash: undefined, w: 1.8 },
  ];

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (series.length - 1));
    setHover(Math.min(series.length - 1, Math.max(0, i)));
  };
  const onKey = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    setHover((h) => {
      const cur = h == null ? series.length - 1 : h;
      return Math.min(series.length - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1)));
    });
  };
  const hv = hover != null ? series[hover] : null;
  const last = series[series.length - 1];

  return (
    <section aria-label="Equity and watermark progression" className="cx-t2 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h4 className="font-sora text-base font-bold text-white">Equity & Watermark Progression</h4>
          <span className="text-xs font-mono text-slate-400">Continuous M5 balance audit stream · sample data</span>
        </div>
        <div className="flex items-center gap-1 cx-inset p-1 rounded-lg self-start" role="group" aria-label="Chart period">
          {PERIODS.map((p) => (
            <button key={p} type="button" aria-pressed={period === p} onClick={() => { setPeriod(p); setHover(null); }}
              className={`min-w-[40px] px-2.5 py-1 text-xs font-mono rounded transition-colors ${period === p ? 'bg-brand-cyan text-bg font-bold' : 'text-slate-400 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative h-56 sm:h-64 w-full outline-none touch-pan-y"
        tabIndex={0}
        role="img"
        aria-label={`Equity ${usd(last, 2)}; target ${usd(target)}, start ${usd(account.size)}, floor ${usd(floor)}. Use left and right arrows to inspect points.`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#11D6FF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#11D6FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="eqZone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2EE6A6" stopOpacity="0.07" />
              <stop offset="55%" stopColor="#11D6FF" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#FF5C6C" stopOpacity="0.07" />
            </linearGradient>
          </defs>
          <rect x="0" y={y(target)} width={W} height={y(floor) - y(target)} fill="url(#eqZone)" />
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={TOP + f * (H - TOP - BOTTOM)} y2={TOP + f * (H - TOP - BOTTOM)} stroke="#1f2433" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          ))}
          {levels.map((l) => (
            <line key={l.key} x1="0" x2={W} y1={y(l.v)} y2={y(l.v)} stroke={l.stroke} strokeWidth={l.w} strokeDasharray={l.dash} strokeOpacity={l.op || 1} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill="url(#eqFill)" />
          <path d={line} fill="none" stroke="#11D6FF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Level labels (HTML so text never stretches with the SVG) */}
        {levels.map((l) => (
          <span key={l.key} className={`cx-chip absolute right-1 -translate-y-1/2 px-1.5 py-0.5 rounded border font-mono text-[9px] sm:text-[10px] pointer-events-none whitespace-nowrap ${l.cls}`} style={{ top: pctY(l.v) }}>
            {l.label} {usd(l.v)}
          </span>
        ))}

        {/* Current-value marker */}
        <span className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-cyan bg-bg shadow-cyan-sm pointer-events-none" style={{ left: '100%', top: pctY(last) }} aria-hidden="true"></span>

        {hv != null && (
          <>
            <span className="absolute top-0 bottom-0 w-px bg-brand-cyan/40 pointer-events-none" style={{ left: `${(hover / (series.length - 1)) * 100}%` }} aria-hidden="true"></span>
            <span className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan pointer-events-none" style={{ left: `${(hover / (series.length - 1)) * 100}%`, top: pctY(hv) }} aria-hidden="true"></span>
            <span
              className="cx-t3 cx-t3--sm absolute top-1 px-2.5 py-1.5 rounded-lg font-mono text-[10px] pointer-events-none whitespace-nowrap"
              style={{ left: `${(hover / (series.length - 1)) * 100}%`, transform: `translateX(${hover > series.length / 2 ? '-108%' : '8%'})` }}
            >
              <span className="block text-white font-bold text-xs">{usd(hv, 2)}</span>
              <span className={hv >= account.size ? 'text-fin-profit' : 'text-fin-loss'}>{signedUsd(hv - account.size)} vs start</span>
            </span>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5"><i className="w-4 border-t-2 border-dashed border-fin-profit" aria-hidden="true"></i>Profit target</span>
        <span className="flex items-center gap-1.5"><i className="w-4 border-t-2 border-brand-cyan/70" aria-hidden="true"></i>Start balance</span>
        <span className="flex items-center gap-1.5"><i className="w-4 border-t-2 border-fin-loss" aria-hidden="true"></i>Max drawdown floor</span>
        <span className="flex items-center gap-1.5"><i className="w-4 border-t-2 border-brand-cyan" aria-hidden="true"></i>Equity</span>
      </div>
    </section>
  );
};

export default EquityChart;
