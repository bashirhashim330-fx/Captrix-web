import { Arrow, Check } from '../home/icons.jsx';

const EQUITY = [100000, 100420, 100180, 101050, 100760, 101900, 102640, 102210, 103380, 104120, 103700, 104960, 105580, 105210, 106340, 107450];

const line = (data, w, h, pad = 6) => {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  return data.map((v, i) => `${i ? 'L' : 'M'}${((i / (data.length - 1)) * (w - pad * 2) + pad).toFixed(1)} ${(h - pad - ((v - min) / span) * (h - pad * 2)).toFixed(1)}`).join(' ');
};

const Kpi = ({ label, value, sub, tone }) => (
  <div className="h-well p-3 min-w-0">
    <span className="block text-[11px] h-muted">{label}</span>
    <span className={`block h-num text-[15px] sm:text-[17px] font-semibold mt-1 whitespace-nowrap ${tone === 'profit' ? 'h-profit' : 'h-ink'}`}>{value}</span>
    <span className="block text-[11px] h-muted mt-0.5 whitespace-nowrap">{sub}</span>
  </div>
);

// Static, decorative preview of the Trader Dashboard overview (aria-hidden
// figure with a text alternative) — the real thing lives behind "Log in".
const DashboardMock = () => {
  const d = line(EQUITY, 600, 150);
  return (
    <figure className="relative m-0" aria-label="Preview of the Trader Dashboard overview">
      <div className="h-browser" aria-hidden="true">
        <div className="h-browser__bar">
          <i></i><i></i><i></i>
          <span className="ml-2 text-[12px] h-muted truncate">Trader Dashboard · Overview</span>
          <span className="ml-auto h-num text-[11.5px] h-muted hidden min-[420px]:inline">CTX-100K-84920</span>
        </div>
        <div className="p-3 sm:p-5 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-[12px] h-muted">Welcome back, Alex</span>
              <span className="block h-h3 text-[16px] sm:text-[18px] mt-0.5">$100K 2-Step · Phase 1</span>
            </div>
            <span className="h-pill !h-7 !text-[11.5px] !px-2.5 shrink-0"><span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--h-profit)' }}></span>Active</span>
          </div>
          <div className="grid grid-cols-2 min-[460px]:grid-cols-3 gap-2 sm:gap-3">
            <div className="col-span-2 min-[460px]:col-span-1"><Kpi label="Account equity" value="$107,450.20" sub="+7.45% Passed" /></div>
            <Kpi label="Daily P/L" value="+$1,420.00" sub="Drawdown OK" tone="profit" />
            <Kpi label="Win rate" value="68.4%" sub="38 Executions" />
          </div>
          <div className="h-well p-3 sm:p-4">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="h-muted">Equity trajectory</span>
              <span className="h-num h-muted">Target $110,000</span>
            </div>
            <svg className="w-full h-28 sm:h-36 mt-2" viewBox="0 0 600 150" preserveAspectRatio="none">
              <line x1="0" x2="600" y1="8" y2="8" stroke="var(--h-profit)" strokeOpacity=".5" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
              <path d={`${d} L594 150 L6 150 Z`} fill="var(--h-ink)" fillOpacity=".05" />
              <path d={d} fill="none" stroke="var(--h-ink)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {/* Floating overlay card */}
      <div className="h-card h-card--lg absolute -bottom-6 right-3 sm:-right-6 w-[220px] p-4 hidden min-[520px]:block" aria-hidden="true">
        <span className="block text-[11.5px] h-muted">Daily loss limit</span>
        <span className="block h-num text-[18px] font-semibold h-ink mt-1">$5,000.00</span>
        <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: 'var(--h-line)' }}>
          <div className="h-full rounded-full" style={{ width: '100%', background: 'var(--h-profit)' }}></div>
        </div>
        <span className="block text-[11px] h-muted mt-2">0% used · resets 00:00 UTC</span>
      </div>
      <figcaption className="sr-only">Overview showing equity of $107,450.20 (+7.45%), daily P/L of +$1,420.00 and a 68.4% win rate.</figcaption>
    </figure>
  );
};

const POINTS = [
  'Live Corridor tracking with automated liquidation guards',
  'Real-time position monitoring & high-density order books',
  'Integrated Spin & Win reward terminal & affiliate vault',
];

const DashboardShowcase = ({ onGoToDashboard }) => (
  <section id="platform" className="h-section" aria-labelledby="platform-title">
    <div className="h-container">
      <div className="grid grid-cols-1 min-[1024px]:grid-cols-12 gap-12 min-[1024px]:gap-14 items-center">
        <div className="min-[1024px]:col-span-5">
          <span className="h-eyebrow">Trader Dashboard</span>
          <h2 id="platform-title" className="h-h2 mt-4">Your Whole Challenge, On One Screen.</h2>
          <p className="h-lead mt-5">
            The Captrix Dashboard equips traders with live equity trajectory charts, trailing drawdown corridor meters, high-frequency order logs, and instant payout execution.
          </p>
          <ul className="mt-7 space-y-3.5">
            {POINTS.map(p => (
              <li key={p} className="flex items-start gap-3 text-[15px] h-ink">
                <span className="mt-0.5 w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0" style={{ background: 'var(--h-accent-soft)', color: 'var(--h-accent)' }}><Check className="w-3.5 h-3.5" /></span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={onGoToDashboard} className="h-btn h-btn--primary mt-9">
            Log in to your dashboard <Arrow />
          </button>
        </div>
        <div className="min-[1024px]:col-span-7 pb-6">
          <DashboardMock />
        </div>
      </div>
    </div>
  </section>
);

export default DashboardShowcase;
