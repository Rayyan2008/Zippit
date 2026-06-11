import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx';
import ReturnPolicyPage from './pages/ReturnPolicyPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';

function App() {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onOpenCart={() => {}}
        onToggleTheme={() => {}}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping" element={<ShippingPolicyPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;