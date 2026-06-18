import React, { useEffect, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import {
  ArrowRight,
  Heart,
  MapPin,
  Moon,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { site } from '@/data/site.js';
import { getProducts, formatCurrency } from '@/data/EcommerceApi';

const CommandPalette = ({ open, onOpenChange, onOpenCart, onToggleTheme }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  useEffect(() => {
    if (open && products.length === 0 && !loadingProducts) {
      setLoadingProducts(true);
      getProducts({ limit: 10 })
        .then((res) => {
          setProducts(res.products || []);
        })
        .catch((err) => console.error('Failed to fetch products for command palette:', err))
        .finally(() => setLoadingProducts(false));
    }
  }, [open, products.length, loadingProducts]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  const sections = useMemo(
    () =>
      site.nav.primary.map((n) => ({
        id: n.href,
        label: n.label,
        href: n.href,
      })),
    [],
  );

  const go = (href) => {
    onOpenChange(false);
    if (href.startsWith('#')) {
      window.requestAnimationFrame(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.location.assign(href);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative mx-auto mt-[8vh] max-w-2xl px-4">
        <Command
          label="Site command palette"
          className="overflow-hidden border border-ink/15 bg-cream text-ink shadow-2xl animate-fade-up"
        >
          <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
            <Search className="h-4 w-4 text-ink/55" />
            <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Search BLOOM — pieces, sections, actions…"
              className="flex-1 bg-transparent text-base text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex h-6 items-center px-2 font-mono text-[10px] uppercase tracking-[0.2em] border border-ink/15 text-ink/60">
              Esc
            </kbd>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-7 w-7 items-center justify-center text-ink/55 transition hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto px-2 py-3">
            <Command.Empty className="px-4 py-10 text-center text-sm text-ink/55">
              No results — try “scrunchies”, “handbags”, or “shipping”.
            </Command.Empty>

            <Command.Group
              heading="Navigate"
              className="[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-ink/45"
            >
              {sections.map((s) => (
                <Command.Item
                  key={s.id}
                  value={`navigate ${s.label}`}
                  onSelect={() => go(s.href)}
                  className="group flex items-center justify-between gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-display text-lg tracking-tightest">{s.label}</span>
                  </div>
                  <span className="eyebrow opacity-60">Section</span>
                </Command.Item>
              ))}
            </Command.Group>

            {products.length > 0 && (
              <Command.Group
                heading="Pieces"
                className="[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-ink/45"
              >
                {products.map((p) => (
                  <Command.Item
                    key={p.id}
                    value={`piece ${p.title} ${p.subtitle || ''}`}
                    onSelect={() => go(`/product/${p.id}`)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-8 object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base tracking-tightest truncate">
                        {p.title}
                      </div>
                      {p.subtitle && (
                        <div className="eyebrow opacity-60 truncate">
                          {p.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="font-mono text-sm">
                      {p.variants?.[0]?.price_formatted || formatCurrency(p.price)}
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-60" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-ink/45"
            >
              <Command.Item
                value="open bag cart shopping"
                onSelect={() => {
                  onOpenChange(false);
                  onOpenCart?.();
                }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="font-display text-lg tracking-tightest flex-1">Open Bag</span>
                <span className="eyebrow opacity-60">Action</span>
              </Command.Item>
              <Command.Item
                value="toggle theme dark mode light"
                onSelect={() => {
                  onToggleTheme?.();
                  onOpenChange(false);
                }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
              >
                <span className="relative inline-block h-4 w-4">
                  <Sun className="h-4 w-4 dark:hidden" />
                  <Moon className="h-4 w-4 hidden dark:block" />
                </span>
                <span className="font-display text-lg tracking-tightest flex-1">Toggle theme</span>
                <span className="eyebrow opacity-60">Action</span>
              </Command.Item>
              <Command.Item
                value="wishlist favorites saved"
                onSelect={() => go('#collection')}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
              >
                <Heart className="h-4 w-4" />
                <span className="font-display text-lg tracking-tightest flex-1">View wishlist</span>
                <span className="eyebrow opacity-60">Action</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Help"
              className="[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-ink/45"
            >
              <Command.Item
                value="help shipping returns size guide"
                onSelect={() => go('#faq')}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-display text-lg tracking-tightest flex-1">FAQ</span>
                <span className="eyebrow opacity-60">Care</span>
              </Command.Item>
              <Command.Item
                value="visit stores locations paris london"
                onSelect={() => go('#contact')}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
              >
                <MapPin className="h-4 w-4" />
                <span className="font-display text-lg tracking-tightest flex-1">Find a studio</span>
                <span className="eyebrow opacity-60">Visit</span>
              </Command.Item>
              <Command.Item
                value="contact email atelier"
                onSelect={() => {
                  onOpenChange(false);
                  window.location.href = `mailto:${site.brand.email}`;
                }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-ink aria-selected:text-cream"
              >
                <Shirt className="h-4 w-4" />
                <span className="font-display text-lg tracking-tightest flex-1">
                  Email the atelier
                </span>
                <span className="eyebrow opacity-60">{site.brand.email}</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-5 py-3 bg-parchment/60">
            <div className="flex items-center gap-3 eyebrow text-ink/55">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span className="eyebrow text-ink/55">{site.brand.wordmark} · ⌘K</span>
          </div>
        </Command>
      </div>
    </div>
  );
};

export default CommandPalette;