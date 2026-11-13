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
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((sec) => {
        gsap.from(sec, {
          y: 28,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: sec,
            start: 'top 84%',
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
    <div ref={rootRef} className="px-4 sm:px-6 pb-8">
      <div className="max-w-[1320px] mx-auto space-y-20 sm:space-y-24">
        {/* 1. LUXURY HERO SECTION */}
        <section className="pt-4 sm:pt-6">
          <div className="glass-panel-strong rounded-[34px] p-5 sm:p-8 lg:p-10 relative overflow-hidden">
            {/* Subtle ambient rose lighting */}
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F7A8C4]/30 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-4">
                <div>
                  <p className="hero-stagger text-xs uppercase tracking-[0.26em] text-[#B5123B] font-semibold mb-4">
                    BILAL SHEIKH · Luxury Artificial Jewellery &amp; Accessories
                  </p>
                  <h1 className="hero-stagger font-serif text-4xl sm:text-6xl xl:text-[66px] font-semibold text-[#230B14] leading-[1.03] tracking-tight mb-6">
                    BEAUTY IN EVERY DETAIL.
                  </h1>
                  <p className="hero-stagger text-base sm:text-lg text-[#6E3F50] leading-relaxed max-w-xl mb-8">
                    Discover a world of timeless elegance, statement jewellery, and beautiful accessories designed to make every moment special.
                  </p>

                  <div className="hero-stagger flex flex-wrap items-center gap-3.5">
                    <Link
                      to="/collections"
                      className="glass-shimmer glass-crimson-btn px-7 py-4 rounded-[18px] text-white text-xs sm:text-sm font-semibold tracking-[0.12em] inline-flex items-center gap-2.5 whitespace-nowrap"
                    >
                      <span>EXPLORE COLLECTION</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('featured-collection');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="glass-squircle-icon px-7 py-4 text-xs sm:text-sm font-semibold tracking-[0.12em] text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>SHOP NOW</span>
                    </button>
                  </div>
                </div>

                {/* Scroll indicator + quiet studio note */}
                <div className="hero-stagger mt-10 pt-6 border-t border-white/70 flex items-center justify-between gap-4 text-xs text-[#6E3F50]">
                  <span>Crafted styling · Cash on Delivery &amp; WhatsApp Order Concierge</span>
                  <a
                    href="#shop-by-category"
                    className="inline-flex items-center gap-1.5 text-[#B5123B] font-semibold hover:translate-y-0.5 transition-transform whitespace-nowrap"
                  >
                    <span>Scroll</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Campaign Photography + Subtle 3D Glass Accent */}
              <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[440px]">
                <motion.div
                  whileHover={{ rotateY: 2.5, rotateX: -1.5 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full rounded-[26px] overflow-hidden border border-white/80 shadow-[0_26px_60px_-14px_rgba(181,18,59,0.24)] relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <LuxuryImage
                    src={BRAND_IMAGES.hero}
                    alt="BILAL SHEIKH artificial diamond necklace, pearl earrings, and golden bangles on blush silk and rose marble"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#230B14]/40 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Glass Feature Card */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs glass-panel-strong rounded-[20px] p-4 flex items-center gap-3.5">
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
              </div>
            </div>
          </div>
        </section>

        {/* 2. SHOP BY CATEGORY — ASYMMETRICAL EDITORIAL GRID */}
        <section id="shop-by-category" className="reveal-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#B5123B] font-semibold mb-2">
                Curated Departments
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14]">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#B5123B] hover:underline whitespace-nowrap"
            >
              <span>View Complete Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[240px]">
            {LUXURY_CATEGORIES.map((cat) => {
              const spanClass =
                cat.span === 'large'
                  ? 'lg:col-span-2 lg:row-span-2 min-h-[280px]'
                  : cat.span === 'wide'
                  ? 'lg:col-span-2'
                  : '';

              return (
                <Link
                  key={cat.slug}
                  to={cat.slug === 'custom-items' ? '/custom' : `/collections/${cat.slug}`}
                  className={`group relative rounded-[26px] overflow-hidden glass-panel p-2 transition-transform duration-300 hover:-translate-y-1 ${spanClass}`}
                >
                  <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                    <LuxuryImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#230B14]/80 via-[#230B14]/25 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div className="glass-panel rounded-[16px] px-4 py-3 flex-1 min-w-0 bg-white/75 backdrop-blur-xl">
                        <h3 className="font-serif text-xl font-semibold text-[#230B14] truncate">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#6E3F50] truncate mt-0.5">
                          {cat.subtitle}
                        </p>
                      </div>

                      <SquircleIcon
                        variant="crimson"
                        className="w-11 h-11 group-hover:scale-105"
                      >
                        <ArrowRight className="w-4 h-4" />
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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#B5123B] font-semibold mb-2">
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
            <div className="flex flex-wrap items-center gap-1.5 glass-pink p-1.5 rounded-[18px]">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3.5 py-2 rounded-[12px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="glass-squircle-icon px-8 py-4 text-xs font-semibold tracking-[0.14em] uppercase text-[#230B14] hover:text-[#B5123B] inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>Browse All Jewellery &amp; Accessories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 4. SPECIAL CUSTOM JEWELLERY STUDIO & VISUAL GALLERY */}
        <section className="reveal-section grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Custom Studio Pink Glass Panel */}
          <div className="lg:col-span-7 glass-pink rounded-[32px] p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <SquircleIcon variant="crimson" className="w-11 h-11">
                  <Palette className="w-5 h-5" />
                </SquircleIcon>
                <span className="text-xs uppercase tracking-[0.22em] text-[#B5123B] font-semibold">
                  Bespoke Atelier
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#230B14] leading-tight mb-4">
                YOUR STYLE. YOUR CREATION.
              </h2>
              <p className="text-sm sm:text-base text-[#6E3F50] leading-relaxed max-w-xl mb-6">
                Looking for colour-matched bridal bangles, custom pearl earrings, or an accessory tailored to a specific outfit? Submit your vision, attach a reference photo, and share directly with our boutique concierge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { title: '01. Share Brief', desc: 'Choose jewellery type, palette & materials' },
                  { title: '02. Reference Photo', desc: 'Upload outfit or inspiration imagery' },
                  { title: '03. WhatsApp Quote', desc: 'Receive tailored consultation & pricing' },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-[18px] bg-white/60 border border-white/80 p-3.5"
                  >
                    <p className="font-serif text-base font-semibold text-[#B5123B]">
                      {step.title}
                    </p>
                    <p className="text-xs text-[#6E3F50] mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/custom"
                className="glass-shimmer glass-crimson-btn px-7 py-4 rounded-[18px] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>SUBMIT CUSTOM REQUEST</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="glass-squircle-icon px-6 py-4 text-xs sm:text-sm font-semibold text-[#230B14] hover:text-[#B5123B]"
              >
                Read Brand Story
              </Link>
            </div>
          </div>

          {/* Right Editorial Gallery Preview */}
          <div className="lg:col-span-5 glass-panel rounded-[32px] p-5 sm:p-6 flex flex-col justify-between">
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

            <div className="grid grid-cols-2 gap-3 flex-1">
              {galleryItems.slice(0, 4).map((g) => (
                <Link
                  key={g.id}
                  to="/gallery"
                  className="group relative rounded-[18px] overflow-hidden aspect-[4/3] bg-white/60"
                >
                  <LuxuryImage
                    src={g.imageUrl}
                    alt={g.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#230B14]/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
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
