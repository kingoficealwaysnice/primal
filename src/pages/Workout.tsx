import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { ExerciseCard } from '../components/workout/ExerciseCard';
import { WorkoutComplete } from '../components/workout/WorkoutComplete';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import {
  Dumbbell,
  Search,
  Calendar,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { WorkoutExerciseLog, Exercise } from '../types';

export const Workout: React.FC = () => {
  const { todayWorkout, saveWorkoutSession, equipmentMode, setEquipmentMode } = useAppStore();

  const [activeTab, setActiveTab] = useState<'today' | 'library' | 'plan'>('today');
  const [showCelebration, setShowCelebration] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('all');
  const [showWarmup, setShowWarmup] = useState(true);
  const [showCooldown, setShowCooldown] = useState(false);

  // Exercise library filtering
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscleFilter === 'all' || ex.category === selectedMuscleFilter;
    const matchesEquipment = equipmentMode === 'dumbbell' ? true : ex.equipment !== 'dumbbell';
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  // Handle individual exercise update
  const handleUpdateExercise = async (updated: WorkoutExerciseLog) => {
    if (!todayWorkout) return;
    const updatedExercises = todayWorkout.exercises.map(ex =>
      ex.exerciseId === updated.exerciseId ? updated : ex
    );

    const allExercisesDone = updatedExercises.every(ex => ex.completed);

    const updatedSession = {
      ...todayWorkout,
      exercises: updatedExercises,
      completed: allExercisesDone
    };

    await saveWorkoutSession(updatedSession);
  };

  // Complete entire workout session
  const handleFinishWorkout = async () => {
    if (!todayWorkout) return;
    const allDoneExercises = todayWorkout.exercises.map(ex => ({
      ...ex,
      completed: true,
      status: 'complete' as const,
      sets: ex.sets.map(s => ({ ...s, completed: true }))
    }));

    const updatedSession = {
      ...todayWorkout,
      exercises: allDoneExercises,
      completed: true,
      completedAt: new Date().toISOString()
    };

    await saveWorkoutSession(updatedSession);
    setShowCelebration(true);
  };

  const totalSetsDone = todayWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  ) || 0;
  const totalSets = todayWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.length, 0
  ) || 0;
  const totalRepsDone = todayWorkout?.exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((sum, s) => sum + (s.completed ? s.actualReps : 0), 0), 0
  ) || 0;

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4 pt-3 space-y-4">
      {/* Celebration Modal */}
      {showCelebration && (
        <WorkoutComplete
          totalSetsDone={totalSetsDone}
          totalRepsDone={totalRepsDone}
          xpEarned={todayWorkout?.totalXPAwarded || 100}
          onClaimRewards={() => setShowCelebration(false)}
        />
      )}

      {/* Top Tabs */}
      <div className="flex bg-[#151D30] p-1 rounded-2xl border border-[#725CFF]/20">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'today'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          TODAY'S TRIAL
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'library'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          EXERCISE ARCHIVE
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'plan'
              ? 'bg-[#725CFF] text-white shadow-md'
              : 'text-[#929DB5] hover:text-[#F5F7FF]'
          }`}
        >
          90-DAY PROTOCOL
        </button>
      </div>

      {/* TODAY'S TRIAL TAB */}
      {activeTab === 'today' && todayWorkout && (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-[#151D30] to-[#101626] border border-[#725CFF]/35 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display uppercase tracking-widest text-[#00D4FF] font-semibold">
                PHASE 0{todayWorkout.phaseNumber} • {todayWorkout.phaseName}
              </span>
              <span className="text-xs font-display font-bold text-[#FFB547]">
                +{todayWorkout.totalXPAwarded} XP
              </span>
            </div>

            <h2 className="font-display font-black text-xl text-[#F5F7FF] uppercase mt-1 tracking-wider">
              {todayWorkout.title}
            </h2>

            <p className="text-xs text-[#929DB5] mt-0.5">
              Target Focus: {todayWorkout.focus}
            </p>

            {/* Set Progress Bar */}
            <div className="mt-4 pt-3 border-t border-[#725CFF]/15">
              <div className="flex justify-between items-center text-xs font-display mb-1.5">
                <span className="text-[#929DB5]">TRIAL PROGRESSION</span>
                <span className="text-[#00D4FF] font-mono font-bold">
                  {totalSetsDone} / {totalSets} Sets ({totalSets > 0 ? Math.round((totalSetsDone / totalSets) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#101626] rounded-full overflow-hidden border border-[#725CFF]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#725CFF] to-[#00D4FF] transition-all duration-300"
                  style={{ width: `${totalSets > 0 ? (totalSetsDone / totalSets) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warm-up Accordion */}
          <div className="rounded-2xl bg-[#151D30] border border-[#725CFF]/20 p-3.5">
            <button
              onClick={() => setShowWarmup(!showWarmup)}
              className="flex items-center justify-between w-full text-xs font-display font-bold uppercase tracking-wider text-[#F5F7FF]"
            >
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FFB547]" />
                DYNAMIC WARM-UP ROUTINE (3-5 MINS)
              </span>
              {showWarmup ? <ChevronUp className="w-4 h-4 text-[#929DB5]" /> : <ChevronDown className="w-4 h-4 text-[#929DB5]" />}
            </button>

            {showWarmup && (
              <ul className="mt-3 space-y-1.5 text-xs text-[#929DB5] pl-6 list-disc">
                {todayWorkout.warmup.map((w, idx) => (
                  <li key={idx} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Exercises List */}
          <div className="space-y-3">
            {todayWorkout.exercises.map((ex, idx) => (
              <ExerciseCard
                key={ex.exerciseId}
                exercise={ex}
                index={idx}
                onUpdateExercise={handleUpdateExercise}
              />
            ))}
          </div>

          {/* Cooldown Accordion */}
          <div className="rounded-2xl bg-[#151D30] border border-[#725CFF]/20 p-3.5">
            <button
              onClick={() => setShowCooldown(!showCooldown)}
              className="flex items-center justify-between w-full text-xs font-display font-bold uppercase tracking-wider text-[#F5F7FF]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#27E58C]" />
                POST-WORKOUT COOLDOWN & FASCIAL RELEASE
              </span>
              {showCooldown ? <ChevronUp className="w-4 h-4 text-[#929DB5]" /> : <ChevronDown className="w-4 h-4 text-[#929DB5]" />}
            </button>

            {showCooldown && (
              <ul className="mt-3 space-y-1.5 text-xs text-[#929DB5] pl-6 list-disc">
                {todayWorkout.cooldown.map((c, idx) => (
                  <li key={idx} className="leading-relaxed">{c}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Finish Entire Session Button */}
          <Button
            variant="cyan"
            size="lg"
            glow
            onClick={handleFinishWorkout}
            className="w-full font-bold tracking-wider py-4"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {todayWorkout.completed ? 'RE-LOG WORKOUT TRIAL' : 'COMPLETE TODAY\'S PROTOCOL'}
          </Button>
        </div>
      )}

      {/* EXERCISE ARCHIVE TAB */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <Input
            placeholder="Search exercises by name or muscle (e.g. Push-up, Lats)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />

          {/* Muscle Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'ALL' },
              { id: 'chest', label: 'CHEST' },
              { id: 'back', label: 'BACK' },
              { id: 'shoulders', label: 'SHOULDERS' },
              { id: 'quadriceps', label: 'QUADS' },
              { id: 'hamstrings_calves', label: 'HAMSTRINGS' },
              { id: 'arms', label: 'ARMS' },
              { id: 'abs_obliques', label: 'CORE' },
              { id: 'glutes', label: 'GLUTES' },
              { id: 'dumbbell', label: 'DUMBBELL' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedMuscleFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-display uppercase tracking-wider font-semibold whitespace-nowrap border transition-all ${
                  selectedMuscleFilter === f.id
                    ? 'bg-[#725CFF] border-[#00D4FF] text-white shadow-sm'
                    : 'bg-[#151D30] border-[#725CFF]/20 text-[#929DB5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filtered Exercise Cards */}
          <div className="space-y-2.5">
            {filteredExercises.map(ex => (
              <Card
                key={ex.id}
                title={ex.name}
                subtitle={ex.targetMuscle}
                badge={`Phase 0${ex.phase}`}
              >
                <p className="text-xs text-[#929DB5] leading-relaxed mb-2">
                  {ex.executionInstructions}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#00D4FF] pt-2 border-t border-[#725CFF]/15">
                  <span>Rec. Sets: {ex.recommendedSets}</span>
                  <span>Rec. Reps: {ex.recommendedReps}</span>
                  <span className="text-[#929DB5]">Rest: {ex.restSeconds}s</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 90-DAY PROTOCOL TAB */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <Card
            title="90-DAY TRANSFORMATION PHASES"
            subtitle="The path from Awakening to Transcendent physical power"
            glow="violet"
          >
            <div className="space-y-3.5 mt-2">
              {/* Phase 1 */}
              <div className="p-3.5 rounded-2xl bg-[#101626] border border-[#725CFF]/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-sm text-[#00D4FF]">
                    PHASE 1: AWAKENING (DAYS 1–30)
                  </span>
                  <span className="text-[10px] text-[#27E58C] font-mono">ACTIVE</span>
                </div>
                <p className="text-xs text-[#929DB5] leading-relaxed">
                  Establish neural motor patterns, core tendon stiffness, and joint mobility. Volume ramp starts with foundational push-ups (50-rep benchmark challenge), bodyweight squats, lunges, and plank variations.
                </p>
              </div>

              {/* Phase 2 */}
              <div className="p-3.5 rounded-2xl bg-[#101626] border border-[#725CFF]/20">
                <span className="font-display font-bold text-sm text-[#725CFF] block mb-1">
                  PHASE 2: EVOLUTION (DAYS 31–60)
                </span>
                <p className="text-xs text-[#929DB5] leading-relaxed">
                  Hypertrophic adaptation and elevated mechanical tension. Introduction of decline push-ups, diamond push-ups, Bulgarian split squats, pike push-ups, and pull-up progressions.
                </p>
              </div>

              {/* Phase 3 */}
              <div className="p-3.5 rounded-2xl bg-[#101626] border border-[#725CFF]/20">
                <span className="font-display font-bold text-sm text-[#FFB547] block mb-1">
                  PHASE 3: PRIMAL FORM (DAYS 61–90)
                </span>
                <p className="text-xs text-[#929DB5] leading-relaxed">
                  Peak calisthenic power and elite physique conditioning. Archer push-ups, pistol squat progressions, dragon flags, and high-density circuits to chisel final muscular definition.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

