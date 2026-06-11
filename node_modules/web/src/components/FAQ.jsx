import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { site } from '@/data/site.js';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

const FAQ = () => {
  const items = site.faq ?? [];
  const [open, setOpen] = useState(0);
  const anim = useScrollAnimation({ threshold: 0.15 });

  if (!items.length) return null;

  return (
    <section
      id="faq"
      ref={anim.ref}
      className={`bg-cream text-ink reveal ${anim.isVisible ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="eyebrow text-rouge">N° 05 — Care</div>
            <h2 className="mt-4 font-display text-display-md text-ink leading-[1.0]">
              Frequently
              <br />
              <span className="italic font-light text-rouge">asked</span>.
            </h2>
            <p className="mt-6 text-lg text-ink/65 leading-relaxed max-w-md">
              Quietly answered. If you need more, our atelier team is one note away.
            </p>
            <a
              href="#contact"
              data-cursor="hover"
              className="mt-8 inline-flex items-center gap-2 eyebrow link-underline"
            >
              Write to the atelier →
            </a>
          </div>

          <div className="lg:col-span-8">
            <ul>
              {items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li key={item.q} className="border-t last:border-b border-ink/15">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      data-cursor="hover"
                      className="group flex w-full items-center justify-between gap-6 py-6 md:py-7 text-left"
                    >
                      <div className="flex items-baseline gap-5">
                        <span className="eyebrow text-ink/40">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-xl md:text-2xl tracking-tightest text-ink group-hover:text-rouge transition">
                          {item.q}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 inline-flex h-9 w-9 items-center justify-center border border-ink/20 transition-transform duration-500 ${
                          isOpen ? 'rotate-45 bg-ink text-cream border-ink' : ''
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-7 pl-12 md:pl-16 pr-2 text-base md:text-lg leading-relaxed text-ink/70 max-w-2xl">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;