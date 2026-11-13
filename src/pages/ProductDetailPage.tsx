import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/formatters';
import { LuxuryImage } from '../components/GlassUI';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setActiveImageIdx(0);
      setSelectedColor(product.colors[0] || 'Signature Finish');
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="px-4 sm:px-6 py-16 max-w-3xl mx-auto text-center">
        <div className="glass-panel-strong rounded-[32px] p-10">
          <h1 className="font-serif text-4xl font-semibold text-[#230B14] mb-3">
            Piece Not Found
          </h1>
          <p className="text-sm text-[#6E3F50] mb-6">
            The jewellery piece you selected may have been updated or archived.
          </p>
          <Link
            to="/collections"
            className="glass-crimson-btn px-6 py-3.5 rounded-[14px] text-xs font-semibold text-white inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collections</span>
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const hasDiscount = product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-16">
        <div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E3F50] hover:text-[#B5123B] mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collections</span>
          </Link>

          <div className="glass-panel-strong rounded-[34px] p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Gallery with Animated Crossfade & Hover Zoom */}
            <div className="lg:col-span-7 space-y-4">
              <div
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setZoomActive((z) => !z)}
                className="relative aspect-[4/3] w-full rounded-[26px] overflow-hidden bg-white/75 border border-white cursor-zoom-in"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={product.images[activeImageIdx]}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full"
                    style={
                      zoomActive
                        ? {
                            transform: 'scale(1.65)',
                            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                            transition: 'transform 0.12s ease-out',
                          }
                        : { transition: 'transform 0.3s ease-out' }
                    }
                  >
                    <LuxuryImage
                      src={product.images[activeImageIdx] || product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-3 right-3 glass-squircle-icon px-3 py-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#230B14] pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-[#B5123B]" />
                  <span>{zoomActive ? 'Zoomed' : 'Hover or Tap to Zoom'}</span>
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-24 aspect-[4/3] rounded-[14px] overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-[#B5123B] scale-[1.03]'
                          : 'border-white/70 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <LuxuryImage
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#6E3F50] mb-2">
                  {product.category} · {product.isAvailable ? product.availability : 'Unavailable'}
                  {product.isSample ? ' · Editable Sample' : ''}
                </p>

                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14] leading-tight mb-4">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#B5123B] tabular-nums">
                    {formatPKR(product.price)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-[#6E3F50] line-through tabular-nums">
                        {formatPKR(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-[#E32652]">
                        Save {discountPct}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#6E3F50] leading-relaxed">
                {product.description}
              </p>

              {/* Materials & Availability Details */}
              <div className="rounded-[20px] bg-white/55 border border-white/80 p-4 space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-[#6E3F50]">Materials</span>
                  <span className="font-semibold text-[#230B14] text-right">
                    {product.materials}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6E3F50]">Availability</span>
                  <span className="font-semibold text-[#B5123B]">
                    {product.isAvailable ? `${product.availability} (${product.stockCount} listed)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Color Options */}
              {product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#230B14] mb-2.5">
                    Select Finish / Colour: <span className="text-[#B5123B]">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-[13px] text-xs font-semibold transition-all cursor-pointer ${
                          selectedColor === color
                            ? 'bg-[#B5123B] text-white shadow-sm'
                            : 'bg-white/70 border border-white text-[#230B14] hover:bg-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Purchase Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-[14px] bg-white/75 border border-white px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#FFE0EB] cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#FFE0EB] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!product.isAvailable || product.availability === 'Out of Stock'}
                    onClick={() => addToCart(product, quantity, selectedColor)}
                    className="glass-shimmer glass-crimson-btn flex-1 py-3.5 px-5 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Toggle Wishlist"
                    className="glass-squircle-icon w-12 h-12 flex items-center justify-center text-[#E32652] cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#E32652]' : ''}`} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!product.isAvailable || product.availability === 'Out of Stock'}
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-[16px] bg-white/80 hover:bg-white border border-white text-xs sm:text-sm font-semibold text-[#B5123B] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now &amp; Generate Receipt</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#6E3F50] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#B5123B] shrink-0" />
                <span>
                  Instant PDF receipt &amp; WhatsApp confirmation concierge included on every order.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14] mb-6">
              Pair With Complementary Pieces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
