import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { site } from '@/data/site.js';
import CountdownTimer from '@/components/CountdownTimer.jsx';

const AnnouncementBar = () => {
  const items = site.announcement?.items ?? [];
  const cta = site.announcement?.cta;
  const drop = site.drop;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  if (!items.length) return null;

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  const current = items[index];
  const isDropMessage = current.toLowerCase().includes('drops in');

  return (
    <div
      className="w-full bg-ink text-cream border-b border-cream/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Site announcements"
    >
      <div className="container mx-auto flex h-9 items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-3 shrink-0 eyebrow text-cream/70">
          <span className="inline-block h-2 w-2 rounded-full bg-signal blink" />
          {site.brand.season} · {site.brand.volume}
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous announcement"
          className="hidden sm:inline-flex shrink-0 opacity-70 transition hover:opacity-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div className="relative flex-1 overflow-hidden text-center">
          <div className="flex h-9 items-center justify-center gap-3">
            <p
              key={index}
              className="eyebrow animate-fade-in truncate"
              aria-live="polite"
            >
              {current}
            </p>
            {isDropMessage && drop?.date && (
              <CountdownTimer
                targetDate={drop.date}
                size="sm"
                showLabels={false}
                finishedLabel={drop.finishedLabel}
                className="text-cream"
              />
            )}
          </div>
        </div>

        {cta?.href && (
          <a
            href={cta.href}

            className="hidden md:inline-flex shrink-0 items-center gap-1.5 eyebrow opacity-90 transition hover:opacity-100"
          >
            {cta.label}
            <ArrowRight className="h-3 w-3" />
          </a>
        )}

        <button
          type="button"
          onClick={goNext}
          aria-label="Next announcement"
          className="hidden sm:inline-flex shrink-0 opacity-70 transition hover:opacity-100"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;