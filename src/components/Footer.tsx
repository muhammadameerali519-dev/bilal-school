import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandEmblem, SquircleIcon } from './GlassUI';
import { LUXURY_CATEGORIES } from '../data/catalogDefaults';
import { openWhatsAppUrl } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { settings, isAdmin } = useStore();

  return (
    <footer className="mt-14 sm:mt-20 px-2.5 min-[375px]:px-3.5 sm:px-6 pb-8 no-print">
      <div className="max-w-[1320px] mx-auto glass-panel-strong rounded-[26px] sm:rounded-[32px] p-5 min-[375px]:p-6 sm:p-12">
        {/* Footer Editorial Headline */}
        <div className="pb-8 sm:pb-10 mb-8 sm:mb-10 border-b border-[#F7A8C4]/45 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <SquircleIcon variant="crimson" className="w-10 h-10 sm:w-11 sm:h-11">
                <BrandEmblem className="w-5 h-5" />
              </SquircleIcon>
              <div className="min-w-0">
                <p className="font-serif text-xl sm:text-2xl font-bold tracking-[0.12em] text-[#230B14]">
                  BILAL SHEIKH
                </p>
                <p className="text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] text-[#6E3F50] uppercase truncate">
                  {settings.tagline}
                </p>
              </div>
            </div>
            <h2 className="font-serif text-2xl min-[375px]:text-3xl sm:text-5xl font-semibold text-[#230B14] leading-tight">
              ELEGANCE NEVER GOES OUT OF STYLE.
            </h2>
          </div>

          <div className="flex flex-col min-[375px]:flex-row flex-wrap items-stretch min-[375px]:items-center gap-2.5 sm:gap-3">
            <a
              href={settings.instagramUrl || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-squircle-icon min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#230B14] hover:text-[#B5123B] transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#E32652] shrink-0" />
              <span className="truncate">{settings.instagramHandle || '@bilalsheikh.jewellery'}</span>
            </a>
            <button
              type="button"
              onClick={() =>
                openWhatsAppUrl(
                  settings.whatsappNumber,
                  'Hello BILAL SHEIKH, I would like assistance with your jewellery collection.'
                )
              }
              className="glass-crimson-btn min-h-[44px] px-5 py-2.5 rounded-[14px] inline-flex items-center justify-center gap-2 text-xs font-semibold text-white cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp Concierge</span>
            </button>
          </div>
        </div>

        {/* Links Grid — Clean 2-col on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-sm">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#230B14] mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E3F50]">
              <li><Link to="/" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Home</Link></li>
              <li><Link to="/collections" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">All Collections</Link></li>
              <li><Link to="/custom" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Custom Studio</Link></li>
              <li><Link to="/gallery" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Editorial Gallery</Link></li>
              <li><Link to="/about" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Our Story</Link></li>
              <li><Link to="/account" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Wishlist &amp; Account</Link></li>
              {isAdmin && (
                <li><Link to="/admin" className="text-[#B5123B] font-semibold hover:underline inline-block py-0.5">Admin Dashboard</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-[#230B14] mb-3 sm:mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E3F50]">
              {LUXURY_CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/collections/${c.slug}`}
                    className="hover:text-[#B5123B] transition-colors inline-block py-0.5"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-serif text-lg font-semibold text-[#230B14] mb-3 sm:mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E3F50]">
              <li><Link to="/contact" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Contact Us</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Terms &amp; Conditions</Link></li>
              <li><Link to="/policies/returns" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Return &amp; Exchange Policy</Link></li>
              <li><Link to="/checkout" className="hover:text-[#B5123B] transition-colors inline-block py-0.5">Checkout &amp; Bag</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-serif text-lg font-semibold text-[#230B14] mb-3 sm:mb-4">
              Boutique Contact
            </h3>
            <ul className="space-y-3 text-[#6E3F50] text-xs leading-relaxed">
              <li className="flex items-start gap-2.5">
                <SquircleIcon className="w-8 h-8 shrink-0 text-[#B5123B]">
                  <Phone className="w-3.5 h-3.5" />
                </SquircleIcon>
                <span className="pt-1.5 break-words min-w-0">{settings.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <SquircleIcon className="w-8 h-8 shrink-0 text-[#B5123B]">
                  <Mail className="w-3.5 h-3.5" />
                </SquircleIcon>
                <span className="pt-1.5 break-all min-w-0">{settings.contactEmail}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <SquircleIcon className="w-8 h-8 shrink-0 text-[#B5123B]">
                  <MapPin className="w-3.5 h-3.5" />
                </SquircleIcon>
                <span className="pt-1 break-words min-w-0">{settings.studioAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#F7A8C4]/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-[#6E3F50]">
          <p>© {new Date().getFullYear()} BILAL SHEIKH Luxury Artificial Jewellery &amp; Accessories.</p>
          <p>Prices shown in PKR · Sample catalog items editable via Admin Dashboard.</p>
        </div>
      </div>
    </footer>
  );
};
