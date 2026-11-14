import { db } from '../db/database';
import type {
  UserAccount,
  UserProfile,
  HunterStats,
  DailyQuest,
  MealEntry,
  HunterMemoryEntry,
  SharedHunterPayload,
  HunterAlly,
  AvatarColorTheme,
  FitnessLevel,
  EquipmentType
} from '../types';

export const ACTIVE_USER_KEY = 'primal_active_user_id_v2';
export const DEFAULT_USER_ID = 'usr_primary';
const USER_ACCOUNTS_KEY = 'primal_user_accounts_mirror_v2';
const ALLIES_STORAGE_KEY = 'primal_hunter_allies_mirror_v2';

export interface RPGAttributes {
  str: number;
  agi: number;
  vit: number;
  int: number;
  sen: number;
  availablePoints: number;
  jobTitle: string;
  titleName: string;
}

export interface UserSoloLevelingQuests {
  pushups: number;
  situps: number;
  squats: number;
  runningKm: number;
  completedDate: string | null;
}

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  } catch {
    // ignore
  }
  return null;
}

// Generates a clean 8-character Hunter Passcode, e.g. "PRML-7X9B"
export function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PRML-${rand}`;
}

// Get the current active user ID from localStorage
export function getActiveUserId(): string {
  const storage = getStorage();
  if (!storage) return DEFAULT_USER_ID;
  const stored = storage.getItem(ACTIVE_USER_KEY);
  if (!stored) {
    storage.setItem(ACTIVE_USER_KEY, DEFAULT_USER_ID);
    return DEFAULT_USER_ID;
  }
  return stored;
}

// Set the active user ID in localStorage
export function setActiveUserId(userId: string): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ACTIVE_USER_KEY, userId);
}

// Default baseline hunter account
export function createDefaultUserAccount(name: string = 'Bhanu'): UserAccount {
  return {
    id: DEFAULT_USER_ID,
    username: name.toLowerCase().replace(/\s+/g, '_'),
    displayName: name,
    avatarColor: 'violet',
    avatarEmoji: '⚡',
    level: 1,
    levelTitle: 'AWAKENED HUNTER',
    shareCode: 'PRML-E101',
    isPrimary: true,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };
}

// Read mirror accounts from localStorage
function readAccountsMirror(): UserAccount[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(USER_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save mirror accounts to localStorage
function writeAccountsMirror(accounts: UserAccount[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('[MultiUser] Failed to mirror accounts:', err);
  }
}

// Get all registered accounts
export async function listUserAccounts(): Promise<UserAccount[]> {
  try {
    let accounts = await db.userAccounts.toArray();
    if (accounts.length === 0) {
      const mirrored = readAccountsMirror();
      if (mirrored.length > 0) {
        accounts = mirrored;
        await db.userAccounts.bulkPut(accounts);
      } else {
        const defaultAcc = createDefaultUserAccount('Bhanu');
        await db.userAccounts.put(defaultAcc);
        accounts = [defaultAcc];
        writeAccountsMirror(accounts);
      }
    }
    return accounts;
  } catch (err) {
    console.warn('[MultiUser] Error reading userAccounts from Dexie:', err);
    const mirrored = readAccountsMirror();
    return mirrored.length > 0 ? mirrored : [createDefaultUserAccount('Bhanu')];
  }
}

// Get active user account
export async function getActiveUserAccount(): Promise<UserAccount> {
  const activeId = getActiveUserId();
  const all = await listUserAccounts();
  const match = all.find(a => a.id === activeId);
  if (match) return match;
  return all[0] || createDefaultUserAccount('Bhanu');
}

// Register a new user account
export async function registerNewUser(
  displayName: string,
  options?: {
    avatarColor?: AvatarColorTheme;
    avatarEmoji?: string;
    fitnessLevel?: FitnessLevel;
    equipmentType?: EquipmentType;
  }
): Promise<UserAccount> {
  const cleanName = displayName.trim() || 'Hunter';
  const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const shareCode = generateShareCode();

  const newAccount: UserAccount = {
    id: newId,
    username: cleanName.toLowerCase().replace(/\s+/g, '_'),
    displayName: cleanName,
    avatarColor: options?.avatarColor || 'cyan',
    avatarEmoji: options?.avatarEmoji || '🛡️',
    level: 1,
    levelTitle: 'AWAKENED HUNTER',
    shareCode,
    isPrimary: false,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };

  try {
    await db.userAccounts.put(newAccount);
  } catch (err) {
    console.warn('[MultiUser] Dexie put failed, relying on mirror:', err);
  }

  const existing = readAccountsMirror();
  existing.push(newAccount);
  writeAccountsMirror(existing);

  // Initialize RPG stats for new user
  saveUserRPGAttributes(newId, {
    str: 30,
    agi: 25,
    vit: 25,
    int: 20,
    sen: 20,
    availablePoints: 10,
    jobTitle: 'None',
    titleName: 'Awakened Initiate'
  });

  // Initialize Solo Leveling Quests for new user
  saveUserSoloLevelingQuests(newId, {
    pushups: 0,
    situps: 0,
    squats: 0,
    runningKm: 0,
    completedDate: null
  });

  return newAccount;
}

// Delete an account (cannot delete primary)
export async function deleteUserAccount(userId: string): Promise<void> {
  if (userId === DEFAULT_USER_ID) {
    throw new Error('Cannot delete primary Hunter account.');
  }

  try {
    await db.userAccounts.delete(userId);
    // Delete encapsulated user data
    await db.userProfile.where('userId').equals(userId).delete();
    await db.hunterStats.where('userId').equals(userId).delete();
    await db.dailyQuests.where('userId').equals(userId).delete();
    await db.mealEntries.where('userId').equals(userId).delete();
    await db.workoutSessions.where('userId').equals(userId).delete();
    await db.waterEntries.where('userId').equals(userId).delete();
    await db.skincareLogs.where('userId').equals(userId).delete();
    await db.hunterMemories.where('userId').equals(userId).delete();
  } catch (err) {
    console.warn('[MultiUser] Delete error:', err);
  }

  // Remove from localStorage scoped keys
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`sl_stat_${userId}_str`);
    localStorage.removeItem(`sl_stat_${userId}_agi`);
    localStorage.removeItem(`sl_stat_${userId}_vit`);
    localStorage.removeItem(`sl_stat_${userId}_int`);
    localStorage.removeItem(`sl_stat_${userId}_sen`);
    localStorage.removeItem(`sl_stat_${userId}_available`);
    localStorage.removeItem(`sl_stat_${userId}_job`);
    localStorage.removeItem(`sl_stat_${userId}_title`);
    localStorage.removeItem(`primal_sl_quest_${userId}`);
    localStorage.removeItem(`primal_hunter_vault_${userId}`);
  }

  const existing = readAccountsMirror().filter(a => a.id !== userId);
  writeAccountsMirror(existing);

  // If deleted user was active, switch to primary
  if (getActiveUserId() === userId) {
    setActiveUserId(DEFAULT_USER_ID);
  }
}

// Update account information
export async function updateUserAccount(
  userId: string,
  updates: Partial<UserAccount>
): Promise<UserAccount> {
  const accounts = await listUserAccounts();
  const target = accounts.find(a => a.id === userId);
  if (!target) throw new Error(`User ${userId} not found`);

  const updated: UserAccount = {
    ...target,
    ...updates,
    lastActiveAt: new Date().toISOString()
  };

  try {
    await db.userAccounts.put(updated);
  } catch (err) {
    console.warn('[MultiUser] Update error in db:', err);
  }

  const all = readAccountsMirror().map(a => a.id === userId ? updated : a);
  writeAccountsMirror(all);
  return updated;
}

// ==========================================
// SCOPED RPG ATTRIBUTES & QUESTS ENCAPSULATION
// ==========================================

export function getUserRPGAttributes(userId: string = DEFAULT_USER_ID): RPGAttributes {
  const storage = getStorage();
  const fallback: RPGAttributes = {
    str: 35,
    agi: 28,
    vit: 32,
    int: 25,
    sen: 27,
    availablePoints: 12,
    jobTitle: 'None',
    titleName: 'One Who Overcame Adversity'
  };

  if (!storage) return fallback;

  // Check user-scoped key first; fallback to legacy global key for primary user
  const prefix = `sl_stat_${userId}_`;
  const legacyPrefix = 'sl_stat_';

  const readStat = (key: string, defaultVal: number): number => {
    const val = storage.getItem(prefix + key);
    if (val !== null) return parseInt(val, 10);
    if (userId === DEFAULT_USER_ID) {
      const leg = storage.getItem(legacyPrefix + key);
      if (leg !== null) return parseInt(leg, 10);
    }
    return defaultVal;
  };

  const job = storage.getItem(prefix + 'job') ||
    (userId === DEFAULT_USER_ID ? storage.getItem('sl_hunter_job') : null) ||
    'None';

  const title = storage.getItem(prefix + 'title') ||
    (userId === DEFAULT_USER_ID ? storage.getItem('sl_hunter_title') : null) ||
    'One Who Overcame Adversity';

  return {
    str: readStat('str', 35),
    agi: readStat('agi', 28),
    vit: readStat('vit', 32),
    int: readStat('int', 25),
    sen: readStat('sen', 27),
    availablePoints: readStat('available', 12),
    jobTitle: job,
    titleName: title
  };
}

export function saveUserRPGAttributes(userId: string, attrs: Partial<RPGAttributes>): void {
  const storage = getStorage();
  if (!storage) return;
  const prefix = `sl_stat_${userId}_`;
  if (attrs.str !== undefined) storage.setItem(prefix + 'str', String(attrs.str));
  if (attrs.agi !== undefined) storage.setItem(prefix + 'agi', String(attrs.agi));
  if (attrs.vit !== undefined) storage.setItem(prefix + 'vit', String(attrs.vit));
  if (attrs.int !== undefined) storage.setItem(prefix + 'int', String(attrs.int));
  if (attrs.sen !== undefined) storage.setItem(prefix + 'sen', String(attrs.sen));
  if (attrs.availablePoints !== undefined) storage.setItem(prefix + 'available', String(attrs.availablePoints));
  if (attrs.jobTitle !== undefined) storage.setItem(prefix + 'job', attrs.jobTitle);
  if (attrs.titleName !== undefined) storage.setItem(prefix + 'title', attrs.titleName);
}

export function getUserSoloLevelingQuests(userId: string = DEFAULT_USER_ID): UserSoloLevelingQuests {
  const fallback: UserSoloLevelingQuests = { pushups: 0, situps: 0, squats: 0, runningKm: 0, completedDate: null };
  const storage = getStorage();
  if (!storage) return fallback;

  const scopedKey = `primal_sl_quest_${userId}`;
  const legacyKey = 'primal_sl_quest_state_v1';

  let raw = storage.getItem(scopedKey);
  if (!raw && userId === DEFAULT_USER_ID) {
    raw = storage.getItem(legacyKey);
  }

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore parse error
    }
  }

  return fallback;
}

export function saveUserSoloLevelingQuests(
  userId: string,
  quests: UserSoloLevelingQuests
): void {
  const storage = getStorage();
  if (!storage) return;
  const scopedKey = `primal_sl_quest_${userId}`;
  storage.setItem(scopedKey, JSON.stringify(quests));
}

// ==========================================
// SHARE PROTOCOL & ALLY INSPECTION HUB
// ==========================================

export function generateSharePayload(
  userProfile: UserProfile,
  hunterStats: HunterStats,
  todayMeals: MealEntry[],
  todayWaterMl: number,
  todayQuests: DailyQuest[],
  rpgAttributes: RPGAttributes,
  soloQuests: UserSoloLevelingQuests,
  memories: HunterMemoryEntry[],
  account: UserAccount
): SharedHunterPayload {
  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const proteinConsumed = todayMeals.reduce((sum, m) => sum + m.totalProtein, 0);
  const questsCompleted = todayQuests.filter(q => q.completed).length;

  return {
    shareVersion: '2.0',
    shareCode: account.shareCode,
    sharedAt: new Date().toISOString(),
    user: {
      id: account.id,
      displayName: account.displayName,
      avatarColor: account.avatarColor,
      avatarEmoji: account.avatarEmoji,
      level: hunterStats.level,
      levelTitle: hunterStats.levelTitle,
      streakDays: hunterStats.streakDays,
      highestStreak: hunterStats.highestStreak,
      totalLifetimeXP: hunterStats.totalLifetimeXP,
      currentDay: userProfile.currentDay,
      fitnessLevel: userProfile.fitnessLevel,
      equipmentType: userProfile.equipmentType
    },
    todaySummary: {
      date: new Date().toISOString().split('T')[0],
      questsCompleted,
      totalQuests: todayQuests.length || 7,
      caloriesConsumed,
      caloriesTarget: userProfile.dailyCalorieTarget || 2100,
      proteinConsumed,
      proteinTarget: userProfile.dailyProteinTarget || 140,
      waterConsumedMl: todayWaterMl,
      waterTargetMl: userProfile.dailyWaterTargetMl || 3000,
      soloLevelingQuests: {
        pushups: soloQuests.pushups,
        situps: soloQuests.situps,
        squats: soloQuests.squats,
        runningKm: soloQuests.runningKm,
        completed: soloQuests.completedDate === new Date().toISOString().split('T')[0]
      }
    },
    rpgAttributes: {
      str: rpgAttributes.str,
      agi: rpgAttributes.agi,
      vit: rpgAttributes.vit,
      int: rpgAttributes.int,
      sen: rpgAttributes.sen,
      availablePoints: rpgAttributes.availablePoints
    },
    recentMemories: memories.slice(0, 3).map(m => ({
      title: m.title,
      content: m.content.substring(0, 160) + (m.content.length > 160 ? '...' : ''),
      category: m.category,
      date: m.date
    })),
    cheerCount: 0
  };
}

// Encode payload to URL hash for 1-click sharing
export function encodeSharePayloadToUrl(payload: SharedHunterPayload): string {
  try {
    const jsonStr = JSON.stringify(payload);
    // Use URL-safe Base64 encoding
    const b64 = btoa(encodeURIComponent(jsonStr));
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://primal-system.app';
    return `${baseUrl}#share=${b64}`;
  } catch (err) {
    console.error('Failed to encode share payload:', err);
    return '';
  }
}

