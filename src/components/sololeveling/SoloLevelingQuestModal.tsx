import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../context/AppContext';
import { getTodayDateString } from '../../db/database';
import { getSavedSoloLevelingQuests, saveSoloLevelingQuests } from '../../services/persistenceService';
import confetti from 'canvas-confetti';
import { Info, X, Check, Clock, Award, ShieldAlert } from 'lucide-react';

interface SoloLevelingQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoloLevelingQuestModal: React.FC<SoloLevelingQuestModalProps> = ({
  isOpen,
  onClose
}) => {
  const { grantXP, activeUser } = useAppStore();
  const currentUid = activeUser?.id || 'usr_primary';

  const savedQuests = getSavedSoloLevelingQuests(currentUid);
  const [pushups, setPushups] = useState<number>(savedQuests.pushups);
  const [situps, setSitups] = useState<number>(savedQuests.situps);
  const [squats, setSquats] = useState<number>(savedQuests.squats);
  const [runningKm, setRunningKm] = useState<number>(savedQuests.runningKm);

  useEffect(() => {
    const q = getSavedSoloLevelingQuests(currentUid);
    setPushups(q.pushups);
    setSitups(q.situps);
    setSquats(q.squats);
    setRunningKm(q.runningKm);
    setIsCompleted(q.completedDate === getTodayDateString());
  }, [currentUid, isOpen]);

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return savedQuests.completedDate === getTodayDateString();
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
    saveSoloLevelingQuests(p, s, sq, r, isCompleted ? getTodayDateString() : null, currentUid);
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

  const toggleComplete = (type: 'pushups' | 'situps' | 'squats' | 'running') => {
    if (type === 'pushups') {
      const next = pushups >= 100 ? 50 : 100;
      setPushups(next);
      saveProgress(next, situps, squats, runningKm);
    } else if (type === 'situps') {
      const next = situps >= 100 ? 50 : 100;
      setSitups(next);
      saveProgress(pushups, next, squats, runningKm);
    } else if (type === 'squats') {
      const next = squats >= 100 ? 50 : 100;
      setSquats(next);
      saveProgress(pushups, situps, next, runningKm);
    } else if (type === 'running') {
      const next = runningKm >= 5 ? (runningKm >= 10 ? 0 : 10) : 5;
      setRunningKm(next);
      saveProgress(pushups, situps, squats, next);
    }
  };

  const handleFinish = async () => {
    if (pushups < 100 || situps < 100 || squats < 100 || runningKm < 5) {
      alert('WARNING: Quest goals incomplete! Fulfill all parameters or face the penalty zone.');
      return;
    }

    setIsCompleted(true);
    localStorage.setItem('sl_quest_completed_today', getTodayDateString());

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#00D4FF', '#725CFF', '#C084FC', '#27E58C']
    });

    await grantXP(700, 'Solo Leveling Daily Quest: Strange Training Completed');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background Dark Fantasy Blue & Lilac Energy Aura */}
      <div className="absolute w-[95%] max-w-md h-[550px] bg-[#A78BFA]/15 rounded-[35px] blur-[70px] pointer-events-none" />

      {/* Holographic Window Container matching Screen 3 */}
      <div className="relative w-full max-w-sm rounded-[24px] border border-[#A78BFA]/40 bg-[#140E26]/95 shadow-[0_0_50px_rgba(167,139,250,0.35),0_12px_40px_rgba(0,0,0,0.9)] p-5 text-[#F5F7FF] overflow-hidden">
        {/* Subtle decorative edge lines */}
        <div className="absolute inset-0 border border-white/5 rounded-[24px] pointer-events-none" />

        {/* Top Header Row: [ (i) | QUEST INFO ] and Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border border-[#A78BFA]/50 rounded-lg px-3 py-1 bg-[#20163B]/60 shadow-[0_0_15px_rgba(167,139,250,0.2)]">
            <div className="w-4 h-4 rounded-full border border-[#C084FC] flex items-center justify-center text-[10px] text-[#C084FC] font-bold">
              i
            </div>
            <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#F5F7FF] uppercase">
              QUEST INFO
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9D94B8] hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle: [Daily Quest: Strange Training has Arrived.] */}
        <div className="text-center my-4">
          <p className="text-xs font-sans text-[#E2D9F3] font-medium tracking-wide">
            [Daily Quest: <span className="font-bold text-[#F5F7FF]">Strange Training has Arrived.</span>]
          </p>

          <div className="mt-3 flex flex-col items-center">
            <h3 className="font-cinzel text-sm sm:text-base font-bold tracking-[0.3em] uppercase text-[#F5F7FF] drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]">
              GOAL
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C084FC] to-transparent mt-1 shadow-[0_0_8px_#C084FC]" />
          </div>
        </div>

        {/* 4 Iconic Goals: Push-ups, Sit-ups, Squats, Running */}
        <div className="space-y-3 my-4 text-xs font-mono">
          {/* Push-ups */}
          <div className="p-2.5 rounded-xl border border-white/5 bg-[#1C1435]/80 flex items-center justify-between hover:border-[#C084FC]/30 transition-all">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-sm text-[#F5F7FF]">
                Push-ups
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`font-mono font-bold text-xs ${pushups >= 100 ? 'text-[#27E58C]' : 'text-[#C084FC]'}`}>
                [{pushups} / 100]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addPushups(5)}
                  className="px-1.5 py-0.5 rounded bg-[#C084FC]/20 text-[#C084FC] text-[10px] font-bold hover:bg-[#C084FC] hover:text-black active:scale-90 transition-all"
                >
                  +5
                </button>
              </div>
              <button
                onClick={() => toggleComplete('pushups')}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  pushups >= 100
                    ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                    : 'border-[#A78BFA]/50 bg-[#120E24] hover:border-[#C084FC]'
                }`}
              >
                {pushups >= 100 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* Sit-ups */}
          <div className="p-2.5 rounded-xl border border-white/5 bg-[#1C1435]/80 flex items-center justify-between hover:border-[#C084FC]/30 transition-all">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-sm text-[#F5F7FF]">
                Sit-ups
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`font-mono font-bold text-xs ${situps >= 100 ? 'text-[#27E58C]' : 'text-[#C084FC]'}`}>
                [{situps} / 100]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addSitups(5)}
                  className="px-1.5 py-0.5 rounded bg-[#C084FC]/20 text-[#C084FC] text-[10px] font-bold hover:bg-[#C084FC] hover:text-black active:scale-90 transition-all"
                >
                  +5
                </button>
              </div>
              <button
                onClick={() => toggleComplete('situps')}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  situps >= 100
                    ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                    : 'border-[#A78BFA]/50 bg-[#120E24] hover:border-[#C084FC]'
                }`}
              >
                {situps >= 100 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* Squats */}
          <div className="p-2.5 rounded-xl border border-white/5 bg-[#1C1435]/80 flex items-center justify-between hover:border-[#C084FC]/30 transition-all">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-sm text-[#F5F7FF]">
                Squats
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`font-mono font-bold text-xs ${squats >= 100 ? 'text-[#27E58C]' : 'text-[#C084FC]'}`}>
                [{squats} / 100]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addSquats(5)}
                  className="px-1.5 py-0.5 rounded bg-[#C084FC]/20 text-[#C084FC] text-[10px] font-bold hover:bg-[#C084FC] hover:text-black active:scale-90 transition-all"
                >
                  +5
                </button>
              </div>
              <button
                onClick={() => toggleComplete('squats')}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  squats >= 100
                    ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                    : 'border-[#A78BFA]/50 bg-[#120E24] hover:border-[#C084FC]'
                }`}
              >
                {squats >= 100 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* Running */}
          <div className="p-2.5 rounded-xl border border-white/5 bg-[#1C1435]/80 flex items-center justify-between hover:border-[#C084FC]/30 transition-all">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-sm text-[#F5F7FF]">
                Running
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`font-mono font-bold text-xs ${runningKm >= 5 ? 'text-[#27E58C]' : 'text-[#C084FC]'}`}>
                [{runningKm} / 5km]
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => addRunning(0.5)}
                  className="px-1.5 py-0.5 rounded bg-[#C084FC]/20 text-[#C084FC] text-[10px] font-bold hover:bg-[#C084FC] hover:text-black active:scale-90 transition-all"
                >
                  +0.5
                </button>
              </div>
              <button
                onClick={() => toggleComplete('running')}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  runningKm >= 5
                    ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                    : 'border-[#A78BFA]/50 bg-[#120E24] hover:border-[#C084FC]'
                }`}
              >
                {runningKm >= 5 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Warning text matching Screen 3 */}
        <div className="my-3 text-center px-2">
          <p className="text-[11px] font-mono text-[#D8B4FE] leading-relaxed font-normal opacity-90 drop-shadow-[0_0_8px_rgba(216,180,254,0.3)]">
            WARNING: Failure to complete the daily quest will result in an appreciate penalty.
          </p>
        </div>

        {/* Reward & Countdown Timer */}
        <div className="flex items-center justify-between text-xs font-mono py-2 border-t border-[#A78BFA]/20">
          <div className="flex items-center gap-1.5 text-[#27E58C]">
            <Award className="w-4 h-4" />
            <span className="font-bold">Reward: 700 XP</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#C084FC]">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono font-bold text-xs tracking-widest">{timeRemaining}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2.5 mt-3 pt-2 border-t border-[#A78BFA]/20">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#A78BFA]/30 bg-[#17112B] font-cinzel font-semibold text-xs text-[#9D94B8] hover:text-white uppercase tracking-wider active:scale-95 transition-all"
          >
            Dismiss
          </button>

          <button
            onClick={handleFinish}
            className={`flex-1 py-2.5 rounded-xl border font-cinzel font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_20px_rgba(192,132,252,0.4)] ${
              isCompleted
                ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                : 'bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] border-[#C084FC] text-white hover:brightness-110'
            }`}
          >
            {isCompleted ? 'CLAIMED ✓' : 'FINISH QUEST'}
          </button>
        </div>

        {/* Penalty Protocol Simulation Link */}
        <div className="mt-2 text-center">
          <button
            onClick={() => setShowPenaltyMode(!showPenaltyMode)}
            className="text-[9px] text-[#FF5263] font-mono hover:underline opacity-80"
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
