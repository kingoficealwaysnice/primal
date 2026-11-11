import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { MealLogger } from '../components/nutrition/MealLogger';
import { EnergyExpenditure } from '../components/nutrition/EnergyExpenditure';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CircularProgress, LinearProgress } from '../components/ui/Progress';
import { FOOD_DATABASE } from '../data/foodDatabase';
import {
  Utensils,
  Plus,
  Droplet,
  Trash2,
  Search,
  BookOpen,
  CheckCircle2,
  Flame
} from 'lucide-react';

export const Nutrition: React.FC = () => {
  const {
    userProfile,
    todayMeals,
    todayWaterMl,
    logWaterIntake,
    removeMeal
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'today' | 'log' | 'database' | 'water'>('today');
  const [foodSearch, setFoodSearch] = useState('');
  const [customWater, setCustomWater] = useState('');

  const calorieTarget = userProfile?.dailyCalorieTarget || 2100;
  const proteinTarget = userProfile?.dailyProteinTarget || 140;
  const waterTarget = userProfile?.dailyWaterTargetMl || 3000;

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = Math.round(todayMeals.reduce((sum, m) => sum + m.totalProtein, 0));
  const totalCarbs = Math.round(todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0));
  const totalFats = Math.round(todayMeals.reduce((sum, m) => sum + m.totalFats, 0));

  const remainingCal = Math.max(0, calorieTarget - totalCalories);
  const remainingPro = Math.max(0, proteinTarget - totalProtein);

  // Group meals by type
  const mealSections = ['breakfast', 'lunch', 'dinner', 'snacks', 'supplements'] as const;

  const filteredFoods = FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    f.aliases.some(a => a.toLowerCase().includes(foodSearch.toLowerCase()))
  );

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4 pt-3 space-y-4">
      {/* Top Tabs */}
      <div className="flex bg-[#151D30] p-1 rounded-2xl border border-[#725CFF]/20">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'today'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          TODAY'S LOG
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'log'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          LOG MEAL
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'database'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          FOOD ARCHIVE
        </button>
        <button
          onClick={() => setActiveTab('water')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'water'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          HYDRATION
        </button>
      </div>

      {/* TODAY TAB */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          {/* Main Substrate Status Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-[#151D30] to-[#101626] border border-[#725CFF]/35 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-[#00D4FF] font-semibold">
                MACRONUTRIENT BALANCE
              </span>
              <span className="text-xs font-mono text-[#27E58C]">
                {Math.round((totalCalories / calorieTarget) * 100)}% CONSUMED
              </span>
            </div>

            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <span className="text-[10px] text-[#929DB5] block">CALORIES</span>
                <span className="font-display font-black text-2xl text-[#F5F7FF]">
                  {totalCalories}
                </span>
                <span className="text-[10px] text-[#00D4FF]">
                  / {calorieTarget} kcal
                </span>
              </div>

              <div className="w-px h-10 bg-[#725CFF]/20" />

              <div className="text-center">
                <span className="text-[10px] text-[#929DB5] block">PROTEIN</span>
                <span className="font-display font-black text-2xl text-[#00D4FF]">
                  {totalProtein}g
                </span>
                <span className="text-[10px] text-[#27E58C]">
                  / {proteinTarget}g ({remainingPro}g left)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#725CFF]/15 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#101626]">
                <span className="text-[10px] text-[#929DB5] block">Carbs</span>
                <span className="font-bold text-[#FFB547]">{totalCarbs}g</span>
              </div>
              <div className="p-2 rounded-xl bg-[#101626]">
                <span className="text-[10px] text-[#929DB5] block">Fats</span>
                <span className="font-bold text-[#FF5263]">{totalFats}g</span>
              </div>
              <div className="p-2 rounded-xl bg-[#101626]">
                <span className="text-[10px] text-[#929DB5] block">Hydration</span>
                <span className="font-bold text-[#27E58C]">{(todayWaterMl / 1000).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          {/* Logged Meal Sections */}
          <div className="space-y-3">
            {mealSections.map(section => {
              const sectionMeals = todayMeals.filter(m => m.mealType === section);
              const sectionCals = sectionMeals.reduce((sum, m) => sum + m.totalCalories, 0);
              const sectionPro = Math.round(sectionMeals.reduce((sum, m) => sum + m.totalProtein, 0));

              return (
                <Card
                  key={section}
                  title={section.toUpperCase()}
                  subtitle={`${sectionCals} kcal • ${sectionPro}g Protein`}
                  headerAction={
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveTab('log')}
                      className="text-xs text-[#00D4FF]"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  }
                >
                  {sectionMeals.length === 0 ? (
                    <div className="py-2 text-[#929DB5] text-xs italic">
                      No items recorded for {section}.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sectionMeals.map(meal => (
                        <div
                          key={meal.id}
                          className="p-2.5 rounded-xl bg-[#101626] border border-[#725CFF]/15 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-[#F5F7FF] block">
                              {meal.items.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                            </span>
                            <span className="text-[10px] text-[#929DB5]">
                              {meal.totalCalories} kcal • {meal.totalProtein}g Protein • {meal.totalCarbs}g C • {meal.totalFats}g F
                            </span>
                          </div>

                          <button
                            onClick={() => meal.id && removeMeal(meal.id)}
                            className="p-1 text-[#929DB5] hover:text-[#FF5263]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Energy Expenditure Card */}
          <EnergyExpenditure />
        </div>
      )}

      {/* LOG MEAL TAB */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          <MealLogger onMealSaved={() => setActiveTab('today')} />
        </div>
      )}

      {/* FOOD ARCHIVE TAB */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <Input
            placeholder="Search food database (e.g. Paneer, Soya chunks, Eggs, Dosa)..."
            value={foodSearch}
            onChange={e => setFoodSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />

          <div className="space-y-2.5">
            {filteredFoods.slice(0, 30).map(food => (
              <Card
                key={food.id}
                title={food.name}
                subtitle={`Serving: ${food.servingSize} ${food.servingUnit}`}
                badge={food.category}
              >
                <div className="grid grid-cols-4 gap-2 text-center text-xs mt-1">
                  <div className="p-1.5 rounded-lg bg-[#101626]">
                    <span className="text-[9px] text-[#929DB5] block">Calories</span>
                    <span className="font-bold text-[#F5F7FF]">{food.caloriesPerServing}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#101626]">
                    <span className="text-[9px] text-[#929DB5] block">Protein</span>
                    <span className="font-bold text-[#00D4FF]">{food.proteinPerServing}g</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#101626]">
                    <span className="text-[9px] text-[#929DB5] block">Carbs</span>
                    <span className="font-bold text-[#FFB547]">{food.carbsPerServing}g</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#101626]">
                    <span className="text-[9px] text-[#929DB5] block">Fats</span>
                    <span className="font-bold text-[#FF5263]">{food.fatsPerServing}g</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* HYDRATION TAB */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          <Card
            title="CELLULAR HYDRATION TRACKER"
            subtitle="Optimal fluid balance for performance and bloat reduction"
            glow="cyan"
          >
            <div className="flex flex-col items-center py-4">
              <CircularProgress
                value={Math.round((todayWaterMl / waterTarget) * 100)}
                size={140}
                strokeWidth={10}
                color="#27E58C"
                label={`${(todayWaterMl / 1000).toFixed(2)}L`}
                sublabel={`Goal: ${(waterTarget / 1000).toFixed(1)}L`}
              />

              <div className="mt-6 w-full space-y-2.5">
                <span className="text-xs font-display font-semibold uppercase tracking-wider text-[#929DB5] block text-center">
                  Quick Hydration Log
                </span>

                <div className="grid grid-cols-4 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => logWaterIntake(250)}
                  >
                    +250 ml
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => logWaterIntake(500)}
                  >
                    +500 ml
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => logWaterIntake(750)}
                  >
                    +750 ml
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => logWaterIntake(1000)}
                  >
                    +1.0 L
                  </Button>
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Custom ml (e.g. 350)"
                    type="number"
                    value={customWater}
                    onChange={e => setCustomWater(e.target.value)}
                  />
                  <Button
                    variant="cyan"
                    onClick={() => {
                      const amount = parseInt(customWater);
                      if (amount > 0) {
                        logWaterIntake(amount);
                        setCustomWater('');
                      }
                    }}
                  >
                    Log
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

