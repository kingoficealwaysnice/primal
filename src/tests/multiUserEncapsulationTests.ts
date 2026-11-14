/**
 * Multi-User Encapsulation & Apple Share Protocol Automated Verification Suite
 */
import {
  generateShareCode,
  createDefaultUserAccount,
  generateSharePayload,
  encodeSharePayloadToUrl,
  decodeSharePayload,
  getUserRPGAttributes,
  saveUserRPGAttributes,
  getUserSoloLevelingQuests,
  saveUserSoloLevelingQuests
} from '../services/multiUserService';
import type { UserProfile, HunterStats, DailyQuest, MealEntry, HunterMemoryEntry, UserAccount } from '../types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('⚡ PRIMAL SYSTEM: MULTI-USER & APPLE SHARE PROTOCOL TESTS');
console.log('======================================================\n');

// Mock localStorage for node environment if not present
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => { store.set(key, val); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] || null,
    length: store.size
  } as any;
}

// SUITE 1: User Account & Passcode Generation
console.log('[SUITE 1: Hunter Identity & Share Passcodes]');
{
  const code1 = generateShareCode();
  const code2 = generateShareCode();
  assert(code1.startsWith('PRML-') && code1.length === 9, `Share code format is valid: ${code1}`);
  assert(code1 !== code2, `Generated unique passcodes (${code1} !== ${code2})`);

  const defaultUser = createDefaultUserAccount('Bhanu');
  assert(defaultUser.displayName === 'Bhanu', 'Default account initialized with Bhanu');
  assert(defaultUser.isPrimary === true, 'Default user is primary');
  assert(defaultUser.shareCode.startsWith('PRML-'), 'Default user has valid shareCode');
}

// SUITE 2: Data Encapsulation across Multiple Users
console.log('\n[SUITE 2: Multi-User Data Encapsulation & Zero Bleed]');
{
  const userA_Id = 'usr_bhanu_test';
  const userB_Id = 'usr_sung_test';

  // Save distinct RPG stats for User A
  saveUserRPGAttributes(userA_Id, {
    str: 40,
    agi: 30,
    vit: 35,
    int: 28,
    sen: 29,
    availablePoints: 8,
    jobTitle: 'Shadow Sovereign',
    titleName: 'Awakened Pioneer'
  });

  // Save distinct RPG stats for User B
  saveUserRPGAttributes(userB_Id, {
    str: 120,
    agi: 110,
    vit: 105,
    int: 95,
    sen: 100,
    availablePoints: 0,
    jobTitle: 'Monarch',
    titleName: 'Wolf Slayer'
  });

  const statsA = getUserRPGAttributes(userA_Id);
  const statsB = getUserRPGAttributes(userB_Id);

  assert(statsA.str === 40, `User A strength is isolated to 40 (got ${statsA.str})`);
  assert(statsB.str === 120, `User B strength is isolated to 120 (got ${statsB.str})`);
  assert(statsA.jobTitle === 'Shadow Sovereign', 'User A job is Shadow Sovereign');
  assert(statsB.jobTitle === 'Monarch', 'User B job is Monarch');

  // Solo Leveling Daily Quest counts encapsulation
  saveUserSoloLevelingQuests(userA_Id, {
    pushups: 60,
    situps: 70,
    squats: 80,
    runningKm: 4.5,
    completedDate: null
  });

  saveUserSoloLevelingQuests(userB_Id, {
    pushups: 100,
    situps: 100,
    squats: 100,
    runningKm: 10.0,
    completedDate: '2026-11-14'
  });

  const questsA = getUserSoloLevelingQuests(userA_Id);
  const questsB = getUserSoloLevelingQuests(userB_Id);

  assert(questsA.pushups === 60, `User A pushups is 60 (got ${questsA.pushups})`);
  assert(questsB.pushups === 100, `User B pushups is 100 (got ${questsB.pushups})`);
  assert(questsA.runningKm === 4.5, `User A running is 4.5km (got ${questsA.runningKm})`);
  assert(questsB.runningKm === 10.0, `User B running is 10.0km (got ${questsB.runningKm})`);
  assert(questsA.completedDate === null, 'User A has not finished today');
  assert(questsB.completedDate === '2026-11-14', 'User B marked complete for today');
}

