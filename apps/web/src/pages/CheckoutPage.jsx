import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeToggle.jsx';
import { createOrder } from '@/lib/db';
import { site } from '@/data/site.js';

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
};

function buildWhatsAppMessage({ form, cartItems, total }) {
  const lines = [];
  lines.push(`*New Order — ${site.brand.name}*`);
  lines.push('');
  lines.push(`*Name:* ${form.name}`);
  lines.push(`*Phone:* ${form.phone}`);
  lines.push(`*Address:* ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`);
  lines.push('');
  lines.push('*Order Items:*');
  cartItems.forEach((item) => {
    const product = item.product || {};
    const variant = item.variant || {};
    const variantLabel = variant.title && variant.title !== 'Default' ? ` (${variant.title})` : '';
    lines.push(`• ${product.title || 'Item'}${variantLabel} × ${item.quantity} — ${variant.price_formatted || ''}`);
  });
  lines.push('');
  lines.push(`*Total: ₹${total.toFixed(2)}*`);
  if (form.notes?.trim()) {
    lines.push('');
    lines.push(`*Notes:* ${form.notes.trim()}`);
  }
  lines.push('');
  lines.push('Please confirm my order. Thank you!');
  return lines.join('\n');
}

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { toggle: toggleTheme } = useTheme();
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const total = getCartTotal() || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone number';
    if (!form.address.trim()) next.address = 'Required';
    if (!form.city.trim()) next.city = 'Required';
    if (!form.state.trim()) next.state = 'Required';
    if (!form.pincode.trim()) next.pincode = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePay = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: 'Your bag is empty',
        description: 'Add items to your bag before checking out.',
        variant: 'destructive',
      });
      return;
    }

    if (!validate()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required delivery details.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create the order in Supabase immediately — status starts as
      //    "Pending Payment". No online payment gate; the order exists
      //    in the admin dashboard right away, payment is settled
      //    manually over WhatsApp afterwards.
      const order = await createOrder({
        customer_name: form.name.trim(),
        customer_email: form.email.trim() || null,
        customer_phone: form.phone.trim(),
        shipping_address: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          notes: form.notes.trim() || null,
        },
        items: cartItems.map((item) => ({
          product: {
            id: item.product?.id,
            title: item.product?.title,
            image: item.product?.image,
          },
          variant: {
            title: item.variant?.title,
            price_formatted: item.variant?.price_formatted,
          },
          quantity: item.quantity,
        })),
        subtotal: total,
        shipping_cost: 0,
        total,
        status: 'Pending Payment',
      });

      // 2. Build and open the WhatsApp message with order details prefilled.
      const message = buildWhatsAppMessage({ form, cartItems, total });
      const waUrl = `https://wa.me/${site.brand.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');

      // 3. Clear the bag and confirm to the customer.
      clearCart();

      toast({
        title: 'Order placed',
        description: "We've opened WhatsApp so you can confirm your order with us directly.",
      });

      navigate('/success', { state: { orderNumber: order?.order_number } });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: error.message || 'Unable to place your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Checkout — ${site.brand.name}`}</title>
        <meta name="description" content="Complete your order details and confirm via WhatsApp." />
      </Helmet>

      <ScrollProgress />
      <CustomCursor />

      <div className="min-h-screen bg-cream text-ink">
        <Header
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
        />

        <main className="container mx-auto px-4 pt-28 pb-24 md:pt-32 md:pb-32">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-rouge transition mb-8">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>

          <h1 className="font-display text-display-md text-ink mb-10">Checkout</h1>

          {!cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-ink/10">
              <ShoppingBag className="h-14 w-14 text-ink/20 mb-6" />
              <h3 className="font-display text-2xl text-ink mb-3">Your bag is empty</h3>
              <p className="text-sm text-ink/60 mb-8 max-w-xs">Add some handmade scrunchies before checking out.</p>
              <Link to="/shop">
                <Button className="bg-ink text-cream hover:bg-ink/90">Shop Collection</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Delivery details form */}
              <form onSubmit={handlePay} className="lg:col-span-7 space-y-6">
                <h2 className="eyebrow text-ink/60 mb-2">Delivery Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs eyebrow text-ink/60 mb-2">FULL NAME *</label>
                    <Input name="name" value={form.name} onChange={handleChange}
                      placeholder="Your name" className={errors.name ? 'border-rouge' : 'border-ink/15'} />
                    {errors.name && <p className="text-xs text-rouge mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs eyebrow text-ink/60 mb-2">PHONE NUMBER *</label>
                    <Input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="10-digit mobile number" className={errors.phone ? 'border-rouge' : 'border-ink/15'} />
                    {errors.phone && <p className="text-xs text-rouge mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs eyebrow text-ink/60 mb-2">EMAIL (OPTIONAL)</label>
                  <Input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" className="border-ink/15" />
                </div>

                <div>
                  <label className="block text-xs eyebrow text-ink/60 mb-2">ADDRESS *</label>
                  <Input name="address" value={form.address} onChange={handleChange}
                    placeholder="House no., street, locality" className={errors.address ? 'border-rouge' : 'border-ink/15'} />
                  {errors.address && <p className="text-xs text-rouge mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs eyebrow text-ink/60 mb-2">CITY *</label>
                    <Input name="city" value={form.city} onChange={handleChange}
                      placeholder="City" className={errors.city ? 'border-rouge' : 'border-ink/15'} />
                    {errors.city && <p className="text-xs text-rouge mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs eyebrow text-ink/60 mb-2">STATE *</label>
                    <Input name="state" value={form.state} onChange={handleChange}
                      placeholder="State" className={errors.state ? 'border-rouge' : 'border-ink/15'} />
                    {errors.state && <p className="text-xs text-rouge mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-xs eyebrow text-ink/60 mb-2">PINCODE *</label>
                    <Input name="pincode" value={form.pincode} onChange={handleChange}
                      placeholder="110001" className={errors.pincode ? 'border-rouge' : 'border-ink/15'} />
                    {errors.pincode && <p className="text-xs text-rouge mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs eyebrow text-ink/60 mb-2">ORDER NOTES (OPTIONAL)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Any special instructions for your order"
                    rows="3" className="w-full px-3 py-2 border border-ink/15 text-ink bg-transparent focus:outline-none focus:ring-2 focus:ring-rouge/50" />
                </div>

                <p className="text-xs text-ink/50 leading-relaxed">
                  Clicking Pay will open WhatsApp with your order details prefilled. Payment is collected
                  directly with our team over WhatsApp — no online payment is required right now.
                </p>

                <Button type="submit" disabled={submitting}
                  className="w-full bg-ink text-cream hover:bg-ink/90 py-6 eyebrow">
                  {submitting ? 'Placing order…' : `Pay — ₹${total.toFixed(2)}`}
                </Button>
              </form>

              {/* Order summary */}
              <div className="lg:col-span-5">
                <div className="border border-ink/10 p-6 sticky top-24">
                  <h2 className="eyebrow text-ink/60 mb-6">Order Summary</h2>
                  <ul className="space-y-4 mb-6">
                    {cartItems.map((item, index) => {
                      const product = item.product || {};
                      const variant = item.variant || {};
                      const key = `${product.id || index}-${variant.title || 'default'}`;
                      return (
                        <li key={key} className="flex items-center gap-3">
                          <div className="shrink-0 w-14 h-18 bg-parchment overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.title || 'Product'} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-ink/5">
                                <ShoppingBag className="h-4 w-4 text-ink/20" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-ink">{product.title || 'Item'}</p>
                            <p className="text-xs text-ink/50">Qty {item.quantity}</p>
                          </div>
                          <div className="font-mono text-sm text-ink">{variant.price_formatted || ''}</div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="border-t border-ink/10 pt-4 flex items-center justify-between">
                    <span className="eyebrow text-ink/60">Total</span>
                    <span className="font-mono text-lg text-ink">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />

        <ShoppingCart isCartOpen={cartOpen} setIsCartOpen={setCartOpen} />
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          onOpenCart={() => setCartOpen(true)}
          onToggleTheme={toggleTheme}
        />
      </div>
    </>
  );
}