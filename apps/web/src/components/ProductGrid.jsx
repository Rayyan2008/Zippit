import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard.jsx';
import { products as localProducts } from '@/data/products.js';
import { getProducts } from '@/data/EcommerceApi';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';
import { Skeleton } from '@/components/ui/skeleton';

const SPAN_CLASSES = [
  'sm:col-span-2 lg:col-span-2',
  'sm:col-span-2 lg:col-span-1',
  'sm:col-span-2 lg:col-span-1',
  'sm:col-span-2 lg:col-span-1',
  'sm:col-span-2 lg:col-span-1',
  'sm:col-span-2 lg:col-span-2',
];

const TOP_OFFSETS = ['lg:translate-y-0', 'lg:translate-y-12', 'lg:translate-y-0', 'lg:translate-y-16', 'lg:translate-y-4', 'lg:translate-y-12'];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const anim = useScrollAnimation({ threshold: 0.05 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts({ limit: '50' });
        const apiProducts = response.products || [];
        
        if (apiProducts.length > 0) {
          setProducts(apiProducts);
        } else {
          setProducts(localProducts.slice(0, 6));
        }
      } catch (err) {
        setProducts(localProducts.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="collection" ref={anim.ref} className="bg-cream">
      <div className="container mx-auto pt-20 md:pt-28 pb-28 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 mb-14 md:mb-20 items-end">
          <div className="md:col-span-7">
            <div className="eyebrow text-rouge">Featured Collection</div>
            <h2 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
              Handmade Scrunchies
              <span className="text-rouge italic font-light">.</span>
            </h2>
            <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-xl">
              Discover our curated selection of handcrafted ethnic pouches and organizers.
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-24">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-span-1">
                <Skeleton className="aspect-[3/4] w-full bg-parchment" />
                <div className="mt-5 space-y-2">
                  <Skeleton className="h-4 w-24 bg-parchment" />
                  <Skeleton className="h-6 w-3/4 bg-parchment" />
                  <Skeleton className="h-4 w-1/2 bg-parchment" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="py-16 text-center">
            <p className="eyebrow text-ink/55 mb-4">Unable to load products</p>
            <p className="text-sm text-ink/40">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-16 text-center eyebrow text-ink/55">
            No products available at this time.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-24 transition-opacity duration-500 ${
              anim.isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {products.map((product, i) => {
              const span = SPAN_CLASSES[i % SPAN_CLASSES.length];
              const offset = TOP_OFFSETS[i % TOP_OFFSETS.length];
              return (
                <div
                  key={product.id}
                  className={`col-span-1 ${span} ${offset} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    anim.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <ProductCard product={product} index={i} />
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-20 md:mt-28 flex items-center justify-between border-t border-ink/10 pt-10">
            <div className="eyebrow text-ink/55">
              Showing {products.length} piece{products.length === 1 ? '' : 's'}
            </div>
            <a
              href="#collection"
              data-cursor="hover"
              className="inline-flex items-center gap-2 eyebrow text-ink link-underline"
            >
              Back to top
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;