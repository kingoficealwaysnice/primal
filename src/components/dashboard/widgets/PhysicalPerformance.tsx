import React from 'react';
import { useAppStore } from '../../../context/AppContext';
import { Card } from '../../ui/Card';
import { TrendingDown, Award, Footprints, Dumbbell } from 'lucide-react';

export const PhysicalPerformance: React.FC = () => {
  const { userProfile, todayWorkout } = useAppStore();

  if (!userProfile) return null;

  const currentWeight = userProfile.currentWeightKg;
  const targetWeight = userProfile.targetWeightKg;
  const weightDiff = Math.abs(currentWeight - targetWeight);

  const completedSets = todayWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  ) || 0;
  const totalSets = todayWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.length, 0
  ) || 0;
  const workoutPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <Card
      title="PHYSICAL PERFORMANCE BENCHMARKS"
      subtitle="Biometric adaptation and strength metrics"
      glow="none"
    >
      <div className="grid grid-cols-2 gap-2.5">
        {/* Weight Card */}
        <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/15">
          <div className="flex items-center justify-between text-[#929DB5] text-[11px] mb-1">
            <span>BODY MASS</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#00D4FF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg text-[#F5F7FF]">
              {currentWeight}
            </span>
            <span className="text-xs text-[#929DB5]">kg</span>
          </div>
          <span className="text-[10px] text-[#00D4FF] block mt-0.5 font-medium">
            Target: {targetWeight} kg ({weightDiff.toFixed(1)} kg left)
          </span>
        </div>

        {/* Body Fat */}
        <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/15">
          <div className="flex items-center justify-between text-[#929DB5] text-[11px] mb-1">
            <span>BODY FAT EST.</span>
            <span className="text-[10px] text-[#27E58C] font-mono">DEXA REF</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg text-[#F5F7FF]">
              {userProfile.currentBodyFat}
            </span>
            <span className="text-xs text-[#929DB5]">%</span>
          </div>
          <span className="text-[10px] text-[#27E58C] block mt-0.5 font-medium">
            Target: {userProfile.targetBodyFat}%
          </span>
        </div>

        {/* Push-up Strength */}
        <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/15">
          <div className="flex items-center justify-between text-[#929DB5] text-[11px] mb-1">
            <span>PUSH-UP MAX</span>
            <Award className="w-3.5 h-3.5 text-[#FFB547]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg text-[#F5F7FF]">
              {userProfile.initialPushups}
            </span>
            <span className="text-xs text-[#929DB5]">reps</span>
          </div>
          <span className="text-[10px] text-[#929DB5] block mt-0.5">
            Phase 1 Standard
          </span>
        </div>

        {/* Daily Walking & Workout */}
        <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/15">
          <div className="flex items-center justify-between text-[#929DB5] text-[11px] mb-1">
            <span>WORKOUT LOG</span>
            <Dumbbell className="w-3.5 h-3.5 text-[#725CFF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg text-[#00D4FF]">
              {workoutPct}%
            </span>
            <span className="text-xs text-[#929DB5]">today</span>
          </div>
          <span className="text-[10px] text-[#929DB5] block mt-0.5">
            {completedSets} of {totalSets} sets done
          </span>
        </div>
      </div>
    </Card>
  );
};

