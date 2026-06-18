import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import { site } from '@/data/site.js';

const FaviconBackdrop = () => {
  // Using the existing favicon asset name from apps/web/public/favicon.png
  // (matches requirement: favicon behind the text)
  return (
    <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden rounded-3xl border border-ink/10 bg-white/30">
      {/* animated favicon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <img
            src="/favicon.png"
            alt="favicon"
            className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] opacity-10 mix-blend-multiply"
          />
          <div
            className="absolute inset-0 m-auto w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border border-rouge/30"
            style={{
              animation: 'spin-fade 4.5s linear infinite',
              filter: 'blur(0px)',
            }}
          />
          <div
            className="absolute inset-0 m-auto w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full bg-rouge/10"
            style={{
              animation: 'pulse-ring 2.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* subtle animated grain */}
      <div className="absolute inset-0 opacity-50 grain" />

      {/* foreground text */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="eyebrow text-rouge">404 — Not Found</div>
        <h1 className="font-display text-display-md text-ink mt-3">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-sm md:text-base text-ink/70 leading-relaxed">
          Looks like this link doesn’t exist. Please head back to the shop or return to the homepage.
        </p>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes spin-fade {
          0% { transform: rotate(0deg); opacity: 0.45; }
          50% { opacity: 0.75; }
          100% { transform: rotate(360deg); opacity: 0.45; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.92); opacity: 0.55; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(0.92); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
};

export default function NotFoundPage() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />

      <div className="min-h-screen bg-cream text-ink">
        <Header onOpenCart={() => {}} onOpenSearch={() => {}} />

        <main className="container mx-auto px-4 pt-28 pb-20 md:pt-32 md:pb-28">
          <FaviconBackdrop />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <Button className="bg-ink text-cream hover:bg-ink/90 py-6 eyebrow">
                Back to Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="border-ink/15 text-ink hover:bg-ink hover:text-cream py-6 eyebrow">
                Shop Collection
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-ink/50 text-center">
            Need help? WhatsApp us at https://wa.me/{site.brand.whatsapp}
          </p>
        </main>

        <Footer />
      </div>
    </>
  );
}

