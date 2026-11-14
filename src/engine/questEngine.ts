import type { DailyQuest, UserProfile } from '../types';
import { db, getTodayDateString } from '../db/database';

export async function getOrGenerateDailyQuests(profile: UserProfile): Promise<DailyQuest[]> {
  const todayStr = getTodayDateString();
  const userId = profile.userId || 'usr_primary';
  const allDateQuests = await db.dailyQuests.where('date').equals(todayStr).toArray();
  const existingQuests = allDateQuests.filter(q => (q.userId || 'usr_primary') === userId);

  if (existingQuests && existingQuests.length > 0) {
    return existingQuests;
  }

  const pushupTarget = profile.initialPushups ? Math.round(profile.initialPushups * 1.5) : 30;
  const squatTarget = profile.initialSquats ? Math.round(profile.initialSquats * 1.5) : 40;

  const questsToCreate: Omit<DailyQuest, 'id'>[] = [
    {
      userId,
      date: todayStr,
      type: 'workout',
      title: 'Complete Daily Workout Quest',
      description: `Complete today's Phase protocol and log actual performance`,
      xpReward: 100,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'pushups',
      title: `Complete ${pushupTarget} Push-ups`,
      description: 'Accumulate target push-ups throughout your training session',
      xpReward: 30,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'squats',
      title: `Complete ${squatTarget} Squats`,
      description: 'Strengthen quad foundation with deep controlled reps',
      xpReward: 25,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'core',
      title: 'Complete Core & Anti-Rotation Work',
      description: 'Perform plank or bicycle crunch sets for midline stability',
      xpReward: 25,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'walking',
      title: `Hit Walking Goal (${profile.dailyWalkingStepsTarget.toLocaleString()} steps)`,
      description: 'Low-impact cardiovascular conditioning and energy expenditure',
      xpReward: 40,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'protein',
      title: `Hit Daily Protein Target (${profile.dailyProteinTarget}g)`,
      description: 'Supply amino acids for muscle repair and metabolic drive',
      xpReward: 50,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'water',
      title: `Reach Hydration Target (${(profile.dailyWaterTargetMl / 1000).toFixed(1)}L)`,
      description: 'Cellular volumization, joint lubrication, and facial bloat reduction',
      xpReward: 20,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'skincare_am',
      title: 'Complete Morning Skincare Ritual',
      description: 'Cleanser, moisturizer, and broad spectrum SPF 30-50',
      xpReward: 15,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'skincare_pm',
      title: 'Complete Evening Skincare & Stretching',
      description: 'Gentle nighttime cleanse, hydration, and 5-min mobility release',
      xpReward: 15,
      completed: false
    },
    {
      userId,
      date: todayStr,
      type: 'sleep',
      title: `Log ${profile.sleepTargetHours} Hours of Restorative Sleep`,
      description: 'Growth hormone pulse, central nervous system rejuvenation',
      xpReward: 20,
      completed: false
    }
  ];

  const createdQuests: DailyQuest[] = [];
  for (const q of questsToCreate) {
    const id = await db.dailyQuests.add(q as DailyQuest);
    createdQuests.push({ ...q, id });
  }

  return createdQuests;
}

