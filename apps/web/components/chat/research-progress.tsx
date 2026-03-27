'use client';

// ---------------------------------------------------------------------------
// ResearchProgress — visual step indicator for deep research tool
// ---------------------------------------------------------------------------

export interface ResearchStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  detail?: string;
}

interface ResearchProgressProps {
  steps?: ResearchStep[];
  isLoading?: boolean;
}

export function ResearchProgress({ steps, isLoading }: ResearchProgressProps) {
  const defaultSteps: ResearchStep[] = steps || [
    { id: 'plan', label: 'Planning', status: isLoading ? 'active' : 'pending' },
    { id: 'search', label: 'Searching', status: 'pending' },
    { id: 'synthesize', label: 'Synthesizing', status: 'pending' },
  ];

  return (
    <div className="flex items-center gap-1 py-2">
      {defaultSteps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1">
          {i > 0 && (
            <div
              className={`w-6 h-px ${
                step.status === 'pending' ? 'bg-white/10' : 'bg-[#00bcd4]/30'
              }`}
            />
          )}
          <div className="flex items-center gap-1.5">
            {step.status === 'complete' && (
              <span className="text-emerald-400 text-xs">&#10003;</span>
            )}
            {step.status === 'active' && (
              <span className="w-3 h-3 rounded-full border-2 border-[#00bcd4] border-t-transparent animate-spin" />
            )}
            {step.status === 'pending' && (
              <span className="w-2 h-2 rounded-full bg-white/15" />
            )}
            {step.status === 'error' && (
              <span className="text-red-400 text-xs">&#10005;</span>
            )}
            <span
              className={`text-xs ${
                step.status === 'active'
                  ? 'text-[#00bcd4]'
                  : step.status === 'complete'
                    ? 'text-emerald-400/70'
                    : step.status === 'error'
                      ? 'text-red-400'
                      : 'text-white/30'
              }`}
            >
              {step.label}
            </span>
            {step.detail && (
              <span className="text-[10px] text-white/20">{step.detail}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResearchProgress;
