import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandEmblem } from './GlassUI';
import { BRAND_IMAGES } from '../data/catalogDefaults';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleExplore = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      onComplete();
    }, 620);
  };

  const particles = [
    { top: '12%', left: '14%', size: 9, delay: 0 },
    { top: '18%', left: '80%', size: 12, delay: 0.4 },
    { top: '72%', left: '12%', size: 10, delay: 0.8 },
    { top: '78%', left: '84%', size: 8, delay: 0.3 },
    { top: '42%', left: '8%', size: 7, delay: 1.1 },
    { top: '34%', left: '91%', size: 10, delay: 0.6 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={
          exiting
            ? { opacity: 0, scale: 1.04 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-3.5 sm:px-6 py-6"
        style={{
          minHeight: '100dvh',
          background:
            'radial-gradient(circle at 20% 20%, rgba(247, 168, 196, 0.36) 0%, transparent 48%), radial-gradient(circle at 80% 78%, rgba(227, 38, 82, 0.45) 0%, transparent 50%), linear-gradient(145deg, #3D0819 0%, #7C0D2C 48%, #B5123B 100%)',
        }}
      >
        {/* Desktop Floating Jewellery Imagery */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-3, 2, -3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:block absolute top-14 left-12 w-40 h-40 rounded-[28px] overflow-hidden border border-white/35 shadow-2xl opacity-75 backdrop-blur-md"
        >
          <img
            src={BRAND_IMAGES.earrings}
            alt="Floating crystal drop earrings"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D0819]/40 to-transparent" />
        </motion.div>

        <motion.div
          animate={{ y: [12, -12, 12], rotate: [3, -2, 3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:block absolute bottom-14 right-12 w-44 h-44 rounded-[30px] overflow-hidden border border-white/35 shadow-2xl opacity-75 backdrop-blur-md"
        >
          <img
            src={BRAND_IMAGES.necklaces}
            alt="Floating pearl necklace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D0819]/40 to-transparent" />
        </motion.div>

        {/* Shimmering diamond/pearl light particles */}
        {particles.map((p, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0.15, scale: 0.7 }}
            animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3.4 + idx * 0.3, repeat: Infinity, delay: p.delay }}
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            className="absolute rounded-[4px] rotate-45 bg-gradient-to-br from-white via-[#FFE0EB] to-[#F7A8C4] shadow-[0_0_16px_rgba(255,224,235,0.75)] pointer-events-none"
          />
        ))}

        {/* Center Glass Squircle Reveal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-[28px] sm:rounded-[36px] border border-white/35 bg-white/12 backdrop-blur-xl p-6 min-[375px]:p-8 sm:p-14 text-center shadow-[0_28px_80px_-15px_rgba(20,2,10,0.65),inset_0_1px_1px_rgba(255,255,255,0.5)] my-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="mx-auto mb-5 sm:mb-7 w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[24px] border border-white/45 bg-white/15 backdrop-blur-xl flex items-center justify-center text-[#FFE0EB] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <BrandEmblem className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>

          {/* Compact mobile jewellery preview strip */}
          <div className="md:hidden flex items-center justify-center gap-2.5 mb-5">
            {[BRAND_IMAGES.earrings, BRAND_IMAGES.necklaces, BRAND_IMAGES.rings].map(
              (src, i) => (
                <div
                  key={i}
                  className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 rounded-[14px] overflow-hidden border border-white/45 shadow-lg"
                >
                  <img src={src} alt="Jewellery preview" className="w-full h-full object-cover" />
                </div>
              )
            )}
          </div>

          <p className="text-[10px] sm:text-sm tracking-[0.26em] sm:tracking-[0.34em] uppercase text-[#FFE0EB]/90 font-medium mb-2.5 sm:mb-3">
            Luxury Jewellery &amp; Accessories
          </p>

          <h1 className="font-serif text-3xl min-[375px]:text-4xl sm:text-6xl font-semibold tracking-[0.1em] sm:tracking-[0.14em] text-white mb-4 sm:mb-5">
            BILAL SHEIKH
          </h1>

          <div className="mx-auto h-px w-24 sm:w-28 bg-gradient-to-r from-transparent via-[#FFE0EB] to-transparent mb-4 sm:mb-6" />

          <p className="text-xs min-[375px]:text-sm sm:text-base tracking-[0.16em] sm:tracking-[0.22em] text-[#FFE0EB] font-medium mb-7 sm:mb-10 leading-relaxed">
            STYLE THAT SPEAKS. ELEGANCE THAT LASTS.
          </p>

          <button
            type="button"
            onClick={handleExplore}
            className="glass-shimmer group w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[16px] sm:rounded-[18px] bg-white text-[#B5123B] font-semibold text-xs sm:text-sm tracking-[0.12em] shadow-[0_18px_40px_-8px_rgba(0,0,0,0.35)] hover:bg-[#FFE0EB] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-[#E32652]" />
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
