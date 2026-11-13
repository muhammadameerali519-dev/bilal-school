import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, HeartHandshake, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_IMAGES } from '../data/catalogDefaults';
import { LuxuryImage, SquircleIcon } from '../components/GlassUI';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="px-4 sm:px-6 pt-4 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-10">
        {/* Editorial Hero */}
        <div className="glass-panel-strong rounded-[34px] p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#B5123B] font-semibold">
              BILAL SHEIKH Brand Philosophy
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#230B14] leading-[1.05]">
              MORE THAN JEWELLERY. IT&apos;S YOUR PERSONAL STATEMENT.
            </h1>
            <p className="text-sm sm:text-base text-[#6E3F50] leading-relaxed whitespace-pre-line">
              {settings.aboutStory}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/collections"
                className="glass-crimson-btn px-7 py-3.5 rounded-[16px] text-white text-xs font-semibold inline-flex items-center gap-2"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/custom"
                className="glass-squircle-icon px-6 py-3.5 text-xs font-semibold text-[#230B14] hover:text-[#B5123B]"
              >
                Custom Jewellery Studio
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[3/4] rounded-[26px] overflow-hidden border border-white/80 shadow-xl">
              <LuxuryImage
                src={BRAND_IMAGES.atelier}
                alt="BILAL SHEIKH jewellery design table"
                className="w-full h-full object-cover object-[center_28%] scale-105"
              />
            </div>
          </div>
        </div>

        {/* Three Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Gem className="w-5 h-5" />,
              title: 'Attention to Detail',
              text: 'Every artificial diamond setting, faux pearl strand, and satin bow is selected for balanced weight, luminosity, and smooth finishing.',
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: 'Everyday & Occasion Styling',
              text: 'Effortlessly transition from minimal daytime cuffs and pearl studs to layered bridal chokers and statement cocktail rings.',
            },
            {
              icon: <HeartHandshake className="w-5 h-5" />,
              title: 'Personal Custom Experiences',
              text: 'Our Custom Studio invites you to request colour-matched pieces tailored to your wardrobe palette and budget preferences.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-panel rounded-[26px] p-6 sm:p-7 space-y-4"
            >
              <SquircleIcon variant="pink" className="w-12 h-12">
                {item.icon}
              </SquircleIcon>
              <h2 className="font-serif text-2xl font-semibold text-[#230B14]">
                {item.title}
              </h2>
              <p className="text-sm text-[#6E3F50] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
