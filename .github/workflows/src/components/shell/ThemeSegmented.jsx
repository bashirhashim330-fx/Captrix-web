import Icon from '../Icon.jsx';

const OPTIONS = [
  { id: 'system', label: 'System', icon: 'monitor' },
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
];

// Compact icon segmented control (used in the More sheet).
const ThemeSegmented = ({ mode, onChange }) => (
  <div role="radiogroup" aria-label="Theme" className="cx-seg inline-flex items-center gap-0.5 p-1 rounded-full">
    {OPTIONS.map(o => (
      <button
        key={o.id}
        type="button"
        role="radio"
        aria-checked={mode === o.id}
        aria-label={o.label}
        title={o.label}
        onClick={() => onChange(o.id)}
        className={`cx-seg__btn w-9 h-8 rounded-full flex items-center justify-center ${mode === o.id ? 'is-on' : ''}`}
      >
        <Icon name={o.icon} className="w-4 h-4" />
      </button>
    ))}
  </div>
);

export default ThemeSegmented;
