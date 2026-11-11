import React from 'react';
import { useAppStore } from '../../../context/AppContext';
import { Card } from '../../ui/Card';
import { ShieldAlert, Zap, HeartPulse, CheckCircle } from 'lucide-react';

export const SystemNotifications: React.FC = () => {
  const { userProfile, todayMeals, todayWorkout, todayQuests } = useAppStore();

  const totalProtein = todayMeals.reduce((sum, m) => sum + m.totalProtein, 0);
  const proteinTarget = userProfile?.dailyProteinTarget || 140;
  const isProteinLow = totalProtein < proteinTarget * 0.5;

  const incompleteQuests = todayQuests.filter(q => !q.completed).length;

  return (
    <Card
      title="SYSTEM INTELLIGENCE BROADCAST"
      subtitle="Real-time protocol feedback & tactical guidance"
      glow="none"
    >
      <div className="space-y-2 text-xs">
        {/* Quest Broadcast */}
        <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#00D4FF] font-bold">
                [QUEST ADVISORY]
              </span>
              <span className="text-[10px] text-[#929DB5]">PRIORITY NORMAL</span>
            </div>
            <p className="text-[#F5F7FF] mt-0.5 leading-relaxed">
              {incompleteQuests > 0
                ? `${incompleteQuests} daily quests awaiting completion today. Execute to secure character XP.`
                : 'All daily quests cleared. Maximum XP rewards unlocked for this cycle.'}
            </p>
          </div>
        </div>

        {/* Protein Alert */}
        {isProteinLow && (
          <div className="p-3 rounded-xl bg-[#101626] border border-[#FFB547]/30 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#FFB547] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-[#FFB547] font-bold">
                  [PROTEIN ADVISORY]
                </span>
                <span className="text-[10px] text-[#FFB547]">SUB-THRESHOLD</span>
              </div>
              <p className="text-[#F5F7FF] mt-0.5 leading-relaxed">
                You are currently {Math.round(proteinTarget - totalProtein)}g below your daily target. Prioritize eggs, paneer, chicken, or whey protein in your next meal.
              </p>
            </div>
          </div>
        )}

        {/* Workout Alert */}
        <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20 flex items-start gap-2.5">
          <HeartPulse className="w-4 h-4 text-[#27E58C] shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#27E58C] font-bold">
                [RECOVERY PROTOCOL]
              </span>
              <span className="text-[10px] text-[#929DB5]">SYSTEM ADAPTATION</span>
            </div>
            <p className="text-[#F5F7FF] mt-0.5 leading-relaxed">
              Ensure adequate hydration (minimum 3L) and sleep 7-8 hours tonight to allow myofibrillar recovery and growth hormone synthesis.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

