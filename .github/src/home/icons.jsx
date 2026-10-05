// Small line icons used only on the homepage (1.6px strokes, currentColor).
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Check = ({ className = 'w-4 h-4' }) => <svg className={className} viewBox="0 0 20 20" {...P}><path d="m4.5 10.5 3.5 3.5 7.5-8" /></svg>;
export const Arrow = ({ className = 'w-4 h-4' }) => <svg className={className} viewBox="0 0 20 20" {...P}><path d="M4 10h12m-5-5 5 5-5 5" /></svg>;
export const Sun = ({ className = 'w-[18px] h-[18px]' }) => <svg className={className} viewBox="0 0 20 20" {...P}><circle cx="10" cy="10" r="3.5" /><path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1" /></svg>;
export const Moon = ({ className = 'w-[18px] h-[18px]' }) => <svg className={className} viewBox="0 0 20 20" {...P}><path d="M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5z" /></svg>;
export const Plus = ({ className = 'w-4 h-4' }) => <svg className={className} viewBox="0 0 20 20" {...P}><path d="M10 4v12M4 10h12" /></svg>;
export const Grid = ({ className = 'w-4 h-4' }) => <svg className={className} viewBox="0 0 20 20" {...P}><rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="11" y="3" width="6" height="6" rx="1.5" /><rect x="3" y="11" width="6" height="6" rx="1.5" /><rect x="11" y="11" width="6" height="6" rx="1.5" /></svg>;
export const Table = ({ className = 'w-4 h-4' }) => <svg className={className} viewBox="0 0 20 20" {...P}><rect x="3" y="4" width="14" height="12" rx="2" /><path d="M3 8h14M8 8v8" /></svg>;
export const Shield = ({ className = 'w-4 h-4' }) => <svg className={className} viewBox="0 0 20 20" {...P}><path d="M10 2.5 16 5v4.5c0 3.8-2.5 6.6-6 8-3.5-1.4-6-4.2-6-8V5z" /><path d="m7.5 10 1.8 1.8L13 8" /></svg>;
