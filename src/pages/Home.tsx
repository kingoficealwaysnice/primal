import React, { useState } from 'react';
import { HunterStatus } from '../components/dashboard/widgets/HunterStatus';
import { HunterStatusWindow } from '../components/sololeveling/HunterStatusWindow';
import { SoloLevelingDailyQuestsView } from '../components/dashboard/widgets/SoloLevelingDailyQuestsView';
import { SoloLevelingQuestModal } from '../components/sololeveling/SoloLevelingQuestModal';
import { DailyQuests } from '../components/dashboard/widgets/DailyQuests';
import { TodayWorkout } from '../components/dashboard/widgets/TodayWorkout';
import { NutritionStatus } from '../components/dashboard/widgets/NutritionStatus';
import { PhysicalPerformance } from '../components/dashboard/widgets/PhysicalPerformance';
import { SystemNotifications } from '../components/dashboard/widgets/SystemNotifications';
import { Zap, ListChecks, LayoutDashboard } from 'lucide-react';

export const Home: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'quests' | 'status'>('quests');
  const [showQuestModal, setShowQuestModal] = useState(false);

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-2">
      {/* Solo Leveling Holographic Quest Modal */}
      <SoloLevelingQuestModal
        isOpen={showQuestModal}
        onClose={() => setShowQuestModal(false)}
      />

      {/* Mode Switcher: DAILY QUESTS (Screen 2) vs DASHBOARD vs STATUS HUD */}
      <div className="flex bg-[#140E26] p-1 rounded-2xl border border-[#A78BFA]/30 shadow-lg">
        <button
          onClick={() => setActiveView('quests')}
          className={`flex-1 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'quests'
              ? 'bg-gradient-to-r from-[#C084FC] to-[#7C3AED] text-white shadow-[0_0_15px_rgba(192,132,252,0.5)]'
              : 'text-[#9D94B8] hover:text-[#F5F7FF]'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          DAILY QUESTS
        </button>

        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex-1 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'dashboard'
              ? 'bg-[#725CFF] text-white shadow-sm'
              : 'text-[#9D94B8] hover:text-[#F5F7FF]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          OVERVIEW
        </button>

        <button
          onClick={() => setActiveView('status')}
          className={`flex-1 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'status'
              ? 'bg-[#00D4FF] text-[#080B14] shadow-[0_0_15px_rgba(0,212,255,0.4)]'
              : 'text-[#00D4FF] hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          STATUS HUD
        </button>
      </div>

      {/* VIEW 1: EXACT SOLO LEVELING DAILY QUESTS (SCREEN 2) */}
      {activeView === 'quests' && (
        <div className="animate-in fade-in duration-200">
          <SoloLevelingDailyQuestsView />
        </div>
      )}

      {/* VIEW 2: RPG SYSTEM STATUS HUD */}
      {activeView === 'status' && (
        <div className="animate-in fade-in duration-200">
          <HunterStatusWindow />
        </div>
      )}

      {/* VIEW 3: FULL COMPREHENSIVE FITNESS & NUTRITION DASHBOARD */}
      {activeView === 'dashboard' && (
        <div className="space-y-4 animate-in fade-in duration-200">
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
        </div>
      )}
    </div>
  );
};
