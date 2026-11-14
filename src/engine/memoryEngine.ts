import { db, getTodayDateString } from '../db/database';
import type { HunterMemoryEntry, MemoryCategory } from '../types';

export const MEMORY_CATEGORIES: { id: MemoryCategory; label: string; icon: string; color: string }[] = [
  { id: 'reflection', label: 'Reflection', icon: 'BookOpen', color: '#C084FC' },
  { id: 'milestone', label: 'Milestone', icon: 'Award', color: '#27E58C' },
  { id: 'mindset', label: 'Mindset', icon: 'Brain', color: '#00D4FF' },
  { id: 'workout', label: 'Workout PR', icon: 'Dumbbell', color: '#FFB547' },
  { id: 'physique', label: 'Physique Note', icon: 'Sparkles', color: '#FF5263' },
  { id: 'nutrition', label: 'Nutrition Insight', icon: 'Apple', color: '#10B981' }
];

// Add a new memory entry
export async function addHunterMemory(
  title: string,
  content: string,
  category: MemoryCategory = 'reflection',
  tags: string[] = [],
  dayNumber: number = 1,
  moodScore: number = 5,
  energyLevel: number = 5,
  userId?: string
): Promise<HunterMemoryEntry> {
  const todayStr = getTodayDateString();
  const xpAwarded = 50; // Reflection XP

  const memory: HunterMemoryEntry = {
    userId,
    date: todayStr,
    dayNumber,
    title: title.trim(),
    content: content.trim(),
    category,
    tags,
    moodScore,
    energyLevel,
    xpAwarded,
    createdAt: new Date().toISOString()
  };

  const id = await db.hunterMemories.add(memory);
  memory.id = id;
  return memory;
}

// Get all memories ordered by most recent (optionally filtered by user)
export async function getAllHunterMemories(userId?: string): Promise<HunterMemoryEntry[]> {
  if (userId) {
    const list = await db.hunterMemories.where('userId').equals(userId).toArray();
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return await db.hunterMemories.orderBy('createdAt').reverse().toArray();
}

// Get memories for a specific date or day
export async function getMemoriesForDay(dayNumber: number, userId?: string): Promise<HunterMemoryEntry[]> {
  const list = await db.hunterMemories.where('dayNumber').equals(dayNumber).toArray();
  if (userId) {
    return list.filter(m => !m.userId || m.userId === userId);
  }
  return list;
}

// Delete memory entry
export async function deleteHunterMemory(id: number): Promise<void> {
  await db.hunterMemories.delete(id);
}

// Seed initial memory entry if empty for user
export async function seedInitialMemoryIfEmpty(userName: string, userId?: string): Promise<void> {
  let count = 0;
  if (userId) {
    count = await db.hunterMemories.where('userId').equals(userId).count();
  } else {
    count = await db.hunterMemories.count();
  }

  if (count === 0) {
    await db.hunterMemories.add({
      userId,
      date: getTodayDateString(),
      dayNumber: 1,
      title: 'The Awakening: Day 01',
      content: `The transformation has begun. Protocol active. Rebuilding physical vessel with pure discipline. Hunter ${userName || 'Awakened'} accepts the 90-day challenge.`,
      category: 'milestone',
      tags: ['#Awakening', '#Day1', '#Discipline', '#PrimalSystem'],
      moodScore: 5,
      energyLevel: 5,
      xpAwarded: 50,
      createdAt: new Date().toISOString()
    });
  }
}

