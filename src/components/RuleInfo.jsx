import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RULE_DEFINITIONS } from '../data/ruleDefinitions.js';
import { overlayRoot } from '../lib/motion.js';

// Inline rule definition: hover (pointer devices), focus, or tap the (i).
// The popover is portalled + fixed-positioned so it is never clipped by the
// Corridor's overflow:hidden and never trapped by a Tier-2 backdrop-filter.
const POP_W = 272;

const RuleInfo = ({ rule, className = '' }) => {
  const def = RULE_DEFINITIONS[rule];
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const pinned = useRef(false);
  const id = useId();

  const place = useCallback(() => {
    const b = btnRef.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = Math.min(POP_W, vw - 24);
    const left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), vw - w - 12);
    const below = r.bottom + 10 + 120 < vh;
    setPos(below ? { left, top: r.bottom + 10, width: w } : { left, bottom: vh - r.top + 10, width: w });
  }, []);

  const show = () => { place(); setOpen(true); };
  const hide = () => { pinned.current = false; setOpen(false); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') { hide(); btnRef.current && btnRef.current.focus(); } };
    const onDown = (e) => { if (!btnRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) hide(); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  if (!def) return null;
  const hoverCapable = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`What is ${def.title.toLowerCase()}?`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={(e) => { e.stopPropagation(); if (open && pinned.current) hide(); else { pinned.current = true; show(); } }}
        onMouseEnter={() => hoverCapable && show()}
        onMouseLeave={() => hoverCapable && !pinned.current && setOpen(false)}
        onFocus={show}
        onBlur={() => !pinned.current && setOpen(false)}
        className={`relative inline-flex items-center justify-center w-4 h-4 shrink-0 rounded-full border border-current opacity-70 hover:opacity-100 focus-visible:opacity-100 align-middle before:absolute before:-inset-2 before:content-[''] ${className}`}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" fill="currentColor"><rect x="3.25" y="3.2" width="1.5" height="3.8" rx=".5" /><circle cx="4" cy="1.6" r=".85" /></svg>
      </button>
      {open && pos && createPortal(
        <div
          ref={popRef}
          id={id}
          role="tooltip"
          className="cx-t3 cx-t3--sm cx-pop fixed z-[70] rounded-xl p-3.5 text-left normal-case tracking-normal"
          style={{ left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width }}
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan mb-1">{def.title}</div>
          <p className="text-xs leading-relaxed text-slate-300 font-sans">{def.text}</p>
        </div>,
        overlayRoot()
      )}
    </>
  );
};

export default RuleInfo;
