import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { calculateWalkingCalories, WALKING_METS } from '../../engine/calorieEngine';
import { Footprints, Info } from 'lucide-react';

export const EnergyExpenditure: React.FC = () => {
  const { userProfile, todayMeals } = useAppStore();
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'brisk' | 'incline'>('normal');

  const weightKg = userProfile?.currentWeightKg || 75;
  const totalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);

  const cal30Min = calculateWalkingCalories(weightKg, 30, selectedSpeed);
  const cal45Min = calculateWalkingCalories(weightKg, 45, selectedSpeed);
  const cal60Min = calculateWalkingCalories(weightKg, 60, selectedSpeed);

  return (
    <Card
      title="ENERGY EXPENDITURE & WALKING ESTIMATION"
      subtitle="Physiological MET-based metabolic cost calculation"
      glow="none"
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#929DB5]">Today's Recorded Intake:</span>
          <span className="font-display font-bold text-[#00D4FF] text-sm">{totalCalories} kcal</span>
        </div>

        {/* Speed Selector */}
        <div>
          <label className="block text-[10px] font-display font-semibold uppercase tracking-wider text-[#929DB5] mb-1.5">
            Select Walking Intensity
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'slow', label: 'Slow (4 km/h)' },
              { id: 'normal', label: 'Normal (4.8 km/h)' },
              { id: 'brisk', label: 'Brisk (6 km/h)' },
              { id: 'incline', label: 'Incline (6% Grade)' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSpeed(s.id as any)}
                className={`py-2 px-1 rounded-xl text-[10px] font-display uppercase tracking-wider font-semibold border transition-all text-center ${
                  selectedSpeed === s.id
                    ? 'bg-[#00D4FF] text-[#080B14] border-[#00D4FF] shadow-sm'
                    : 'bg-[#101626] border-[#725CFF]/20 text-[#929DB5]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Walking Duration Estimates Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20">
            <span className="text-[10px] text-[#929DB5] block">30 MIN WALK</span>
            <span className="font-display font-bold text-base text-[#F5F7FF] mt-0.5 block">
              ~{cal30Min}
            </span>
            <span className="text-[10px] text-[#00D4FF]">kcal burned</span>
          </div>

          <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20">
            <span className="text-[10px] text-[#929DB5] block">45 MIN WALK</span>
            <span className="font-display font-bold text-base text-[#F5F7FF] mt-0.5 block">
              ~{cal45Min}
            </span>
            <span className="text-[10px] text-[#00D4FF]">kcal burned</span>
          </div>

          <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20">
            <span className="text-[10px] text-[#929DB5] block">60 MIN WALK</span>
            <span className="font-display font-bold text-base text-[#F5F7FF] mt-0.5 block">
              ~{cal60Min}
            </span>
            <span className="text-[10px] text-[#00D4FF]">kcal burned</span>
          </div>
        </div>

        {/* Essential Educational Disclaimer */}
        <div className="p-3 bg-[#101626] rounded-xl border border-[#725CFF]/20 flex items-start gap-2 text-xs">
          <Info className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#929DB5] leading-relaxed">
            Walking is physical baseline conditioning for lymphatic flow, insulin sensitivity, and cardiovascular health. It is not a tool to "punish" or "burn off" meals. Numbers are educational energy estimates.
          </p>
        </div>
      </div>
    </Card>
  );
};

