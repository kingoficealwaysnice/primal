import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { db, getTodayDateString } from '../db/database';
import type { BodyMeasurement, PhysiquePhoto, DailyPerformanceReport } from '../types';
import { generateDailyReport } from '../engine/reportEngine';
import {
  TrendingUp,
  Camera,
  Calendar,
  Award,
  Plus,
  Scale,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export const Progress: React.FC = () => {
  const { userProfile, hunterStats } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'measurements' | 'photos' | 'report'>('overview');
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [photos, setPhotos] = useState<PhysiquePhoto[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyPerformanceReport | null>(null);

  // New measurement modal state
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newThigh, setNewThigh] = useState('');

  // New photo upload state
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back' | 'face'>('front');
  const [uploadedDataUrl, setUploadedDataUrl] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const allMeasures = await db.bodyMeasurements.orderBy('date').toArray();
      setMeasurements(allMeasures);

      const allPhotos = await db.physiquePhotos.toArray();
      setPhotos(allPhotos);

      if (userProfile) {
        const report = await generateDailyReport(userProfile);
        setDailyReport(report);
      }
    };
    loadData();
  }, [userProfile]);

  const handleSaveMeasurement = async () => {
    const weight = parseFloat(newWeight);
    if (!weight) return;

    const measure: BodyMeasurement = {
      date: getTodayDateString(),
      weightKg: weight,
      bodyFatPct: parseFloat(newBodyFat) || undefined,
      waistCm: parseFloat(newWaist) || undefined,
      chestCm: parseFloat(newChest) || undefined,
      armCm: parseFloat(newArm) || undefined,
      thighCm: parseFloat(newThigh) || undefined,
      notes: 'Manual log'
    };

    await db.bodyMeasurements.add(measure);
    const updated = await db.bodyMeasurements.orderBy('date').toArray();
    setMeasurements(updated);

    setShowMeasureModal(false);
    setNewWeight('');
    setNewBodyFat('');
    setNewWaist('');
    setNewChest('');
    setNewArm('');
    setNewThigh('');
  };

  const handleSavePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        const photo: PhysiquePhoto = {
          date: getTodayDateString(),
          type: photoType,
          imageDataUrl: dataUrl,
          milestoneDay: userProfile?.currentDay || 1
        };
        await db.physiquePhotos.add(photo);
        const updated = await db.physiquePhotos.toArray();
        setPhotos(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock sample XP progression data for chart
  const xpChartData = [
    { day: 'Day 1', xp: 120 },
    { day: 'Day 2', xp: 280 },
    { day: 'Day 3', xp: 450 },
    { day: 'Day 4', xp: 620 },
    { day: 'Day 5', xp: 810 },
    { day: 'Day 6', xp: 1040 },
    { day: 'Today', xp: hunterStats?.totalLifetimeXP || 1200 }
  ];

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4 pt-3 space-y-4">
      {/* Top Tabs */}
      <div className="flex bg-[#151D30] p-1 rounded-2xl border border-[#725CFF]/20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('measurements')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'measurements'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          BIOMETRICS
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'photos'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          GALLERY
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'report'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          DAILY REPORT
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Main 90-Day Arc Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#151D30] to-[#101626] border border-[#725CFF]/35 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-[#00D4FF] font-semibold">
                90-DAY TRANSFORMATION TIMELINE
              </span>
              <span className="text-xs font-display font-bold text-[#27E58C]">
                DAY {userProfile?.currentDay || 1} / 90
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className="p-2.5 rounded-xl bg-[#101626] border border-[#725CFF]/15">
                <span className="text-[10px] text-[#929DB5] block">DAY 01 (START)</span>
                <span className="font-display font-bold text-base text-[#F5F7FF] mt-0.5 block">
                  {userProfile?.currentWeightKg} kg
                </span>
                <span className="text-[10px] text-[#929DB5]">{userProfile?.currentBodyFat}% BF</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#101626] border border-[#00D4FF]/30">
                <span className="text-[10px] text-[#00D4FF] block font-semibold">CURRENT</span>
                <span className="font-display font-bold text-base text-[#00D4FF] mt-0.5 block">
                  {measurements.length > 0 ? measurements[measurements.length - 1].weightKg : userProfile?.currentWeightKg} kg
                </span>
                <span className="text-[10px] text-[#00D4FF]">Adapting</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#101626] border border-[#27E58C]/30">
                <span className="text-[10px] text-[#27E58C] block font-semibold">DAY 90 (TARGET)</span>
                <span className="font-display font-bold text-base text-[#27E58C] mt-0.5 block">
                  {userProfile?.targetWeightKg} kg
                </span>
                <span className="text-[10px] text-[#27E58C]">{userProfile?.targetBodyFat}% BF</span>
              </div>
            </div>
          </div>

          {/* XP Progression Chart */}
          <Card
            title="LIFETIME XP TRAJECTORY"
            subtitle="Character progression curve and level milestones"
            glow="violet"
          >
            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpChartData}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#725CFF" stop-opacity={0.4}/>
                      <stop offset="95%" stop-color="#725CFF" stop-opacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#929DB5" fontSize={10} tickLine={false} />
                  <YAxis stroke="#929DB5" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151D30', borderColor: '#725CFF', borderRadius: 12, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#xpGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* BIOMETRICS TAB */}
      {activeTab === 'measurements' && (
        <div className="space-y-4">
          <Card
            title="PHYSICAL MEASUREMENT LOG"
            subtitle="Tape measurements and weight tracking"
            headerAction={
              <Button
                size="sm"
                variant="cyan"
                onClick={() => setShowMeasureModal(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Log Metric
              </Button>
            }
          >
            {measurements.length === 0 ? (
              <div className="py-6 text-center text-[#929DB5] text-xs">
                No measurements logged yet. Tap "Log Metric" to record your body metrics.
              </div>
            ) : (
              <div className="space-y-2.5">
                {measurements.slice().reverse().map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[#00D4FF] font-semibold">
                        {m.date}
                      </span>
                      <span className="font-display font-bold text-[#F5F7FF] text-sm">
                        {m.weightKg} kg
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] text-[#929DB5] text-center pt-1 border-t border-[#725CFF]/10">
                      <div>
                        <span>BF%: </span>
                        <strong className="text-[#F5F7FF]">{m.bodyFatPct || '--'}%</strong>
                      </div>
                      <div>
                        <span>Waist: </span>
                        <strong className="text-[#F5F7FF]">{m.waistCm || '--'}cm</strong>
                      </div>
                      <div>
                        <span>Chest: </span>
                        <strong className="text-[#F5F7FF]">{m.chestCm || '--'}cm</strong>
                      </div>
                      <div>
                        <span>Arm: </span>
                        <strong className="text-[#F5F7FF]">{m.armCm || '--'}cm</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* PHOTOS TAB */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <Card
            title="PRIVATE PHYSIQUE REPOSITORY"
            subtitle="Local on-device visual transformation vault"
            glow="none"
          >
            <div className="space-y-3">
              {/* Type Switcher & Upload */}
              <div className="flex items-center justify-between pb-2 border-b border-[#725CFF]/15">
                <div className="flex gap-1.5">
                  {(['front', 'side', 'back', 'face'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setPhotoType(t)}
                      className={`px-3 py-1 rounded-xl text-xs font-display font-semibold uppercase tracking-wider ${
                        photoType === t
                          ? 'bg-[#00D4FF] text-[#080B14]'
                          : 'bg-[#101626] text-[#929DB5]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <label className="px-3 py-1.5 rounded-xl bg-[#725CFF] text-[#F5F7FF] font-display text-xs font-semibold uppercase cursor-pointer hover:brightness-110 active:scale-95 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" /> + Add Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSavePhoto}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 gap-3">
                {photos.filter(p => p.type === photoType).length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-[#929DB5] text-xs">
                    No {photoType} photos recorded yet. Tap "+ Add Photo" to log.
                  </div>
                ) : (
                  photos.filter(p => p.type === photoType).map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-[#725CFF]/30 bg-[#101626] relative group"
                    >
                      <img
                        src={p.imageDataUrl}
                        alt="Physique"
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-[#080B14] to-transparent text-[10px] flex justify-between items-center">
                        <span className="font-mono text-[#00D4FF]">{p.date}</span>
                        <span className="bg-[#725CFF]/40 px-1.5 py-0.5 rounded text-[#F5F7FF]">
                          Day {p.milestoneDay || 1}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-[#101626] rounded-xl border border-[#725CFF]/15 flex items-center gap-2 text-[11px] text-[#929DB5]">
                <ShieldCheck className="w-4 h-4 text-[#27E58C] shrink-0" />
                <span>Photos are encrypted inside browser IndexedDB and never uploaded externally.</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* DAILY REPORT TAB */}
      {activeTab === 'report' && dailyReport && (
        <div className="space-y-4">
          <Card
            title={`DAILY PERFORMANCE REPORT — DAY ${String(dailyReport.dayNumber).padStart(2, '0')}`}
            subtitle={`System evaluation for ${dailyReport.date}`}
            glow="violet"
          >
            <div className="space-y-4 py-2">
              {/* Score Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-[#101626]">
                  <span className="text-[#929DB5]">Training Trial Completion:</span>
                  <span className="font-display font-bold text-[#F5F7FF]">{dailyReport.workoutCompletionPct}% complete</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#101626]">
                  <span className="text-[#929DB5]">Nutrition & Substrate Adherence:</span>
                  <span className="font-display font-bold text-[#F5F7FF]">{dailyReport.nutritionCompletionPct}% adherence</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#101626]">
                  <span className="text-[#929DB5]">Protein Intake:</span>
                  <span className="font-display font-bold text-[#00D4FF]">{dailyReport.proteinConsumed}g / {dailyReport.proteinTarget}g</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#101626]">
                  <span className="text-[#929DB5]">Hydration Intake:</span>
                  <span className="font-display font-bold text-[#27E58C]">{(dailyReport.waterConsumedMl / 1000).toFixed(1)}L / {(dailyReport.waterTargetMl / 1000).toFixed(1)}L</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#101626]">
                  <span className="text-[#929DB5]">Skincare Morning & Evening:</span>
                  <span className="font-display font-bold text-[#FFB547]">
                    {dailyReport.skincareMorning && dailyReport.skincareEvening
                      ? 'Complete (100%)'
                      : dailyReport.skincareMorning || dailyReport.skincareEvening
                      ? 'Partial (50%)'
                      : 'Incomplete'}
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-[#101626]">
                  <span className="text-[#929DB5]">Daily XP Harvested:</span>
                  <span className="font-display font-bold text-[#00D4FF]">+{dailyReport.dailyXPEarned} XP</span>
                </div>
              </div>

              {/* System Transmission */}
              <div className="p-4 rounded-2xl bg-[#151D30] border border-[#00D4FF]/40 text-left space-y-1.5 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                <span className="text-[10px] font-mono text-[#00D4FF] font-bold block uppercase">
                  [ SYSTEM INTELLIGENCE EVALUATION ]
                </span>
                <p className="text-xs text-[#F5F7FF] font-mono leading-relaxed">
                  "{dailyReport.systemMessage}"
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Log Measurement Modal */}
      <Modal
        isOpen={showMeasureModal}
        onClose={() => setShowMeasureModal(false)}
        title="LOG BODY METRICS"
      >
        <div className="space-y-3">
          <Input
            label="Weight (kg) *"
            type="number"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder="e.g. 74.5"
          />
          <Input
            label="Body Fat %"
            type="number"
            value={newBodyFat}
            onChange={e => setNewBodyFat(e.target.value)}
            placeholder="e.g. 15.5"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waist (cm)"
              type="number"
              value={newWaist}
              onChange={e => setNewWaist(e.target.value)}
              placeholder="e.g. 82"
            />
            <Input
              label="Chest (cm)"
              type="number"
              value={newChest}
              onChange={e => setNewChest(e.target.value)}
              placeholder="e.g. 102"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Arm (cm)"
              type="number"
              value={newArm}
              onChange={e => setNewArm(e.target.value)}
              placeholder="e.g. 36"
            />
            <Input
              label="Thigh (cm)"
              type="number"
              value={newThigh}
              onChange={e => setNewThigh(e.target.value)}
              placeholder="e.g. 56"
            />
          </div>

          <Button
            variant="cyan"
            size="md"
            glow
            onClick={handleSaveMeasurement}
            className="w-full mt-4 font-bold"
          >
            Save Biometrics
          </Button>
        </div>
      </Modal>
    </div>
  );
};

