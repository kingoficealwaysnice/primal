import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  glow?: 'violet' | 'cyan' | 'none';
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  badge,
  glow = 'none',
  headerAction,
  children,
  className = '',
  onClick
}) => {
  const glowClasses = {
    violet: 'border-[#C084FC]/35 shadow-[0_8px_32px_rgba(192,132,252,0.15)]',
    cyan: 'border-[#38BDF8]/35 shadow-[0_8px_32px_rgba(56,189,248,0.15)]',
    none: 'border-white/10 hover:border-white/20'
  };

  const cardContent = (
    <div
      onClick={onClick}
      className={`bg-[#120D24]/85 backdrop-blur-2xl rounded-3xl border p-4 sm:p-5 transition-all duration-200 ${glowClasses[glow]} ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} ${className}`}
    >
      {(title || subtitle || badge || headerAction) && (
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="font-display font-semibold text-xs sm:text-sm tracking-wider uppercase text-white">
                  {title}
                </h3>
              )}
              {badge && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/30 font-bold">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#9D94B8] mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );

  return cardContent;
};
