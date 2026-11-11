import React from 'react';
import { useAppStore } from '../../context/AppContext';
import { Home, TrendingUp, Plus, Bell } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, notifications, userProfile } = useAppStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none pb-safe">
      <div className="pointer-events-auto bg-[#130E26]/90 backdrop-blur-2xl border border-[#A78BFA]/30 rounded-2xl sm:rounded-full py-2 px-4 flex items-center justify-between gap-5 sm:gap-7 shadow-[0_12px_40px_rgba(0,0,0,0.85)] transition-all">
        {/* Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`p-2 rounded-full transition-all active:scale-90 ${
            currentTab === 'home'
              ? 'text-[#C084FC] drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
          title="Daily Quests & Status"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Progress / Analytics */}
        <button
          onClick={() => setCurrentTab('progress')}
          className={`p-2 rounded-full transition-all active:scale-90 ${
            currentTab === 'progress'
              ? 'text-[#C084FC] drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
          title="Analytics & Progress"
        >
          <TrendingUp className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Quick Add (+) Floating Action Pill */}
        <button
          onClick={() => setCurrentTab('nutrition')}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] text-[#0B0814] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(192,132,252,0.5)] active:scale-90 hover:brightness-110 transition-all border border-white/20"
          title="Log Meal or Exercise"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Workout / Notifications */}
        <button
          onClick={() => setCurrentTab('workout')}
          className={`p-2 rounded-full transition-all active:scale-90 relative ${
            currentTab === 'workout'
              ? 'text-[#C084FC] drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
          title="Training Trials"
        >
          <Bell className="w-5 h-5 stroke-[2.2]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5263] shadow-[0_0_6px_#FF5263]" />
          )}
        </button>

        {/* Hunter Avatar / Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`p-1.5 rounded-full transition-all active:scale-90 flex items-center justify-center ${
            currentTab === 'profile'
              ? 'ring-2 ring-[#C084FC] drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]'
              : 'opacity-85 hover:opacity-100'
          }`}
          title="Hunter Profile"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white/30">
            {userProfile?.fullName?.charAt(0)?.toUpperCase() || 'H'}
          </div>
        </button>
      </div>
    </nav>
  );
};
