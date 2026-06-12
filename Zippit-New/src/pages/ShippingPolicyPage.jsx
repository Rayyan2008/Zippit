import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Package, Truck, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';

const ShippingPolicyPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>{`Shipping Policy — ${site.brand.name}`}</title>
        <meta name="description" content="Learn about Zippit's shipping policy, delivery timelines, costs, and tracking information for handmade ethnic pouches across India." />
      </Helmet>

      <ScrollProgress />
      <CustomCursor />
      <RazorpayCheckout />

      <div className="min-h-screen bg-cream text-ink">
        <Header
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
        />

        <main className="container mx-auto pt-20 md:pt-28 pb-28 md:pb-40">
          <div className="mb-14 md:mb-20">
            <div className="eyebrow text-rouge">Policies</div>
            <h1 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
              Shipping policy
              <span className="text-rouge italic font-light">.</span>
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Delivery timelines</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We process and ship orders within 1-2 business days of receiving payment confirmation. Standard delivery across India typically takes 5-7 business days from the date of shipment.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Express shipping is available at checkout and delivers within 2-3 business days. Please note that delivery times may vary during peak seasons, festivals, or due to unforeseen circumstances beyond our control.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Remote or rural areas may experience slightly longer delivery times. We will notify you if your location requires additional delivery time.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Shipping costs</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We offer free standard shipping on all orders over ₹500. For orders below ₹500, a flat shipping fee of ₹50 applies.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Express shipping is available for ₹150 and delivers within 2-3 business days. The shipping cost will be calculated and displayed at checkout before you complete your purchase.
                </p>
                <div className="mt-6 bg-parchment p-6 border border-ink/10">
                  <h3 className="font-display text-xl text-ink mb-3">Shipping rates</h3>
                  <ul className="space-y-2 text-ink/70">
                    <li>• Standard shipping (5-7 days): Free on orders over ₹500, otherwise ₹50</li>
                    <li>• Express shipping (2-3 days): ₹150</li>
                    <li>• International shipping: Currently unavailable</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Tracking information</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  Once your order ships, you will receive a shipping confirmation email with a tracking number. You can use this number to track your package on our shipping partner's website.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Tracking information is typically updated within 24 hours of shipment. If you experience any issues with tracking or have questions about your delivery, please contact us at hello@zippit.store.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Special handling for handmade items</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  Each Zippit pouch is handmade by skilled artisans and requires special care during shipping. We use eco-friendly packaging materials and ensure each item is carefully wrapped to prevent damage during transit.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Our packaging is designed to protect your pouch while minimizing environmental impact. We use recycled cardboard boxes, biodegradable packing materials, and minimal plastic.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  If your item arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or refund at no additional cost to you.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Order processing</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  Orders are processed Monday through Saturday, excluding public holidays. Orders placed after 2 PM IST will be processed the next business day.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  You will receive an order confirmation email immediately after placing your order. A separate shipping confirmation email with tracking information will be sent once your order ships.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  If you need to modify or cancel your order, please contact us immediately at hello@zippit.store. We cannot guarantee changes once the order has been processed for shipment.
                </p>
              </div>
            </section>

            <section className="bg-wine text-secondary-foreground p-8 md:p-12">
              <h2 className="font-display text-3xl mb-4">Questions about shipping?</h2>
              <p className="text-lg opacity-90 mb-6">
                If you have any questions about our shipping policy or need assistance with your order, we're here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 eyebrow bg-secondary-foreground text-wine px-6 py-3 transition hover:opacity-90"
              >
                Contact Us
              </a>
            </section>
          </div>
        </main>

        <Footer />

        <ShoppingCart
          isCartOpen={cartOpen}
          setIsCartOpen={setCartOpen}
        />

        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          onOpenCart={() => setCartOpen(true)}
          onToggleTheme={toggleTheme}
        />
      </div>
    </>
  );
};

export default ShippingPolicyPage;