// Decode payload from string (URL hash or JSON string or raw base64)
export function decodeSharePayload(input: string): SharedHunterPayload | null {
  try {
    let clean = input.trim();
    if (clean.includes('#share=')) {
      clean = clean.split('#share=')[1];
    } else if (clean.includes('?share=')) {
      clean = clean.split('?share=')[1];
    }

    // Try parsing as raw JSON first
    if (clean.startsWith('{') && clean.endsWith('}')) {
      const obj = JSON.parse(clean);
      if (obj.user && obj.todaySummary) return obj as SharedHunterPayload;
    }

    // Decode base64
    const decoded = decodeURIComponent(atob(clean));
    const obj = JSON.parse(decoded);
    if (obj.user && obj.todaySummary) {
      return obj as SharedHunterPayload;
    }
  } catch (err) {
    console.warn('[MultiUser] Failed to decode share payload:', err);
  }
  return null;
}

// Check if current URL contains a shared profile on page load
export function getSharedPayloadFromCurrentUrl(): SharedHunterPayload | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (hash.includes('share=')) {
    return decodeSharePayload(hash);
  }
  const search = window.location.search;
  if (search.includes('share=')) {
    return decodeSharePayload(search);
  }
  return null;
}

// Ally Circle: Save an ally's dossier for later viewing
export async function getSavedAllies(): Promise<HunterAlly[]> {
  try {
    const list = await db.hunterAllies.toArray();
    if (list.length > 0) return list;
  } catch {
    // fallback
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(ALLIES_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  // Pre-seed an awesome rival ally: Sung Jin-woo
  const defaultAlly: HunterAlly = {
    id: 'ally_shadow_monarch',
    shareCode: 'PRML-S999',
    displayName: 'Sung Jin-woo',
    avatarColor: 'violet',
    avatarEmoji: '🗡️',
    level: 10,
    levelTitle: 'SHADOW MONARCH',
    streakDays: 45,
    cheersGiven: 12,
    lastInspectedAt: new Date().toISOString(),
    payload: {
      shareVersion: '2.0',
      shareCode: 'PRML-S999',
      sharedAt: new Date().toISOString(),
      user: {
        id: 'ally_shadow_monarch',
        displayName: 'Sung Jin-woo',
        avatarColor: 'violet',
        avatarEmoji: '🗡️',
        level: 10,
        levelTitle: 'SHADOW MONARCH',
        streakDays: 45,
        highestStreak: 45,
        totalLifetimeXP: 99990,
        currentDay: 45,
        fitnessLevel: 'advanced',
        equipmentType: 'bodyweight'
      },
      todaySummary: {
        date: new Date().toISOString().split('T')[0],
        questsCompleted: 7,
        totalQuests: 7,
        caloriesConsumed: 3200,
        caloriesTarget: 3200,
        proteinConsumed: 210,
        proteinTarget: 200,
        waterConsumedMl: 4000,
        waterTargetMl: 3500,
        soloLevelingQuests: {
          pushups: 100,
          situps: 100,
          squats: 100,
          runningKm: 10,
          completed: true
        }
      },
      rpgAttributes: {
        str: 140,
        agi: 130,
        vit: 125,
        int: 120,
        sen: 135,
        availablePoints: 0
      },
      recentMemories: [
        {
          title: 'Daily Training Trial Conquered',
          content: '100 pushups, 100 situps, 100 squats, and a 10km run completed before sunrise. The body adapts through discipline.',
          category: 'workout',
          date: new Date().toISOString().split('T')[0]
        }
      ],
      cheerCount: 42
    }
  };

  return [defaultAlly];
}

export async function saveHunterAlly(payload: SharedHunterPayload): Promise<HunterAlly> {
  const ally: HunterAlly = {
    id: payload.user.id || `ally_${Date.now()}`,
    shareCode: payload.shareCode,
    displayName: payload.user.displayName,
    avatarColor: payload.user.avatarColor,
    avatarEmoji: payload.user.avatarEmoji,
    level: payload.user.level,
    levelTitle: payload.user.levelTitle,
    streakDays: payload.user.streakDays,
    cheersGiven: 0,
    lastInspectedAt: new Date().toISOString(),
    payload
  };

  try {
    await db.hunterAllies.put(ally);
  } catch (err) {
    console.warn('[MultiUser] Failed to save ally to Dexie:', err);
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = await getSavedAllies();
      const filtered = existing.filter(a => a.id !== ally.id && a.shareCode !== ally.shareCode);
      filtered.unshift(ally);
      localStorage.setItem(ALLIES_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }

  return ally;
}

export async function cheerHunterAlly(allyId: string): Promise<number> {
  let count = 1;
  try {
    const ally = await db.hunterAllies.get(allyId);
    if (ally) {
      ally.cheersGiven = (ally.cheersGiven || 0) + 1;
      count = ally.cheersGiven;
      await db.hunterAllies.put(ally);
    }
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = await getSavedAllies();
      const match = existing.find(a => a.id === allyId);
      if (match) {
        match.cheersGiven = (match.cheersGiven || 0) + 1;
        count = match.cheersGiven;
        localStorage.setItem(ALLIES_STORAGE_KEY, JSON.stringify(existing));
      }
    } catch {
      // ignore
    }
  }

  return count;
}
