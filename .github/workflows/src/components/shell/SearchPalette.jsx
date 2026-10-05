import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon.jsx';
import { NAV_SECTIONS } from '../../data/dashboard.js';
import { useDialog } from '../../lib/useDialog.js';
import { overlayRoot } from '../../lib/motion.js';

// Search / jump-to palette (Ctrl/⌘ K or "/"): every dashboard page + quick actions.
const SearchPalette = ({ open, onClose, onNavigate, actions = [] }) => {
  const input = useRef(null);
  const ref = useDialog(open, onClose, { initialFocus: input });
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);

  const items = useMemo(() => {
    const pages = NAV_SECTIONS.flatMap(s => s.items.map(it => ({ key: it.id, label: it.label, group: s.heading, icon: it.icon, run: () => onNavigate(it.id) })));
    const all = [...actions.map(a => ({ ...a, group: 'Actions' })), ...pages];
    const t = q.trim().toLowerCase();
    return t ? all.filter(x => `${x.label} ${x.group}`.toLowerCase().includes(t)) : all;
  }, [q, actions, onNavigate]);

  if (!open) return null;
  const pick = (x) => { if (!x) return; onClose(); setQ(''); x.run(); };
  const key = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI(v => Math.min(items.length - 1, v + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setI(v => Math.max(0, v - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); pick(items[i]); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-3 pt-[10vh]">
      <div className="absolute inset-0 cx-scrim" onClick={onClose} aria-hidden="true"></div>
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Search the dashboard" className="cx-t3 cx-pop relative w-full max-w-lg rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 h-14 border-b border-surface-border">
          <Icon name="search" className="w-5 h-5 text-slate-400" />
          <input
            ref={input}
            value={q}
            onChange={(e) => { setQ(e.target.value); setI(0); }}
            onKeyDown={key}
            placeholder="Search pages and actions…"
            aria-label="Search pages and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="cx-search-list"
            aria-activedescendant={items[i] ? `cx-s-${items[i].key}` : undefined}
            className="cx-search-input flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
          />
          <kbd className="hidden sm:inline text-[10px] font-mono text-slate-500 border border-surface-border rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <ul id="cx-search-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-400">No matches for “{q}”.</li>}
          {items.map((x, n) => (
            <li
              key={x.key}
              id={`cx-s-${x.key}`}
              role="option"
              aria-selected={n === i}
              onMouseEnter={() => setI(n)}
              onClick={() => pick(x)}
              className={`flex items-center gap-3 px-3 h-11 rounded-xl text-sm cursor-pointer ${n === i ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-slate-300'}`}
            >
              <Icon name={x.icon} className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{x.label}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{x.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    overlayRoot()
  );
};

export default SearchPalette;
