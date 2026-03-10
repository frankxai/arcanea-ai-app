'use client';

import { Check } from '@/lib/phosphor-icons';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressStepper({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={stepNum} className="flex items-center">
            <div className="relative flex flex-col items-center">
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-violet-500 text-white shadow-[0_0_16px_rgba(13,71,161,0.6)]'
                    : isCurrent
                      ? 'bg-transparent text-[#ffd700] border-2 border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                      : 'bg-transparent text-[#4a4a6a] border border-white/10'
                }`}
              >
                {isCompleted ? (
                  <Check size={12} weight="bold" />
                ) : (
                  <span>{stepNum}</span>
                )}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full border border-[#ffd700]/30 animate-ping" />
                )}
              </div>
              <span
                className={`absolute -bottom-5 text-[9px] tracking-widest uppercase whitespace-nowrap transition-colors duration-300 ${
                  isCurrent
                    ? 'text-[#ffd700]'
                    : isCompleted
                      ? 'text-violet-500'
                      : 'text-[#4a4a6a]'
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>

            {i < totalSteps - 1 && (
              <div className="relative w-12 h-px mx-1 overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-atlantean-aqua transition-all duration-700 ease-out"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
