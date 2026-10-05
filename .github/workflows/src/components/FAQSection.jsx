import { useState } from 'react';
import { Plus } from '../home/icons.jsx';

const FAQS = [
  { q: 'What is The Captrix Corridor and how does it safeguard my capital?', a: 'The Captrix Corridor is our proprietary visual risk governance framework. It defines the exact trading space between your starting balance, required profit target, and drawdown floor. This guarantees clear boundaries without hidden stop-out triggers.' },
  { q: 'What are the rules regarding daily drawdown and max drawdown?', a: 'Daily drawdown resets at 00:00 UTC based on starting daily balance or equity (whichever is higher). Max overall drawdown is fixed or trailing according to your selected tier (e.g., $10,000 max drawdown on the $100K 2-Step challenge).' },
  { q: 'How does the Spin & Win feature work?', a: 'Spin & Win is available inside your dashboard. Spend 100 CAPTRIX Credits per spin for a chance at trading rewards, discounts and funded-account prizes. Credits come from platform activity, referrals and community tasks.' },
  { q: 'When can I request my first profit payout?', a: 'Payout schedules and withdrawal eligibility thresholds depend on the evaluation model selected [Captrix to supply specific schedule]. First payouts are accessible directly from your Trader Payout Center.' },
  { q: 'Is news trading and overnight weekend holding allowed?', a: 'Yes, swing holding and major economic event execution are permitted across all standard accounts unless specifically designated by tier parameters [Captrix to supply exact specifications].' },
];

const FAQSection = ({ onLogin }) => {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="h-section" aria-labelledby="faq-title">
      <div className="h-container grid grid-cols-1 min-[960px]:grid-cols-12 gap-10 min-[960px]:gap-16">
        <div className="min-[960px]:col-span-4">
          <span className="h-eyebrow">FAQ</span>
          <h2 id="faq-title" className="h-h2 mt-4">Frequently Answered Questions</h2>
          <p className="h-body text-[15px] leading-relaxed mt-4 max-w-sm">
            Can’t find what you need? Existing traders can open a ticket from the Support Desk after{' '}
            <button type="button" onClick={onLogin} className="h-link">logging in</button>.
          </p>
        </div>
        <div className="min-[960px]:col-span-8 border-t h-hairline">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={f.q} className={`h-faq__item ${open ? 'is-open' : ''}`}>
                <h3>
                  <button type="button" id={`faq-q-${i}`} aria-expanded={open} aria-controls={`faq-a-${i}`} onClick={() => setOpenIdx(open ? -1 : i)} className="h-faq__q">
                    <span>{f.q}</span>
                    <span className="h-faq__icon" aria-hidden="true"><Plus className="w-3.5 h-3.5" /></span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="h-faq__a" aria-hidden={!open}>
                  <div>
                    <p className="h-body text-[15px] leading-relaxed pb-6 pr-12 max-w-3xl">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
