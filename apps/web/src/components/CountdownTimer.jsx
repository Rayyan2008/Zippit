import React, { useEffect, useState } from 'react';

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

const computeRemaining = (target) => {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, finished: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    finished: false,
  };
};

const CountdownTimer = ({
  targetDate,
  className = '',
  size = 'md',
  finishedLabel = 'Live',
  showLabels = true,
}) => {
  const target = typeof targetDate === 'string' ? new Date(targetDate).getTime() : targetDate;
  const [t, setT] = useState(() => computeRemaining(target));

  useEffect(() => {
    setT(computeRemaining(target));
    const id = window.setInterval(() => setT(computeRemaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const sizes = {
    sm: { num: 'text-base font-mono', label: 'text-[9px]' },
    md: { num: 'text-2xl md:text-3xl font-display tracking-tightest', label: 'text-[10px]' },
    lg: { num: 'text-4xl md:text-6xl font-display tracking-tightest', label: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  if (t.finished) {
    return (
      <span
        className={`inline-flex items-center gap-2 font-mono uppercase tracking-[0.22em] ${className}`}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-signal blink" />
        {finishedLabel}
      </span>
    );
  }

  const parts = [
    { v: t.d, l: 'days' },
    { v: t.h, l: 'hrs' },
    { v: t.m, l: 'min' },
    { v: t.s, l: 'sec' },
  ];

  return (
    <div className={`inline-flex items-baseline gap-3 ${className}`}>
      {parts.map((p, i) => (
        <React.Fragment key={p.l}>
          <div className="flex flex-col items-center">
            <span className={`leading-none ${s.num}`}>{pad(p.v)}</span>
            {showLabels && (
              <span
                className={`mt-1 font-mono uppercase tracking-[0.22em] opacity-60 ${s.label}`}
              >
                {p.l}
              </span>
            )}
          </div>
          {i < parts.length - 1 && (
            <span className={`opacity-40 ${s.num} leading-none`}>:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;