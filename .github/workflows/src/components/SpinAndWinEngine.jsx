import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { logoDark } from './CaptrixLogo.jsx';
import Icon from './Icon.jsx';
import { SPIN_COST, SPIN_SEGMENTS, MY_WINS_SEED, COMMUNITY_WINS, newAccountId } from '../data/spin.js';
import { playFinAudio } from '../lib/audio.js';
import { overlayRoot } from '../lib/motion.js';
import { formatStamp } from '../lib/format.js';

// Spin & Win — still lives only in the dashboard (Community → Spin & Win).
// Wheel, spin mechanics, reduced-motion handling and the gradient spin button are
// unchanged. Upgraded: Tier-2/3 glass calibration, prize board weight, and the
// single "Recent activity" list is now two modules (personal + community).
// Prototype only: in production the outcome MUST be decided server-side.

const FeedHeader = ({ title, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
    <h3 className="font-sora text-sm font-bold text-white">{title}</h3>
    <div className="flex items-center gap-1.5">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider border ${status === 'ACTIVE' ? 'text-fin-profit border-fin-profit/40 bg-fin-profit/10' : 'text-fin-warning border-fin-warning/40 bg-fin-warning/10'}`}>
    {status}
  </span>
);

const SpinAndWinEngine = ({ userCredits, onCreditChange, addNotification }) => {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  // Same `activity` state as before; entries now also carry account / time / status.
  const [activity, setActivity] = useState(MY_WINS_SEED);
  const pending = useRef(null);
  const timer = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const spinBtnRef = useRef(null);
  const wheelRef = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canSpin = !spinning && userCredits >= SPIN_COST;
  const N = SPIN_SEGMENTS.length, ARC = 360 / N, R = 172;
  const pt = (deg, r) => [(r * Math.sin(deg * Math.PI / 180)).toFixed(2), (-r * Math.cos(deg * Math.PI / 180)).toFixed(2)];

  const finish = useCallback(() => {
    const seg = pending.current;
    if (!seg) return;
    pending.current = null;
    clearTimeout(timer.current);
    setSpinning(false);
    setResult(seg);
    setActivity(a => [{
      id: Date.now(), what: seg.prize ? `${seg.label} ${seg.sub}` : seg.label, label: seg.label, prize: seg.prize, you: true,
      account: seg.prize ? newAccountId() : null, at: Date.now(), status: 'PENDING',
    }, ...a.slice(0, 11)]);
    if (seg.prize && addNotification) {
      addNotification({ id: Date.now(), title: 'Spin & Win result', desc: `Congratulations! You won ${seg.label} Funded Account. (Prototype result)`, type: 'reward', time: 'Just now' });
    }
    playFinAudio(seg.prize ? 'win' : 'tick');
  }, [addNotification]);

  const handleSpin = () => {
    if (!canSpin) return;
    onCreditChange(-SPIN_COST);
    const idx = Math.floor(Math.random() * N);
    pending.current = SPIN_SEGMENTS[idx];
    setResult(null);
    setSpinning(true);
    const turns = 5 + Math.floor(Math.random() * 3);
    const target = rot - (rot % 360) + turns * 360 + ((360 - idx * ARC) % 360);
    setRot(target);
    timer.current = setTimeout(finish, reduce ? 400 : 5500); // fallback if transitionend is missed
  };

  const closeResult = () => {
    setResult(null);
    requestAnimationFrame(() => {
      // return focus to the spin button, or to the wheel panel if it's now disabled
      const b = spinBtnRef.current;
      if (b && !b.disabled) b.focus(); else wheelRef.current && wheelRef.current.focus();
    });
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!result) return;
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { closeResult(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      // focus trap: keep Tab / Shift+Tab inside the result dialog
      const f = [...dialogRef.current.querySelectorAll('button:not([disabled])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!dialogRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result]);

  const prizes = SPIN_SEGMENTS.filter(s => s.prize);
  const myWins = activity.filter(a => a.you && a.prize);

  return (
    <div className="space-y-6">
      {/* Title block sits on the page (Tier 0) */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest bg-fin-warning/15 text-fin-warning border border-fin-warning/40">LIMITED EVENT</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-400 border border-surface-border">Prototype · outcome is simulated</span>
        </div>
        <h2 className="font-sora text-2xl sm:text-4xl font-extrabold text-white leading-tight">CAPTRIX Funded Spin & Win</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl">Spin the wheel with credits for trading rewards, discounts and funded-account prizes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Wheel panel — focal: Tier 2 primary + Lambo corners */}
        <section ref={wheelRef} tabIndex={-1} aria-label="Prize wheel" className="outline-none lg:col-span-7 cx-t2 cx-t2--primary cx-lambo rounded-2xl p-5 sm:p-8 flex flex-col items-center min-w-0 overflow-hidden">
          <div className="relative mx-auto w-full max-w-[360px] lg:max-w-[440px] aspect-square">
            <div className="absolute inset-[6%] rounded-full bg-brand-cyan/20 blur-3xl pointer-events-none" aria-hidden="true"></div>
            <svg viewBox="-208 -214 416 422" className="relative w-full h-full" role="img" aria-label={`Prize wheel with 8 segments: ${SPIN_SEGMENTS.map(s => s.prize ? s.label + ' account' : s.label).join(', ')}`}>
              <defs>
                <linearGradient id="cxPrize" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#11D6FF" stopOpacity=".42" /><stop offset="1" stopColor="#1478FF" stopOpacity=".3" /></linearGradient>
                <radialGradient id="cxHub" cx=".35" cy=".3" r="1"><stop offset="0" stopColor="#5fe8ff" /><stop offset="1" stopColor="#1478FF" /></radialGradient>
              </defs>
              <circle r="196" className="cx-wheel-rim" strokeWidth="2" />
              <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: '0px 0px', transition: spinning && !reduce ? 'transform 5.2s cubic-bezier(.12,.6,.1,1)' : 'none', willChange: 'transform' }} onTransitionEnd={(e) => { if (e.target === e.currentTarget) finish(); }}>
                {SPIN_SEGMENTS.map((s, i) => {
                  const [x1, y1] = pt(i * ARC - ARC / 2, R), [x2, y2] = pt(i * ARC + ARC / 2, R);
                  return (
                    <g key={i}>
                      <path d={`M0 0L${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}Z`} className={s.prize ? 'cx-seg-prize' : 'cx-seg-miss'} strokeWidth="1.5" />
                      <text transform={`rotate(${i * ARC - 90})`} x={R - 16} y="0" textAnchor="end" dominantBaseline="central" className={s.prize ? 'cx-txt-prize' : 'cx-txt-miss'}>
                        {s.prize ? (<><tspan fontFamily="Sora, sans-serif" fontWeight="800" fontSize="24">{s.label}</tspan><tspan dx="6" fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="9" letterSpacing="1">{s.sub}</tspan></>)
                          : (<tspan fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="11" letterSpacing="1.5">{s.label}</tspan>)}
                      </text>
                    </g>
                  );
                })}
                {Array.from({ length: 48 }, (_, i) => { const [a, b] = pt(i * 7.5, 180), [c, d] = pt(i * 7.5, i % 6 === 0 ? 191 : 187); return <line key={i} x1={a} y1={b} x2={c} y2={d} className="cx-seg-line" strokeWidth={i % 6 === 0 ? 2 : 1} />; })}
              </g>
              <circle r="38" fill="#0b0c10" stroke="#11D6FF" strokeWidth="2.5" />
              <image href={logoDark} x="-27" y="-27" width="54" height="54" />
              <polygon points="-13,-212 13,-212 0,-170" fill="#fff" stroke="#11D6FF" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="mt-6 w-full max-w-[360px] flex flex-col items-stretch gap-2">
            <button ref={spinBtnRef} onClick={handleSpin} disabled={!canSpin} className={`cx-spin-btn w-full min-h-[52px] px-6 rounded-xl font-sora font-bold text-sm tracking-wide uppercase transition-all ${canSpin ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-bg shadow-cyan-glow active:scale-[.985]' : 'bg-surface-elevated text-slate-500 cursor-not-allowed border border-surface-border'}`}>
              {spinning ? 'Spinning…' : `SPIN NOW - ${SPIN_COST} CREDITS`}
            </button>
            <p className="text-xs font-mono text-slate-400 text-center" aria-live="polite">
              Your balance: <span className="text-fin-profit font-bold">{userCredits} credits</span>
              {userCredits < SPIN_COST && !spinning && <span className="block mt-1 text-fin-warning">You need {SPIN_COST} credits to spin. Earn more in Rewards.</span>}
            </p>
          </div>
        </section>

        {/* Prize board — the reason someone spins: more weight than the feeds */}
        <section aria-label="Prize board" className="lg:col-span-5 cx-t2 rounded-2xl p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-sora text-lg font-bold text-white">Prize board</h3>
            <span className="text-[10px] font-mono text-slate-400">{SPIN_COST} credits / spin</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mb-3">Every segment on the wheel, in one place.</p>
          <ul className="divide-y divide-surface-border/50 flex-1">
            {prizes.map(p => (
              <li key={p.label} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 shrink-0 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 flex items-center justify-center"><Icon name="trophy" className="w-4 h-4 text-brand-cyan" /></span>
                  <span className="font-sora text-xl sm:text-2xl font-extrabold text-white">{p.label} <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400">{p.sub}</span></span>
                </span>
                <span className="text-[11px] font-mono text-brand-cyan text-right">Funded account</span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3 py-3">
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 shrink-0 rounded-lg border border-surface-border flex items-center justify-center text-slate-500 font-mono text-xs" aria-hidden="true">—</span>
                <span className="font-mono text-sm text-slate-400">TRY AGAIN</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">No prize</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MODULE A — personal history */}
        <section aria-label="My recently won accounts" className="cx-t2 cx-t2--quiet rounded-2xl p-5 sm:p-6 min-w-0">
          <FeedHeader title="My Recently Won Accounts">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-fin-warning/40 text-fin-warning">Sample activity</span>
          </FeedHeader>
          {myWins.length === 0 ? (
            <div className="cx-t1 rounded-xl border border-dashed p-4 flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 rounded-lg border border-surface-border flex items-center justify-center"><Icon name="trophy" className="w-4 h-4 text-slate-500" /></span>
              <span className="text-xs font-mono text-slate-400">No won accounts yet — your prizes will appear here after a winning spin.</span>
            </div>
          ) : (
            <ul className="divide-y divide-surface-border/50" aria-live="polite">
              {myWins.slice(0, 5).map(w => (
                <li key={w.id} className="flex items-center gap-3 py-3">
                  <span className="w-9 h-9 shrink-0 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 flex items-center justify-center"><Icon name="award" className="w-4 h-4 text-brand-cyan" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white truncate">{w.label} Funded Account</span>
                    <span className="block text-[11px] font-mono text-slate-500 leading-snug">Account {w.account} · {formatStamp(w.at)}</span>
                  </span>
                  <StatusBadge status={w.status} />
                </li>
              ))}
              {myWins.length < 5 && (
                <li className="pt-3">
                  <div className="cx-t1 rounded-xl border border-dashed p-3 flex items-center gap-3">
                    <span className="w-9 h-9 shrink-0 rounded-lg border border-dashed border-surface-border flex items-center justify-center text-slate-500 font-mono text-sm" aria-hidden="true">+</span>
                    <span className="text-[11px] font-mono text-slate-500">Your next winning spin will appear here.</span>
                  </div>
                </li>
              )}
            </ul>
          )}
          <p className="mt-3 text-[10px] font-mono text-slate-500">Prototype — no real account is issued.</p>
        </section>

        {/* MODULE B — community feed (static sample, display-only) */}
        <section aria-label="All users recently won" className="cx-t2 cx-t2--quiet rounded-2xl p-5 sm:p-6 min-w-0">
          <FeedHeader title="All Users Recently Won">
            <span className="text-[10px] font-mono font-semibold tracking-widest px-2 py-0.5 rounded-full border border-brand-cyan/40 text-brand-cyan bg-brand-cyan/10">COMMUNITY</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-fin-warning/40 text-fin-warning">Sample activity</span>
          </FeedHeader>
          <ul className="divide-y divide-surface-border/50 max-h-[22rem] overflow-y-auto pr-1 -mr-1" tabIndex={0} aria-label="Community wins (sample)">
            {COMMUNITY_WINS.map(w => (
              <li key={w.id} className="flex items-center gap-3 py-3">
                <span className="w-9 h-9 shrink-0 rounded-lg border border-surface-border flex items-center justify-center"><Icon name="trophy" className="w-4 h-4 text-fin-warning" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-slate-200 truncate"><span className="font-semibold text-white">{w.name}</span> won {w.label} Funded Account</span>
                  <span className="block text-[11px] font-mono text-slate-500 leading-snug">Account {w.account} · {formatStamp(w.at)}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] font-mono text-slate-500">Sample names and results for layout only — not verified winnings.</p>
        </section>
      </div>

      {result && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cx-scrim" onClick={closeResult}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Spin result" onClick={(e) => e.stopPropagation()} className="cx-t3 cx-lambo cx-pop rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
            <span className={`text-[11px] font-mono tracking-widest ${result.prize ? 'text-fin-profit' : 'text-slate-400'}`}>{result.prize ? 'PROTOTYPE PRIZE' : 'NO PRIZE THIS TIME'}</span>
            <h3 className="font-sora text-4xl font-extrabold text-white mt-2">{result.prize ? `${result.label} ${result.sub}` : 'TRY AGAIN'}</h3>
            <p className="text-sm text-slate-400 mt-3">{result.prize ? 'Simulated result for this prototype. No real account was issued.' : 'Spin again to keep going.'}</p>
            <div className="mt-6 flex gap-3">
              <button ref={closeRef} onClick={closeResult} className="flex-1 min-h-[48px] rounded-xl border border-surface-border text-white font-semibold text-sm">Close</button>
              <button onClick={() => { setResult(null); setTimeout(handleSpin, 50); }} disabled={userCredits < SPIN_COST} className="flex-1 min-h-[48px] rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-sm disabled:opacity-40">Spin again</button>
            </div>
          </div>
        </div>,
        overlayRoot()
      )}
    </div>
  );
};

export default SpinAndWinEngine;
