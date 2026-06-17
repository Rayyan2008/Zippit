import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';

const PrivacyPolicyPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>{`Privacy Policy — ${site.brand.name}`}</title>
        <meta name="description" content="Zippit's privacy policy. Learn how we collect, use, and protect your personal information when you shop for handmade ethnic pouches." />
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
              Privacy policy
              <span className="text-rouge italic font-light">.</span>
            </h1>
            <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-2xl">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Introduction</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  At Bloom, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  By using our website, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our website.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Information we collect</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We collect information that you provide directly to us when you:
                </p>
                <ul className="mt-4 space-y-2 text-ink/70">
                  <li>• Create an account or make a purchase</li>
                  <li>• Subscribe to our newsletter</li>
                  <li>• Contact us with questions or feedback</li>
                  <li>• Participate in surveys or promotions</li>
                  <li>• Interact with our website or social media</li>
                </ul>
                <p className="text-ink/70 leading-relaxed mt-6">
                  The types of information we may collect include:
                </p>
                <div className="mt-4 bg-parchment p-6 border border-ink/10">
                  <h3 className="font-display text-xl text-ink mb-3">Personal information</h3>
                  <ul className="space-y-2 text-ink/70">
                    <li>• Name and contact information (email, phone number)</li>
                    <li>• Shipping and billing addresses</li>
                    <li>• Payment information (processed securely through Razorpay)</li>
                    <li>• Order history and preferences</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
                <div className="mt-4 bg-parchment p-6 border border-ink/10">
                  <h3 className="font-display text-xl text-ink mb-3">Automatically collected information</h3>
                  <ul className="space-y-2 text-ink/70">
                    <li>• Device and browser information</li>
                    <li>• IP address and location data</li>
                    <li>• Pages visited and time spent on site</li>
                    <li>• Referring website or source</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">How we use your information</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="mt-4 space-y-3 text-ink/70">
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Order processing:</span> To process and fulfill your orders, send order confirmations, and provide customer support.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Communication:</span> To send you updates about your orders, respond to inquiries, and provide customer service.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Marketing:</span> To send promotional emails, newsletters, and special offers (you can opt out at any time).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Improvement:</span> To analyze website usage, improve our products and services, and enhance user experience.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Security:</span> To detect and prevent fraud, protect against security threats, and ensure platform integrity.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Legal compliance:</span> To comply with legal obligations and enforce our terms of service.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Data security</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  Our security measures include:
                </p>
                <ul className="mt-4 space-y-2 text-ink/70">
                  <li>• SSL encryption for all data transmission</li>
                  <li>• Secure payment processing through PCI-DSS compliant Razorpay</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Restricted access to personal information</li>
                  <li>• Employee training on data protection</li>
                </ul>
                <p className="text-ink/70 leading-relaxed mt-6">
                  While we strive to protect your personal information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security but are committed to protecting your data to the best of our ability.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Your rights</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="mt-4 space-y-3 text-ink/70">
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Access:</span> Request a copy of the personal information we hold about you.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Correction:</span> Request correction of inaccurate or incomplete information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Deletion:</span> Request deletion of your personal information (subject to legal obligations).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Opt-out:</span> Unsubscribe from marketing communications at any time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rouge shrink-0 mt-1">•</span>
                    <span><span className="font-semibold text-ink">Data portability:</span> Request a copy of your data in a structured, machine-readable format.</span>
                  </li>
                </ul>
                <p className="text-ink/70 leading-relaxed mt-6">
                  To exercise any of these rights, please contact us at thebloomstore.in@gmail.com. We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Cookies and tracking</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. Cookies are small text files stored on your device.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="font-display text-3xl text-ink">Changes to this policy</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-ink/70 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
                </p>
                <p className="text-ink/70 leading-relaxed mt-4">
                  We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </section>

            <section className="bg-wine text-secondary-foreground p-8 md:p-12">
              <h2 className="font-display text-3xl mb-4">Questions about privacy?</h2>
              <p className="text-lg opacity-90 mb-6">
                If you have any questions or concerns about our Privacy Policy or how we handle your data, please contact us.
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

export default PrivacyPolicyPage;