import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon.jsx';
import CaptrixLogo from '../CaptrixLogo.jsx';
import ThemeSegmented from './ThemeSegmented.jsx';
import UserCard from './UserCard.jsx';
import { NAV_SECTIONS } from '../../data/dashboard.js';
import { useDialog } from '../../lib/useDialog.js';
import { overlayRoot } from '../../lib/motion.js';

// "More" bottom sheet (< 900px): replaces the old left drawer. Grab handle
// (drag down to dismiss), theme switch, full grouped navigation, the primary
// "New Challenge" action and the signed-in trader card.
const MoreSheet = ({ open, onClose, current, onNavigate, themeMode, onTheme, onNewChallenge, onPublic, onSearch, onSignOut, trader }) => {
  const ref = useDialog(open, onClose);
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  if (!open) return null;

  const down = (e) => {
    if (e.target.closest('button')) return; // taps on theme / close stay taps
    start.current = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => { if (start.current != null) setDrag(Math.max(0, e.clientY - start.current)); };
  const up = () => { if (start.current == null) return; start.current = null; if (drag > 90) onClose(); setDrag(0); };
  const go = (id) => { onNavigate(id); onClose(); };

  return createPortal(
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 cx-scrim" onClick={onClose} aria-hidden="true"></div>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="More navigation"
        className="cx-t3 cx-sheet absolute inset-x-0 bottom-0 max-h-[88dvh] flex flex-col"
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
      >
        {/* Handle + theme row (drag zone) */}
        <div className="shrink-0 px-4 pt-2 pb-3 touch-none" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <div className="mx-auto w-10 h-1.5 rounded-full bg-slate-500/40" aria-hidden="true"></div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest text-slate-500">THEME</span>
            <span className="ml-auto"><ThemeSegmented mode={themeMode} onChange={onTheme} /></span>
            <button type="button" onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-[color:var(--cx-fill-1)]">
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2.5 px-1 pb-3">
            <CaptrixLogo className="w-8 h-8" />
            <span className="font-sora font-extrabold tracking-wider text-white">CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span></span>
          </div>

          <button type="button" onClick={() => { onClose(); onSearch(); }} className="cx-well w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-sm text-slate-400 mb-4">
            <Icon name="search" className="w-4 h-4" /> Search the dashboard
          </button>

          {NAV_SECTIONS.map(sec => (
            <div key={sec.heading} className="mb-3">
              <div className="px-2 pb-1 text-[10px] font-mono tracking-widest text-slate-500 uppercase">{sec.heading}</div>
              <ul>
                {sec.items.map(item => {
                  const on = current === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => go(item.id)}
                        aria-current={on ? 'page' : undefined}
                        className={`cx-navrow w-full flex items-center gap-3 px-3 h-11 rounded-xl text-[15px] ${on ? 'is-on' : ''}`}
                      >
                        <Icon name={item.icon} className="w-[18px] h-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {on && <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true"></span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <button type="button" onClick={() => { onClose(); onPublic(); }} className="cx-navrow w-full flex items-center gap-3 px-3 h-11 rounded-xl text-[15px] mb-4">
            <Icon name="arrowUpRight" className="w-[18px] h-[18px]" /><span className="flex-1 text-left">Public Portal</span>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onNewChallenge(); }}
            className="w-full h-12 rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-sm flex items-center justify-center gap-2 shadow-cyan-sm"
          >
            <Icon name="plus" className="w-4 h-4" /> New Challenge
          </button>

          <UserCard trader={trader} onSignOut={() => { onClose(); onSignOut(); }} className="mt-4 px-1 py-2" />
        </div>
      </div>
    </div>,
    overlayRoot()
  );
};

export default MoreSheet;
