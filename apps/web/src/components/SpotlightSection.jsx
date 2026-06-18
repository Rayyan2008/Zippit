import React from 'react';
import { ArrowUpRight, Check, Eye, Plus } from 'lucide-react';
import { site } from '@/data/site.js';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';
import MagneticButton from '@/components/MagneticButton.jsx';

const SpotlightSection = ({ onAddToCart }) => {
  const { eyebrow, title, body, bullets, price, cta, image, socialProof } = site.spotlight;
  const titleParts = Array.isArray(title) ? title : [title];
  const anim = useScrollAnimation({ threshold: 0.15 });

  const handleAdd = () => {
    onAddToCart?.({
      id: 'velour-trench',
      name: 'The Bloom Trench',
      price: 480,
      image: image.src,
      colorName: 'Stone',
    });
  };

  return (
    <section
      id="spotlight"
      ref={anim.ref}
      className={`relative bg-ink text-cream overflow-hidden reveal ${
        anim.isVisible ? 'is-visible' : ''
      }`}
    >
      <div className="container mx-auto py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] overflow-hidden hover-zoom">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute top-4 left-4 eyebrow bg-cream/95 text-ink px-3 py-1.5">
                Signature
              </span>
              <span className="absolute bottom-4 right-4 eyebrow bg-rouge text-cream px-3 py-1.5">
                {price}
              </span>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 eyebrow bg-ink/70 text-cream px-3 py-1.5 backdrop-blur">
                <Eye className="h-3 w-3" />
                {socialProof}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between eyebrow text-cream/55">
              <span>01 / 01</span>
              <span>The Bloom Signature </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="eyebrow text-rouge mb-5">{eyebrow}</div>
            <h2
              className="font-display text-display-lg leading-[0.94] text-cream"
              aria-label={titleParts.join(' ')}
            >
              {titleParts.map((line, i) => (
                <span key={`${line}-${i}`} className="block">
                  {i === titleParts.length - 1 ? (
                    <span className="italic font-light text-rouge">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h2>

            <p className="mt-8 text-base md:text-lg leading-relaxed text-cream/75 max-w-lg">
              {body}
            </p>

            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-cream/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-rouge" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 pt-10 border-t border-cream/15 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
              <div>
                <div className="eyebrow text-cream/55">Price</div>
                <div className="font-display text-4xl md:text-5xl text-cream mt-1 tracking-tightest">
                  {price}
                </div>
                <div className="eyebrow text-cream/55 mt-1">Carbon-neutral shipping</div>
              </div>

              <div className="flex flex-1 flex-wrap items-center gap-3">
                <MagneticButton
                  type="button"
                  onClick={handleAdd}
                  data-cursor="hover"
                  className="group flex-1 inline-flex items-center justify-center gap-3 bg-cream px-7 py-4 text-ink eyebrow transition-colors hover:bg-rouge hover:text-cream"
                >
                  <Plus className="h-4 w-4" />
                  {cta.label}
                </MagneticButton>
                <a
                  href="#collection"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 eyebrow text-cream/80 transition hover:text-cream"
                >
                  See full collection
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotlightSection;