import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AnnouncementBar from '@/components/AnnouncementBar.jsx';
import Marquee from '@/components/Marquee.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import SpotlightSection from '@/components/SpotlightSection.jsx';
import PressBar from '@/components/PressBar.jsx';
import EditorialQuote from '@/components/EditorialQuote.jsx';
import Lookbook from '@/components/Lookbook.jsx';
import ProductGrid from '@/components/ProductGrid.jsx';
import StorySection from '@/components/StorySection.jsx';
import FAQ from '@/components/FAQ.jsx';
import Newsletter from '@/components/Newsletter.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { useTheme } from '@/components/ThemeToggle.jsx';
import { site } from '@/data/site.js';

const HomePage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const trigger = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
      const slash = e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (trigger || slash) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${site.brand.name} — ${site.brand.tagline}`}</title>
        <meta name="description" content={site.brand.description} />
        <meta property="og:title" content={`${site.brand.name} — ${site.brand.tagline}`} />
        <meta property="og:description" content={site.brand.description} />
      </Helmet>

      <ScrollProgress />
      <CustomCursor />
      <RazorpayCheckout />

      <div className="min-h-screen bg-cream text-ink">
        <AnnouncementBar />
        <Header
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
        />

        <main>
          <HeroSection />

          <Marquee
            items={site.marquee.primary}
            variant="ink"
            size="xl"
            speed="default"
          />

          <SpotlightSection />

          <PressBar />

          <EditorialQuote />

          <Marquee
            items={site.marquee.secondary}
            variant="cream"
            size="xxxl"
            speed="slow"
            reverse
            italic
            separator="/"
          />

          <Lookbook />

          <Marquee
            items={site.marquee.primary}
            variant="rouge"
            size="lg"
            speed="fast"
            separator="·"
          />

          <ProductGrid />

          <StorySection />

          <FAQ />

          <Newsletter />
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

export default HomePage;