export const usd = (n, digits = 0) =>
  `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const signedUsd = (n, digits = 2) => `${n >= 0 ? '+' : '-'}${usd(n, digits)}`;

export const pct = (n, digits = 1) => `${n.toFixed(digits)}%`;

/** "3 Oct 2026, 06:12" */
export const formatStamp = (ts) => {
  const d = new Date(ts);
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${date}, ${time}`;
};
