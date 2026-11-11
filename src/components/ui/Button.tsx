import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cyan' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glow = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-display font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold tracking-wide',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#725CFF] to-[#9482FF] text-[#F5F7FF] hover:brightness-110 shadow-lg shadow-[#725CFF]/25 border border-[#725CFF]/30',
    cyan: 'bg-gradient-to-r from-[#00D4FF] to-[#0099FF] text-[#080B14] font-semibold hover:brightness-110 shadow-lg shadow-[#00D4FF]/25 border border-[#00D4FF]/40',
    secondary: 'bg-[#151D30] text-[#F5F7FF] hover:bg-[#1B253D] border border-[#725CFF]/30',
    ghost: 'bg-transparent text-[#929DB5] hover:text-[#F5F7FF] hover:bg-[#151D30]/60',
    danger: 'bg-gradient-to-r from-[#FF5263] to-[#FF7582] text-white hover:brightness-110 shadow-lg shadow-[#FF5263]/25 border border-[#FF5263]/30',
    success: 'bg-gradient-to-r from-[#27E58C] to-[#1FB86E] text-[#080B14] font-semibold hover:brightness-110 shadow-lg shadow-[#27E58C]/25',
  };

  const glowStyle = glow ? 'shadow-[0_0_20px_rgba(114,92,255,0.45)]' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

