import type { HunterStats } from '../types';

export interface LevelThreshold {
  level: number;
  title: string;
  minXP: number;
  nextLevelXP: number;
}

export const HUNTER_LEVELS: LevelThreshold[] = [
  { level: 1, title: 'AWAKENED', minXP: 0, nextLevelXP: 500 },
  { level: 2, title: 'DISCIPLINED', minXP: 500, nextLevelXP: 1500 },
  { level: 3, title: 'INITIATED', minXP: 1500, nextLevelXP: 3000 },
  { level: 4, title: 'WARRIOR', minXP: 3000, nextLevelXP: 5500 },
  { level: 5, title: 'HUNTER', minXP: 5500, nextLevelXP: 9000 },
  { level: 6, title: 'ELITE HUNTER', minXP: 9000, nextLevelXP: 13500 },
  { level: 7, title: 'ASCENDANT', minXP: 13500, nextLevelXP: 20000 },
  { level: 8, title: 'APEX', minXP: 20000, nextLevelXP: 28000 },
  { level: 9, title: 'PRIMAL', minXP: 28000, nextLevelXP: 38000 },
  { level: 10, title: 'TRANSCENDENT', minXP: 38000, nextLevelXP: 50000 },
];

export const XP_VALUES = {
  WORKOUT_COMPLETE: 100,
  EXERCISE_SET: 10,
  PROTEIN_TARGET_MET: 50,
  CALORIE_TARGET_MET: 30,
  WALKING_TARGET_MET: 40,
  WATER_TARGET_MET: 20,
  SKINCARE_MORNING: 10,
  SKINCARE_EVENING: 10,
  SLEEP_LOGGED: 15,
  PERFECT_DAY_BONUS: 100,
  PHOTO_LOGGED: 25,
  MEASUREMENT_LOGGED: 25,
};

export function getLevelDetails(totalXP: number): {
  level: number;
  title: string;
  currentLevelXP: number;
  xpNeededForNext: number;
  progressPct: number;
  isMaxLevel: boolean;
} {
  let currentLevel = HUNTER_LEVELS[0];
  
  for (let i = HUNTER_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= HUNTER_LEVELS[i].minXP) {
      currentLevel = HUNTER_LEVELS[i];
      break;
    }
  }

  const isMaxLevel = currentLevel.level === 10;
  const levelFloor = currentLevel.minXP;
  const levelCeiling = currentLevel.nextLevelXP;
  
  const currentLevelXP = totalXP - levelFloor;
  const xpNeededForNext = levelCeiling - levelFloor;
  const progressPct = isMaxLevel ? 100 : Math.min(100, Math.max(0, (currentLevelXP / xpNeededForNext) * 100));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentLevelXP,
    xpNeededForNext,
    progressPct,
    isMaxLevel
  };
}

export function calculateNewStats(currentStats: HunterStats, xpGained: number): {
  updatedStats: HunterStats;
  didLevelUp: boolean;
  newLevelTitle?: string;
  newLevelNumber?: number;
} {
  const newTotalXP = currentStats.totalLifetimeXP + xpGained;
  const oldDetails = getLevelDetails(currentStats.totalLifetimeXP);
  const newDetails = getLevelDetails(newTotalXP);

  const didLevelUp = newDetails.level > oldDetails.level;

  const updatedStats: HunterStats = {
    ...currentStats,
    level: newDetails.level,
    levelTitle: newDetails.title,
    currentXP: newDetails.currentLevelXP,
    xpForNextLevel: newDetails.xpNeededForNext,
    totalLifetimeXP: newTotalXP,
  };

  return {
    updatedStats,
    didLevelUp,
    newLevelTitle: didLevelUp ? newDetails.title : undefined,
    newLevelNumber: didLevelUp ? newDetails.level : undefined,
  };
}

