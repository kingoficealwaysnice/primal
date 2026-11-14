import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../context/AppContext';
import type { AvatarColorTheme, FitnessLevel, EquipmentType } from '../../types';
import {
  Users,
  UserPlus,
  Check,
  Shield,
  Trash2,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  Dumbbell
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppleUserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_COLORS: { id: AvatarColorTheme; label: string; gradient: string; glow: string }[] = [
  { id: 'violet', label: 'Awakener', gradient: 'from-[#C084FC] via-[#A855F7] to-[#7C3AED]', glow: 'rgba(192, 132, 252, 0.4)' },
  { id: 'cyan', label: 'Monarch', gradient: 'from-[#38BDF8] via-[#0284C7] to-[#0369A1]', glow: 'rgba(56, 189, 248, 0.4)' },
  { id: 'emerald', label: 'Vitality', gradient: 'from-[#34D399] via-[#059669] to-[#047857]', glow: 'rgba(52, 211, 153, 0.4)' },
  { id: 'amber', label: 'Solar', gradient: 'from-[#FBBF24] via-[#D97706] to-[#B45309]', glow: 'rgba(251, 191, 36, 0.4)' },
  { id: 'rose', label: 'Sovereign', gradient: 'from-[#FB7185] via-[#E11D48] to-[#9F1239]', glow: 'rgba(251, 113, 133, 0.4)' }
];

const EMOJI_OPTIONS = ['⚡', '🛡️', '🗡️', '🔥', '👑', '🐺', '🦾', '🦅'];

export const AppleUserSwitcherModal: React.FC<AppleUserSwitcherModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    activeUser,
    allUsers,
    switchActiveUser,
    registerHunterUser,
    removeHunterAccount,
    addNotification
  } = useAppStore();

  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [newHunterName, setNewHunterName] = useState('');
  const [selectedColor, setSelectedColor] = useState<AvatarColorTheme>('cyan');
  const [selectedEmoji, setSelectedEmoji] = useState('🛡️');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('intermediate');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('bodyweight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSwitchUser = async (userId: string) => {
    if (userId === activeUser?.id) return;
    await switchActiveUser(userId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#C084FC', '#38BDF8', '#34D399']
    });
    onClose();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHunterName.trim()) return;

    setIsSubmitting(true);
    try {
      await registerHunterUser(newHunterName.trim(), {
        avatarColor: selectedColor,
        avatarEmoji: selectedEmoji,
        fitnessLevel,
        equipmentType
      });

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#C084FC', '#38BDF8', '#FBBF24']
      });

      setNewHunterName('');
      setMode('list');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to register new hunter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await removeHunterAccount(userId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Apple Frosted Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xl transition-all"
      />

      {/* iOS Apple Action Sheet / Drawer */}
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-lg bg-[#120D24]/95 border-t sm:border border-white/15 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Apple Drawer Pill Handle */}
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C084FC]/30 to-[#38BDF8]/30 flex items-center justify-center border border-white/15 shadow-sm">
              <Users className="w-5 h-5 text-[#C084FC]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {mode === 'list' ? 'Hunter Accounts' : 'Awaken New Hunter'}
              </h2>
              <p className="text-[11px] text-[#9D94B8]">
                {mode === 'list' ? 'Multi-user protocol • Encapsulated data' : 'Register an isolated Hunter workspace'}
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

        {/* VIEW 1: ACCOUNTS LIST */}
        {mode === 'list' && (
          <div className="space-y-4">
            {/* Encapsulation Guarantee Banner */}
            <div className="rounded-2xl p-3 bg-gradient-to-r from-[#C084FC]/10 via-[#38BDF8]/10 to-transparent border border-white/10 flex items-center gap-3 text-xs text-white/80">
              <Shield className="w-4 h-4 text-[#C084FC] flex-shrink-0" />
              <span>
                <strong>Zero Data Bleed:</strong> Each Hunter profile maintains its own isolated workout history, quests, stats, and memories.
              </span>
            </div>

            {/* List of Registered Accounts */}
            <div className="space-y-2.5">
              {allUsers.map(user => {
                const isActive = user.id === activeUser?.id;
                const colorConfig = AVATAR_COLORS.find(c => c.id === user.avatarColor) || AVATAR_COLORS[0];

                return (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSwitchUser(user.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-gradient-to-r from-white/10 to-white/5 border-[#C084FC]/60 shadow-[0_0_20px_rgba(192,132,252,0.2)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${colorConfig.gradient} flex items-center justify-center text-lg shadow-md border border-white/30 flex-shrink-0`}
                      >
                        {user.avatarEmoji || '⚡'}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white truncate">
                            {user.displayName}
                          </span>
                          {user.isPrimary && (
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/40">
                              Primary
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#9D94B8]">
                          <span className="font-mono text-[#38BDF8]">LVL {user.level}</span>
                          <span>•</span>
                          <span className="font-mono text-white/50">{user.shareCode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action / Active Pill */}
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#27E58C]/15 border border-[#27E58C]/40 text-[#27E58C] text-xs font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchUser(user.id);
                          }}
                          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#C084FC] text-white hover:text-[#0A0714] text-xs font-semibold transition-all"
                        >
                          Switch
                        </button>
                      )}

                      {!user.isPrimary && !isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirmDeleteId === user.id) {
                              handleDeleteUser(user.id);
                            } else {
                              setConfirmDeleteId(user.id);
                            }
                          }}
                          className={`p-1.5 rounded-xl border transition-all ${
                            confirmDeleteId === user.id
                              ? 'bg-[#FF5263] border-[#FF5263] text-white'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-[#FF5263]'
                          }`}
                          title={confirmDeleteId === user.id ? 'Click again to confirm delete' : 'Delete user'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Register New Account Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('create')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C084FC] to-[#7C3AED] hover:brightness-110 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(192,132,252,0.35)] transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Hunter Profile</span>
            </motion.button>
          </div>
        )}

        {/* VIEW 2: CREATE NEW HUNTER FORM */}
        {mode === 'create' && (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9D94B8] mb-1.5">
                Hunter Name / Handle
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sung Jin-woo, Alex, Hunter X"
                value={newHunterName}
                onChange={(e) => setNewHunterName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#C084FC] transition-colors text-sm font-medium"
              />
            </div>

            {/* Avatar Theme Color */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9D94B8] mb-2">
                Aura Color Theme
              </label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_COLORS.map(col => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col.id)}
                    className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedColor === col.id
                        ? 'border-white bg-white/15 scale-105 shadow-md'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 opacity-70'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${col.gradient}`} />
                    <span className="text-[10px] text-white/80 font-medium">{col.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Icon */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9D94B8] mb-2">
                Hunter Sigil
              </label>
              <div className="flex gap-2 justify-between">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center border transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-white/20 border-white scale-110 shadow-sm'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Fitness Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9D94B8] mb-1.5">
                  Fitness Level
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#C084FC]"
                >
                  <option value="beginner" className="bg-[#120D24]">Beginner</option>
                  <option value="intermediate" className="bg-[#120D24]">Intermediate</option>
                  <option value="advanced" className="bg-[#120D24]">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9D94B8] mb-1.5">
                  Equipment
                </label>
                <select
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value as EquipmentType)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#C084FC]"
                >
                  <option value="bodyweight" className="bg-[#120D24]">Bodyweight Only</option>
                  <option value="dumbbells" className="bg-[#120D24]">Dumbbells</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
              >
                Back to List
              </button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !newHunterName.trim()}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#C084FC] to-[#7C3AED] hover:brightness-110 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Awakening...' : 'Awaken Hunter'}</span>
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

