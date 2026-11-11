import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { parseNaturalLanguageMeal } from '../../data/foodDatabase';
import type { MealType, FoodItem } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getTodayDateString } from '../../db/database';
import { Sparkles, Trash2, Plus, Check } from 'lucide-react';

export const MealLogger: React.FC<{ onMealSaved?: () => void }> = ({ onMealSaved }) => {
  const { logMeal } = useAppStore();

  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [inputText, setInputText] = useState('');
  const [analyzedItems, setAnalyzedItems] = useState<FoodItem[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    const { items, unmatchedPhrases } = parseNaturalLanguageMeal(inputText);
    setAnalyzedItems(items);
    setUnmatched(unmatchedPhrases);
    setIsAnalyzed(true);
  };

  const handleUpdateItem = (id: string, field: keyof FoodItem, value: any) => {
    setAnalyzedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setAnalyzedItems(prev => prev.filter(item => item.id !== id));
  };

  const totalCalories = analyzedItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = Math.round(analyzedItems.reduce((sum, item) => sum + item.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(analyzedItems.reduce((sum, item) => sum + item.carbs, 0) * 10) / 10;
  const totalFats = Math.round(analyzedItems.reduce((sum, item) => sum + item.fats, 0) * 10) / 10;

  const handleSave = async () => {
    if (analyzedItems.length === 0) return;

    await logMeal({
      date: getTodayDateString(),
      mealType,
      rawText: inputText,
      items: analyzedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      createdAt: new Date().toISOString()
    });

    setInputText('');
    setAnalyzedItems([]);
    setIsAnalyzed(false);
    if (onMealSaved) onMealSaved();
  };

  return (
    <Card
      title="NUTRITION INTELLIGENCE ENGINE"
      subtitle="Natural language nutrient identification & macronutrient calculation"
      glow="cyan"
    >
      <div className="space-y-3.5">
        {/* Meal Type Pill Selector */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(['breakfast', 'lunch', 'dinner', 'snacks', 'supplements'] as MealType[]).map(t => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                mealType === t
                  ? 'bg-[#00D4FF] text-[#080B14] shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                  : 'bg-[#101626] text-[#929DB5] border border-[#725CFF]/20 hover:text-[#F5F7FF]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Natural Language Input */}
        <div>
          <textarea
            rows={3}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="e.g. 4 boiled eggs, 2 slices of brown bread, 1 cup curd and one banana"
            className="w-full bg-[#101626] border border-[#725CFF]/30 rounded-2xl p-3.5 text-xs text-[#F5F7FF] placeholder-[#929DB5]/60 outline-none focus:border-[#00D4FF] focus:shadow-[0_0_15px_rgba(0,212,255,0.25)] leading-relaxed"
          />
        </div>

        {/* Quick Example Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] text-[#929DB5]">
          <span className="shrink-0">Quick Fill:</span>
          <button
            onClick={() => setInputText('4 boiled eggs, 2 slices of brown bread and one banana')}
            className="px-2 py-0.5 rounded-lg bg-[#101626] border border-[#725CFF]/20 hover:text-[#00D4FF] shrink-0"
          >
            Eggs & Toast
          </button>
          <button
            onClick={() => setInputText('150g grilled chicken breast with 1 cup cooked white rice')}
            className="px-2 py-0.5 rounded-lg bg-[#101626] border border-[#725CFF]/20 hover:text-[#00D4FF] shrink-0"
          >
            Chicken & Rice
          </button>
          <button
            onClick={() => setInputText('1 scoop whey protein with 250ml milk and 1 banana')}
            className="px-2 py-0.5 rounded-lg bg-[#101626] border border-[#725CFF]/20 hover:text-[#00D4FF] shrink-0"
          >
            Whey Shake
          </button>
          <button
            onClick={() => setInputText('2 rotis with 1 katori dal and 100g paneer')}
            className="px-2 py-0.5 rounded-lg bg-[#101626] border border-[#725CFF]/20 hover:text-[#00D4FF] shrink-0"
          >
            Roti Dal Paneer
          </button>
        </div>

        {/* Analyze Button */}
        <Button
          variant="primary"
          glow
          size="md"
          onClick={handleAnalyze}
          className="w-full font-bold tracking-wider"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          ANALYZE INTAKE
        </Button>

        {/* Results Table */}
        {isAnalyzed && analyzedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#725CFF]/20 space-y-3">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#00D4FF] block">
              ESTIMATED NUTRITIONAL BREAKDOWN
            </span>

            <div className="space-y-2">
              {analyzedItems.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#101626] border border-[#725CFF]/20 flex items-center justify-between text-xs"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-[#F5F7FF] block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#929DB5]">
                      Qty: {item.quantity} {item.unit} {item.isEstimated && '(estimated)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="font-mono font-bold text-[#00D4FF] block">
                        {item.protein}g P
                      </span>
                      <span className="text-[10px] text-[#929DB5]">
                        {item.calories} kcal
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 rounded-lg text-[#929DB5] hover:text-[#FF5263]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="p-3 rounded-xl bg-[#151D30] border border-[#00D4FF]/30 flex items-center justify-between text-xs font-display">
              <span className="font-bold text-[#F5F7FF]">TOTAL MEAL SUBSTRATE</span>
              <div className="text-right">
                <span className="font-bold text-[#00D4FF] text-sm">{totalProtein}g Protein</span>
                <span className="text-[#929DB5] text-[10px] block">
                  {totalCalories} kcal • {totalCarbs}g C • {totalFats}g F
                </span>
              </div>
            </div>

            <p className="text-[10px] text-[#929DB5] italic leading-tight">
              Note: Values account for standard Indian serving sizes and cooking methods. Figures are reasonable scientific approximations.
            </p>

            <Button
              variant="cyan"
              size="md"
              glow
              onClick={handleSave}
              className="w-full font-bold tracking-wider"
            >
              <Check className="w-4 h-4 mr-2" />
              RECORD TO DAILY NUTRITION LOG
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

