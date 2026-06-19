import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { getOrders } from '../lib/db.js';

const SuccessPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // React Router stores state via the `usr` key on the native History
  // entry, so it must be read through useLocation() — not by reading
  // window.history.state directly (that returns { usr, key, idx }).
  const orderNumberFromState = location.state?.orderNumber || null;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) Prefer fetching from Supabase using the order_number.
      // This guarantees TOTAL AMOUNT is the real stored order total.
      if (orderNumberFromState) {
        setLoading(true);
        try {
          const allOrders = await getOrders();
          const found = allOrders.find(
            (o) => o.order_number?.toUpperCase() === orderNumberFromState.toUpperCase()
          );

          if (!cancelled) {
            if (found) {
              setOrder(found);
            } else {
              // Fallback to localStorage if order not found.
              const lastOrder = localStorage.getItem('zippit_last_order');
              if (lastOrder) setOrder(JSON.parse(lastOrder));
            }
          }
        } catch (e) {
          if (cancelled) return;
          const lastOrder = localStorage.getItem('zippit_last_order');
          if (lastOrder) setOrder(JSON.parse(lastOrder));
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      // 2) No orderNumber in route state: fallback to localStorage.
      const lastOrder = localStorage.getItem('zippit_last_order');
      if (!cancelled && lastOrder) {
        setOrder(JSON.parse(lastOrder));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [orderNumberFromState]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed — Thank You</title>
        <meta name="description" content="Your order has been successfully placed." />
      </Helmet>

      <div className="min-h-screen bg-cream text-ink flex flex-col">
        <Header cartCount={0} />

        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rouge/10">
              <CheckCircle2 className="h-10 w-10 text-rouge" />
            </div>

            <div>
              <h1 className="font-display text-4xl md:text-5xl tracking-tightest text-ink mb-4">
                Order confirmed
              </h1>

              <p className="text-lg text-ink/70 leading-relaxed">
                Thank you for your purchase. You will receive a WhatsApp notification shortly with your order details.
              </p>
            </div>

            {order && (
              <div className="bg-parchment border border-ink/10 p-6 text-left space-y-3">
                <div>
                  <p className="text-xs eyebrow text-ink/60">ORDER NUMBER</p>
                  <p className="font-mono text-lg text-ink">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-xs eyebrow text-ink/60">TOTAL AMOUNT</p>
                  <p className="font-mono text-lg text-rouge">₹{order.total?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            )}

            {loading && !order && (
              <div className="text-sm text-ink/60">Loading your order…</div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-rouge text-cream hover:bg-wine">
                <Link to="/order-tracking" className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" />
                  Track Order
                </Link>
              </Button>
              <Button asChild className="bg-ink text-cream hover:bg-ink/90">
                <Link to="/shop">Shop more</Link>
              </Button>
              <Button asChild variant="outline" className="border-ink/15 text-ink hover:bg-ink hover:text-cream">
                <Link to="/">Back Home</Link>
              </Button>
            </div>

            <p className="text-xs text-ink/50">
              You can track your order anytime at{' '}
              <span className="text-ink/70">/order-tracking</span>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SuccessPage;