import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Info, Sparkles, CheckSquare, Camera } from 'lucide-react';

export const FacialAesthetics: React.FC = () => {
  const [checkedHabits, setCheckedHabits] = useState<Record<string, boolean>>({});

  const toggleHabit = (key: string) => {
    setCheckedHabits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card
      title="FACIAL AESTHETICS & JAWLINE DEFINITION"
      subtitle="Holistic subcutaneous fat reduction and postural alignment"
      glow="none"
    >
      <div className="space-y-4">
        {/* Core Scientific Principle Notice */}
        <div className="p-3.5 bg-[#101626] rounded-2xl border border-[#00D4FF]/30 flex items-start gap-2.5 text-xs">
          <Info className="w-5 h-5 text-[#00D4FF] shrink-0 mt-0.5" />
          <p className="text-[#929DB5] leading-relaxed">
            <strong className="text-[#F5F7FF] block mb-1">PHYSIOLOGICAL FACT:</strong>
            Spot reduction of facial fat is scientifically impossible. Facial definition and jawline prominence develop through overall systemic body fat reduction, optimal hydration, genetics, and proper head/neck posture.
          </p>
        </div>

        {/* Daily Facial Definition Habits */}
        <div className="space-y-2">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#F5F7FF] block">
            DAILY FACIAL BLOAT MITIGATION HABITS
          </span>

          {[
            { id: 'h1', title: 'Maintain Systemic Calorie Deficit', desc: 'Drives overall body fat loss which reveals facial bone structure.' },
            { id: 'h2', title: 'Target 3.0L+ Daily Hydration', desc: 'Reduces compensatory fluid retention and facial puffiness.' },
            { id: 'h3', title: 'Avoid Excessive Sodium Spikes', desc: 'High sodium with low water triggers subcutaneous fluid retention.' },
            { id: 'h4', title: '7-8 Hours Restorative Sleep', desc: 'Prevents cortisol elevation and periorbital edema (eye bags).' },
            { id: 'h5', title: 'Perform Chin Tuck Posture Exercises', desc: 'Aligns the cervical spine and sharpens the submental angle.' },
          ].map(habit => {
            const isDone = !!checkedHabits[habit.id];
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isDone
                    ? 'bg-[#101626] border-[#27E58C]/40 text-[#F5F7FF]'
                    : 'bg-[#151D30] border-[#725CFF]/15 text-[#929DB5]'
                }`}
              >
                <div>
                  <span className={`text-xs font-semibold block ${isDone ? 'text-[#27E58C]' : 'text-[#F5F7FF]'}`}>
                    {habit.title}
                  </span>
                  <span className="text-[10px] text-[#929DB5]">{habit.desc}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-3 ${
                    isDone ? 'bg-[#27E58C] border-[#27E58C] text-[#080B14]' : 'border-[#725CFF]/30'
                  }`}
                >
                  {isDone && '✓'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Postural & Mobility Exercises */}
        <div className="pt-2 border-t border-[#725CFF]/15 space-y-2.5">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-[#00D4FF] block">
            RECOMMENDED CERVICAL & JAW MOBILITY ROUTINE
          </span>

          <div className="space-y-2 text-xs text-[#929DB5]">
            <div className="p-2.5 bg-[#101626] rounded-xl border border-[#725CFF]/15">
              <strong className="text-[#F5F7FF] block mb-0.5">1. Chin Tuck Postural Reset:</strong>
              Pull chin straight back horizontally (like making a double chin) without tilting head. Hold 5 seconds. Repeat 10 times to strengthen deep neck flexors.
            </div>

            <div className="p-2.5 bg-[#101626] rounded-xl border border-[#725CFF]/15">
              <strong className="text-[#F5F7FF] block mb-0.5">2. Sternocleidomastoid (SCM) Neck Stretch:</strong>
              Tilt ear toward right shoulder, look upward at 45 degrees, feel deep stretch down front of neck. Hold 30 seconds per side.
            </div>

            <div className="p-2.5 bg-[#101626] rounded-xl border border-[#725CFF]/15">
              <strong className="text-[#F5F7FF] block mb-0.5">3. Jaw & Masseter Relaxation:</strong>
              Place tongue flat on roof of mouth behind front teeth. Gently open and close jaw 10 times while maintaining tongue contact to relieve teeth-grinding tension.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

