import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../context/AppContext';
import { ChevronRight, Zap, Check, Plus, Sparkles } from 'lucide-react';
import { SoloLevelingQuestModal } from '../../sololeveling/SoloLevelingQuestModal';
import { getSavedSoloLevelingQuests } from '../../../services/persistenceService';

export const SoloLevelingDailyQuestsView: React.FC = () => {
  const { userProfile } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state from persistent storage
  const [pushups, setPushups] = useState<number>(() => getSavedSoloLevelingQuests().pushups);
  const [situps, setSitups] = useState<number>(() => getSavedSoloLevelingQuests().situps);
  const [squats, setSquats] = useState<number>(() => getSavedSoloLevelingQuests().squats);
  const [runningKm, setRunningKm] = useState<number>(() => getSavedSoloLevelingQuests().runningKm);

  // Re-read storage whenever modal closes
  useEffect(() => {
    if (!isModalOpen) {
      const q = getSavedSoloLevelingQuests();
      setPushups(q.pushups);
      setSitups(q.situps);
      setSquats(q.squats);
      setRunningKm(q.runningKm);
    }
  }, [isModalOpen]);

  // Tasks in PLAN vs COMPLETED
  const allTasks = [
    {
      id: 'pushups',
      name: 'Push-ups',
      subtitle: 'Daily Quest',
      current: pushups,
      target: 100,
      unit: '',
      isCompleted: pushups >= 100
    },
    {
      id: 'situps',
      name: 'Sit-ups',
      subtitle: 'Daily Quest',
      current: situps,
      target: 100,
      unit: '',
      isCompleted: situps >= 100
    },
    {
      id: 'squats',
      name: 'Squats',
      subtitle: 'Daily Quest',
      current: squats,
      target: 100,
      unit: '',
      isCompleted: squats >= 100
    },
    {
      id: 'running',
      name: 'Running',
      subtitle: 'Daily Quest',
      current: runningKm,
      target: 10,
      unit: 'km',
      isCompleted: runningKm >= 10
    },
    {
      id: 'diamond-pushups',
      name: 'Diamond Push-ups',
      subtitle: 'Personal Added',
      current: 100,
      target: 100,
      unit: '',
      isCompleted: true
    }
  ];

  const planTasks = allTasks.filter(t => !t.isCompleted);
  const completedTasks = allTasks.filter(t => t.isCompleted);

  return (
    <div className="w-full space-y-4">
      {/* Holographic Quest Info Modal */}
      <SoloLevelingQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Top Lightning Z Emblem */}
      <div className="flex justify-center pt-1 pb-1">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-10 h-10 bg-[#C084FC]/30 rounded-full blur-md animate-pulse" />
          <svg
            className="w-7 h-7 text-[#C084FC] relative z-10 drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>

      {/* Header: DAILY QUESTS > */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between cursor-pointer group select-none px-1"
      >
        <div className="flex items-center gap-1.5">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.18em] text-[#F5F7FF] uppercase drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">
            DAILY QUESTS
          </h2>
          <ChevronRight className="w-5 h-5 text-[#C084FC] group-hover:translate-x-1 transition-transform" />
        </div>
        <span className="text-[11px] font-mono text-[#A78BFA] bg-[#C084FC]/10 px-2.5 py-0.5 rounded-full border border-[#C084FC]/30">
          SYSTEM ACTIVE
        </span>
      </div>

      {/* Strange Training Card (Click to open Holographic Quest Info) */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer relative overflow-hidden rounded-2xl border border-[#A78BFA]/30 bg-gradient-to-r from-[#17112B] via-[#1D1438] to-[#120E24] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(167,139,250,0.15)] hover:border-[#C084FC]/60 transition-all active:scale-[0.99] group"
      >
        {/* Subtle glow aura */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#C084FC]/20 rounded-full blur-2xl group-hover:bg-[#C084FC]/35 transition-all" />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-[#F5F7FF] tracking-wide group-hover:text-[#C084FC] transition-colors">
              Strange Training
            </h3>
            <p className="text-xs text-[#9D94B8] font-mono mt-0.5">
              4 Tasks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#27E58C] bg-[#27E58C]/15 px-2.5 py-1 rounded-full border border-[#27E58C]/40">
              +700 XP
            </span>
            <div className="w-8 h-8 rounded-full bg-[#C084FC]/20 border border-[#C084FC]/50 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* PLAN SECTION */}
      {planTasks.length > 0 && (
        <div className="space-y-2 pt-1">
          <h3 className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#C084FC] uppercase px-1">
            PLAN
          </h3>

          <div className="space-y-2">
            {planTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer rounded-xl border border-white/5 bg-[#17112B]/75 hover:bg-[#1D1438] hover:border-[#C084FC]/30 p-3.5 flex items-center justify-between transition-all active:scale-[0.99] shadow-sm"
              >
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F7FF]">
                    {task.name}
                  </h4>
                  <p className="text-xs text-[#9D94B8] mt-0.5">
                    {task.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#C084FC] tracking-wider">
                    [{task.current} / {task.target}{task.unit}]
                  </span>
                  <div className="w-5 h-5 rounded border border-[#C084FC]/40 bg-[#120E24] flex items-center justify-center" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLETED SECTION */}
      {completedTasks.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#A78BFA] uppercase px-1">
            COMPLETED
          </h3>

          <div className="space-y-2">
            {completedTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer rounded-xl border border-[#27E58C]/20 bg-[#120E24]/60 p-3.5 flex items-center justify-between transition-all"
              >
                <div>
                  <h4 className="text-sm font-medium text-[#9D94B8] line-through">
                    {task.name}
                  </h4>
                  <p className="text-xs text-[#6F6688] mt-0.5">
                    {task.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#27E58C] tracking-wider">
                    [{task.current} / {task.target}{task.unit}]
                  </span>
                  <div className="w-5 h-5 rounded border border-[#27E58C] bg-[#27E58C] text-[#080B14] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

