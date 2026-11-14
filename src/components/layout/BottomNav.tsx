import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../context/AppContext';
import { Home, TrendingUp, Plus, Dumbbell } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, userProfile, activeUser } = useAppStore();

  const navItems = [
    { id: 'home', label: 'Quests', icon: Home },
    { id: 'progress', label: 'Analytics', icon: TrendingUp },
    { id: 'nutrition', label: 'Fuel', isAction: true },
    { id: 'workout', label: 'Trials', icon: Dumbbell },
    { id: 'profile', label: 'Hunter', isAvatar: true }
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none pb-safe">
      <div className="pointer-events-auto bg-[#120D24]/85 backdrop-blur-3xl border border-white/15 rounded-full py-1.5 px-3 flex items-center justify-between gap-1 sm:gap-2 shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-all">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setCurrentTab('nutrition')}
                className="w-10 h-10 mx-1 rounded-full bg-gradient-to-tr from-[#C084FC] via-[#A855F7] to-[#38BDF8] text-[#0A0714] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(192,132,252,0.5)] border border-white/30"
                title="Log Nutrition & Fuel"
              >
                <Plus className="w-5 h-5 stroke-[2.8]" />
              </motion.button>
            );
          }

          if (item.isAvatar) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => setCurrentTab('profile')}
                className={`relative p-2 rounded-full transition-all flex items-center justify-center ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
                title="Hunter Profile"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-white/15 rounded-full -z-10 shadow-sm"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-[10px] font-bold text-white shadow-sm border ${
                    isActive ? 'border-white' : 'border-white/30'
                  }`}
                >
                  {activeUser?.avatarEmoji || userProfile?.fullName?.charAt(0)?.toUpperCase() || 'H'}
                </div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setCurrentTab(item.id as any)}
              className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
                isActive
                  ? 'text-[#C084FC]'
                  : 'text-white/50 hover:text-white/80'
              }`}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-[#C084FC]/20 rounded-full -z-10 shadow-sm border border-[#C084FC]/30"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              {Icon && <Icon className="w-5 h-5 stroke-[2.2]" />}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
