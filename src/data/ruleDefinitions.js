// Plain-language rule summaries used by the inline <RuleInfo/> popovers.
// TO CONFIRM with Captrix: exact wording must come from the official rules.
export const RULE_DEFINITIONS = {
  profitTarget: {
    title: 'Profit target',
    text: 'The profit you need to reach, measured from your starting balance, to pass this evaluation phase.',
  },
  dailyDrawdown: {
    title: 'Daily drawdown',
    text: 'The most your account may lose within a single trading day before the daily limit is breached; it resets at the daily server reset.',
  },
  maxDrawdown: {
    title: 'Max drawdown',
    text: 'The overall loss limit for the account — if equity reaches this floor at any point, the account is breached.',
  },
  profitSplit: {
    title: 'Profit split',
    text: 'The share of profits from a funded account that is paid out to you as the trader.',
  },
};
