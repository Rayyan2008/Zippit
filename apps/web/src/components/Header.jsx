import React, { useEffect, useState } from 'react';
import { Heart, Menu, Package, Search, ShoppingBag, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { site } from '@/data/site.js';
import ThemeToggle from '@/components/ThemeToggle.jsx';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useCart } from '@/hooks/useCart.jsx';

const Header = ({ onOpenCart, onOpenSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const wishlist = useWishlist();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setIsOpen(false);

  const navLinks = site.nav.primary;

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-[background-color,backdrop-filter,height] duration-500 ${scrolled
          ? 'bg-cream/85 backdrop-blur-md border-ink/10'
          : 'bg-cream/0 border-transparent'
        }`}
    >
      <div className="container mx-auto">
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ${scrolled ? 'h-14' : 'h-20'
            }`}
        >
          <div className="flex items-center gap-1 md:gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  data-cursor="hover"
                  className="inline-flex h-10 w-10 items-center justify-center text-ink transition hover:opacity-60"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[92vw] sm:w-[480px] bg-cream text-ink border-r border-ink/10 p-0"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
                    <span className="font-display text-2xl tracking-tightest">
                      {site.brand.wordmark}
                    </span>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={close}
                      className="inline-flex h-9 w-9 items-center justify-center transition hover:opacity-60"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-6 py-8">
                    <ul className="flex flex-col">
                      {navLinks.map((link, i) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            onClick={close}
                            className={`group flex items-baseline justify-between border-b border-ink/10 py-5 font-display text-3xl tracking-tightest transition ${
                              isActive(link.href) ? 'text-rouge' : 'hover:text-rouge'
                            }`}
                          >
                            <span>{link.label}</span>
                            <span className={`eyebrow transition ${
                              isActive(link.href) ? 'text-rouge' : 'text-ink/40 group-hover:text-rouge'
                            }`}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10 grid grid-cols-2 gap-3">
                      {site.nav.utility.map((u) => (
                        <button
                          key={u.label}
                          type="button"
                          onClick={() => {
                            close();
                            if (u.label === 'Search') onOpenSearch?.();
                          }}
                          className="eyebrow border border-ink/15 px-4 py-3 text-left transition hover:border-ink hover:bg-ink hover:text-cream flex items-center justify-between"
                        >
                          {u.label}
                          {u.shortcut && (
                            <span className="font-mono text-[10px] opacity-70">{u.shortcut}</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <span className="eyebrow text-ink/55">Theme</span>
                      <ThemeToggle label />
                    </div>
                  </nav>

                  <div className="border-t border-ink/10 px-6 py-5 eyebrow text-ink/60">
                    {site.brand.address}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <nav className="hidden lg:flex items-center gap-7 pl-2">
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-cursor="hover"
                  className={`link-underline eyebrow transition ${
                    isActive(link.href) ? 'text-rouge font-semibold' : 'text-ink hover:text-rouge'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            to="/"
            data-cursor="hover"
            className="font-display text-2xl md:text-3xl tracking-tightest text-ink transition hover:text-rouge"
            aria-label={`${site.brand.name} — home`}
          >
            {site.brand.wordmark}
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-2">
            <button
              type="button"
              onClick={onOpenSearch}
              data-cursor="hover"
              aria-label="Open search (⌘K)"
              className="hidden sm:inline-flex h-10 items-center gap-2 px-2 text-ink transition hover:opacity-60"
            >
              <Search className="h-5 w-5" />
              <kbd className="hidden xl:inline-flex h-5 items-center px-1.5 font-mono text-[10px] uppercase tracking-[0.18em] border border-ink/20 text-ink/60">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle className="hidden md:inline-flex" />

            <Link
              to="/shop"
              aria-label={`Wishlist — ${wishlist.count} item${wishlist.count === 1 ? '' : 's'}`}
              data-cursor="hover"
              className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center text-ink transition hover:opacity-60"
            >
              <Heart
                className={`h-5 w-5 transition ${wishlist.count > 0 ? 'fill-rouge text-rouge' : ''}`}
              />
              {wishlist.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rouge px-1 text-[10px] font-semibold text-cream">
                  {wishlist.count}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={onOpenCart}
              data-cursor="hover"
              aria-label={`Open bag, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              className="relative inline-flex h-10 items-center gap-2 px-2 text-ink transition hover:opacity-60"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="eyebrow hidden sm:inline">
                Bag <span className="ml-1 text-ink/60">({cartCount})</span>
              </span>
              {cartCount > 0 && (
                <span className="sm:hidden absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rouge px-1 text-[10px] font-semibold text-cream">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/order-tracking"
              data-cursor="hover"
              aria-label="Track order"
              className="hidden sm:inline-flex h-10 items-center gap-2 px-2 text-ink transition hover:opacity-60"
            >
              <Package className="h-5 w-5" />
              <span className="eyebrow">Track</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;