import { db, getTodayDateString } from '../db/database';
import type { UserProfile, HunterStats } from '../types';
import { getActiveUserId, DEFAULT_USER_ID } from './multiUserService';

const SNAPSHOT_KEY = 'primal_hunter_vault_snapshot_v1';
const SL_QUEST_KEY = 'primal_sl_quest_state_v1';

const getScopedSnapshotKey = (userId?: string) => {
  const uid = userId || getActiveUserId() || DEFAULT_USER_ID;
  return `primal_hunter_vault_${uid}`;
};

const getScopedSLKey = (userId?: string) => {
  const uid = userId || getActiveUserId() || DEFAULT_USER_ID;
  return `primal_sl_quest_${uid}`;
};

export interface PersistentSnapshot {
  userProfile: UserProfile | null;
  hunterStats: HunterStats | null;
  slQuests: {
    pushups: number;
    situps: number;
    squats: number;
    runningKm: number;
    completedDate: string | null;
  };
  lastSavedAt: string;
}

// Request persistent storage from browser (iOS Safari & Chrome)
export async function enablePersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        const granted = await navigator.storage.persist();
        console.log('[PRIMAL SYSTEM] Storage persistence granted:', granted);
        return granted;
      }
      return true;
    }
  } catch (err) {
    console.warn('[PRIMAL SYSTEM] Could not request storage persistence:', err);
  }
  return false;
}

// Save complete system snapshot to localStorage mirror (scoped to user)
export function saveVaultSnapshot(
  profile: UserProfile | null,
  stats: HunterStats | null,
  slQuests?: {
    pushups: number;
    situps: number;
    squats: number;
    runningKm: number;
    completedDate: string | null;
  },
  userId?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const targetUserId = userId || profile?.userId || getActiveUserId() || DEFAULT_USER_ID;
    const existingQuests = getSavedSoloLevelingQuests(targetUserId);
    const payload: PersistentSnapshot = {
      userProfile: profile,
      hunterStats: stats,
      slQuests: slQuests || existingQuests,
      lastSavedAt: new Date().toISOString()
    };
    
    // Save to user-scoped key
    localStorage.setItem(getScopedSnapshotKey(targetUserId), JSON.stringify(payload));

    // Also mirror to legacy key if primary user for backward compatibility
    if (targetUserId === DEFAULT_USER_ID) {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(payload));
    }
  } catch (err) {
    console.warn('[PRIMAL SYSTEM] Failed to write vault snapshot:', err);
  }
}

// Clear vault snapshot (when user deliberately resets data)
export function clearVaultSnapshot(userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const targetUserId = userId || getActiveUserId() || DEFAULT_USER_ID;
    localStorage.removeItem(getScopedSnapshotKey(targetUserId));
    localStorage.removeItem(getScopedSLKey(targetUserId));
    if (targetUserId === DEFAULT_USER_ID) {
      localStorage.removeItem(SNAPSHOT_KEY);
      localStorage.removeItem(SL_QUEST_KEY);
    }
  } catch (err) {
    console.warn('[PRIMAL SYSTEM] Failed to clear vault snapshot:', err);
  }
}

// Load vault snapshot from localStorage mirror (scoped to user)
export function loadVaultSnapshot(userId?: string): PersistentSnapshot | null {
  if (typeof window === 'undefined') return null;

  try {
    const targetUserId = userId || getActiveUserId() || DEFAULT_USER_ID;
    const scopedRaw = localStorage.getItem(getScopedSnapshotKey(targetUserId));
    if (scopedRaw) return JSON.parse(scopedRaw);

    // Fallback to legacy global key if primary
    if (targetUserId === DEFAULT_USER_ID) {
      const legacyRaw = localStorage.getItem(SNAPSHOT_KEY);
      if (legacyRaw) return JSON.parse(legacyRaw);
    }
    return null;
  } catch (err) {
    console.warn('[PRIMAL SYSTEM] Failed to parse vault snapshot:', err);
    return null;
  }
}

