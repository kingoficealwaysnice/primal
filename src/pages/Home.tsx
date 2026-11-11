import React from 'react';
import { HunterStatus } from '../components/dashboard/widgets/HunterStatus';
import { DailyQuests } from '../components/dashboard/widgets/DailyQuests';
import { TodayWorkout } from '../components/dashboard/widgets/TodayWorkout';
import { NutritionStatus } from '../components/dashboard/widgets/NutritionStatus';
import { PhysicalPerformance } from '../components/dashboard/widgets/PhysicalPerformance';
import { SystemNotifications } from '../components/dashboard/widgets/SystemNotifications';

export const Home: React.FC = () => {
  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* 1. Hunter Status Banner */}
      <HunterStatus />

      {/* 2. Today's Workout Widget */}
      <TodayWorkout />

      {/* 3. Daily Quests Interactive Checklist */}
      <DailyQuests />

      {/* 4. Nutrition Circular Status */}
      <NutritionStatus />

      {/* 5. Physical Performance Benchmarks */}
      <PhysicalPerformance />

      {/* 6. System Intelligence Broadcasts */}
      <SystemNotifications />
    </div>
  );
};

