import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../context/AppContext';
import { HunterStatus } from '../components/dashboard/widgets/HunterStatus';
import { HunterStatusWindow } from '../components/sololeveling/HunterStatusWindow';
import { SoloLevelingDailyQuestsView } from '../components/dashboard/widgets/SoloLevelingDailyQuestsView';
import { SoloLevelingQuestModal } from '../components/sololeveling/SoloLevelingQuestModal';
import { DailyQuests } from '../components/dashboard/widgets/DailyQuests';
import { TodayWorkout } from '../components/dashboard/widgets/TodayWorkout';
import { NutritionStatus } from '../components/dashboard/widgets/NutritionStatus';
import { PhysicalPerformance } from '../components/dashboard/widgets/PhysicalPerformance';
import { SystemNotifications } from '../components/dashboard/widgets/SystemNotifications';
import { AppleActivityRings } from '../components/apple/AppleActivityRings';
import { Zap, ListChecks, LayoutDashboard, Sparkles, Activity } from 'lucide-react';

export const Home: React.FC = () => {
  const { todayQuests, todayMeals, userProfile, todayWaterMl } = useAppStore();
  const [activeView, setActiveView] = useState<'quests' | 'dashboard' | 'status'>('quests');
  const [showQuestModal, setShowQuestModal] = useState(false);

  const questsCompleted = todayQuests.filter(q => q.completed).length;
  const totalQuests = todayQuests.length || 7;
  const questPct = Math.round((questsCompleted / totalQuests) * 100);

  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const calorieTarget = userProfile?.dailyCalorieTarget || 2100;
  const calPct = Math.round((caloriesConsumed / calorieTarget) * 100);

  const waterTarget = userProfile?.dailyWaterTargetMl || 3000;
  const waterPct = Math.round((todayWaterMl / waterTarget) * 100);

  const tabs = [
    { id: 'quests', label: 'Daily Quests', icon: ListChecks },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'status', label: 'Status HUD', icon: Zap }
  ] as const;

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-2">
      {/* Solo Leveling Holographic Quest Modal */}
      <SoloLevelingQuestModal
        isOpen={showQuestModal}
        onClose={() => setShowQuestModal(false)}
      />

      {/* Apple-Style Fluid Segmented Control */}
      <div className="relative flex bg-[#120D24]/80 backdrop-blur-2xl p-1 rounded-2xl border border-white/10 shadow-lg">
        {tabs.map(tab => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveView(tab.id)}
              className={`relative flex-1 py-2 text-xs font-semibold tracking-wide rounded-xl transition-colors flex items-center justify-center gap-1.5 z-10 ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="homeSegmentPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] rounded-xl shadow-[0_0_15px_rgba(192,132,252,0.4)] -z-10"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="font-display uppercase tracking-wider">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* VIEW 1: EXACT SOLO LEVELING DAILY QUESTS (SCREEN 2) */}
      {activeView === 'quests' && (
        <motion.div
          key="quests"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <SoloLevelingDailyQuestsView />
        </motion.div>
      )}

      {/* VIEW 2: RPG SYSTEM STATUS HUD */}
      {activeView === 'status' && (
        <motion.div
          key="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <HunterStatusWindow />
        </motion.div>
      )}

      {/* VIEW 3: FULL COMPREHENSIVE FITNESS & NUTRITION DASHBOARD */}
      {activeView === 'dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Apple Fitness Activity Rings Card */}
          <div className="rounded-3xl p-4 sm:p-5 bg-[#140E29]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-[#C084FC]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Apple Activity Protocol
                </span>
              </div>
              <p className="text-[11px] text-[#9D94B8]">
                Concentric metric rings: Movement, Calorie Fuel & Hydration
              </p>
            </div>

            <AppleActivityRings
              questPct={questPct}
              caloriePct={calPct}
              waterPct={waterPct}
              size={120}
              showLabels={true}
            />
          </div>

          {/* Status Banner */}
          <HunterStatus />

          {/* Quick link to Solo Leveling Quests */}
          <div
            onClick={() => setShowQuestModal(true)}
            className="cursor-pointer rounded-2xl border border-[#A78BFA]/40 bg-gradient-to-r from-[#17112B] via-[#1D1438] to-[#120E24] p-3.5 shadow-[0_0_20px_rgba(167,139,250,0.2)] flex items-center justify-between active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C084FC]/20 border border-[#C084FC] flex items-center justify-center font-bold text-xs text-[#C084FC] shadow-[0_0_12px_rgba(192,132,252,0.4)] group-hover:scale-105 transition-transform">
                i
              </div>
              <div>
                <span className="font-cinzel font-bold text-xs tracking-wider text-[#F5F7FF] uppercase">
                  Daily Quest: Strange Training
                </span>
                <p className="text-[11px] text-[#9D94B8] font-mono mt-0.5">
                  Push-ups • Sit-ups • Squats • Running
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-[#27E58C] bg-[#27E58C]/15 px-2 py-0.5 rounded-full border border-[#27E58C]/40 whitespace-nowrap">
              +700 XP
            </span>
          </div>

          {/* Today's Generated Workout Widget */}
          <TodayWorkout />

          {/* Daily Quests Interactive Checklist */}
          <DailyQuests />

          {/* Nutrition Circular Status */}
          <NutritionStatus />

          {/* Physical Performance Benchmarks */}
          <PhysicalPerformance />

          {/* System Intelligence Broadcasts */}
          <SystemNotifications />
        </motion.div>
      )}
    </div>
  );
};
