import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/formatters';
import { LuxuryImage } from './GlassUI';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0] || 'Signature Finish');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const wishlisted = isInWishlist(quickViewProduct.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[85] flex items-center justify-center p-2.5 sm:p-4 no-print">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-[#230B14]/40 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-panel-strong rounded-[24px] sm:rounded-[32px] p-4 sm:p-7"
        >
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            aria-label="Close Quick View"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] hover:text-[#B5123B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            <div className="aspect-[4/3] md:aspect-auto md:h-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-white/75">
              <LuxuryImage
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain sm:object-cover"
              />
            </div>

            <div className="flex flex-col justify-between py-0.5 sm:py-1">
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-[#6E3F50] mb-1.5">
                  {quickViewProduct.category} · {quickViewProduct.availability}
                  {quickViewProduct.isSample ? ' · Sample' : ''}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#230B14] leading-tight mb-2.5 sm:mb-3">
                  {quickViewProduct.name}
                </h2>
                <div className="flex items-baseline gap-3 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-[#B5123B] tabular-nums">
                    {formatPKR(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-[#6E3F50] line-through tabular-nums">
                      {formatPKR(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#6E3F50] leading-relaxed mb-3.5 line-clamp-3">
                  {quickViewProduct.description}
                </p>

                <p className="text-xs text-[#230B14] mb-4">
                  <span className="font-semibold">Materials:</span> {quickViewProduct.materials}
                </p>

                {/* Color Selection */}
                {quickViewProduct.colors.length > 0 && (
                  <div className="mb-4 sm:mb-5">
                    <p className="text-xs font-semibold text-[#230B14] mb-2">
                      Finish / Colour
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`min-h-[38px] px-3 py-1.5 rounded-[11px] text-xs font-medium transition-all cursor-pointer ${
                            selectedColor === c
                              ? 'bg-[#B5123B] text-white'
                              : 'bg-white/75 border border-white text-[#230B14] hover:bg-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <div className="inline-flex items-center rounded-[14px] bg-white/80 border border-white px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#FFE0EB] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#FFE0EB] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!quickViewProduct.isAvailable}
                    onClick={() => {
                      addToCart(quickViewProduct, quantity, selectedColor);
                      setQuickViewProduct(null);
                    }}
                    className="glass-crimson-btn flex-1 min-h-[46px] py-3 px-4 rounded-[14px] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    aria-label="Toggle Wishlist"
                    className="glass-squircle-icon w-11 h-11 shrink-0 flex items-center justify-center text-[#E32652] cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#E32652]' : ''}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const id = quickViewProduct.id;
                    setQuickViewProduct(null);
                    navigate(`/product/${id}`);
                  }}
                  className="w-full min-h-[44px] py-2.5 rounded-[14px] bg-white/70 hover:bg-white border border-white text-xs font-semibold text-[#230B14] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>View Full Product Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
