import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import ScrollProgress from '@/components/ScrollProgress.jsx';
import RazorpayCheckout from '@/components/RazorpayCheckout.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { getProducts, getCategories } from '@/data/EcommerceApi';
import { site } from '@/data/site.js';
import { useTheme } from '@/components/ThemeToggle.jsx';

const ShopPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const { toggle: toggleTheme } = useTheme();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products + categories from Supabase on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [{ products: prods }, cats] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(p => {
      const price = p.price ?? parseFloat(
        (p.variants?.[0]?.price_formatted || '0').replace(/[₹,]/g, '')
      );
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  return (
    <>
      <Helmet>
        <title>{`Shop — ${site.brand.name}`}</title>
        <meta name="description" content="Browse our collection of handmade ethnic pouches and organizers." />
      </Helmet>

      <ScrollProgress />
      <CustomCursor />
      <RazorpayCheckout />

      <div className="min-h-screen bg-cream text-ink">
        <Header
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
        />

        <main className="container mx-auto pt-20 md:pt-28 pb-28 md:pb-40">
          <div className="mb-14 md:mb-20">
            <div className="eyebrow text-rouge">Shop Collection</div>
            <h1 className="font-display text-display-lg text-ink mt-3 leading-[0.95]">
              All products
              <span className="text-rouge italic font-light">.</span>
            </h1>
            <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-2xl">
              Explore our complete range of handcrafted ethnic handbags, pouches, scrunchies and organizers. Each piece is made with care by skilled artisans.
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Sidebar filters */}
            <aside className="lg:col-span-3 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-ink/40" />
                  <span className="eyebrow text-ink/60">Search</span>
                </div>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-ink/15 text-ink placeholder:text-ink/40"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="h-4 w-4 text-ink/40" />
                  <span className="eyebrow text-ink/60">Category</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      className={`eyebrow ${
                        selectedCategory === cat
                          ? 'bg-ink text-cream hover:bg-ink/90'
                          : 'border-ink/15 text-ink hover:bg-ink hover:text-cream'
                      }`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="eyebrow text-ink/60 mb-4">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </div>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-xs text-ink/50">
                  <span>₹0</span>
                  <span>₹5,000</span>
                </div>
              </div>

              <div>
                <div className="eyebrow text-ink/60 mb-4">Sort By</div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white border-ink/15 text-ink">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </aside>

            {/* Product grid */}
            <div className="lg:col-span-9">
              <div className="mb-8 flex items-center justify-between">
                <div className="eyebrow text-ink/55">
                  {loading ? 'Loading…' : `${filteredAndSortedProducts.length} product${filteredAndSortedProducts.length === 1 ? '' : 's'} found`}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-parchment mb-4" />
                      <div className="h-4 bg-parchment rounded w-3/4 mb-2" />
                      <div className="h-4 bg-parchment rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="py-20 text-center">
                  <Search className="h-16 w-16 text-ink/20 mx-auto mb-6" />
                  <h3 className="font-display text-2xl text-ink mb-3">No products found</h3>
                  <p className="text-sm text-ink/60 mb-8 max-w-md mx-auto">
                    Try adjusting your filters or search query.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setPriceRange([0, 5000]);
                      setSortBy('default');
                    }}
                    className="bg-ink text-cream hover:bg-ink/90"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-20">
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />

        <ShoppingCart isCartOpen={cartOpen} setIsCartOpen={setCartOpen} />
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          onOpenCart={() => setCartOpen(true)}
          onToggleTheme={toggleTheme}
        />
      </div>
    </>
  );
};

export default ShopPage;