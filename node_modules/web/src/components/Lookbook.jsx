import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { site } from '@/data/site.js';

const Lookbook = () => {
  const data = site.lookbook;
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pct = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
      setProgress(pct);
      const w = el.clientWidth;
      const idx = Math.round(el.scrollLeft / (w * 0.6));
      setActive(Math.min(data.images.length - 1, Math.max(0, idx)));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [data.images.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fineHover) return undefined;

    const onDown = (e) => {
      drag.current.active = true;
      drag.current.startX = e.pageX;
      drag.current.startScroll = el.scrollLeft;
      el.classList.add('grabbing');
    };
    const onMove = (e) => {
      if (!drag.current.active) return;
      const dx = e.pageX - drag.current.startX;
      el.scrollLeft = drag.current.startScroll - dx;
    };
    const onUp = () => {
      drag.current.active = false;
      el.classList.remove('grabbing');
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const scrollByDir = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section
      id="lookbook"
      className="bg-parchment text-ink relative overflow-hidden"
    >
      <div className="container mx-auto pt-20 md:pt-28 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
          <div className="md:col-span-7">
            <div className="eyebrow text-rouge">{data.eyebrow}</div>
            <h2 className="mt-3 font-display text-display-md tracking-tightest leading-[1.02]">
              {data.title}
            </h2>
          </div>
          <div className="md:col-span-5 flex items-end justify-between gap-4">
            <p className="text-sm md:text-base text-ink/70 max-w-sm">{data.body}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollByDir(-1)}
                aria-label="Previous look"
                data-cursor="hover"
                className="inline-flex h-11 w-11 items-center justify-center border border-ink/20 transition hover:bg-ink hover:text-cream"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByDir(1)}
                aria-label="Next look"
                data-cursor="hover"
                className="inline-flex h-11 w-11 items-center justify-center border border-ink/20 transition hover:bg-ink hover:text-cream"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        data-cursor="drag"
        data-cursor-label="Drag"
        className="drag-snap no-scrollbar flex overflow-x-auto cursor-grab pb-4 px-[5vw] md:px-[8vw] gap-5 md:gap-8"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {data.images.map((img, i) => (
          <figure
            key={img.title}
            className="shrink-0 w-[78vw] sm:w-[60vw] md:w-[42vw] lg:w-[34vw] xl:w-[30vw]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative aspect-[3/4] overflow-hidden hover-zoom grain">
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 eyebrow bg-cream/90 text-ink px-2.5 py-1">
                {img.title}
              </span>
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-display text-lg md:text-xl tracking-tightest">
                {img.caption}
              </span>
              <span className="eyebrow text-ink/55">
                0{i + 1}/{String(data.images.length).padStart(2, '0')}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="container mx-auto py-10 md:py-14">
        <div className="flex items-center gap-5">
          <span className="eyebrow text-ink/55 shrink-0">
            {String(active + 1).padStart(2, '0')} / {String(data.images.length).padStart(2, '0')}
          </span>
          <div className="relative h-[2px] flex-1 bg-ink/10">
            <div
              className="absolute left-0 top-0 h-full bg-rouge transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="eyebrow text-ink/55 shrink-0 hidden md:inline">Drag to explore</span>
        </div>
      </div>
    </section>
  );
};

export default Lookbook;