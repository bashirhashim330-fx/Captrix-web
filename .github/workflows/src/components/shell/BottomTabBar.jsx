import Icon from '../Icon.jsx';
import { TAB_BAR } from '../../data/dashboard.js';

// Mobile/tablet primary navigation (< 900px, where the sidebar is hidden).
// Four core destinations + More (opens the full navigation sheet).
const BottomTabBar = ({ current, onNavigate, onMore, moreOpen }) => {
  const inTabs = TAB_BAR.some(t => t.id === current);
  return (
    <nav aria-label="Primary" className="cx-tabbar lg:hidden fixed inset-x-0 bottom-0 z-40">
      <ul className="grid grid-cols-5 max-w-xl mx-auto">
        {TAB_BAR.map(t => {
          const on = current === t.id && !moreOpen;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onNavigate(t.id)}
                aria-current={on ? 'page' : undefined}
                className={`cx-tab w-full ${on ? 'is-on' : ''}`}
              >
                <span className="cx-tab__icon"><Icon name={t.icon} className="w-[22px] h-[22px]" /></span>
                <span className="cx-tab__label">{t.label}</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onMore}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            className={`cx-tab w-full ${moreOpen || !inTabs ? 'is-on' : ''}`}
          >
            <span className="cx-tab__icon"><Icon name="menu" className="w-[22px] h-[22px]" /></span>
            <span className="cx-tab__label">More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default BottomTabBar;
