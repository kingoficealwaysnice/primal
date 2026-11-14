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
  Award,
  Droplets,
  Dumbbell,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    todayWaterMl,
    logWaterIntake,
    islandAlert
  } = useAppStore();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeUser || !hunterStats) return null;

  const questsCompleted = todayQuests.filter(q => q.completed).length;
  const totalQuests = todayQuests.length || 7;
  const questPct = Math.min(100, Math.round((questsCompleted / totalQuests) * 100));

  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const calorieTarget = userProfile?.dailyCalorieTarget || 2100;
  const calPct = Math.min(100, Math.round((caloriesConsumed / calorieTarget) * 100));

  const waterTarget = userProfile?.dailyWaterTargetMl || 3000;
  const waterPct = Math.min(100, Math.round((todayWaterMl / waterTarget) * 100));

  const handleQuickHydrate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await logWaterIntake(250);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.15 },
      colors: ['#38BDF8', '#34D399', '#00D4FF']
    });
  };

  return (
    <div className="fixed top-2 sm:top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex justify-center">
      <motion.div
        layout
        transition={{ type: 'spring', damping: 24, stiffness: 340 }}
        onClick={() => {
          if (!islandAlert) setIsExpanded(!isExpanded);
        }}
        className={`bg-black text-white ring-1 ring-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.9)] cursor-pointer select-none overflow-hidden transition-all ${
          isExpanded
            ? 'w-[92vw] max-w-[375px] rounded-[36px] p-4 bg-black/95 backdrop-blur-3xl'
            : islandAlert
            ? 'px-4 py-1.5 rounded-[24px] bg-black/95 border border-[#C084FC]/40'
            : 'h-[34px] px-3 rounded-[22px] hover:ring-white/30 flex items-center'
        }`}
      >
        <AnimatePresence mode="wait">
          {/* STATE 1: LIVE DYNAMIC ISLAND ALERT / TOAST */}
          {islandAlert && !isExpanded ? (
            <motion.div
              key="alert"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="flex items-center gap-2.5 whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#C084FC] to-[#38BDF8] flex items-center justify-center text-[10px] animate-pulse">
                {islandAlert.icon || '⚡'}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] font-bold text-white tracking-tight">
                  {islandAlert.title}
                </span>
                {islandAlert.subtitle && (
                  <span className="text-[9px] text-[#9D94B8] font-mono mt-0.5">
                    {islandAlert.subtitle}
                  </span>
                )}
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#27E58C] shadow-[0_0_6px_#27E58C] ml-1" />
            </motion.div>
          ) : !isExpanded ? (
            /* STATE 2: COMPACT PHYSICAL DYNAMIC ISLAND PILL */
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full gap-3"
            >
              {/* Leading: Hunter Avatar & Name */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#C084FC] via-[#A855F7] to-[#7C3AED] flex items-center justify-center text-[10px] shadow-sm">
                  {activeUser.avatarEmoji || '⚡'}
                </div>
                <span className="text-[11px] font-semibold text-white tracking-tight max-w-[70px] truncate">
                  {activeUser.displayName}
                </span>
              </div>

              {/* Center Streak */}
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#FFB547] font-bold">
                <Flame className="w-3 h-3 fill-current" />
                <span>{hunterStats.streakDays}d</span>
              </div>

              {/* Trailing: Mini concentric activity dots */}
              <div className="flex items-center gap-1.5 pl-1 border-l border-white/10">
                {/* Quests Pill */}
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
                  <span className="text-[10px] font-mono font-bold text-white/90">
                    {questsCompleted}/{totalQuests}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* STATE 3: EXPANDED DYNAMIC ISLAND LIVE ACTIVITY HUD */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3.5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar inside Island */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C084FC] via-[#A855F7] to-[#7C3AED] flex items-center justify-center text-lg shadow-md border border-white/20">
                    {activeUser.avatarEmoji || '⚡'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white tracking-tight">
                        {activeUser.displayName}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#C084FC]/20 text-[#C084FC]">
                        LVL 0{hunterStats.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#38BDF8] font-mono font-semibold">
                      {hunterStats.levelTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB547]/20 border border-[#FFB547]/30 text-[#FFB547] text-[10px] font-mono font-bold">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{hunterStats.streakDays}d Streak</span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 text-white/40 hover:text-white rounded-full ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Metric Progress Bars */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Quests */}
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono uppercase text-[#C084FC] block">Quests</span>
                  <span className="text-xs font-bold text-white font-mono">{questsCompleted}/{totalQuests}</span>
                  <div className="h-1 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-[#C084FC] rounded-full" style={{ width: `${questPct}%` }} />
                  </div>
                </div>

                {/* Energy */}
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono uppercase text-[#38BDF8] block">Fuel</span>
                  <span className="text-xs font-bold text-white font-mono">{caloriesConsumed} kcal</span>
                  <div className="h-1 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-[#38BDF8] rounded-full" style={{ width: `${calPct}%` }} />
                  </div>
                </div>

                {/* Water */}
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono uppercase text-[#34D399] block">Water</span>
                  <span className="text-xs font-bold text-white font-mono">{(todayWaterMl / 1000).toFixed(1)}L</span>
                  <div className="h-1 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-[#34D399] rounded-full" style={{ width: `${waterPct}%` }} />
                  </div>
                </div>
              </div>

              {/* 1-Tap Quick Action Pills */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {/* 1-Tap Quick Hydrate */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={handleQuickHydrate}
                  className="py-2 px-2.5 rounded-2xl bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 border border-[#38BDF8]/30 text-white flex flex-col items-center gap-1 transition-colors"
                >
                  <Droplets className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="text-[10px] font-semibold tracking-tight">+250ml Water</span>
                </motion.button>

                {/* Switch Account */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenUserSwitcher();
                  }}
                  className="py-2 px-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center gap-1 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span className="text-[10px] font-medium tracking-tight">Switch User</span>
                </motion.button>

                {/* Share Protocol */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenShareModal();
                  }}
                  className="py-2 px-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center gap-1 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[10px] font-medium tracking-tight">Share Data</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
