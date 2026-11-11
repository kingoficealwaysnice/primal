import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-display font-medium uppercase tracking-wider text-[#929DB5] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[#929DB5] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-[#101626] border ${
            error ? 'border-[#FF5263]' : 'border-[#725CFF]/25 focus:border-[#725CFF] focus:shadow-[0_0_15px_rgba(114,92,255,0.3)]'
          } rounded-xl px-3.5 py-2.5 ${icon ? 'pl-10' : ''} text-sm text-[#F5F7FF] placeholder-[#929DB5]/60 outline-none transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="text-[11px] text-[#929DB5] mt-1">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-[#FF5263] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

