import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';
import { useDialog } from '../../lib/useDialog.js';

// Bell popover: Mark all as read, All / Unread filter, per-item unread dot
// (tap an item to mark it read), friendly empty state.
const NotificationsPopover = ({ open, onClose, notifications, onMarkAll, onMarkOne, anchorRef }) => {
  const ref = useDialog(open, onClose, { modal: false });
  const [tab, setTab] = useState('all');

  useEffect(() => {
    if (!open) return undefined;
    const out = (e) => {
      if (ref.current?.contains(e.target) || anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('pointerdown', out);
    return () => document.removeEventListener('pointerdown', out);
  }, [open, onClose, anchorRef, ref]);

  if (!open) return null;
  const unread = notifications.filter(n => !n.read).length;
  const list = tab === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Notifications"
      className="cx-t3 cx-pop fixed left-3 right-3 top-[68px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[23rem] rounded-2xl p-3 z-50"
    >
      <div className="flex items-center gap-2 px-1">
        <h2 className="font-sora font-semibold text-white text-base">Notifications</h2>
        <button
          type="button"
          onClick={onMarkAll}
          disabled={!unread}
          className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-full cx-well text-xs text-slate-300 hover:text-white disabled:opacity-50"
        >
          <Icon name="checks" className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div role="tablist" aria-label="Filter notifications" className="cx-seg mt-3 grid grid-cols-2 p-1 rounded-full">
        {[['all', 'All'], ['unread', `Unread${unread ? ` (${unread})` : ''}`]].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`cx-seg__btn h-8 rounded-full text-xs font-medium ${tab === id ? 'is-on' : ''}`}>{label}</button>
        ))}
      </div>

      <ul className="mt-2 max-h-[min(60vh,22rem)] overflow-y-auto divide-y divide-[color:var(--cx-line-1)]">
        {list.length === 0 && (
          <li className="py-8 text-center">
            <span className="mx-auto w-10 h-10 rounded-full cx-well flex items-center justify-center text-brand-cyan"><Icon name="checks" className="w-5 h-5" /></span>
            <p className="mt-2 text-sm text-white">You're all caught up</p>
            <p className="text-xs text-slate-400">New alerts will appear here.</p>
          </li>
        )}
        {list.map(n => (
          <li key={n.id}>
            <button type="button" onClick={() => onMarkOne(n.id)} className="w-full flex items-start gap-3 px-1.5 py-3 text-left rounded-lg hover:bg-[color:var(--cx-fill-1)]">
              <span className="w-8 h-8 shrink-0 rounded-full cx-well flex items-center justify-center text-brand-cyan">
                <Icon name={n.type === 'reward' ? 'award' : n.type === 'account' ? 'trophy' : 'sparkle'} className="w-4 h-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{n.title}</span>
                  <span className="text-[11px] text-slate-500">{n.time}</span>
                </span>
                <span className="block text-xs text-slate-400 mt-0.5 leading-relaxed">{n.desc}</span>
              </span>
              {!n.read && <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-fin-profit" aria-label="Unread"></span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPopover;
