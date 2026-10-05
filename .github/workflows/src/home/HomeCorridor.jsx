import { useMemo } from 'react';
import { CHALLENGE_DATA } from '../data/challenges.js';
import { playFinAudio } from '../lib/audio.js';
import RuleInfo from '../components/RuleInfo.jsx';

const short = (n) => `$${n >= 1000 ? `${n / 1000}K` : n}`;
const money = (n) => `$${n.toLocaleString('en-US')}`;

// Homepage rendition of The Captrix Corridor: same data and equity path as the
// dashboard component, drawn with neutral surfaces and one accent. Fully fluid —
// no horizontal scrolling, labels sit on the lines at every width.
const HomeCorridor = ({ challenge, onSelectSize }) => {
  const target = challenge.size + challenge.targetAmount;
  const daily = challenge.size - challenge.dailyDrawdown;
  const floor = challenge.size - challenge.maxDrawdown;
  const pad = (target - floor) * 0.14;
  const top = target + pad, bottom = floor - pad;
  const y = (v) => ((top - v) / (top - bottom)) * 100;

  const pts = useMemo(() => ([
    [0, challenge.size],
    [15, challenge.size + challenge.targetAmount * 0.18],
    [32, challenge.size - challenge.dailyDrawdown * 0.35],
    [48, challenge.size + challenge.targetAmount * 0.45],
    [65, challenge.size + challenge.targetAmount * 0.32],
    [82, challenge.size + challenge.targetAmount * 0.78],
    [100, challenge.size + challenge.targetAmount * 0.94],
  ]), [challenge]);
  const line = pts.map(([x, v], i) => `${i ? 'L' : 'M'}${x} ${y(v).toFixed(2)}`).join(' ');
  const last = pts[pts.length - 1];

  return (
    <div className="h-card h-card--lg overflow-hidden" aria-label="The Captrix Corridor" role="group">
      <div className="p-5 sm:p-6 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-[12px] font-medium">
          <span className="h-eyebrow !tracking-[.12em] !text-[11px]">The Captrix Corridor</span>
          <span className="h-muted">· Dynamic risk engine</span>
        </div>
        <h3 className="h-h3 text-xl sm:text-2xl mt-2">
          Account Architecture: <span className="h-num h-ink">{challenge.label}</span>
        </h3>
        {onSelectSize && (
          <div className="h-seg mt-4 w-full sm:w-auto" role="group" aria-label="Account size">
            {CHALLENGE_DATA.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === challenge.id}
                aria-label={`${c.label} ${c.type}`}
                onClick={() => { playFinAudio('tick'); onSelectSize(c); }}
                className={`h-seg__btn !min-h-[34px] !px-3 h-num !text-[12.5px] ${c.id === challenge.id ? 'is-on' : ''}`}
              >
                {short(c.size)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-5 sm:px-6">
        <div className="h-well relative h-[210px] sm:h-[240px]">
          <div className="absolute inset-x-0 inset-y-3">
            <span className="h-cor-line border-dashed" style={{ top: `${y(target)}%`, borderColor: 'var(--h-profit)', opacity: .7 }} />
            <span className="h-cor-line border-dashed" style={{ top: `${y(daily)}%`, borderColor: 'var(--h-warn)', opacity: .45 }} />
            <span className="h-cor-line" style={{ top: `${y(challenge.size)}%`, borderColor: 'var(--h-line-2)' }} />
            <span className="h-cor-line" style={{ top: `${y(floor)}%`, borderColor: 'var(--h-loss)', opacity: .8 }} />
            {/* safe zone */}
            <span className="absolute inset-x-0" style={{ top: `${y(target)}%`, height: `${y(floor) - y(target)}%`, background: 'linear-gradient(180deg, var(--h-accent-soft), transparent)' }} />
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d={line} fill="none" stroke="var(--h-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span className="absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full" style={{ left: `${last[0]}%`, top: `${y(last[1])}%`, background: 'var(--h-accent)', boxShadow: '0 0 0 4px var(--h-accent-soft)' }} aria-hidden="true" />
            <span className="h-cor-tag" style={{ top: `${y(target)}%`, right: 'auto', left: 8 }}><i style={{ background: 'var(--h-profit)' }} />Target {money(target)}</span>
            <span className="h-cor-tag" style={{ top: `${y(challenge.size)}%` }}><i style={{ background: 'var(--h-muted)' }} />Start {money(challenge.size)}</span>
            <span className="h-cor-tag" style={{ top: `${y(floor)}%`, right: 'auto', left: 8 }}><i style={{ background: 'var(--h-loss)' }} />Floor {money(floor)}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <dl className="h-metrics grid grid-cols-2 sm:grid-cols-4 mt-5 border-t h-hairline">
        <div className="h-metric">
          <dt className="text-[12px] h-muted">Starting capital</dt>
          <dd className="h-num h-ink text-[17px] font-semibold mt-1">{money(challenge.size)}</dd>
          <dd className="text-[11.5px] h-muted mt-0.5">100% capital base</dd>
        </div>
        <div className="h-metric">
          <dt className="text-[12px] h-muted flex items-center gap-1.5">Profit objective <RuleInfo rule="profitTarget" /></dt>
          <dd className="h-num h-profit text-[17px] font-semibold mt-1">+{money(challenge.targetAmount)}</dd>
          <dd className="text-[11.5px] h-muted mt-0.5">Target: {challenge.targetPercent}%</dd>
        </div>
        <div className="h-metric">
          <dt className="text-[12px] h-muted flex items-center gap-1.5">Daily loss limit <RuleInfo rule="dailyDrawdown" /></dt>
          <dd className="h-num h-ink text-[17px] font-semibold mt-1">−{money(challenge.dailyDrawdown)}</dd>
          <dd className="text-[11.5px] h-muted mt-0.5">Server reset @ 00:00 UTC</dd>
        </div>
        <div className="h-metric">
          <dt className="text-[12px] h-muted flex items-center gap-1.5">Max drawdown guard <RuleInfo rule="maxDrawdown" /></dt>
          <dd className="h-num h-loss text-[17px] font-semibold mt-1">−{money(challenge.maxDrawdown)}</dd>
          <dd className="text-[11.5px] h-muted mt-0.5">Dynamic trailing floor</dd>
        </div>
      </dl>
    </div>
  );
};

export default HomeCorridor;
