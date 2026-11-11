import React, { useEffect } from 'react';
import { useAppStore } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Home } from './pages/Home';
import { Workout } from './pages/Workout';
import { Nutrition } from './pages/Nutrition';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import confetti from 'canvas-confetti';
import { Zap, ShieldCheck } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { userProfile, currentTab, isLoading, levelUpModal, dismissLevelUpModal } = useAppStore();

  useEffect(() => {
    if (levelUpModal?.show) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#725CFF', '#00D4FF', '#27E58C', '#FFB547']
      });
    }
  }, [levelUpModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#725CFF] to-[#00D4FF] p-0.5 animate-spin mb-4">
          <div className="w-full h-full bg-[#080B14] rounded-[14px]" />
        </div>
        <span className="text-xs font-display uppercase tracking-[0.25em] text-[#00D4FF] font-semibold animate-pulse">
          INITIALIZING PRIMAL SYSTEM...
        </span>
      </div>
    );
  }

  // If user has not completed onboarding, show full-screen onboarding experience
  if (!userProfile || !userProfile.isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F5F7FF] flex flex-col font-sans selection:bg-[#725CFF]/30 selection:text-[#00D4FF]">
      {/* Top Application Bar */}
      <TopBar />

      {/* Main Tab View */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && <Home />}
        {currentTab === 'workout' && <Workout />}
        {currentTab === 'nutrition' && <Nutrition />}
        {currentTab === 'progress' && <Progress />}
        {currentTab === 'profile' && <Profile />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav />

      {/* Level-Up Celebration Modal */}
      {levelUpModal?.show && (
        <div className="fixed inset-0 z-50 bg-[#080B14]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#725CFF] to-[#00D4FF] p-1 shadow-[0_0_50px_rgba(114,92,255,0.6)] flex items-center justify-center mb-6 animate-pulse">
            <div className="w-full h-full bg-[#080B14] rounded-[22px] flex items-center justify-center">
              <Zap className="w-12 h-12 text-[#00D4FF]" />
            </div>
          </div>

          <span className="text-xs font-display uppercase tracking-[0.3em] text-[#00D4FF] font-semibold block mb-1">
            [ LEVEL UP OCCURRED ]
          </span>

          <h2 className="font-display font-black text-3xl tracking-wider text-[#F5F7FF] uppercase mb-1">
            LEVEL 0{levelUpModal.level}
          </h2>

          <h3 className="font-display font-black text-xl text-[#725CFF] tracking-widest uppercase mb-4">
            {levelUpModal.title}
          </h3>

          <p className="text-xs text-[#929DB5] max-w-xs mb-8 leading-relaxed">
            Your physical capacity and discipline threshold have evolved. Continue your daily trials to unlock higher rank protocols.
          </p>

          <button
            onClick={dismissLevelUpModal}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#725CFF] to-[#00D4FF] text-[#080B14] font-display font-bold text-sm tracking-widest uppercase hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(0,212,255,0.4)]"
          >
            CLAIM ASCENT
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return <AppContent />;
}

