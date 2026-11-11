import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { Bell, Dumbbell, ShieldCheck, X, Check, Zap, LogIn, Sparkles } from 'lucide-react';
import { SoloLevelingQuestModal } from '../sololeveling/SoloLevelingQuestModal';
import { GoogleAuthModal } from '../auth/GoogleAuthModal';
import { AwakenHeroScreen } from '../sololeveling/AwakenHeroScreen';

export const TopBar: React.FC = () => {
  const {
    userProfile,
    hunterStats,
    equipmentMode,
    setEquipmentMode,
    notifications,
    markNotificationRead,
    googleUser
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuestInfo, setShowQuestInfo] = useState(false);
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);
  const [showAwakenHero, setShowAwakenHero] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {showAwakenHero && (
        <AwakenHeroScreen
          isDismissable={true}
          onClose={() => setShowAwakenHero(false)}
          onGetStarted={() => setShowAwakenHero(false)}
        />
      )}

      <SoloLevelingQuestModal
        isOpen={showQuestInfo}
        onClose={() => setShowQuestInfo(false)}
      />

      <GoogleAuthModal
        isOpen={showGoogleAuth}
        onClose={() => setShowGoogleAuth(false)}
      />

      <header className="sticky top-0 z-40 bg-[#0A0714]/90 backdrop-blur-xl border-b border-[#A78BFA]/25 px-3 sm:px-4 py-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Logo & Subtitle (Click to view Awaken Hero Screen) */}
          <div
            onClick={() => setShowAwakenHero(true)}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="View Awaken Hero Screen"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C084FC] via-[#A855F7] to-[#7C3AED] p-0.5 shadow-[0_0_15px_rgba(192,132,252,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A0714] rounded-[10px] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[#C084FC]">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel font-bold text-xs sm:text-sm tracking-wider text-[#F5F7FF] group-hover:text-[#C084FC] transition-colors">
                  AWAKEN <span className="text-[#C084FC]">PRIMAL</span>
                </h1>
                {hunterStats && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30">
                    LVL {hunterStats.level}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#9D94B8] tracking-wide font-mono">
                Day {userProfile?.currentDay || 1} / 90
              </p>
            </div>
          </div>

          {/* Right Controls: Google Auth + Quest HUD + Equipment + Notifications */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Google Auth Status / Login Button */}
            <button
              onClick={() => setShowGoogleAuth(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono active:scale-95 transition-all shadow-sm ${
                googleUser
                  ? 'bg-[#27E58C]/10 border-[#27E58C]/50 text-[#27E58C]'
                  : 'bg-[#151D30] border-[#725CFF]/30 text-[#929DB5] hover:text-white'
              }`}
              title={googleUser ? `Google Linked: ${googleUser.email}` : 'Sign in with Google'}
            >
              {googleUser ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-[#27E58C] shadow-[0_0_6px_#27E58C]" />
                  <span className="text-[10px] font-bold hidden sm:inline truncate max-w-[80px]">
                    {googleUser.givenName || 'Google'}
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.31 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  <span className="text-[10px] font-bold hidden sm:inline">
                    LOGIN
                  </span>
                </>
              )}
            </button>

            {/* Iconic Solo Leveling Holographic Quest HUD button */}
            <button
              onClick={() => setShowQuestInfo(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#00D4FF]/15 border border-[#00D4FF] text-xs font-display tracking-widest text-[#00D4FF] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] animate-pulse"
              title="Open Solo Leveling Quest HUD"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-[#00D4FF] flex items-center justify-center text-[9px] font-bold">
                !
              </div>
              <span className="text-[10px] font-bold uppercase hidden xs:inline">
                QUEST
              </span>
            </button>

            {/* Equipment Toggle Pill */}
            <button
              onClick={() => setEquipmentMode(equipmentMode === 'bodyweight' ? 'dumbbell' : 'bodyweight')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#151D30] border border-[#725CFF]/30 text-xs font-display tracking-wider text-[#F5F7FF] active:scale-95 transition-all shadow-sm"
              title="Toggle Bodyweight / Dumbbell mode"
            >
              <Dumbbell className={`w-3.5 h-3.5 ${equipmentMode === 'dumbbell' ? 'text-[#00D4FF]' : 'text-[#725CFF]'}`} />
              <span className="text-[11px] font-semibold uppercase">
                {equipmentMode === 'dumbbell' ? 'DB' : 'BW'}
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />

          <div className="relative w-full max-w-sm bg-[#101626] border-l border-[#725CFF]/30 p-5 overflow-y-auto flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#725CFF]/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00D4FF]" />
                  <h2 className="font-display font-bold text-sm text-[#F5F7FF] tracking-wider uppercase">
                    SYSTEM BROADCASTS
                  </h2>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-[#929DB5] hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#929DB5] text-center py-8 font-mono">
                    [NO SYSTEM BROADCASTS PENDING]
                  </p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        n.read
                          ? 'bg-[#151D30]/40 border-white/5 text-[#929DB5]'
                          : 'bg-[#151D30] border-[#00D4FF]/40 text-[#F5F7FF] shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-[11px] tracking-wide text-[#00D4FF]">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#929DB5] font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#929DB5] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#725CFF]/20">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full py-2.5 rounded-xl bg-[#151D30] border border-[#725CFF]/30 font-display text-xs text-[#F5F7FF] font-semibold uppercase tracking-wider"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
