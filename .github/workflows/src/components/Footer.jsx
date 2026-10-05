import CaptrixLogo from './CaptrixLogo.jsx';
import { Wordmark } from '../home/HomeHeader.jsx';

const COLS = [
  { h: 'Program Models', links: [['#marketplace', '1-Step Fast Track'], ['#marketplace', '2-Step Institutional'], ['#marketplace', 'Instant Funded ($200K)'], ['#compare-tiers', 'Pricing Comparison']] },
  { h: 'Ecosystem', links: [['#how-it-works', 'Evaluation Rules'], ['#faq', 'FAQ Knowledge Base'], ['login', 'Trader Dashboard']] },
  { h: 'Compliance', links: [['#terms', 'Terms of Service'], ['#privacy', 'Privacy Policy'], ['#refund', 'Refund Policy'], ['#risk', 'Risk Disclaimer']] },
];

const Footer = ({ onOpenAuth }) => (
  <footer className="h-footer border-t h-hairline pt-16 pb-10" style={{ background: 'var(--h-bg-alt)' }}>
    <div className="h-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1024px]:grid-cols-12 gap-10 pb-12 border-b h-hairline">
        <div className="sm:col-span-2 min-[1024px]:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <CaptrixLogo className="w-9 h-9" />
            <Wordmark className="text-[17px]" />
          </div>
          <p className="text-[14.5px] leading-relaxed h-body max-w-sm">
            Trade Bold. Get Funded. The modern prop trading firm engineered with transparent corridors, algorithmic risk safeguards, and up to 90% profit payouts.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="h-pill !h-7 !text-[12px]">7 Evaluation Tiers</span>
            <span className="h-pill !h-7 !text-[12px] h-num">$1K → $200K</span>
          </div>
        </div>
        {COLS.map((c, i) => (
          <div key={c.h} className={`min-[1024px]:col-span-2 ${i === 0 ? 'min-[1024px]:col-start-7' : ''}`}>
            <h3 className="text-[13px] font-semibold h-ink">{c.h}</h3>
            <ul className="mt-4 space-y-3 text-[14px]">
              {c.links.map(([href, label]) => (
                <li key={label}>
                  {href === 'login'
                    ? <button type="button" onClick={() => onOpenAuth('login')} className="h-flink text-left">{label}</button>
                    : <a href={href}>{label}</a>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 text-[12.5px] leading-relaxed h-muted space-y-6">
        <p className="max-w-5xl">
          DISCLAIMER: All accounts provided by Captrix Funded are simulated evaluations operating in demo environments with fictitious capital. Hypothetical or simulated performance results have certain limitations. No actual real-money trading is performed directly by clients during evaluation stages unless specifically allocated under partner broker agreements [Captrix to supply partner entity details].
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>© 2026 CAPTRIX FUNDED. All rights reserved.</span>
          <span>Designed to institutional UI/UX standards.</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
