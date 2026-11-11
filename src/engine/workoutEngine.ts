import type { WorkoutSession, WorkoutExerciseLog, FitnessLevel } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { db, getTodayDateString } from '../db/database';

export function getPhaseInfo(day: number): { phaseNumber: number; phaseName: string } {
  if (day <= 30) {
    return { phaseNumber: 1, phaseName: 'AWAKENING' };
  } else if (day <= 60) {
    return { phaseNumber: 2, phaseName: 'EVOLUTION' };
  } else {
    return { phaseNumber: 3, phaseName: 'PRIMAL FORM' };
  }
}

export function generateDailyWorkout(
  dayNumber: number,
  fitnessLevel: FitnessLevel = 'beginner',
  equipmentMode: 'bodyweight' | 'dumbbell' = 'bodyweight',
  benchmarkPushups: number = 20
): WorkoutSession {
  const { phaseNumber, phaseName } = getPhaseInfo(dayNumber);
  const dayInCycle = ((dayNumber - 1) % 7) + 1; // 1 to 7

  const warmup = [
    'Jumping Jacks or Light Bounce (2 mins)',
    'Arm Circles & Shoulder Dislocations (15 each direction)',
    'World Greatest Stretch & Hip Opener (5 reps per side)'
  ];

  const cooldown = [
    'Pigeon Pose Hip Stretch (45s per side)',
    'Cobra / Abdominal Stretch (60s)',
    'Doorway Chest & Lat Stretch (45s per side)'
  ];

  let title = '';
  let focus = '';
  let selectedExerciseIds: { id: string; targetSets: number; targetReps: string }[] = [];

  // Active Recovery on Day 7 of each week
  if (dayInCycle === 7) {
    return {
      date: getTodayDateString(),
      dayNumber,
      phaseNumber,
      phaseName,
      title: 'RECOVERY PROTOCOL: CELLULAR REGENERATION',
      focus: 'Active Mobility, Fascial Release & System Reset',
      equipmentMode,
      warmup: ['Deep Diaphragmatic Breathing (3 mins)'],
      exercises: [
        {
          exerciseId: 'bird_dog_pose',
          name: 'Bird Dog Hold & Pulse',
          targetMuscle: 'Thoracic Stability & Posterior Chain',
          targetSets: 3,
          targetReps: '12 reps per side',
          sets: [
            { setNumber: 1, targetReps: 12, actualReps: 12, completed: false },
            { setNumber: 2, targetReps: 12, actualReps: 12, completed: false },
            { setNumber: 3, targetReps: 12, actualReps: 12, completed: false }
          ],
          completed: false,
          status: 'pending'
        },
        {
          exerciseId: 'glute_bridge',
          name: 'Glute Bridge & Peak Squeeze',
          targetMuscle: 'Gluteus Maximus',
          targetSets: 3,
          targetReps: '15 reps',
          sets: [
            { setNumber: 1, targetReps: 15, actualReps: 15, completed: false },
            { setNumber: 2, targetReps: 15, actualReps: 15, completed: false },
            { setNumber: 3, targetReps: 15, actualReps: 15, completed: false }
          ],
          completed: false,
          status: 'pending'
        }
      ],
      cooldown: ['Foam Rolling or Static Hamstring Stretch (5 mins)', 'Cold or Hot Contrast Shower'],
      totalXPAwarded: 80,
      completed: false
    };
  }

  // Workouts by Day in 7-day cycle
  if (dayInCycle === 1) {
    // CHEST & TRICEPS
    title = 'CHEST & TRICEPS OVERLOAD';
    focus = 'Pectorals, Anterior Deltoids, Triceps';

    if (dayNumber === 1) {
      // Day 1 Starting Push-up Protocol (Special 50 Rep Challenge split into sets)
      const targetPerSet = Math.max(8, Math.round(benchmarkPushups * 0.75));
      const totalSets = Math.ceil(50 / targetPerSet);
      selectedExerciseIds = [
        { id: 'pushup_regular', targetSets: totalSets, targetReps: `5 sets to total 50 reps (~${targetPerSet}/set)` },
        { id: 'bench_dips', targetSets: 3, targetReps: '12-15 reps' },
        { id: 'plank_standard', targetSets: 3, targetReps: '45 seconds' }
      ];
    } else if (phaseNumber === 1) {
      selectedExerciseIds = equipmentMode === 'dumbbell'
        ? [
            { id: 'db_floor_press', targetSets: 4, targetReps: '10-12 reps' },
            { id: 'pushup_regular', targetSets: 3, targetReps: '12-15 reps' },
            { id: 'db_overhead_triceps', targetSets: 3, targetReps: '12-15 reps' },
            { id: 'bench_dips', targetSets: 3, targetReps: '12 reps' }
          ]
        : [
            { id: 'pushup_regular', targetSets: 4, targetReps: '12-15 reps' },
            { id: 'pushup_wide', targetSets: 3, targetReps: '10-12 reps' },
            { id: 'pushup_incline', targetSets: 3, targetReps: '15 reps' },
            { id: 'bench_dips', targetSets: 3, targetReps: '12-15 reps' }
          ];
    } else if (phaseNumber === 2) {
      selectedExerciseIds = [
        { id: 'pushup_decline', targetSets: 4, targetReps: '10-12 reps' },
        { id: 'pushup_close_grip', targetSets: 3, targetReps: '8-10 reps' },
        { id: 'pushup_staggered', targetSets: 3, targetReps: '10 reps' },
        { id: 'sphinx_pushup', targetSets: 3, targetReps: '8-10 reps' }
      ];
    } else {
      // Phase 3
      selectedExerciseIds = [
        { id: 'pushup_archer', targetSets: 4, targetReps: '6-8 reps/side' },
        { id: 'pushup_decline', targetSets: 4, targetReps: '12 reps' },
        { id: 'pushup_close_grip', targetSets: 3, targetReps: '12 reps' },
        { id: 'sphinx_pushup', targetSets: 3, targetReps: '10 reps' }
      ];
    }
  } else if (dayInCycle === 2) {
    // BACK & BICEPS
    title = 'BACK THICKNESS & BICEPS IGNITION';
    focus = 'Latissimus, Rhomboids, Biceps, Forearms';
    selectedExerciseIds = equipmentMode === 'dumbbell'
      ? [
          { id: 'db_single_arm_row', targetSets: 4, targetReps: '10-12 reps/side' },
          { id: 'inverted_row', targetSets: 3, targetReps: '10-12 reps' },
          { id: 'db_bicep_curl', targetSets: 4, targetReps: '10-12 reps' },
          { id: 'superman_pull', targetSets: 3, targetReps: '15 reps' }
        ]
      : phaseNumber === 1
      ? [
          { id: 'inverted_row', targetSets: 4, targetReps: '10-12 reps' },
          { id: 'superman_pull', targetSets: 3, targetReps: '12-15 reps' },
          { id: 'lying_triple_flies', targetSets: 3, targetReps: '15 reps' },
          { id: 'bird_dog_pose', targetSets: 3, targetReps: '12 reps/side' }
        ]
      : [
          { id: 'pullup_regular', targetSets: 4, targetReps: '6-10 reps' },
          { id: 'inverted_row', targetSets: 4, targetReps: '12 reps' },
          { id: 'chinup_regular', targetSets: 3, targetReps: '8 reps' },
          { id: 'renegade_row_bw', targetSets: 3, targetReps: '10 reps/side' }
        ];
  } else if (dayInCycle === 3) {
    // LEGS & GLUTES
    title = 'LOWER BODY HYPERTROPHY';
    focus = 'Quadriceps, Hamstrings, Glutes, Calves';
    selectedExerciseIds = equipmentMode === 'dumbbell'
      ? [
          { id: 'db_goblet_squat', targetSets: 4, targetReps: '12-15 reps' },
          { id: 'bulgarian_split_squat', targetSets: 3, targetReps: '10 reps/leg' },
          { id: 'single_leg_rdl_bw', targetSets: 3, targetReps: '12 reps/leg' },
          { id: 'calf_raise_single', targetSets: 4, targetReps: '15 reps/leg' }
        ]
      : phaseNumber === 1
      ? [
          { id: 'squat_regular', targetSets: 4, targetReps: '20-25 reps' },
          { id: 'glute_bridge', targetSets: 3, targetReps: '15-20 reps' },
          { id: 'wall_sit', targetSets: 3, targetReps: '45-60s hold' },
          { id: 'calf_raise_single', targetSets: 3, targetReps: '15 reps/leg' }
        ]
      : phaseNumber === 2
      ? [
          { id: 'bulgarian_split_squat', targetSets: 4, targetReps: '10-12 reps/leg' },
          { id: 'single_leg_rdl_bw', targetSets: 3, targetReps: '12 reps/leg' },
          { id: 'squat_regular', targetSets: 3, targetReps: '25 reps' },
          { id: 'frog_pump', targetSets: 3, targetReps: '20 reps' }
        ]
      : [
          { id: 'pistol_squat_progression', targetSets: 4, targetReps: '4-6 reps/leg' },
          { id: 'nordic_hamstring_curl', targetSets: 3, targetReps: '5-8 reps' },
          { id: 'bulgarian_split_squat', targetSets: 3, targetReps: '12 reps/leg' },
          { id: 'calf_raise_single', targetSets: 4, targetReps: '20 reps/leg' }
        ];
  } else if (dayInCycle === 4) {
    // SHOULDERS & CORE
    title = 'DELTOID FORGE & MIDSECTION ARMOR';
    focus = 'Deltoids, Upper Traps, Rectus Abdominis, Obliques';
    selectedExerciseIds = equipmentMode === 'dumbbell'
      ? [
          { id: 'db_shoulder_press', targetSets: 4, targetReps: '10-12 reps' },
          { id: 'pike_pushups', targetSets: 3, targetReps: '8-10 reps' },
          { id: 'bicycle_crunches', targetSets: 3, targetReps: '20 reps' },
          { id: 'plank_standard', targetSets: 3, targetReps: '60s hold' }
        ]
      : phaseNumber === 1
      ? [
          { id: 'pike_pushups', targetSets: 3, targetReps: '8-10 reps' },
          { id: 'standing_iyt_raises', targetSets: 3, targetReps: '18 reps total' },
          { id: 'scapular_pushup', targetSets: 3, targetReps: '15 reps' },
          { id: 'plank_standard', targetSets: 3, targetReps: '45-60s hold' },
          { id: 'bicycle_crunches', targetSets: 3, targetReps: '20 reps' }
        ]
      : [
          { id: 'pike_pushups', targetSets: 4, targetReps: '10-12 reps' },
          { id: 'standing_iyt_raises', targetSets: 3, targetReps: '18 reps' },
          { id: 'hanging_leg_raises', targetSets: 3, targetReps: '10-12 reps' },
          { id: 'plank_standard', targetSets: 3, targetReps: '60s hold' }
        ];
  } else if (dayInCycle === 5) {
    // FULL BODY COMPOUND STRENGTH
    title = 'FULL BODY HUNTER TRIAL';
    focus = 'Compound Athletic Output, Kinetic Linking';
    selectedExerciseIds = [
      { id: 'pushup_regular', targetSets: 4, targetReps: '15 reps' },
      { id: 'squat_regular', targetSets: 4, targetReps: '20 reps' },
      { id: 'inverted_row', targetSets: 3, targetReps: '10 reps' },
      { id: 'pike_pushups', targetSets: 3, targetReps: '8-10 reps' },
      { id: 'bicycle_crunches', targetSets: 3, targetReps: '20 reps' }
    ];
  } else {
    // Day 6: ARMS & CORE SCULPTING
    title = 'ARMS & CORE PROTOCOL';
    focus = 'Biceps, Triceps, Obliques & Deep Core';
    selectedExerciseIds = phaseNumber >= 2
      ? [
          { id: 'chinup_regular', targetSets: 3, targetReps: '8 reps' },
          { id: 'bench_dips', targetSets: 4, targetReps: '12-15 reps' },
          { id: 'hanging_leg_raises', targetSets: 3, targetReps: '12 reps' },
          { id: 'plank_standard', targetSets: 3, targetReps: '60s hold' }
        ]
      : [
          { id: 'bench_dips', targetSets: 4, targetReps: '12-15 reps' },
          { id: 'pushup_close_grip', targetSets: 3, targetReps: '8-10 reps' },
          { id: 'bicycle_crunches', targetSets: 3, targetReps: '20 reps' },
          { id: 'plank_standard', targetSets: 3, targetReps: '45s hold' }
        ];
  }

  // Construct WorkoutExerciseLogs
  const exercises: WorkoutExerciseLog[] = selectedExerciseIds.map(item => {
    const exDef = EXERCISE_LIBRARY.find(e => e.id === item.id);
    const exName = exDef ? exDef.name : item.id;
    const muscle = exDef ? exDef.targetMuscle : 'General';
    
    // Parse numeric target reps for set tracking (e.g. "12-15 reps" -> 12)
    const match = item.targetReps.match(/\d+/);
    const targetNumeric = match ? parseInt(match[0], 10) : 10;

    const sets = Array.from({ length: item.targetSets }, (_, i) => ({
      setNumber: i + 1,
      targetReps: targetNumeric,
      actualReps: targetNumeric,
      completed: false
    }));

    return {
      exerciseId: item.id,
      name: exName,
      targetMuscle: muscle,
      targetSets: item.targetSets,
      targetReps: item.targetReps,
      sets,
      completed: false,
      status: 'pending'
    };
  });

  return {
    date: getTodayDateString(),
    dayNumber,
    phaseNumber,
    phaseName,
    title,
    focus,
    equipmentMode,
    warmup,
    exercises,
    cooldown,
    totalXPAwarded: 100,
    completed: false
  };
}

export async function getOrGenerateTodayWorkout(
  dayNumber: number,
  fitnessLevel: FitnessLevel,
  equipmentMode: 'bodyweight' | 'dumbbell',
  benchmarkPushups: number
): Promise<WorkoutSession> {
  const todayStr = getTodayDateString();
  const existing = await db.workoutSessions.where('date').equals(todayStr).first();
  if (existing) {
    return existing;
  }

  const generated = generateDailyWorkout(dayNumber, fitnessLevel, equipmentMode, benchmarkPushups);
  const id = await db.workoutSessions.add(generated);
  generated.id = id;
  return generated;
}

