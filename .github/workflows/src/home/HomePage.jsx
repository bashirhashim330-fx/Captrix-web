import { useState } from 'react';
import HomeHeader, { useSiteTheme } from './HomeHeader.jsx';
import Hero from './Hero.jsx';
import Highlights from './Highlights.jsx';
import FinalCta from './FinalCta.jsx';
import BackToTop from '../components/BackToTop.jsx';
import PublicDrawer from '../components/PublicDrawer.jsx';
import ChallengeMarketplace from '../components/ChallengeMarketplace.jsx';
import HowItWorksSection from '../components/HowItWorksSection.jsx';
import DashboardShowcase from '../components/DashboardShowcase.jsx';
import FAQSection from '../components/FAQSection.jsx';
import Footer from '../components/Footer.jsx';
import { scrollToId } from '../lib/motion.js';


// Public homepage (v3). Owns only presentation state (pricing view, theme);
// auth / checkout / selected tier stay in App.
const HomePage = ({ challenge, onSelectChallenge, onCheckout, onOpenAuth, menuOpen, setMenuOpen }) => {
  const [view, setView] = useState(() => (typeof window !== 'undefined' && window.location.hash === '#compare-tiers' ? 'compare' : 'plan'));
  const [theme, toggleTheme] = useSiteTheme();
  const login = () => onOpenAuth('login');
  const goPricing = () => scrollToId('marketplace');

  return (
    <div className="cx-home min-h-screen">
      <a href="#marketplace" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] h-btn h-btn--primary h-btn--sm">Skip to challenges</a>
      <HomeHeader onLogin={login} onGetFunded={goPricing} onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} theme={theme} onToggleTheme={toggleTheme} />
      <BackToTop />
      <PublicDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onLogin={login} onGetFunded={goPricing} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero
          challenge={challenge}
          onSelectSize={onSelectChallenge}
          onStart={() => onCheckout(challenge)}
          onCompare={() => { setView('compare'); requestAnimationFrame(() => scrollToId('compare-tiers')); }}
        />
        <Highlights />
        <ChallengeMarketplace selectedId={challenge.id} onSelectTier={onSelectChallenge} onCheckout={onCheckout} view={view} onViewChange={setView} />
        <HowItWorksSection />
        <DashboardShowcase onGoToDashboard={login} />
        <FAQSection onLogin={login} />
        <FinalCta onChoose={goPricing} onLogin={login} />
      </main>
      <Footer onOpenAuth={onOpenAuth} />
    </div>
  );
};

export default HomePage;
