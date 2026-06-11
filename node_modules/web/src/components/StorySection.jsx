import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site.js';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

const useCountUp = (target, isVisible, duration = 1200) => {
  const [value, setValue] = useState(0);
  const start = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!isVisible) return undefined;
    if (typeof target !== 'number') {
      setValue(target);
      return undefined;
    }
    const animate = (ts) => {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, isVisible, duration]);

  return value;
};

const Stat = ({ stat, isVisible }) => {
  const value = useCountUp(stat.value, isVisible);
  return (
    <div className="flex flex-col">
      <dt className="font-display text-4xl md:text-5xl tracking-tightest text-ink leading-none">
        {typeof stat.value === 'number'
          ? `${value}${stat.suffix || ''}`
          : stat.value}
      </dt>
      <dd className="eyebrow text-ink/55 mt-2">{stat.label}</dd>
    </div>
  );
};

const StorySection = () => {
  const { eyebrow, title, body, secondaryBody, cta, image, stats } = site.story;
  const titleParts = Array.isArray(title) ? title : [title];
  const anim = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      id="story"
      ref={anim.ref}
      className={`bg-parchment text-ink reveal ${anim.isVisible ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden hover-zoom grain">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 flex justify-between text-cream">
                <span className="eyebrow drop-shadow">Atelier</span>
                <span className="eyebrow drop-shadow">Porto · Florence · Paris</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="eyebrow text-rouge">{eyebrow}</div>
            <h2 className="mt-4 font-display text-display-md text-ink leading-[0.98]">
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

            <div className="mt-8 space-y-6 max-w-xl text-lg text-ink/75 leading-relaxed">
              <p>{body}</p>
              <p>{secondaryBody}</p>
            </div>

            <div className="mt-10">
              <a
                href={cta.href}
                data-cursor="hover"
                className="group inline-flex items-center gap-3 border-b border-ink py-2 eyebrow text-ink"
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 border-t border-ink/15 pt-10">
              {stats.map((s) => (
                <Stat key={s.label} stat={s} isVisible={anim.isVisible} />
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;