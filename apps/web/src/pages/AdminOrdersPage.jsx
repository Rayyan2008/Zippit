import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, Send } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getOrders, updateOrderStatus, deleteOrder, getCategories } from '../lib/db';
import { sendWhatsAppMessage } from '../services/whatsapp';

const FILTER_STATUS_OPTIONS = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const ORDER_STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLES = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Processing: 'bg-purple-50 text-purple-700 border-purple-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-rouge/10 text-rouge border-rouge/20',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const order = orders.find(o => o.id === id);
      const updated = await updateOrderStatus(id, status);
      
      // Send WhatsApp notification to customer
      if (order?.customer_phone) {
        const statusMessages = {
          'Confirmed': `🎉 Great! Your BLOOM order ${order.order_number} has been confirmed. We'll process it shortly.`,
          'Processing': `📦 Your order ${order.order_number} is being processed. We're preparing your items!`,
          'Shipped': `🚚 Your order ${order.order_number} has been shipped! Track it here: ${window.location.origin}/order-tracking`,
          'Delivered': `✨ Your BLOOM order ${order.order_number} has been delivered! Thank you for shopping with us! 💛`,
          'Cancelled': `❌ Your order ${order.order_number} has been cancelled. Please contact support for assistance.`,
        };
        
        const message = statusMessages[status] || `Your order ${order.order_number} status is now: ${status}`;
        await sendWhatsAppMessage(order.customer_phone, message);
      }
      
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
    } catch (e) { setError(e.message); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this delivered order? This cannot be undone.')) return;
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (e) { setError(e.message); }
  };

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  const filterOrders = (orderList) => orderList.filter(o => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = o.order_number?.toLowerCase().includes(searchLower) ||
      o.customer_name?.toLowerCase().includes(searchLower) ||
      o.customer_email?.toLowerCase().includes(searchLower);
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredActive = filterOrders(activeOrders);
  const filteredDelivered = filterOrders(deliveredOrders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Orders</h1>
        <p className="eyebrow text-ink/60 dark:text-cream/60">Manage customer orders</p>
      </div>

      {error && <div className="bg-rouge/10 border border-rouge/20 text-rouge px-4 py-3 text-sm">{error}</div>}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search orders..." className="pl-9 border-ink/15 text-ink dark:text-cream dark:bg-card" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-ink/15 dark:border-ink/30 bg-background dark:bg-card text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-rouge/50">
          {FILTER_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
              <h2 className="font-display text-lg text-ink dark:text-cream">Active Orders</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-ink/40 dark:text-cream/40">Loading orders…</div>
            ) : filteredActive.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-ink/20 dark:text-cream/20 mx-auto mb-3" />
                <p className="text-ink/60 dark:text-cream/60">No active orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">ORDER</th>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">CUSTOMER</th>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">TOTAL</th>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">STATUS</th>
                      <th className="px-4 py-3 text-right text-xs eyebrow text-ink/60 dark:text-cream/60">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 dark:divide-ink/20">
                    {filteredActive.map(order => (
                      <tr key={order.id} className="hover:bg-cream/50 dark:hover:bg-card/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-ink dark:text-cream">{order.order_number}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-ink dark:text-cream">{order.customer_name}</p>
                          <p className="text-xs text-ink/50 dark:text-cream/50">{order.customer_email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-ink dark:text-cream">₹{order.total}</td>
                        <td className="px-4 py-3">
                          <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs px-2 py-1 border font-medium focus:outline-none ${STATUS_STYLES[order.status] || ''}`}>
                            {ORDER_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setSelectedOrder(order)} className="text-rouge hover:text-wine">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
              <h2 className="font-display text-lg text-ink dark:text-cream">Delivered Orders</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-ink/40 dark:text-cream/40">Loading delivered orders…</div>
            ) : filteredDelivered.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-ink/20 dark:text-cream/20 mx-auto mb-3" />
                <p className="text-ink/60 dark:text-cream/60">No delivered orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">ORDER</th>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">CUSTOMER</th>
                      <th className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">TOTAL</th>
                      <th className="px-4 py-3 text-right text-xs eyebrow text-ink/60 dark:text-cream/60">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 dark:divide-ink/20">
                    {filteredDelivered.map(order => (
                      <tr key={order.id} className="hover:bg-cream/50 dark:hover:bg-card/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-ink dark:text-cream">{order.order_number}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-ink dark:text-cream">{order.customer_name}</p>
                          <p className="text-xs text-ink/50 dark:text-cream/50">{order.customer_email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-ink dark:text-cream">₹{order.total}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => setSelectedOrder(order)} className="text-rouge hover:text-wine">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDeleteOrder(order.id)} className="text-rouge hover:text-wine">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail */}
        <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
          {selectedOrder ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg text-ink dark:text-cream">{selectedOrder.order_number}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-ink dark:text-cream"><span className="text-ink/60 dark:text-cream/60">Customer:</span> {selectedOrder.customer_name}</p>
                <p className="text-ink dark:text-cream"><span className="text-ink/60 dark:text-cream/60">Email:</span> {selectedOrder.customer_email}</p>
                <p className="text-ink dark:text-cream"><span className="text-ink/60 dark:text-cream/60">Phone:</span> {selectedOrder.customer_phone || 'N/A'}</p>
                <p className="text-ink dark:text-cream"><span className="text-ink/60 dark:text-cream/60">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">SHIPPING ADDRESS</p>
                  <p className="text-sm text-ink dark:text-cream">
                    {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">ITEMS</p>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, i) => {
                    const itemPrice = parseFloat(item.price || 0);
                    const category = item.category || 'Uncategorized';
                    return (
                      <div key={i} className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-ink dark:text-cream">
                            {item.product_name || item.variant_title || 'Unknown item'} × {item.quantity}
                          </span>
                          <span className="text-ink dark:text-cream">
                            ₹{(itemPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs eyebrow text-ink/60 dark:text-cream/60">Category</span>
                          <select
                            className="px-3 py-1 border border-ink/15 dark:border-ink/30 bg-background dark:bg-card text-ink dark:text-cream text-xs"
                            value={category}
                            onChange={(e) => {
                              const next = selectedOrder;
                              const items = Array.isArray(next.items) ? next.items.slice() : [];
                              if (items[i]) items[i] = { ...items[i], category: e.target.value };
                              setSelectedOrder({ ...next, items });
                            }}
                          >
                            {(categories || []).map((c) => (
                              <option key={c.id ?? c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                            {!categories?.length && (
                              <option value={category}>{category}</option>
                            )}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-ink/10 dark:border-ink/20 pt-3 space-y-1">
                {(() => {
                  const subtotal = (selectedOrder.items || []).reduce(
                    (sum, item) => sum + ((parseFloat(item.price || 0) || 0) * item.quantity),
                    0
                  );
                  const shippingCost = parseFloat(selectedOrder.shipping_cost || 0) || 0;
                  return (
                    <>
                      <div className="flex justify-between text-sm text-ink/60 dark:text-cream/60">
                        <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-ink/60 dark:text-cream/60">
                        <span>Shipping</span><span>₹{shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-ink dark:text-cream">
                        <span>Total</span><span>₹{(parseFloat(selectedOrder.total) || (subtotal + shippingCost)).toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="text-center text-ink/40 dark:text-cream/40 py-12">
              <Eye className="h-10 w-10 mx-auto mb-3" />
              <p className="text-sm">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}