import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'velour-wishlist';

const read = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (ids) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / privacy mode
  }
};

export const useWishlist = () => {
  const [ids, setIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(read());
    setHydrated(true);
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setIds(read());
    };
    const onCustom = () => setIds(read());
    window.addEventListener('storage', onStorage);
    window.addEventListener('velour-wishlist-changed', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('velour-wishlist-changed', onCustom);
    };
  }, []);

  const persist = useCallback((next) => {
    setIds(next);
    write(next);
    window.dispatchEvent(new CustomEvent('velour-wishlist-changed'));
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id) => {
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      persist(next);
      return next.includes(id);
    },
    [ids, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { ids, has, toggle, clear, count: ids.length, hydrated };
};

export default useWishlist;