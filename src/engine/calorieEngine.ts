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

export function sanitizeBiometrics(weightKg: number, heightCm: number, age: number): {
  weight: number;
  height: number;
  age: number;
} {
  const safeWeight = Number.isFinite(weightKg) && weightKg > 0 ? Math.min(350, Math.max(30, weightKg)) : 70;
  const safeHeight = Number.isFinite(heightCm) && heightCm > 0 ? Math.min(270, Math.max(100, heightCm)) : 175;
  const safeAge = Number.isFinite(age) && age > 0 ? Math.min(110, Math.max(13, age)) : 25;
  return { weight: safeWeight, height: safeHeight, age: safeAge };
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string = 'male'
): number {
  const { weight, height, age: safeAge } = sanitizeBiometrics(weightKg, heightCm, age);
  const isFemale = typeof gender === 'string' && (gender.toLowerCase().includes('female') || gender.toLowerCase().includes('woman'));
  // Mifflin-St Jeor equation with absolute bounds
  const base = 10 * weight + 6.25 * height - 5 * safeAge;
  const calculated = Math.round(isFemale ? base - 161 : base + 5);
  return Math.max(900, Math.min(4000, calculated));
}

export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
): number {
  const safeBmr = Number.isFinite(bmr) && bmr > 0 ? bmr : 1600;
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  const factor = multipliers[activityLevel] || 1.375;
  return Math.round(safeBmr * factor);
}

export function calculateNutritionTargets(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string = 'male',
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active' = 'moderately_active',
  goals: string[] = []
): CalorieProfile {
  const { weight, height, age: safeAge } = sanitizeBiometrics(weightKg, heightCm, age);
  const bmr = calculateBMR(weight, height, safeAge, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const safeGoals = Array.isArray(goals) ? goals : [];
  const wantsFatLoss = safeGoals.some(g =>
    typeof g === 'string' && (
      g.toLowerCase().includes('fat') ||
      g.toLowerCase().includes('lean') ||
      g.toLowerCase().includes('abs') ||
      g.toLowerCase().includes('facial')
    )
  );

  const wantsMuscle = safeGoals.some(g =>
    typeof g === 'string' && (
      g.toLowerCase().includes('muscle') ||
      g.toLowerCase().includes('chest') ||
      g.toLowerCase().includes('arms') ||
      g.toLowerCase().includes('shoulders')
    )
  );

  let targetCalories = tdee;
  if (wantsFatLoss && !wantsMuscle) {
    targetCalories = Math.round(tdee - 450); // Moderate healthy deficit
  } else if (wantsFatLoss && wantsMuscle) {
    targetCalories = Math.round(tdee - 250); // Body recomposition deficit
  } else if (wantsMuscle) {
    targetCalories = Math.round(tdee + 250); // Lean surplus
  }

  // Safety floor based on gender and physiology
  const isFemale = typeof gender === 'string' && (gender.toLowerCase().includes('female') || gender.toLowerCase().includes('woman'));
  const absoluteFloor = isFemale ? 1200 : 1400;
  targetCalories = Math.max(absoluteFloor, Math.min(5500, targetCalories));

  // Protein calculation: 1.8g - 2.2g per kg (clamped to safe thresholds)
  let proteinMultiplier = 1.8;
  if (wantsFatLoss && wantsMuscle) proteinMultiplier = 2.1;
  else if (wantsMuscle) proteinMultiplier = 2.0;
  else if (wantsFatLoss) proteinMultiplier = 1.9;

  const recommendedProteinGrams = Math.min(320, Math.max(60, Math.round(weight * proteinMultiplier)));
  const proteinCalories = recommendedProteinGrams * 4;

  // Fats: ~25% of total calories (minimum 35g for hormonal health)
  const fatCalories = targetCalories * 0.25;
  const recommendedFatsGrams = Math.min(180, Math.max(35, Math.round(fatCalories / 9)));
  const actualFatCalories = recommendedFatsGrams * 9;

  // Carbs: remainder of calories
  const remainingCalories = Math.max(200, targetCalories - (proteinCalories + actualFatCalories));
  const recommendedCarbsGrams = Math.max(50, Math.round(remainingCalories / 4));

  // Hydration: 35ml to 45ml per kg bodyweight (clamped between 2000ml and 6000ml)
  const recommendedWaterMl = Math.min(6000, Math.max(2000, Math.round(weight * 42)));

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
  const safeWeight = Number.isFinite(weightKg) && weightKg > 0 ? weightKg : 70;
  const safeDuration = Number.isFinite(durationMinutes) && durationMinutes > 0 ? Math.min(720, durationMinutes) : 0;
  const met = WALKING_METS[speed] || WALKING_METS.normal;
  const hours = safeDuration / 60;
  return Math.round(met * safeWeight * hours);
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
  const safeWeight = Number.isFinite(weightKg) && weightKg > 0 ? weightKg : 70;
  const safeCalories = Number.isFinite(calories) && calories > 0 ? calories : 0;

  const calculate = (met: number) => {
    if (safeWeight <= 0 || met <= 0 || safeCalories <= 0) return 0;
    return Math.min(720, Math.round((safeCalories / (met * safeWeight)) * 60));
  };

  return {
    slowMinutes: calculate(WALKING_METS.slow),
    normalMinutes: calculate(WALKING_METS.normal),
    briskMinutes: calculate(WALKING_METS.brisk),
    inclineMinutes: calculate(WALKING_METS.incline),
  };
}
