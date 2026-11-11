import React from 'react';
import { useAppStore } from '../../../context/AppContext';
import { LinearProgress } from '../../ui/Progress';
import { Flame, Zap } from 'lucide-react';

export const HunterStatus: React.FC = () => {
  const { userProfile, hunterStats } = useAppStore();

  if (!hunterStats || !userProfile) return null;

  const currentDay = userProfile.currentDay || 1;
  const overallProgressPct = Math.round((currentDay / 90) * 100);
  const xpPct = Math.round((hunterStats.currentXP / hunterStats.xpForNextLevel) * 100);

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#151D30] to-[#101626] border border-[#725CFF]/30 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#725CFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#00D4FF]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3.5">
          {/* Avatar Rune */}
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#725CFF] to-[#00D4FF] p-0.5 shadow-[0_0_20px_rgba(114,92,255,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center">
              <span className="font-display font-black text-xl text-[#00D4FF]">
                {userProfile.fullName ? userProfile.fullName[0].toUpperCase() : 'H'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-display uppercase tracking-[0.25em] text-[#00D4FF] font-semibold block">
              STATUS OVERRIDE
            </span>
            <h2 className="font-display font-black text-lg tracking-wider text-[#F5F7FF] uppercase">
              HUNTER: {userProfile.fullName}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-[#725CFF] bg-[#725CFF]/15 px-2.5 py-0.5 rounded-full border border-[#725CFF]/30">
                LEVEL 0{hunterStats.level} — {hunterStats.levelTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Day & Streak */}
        <div className="text-right">
          <div className="text-xs font-display font-bold text-[#00D4FF] uppercase tracking-wider">
            DAY {String(currentDay).padStart(2, '0')} / 90
          </div>
          <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#FFB547] mt-1">
            <Flame className="w-3.5 h-3.5 fill-[#FFB547]" />
            <span>STREAK: {hunterStats.streakDays} DAYS</span>
          </div>
        </div>
      </div>

      {/* Large Animated XP Progression Bar */}
      <div className="mt-5 pt-4 border-t border-[#725CFF]/15 relative z-10">
        <div className="flex justify-between items-center text-xs font-display mb-1.5">
          <span className="text-[#929DB5] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>LEVEL PROGRESSION</span>
          </span>
          <span className="text-[#F5F7FF] font-mono font-semibold">
            XP: <span className="text-[#00D4FF]">{hunterStats.currentXP}</span> / {hunterStats.xpForNextLevel}
          </span>
        </div>
        <LinearProgress value={xpPct} color="violet" size="md" />
      </div>

      {/* Overall 90-Day Transformation Arc */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[#929DB5] font-display">
        <span>90-DAY TRANSFORMATION COMPLETE:</span>
        <span className="text-[#27E58C] font-bold">{overallProgressPct}%</span>
      </div>
    </div>
  );
};

