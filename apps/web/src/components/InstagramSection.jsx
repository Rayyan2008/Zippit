import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { site } from '../data/site.js';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';

const InstagramSection = () => {
  const { eyebrow, title, body, handle, href, images } = site.instagram;
  const anim = useScrollAnimation({ threshold: 0.05 });

  return (
    <section
      id="instagram"
      ref={anim.ref}
      className={`bg-parchment text-ink reveal ${anim.isVisible ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="eyebrow text-rouge flex items-center gap-2">
              <Instagram className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            <h2 className="font-display text-display-md mt-3 leading-[0.98]">
              {title.split('@')[0]}
              <span className="italic font-light text-rouge">@{title.split('@')[1]}</span>
            </h2>
            <p className="mt-5 text-ink/70 max-w-md leading-relaxed">{body}</p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 bg-ink text-cream eyebrow px-6 py-3.5 transition-colors hover:bg-rouge self-start md:self-auto"
          >
            <Instagram className="h-4 w-4" />
            Follow {handle}
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {images.map((image, i) => {
            const src = typeof image === 'string' ? image : image?.src;
            if (!src) return null;

            return (
              <a
                key={`${src}-${i}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className={`group relative block aspect-square overflow-hidden hover-zoom bg-cream transition-all duration-700 ${
                  anim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
                aria-label={`Open Instagram, post ${i + 1}`}
              >
                <img
                  src={src}
                  alt={image?.alt || `Instagram post ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Hide broken images so the grid doesn't look broken
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-cream opacity-0 group-hover:opacity-100 transition" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
