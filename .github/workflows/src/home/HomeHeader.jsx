import { useEffect, useState } from 'react';
import CaptrixLogo from '../components/CaptrixLogo.jsx';
import { useScrolled } from '../lib/motion.js';
import { Sun, Moon } from './icons.jsx';

const LINKS = [
  { href: '#corridor-hero', label: 'The Corridor' },
  { href: '#marketplace', label: 'Challenges' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#platform', label: 'Platform' },
  { href: '#faq', label: 'FAQ' },
];

// Light/dark switch for the public site (same storage key as the dashboard).
export const useSiteTheme = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themeMode = theme;
    try { localStorage.setItem('captrix-theme', theme); } catch { /* storage blocked */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'light' ? 'dark' : 'light'))];
};

export const Wordmark = ({ className = '' }) => (
  <span className={`font-sora font-bold tracking-[.08em] whitespace-nowrap h-ink ${className}`}>
    CAPTRIX <span className="h-accent-text">FUNDED</span>
  </span>
);

const HomeHeader = ({ onLogin, onGetFunded, onMenu, menuOpen, theme, onToggleTheme: toggleTheme }) => {
  const scrolled = useScrolled(8);
  return (
    <header className={`h-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="h-container !px-3 sm:!px-5">
        <div className="h-header__bar">
          <a href="#corridor-hero" className="flex items-center gap-2.5 min-w-0" aria-label="CAPTRIX FUNDED home">
            <CaptrixLogo className="w-8 h-8 shrink-0" />
            <Wordmark className="text-[14px] min-[400px]:text-[15px] sm:text-base" />
          </a>

          <nav aria-label="Primary" className="hidden min-[1080px]:flex items-center gap-1">
            {LINKS.map(l => <a key={l.href} href={l.href} className="h-navlink">{l.label}</a>)}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button type="button" onClick={toggleTheme} className="h-iconbtn h-only-sm" aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'} title={theme === 'light' ? 'Dark theme' : 'Light theme'}>
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
            <button type="button" onClick={onLogin} className="h-btn h-btn--ghost !min-h-[44px] !px-3 text-[14px]">Log in</button>
            <button type="button" onClick={onGetFunded} className="h-btn h-btn--primary h-btn--sm h-only-sm">Get funded</button>
            <button type="button" onClick={onMenu} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="cx-site-menu" className="h-burger ml-1">
              <span></span><span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
