import React from 'react';
import { site } from '@/data/site.js';

const PressBar = () => {
  const items = site.press ?? [];
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <section className="bg-cream border-y border-ink/10">
      <div className="container mx-auto py-8 md:py-10">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="shrink-0 eyebrow text-ink/55">As featured in</div>
          <div className="flex-1 overflow-hidden">
            <div className="marquee-track animate-marquee-slow">
              {loop.map((p, i) => (
                <span
                  key={`${p.name}-${i}`}
                  className="shrink-0 px-8 font-display italic text-2xl md:text-3xl tracking-tight text-ink/55 hover:text-ink transition-colors"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressBar;