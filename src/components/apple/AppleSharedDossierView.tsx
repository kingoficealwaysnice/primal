import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../context/AppContext';
import { decodeSharePayload } from '../../services/multiUserService';
import type { SharedHunterPayload } from '../../types';
import { AppleActivityRings } from './AppleActivityRings';
import {
  Shield,
  X,
  Flame,
  Award,
  Zap,
  Heart,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  BookmarkPlus,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppleSharedDossierViewProps {
  onClose: () => void;
}

export const AppleSharedDossierView: React.FC<AppleSharedDossierViewProps> = ({
  onClose
}) => {
  const {
    inspectingAlly,
    setInspectingAlly,
    allies,
    saveAllyToCircle,
    cheerAlly,
    activeUser,
    hunterStats,
    todayQuests
  } = useAppStore();

  const [inputCode, setInputCode] = useState('');
  const [hasCheered, setHasCheered] = useState(false);
  const [cheerCount, setCheerCount] = useState(inspectingAlly?.cheerCount || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedAlly, setSelectedAlly] = useState<SharedHunterPayload | null>(
    inspectingAlly || (allies.length > 0 ? allies[0].payload : null)
  );

  const currentDossier = selectedAlly || inspectingAlly;

  const handleSendCheer = async () => {
    if (!currentDossier) return;
    setHasCheered(true);
    setCheerCount(prev => prev + 1);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C084FC', '#38BDF8', '#FFB547', '#34D399']
    });

    try {
      await cheerAlly(currentDossier.user.id);
    } catch {
      // ignore
    }
  };

  const handleSaveToCircle = async () => {
    if (!currentDossier) return;
    await saveAllyToCircle(currentDossier);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
  };

  const handleInspectInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    // Check saved allies first by code
    const match = allies.find(a => a.shareCode.toUpperCase() === inputCode.trim().toUpperCase());
    if (match) {
      setSelectedAlly(match.payload);
      setInspectingAlly(match.payload);
      setInputCode('');
      return;
    }

    // Try decoding payload
    const decoded = decodeSharePayload(inputCode.trim());
    if (decoded) {
      setSelectedAlly(decoded);
      setInspectingAlly(decoded);
      setInputCode('');
    } else {
      alert('Could not resolve Hunter Passcode or Link. Please verify format (e.g. PRML-XXXX or full URL).');
    }
  };

  if (!currentDossier) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
        <div className="w-full max-w-md bg-[#120D24] border border-white/15 rounded-3xl p-6 text-center shadow-2xl">
          <Users className="w-12 h-12 text-[#C084FC] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">No Ally Selected</h3>
          <p className="text-xs text-[#9D94B8] mb-6">
            Enter a friend's Hunter Passcode or Share Link to view their live protocol.
          </p>

          <form onSubmit={handleInspectInput} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. PRML-7X9B or paste link"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C084FC]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-[#C084FC] text-black font-semibold text-xs"
            >
              Inspect
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-white/10 text-white/80 text-xs font-medium hover:bg-white/15"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { user, todaySummary, rpgAttributes, recentMemories } = currentDossier;

  // Ring percentages
  const questPct = todaySummary.totalQuests > 0
    ? Math.round((todaySummary.questsCompleted / todaySummary.totalQuests) * 100)
    : 0;
  const calPct = todaySummary.caloriesTarget > 0
    ? Math.round((todaySummary.caloriesConsumed / todaySummary.caloriesTarget) * 100)
    : 0;
  const waterPct = todaySummary.waterTargetMl > 0
    ? Math.round((todaySummary.waterConsumedMl / todaySummary.waterTargetMl) * 100)
    : 0;

  // Comparison metrics with active user
  const myQuestsCompleted = todayQuests.filter(q => q.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Frosted Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
      />

      {/* iOS Apple Action Sheet */}
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-xl bg-[#120D24]/95 border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto no-scrollbar space-y-4"
      >
        {/* Drawer Pill Handle */}
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto" />

        {/* Read-Only Encapsulation Banner */}
        <div className="rounded-2xl p-3 bg-gradient-to-r from-[#C084FC]/15 via-[#38BDF8]/15 to-transparent border border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/90">
            <Shield className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
            <span>
              <strong>Read-Only Ally Dossier:</strong> Inspecting {user.displayName}'s protocol. Your data is isolated.
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ally Selector Pills (if multiple allies saved) */}
        {allies.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {allies.map(a => (
              <button
                key={a.id}
                onClick={() => {
                  setSelectedAlly(a.payload);
                  setInspectingAlly(a.payload);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                  user.id === a.id
                    ? 'bg-[#C084FC] text-[#0A0714] font-bold border-[#C084FC] shadow-sm'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                }`}
              >
                <span>{a.avatarEmoji || '⚡'}</span>
                <span>{a.displayName}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hunter Identity Card */}
        <div className="rounded-3xl p-5 border border-white/20 bg-gradient-to-br from-[#1C1236] via-[#140E29] to-[#0A0716] shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C084FC] via-[#A855F7] to-[#7C3AED] flex items-center justify-center text-2xl shadow-lg border border-white/30">
                {user.avatarEmoji || '⚡'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {user.displayName}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/30 font-bold">
                    LVL {user.level}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#38BDF8] font-semibold mt-0.5">
                  {user.levelTitle}
                </p>
                <p className="text-[10px] text-[#9D94B8] font-mono mt-0.5">
                  Passcode: {user.id} • Day {user.currentDay} / 90
                </p>
              </div>
            </div>

            {/* Streak Flame */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB547]/20 border border-[#FFB547]/40 text-[#FFB547] text-xs font-mono font-bold shadow-sm">
                <Flame className="w-4 h-4 fill-current" />
                <span>{user.streakDays}d Streak</span>
              </div>
            </div>
          </div>

          {/* Activity Rings Breakdown */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <AppleActivityRings
              questPct={questPct}
              caloriePct={calPct}
              waterPct={waterPct}
              size={110}
              showLabels={true}
            />

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {/* Cheer Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendCheer}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C084FC] to-[#7C3AED] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(192,132,252,0.4)] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                <span>Send Resonance Cheer (+10 XP)</span>
                {cheerCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] font-mono">
                    {cheerCount}
                  </span>
                )}
              </motion.button>

              {/* Pin to Hunter Circle */}
              <button
                onClick={handleSaveToCircle}
                className="px-5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white/90 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#27E58C]" />
                    <span>Saved to Hunter Circle</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Pin to My Hunter Circle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Solo Leveling 4-Core Physical Routine Progress */}
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#C084FC]" />
              Solo Leveling Daily Training
            </span>
            <span className="text-[10px] font-mono text-[#27E58C] font-semibold">
              {todaySummary.soloLevelingQuests.completed ? 'COMPLETED TODAY' : 'IN PROGRESS'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#9D94B8] uppercase block">Push-ups</span>
              <span className="text-sm font-bold text-white font-mono">{todaySummary.soloLevelingQuests.pushups} / 100</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#9D94B8] uppercase block">Sit-ups</span>
              <span className="text-sm font-bold text-white font-mono">{todaySummary.soloLevelingQuests.situps} / 100</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#9D94B8] uppercase block">Squats</span>
              <span className="text-sm font-bold text-white font-mono">{todaySummary.soloLevelingQuests.squats} / 100</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#9D94B8] uppercase block">Run</span>
              <span className="text-sm font-bold text-[#38BDF8] font-mono">{todaySummary.soloLevelingQuests.runningKm} km</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Head-to-Head Comparison Matrix */}
        {hunterStats && activeUser && (
          <div className="rounded-2xl p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
              Head-to-Head Comparison: You vs {user.displayName}
            </h4>

            <div className="space-y-2 text-xs">
              {/* Hunter Level */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-semibold text-white/80">Hunter Level</span>
                <div className="flex items-center gap-3 font-mono font-bold">
                  <span className="text-[#C084FC]">You: LVL {hunterStats.level}</span>
                  <span className="text-white/30">vs</span>
                  <span className="text-[#38BDF8]">{user.displayName}: LVL {user.level}</span>
                </div>
              </div>

              {/* Current Streak */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-semibold text-white/80">Active Streak</span>
                <div className="flex items-center gap-3 font-mono font-bold">
                  <span className="text-[#FFB547]">You: {hunterStats.streakDays}d</span>
                  <span className="text-white/30">vs</span>
                  <span className="text-[#FFB547]">{user.displayName}: {user.streakDays}d</span>
                </div>
              </div>

              {/* Quests Completed Today */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-semibold text-white/80">Quests Today</span>
                <div className="flex items-center gap-3 font-mono font-bold">
                  <span className="text-[#27E58C]">You: {myQuestsCompleted}</span>
                  <span className="text-white/30">vs</span>
                  <span className="text-[#27E58C]">{user.displayName}: {todaySummary.questsCompleted}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RPG Attributes Grid (if provided) */}
        {rpgAttributes && (
          <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-3">
              RPG Power Matrix
            </span>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9D94B8] block">STR</span>
                <span className="text-sm font-bold text-white font-mono">{rpgAttributes.str}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9D94B8] block">AGI</span>
                <span className="text-sm font-bold text-white font-mono">{rpgAttributes.agi}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9D94B8] block">VIT</span>
                <span className="text-sm font-bold text-white font-mono">{rpgAttributes.vit}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9D94B8] block">INT</span>
                <span className="text-sm font-bold text-white font-mono">{rpgAttributes.int}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9D94B8] block">SEN</span>
                <span className="text-sm font-bold text-white font-mono">{rpgAttributes.sen}</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Another Passcode */}
        <form onSubmit={handleInspectInput} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Inspect another hunter (PRML-XXXX or link)..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C084FC]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors"
          >
            Load
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
        >
          Exit Dossier & Return to My System
        </button>
      </motion.div>
    </div>
  );
};

