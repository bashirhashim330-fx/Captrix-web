// 4. SPIN & WIN — SVG wheel with visible prize board (prototype only:
// in production the outcome MUST be decided server-side)
// ==========================================
export const SPIN_COST = 100;
export const SPIN_SEGMENTS = [
  { label: '$25K', sub: 'ACCOUNT', prize: true },
  { label: 'TRY AGAIN', prize: false },
  { label: '$1K', sub: 'ACCOUNT', prize: true },
  { label: 'TRY AGAIN', prize: false },
  { label: '$5K', sub: 'ACCOUNT', prize: true },
  { label: 'TRY AGAIN', prize: false },
  { label: '$10K', sub: 'ACCOUNT', prize: true },
  { label: 'TRY AGAIN', prize: false },
];

// ---- Spin & Win feeds (prototype sample data — never real winnings) ----
const MIN = 60 * 1000;
const loadedAt = Date.now();

// Seeded rows for "My Recently Won Accounts" so the module isn't empty on first load.
// Same shape the engine appends after a winning spin.
export const MY_WINS_SEED = [
  { id: 'seed-1', label: '$5K', prize: true, you: true, account: 'CAP-418273', at: loadedAt - 2 * 24 * 60 * MIN - 42 * MIN, status: 'ACTIVE' },
  { id: 'seed-2', label: '$1K', prize: true, you: true, account: 'CAP-290514', at: loadedAt - 5 * 60 * MIN - 9 * MIN, status: 'PENDING' },
];

// Static community feed (invented sample names, display-only — does not touch credits).
export const COMMUNITY_WINS = [
  { id: 'c1', name: 'Amara O.', label: '$10K', account: 'CAP-731902', at: loadedAt - 6 * MIN },
  { id: 'c2', name: 'Daniel K.', label: '$1K', account: 'CAP-552087', at: loadedAt - 19 * MIN },
  { id: 'c3', name: 'Sofia R.', label: '$25K', account: 'CAP-904416', at: loadedAt - 47 * MIN },
  { id: 'c4', name: 'Kwame A.', label: '$5K', account: 'CAP-118365', at: loadedAt - 1.6 * 60 * MIN },
  { id: 'c5', name: 'Lena M.', label: '$1K', account: 'CAP-670239', at: loadedAt - 2.9 * 60 * MIN },
  { id: 'c6', name: 'Ravi P.', label: '$5K', account: 'CAP-348871', at: loadedAt - 4.4 * 60 * MIN },
  { id: 'c7', name: 'Chloe T.', label: '$10K', account: 'CAP-205648', at: loadedAt - 7.1 * 60 * MIN },
  { id: 'c8', name: 'Mateo G.', label: '$1K', account: 'CAP-863120', at: loadedAt - 11.5 * 60 * MIN },
];

export const newAccountId = () => `CAP-${String(Math.floor(100000 + Math.random() * 900000))}`;
