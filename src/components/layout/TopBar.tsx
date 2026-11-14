import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import {
  Bell,
  Dumbbell,
  ShieldCheck,
  X,
  Check,
  Zap,
  LogIn,
  Sparkles,
  Users,
  Share2,
  Flame,
  Award
} from 'lucide-react';
import { SoloLevelingQuestModal } from '../sololeveling/SoloLevelingQuestModal';
import { GoogleAuthModal } from '../auth/GoogleAuthModal';
import { AwakenHeroScreen } from '../sololeveling/AwakenHeroScreen';
import { AppleUserSwitcherModal } from '../apple/AppleUserSwitcherModal';
import { AppleShareModal } from '../apple/AppleShareModal';
import { AppleSharedDossierView } from '../apple/AppleSharedDossierView';
import { AppleDynamicIsland } from '../apple/AppleDynamicIsland';

export const TopBar: React.FC = () => {
  const {
    userProfile,
    hunterStats,
    equipmentMode,
    setEquipmentMode,
    notifications,
    markNotificationRead,
    googleUser,
    activeUser,
    inspectingAlly,
    setInspectingAlly
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuestInfo, setShowQuestInfo] = useState(false);
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);
  const [showAwakenHero, setShowAwakenHero] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAlliesDossier, setShowAlliesDossier] = useState(false);

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

      {/* Apple Fast User Switcher & Registration Modal */}
      <AppleUserSwitcherModal
        isOpen={showUserSwitcher}
        onClose={() => setShowUserSwitcher(false)}
      />

      {/* Apple Share Sheet Modal */}
      <AppleShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onOpenAlliesCircle={() => setShowAlliesDossier(true)}
      />

      {/* Shared Ally Dossier Inspection View */}
      {(showAlliesDossier || inspectingAlly !== null) && (
        <AppleSharedDossierView
          onClose={() => {
            setShowAlliesDossier(false);
            setInspectingAlly(null);
          }}
        />
      )}

      {/* Primary Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0A0714]/85 backdrop-blur-2xl border-b border-white/10 px-3 sm:px-4 py-2.5 pt-[max(env(safe-area-inset-top),0.75rem)] transition-all">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Logo & Hunter System Badge */}
          <div
            onClick={() => setShowAwakenHero(true)}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="View Awaken Hero Screen"
          >
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#C084FC] via-[#A855F7] to-[#7C3AED] p-0.5 shadow-[0_0_18px_rgba(192,132,252,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A0714] rounded-[14px] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[#C084FC]">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-cinzel font-bold text-xs sm:text-sm tracking-wider text-white group-hover:text-[#C084FC] transition-colors">
                  AWAKEN <span className="text-[#C084FC]">PRIMAL</span>
                </h1>
                {hunterStats && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30">
                    LVL {hunterStats.level}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#9D94B8] tracking-wide font-mono">
                Day {userProfile?.currentDay || 1} / 90
              </p>
            </div>
          </div>

          {/* Right Controls: Fast User Switcher + Share Pill + Solo Leveling Quest HUD + Equipment + Bell */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Apple User Switcher Pill */}
            <button
              onClick={() => setShowUserSwitcher(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white active:scale-95 transition-all shadow-sm"
              title="Switch Hunter Profile or Register New User"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#C084FC] to-[#38BDF8] flex items-center justify-center text-[10px]">
                {activeUser?.avatarEmoji || '⚡'}
              </div>
              <span className="text-[11px] font-semibold hidden xs:inline max-w-[80px] truncate">
                {activeUser?.displayName || 'User'}
              </span>
            </button>

            {/* Apple Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
              title="Share My Protocol with Friends"
            >
              <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[11px] font-medium hidden sm:inline">Share</span>
            </button>

            {/* Solo Leveling Holographic Quest HUD button */}
            <button
              onClick={() => setShowQuestInfo(true)}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-[#00D4FF]/15 border border-[#00D4FF]/60 text-xs font-mono tracking-widest text-[#00D4FF] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] animate-pulse"
              title="Open Solo Leveling Quest HUD"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-[#00D4FF] flex items-center justify-center text-[9px] font-bold">
                !
              </div>
              <span className="text-[10px] font-bold uppercase hidden md:inline">
                QUEST
              </span>
            </button>

            {/* Equipment Toggle Pill */}
            <button
              onClick={() => setEquipmentMode(equipmentMode === 'bodyweight' ? 'dumbbell' : 'bodyweight')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white active:scale-95 transition-all"
              title="Toggle Bodyweight / Dumbbell mode"
            >
              <Dumbbell className={`w-3.5 h-3.5 ${equipmentMode === 'dumbbell' ? 'text-[#00D4FF]' : 'text-[#C084FC]'}`} />
              <span className="text-[10px] font-bold uppercase hidden xs:inline">
                {equipmentMode === 'dumbbell' ? 'DB' : 'BW'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#9D94B8] hover:text-white active:scale-95 transition-all"
            >
              <Bell className="w-4 h-4 text-[#9D94B8]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5263] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Island Capsule */}
        <AppleDynamicIsland
          onOpenUserSwitcher={() => setShowUserSwitcher(true)}
          onOpenShareModal={() => setShowShareModal(true)}
          onOpenAlliesDossier={() => setShowAlliesDossier(true)}
        />
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />

          <div className="relative w-full max-w-sm bg-[#101626] border-l border-white/10 p-5 overflow-y-auto flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00D4FF]" />
                  <h2 className="font-bold text-sm text-white tracking-wider uppercase">
                    SYSTEM BROADCASTS
                  </h2>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-[#9D94B8] hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#9D94B8] text-center py-8 font-mono">
                    [NO SYSTEM BROADCASTS PENDING]
                  </p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                        n.read
                          ? 'bg-white/5 border-white/5 text-[#9D94B8]'
                          : 'bg-white/10 border-[#00D4FF]/40 text-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] tracking-wide text-[#00D4FF]">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#9D94B8] font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#9D94B8] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wider transition-colors"
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
