import { useEffect, useRef } from 'react';
import CaptrixLogo from './CaptrixLogo.jsx';
import { SITE_MENU } from '../data/siteMenu.js';
import { Wordmark } from '../home/HomeHeader.jsx';
import { Arrow, Sun, Moon } from '../home/icons.jsx';

// Homepage site menu (<1080px). Rendered inside .cx-home so it uses the
// restrained homepage palette. Esc / scrim close, focus moves to Close.
const PublicDrawer = ({ open, onClose, onLogin, onGetFunded, theme, onToggleTheme }) => {
  const closeRef = useRef(null);
  const closeFn = useRef(onClose);
  closeFn.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') closeFn.current(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);
  if (!open) return null;
  return (
    <div id="cx-site-menu" className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="h-scrim absolute inset-0" onClick={onClose}></div>
      <aside className="h-drawer absolute right-0 top-0 h-full w-[min(24rem,92vw)] flex flex-col">
        <div className="flex items-center justify-between gap-3 px-5 h-[76px] border-b h-hairline">
          <div className="flex items-center gap-2.5 min-w-0">
            <CaptrixLogo className="w-8 h-8 shrink-0" />
            <Wordmark className="text-[15px] truncate" />
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="h-iconbtn !w-11 !h-11">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-2" aria-label="Site">
          <ul>
            {SITE_MENU.map(it => (
              <li key={it.href}>
                <a href={it.href} onClick={onClose} className="h-menu-item">
                  <span className="min-w-0">
                    <span className="block h-h3 text-[18px]">{it.label}</span>
                    <span className="block text-[13px] h-muted mt-0.5">{it.hint}</span>
                  </span>
                  <Arrow className="w-4 h-4 shrink-0 h-muted" />
                </a>
              </li>
            ))}
          </ul>
          {onToggleTheme && (
            <div className="flex items-center justify-between gap-3 py-5">
              <span className="text-[14px] h-body">Appearance</span>
              <div className="h-seg" role="group" aria-label="Theme">
                <button type="button" aria-pressed={theme !== 'light'} onClick={() => theme === 'light' && onToggleTheme()} className={`h-seg__btn !min-h-[36px] inline-flex items-center gap-1.5 ${theme !== 'light' ? 'is-on' : ''}`}><Moon className="w-4 h-4" />Dark</button>
                <button type="button" aria-pressed={theme === 'light'} onClick={() => theme !== 'light' && onToggleTheme()} className={`h-seg__btn !min-h-[36px] inline-flex items-center gap-1.5 ${theme === 'light' ? 'is-on' : ''}`}><Sun className="w-4 h-4" />Light</button>
              </div>
            </div>
          )}
        </nav>
        <div className="p-5 border-t h-hairline space-y-2.5" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          <button type="button" onClick={() => { onClose(); onGetFunded(); }} className="h-btn h-btn--primary w-full !min-h-[52px]">Get funded</button>
          <button type="button" onClick={() => { onClose(); onLogin(); }} className="h-btn h-btn--secondary w-full">Log in</button>
        </div>
      </aside>
    </div>
  );
};

export default PublicDrawer;
