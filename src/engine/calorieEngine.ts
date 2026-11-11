export interface CalorieProfile {
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  recommendedProteinGrams: number;
  recommendedCarbsGrams: number;
  recommendedFatsGrams: number;
  recommendedWaterMl: number;
  recommendedDailySteps: number;
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string = 'male'
): number {
  const isFemale = gender.toLowerCase() === 'female' || gender.toLowerCase() === 'woman';
  // Mifflin-St Jeor equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(isFemale ? base - 161 : base + 5);
}

export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  const factor = multipliers[activityLevel] || 1.375;
  return Math.round(bmr * factor);
}

export function calculateNutritionTargets(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active',
  goals: string[]
): CalorieProfile {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const wantsFatLoss = goals.some(g =>
    g.toLowerCase().includes('fat') ||
    g.toLowerCase().includes('lean') ||
    g.toLowerCase().includes('abs') ||
    g.toLowerCase().includes('facial')
  );

  const wantsMuscle = goals.some(g =>
    g.toLowerCase().includes('muscle') ||
    g.toLowerCase().includes('chest') ||
    g.toLowerCase().includes('arms') ||
    g.toLowerCase().includes('shoulders')
  );

  let targetCalories = tdee;
  if (wantsFatLoss && !wantsMuscle) {
    targetCalories = Math.round(tdee - 450); // Moderate healthy deficit
  } else if (wantsFatLoss && wantsMuscle) {
    targetCalories = Math.round(tdee - 250); // Body recomposition deficit
  } else if (wantsMuscle) {
    targetCalories = Math.round(tdee + 250); // Lean surplus
  }

  // Safety floor
  targetCalories = Math.max(1400, targetCalories);

  // Protein calculation: 1.8g - 2.2g per kg
  let proteinMultiplier = 1.8;
  if (wantsFatLoss && wantsMuscle) proteinMultiplier = 2.1;
  else if (wantsMuscle) proteinMultiplier = 2.0;
  else if (wantsFatLoss) proteinMultiplier = 1.9;

  const recommendedProteinGrams = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = recommendedProteinGrams * 4;

  // Fats: ~25% of total calories
  const fatCalories = targetCalories * 0.25;
  const recommendedFatsGrams = Math.round(fatCalories / 9);

  // Carbs: remainder of calories
  const remainingCalories = Math.max(200, targetCalories - (proteinCalories + fatCalories));
  const recommendedCarbsGrams = Math.round(remainingCalories / 4);

  // Hydration: 35ml to 45ml per kg bodyweight
  const recommendedWaterMl = Math.round(weightKg * 42);

  // Step target
  const recommendedDailySteps = 10000;

  return {
    bmr,
    tdee,
    recommendedCalories: targetCalories,
    recommendedProteinGrams,
    recommendedCarbsGrams,
    recommendedFatsGrams,
    recommendedWaterMl,
    recommendedDailySteps
  };
}

// MET definitions for walking
export const WALKING_METS = {
  slow: 3.0,     // 2.5 mph / 4.0 km/h
  normal: 3.5,   // 3.0 mph / 4.8 km/h
  brisk: 4.3,    // 3.8 mph / 6.0 km/h
  incline: 6.0,  // 3.5 mph at 6% grade
};

export function calculateWalkingCalories(
  weightKg: number,
  durationMinutes: number,
  speed: 'slow' | 'normal' | 'brisk' | 'incline' = 'normal'
): number {
  const met = WALKING_METS[speed];
  const hours = durationMinutes / 60;
  // Calories = MET * weight(kg) * duration(hours)
  return Math.round(met * weightKg * hours);
}

export function estimateWalkingForCalories(
  calories: number,
  weightKg: number
): {
  slowMinutes: number;
  normalMinutes: number;
  briskMinutes: number;
  inclineMinutes: number;
} {
  const calculate = (met: number) => {
    if (weightKg <= 0 || met <= 0) return 0;
    return Math.round((calories / (met * weightKg)) * 60);
  };

  return {
    slowMinutes: calculate(WALKING_METS.slow),
    normalMinutes: calculate(WALKING_METS.normal),
    briskMinutes: calculate(WALKING_METS.brisk),
    inclineMinutes: calculate(WALKING_METS.incline),
  };
}

