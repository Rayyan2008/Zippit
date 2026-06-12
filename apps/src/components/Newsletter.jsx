import React, { useState } from 'react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { site } from '@/data/site.js';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

const Newsletter = () => {
  const { eyebrow, title, body, placeholder, cta, finePrint } = site.newsletter;
  const titleParts = Array.isArray(title) ? title : [title];
  const contact = site.contact;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const anim = useScrollAnimation({ threshold: 0.15 });

  const onSubmit = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section
      id="contact"
      ref={anim.ref}
      className={`relative bg-ink text-cream overflow-hidden reveal ${
        anim.isVisible ? 'is-visible' : ''
      }`}
    >
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-rouge/30 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-[22rem] w-[22rem] rounded-full bg-wine/40 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container mx-auto py-20 md:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="eyebrow text-rouge">{eyebrow}</div>
            <h2 className="mt-4 font-display text-display-xl leading-[0.92] text-cream">
              {titleParts.map((w, i) => (
                <span key={`${w}-${i}`} className="block">
                  {i === titleParts.length - 1 ? (
                    <span className="italic font-light text-rouge">{w}</span>
                  ) : (
                    w
                  )}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-md text-lg text-cream/75 leading-relaxed">
              {body}
            </p>

            <form onSubmit={onSubmit} className="mt-10 max-w-xl" noValidate>
              <div
                className={`flex items-stretch border-b transition-colors ${
                  error ? 'border-rouge' : 'border-cream/40 focus-within:border-cream'
                }`}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent py-5 text-lg text-cream placeholder:text-cream/40 focus:outline-none"
                />
                <button
                  type="submit"
                  data-cursor="hover"
                  className="group inline-flex items-center gap-2 px-6 eyebrow text-cream transition hover:text-rouge"
                >
                  {submitted ? (
                    <>
                      <Check className="h-4 w-4" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      {cta}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
              <p
                className={`mt-3 text-xs ${
                  error ? 'text-rouge' : 'text-cream/50'
                }`}
              >
                {error || (submitted ? 'Welcome to the list. Check your inbox.' : finePrint)}
              </p>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="eyebrow text-cream/55">{contact.eyebrow}</div>
            <h3 className="mt-3 font-display text-3xl md:text-4xl tracking-tightest text-cream">
              {contact.title}
            </h3>
            <p className="mt-4 text-cream/70 max-w-sm leading-relaxed">{contact.body}</p>

            <ul className="mt-8 space-y-5">
              {/* Optional chaining safely handles if locations is undefined */}
              {contact.locations?.map((l) => (
                <li
                  key={l.city}
                  className="flex items-start gap-4 border-t border-cream/15 pt-5"
                >
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-rouge" />
                  <div className="flex-1">
                    <div className="font-display text-xl text-cream tracking-tightest">
                      {l.city}
                    </div>
                    <div className="text-sm text-cream/65 mt-0.5">{l.address}</div>
                  </div>
                  <div className="eyebrow text-cream/55 shrink-0 mt-1">{l.hours}</div>
                </li>
              ))}
              
              {/* Fallback to single address structure if locations array doesn't exist */}
              {!contact.locations && contact.address && (
                <li className="flex items-start gap-4 border-t border-cream/15 pt-5">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-rouge" />
                  <div className="flex-1">
                    <div className="font-display text-xl text-cream tracking-tightest">
                      {site.brand.name} Studio
                    </div>
                    <div className="text-sm text-cream/65 mt-0.5">{contact.address}</div>
                  </div>
                  <div className="eyebrow text-cream/55 shrink-0 mt-1">{contact.hours}</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;