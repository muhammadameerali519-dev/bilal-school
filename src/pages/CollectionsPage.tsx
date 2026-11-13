import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LUXURY_CATEGORIES } from '../data/catalogDefaults';
import { ProductCard } from '../components/ProductCard';
import { CategoryName } from '../types';

export const CollectionsPage: React.FC = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { products, isUsingSampleCatalog } = useStore();

  const matchedCategory = LUXURY_CATEGORIES.find((c) => c.slug === categorySlug);
  const activeCategory: 'All' | CategoryName = matchedCategory
    ? matchedCategory.name
    : 'All';

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    let list = products.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (onlyAvailable && (!p.isAvailable || p.availability === 'Out of Stock')) {
        return false;
      }
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, activeCategory, onlyAvailable, searchText, sortBy]);

  return (
    <div className="px-2.5 min-[375px]:px-3.5 sm:px-6 pt-3 sm:pt-4 pb-12">
      <div className="max-w-[1320px] mx-auto space-y-5 sm:space-y-8">
        {/* Header Banner */}
        <div className="glass-panel-strong rounded-[24px] sm:rounded-[30px] p-5 sm:p-10">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold mb-1.5">
            BILAL SHEIKH Collection
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14]">
                {activeCategory === 'All' ? 'All Jewellery & Accessories' : activeCategory}
              </h1>
              <p className="text-xs sm:text-sm text-[#6E3F50] mt-1.5 max-w-2xl">
                {matchedCategory
                  ? matchedCategory.subtitle
                  : 'Explore curated artificial diamond suites, lustrous pearl necklaces, chandeliers, bangles, and lifestyle accessories.'}
              </p>
            </div>
            <p className="text-xs font-medium text-[#6E3F50] tabular-nums">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              {isUsingSampleCatalog ? ' · Sample Catalog' : ''}
            </p>
          </div>
        </div>

        {/* Category Filter Strip + Search & Sort */}
        <div className="glass-panel rounded-[22px] sm:rounded-[24px] p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className={`min-h-[38px] px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'All'
                  ? 'bg-[#B5123B] text-white'
                  : 'bg-white/65 text-[#230B14] hover:bg-white'
              }`}
            >
              All Categories
            </button>
            {LUXURY_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => navigate(`/collections/${cat.slug}`)}
                className={`min-h-[38px] px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.name
                    ? 'bg-[#B5123B] text-white'
                    : 'bg-white/65 text-[#230B14] hover:bg-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/60">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-4 h-4 text-[#B5123B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Filter by piece name or material..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-[14px] bg-white/80 border border-white text-[16px] sm:text-sm text-[#230B14] placeholder-[#6E3F50]/70 focus:outline-none focus:ring-2 focus:ring-[#B5123B]/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <label className="min-h-[42px] inline-flex items-center gap-2 text-xs font-medium text-[#230B14] cursor-pointer px-3 py-2 rounded-[12px] bg-white/65 border border-white">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="accent-[#B5123B] rounded w-4 h-4"
                />
                <span>Available Only</span>
              </label>

              <div className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-between gap-2 rounded-[12px] bg-white/80 border border-white px-3 py-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B5123B] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Sort products"
                  className="bg-transparent text-xs font-semibold text-[#230B14] focus:outline-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="featured">Curated Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid: 1-col on <375px, 2-col on 375px-1023px, 3-col on desktop */}
        {filteredProducts.length === 0 ? (
          <div className="glass-panel rounded-[26px] p-8 sm:p-12 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#230B14] mb-2">
              No Pieces Found
            </h2>
            <p className="text-sm text-[#6E3F50] mb-6">
              Try clearing your filters or explore our bespoke Custom Jewellery Studio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchText('');
                setOnlyAvailable(false);
                navigate('/collections');
              }}
              className="glass-crimson-btn min-h-[44px] px-6 py-3 rounded-[14px] text-xs font-semibold text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
