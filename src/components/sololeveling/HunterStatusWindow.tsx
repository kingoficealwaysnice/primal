import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../context/AppContext';
import { getUserRPGAttributes, saveUserRPGAttributes } from '../../services/multiUserService';
import { Shield, Zap, Heart, Activity, Award, Plus, Sparkles } from 'lucide-react';

export const HunterStatusWindow: React.FC = () => {
  const { hunterStats, userProfile, todayWaterMl, todayWorkout, activeUser } = useAppStore();
  const currentUid = activeUser?.id || 'usr_primary';

  // RPG Attributes state (encapsulated per user)
  const [attrs, setAttrs] = useState(() => getUserRPGAttributes(currentUid));

  useEffect(() => {
    setAttrs(getUserRPGAttributes(currentUid));
  }, [currentUid]);

  const { str, agi, vit, int, sen, availablePoints, jobTitle, titleName } = attrs;

  // Calculate dynamic HP / MP / Fatigue
  const level = hunterStats?.level || 1;
  const maxHP = 10000 + (level * 1500) + (vit * 80);
  const maxMP = 1000 + (level * 300) + (int * 40);

  // Fatigue is 0% to 100% depending on completed sets today vs rest
  const completedSets = todayWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  ) || 0;
  const currentFatigue = Math.min(100, Math.round(completedSets * 4));

  const allocatePoint = (stat: 'str' | 'agi' | 'vit' | 'int' | 'sen') => {
    if (availablePoints <= 0) return;
    const nextPoints = availablePoints - 1;
    const updated = {
      ...attrs,
      [stat]: attrs[stat] + 1,
      availablePoints: nextPoints
    };
    setAttrs(updated);
    saveUserRPGAttributes(currentUid, updated);
  };

  return (
    <div className="relative rounded-3xl border-2 border-[#00D4FF]/60 bg-[#080B14]/95 p-5 text-[#F5F7FF] shadow-[0_0_35px_rgba(0,212,255,0.25)] overflow-hidden">
      {/* Sci-Fi Decorative Corner Brackets */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#00D4FF]" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#00D4FF]" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#00D4FF]" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#00D4FF]" />

      {/* STATUS Header (Word for word Image 2) */}
      <div className="text-center mb-3">
        <h2 className="font-display font-black text-2xl tracking-[0.25em] uppercase text-[#F5F7FF] text-glow-cyan">
          STATUS
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent mx-auto mt-1" />
      </div>

      {/* Level, Job, Title Row */}
      <div className="grid grid-cols-2 gap-3 my-3 p-3 rounded-2xl bg-[#101626] border border-[#00D4FF]/25 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#151D30] border border-[#00D4FF] flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <span className="font-display font-black text-lg text-[#00D4FF]">{level}</span>
            <span className="text-[9px] uppercase text-[#929DB5]">LEVEL</span>
          </div>
          <div>
            <span className="text-[10px] text-[#929DB5] block">NAME</span>
            <span className="font-display font-bold text-sm text-[#F5F7FF] uppercase">
              {userProfile?.fullName || 'HUNTER'}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-right">
          <div>
            <span className="text-[10px] text-[#929DB5]">Job: </span>
            <span className="font-bold text-[#00D4FF]">{jobTitle}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#929DB5]">Title: </span>
            <span className="font-bold text-[#27E58C] text-[11px] block truncate">{titleName}</span>
          </div>
        </div>
      </div>

      {/* HP, MP & Fatigue Gauges */}
      <div className="space-y-2 my-3 text-xs font-mono">
        {/* HP */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#FF5263] font-bold">HP</span>
            <span className="text-[#F5F7FF]">{maxHP.toLocaleString()} / {maxHP.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#101626] border border-[#FF5263]/30 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#FF5263] to-[#FF7582] shadow-[0_0_10px_#FF5263]" />
          </div>
        </div>

        {/* MP */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#00D4FF] font-bold">MP</span>
            <span className="text-[#F5F7FF]">{maxMP.toLocaleString()} / {maxMP.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#101626] border border-[#00D4FF]/30 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#00D4FF] to-[#0099FF] shadow-[0_0_10px_#00D4FF]" />
          </div>
        </div>

        {/* Fatigue */}
        <div>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-[#FFB547] font-bold">FATIGUE</span>
            <span className="text-[#FFB547]">{currentFatigue}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#101626] border border-[#FFB547]/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#27E58C] to-[#FFB547] transition-all duration-300"
              style={{ width: `${currentFatigue}%` }}
            />
          </div>
        </div>
      </div>

      {/* Attributes & Point Allocation Grid */}
      <div className="mt-4 pt-3 border-t border-[#00D4FF]/25">
        <div className="flex items-center justify-between text-xs font-mono mb-2.5">
          <span className="text-[#929DB5] uppercase tracking-wider">ATTRIBUTES</span>
          <span className="text-[#00D4FF] font-bold bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/30">
            Available Points: {availablePoints}
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          {[
            { id: 'str', label: 'STRENGTH (STR)', val: str },
            { id: 'agi', label: 'AGILITY (AGI)', val: agi },
            { id: 'vit', label: 'VITALITY (VIT)', val: vit },
            { id: 'int', label: 'INTELLIGENCE (INT)', val: int },
            { id: 'sen', label: 'SENSE (SEN)', val: sen },
          ].map(stat => (
            <div
              key={stat.id}
              className="p-2 rounded-xl bg-[#101626] border border-[#725CFF]/20 flex items-center justify-between"
            >
              <span className="text-[#929DB5] font-semibold">{stat.label}</span>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-sm text-[#F5F7FF]">{stat.val}</span>
                <button
                  onClick={() => allocatePoint(stat.id as any)}
                  disabled={availablePoints <= 0}
                  className="w-6 h-6 rounded-lg bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] flex items-center justify-center font-bold hover:bg-[#00D4FF] hover:text-black disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

