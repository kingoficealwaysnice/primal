import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../context/AppContext';
import {
  Users,
  Share2,
  Flame,
  Zap,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';

interface AppleDynamicIslandProps {
  onOpenUserSwitcher: () => void;
  onOpenShareModal: () => void;
  onOpenAlliesDossier: () => void;
}

export const AppleDynamicIsland: React.FC<AppleDynamicIslandProps> = ({
  onOpenUserSwitcher,
  onOpenShareModal,
  onOpenAlliesDossier
}) => {
  const {
    activeUser,
    hunterStats,
    userProfile,
    todayQuests,
    todayMeals,
    todayWaterMl
  } = useAppStore();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeUser || !hunterStats) return null;

  const questsCompleted = todayQuests.filter(q => q.completed).length;
  const totalQuests = todayQuests.length || 7;
  const questPct = Math.round((questsCompleted / totalQuests) * 100);

  return (
    <div className="relative z-40 flex justify-center px-4 py-1.5">
      <motion.div
        layout
        transition={{ type: 'spring', damping: 26, stiffness: 350 }}
        className={`bg-[#120D24]/90 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] cursor-pointer select-none transition-colors ${
          isExpanded
            ? 'w-full max-w-md rounded-[28px] p-4 bg-[#140E29]/95 border-[#C084FC]/40'
            : 'rounded-full px-3.5 py-1.5 hover:border-white/30'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* COMPACT PILL STATE */}
        {!isExpanded && (
          <div className="flex items-center gap-3">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#C084FC] via-[#A855F7] to-[#7C3AED] flex items-center justify-center text-[11px] shadow-sm border border-white/30">
                {activeUser.avatarEmoji || '⚡'}
              </div>
              <span className="text-xs font-semibold text-white tracking-tight">
                {activeUser.displayName}
              </span>
            </div>

            {/* Level Pill */}
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/40">
              LVL {hunterStats.level}
            </span>

            {/* Streak */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#FFB547] font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{hunterStats.streakDays}d</span>
            </div>

            {/* Micro Activity Arc */}
            <div className="flex items-center gap-1 pl-1 border-l border-white/10 text-[10px] font-mono text-white/70">
              <span className="text-[#38BDF8] font-bold">{questsCompleted}/{totalQuests}</span>
              <span className="text-[9px] text-[#9D94B8]">Quests</span>
            </div>

            <ChevronDown className="w-3 h-3 text-white/40 ml-0.5" />
          </div>
        )}

        {/* EXPANDED ISLAND STATE */}
        {isExpanded && (
          <div
            className="space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C084FC] to-[#7C3AED] flex items-center justify-center text-lg shadow-md border border-white/30">
                  {activeUser.avatarEmoji || '⚡'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{activeUser.displayName}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C084FC]/20 text-[#C084FC]">
                      LVL {hunterStats.level}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#38BDF8] font-mono font-semibold">
                    {hunterStats.levelTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFB547]/20 border border-[#FFB547]/40 text-[#FFB547] text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{hunterStats.streakDays}d Streak</span>
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#9D94B8]">Daily Quest Progress</span>
                <span className="text-[#C084FC] font-bold">{questPct}% ({questsCompleted}/{totalQuests})</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C084FC] to-[#38BDF8] rounded-full transition-all duration-500"
                  style={{ width: `${questPct}%` }}
                />
              </div>
            </div>

            {/* 3 Quick Action Apple Pills */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Switch User */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsExpanded(false);
                  onOpenUserSwitcher();
                }}
                className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex flex-col items-center gap-1 transition-colors"
              >
                <Users className="w-4 h-4 text-[#C084FC]" />
                <span className="text-[11px] font-medium tracking-tight">Switch User</span>
              </motion.button>

              {/* Share My Protocol */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsExpanded(false);
                  onOpenShareModal();
                }}
                className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex flex-col items-center gap-1 transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[11px] font-medium tracking-tight">Share Data</span>
              </motion.button>

              {/* Hunter Circle Allies */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsExpanded(false);
                  onOpenAlliesDossier();
                }}
                className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex flex-col items-center gap-1 transition-colors"
              >
                <Award className="w-4 h-4 text-[#34D399]" />
                <span className="text-[11px] font-medium tracking-tight">Hunter Circle</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

