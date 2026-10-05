import HomeCorridor from './HomeCorridor.jsx';
import { Arrow, Check } from './icons.jsx';

// Facts only — every figure here comes from CHALLENGE_DATA / existing copy.
const STATS = [
  { v: '7 Tiers', l: '$1,000 to $200,000' },
  { v: '3 Models', l: '1-Step / 2-Step / Instant' },
  { v: 'Up to 90%', l: 'Trader profit share' },
  { v: 'Up to 1:100', l: 'Institutional leverage' },
];

const Hero = ({ challenge, onSelectSize, onStart, onCompare }) => (
  <section id="corridor-hero" className="h-hero pt-10 sm:pt-16 lg:pt-20 pb-14 sm:pb-20">
    <div className="h-container relative z-[1]">
      <div className="grid grid-cols-1 min-[1100px]:grid-cols-12 gap-12 min-[1100px]:gap-10 items-center">
        <div className="min-[1100px]:col-span-6 max-w-2xl">
          <span className="h-pill"><span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--h-accent)' }} aria-hidden="true"></span>Trade bold. Get funded.</span>
          <h1 className="h-h1 mt-6">
            Trade The Space Between <span className="h-accent-text">Target &amp; Floor.</span>
          </h1>
          <p className="h-lead mt-6 max-w-xl">
            Captrix Funded equips disciplined operators with up to <strong className="h-ink font-semibold">$200,000</strong> in capital allocation across 1-Step, 2-Step, and Instant funding architectures.
          </p>
          <div className="mt-9 flex flex-col min-[480px]:flex-row gap-3">
            <button type="button" onClick={onStart} className="h-btn h-btn--primary h-btn--lg">
              Start {challenge.label} evaluation <span className="opacity-60 font-medium">· ${challenge.price}</span>
            </button>
            <button type="button" onClick={onCompare} className="h-btn h-btn--secondary h-btn--lg">
              Compare all 7 tiers <Arrow />
            </button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] h-body">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 h-accent" />One-time registration fee</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 h-accent" />Zero hidden recurring platform fees</li>
          </ul>
        </div>

        <div className="min-[1100px]:col-span-6">
          <HomeCorridor challenge={challenge} onSelectSize={onSelectSize} />
        </div>
      </div>

      <dl className="h-stats mt-14 sm:mt-20">
        {STATS.map(s => (
          <div key={s.v} className="h-stat">
            <dt className="sr-only">{s.l}</dt>
            <dd className="h-h3 text-[1.6rem] sm:text-[2rem] !font-semibold">{s.v}</dd>
            <dd className="text-[13px] h-muted mt-1" aria-hidden="true">{s.l}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default Hero;
