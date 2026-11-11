import { calculateNutritionTargets, calculateWalkingCalories, estimateWalkingForCalories, sanitizeBiometrics } from '../engine/calorieEngine';
import { parseNaturalLanguageMeal, FOOD_DATABASE } from '../data/foodDatabase';
import { getLevelDetails, calculateNewStats, HUNTER_LEVELS } from '../engine/xpEngine';
import { generateDailyWorkout, getPhaseInfo } from '../engine/workoutEngine';
import { mapGooglePayloadToUser, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../services/googleAuth';
import { MEMORY_CATEGORIES } from '../engine/memoryEngine';
import type { HunterStats } from '../types';

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
console.log('⚡ PRIMAL SYSTEM: EXTREME LEVEL EDGE & PARAMETER TESTS');
console.log('======================================================\n');

// SUITE 1: Calorie & Biometric Engine Extreme Boundaries
console.log('[SUITE 1: Calorie & Biometric Safety Bounds]');
{
  // 1. Extreme low weight
  const low = calculateNutritionTargets(25, 90, 12, 'female', 'sedentary', ['fat loss']);
  assert(low.recommendedCalories >= 1200, 'Extreme low weight enforces female safe floor >= 1200 kcal');
  assert(low.recommendedProteinGrams >= 60, 'Enforces safe minimum protein floor >= 60g');

  // 2. Extreme high weight
  const high = calculateNutritionTargets(260, 230, 85, 'male', 'extra_active', ['muscle']);
  assert(high.recommendedCalories <= 5500, 'Extreme high weight caps at physiological maximum <= 5500 kcal');
  assert(high.recommendedProteinGrams <= 320, 'Caps maximum protein at 320g for renal safety');

  // 3. Negative and NaN inputs
  const nanSanitized = sanitizeBiometrics(NaN, -150, Infinity);
  assert(nanSanitized.weight === 70, 'NaN weight safely defaults to 70kg');
  assert(nanSanitized.height === 175, 'Negative height safely defaults to 175cm');
  assert(nanSanitized.age === 25, 'Infinity age safely defaults to 25 years');

  // 4. Walking calorie calculations
  const walkZero = calculateWalkingCalories(0, 0);
  assert(walkZero === 0, 'Zero weight and zero duration returns 0 kcal');
  const walkNormal = calculateWalkingCalories(80, 60, 'brisk');
  assert(walkNormal > 300 && walkNormal < 400, `Brisk 60 min walk for 80kg yields realistic ~344 kcal (got ${walkNormal})`);

  // 5. Walking time division by zero
  const estZero = estimateWalkingForCalories(0, 0);
  assert(estZero.normalMinutes === 0, 'Estimate walking for 0 kcal returns 0 minutes');
}

// SUITE 2: Natural Language Food Parser Extremes
console.log('\n[SUITE 2: Natural Language Food Parser Robustness]');
{
  // 1. Classic Solo Leveling breakfast
  const p1 = parseNaturalLanguageMeal('4 boiled eggs, 2 slices of brown bread and one banana');
  assert(p1.items.length === 3, 'Accurately parsed exactly 3 food items');
  assert(p1.items[0].name.toLowerCase().includes('egg'), 'Item 1 correctly identified as Egg');
  assert(p1.items[0].protein >= 24, `4 eggs yields >= 24g protein (got ${p1.items[0].protein}g)`);

  // 2. Fractional quantities
  const p2 = parseNaturalLanguageMeal('1/2 cup white rice with 1.5 scoops whey protein');
  assert(p2.items.length === 2, 'Parsed fractional cup and decimal scoops');
  assert(p2.items.some(i => i.name.includes('Whey') && i.protein >= 30), 'Whey scoop correctly scaled');

  // 3. Indian cuisine items
  const p3 = parseNaturalLanguageMeal('2 rotis, 1 katori dal, and 100g paneer');
  assert(p3.items.length === 3, 'Successfully identified Roti, Dal, and Paneer');

  // 4. Garbage / Emoji / Malicious strings
  const p4 = parseNaturalLanguageMeal('   <script>alert(1)</script> 🍕🔥   ');
  assert(Array.isArray(p4.items), 'Handled malicious script tags and emojis safely');

  // 5. Empty / whitespace string
  const p5 = parseNaturalLanguageMeal('     ');
  assert(p5.items.length === 0, 'Empty whitespace input returns empty array with 0 throws');

  // 6. Unknown fantasy food fallback
  const p6 = parseNaturalLanguageMeal('elixir of raw shadow mana');
  assert(p6.items.length === 1 && p6.items[0].isEstimated === true, 'Unknown item flagged with transparent isEstimated=true');
}

// SUITE 3: XP & 10 Hunter Levels Progression
console.log('\n[SUITE 3: XP & Hunter Leveling Boundaries]');
{
  // Level 1 boundary
  const l1 = getLevelDetails(0);
  assert(l1.level === 1 && l1.title === 'AWAKENED', '0 XP starts at LEVEL 1: AWAKENED');

  // Level 2 boundary
  const l2 = getLevelDetails(500);
  assert(l2.level === 2 && l2.title === 'DISCIPLINED', '500 XP ascends to LEVEL 2: DISCIPLINED');

  // Level 10 Cap
  const l10 = getLevelDetails(45000);
  assert(l10.level === 10 && l10.title === 'TRANSCENDENT' && l10.isMaxLevel === true, '45,000 XP reaches LEVEL 10: TRANSCENDENT');

  // XP Overflow test
  const initialStats: HunterStats = {
    level: 1,
    levelTitle: 'AWAKENED',
    currentXP: 450,
    xpForNextLevel: 500,
    totalLifetimeXP: 450,
    streakDays: 3,
    highestStreak: 3,
    completedDaysCount: 3,
    lastActiveDate: '2026-11-12'
  };
  const { updatedStats, didLevelUp } = calculateNewStats(initialStats, 100);
  assert(didLevelUp === true, 'Gaining 100 XP at 450/500 triggers level up');
  assert(updatedStats.level === 2, 'Updated stats level is now LEVEL 2');
}

// SUITE 4: 90-Day Workout Engine & Cycles
console.log('\n[SUITE 4: 90-Day Workout Progression]');
{
  // Day 1 Push-up Challenge
  const d1 = generateDailyWorkout(1, 'beginner', 'bodyweight', 20);
  assert(d1.dayNumber === 1, 'Day 1 session generated');
  assert(d1.phaseNumber === 1, 'Phase 1 Awakening verified');
  assert(d1.exercises.some(e => e.exerciseId === 'pushup_regular'), 'Includes foundational Push-up protocol');

  // Day 7 Recovery Protocol
  const d7 = generateDailyWorkout(7, 'intermediate', 'bodyweight', 30);
  assert(d7.title.includes('RECOVERY'), 'Day 7 correctly triggers System Regeneration Recovery Day');

  // Phase 2 Evolution
  const d35 = generateDailyWorkout(35, 'intermediate', 'bodyweight', 30);
  assert(d35.phaseNumber === 2 && d35.phaseName === 'EVOLUTION', 'Day 35 is in Phase 2 Evolution');

  // Phase 3 Primal Form
  const d70 = generateDailyWorkout(70, 'advanced', 'bodyweight', 40);
  assert(d70.phaseNumber === 3 && d70.phaseName === 'PRIMAL FORM', 'Day 70 is in Phase 3 Primal Form');

  // Dumbbell mode exercise integration
  const d1_db = generateDailyWorkout(1, 'intermediate', 'dumbbell', 30);
  assert(d1_db.equipmentMode === 'dumbbell', 'Dumbbell mode properly flagged');
}

// SUITE 5: Google OAuth & Hunter Memory Vault Engine
console.log('\n[SUITE 5: Google OAuth & Hunter Memory Vault]');
{
  // 1. Google OAuth Payload Mapping & Verification
  const mockPayload = {
    sub: '10987654321',
    email: 'jinwoo@hunterguild.com',
    name: 'Sung Jin-woo',
    given_name: 'Jin-woo',
    family_name: 'Sung',
    picture: 'https://example.com/jinwoo.png',
    email_verified: true
  };
  const mappedUser = mapGooglePayloadToUser(mockPayload, 'mock_token');
  assert(mappedUser.id === '10987654321', 'Google Sub mapped to user id');
  assert(mappedUser.email === 'jinwoo@hunterguild.com', 'Google email mapped');
  assert(mappedUser.name === 'Sung Jin-woo', 'Google full name mapped');
  assert(mappedUser.verifiedEmail === true, 'Google email verification preserved');

  // 2. Memory categories verification
  assert(MEMORY_CATEGORIES.length >= 6, 'Memory categories defined (Reflection, Milestone, Mindset, Workout, etc.)');
  assert(MEMORY_CATEGORIES.some(c => c.id === 'reflection'), 'Reflection category supported');
  assert(MEMORY_CATEGORIES.some(c => c.id === 'milestone'), 'Milestone category supported');
}

console.log('\n======================================================');
console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

