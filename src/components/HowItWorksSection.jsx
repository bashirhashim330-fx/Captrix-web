import { Check } from '../home/icons.jsx';

// Each step gets a small, quiet visual instead of a big glowing number.
const SizesVisual = () => (
  <div className="absolute inset-0 p-4 flex flex-wrap content-center gap-2" aria-hidden="true">
    {['$1K', '$5K', '$10K', '$25K', '$50K', '$100K', '$200K'].map(s => (
      <span key={s} className={`h-num text-[12px] px-2.5 h-7 inline-flex items-center rounded-lg border ${s === '$100K' ? 'h-ink' : 'h-muted'}`}
        style={s === '$100K' ? { background: 'var(--h-primary-bg)', color: 'var(--h-primary-fg)', borderColor: 'transparent' } : { borderColor: 'var(--h-line-2)' }}>{s}</span>
    ))}
  </div>
);

const CorridorVisual = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none" aria-hidden="true">
    <line x1="0" x2="300" y1="30" y2="30" stroke="var(--h-profit)" strokeOpacity=".55" strokeDasharray="4 4" />
    <line x1="0" x2="300" y1="122" y2="122" stroke="var(--h-loss)" strokeOpacity=".55" strokeDasharray="4 4" />
    <line x1="0" x2="300" y1="92" y2="92" stroke="var(--h-line-2)" />
    <path d="M0 92 C 30 96, 50 80, 80 84 S 130 70, 160 74 S 210 52, 240 50 S 280 38, 300 34" fill="none" stroke="var(--h-ink)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
  </svg>
);

const FundedVisual = () => (
  <div className="absolute inset-0 p-4 flex flex-col justify-center gap-3" aria-hidden="true">
    <div className="flex items-center justify-between text-[12px]">
      <span className="h-muted">Status</span>
      <span className="inline-flex items-center gap-1.5 h-ink font-medium"><span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--h-profit)' }}></span>Funded</span>
    </div>
    <div className="flex items-center justify-between text-[12px]">
      <span className="h-muted">Profit split</span>
      <span className="h-num h-ink font-semibold">90%</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--h-line)' }}>
      <div className="h-full rounded-full" style={{ width: '90%', background: 'var(--h-ink)' }}></div>
    </div>
  </div>
);

const PayoutVisual = () => (
  <div className="absolute inset-0 p-4 flex flex-col justify-center gap-2" aria-hidden="true">
    {[['Crypto', 'On-chain'], ['Bank wire', 'Institutional']].map(([a, b], i) => (
      <div key={a} className="flex items-center justify-between rounded-lg border px-3 h-10 text-[12.5px]" style={{ borderColor: 'var(--h-line-2)', background: 'var(--h-card)' }}>
        <span className="h-ink font-medium">{a}</span>
        <span className="h-muted inline-flex items-center gap-1.5">{b}{i === 0 && <Check className="w-3.5 h-3.5" />}</span>
      </div>
    ))}
  </div>
);

const STEPS = [
  { num: '01', title: 'Select Your Capital Size', desc: 'Choose an account ranging from $1,000 to $200,000 with 1-Step, 2-Step, or Instant allocation tailored to your risk management profile.', tag: 'Tier selection', V: SizesVisual },
  { num: '02', title: 'Navigate The Captrix Corridor', desc: 'Execute your strategy within defined risk boundaries. Keep daily drawdowns and max overall drawdowns disciplined while meeting the profit objective.', tag: 'Disciplined execution', V: CorridorVisual },
  { num: '03', title: 'Receive Verified Allocation', desc: 'Once you pass the evaluation threshold, unlock your live funded account credentials with zero capital risk to your personal funds.', tag: 'Profit split up to 90%', V: FundedVisual },
  { num: '04', title: 'Bi-Weekly Payout Distribution', desc: 'Request on-chain crypto or institutional bank wire payouts with transparent transaction timelines and verified smart accounting.', tag: 'Reliable payouts', V: PayoutVisual },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="h-section h-section--alt" aria-labelledby="how-title">
    <div className="h-container">
      <div className="max-w-2xl">
        <span className="h-eyebrow">How it works</span>
        <h2 id="how-title" className="h-h2 mt-4">How Captrix Works</h2>
        <p className="h-lead mt-4">A seamless four-step institutional path designed to discover, fund, and scale consistently profitable market operators.</p>
      </div>
      <ol className="mt-12 grid grid-cols-1 md:grid-cols-2 min-[1100px]:grid-cols-4 gap-4">
        {STEPS.map(({ num, title, desc, tag, V }) => (
          <li key={num} className="h-card p-4 flex flex-col">
            <div className="h-step-visual"><V /></div>
            <div className="px-1 pt-5 pb-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="h-num text-[12px] h-muted">Step {num}</span>
                <span className="text-[11.5px] font-medium h-muted">{tag}</span>
              </div>
              <h3 className="h-h3 text-[17px] mt-2">{title}</h3>
              <p className="text-[14px] leading-relaxed mt-2 h-body">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;
