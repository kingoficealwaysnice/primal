import React, { useState } from 'react';
import { HunterStatus } from '../components/dashboard/widgets/HunterStatus';
import { HunterStatusWindow } from '../components/sololeveling/HunterStatusWindow';
import { SoloLevelingQuestModal } from '../components/sololeveling/SoloLevelingQuestModal';
import { DailyQuests } from '../components/dashboard/widgets/DailyQuests';
import { TodayWorkout } from '../components/dashboard/widgets/TodayWorkout';
import { NutritionStatus } from '../components/dashboard/widgets/NutritionStatus';
import { PhysicalPerformance } from '../components/dashboard/widgets/PhysicalPerformance';
import { SystemNotifications } from '../components/dashboard/widgets/SystemNotifications';
import { Zap, ShieldCheck } from 'lucide-react';

export const Home: React.FC = () => {
  const [showStatusWindow, setShowStatusWindow] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* Solo Leveling Holographic Quest Modal */}
      <SoloLevelingQuestModal
        isOpen={showQuestModal}
        onClose={() => setShowQuestModal(false)}
      />

      {/* Mode Switcher: Standard Overview vs RPG System Status */}
      <div className="flex bg-[#151D30] p-1 rounded-2xl border border-[#725CFF]/20">
        <button
          onClick={() => setShowStatusWindow(false)}
          className={`flex-1 py-1.5 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            !showStatusWindow
              ? 'bg-[#725CFF] text-white shadow-sm'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          HUNTER DASHBOARD
        </button>
        <button
          onClick={() => setShowStatusWindow(true)}
          className={`flex-1 py-1.5 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 ${
            showStatusWindow
              ? 'bg-[#00D4FF] text-[#080B14] shadow-[0_0_15px_rgba(0,212,255,0.4)]'
              : 'text-[#00D4FF] hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          SYSTEM STATUS HUD
        </button>
      </div>

      {/* 1. Status Banner or RPG Status Window */}
      {showStatusWindow ? (
        <HunterStatusWindow />
      ) : (
        <HunterStatus />
      )}

      {/* 2. Iconic Solo Leveling Holographic Quest Hero Card */}
      <div
        onClick={() => setShowQuestModal(true)}
        className="cursor-pointer rounded-2xl border-2 border-[#00D4FF] bg-gradient-to-r from-[#00D4FF]/10 via-[#101626] to-[#725CFF]/15 p-4 shadow-[0_0_25px_rgba(0,212,255,0.25)] flex items-center justify-between active:scale-[0.98] transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF] flex items-center justify-center font-bold text-sm text-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.4)] group-hover:scale-105 transition-transform">
            !
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-widest text-[#00D4FF] uppercase text-glow-cyan">
                QUEST INFO: STRENGTH TRAINING
              </span>
            </div>
            <p className="text-[11px] text-[#929DB5] mt-0.5">
              Push-ups [100] • Sit-ups [100] • Squats [100] • Running [10km]
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-[#27E58C] bg-[#27E58C]/15 px-2.5 py-1 rounded-full border border-[#27E58C]/40 whitespace-nowrap">
          +700 XP REWARD
        </span>
      </div>

      {/* 3. Today's Workout Widget */}
      <TodayWorkout />

      {/* 4. Daily Quests Interactive Checklist */}
      <DailyQuests />

      {/* 5. Nutrition Circular Status */}
      <NutritionStatus />

      {/* 6. Physical Performance Benchmarks */}
      <PhysicalPerformance />

      {/* 7. System Intelligence Broadcasts */}
      <SystemNotifications />
    </div>
  );
};
