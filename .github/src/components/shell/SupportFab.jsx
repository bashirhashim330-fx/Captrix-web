import Icon from '../Icon.jsx';

// Floating support shortcut (opens Support Desk). Sits above the mobile tab bar.
const SupportFab = ({ onClick }) => (
  <button type="button" onClick={onClick} aria-label="Contact support" title="Support Desk" className="cx-fab fixed right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center">
    <Icon name="chat" className="w-6 h-6" />
  </button>
);

export default SupportFab;
