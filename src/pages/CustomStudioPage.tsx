import React, { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { CheckCircle2, MessageCircle, Palette, Sparkles, Upload } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OperationType, db, handleFirestoreError } from '../lib/firebase';
import { BRAND_IMAGES } from '../data/catalogDefaults';
import { CustomRequest } from '../types';
import {
  buildCustomRequestWhatsAppMessage,
  compressImageFileToDataUrl,
  openWhatsAppUrl,
} from '../utils/formatters';
import { LuxuryImage, SquircleIcon } from '../components/GlassUI';

export const CustomStudioPage: React.FC = () => {
  const { user, settings, showToast } = useStore();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [jewelleryType, setJewelleryType] = useState('Necklace / Choker');
  const [preferredColor, setPreferredColor] = useState('');
  const [preferredMaterial, setPreferredMaterial] = useState('Artificial Diamonds & Pearls');
  const [budgetRange, setBudgetRange] = useState('PKR 5,000 – 12,000');
  const [description, setDescription] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CustomRequest | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFileToDataUrl(file, 720, 0.72);
      if (compressed.length > 240000) {
        showToast('Please select a smaller reference image (under 2MB).', 'crimson');
        return;
      }
      setReferenceImageUrl(compressed);
      showToast('Reference image attached cleanly.', 'rose');
    } catch {
      showToast('Could not process reference image.', 'crimson');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      whatsappNumber.trim().length < 5 ||
      !itemName.trim() ||
      !preferredColor.trim() ||
      description.trim().length < 5
    ) {
      showToast('Please complete all required custom request details.', 'crimson');
      return;
    }

    setSubmitting(true);
    const id = `CR-${Date.now().toString(36).toUpperCase()}`;
    const requestCode = `#BS-C${Math.floor(1000 + Math.random() * 9000)}`;
    const customerUid =
      user && user.emailVerified ? user.uid : 'guest';

    const payload: CustomRequest = {
      requestCode,
      customerUid,
      customerName: customerName.trim().slice(0, 120),
      whatsappNumber: whatsappNumber.trim().slice(0, 30),
      itemName: itemName.trim().slice(0, 140),
      jewelleryType: jewelleryType.slice(0, 80),
      preferredColor: preferredColor.trim().slice(0, 80),
      preferredMaterial: preferredMaterial.trim().slice(0, 100),
      description: description.trim().slice(0, 1500),
      referenceImageUrl: referenceImageUrl.slice(0, 250000),
      budgetRange: budgetRange.slice(0, 80),
      status: 'Pending Review',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'customRequests', id), payload);
      setSubmittedRequest({ ...payload, id });
      showToast('Custom request saved! Share on WhatsApp to begin consultation.', 'rose');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `customRequests/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-8">
        {/* Header */}
        <div className="glass-pink rounded-[34px] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <SquircleIcon variant="crimson" className="w-11 h-11">
                <Palette className="w-5 h-5" />
              </SquircleIcon>
              <span className="text-xs uppercase tracking-[0.22em] text-[#B5123B] font-semibold">
                Custom Atelier
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#230B14] leading-tight mb-4">
              YOUR STYLE. YOUR CREATION.
            </h1>
            <p className="text-sm sm:text-base text-[#6E3F50] leading-relaxed max-w-2xl">
              Commission custom artificial jewellery, colour-matched bridal accents, or personalized hair accessories. Share your preferred palette, materials, budget, and an optional reference photograph.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-[24px] overflow-hidden border border-white/80 shadow-lg">
              <LuxuryImage
                src={BRAND_IMAGES.atelier}
                alt="Custom jewellery sketch and loose pearls"
                className="w-full h-full object-cover object-[center_28%] scale-105"
              />
            </div>
          </div>
        </div>

        {/* Form or Submitted Summary */}
        {submittedRequest ? (
          <div className="glass-panel-strong rounded-[32px] p-8 sm:p-10 max-w-2xl mx-auto text-center space-y-5">
            <SquircleIcon variant="crimson" className="w-14 h-14 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </SquircleIcon>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold">
              Request Saved · {submittedRequest.requestCode}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14]">
              Your Custom Brief Is Ready
            </h2>
            <p className="text-sm text-[#6E3F50]">
              Status: <strong className="text-[#B5123B]">{submittedRequest.status}</strong>. Send your request summary directly to our WhatsApp studio to receive design confirmation and pricing.
            </p>

            <div className="rounded-[20px] bg-white/60 border border-white p-4 text-left text-xs space-y-1.5">
              <p><strong>Item:</strong> {submittedRequest.itemName} ({submittedRequest.jewelleryType})</p>
              <p><strong>Colour &amp; Material:</strong> {submittedRequest.preferredColor} · {submittedRequest.preferredMaterial}</p>
              <p><strong>Budget:</strong> {submittedRequest.budgetRange}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  openWhatsAppUrl(
                    settings.whatsappNumber,
                    buildCustomRequestWhatsAppMessage(submittedRequest)
                  )
                }
                className="glass-crimson-btn px-6 py-3.5 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share Request on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmittedRequest(null)}
                className="glass-squircle-icon px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#230B14] cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-panel-strong rounded-[32px] p-6 sm:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Custom Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Rose-Pink Pearl Bridal Choker"
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Jewellery / Accessory Type *
                </label>
                <select
                  value={jewelleryType}
                  onChange={(e) => setJewelleryType(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                >
                  <option>Necklace / Choker</option>
                  <option>Earrings / Jhumkas</option>
                  <option>Bangles / Bracelets</option>
                  <option>Statement Ring</option>
                  <option>Full Bridal Jewellery Set</option>
                  <option>Hair Accessory</option>
                  <option>Fashion Accessory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Preferred Colour *
                </label>
                <input
                  type="text"
                  required
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                  placeholder="e.g. Baby Pink, Cherry Red, Champagne Gold"
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Preferred Material *
                </label>
                <input
                  type="text"
                  required
                  value={preferredMaterial}
                  onChange={(e) => setPreferredMaterial(e.target.value)}
                  placeholder="e.g. Cubic Zirconia, Faux Pearls, Kundan, Satin"
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Budget Range *
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
                >
                  <option>PKR 2,500 – 5,000</option>
                  <option>PKR 5,000 – 12,000</option>
                  <option>PKR 12,000 – 25,000</option>
                  <option>PKR 25,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                  Upload Reference Image (Optional)
                </label>
                <label className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[14px] bg-white/75 border border-dashed border-[#B5123B]/50 cursor-pointer hover:bg-white transition-colors">
                  <span className="text-xs text-[#6E3F50] truncate">
                    {referenceImageUrl ? 'Reference image attached' : 'Choose inspiration or outfit photo'}
                  </span>
                  <span className="glass-squircle-icon px-3 py-1.5 text-xs font-semibold text-[#B5123B] inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {referenceImageUrl && (
              <div className="flex items-center gap-4 p-3 rounded-[16px] bg-white/60 border border-white">
                <img
                  src={referenceImageUrl}
                  alt="Uploaded reference preview"
                  className="w-20 h-20 rounded-[12px] object-cover"
                />
                <div className="text-xs text-[#6E3F50]">
                  <p className="font-semibold text-[#230B14]">Reference Preview Ready</p>
                  <button
                    type="button"
                    onClick={() => setReferenceImageUrl('')}
                    className="text-[#B5123B] underline mt-1 cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#230B14] mb-2">
                Design Description &amp; Sizing Notes *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe necklace length, bangle size, stone tones, or occasion date..."
                className="w-full px-4 py-3 rounded-[16px] bg-white/75 border border-white text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-[#6E3F50]">
                Requests are stored securely and prepared for WhatsApp studio review.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="glass-shimmer glass-crimson-btn px-8 py-4 rounded-[18px] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Submitting Request...' : 'SUBMIT CUSTOM REQUEST'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
