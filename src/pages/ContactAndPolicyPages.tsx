import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Instagram, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { openWhatsAppUrl } from '../utils/formatters';
import { SquircleIcon } from '../components/GlassUI';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [inquiry, setInquiry] = useState('');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !inquiry.trim()) {
      showToast('Please enter your name and inquiry message.', 'crimson');
      return;
    }
    openWhatsAppUrl(
      settings.whatsappNumber,
      `Hello BILAL SHEIKH,\n\nName: ${name.trim()}\nInquiry: ${inquiry.trim()}`
    );
  };

  return (
    <div className="px-2.5 min-[375px]:px-3.5 sm:px-6 pt-3 sm:pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-6 sm:space-y-8">
        <div className="glass-panel-strong rounded-[26px] sm:rounded-[34px] p-5 sm:p-10">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold mb-1.5">
            Concierge &amp; Support
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14]">
            Contact BILAL SHEIKH
          </h1>
          <p className="text-xs sm:text-sm text-[#6E3F50] mt-2 max-w-2xl">
            Reach our jewellery concierge for order confirmation, sizing guidance, custom bridal styling, or wholesale inquiries. Contact details below are editable in the Admin Dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div className="lg:col-span-5 glass-pink rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
              Boutique Information
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <SquircleIcon variant="crimson" className="w-10 h-10 shrink-0">
                  <Phone className="w-4 h-4" />
                </SquircleIcon>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6E3F50]">Phone / WhatsApp</p>
                  <p className="font-semibold text-[#230B14] break-words">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <SquircleIcon variant="crimson" className="w-10 h-10 shrink-0">
                  <Mail className="w-4 h-4" />
                </SquircleIcon>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6E3F50]">Email</p>
                  <p className="font-semibold text-[#230B14] break-all">{settings.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <SquircleIcon variant="crimson" className="w-10 h-10 shrink-0">
                  <MapPin className="w-4 h-4" />
                </SquircleIcon>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6E3F50]">Studio Location</p>
                  <p className="font-semibold text-[#230B14] break-words">{settings.studioAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <SquircleIcon variant="crimson" className="w-10 h-10 shrink-0">
                  <Instagram className="w-4 h-4" />
                </SquircleIcon>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6E3F50]">Instagram</p>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#B5123B] hover:underline break-all"
                  >
                    {settings.instagramHandle}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSendWhatsApp}
            className="lg:col-span-7 glass-panel-strong rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 space-y-4 sm:space-y-5"
          >
            <div className="flex items-center gap-3">
              <SquircleIcon variant="pink" className="w-10 h-10">
                <MessageCircle className="w-4 h-4" />
              </SquircleIcon>
              <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                Direct WhatsApp Inquiry
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full min-h-[46px] px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#230B14] mb-1.5">
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder="Ask about availability, custom colour matching, or delivery timeframes..."
                className="w-full px-4 py-3 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
              />
            </div>

            <button
              type="submit"
              className="glass-crimson-btn w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-[16px] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>Send via WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const PoliciesPage: React.FC = () => {
  const { type } = useParams();
  const { settings } = useStore();

  const policyMap = {
    privacy: {
      title: 'Privacy Policy',
      body: settings.privacyPolicy,
    },
    terms: {
      title: 'Terms & Conditions',
      body: settings.termsPolicy,
    },
    returns: {
      title: 'Return & Exchange Policy',
      body: settings.returnPolicy,
    },
  };

  const current =
    policyMap[(type as keyof typeof policyMap) || 'privacy'] || policyMap.privacy;

  return (
    <div className="px-2.5 min-[375px]:px-3.5 sm:px-6 pt-3 sm:pt-4 pb-16">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/policies/privacy"
            className={`min-h-[40px] px-4 py-2 rounded-[12px] text-xs font-semibold inline-flex items-center ${
              type === 'privacy' || !type
                ? 'bg-[#B5123B] text-white'
                : 'glass-panel text-[#230B14]'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/policies/terms"
            className={`min-h-[40px] px-4 py-2 rounded-[12px] text-xs font-semibold inline-flex items-center ${
              type === 'terms'
                ? 'bg-[#B5123B] text-white'
                : 'glass-panel text-[#230B14]'
            }`}
          >
            Terms &amp; Conditions
          </Link>
          <Link
            to="/policies/returns"
            className={`min-h-[40px] px-4 py-2 rounded-[12px] text-xs font-semibold inline-flex items-center ${
              type === 'returns'
                ? 'bg-[#B5123B] text-white'
                : 'glass-panel text-[#230B14]'
            }`}
          >
            Return &amp; Exchange Policy
          </Link>
        </div>

        <div className="glass-panel-strong rounded-[26px] sm:rounded-[32px] p-6 sm:p-10 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold">
            BILAL SHEIKH Boutique Policies
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#230B14]">
            {current.title}
          </h1>
          <p className="text-sm sm:text-base text-[#6E3F50] leading-relaxed whitespace-pre-line">
            {current.body}
          </p>
        </div>
      </div>
    </div>
  );
};
