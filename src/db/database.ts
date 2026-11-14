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
  DailyPerformanceReport,
  GoogleAuthUser,
  HunterMemoryEntry,
  UserAccount,
  HunterAlly
} from '../types';

export interface ExerciseHistoryRecord {
  id?: number;
  userId?: string;
  date: string;
  exerciseId: string;
  exerciseName: string;
  targetReps: number;
  completedReps: number;
  setsCompleted: number;
  status: 'complete' | 'partial' | 'skipped' | 'discomfort';
}

export class PrimalDatabase extends Dexie {
  userAccounts!: Table<UserAccount, string>;
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
  hunterMemories!: Table<HunterMemoryEntry, number>;
  googleAuth!: Table<GoogleAuthUser, string>;
  hunterAllies!: Table<HunterAlly, string>;

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
      dailyReports: 'date, dayNumber',
      hunterMemories: '++id, date, dayNumber, category, createdAt',
      googleAuth: 'id, email'
    });

    this.version(2).stores({
      userAccounts: 'id, username, shareCode, lastActiveAt',
      userProfile: '++id, userId, isOnboarded',
      dailyQuests: '++id, userId, date, type, completed',
      mealEntries: '++id, userId, date, mealType',
      workoutSessions: '++id, userId, date, dayNumber',
      bodyMeasurements: '++id, userId, date',
      waterEntries: '++id, userId, date',
      sleepEntries: '++id, userId, date',
      skincareLogs: '++id, userId, date',
      skincareProducts: 'id, timeOfDay',
      hunterStats: '++id, userId',
      achievements: 'id, userId, unlockedAt',
      physiquePhotos: '++id, userId, date, type, milestoneDay',
      notifications: 'id, userId, timestamp, read',
      exerciseHistory: '++id, userId, exerciseId, date',
      dailyReports: 'date, userId, dayNumber',
      hunterMemories: '++id, userId, date, dayNumber, category, createdAt',
      googleAuth: 'id, userId, email',
      hunterAllies: 'id, shareCode, lastInspectedAt'
    }).upgrade(async tx => {
      const defaultUserId = 'usr_primary';
      const tables = [
        'userProfile',
        'dailyQuests',
        'mealEntries',
        'workoutSessions',
        'bodyMeasurements',
        'waterEntries',
        'sleepEntries',
        'skincareLogs',
        'hunterStats',
        'notifications',
        'hunterMemories',
        'googleAuth'
      ];
      for (const tName of tables) {
        try {
          const table = tx.table(tName);
          await table.toCollection().modify((record: any) => {
            if (!record.userId) {
              record.userId = defaultUserId;
            }
          });
        } catch {
          // table might not exist yet or empty
        }
      }
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
