import logoDark from '../assets/logo-dark.png';
import logoLight from '../assets/logo-light.png';

// Real Captrix logo files; the visible variant is swapped by the theme in CSS.
const CaptrixLogo = ({ className = 'w-9 h-9' }) => (
  <span className={`cx-logo block shrink-0 ${className}`} aria-hidden="true">
    <img src={logoDark} alt="" width="64" height="64" decoding="async" className="cx-logo-dark w-full h-full object-contain" />
    <img src={logoLight} alt="" width="64" height="64" decoding="async" className="cx-logo-light w-full h-full object-contain" />
  </span>
);

export { logoDark, logoLight };
export default CaptrixLogo;
