import { useEffect, useState } from 'react';
import HomePage from './home/HomePage.jsx';
import TraderDashboardApp from './components/TraderDashboardApp.jsx';
import AuthModal from './components/AuthModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import { CHALLENGE_DATA } from './data/challenges.js';
import { ToastProvider, useToast } from './components/Toast.jsx';
import CaptrixLogo from './components/CaptrixLogo.jsx';

function CaptrixApp() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setInitialLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  // Top Level State
  const [viewMode, setViewMode] = useState('public'); // 'public' or 'dashboard'
  const [dashboardView, setDashboardView] = useState('overview');
  const [heroChallenge, setHeroChallenge] = useState(CHALLENGE_DATA[5]); // Default $100K 2-Step
  const [userCredits, setUserCredits] = useState(125);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCheckoutTier, setSelectedCheckoutTier] = useState(CHALLENGE_DATA[5]);
  const { push: toast } = useToast();

  // Global Notification System
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Evaluation Active', desc: 'Phase 1 verification running on CTX-100K-84920', time: '10m ago', read: false, type: 'account' },
    { id: 2, title: 'Spin & Win Drop', desc: 'Daily credits reset complete', time: '1h ago', read: false, type: 'reward' }
  ]);

  const handleAddNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleCreditChange = (delta) => {
    setUserCredits(prev => Math.max(0, prev + delta));
  };

  if (initialLoading) {
    return (
      <div className="cx-initial-splash fixed inset-0 z-[9999] min-h-screen bg-bg text-slate-200 flex flex-col items-center justify-center" role="status" aria-label="Loading CAPTRIX FUNDED">
        <CaptrixLogo className="w-20 h-20 sm:w-24 sm:h-24" />
        <div className="mt-5 font-sora font-extrabold text-xl sm:text-2xl tracking-[0.18em] text-white">
          CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-app min-h-screen bg-bg text-slate-200">
      {viewMode === 'public' ? (
        <HomePage
          challenge={heroChallenge}
          onSelectChallenge={setHeroChallenge}
          onCheckout={(tier) => { setSelectedCheckoutTier(tier); setCheckoutOpen(true); }}
          onOpenAuth={(mode) => { setAuthInitialMode(mode); setAuthOpen(true); }}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      ) : (
        /* COMPLETE APPLICATION / DASHBOARD */
        <TraderDashboardApp 
          initialView={dashboardView}
          userCredits={userCredits}
          onCreditChange={handleCreditChange}
          onAddNotification={handleAddNotification}
          onReturnToPublic={() => setViewMode('public')}
          onOpenNewChallenge={() => {
            setSelectedCheckoutTier(CHALLENGE_DATA[5]);
            setCheckoutOpen(true);
          }}
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          onMarkNotificationRead={handleMarkNotificationRead}
          onSignOut={() => {
            setViewMode('public');
            window.scrollTo({ top: 0, behavior: 'auto' });
            toast({ title: 'Signed out', desc: 'Prototype — no session was stored.' });
          }}
        />
      )}

      {/* GLOBAL AUTHENTICATION MODAL */}
      <AuthModal 
        isOpen={authOpen} 
        initialMode={authInitialMode} 
        onClose={() => setAuthOpen(false)} 
        onLoginSuccess={() => {
          setViewMode('dashboard');
          setDashboardView('overview');
        }} 
      />

      {/* CHECKOUT MODAL */}
      <CheckoutModal 
        challenge={selectedCheckoutTier} 
        isOpen={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        onSuccess={() => {
          toast({ title: `${selectedCheckoutTier.label} evaluation confirmed`, desc: 'Prototype checkout — no payment was taken and no live account was created. Opening your Trader Dashboard.' });
          setViewMode('dashboard');
          setDashboardView('overview');
        }} 
      />
      {/* Portal host for floating layers opened inside Tier-2 panels */}
      <div id="cx-overlay-root" />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CaptrixApp />
    </ToastProvider>
  );
}
