import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site.js';
import CountdownTimer from '@/components/CountdownTimer.jsx';
import MagneticButton from '@/components/MagneticButton.jsx';

const HeroSection = () => {
  const { eyebrow, stack, body, primaryCta, secondaryCta, image, secondaryImage } = site.hero;
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const parallax = Math.min(scrollY * 0.25, 200);
  const heroLetters = stack.join('').split('');

  return (
    <section
      id="hero"
      ref={ref}
      className="relative overflow-hidden bg-cream text-ink"
    >
      <div className="container mx-auto pt-4 md:pt-6 pb-10 md:pb-16">
        <div className="flex items-center justify-between mb-6 md:mb-10 border-b border-ink/15 pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-signal blink" />
            <span className="eyebrow text-ink/70">{eyebrow}</span>
          </div>
          <span className="eyebrow text-ink/55 hidden sm:inline">
            {site.brand.wordmark} / Édition {site.brand.foundedYear}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="hidden lg:flex lg:col-span-1 flex-col items-start justify-between border-r border-ink/15 pr-4 py-4">
            <div className="flex flex-col gap-3 eyebrow text-ink/55">
              <span>N°</span>
              <span className="font-display text-2xl text-ink leading-none">001</span>
            </div>
            <div
              aria-hidden="true"
              className="font-display tracking-tightest text-ink/85 select-none"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontSize: 'clamp(1.6rem, 2vw, 2.4rem)',
                lineHeight: 1,
              }}
            >
              {site.hero.body.split('.')[0]}.
            </div>
            <div className="flex flex-col gap-3 eyebrow text-ink/55">
              <span>{site.brand.season}</span>
              <span>{site.brand.volume}</span>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-7 relative">
            <h1
              className="font-display text-display-2xl text-ink select-none"
              aria-label={stack.join(' ')}
            >
              {heroLetters.map((ch, i) => (
                <span
                  key={`l-${i}`}
                  className={`inline-block transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mounted
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${80 + i * 45}ms` }}
                >
                  {ch}
                </span>
              ))}
            </h1>

            <div
              className={`mt-2 grid grid-cols-12 gap-x-4 transition-all duration-1000 delay-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="col-span-12 md:col-span-7">
                <p className="text-base md:text-lg text-ink/75 leading-relaxed max-w-md">
                  {body}
                </p>
              </div>
              <div className="col-span-12 md:col-span-5 mt-4 md:mt-0">
                <div className="border-t border-ink/15 pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6 md:h-full">
                  <div className="eyebrow text-ink/55 mb-2">{site.drop.subtitle}</div>
                  <CountdownTimer
                    targetDate={site.drop.date}
                    size="md"
                    finishedLabel={site.drop.finishedLabel}
                  />
                </div>
              </div>
            </div>

            <div
              className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 transition-all duration-1000 delay-[800ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <a
                href={primaryCta.href}
                data-cursor="hover"
                className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-cream eyebrow transition-colors hover:bg-rouge"
              >
                {primaryCta.label}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={secondaryCta.href}
                data-cursor="hover"
                className="link-underline eyebrow text-ink"
              >
                {secondaryCta.label}
              </a>
            </div>

            <div
              className={`mt-8 grid grid-cols-3 max-w-md transition-all duration-1000 delay-[900ms] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="border-r border-ink/15 pr-3">
                <div className="font-display text-2xl text-ink leading-none">06</div>
                <div className="eyebrow text-ink/55 mt-2">New pieces</div>
              </div>
              <div className="border-r border-ink/15 px-3">
                <div className="font-display text-2xl text-ink leading-none">03</div>
                <div className="eyebrow text-ink/55 mt-2">Ateliers</div>
              </div>
              <div className="pl-3">
                <div className="font-display text-2xl text-ink leading-none">100%</div>
                <div className="eyebrow text-ink/55 mt-2">Carbon-offset</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-4 relative" data-cursor="drag" data-cursor-label="Drag">
            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden grain">
              <img
                src={image.src}
                alt={image.alt}
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: `translate3d(0, ${-parallax}px, 0) scale(1.08)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between text-cream">
                <span className="eyebrow drop-shadow">Look 01 / 06</span>
                <span className="eyebrow drop-shadow">Photographed in Porto</span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 rounded-full bg-rouge text-cream flex items-center justify-center animate-spin-slow"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <path
                    id="hero-circle"
                    d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  />
                </defs>
                <text className="fill-current font-mono uppercase" style={{ fontSize: 9, letterSpacing: 4 }}>
                  <textPath href="#hero-circle">
                    {`${site.brand.season}  ·  Volume One  ·  Drop live  ·  `}
                  </textPath>
                </text>
              </svg>
            </div>

            <div className="hidden md:block absolute -bottom-8 -left-8 w-32 lg:w-40 aspect-[3/4] overflow-hidden border-[6px] border-cream shadow-2xl hover-zoom">
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 flex items-center justify-between text-ink/55 border-t border-ink/15 pt-4">
          <a
            href="#collection"
            data-cursor="hover"
            className="inline-flex items-center gap-3 eyebrow link-underline"
          >
            <ArrowDown className="h-4 w-4 animate-bounce" />
            Scroll to Collection
          </a>
          <span className="eyebrow hidden sm:inline">{site.brand.tagline}</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;