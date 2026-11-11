import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../context/AppContext';
import { db, getTodayDateString } from '../../db/database';
import confetti from 'canvas-confetti';
import { AlertCircle, X, Check, Flame, Clock, Award, ShieldAlert } from 'lucide-react';

interface SoloLevelingQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoloLevelingQuestModal: React.FC<SoloLevelingQuestModalProps> = ({
  isOpen,
  onClose
}) => {
  const { grantXP, userProfile } = useAppStore();

  // Progress state for the iconic 4 Daily Quest goals
  const [pushups, setPushups] = useState<number>(() => {
    const saved = localStorage.getItem('sl_quest_pushups');
    return saved ? parseInt(saved, 10) : 50;
  });
  const [situps, setSitups] = useState<number>(() => {
    const saved = localStorage.getItem('sl_quest_situps');
    return saved ? parseInt(saved, 10) : 40;
  });
  const [squats, setSquats] = useState<number>(() => {
    const saved = localStorage.getItem('sl_quest_squats');
    return saved ? parseInt(saved, 10) : 60;
  });
  const [runningKm, setRunningKm] = useState<number>(() => {
    const saved = localStorage.getItem('sl_quest_running');
    return saved ? parseFloat(saved) : 4.5;
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem('sl_quest_completed_today');
    return saved === getTodayDateString();
  });

  const [showPenaltyMode, setShowPenaltyMode] = useState(false);

  // Countdown timer to midnight
  const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveProgress = (p: number, s: number, sq: number, r: number) => {
    localStorage.setItem('sl_quest_pushups', String(p));
    localStorage.setItem('sl_quest_situps', String(s));
    localStorage.setItem('sl_quest_squats', String(sq));
    localStorage.setItem('sl_quest_running', String(r));
  };

  const addPushups = (amt: number) => {
    const next = Math.min(100, Math.max(0, pushups + amt));
    setPushups(next);
    saveProgress(next, situps, squats, runningKm);
  };

  const addSitups = (amt: number) => {
    const next = Math.min(100, Math.max(0, situps + amt));
    setSitups(next);
    saveProgress(pushups, next, squats, runningKm);
  };

  const addSquats = (amt: number) => {
    const next = Math.min(100, Math.max(0, squats + amt));
    setSquats(next);
    saveProgress(pushups, situps, next, runningKm);
  };

  const addRunning = (amt: number) => {
    const next = Math.min(10, Math.max(0, Math.round((runningKm + amt) * 10) / 10));
    setRunningKm(next);
    saveProgress(pushups, situps, squats, next);
  };

  const handleFinish = async () => {
    if (pushups < 100 || situps < 100 || squats < 100 || runningKm < 10) {
      alert('WARNING: Quest goals incomplete! Fulfill all parameters or face the penalty zone.');
      return;
    }

    setIsCompleted(true);
    localStorage.setItem('sl_quest_completed_today', getTodayDateString());

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#00D4FF', '#725CFF', '#27E58C']
    });

    await grantXP(700, 'Solo Leveling Daily Quest: Strength Training Completed');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background Dark Fantasy Blue Energy Aura */}
      <div className="absolute w-[95%] max-w-md h-[550px] bg-[#00D4FF]/10 rounded-[35px] blur-[70px] pointer-events-none" />

      {/* Holographic Window Container */}
      <div className="relative w-full max-w-sm rounded-[28px] border-2 border-[#00D4FF] bg-[#080B14]/95 shadow-[0_0_50px_rgba(0,212,255,0.45)] p-5 text-[#F5F7FF] overflow-hidden">
        {/* Sci-Fi Decorative Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00D4FF]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00D4FF]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00D4FF]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00D4FF]" />

        {/* Top Header Box (Exact replica of Image 1 & 2) */}
        <div className="flex items-center justify-between border-2 border-[#00D4FF]/80 rounded-xl px-4 py-2 bg-[#00D4FF]/10 shadow-[0_0_20px_rgba(0,212,255,0.25)]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-[#00D4FF] flex items-center justify-center font-bold text-xs text-[#00D4FF]">
              !
            </div>
            <h2 className="font-display font-extrabold text-sm sm:text-base tracking-[0.2em] text-[#00D4FF] uppercase text-glow-cyan">
              QUEST INFO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#00D4FF] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quest Subtitle */}
        <div className="text-center my-3">
          <p className="text-[11px] font-mono tracking-wider text-[#00D4FF] font-semibold">
            [Daily Quest: Strength Training has arrived.]
          </p>
          <div className="mt-2 inline-block">
            <span className="font-display font-black text-sm tracking-[0.3em] uppercase text-[#F5F7FF] border-b-2 border-[#00D4FF] pb-0.5 text-glow-cyan">
              GOAL
            </span>
          </div>
        </div>

        {/* 4 Iconic Goals: Push-ups, Sit-ups, Squats, Running */}
        <div className="space-y-2.5 my-3 text-xs font-mono">
          {/* Push-ups */}
          <div className="p-2.5 rounded-xl border border-[#00D4FF]/30 bg-[#101626]/80 flex items-center justify-between shadow-[0_0_12px_rgba(0,212,255,0.1)]">
            <span className="font-display font-bold text-[#F5F7FF] tracking-wider">
              Push-ups
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${pushups >= 100 ? 'text-[#27E58C]' : 'text-[#00D4FF]'}`}>
                [{pushups}/100]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addPushups(5)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +5
                </button>
                <button
                  onClick={() => addPushups(10)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +10
                </button>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${pushups >= 100 ? 'bg-[#27E58C] border-[#27E58C] text-black' : 'border-[#00D4FF]/40'}`}>
                {pushups >= 100 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Sit-ups */}
          <div className="p-2.5 rounded-xl border border-[#00D4FF]/30 bg-[#101626]/80 flex items-center justify-between shadow-[0_0_12px_rgba(0,212,255,0.1)]">
            <span className="font-display font-bold text-[#F5F7FF] tracking-wider">
              Sit-ups
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${situps >= 100 ? 'text-[#27E58C]' : 'text-[#00D4FF]'}`}>
                [{situps}/100]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addSitups(5)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +5
                </button>
                <button
                  onClick={() => addSitups(10)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +10
                </button>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${situps >= 100 ? 'bg-[#27E58C] border-[#27E58C] text-black' : 'border-[#00D4FF]/40'}`}>
                {situps >= 100 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Squats */}
          <div className="p-2.5 rounded-xl border border-[#00D4FF]/30 bg-[#101626]/80 flex items-center justify-between shadow-[0_0_12px_rgba(0,212,255,0.1)]">
            <span className="font-display font-bold text-[#F5F7FF] tracking-wider">
              Squats
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${squats >= 100 ? 'text-[#27E58C]' : 'text-[#00D4FF]'}`}>
                [{squats}/100]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addSquats(5)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +5
                </button>
                <button
                  onClick={() => addSquats(10)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +10
                </button>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${squats >= 100 ? 'bg-[#27E58C] border-[#27E58C] text-black' : 'border-[#00D4FF]/40'}`}>
                {squats >= 100 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Running */}
          <div className="p-2.5 rounded-xl border border-[#00D4FF]/30 bg-[#101626]/80 flex items-center justify-between shadow-[0_0_12px_rgba(0,212,255,0.1)]">
            <span className="font-display font-bold text-[#F5F7FF] tracking-wider">
              Running
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${runningKm >= 10 ? 'text-[#27E58C]' : 'text-[#00D4FF]'}`}>
                [{runningKm}/10km]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addRunning(0.5)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +0.5
                </button>
                <button
                  onClick={() => addRunning(1.0)}
                  className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] text-[10px] font-bold hover:bg-[#00D4FF] hover:text-black active:scale-90"
                >
                  +1.0
                </button>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${runningKm >= 10 ? 'bg-[#27E58C] border-[#27E58C] text-black' : 'border-[#00D4FF]/40'}`}>
                {runningKm >= 10 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Ominous Warning Section (Word for word from Solo Leveling) */}
        <div className="my-3 p-2.5 rounded-xl bg-[#FF5263]/10 border border-[#FF5263]/40 text-center">
          <p className="text-[10px] font-mono text-[#FF5263] leading-relaxed font-semibold">
            WARNING: Failure to complete the daily quest will result in an appropriate penalty.
          </p>
        </div>

        {/* Reward & Countdown Timer Row */}
        <div className="flex items-center justify-between text-xs font-mono py-1.5 border-t border-[#00D4FF]/20">
          <div className="flex items-center gap-1 text-[#27E58C]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-bold">Reward: 700 XP</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#00D4FF]">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span className="font-mono font-bold text-sm tracking-widest">{timeRemaining}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2.5 mt-3 pt-2 border-t border-[#00D4FF]/20">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#00D4FF]/30 bg-[#101626] font-display font-semibold text-xs text-[#929DB5] hover:text-white uppercase tracking-wider active:scale-95 transition-all"
          >
            Dismiss
          </button>

          <button
            onClick={handleFinish}
            className={`flex-1 py-2.5 rounded-xl border font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)] ${
              isCompleted
                ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                : 'bg-gradient-to-r from-[#00D4FF] to-[#725CFF] border-[#00D4FF] text-white hover:brightness-110'
            }`}
          >
            {isCompleted ? 'CLAIMED ✓' : 'FINISH QUEST'}
          </button>
        </div>

        {/* Test Penalty Mode Simulator Toggle */}
        <div className="mt-2 text-center">
          <button
            onClick={() => setShowPenaltyMode(!showPenaltyMode)}
            className="text-[9px] text-[#FF5263] font-mono hover:underline"
          >
            [Simulate Penalty Protocol Zone]
          </button>
        </div>

        {showPenaltyMode && (
          <div className="mt-2 p-2.5 rounded-xl bg-[#FF5263]/20 border border-[#FF5263] text-center text-xs animate-in zoom-in-95">
            <ShieldAlert className="w-5 h-5 text-[#FF5263] mx-auto mb-1 animate-bounce" />
            <span className="text-[10px] font-mono font-bold text-[#FF5263] block">
              [PENALTY ZONE TRIGGERED]
            </span>
            <p className="text-[10px] text-[#F5F7FF] mt-1 leading-tight">
              SURVIVAL PROTOCOL: 4 Hours in the Scorching Desert or 100 Burpees immediate penalty trial!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