// Save Solo Leveling 4 core quest state
export function saveSoloLevelingQuests(
  pushups: number,
  situps: number,
  squats: number,
  runningKm: number,
  completedDate: string | null,
  userId?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const targetUserId = userId || getActiveUserId() || DEFAULT_USER_ID;
    const state = { pushups, situps, squats, runningKm, completedDate };
    localStorage.setItem(getScopedSLKey(targetUserId), JSON.stringify(state));

    if (targetUserId === DEFAULT_USER_ID) {
      localStorage.setItem(SL_QUEST_KEY, JSON.stringify(state));
      localStorage.setItem('sl_quest_pushups', String(pushups));
      localStorage.setItem('sl_quest_situps', String(situps));
      localStorage.setItem('sl_quest_squats', String(squats));
      localStorage.setItem('sl_quest_running', String(runningKm));
      if (completedDate) {
        localStorage.setItem('sl_quest_completed_today', completedDate);
      }
    }
  } catch (err) {
    console.warn('[PRIMAL SYSTEM] Failed to save SL quest state:', err);
  }
}

// Retrieve Solo Leveling quest state
export function getSavedSoloLevelingQuests(userId?: string): {
  pushups: number;
  situps: number;
  squats: number;
  runningKm: number;
  completedDate: string | null;
} {
  const fallback = {
    pushups: 50,
    situps: 50,
    squats: 50,
    runningKm: 5.0,
    completedDate: null
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const targetUserId = userId || getActiveUserId() || DEFAULT_USER_ID;
    const scopedRaw = localStorage.getItem(getScopedSLKey(targetUserId));
    if (scopedRaw) return JSON.parse(scopedRaw);

    if (targetUserId === DEFAULT_USER_ID) {
      const raw = localStorage.getItem(SL_QUEST_KEY);
      if (raw) return JSON.parse(raw);

      const p = localStorage.getItem('sl_quest_pushups');
      const s = localStorage.getItem('sl_quest_situps');
      const sq = localStorage.getItem('sl_quest_squats');
      const r = localStorage.getItem('sl_quest_running');
      const c = localStorage.getItem('sl_quest_completed_today');

      return {
        pushups: p ? parseInt(p, 10) : 50,
        situps: s ? parseInt(s, 10) : 50,
        squats: sq ? parseInt(sq, 10) : 50,
        runningKm: r ? parseFloat(r) : 5.0,
        completedDate: c || null
      };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

// Restore default profile if completely empty so user is never reset or blocked
export function createDefaultAwakenedProfile(name: string = 'Bhanu'): UserProfile {
  return {
    fullName: name,
    age: 25,
    dateOfBirth: '1999-01-01',
    gender: 'Male',
    heightCm: 178,
    currentWeightKg: 78,
    targetWeightKg: 72,
    currentBodyFat: 18,
    targetBodyFat: 12,
    activityLevel: 'moderately_active',
    occupation: 'Hunter',
    targetPhysiqueGoals: [
      'Lean athletic physique',
      'Visible abs',
      'Reduced overall body fat',
      'Improved facial definition'
    ],
    equipmentType: 'bodyweight',
    fitnessLevel: 'intermediate',
    initialPushups: 30,
    initialSquats: 40,
    initialPlankSeconds: 60,
    initialPullups: 5,
    transformationDays: 90,
    dailyCalorieTarget: 2150,
    dailyProteinTarget: 155,
    dailyCarbsTarget: 220,
    dailyFatsTarget: 60,
    dailyWaterTargetMl: 3200,
    dailyWalkingStepsTarget: 10000,
    sleepTargetHours: 8,
    workoutFrequencyDaysPerWeek: 6,
    preferredWorkoutTime: 'Morning (07:00 AM)',
    currentDay: 1,
    startDate: getTodayDateString(),
    isOnboarded: true,
    createdAt: new Date().toISOString()
  };
}
