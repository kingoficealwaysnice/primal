import Dexie, { type Table } from 'dexie';
import type {
  UserProfile,
  DailyQuest,
  MealEntry,
  WorkoutSession,
  BodyMeasurement,
  WaterEntry,
  SleepEntry,
  SkincareLog,
  SkincareProduct,
  HunterStats,
  Achievement,
  PhysiquePhoto,
  SystemNotification,
  DailyPerformanceReport
} from '../types';

export interface ExerciseHistoryRecord {
  id?: number;
  date: string;
  exerciseId: string;
  exerciseName: string;
  targetReps: number;
  completedReps: number;
  setsCompleted: number;
  status: 'complete' | 'partial' | 'skipped' | 'discomfort';
}

export class PrimalDatabase extends Dexie {
  userProfile!: Table<UserProfile, number>;
  dailyQuests!: Table<DailyQuest, number>;
  mealEntries!: Table<MealEntry, number>;
  workoutSessions!: Table<WorkoutSession, number>;
  bodyMeasurements!: Table<BodyMeasurement, number>;
  waterEntries!: Table<WaterEntry, number>;
  sleepEntries!: Table<SleepEntry, number>;
  skincareLogs!: Table<SkincareLog, number>;
  skincareProducts!: Table<SkincareProduct, string>;
  hunterStats!: Table<HunterStats, number>;
  achievements!: Table<Achievement, string>;
  physiquePhotos!: Table<PhysiquePhoto, number>;
  notifications!: Table<SystemNotification, string>;
  exerciseHistory!: Table<ExerciseHistoryRecord, number>;
  dailyReports!: Table<DailyPerformanceReport, string>;

  constructor() {
    super('PrimalSystemDB');
    this.version(1).stores({
      userProfile: '++id, isOnboarded',
      dailyQuests: '++id, date, type, completed',
      mealEntries: '++id, date, mealType',
      workoutSessions: '++id, date, dayNumber',
      bodyMeasurements: '++id, date',
      waterEntries: '++id, date',
      sleepEntries: '++id, date',
      skincareLogs: '++id, date',
      skincareProducts: 'id, timeOfDay',
      hunterStats: '++id',
      achievements: 'id, unlockedAt',
      physiquePhotos: '++id, date, type, milestoneDay',
      notifications: 'id, timestamp, read',
      exerciseHistory: '++id, exerciseId, date',
      dailyReports: 'date, dayNumber'
    });
  }
}

export const db = new PrimalDatabase();

// Helper to get formatted local date (YYYY-MM-DD)
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

