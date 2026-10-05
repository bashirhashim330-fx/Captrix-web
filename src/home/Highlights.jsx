import { Check } from './icons.jsx';

// Quick facts band (all derived from existing copy / challenge data).
const FACTS = [
  'Up to 90% profit split',
  'No minimum trading days on 1-Step',
  'Bi-weekly payout distribution',
  'Crypto or bank wire payouts',
  'Spin & Win credits with every challenge',
];

const Highlights = () => (
  <section aria-label="Highlights" className="border-t h-hairline py-8 sm:py-10">
    <div className="h-container">
      <ul className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {FACTS.map(f => (
          <li key={f} className="h-fact"><Check />{f}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default Highlights;
