import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  UserProfile,
  HunterStats,
  DailyQuest,
  WorkoutSession,
  MealEntry,
  SkincareLog,
  SystemNotification,
  GoogleAuthUser,
  HunterMemoryEntry,
  MemoryCategory
} from '../types';
import { db, getTodayDateString } from '../db/database';
import { getOrGenerateDailyQuests } from '../engine/questEngine';
import { getOrGenerateTodayWorkout } from '../engine/workoutEngine';
import { calculateNewStats, XP_VALUES } from '../engine/xpEngine';
import { INITIAL_ACHIEVEMENTS, DEFAULT_SKINCARE_PRODUCTS } from '../data/initialData';
import { seedInitialMemoryIfEmpty, addHunterMemory, deleteHunterMemory } from '../engine/memoryEngine';
import {
  enablePersistentStorage,
  saveVaultSnapshot,
  loadVaultSnapshot,
  createDefaultAwakenedProfile
} from '../services/persistenceService';

export type AppTab = 'home' | 'workout' | 'nutrition' | 'progress' | 'profile';

interface AppContextType {
  userProfile: UserProfile | null;
  hunterStats: HunterStats | null;
  todayQuests: DailyQuest[];
  todayWorkout: WorkoutSession | null;
  todayMeals: MealEntry[];
  todayWaterMl: number;
  todaySkincare: SkincareLog | null;
  notifications: SystemNotification[];
  currentTab: AppTab;
  equipmentMode: 'bodyweight' | 'dumbbell';
  isLoading: boolean;
  levelUpModal: { show: boolean; level: number; title: string } | null;
  
  // Google Auth
  googleUser: GoogleAuthUser | null;
  setGoogleAuth: (user: GoogleAuthUser | null) => Promise<void>;

  // Memory Feature
  memories: HunterMemoryEntry[];
  saveMemory: (
    title: string,
    content: string,
    category?: MemoryCategory,
    tags?: string[],
    moodScore?: number,
    energyLevel?: number
  ) => Promise<HunterMemoryEntry>;
  removeMemory: (id: number) => Promise<void>;

  // Actions
  setCurrentTab: (tab: AppTab) => void;
  setEquipmentMode: (mode: 'bodyweight' | 'dumbbell') => void;
  dismissLevelUpModal: () => void;
  reloadAllData: () => Promise<void>;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  toggleQuestCompletion: (questId: number) => Promise<void>;
  logWaterIntake: (amountMl: number) => Promise<void>;
  logMeal: (meal: Omit<MealEntry, 'id'>) => Promise<void>;
  removeMeal: (mealId: number) => Promise<void>;
  saveWorkoutSession: (workout: WorkoutSession) => Promise<void>;
  grantXP: (amount: number, reason?: string) => Promise<void>;
  addNotification: (title: string, message: string, type?: SystemNotification['type']) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  updateSkincareStatus: (morning: boolean, evening: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hunterStats, setHunterStats] = useState<HunterStats | null>(null);
  const [todayQuests, setTodayQuests] = useState<DailyQuest[]>([]);
  const [todayWorkout, setTodayWorkout] = useState<WorkoutSession | null>(null);
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [todayWaterMl, setTodayWaterMl] = useState<number>(0);
  const [todaySkincare, setTodaySkincare] = useState<SkincareLog | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [equipmentMode, setEquipmentMode] = useState<'bodyweight' | 'dumbbell'>('bodyweight');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [levelUpModal, setLevelUpModal] = useState<{ show: boolean; level: number; title: string } | null>(null);

  // Google Auth state
  const [googleUser, setGoogleUser] = useState<GoogleAuthUser | null>(null);

  // Hunter Memory state
  const [memories, setMemories] = useState<HunterMemoryEntry[]>([]);

