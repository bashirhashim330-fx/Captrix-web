import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import CaptrixCorridor from './CaptrixCorridor.jsx';
import SpinAndWinEngine from './SpinAndWinEngine.jsx';
import CaptrixLogo from './CaptrixLogo.jsx';
import { CHALLENGE_DATA } from '../data/challenges.js';
import { ACCOUNTS, ORDERS, NAV_SECTIONS, SUPPORT_TICKETS, TRADER } from '../data/dashboard.js';
import BottomTabBar from './shell/BottomTabBar.jsx';
import MoreSheet from './shell/MoreSheet.jsx';
import NotificationsPopover from './shell/NotificationsPopover.jsx';
import SearchPalette from './shell/SearchPalette.jsx';
import SupportFab from './shell/SupportFab.jsx';
import UserCard from './shell/UserCard.jsx';
import AccountPicker from './shell/AccountPicker.jsx';
import { OverviewSkeleton } from './shell/Skeleton.jsx';
import { prefersReducedMotion, useScrolled } from '../lib/motion.js';
import { useToast } from './Toast.jsx';
import { usd, signedUsd } from '../lib/format.js';
import ActiveAccountModule from './ActiveAccountModule.jsx';
import RiskAtAGlance from './RiskAtAGlance.jsx';
import KpiTile from './KpiTile.jsx';
import EquityChart from './EquityChart.jsx';
import { playFinAudio } from '../lib/audio.js';

