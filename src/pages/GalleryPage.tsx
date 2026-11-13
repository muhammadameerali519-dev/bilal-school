import React, { useMemo, useState } from 'react';
import { ExternalLink, Instagram, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { GalleryItem } from '../types';
import { LuxuryImage, SquircleIcon } from '../components/GlassUI';

export const GalleryPage: React.FC = () => {
  const { galleryItems, settings } = useStore();
  const [filter, setFilter] = useState('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(galleryItems.map((g) => g.category)));
    return ['All', ...cats];
  }, [galleryItems]);

  const visibleItems = useMemo(() => {
    if (filter === 'All') return galleryItems;
    return galleryItems.filter((g) => g.category === filter);
  }, [galleryItems, filter]);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-8">
        {/* Header + Instagram Showcase */}
        <div className="glass-panel-strong rounded-[34px] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#B5123B] font-semibold mb-2">
              Visual Lookbook
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#230B14]">
              Gallery &amp; Styling Inspiration
            </h1>
            <p className="text-sm text-[#6E3F50] mt-2 max-w-2xl">
              Explore macro jewellery close-ups, festive bridal ensembles, hair accessories, and curated customer styling moments.
            </p>
          </div>

          <a
            href={settings.instagramUrl || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pink rounded-[22px] p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shrink-0"
          >
            <SquircleIcon variant="crimson" className="w-12 h-12">
              <Instagram className="w-5 h-5" />
            </SquircleIcon>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E3F50]">
                Follow on Instagram
              </p>
              <p className="font-serif text-lg font-semibold text-[#230B14] inline-flex items-center gap-1.5">
                <span>{settings.instagramHandle || '@bilalsheikh.jewellery'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B5123B]" />
              </p>
            </div>
          </a>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-[14px] text-xs font-semibold transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#B5123B] text-white'
                  : 'glass-panel text-[#230B14] hover:bg-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePhoto(item)}
              className="group glass-panel rounded-[26px] p-3 text-left transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-[20px] overflow-hidden mb-3 bg-white/60">
                <LuxuryImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
              </div>
              <div className="px-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#B5123B] font-semibold">
                  {item.category}
                  {item.isCustomerPhoto ? ' · Customer Showcase' : ''}
                </p>
                <h2 className="font-serif text-xl font-semibold text-[#230B14] mt-0.5">
                  {item.title}
                </h2>
                <p className="text-xs text-[#6E3F50] mt-1 line-clamp-2">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhoto(null)}
              className="fixed inset-0 bg-[#230B14]/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-3xl w-full glass-panel-strong rounded-[30px] p-4 sm:p-6"
            >
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                aria-label="Close preview"
                className="absolute top-6 right-6 z-10 glass-squircle-icon w-10 h-10 flex items-center justify-center text-[#230B14] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="aspect-[4/3] rounded-[22px] overflow-hidden mb-4">
                <LuxuryImage
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#B5123B] font-semibold">
                {activePhoto.category}
              </p>
              <h3 className="font-serif text-2xl font-semibold text-[#230B14]">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-[#6E3F50] mt-1">{activePhoto.caption}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
