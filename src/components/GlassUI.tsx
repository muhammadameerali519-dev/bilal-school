import React, { useState } from 'react';
import { Gem } from 'lucide-react';

export const BrandEmblem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M20 4L33 14.5L20 36L7 14.5L20 4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M7 14.5H33M13.5 14.5L20 4L26.5 14.5M13.5 14.5L20 36L26.5 14.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      opacity="0.85"
    />
  </svg>
);

export const SquircleIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'crimson' | 'pink';
}> = ({ children, className = '', variant = 'glass' }) => {
  const variantStyles =
    variant === 'crimson'
      ? 'glass-crimson-btn text-white rounded-[14px]'
      : variant === 'pink'
      ? 'glass-pink text-[#B5123B] rounded-[14px]'
      : 'glass-squircle-icon text-[#230B14] rounded-[14px]';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 transition-transform duration-200 ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const LuxuryImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}> = ({ src, alt, className = '', fallbackTitle }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FFE0EB] via-[#FFF5F8] to-[#F7A8C4]/40 text-[#B5123B] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="glass-squircle-icon w-12 h-12 flex items-center justify-center mb-3 text-[#B5123B]">
          <Gem className="w-5 h-5" />
        </div>
        <span className="font-serif text-sm font-semibold tracking-wide text-[#230B14] line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};
