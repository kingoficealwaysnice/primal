import type { DailyPerformanceReport, UserProfile } from '../types';
import { db, getTodayDateString } from '../db/database';

export async function generateDailyReport(profile: UserProfile): Promise<DailyPerformanceReport> {
  const todayStr = getTodayDateString();

  // 1. Workout completion
  const workout = await db.workoutSessions.where('date').equals(todayStr).first();
  let workoutCompletionPct = 0;
  if (workout && workout.exercises.length > 0) {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
    workoutCompletionPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : (workout.completed ? 100 : 0);
  }

  // 2. Nutrition consumption
  const meals = await db.mealEntries.where('date').equals(todayStr).toArray();
  const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = Math.round(meals.reduce((sum, m) => sum + m.totalProtein, 0));
  
  const proteinTarget = profile.dailyProteinTarget || 140;
  const caloriesTarget = profile.dailyCalorieTarget || 2200;
  
  const proteinRatio = Math.min(1.2, totalProtein / proteinTarget);
  const calorieDiff = Math.abs(totalCalories - caloriesTarget);
  const calorieScore = Math.max(0, 1 - (calorieDiff / caloriesTarget));
  const nutritionCompletionPct = Math.round(((proteinRatio * 0.7) + (calorieScore * 0.3)) * 100);

  // 3. Water
  const waterEntries = await db.waterEntries.where('date').equals(todayStr).toArray();
  const waterConsumedMl = waterEntries.reduce((sum, w) => sum + w.amountMl, 0);
  const waterTargetMl = profile.dailyWaterTargetMl || 3000;

  // 4. Skincare
  const skincare = await db.skincareLogs.where('date').equals(todayStr).first();
  const skincareMorning = skincare?.morningCompleted || false;
  const skincareEvening = skincare?.eveningCompleted || false;

  // 5. Sleep
  const sleep = await db.sleepEntries.where('date').equals(todayStr).first();
  const sleepHours = sleep?.durationHours || 0;

  // 6. Quests and daily XP
  const quests = await db.dailyQuests.where('date').equals(todayStr).toArray();
  const completedQuests = quests.filter(q => q.completed);
  const dailyXPEarned = completedQuests.reduce((sum, q) => sum + q.xpReward, 0);

  // 7. Calculate overall average
  const overallScore = Math.round(
    (workoutCompletionPct * 0.35) +
    (nutritionCompletionPct * 0.35) +
    (Math.min(100, (waterConsumedMl / waterTargetMl) * 100) * 0.15) +
    ((skincareMorning && skincareEvening ? 100 : skincareMorning || skincareEvening ? 50 : 0) * 0.15)
  );

  let systemMessage = '';
  if (overallScore >= 90) {
    systemMessage = 'EXCEPTIONAL HUNTER DISCIPLINE. Cellular adaptation is peaking. Your evolution accelerates tomorrow.';
  } else if (overallScore >= 75) {
    systemMessage = 'SOLID EXECUTION. The daily grind strengthens your physical foundation. Maintain this streak.';
  } else if (overallScore >= 50) {
    systemMessage = 'SYSTEM ADAPTATION IN PROGRESS. You completed core objectives, but untapped potential remains. Rise higher tomorrow.';
  } else {
    systemMessage = 'THE SYSTEM DEMANDS GREATER RESOLVE. Regroup, hydrate, and prepare to reclaim your discipline at dawn.';
  }

  const report: DailyPerformanceReport = {
    date: todayStr,
    dayNumber: profile.currentDay || 1,
    workoutCompletionPct,
    nutritionCompletionPct,
    proteinConsumed: totalProtein,
    proteinTarget,
    caloriesConsumed: totalCalories,
    caloriesTarget,
    waterConsumedMl,
    waterTargetMl,
    stepsWalked: profile.dailyWalkingStepsTarget, // tracked or estimated
    stepsTarget: profile.dailyWalkingStepsTarget,
    skincareMorning,
    skincareEvening,
    sleepHours,
    dailyXPEarned,
    systemMessage
  };

  await db.dailyReports.put(report);
  return report;
}

