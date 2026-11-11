import React from 'react';
import { useAppStore } from '../../../context/AppContext';
import { Card } from '../../ui/Card';
import { CircularProgress } from '../../ui/Progress';
import { Button } from '../../ui/Button';
import { Plus, Utensils, Droplet } from 'lucide-react';

export const NutritionStatus: React.FC = () => {
  const { userProfile, todayMeals, todayWaterMl, setCurrentTab } = useAppStore();

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = Math.round(todayMeals.reduce((sum, m) => sum + m.totalProtein, 0));
  const totalCarbs = Math.round(todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0));
  const totalFats = Math.round(todayMeals.reduce((sum, m) => sum + m.totalFats, 0));

  const calorieTarget = userProfile?.dailyCalorieTarget || 2100;
  const proteinTarget = userProfile?.dailyProteinTarget || 140;
  const waterTarget = userProfile?.dailyWaterTargetMl || 3000;

  const remainingCalories = Math.max(0, calorieTarget - totalCalories);
  const remainingProtein = Math.max(0, proteinTarget - totalProtein);

  const calPct = Math.round((totalCalories / calorieTarget) * 100);
  const proPct = Math.round((totalProtein / proteinTarget) * 100);
  const waterPct = Math.round((todayWaterMl / waterTarget) * 100);

  return (
    <Card
      title="NUTRITION STATUS"
      subtitle="Energy intake and amino substrate tracking"
      badge="LIVE LOG"
      glow="cyan"
      headerAction={
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setCurrentTab('nutrition')}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Log Meal
        </Button>
      }
    >
      {/* 3 Circular Rings: Calories, Protein, Water */}
      <div className="flex items-center justify-around py-3">
        {/* Calories Ring */}
        <div className="flex flex-col items-center">
          <CircularProgress
            value={calPct}
            size={88}
            strokeWidth={7}
            color="#725CFF"
            label={`${totalCalories}`}
            sublabel="kcal"
          />
          <span className="text-[11px] font-display font-semibold text-[#F5F7FF] mt-2">
            Calories
          </span>
          <span className="text-[10px] text-[#929DB5]">
            {remainingCalories} kcal left
          </span>
        </div>

        {/* Protein Ring */}
        <div className="flex flex-col items-center">
          <CircularProgress
            value={proPct}
            size={88}
            strokeWidth={7}
            color="#00D4FF"
            label={`${totalProtein}g`}
            sublabel="Protein"
          />
          <span className="text-[11px] font-display font-semibold text-[#F5F7FF] mt-2">
            Protein Target
          </span>
          <span className="text-[10px] text-[#00D4FF] font-medium">
            {remainingProtein}g remaining
          </span>
        </div>

        {/* Water Ring */}
        <div className="flex flex-col items-center">
          <CircularProgress
            value={waterPct}
            size={88}
            strokeWidth={7}
            color="#27E58C"
            label={`${(todayWaterMl / 1000).toFixed(1)}L`}
            sublabel="Hydration"
          />
          <span className="text-[11px] font-display font-semibold text-[#F5F7FF] mt-2">
            Water Intake
          </span>
          <span className="text-[10px] text-[#27E58C]">
            Target: {(waterTarget / 1000).toFixed(1)}L
          </span>
        </div>
      </div>

      {/* Macro Breakdown Bar */}
      <div className="mt-3 pt-3 border-t border-[#725CFF]/15 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-[#101626]">
          <span className="text-[10px] text-[#929DB5] block uppercase">Protein</span>
          <span className="font-display font-bold text-[#00D4FF]">{totalProtein}g</span>
        </div>
        <div className="p-2 rounded-xl bg-[#101626]">
          <span className="text-[10px] text-[#929DB5] block uppercase">Carbs</span>
          <span className="font-display font-bold text-[#FFB547]">{totalCarbs}g</span>
        </div>
        <div className="p-2 rounded-xl bg-[#101626]">
          <span className="text-[10px] text-[#929DB5] block uppercase">Fat</span>
          <span className="font-display font-bold text-[#FF5263]">{totalFats}g</span>
        </div>
        <div className="p-2 rounded-xl bg-[#101626]">
          <span className="text-[10px] text-[#929DB5] block uppercase">Water</span>
          <span className="font-display font-bold text-[#27E58C]">{(todayWaterMl / 1000).toFixed(1)}L</span>
        </div>
      </div>
    </Card>
  );
};

