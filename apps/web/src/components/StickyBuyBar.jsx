import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { site } from '@/data/site.js';

const StickyBuyBar = ({ onAddToCart }) => {
  const { spotlight } = site;
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return undefined;
    const onScroll = () => {
      const trigger = document.getElementById('spotlight');
      const stop = document.getElementById('contact');
      if (!trigger) return;
      const t = trigger.getBoundingClientRect();
      const s = stop ? stop.getBoundingClientRect() : null;
      const past = t.bottom < window.innerHeight * 0.6;
      const before = !s || s.top > window.innerHeight * 0.5;
      setVisible(past && before);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  const handleAdd = () => {
    onAddToCart?.({
      id: 'bloom-trench',
      name: 'The Bloom Trench',
      price: 480,
      image: spotlight.image.src,
      colorName: 'Stone',
    });
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed left-1/2 z-30 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? 'bottom-5 opacity-100 translate-y-0'
          : 'bottom-0 opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 bg-ink text-cream pl-3 pr-2 py-2 sm:py-2.5 shadow-2xl border border-cream/15 max-w-[calc(100vw-1.5rem)]">
        <img
          src={spotlight.image.src}
          alt=""
          className="h-10 w-8 object-cover hidden sm:block"
        />
        <div className="min-w-0">
          <div className="font-display text-sm sm:text-base tracking-tightest truncate">
            The Bloom Signature
          </div>
          <div className="eyebrow text-cream/60 truncate">
            {spotlight.price} · Stone
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          data-cursor="hover"
          className="ml-1 sm:ml-2 inline-flex items-center gap-2 bg-cream px-4 py-2.5 text-ink eyebrow transition hover:bg-rouge hover:text-cream"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss buy bar"
          data-cursor="hover"
          className="ml-0.5 inline-flex h-9 w-9 items-center justify-center text-cream/55 transition hover:text-cream"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StickyBuyBar;