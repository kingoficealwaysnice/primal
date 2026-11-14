export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'bodyweight' | 'dumbbells' | 'bands' | 'gym';

export interface DumbbellConfig {
  hasAdjustable: boolean;
  maxWeightKg: number;
  isPair: boolean;
}

export interface UserProfile {
  id?: number;
  userId?: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender?: string;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  currentBodyFat: number;
  targetBodyFat: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  occupation: string;
  targetPhysiqueGoals: string[];
  physiqueGoalNotes?: string;
  equipmentType: EquipmentType;
  dumbbellConfig?: DumbbellConfig;
  fitnessLevel: FitnessLevel;
  initialPushups: number;
  initialSquats: number;
  initialPlankSeconds: number;
  initialPullups: number;
  limitationsOrInjuries?: string;
  transformationDays: number;
  dailyProteinTarget: number;
  dailyCalorieTarget: number;
  dailyCarbsTarget: number;
  dailyFatsTarget: number;
  dailyWaterTargetMl: number;
  dailyWalkingStepsTarget: number;
  sleepTargetHours: number;
  workoutFrequencyDaysPerWeek: number;
  preferredWorkoutTime: string;
  currentDay: number;
  startDate: string;
  isOnboarded: boolean;
  createdAt: string;
}

export type QuestType = 
  | 'workout' 
  | 'pushups' 
  | 'squats' 
  | 'core' 
  | 'walking' 
  | 'protein' 
  | 'water' 
  | 'skincare_am' 
  | 'skincare_pm' 
  | 'stretching' 
  | 'sleep';

