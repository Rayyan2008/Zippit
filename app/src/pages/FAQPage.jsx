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
      title: 'Product Questions',
      faqs: [
        {
          q: 'What materials are used in Zippit pouches?',
          a: 'Our pouches are made from premium natural materials including organic cotton, jute, canvas, and eco-friendly fabrics. We use natural dyes and avoid synthetic materials wherever possible. Each product description specifies the exact materials used.',
        },
        {
          q: 'Can I customize my pouch?',
          a: 'Yes! We offer customization for bulk orders of 10 or more pieces. You can choose colors, patterns, and even add custom embroidery. Contact us at hello@zippit.store with your requirements, and our team will create a custom quote for you.',
        },
        {
          q: 'What sizes are available?',
          a: 'Our pouches come in various sizes depending on the category. Daily essentials pouches are typically 8x6 inches, stationery pouches are 9x4 inches, makeup pouches are 10x7 inches, and travel organizers are 12x9 inches. Exact dimensions are listed on each product page.',
        },
        {
          q: 'Are the pouches machine washable?',
          a: 'We recommend hand washing with cold water and mild detergent to preserve the colors and fabric quality. Avoid wringing or twisting. Air dry in shade to maintain the integrity of natural dyes. Machine washing may cause colors to fade over time.',
        },
      ],
    },
    {
      title: 'Shipping & Delivery',
      faqs: [
        {
          q: 'How long does shipping take?',
          a: 'We ship within 1-2 business days of receiving your order. Delivery typically takes 5-7 business days across India. You will receive tracking information via email once your order ships. Express shipping options are available at checkout for faster delivery.',
        },
        {
          q: 'What are the shipping costs?',
          a: 'Shipping is free on all orders over ₹500. For orders below ₹500, we charge a flat rate of ₹50 for standard shipping. Express shipping costs ₹150 and delivers within 2-3 business days.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Currently, we ship only within India. International shipping will be available soon. Subscribe to our newsletter to be notified when we expand our shipping regions.',
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your package on our shipping partner\'s website. If you have any issues with tracking, contact us at hello@zippit.store.',
        },
      ],
    },
    {
      title: 'Returns & Exchanges',
      faqs: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 7-day return window from the date of delivery. Items must be unused, unwashed, and have original tags attached. Handmade items may have slight variations, which are not considered defects. Contact us to initiate a return.',
        },
        {
          q: 'How do I initiate a return?',
          a: 'Email us at hello@zippit.store with your order number and reason for return. We will provide a prepaid return label within 24 hours. Pack the item securely and ship it back using the provided label.',
        },
        {
          q: 'What is the refund timeline?',
          a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method. You will receive an email confirmation once the refund is processed.',
        },
        {
          q: 'Can I exchange for a different product?',
          a: 'Yes! If you would like to exchange for a different product, please initiate a return and place a new order for the item you want. This ensures faster processing. If the new item costs less, we will refund the difference.',
        },
      ],
    },
    {
      title: 'Care & Maintenance',
      faqs: [
        {
          q: 'How do I clean my pouch?',
          a: 'Hand wash with cold water and mild detergent. Gently scrub any stains with a soft brush. Rinse thoroughly and air dry in shade. Do not use bleach or harsh chemicals. For spot cleaning, use a damp cloth with mild soap.',
        },
        {
          q: 'How should I store my pouch?',
          a: 'Store in a cool, dry place away from direct sunlight. Avoid damp areas to prevent mildew. If storing for extended periods, stuff with tissue paper to maintain shape. Keep away from sharp objects that could snag the fabric.',
        },
        {
          q: 'Will the colors fade over time?',
          a: 'Natural dyes may fade slightly with repeated washing and sun exposure. This is normal and adds to the vintage charm of handmade items. To minimize fading, hand wash in cold water, avoid direct sunlight, and air dry in shade.',
        },
      ],
    },
    {
      title: 'Payment',
      faqs: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major payment methods through Razorpay including UPI, debit/credit cards, net banking, and digital wallets like Paytm, PhonePe, and Google Pay. All transactions are secure and encrypted.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes! We use Razorpay, a PCI-DSS compliant payment gateway. Your payment information is encrypted and never stored on our servers. All transactions are processed securely through industry-standard protocols.',
        },
        {
          q: 'Do you offer cash on delivery?',
          a: 'Currently, we do not offer cash on delivery. We accept online payments only through our secure payment gateway. This helps us maintain competitive pricing and faster order processing.',
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`FAQ — ${site.brand.name}`}</title>
        <meta name="description" content="Frequently asked questions about Zippit handmade ethnic pouches. Find answers about products, shipping, returns, care instructions, and more." />
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
            <div className="eyebrow text-rouge">Help Center</div>
            <h1 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
              Frequently asked questions
              <span className="text-rouge italic font-light">.</span>
            </h1>
            <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, returns, and more.
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