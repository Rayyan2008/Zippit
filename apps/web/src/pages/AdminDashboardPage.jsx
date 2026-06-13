import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, ShoppingCart, AlertCircle, MessageSquare, ArrowUpRight } from 'lucide-react';
import { getDashboardStats, resetDashboardData } from '../lib/db';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalInquiries: 0, pendingOrders: 0, lowStockProducts: 0, chartData: [], recentOrders: [], recentInquiries: [] });
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);

  const { login } = useAuth();

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    { label: 'TOTAL PRODUCTS', value: stats.totalProducts, icon: Package, bg: 'bg-blush/30', iconColor: 'text-rouge', sub: stats.lowStockProducts > 0 ? `${stats.lowStockProducts} low stock` : 'All stocked', subColor: stats.lowStockProducts > 0 ? 'text-rouge' : 'text-ink/60 dark:text-cream/60' },
    { label: 'TOTAL ORDERS', value: stats.totalOrders, icon: ShoppingCart, bg: 'bg-parchment', iconColor: 'text-wine', sub: `${stats.pendingOrders} pending`, subColor: 'text-wine' },
    { label: 'TOTAL REVENUE', value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, bg: 'bg-accent/30', iconColor: 'text-rouge', sub: `From ${stats.totalOrders} orders`, subColor: 'text-ink/60 dark:text-cream/60' },
    { label: 'INQUIRIES', value: stats.totalInquiries, icon: MessageSquare, bg: 'bg-muted', iconColor: 'text-ink dark:text-cream', sub: 'Customer messages', subColor: 'text-ink/60 dark:text-cream/60' },
  ];

  const handleResetDashboard = async () => {
    if (!resetConfirmed) {
      setResetError('Please confirm that you are sure.');
      return;
    }

    setResetLoading(true);
    setResetError(null);

    try {
      await login(resetEmail, resetPassword);
      await resetDashboardData();
      await loadStats();
      setShowReset(false);
      setResetEmail('');
      setResetPassword('');
      setResetConfirmed(false);
    } catch (e) {
      setResetError(e.message || 'Reset failed. Check credentials.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-display-md text-ink dark:text-cream mb-2">Dashboard</h1>
        <p className="eyebrow text-ink/60 dark:text-cream/60">Overview of your store performance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6 animate-pulse h-32" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">{card.label}</p>
                    <p className="font-display text-3xl text-ink dark:text-cream">{card.value}</p>
                  </div>
                  <div className={`p-3 ${card.bg}`}><card.icon className={`h-5 w-5 ${card.iconColor}`} /></div>
                </div>
                <p className={`text-xs flex items-center gap-1 ${card.subColor}`}>
                  <ArrowUpRight className="h-3 w-3" />{card.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="border border-rouge/20 bg-rouge/5 rounded-xl p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-lg text-rouge">Reset Dashboard</h2>
                <p className="text-sm text-rouge/70">Clear dashboard-specific history data. Orders and inquiries will remain intact. Requires admin credentials and confirmation.</p>
              </div>
              <button type="button" onClick={() => setShowReset(prev => !prev)}
                className="rounded-full border border-rouge px-4 py-2 text-sm font-medium text-rouge hover:bg-rouge/10 transition">
                {showReset ? 'Hide reset form' : 'Reset dashboard'}
              </button>
            </div>

            {showReset && (
              <div className="mt-6 space-y-4 bg-cream/70 dark:bg-card/90 border border-rouge/20 rounded-xl p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-ink dark:text-cream">
                    Admin Email
                    <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full rounded-lg border border-ink/15 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-rouge focus:ring-2 focus:ring-rouge/20" />
                  </label>
                  <label className="space-y-2 text-sm text-ink dark:text-cream">
                    Password
                    <input type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full rounded-lg border border-ink/15 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-rouge focus:ring-2 focus:ring-rouge/20" />
                  </label>
                </div>
                <label className="flex items-center gap-3 text-sm text-ink dark:text-cream">
                  <input type="checkbox" checked={resetConfirmed} onChange={(e) => setResetConfirmed(e.target.checked)}
                    className="h-4 w-4 rounded border-ink/15 text-rouge focus:ring-rouge/50" />
                  <span>I am sure. Reset dashboard data permanently.</span>
                </label>
                {resetError && <div className="rounded-lg bg-rouge/10 border border-rouge/20 px-4 py-3 text-sm text-rouge">{resetError}</div>}
                <button type="button" onClick={handleResetDashboard}
                  disabled={resetLoading || !resetEmail || !resetPassword || !resetConfirmed}
                  className="inline-flex items-center justify-center rounded-full bg-rouge px-5 py-2 text-sm font-semibold text-cream transition disabled:cursor-not-allowed disabled:bg-rouge/40">
                  {resetLoading ? 'Resetting…' : 'Confirm reset'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
              <h2 className="font-display text-lg text-ink dark:text-cream mb-6">Sales & Orders Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
                  <YAxis stroke="rgba(0,0,0,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: '#f5f0eb', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#c0304a" strokeWidth={2} name="Revenue (₹)" />
                  <Line type="monotone" dataKey="orders" stroke="#6b2737" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
              <h2 className="font-display text-lg text-ink dark:text-cream mb-6">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
                  <YAxis stroke="rgba(0,0,0,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: '#f5f0eb', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="sales" fill="#c0304a" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
              <h2 className="font-display text-lg text-ink dark:text-cream mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {stats.recentOrders.length > 0 ? stats.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between border-b border-ink/10 dark:border-ink/20 pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-mono text-ink dark:text-cream">{order.order_number || `#${order.id?.slice(0,8)}`}</p>
                      <p className="text-xs text-ink/60 dark:text-cream/60">₹{order.total}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blush/30 text-wine border border-rouge/20">{order.status}</span>
                  </div>
                )) : <p className="text-sm text-ink/60 dark:text-cream/60">No orders yet</p>}
              </div>
            </div>
            <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
              <h2 className="font-display text-lg text-ink dark:text-cream mb-4">Recent Inquiries</h2>
              <div className="space-y-3">
                {stats.recentInquiries.length > 0 ? stats.recentInquiries.map(inq => (
                  <div key={inq.id} className="flex items-center justify-between border-b border-ink/10 dark:border-ink/20 pb-3 last:border-0">
                    <div>
                      <p className="text-sm text-ink dark:text-cream">{inq.name}</p>
                      <p className="text-xs text-ink/60 dark:text-cream/60">{inq.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 border ${inq.status === 'New' ? 'bg-rouge/10 text-rouge border-rouge/20' : 'bg-muted text-ink/60 dark:text-cream/60 border-ink/10'}`}>{inq.status}</span>
                  </div>
                )) : <p className="text-sm text-ink/60 dark:text-cream/60">No inquiries yet</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}