const TraderDashboardApp = ({
  initialView = 'overview',
  userCredits,
  onCreditChange,
  onAddNotification,
  onReturnToPublic,
  onOpenNewChallenge,
  notifications,
  onMarkNotificationsRead,
  onMarkNotificationRead,
  onSignOut
}) => {
  const [currentNav, setCurrentNav] = useState(initialView);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const bellRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Every navigation path (sidebar, tab bar, More sheet, search, FAB) goes through here.
  const navigate = (id) => {
    playFinAudio('tick');
    setCurrentNav(id);
    setNotifOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Brief first-load skeleton (mirrors the real layout; ~0.2s under reduced motion).
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), prefersReducedMotion() ? 200 : 650);
    return () => clearTimeout(t);
  }, []);

  // Ctrl/⌘ K or "/" opens search.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
      if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const [selectedAccount, setSelectedAccount] = useState('CTX-100K-84920');
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('captrix-theme');
      const mode = ['dark', 'light', 'system'].includes(saved) ? saved : 'dark';
      const effective = mode === 'system'
        ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : mode;
      // Apply immediately during initialization so the dashboard never
      // renders one frame in the wrong theme before useEffect runs.
      document.documentElement.dataset.theme = effective;
      return mode;
    } catch {
      document.documentElement.dataset.theme = 'dark';
      return 'dark';
    }
  });
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const applyTheme = () => {
      let effective = themeMode;
      if (themeMode === 'system') {
        effective = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.dataset.theme = effective;
      try { localStorage.setItem('captrix-theme', themeMode); } catch {}
    };

    applyTheme();

    if (themeMode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: light)');
      const handler = () => applyTheme();
      media.addEventListener?.('change', handler);
      return () => media.removeEventListener?.('change', handler);
    }
  }, [themeMode]);

  useEffect(() => {
    const handleOutsideThemeMenu = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideThemeMenu);
    return () => document.removeEventListener('pointerdown', handleOutsideThemeMenu);
  }, []);

  const { push: toast } = useToast();
  const topbarScrolled = useScrolled(4);

  // Sample Accounts Data (moved to src/data/dashboard.js, unchanged)
  const accountsList = ACCOUNTS;
  const currentAcc = accountsList.find(a => a.id === selectedAccount) || accountsList[0];
  // The Corridor / risk widgets now follow the selected account's tier
  // (previously always hard-wired to the $100K tier).
  const accChallenge = CHALLENGE_DATA.find(c => c.id === currentAcc.challengeId) || CHALLENGE_DATA[5];

  // Simulated Trade History Table
  const [orders, setOrders] = useState(ORDERS);
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [composeOpen, setComposeOpen] = useState(false);
  const [ticketDraft, setTicketDraft] = useState({ subject: '', message: '' });

  // Navigation Structure
  const navSections = NAV_SECTIONS;

  const copyReferral = async () => {
    const link = 'https://captrixfunded.com/ref/trader8492';
    playFinAudio('tick');
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: 'Referral link copied', desc: link });
    } catch {
      toast({ tone: 'warn', title: 'Couldn\'t access the clipboard', desc: 'Select the link field and copy it manually.' });
    }
  };

  const submitTicket = (e) => {
    e.preventDefault();
    if (!ticketDraft.subject.trim()) return;
    const id = `#TK-${4411 + tickets.length}`;
    setTickets(list => [{ id, subject: ticketDraft.subject.trim(), status: 'OPEN' }, ...list]);
    setTicketDraft({ subject: '', message: '' });
    setComposeOpen(false);
    toast({ title: `Ticket ${id} submitted`, desc: 'Prototype — no message was sent to Captrix support.' });
  };

  return (
    <div className="min-h-screen bg-bg flex text-slate-200">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 cx-t1 border-0 border-r select-none shrink-0 h-screen sticky top-0 overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <button onClick={onReturnToPublic} className="flex items-center gap-3 text-left min-w-0">
            <CaptrixLogo className="w-9 h-9" />
            <span className="min-w-0">
              <span className="block font-sora font-extrabold text-base text-white tracking-wider whitespace-nowrap">
                CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span>
              </span>
              <span className="mt-1 inline-block px-1.5 py-px rounded text-[9px] font-mono tracking-widest bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                PORTAL
              </span>
            </span>
          </button>
        </div>

        {/* Persistent CTA: + New Challenge */}
        <div className="p-4">
          <button
            onClick={onOpenNewChallenge}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-cyan-sm hover:brightness-110 transition-all"
          >
            <span>+ NEW CHALLENGE</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-6">
          {navSections.map(sec => (
            <div key={sec.heading}>
              <div className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5">
                {sec.heading}
              </div>
              <div className="space-y-1">
                {sec.items.map(item => {
                  const isActive = currentNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                        isActive
                          ? 'bg-surface-elevated text-brand-cyan border border-brand-cyan/30 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-surface-elevated/50'
                      }`}
                    >
                      <Icon name={item.icon} className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Signed-in trader + sign out */}
        <div className="p-3 border-t border-surface-border">
          <UserCard trader={TRADER} onSignOut={onSignOut} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR — compact on mobile: logo mark · account pill · New Challenge · credits · search · bell */}
        <header className={`dashboard-topbar cx-header ${topbarScrolled ? 'is-scrolled' : ''} h-16 px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-30`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button type="button" onClick={() => navigate('overview')} aria-label="Captrix Funded — Overview" className="lg:hidden shrink-0 rounded-full">
              <CaptrixLogo className="w-8 h-8" />
            </button>

            {/* Premium account switcher — custom popup replaces browser-native select UI. */}
            <div className="min-w-0 flex-1 max-w-[min(78vw,520px)]">
              <AccountPicker accounts={accountsList} value={selectedAccount} onChange={setSelectedAccount} />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button type="button" onClick={onOpenNewChallenge} aria-label="New challenge" title="New challenge" className="cx-iconbtn cx-iconbtn--accent inline-flex lg:hidden">
              <Icon name="cart" className="w-[18px] h-[18px]" />
            </button>

            {/* Search — icon on mobile, pill with shortcut on desktop */}
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search the dashboard" className="cx-iconbtn hidden min-[420px]:inline-flex lg:hidden">
              <Icon name="search" className="w-[18px] h-[18px]" />
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className="cx-pill hidden lg:inline-flex text-slate-400 hover:text-white">
              <Icon name="search" className="w-3.5 h-3.5" /><span>Search</span>
              <kbd className="ml-2 text-[10px] text-slate-500 border border-surface-border rounded px-1">Ctrl K</kbd>
            </button>

            {/* Return to Public Marketing Site (in the More sheet on mobile) */}
            <button
              onClick={onReturnToPublic}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-xs font-mono text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all"
            >
              <span>Public Portal</span>
              <Icon name="arrowUpRight" className="w-3.5 h-3.5" />
            </button>

            {/* Credits Badge */}
            <button type="button" onClick={() => navigate('spin')} aria-label={`${userCredits} credits — open Spin & Win`} className="cx-pill cx-pill--cyan inline-flex px-2.5 sm:px-3">
              <Icon name="spin" className="w-3.5 h-3.5" />
              <span>{userCredits}<span className="hidden sm:inline"> Credits</span></span>
            </button>

            {/* Theme selector — explicit Dark / Light / System choices */}
            <div className="relative hidden lg:block" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setThemeMenuOpen(prev => !prev)}
                title={`Theme: ${themeMode}`}
                aria-label={`Theme: ${themeMode}. Open theme selector.`}
                aria-haspopup="menu"
                aria-expanded={themeMenuOpen}
                className="dashboard-theme-toggle flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-elevated border border-surface-border text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all"
              >
                <Icon name={themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sun' : 'monitor'} className="w-4 h-4" />
                <span className="hidden xl:inline text-[10px] font-mono uppercase tracking-wider">{themeMode}</span>
              </button>

              {themeMenuOpen && (
                <div
                  role="menu"
                  aria-label="Choose theme"
                  className="theme-selector-menu cx-t3 cx-t3--sm cx-pop absolute right-0 top-full mt-2 w-48 rounded-xl p-1.5 z-50"
                >
                  {[
                    { id: 'dark', label: 'Dark', icon: 'moon', hint: 'Obsidian interface' },
                    { id: 'light', label: 'Light', icon: 'sun', hint: 'Bright interface' },
                    { id: 'system', label: 'System', icon: 'monitor', hint: 'Use device setting' }
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={themeMode === option.id}
                      onClick={() => {
                        setThemeMode(option.id);
                        setThemeMenuOpen(false);
                      }}
                      className={`theme-selector-option w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        themeMode === option.id
                          ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25'
                          : 'text-slate-300 hover:bg-surface-elevated hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="shrink-0">
                        <Icon name={option.icon} className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">{option.label}</span>
                        <span className="block text-[9px] font-mono text-slate-500 mt-0.5">{option.hint}</span>
                      </span>
                      {themeMode === option.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="sm:relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(v => !v)}
                aria-haspopup="dialog"
                aria-expanded={notifOpen}
                aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                className="cx-iconbtn inline-flex relative"
              >
                <Icon name="bell" className="w-[18px] h-[18px]" />
                {unreadCount > 0 && <span className="cx-badge" aria-hidden="true">{unreadCount}</span>}
              </button>
              <NotificationsPopover
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                notifications={notifications}
                onMarkAll={onMarkNotificationsRead}
                onMarkOne={onMarkNotificationRead}
                anchorRef={bellRef}
              />
            </div>
          </div>
        </header>

        {/* DYNAMIC DASHBOARD VIEW CONTAINER */}
        <main className="cx-main flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* VIEW 1: OVERVIEW */}
          {currentNav === 'overview' && booting && <OverviewSkeleton />}
          {currentNav === 'overview' && !booting && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Welcome header */}
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <h1 className="font-sora text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back, {TRADER.firstName}</h1>
                  <p className="text-sm text-slate-400 mt-1">Your trading hub at a glance.</p>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{currentAcc.id} · {currentAcc.status}</span>
              </div>

              {/* PRIMARY: active account module + risk at a glance */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                <ActiveAccountModule account={currentAcc} challenge={accChallenge} className="xl:col-span-8" />
                <RiskAtAGlance account={currentAcc} challenge={accChallenge} className="xl:col-span-4" />
              </div>

              {/* SECONDARY: compact Tier-1 KPI row, each with its own trend + number */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiTile
                  label="Total Profit"
                  value={signedUsd(currentAcc.equity - currentAcc.size)}
                  valueClass={currentAcc.equity >= currentAcc.size ? 'text-fin-profit' : 'text-fin-loss'}
                  delta={`${(((currentAcc.equity - currentAcc.size) / currentAcc.size) * 100).toFixed(2)}%`}
                  sub="vs starting balance"
                  spark={currentAcc.sample.spark.profit}
                />
                <KpiTile
                  label="Available Balance"
                  value={usd(currentAcc.balance, 2)}
                  delta={signedUsd(currentAcc.balance - currentAcc.size, 0)}
                  sub="closed-trade balance"
                  spark={currentAcc.sample.spark.balance}
                />
                <KpiTile
                  label="Today's P/L"
                  value={signedUsd(currentAcc.sample.todayPL)}
                  valueClass={currentAcc.sample.todayPL >= 0 ? 'text-fin-profit' : 'text-fin-loss'}
                  delta={`${((currentAcc.sample.todayPL / (currentAcc.equity - currentAcc.sample.todayPL)) * 100).toFixed(2)}%`}
                  deltaTone={currentAcc.sample.todayPL >= 0 ? 'up' : 'down'}
                  sub={`${Math.round((currentAcc.ddDaily / accChallenge.dailyDrawdown) * 100)}% of daily limit used`}
                  spark={currentAcc.sample.spark.today}
                />
                <KpiTile
                  label="Win Rate"
                  value={`${currentAcc.sample.winRate}%`}
                  valueClass="text-brand-cyan"
                  delta={`${(currentAcc.sample.spark.winRate.at(-1) - currentAcc.sample.spark.winRate.at(-2)).toFixed(1)} pts`}
                  deltaTone={currentAcc.sample.spark.winRate.at(-1) >= currentAcc.sample.spark.winRate.at(-2) ? 'up' : 'down'}
                  sub={`${currentAcc.sample.wins} wins / ${currentAcc.sample.losses} losses`}
                  spark={currentAcc.sample.spark.winRate}
                />
              </div>

              {/* Corridor Risk Engine on Overview (secondary placement → quiet) */}
              <CaptrixCorridor challenge={accChallenge} interactive={false} tier="quiet" />

              {/* Interactive Performance Trajectory Chart (upgraded in place) */}
              <EquityChart account={currentAcc} challenge={accChallenge} />

              {/* Recent Activity Table */}
              <div className="cx-t2 cx-t2--quiet rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-sora text-sm font-bold text-white uppercase font-mono">Recent Executions</h4>
                  <button onClick={() => setCurrentNav('orders')} className="text-xs font-mono text-brand-cyan hover:underline">
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table — scrolls sideways">
                  <table className="w-full text-xs font-mono text-left">
                    <thead>
                      <tr className="border-b border-surface-border text-slate-400">
                        <th className="py-2.5 px-3">TICKET</th>
                        <th className="py-2.5 px-3">INSTRUMENT</th>
                        <th className="py-2.5 px-3">SIDE</th>
                        <th className="py-2.5 px-3">SIZE</th>
                        <th className="py-2.5 px-3">PROFIT/LOSS</th>
                        <th className="py-2.5 px-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50">
                      {orders.slice(0, 3).map(o => (
                        <tr key={o.id} className="hover:bg-surface-elevated/40">
                          <td className="py-2.5 px-3 text-slate-300">{o.id}</td>
                          <td className="py-2.5 px-3 text-white font-bold">{o.symbol}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${o.side === 'BUY' ? 'bg-fin-profit/10 text-fin-profit' : 'bg-fin-loss/10 text-fin-loss'}`}>
                              {o.side}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{o.size} lots</td>
                          <td className={`py-2.5 px-3 font-bold ${o.pl.startsWith('+') ? 'text-fin-profit' : 'text-fin-loss'}`}>
                            {o.pl}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: CHALLENGES */}
          {currentNav === 'challenges' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sora text-2xl font-bold text-white">Active Evaluations</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Real-time status across your funded pipeline</p>
                </div>
                <button onClick={onOpenNewChallenge} className="px-4 py-2 rounded-xl bg-brand-cyan text-bg font-mono font-bold text-xs uppercase">
                  + Add New Challenge
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accountsList.map(acc => (
                  <div key={acc.id} className={`${acc.id === selectedAccount ? 'cx-t2 cx-t2--primary cx-lambo' : 'cx-t2 cx-t2--quiet'} rounded-2xl p-6 relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-brand-cyan">{acc.type}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-fin-profit/10 text-fin-profit border border-fin-profit/30">
                        {acc.status}
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between py-1 border-b border-surface-border/50">
                        <span className="text-slate-400">Account ID</span>
                        <span className="text-white font-bold">{acc.id}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-surface-border/50">
                        <span className="text-slate-400">Current Balance</span>
                        <span className="text-white font-bold">${acc.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-surface-border/50">
                        <span className="text-slate-400">Milestone Progress</span>
                        <span className="text-brand-cyan font-bold">${acc.targetCurrent} / ${acc.target}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Daily Drawdown Status</span>
                        <span className="text-fin-profit font-bold">Compliant (${acc.ddDaily} used)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-surface-border">
                      <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
                        <div className="h-full cx-grad-fill rounded-full" style={{ width: `${(acc.targetCurrent / acc.target) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                        <span>Phase 1 Progress</span>
                        <span>{((acc.targetCurrent / acc.target) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: TRADING DESK */}
          {currentNav === 'terminal' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="cx-t2 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-sora font-bold text-white">EUR / USD</span>
                    <span className="font-mono text-xs text-fin-profit">1.08642 +0.24%</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">DEMO BROKER FEED // SIMULATED PASS-THROUGH</span>
                </div>

                {/* Technical Mock Trading Station */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 h-80 bg-surface-subtle rounded-xl p-4 border border-surface-border flex items-center justify-center relative">
                    <span className="text-xs font-mono text-slate-500">REAL-TIME INSTITUTIONAL CANDLESTICK TERMINAL</span>
                    {/* Static visual candles */}
                    <div className="absolute inset-4 flex items-end justify-between opacity-30 pointer-events-none">
                      {[40, 60, 55, 75, 80, 70, 90, 85, 110, 100, 130, 140, 120, 160].map((h, i) => (
                        <div key={i} className="w-3 bg-brand-cyan" style={{ height: `${h}px` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Order Execution Ticket */}
                  <div className="lg:col-span-4 bg-surface-subtle p-4 rounded-xl border border-surface-border space-y-4">
                    <h4 className="font-mono text-xs uppercase text-slate-400">Rapid Order Ticket</h4>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Volume (Lots)</label>
                      <input type="text" defaultValue="5.00" className="w-full bg-surface border border-surface-border rounded px-3 py-2 text-xs font-mono text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-3 rounded bg-fin-loss text-white font-mono font-bold text-xs uppercase">
                        SELL @ 1.08640
                      </button>
                      <button className="py-3 rounded bg-fin-profit text-bg font-mono font-bold text-xs uppercase">
                        BUY @ 1.08644
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 text-center">
                      Simulated frontend interface for testing order latency & risk limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: ACCOUNTS */}
          {currentNav === 'accounts' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Account Architecture</h3>
              <div>
                <div className="text-xs font-mono text-slate-400">PRIMARY ALLOCATION</div>
                <div className="font-sora text-xl sm:text-2xl font-bold text-white mt-1 break-words">{currentAcc.id} — {currentAcc.type}</div>
              </div>
              <CaptrixCorridor challenge={accChallenge} interactive={false} tier="primary" lambo />
            </div>
          )}

          {/* VIEW 5: ANALYTICS */}
          {currentNav === 'analytics' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Deep Trading Analytics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="cx-t1 p-5 rounded-xl border">
                  <span className="text-xs font-mono text-slate-400 block">Win Rate</span>
                  <span className="font-sora text-3xl font-bold text-fin-profit mt-1 block">68.4%</span>
                  <span className="text-[10px] font-mono text-slate-500">26 Wins / 12 Losses</span>
                </div>
                <div className="cx-t1 p-5 rounded-xl border">
                  <span className="text-xs font-mono text-slate-400 block">Profit Factor</span>
                  <span className="font-sora text-3xl font-bold text-brand-cyan mt-1 block">2.42</span>
                  <span className="text-[10px] font-mono text-slate-500">Gross Win vs Gross Loss</span>
                </div>
                <div className="cx-t1 p-5 rounded-xl border">
                  <span className="text-xs font-mono text-slate-400 block">Average Win / Loss</span>
                  <span className="font-sora text-3xl font-bold text-white mt-1 block">1.85:1</span>
                  <span className="text-[10px] font-mono text-slate-500">Favorable expectancy</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: PAYOUTS */}
          {currentNav === 'payouts' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sora text-2xl font-bold text-white">Trader Payout Center</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">On-chain crypto and bank transfer settlement</p>
                </div>
                <button 
                  onClick={() => toast({ tone: 'info', title: 'Payout request simulated', desc: 'Prototype only — no funds move. [Captrix to supply live integration]' })}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase shadow-cyan-sm"
                >
                  Request Payout ($6,450.00)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="cx-t1 p-5 rounded-xl border">
                  <span className="text-xs font-mono text-slate-400">Available For Withdrawal</span>
                  <span className="font-sora text-2xl font-bold text-fin-profit mt-1 block">$6,450.00</span>
                  <span className="text-[10px] font-mono text-slate-500">80% profit share unlocked</span>
                </div>
                <div className="cx-t1 p-5 rounded-xl border">
                  <span className="text-xs font-mono text-slate-400">Total Lifetime Payouts</span>
                  <span className="font-sora text-2xl font-bold text-white mt-1 block">$18,240.00</span>
                  <span className="text-[10px] font-mono text-slate-500">3 Successful batches</span>
                </div>
                <div className="cx-t1 p-5 rounded-xl border">
                  <span className="text-xs font-mono text-slate-400">Next Payout Window</span>
                  <span className="font-sora text-2xl font-bold text-brand-cyan mt-1 block">Every 14 Days</span>
                  <span className="text-[10px] font-mono text-slate-500">[Captrix to supply schedule]</span>
                </div>
              </div>

              <div className="cx-t2 cx-t2--quiet rounded-2xl p-6">
                <h4 className="font-mono text-xs uppercase text-slate-400 mb-4">Payout Transaction History</h4>
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table — scrolls sideways">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-surface-border text-slate-400 text-left">
                        <th className="py-2.5 px-3">BATCH ID</th>
                        <th className="py-2.5 px-3">AMOUNT</th>
                        <th className="py-2.5 px-3">DESTINATION</th>
                        <th className="py-2.5 px-3">TIMESTAMP</th>
                        <th className="py-2.5 px-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50">
                      <tr>
                        <td className="py-3 px-3 text-slate-300">CTX-PO-9021</td>
                        <td className="py-3 px-3 text-fin-profit font-bold">+$8,400.00</td>
                        <td className="py-3 px-3 text-slate-400">USDT (TRC20)</td>
                        <td className="py-3 px-3 text-slate-500">May 12, 2026</td>
                        <td className="py-3 px-3 text-fin-profit">COMPLETED</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 text-slate-300">CTX-PO-8419</td>
                        <td className="py-3 px-3 text-fin-profit font-bold">+$9,840.00</td>
                        <td className="py-3 px-3 text-slate-400">Bank Wire (SWIFT)</td>
                        <td className="py-3 px-3 text-slate-500">Apr 28, 2026</td>
                        <td className="py-3 px-3 text-fin-profit">COMPLETED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: ORDERS */}
          {currentNav === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sora text-2xl font-bold text-white">Full Trade Audit Log</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Immutable ledger of closed and active executions</p>
                </div>
              </div>

              <div className="cx-t2 cx-t2--quiet rounded-2xl overflow-hidden">
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table — scrolls sideways">
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="bg-surface-subtle text-slate-400 border-b border-surface-border">
                      <tr>
                        <th className="py-3 px-4">TICKET</th>
                        <th className="py-3 px-4">PAIR</th>
                        <th className="py-3 px-4">TYPE</th>
                        <th className="py-3 px-4">SIZE</th>
                        <th className="py-3 px-4">ENTRY</th>
                        <th className="py-3 px-4">EXIT</th>
                        <th className="py-3 px-4">NET P/L</th>
                        <th className="py-3 px-4">TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-surface-elevated/40">
                          <td className="py-3 px-4 text-slate-300">{o.id}</td>
                          <td className="py-3 px-4 text-white font-bold">{o.symbol}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${o.side === 'BUY' ? 'bg-fin-profit/10 text-fin-profit' : 'bg-fin-loss/10 text-fin-loss'}`}>
                              {o.side}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{o.size}</td>
                          <td className="py-3 px-4 text-slate-400">{o.entry}</td>
                          <td className="py-3 px-4 text-slate-400">{o.exit}</td>
                          <td className={`py-3 px-4 font-bold ${o.pl.startsWith('+') ? 'text-fin-profit' : 'text-fin-loss'}`}>
                            {o.pl}
                          </td>
                          <td className="py-3 px-4 text-slate-500">{o.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 8: CERTIFICATES */}
          {currentNav === 'certificates' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Trader Credentials & Certificates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cx-t2 cx-t2--primary cx-lambo rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-brand-cyan">PASS EVALUATION MILESTONE</span>
                    <Icon name="award" className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <div className="p-4 cx-inset rounded-xl text-center space-y-2">
                    <span className="text-[10px] font-mono text-slate-400">CERTIFICATE OF ALLOCATION</span>
                    <div className="font-sora text-lg font-bold text-white">CAPTRIX VERIFIED TRADER</div>
                    <div className="text-xs font-mono text-brand-cyan">$100,000 Institutional Tier</div>
                    <div className="text-[10px] font-mono text-slate-500">ID: CTX-CERT-8841-PASS</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => toast({ tone: 'info', title: 'Certificate download (prototype)', desc: 'SVG/PDF export to be supplied by Captrix.' })} className="flex-1 py-2 rounded-lg bg-brand-cyan text-bg font-mono font-bold text-xs uppercase">
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 9: AFFILIATE PORTAL */}
          {currentNav === 'affiliate' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Institutional Affiliate Program</h3>
              <div className="cx-t2 p-6 rounded-2xl space-y-4">
                <span className="text-xs font-mono text-slate-400 uppercase">Your Unique Referral Link</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    aria-label="Your referral link"
                    onFocus={(e) => e.target.select()}
                    value="https://captrixfunded.com/ref/trader8492" 
                    className="flex-1 bg-surface-subtle border border-surface-border rounded-xl px-4 py-3 font-mono text-xs text-brand-cyan focus:outline-none"
                  />
                  <button 
                    onClick={copyReferral}
                    className="px-6 py-3 rounded-xl bg-brand-cyan text-bg font-sora font-bold text-xs uppercase"
                  >
                    Copy Link
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border">
                  <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
                    <span className="text-xs font-mono text-slate-400">Total Referrals</span>
                    <span className="font-sora text-2xl font-bold text-white mt-1 block">42</span>
                  </div>
                  <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
                    <span className="text-xs font-mono text-slate-400">Earned Commissions</span>
                    <span className="font-sora text-2xl font-bold text-fin-profit mt-1 block">$3,420.00</span>
                  </div>
                  <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
                    <span className="text-xs font-mono text-slate-400">Tier Commission Rate</span>
                    <span className="font-sora text-2xl font-bold text-brand-cyan mt-1 block">[Captrix to supply]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 10: REWARDS HUB */}
          {currentNav === 'rewards' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sora text-2xl font-bold text-white">CAPTRIX Rewards Vault</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Earn credits with every executed lot and phase completion</p>
                </div>
                <div className="cx-t1 p-3 rounded-xl border !border-brand-cyan/40 text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block">YOUR VAULT BALANCE</span>
                  <span className="font-sora text-xl font-bold text-brand-cyan">{userCredits} Credits</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="cx-t2 cx-t2--quiet p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-brand-cyan">CLAIMABLE TOKEN</span>
                    <h4 className="font-sora text-lg font-bold text-white mt-1">Evaluation Retake Pass</h4>
                    <p className="text-xs text-slate-400 mt-2">Reset any failed stage without paying full registration fee.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (userCredits >= 150) {
                        onCreditChange(-150);
                        toast({ title: 'Evaluation Retake Token claimed', desc: '150 credits deducted (prototype).' });
                      } else {
                        toast({ tone: 'warn', title: 'Insufficient credits', desc: '150 credits are required to redeem this token.' });
                      }
                    }}
                    className="mt-6 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 hover:text-white"
                  >
                    Redeem (150 Credits)
                  </button>
                </div>

                <div className="cx-t2 cx-t2--quiet p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-fin-profit">ACTIVE PERK</span>
                    <h4 className="font-sora text-lg font-bold text-white mt-1">90% Profit Split Boost</h4>
                    <p className="text-xs text-slate-400 mt-2">Permanently elevate profit split from 80% to 90%.</p>
                  </div>
                  <button 
                    disabled
                    className="mt-6 py-2.5 rounded-xl bg-fin-profit/10 border border-fin-profit/30 text-xs font-mono text-fin-profit"
                  >
                    Active On Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 11: SPIN & WIN (IN-APP) */}
          {currentNav === 'spin' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <SpinAndWinEngine 
                userCredits={userCredits} 
                onCreditChange={onCreditChange} 
                addNotification={onAddNotification}
              />
            </div>
          )}

          {/* VIEW 12: PROFILE */}
          {currentNav === 'profile' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Trader Profile</h3>
              <div className="cx-t2 cx-t2--quiet p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Full Legal Name</label>
                    <input type="text" defaultValue="Alex Mercer" className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Email Address</label>
                    <input type="email" defaultValue="alex.mercer@trading.io" className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white" />
                  </div>
                </div>
                <button onClick={() => toast({ title: 'Profile saved', desc: 'Changes are kept for this session only (prototype).' })} className="py-2.5 px-6 rounded-xl bg-brand-cyan text-bg font-sora font-bold text-xs uppercase">
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* VIEW 13: KYC */}
          {currentNav === 'kyc' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Identity Verification (KYC)</h3>
              <div className="cx-t2 cx-t2--quiet p-6 rounded-2xl">
                <div className="flex items-center gap-3 text-fin-profit mb-4">
                  <Icon name="shield" className="w-6 h-6" />
                  <span className="font-sora font-bold text-base">Level 2 Verified (Institutional Clearance)</span>
                </div>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  Your identity and residency documents have been cryptographically verified for unrestricted automated payouts.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 14: SECURITY */}
          {currentNav === 'security' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h3 className="font-sora text-2xl font-bold text-white">Security & Access Management</h3>
              <div className="cx-t2 cx-t2--quiet p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-sora text-sm font-bold text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-400 mt-1">Hardware TOTP authenticator app protection</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-fin-profit/10 text-fin-profit border border-fin-profit/30 font-bold">
                    ENABLED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 15: SUPPORT TICKETS */}
          {currentNav === 'support' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-sora text-2xl font-bold text-white">Support & Resolution Desk</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Direct priority access to risk officers</p>
                </div>
                <button onClick={() => setComposeOpen(o => !o)} aria-expanded={composeOpen} aria-controls="cx-ticket-form" className="px-4 py-2 rounded-xl bg-brand-cyan text-bg font-mono font-bold text-xs uppercase">
                  {composeOpen ? 'Cancel' : '+ Open New Ticket'}
                </button>
              </div>

              {composeOpen && (
                <form id="cx-ticket-form" onSubmit={submitTicket} className="cx-t2 cx-pop rounded-2xl p-5 sm:p-6 space-y-4">
                  <div>
                    <label htmlFor="cx-ticket-subject" className="text-xs font-mono text-slate-400 block mb-1">Subject</label>
                    <input id="cx-ticket-subject" required autoFocus value={ticketDraft.subject} onChange={(e) => setTicketDraft(d => ({ ...d, subject: e.target.value }))} placeholder="e.g. Question about daily drawdown reset" className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-cyan" />
                  </div>
                  <div>
                    <label htmlFor="cx-ticket-message" className="text-xs font-mono text-slate-400 block mb-1">Message</label>
                    <textarea id="cx-ticket-message" rows={4} value={ticketDraft.message} onChange={(e) => setTicketDraft(d => ({ ...d, message: e.target.value }))} placeholder="Describe the issue and include your account ID." className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-cyan resize-y" />
                  </div>
                  <button type="submit" className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase">Submit Ticket</button>
                </form>
              )}

              <div className="cx-t2 cx-t2--quiet rounded-2xl px-6 py-3">
                <ul className="divide-y divide-surface-border">
                  {tickets.map(tk => (
                    <li key={tk.id} className="text-xs font-mono text-slate-400 py-3 flex justify-between gap-4">
                      <span className="min-w-0">{tk.id}: {tk.subject}</span>
                      <span className={`shrink-0 ${tk.status === 'RESOLVED' ? 'text-fin-profit' : tk.status === 'OPEN' ? 'text-fin-warning' : 'text-brand-cyan'}`}>{tk.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile shell: tab bar + More sheet; global search, support shortcut */}
      <BottomTabBar current={currentNav} onNavigate={navigate} onMore={() => setMoreOpen(true)} moreOpen={moreOpen} />
      <MoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        current={currentNav}
        onNavigate={navigate}
        themeMode={themeMode}
        onTheme={setThemeMode}
        onNewChallenge={onOpenNewChallenge}
        onPublic={onReturnToPublic}
        onSearch={() => setSearchOpen(true)}
        onSignOut={onSignOut}
        trader={TRADER}
      />
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
        actions={[
          { key: 'new', label: 'New Challenge', icon: 'plus', run: onOpenNewChallenge },
          { key: 'public', label: 'Public Portal', icon: 'arrowUpRight', run: onReturnToPublic },
        ]}
      />
      {currentNav !== 'support' && !moreOpen && <SupportFab onClick={() => { navigate('support'); setComposeOpen(true); }} />}
    </div>
  );
};

export default TraderDashboardApp;
