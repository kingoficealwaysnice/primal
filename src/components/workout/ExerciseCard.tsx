import React, { useState } from 'react';
import type { WorkoutExerciseLog } from '../../types';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { Button } from '../ui/Button';
import { Check, ChevronDown, ChevronUp, AlertCircle, Info, Sparkles } from 'lucide-react';

interface ExerciseCardProps {
  exercise: WorkoutExerciseLog;
  index: number;
  onUpdateExercise: (updated: WorkoutExerciseLog) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  onUpdateExercise
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const exDef = EXERCISE_LIBRARY.find(e => e.id === exercise.exerciseId);

  // Set-by-set tracker
  const handleToggleSet = (setIdx: number) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIdx] = {
      ...updatedSets[setIdx],
      completed: !updatedSets[setIdx].completed
    };

    const allDone = updatedSets.every(s => s.completed);
    const anyDone = updatedSets.some(s => s.completed);

    onUpdateExercise({
      ...exercise,
      sets: updatedSets,
      completed: allDone,
      status: allDone ? 'complete' : anyDone ? 'partial' : 'pending'
    });
  };

  const handleUpdateReps = (setIdx: number, val: number) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIdx] = {
      ...updatedSets[setIdx],
      actualReps: val
    };
    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  // Status Actions
  const handleMarkComplete = () => {
    const updatedSets = exercise.sets.map(s => ({ ...s, completed: true }));
    onUpdateExercise({
      ...exercise,
      sets: updatedSets,
      completed: true,
      status: 'complete'
    });
  };

  const handleRecordPartial = () => {
    onUpdateExercise({
      ...exercise,
      completed: false,
      status: 'partial'
    });
  };

  const handleSkip = () => {
    onUpdateExercise({
      ...exercise,
      completed: false,
      status: 'skipped'
    });
  };

  const handleDiscomfort = () => {
    onUpdateExercise({
      ...exercise,
      completed: false,
      status: 'discomfort',
      notes: 'Discomfort reported. Reducing load or substituting next cycle.'
    });
  };

  const totalActualReps = exercise.sets.reduce((sum, s) => sum + (s.completed ? s.actualReps : 0), 0);
  const totalTargetReps = exercise.sets.reduce((sum, s) => sum + s.targetReps, 0);
  const completionPct = totalTargetReps > 0 ? Math.round((totalActualReps / totalTargetReps) * 100) : 0;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        exercise.status === 'complete'
          ? 'bg-[#151D30]/90 border-[#27E58C]/40 shadow-[0_0_20px_rgba(39,229,140,0.15)]'
          : exercise.status === 'discomfort'
          ? 'bg-[#151D30] border-[#FF5263]/40'
          : exercise.status === 'skipped'
          ? 'bg-[#151D30]/50 border-[#929DB5]/20 opacity-70'
          : 'bg-[#151D30] border-[#725CFF]/25'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-[#101626] border border-[#725CFF]/30 text-[#00D4FF] font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
            0{index + 1}
          </span>
          <div>
            <h3 className="font-display font-bold text-sm text-[#F5F7FF]">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#00D4FF] font-medium">
                {exercise.targetMuscle}
              </span>
              <span className="text-[10px] text-[#929DB5]">
                {exercise.targetSets} sets • {exercise.targetReps}
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div>
          {exercise.status === 'complete' && (
            <span className="text-[10px] font-display font-semibold uppercase px-2 py-0.5 rounded-full bg-[#27E58C]/20 text-[#27E58C] border border-[#27E58C]/30 flex items-center gap-1">
              <Check className="w-3 h-3" /> Done
            </span>
          )}
          {exercise.status === 'partial' && (
            <span className="text-[10px] font-display font-semibold uppercase px-2 py-0.5 rounded-full bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30">
              Partial ({completionPct}%)
            </span>
          )}
          {exercise.status === 'skipped' && (
            <span className="text-[10px] font-display font-semibold uppercase px-2 py-0.5 rounded-full bg-[#929DB5]/20 text-[#929DB5]">
              Skipped
            </span>
          )}
          {exercise.status === 'discomfort' && (
            <span className="text-[10px] font-display font-semibold uppercase px-2 py-0.5 rounded-full bg-[#FF5263]/20 text-[#FF5263] border border-[#FF5263]/30">
              Discomfort
            </span>
          )}
        </div>
      </div>

      {/* Set-by-Set Row Tracker */}
      <div className="mt-3.5 pt-3 border-t border-[#725CFF]/15 space-y-2">
        <div className="grid grid-cols-12 text-[10px] font-display uppercase tracking-wider text-[#929DB5] px-2 mb-1">
          <span className="col-span-3">Set</span>
          <span className="col-span-3 text-center">Target</span>
          <span className="col-span-4 text-center">Actual Reps</span>
          <span className="col-span-2 text-right">Done</span>
        </div>

        {exercise.sets.map((set, sIdx) => (
          <div
            key={set.setNumber}
            className={`grid grid-cols-12 items-center px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
              set.completed
                ? 'bg-[#101626] border-[#27E58C]/30 text-[#F5F7FF]'
                : 'bg-[#101626]/60 border-[#725CFF]/15 text-[#929DB5]'
            }`}
          >
            <span className="col-span-3 font-mono font-semibold text-[#F5F7FF]">
              Set 0{set.setNumber}
            </span>
            <span className="col-span-3 text-center font-mono text-[#929DB5]">
              {set.targetReps}
            </span>
            <div className="col-span-4 flex justify-center">
              <input
                type="number"
                min="0"
                max="200"
                value={set.actualReps}
                onChange={e => handleUpdateReps(sIdx, parseInt(e.target.value) || 0)}
                className="w-14 bg-[#151D30] border border-[#725CFF]/30 rounded-lg px-2 py-1 text-center font-mono text-xs text-[#00D4FF] font-bold outline-none"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => handleToggleSet(sIdx)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
                  set.completed
                    ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]'
                    : 'bg-[#151D30] border-[#725CFF]/30 text-transparent hover:border-[#725CFF]'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Summary Bar */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#929DB5] px-1">
        <span>Target: <strong className="text-[#F5F7FF]">{totalTargetReps} reps</strong></span>
        <span>Completed: <strong className="text-[#00D4FF]">{totalActualReps} reps</strong> ({completionPct}%)</span>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[#725CFF]/15">
        <Button
          size="sm"
          variant={exercise.status === 'complete' ? 'success' : 'primary'}
          onClick={handleMarkComplete}
          className="flex-1 text-xs"
        >
          <Check className="w-3.5 h-3.5 mr-1" /> Mark Complete
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleRecordPartial}
          className="text-xs"
        >
          Record Partial
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleSkip}
          className="text-xs text-[#929DB5]"
        >
          Skip
        </Button>

        <button
          onClick={handleDiscomfort}
          className="p-2 rounded-xl bg-[#101626] text-[#FF5263] border border-[#FF5263]/30 hover:bg-[#FF5263]/10 active:scale-95 text-xs flex items-center gap-1"
          title="Report Discomfort"
        >
          <AlertCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Collapsible Instructions Toggle */}
      {exDef && (
        <div className="mt-2.5 pt-2 border-t border-[#725CFF]/10">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-[11px] text-[#00D4FF] hover:underline"
          >
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3" /> Form Guide & Instructions
            </span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 bg-[#101626] rounded-xl text-xs space-y-2 text-[#929DB5] leading-relaxed">
              <div>
                <strong className="text-[#F5F7FF] block text-[11px] uppercase">Execution:</strong>
                {exDef.executionInstructions}
              </div>
              <div>
                <strong className="text-[#FFB547] block text-[11px] uppercase">Common Mistakes:</strong>
                {exDef.commonMistakes}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div>
                  <span className="text-[#929DB5]">Easier: </span>
                  <span className="text-[#27E58C]">{exDef.easierVariation}</span>
                </div>
                <div>
                  <span className="text-[#929DB5]">Harder: </span>
                  <span className="text-[#00D4FF]">{exDef.harderVariation}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

