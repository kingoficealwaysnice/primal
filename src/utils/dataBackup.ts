import { db } from '../db/database';

export async function exportAllData(): Promise<void> {
  const profile = await db.userProfile.toArray();
  const quests = await db.dailyQuests.toArray();
  const meals = await db.mealEntries.toArray();
  const workouts = await db.workoutSessions.toArray();
  const measurements = await db.bodyMeasurements.toArray();
  const water = await db.waterEntries.toArray();
  const sleep = await db.sleepEntries.toArray();
  const skincare = await db.skincareLogs.toArray();
  const products = await db.skincareProducts.toArray();
  const stats = await db.hunterStats.toArray();
  const achievements = await db.achievements.toArray();
  const notifications = await db.notifications.toArray();
  const history = await db.exerciseHistory.toArray();
  const reports = await db.dailyReports.toArray();

  const backupPayload = {
    appName: 'PRIMAL SYSTEM',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      profile,
      quests,
      meals,
      workouts,
      measurements,
      water,
      sleep,
      skincare,
      products,
      stats,
      achievements,
      notifications,
      history,
      reports
    }
  };

  const json = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `primal-system-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importData(jsonString: string): Promise<void> {
  const parsed = JSON.parse(jsonString);
  if (!parsed.data) {
    throw new Error('Invalid PRIMAL SYSTEM backup format');
  }

  const { data } = parsed;

  await db.transaction('rw', [
    db.userProfile,
    db.dailyQuests,
    db.mealEntries,
    db.workoutSessions,
    db.bodyMeasurements,
    db.waterEntries,
    db.sleepEntries,
    db.skincareLogs,
    db.skincareProducts,
    db.hunterStats,
    db.achievements,
    db.notifications,
    db.exerciseHistory,
    db.dailyReports
  ], async () => {
    if (data.profile) {
      await db.userProfile.clear();
      await db.userProfile.bulkAdd(data.profile);
    }
    if (data.quests) {
      await db.dailyQuests.clear();
      await db.dailyQuests.bulkAdd(data.quests);
    }
    if (data.meals) {
      await db.mealEntries.clear();
      await db.mealEntries.bulkAdd(data.meals);
    }
    if (data.workouts) {
      await db.workoutSessions.clear();
      await db.workoutSessions.bulkAdd(data.workouts);
    }
    if (data.measurements) {
      await db.bodyMeasurements.clear();
      await db.bodyMeasurements.bulkAdd(data.measurements);
    }
    if (data.water) {
      await db.waterEntries.clear();
      await db.waterEntries.bulkAdd(data.water);
    }
    if (data.sleep) {
      await db.sleepEntries.clear();
      await db.sleepEntries.bulkAdd(data.sleep);
    }
    if (data.skincare) {
      await db.skincareLogs.clear();
      await db.skincareLogs.bulkAdd(data.skincare);
    }
    if (data.products) {
      await db.skincareProducts.clear();
      await db.skincareProducts.bulkAdd(data.products);
    }
    if (data.stats) {
      await db.hunterStats.clear();
      await db.hunterStats.bulkAdd(data.stats);
    }
    if (data.achievements) {
      await db.achievements.clear();
      await db.achievements.bulkAdd(data.achievements);
    }
    if (data.notifications) {
      await db.notifications.clear();
      await db.notifications.bulkAdd(data.notifications);
    }
    if (data.history) {
      await db.exerciseHistory.clear();
      await db.exerciseHistory.bulkAdd(data.history);
    }
    if (data.reports) {
      await db.dailyReports.clear();
      await db.dailyReports.bulkAdd(data.reports);
    }
  });
}

export async function resetAllData(): Promise<void> {
  await db.userProfile.clear();
  await db.dailyQuests.clear();
  await db.mealEntries.clear();
  await db.workoutSessions.clear();
  await db.bodyMeasurements.clear();
  await db.waterEntries.clear();
  await db.sleepEntries.clear();
  await db.skincareLogs.clear();
  await db.skincareProducts.clear();
  await db.hunterStats.clear();
  await db.achievements.clear();
  await db.physiquePhotos.clear();
  await db.notifications.clear();
  await db.exerciseHistory.clear();
  await db.dailyReports.clear();
}

