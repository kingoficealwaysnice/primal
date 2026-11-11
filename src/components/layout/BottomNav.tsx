import React from 'react';
import { useAppStore, type AppTab } from '../../context/AppContext';
import { Flame, Dumbbell, Utensils, TrendingUp, User } from 'lucide-react';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'STATUS', icon: Flame },
  { id: 'workout', label: 'WORKOUT', icon: Dumbbell },
  { id: 'nutrition', label: 'NUTRITION', icon: Utensils },
  { id: 'progress', label: 'PROGRESS', icon: TrendingUp },
  { id: 'profile', label: 'HUNTER', icon: User },
];

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080B14]/90 backdrop-blur-2xl border-t border-[#725CFF]/25 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.7)]">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#00D4FF]'
                  : 'text-[#929DB5] hover:text-[#F5F7FF]'
              }`}
            >
              {/* Active glow pill */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#725CFF]/20 to-[#00D4FF]/10 rounded-2xl border border-[#00D4FF]/40 shadow-[0_0_15px_rgba(0,212,255,0.25)] -z-10" />
              )}

              <IconComponent
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-[#00D4FF]' : 'text-[#929DB5]'
                }`}
              />

              <span
                className={`text-[9px] font-display uppercase tracking-widest mt-1 font-semibold ${
                  isActive ? 'text-[#00D4FF]' : 'text-[#929DB5]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

