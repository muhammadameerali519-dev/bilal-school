import React from 'react';
import { Download, MessageCircle, Printer } from 'lucide-react';
import { Order } from '../types';
import {
  buildOrderWhatsAppMessage,
  formatPKR,
  generateReceiptPDF,
  openWhatsAppUrl,
} from '../utils/formatters';
import { BrandEmblem, SquircleIcon } from './GlassUI';

interface DigitalReceiptViewProps {
  order: Order;
  businessWhatsapp: string;
}

export const DigitalReceiptView: React.FC<DigitalReceiptViewProps> = ({
  order,
  businessWhatsapp,
}) => {
  const handleWhatsAppShare = () => {
    const msg = buildOrderWhatsAppMessage(order);
    openWhatsAppUrl(businessWhatsapp, msg);
  };

  return (
    <div className="glass-panel-strong rounded-[32px] p-6 sm:p-10 max-w-3xl mx-auto">
      {/* Receipt Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F7A8C4]/50">
        <div className="flex items-center gap-3.5">
          <SquircleIcon variant="crimson" className="w-12 h-12">
            <BrandEmblem className="w-6 h-6" />
          </SquircleIcon>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.12em] text-[#230B14]">
              BILAL SHEIKH
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#6E3F50]">
              Luxury Jewellery &amp; Accessories
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5123B]">
            ORDER RECEIPT
          </p>
          <p className="font-serif text-2xl font-bold text-[#230B14] tabular-nums">
            {order.orderCode}
          </p>
          <p className="text-xs text-[#6E3F50]">
            {order.createdAtISO
              ? new Date(order.createdAtISO).toLocaleString()
              : new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status Notice (Explicitly Awaiting WhatsApp Confirmation) */}
      <div className="my-6 rounded-[18px] bg-[#FFE0EB]/70 border border-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#6E3F50]">
            Current Order Status
          </p>
          <p className="text-sm font-bold text-[#B5123B]">{order.status}</p>
        </div>
        <p className="text-xs text-[#6E3F50] max-w-md">
          Please send the pre-filled order summary on WhatsApp so our boutique team can verify stock and confirm dispatch.
        </p>
      </div>

      {/* Customer & Delivery Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
        <div className="rounded-[20px] bg-white/55 border border-white/80 p-4 space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E3F50] font-semibold">
            Customer Information
          </p>
          <p className="font-semibold text-[#230B14]">{order.customerName}</p>
          <p className="text-[#6E3F50] tabular-nums">WhatsApp: {order.whatsappNumber}</p>
          {order.email && <p className="text-[#6E3F50] text-xs">{order.email}</p>}
        </div>

        <div className="rounded-[20px] bg-white/55 border border-white/80 p-4 space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E3F50] font-semibold">
            Delivery &amp; Payment
          </p>
          <p className="text-[#230B14]">
            {order.deliveryAddress}, {order.city}
            {order.postalCode ? ` (${order.postalCode})` : ''}
          </p>
          <p className="text-xs font-semibold text-[#B5123B]">
            Payment: {order.paymentMethod}
          </p>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="rounded-[22px] bg-white/60 border border-white/80 overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-[#FFE0EB]/50 text-[11px] font-bold uppercase tracking-[0.12em] text-[#B5123B]">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        <div className="divide-y divide-[#F7A8C4]/30">
          {order.items.map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              className="grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center"
            >
              <div className="col-span-6">
                <p className="font-medium text-[#230B14]">{item.name}</p>
                {item.selectedColor && (
                  <p className="text-xs text-[#6E3F50]">{item.selectedColor}</p>
                )}
              </div>
              <div className="col-span-2 text-right tabular-nums text-[#230B14]">
                {item.quantity}
              </div>
              <div className="col-span-2 text-right tabular-nums text-[#6E3F50]">
                {formatPKR(item.price)}
              </div>
              <div className="col-span-2 text-right font-semibold tabular-nums text-[#230B14]">
                {formatPKR(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="max-w-xs ml-auto space-y-2 text-sm mb-8">
        <div className="flex justify-between text-[#6E3F50]">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPKR(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#6E3F50]">
          <span>Discount{order.discountCode ? ` (${order.discountCode})` : ''}</span>
          <span className="tabular-nums">- {formatPKR(order.discountAmount)}</span>
        </div>
        <div className="flex justify-between text-[#6E3F50]">
          <span>Delivery Charges</span>
          <span className="tabular-nums">{formatPKR(order.deliveryCharge)}</span>
        </div>
        <div className="pt-2 border-t border-[#F7A8C4]/50 flex justify-between text-lg font-bold text-[#B5123B]">
          <span>Final Total</span>
          <span className="tabular-nums">{formatPKR(order.totalAmount)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/70 no-print">
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="glass-crimson-btn px-6 py-3.5 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Share Order on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => generateReceiptPDF(order)}
          className="glass-squircle-icon px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Receipt</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="glass-squircle-icon px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>
    </div>
  );
};