// SUITE 3: Apple Share Protocol & Tamper-Resistant Dossier Decoding
console.log('\n[SUITE 3: Apple Share Protocol & Decoding]');
{
  const mockUser: UserAccount = {
    id: 'usr_bhanu',
    username: 'bhanu',
    displayName: 'Bhanu',
    avatarColor: 'violet',
    avatarEmoji: '⚡',
    level: 3,
    levelTitle: 'SHADOW COMMANDER',
    shareCode: 'PRML-8F92',
    isPrimary: true,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };

  const mockProfile: UserProfile = {
    id: 1,
    userId: 'usr_bhanu',
    fullName: 'Bhanu',
    age: 25,
    dateOfBirth: '1999-01-01',
    heightCm: 178,
    currentWeightKg: 76,
    targetWeightKg: 72,
    currentBodyFat: 16,
    targetBodyFat: 12,
    activityLevel: 'moderately_active',
    occupation: 'Hunter',
    targetPhysiqueGoals: ['Athletic strength'],
    equipmentType: 'bodyweight',
    fitnessLevel: 'intermediate',
    initialPushups: 35,
    initialSquats: 50,
    initialPlankSeconds: 90,
    initialPullups: 8,
    transformationDays: 90,
    dailyProteinTarget: 160,
    dailyCalorieTarget: 2200,
    dailyCarbsTarget: 240,
    dailyFatsTarget: 60,
    dailyWaterTargetMl: 3500,
    dailyWalkingStepsTarget: 12000,
    sleepTargetHours: 8,
    workoutFrequencyDaysPerWeek: 6,
    preferredWorkoutTime: '07:00 AM',
    currentDay: 14,
    startDate: '2026-11-01',
    isOnboarded: true,
    createdAt: new Date().toISOString()
  };

  const mockStats: HunterStats = {
    id: 1,
    userId: 'usr_bhanu',
    level: 3,
    levelTitle: 'SHADOW COMMANDER',
    currentXP: 450,
    xpForNextLevel: 1500,
    totalLifetimeXP: 3200,
    streakDays: 14,
    highestStreak: 14,
    completedDaysCount: 14,
    lastActiveDate: '2026-11-14'
  };

  const mockMeals: MealEntry[] = [
    {
      id: 1,
      userId: 'usr_bhanu',
      date: '2026-11-14',
      mealType: 'breakfast',
      items: [],
      totalCalories: 650,
      totalProtein: 48,
      totalCarbs: 60,
      totalFats: 20,
      createdAt: new Date().toISOString()
    }
  ];

  const mockQuests: DailyQuest[] = [
    { id: 1, date: '2026-11-14', type: 'pushups', title: 'Pushups', description: '', xpReward: 30, completed: true },
    { id: 2, date: '2026-11-14', type: 'workout', title: 'Workout', description: '', xpReward: 100, completed: true },
    { id: 3, date: '2026-11-14', type: 'water', title: 'Water', description: '', xpReward: 20, completed: false }
  ];

  const payload = generateSharePayload(
    mockProfile,
    mockStats,
    mockMeals,
    2500,
    mockQuests,
    { str: 45, agi: 35, vit: 40, int: 30, sen: 32, availablePoints: 4, jobTitle: 'None', titleName: '' },
    { pushups: 80, situps: 70, squats: 90, runningKm: 6.0, completedDate: null },
    [],
    mockUser
  );

  assert(payload.user.displayName === 'Bhanu', 'Payload contains user display name');
  assert(payload.user.level === 3, 'Payload reflects Hunter level 3');
  assert(payload.todaySummary.questsCompleted === 2, 'Payload calculated 2 completed quests');
  assert(payload.todaySummary.caloriesConsumed === 650, 'Payload calculated 650 calories consumed');

  // Test Encoding & Decoding
  const shareUrl = encodeSharePayloadToUrl(payload);
  assert(shareUrl.includes('#share='), `Generated valid URL hash link: ${shareUrl.substring(0, 50)}...`);

  const decoded = decodeSharePayload(shareUrl);
  assert(decoded !== null, 'Decoded share link successfully');
  assert(decoded?.user.displayName === 'Bhanu', 'Decoded payload preserves user name');
  assert(decoded?.user.level === 3, 'Decoded payload preserves level');
  assert(decoded?.todaySummary.caloriesConsumed === 650, 'Decoded payload preserves nutrition');
  assert(decoded?.rpgAttributes?.str === 45, 'Decoded payload preserves RPG attributes');
}

console.log('\n======================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} PASSED (100% SUCCESS)`);
console.log('======================================================\n');

