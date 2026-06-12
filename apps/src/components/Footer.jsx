import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { site } from '@/data/site.js';

const Footer = () => {
  const { columns, socials, legal } = site.footer;

  return (
    <footer className="bg-cream text-ink border-t border-ink/10">
      <div className="container mx-auto pt-20 md:pt-24 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-4">
            <Link
              to="/"
              data-cursor="hover"
              className="font-display text-3xl tracking-tightest text-ink"
            >
              {site.brand.wordmark}
            </Link>
            <p className="mt-5 text-sm text-ink/65 max-w-xs leading-relaxed">
              {site.brand.description}
            </p>
            <div className="mt-6 eyebrow text-ink/55">{site.brand.address}</div>
            <a
              href={`mailto:${site.brand.email}`}
              data-cursor="hover"
              className="mt-3 inline-flex items-center gap-2 eyebrow link-underline"
            >
              {site.brand.email}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <div className="eyebrow text-ink/55">{col.title}</div>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <Link
                        to={l.href}
                        data-cursor="hover"
                        className="text-sm text-ink/85 link-underline transition hover:text-rouge"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        data-cursor="hover"
                        className="text-sm text-ink/85 link-underline transition hover:text-rouge"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-2">
            <div className="eyebrow text-ink/55">Follow</div>
            <ul className="mt-5 space-y-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    data-cursor="hover"
                    className="inline-flex items-center gap-3 text-sm text-ink/85 link-underline transition hover:text-rouge"
                    aria-label={s.name}
                  >
                    <span className="font-mono text-xs text-ink/50">{s.short}</span>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-20 hairline" />

        <div
          aria-hidden="true"
          className="mt-10 md:mt-14 select-none font-display tracking-tightest leading-none text-ink"
          style={{ fontSize: 'clamp(4rem, 18vw, 16rem)' }}
        >
          <span className="block text-center">{site.brand.wordmark}</span>
        </div>

        <div className="ticker-line mt-6" />

        <div className="mt-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-ink/55">
            © {new Date().getFullYear()} {site.brand.wordmark}. {site.brand.tagline}
            <br />
            <span className="text-ink/40 dark:text-cream/40 text-xs">Website Designed and Developed by <a href="https://www.sapotoinfosys.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-rouge transition-colors">Sapoto Infosys</a></span>
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  data-cursor="hover"
                  className="text-xs text-ink/65 transition hover:text-rouge"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;