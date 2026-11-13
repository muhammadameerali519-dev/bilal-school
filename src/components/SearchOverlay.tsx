import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/formatters';
import { LUXURY_CATEGORIES } from '../data/catalogDefaults';
import { LuxuryImage } from './GlassUI';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const [queryText, setQueryText] = useState('');
  const navigate = useNavigate();

  const matches = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.materials.toLowerCase().includes(q)
    );
  }, [queryText, products]);

  const handleGo = (path: string) => {
    setIsSearchOpen(false);
    setQueryText('');
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center pt-16 sm:pt-24 px-4 no-print">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-[#230B14]/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl glass-panel-strong rounded-[30px] p-5 sm:p-7"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white/75 border border-white rounded-[18px] px-4 py-3 mb-5">
              <Search className="w-5 h-5 text-[#B5123B] shrink-0" />
              <input
                type="text"
                autoFocus
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search pearl necklaces, crystal earrings, bangles, bridal sets..."
                className="w-full bg-transparent text-sm sm:text-base text-[#230B14] placeholder-[#6E3F50]/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="glass-squircle-icon w-9 h-9 flex items-center justify-center text-[#230B14] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Suggestions */}
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E3F50] mb-2.5">
                Quick Category Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {LUXURY_CATEGORIES.slice(0, 7).map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() =>
                      handleGo(
                        cat.slug === 'custom-items'
                          ? '/custom'
                          : `/collections/${cat.slug}`
                      )
                    }
                    className="px-3.5 py-1.5 rounded-[12px] bg-white/65 border border-white/80 text-xs font-medium text-[#230B14] hover:bg-[#B5123B] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Matches */}
            <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1">
              {matches.length === 0 ? (
                <div className="text-center py-8 text-sm text-[#6E3F50]">
                  No pieces matched "{queryText}". Try searching Necklaces, Earrings, or Bangles.
                </div>
              ) : (
                matches.slice(0, 8).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleGo(`/product/${p.id}`)}
                    className="w-full text-left rounded-[18px] bg-white/60 hover:bg-white/90 border border-white/80 p-3 flex items-center justify-between gap-4 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0">
                        <LuxuryImage
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#6E3F50]">
                          {p.category} · {p.availability}
                        </p>
                        <h4 className="font-serif text-lg font-semibold text-[#230B14] group-hover:text-[#B5123B] truncate">
                          {p.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-[#230B14] tabular-nums">
                        {formatPKR(p.price)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#B5123B] opacity-70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
