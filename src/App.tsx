import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { QuickViewModal } from './components/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomStudioPage } from './pages/CustomStudioPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage, PoliciesPage } from './pages/ContactAndPolicyPages';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const INTRO_SESSION_KEY = 'bilal_sheikh_intro_seen_v1';

const ToastStack: React.FC = () => {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-[95] space-y-2 pointer-events-none max-w-xs no-print">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className={`px-4 py-3 rounded-[16px] text-xs font-semibold shadow-xl backdrop-blur-xl border ${
              t.tone === 'crimson'
                ? 'bg-[#B5123B]/95 text-white border-white/30'
                : 'glass-panel-strong text-[#230B14]'
            }`}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const MobileFloatingBag: React.FC = () => {
  const { cartCount, setIsCartOpen } = useStore();
  const location = useLocation();
  if (cartCount === 0 || location.pathname === '/checkout') return null;

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label="Open Shopping Bag"
      className="sm:hidden fixed bottom-4 right-4 z-40 glass-crimson-btn px-4 py-3 rounded-[16px] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-xl no-print"
    >
      <ShoppingBag className="w-4 h-4" />
      <span className="tabular-nums">Bag ({cartCount})</span>
    </button>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:categorySlug" element={<CollectionsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/custom" element={<CustomStudioPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/policies/:type" element={<PoliciesPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    } catch {
      // ignore
    }
  };

  return (
    <BrowserRouter>
      <StoreProvider>
        <div className="min-h-screen flex flex-col relative">
          {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
          <Navbar />
          <AnimatedRoutes />
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <QuickViewModal />
          <MobileFloatingBag />
          <ToastStack />
        </div>
      </StoreProvider>
    </BrowserRouter>
  );
}
