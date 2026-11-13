import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/formatters';
import { LuxuryImage, SquircleIcon } from './GlassUI';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    settings,
  } = useStore();
  const navigate = useNavigate();

  const remainingForFreeDelivery = Math.max(
    0,
    settings.freeDeliveryThreshold - cartSubtotal
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end no-print">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#230B14]/35 backdrop-blur-sm"
          />

          {/* Slide-over Glass Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md h-full p-3 sm:p-4 flex flex-col"
            aria-label="Shopping Bag"
          >
            <div className="glass-panel-strong rounded-[28px] h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SquircleIcon variant="pink" className="w-10 h-10">
                    <ShoppingBag className="w-4 h-4" />
                  </SquircleIcon>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                      Shopping Bag
                    </h2>
                    <p className="text-xs text-[#6E3F50] tabular-nums">
                      {cartCount} {cartCount === 1 ? 'piece' : 'pieces'} selected
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close Shopping Bag"
                  className="glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] hover:text-[#B5123B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Delivery Notice */}
              {cart.length > 0 && settings.freeDeliveryThreshold > 0 && (
                <div className="px-6 py-3 bg-[#FFE0EB]/55 border-b border-white/60 text-xs text-[#230B14]">
                  {remainingForFreeDelivery === 0 ? (
                    <span className="font-semibold text-[#B5123B]">
                      Complimentary delivery unlocked on your order.
                    </span>
                  ) : (
                    <span>
                      Add <strong className="tabular-nums">{formatPKR(remainingForFreeDelivery)}</strong> more for complimentary delivery.
                    </span>
                  )}
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                    <SquircleIcon variant="pink" className="w-16 h-16 mb-4">
                      <ShoppingBag className="w-7 h-7" />
                    </SquircleIcon>
                    <h3 className="font-serif text-2xl font-semibold text-[#230B14] mb-2">
                      Your Bag is Empty
                    </h3>
                    <p className="text-sm text-[#6E3F50] mb-6">
                      Explore necklaces, crystal earrings, bridal sets, and accessories crafted for timeless styling.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/collections');
                      }}
                      className="glass-crimson-btn px-6 py-3 rounded-[14px] text-xs font-semibold text-white cursor-pointer"
                    >
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedColor}`}
                      className="rounded-[20px] bg-white/55 border border-white/80 p-3 flex gap-3.5 items-center"
                    >
                      <div className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0 bg-white">
                        <LuxuryImage
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#6E3F50] truncate">
                          {item.category} · {item.selectedColor}
                        </p>
                        <h4 className="font-serif text-base font-semibold text-[#230B14] truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm font-bold text-[#B5123B] tabular-nums mt-0.5">
                          {formatPKR(item.price * item.quantity)}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 rounded-[11px] bg-white/80 border border-white px-1 py-0.5">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.selectedColor,
                                  item.quantity - 1
                                )
                              }
                              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[#230B14] hover:bg-[#FFE0EB] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.selectedColor,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[#230B14] hover:bg-[#FFE0EB] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() =>
                              removeFromCart(item.productId, item.selectedColor)
                            }
                            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[#6E3F50] hover:text-[#B5123B] hover:bg-white/70 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/75 bg-white/45 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6E3F50]">Subtotal</span>
                    <span className="font-bold text-lg text-[#230B14] tabular-nums">
                      {formatPKR(cartSubtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E3F50]">
                    Delivery charges and promo codes are calculated at checkout.
                  </p>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="glass-shimmer glass-crimson-btn w-full py-3.5 px-6 rounded-[16px] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
