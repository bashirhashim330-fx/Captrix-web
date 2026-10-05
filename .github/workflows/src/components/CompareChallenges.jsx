import { CHALLENGE_DATA } from '../data/challenges.js';
import { usd } from '../lib/format.js';
import RuleInfo from './RuleInfo.jsx';

// "Compare all 7" — every tier at once, straight from CHALLENGE_DATA.
// Neutral table; only the selected row is tinted.
const CompareChallenges = ({ selectedId, onSelect }) => (
  <div className="h-card h-card--lg mt-8 overflow-hidden" aria-labelledby="compare-tiers-title">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 p-5 sm:p-6">
      <h3 id="compare-tiers-title" className="h-h3 text-lg sm:text-xl">All 7 tiers, side by side</h3>
      <p className="text-[12.5px] h-muted">Select a row to see its plan details.<span className="sm:hidden"> Scroll sideways for every column →</span></p>
    </div>
    <div className="overflow-x-auto border-t h-hairline" tabIndex={0} role="region" aria-label="Challenge comparison table, scrollable">
      <table className="h-table">
        <caption className="sr-only">Challenge tiers compared by fee, profit target, drawdown limits, profit split, trading days and leverage</caption>
        <thead>
          <tr>
            <th scope="col" className="h-sticky pl-5 sm:pl-6">Tier</th>
            <th scope="col">Model</th>
            <th scope="col">Fee</th>
            <th scope="col"><span className="inline-flex items-center gap-1.5">Profit target <RuleInfo rule="profitTarget" /></span></th>
            <th scope="col"><span className="inline-flex items-center gap-1.5">Daily DD <RuleInfo rule="dailyDrawdown" /></span></th>
            <th scope="col"><span className="inline-flex items-center gap-1.5">Max DD <RuleInfo rule="maxDrawdown" /></span></th>
            <th scope="col"><span className="inline-flex items-center gap-1.5">Split <RuleInfo rule="profitSplit" /></span></th>
            <th scope="col">Trading days</th>
            <th scope="col">Leverage</th>
            <th scope="col" className="pr-5 sm:pr-6"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {CHALLENGE_DATA.map((c) => {
            const sel = c.id === selectedId;
            return (
              <tr key={c.id} className={sel ? 'is-selected' : ''} aria-selected={sel}>
                <th scope="row" className="h-sticky pl-5 sm:pl-6 font-normal">
                  <span className="block h-num h-ink font-semibold">{c.label}</span>
                  <span className="block text-[12px] h-muted mt-0.5">{c.badge}</span>
                </th>
                <td className="h-body">{c.type}</td>
                <td className="h-num h-ink font-semibold">${c.price}</td>
                <td className="h-num h-ink">{usd(c.targetAmount)} <span className="h-muted">({c.targetPercent}%)</span></td>
                <td className="h-num h-ink">{usd(c.dailyDrawdown)}</td>
                <td className="h-num h-ink">{usd(c.maxDrawdown)}</td>
                <td className="h-num h-ink font-semibold">{c.profitSplit}%</td>
                <td className="h-body">{c.tradingDays}</td>
                <td className="h-num h-body">{c.leverage}</td>
                <td className="pr-5 sm:pr-6 text-right">
                  <button
                    type="button"
                    onClick={() => onSelect(c)}
                    aria-pressed={sel}
                    aria-label={`Select ${c.label} ${c.type}`}
                    className={`h-btn h-btn--sm !min-h-[36px] ${sel ? 'h-btn--primary' : 'h-btn--secondary'}`}
                  >
                    {sel ? 'Selected' : 'Select'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default CompareChallenges;
