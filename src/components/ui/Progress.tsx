import React from 'react';

interface LinearProgressProps {
  value: number; // 0 to 100
  color?: 'violet' | 'cyan' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  color = 'violet',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const gradientStyles = {
    violet: 'from-[#725CFF] to-[#00D4FF]',
    cyan: 'from-[#00D4FF] to-[#27E58C]',
    success: 'from-[#27E58C] to-[#00D4FF]',
    warning: 'from-[#FFB547] to-[#FF5263]',
    danger: 'from-[#FF5263] to-[#725CFF]',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-[#101626] rounded-full overflow-hidden border border-[#725CFF]/15 ${heightStyles[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${gradientStyles[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-[11px] font-display text-[#929DB5]">
          <span>Progress</span>
          <span className="text-[#00D4FF] font-semibold">{Math.round(clamped)}%</span>
        </div>
      )}
    </div>
  );
};

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string; // hex
  label?: string;
  sublabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 110,
  strokeWidth = 9,
  color = '#725CFF',
  label,
  sublabel
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#101626"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
        <span className="text-sm font-display font-bold text-[#F5F7FF]">
          {label ?? `${Math.round(clamped)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] text-[#929DB5] uppercase tracking-wider -mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

