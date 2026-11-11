import React from 'react';
import { useAppStore } from '../../../context/AppContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Dumbbell, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TodayWorkout: React.FC = () => {
  const { todayWorkout, setCurrentTab, equipmentMode } = useAppStore();

  if (!todayWorkout) {
    return (
      <Card title="TODAY'S TRAINING PROTOCOL" glow="violet">
        <div className="py-6 text-center text-[#929DB5] text-xs">
          Loading workout protocol...
        </div>
      </Card>
    );
  }

  const completedSets = todayWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  );
  const totalSets = todayWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.length, 0
  );

  return (
    <Card
      title="TODAY'S TRAINING PROTOCOL"
      subtitle={`DAY ${String(todayWorkout.dayNumber).padStart(2, '0')} • ${todayWorkout.focus}`}
      badge={`PHASE 0${todayWorkout.phaseNumber}`}
      glow="violet"
    >
      <div className="space-y-3">
        {/* Workout Header Info */}
        <div className="p-3.5 rounded-2xl bg-[#101626] border border-[#725CFF]/25 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-display uppercase tracking-widest text-[#00D4FF] font-semibold block">
              {todayWorkout.phaseName} PROTOCOL
            </span>
            <h4 className="font-display font-bold text-sm text-[#F5F7FF] mt-0.5">
              {todayWorkout.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[#929DB5]">
                {todayWorkout.exercises.length} Exercises • {totalSets} Total Sets
              </span>
              <span className="text-[10px] font-semibold text-[#FFB547]">
                +{todayWorkout.totalXPAwarded} XP
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-display font-black text-[#00D4FF]">
              {completedSets} / {totalSets}
            </span>
            <span className="text-[9px] text-[#929DB5] block">Sets Completed</span>
          </div>
        </div>

        {/* Exercises Preview (First 3 exercises) */}
        <div className="space-y-2">
          {todayWorkout.exercises.slice(0, 3).map((ex, idx) => (
            <div
              key={ex.exerciseId}
              className="p-2.5 rounded-xl bg-[#151D30] border border-[#725CFF]/15 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#101626] border border-[#725CFF]/30 text-[#00D4FF] font-mono text-[10px] flex items-center justify-center font-bold">
                  0{idx + 1}
                </span>
                <div>
                  <span className="font-semibold text-[#F5F7FF] block">
                    {ex.name}
                  </span>
                  <span className="text-[10px] text-[#929DB5]">
                    {ex.targetSets} sets • {ex.targetReps}
                  </span>
                </div>
              </div>

              {ex.completed ? (
                <CheckCircle2 className="w-4 h-4 text-[#27E58C]" />
              ) : (
                <span className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/20">
                  {ex.targetSets} sets
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Start Workout Button */}
        <Button
          variant="primary"
          glow
          size="md"
          className="w-full font-bold tracking-wider"
          onClick={() => setCurrentTab('workout')}
        >
          <Dumbbell className="w-4 h-4 mr-2" />
          {todayWorkout.completed ? 'REVIEW COMPLETED WORKOUT' : 'INITIALIZE WORKOUT PROTOCOL'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

