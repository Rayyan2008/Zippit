import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { initiateRazorpayPayment } from '@/components/RazorpayCheckout.jsx';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const total = getCartTotal() || 0;

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setCheckingOut(true);

    try {
      await initiateRazorpayPayment({
        amount: total,
        currency: 'INR',
        customerName: 'Customer',
        customerEmail: 'customer@example.com',
        customerPhone: '',
        onSuccess: (orderData) => {
          clearCart();
          setIsCartOpen(false);
          setCheckingOut(false);
          
          toast({
            title: 'Payment successful',
            description: 'Your order has been placed successfully.',
          });
          
          navigate('/success');
        },
        onFailure: (error) => {
          setCheckingOut(false);
          toast({
            title: 'Payment failed',
            description: error || 'Please try again.',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      setCheckingOut(false);
      toast({
        title: 'Checkout error',
        description: error.message || 'Unable to process checkout.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[480px] bg-cream text-ink border-l border-ink/10 p-0 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-display text-2xl tracking-tightest">Your Bag</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="inline-flex h-9 w-9 items-center justify-center transition hover:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!cartItems || cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
            <ShoppingBag className="h-16 w-16 text-ink/20 mb-6" />
            <h3 className="font-display text-2xl text-ink mb-3">Your bag is empty</h3>
            <p className="text-sm text-ink/60 mb-8 max-w-xs">
              Start adding handmade pouches to your collection
            </p>
            <Link to="/shop">
              <Button
                onClick={() => setIsCartOpen(false)}
                className="bg-ink text-cream hover:bg-ink/90"
              >
                Shop Collection
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-6">
                {cartItems.map((item, index) => {
                  const product = item.product || {};
                  const variant = item.variant || {};
                  const key = `${product.id || index}-${variant.title || 'default'}`;
                  const priceDisplay = variant.price_formatted || (product.price ? `₹${product.price}` : 'Price unavailable');
                  
                  return (
                    <li key={key} className="flex gap-4">
                      <Link
                        to={`/product/${product.id || ''}`}
                        onClick={() => setIsCartOpen(false)}
                        className="shrink-0 w-24 h-32 bg-parchment overflow-hidden"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-ink/5">
                            <ShoppingBag className="h-6 w-6 text-ink/20" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Link
                              to={`/product/${product.id || ''}`}
                              onClick={() => setIsCartOpen(false)}
                              className="font-display text-lg tracking-tightest text-ink hover:text-rouge transition"
                            >
                              {product.title || 'Unknown Product'}
                            </Link>
                            {variant.title && variant.title !== 'Default' && variant.title !== 'Standard' && (
                              <div className="text-sm text-ink/60 mt-1">{variant.title}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id, variant.title)}
                            aria-label={`Remove ${product.title || 'item'}`}
                            className="text-ink/40 hover:text-rouge transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-ink/15">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, variant.title, Math.max(1, (item.quantity || 1) - 1))}
                              aria-label="Decrease quantity"
                              className="inline-flex h-8 w-8 items-center justify-center transition hover:bg-ink hover:text-cream"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-mono text-sm w-8 text-center">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, variant.title, (item.quantity || 1) + 1)}
                              aria-label="Increase quantity"
                              disabled={(item.quantity || 1) >= (item.availableQuantity || 999)}
                              className="inline-flex h-8 w-8 items-center justify-center transition hover:bg-ink hover:text-cream disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="font-mono text-sm text-ink">
                            {priceDisplay}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-ink/10 px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-ink/60">Subtotal</span>
                <span className="font-mono text-lg text-ink">₹{total.toFixed(2)}</span>
              </div>

              <div className="text-xs text-ink/50">
                Shipping calculated at checkout. Free shipping on orders over ₹500.
              </div>

              <Button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-ink text-cream hover:bg-ink/90 py-6 eyebrow"
              >
                {checkingOut ? 'Processing...' : `Checkout — ₹${total.toFixed(2)}`}
              </Button>

              <Link to="/shop">
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant="outline"
                  className="w-full border-ink/15 text-ink hover:bg-ink hover:text-cream eyebrow"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;