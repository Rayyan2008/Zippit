import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { getProduct } from '@/data/EcommerceApi';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProduct(id);
        setProduct(data);
        setSelectedVariant(data.variants?.[0] || null);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        title: 'Please select a variant',
        description: 'Choose product options before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);
    try {
      const availableQuantity = selectedVariant.manage_inventory 
        ? selectedVariant.inventory_quantity 
        : 999;
      
      await addToCart(product, selectedVariant, quantity, availableQuantity);
      
      toast({
        title: 'Added to bag',
        description: `${product.title} has been added to your bag.`,
      });
    } catch (err) {
      toast({
        title: 'Cannot add to bag',
        description: err.message || 'This item is out of stock.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const displayPrice = selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted || '';
  const originalPrice = selectedVariant?.sale_price_formatted ? selectedVariant?.price_formatted : null;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading...</title>
        </Helmet>
        <div className="min-h-screen bg-cream text-ink">
          <Header />
          <main className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full bg-parchment" />
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square bg-parchment" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4 bg-parchment" />
                <Skeleton className="h-6 w-1/4 bg-parchment" />
                <Skeleton className="h-24 w-full bg-parchment" />
                <Skeleton className="h-12 w-full bg-parchment" />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found</title>
        </Helmet>
        <div className="min-h-screen bg-cream text-ink flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <h1 className="font-display text-4xl tracking-tightest text-ink mb-4">
                Product not found
              </h1>
              <p className="text-lg text-ink/70 mb-8">
                {error || 'The product you are looking for does not exist.'}
              </p>
              <Button asChild className="bg-ink text-cream hover:bg-ink/90">
                <Link to="/">Back to collection</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.image, order: 0 }];

  return (
    <>
      <Helmet>
        <title>{`${product.title} — Premium Collection`}</title>
        <meta name="description" content={product.subtitle || product.title} />
      </Helmet>

      <div className="min-h-screen bg-cream text-ink">
        <Header />

        <main className="container mx-auto px-4 py-8 md:py-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 eyebrow text-ink hover:text-rouge transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden bg-parchment">
                <img
                  src={images[selectedImage]?.url || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square overflow-hidden bg-parchment transition ${
                        selectedImage === i ? 'ring-2 ring-ink' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                {product.ribbon_text && (
                  <span className="inline-block eyebrow bg-rouge/10 text-rouge px-3 py-1 mb-4">
                    {product.ribbon_text}
                  </span>
                )}
                <h1 className="font-display text-4xl md:text-5xl tracking-tightest text-ink">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="mt-2 text-lg text-ink/70">{product.subtitle}</p>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl text-ink">{displayPrice}</span>
                {originalPrice && (
                  <span className="font-mono text-xl text-ink/40 line-through">{originalPrice}</span>
                )}
              </div>

              {product.variants && product.variants.length > 1 && (
                <div className="space-y-3">
                  <label className="eyebrow text-ink">Select variant</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2.5 eyebrow border transition ${
                          selectedVariant?.id === variant.id
                            ? 'bg-ink text-cream border-ink'
                            : 'bg-transparent text-ink border-ink/15 hover:border-ink'
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="eyebrow text-ink">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 hover:border-ink hover:bg-ink hover:text-cream transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-lg text-ink w-12 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 hover:border-ink hover:bg-ink hover:text-cream transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={adding || !selectedVariant}
                className="w-full bg-ink text-cream hover:bg-ink/90 py-6 text-base eyebrow"
              >
                {adding ? (
                  'Adding to bag...'
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to bag
                  </>
                )}
              </Button>

              {product.description && (
                <div 
                  className="prose prose-sm max-w-none text-ink/70"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {product.additional_info && product.additional_info.length > 0 && (
                <div className="space-y-4 border-t border-ink/10 pt-8">
                  {product.additional_info.map((info) => (
                    <div key={info.id}>
                      <h3 className="eyebrow text-ink mb-2">{info.title}</h3>
                      <div 
                        className="text-sm text-ink/70"
                        dangerouslySetInnerHTML={{ __html: info.description }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;