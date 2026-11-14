import React from 'react';
import { motion } from 'framer-motion';

interface AppleActivityRingsProps {
  questPct: number;    // 0 - 100+ (Outer Ring: Quests / Movement)
  caloriePct: number;  // 0 - 100+ (Middle Ring: Calories / Energy)
  waterPct: number;    // 0 - 100+ (Inner Ring: Hydration / Stand)
  size?: number;       // diameter in px (default 120)
  showLabels?: boolean;
}

export const AppleActivityRings: React.FC<AppleActivityRingsProps> = ({
  questPct,
  caloriePct,
  waterPct,
  size = 130,
  showLabels = true
}) => {
  const strokeWidth = Math.max(7, Math.round(size * 0.08));
  const center = size / 2;

  // Ring 1 (Outer): Quests / Move - Lilac / Violet
  const r1 = center - strokeWidth;
  const circ1 = 2 * Math.PI * r1;
  const offset1 = circ1 - (Math.min(questPct, 100) / 100) * circ1;

  // Ring 2 (Middle): Calories / Energy - Cyan / Sky
  const r2 = r1 - strokeWidth - 3;
  const circ2 = 2 * Math.PI * r2;
  const offset2 = circ2 - (Math.min(caloriePct, 100) / 100) * circ2;

  // Ring 3 (Inner): Water / Hydration - Emerald / Mint
  const r3 = r2 - strokeWidth - 3;
  const circ3 = 2 * Math.PI * r3;
  const offset3 = circ3 - (Math.min(waterPct, 100) / 100) * circ3;

  return (
    <div className="flex items-center gap-4">
      {/* Concentric SVG Rings */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="appleRingMove" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="appleRingEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
            <linearGradient id="appleRingWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background Track 1 */}
          <circle
            cx={center}
            cy={center}
            r={r1}
            fill="none"
            stroke="rgba(192, 132, 252, 0.15)"
            strokeWidth={strokeWidth}
          />
          {/* Active Ring 1 */}
          <motion.circle
            cx={center}
            cy={center}
            r={r1}
            fill="none"
            stroke="url(#appleRingMove)"
            strokeWidth={strokeWidth}
            strokeDasharray={circ1}
            strokeDashoffset={offset1}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ1 }}
            animate={{ strokeDashoffset: offset1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Background Track 2 */}
          <circle
            cx={center}
            cy={center}
            r={r2}
            fill="none"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth={strokeWidth}
          />
          {/* Active Ring 2 */}
          <motion.circle
            cx={center}
            cy={center}
            r={r2}
            fill="none"
            stroke="url(#appleRingEnergy)"
            strokeWidth={strokeWidth}
            strokeDasharray={circ2}
            strokeDashoffset={offset2}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ2 }}
            animate={{ strokeDashoffset: offset2 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Background Track 3 */}
          <circle
            cx={center}
            cy={center}
            r={r3}
            fill="none"
            stroke="rgba(52, 211, 153, 0.15)"
            strokeWidth={strokeWidth}
          />
          {/* Active Ring 3 */}
          <motion.circle
            cx={center}
            cy={center}
            r={r3}
            fill="none"
            stroke="url(#appleRingWater)"
            strokeWidth={strokeWidth}
            strokeDasharray={circ3}
            strokeDashoffset={offset3}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ3 }}
            animate={{ strokeDashoffset: offset3 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Center Sparkle or Trophy Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-sm">
            <span className="text-[10px] font-bold text-white/90">⚡</span>
          </div>
        </div>
      </div>

      {/* Apple Activity Legends */}
      {showLabels && (
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC] shadow-[0_0_8px_#C084FC]" />
              <span className="text-xs font-medium text-white/90 tracking-tight">Daily Quests</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#C084FC]">{Math.round(questPct)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
              <span className="text-xs font-medium text-white/90 tracking-tight">Calorie Fuel</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#38BDF8]">{Math.round(caloriePct)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
              <span className="text-xs font-medium text-white/90 tracking-tight">Hydration</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#34D399]">{Math.round(waterPct)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

