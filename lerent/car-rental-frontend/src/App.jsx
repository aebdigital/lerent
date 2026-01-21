import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DefaultLayout from './layouts/DefaultLayout';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import ApiStatus from './components/ApiStatus';
import SEOWrapper from './components/SEOWrapper';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import CarDetailsPage from './pages/CarDetailsPage';
import TermsPage from './pages/TermsPage';
import CennikPoplatkovPage from './pages/CennikPoplatkovPage';
import PrivacyPage from './pages/PrivacyPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PoisteniePage from './pages/PoisteniePage';
import AutouveryPage from './pages/AutouveryPage';
import SprostredkovaniePage from './pages/SprostredkovaniePage';
import SluzbyPage from './pages/SluzbyPage';
import FAQPage from './pages/FAQPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import BankTransferInfoPage from './pages/BankTransferInfoPage';
import { initGSAPAnimations, initScrollAnimations } from './utils/gsapAnimations';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><SEOWrapper page="home"><HomePage /></SEOWrapper></PageTransition>} />
        <Route path="/sluzby" element={<PageTransition><SEOWrapper page="sluzby"><SluzbyPage /></SEOWrapper></PageTransition>} />
        <Route path="/faq" element={<PageTransition><SEOWrapper page="faq"><FAQPage /></SEOWrapper></PageTransition>} />
        <Route path="/car/:id" element={<PageTransition><CarDetailsPage /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><SEOWrapper page="booking"><BookingPage /></SEOWrapper></PageTransition>} />
        <Route path="/payment-success" element={<PageTransition><PaymentSuccess /></PageTransition>} />
        <Route path="/payment-cancelled" element={<PageTransition><PaymentCancelled /></PageTransition>} />
        <Route path="/bank-transfer-info" element={<PageTransition><BankTransferInfoPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><SEOWrapper page="terms"><TermsPage /></SEOWrapper></PageTransition>} />
        <Route path="/cennik-poplatkov" element={<PageTransition><SEOWrapper page="cennik"><CennikPoplatkovPage /></SEOWrapper></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><SEOWrapper page="privacy"><PrivacyPage /></SEOWrapper></PageTransition>} />
        <Route path="/blog" element={<PageTransition><SEOWrapper page="blog"><BlogPage /></SEOWrapper></PageTransition>} />
        <Route path="/blog/:id" element={<PageTransition><BlogPostPage /></PageTransition>} />
        <Route path="/poistenie" element={<PageTransition><SEOWrapper page="poistenie"><PoisteniePage /></SEOWrapper></PageTransition>} />
        <Route path="/autouvery" element={<PageTransition><SEOWrapper page="autouvery"><AutouveryPage /></SEOWrapper></PageTransition>} />
        <Route path="/sprostredkovanie" element={<PageTransition><SEOWrapper page="sprostredkovanie"><SprostredkovaniePage /></SEOWrapper></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    // Initialize GSAP and Lenis when component mounts
    const lenis = initGSAPAnimations();
    initScrollAnimations();

    // Cleanup function
    return () => {
      if (lenis && typeof lenis.destroy === 'function') {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <DefaultLayout>
        <AnimatedRoutes />
      </DefaultLayout>
      <ApiStatus />
    </Router>
  );
}

export default App;
