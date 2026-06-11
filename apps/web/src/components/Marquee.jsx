import React from 'react';

const Marquee = ({
  items = [],
  separator = '✦',
  reverse = false,
  speed = 'default',
  variant = 'ink',
  size = 'lg',
  italic = false,
  className = '',
}) => {
  if (!items.length) return null;

  const speedClass =
    speed === 'slow'
      ? 'animate-marquee-slow'
      : speed === 'fast'
        ? 'animate-marquee-fast'
        : reverse
          ? 'animate-marquee-reverse'
          : 'animate-marquee';

  const variantClasses = {
    ink: 'bg-ink text-cream border-ink',
    cream: 'bg-cream text-ink border-ink/15',
    rouge: 'bg-rouge text-cream border-rouge',
    blush: 'bg-blush text-ink border-ink/10',
    parchment: 'bg-parchment text-ink border-ink/10',
    transparent: 'bg-transparent text-ink',
    outlined: 'bg-cream text-ink border-ink',
  };

  const sizeClasses = {
    sm: 'py-2 text-xs',
    md: 'py-3 text-sm',
    lg: 'py-4 text-base md:text-lg',
    xl: 'py-6 text-2xl md:text-4xl font-display',
    xxl: 'py-10 text-5xl md:text-7xl font-display tracking-tightest',
    xxxl: 'py-14 text-6xl md:text-[9rem] font-display tracking-tightest leading-none',
  };

  const loop = [...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden border-y ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className={`marquee-track ${speedClass}`}>
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex shrink-0 items-center gap-6 px-6 whitespace-nowrap uppercase tracking-[0.18em] ${
              italic ? 'italic font-light' : ''
            }`}
          >
            <span>{item}</span>
            <span className="select-none opacity-50" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;