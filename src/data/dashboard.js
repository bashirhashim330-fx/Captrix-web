// Sample dashboard data (prototype only — no real accounts or trades).
// `id`…`ddMax` are carried over unchanged from the original build; `challengeId`
// links each account to its tier in CHALLENGE_DATA, and `sample` holds the
// demo-only figures used by the KPI sparklines and the risk widget.
export const ACCOUNTS = [
  {
    id: 'CTX-100K-84920', size: 100000, equity: 106450.0, balance: 105200.0, type: '2-Step ($100K)', status: 'Active Evaluation',
    target: 10000, targetCurrent: 6450, ddDaily: 1100, ddMax: 2400, challengeId: '2s-100k',
    sample: {
      todayPL: 1420, winRate: 68.4, wins: 26, losses: 12,
      spark: {
        profit: [0, 800, 600, 1500, 2100, 1900, 3200, 4100, 3800, 5200, 5900, 6450],
        balance: [0, 0, 1200, 1200, 2600, 2600, 2600, 3900, 3900, 4700, 5200, 5200],
        today: [0, -180, 120, 340, 260, 610, 880, 720, 1050, 1290, 1180, 1420],
        winRate: [58, 61, 60, 63, 64, 62, 65, 66, 67, 66, 68, 68.4],
      },
    },
  },
  {
    id: 'CTX-25K-11204', size: 25000, equity: 26150.8, balance: 26150.8, type: '2-Step ($25K)', status: 'Funded Live',
    target: 2500, targetCurrent: 2500, ddDaily: 250, ddMax: 600, challengeId: '2s-25k',
    sample: {
      todayPL: 312.4, winRate: 61.9, wins: 13, losses: 8,
      spark: {
        profit: [0, 210, 480, 390, 720, 650, 910, 1040, 980, 1120, 1090, 1150.8],
        balance: [0, 0, 300, 300, 610, 610, 880, 880, 1010, 1010, 1150.8, 1150.8],
        today: [0, -60, -140, -40, 90, 60, 180, 240, 210, 290, 330, 312.4],
        winRate: [66, 64, 65, 63, 62, 63, 61, 62, 60, 61, 62, 61.9],
      },
    },
  },
];

export const ORDERS = [
  { id: 'ORD-9841', symbol: 'EURUSD', side: 'BUY', size: '10.00', entry: '1.08420', exit: '1.08940', pl: '+5,200.00', time: '14:20:12 UTC', status: 'CLOSED' },
  { id: 'ORD-9839', symbol: 'NAS100', side: 'BUY', size: '5.00', entry: '18,120.00', exit: '18,240.50', pl: '+6,025.00', time: '11:05:44 UTC', status: 'CLOSED' },
  { id: 'ORD-9835', symbol: 'XAUUSD', side: 'SELL', size: '4.00', entry: '2,340.50', exit: '2,352.00', pl: '-4,600.00', time: 'Yesterday', status: 'CLOSED' },
  { id: 'ORD-9828', symbol: 'GBPUSD', side: 'BUY', size: '8.00', entry: '1.26100', exit: '1.26720', pl: '+4,960.00', time: 'Yesterday', status: 'CLOSED' },
  { id: 'ORD-9820', symbol: 'US30', side: 'SELL', size: '2.50', entry: '39,100.00', exit: '39,180.00', pl: '-2,000.00', time: '22 May', status: 'CLOSED' },
];

export const SUPPORT_TICKETS = [
  { id: '#TK-4410', subject: 'Drawdown reset verification after server maintenance', status: 'RESOLVED' },
  { id: '#TK-4389', subject: 'API access token generation for cTrader', status: 'IN PROGRESS' },
];

export const NAV_SECTIONS = [
  { heading: 'TRADING', items: [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'challenges', label: 'Challenges', icon: 'trophy' },
    { id: 'terminal', label: 'Trading Desk', icon: 'terminal' },
    { id: 'accounts', label: 'Accounts', icon: 'wallet' },
  ] },
  { heading: 'PERFORMANCE', items: [
    { id: 'analytics', label: 'Analytics', icon: 'chart' },
    { id: 'payouts', label: 'Payouts', icon: 'wallet' },
    { id: 'orders', label: 'Order Log', icon: 'terminal' },
    { id: 'certificates', label: 'Certificates', icon: 'award' },
  ] },
  { heading: 'COMMUNITY', items: [
    { id: 'affiliate', label: 'Affiliate Portal', icon: 'user' },
    { id: 'rewards', label: 'Rewards Hub', icon: 'award' },
    { id: 'spin', label: 'Spin & Win', icon: 'spin' },
  ] },
  { heading: 'ACCOUNT', items: [
    { id: 'profile', label: 'Trader Profile', icon: 'user' },
    { id: 'kyc', label: 'KYC Verification', icon: 'shield' },
    { id: 'security', label: 'Security & 2FA', icon: 'lock' },
  ] },
  { heading: 'SUPPORT', items: [
    { id: 'support', label: 'Support Desk', icon: 'headset' },
  ] },
];

// Signed-in trader shown in the user card / welcome header (sample — matches Trader Profile defaults).
export const TRADER = { name: 'Alex Mercer', firstName: 'Alex', email: 'alex.mercer@trading.io', initials: 'AM' };

// Mobile bottom tab bar (< 900px). Short labels map onto the existing nav views;
// every other view stays reachable from "More" (and the full list is repeated there).
export const TAB_BAR = [
  { id: 'overview', label: 'Home', icon: 'home' },
  { id: 'accounts', label: 'Accounts', icon: 'wallet' },
  { id: 'analytics', label: 'Stats', icon: 'chart' },
  { id: 'payouts', label: 'Payouts', icon: 'payout' },
];
