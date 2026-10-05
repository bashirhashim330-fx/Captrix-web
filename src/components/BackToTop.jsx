import { useState, useEffect } from 'react';

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const goTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
  };
  return (
    <button onClick={goTop} aria-label="Back to top" aria-hidden={!show} tabIndex={show ? 0 : -1} className={`cx-top ${show ? 'is-on' : ''}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 16V4M4.5 9.5L10 4l5.5 5.5" /></svg>
    </button>
  );
};

export default BackToTop;
