import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { SkincareTracker } from '../components/skincare/SkincareTracker';
import { FacialAesthetics } from '../components/facial/FacialAesthetics';
import { HunterStatusWindow } from '../components/sololeveling/HunterStatusWindow';
import { EdgeCaseTester } from '../components/diagnostic/EdgeCaseTester';
import { exportAllData, importData, resetAllData } from '../utils/dataBackup';
import { db } from '../db/database';
import type { Achievement } from '../types';
import {
  User,
  Shield,
  Trophy,
  Dumbbell,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const Profile: React.FC = () => {
  const {
    userProfile,
    hunterStats,
    equipmentMode,
    setEquipmentMode,
    saveUserProfile,
    reloadAllData
  } = useAppStore();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditTargetsModal, setShowEditTargetsModal] = useState(false);

  // Editable targets
  const [editCalories, setEditCalories] = useState(userProfile?.dailyCalorieTarget || 2100);
  const [editProtein, setEditProtein] = useState(userProfile?.dailyProteinTarget || 140);
  const [editWater, setEditWater] = useState(userProfile?.dailyWaterTargetMl || 3000);
  const [editSteps, setEditSteps] = useState(userProfile?.dailyWalkingStepsTarget || 10000);

  useEffect(() => {
    const loadAch = async () => {
      const all = await db.achievements.toArray();
      setAchievements(all);
    };
    loadAch();
  }, []);

  const handleSaveTargets = async () => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      dailyCalorieTarget: editCalories,
      dailyProteinTarget: editProtein,
      dailyWaterTargetMl: editWater,
      dailyWalkingStepsTarget: editSteps
    };
    await saveUserProfile(updated);
    setShowEditTargetsModal(false);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      try {
        await importData(text);
        alert('System data restored successfully.');
        await reloadAllData();
      } catch (err: any) {
        alert('Failed to import backup: ' + err.message);
      }
    }
  };

  const handleHardReset = async () => {
    await resetAllData();
    window.location.reload();
  };

  if (!userProfile || !hunterStats) return null;

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4 pt-3 space-y-4">
      {/* Hunter Identity Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#151D30] to-[#101626] border border-[#725CFF]/35 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#725CFF] to-[#00D4FF] p-0.5 shadow-[0_0_25px_rgba(114,92,255,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center">
              <span className="font-display font-black text-2xl text-[#00D4FF]">
                {userProfile.fullName[0].toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-display uppercase tracking-[0.2em] text-[#00D4FF] font-semibold">
              HUNTER PROFILE
            </span>
            <h2 className="font-display font-black text-xl text-[#F5F7FF] uppercase tracking-wider">
              {userProfile.fullName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-display font-bold uppercase text-[#725CFF] bg-[#725CFF]/15 px-2.5 py-0.5 rounded-full border border-[#725CFF]/30">
                LEVEL {hunterStats.level} — {hunterStats.levelTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime XP & Streak Bar */}
        <div className="mt-4 pt-3 border-t border-[#725CFF]/15 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#101626] border border-[#725CFF]/15">
            <span className="text-[10px] text-[#929DB5] block">LIFETIME XP</span>
            <span className="font-display font-bold text-[#00D4FF] text-sm">{hunterStats.totalLifetimeXP}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101626] border border-[#725CFF]/15">
            <span className="text-[10px] text-[#929DB5] block">STREAK</span>
            <span className="font-display font-bold text-[#FFB547] text-sm flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-[#FFB547]" /> {hunterStats.streakDays}d
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101626] border border-[#725CFF]/15">
            <span className="text-[10px] text-[#929DB5] block">TRANSFORMATION</span>
            <span className="font-display font-bold text-[#27E58C] text-sm">
              Day {userProfile.currentDay}/90
            </span>
          </div>
        </div>
      </div>

      {/* Solo Leveling Character Attributes Window */}
      <HunterStatusWindow />

      {/* Skincare & Facial Aesthetics Modules */}
      <SkincareTracker />
      <FacialAesthetics />

      {/* Hunter Achievements Gallery */}
      <Card
        title="HUNTER TROPHY VAULT"
        subtitle="Progression achievements and system commendations"
        glow="violet"
      >
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border text-xs transition-all ${
                  isUnlocked
                    ? 'bg-[#101626] border-[#00D4FF]/40 shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                    : 'bg-[#151D30]/60 border-[#725CFF]/15 text-[#929DB5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#151D30] border border-[#725CFF]/30 flex items-center justify-center">
                    {isUnlocked ? (
                      <Trophy className="w-4 h-4 text-[#00D4FF]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#929DB5]" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#FFB547]">
                    +{ach.xpReward} XP
                  </span>
                </div>

                <h4 className={`font-display font-bold text-xs ${isUnlocked ? 'text-[#F5F7FF]' : 'text-[#929DB5]'}`}>
                  {ach.title}
                </h4>
                <p className="text-[10px] text-[#929DB5] mt-0.5 leading-tight line-clamp-2">
                  {ach.description}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Equipment Configuration */}
      <Card
        title="EQUIPMENT CALIBRATION"
        subtitle="Toggle training modality between pure bodyweight and dumbbell overload"
      >
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#101626] border border-[#725CFF]/20">
          <div>
            <span className="font-display font-bold text-xs text-[#F5F7FF] block">
              TRAINING MODALITY
            </span>
            <span className="text-[10px] text-[#929DB5]">
              Currently: {equipmentMode === 'dumbbell' ? 'Bodyweight + Dumbbells' : 'Pure Bodyweight Calisthenics'}
            </span>
          </div>

          <button
            onClick={() => setEquipmentMode(equipmentMode === 'bodyweight' ? 'dumbbell' : 'bodyweight')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider border transition-all ${
              equipmentMode === 'dumbbell'
                ? 'bg-[#00D4FF] text-[#080B14] border-[#00D4FF]'
                : 'bg-[#725CFF] text-[#F5F7FF] border-[#725CFF]'
            }`}
          >
            {equipmentMode === 'dumbbell' ? 'Dumbbell Mode' : 'Bodyweight Mode'}
          </button>
        </div>
      </Card>

      {/* Target Calibration Card */}
      <Card
        title="TARGET RECALIBRATION"
        subtitle="Adjust daily calorie, protein, and water targets"
        headerAction={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowEditTargetsModal(true)}
          >
            Edit Targets
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#101626]">
            <span className="text-[10px] text-[#929DB5] block">Calories:</span>
            <span className="font-bold text-[#F5F7FF]">{userProfile.dailyCalorieTarget} kcal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101626]">
            <span className="text-[10px] text-[#929DB5] block">Protein:</span>
            <span className="font-bold text-[#00D4FF]">{userProfile.dailyProteinTarget}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101626]">
            <span className="text-[10px] text-[#929DB5] block">Water:</span>
            <span className="font-bold text-[#27E58C]">{(userProfile.dailyWaterTargetMl / 1000).toFixed(1)}L</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#101626]">
            <span className="text-[10px] text-[#929DB5] block">Steps:</span>
            <span className="font-bold text-[#FFB547]">{userProfile.dailyWalkingStepsTarget.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* System Diagnostic & Edge Case Testing Lab */}
      <EdgeCaseTester />

      {/* Data Backup & Privacy Section */}
      <Card
        title="SYSTEM DATA VAULT & BACKUP"
        subtitle="Export, restore, or reset local encrypted database"
      >
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={exportAllData}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Data (JSON)
            </Button>

            <label className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#151D30] hover:bg-[#1B253D] border border-[#725CFF]/30 text-xs font-display font-medium text-[#F5F7FF] cursor-pointer transition-all active:scale-95 text-center">
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Restore Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowResetModal(true)}
            className="w-full text-xs font-semibold"
          >
            Reset System & Wipe All Local Data
          </Button>
        </div>
      </Card>

      {/* Edit Targets Modal */}
      <Modal
        isOpen={showEditTargetsModal}
        onClose={() => setShowEditTargetsModal(false)}
        title="RECALIBRATE TARGETS"
      >
        <div className="space-y-3">
          <Input
            label="Daily Calories (kcal)"
            type="number"
            value={editCalories}
            onChange={e => setEditCalories(parseInt(e.target.value) || 2000)}
          />
          <Input
            label="Daily Protein (g)"
            type="number"
            value={editProtein}
            onChange={e => setEditProtein(parseInt(e.target.value) || 140)}
          />
          <Input
            label="Daily Water (ml)"
            type="number"
            value={editWater}
            onChange={e => setEditWater(parseInt(e.target.value) || 3000)}
          />
          <Input
            label="Daily Steps Goal"
            type="number"
            value={editSteps}
            onChange={e => setEditSteps(parseInt(e.target.value) || 10000)}
          />

          <Button
            variant="cyan"
            size="md"
            glow
            onClick={handleSaveTargets}
            className="w-full mt-4 font-bold"
          >
            Update System Targets
          </Button>
        </div>
      </Modal>

      {/* Wipe Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="CONFIRM SYSTEM RESET"
      >
        <div className="space-y-4 text-xs text-[#929DB5] leading-relaxed">
          <p className="text-[#FF5263] font-semibold">
            WARNING: This action is permanent and cannot be undone.
          </p>
          <p>
            All 90-day progress, workout logs, physique photographs, and XP will be permanently purged from this device.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleHardReset}
              className="flex-1 font-bold"
            >
              Confirm Wipe
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

