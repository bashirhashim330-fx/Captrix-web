import Icon from '../Icon.jsx';

// Signed-in trader: initials avatar, name, email, sign-out.
const UserCard = ({ trader, onSignOut, className = '' }) => (
  <div className={`flex items-center gap-3 min-w-0 ${className}`}>
    <span className="w-10 h-10 shrink-0 rounded-full bg-brand-cyan/10 border border-brand-cyan/35 text-brand-cyan flex items-center justify-center font-mono font-bold text-xs" aria-hidden="true">
      {trader.initials}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-sora text-sm font-semibold text-white truncate">{trader.name}</span>
      <span className="block font-mono text-[11px] text-slate-400 truncate">{trader.email}</span>
    </span>
    <button
      type="button"
      onClick={onSignOut}
      aria-label="Sign out"
      title="Sign out"
      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[color:var(--cx-fill-1)] transition-colors"
    >
      <Icon name="logout" className="w-[18px] h-[18px]" />
    </button>
  </div>
);

export default UserCard;
