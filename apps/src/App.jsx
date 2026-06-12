import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminSignupPage from './pages/AdminSignupPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminCouponsPage from './pages/AdminCouponsPage.jsx';
import AdminInquiriesPage from './pages/AdminInquiriesPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminSettingsPage from './pages/AdminSettingsPage.jsx';
import AdminCustomersPage from './pages/AdminCustomersPage.jsx';

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

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            onOpenCart={() => {}}
            onToggleTheme={() => {}}
          />
          <Routes>
            {/* Public Routes */}
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

            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/signup" element={<AdminSignupPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
