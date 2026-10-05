import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

// Tier-3 confirmation toasts — same glass + edge treatment as the modals.
// Replaces the browser alert() calls the original build used for feedback.
const ToastContext = createContext({ push: () => {} });

const TONES = {
  success: { icon: 'check', cls: 'text-fin-profit', ring: 'bg-fin-profit/10 border-fin-profit/30' },
  info: { icon: 'bell', cls: 'text-brand-cyan', ring: 'bg-brand-cyan/10 border-brand-cyan/30' },
  warn: { icon: 'shield', cls: 'text-fin-warning', ring: 'bg-fin-warning/10 border-fin-warning/30' },
};

const ToastItem = ({ toast, onDismiss }) => {
  const tone = TONES[toast.tone] || TONES.success;
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.duration || 4200);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);
  return (
    <div role="status" className="cx-toast cx-t3 cx-t3--sm cx-lambo cx-lambo--sm rounded-2xl p-3.5 pr-2 flex items-start gap-3">
      <span className={`mt-0.5 w-8 h-8 shrink-0 rounded-full border flex items-center justify-center ${tone.ring}`}>
        <Icon name={tone.icon} className={`w-4 h-4 ${tone.cls}`} />
      </span>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="font-sora text-sm font-semibold text-white leading-snug">{toast.title}</div>
        {toast.desc && <div className="text-[11px] font-mono text-slate-400 mt-1 leading-relaxed">{toast.desc}</div>}
      </div>
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification" className="shrink-0 w-9 h-9 -mt-1 flex items-center justify-center rounded-lg text-slate-400 hover:text-white">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);
  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const push = useCallback((toast) => {
    seq.current += 1;
    const id = `t${seq.current}`;
    setToasts((list) => [...list.slice(-2), { tone: 'success', ...toast, id }]);
    return id;
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="cx-toast-stack" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
