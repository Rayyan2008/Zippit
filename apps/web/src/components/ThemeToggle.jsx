import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'velour-theme';

const readTheme = () => {
  try {
    const t = window.localStorage.getItem(STORAGE_KEY);
    if (t === 'dark' || t === 'light') return t;
  } catch {
    // ignore
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const applyTheme = (t) => {
  document.documentElement.classList.toggle('dark', t === 'dark');
  try {
    window.localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('velour-theme-changed', { detail: t }));
};

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(readTheme());
    const onChange = (e) => setTheme(e.detail);
    window.addEventListener('velour-theme-changed', onChange);
    return () => window.removeEventListener('velour-theme-changed', onChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return { theme, toggle };
};

const ThemeToggle = ({ className = '', label = false }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center border border-ink/15 transition group-hover:border-ink">
        <Sun
          className={`absolute h-4 w-4 transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
      </span>
      {label && (
        <span className="eyebrow text-ink/70">{isDark ? 'Light' : 'Dark'}</span>
      )}
    </button>
  );
};

export default ThemeToggle;