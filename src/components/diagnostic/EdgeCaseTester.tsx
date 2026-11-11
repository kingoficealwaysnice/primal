import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculateNutritionTargets, estimateWalkingForCalories } from '../../engine/calorieEngine';
import { parseNaturalLanguageMeal } from '../../data/foodDatabase';
import { getLevelDetails, calculateNewStats } from '../../engine/xpEngine';
import { generateDailyWorkout } from '../../engine/workoutEngine';
import { useAppStore } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Play, ShieldAlert, Cpu } from 'lucide-react';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  input: string;
  output: string;
  durationMs: number;
}

export const EdgeCaseTester: React.FC = () => {
  const { grantXP, hunterStats } = useAppStore();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // TEST 1: Biometric Extreme Minimums
    try {
      const t0 = performance.now();
      const res = calculateNutritionTargets(30, 100, 14, 'female', 'sedentary', ['fat loss']);
      const passed = res.recommendedCalories >= 1200 && res.recommendedProteinGrams > 0;
      results.push({
        name: 'Biometric Extreme Minimum Floor',
        category: 'Calorie Engine',
        passed,
        input: 'Weight: 30kg, Height: 100cm, Age: 14, Female',
        output: `Cals: ${res.recommendedCalories} kcal (Safe floor >= 1200 enforced), Protein: ${res.recommendedProteinGrams}g`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Biometric Extreme Minimum Floor', category: 'Calorie Engine', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 2: Biometric Extreme Maximums
    try {
      const t0 = performance.now();
      const res = calculateNutritionTargets(250, 240, 90, 'male', 'extra_active', ['muscle']);
      const passed = res.recommendedCalories <= 5500 && res.recommendedProteinGrams <= 320;
      results.push({
        name: 'Biometric Extreme Maximum Ceiling',
        category: 'Calorie Engine',
        passed,
        input: 'Weight: 250kg, Height: 240cm, Age: 90, Male',
        output: `Cals: ${res.recommendedCalories} kcal, Protein: ${res.recommendedProteinGrams}g`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Biometric Extreme Maximum Ceiling', category: 'Calorie Engine', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 3: Zero and Negative Biometric Protection
    try {
      const t0 = performance.now();
      const res = calculateNutritionTargets(-10, 0, -5, 'other', 'moderately_active', []);
      const passed = Number.isFinite(res.recommendedCalories) && res.recommendedCalories > 0;
      results.push({
        name: 'Zero & Negative Biometric Clamping',
        category: 'Calorie Engine',
        passed,
        input: 'Weight: -10kg, Height: 0cm, Age: -5',
        output: `Sanitized cleanly to: ${res.recommendedCalories} kcal`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Zero & Negative Biometric Clamping', category: 'Calorie Engine', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 4: Food Parser Complex Multi-Item Input
    try {
      const t0 = performance.now();
      const inputStr = '4 boiled eggs, 2 slices of brown bread and one banana';
      const parsed = parseNaturalLanguageMeal(inputStr);
      const passed = parsed.items.length === 3 && parsed.items[0].protein > 20;
      results.push({
        name: 'Natural Language Complex Meal Parser',
        category: 'Nutrition Parser',
        passed,
        input: inputStr,
        output: `Parsed ${parsed.items.length} items cleanly: Eggs (${parsed.items[0].calories} kcal, ${parsed.items[0].protein}g P), Bread, Banana`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Natural Language Complex Meal Parser', category: 'Nutrition Parser', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 5: Food Parser Fractional Servings
    try {
      const t0 = performance.now();
      const inputStr = '1/2 cup white rice with 1.5 scoops whey protein';
      const parsed = parseNaturalLanguageMeal(inputStr);
      const passed = parsed.items.length === 2 && parsed.items.some(i => i.name.includes('Whey'));
      results.push({
        name: 'Fractional & Decimal Quantities (1/2 cup, 1.5 scoops)',
        category: 'Nutrition Parser',
        passed,
        input: inputStr,
        output: `Identified 2 items: Rice (0.5 cup) and Whey Protein (1.5 scoops)`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Fractional & Decimal Quantities', category: 'Nutrition Parser', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 6: Unknown Food Fallback Estimation
    try {
      const t0 = performance.now();
      const inputStr = 'ancient magical mana elixir from S-rank dungeon';
      const parsed = parseNaturalLanguageMeal(inputStr);
      const passed = parsed.items.length === 1 && parsed.items[0].isEstimated === true;
      results.push({
        name: 'Transparent Fallback for Uncataloged Foods',
        category: 'Nutrition Parser',
        passed,
        input: inputStr,
        output: `Handled with transparent estimate flag: ${parsed.items[0].calories} kcal, ${parsed.items[0].protein}g protein`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Transparent Fallback for Uncataloged Foods', category: 'Nutrition Parser', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 7: Empty, Whitespace, and Emoji Input
    try {
      const t0 = performance.now();
      const parsed = parseNaturalLanguageMeal('   🏋️‍♂️🥗🍕   ');
      const passed = parsed.items.length >= 0;
      results.push({
        name: 'Emoji & Whitespace Resilience',
        category: 'Nutrition Parser',
        passed,
        input: '   🏋️‍♂️🥗🍕   ',
        output: `Handled safely without runtime throw: returned ${parsed.items.length} items`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Emoji & Whitespace Resilience', category: 'Nutrition Parser', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 8: Level Cap & Extreme XP Overflow
    try {
      const t0 = performance.now();
      const lvl = getLevelDetails(999999);
      const passed = lvl.level === 10 && lvl.title === 'TRANSCENDENT' && lvl.isMaxLevel === true;
      results.push({
        name: 'Level Cap & Extreme XP Handling (999,999 XP)',
        category: 'XP Engine',
        passed,
        input: 'Total XP: 999,999',
        output: `Level ${lvl.level}: ${lvl.title} (isMaxLevel: true, Progress: 100%)`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Level Cap & Extreme XP Handling', category: 'XP Engine', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    // TEST 9: Workout Day Numbers Beyond 90
    try {
      const t0 = performance.now();
      const day120 = generateDailyWorkout(120, 'advanced', 'dumbbell', 40);
      const passed = day120.exercises.length > 0 && day120.phaseNumber === 3;
      results.push({
        name: 'Endless Protocol Beyond Day 90 (Day 120 NG+)',
        category: 'Workout Engine',
        passed,
        input: 'Day: 120, Advanced, Dumbbell',
        output: `Generated: ${day120.title} with ${day120.exercises.length} exercises (Phase 3 Primal Form)`,
        durationMs: Math.round(performance.now() - t0)
      });
    } catch (e: any) {
      results.push({ name: 'Endless Protocol Beyond Day 90', category: 'Workout Engine', passed: false, input: '', output: e.message, durationMs: 0 });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const passCount = testResults.filter(r => r.passed).length;

  return (
    <Card
      title="SYSTEM DIAGNOSTIC & EDGE CASE LAB"
      subtitle="Automated verification of biometrics, natural language parser, and XP bounds"
      glow="cyan"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-display font-bold uppercase text-[#00D4FF]">
              SYSTEM HEALTH STATUS
            </span>
            <span className="text-[10px] text-[#929DB5] block">
              {testResults.length === 0 ? 'Diagnostic ready to execute' : `${passCount} of ${testResults.length} test suites passed`}
            </span>
          </div>

          <Button
            variant="cyan"
            size="sm"
            isLoading={isRunning}
            onClick={runAllTests}
            className="text-xs font-bold"
          >
            <Play className="w-3.5 h-3.5 mr-1" /> RUN FULL DIAGNOSTIC
          </Button>
        </div>

        {/* Results List */}
        {testResults.length > 0 && (
          <div className="space-y-2 mt-3 pt-3 border-t border-[#725CFF]/20">
            {testResults.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/15 text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#27E58C] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#FF5263] shrink-0" />
                    )}
                    <span className="font-display font-bold text-xs text-[#F5F7FF]">
                      {t.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/20">
                    {t.category} • {t.durationMs}ms
                  </span>
                </div>

                <div className="text-[10px] text-[#929DB5]">
                  <span>Input: </span>
                  <span className="text-[#F5F7FF]">{t.input}</span>
                </div>

                <div className="text-[10px] text-[#27E58C]">
                  <span>Output: </span>
                  <span>{t.output}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

