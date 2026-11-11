import React from 'react';

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
    violet: 'border-[#725CFF]/35 shadow-[0_0_25px_-5px_rgba(114,92,255,0.25)]',
    cyan: 'border-[#00D4FF]/35 shadow-[0_0_25px_-5px_rgba(0,212,255,0.25)]',
    none: 'border-[#725CFF]/15 hover:border-[#725CFF]/30'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#151D30]/90 backdrop-blur-md rounded-2xl border p-4 transition-all duration-200 ${glowClasses[glow]} ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} ${className}`}
    >
      {(title || subtitle || badge || headerAction) && (
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#725CFF]/10">
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#F5F7FF]">
                  {title}
                </h3>
              )}
              {badge && (
                <span className="text-[10px] font-display uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#725CFF]/20 text-[#00D4FF] border border-[#00D4FF]/30">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#929DB5] mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

