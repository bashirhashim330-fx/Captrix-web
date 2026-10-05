import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Shared behaviour for every floating surface (sheet, popover, palette):
// Escape closes, Tab is trapped (when modal), focus returns to the opener,
// and body scroll is locked while a modal surface is open.
export function useDialog(open, onClose, { modal = true, initialFocus } = {}) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const node = ref.current;
    const first = initialFocus?.current || node?.querySelector(FOCUSABLE);
    requestAnimationFrame(() => first?.focus({ preventScroll: true }));
    const prevOverflow = document.body.style.overflow;
    if (modal) document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); return; }
      if (e.key !== 'Tab' || !modal || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (modal) document.body.style.overflow = prevOverflow;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, modal]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
