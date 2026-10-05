import { usd, signedUsd } from '../lib/format.js';

// Overview hero: the active account is the one Tier-2 PRIMARY surface on the
// screen (richest glass + Lambo corners). Everything else on Overview is quieter.
const ActiveAccountModule = ({ account, challenge, className = '' }) => {
  const profit = account.equity - account.size;
  const profitPct = (profit / account.size) * 100;
  const progress = Math.min(100, (account.targetCurrent / account.target) * 100);
  const passed = account.targetCurrent >= account.target;
  const s = account.sample.spark.profit;
  const sMin = Math.min(...s), sMax = Math.max(...s) || 1;
  const trace = s.map((v, i) => `${i ? 'L' : 'M'}${((i / (s.length - 1)) * 400).toFixed(1)} ${(90 - ((v - sMin) / (sMax - sMin || 1)) * 70).toFixed(1)}`).join(' ');
  return (
    <section aria-label="Active account" className={`cx-t2 cx-t2--primary cx-lambo rounded-2xl p-5 sm:p-7 overflow-hidden flex flex-col ${className}`}>
      {/* Decorative equity trace behind the module (sample series) */}
      <svg className="absolute inset-x-0 bottom-0 w-full h-40 pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cxHeroTrace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#11D6FF" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#11D6FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${trace} L400 100 L0 100 Z`} fill="url(#cxHeroTrace)" />
        <path d={trace} fill="none" stroke="#11D6FF" strokeOpacity=".35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-widest bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">ACTIVE ACCOUNT</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-fin-profit/10 text-fin-profit border border-fin-profit/30">
          <span className="w-1.5 h-1.5 rounded-full bg-fin-profit animate-pulse" aria-hidden="true"></span>{account.status}
        </span>
        <span className="ml-auto text-[10px] font-mono text-slate-500">Demo figures</span>
      </div>

      <div className="relative mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-mono text-slate-400 truncate">{account.id} · {account.type}</div>
          <div className="cx-accent-bar mt-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total net equity</div>
          <div className="font-sora text-[2rem] leading-none sm:text-5xl font-extrabold tracking-tight text-white mt-1.5">
            {usd(account.equity, 2)}
          </div>
          <div className={`mt-2 text-xs font-mono ${profit >= 0 ? 'text-fin-profit' : 'text-fin-loss'}`}>
            {signedUsd(profit)} ({profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%) <span className="text-slate-500">vs start</span>
          </div>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-4 sm:gap-6 font-mono text-[10px] sm:text-right shrink-0">
          <div><dt className="text-slate-500 uppercase tracking-wider">Start</dt><dd className="text-brand-cyan text-xs sm:text-sm font-semibold mt-0.5">{usd(account.size)}</dd></div>
          <div><dt className="text-slate-500 uppercase tracking-wider">Target</dt><dd className="text-fin-profit text-xs sm:text-sm font-semibold mt-0.5">{usd(account.size + challenge.targetAmount)}</dd></div>
          <div><dt className="text-slate-500 uppercase tracking-wider">Floor</dt><dd className="text-fin-loss text-xs sm:text-sm font-semibold mt-0.5">{usd(account.size - challenge.maxDrawdown)}</dd></div>
        </dl>
      </div>

      <div className="relative mt-6 xl:mt-auto xl:pt-8">
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <span className="text-slate-400 uppercase tracking-wider">{passed ? 'Profit target reached' : 'Progress to profit target'}</span>
          <span className={passed ? 'text-fin-profit font-bold' : 'text-brand-cyan font-bold'}>{progress.toFixed(1)}%</span>
        </div>
        <div className="relative h-2.5 rounded-full cx-inset overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress to profit target">
          <div className="cx-grad-fill cx-meter-fill h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-500">
          <span>{usd(account.targetCurrent)} of {usd(account.target)} target</span>
          <span>{passed ? 'Phase passed' : `${usd(account.target - account.targetCurrent)} to go`}</span>
        </div>
      </div>
    </section>
  );
};

export default ActiveAccountModule;
