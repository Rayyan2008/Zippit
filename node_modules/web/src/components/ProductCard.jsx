import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart.jsx';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useToast } from '@/hooks/use-toast';

const ProductCard = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const wishlist = useWishlist();
  const { toast } = useToast();
  const liked = wishlist.has(product.id);

  const defaultVariant = product.variants?.[0];
  const displayPrice = defaultVariant?.sale_price_formatted || defaultVariant?.price_formatted || '';
  const hasMultipleImages = product.images && product.images.length > 1;
  const hoverImage = hasMultipleImages ? product.images[1]?.url : null;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultVariant) {
      toast({
        title: 'Product unavailable',
        description: 'This product cannot be added to cart.',
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);
    try {
      const availableQuantity = defaultVariant.manage_inventory 
        ? defaultVariant.inventory_quantity 
        : 999;
      
      await addToCart(product, defaultVariant, 1, availableQuantity);
      
      toast({
        title: 'Added to bag',
        description: `${product.title} has been added to your bag.`,
      });
    } catch (error) {
      toast({
        title: 'Cannot add to bag',
        description: error.message || 'This item is out of stock.',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setAdding(false), 1400);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(product.id);
  };

  return (
    <article
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/product/${product.id}`}
        aria-label={`View ${product.title}`}
        data-cursor="hover"
        className="relative block aspect-[3/4] overflow-hidden bg-parchment"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hovered && hoverImage
              ? 'opacity-0 scale-105'
              : 'opacity-100 scale-100'
          }`}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        )}

        {product.ribbon_text && (
          <span className="absolute top-3 left-3 eyebrow bg-cream/95 text-ink px-2.5 py-1">
            {product.ribbon_text}
          </span>
        )}

        <button
          type="button"
          onClick={handleLike}
          aria-label={liked ? `Remove ${product.title} from wishlist` : `Save ${product.title}`}
          aria-pressed={liked}
          data-cursor="hover"
          className={`absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center transition ${
            liked
              ? 'bg-rouge text-cream'
              : 'bg-cream/95 text-ink hover:bg-ink hover:text-cream'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.title} to bag`}
          data-cursor="hover"
          disabled={adding}
          className={`absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 px-4 py-3 eyebrow transition-all duration-500 ${
            adding
              ? 'bg-rouge text-cream translate-y-0 opacity-100'
              : `bg-ink text-cream ${
                  hovered
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-2 opacity-0'
                } group-hover:translate-y-0 group-hover:opacity-100`
          }`}
        >
          {adding ? 'Added to bag' : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Quick add — {displayPrice}
            </>
          )}
        </button>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow text-ink/50">
            {product.category}
          </div>
          <h3 className="font-display text-xl md:text-2xl tracking-tightest text-ink mt-1.5">
            <Link to={`/product/${product.id}`} className="link-underline">
              {product.title}
            </Link>
          </h3>
          {product.subtitle && (
            <div className="mt-1 text-sm text-ink/60">{product.subtitle}</div>
          )}
        </div>
        <div className="font-mono text-sm text-ink shrink-0 mt-1.5">
          {displayPrice}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;