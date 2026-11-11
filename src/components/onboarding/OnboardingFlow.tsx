import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import type { UserProfile, FitnessLevel, EquipmentType, DumbbellConfig } from '../../types';
import { calculateNutritionTargets } from '../../engine/calorieEngine';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { db, getTodayDateString } from '../../db/database';
import { Shield, Sparkles, ChevronRight, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react';
import { AwakenHeroScreen } from '../sololeveling/AwakenHeroScreen';

export const OnboardingFlow: React.FC = () => {
  const { saveUserProfile } = useAppStore();

  // Step state: 0 = Cinematic Splash, 1..7 = Onboarding Steps
  const [step, setStep] = useState<number>(0);

  // Form State
  const [fullName, setFullName] = useState('Khushal');
  const [age, setAge] = useState(25);
  const [dateOfBirth, setDateOfBirth] = useState('1999-01-01');
  const [gender, setGender] = useState('Male');
  const [heightCm, setHeightCm] = useState(178);
  const [currentWeightKg, setCurrentWeightKg] = useState(78);
  const [targetWeightKg, setTargetWeightKg] = useState(72);
  const [currentBodyFat, setCurrentBodyFat] = useState(20);
  const [targetBodyFat, setTargetBodyFat] = useState(12);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'>('moderately_active');
  const [occupation, setOccupation] = useState('Desk Worker / Hybrid');

  // Step 2: Physique Photos (data URLs)
  const [frontPhoto, setFrontPhoto] = useState<string>('');
  const [sidePhoto, setSidePhoto] = useState<string>('');
  const [backPhoto, setBackPhoto] = useState<string>('');
  const [facePhoto, setFacePhoto] = useState<string>('');

  // Step 3: Target Physique Goals
  const [goals, setGoals] = useState<string[]>([
    'Lean athletic physique',
    'Visible abs',
    'Reduced overall body fat',
    'Improved facial definition'
  ]);
  const [goalNotes, setGoalNotes] = useState('');

  // Step 4: Equipment
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('bodyweight');
  const [dumbbellConfig, setDumbbellConfig] = useState<DumbbellConfig>({
    hasAdjustable: true,
    maxWeightKg: 20,
    isPair: true
  });

  // Step 5: Fitness Level
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('beginner');
  const [initialPushups, setInitialPushups] = useState(20);
  const [initialSquats, setInitialSquats] = useState(30);
  const [initialPlankSeconds, setInitialPlankSeconds] = useState(45);
  const [initialPullups, setInitialPullups] = useState(3);
  const [limitations, setLimitations] = useState('None');

  // Step 6: Targets
  const [dailyCalories, setDailyCalories] = useState(2100);
  const [dailyProtein, setDailyProtein] = useState(150);
  const [dailyCarbs, setDailyCarbs] = useState(220);
  const [dailyFats, setDailyFats] = useState(60);
  const [dailyWater, setDailyWater] = useState(3200);
  const [dailySteps, setDailySteps] = useState(10000);
  const [sleepHours, setSleepHours] = useState(8);
  const [workoutFrequency, setWorkoutFrequency] = useState(6);
  const [preferredTime, setPreferredTime] = useState('Morning (07:00 AM)');

  // Recalculate targets when reaching step 6
  const handleProceedToStep6 = () => {
    const calculated = calculateNutritionTargets(
      currentWeightKg,
      heightCm,
      age,
      gender,
      activityLevel,
      goals
    );
    setDailyCalories(calculated.recommendedCalories);
    setDailyProtein(calculated.recommendedProteinGrams);
    setDailyCarbs(calculated.recommendedCarbsGrams);
    setDailyFats(calculated.recommendedFatsGrams);
    setDailyWater(calculated.recommendedWaterMl);
    setDailySteps(calculated.recommendedDailySteps);
    setStep(6);
  };

  // Photo upload helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Final Activation
  const handleFinalActivation = async () => {
    const profile: UserProfile = {
      fullName,
      age,
      dateOfBirth,
      gender,
      heightCm,
      currentWeightKg,
      targetWeightKg,
      currentBodyFat,
      targetBodyFat,
      activityLevel,
      occupation,
      targetPhysiqueGoals: goals,
      physiqueGoalNotes: goalNotes,
      equipmentType,
      dumbbellConfig: equipmentType === 'dumbbells' ? dumbbellConfig : undefined,
      fitnessLevel,
      initialPushups,
      initialSquats,
      initialPlankSeconds,
      initialPullups,
      limitationsOrInjuries: limitations,
      transformationDays: 90,
      dailyCalorieTarget: dailyCalories,
      dailyProteinTarget: dailyProtein,
      dailyCarbsTarget: dailyCarbs,
      dailyFatsTarget: dailyFats,
      dailyWaterTargetMl: dailyWater,
      dailyWalkingStepsTarget: dailySteps,
      sleepTargetHours: sleepHours,
      workoutFrequencyDaysPerWeek: workoutFrequency,
      preferredWorkoutTime: preferredTime,
      currentDay: 1,
      startDate: getTodayDateString(),
      isOnboarded: true,
      createdAt: new Date().toISOString()
    };

    // Save initial photos if provided
    if (frontPhoto) {
      await db.physiquePhotos.add({
        date: getTodayDateString(),
        type: 'front',
        imageDataUrl: frontPhoto,
        milestoneDay: 1
      });
    }
    if (sidePhoto) {
      await db.physiquePhotos.add({
        date: getTodayDateString(),
        type: 'side',
        imageDataUrl: sidePhoto,
        milestoneDay: 1
      });
    }
    if (backPhoto) {
      await db.physiquePhotos.add({
        date: getTodayDateString(),
        type: 'back',
        imageDataUrl: backPhoto,
        milestoneDay: 1
      });
    }
    if (facePhoto) {
      await db.physiquePhotos.add({
        date: getTodayDateString(),
        type: 'face',
        imageDataUrl: facePhoto,
        milestoneDay: 1
      });
    }

    // Save initial body measurement
    await db.bodyMeasurements.add({
      date: getTodayDateString(),
      weightKg: currentWeightKg,
      bodyFatPct: currentBodyFat,
      notes: 'Initial registration measurement'
    });

    await saveUserProfile(profile);
  };

  // STEP 0: Cinematic Startup Splash (Awaken Hero Theme scaled for iPhone 16 Pro Max)
  if (step === 0) {
    return <AwakenHeroScreen onGetStarted={() => setStep(1)} />;
  }

  // STEP 7: Activation Screen (Awaken Theme)
  if (step === 7) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0714] flex flex-col items-center justify-between px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),2rem)] h-[100dvh] overflow-hidden select-none">
        {/* Ambient Amethyst Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[130px] pointer-events-none" />

        <div className="text-center relative z-10 pt-4">
          <span className="text-[11px] font-cinzel uppercase tracking-[0.3em] text-[#C084FC] font-bold animate-pulse block">
            [ SYSTEM ACTIVATION SEQUENCE ]
          </span>
        </div>

        <div className="text-center max-w-sm w-full space-y-6 relative z-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#18112E] border-2 border-[#C084FC] flex items-center justify-center shadow-[0_0_35px_rgba(192,132,252,0.45)]">
            <CheckCircle2 className="w-12 h-12 text-[#C084FC]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-cinzel font-black text-2xl text-[#F5F7FF] tracking-wider uppercase drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]">
              HUNTER PROFILE CREATED
            </h2>
            <p className="text-xs text-[#9D94B8] font-mono">
              Physical parameters analyzed. 90-Day protocol generated.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#16102D]/90 border border-[#A78BFA]/30 text-left space-y-2 font-mono text-xs shadow-lg">
            <div className="text-[#00D4FF] font-bold">[ INITIAL ASSESSMENT COMPLETE ]</div>
            <div className="text-[#F5F7FF]">HUNTER: {fullName.toUpperCase()}</div>
            <div className="text-[#9D94B8]">RANK: LEVEL 01 — AWAKENED</div>
            <div className="text-[#9D94B8]">DAILY CALORIES: ~{dailyCalories} kcal</div>
            <div className="text-[#9D94B8]">DAILY PROTEIN: {dailyProtein}g</div>
            <div className="text-[#27E58C] font-bold">[ YOUR TRANSFORMATION BEGINS NOW. ]</div>
          </div>
        </div>

        <div className="w-full max-w-sm pb-2 relative z-10">
          <button
            onClick={handleFinalActivation}
            className="w-full h-14 sm:h-16 rounded-full bg-[#C084FC] hover:bg-[#D8B4FE] text-[#0A0714] font-cinzel font-black text-sm tracking-[0.15em] uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_35px_rgba(192,132,252,0.6)] flex items-center justify-center gap-2"
          >
            ENTER THE SYSTEM <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  // Multi-step Wizard (Steps 1 through 6 in Awaken Theme, scaled for iPhone 16 Pro Max)
  return (
    <div className="min-h-[100dvh] bg-[#0A0714] text-[#F5F7FF] px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-[max(env(safe-area-inset-bottom),2rem)] flex flex-col justify-between max-w-lg mx-auto relative overflow-hidden select-none">
      {/* Background radial violet glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#7C3AED]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Progress Indicator */}
      <div className="mb-5 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-[#9D94B8] mb-2">
          <span className="font-cinzel text-[#C084FC] font-bold tracking-wider">
            STEP 0{step} / 06
          </span>
          <span className="text-[#F5F7FF] font-semibold text-[11px] font-mono tracking-wider">
            {step === 1 && 'PERSONAL METRICS'}
            {step === 2 && 'PHYSIQUE REGISTRATION'}
            {step === 3 && 'TARGET PHYSIQUE'}
            {step === 4 && 'EQUIPMENT MODE'}
            {step === 5 && 'FITNESS BENCHMARKS'}
            {step === 6 && 'PROTOCOL CALIBRATION'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#17112B] rounded-full overflow-hidden border border-[#A78BFA]/30">
          <div
            className="h-full bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] shadow-[0_0_10px_rgba(192,132,252,0.8)] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F5F7FF]">
              STEP 1: PERSONAL INFORMATION
            </h2>
            <p className="text-xs text-[#929DB5] mt-1">
              Provide baseline biometric data to calibrate your transformation engine.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              label="Full Name / Hunter Designation"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Khushal"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age (Years)"
                type="number"
                value={age}
                onChange={e => setAge(parseInt(e.target.value) || 20)}
              />
              <Input
                label="Gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
                placeholder="Male / Female / Other"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Height (cm)"
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(parseInt(e.target.value) || 170)}
              />
              <Input
                label="Current Weight (kg)"
                type="number"
                value={currentWeightKg}
                onChange={e => setCurrentWeightKg(parseFloat(e.target.value) || 70)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Weight (kg)"
                type="number"
                value={targetWeightKg}
                onChange={e => setTargetWeightKg(parseFloat(e.target.value) || 68)}
              />
              <Input
                label="Est. Body Fat %"
                type="number"
                value={currentBodyFat}
                onChange={e => setCurrentBodyFat(parseFloat(e.target.value) || 18)}
              />
            </div>

            <div>
              <label className="block text-xs font-display font-medium uppercase tracking-wider text-[#929DB5] mb-1.5">
                Daily Activity Pattern
              </label>
              <select
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value as any)}
                className="w-full bg-[#101626] border border-[#725CFF]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] outline-none"
              >
                <option value="sedentary">Sedentary (Desk Job, Little Movement)</option>
                <option value="lightly_active">Lightly Active (1-3 days exercise)</option>
                <option value="moderately_active">Moderately Active (3-5 days exercise)</option>
                <option value="very_active">Very Active (6-7 days hard training)</option>
                <option value="extra_active">Extra Active (Intense training + physical job)</option>
              </select>
            </div>

            <Input
              label="Occupation / Daily Routine"
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
              placeholder="e.g. Software Engineer, Student"
            />
          </div>
        </div>
      )}

      {/* STEP 2: Physique Registration */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F5F7FF]">
              STEP 2: PHYSIQUE REGISTRATION
            </h2>
            <p className="text-xs text-[#929DB5] mt-1">
              Upload Day 01 baseline photographs. All images remain strictly private and stored locally on this iPhone.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Front */}
            <div className="bg-[#151D30] border border-[#725CFF]/30 rounded-2xl p-3 text-center flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
              {frontPhoto ? (
                <img src={frontPhoto} alt="Front" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#725CFF] mb-1" />
                  <span className="text-xs font-semibold text-[#F5F7FF]">Front View</span>
                  <span className="text-[10px] text-[#929DB5]">Tap to upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => handlePhotoUpload(e, setFrontPhoto)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Side */}
            <div className="bg-[#151D30] border border-[#725CFF]/30 rounded-2xl p-3 text-center flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
              {sidePhoto ? (
                <img src={sidePhoto} alt="Side" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#725CFF] mb-1" />
                  <span className="text-xs font-semibold text-[#F5F7FF]">Side View</span>
                  <span className="text-[10px] text-[#929DB5]">Tap to upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => handlePhotoUpload(e, setSidePhoto)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Back */}
            <div className="bg-[#151D30] border border-[#725CFF]/30 rounded-2xl p-3 text-center flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
              {backPhoto ? (
                <img src={backPhoto} alt="Back" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#725CFF] mb-1" />
                  <span className="text-xs font-semibold text-[#F5F7FF]">Back View</span>
                  <span className="text-[10px] text-[#929DB5]">Tap to upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => handlePhotoUpload(e, setBackPhoto)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Face */}
            <div className="bg-[#151D30] border border-[#725CFF]/30 rounded-2xl p-3 text-center flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
              {facePhoto ? (
                <img src={facePhoto} alt="Face" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#00D4FF] mb-1" />
                  <span className="text-xs font-semibold text-[#F5F7FF]">Face Portrait</span>
                  <span className="text-[10px] text-[#929DB5]">Optional for jawline tracking</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => handlePhotoUpload(e, setFacePhoto)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-[#101626] rounded-xl border border-[#725CFF]/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#27E58C] shrink-0" />
            <p className="text-[11px] text-[#929DB5]">
              Local storage guarantee: Photos never leave this device.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Target Physique */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F5F7FF]">
              STEP 3: TARGET PHYSIQUE
            </h2>
            <p className="text-xs text-[#929DB5] mt-1">
              Select all physical attributes you wish to develop over the next 90 days.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              'Lean athletic physique',
              'Muscular aesthetic physique',
              'Visible abs',
              'Broader shoulders',
              'Bigger chest',
              'Bigger arms',
              'Stronger back',
              'Reduced overall body fat',
              'Improved facial definition',
              'Better skin',
              'Improved stamina',
              'General physical transformation'
            ].map(item => {
              const selected = goals.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => {
                    setGoals(prev =>
                      selected ? prev.filter(g => g !== item) : [...prev, item]
                    );
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    selected
                      ? 'bg-[#725CFF]/20 border-[#00D4FF] text-[#F5F7FF] shadow-[0_0_12px_rgba(0,212,255,0.2)]'
                      : 'bg-[#151D30] border-[#725CFF]/20 text-[#929DB5]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-display font-medium uppercase tracking-wider text-[#929DB5] mb-1.5">
              Specific Physique Vision Notes
            </label>
            <textarea
              rows={2}
              value={goalNotes}
              onChange={e => setGoalNotes(e.target.value)}
              placeholder="e.g. Sharp jawline, tight waist, athletic V-taper"
              className="w-full bg-[#101626] border border-[#725CFF]/25 rounded-xl p-3 text-xs text-[#F5F7FF] outline-none"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Equipment */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F5F7FF]">
              STEP 4: AVAILABLE EQUIPMENT
            </h2>
            <p className="text-xs text-[#929DB5] mt-1">
              The engine automatically adapts exercise selections based on your gear.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'bodyweight', title: 'Pure Bodyweight Training', desc: 'No equipment needed. Pure calisthenics.' },
              { id: 'dumbbells', title: 'Bodyweight + Dumbbells', desc: 'Adds dumbbell rows, presses, squats, curls.' },
              { id: 'bands', title: 'Bodyweight + Resistance Bands', desc: 'Calisthenics with added accommodating resistance.' },
              { id: 'gym', title: 'Fully Equipped Home Gym', desc: 'Full access to weights, pull-up bar, and benches.' },
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setEquipmentType(item.id as EquipmentType)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  equipmentType === item.id
                    ? 'bg-[#725CFF]/20 border-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                    : 'bg-[#151D30] border-[#725CFF]/20 text-[#929DB5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-sm text-[#F5F7FF]">
                    {item.title}
                  </span>
                  {equipmentType === item.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
                  )}
                </div>
                <p className="text-xs text-[#929DB5] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          {equipmentType === 'dumbbells' && (
            <div className="p-3.5 bg-[#101626] rounded-2xl border border-[#725CFF]/30 space-y-3">
              <span className="text-xs font-display font-semibold text-[#00D4FF] block">
                DUMBBELL CONFIGURATION
              </span>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Max Weight / DB (kg)"
                  type="number"
                  value={dumbbellConfig.maxWeightKg}
                  onChange={e => setDumbbellConfig({ ...dumbbellConfig, maxWeightKg: parseFloat(e.target.value) || 10 })}
                />
                <div>
                  <label className="block text-xs font-display font-medium uppercase tracking-wider text-[#929DB5] mb-1.5">
                    Quantity
                  </label>
                  <select
                    value={dumbbellConfig.isPair ? 'pair' : 'single'}
                    onChange={e => setDumbbellConfig({ ...dumbbellConfig, isPair: e.target.value === 'pair' })}
                    className="w-full bg-[#151D30] border border-[#725CFF]/25 rounded-xl px-3 py-2 text-sm text-[#F5F7FF]"
                  >
                    <option value="pair">Pair (2 Dumbbells)</option>
                    <option value="single">Single Dumbbell</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Fitness Level */}
      {step === 5 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F5F7FF]">
              STEP 5: FITNESS BENCHMARKS
            </h2>
            <p className="text-xs text-[#929DB5] mt-1">
              Establish baseline performance to calibrate Day 1 target volumes.
            </p>
          </div>

          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFitnessLevel(lvl)}
                className={`flex-1 py-2.5 rounded-xl font-display uppercase tracking-wider text-xs font-semibold border transition-all ${
                  fitnessLevel === lvl
                    ? 'bg-[#725CFF] border-[#00D4FF] text-white shadow-[0_0_15px_rgba(114,92,255,0.4)]'
                    : 'bg-[#151D30] border-[#725CFF]/20 text-[#929DB5]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Max Push-ups in 1 Set"
              type="number"
              value={initialPushups}
              onChange={e => setInitialPushups(parseInt(e.target.value) || 10)}
            />
            <Input
              label="Max Bodyweight Squats"
              type="number"
              value={initialSquats}
              onChange={e => setInitialSquats(parseInt(e.target.value) || 20)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Max Plank Duration (Sec)"
              type="number"
              value={initialPlankSeconds}
              onChange={e => setInitialPlankSeconds(parseInt(e.target.value) || 30)}
            />
            <Input
              label="Max Pull-ups (0 if none)"
              type="number"
              value={initialPullups}
              onChange={e => setInitialPullups(parseInt(e.target.value) || 0)}
            />
          </div>

          <Input
            label="Physical Limitations / Past Injuries"
            value={limitations}
            onChange={e => setLimitations(e.target.value)}
            placeholder="e.g. Mild lower back sensitivity, wrist strain"
          />
        </div>
      )}

      {/* STEP 6: Goals & Target Calibration */}
      {step === 6 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#F5F7FF]">
              STEP 6: TARGET CALIBRATION
            </h2>
            <p className="text-xs text-[#929DB5] mt-1">
              Scientific recommendations calculated. You can manually adjust any value.
            </p>
          </div>

          <div className="p-3 bg-[#101626] rounded-xl border border-[#725CFF]/30 text-xs text-[#00D4FF]">
            Note: Calorie calculations are starting scientific estimates based on Mifflin-St Jeor and will refine as you record progress.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Daily Calories (kcal)"
              type="number"
              value={dailyCalories}
              onChange={e => setDailyCalories(parseInt(e.target.value) || 2000)}
            />
            <Input
              label="Daily Protein (g)"
              type="number"
              value={dailyProtein}
              onChange={e => setDailyProtein(parseInt(e.target.value) || 140)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Daily Water (ml)"
              type="number"
              value={dailyWater}
              onChange={e => setDailyWater(parseInt(e.target.value) || 3000)}
            />
            <Input
              label="Daily Steps Target"
              type="number"
              value={dailySteps}
              onChange={e => setDailySteps(parseInt(e.target.value) || 10000)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Sleep (Hours)"
              type="number"
              value={sleepHours}
              onChange={e => setSleepHours(parseInt(e.target.value) || 8)}
            />
            <Input
              label="Workouts / Week (Days)"
              type="number"
              value={workoutFrequency}
              onChange={e => setWorkoutFrequency(parseInt(e.target.value) || 6)}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons (Awaken Theme) */}
      <div className="flex gap-3 pt-4 border-t border-[#A78BFA]/20 relative z-10">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          className="flex-1 py-3.5 rounded-2xl border border-[#A78BFA]/30 bg-[#140E26] text-[#9D94B8] hover:text-white font-cinzel font-semibold text-xs tracking-wider uppercase active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < 5 && (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] text-[#0A0714] font-cinzel font-black text-xs tracking-wider uppercase active:scale-95 transition-all shadow-[0_0_20px_rgba(192,132,252,0.4)] flex items-center justify-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {step === 5 && (
          <button
            onClick={handleProceedToStep6}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] text-[#0A0714] font-cinzel font-black text-xs tracking-wider uppercase active:scale-95 transition-all shadow-[0_0_20px_rgba(192,132,252,0.4)] flex items-center justify-center gap-1"
          >
            Calculate Targets <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {step === 6 && (
          <button
            onClick={() => setStep(7)}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] text-[#0A0714] font-cinzel font-black text-xs tracking-wider uppercase active:scale-95 transition-all shadow-[0_0_25px_rgba(192,132,252,0.5)] flex items-center justify-center gap-1.5"
          >
            Complete Setup <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

