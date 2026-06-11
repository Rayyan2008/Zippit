import React from 'react';
import { site } from '@/data/site.js';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

const EditorialQuote = () => {
  const { eyebrow, quote, attribution, paragraphs = [] } = site.editorial;
  const anim = useScrollAnimation({ threshold: 0.2 });
  const words = quote.split(' ');

  return (
    <section
      id="editorial"
      ref={anim.ref}
      className="relative bg-blush text-ink overflow-hidden grain"
    >
      <div className="container mx-auto py-24 md:py-36">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <span className="eyebrow text-ink/65">{eyebrow}</span>
          <span className="eyebrow text-ink/65 hidden sm:inline">{site.brand.wordmark}</span>
        </div>

        <blockquote className="font-display text-display-lg leading-[1.0] tracking-editorial">
          <span aria-hidden className="text-rouge mr-2 align-top">“</span>
          <span>
            {words.map((w, i) => (
              <span
                key={`${w}-${i}`}
                className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] mr-[0.22em] ${
                  anim.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {w === 'cannot' || w === 'only' ? (
                  <span className="italic font-light text-rouge">{w}</span>
                ) : (
                  w
                )}
              </span>
            ))}
          </span>
          <span aria-hidden className="text-rouge ml-1 align-top">”</span>
        </blockquote>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-3 flex items-center gap-6">
            <div className="h-px w-16 bg-ink/30" />
            <span className="eyebrow text-ink/70">{attribution}</span>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-base md:text-lg leading-relaxed text-ink/80 transition-all duration-700 ${
                  anim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${600 + i * 120}ms` }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialQuote;