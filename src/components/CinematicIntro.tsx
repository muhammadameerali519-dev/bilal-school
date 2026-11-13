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
    }, 680);
  };

  const particles = [
    { top: '14%', left: '16%', size: 10, delay: 0 },
    { top: '22%', left: '78%', size: 14, delay: 0.4 },
    { top: '68%', left: '12%', size: 12, delay: 0.8 },
    { top: '76%', left: '84%', size: 9, delay: 0.3 },
    { top: '42%', left: '8%', size: 7, delay: 1.1 },
    { top: '34%', left: '91%', size: 11, delay: 0.6 },
    { top: '84%', left: '46%', size: 8, delay: 0.9 },
    { top: '12%', left: '52%', size: 8, delay: 0.2 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={
          exiting
            ? { opacity: 0, scale: 1.06, filter: 'blur(18px)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-8"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(247, 168, 196, 0.36) 0%, transparent 48%), radial-gradient(circle at 80% 78%, rgba(227, 38, 82, 0.45) 0%, transparent 50%), linear-gradient(145deg, #3D0819 0%, #7C0D2C 48%, #B5123B 100%)',
        }}
      >
        {/* Subtle floating jewellery imagery fragments */}
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

        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [2, -3, 2] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute top-20 right-24 w-28 h-28 rounded-[24px] overflow-hidden border border-white/30 shadow-xl opacity-65"
        >
          <img
            src={BRAND_IMAGES.rings}
            alt="Floating ruby crystal ring"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          animate={{ y: [10, -8, 10], rotate: [-2, 3, -2] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute bottom-20 left-24 w-32 h-32 rounded-[24px] overflow-hidden border border-white/30 shadow-xl opacity-65"
        >
          <img
            src={BRAND_IMAGES.bangles}
            alt="Floating golden bangles"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Shimmering diamond/pearl light particles */}
        {particles.map((p, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0.15, scale: 0.7 }}
            animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.8, 1.25, 0.8], y: [-6, 6, -6] }}
            transition={{ duration: 3.4 + idx * 0.3, repeat: Infinity, delay: p.delay }}
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            className="absolute rounded-[4px] rotate-45 bg-gradient-to-br from-white via-[#FFE0EB] to-[#F7A8C4] shadow-[0_0_18px_rgba(255,224,235,0.8)] pointer-events-none"
          />
        ))}

        {/* Center Glass Squircle Reveal Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-[36px] border border-white/35 bg-white/12 backdrop-blur-2xl p-8 sm:p-14 text-center shadow-[0_32px_90px_-15px_rgba(20,2,10,0.65),inset_0_1px_1px_rgba(255,255,255,0.5)]"
        >
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-7 w-20 h-20 rounded-[24px] border border-white/45 bg-white/15 backdrop-blur-xl flex items-center justify-center text-[#FFE0EB] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <BrandEmblem className="w-10 h-10" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xs sm:text-sm tracking-[0.34em] uppercase text-[#FFE0EB]/90 font-medium mb-3"
          >
            Luxury Jewellery &amp; Accessories
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl sm:text-6xl font-semibold tracking-[0.14em] text-white mb-5"
          >
            BILAL SHEIKH
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-[#FFE0EB] to-transparent mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="text-sm sm:text-base tracking-[0.22em] text-[#FFE0EB] font-medium mb-10"
          >
            STYLE THAT SPEAKS. ELEGANCE THAT LASTS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={handleExplore}
              className="glass-shimmer group inline-flex items-center gap-3 px-8 py-4 rounded-[18px] bg-white text-[#B5123B] font-semibold text-sm tracking-[0.12em] shadow-[0_18px_40px_-8px_rgba(0,0,0,0.35)] hover:bg-[#FFE0EB] transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-[#E32652]" />
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