  // Load all user and daily state from IndexedDB with permanent storage recovery
  const reloadAllData = useCallback(async () => {
    try {
      const todayStr = getTodayDateString();

      // 1. Google Auth state
      const savedGoogleUser = await db.googleAuth.toCollection().first();
      if (savedGoogleUser) {
        setGoogleUser(savedGoogleUser);
      }

      // 2. User Profile: check IndexedDB, then check localStorage vault snapshot, then initialize default
      let profile = await db.userProfile.toCollection().first();
      if (!profile) {
        const snapshot = loadVaultSnapshot();
        if (snapshot?.userProfile) {
          profile = snapshot.userProfile;
          const id = await db.userProfile.add(profile);
          profile.id = id;
        } else {
          // Initialize Awakened Hunter baseline so data NEVER resets on fresh launch
          profile = createDefaultAwakenedProfile(savedGoogleUser?.name || 'Bhanu');
          const id = await db.userProfile.add(profile);
          profile.id = id;
        }
      }
      setUserProfile(profile);

      // Seed initial memory chronicle if empty
      await seedInitialMemoryIfEmpty(profile?.fullName || savedGoogleUser?.name || 'Bhanu');

      // 3. Load Memories
      const memoryList = await db.hunterMemories.orderBy('createdAt').reverse().toArray();
      setMemories(memoryList);

      setEquipmentMode(profile.equipmentType === 'dumbbells' ? 'dumbbell' : 'bodyweight');

      // 4. Hunter Stats: retrieve or restore from snapshot
      let stats = await db.hunterStats.toCollection().first();
      if (!stats) {
        const snapshot = loadVaultSnapshot();
        if (snapshot?.hunterStats) {
          stats = snapshot.hunterStats;
          const id = await db.hunterStats.add(stats);
          stats.id = id;
        } else {
          stats = {
            level: 1,
            levelTitle: 'AWAKENED',
            currentXP: 120,
            xpForNextLevel: 500,
            totalLifetimeXP: 120,
            streakDays: 1,
            highestStreak: 1,
            completedDaysCount: 0,
            lastActiveDate: todayStr
          };
          const statsId = await db.hunterStats.add(stats);
          stats.id = statsId;
        }
      }
      setHunterStats(stats);

      // Save initial snapshot to guarantee unresettable mirror
      saveVaultSnapshot(profile, stats);

      // Seed achievements if empty
      const achCount = await db.achievements.count();
      if (achCount === 0) {
        await db.achievements.bulkAdd(INITIAL_ACHIEVEMENTS);
      }

      // Seed default skincare products if empty
      const prodCount = await db.skincareProducts.count();
      if (prodCount === 0) {
        await db.skincareProducts.bulkAdd(DEFAULT_SKINCARE_PRODUCTS);
      }

      // 5. Daily Quests
      const quests = await getOrGenerateDailyQuests(profile);
      setTodayQuests(quests);

      // 6. Today's Workout
      const workout = await getOrGenerateTodayWorkout(
        profile.currentDay || 1,
        profile.fitnessLevel || 'beginner',
        profile.equipmentType === 'dumbbells' ? 'dumbbell' : 'bodyweight',
        profile.initialPushups || 20
      );
      setTodayWorkout(workout);

      // 7. Meals
      const meals = await db.mealEntries.where('date').equals(todayStr).toArray();
      setTodayMeals(meals);

      // 8. Water
      const waterEntries = await db.waterEntries.where('date').equals(todayStr).toArray();
      const totalWater = waterEntries.reduce((sum, w) => sum + w.amountMl, 0);
      setTodayWaterMl(totalWater);

      // 9. Skincare
      const skincare = await db.skincareLogs.where('date').equals(todayStr).first();
      setTodaySkincare(skincare || null);

      // 10. Notifications
      const notifs = await db.notifications.orderBy('timestamp').reverse().limit(20).toArray();
      setNotifications(notifs);

    } catch (err) {
      console.error('Error loading PRIMAL SYSTEM data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    enablePersistentStorage();
    reloadAllData();
  }, [reloadAllData]);

  // Google Auth Sign-in / Sign-out
  const setGoogleAuth = async (user: GoogleAuthUser | null) => {
    if (user) {
      await db.googleAuth.clear();
      await db.googleAuth.put(user);
      setGoogleUser(user);

      // If userProfile exists without name, update with Google name
      if (userProfile && !userProfile.fullName) {
        userProfile.fullName = user.name;
        await db.userProfile.put(userProfile);
        setUserProfile({ ...userProfile });
        saveVaultSnapshot(userProfile, hunterStats);
      }

      await addNotification(
        'GOOGLE PROTOCOL LINKED',
        `Authenticated as ${user.name} (${user.email}). System cloud sync initialized.`,
        'SYSTEM'
      );
    } else {
      await db.googleAuth.clear();
      setGoogleUser(null);
      await addNotification(
        'GOOGLE PROTOCOL DISCONNECTED',
        'Signed out from Google. Local system data preserved.',
        'SYSTEM'
      );
    }
  };

  // Memory Feature: Save memory entry
  const saveMemory = async (
    title: string,
    content: string,
    category: MemoryCategory = 'reflection',
    tags: string[] = [],
    moodScore: number = 5,
    energyLevel: number = 5
  ): Promise<HunterMemoryEntry> => {
    const day = userProfile?.currentDay || 1;
    const entry = await addHunterMemory(title, content, category, tags, day, moodScore, energyLevel);
    setMemories(prev => [entry, ...prev]);

    // Award +50 XP for discipline & reflection
    await grantXP(entry.xpAwarded || 50, `Memory Inscribed: ${entry.title}`);

    await addNotification(
      'MEMORY INSCRIBED',
      `Day ${day} Memory archived in System Vault (+50 XP).`,
      'SYSTEM'
    );

    return entry;
  };

  // Memory Feature: Delete memory entry
  const removeMemory = async (id: number) => {
    await deleteHunterMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // Save profile and trigger initialization with auto-snapshot
  const saveUserProfile = async (profile: UserProfile) => {
    await db.userProfile.clear();
    const id = await db.userProfile.add(profile);
    profile.id = id;
    setUserProfile(profile);

    saveVaultSnapshot(profile, hunterStats);

    // Initial notification
    await addNotification(
      'HUNTER AWAKENED',
      'The 90-day transformation protocol is active. Complete today\'s quests to begin your ascent.',
      'SYSTEM'
    );

    await reloadAllData();
  };

  // Grant XP with level-up detection and vault snapshotting
  const grantXP = async (amount: number, reason?: string) => {
    if (!hunterStats) return;

    const { updatedStats, didLevelUp, newLevelTitle, newLevelNumber } = calculateNewStats(hunterStats, amount);
    if (hunterStats.id) {
      await db.hunterStats.update(hunterStats.id, updatedStats);
    }
    setHunterStats(updatedStats);
    saveVaultSnapshot(userProfile, updatedStats);

    if (reason) {
      console.log(`[XP +${amount}] ${reason}`);
    }

    if (didLevelUp && newLevelNumber && newLevelTitle) {
      setLevelUpModal({ show: true, level: newLevelNumber, title: newLevelTitle });
      await addNotification(
        'LEVEL UP DETECTED',
        `Congratulations, Hunter! You have ascended to LEVEL ${newLevelNumber}: ${newLevelTitle}!`,
        'LEVEL_UP'
      );
    }
  };

  // Toggle Quest
  const toggleQuestCompletion = async (questId: number) => {
    const quest = todayQuests.find(q => q.id === questId);
    if (!quest) return;

    const newCompleted = !quest.completed;
    const completedAt = newCompleted ? new Date().toISOString() : undefined;

    await db.dailyQuests.update(questId, { completed: newCompleted, completedAt });

    setTodayQuests(prev =>
      prev.map(q => q.id === questId ? { ...q, completed: newCompleted, completedAt } : q)
    );

    if (newCompleted) {
      await grantXP(quest.xpReward, `Completed quest: ${quest.title}`);
    }
  };

  // Water intake
  const logWaterIntake = async (amountMl: number) => {
    const todayStr = getTodayDateString();
    await db.waterEntries.add({
      date: todayStr,
      amountMl,
      timestamp: new Date().toISOString()
    });

    const newTotal = todayWaterMl + amountMl;
    setTodayWaterMl(newTotal);

    await grantXP(10, `Hydration logged (+${amountMl}ml)`);

    // Check water quest
    if (userProfile && newTotal >= userProfile.dailyWaterTargetMl) {
      const waterQuest = todayQuests.find(q => q.type === 'water');
      if (waterQuest && !waterQuest.completed && waterQuest.id) {
        await toggleQuestCompletion(waterQuest.id);
      }
    }
  };

  // Log Meal
  const logMeal = async (meal: Omit<MealEntry, 'id'>) => {
    const id = await db.mealEntries.add(meal as MealEntry);
    const newMeal = { ...meal, id };
    const updatedMeals = [...todayMeals, newMeal];
    setTodayMeals(updatedMeals);

    await grantXP(25, `Meal logged: ${meal.mealType}`);

    // Check protein quest
    const totalProtein = updatedMeals.reduce((sum, m) => sum + m.totalProtein, 0);
    if (userProfile && totalProtein >= userProfile.dailyProteinTarget) {
      const proteinQuest = todayQuests.find(q => q.type === 'protein');
      if (proteinQuest && !proteinQuest.completed && proteinQuest.id) {
        await toggleQuestCompletion(proteinQuest.id);
      }
    }
  };

  // Remove meal
  const removeMeal = async (mealId: number) => {
    await db.mealEntries.delete(mealId);
    setTodayMeals(prev => prev.filter(m => m.id !== mealId));
  };

  // Save Workout Session
  const saveWorkoutSession = async (workout: WorkoutSession) => {
    if (workout.id) {
      await db.workoutSessions.put(workout);
    } else {
      const id = await db.workoutSessions.add(workout);
      workout.id = id;
    }
    setTodayWorkout(workout);

    // If completed, check workout quest
    if (workout.completed) {
      const workoutQuest = todayQuests.find(q => q.type === 'workout');
      if (workoutQuest && !workoutQuest.completed && workoutQuest.id) {
        await toggleQuestCompletion(workoutQuest.id);
      }
      await grantXP(XP_VALUES.WORKOUT_COMPLETE, 'Daily Workout Completed');
    }
  };

  // Update Skincare
  const updateSkincareStatus = async (morning: boolean, evening: boolean) => {
    const todayStr = getTodayDateString();
    const existing = await db.skincareLogs.where('date').equals(todayStr).first();

    const newLog: SkincareLog = {
      date: todayStr,
      morningCompleted: morning,
      eveningCompleted: evening,
      activeProductsUsed: existing?.activeProductsUsed || []
    };

    if (existing?.id) {
      newLog.id = existing.id;
      await db.skincareLogs.put(newLog);
    } else {
      const id = await db.skincareLogs.add(newLog);
      newLog.id = id;
    }
    setTodaySkincare(newLog);

    if (morning && (!existing || !existing.morningCompleted)) {
      const amQuest = todayQuests.find(q => q.type === 'skincare_am');
      if (amQuest && !amQuest.completed && amQuest.id) {
        await toggleQuestCompletion(amQuest.id);
      }
    }

    if (evening && (!existing || !existing.eveningCompleted)) {
      const pmQuest = todayQuests.find(q => q.type === 'skincare_pm');
      if (pmQuest && !pmQuest.completed && pmQuest.id) {
        await toggleQuestCompletion(pmQuest.id);
      }
    }
  };

  // Add notification
  const addNotification = async (title: string, message: string, type: SystemNotification['type'] = 'SYSTEM') => {
    const notif: SystemNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    await db.notifications.add(notif);
    setNotifications(prev => [notif, ...prev]);
  };

  // Mark notification read
  const markNotificationRead = async (id: string) => {
    await db.notifications.update(id, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        hunterStats,
        todayQuests,
        todayWorkout,
        todayMeals,
        todayWaterMl,
        todaySkincare,
        notifications,
        currentTab,
        equipmentMode,
        isLoading,
        levelUpModal,
        googleUser,
        setGoogleAuth,
        memories,
        saveMemory,
        removeMemory,
        setCurrentTab,
        setEquipmentMode,
        dismissLevelUpModal: () => setLevelUpModal(null),
        reloadAllData,
        saveUserProfile,
        toggleQuestCompletion,
        logWaterIntake,
        logMeal,
        removeMeal,
        saveWorkoutSession,
        grantXP,
        addNotification,
        markNotificationRead,
        updateSkincareStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
