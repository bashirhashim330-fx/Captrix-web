import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';

const AccountPicker = ({ accounts, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = accounts.find((a) => a.id === value) || accounts[0];

  useEffect(() => {
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const choose = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`cx-account-picker ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="cx-account-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Choose active account"
      >
        <span className="cx-account-trigger__mark"><Icon name="wallet" className="w-4 h-4" /></span>
        <span className="cx-account-trigger__copy">
          <span className="cx-account-trigger__label">ACTIVE ACCOUNT</span>
          <span className="cx-account-trigger__value">{current?.id} <span>· {current?.type}</span></span>
        </span>
        <Icon name="chevronRight" className={`w-4 h-4 cx-account-trigger__chevron ${open ? 'rotate-90' : 'rotate-0'}`} />
      </button>

      {open && (
        <div className="cx-account-popover cx-t3 cx-pop" role="dialog" aria-label="Choose active account">
          <div className="cx-account-popover__head">
            <div>
              <span className="cx-account-popover__eyebrow">TRADING ACCOUNTS</span>
              <h3>Switch account</h3>
            </div>
            <span className="cx-account-popover__count">{accounts.length} ACTIVE</span>
          </div>
          <div className="cx-account-options">
            {accounts.map((account) => {
              const selected = account.id === value;
              return (
                <button
                  key={account.id}
                  type="button"
                  className={`cx-account-option ${selected ? 'is-selected' : ''}`}
                  onClick={() => choose(account.id)}
                  aria-pressed={selected}
                >
                  <span className="cx-account-option__icon"><Icon name={selected ? 'check' : 'wallet'} className="w-4 h-4" /></span>
                  <span className="cx-account-option__body">
                    <span className="cx-account-option__id">{account.id}</span>
                    <span className="cx-account-option__meta">{account.type} <b>·</b> {account.status}</span>
                  </span>
                  <span className="cx-account-option__size">${account.size / 1000}K</span>
                </button>
              );
            })}
          </div>
          <div className="cx-account-popover__foot">Account metrics update instantly after switching.</div>
        </div>
      )}
    </div>
  );
};

export default AccountPicker;
