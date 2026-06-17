import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';

const ReturnPolicyPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>{`Return & Exchange Policy — ${site.brand.name}`}</title>
        <meta name="description" content="Learn about Bloom's return and exchange policy. Easy 7-day returns on handmade ethnic handbags, pouches and scrunchies with clear guidelines and process." />
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
              Return & exchange policy
              <span className="text-rouge italic font-light">.</span>
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Return window</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We offer a 7-day return window from the date of delivery. This gives you enough time to inspect your handmade pouch and ensure it meets your expectations.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  To be eligible for a return, items must be unused, unwashed, and in the same condition as received. All original tags must be attached, and the item should be in its original packaging.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Please note that handmade items may have slight variations in color, pattern, or stitching. These are not considered defects but rather characteristics of artisan craftsmanship and are not eligible for return.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Eligible for return</h2>
              </div>
              <div className="bg-parchment p-6 border border-ink/10">
                <ul className="space-y-3 text-ink/70">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-rouge shrink-0 mt-0.5" />
                    <span>Items with manufacturing defects or damage during shipping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-rouge shrink-0 mt-0.5" />
                    <span>Incorrect items received (wrong product or size)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-rouge shrink-0 mt-0.5" />
                    <span>Unused items with original tags and packaging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-rouge shrink-0 mt-0.5" />
                    <span>Returns initiated within 7 days of delivery</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <XCircle className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Not eligible for return</h2>
              </div>
              <div className="bg-parchment p-6 border border-ink/10">
                <ul className="space-y-3 text-ink/70">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-ink/40 shrink-0 mt-0.5" />
                    <span>Items that have been used, washed, or altered</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-ink/40 shrink-0 mt-0.5" />
                    <span>Items without original tags or packaging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-ink/40 shrink-0 mt-0.5" />
                    <span>Customized or personalized items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-ink/40 shrink-0 mt-0.5" />
                    <span>Returns initiated after 7 days of delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-ink/40 shrink-0 mt-0.5" />
                    <span>Natural variations in handmade items (color, pattern, stitching)</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Return process</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  To initiate a return, please follow these steps:
                </p>
                <ol className="mt-4 space-y-4 text-ink/70">
                  <li className="pl-2">
                    <span className="font-semibold text-ink">Step 1:</span> Contact us at thebloomstore.in@gmail.com with your order number, reason for return, and photos of the item (if applicable).
                  </li>
                  <li className="pl-2">
                    <span className="font-semibold text-ink">Step 2:</span> Our team will review your request within 24 hours and provide a prepaid return shipping label via email.
                  </li>
                  <li className="pl-2">
                    <span className="font-semibold text-ink">Step 3:</span> Pack the item securely in its original packaging with all tags attached. Attach the return label to the package.
                  </li>
                  <li className="pl-2">
                    <span className="font-semibold text-ink">Step 4:</span> Drop off the package at the nearest courier location or schedule a pickup.
                  </li>
                  <li className="pl-2">
                    <span className="font-semibold text-ink">Step 5:</span> Once we receive and inspect the returned item, we will process your refund or exchange.
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Refund timeline</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund amount will be credited to your original payment method.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Depending on your bank or payment provider, it may take an additional 3-5 business days for the refund to reflect in your account. You will receive an email confirmation once the refund is processed.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Shipping charges are non-refundable unless the return is due to our error (wrong item sent, defective product, etc.).
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Exchanges</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  If you would like to exchange an item for a different product, size, or color, please initiate a return and place a new order for the item you want.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  This ensures faster processing and guarantees availability of the item you want. If the new item costs less than the returned item, we will refund the difference. If it costs more, you will need to pay the additional amount.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  For exchanges due to defects or shipping errors, we will cover all shipping costs and process the exchange at no additional charge to you.
                </p>
              </div>
            </section>

            <section className="bg-wine text-secondary-foreground p-8 md:p-12">
              <h2 className="font-display text-3xl mb-4">Need help with a return?</h2>
              <p className="text-lg opacity-90 mb-6">
                Our customer support team is here to assist you with returns, exchanges, or any questions about our policy.
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

export default ReturnPolicyPage;