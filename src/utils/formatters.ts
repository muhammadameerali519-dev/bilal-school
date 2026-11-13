import { jsPDF } from 'jspdf';
import { CustomRequest, Order } from '../types';

export function formatPKR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `Rs. ${safe.toLocaleString('en-PK')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function sanitizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return `92${digits.slice(1)}`;
  }
  return digits || '923000000000';
}

export function buildOrderWhatsAppMessage(order: Order): string {
  const itemLines = order.items
    .map(
      (item) =>
        `${item.name}${item.selectedColor ? ` (${item.selectedColor})` : ''} × ${item.quantity}\nPrice: Rs. ${(item.price * item.quantity).toLocaleString('en-PK')}`
    )
    .join('\n\n');

  const fullAddress = [order.deliveryAddress, order.city, order.postalCode]
    .filter(Boolean)
    .join(', ');

  return [
    'BILAL SHEIKH — NEW ORDER',
    '',
    `Order ID: ${order.orderCode}`,
    '',
    `Customer: ${order.customerName}`,
    `WhatsApp: ${order.whatsappNumber}`,
    '',
    'ORDER DETAILS:',
    '',
    itemLines,
    '',
    `Subtotal: Rs. ${order.subtotal.toLocaleString('en-PK')}`,
    `Discount: Rs. ${order.discountAmount.toLocaleString('en-PK')}`,
    `Delivery: Rs. ${order.deliveryCharge.toLocaleString('en-PK')}`,
    '',
    `TOTAL: Rs. ${order.totalAmount.toLocaleString('en-PK')}`,
    '',
    'Delivery Address:',
    fullAddress,
    '',
    'Payment Method:',
    order.paymentMethod,
    order.orderNotes ? `\nOrder Notes:\n${order.orderNotes}` : '',
    '',
    'Thank you for shopping with BILAL SHEIKH.',
  ]
    .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
    .join('\n');
}

export function buildCustomRequestWhatsAppMessage(req: CustomRequest): string {
  return [
    'BILAL SHEIKH — CUSTOM JEWELLERY REQUEST',
    '',
    `Request ID: ${req.requestCode}`,
    `Customer: ${req.customerName}`,
    `WhatsApp: ${req.whatsappNumber}`,
    '',
    `Custom Item: ${req.itemName}`,
    `Jewellery Type: ${req.jewelleryType}`,
    `Preferred Colour: ${req.preferredColor}`,
    `Preferred Material: ${req.preferredMaterial}`,
    `Budget Range: ${req.budgetRange}`,
    '',
    'Design Description:',
    req.description,
    '',
    'Submitted via BILAL SHEIKH Custom Atelier.',
  ].join('\n');
}

export function openWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanNum = sanitizeWhatsAppNumber(whatsappNumber);
  const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  return url;
}

export function generateReceiptPDF(order: Order): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Soft rose header band
  doc.setFillColor(255, 224, 235);
  doc.rect(0, 0, pageWidth, 128, 'F');

  doc.setDrawColor(181, 18, 59);
  doc.setLineWidth(1.5);
  doc.line(42, 128, pageWidth - 42, 128);

  doc.setTextColor(181, 18, 59);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text('BILAL SHEIKH', 42, 54);

  doc.setTextColor(110, 63, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('LUXURY JEWELLERY & ACCESSORIES', 42, 74);

  doc.setTextColor(35, 11, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ORDER RECEIPT', pageWidth - 42, 54, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Order ID: ${order.orderCode}`, pageWidth - 42, 74, { align: 'right' });
  doc.text(
    `Date: ${order.createdAtISO ? new Date(order.createdAtISO).toLocaleString() : new Date().toLocaleString()}`,
    pageWidth - 42,
    90,
    { align: 'right' }
  );
  doc.text(`Status: ${order.status}`, pageWidth - 42, 106, { align: 'right' });

  let y = 160;
  doc.setTextColor(35, 11, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CUSTOMER & DELIVERY DETAILS', 42, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Customer Name: ${order.customerName}`, 42, y);
  y += 15;
  doc.text(`WhatsApp Number: ${order.whatsappNumber}`, 42, y);
  y += 15;
  if (order.email) {
    doc.text(`Email: ${order.email}`, 42, y);
    y += 15;
  }
  const addressLine = `Delivery Address: ${order.deliveryAddress}, ${order.city}${order.postalCode ? ` (${order.postalCode})` : ''}`;
  const wrappedAddress = doc.splitTextToSize(addressLine, pageWidth - 84);
  doc.text(wrappedAddress, 42, y);
  y += wrappedAddress.length * 14 + 6;
  doc.text(`Payment Method: ${order.paymentMethod}`, 42, y);
  y += 28;

  // Table header
  doc.setFillColor(255, 245, 248);
  doc.rect(42, y - 14, pageWidth - 84, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(181, 18, 59);
  doc.text('ITEM', 50, y + 2);
  doc.text('QTY', pageWidth - 200, y + 2, { align: 'right' });
  doc.text('UNIT PRICE', pageWidth - 125, y + 2, { align: 'right' });
  doc.text('AMOUNT', pageWidth - 50, y + 2, { align: 'right' });
  y += 24;

  doc.setTextColor(35, 11, 20);
  doc.setFont('helvetica', 'normal');

  order.items.forEach((item) => {
    const label = `${item.name}${item.selectedColor ? ` (${item.selectedColor})` : ''}`;
    const lines = doc.splitTextToSize(label, 270);
    doc.text(lines, 50, y);
    doc.text(String(item.quantity), pageWidth - 200, y, { align: 'right' });
    doc.text(formatPKR(item.price), pageWidth - 125, y, { align: 'right' });
    doc.text(formatPKR(item.price * item.quantity), pageWidth - 50, y, { align: 'right' });
    y += Math.max(lines.length * 14, 18) + 6;
  });

  y += 10;
  doc.setDrawColor(247, 168, 196);
  doc.line(42, y, pageWidth - 42, y);
  y += 22;

  const summaryX = pageWidth - 210;
  doc.setFontSize(10);
  doc.text('Subtotal:', summaryX, y);
  doc.text(formatPKR(order.subtotal), pageWidth - 50, y, { align: 'right' });
  y += 16;

  doc.text(`Discount${order.discountCode ? ` (${order.discountCode})` : ''}:`, summaryX, y);
  doc.text(`- ${formatPKR(order.discountAmount)}`, pageWidth - 50, y, { align: 'right' });
  y += 16;

  doc.text('Delivery Charges:', summaryX, y);
  doc.text(formatPKR(order.deliveryCharge), pageWidth - 50, y, { align: 'right' });
  y += 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(181, 18, 59);
  doc.text('FINAL TOTAL:', summaryX, y);
  doc.text(formatPKR(order.totalAmount), pageWidth - 50, y, { align: 'right' });

  y += 42;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(110, 63, 80);
  doc.text(
    'Thank you for shopping with BILAL SHEIKH. Orders remain awaiting confirmation until verified on WhatsApp.',
    42,
    y
  );

  doc.save(`BILAL-SHEIKH-Receipt-${order.orderCode.replace('#', '')}.pdf`);
}

export async function compressImageFileToDataUrl(
  file: File,
  maxDimension = 900,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
