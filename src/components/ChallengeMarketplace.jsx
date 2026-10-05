import { useEffect, useMemo, useState } from 'react';
import { CHALLENGE_DATA } from '../data/challenges.js';
import { playFinAudio } from '../lib/audio.js';
import { scrollToId } from '../lib/motion.js';
import RuleInfo from './RuleInfo.jsx';
import CompareChallenges from './CompareChallenges.jsx';
import { Arrow, Grid, Table } from '../home/icons.jsx';

const MODELS = [
  { id: '1-Step', hint: 'Single phase' },
  { id: '2-Step', hint: 'Two phases' },
  { id: 'Instant Funded', hint: 'No evaluation' },
];
const money = (n) => `$${n.toLocaleString('en-US')}`;
const short = (n) => `$${n / 1000}K`;

// Homepage pricing (v3): 1 · choose a model → 2 · choose a size → plan card,
// with a Plan / Compare switch. Same CHALLENGE_DATA, same checkout callback.
const ChallengeMarketplace = ({ selectedId, onSelectTier, onCheckout, view, onViewChange }) => {
  const active = CHALLENGE_DATA.find(c => c.id === selectedId) || CHALLENGE_DATA[5];
  const [model, setModel] = useState(active.type);
  useEffect(() => { setModel(active.type); }, [active.type]);
  const sizes = useMemo(() => CHALLENGE_DATA.filter(c => c.type === model), [model]);

  const pick = (c) => { playFinAudio('tick'); onSelectTier(c); };
  const pickModel = (m) => {
    setModel(m);
    const list = CHALLENGE_DATA.filter(c => c.type === m);
    const nearest = list.reduce((a, b) => (Math.abs(b.size - active.size) < Math.abs(a.size - active.size) ? b : a), list[0]);
    pick(nearest);
  };

  // Deep links (#compare-tiers from hero, footer or menu) open the Compare view.
  useEffect(() => {
    const onHash = () => { if (window.location.hash === '#compare-tiers') onViewChange('compare'); };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [onViewChange]);

  const floor = active.size - active.maxDrawdown;
  const daily = active.size - active.dailyDrawdown;
  const target = active.size + active.targetAmount;
  const pos = (v) => ((v - floor) / (target - floor)) * 100;

  return (
    <section id="marketplace" className="h-section" aria-labelledby="pricing-title">
      <div className="h-container">
        <div className="text-center max-w-2xl mx-auto">
          <span className="h-eyebrow">Pricing</span>
          <h2 id="pricing-title" className="h-h2 mt-4">Select Your Capital Scale</h2>
          <p className="h-lead mt-4">Choose between rapid 1-Step evaluations, institutional 2-Step programs, or Instant live allocation with up to 90% profit splits.</p>
        </div>

        {/* Step controls */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <div>
            <div className="flex items-baseline gap-2 mb-2.5"><span className="h-num h-ink text-sm">1</span><span className="text-[13px] font-medium h-body">Challenge model</span></div>
            <div className="h-seg h-seg--fill" role="group" aria-label="Challenge model">
              {MODELS.map(m => (
                <button key={m.id} type="button" aria-pressed={model === m.id} onClick={() => pickModel(m.id)} className={`h-seg__btn !min-h-[52px] flex flex-col items-center justify-center leading-tight ${model === m.id ? 'is-on' : ''}`}>
                  <span>{m.id === 'Instant Funded' ? 'Instant' : m.id}</span>
                  <span className="text-[11px] font-normal opacity-[.85] mt-0.5">{m.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2.5"><span className="h-num h-ink text-sm">2</span><span className="text-[13px] font-medium h-body">Account size</span></div>
            <div className="h-seg h-seg--fill" role="group" aria-label="Account size">
              {sizes.map(c => (
                <button key={c.id} type="button" aria-pressed={c.id === active.id} onClick={() => pick(c)} className={`h-seg__btn !min-h-[52px] h-num ${c.id === active.id ? 'is-on' : ''}`}>
                  {short(c.size)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan / Compare switch */}
        <div id="compare-tiers" className="mt-10 flex justify-center scroll-mt-28">
          <div className="h-seg" role="group" aria-label="Pricing view">
            <button type="button" aria-pressed={view === 'plan'} onClick={() => onViewChange('plan')} className={`h-seg__btn inline-flex items-center gap-2 ${view === 'plan' ? 'is-on' : ''}`}><Grid />Plan details</button>
            <button type="button" aria-pressed={view === 'compare'} onClick={() => onViewChange('compare')} className={`h-seg__btn inline-flex items-center gap-2 ${view === 'compare' ? 'is-on' : ''}`}><Table />Compare all 7</button>
          </div>
        </div>

        {view === 'plan' ? (
          <div id="marketplace-config" className="h-card h-card--lg mt-8 grid grid-cols-1 lg:grid-cols-12 overflow-hidden scroll-mt-28">
            {/* Summary + CTA */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium h-muted">{active.type} model</span>
                <span className="h-pill !h-7 !text-[12px]">{active.badge}</span>
              </div>
              <div className="mt-5 flex items-baseline gap-2 flex-wrap">
                <span className="h-h3 h-num text-[2.2rem] sm:text-[2.6rem] !font-semibold !tracking-tight">{active.label}</span>
                <span className="h-muted text-[15px]">Allocation</span>
              </div>
              <div className="mt-6 h-well p-4 flex items-baseline justify-between gap-3">
                <span className="h-num h-ink text-3xl font-semibold">${active.price}</span>
                <span className="text-[12.5px] h-muted text-right">One-time registration fee</span>
              </div>
              <button type="button" onClick={() => { playFinAudio('tick'); onCheckout(active); }} className="h-btn h-btn--primary h-btn--lg w-full mt-6">
                Start {active.label} evaluation <Arrow />
              </button>
              <p className="text-[12.5px] h-muted text-center mt-3">Instant automated credentials setup · Zero hidden recurring platform fees</p>

              {/* Corridor preview: floor → start → target on one scale */}
              <div className="mt-8 lg:mt-auto pt-6">
                <div className="text-[12px] h-muted mb-3">Your corridor</div>
                <div className="relative h-2 rounded-full" style={{ background: 'var(--h-well)', border: '1px solid var(--h-line)' }}>
                  <span className="absolute inset-y-0 rounded-full" style={{ left: `${pos(daily)}%`, right: 0, background: 'linear-gradient(90deg, var(--h-accent-soft), var(--h-accent-line))' }} />
                  {[['floor', floor, 'var(--h-loss)'], ['start', active.size, 'var(--h-ink)'], ['target', target, 'var(--h-profit)']].map(([k, v, c]) => (
                    <span key={k} className="absolute top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full border-2" style={{ left: `${pos(v)}%`, borderColor: c, background: 'var(--h-card)' }} aria-hidden="true" />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[11.5px] h-num">
                  <span><span className="h-muted block font-sans">Floor</span><span className="h-ink">{money(floor)}</span></span>
                  <span className="text-center"><span className="h-muted block font-sans">Start</span><span className="h-ink">{money(active.size)}</span></span>
                  <span className="text-right"><span className="h-muted block font-sans">Target</span><span className="h-ink">{money(target)}</span></span>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="lg:col-span-7 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l h-hairline" style={{ background: 'var(--h-card-2)' }}>
              <h3 className="h-h3 text-lg">Evaluation Risk Protocol: {active.label} Tier</h3>
              <div className="mt-4">
                <div className="h-row"><span className="h-body flex items-center gap-1.5">Profit split allocation <RuleInfo rule="profitSplit" /></span><span className="h-num h-ink font-semibold">{active.profitSplit}% trader share</span></div>
                <div className="h-row"><span className="h-body flex items-center gap-1.5">Profit target <RuleInfo rule="profitTarget" /></span><span className="h-num h-ink">{money(active.targetAmount)} <span className="h-muted">({active.targetPercent}%)</span></span></div>
                <div className="h-row"><span className="h-body flex items-center gap-1.5">Daily drawdown ceiling <RuleInfo rule="dailyDrawdown" /></span><span className="h-num h-ink">{money(active.dailyDrawdown)}</span></div>
                <div className="h-row"><span className="h-body flex items-center gap-1.5">Max overall drawdown <RuleInfo rule="maxDrawdown" /></span><span className="h-num h-ink">{money(active.maxDrawdown)}</span></div>
                <div className="h-row"><span className="h-body">Trading days</span><span className="h-num h-ink text-right">{active.tradingDays}</span></div>
                <div className="h-row"><span className="h-body">Leverage <span className="h-muted">· FX, Indices &amp; Crypto</span></span><span className="h-num h-ink">{active.leverage}</span></div>
                <div className="h-row"><span className="h-body">Reward credit grant</span><span className="h-num h-ink">+{(active.price * 0.5).toFixed(0)} Spin Credits</span></div>
              </div>
            </div>
          </div>
        ) : (
          <CompareChallenges
            selectedId={active.id}
            onSelect={(c) => { pick(c); onViewChange('plan'); requestAnimationFrame(() => scrollToId('marketplace-config')); }}
          />
        )}
      </div>
    </section>
  );
};

export default ChallengeMarketplace;
