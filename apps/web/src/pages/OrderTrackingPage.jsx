import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Package, MapPin, CheckCircle, Clock, Truck, Home } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getOrders } from '@/lib/db.js';
import { site } from '@/data/site.js';

const STATUS_TIMELINE = {
  'Pending': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  'Confirmed': { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Processing': { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  'Shipped': { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Delivered': { icon: Home, color: 'text-green-600', bg: 'bg-green-50' },
  'Cancelled': { icon: Package, color: 'text-red-600', bg: 'bg-red-50' },
};

const STATUS_ORDER = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderTrackingPage() {
  const [searchBy, setSearchBy] = useState('order'); // 'order' or 'email'
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const allOrders = await getOrders();
      
      let found = null;
      if (searchBy === 'order') {
        found = allOrders.find(o => o.order_number?.toUpperCase() === searchValue.toUpperCase());
        if (!found) {
          setError('Order not found. Please check the order number.');
        }
      } else {
        found = allOrders.find(o => o.customer_email?.toLowerCase() === searchValue.toLowerCase());
        if (!found) {
          setError('No orders found for this email address.');
        }
      }

      if (found) {
        setOrder(found);
      }
    } catch (err) {
      setError('Failed to search orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return STATUS_ORDER.indexOf(status) || 0;
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <>
      <Helmet>
        <title>{`Track Order — ${site.brand.name}`}</title>
        <meta name="description" content="Track your Zippit order status in real-time." />
      </Helmet>

      <div className="min-h-screen bg-cream text-ink">
        <Header />

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="mb-12 text-center">
            <h1 className="font-display text-display-md text-ink mb-3 leading-[0.95]">
              Track Your Order
            </h1>
            <p className="text-lg text-ink/70 max-w-xl mx-auto">
              Enter your order number or email to see the current status of your Zippit order.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setSearchBy('order'); setOrder(null); }}
                  className={`px-4 py-2 eyebrow border-2 transition ${
                    searchBy === 'order'
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-transparent text-ink border-ink/15 hover:border-ink'
                  }`}
                >
                  By Order Number
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchBy('email'); setOrder(null); }}
                  className={`px-4 py-2 eyebrow border-2 transition ${
                    searchBy === 'email'
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-transparent text-ink border-ink/15 hover:border-ink'
                  }`}
                >
                  By Email
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/40" />
                  <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={searchBy === 'order' ? 'e.g., ORD-1234567890' : 'e.g., your@email.com'}
                    className="pl-10 border-ink/15 text-ink"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-ink text-cream hover:bg-ink/90 px-6"
                >
                  {loading ? 'Searching...' : 'Track'}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
                {error}
              </div>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Order Header */}
              <div className="border border-ink/10 bg-parchment p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs eyebrow text-ink/60 mb-1">ORDER NUMBER</p>
                    <p className="font-mono text-lg text-ink">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-xs eyebrow text-ink/60 mb-1">ORDER DATE</p>
                    <p className="text-sm text-ink">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs eyebrow text-ink/60 mb-1">TOTAL AMOUNT</p>
                    <p className="font-mono text-lg text-ink">₹{order.total?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs eyebrow text-ink/60 mb-1">STATUS</p>
                    <p className={`text-sm font-medium ${STATUS_TIMELINE[order.status]?.color || 'text-ink'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="border border-ink/10 p-6">
                <h2 className="font-display text-lg text-ink mb-6">Delivery Timeline</h2>
                <div className="space-y-4">
                  {STATUS_ORDER.map((status, index) => {
                    const Icon = STATUS_TIMELINE[status]?.icon || Package;
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = order.status === status;

                    return (
                      <div key={status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                              isActive
                                ? `${STATUS_TIMELINE[status].bg} ${STATUS_TIMELINE[status].color}`
                                : 'bg-ink/5 text-ink/30'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          {index < STATUS_ORDER.length - 1 && (
                            <div
                              className={`w-1 h-12 mt-1 transition ${
                                isActive ? 'bg-ink/30' : 'bg-ink/10'
                              }`}
                            />
                          )}
                        </div>

                        <div className="pt-1 pb-4">
                          <h3 className={`font-medium text-sm transition ${isCurrent ? 'text-ink font-display' : isActive ? 'text-ink' : 'text-ink/40'}`}>
                            {status}
                          </h3>
                          <p className={`text-xs mt-1 transition ${isCurrent ? 'text-rouge' : isActive ? 'text-ink/60' : 'text-ink/30'}`}>
                            {isCurrent && '✓ Current status'}
                            {!isActive && !isCurrent && 'Pending'}
                            {isActive && !isCurrent && 'Completed'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="border border-ink/10 p-6">
                  <h3 className="font-display text-lg text-ink mb-4">Customer Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs eyebrow text-ink/60">Name</p>
                      <p className="text-ink">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs eyebrow text-ink/60">Email</p>
                      <p className="text-ink break-all">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs eyebrow text-ink/60">Phone</p>
                      <p className="text-ink">{order.customer_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="border border-ink/10 p-6">
                    <h3 className="font-display text-lg text-ink mb-4">Shipping Address</h3>
                    <div className="space-y-1 text-sm text-ink">
                      <p>{order.shipping_address.address}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                      <p>{order.shipping_address.pincode}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items & Price Summary */}
              {order.items && order.items.length > 0 ? (
                <div className="border border-ink/10 p-6 space-y-6">
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-ink/5 pb-3">
                          <div>
                            <p className="text-sm font-medium text-ink">{item.product_name || item.name}</p>
                            <p className="text-xs text-ink/60">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-mono text-sm text-ink">
                            ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-ink/10 pt-4 space-y-2">
                    {(() => {
                      const subtotal = order.items.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);
                      const shipping = order.shipping_cost || 0;
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-ink/70">Subtotal</span>
                            <span className="font-mono text-ink">₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-ink/70">Shipping</span>
                            <span className="font-mono text-ink">₹{shipping.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-display border-t border-ink/10 pt-2 mt-2">
                            <span className="text-ink">Total</span>
                            <span className="font-mono text-rouge">₹{order.total?.toFixed(2) || (subtotal + shipping).toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="border border-ink/10 p-6">
                  <h3 className="font-display text-lg text-ink mb-4">Order Items</h3>
                  <p className="text-ink/60">No items found for this order.</p>
                </div>
              )}

              {/* Help */}
              <div className="bg-ink/5 border border-ink/10 p-6 text-center">
                <p className="text-sm text-ink/70 mb-4">
                  Have questions about your order? Contact our support team.
                </p>
                <a href="/contact" className="text-rouge hover:text-wine font-medium">
                  Contact Support
                </a>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!order && !loading && !error && (
            <div className="max-w-3xl mx-auto text-center py-12">
              <Package className="h-16 w-16 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60">Enter your order number or email to track your order</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
