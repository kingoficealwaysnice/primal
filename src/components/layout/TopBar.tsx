import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { Bell, Dumbbell, Shield, X, Check } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    userProfile,
    hunterStats,
    equipmentMode,
    setEquipmentMode,
    notifications,
    markNotificationRead
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080B14]/85 backdrop-blur-xl border-b border-[#725CFF]/20 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#725CFF] to-[#00D4FF] p-0.5 shadow-[0_0_15px_rgba(114,92,255,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-sm text-[#00D4FF]">P</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-sm tracking-wider text-[#F5F7FF]">
                  PRIMAL <span className="text-[#00D4FF]">SYSTEM</span>
                </h1>
                {hunterStats && (
                  <span className="text-[10px] font-display font-semibold px-2 py-0.5 rounded-full bg-[#725CFF]/20 text-[#00D4FF] border border-[#725CFF]/40">
                    LVL {hunterStats.level}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#929DB5] tracking-wide font-sans">
                Day {userProfile?.currentDay || 1} / 90
              </p>
            </div>
          </div>

          {/* Right Controls: Equipment Switch & Notification Bell */}
          <div className="flex items-center gap-2">
            {/* Equipment Toggle Pill */}
            <button
              onClick={() => setEquipmentMode(equipmentMode === 'bodyweight' ? 'dumbbell' : 'bodyweight')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#151D30] border border-[#725CFF]/30 text-xs font-display tracking-wider text-[#F5F7FF] active:scale-95 transition-all shadow-sm"
              title="Toggle Bodyweight / Dumbbell mode"
            >
              <Dumbbell className={`w-3.5 h-3.5 ${equipmentMode === 'dumbbell' ? 'text-[#00D4FF]' : 'text-[#725CFF]'}`} />
              <span className="text-[11px] font-semibold uppercase">
                {equipmentMode === 'dumbbell' ? 'DB Mode' : 'BW Mode'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-xl bg-[#151D30] border border-[#725CFF]/30 text-[#929DB5] hover:text-[#F5F7FF] active:scale-95 transition-all"
            >
              <Bell className="w-4 h-4 text-[#929DB5]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5263] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#080B14]/70 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />
          <div className="relative w-full max-w-sm bg-[#101626] border-l border-[#725CFF]/30 h-full p-5 overflow-y-auto z-10 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#725CFF]/20">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00D4FF]" />
                <h3 className="font-display font-bold text-sm tracking-wider uppercase text-[#F5F7FF]">
                  SYSTEM TRANSMISSIONS
                </h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg bg-[#151D30] text-[#929DB5] hover:text-[#F5F7FF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-[#929DB5] text-xs">
                  [ NO TRANSMISSIONS RECORDED ]
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border transition-all ${
                      notif.read
                        ? 'bg-[#151D30]/60 border-[#725CFF]/15 text-[#929DB5]'
                        : 'bg-[#151D30] border-[#00D4FF]/40 text-[#F5F7FF] shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-display font-semibold uppercase px-2 py-0.5 rounded bg-[#725CFF]/20 text-[#00D4FF]">
                        [{notif.type}]
                      </span>
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-[10px] text-[#00D4FF] hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                    <h4 className="text-xs font-display font-semibold mb-1 text-[#F5F7FF]">
                      {notif.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-[#929DB5]">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-[#929DB5]/60 block mt-2">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

