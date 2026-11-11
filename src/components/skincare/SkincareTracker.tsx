import React, { useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, Sun, Moon, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SkincareTracker: React.FC = () => {
  const { todaySkincare, updateSkincareStatus } = useAppStore();

  const morningDone = todaySkincare?.morningCompleted || false;
  const eveningDone = todaySkincare?.eveningCompleted || false;

  const [showPatchTest, setShowPatchTest] = useState(false);

  return (
    <Card
      title="FACIAL SKINCARE PROTOCOL"
      subtitle="Epidermal barrier protection, collagen defense, and active treatments"
      glow="cyan"
    >
      <div className="space-y-4">
        {/* Morning Routine Card */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            morningDone
              ? 'bg-[#151D30] border-[#27E58C]/40'
              : 'bg-[#101626] border-[#725CFF]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#FFB547]" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#F5F7FF]">
                MORNING PROTOCOL (AM)
              </span>
            </div>
            {morningDone && (
              <span className="text-[10px] font-display font-semibold text-[#27E58C] bg-[#27E58C]/10 px-2 py-0.5 rounded-full border border-[#27E58C]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Executed
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-[#929DB5] pl-6 list-disc mb-3">
            <div>1. Gentle Hydrating Cleanser (lukewarm water)</div>
            <div>2. Niacinamide 5% / Antioxidant Serum (optional)</div>
            <div>3. Lightweight Barrier Moisturizer</div>
            <div>4. Broad Spectrum SPF 50+ Sunscreen (essential)</div>
          </div>

          <Button
            size="sm"
            variant={morningDone ? 'secondary' : 'cyan'}
            onClick={() => updateSkincareStatus(!morningDone, eveningDone)}
            className="w-full text-xs"
          >
            {morningDone ? 'Unmark Morning Routine' : 'Log Morning Routine Completed (+15 XP)'}
          </Button>
        </div>

        {/* Evening Routine Card */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            eveningDone
              ? 'bg-[#151D30] border-[#27E58C]/40'
              : 'bg-[#101626] border-[#725CFF]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#725CFF]" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#F5F7FF]">
                EVENING REGENERATION (PM)
              </span>
            </div>
            {eveningDone && (
              <span className="text-[10px] font-display font-semibold text-[#27E58C] bg-[#27E58C]/10 px-2 py-0.5 rounded-full border border-[#27E58C]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Executed
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-[#929DB5] pl-6 list-disc mb-3">
            <div>1. Thorough Cleanser (remove environmental pollutants & sunscreen)</div>
            <div>2. Active Treatment: Retinoid 0.2% (alternate nights)</div>
            <div>3. Rich Ceramide Moisturizer</div>
          </div>

          <Button
            size="sm"
            variant={eveningDone ? 'secondary' : 'primary'}
            onClick={() => updateSkincareStatus(morningDone, !eveningDone)}
            className="w-full text-xs"
          >
            {eveningDone ? 'Unmark Evening Routine' : 'Log Evening Routine Completed (+15 XP)'}
          </Button>
        </div>

        {/* Dermatological Guidance Toggle */}
        <div className="p-3 bg-[#101626] rounded-xl border border-[#725CFF]/20 text-xs">
          <button
            onClick={() => setShowPatchTest(!showPatchTest)}
            className="flex items-center justify-between w-full text-[11px] text-[#00D4FF]"
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Patch Testing & Active Combination Rules
            </span>
            <span className="text-xs">{showPatchTest ? '▲' : '▼'}</span>
          </button>

          {showPatchTest && (
            <div className="mt-2.5 pt-2 border-t border-[#725CFF]/15 space-y-2 text-[#929DB5] leading-relaxed">
              <p>
                <strong>Patch Testing Protocol:</strong> Apply small dab of any new active ingredient (Retinol, Vitamin C, AHA/BHA) behind the ear or inner forearm for 24-48 hours before applying to facial skin.
              </p>
              <p>
                <strong>Ingredient Separation:</strong> Do not combine Retinol with exfoliating acids (Salicylic/Glycolic acid) in the same session to prevent barrier compromise.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

