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
        <div className="fixed inset-0 z-[90] flex items-start justify-center pt-10 sm:pt-24 px-2.5 sm:px-4 no-print">
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
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl glass-panel-strong rounded-[24px] sm:rounded-[30px] p-4 sm:p-7"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-2.5 bg-white/80 border border-white rounded-[16px] px-3.5 py-2.5 mb-4 sm:mb-5">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#B5123B] shrink-0" />
              <input
                type="text"
                autoFocus
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search necklaces, earrings, bangles..."
                className="w-full min-h-[38px] bg-transparent text-[16px] sm:text-base text-[#230B14] placeholder-[#6E3F50]/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="glass-squircle-icon w-10 h-10 shrink-0 flex items-center justify-center text-[#230B14] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Suggestions */}
            <div className="mb-4 sm:mb-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E3F50] mb-2">
                Quick Category Suggestions
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
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
                    className="min-h-[36px] px-3 py-1.5 rounded-[11px] bg-white/70 border border-white/80 text-xs font-medium text-[#230B14] hover:bg-[#B5123B] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Matches */}
            <div className="max-h-[52vh] overflow-y-auto space-y-2 pr-0.5">
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
                    className="w-full text-left rounded-[16px] sm:rounded-[18px] bg-white/65 hover:bg-white/95 border border-white/80 p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[11px] overflow-hidden shrink-0">
                        <LuxuryImage
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#6E3F50] truncate">
                          {p.category} · {p.availability}
                        </p>
                        <h4 className="font-serif text-base sm:text-lg font-semibold text-[#230B14] group-hover:text-[#B5123B] truncate">
                          {p.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-[#230B14] tabular-nums">
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
