import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState('default');
  const [label, setLabel] = useState('');
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const fineHover =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fineHover) return undefined;

    setEnabled(true);
    document.documentElement.classList.add('cursor-active');

    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      raf.current = window.requestAnimationFrame(tick);
    };
    raf.current = window.requestAnimationFrame(tick);

    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) {
        setVariant(t.dataset.cursor || 'hover');
        setLabel(t.dataset.cursorLabel || '');
        return;
      }
      const interactive = e.target.closest(
        'a, button, input, textarea, [role="button"], [data-radix-collection-item]',
      );
      if (interactive) {
        setVariant('hover');
        setLabel('');
        return;
      }
      setVariant('default');
      setLabel('');
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove('cursor-active');
    };
  }, []);

  if (!enabled) return null;

  const isHover = variant === 'hover';
  const isDrag = variant === 'drag';
  const isLabeled = !!label;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rouge transition-opacity duration-200"
        style={{ mixBlendMode: 'difference' }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9997] flex items-center justify-center text-[10px] uppercase tracking-[0.22em] text-cream transition-[width,height,background-color,color,border-radius] duration-300"
        style={{
          mixBlendMode: 'difference',
          transform: 'translate3d(-100px, -100px, 0)',
          width: isLabeled ? 88 : isHover || isDrag ? 56 : 28,
          height: isLabeled ? 88 : isHover || isDrag ? 56 : 28,
          marginLeft: isLabeled ? -44 : isHover || isDrag ? -28 : -14,
          marginTop: isLabeled ? -44 : isHover || isDrag ? -28 : -14,
          background: isHover || isDrag || isLabeled ? 'hsl(var(--rouge))' : 'transparent',
          border: '1px solid hsl(var(--cream))',
          borderRadius: '999px',
        }}
      >
        {label && <span className="font-mono">{label}</span>}
      </div>
    </>
  );
};

export default CustomCursor;