import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../context/AppContext';
import { encodeSharePayloadToUrl } from '../../services/multiUserService';
import {
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  Shield,
  ExternalLink,
  Flame,
  Award,
  Zap,
  Users,
  QrCode,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppleShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAlliesCircle?: () => void;
}

export const AppleShareModal: React.FC<AppleShareModalProps> = ({
  isOpen,
  onClose,
  onOpenAlliesCircle
}) => {
  const {
    activeUser,
    userProfile,
    hunterStats,
    todayQuests,
    todayMeals,
    todayWaterMl,
    generateCurrentSharePayload
  } = useAppStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !activeUser || !userProfile || !hunterStats) return null;

  const payload = generateCurrentSharePayload();
  const shareUrl = payload ? encodeSharePayloadToUrl(payload) : '';

  const questsCompleted = todayQuests.filter(q => q.completed).length;
  const totalQuests = todayQuests.length || 7;
  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeUser.shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTextCard = () => {
    const text = `⚡ PRIMAL HUNTER DOSSIER ⚡\n` +
      `Hunter: ${activeUser.displayName} (${activeUser.avatarEmoji || '⚡'})\n` +
      `Rank: LVL 0${hunterStats.level} [${hunterStats.levelTitle}]\n` +
      `Streak: 🔥 ${hunterStats.streakDays} Days\n` +
      `Quests Today: ${questsCompleted}/${totalQuests} Completed\n` +
      `Energy Fuel: ${caloriesConsumed} / ${userProfile.dailyCalorieTarget} kcal\n` +
      `Share Passcode: ${activeUser.shareCode}\n` +
      `Inspect Protocol: ${shareUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeUser.displayName}'s Primal Hunter Protocol`,
          text: `Check out my Hunter ascent protocol (LVL 0${hunterStats.level} • Streak ${hunterStats.streakDays}d):`,
          url: shareUrl
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadDossier = () => {
    if (!payload) return;
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hunter-dossier-${activeUser.username}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Frosted Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* iOS Apple Action Sheet */}
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-lg bg-[#120D24]/95 border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Drawer Pill Handle */}
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#38BDF8]/30 to-[#C084FC]/30 flex items-center justify-center border border-white/15 shadow-sm">
              <Share2 className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Share Hunter Protocol
              </h2>
              <p className="text-[11px] text-[#9D94B8]">
                Allow peers to view your live stats • Safe encapsulation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Wallet / Passbook Style Holographic Card */}
        <div className="relative rounded-3xl p-5 overflow-hidden border border-white/20 bg-gradient-to-br from-[#1F143D] via-[#150F2E] to-[#0D0820] shadow-[0_12px_36px_rgba(114,92,255,0.25)] mb-5">
          {/* Holographic Sheen Top Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C084FC] via-[#38BDF8] to-[#34D399]" />

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C084FC] via-[#A855F7] to-[#7C3AED] flex items-center justify-center text-xl shadow-lg border border-white/30">
                {activeUser.avatarEmoji || '⚡'}
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] font-bold uppercase block">
                  [ HUNTER DOSSIER ]
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                  {activeUser.displayName}
                </h3>
                <span className="text-xs font-mono text-[#C084FC] font-semibold">
                  LVL 0{hunterStats.level} • {hunterStats.levelTitle}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFB547]/15 border border-[#FFB547]/40 text-[#FFB547] text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{hunterStats.streakDays}d Streak</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#9D94B8] block">Today's Quests</span>
              <span className="text-sm font-bold text-white font-mono">{questsCompleted} / {totalQuests}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#9D94B8] block">Fuel Energy</span>
              <span className="text-sm font-bold text-[#38BDF8] font-mono">{caloriesConsumed} kcal</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#9D94B8] block">Total Lifetime XP</span>
              <span className="text-sm font-bold text-[#C084FC] font-mono">{hunterStats.totalLifetimeXP}</span>
            </div>
          </div>

          {/* Passcode Badge */}
          <div className="mt-4 flex items-center justify-between text-xs font-mono">
            <span className="text-[#9D94B8]">HUNTER PASSCODE:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold tracking-widest transition-all"
            >
              <span>{activeUser.shareCode}</span>
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#27E58C]" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
            </button>
          </div>
        </div>

        {/* Share Action Grid */}
        <div className="space-y-3">
          {/* Main 1-Click Copy Link */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#0369A1] hover:brightness-110 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Encrypted Share Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy 1-Click Share Link</span>
              </>
            )}
          </motion.button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNativeShare}
              className="py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>iOS Device Share</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyTextCard}
              className="py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#27E58C]" />
                  <span>Card Copied!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Copy Text Card</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Export Dossier (.json) & Open Allies */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleDownloadDossier}
              className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#9D94B8] hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier .json</span>
            </button>

            {onOpenAlliesCircle && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAlliesCircle();
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#C084FC]/15 hover:bg-[#C084FC]/25 text-[#C084FC] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#C084FC]/30 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Inspect Allies Circle</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

