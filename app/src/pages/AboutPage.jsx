import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Leaf, Award } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';

const AboutPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  const values = [
    {
      icon: Heart,
      title: 'Handmade with care',
      description: 'Every pouch is crafted by skilled artisans using traditional techniques passed down through generations.',
    },
    {
      icon: Users,
      title: 'Fair trade practices',
      description: 'We work directly with artisan communities, ensuring fair wages and sustainable livelihoods.',
    },
    {
      icon: Leaf,
      title: 'Eco-friendly materials',
      description: 'Natural dyes, organic cotton, and sustainable materials are at the heart of our production.',
    },
    {
      icon: Award,
      title: 'Quality guaranteed',
      description: 'Each piece undergoes rigorous quality checks to ensure it meets our high standards.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`About Us — ${site.brand.name}`}</title>
        <meta name="description" content="Learn about Zippit's mission to create unique handmade ethnic pouches for college students and young professionals. Discover our story, values, and commitment to traditional craftsmanship." />
      </Helmet>

      <ScrollProgress />
      <CustomCursor />
      <RazorpayCheckout />

      <div className="min-h-screen bg-cream text-ink">
        <Header
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
        />

        <main>
          <section className="container mx-auto pt-20 md:pt-28 pb-20 md:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="eyebrow text-rouge">About Zippit</div>
                <h1 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
                  Handmade for life
                  <span className="text-rouge italic font-light">.</span>
                </h1>
                <p className="mt-6 text-lg text-ink/70 leading-relaxed">
                  Zippit was founded in 2024 with a simple mission: to create unique handmade ethnic pouches that blend traditional Indian craftsmanship with modern functionality.
                </p>
                <p className="mt-4 text-lg text-ink/70 leading-relaxed">
                  We partner with skilled artisans across Rajasthan, Gujarat, and West Bengal to bring you pouches that are not just organizers, but pieces of cultural heritage you can carry every day.
                </p>
                <Link to="/shop">
                  <Button className="mt-8 bg-ink text-cream hover:bg-ink/90 eyebrow inline-flex items-center gap-2">
                    Shop Collection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
                <img
                  src="https://images.unsplash.com/photo-1527385352018-3c26dd6c3916?auto=format&fit=crop&w=1200&q=85"
                  alt="Artisan crafting traditional embroidered pouch"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          <section className="bg-wine text-secondary-foreground py-20 md:py-28">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto text-center">
                <div className="eyebrow text-secondary-foreground/70">Our Story</div>
                <h2 className="font-display text-display-md mt-3 leading-[1]">
                  From tradition to your hands
                </h2>
                <p className="mt-6 text-lg leading-relaxed opacity-90">
                  Growing up surrounded by the vibrant textiles and crafts of Rajasthan, our founder witnessed firsthand how traditional artisan skills were fading as younger generations moved to cities for work.
                </p>
                <p className="mt-4 text-lg leading-relaxed opacity-90">
                  Zippit was born from a desire to preserve these heritage techniques while creating products that fit modern lifestyles. We work with artisan cooperatives to ensure fair wages, provide training, and create sustainable income opportunities.
                </p>
                <p className="mt-4 text-lg leading-relaxed opacity-90">
                  Today, we partner with 15+ artisan families, creating pouches that college students and young professionals love — not despite their traditional roots, but because of them.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto py-20 md:py-28">
            <div className="text-center mb-16">
              <div className="eyebrow text-rouge">Our Values</div>
              <h2 className="font-display text-display-md text-ink mt-3 leading-[1]">
                What we stand for
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 border border-ink/10 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center bg-rouge/10 text-rouge mb-6">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-2xl text-ink mb-3">{value.title}</h3>
                    <p className="text-ink/70 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-parchment py-20 md:py-28">
            <div className="container mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {site.story.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-display text-5xl md:text-6xl text-rouge mb-2">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="eyebrow text-ink/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-display-md text-ink leading-[1] mb-6">
                Join our journey
              </h2>
              <p className="text-lg text-ink/70 leading-relaxed mb-8">
                Every Zippit pouch you purchase supports artisan families, preserves traditional crafts, and brings a piece of Indian heritage into your daily life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button className="bg-ink text-cream hover:bg-ink/90 eyebrow">
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-ink/15 text-ink hover:bg-ink hover:text-cream eyebrow">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </section>
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

export default AboutPage;