export interface DailyQuest {
  id?: number;
  userId?: string;
  date: string;
  type: QuestType;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isEstimated?: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'supplements' | 'other';

export interface MealEntry {
  id?: number;
  userId?: string;
  date: string;
  mealType: MealType;
  rawText?: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  createdAt: string;
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  category: 'eggs' | 'chicken' | 'dairy' | 'vegetarian' | 'grains' | 'supplements' | 'indian_meals' | 'fruits' | 'vegetables' | 'nuts';
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatsPerServing: number;
  aliases: string[];
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  category: 'chest' | 'back' | 'shoulders' | 'arms' | 'quadriceps' | 'hamstrings_calves' | 'abs_obliques' | 'glutes' | 'dumbbell';
  difficulty: 1 | 2 | 3 | 4 | 5;
  equipment: 'bodyweight' | 'dumbbell' | 'pullup_bar';
  startingPosition: string;
  executionInstructions: string;
  recommendedSets: number;
  recommendedReps: string;
  restSeconds: number;
  commonMistakes: string;
  easierVariation: string;
  harderVariation: string;
  phase: 1 | 2 | 3;
}

export interface SetPerformance {
  setNumber: number;
  targetReps: number;
  actualReps: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  name: string;
  targetMuscle: string;
  targetSets: number;
  targetReps: string;
  sets: SetPerformance[];
  completed: boolean;
  status: 'pending' | 'complete' | 'partial' | 'skipped' | 'discomfort';
  notes?: string;
}

export interface WorkoutSession {
  id?: number;
  userId?: string;
  date: string;
  dayNumber: number;
  phaseNumber: number;
  phaseName: string;
  title: string;
  focus: string;
  equipmentMode: 'bodyweight' | 'dumbbell';
  warmup: string[];
  exercises: WorkoutExerciseLog[];
  cooldown: string[];
  totalXPAwarded: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface BodyMeasurement {
  id?: number;
  userId?: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  notes?: string;
}

export interface WaterEntry {
  id?: number;
  userId?: string;
  date: string;
  amountMl: number;
  timestamp: string;
}

export interface SleepEntry {
  id?: number;
  userId?: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  durationHours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface SkincareProduct {
  id: string;
  name: string;
  timeOfDay: 'morning' | 'evening' | 'both';
  frequency: 'daily' | 'alternate' | 'weekly';
  category: 'cleanser' | 'moisturizer' | 'sunscreen' | 'active' | 'treatment';
  notes?: string;
}

export interface SkincareLog {
  id?: number;
  userId?: string;
  date: string;
  morningCompleted: boolean;
  eveningCompleted: boolean;
  activeProductsUsed: string[];
  notes?: string;
}

export interface HunterStats {
  id?: number;
  userId?: string;
  level: number;
  levelTitle: string;
  currentXP: number;
  xpForNextLevel: number;
  totalLifetimeXP: number;
  streakDays: number;
  highestStreak: number;
  completedDaysCount: number;
  lastActiveDate: string;
}

export interface Achievement {
  id: string;
  userId?: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  category: 'workout' | 'nutrition' | 'discipline' | 'transformation';
  unlockedAt?: string;
}

export interface PhysiquePhoto {
  id?: number;
  userId?: string;
  date: string;
  type: 'front' | 'side' | 'back' | 'face';
  imageDataUrl: string;
  milestoneDay?: number;
  notes?: string;
}

export interface SystemNotification {
  id: string;
  userId?: string;
  type: 'QUEST' | 'ALERT' | 'LEVEL_UP' | 'RECOVERY' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DailyPerformanceReport {
  date: string;
  userId?: string;
  dayNumber: number;
  workoutCompletionPct: number;
  nutritionCompletionPct: number;
  proteinConsumed: number;
  proteinTarget: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  waterConsumedMl: number;
  waterTargetMl: number;
  stepsWalked: number;
  stepsTarget: number;
  skincareMorning: boolean;
  skincareEvening: boolean;
  sleepHours: number;
  dailyXPEarned: number;
  systemMessage: string;
}

export interface GoogleAuthUser {
  id: string;
  userId?: string;
  email: string;
  name: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
  verifiedEmail?: boolean;
  accessToken?: string;
  idToken?: string;
  linkedAt: string;
}

export type MemoryCategory = 'mindset' | 'physique' | 'workout' | 'nutrition' | 'milestone' | 'reflection';

export interface HunterMemoryEntry {
  id?: number;
  userId?: string;
  date: string;
  dayNumber: number;
  title: string;
  content: string;
  category: MemoryCategory;
  tags: string[];
  moodScore?: number; // 1 - 5
  energyLevel?: number; // 1 - 5
  xpAwarded?: number;
  createdAt: string;
}

// ==========================================
// MULTI-USER & APPLE SHARE PROTOCOL TYPES
// ==========================================

export type AvatarColorTheme = 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  avatarColor: AvatarColorTheme;
  avatarEmoji?: string;
  level: number;
  levelTitle: string;
  shareCode: string; // e.g. 'PRML-HNTR-982F'
  isPrimary?: boolean;
  createdAt: string;
  lastActiveAt: string;
}

export interface SharedHunterPayload {
  shareVersion: string;
  shareCode: string;
  sharedAt: string;
  user: {
    id: string;
    displayName: string;
    avatarColor: AvatarColorTheme;
    avatarEmoji?: string;
    level: number;
    levelTitle: string;
    streakDays: number;
    highestStreak: number;
    totalLifetimeXP: number;
    currentDay: number;
    fitnessLevel: FitnessLevel;
    equipmentType: EquipmentType;
  };
  todaySummary: {
    date: string;
    questsCompleted: number;
    totalQuests: number;
    caloriesConsumed: number;
    caloriesTarget: number;
    proteinConsumed: number;
    proteinTarget: number;
    waterConsumedMl: number;
    waterTargetMl: number;
    soloLevelingQuests: {
      pushups: number;
      situps: number;
      squats: number;
      runningKm: number;
      completed: boolean;
    };
  };
  rpgAttributes?: {
    str: number;
    agi: number;
    vit: number;
    int: number;
    sen: number;
    availablePoints: number;
  };
  recentMemories?: Array<{
    title: string;
    content: string;
    category: string;
    date: string;
  }>;
  cheerCount?: number;
}

export interface HunterAlly {
  id: string;
  shareCode: string;
  displayName: string;
  avatarColor: AvatarColorTheme;
  avatarEmoji?: string;
  level: number;
  levelTitle: string;
  streakDays: number;
  cheersGiven: number;
  lastInspectedAt: string;
  payload: SharedHunterPayload;
}



