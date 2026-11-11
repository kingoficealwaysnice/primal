import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface AwakenHeroScreenProps {
  onGetStarted: () => void;
  onClose?: () => void;
  isDismissable?: boolean;
}

export const AwakenHeroScreen: React.FC<AwakenHeroScreenProps> = ({
  onGetStarted,
  onClose,
  isDismissable = false
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0714] flex flex-col justify-between px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-[max(env(safe-area-inset-bottom),1.75rem)] h-[100dvh] max-h-[100dvh] overflow-hidden select-none animate-in fade-in duration-300">
      {/* Deep Amethyst Background Radial Nebulas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-[#7C3AED]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-[#C084FC]/18 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-[#38BDF8]/12 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle sci-fi border vignette */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none" />

      {/* Top Header: Stylized Runic Glyph + AWAKEN (with optional close button) */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto pt-2 relative z-20">
        <div className="w-8" /> {/* spacer to balance close button */}
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#C084FC] drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]"
          >
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#runeGradHero)" />
            <defs>
              <linearGradient id="runeGradHero" x1="3" y1="2" x2="21" y2="22">
                <stop stopColor="#F5F3FF" />
                <stop offset="0.5" stopColor="#C084FC" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-cinzel font-bold text-base sm:text-lg tracking-[0.35em] text-[#F5F7FF] drop-shadow-[0_0_14px_rgba(233,213,255,0.7)]">
            AWAKEN
          </span>
        </div>

        {isDismissable && onClose ? (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#9D94B8] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Central Sung Jin-woo Inspired Silhouette Hero Art (Dynamic Scale for iPhone 16 Pro Max) */}
      <div className="relative flex-1 flex items-center justify-center my-auto min-h-0 w-full max-w-sm mx-auto">
        <div className="relative w-full max-w-[310px] h-[48vh] max-h-[380px] flex items-center justify-center">
          {/* Glowing Aura Rays & Ambient Light */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#7C3AED]/35 via-[#C084FC]/25 to-transparent rounded-full filter blur-3xl animate-pulse" />

          {/* Silhouette Vector */}
          <svg
            viewBox="0 0 300 370"
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
          >
            <defs>
              <radialGradient id="auraGlowHero" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#7C3AED" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0A0714" stopOpacity="0" />
              </radialGradient>
              <filter id="eyeGlowHero" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background mystical circular aura */}
            <circle cx="150" cy="165" r="135" fill="url(#auraGlowHero)" />

            {/* Dark Energy Tendrils / Floating Shadows */}
            <path
              d="M40 370 C50 300 45 240 70 200 C80 230 70 270 60 370 Z"
              fill="#100A22"
              opacity="0.7"
            />
            <path
              d="M260 370 C250 300 255 240 230 200 C220 230 230 270 240 370 Z"
              fill="#100A22"
              opacity="0.7"
            />

            {/* Shoulders & Overcoat Silhouette */}
            <path
              d="M50 370 C60 295 85 260 110 240 L125 200 L140 235 L160 235 L175 200 L190 240 C215 260 240 295 250 370 Z"
              fill="#120D24"
            />
            <path
              d="M80 370 C90 305 110 275 130 255 L145 225 L155 225 L170 255 C190 275 210 305 220 370 Z"
              fill="#191133"
            />

            {/* High Coat Collar & Tie/Neck Structure */}
            <path d="M132 215 L150 242 L168 215 L162 175 L138 175 Z" fill="#221849" />
            <polygon points="150,228 140,195 160,195" fill="#2E2063" />

            {/* Angular Jaw & Head Shadow */}
            <path
              d="M122 145 C122 178 138 202 150 208 C162 202 178 178 178 145 Z"
              fill="#1E163B"
            />

            {/* Solo Leveling Spiky Hair Silhouette */}
            <path
              d="M112 152 C106 125 108 98 128 78 C138 62 160 62 176 72 C192 82 198 108 188 140 C198 125 204 102 198 82 C188 55 160 45 132 50 C104 55 88 88 98 130 C88 140 85 162 92 182 C104 172 110 162 112 152 Z"
              fill="#110B22"
            />
            <path
              d="M132 78 C142 68 165 68 176 82 C186 94 182 116 176 132 C170 110 158 94 142 88 Z"
              fill="#271B52"
            />

            {/* Forehead Hair Bangs */}
            <polygon
              points="132,110 144,142 146,120 155,148 160,124 170,138 166,110"
              fill="#150E2D"
            />

            {/* THE ICONIC GLOWING PURPLE / LILAC LEFT EYE WITH RADIANT FLARE */}
            <g filter="url(#eyeGlowHero)">
              {/* Horizontal lens flare rays */}
              <ellipse cx="163" cy="138" rx="26" ry="2" fill="#F5F3FF" opacity="0.95" />
              <ellipse cx="163" cy="138" rx="14" ry="4" fill="#C084FC" />
              <circle cx="160" cy="138" r="4.2" fill="#FFFFFF" />

              {/* Upward curved signature flare arc */}
              <path
                d="M163 138 Q180 125 186 102 Q182 120 168 134 Z"
                fill="#C084FC"
                opacity="0.95"
              />
              <path
                d="M161 138 Q174 128 178 112 Q175 124 165 135 Z"
                fill="#E9D5FF"
                opacity="0.9"
              />
            </g>

            {/* Subtle cheekbone & nose contour highlight */}
            <path
              d="M152 138 L149 162 L144 165"
              stroke="#38266E"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Typography & Call To Action (Exact replica of Screen 1) */}
      <div className="max-w-md mx-auto w-full pb-2 relative z-20 space-y-4">
        <div className="space-y-1">
          <h1 className="font-cinzel text-3xl sm:text-4xl leading-[1.12] font-black tracking-wider text-left pl-1">
            <span className="text-[#F5F7FF] block">YOUR</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3FF] via-[#C084FC] to-[#A855F7] block drop-shadow-[0_0_25px_rgba(192,132,252,0.85)]">
              AWAKENING
            </span>
            <span className="text-[#F5F7FF] block">BEGINS NOW!</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#A78BFA] font-sans text-left pl-1 pt-1 font-medium tracking-wide leading-relaxed">
            Walk your path. Take action. Conquer. Become a legend!
          </p>
        </div>

        {/* Solid Lilac Pill CTA Button (Optimized for iPhone 16 Pro Max one-thumb tap) */}
        <button
          onClick={onGetStarted}
          className="w-full h-14 sm:h-16 rounded-full bg-[#C084FC] hover:bg-[#D8B4FE] text-[#0A0714] font-cinzel font-black text-sm sm:text-base tracking-[0.16em] uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_35px_rgba(192,132,252,0.6)] flex items-center justify-center gap-2"
        >
          Get Started <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
