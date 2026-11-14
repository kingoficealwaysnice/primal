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
  MemoryCategory,
  UserAccount,
  SharedHunterPayload,
  HunterAlly,
  AvatarColorTheme,
  FitnessLevel,
  EquipmentType
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
import {
  getActiveUserId,
  setActiveUserId,
  listUserAccounts,
  getActiveUserAccount,
  registerNewUser,
  deleteUserAccount,
  updateUserAccount,
  DEFAULT_USER_ID,
  generateSharePayload,
  getSharedPayloadFromCurrentUrl,
  getSavedAllies,
  saveHunterAlly,
  cheerHunterAlly,
  getUserRPGAttributes,
  getUserSoloLevelingQuests
} from '../services/multiUserService';

export type AppTab = 'home' | 'workout' | 'nutrition' | 'progress' | 'profile';

export interface DynamicIslandAlert {
  title: string;
  subtitle?: string;
  icon?: string;
  type?: 'xp' | 'water' | 'quest' | 'user' | 'alert';
}

interface AppContextType {
  // Active User Profile & Stats (Encapsulated)
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

  // iOS Dynamic Island Live Alert
  islandAlert: DynamicIslandAlert | null;
  triggerIslandAlert: (alert: DynamicIslandAlert) => void;

  // Multi-User Management
  activeUser: UserAccount | null;
  allUsers: UserAccount[];
  switchActiveUser: (userId: string) => Promise<void>;
  registerHunterUser: (
    name: string,
    options?: {
      avatarColor?: AvatarColorTheme;
      avatarEmoji?: string;
      fitnessLevel?: FitnessLevel;
      equipmentType?: EquipmentType;
    }
  ) => Promise<UserAccount>;
  removeHunterAccount: (userId: string) => Promise<void>;

  // Sharing & Hunter Circle (Encapsulated Peer Viewing)
  inspectingAlly: SharedHunterPayload | null;
  setInspectingAlly: (ally: SharedHunterPayload | null) => void;
  allies: HunterAlly[];
  generateCurrentSharePayload: () => SharedHunterPayload | null;
  saveAllyToCircle: (payload: SharedHunterPayload) => Promise<HunterAlly>;
  cheerAlly: (allyId: string) => Promise<number>;

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
  reloadAllData: (targetUserId?: string) => Promise<void>;
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
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
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

  // Dynamic Island Alert State
  const [islandAlert, setIslandAlert] = useState<DynamicIslandAlert | null>(null);

