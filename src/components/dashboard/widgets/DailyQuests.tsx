import React from 'react';
import { useAppStore } from '../../../context/AppContext';
import { Card } from '../../ui/Card';
import { Check, CheckCircle2, Circle } from 'lucide-react';

export const DailyQuests: React.FC = () => {
  const { todayQuests, toggleQuestCompletion } = useAppStore();

  const completedCount = todayQuests.filter(q => q.completed).length;
  const totalCount = todayQuests.length;

  return (
    <Card
      title="DAILY SYSTEM QUESTS"
      subtitle={`${completedCount} of ${totalCount} completed`}
      badge={`${completedCount}/${totalCount}`}
      glow="violet"
    >
      <div className="space-y-2.5">
        {todayQuests.map((quest) => (
          <div
            key={quest.id}
            onClick={() => quest.id && toggleQuestCompletion(quest.id)}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none active:scale-[0.98] ${
              quest.completed
                ? 'bg-[#101626]/60 border-[#27E58C]/30 text-[#929DB5]'
                : 'bg-[#151D30] border-[#725CFF]/20 text-[#F5F7FF] hover:border-[#725CFF]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  quest.completed
                    ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14] shadow-[0_0_10px_rgba(39,229,140,0.4)]'
                    : 'border-[#725CFF]/40 bg-[#101626]'
                }`}
              >
                {quest.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              <div>
                <h4
                  className={`text-xs font-semibold tracking-wide ${
                    quest.completed ? 'line-through text-[#929DB5]' : 'text-[#F5F7FF]'
                  }`}
                >
                  {quest.title}
                </h4>
                <p className="text-[11px] text-[#929DB5] mt-0.5 line-clamp-1">
                  {quest.description}
                </p>
              </div>
            </div>

            {/* XP Badge */}
            <span
              className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ml-2 ${
                quest.completed
                  ? 'bg-[#27E58C]/10 text-[#27E58C] border-[#27E58C]/30'
                  : 'bg-[#725CFF]/20 text-[#00D4FF] border-[#00D4FF]/30'
              }`}
            >
              +{quest.xpReward} XP
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

