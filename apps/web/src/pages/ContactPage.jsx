import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';
import { createInquiry } from '@/lib/db';

const ContactPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await createInquiry({ ...formData, status: 'New', replies: [] });
      toast({ title: 'Message sent!', description: 'Thank you for contacting us. We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to send message. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Contact Us — ${site.brand.name}`}</title>
        <meta name="description" content="Get in touch with Zippit. We're here to help with any questions about our handmade ethnic pouches, orders, or custom requests." />
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
            <div className="eyebrow text-rouge">Get in Touch</div>
            <h1 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
              Contact us<span className="text-rouge italic font-light">.</span>
            </h1>
            <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out via the form below or WhatsApp us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="eyebrow text-ink/60">Email</span>
                </div>
                <a href={`mailto:${site.contact.email}`} className="text-lg text-ink link-underline">{site.contact.email}</a>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="eyebrow text-ink/60">Phone</span>
                </div>
                <a href={`tel:${site.contact.phone}`} className="text-lg text-ink link-underline">{site.contact.phone}</a>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="eyebrow text-ink/60">Business Hours</span>
                </div>
                <p className="text-lg text-ink">{site.contact.hours}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center bg-rouge/10 text-rouge">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="eyebrow text-ink/60">Address</span>
                </div>
                <p className="text-lg text-ink">{site.contact.address}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="eyebrow text-ink/60 mb-2 block">Name *</Label>
                    <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                      className="bg-white border-ink/15 text-ink placeholder:text-ink/40" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="eyebrow text-ink/60 mb-2 block">Email *</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                      className="bg-white border-ink/15 text-ink placeholder:text-ink/40" placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="eyebrow text-ink/60 mb-2 block">Phone (WhatsApp) *</Label>
                  <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                    className="bg-white border-ink/15 text-ink placeholder:text-ink/40" placeholder="e.g. 9876543210" />
                </div>

                <div>
                  <Label htmlFor="subject" className="eyebrow text-ink/60 mb-2 block">Subject</Label>
                  <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange}
                    className="bg-white border-ink/15 text-ink placeholder:text-ink/40" placeholder="How can we help?" />
                </div>

                <div>
                  <Label htmlFor="message" className="eyebrow text-ink/60 mb-2 block">Message *</Label>
                  <Textarea id="message" name="message" required value={formData.message} onChange={handleChange}
                    rows={6} className="bg-white border-ink/15 text-ink placeholder:text-ink/40 resize-none"
                    placeholder="Tell us more about your inquiry..." />
                </div>

                <Button type="submit" disabled={submitting}
                  className="w-full sm:w-auto bg-ink text-cream hover:bg-ink/90 eyebrow px-8">
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </main>

        <Footer />

        <ShoppingCart isCartOpen={cartOpen} setIsCartOpen={setCartOpen} />

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen}
          onOpenCart={() => setCartOpen(true)} onToggleTheme={toggleTheme} />

        <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <MessageCircle className="h-7 w-7" />
        </a>
      </div>
    </>
  );
};

export default ContactPage;