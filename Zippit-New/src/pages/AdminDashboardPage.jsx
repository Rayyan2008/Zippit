import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, AlertCircle, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalInquiries: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const products = JSON.parse(localStorage.getItem('zippit_products') || '[]');
    const orders = JSON.parse(localStorage.getItem('zippit_orders') || '[]');
    const inquiries = JSON.parse(localStorage.getItem('zippit_inquiries') || '[]');

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status !== 'Delivered').length;
    const lowStockProducts = products.filter(p => (p.stock || 0) < 5).length;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalInquiries: inquiries.length,
      pendingOrders,
      lowStockProducts,
    });

    setRecentOrders(orders.slice(-5).reverse());
    setRecentInquiries(inquiries.slice(-5).reverse());
  }, []);

  const chartData = [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 13 },
    { name: 'Mar', sales: 2000, orders: 9 },
    { name: 'Apr', sales: 2780, orders: 39 },
    { name: 'May', sales: 1890, orders: 24 },
    { name: 'Jun', sales: 2390, orders: 24 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-md text-ink mb-2">Dashboard</h1>
        <p className="eyebrow text-ink/60">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="border border-ink/10 bg-white p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs eyebrow text-ink/60 mb-1">TOTAL PRODUCTS</p>
              <p className="font-display text-3xl text-ink">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blush/30 border border-blush/50">
              <Package className="h-5 w-5 text-rouge" />
            </div>
          </div>
          {stats.lowStockProducts > 0 && (
            <div className="flex items-center gap-1 text-xs text-signal">
              <AlertCircle className="h-4 w-4" />
              {stats.lowStockProducts} low stock
            </div>
          )}
        </div>

        {/* Total Orders */}
        <div className="border border-ink/10 bg-white p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs eyebrow text-ink/60 mb-1">TOTAL ORDERS</p>
              <p className="font-display text-3xl text-ink">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-parchment border border-gold/50">
              <ShoppingCart className="h-5 w-5 text-wine" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-wine">
            <ArrowUpRight className="h-4 w-4" />
            {stats.pendingOrders} pending
          </div>
        </div>

        {/* Total Revenue */}
        <div className="border border-ink/10 bg-white p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs eyebrow text-ink/60 mb-1">TOTAL REVENUE</p>
              <p className="font-display text-3xl text-ink">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-accent/30 border border-accent">
              <TrendingUp className="h-5 w-5 text-rouge" />
            </div>
          </div>
          <p className="text-xs text-ink/60">From {stats.totalOrders} orders</p>
        </div>

        {/* Total Inquiries */}
        <div className="border border-ink/10 bg-white p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs eyebrow text-ink/60 mb-1">INQUIRIES</p>
              <p className="font-display text-3xl text-ink">{stats.totalInquiries}</p>
            </div>
            <div className="p-3 bg-muted border border-ink/20">
              <MessageSquare className="h-5 w-5 text-ink" />
            </div>
          </div>
          <p className="text-xs text-ink/60">Customer messages</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg text-ink mb-6">Sales & Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink) / 0.1)" />
              <XAxis dataKey="name" stroke="hsl(var(--ink) / 0.6)" />
              <YAxis stroke="hsl(var(--ink) / 0.6)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--cream))', border: '1px solid hsl(var(--ink) / 0.1)' }}
                labelStyle={{ color: 'hsl(var(--ink))' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--rouge))" strokeWidth={2} dot={{ fill: 'hsl(var(--rouge))' }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--wine))" strokeWidth={2} dot={{ fill: 'hsl(var(--wine))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg text-ink mb-6">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink) / 0.1)" />
              <XAxis dataKey="name" stroke="hsl(var(--ink) / 0.6)" />
              <YAxis stroke="hsl(var(--ink) / 0.6)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--cream))', border: '1px solid hsl(var(--ink) / 0.1)' }}
                labelStyle={{ color: 'hsl(var(--ink))' }}
              />
              <Bar dataKey="sales" fill="hsl(var(--rouge))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg text-ink mb-6">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="border-b border-ink/10 pb-3 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-ink">Order #{order.id.slice(0, 6)}</p>
                      <p className="text-xs text-ink/60">₹{order.total}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blush text-wine border border-rouge/20">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/60">No orders yet</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg text-ink mb-6">Recent Inquiries</h2>
          <div className="space-y-3">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="border-b border-ink/10 pb-3 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-ink truncate">{inquiry.name}</p>
                      <p className="text-xs text-ink/60 truncate">{inquiry.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 border ${
                      inquiry.status === 'New' ? 'bg-signal/20 text-signal border-signal/30' :
                      inquiry.status === 'Contacted' ? 'bg-gold/20 text-gold border-gold/30' :
                      'bg-muted text-ink/60 border-ink/20'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/60">No inquiries yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
