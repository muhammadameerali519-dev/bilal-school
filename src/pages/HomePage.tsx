import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, Gem, Palette, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { BRAND_IMAGES, LUXURY_CATEGORIES } from '../data/catalogDefaults';
import { ProductCard } from '../components/ProductCard';
import { LuxuryImage, SquircleIcon } from '../components/GlassUI';
import { CategoryName } from '../types';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const { products, isUsingSampleCatalog, galleryItems } = useStore();
  const [selectedTab, setSelectedTab] = useState<'All' | CategoryName>('All');
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isNarrowMobile = window.innerWidth < 640;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: isNarrowMobile ? 16 : 26,
        opacity: 0,
        duration: isNarrowMobile ? 0.55 : 0.85,
        stagger: isNarrowMobile ? 0.06 : 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((sec) => {
        gsap.from(sec, {
          y: isNarrowMobile ? 16 : 28,
          opacity: 0,
          duration: isNarrowMobile ? 0.5 : 0.75,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: sec,
            start: 'top 88%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const featuredProducts = useMemo(() => {
    const base =
      selectedTab === 'All'
        ? products.filter((p) => p.featured).length > 0
          ? products.filter((p) => p.featured)
          : products
        : products.filter((p) => p.category === selectedTab);
    return base.slice(0, 6);
  }, [products, selectedTab]);

  const filterTabs: ('All' | CategoryName)[] = [
    'All',
    'Necklaces',
    'Earrings',
    'Jewellery Sets',
    'Bangles',
    'Rings',
    'Hair Accessories',
  ];

  return (
    <div ref={rootRef} className="px-2.5 min-[375px]:px-3.5 sm:px-6 pb-8">
      <div className="max-w-[1320px] mx-auto space-y-14 sm:space-y-24">
        {/* 1. LUXURY HERO SECTION */}
        <section className="pt-2 sm:pt-6">
          <div className="glass-panel-strong rounded-[26px] sm:rounded-[34px] p-4 min-[375px]:p-5 sm:p-8 lg:p-10 relative overflow-hidden">
            {/* Subtle ambient rose lighting */}
            <div
              className="hidden sm:block absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F7A8C4]/30 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch relative z-10">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-6 flex flex-col justify-between py-1 sm:py-4">
                <div>
                  <p className="hero-stagger text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.26em] text-[#B5123B] font-semibold mb-3 sm:mb-4">
                    BILAL SHEIKH · Luxury Jewellery &amp; Accessories
                  </p>
                  <h1 className="hero-stagger font-serif text-[clamp(2rem,8.4vw,4.1rem)] font-semibold text-[#230B14] leading-[1.04] tracking-tight mb-4 sm:mb-6">
                    BEAUTY IN EVERY DETAIL.
                  </h1>
                  <p className="hero-stagger text-sm min-[375px]:text-base sm:text-lg text-[#6E3F50] leading-relaxed max-w-xl mb-6 sm:mb-8">
                    Discover a world of timeless elegance, statement jewellery, and beautiful accessories designed to make every moment special.
                  </p>

                  <div className="hero-stagger flex flex-col min-[375px]:flex-row flex-wrap items-stretch min-[375px]:items-center gap-3">
                    <Link
                      to="/collections"
                      className="glass-shimmer glass-crimson-btn min-h-[46px] px-5 sm:px-7 py-3.5 sm:py-4 rounded-[16px] sm:rounded-[18px] text-white text-xs sm:text-sm font-semibold tracking-[0.1em] inline-flex items-center justify-center gap-2.5 whitespace-nowrap"
                    >
                      <span>EXPLORE COLLECTION</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('featured-collection');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="glass-squircle-icon min-h-[46px] px-5 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-[0.1em] text-[#230B14] hover:text-[#B5123B] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>SHOP NOW</span>
                    </button>
                  </div>
                </div>

                {/* Scroll indicator + quiet studio note */}
                <div className="hero-stagger mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/70 flex items-center justify-between gap-3 text-xs text-[#6E3F50]">
                  <span className="line-clamp-1">
                    Cash on Delivery · WhatsApp Order Concierge
                  </span>
                  <a
                    href="#shop-by-category"
                    className="inline-flex items-center gap-1.5 text-[#B5123B] font-semibold hover:translate-y-0.5 transition-transform whitespace-nowrap shrink-0"
                  >
                    <span>Scroll</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Campaign Photography — Full product visible on mobile via object-contain & non-overlapping caption */}
              <div className="lg:col-span-6 flex flex-col gap-3 lg:relative lg:min-h-[440px]">
                <motion.div
                  whileHover={{ rotateY: 2, rotateX: -1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full aspect-[16/9] lg:aspect-auto lg:h-full rounded-[20px] sm:rounded-[26px] overflow-hidden border border-white/85 bg-gradient-to-br from-[#FFF5F8] via-[#FFE0EB]/55 to-white shadow-[0_20px_48px_-14px_rgba(181,18,59,0.22)] relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <LuxuryImage
                    src={BRAND_IMAGES.hero}
                    alt="BILAL SHEIKH artificial diamond necklace, pearl earrings, and golden bangles on blush silk and rose marble"
                    className="w-full h-full object-contain lg:object-cover"
                  />
                  <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#230B14]/40 via-transparent to-transparent pointer-events-none" />

                  {/* Desktop Overlay Glass Card */}
                  <div className="hidden lg:flex absolute bottom-4 left-4 right-auto max-w-xs glass-panel-strong rounded-[20px] p-4 items-center gap-3.5">
                    <SquircleIcon variant="crimson" className="w-11 h-11">
                      <Gem className="w-5 h-5" />
                    </SquircleIcon>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#B5123B] font-semibold">
                        Signature Suite
                      </p>
                      <p className="font-serif text-base font-semibold text-[#230B14] truncate">
                        Artificial Diamonds &amp; Pearls
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Non-Overlapping Glass Feature Card */}
                <div className="lg:hidden glass-panel rounded-[18px] p-3.5 flex items-center gap-3">
                  <SquircleIcon variant="crimson" className="w-10 h-10 shrink-0">
                    <Gem className="w-4 h-4" />
                  </SquircleIcon>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#B5123B] font-semibold">
                      Signature Suite
                    </p>
                    <p className="font-serif text-base font-semibold text-[#230B14] truncate">
                      Artificial Diamonds, Pearls &amp; Bangles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SHOP BY CATEGORY — ASYMMETRICAL EDITORIAL GRID */}
        <section id="shop-by-category" className="reveal-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold mb-1.5">
                Curated Departments
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14]">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#B5123B] hover:underline whitespace-nowrap"
            >
              <span>View Complete Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 auto-rows-[175px] min-[390px]:auto-rows-[195px] sm:auto-rows-[240px]">
            {LUXURY_CATEGORIES.map((cat) => {
              const spanClass =
                cat.span === 'large'
                  ? 'col-span-2 lg:col-span-2 lg:row-span-2'
                  : cat.span === 'wide'
                  ? 'col-span-2 lg:col-span-2'
                  : 'col-span-1';

              return (
                <Link
                  key={cat.slug}
                  to={cat.slug === 'custom-items' ? '/custom' : `/collections/${cat.slug}`}
                  className={`group relative rounded-[20px] sm:rounded-[26px] overflow-hidden glass-panel p-1.5 sm:p-2 transition-transform duration-300 hover:-translate-y-1 ${spanClass}`}
                >
                  <div className="relative w-full h-full rounded-[15px] sm:rounded-[20px] overflow-hidden">
                    <LuxuryImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#230B14]/82 via-[#230B14]/20 to-transparent" />

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-2 sm:gap-3">
                      <div className="glass-panel rounded-[12px] sm:rounded-[16px] px-2.5 py-2 sm:px-4 sm:py-3 flex-1 min-w-0 bg-white/80 backdrop-blur-md">
                        <h3 className="font-serif text-sm min-[375px]:text-base sm:text-xl font-semibold text-[#230B14] truncate">
                          {cat.name}
                        </h3>
                        <p className="hidden sm:block text-xs text-[#6E3F50] truncate mt-0.5">
                          {cat.subtitle}
                        </p>
                      </div>

                      <SquircleIcon
                        variant="crimson"
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-[11px] sm:rounded-[14px] group-hover:scale-105"
                      >
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </SquircleIcon>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. FEATURED LUXURY PRODUCT COLLECTION */}
        <section id="featured-collection" className="reveal-section">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold mb-1.5">
                Curated Edit
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14]">
                Featured Luxury Pieces
              </h2>
              {isUsingSampleCatalog && (
                <p className="text-xs text-[#6E3F50] mt-2">
                  Displaying editable sample products &amp; sample PKR pricing until live store inventory is published via Admin Dashboard.
                </p>
              )}
            </div>

            {/* Interactive Segmented Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 glass-pink p-1.5 rounded-[16px] sm:rounded-[18px]">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedTab === tab
                      ? 'bg-[#B5123B] text-white shadow-sm'
                      : 'text-[#230B14] hover:bg-white/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="glass-squircle-icon min-h-[46px] w-full sm:w-auto px-6 sm:px-8 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#230B14] hover:text-[#B5123B] inline-flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Browse All Jewellery &amp; Accessories</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </section>

        {/* 4. SPECIAL CUSTOM JEWELLERY STUDIO & VISUAL GALLERY */}
        <section className="reveal-section grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Custom Studio Pink Glass Panel */}
          <div className="lg:col-span-7 glass-pink rounded-[26px] sm:rounded-[32px] p-5 min-[375px]:p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <SquircleIcon variant="crimson" className="w-10 h-10 sm:w-11 sm:h-11">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                </SquircleIcon>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B5123B] font-semibold">
                  Bespoke Atelier
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14] leading-tight mb-3 sm:mb-4">
                YOUR STYLE. YOUR CREATION.
              </h2>
              <p className="text-sm sm:text-base text-[#6E3F50] leading-relaxed max-w-xl mb-6">
                Looking for colour-matched bridal bangles, custom pearl earrings, or an accessory tailored to a specific outfit? Submit your vision, attach a reference photo, and share directly with our boutique concierge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8">
                {[
                  { title: '01. Share Brief', desc: 'Choose jewellery type, palette & materials' },
                  { title: '02. Reference Photo', desc: 'Upload outfit or inspiration imagery' },
                  { title: '03. WhatsApp Quote', desc: 'Receive tailored consultation & pricing' },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-[16px] sm:rounded-[18px] bg-white/65 border border-white/80 p-3.5"
                  >
                    <p className="font-serif text-base font-semibold text-[#B5123B]">
                      {step.title}
                    </p>
                    <p className="text-xs text-[#6E3F50] mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <Link
                to="/custom"
                className="glass-shimmer glass-crimson-btn min-h-[46px] px-6 sm:px-7 py-3.5 rounded-[16px] sm:rounded-[18px] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>SUBMIT CUSTOM REQUEST</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/about"
                className="glass-squircle-icon min-h-[46px] px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#230B14] hover:text-[#B5123B] inline-flex items-center justify-center"
              >
                Read Brand Story
              </Link>
            </div>
          </div>

          {/* Right Editorial Gallery Preview */}
          <div className="lg:col-span-5 glass-panel rounded-[26px] sm:rounded-[32px] p-4 min-[375px]:p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#B5123B] font-semibold">
                  Lookbook
                </p>
                <h3 className="font-serif text-2xl font-semibold text-[#230B14]">
                  Styling &amp; Close-Ups
                </h3>
              </div>
              <Link
                to="/gallery"
                className="text-xs font-semibold text-[#B5123B] hover:underline whitespace-nowrap"
              >
                Open Gallery
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 flex-1">
              {galleryItems.slice(0, 4).map((g) => (
                <Link
                  key={g.id}
                  to="/gallery"
                  className="group relative rounded-[15px] sm:rounded-[18px] overflow-hidden aspect-[4/3] bg-white/60"
                >
                  <LuxuryImage
                    src={g.imageUrl}
                    alt={g.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#230B14]/65 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end p-2.5 sm:p-3">
                    <span className="text-[11px] font-medium text-white truncate">
                      {g.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
