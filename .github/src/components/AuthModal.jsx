import { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import CaptrixLogo from './CaptrixLogo.jsx';

const AuthModal = ({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cx-scrim" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Trader login' : 'Create trader account'} onClick={(e) => e.stopPropagation()} className="cx-t3 cx-lambo cx-pop rounded-2xl w-full max-w-md p-6 sm:p-8 relative max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white">✕</button>

        <div className="text-center mb-6">
          <CaptrixLogo className="w-14 h-14 mx-auto mb-3" />
          <span className="font-sora font-extrabold text-xl text-white tracking-wider">
            CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span>
          </span>
          <h3 className="font-sora text-xl font-bold text-white mt-3">
            {mode === 'login' ? 'Institutional Trader Login' : 'Create Trader Account'}
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Access live accounts, corridor metrics, and payouts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@captrix.com"
              className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-cyan-sm transition-all"
          >
            {isLoading ? 'AUTHENTICATING ENCRYPTED SESSION...' : mode === 'login' ? 'LOGIN' : 'CREATE CREDENTIALS'}
          </button>

          <div className="flex items-center justify-between text-[11px] pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-brand-cyan hover:underline"
            >
              {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                const email = window.prompt('Enter the email associated with your Captrix account:');
                if (email?.trim()) {
                  window.alert(`If an account exists for ${email.trim()}, a password reset link would be sent in the production system.`);
                }
              }}
              className="text-slate-500 hover:text-slate-300"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
