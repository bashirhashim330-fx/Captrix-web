import { useEffect, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll that respects prefers-reduced-motion. */
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' });
};

/** True once the window has scrolled past `threshold` px (drives Tier-3 headers). */
export const useScrolled = (threshold = 8) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
};

/**
 * Portal target for floating layers that are opened from inside Tier-2 panels.
 * Tier-2 panels use backdrop-filter, which would otherwise trap position:fixed
 * children. The host lives inside #root so all #root-scoped theme rules apply.
 */
export const overlayRoot = () => document.getElementById('cx-overlay-root') || document.body;
