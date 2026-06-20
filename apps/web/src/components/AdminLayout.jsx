import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Menu, X, LayoutDashboard, Package, Tag, Ticket, MessageSquare, ShoppingCart, Settings, LogOut, Users } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CustomCursor from './CustomCursor';
import { supabase } from '../lib/supabase.js';
import { useToast } from '../hooks/use-toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const audioRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Tag },
    { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Realtime: notify (sound + toast) whenever a new order is inserted,
  // active for the whole admin section regardless of which page is open.
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');

    const channel = supabase
      .channel('new-orders-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new;

          audioRef.current?.play().catch(() => {
            // Autoplay can be blocked until the user interacts with the page once; safe to ignore.
          });

          toast({
            title: '🛍️ New order received!',
            description: `${order.order_number || 'Order'} — ₹${order.total} from ${order.customer_name || 'a customer'}`,
          });
        }
      )
      .subscribe((status, err) => {
        console.log('Realtime subscription status:', status, err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-cream text-ink">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-cream border-r border-ink/10 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-72' : 'w-0 lg:w-20'
        } overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="border-b border-ink/10 px-6 py-6 flex items-center justify-between flex-shrink-0">
          <Link
            to="/"
            className="font-display text-2xl tracking-tightest text-ink hover:text-rouge transition-colors duration-300"
          >
            Bloom
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center text-ink hover:opacity-60 transition-opacity"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Admin Info */}
        <div className={`border-b border-ink/10 px-6 py-4 ${!sidebarOpen && 'lg:px-3'}`}>
          <div className="text-[10px] eyebrow text-ink/60 mb-2">ADMIN PANEL</div>
          <div className={`text-sm font-medium text-ink truncate ${!sidebarOpen && 'lg:hidden'}`}>
            {user?.email || 'Administrator'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      // Only close sidebar on mobile, not desktop
                      if (window.innerWidth < 1024 && sidebarOpen) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 px-3 py-3 transition-all duration-300 border ${
                      isActive(item.path)
                        ? 'bg-ink text-cream border-ink'
                        : 'text-ink border-ink/10 hover:border-rouge hover:text-rouge hover:bg-blush/20'
                    } ${!sidebarOpen && 'lg:justify-center'}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className={`text-sm font-medium transition-opacity ${!sidebarOpen && 'lg:hidden'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="border-t border-ink/10 px-3 py-4 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className={`w-full justify-center lg:justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all ${
              !sidebarOpen && 'lg:px-3'
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-ink/10 bg-cream/95 backdrop-blur-sm sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center text-ink hover:opacity-60 transition-opacity"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <div className="text-xs eyebrow text-ink/60 mb-1">WELCOME BACK</div>
                <div className="text-sm font-medium text-ink">{user?.email || 'Administrator'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink hover:opacity-60 transition-opacity"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <CustomCursor />
    </div>
  );
}