  const triggerIslandAlert = useCallback((alert: DynamicIslandAlert) => {
    setIslandAlert(alert);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([15]); } catch {}
    }
    setTimeout(() => {
      setIslandAlert(curr => (curr?.title === alert.title ? null : curr));
    }, 2800);
  }, []);

  // Sharing & Peer Ally state
  const [inspectingAlly, setInspectingAlly] = useState<SharedHunterPayload | null>(null);
  const [allies, setAllies] = useState<HunterAlly[]>([]);

  // Google Auth state
  const [googleUser, setGoogleUser] = useState<GoogleAuthUser | null>(null);

  // Hunter Memory state
  const [memories, setMemories] = useState<HunterMemoryEntry[]>([]);

  // Load all user and daily state from IndexedDB with permanent storage recovery (Scoped to targetUserId)
  const reloadAllData = useCallback(async (targetUserId?: string) => {
    try {
      const todayStr = getTodayDateString();
      const currentUid = targetUserId || getActiveUserId() || DEFAULT_USER_ID;

      // 1. Load User Accounts
      const accounts = await listUserAccounts();
      setAllUsers(accounts);
      const currentAccount = accounts.find(a => a.id === currentUid) || accounts[0];
      setActiveUser(currentAccount);

      // 2. Load Saved Allies Circle
      const savedAlliesList = await getSavedAllies();
      setAllies(savedAlliesList);

      // 3. Google Auth state
      const savedGoogleUser = await db.googleAuth.toCollection().first();
      if (savedGoogleUser) {
        setGoogleUser(savedGoogleUser);
      }

      // 4. User Profile (Encapsulated: query by currentUid)
      let profile: UserProfile | undefined;
      const allProfiles = await db.userProfile.toArray();
      profile = allProfiles.find(p => (p.userId || DEFAULT_USER_ID) === currentUid);

      if (!profile) {
        const snapshot = loadVaultSnapshot(currentUid);
        if (snapshot?.userProfile) {
          profile = { ...snapshot.userProfile, userId: currentUid };
          const id = await db.userProfile.add(profile);
          profile.id = id;
        } else {
          // Initialize Awakened Hunter baseline for this user
          profile = createDefaultAwakenedProfile(currentAccount?.displayName || 'Hunter');
          profile.userId = currentUid;
          const id = await db.userProfile.add(profile);
          profile.id = id;
        }
      } else if (!profile.userId) {
        profile.userId = currentUid;
        await db.userProfile.put(profile);
      }
      setUserProfile(profile);

      // Seed initial memory chronicle if empty for this user
      await seedInitialMemoryIfEmpty(profile?.fullName || currentAccount?.displayName || 'Hunter', currentUid);

      // 5. Load Memories (Scoped to currentUid)
      const allMemories = await db.hunterMemories.toArray();
      const userMemories = allMemories
        .filter(m => (m.userId || DEFAULT_USER_ID) === currentUid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMemories(userMemories);

      setEquipmentMode(profile.equipmentType === 'dumbbells' ? 'dumbbell' : 'bodyweight');

      // 6. Hunter Stats (Encapsulated: query by currentUid)
      let stats: HunterStats | undefined;
      const allStats = await db.hunterStats.toArray();
      stats = allStats.find(s => (s.userId || DEFAULT_USER_ID) === currentUid);

      if (!stats) {
        const snapshot = loadVaultSnapshot(currentUid);
        if (snapshot?.hunterStats) {
          stats = { ...snapshot.hunterStats, userId: currentUid };
          const id = await db.hunterStats.add(stats);
          stats.id = id;
        } else {
          stats = {
            userId: currentUid,
            level: 1,
            levelTitle: 'AWAKENED HUNTER',
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
      } else if (!stats.userId) {
        stats.userId = currentUid;
        await db.hunterStats.put(stats);
      }
      setHunterStats(stats);

      // Save initial snapshot to guarantee unresettable mirror
      saveVaultSnapshot(profile, stats, undefined, currentUid);

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

      // 7. Daily Quests (Encapsulated)
      const quests = await getOrGenerateDailyQuests(profile);
      setTodayQuests(quests);

      // 8. Today's Workout
      const workout = await getOrGenerateTodayWorkout(
        profile.currentDay || 1,
        profile.fitnessLevel || 'beginner',
        profile.equipmentType === 'dumbbells' ? 'dumbbell' : 'bodyweight',
        profile.initialPushups || 20
      );
      setTodayWorkout(workout);

      // 9. Meals (Scoped to currentUid & date)
      const dateMeals = await db.mealEntries.where('date').equals(todayStr).toArray();
      const userMeals = dateMeals.filter(m => (m.userId || DEFAULT_USER_ID) === currentUid);
      setTodayMeals(userMeals);

      // 10. Water (Scoped to currentUid & date)
      const dateWater = await db.waterEntries.where('date').equals(todayStr).toArray();
      const userWater = dateWater.filter(w => (w.userId || DEFAULT_USER_ID) === currentUid);
      const totalWater = userWater.reduce((sum, w) => sum + w.amountMl, 0);
      setTodayWaterMl(totalWater);

      // 11. Skincare (Scoped to currentUid & date)
      const dateSkincare = await db.skincareLogs.where('date').equals(todayStr).toArray();
      const userSkincare = dateSkincare.find(s => (s.userId || DEFAULT_USER_ID) === currentUid);
      setTodaySkincare(userSkincare || null);

      // 12. Notifications (Scoped to currentUid)
      const allNotifs = await db.notifications.orderBy('timestamp').reverse().toArray();
      const userNotifs = allNotifs.filter(n => !n.userId || n.userId === currentUid).slice(0, 20);
      setNotifications(userNotifs);

    } catch (err) {
      console.error('Error loading PRIMAL SYSTEM data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and check for URL share payload
  useEffect(() => {
    enablePersistentStorage();
    reloadAllData();

    // Check if URL has a shared hunter profile (?share=... or #share=...)
    const sharedFromUrl = getSharedPayloadFromCurrentUrl();
    if (sharedFromUrl) {
      setInspectingAlly(sharedFromUrl);
    }
  }, [reloadAllData]);

  // Fast User Switching with Apple Fluidity
  const switchActiveUser = async (newUserId: string) => {
    setIsLoading(true);
    setActiveUserId(newUserId);
    await reloadAllData(newUserId);
    const accounts = await listUserAccounts();
    const target = accounts.find(a => a.id === newUserId);
    triggerIslandAlert({
      title: target?.displayName ? `Hunter: ${target.displayName}` : 'Hunter Switched',
      subtitle: `LVL 0${target?.level || 1} • Protocol Active`,
      icon: target?.avatarEmoji || '🛡️',
      type: 'user'
    });
  };

  // Register New Hunter User
  const registerHunterUser = async (
    name: string,
    options?: {
      avatarColor?: AvatarColorTheme;
      avatarEmoji?: string;
      fitnessLevel?: FitnessLevel;
      equipmentType?: EquipmentType;
    }
  ): Promise<UserAccount> => {
    const newAccount = await registerNewUser(name, options);
    // Create new profile for this user
    const newProfile = createDefaultAwakenedProfile(newAccount.displayName);
    newProfile.userId = newAccount.id;
    if (options?.fitnessLevel) newProfile.fitnessLevel = options.fitnessLevel;
    if (options?.equipmentType) newProfile.equipmentType = options.equipmentType;

    const profileId = await db.userProfile.add(newProfile);
    newProfile.id = profileId;

    // Switch to new user
    await switchActiveUser(newAccount.id);

    await addNotification(
      'NEW HUNTER AWAKENED',
      `Hunter identity registered: ${newAccount.displayName} (Passcode: ${newAccount.shareCode}). Protocol isolated.`,
      'SYSTEM'
    );

    return newAccount;
  };

  // Remove Hunter User Account
  const removeHunterAccount = async (targetUserId: string) => {
    await deleteUserAccount(targetUserId);
    await reloadAllData();
  };

  // Generate Current Hunter Share Payload
  const generateCurrentSharePayload = (): SharedHunterPayload | null => {
    if (!userProfile || !hunterStats || !activeUser) return null;
    const rpgAttrs = getUserRPGAttributes(activeUser.id);
    const soloQuests = getUserSoloLevelingQuests(activeUser.id);

    return generateSharePayload(
      userProfile,
      hunterStats,
      todayMeals,
      todayWaterMl,
      todayQuests,
      rpgAttrs,
      soloQuests,
      memories,
      activeUser
    );
  };

  // Save an Ally to the Hunter Circle
  const saveAllyToCircle = async (payload: SharedHunterPayload): Promise<HunterAlly> => {
    const saved = await saveHunterAlly(payload);
    const updated = await getSavedAllies();
    setAllies(updated);
    return saved;
  };

  // Send a Resonance Cheer to an Ally
  const cheerAlly = async (allyId: string): Promise<number> => {
    const count = await cheerHunterAlly(allyId);
    const updated = await getSavedAllies();
    setAllies(updated);
    return count;
  };

  // Google Auth Sign-in / Sign-out
  const setGoogleAuth = async (user: GoogleAuthUser | null) => {
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;
    if (user) {
      user.userId = currentUid;
      await db.googleAuth.clear();
      await db.googleAuth.put(user);
      setGoogleUser(user);

      if (userProfile && !userProfile.fullName) {
        userProfile.fullName = user.name;
        userProfile.userId = currentUid;
        await db.userProfile.put(userProfile);
        setUserProfile({ ...userProfile });
        saveVaultSnapshot(userProfile, hunterStats, undefined, currentUid);
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

  // Memory Feature: Save memory entry (Encapsulated)
  const saveMemory = async (
    title: string,
    content: string,
    category: MemoryCategory = 'reflection',
    tags: string[] = [],
    moodScore: number = 5,
    energyLevel: number = 5
  ): Promise<HunterMemoryEntry> => {
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;
    const day = userProfile?.currentDay || 1;
    const entry = await addHunterMemory(title, content, category, tags, day, moodScore, energyLevel, currentUid);
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

  // Save profile and trigger initialization with auto-snapshot (Encapsulated)
  const saveUserProfile = async (profile: UserProfile) => {
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;
    profile.userId = currentUid;

    if (profile.id) {
      await db.userProfile.put(profile);
    } else {
      const id = await db.userProfile.add(profile);
      profile.id = id;
    }
    setUserProfile(profile);

    // Also update account display name if changed
    if (activeUser && profile.fullName && profile.fullName !== activeUser.displayName) {
      await updateUserAccount(currentUid, { displayName: profile.fullName });
      const updatedAccounts = await listUserAccounts();
      setAllUsers(updatedAccounts);
      const match = updatedAccounts.find(a => a.id === currentUid);
      if (match) setActiveUser(match);
    }

    saveVaultSnapshot(profile, hunterStats, undefined, currentUid);

    await addNotification(
      'HUNTER ASCENT UPDATED',
      'Profile biometrics and protocol parameters recalibrated.',
      'SYSTEM'
    );

    await reloadAllData(currentUid);
  };

  // Grant XP with level-up detection and vault snapshotting (Encapsulated)
  const grantXP = async (amount: number, reason?: string) => {
    if (!hunterStats) return;
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;

    const { updatedStats, didLevelUp, newLevelTitle, newLevelNumber } = calculateNewStats(hunterStats, amount);
    updatedStats.userId = currentUid;

    if (hunterStats.id) {
      await db.hunterStats.update(hunterStats.id, updatedStats);
    } else {
      await db.hunterStats.put(updatedStats);
    }
    setHunterStats(updatedStats);
    saveVaultSnapshot(userProfile, updatedStats, undefined, currentUid);

    // Update level on account
    if (activeUser && updatedStats.level !== activeUser.level) {
      await updateUserAccount(currentUid, {
        level: updatedStats.level,
        levelTitle: updatedStats.levelTitle
      });
      const accounts = await listUserAccounts();
      setAllUsers(accounts);
      const updated = accounts.find(a => a.id === currentUid);
      if (updated) setActiveUser(updated);
    }

    if (reason) {
      console.log(`[XP +${amount}] ${reason}`);
    }

    if (didLevelUp && newLevelNumber && newLevelTitle) {
      setLevelUpModal({ show: true, level: newLevelNumber, title: newLevelTitle });
      triggerIslandAlert({
        title: `LEVEL UP: LVL ${newLevelNumber}`,
        subtitle: newLevelTitle,
        icon: '👑',
        type: 'xp'
      });
      await addNotification(
        'LEVEL UP DETECTED',
        `Congratulations, Hunter! You have ascended to LEVEL ${newLevelNumber}: ${newLevelTitle}!`,
        'LEVEL_UP'
      );
    }
  };

  // Toggle Quest (Encapsulated)
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
      triggerIslandAlert({
        title: 'Quest Completed!',
        subtitle: `+${quest.xpReward} XP: ${quest.title}`,
        icon: '⚡',
        type: 'quest'
      });
      await grantXP(quest.xpReward, `Completed quest: ${quest.title}`);
    }
  };

  // Water intake (Encapsulated)
  const logWaterIntake = async (amountMl: number) => {
    const todayStr = getTodayDateString();
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;

    await db.waterEntries.add({
      userId: currentUid,
      date: todayStr,
      amountMl,
      timestamp: new Date().toISOString()
    });

    const newTotal = todayWaterMl + amountMl;
    setTodayWaterMl(newTotal);

    triggerIslandAlert({
      title: `+${amountMl}ml Hydrated`,
      subtitle: `Today: ${(newTotal / 1000).toFixed(2)}L logged`,
      icon: '💧',
      type: 'water'
    });

    await grantXP(10, `Hydration logged (+${amountMl}ml)`);

    // Check water quest
    if (userProfile && newTotal >= userProfile.dailyWaterTargetMl) {
      const waterQuest = todayQuests.find(q => q.type === 'water');
      if (waterQuest && !waterQuest.completed && waterQuest.id) {
        await toggleQuestCompletion(waterQuest.id);
      }
    }
  };

  // Log Meal (Encapsulated)
  const logMeal = async (meal: Omit<MealEntry, 'id'>) => {
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;
    const toSave: MealEntry = { ...meal, userId: currentUid };
    const id = await db.mealEntries.add(toSave);
    const newMeal = { ...toSave, id };
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

  // Save Workout Session (Encapsulated)
  const saveWorkoutSession = async (workout: WorkoutSession) => {
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;
    workout.userId = currentUid;

    if (workout.id) {
      await db.workoutSessions.put(workout);
    } else {
      const id = await db.workoutSessions.add(workout);
      workout.id = id;
    }
    setTodayWorkout(workout);

    if (workout.completed) {
      const workoutQuest = todayQuests.find(q => q.type === 'workout');
      if (workoutQuest && !workoutQuest.completed && workoutQuest.id) {
        await toggleQuestCompletion(workoutQuest.id);
      }
      await grantXP(XP_VALUES.WORKOUT_COMPLETE, 'Daily Workout Completed');
    }
  };

  // Update Skincare (Encapsulated)
  const updateSkincareStatus = async (morning: boolean, evening: boolean) => {
    const todayStr = getTodayDateString();
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;

    const existingLogs = await db.skincareLogs.where('date').equals(todayStr).toArray();
    const existing = existingLogs.find(l => (l.userId || DEFAULT_USER_ID) === currentUid);

    const newLog: SkincareLog = {
      userId: currentUid,
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

  // Add notification (Encapsulated)
  const addNotification = async (title: string, message: string, type: SystemNotification['type'] = 'SYSTEM') => {
    const currentUid = activeUser?.id || getActiveUserId() || DEFAULT_USER_ID;
    const notif: SystemNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUid,
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
        islandAlert,
        triggerIslandAlert,
        activeUser,
        allUsers,
        switchActiveUser,
        registerHunterUser,
        removeHunterAccount,
        inspectingAlly,
        setInspectingAlly,
        allies,
        generateCurrentSharePayload,
        saveAllyToCircle,
        cheerAlly,
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
