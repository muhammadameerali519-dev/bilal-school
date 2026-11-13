import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatPKR } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { LuxuryImage } from './GlassUI';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const wishlisted = isInWishlist(product.id);

  const hasDiscount =
    product.originalPrice > product.price && product.originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-[26px] p-3.5 flex flex-col justify-between group transition-shadow duration-200 hover:shadow-[0_24px_54px_-14px_rgba(181,18,59,0.22)]"
    >
      <div>
        {/* Product Image Container (4:3 uniform aspect) */}
        <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-white/60 mb-4">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <LuxuryImage
              src={product.images[0]}
              alt={product.name}
              fallbackTitle={product.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Top-right Squircle Action Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.86 }}
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className={`glass-squircle-icon w-9 h-9 flex items-center justify-center cursor-pointer transition-colors ${
                wishlisted
                  ? 'text-[#E32652] bg-white/95'
                  : 'text-[#230B14] hover:text-[#E32652]'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#E32652]' : ''}`} />
            </motion.button>

            <button
              type="button"
              onClick={() => setQuickViewProduct(product)}
              aria-label="Quick View Product"
              className="glass-squircle-icon w-9 h-9 flex items-center justify-center text-[#230B14] hover:text-[#B5123B] cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {hasDiscount && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[10px] bg-[#B5123B]/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide tabular-nums">
              {discountPercent}% Off
            </div>
          )}
        </div>

        {/* Clean Unboxed Metadata */}
        <div className="px-1">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[#6E3F50] mb-1.5 truncate">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.isAvailable ? product.availability : 'Unavailable'}</span>
            {product.isSample && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#B5123B] font-medium">Sample</span>
              </>
            )}
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-xl font-semibold text-[#230B14] group-hover:text-[#B5123B] transition-colors leading-snug line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Price & Add to Cart Row */}
      <div className="px-1 pt-3 mt-2 border-t border-white/60 flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold text-[#230B14] tabular-nums">
            {formatPKR(product.price)}
          </p>
          {hasDiscount && (
            <p className="text-xs text-[#6E3F50] line-through tabular-nums">
              {formatPKR(product.originalPrice)}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!product.isAvailable || product.availability === 'Out of Stock'}
          onClick={() => addToCart(product, 1, product.colors[0])}
          className={`glass-shimmer px-3.5 py-2.5 rounded-[14px] inline-flex items-center gap-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            product.isAvailable && product.availability !== 'Out of Stock'
              ? 'glass-crimson-btn text-white'
              : 'bg-white/50 text-[#6E3F50] cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{product.isAvailable ? 'Add to Bag' : 'Sold Out'}</span>
        </button>
      </div>
    </motion.article>
  );
};
