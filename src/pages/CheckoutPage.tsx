import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag, Tag } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useStore } from '../context/StoreContext';
import { OperationType, db, handleFirestoreError } from '../lib/firebase';
import { Order } from '../types';
import {
  buildOrderWhatsAppMessage,
  formatPKR,
  openWhatsAppUrl,
} from '../utils/formatters';
import { DigitalReceiptView } from '../components/DigitalReceiptView';
import { LuxuryImage, SquircleIcon } from '../components/GlassUI';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, settings, user, showToast } = useStore();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    settings.paymentMethods[0] || 'Cash on Delivery'
  );

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const discountAmount = useMemo(() => {
    if (
      appliedPromo &&
      settings.promoCode &&
      appliedPromo.toUpperCase() === settings.promoCode.toUpperCase() &&
      settings.promoDiscountPercent > 0
    ) {
      return Math.round((cartSubtotal * settings.promoDiscountPercent) / 100);
    }
    return 0;
  }, [appliedPromo, settings.promoCode, settings.promoDiscountPercent, cartSubtotal]);

  const deliveryCharge = useMemo(() => {
    if (cart.length === 0) return 0;
    if (
      settings.freeDeliveryThreshold > 0 &&
      cartSubtotal - discountAmount >= settings.freeDeliveryThreshold
    ) {
      return 0;
    }
    return settings.deliveryCharge;
  }, [cart.length, cartSubtotal, discountAmount, settings.deliveryCharge, settings.freeDeliveryThreshold]);

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (settings.promoCode && code === settings.promoCode.toUpperCase()) {
      setAppliedPromo(code);
      showToast(`Promo code ${code} applied (${settings.promoDiscountPercent}% off).`, 'rose');
    } else {
      showToast('Invalid or expired promo code.', 'crimson');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'crimson');
      return;
    }
    if (
      !customerName.trim() ||
      whatsappNumber.trim().length < 5 ||
      deliveryAddress.trim().length < 3 ||
      !city.trim()
    ) {
      showToast('Please complete all required delivery details.', 'crimson');
      return;
    }

    setPlacingOrder(true);
    const orderDocId = `BS-${Date.now().toString(36).toUpperCase()}`;
    const orderCode = `#BS-${Math.floor(1000 + Math.random() * 9000)}`;
    const customerUid = user && user.emailVerified ? user.uid : 'guest';
    const createdAtISO = new Date().toISOString();

    const orderPayload: Order = {
      orderCode,
      customerUid,
      customerName: customerName.trim().slice(0, 120),
      whatsappNumber: whatsappNumber.trim().slice(0, 30),
      email: email.trim().slice(0, 120),
      deliveryAddress: deliveryAddress.trim().slice(0, 400),
      city: city.trim().slice(0, 80),
      postalCode: postalCode.trim().slice(0, 20),
      orderNotes: orderNotes.trim().slice(0, 500),
      paymentMethod: paymentMethod.slice(0, 80),
      items: cart.slice(0, 30).map((item) => ({
        productId: item.productId,
        name: item.name.slice(0, 140),
        price: item.price,
        quantity: item.quantity,
        selectedColor: (item.selectedColor || '').slice(0, 60),
        imageUrl: (item.imageUrl || '').slice(0, 250000),
      })),
      subtotal: cartSubtotal,
      discountAmount,
      discountCode: appliedPromo.slice(0, 40),
      deliveryCharge,
      totalAmount: finalTotal,
      status: 'Awaiting WhatsApp Confirmation',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'orders', orderDocId), orderPayload);
      const finalizedOrder: Order = {
        ...orderPayload,
        id: orderDocId,
        createdAtISO,
      };
      setCompletedOrder(finalizedOrder);
      clearCart();
      showToast('Order recorded! Generating Digital Receipt & opening WhatsApp.', 'rose');

      const message = buildOrderWhatsAppMessage(finalizedOrder);
      openWhatsAppUrl(settings.whatsappNumber, message);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderDocId}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="px-2.5 min-[375px]:px-3.5 sm:px-6 pt-4 pb-16">
        <div className="max-w-[1320px] mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <SquircleIcon variant="crimson" className="w-14 h-14 mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </SquircleIcon>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14]">
              Order Receipt Generated
            </h1>
            <p className="text-xs sm:text-sm text-[#6E3F50] mt-2">
              Your order is currently <strong>Awaiting WhatsApp Confirmation</strong>. Complete sending your order details on WhatsApp or download your PDF receipt below.
            </p>
          </div>

          <DigitalReceiptView
            order={completedOrder}
            businessWhatsapp={settings.whatsappNumber}
          />

          <div className="text-center no-print">
            <Link
              to="/collections"
              className="glass-squircle-icon min-h-[44px] px-6 py-3 text-xs font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Exploring Collections</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2.5 min-[375px]:px-3.5 sm:px-6 pt-3 sm:pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto">
        <div className="mb-5 sm:mb-6">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E3F50] hover:text-[#B5123B] min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14] mt-2">
            Checkout &amp; Order Receipt
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="glass-panel-strong rounded-[26px] sm:rounded-[32px] p-8 sm:p-12 text-center">
            <SquircleIcon variant="pink" className="w-16 h-16 mx-auto mb-4">
              <ShoppingBag className="w-7 h-7" />
            </SquircleIcon>
            <h2 className="font-serif text-3xl font-semibold text-[#230B14] mb-2">
              Your Shopping Bag Is Empty
            </h2>
            <p className="text-sm text-[#6E3F50] mb-6">
              Add jewellery or accessories to proceed to checkout and generate your digital receipt.
            </p>
            <Link
              to="/collections"
              className="glass-crimson-btn min-h-[46px] px-7 py-3.5 rounded-[16px] text-xs font-semibold text-white inline-flex items-center justify-center"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
            {/* Order Summary shown first on mobile via order-1 lg:order-2 so totals stay immediately visible */}
            <div className="lg:col-span-5 lg:order-2 glass-panel rounded-[26px] sm:rounded-[32px] p-4 min-[375px]:p-5 sm:p-8 space-y-4 sm:space-y-5">
              <h2 className="font-serif text-2xl font-semibold text-[#230B14] pb-3 border-b border-white/70">
                Order Summary
              </h2>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedColor}`}
                    className="flex items-center gap-3 rounded-[16px] bg-white/60 border border-white/80 p-2.5"
                  >
                    <div className="w-14 h-14 rounded-[11px] overflow-hidden shrink-0">
                      <LuxuryImage
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-semibold text-[#230B14] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#6E3F50]">
                        {item.selectedColor} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-[#230B14] tabular-nums shrink-0">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-1">
                <div className="flex flex-col min-[360px]:flex-row gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#B5123B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={
                        settings.promoCode
                          ? `Promo code (e.g. ${settings.promoCode})`
                          : 'Promo code'
                      }
                      className="w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-[12px] bg-white/80 border border-white text-[16px] sm:text-xs text-[#230B14] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="glass-squircle-icon min-h-[44px] px-5 py-2.5 text-xs font-semibold text-[#B5123B] cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/70 text-sm">
                <div className="flex justify-between text-[#6E3F50]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6E3F50]">
                  <span>Discount{appliedPromo ? ` (${appliedPromo})` : ''}</span>
                  <span className="tabular-nums">- {formatPKR(discountAmount)}</span>
                </div>
                <div className="flex justify-between text-[#6E3F50]">
                  <span>Delivery Charges</span>
                  <span className="tabular-nums">
                    {deliveryCharge === 0 ? 'Complimentary' : formatPKR(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/70 text-lg font-bold text-[#B5123B]">
                  <span>Final Payable Total</span>
                  <span className="tabular-nums">{formatPKR(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form
              onSubmit={handlePlaceOrder}
              className="lg:col-span-7 lg:order-1 glass-panel-strong rounded-[26px] sm:rounded-[32px] p-4 min-[375px]:p-5 sm:p-8 space-y-4 sm:space-y-5"
            >
              <h2 className="font-serif text-2xl font-semibold text-[#230B14] pb-3 border-b border-white/70">
                Delivery &amp; Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                  Complete Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House/Apartment, Street, Block / Sector"
                  className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore / Karachi / Islamabad"
                    className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 54000"
                    className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-2">
                  Payment Method *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {settings.paymentMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`min-h-[46px] px-4 py-3 rounded-[14px] text-left text-xs font-semibold transition-all cursor-pointer border ${
                        paymentMethod === method
                          ? 'bg-[#B5123B] text-white border-[#B5123B]'
                          : 'bg-white/75 text-[#230B14] border-white hover:bg-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#6E3F50] mt-2 leading-relaxed">
                  Note: Online card payment gateways are not enabled on this storefront. Orders are confirmed via Cash on Delivery or manual bank verification on WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                  Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Gift wrapping note, preferred delivery time, bangle sizing..."
                  className="w-full px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="glass-shimmer glass-crimson-btn w-full min-h-[50px] py-4 px-6 rounded-[18px] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  {placingOrder
                    ? 'Generating Receipt & Opening WhatsApp...'
                    : `Complete Order · ${formatPKR(finalTotal)}`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
