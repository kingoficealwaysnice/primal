import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import { Trophy, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface WorkoutCompleteProps {
  totalSetsDone: number;
  totalRepsDone: number;
  xpEarned: number;
  onClaimRewards: () => void;
}

export const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({
  totalSetsDone,
  totalRepsDone,
  xpEarned,
  onClaimRewards
}) => {
  useEffect(() => {
    // Confetti blast
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#725CFF', '#00D4FF', '#27E58C']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#080B14]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-24 h-24 rounded-full bg-[#151D30] border-2 border-[#00D4FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.4)] mb-6 animate-bounce">
        <Trophy className="w-12 h-12 text-[#00D4FF]" />
      </div>

      <span className="text-xs font-display uppercase tracking-[0.3em] text-[#27E58C] font-semibold block mb-1">
        [ PROTOCOL ACCOMPLISHED ]
      </span>

      <h1 className="font-display font-black text-2xl tracking-wider text-[#F5F7FF] uppercase mb-2">
        DAILY TRIAL COMPLETE
      </h1>

      <p className="text-xs text-[#929DB5] max-w-xs mb-6">
        Physical stress induced. Muscle protein synthesis signaled. Cellular adaptation initialized.
      </p>

      {/* Stats Breakdown */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-2.5 mb-8">
        <div className="p-3 rounded-2xl bg-[#151D30] border border-[#725CFF]/20">
          <span className="text-[10px] text-[#929DB5] block uppercase">Sets</span>
          <span className="font-display font-black text-lg text-[#F5F7FF]">{totalSetsDone}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#151D30] border border-[#725CFF]/20">
          <span className="text-[10px] text-[#929DB5] block uppercase">Total Reps</span>
          <span className="font-display font-black text-lg text-[#00D4FF]">{totalRepsDone}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#151D30] border border-[#725CFF]/20">
          <span className="text-[10px] text-[#929DB5] block uppercase">Reward</span>
          <span className="font-display font-black text-lg text-[#27E58C]">+{xpEarned} XP</span>
        </div>
      </div>

      <Button
        variant="cyan"
        size="lg"
        glow
        onClick={onClaimRewards}
        className="w-full max-w-xs font-bold tracking-wider"
      >
        CLAIM SYSTEM REWARDS <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

