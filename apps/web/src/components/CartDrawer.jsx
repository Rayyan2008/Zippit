import React, { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { formatCurrency } from '@/data/EcommerceApi';
import { useCart } from '@/hooks/useCart.jsx';

const CartDrawer = ({ open, onOpenChange }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const subtotal = getCartTotal();
  const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  
  // Assuming free shipping target is 250 (adjust if your API uses cents)
  const freeShippingTarget = 250;
  const remaining = Math.max(0, freeShippingTarget - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingTarget) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[92vw] sm:w-[460px] bg-cream text-ink border-l border-ink/10 p-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="font-display text-2xl tracking-tightest">Your Bag</span>
              <span className="eyebrow text-ink/55">({totalCount})</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close cart"
              data-cursor="hover"
              className="inline-flex h-9 w-9 items-center justify-center transition hover:opacity-60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-ink/10">
            {remaining > 0 ? (
              <p className="text-sm text-ink/70">
                You're <span className="font-mono">{formatCurrency(remaining)}</span> away from
                complimentary shipping.
              </p>
            ) : (
              <p className="text-sm text-rouge">Complimentary shipping unlocked.</p>
            )}
            <div className="mt-2 h-1 bg-ink/10 overflow-hidden">
              <div
                className="h-full bg-rouge transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 py-20">
                <ShoppingBag className="h-10 w-10 text-ink/30" />
                <h3 className="mt-5 font-display text-2xl tracking-tightest">
                  Your bag is empty.
                </h3>
                <p className="mt-2 text-sm text-ink/60 max-w-xs">
                  Begin with a signature piece. Tailored, considered, made to last.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  data-cursor="hover"
                  className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 text-cream eyebrow transition hover:bg-rouge"
                >
                  Browse the collection
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-ink/10">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.variant?.id}`} className="flex gap-4 px-6 py-5">
                    <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden bg-parchment">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-display text-lg tracking-tightest truncate">
                            {item.title}
                          </h4>
                          {item.variant?.title && (
                            <div className="text-xs text-ink/60 mt-0.5">{item.variant.title}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.variant?.id)}
                          aria-label={`Remove ${item.title}`}
                          data-cursor="hover"
                          className="text-ink/40 transition hover:text-rouge"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-ink/15">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.variant?.id, Math.max(1, item.quantity - 1))}
                            aria-label="Decrease quantity"
                            data-cursor="hover"
                            className="h-8 w-8 inline-flex items-center justify-center transition hover:bg-ink hover:text-cream"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 font-mono text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            data-cursor="hover"
                            className="h-8 w-8 inline-flex items-center justify-center transition hover:bg-ink hover:text-cream"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="font-mono text-sm">
                          {(() => {
                            // Just one price: prefer sale/discount if present, otherwise original.
                            const cents = item.variant?.sale_price_in_cents ?? item.variant?.price_in_cents;
                            if (cents !== undefined) {
                              return formatCurrency((cents / 100) * item.quantity);
                            }

                            const priceFormatted = item.variant?.price_formatted ?? '';
                            const price = parseFloat(String(priceFormatted).replace(/[^\d.]/g, '')) || item.product?.price || 0;
                            return formatCurrency(price * item.quantity);
                          })()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-ink/10 px-6 py-5 space-y-4 bg-cream">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-ink/60">Subtotal</span>
                <span className="font-display text-2xl tracking-tightest">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-xs text-ink/55">
                Taxes and shipping calculated at checkout.
              </p>
              <button
                type="button"
                data-cursor="hover"
                className="w-full inline-flex items-center justify-center gap-2 bg-ink px-6 py-4 text-cream eyebrow transition hover:bg-rouge"
              >
                Checkout — {formatCurrency(subtotal)}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                data-cursor="hover"
                className="w-full eyebrow text-ink/60 link-underline"
              >
                Continue shopping
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;