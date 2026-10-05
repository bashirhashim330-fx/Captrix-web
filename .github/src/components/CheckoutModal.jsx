import { useState, useEffect } from 'react';

const CheckoutModal = ({ challenge, isOpen, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !challenge) return null;

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cx-scrim" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Confirm ${challenge.label} evaluation`} onClick={(e) => e.stopPropagation()} className="cx-t3 cx-lambo cx-pop rounded-2xl w-full max-w-lg p-6 sm:p-8 relative max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white">✕</button>

        <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider">CHECKOUT CONFIGURATION</span>
        <h3 className="font-sora text-2xl font-bold text-white mt-1">Confirm {challenge.label} Evaluation</h3>

        <div className="my-6 cx-inset p-4 rounded-xl space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Account Model</span>
            <span className="text-white font-bold">{challenge.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Profit Target</span>
            <span className="text-fin-profit font-bold">+{challenge.targetPercent}% (${challenge.targetAmount.toLocaleString()})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Daily Drawdown Ceiling</span>
            <span className="text-fin-warning font-bold">-${challenge.dailyDrawdown.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Max Overall Drawdown</span>
            <span className="text-fin-loss font-bold">-${challenge.maxDrawdown.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-surface-border text-sm">
            <span className="text-slate-300 font-bold">One-Time Fee</span>
            <span className="text-brand-cyan font-bold">${challenge.price}.00</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={processing}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan text-bg font-sora font-bold text-sm uppercase tracking-wide shadow-cyan-glow transition-all"
        >
          {processing ? 'ALLOCATING TRADING CREDENTIALS...' : `PROCEED TO CHECKOUT ($${challenge.price})`}
        </button>
        <p className="text-[10px] text-center font-mono text-slate-500 mt-3">
          Encrypted 256-bit checkout • Instant automated credentials delivery via email
        </p>
      </div>
    </div>
  );
};

export default CheckoutModal;
