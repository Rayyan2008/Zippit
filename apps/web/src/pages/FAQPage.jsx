import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';

const FAQPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();

 const faqCategories = [
  {
    title: 'Products',
    faqs: [
      {
        q: 'What products does Bloom offer?',
        a: 'Bloom offers handmade scrunchies, handbags, pouches, organizers, and accessories designed for everyday use. Every product is carefully crafted with attention to quality, style, and functionality.',
      },
      {
        q: 'Are your products handmade?',
        a: 'Yes. Every Bloom product is handmade with care, making each piece unique. Small variations in stitching, fabric patterns, or finishing are a natural part of handcrafted products.',
      },
      {
        q: 'Will sold-out products be restocked?',
        a: 'Popular products may be restocked depending on material availability and production schedules. Follow our social media channels for updates on new arrivals and restocks.',
      },
      {
        q: 'Can I place a bulk order?',
        a: 'Yes. We accept bulk and gifting orders for events, businesses, and special occasions. Contact us for pricing and availability.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    faqs: [
      {
        q: 'How long does delivery take?',
        a: 'Orders are usually processed within 1-3 business days. Delivery timelines depend on your location and courier service availability.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you will receive tracking details through email or WhatsApp.',
      },
      {
        q: 'Do you deliver across India?',
        a: 'Yes, we currently deliver across most locations in India.',
      },
      {
        q: 'Do you offer international shipping?',
        a: 'International shipping may be available for select locations. Please contact us before placing an order.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    faqs: [
      {
        q: 'Can I return my order?',
        a: 'Returns are accepted only for damaged, defective, or incorrect items received. Please contact us within 48 hours of delivery.',
      },
      {
        q: 'How do I request a return?',
        a: 'Email us with your order number, product photos, and details of the issue. Our team will review the request and guide you through the process.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Approved refunds are generally processed within 5-7 business days after the returned product has been inspected.',
      },
      {
        q: 'Can I exchange a product?',
        a: 'Exchanges may be available depending on stock availability and the reason for the request.',
      },
    ],
  },
  {
    title: 'Care Instructions',
    faqs: [
      {
        q: 'How should I clean my products?',
        a: 'We recommend gentle hand washing or spot cleaning depending on the product material. Always air dry and avoid harsh detergents.',
      },
      {
        q: 'How should I store handbags and pouches?',
        a: 'Store them in a cool, dry place away from direct sunlight to maintain their shape and appearance.',
      },
      {
        q: 'Will colors vary slightly?',
        a: 'Yes. Due to lighting, fabric batches, and the handmade nature of our products, slight variations may occur.',
      },
    ],
  },
  {
    title: 'Orders & Payments',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, debit cards, credit cards, net banking, wallets, and other secure payment options available through Razorpay.',
      },
      {
        q: 'Is online payment secure?',
        a: 'Yes. All payments are processed through secure payment gateways with industry-standard encryption.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can only be cancelled before they are shipped. Once dispatched, cancellation may not be possible.',
      },
      {
        q: 'Do you offer Cash on Delivery?',
        a: 'Cash on Delivery availability depends on location and may be offered for selected regions.',
      },
    ],
  },
];

  return (
    <>
      <Helmet>
        <title>{`FAQ — ${site.brand.name}`}</title>
        <meta name="description" content="Frequently asked questions about Bloom handmade handbags, scrunchies, pouches and accessories." />
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
          <div className="mb-14 md:mb-20 text-center">
            <div className="eyebrow text-rouge">Bloom Support</div>
            <h1 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
              Frequently asked questions
              <span className="text-rouge italic font-light">.</span>
            </h1>
            <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
               Find answers about products, orders, shipping, returns, payments, and caring for your Bloom products.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="font-display text-3xl text-ink mb-6">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-white border border-ink/10 px-6"
                    >
                      <AccordionTrigger className="text-left font-display text-lg text-ink hover:text-rouge transition">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-ink/70 leading-relaxed pt-2 pb-6">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h3 className="font-display text-2xl text-ink mb-4">Still have questions?</h3>
            <p className="text-ink/70 mb-6">
              We're here to help. Contact us and we'll get back to you as soon as possible.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 eyebrow bg-ink text-cream px-6 py-3 transition hover:bg-ink/90"
            >
              Contact Us
            </a>
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

export default FAQPage;