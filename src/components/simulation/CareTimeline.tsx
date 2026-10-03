import { TIMELINE_STAGES } from '../../types';

interface CareTimelineProps {
  currentStage: number;
  className?: string;
}

export function CareTimeline({ currentStage, className = '' }: CareTimelineProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center justify-between overflow-x-auto pb-2">
        {/* Base line */}
        <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />

        {/* Progress line */}
        <div
          className="absolute left-0 top-3 h-0.5 bg-medical-500 transition-all duration-1000"
          style={{ width: `${(currentStage / (TIMELINE_STAGES.length - 1)) * 100}%` }}
        />

        {TIMELINE_STAGES.map((stage, i) => {
          const isComplete = i < currentStage;
          const isCurrent = i === currentStage;
          const isFuture = i > currentStage;

          return (
            <div key={i} className="relative flex flex-col items-center z-10 flex-shrink-0" style={{ minWidth: '80px' }}>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  isComplete
                    ? 'bg-medical-500 border-medical-500'
                    : isCurrent
                    ? 'bg-white border-medical-500 shadow-medium animate-pulse-soft'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isComplete && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isCurrent && <div className="w-2 h-2 rounded-full bg-medical-500" />}
              </div>
              <div
                className={`mt-2 text-[10px] font-medium text-center transition-colors ${
                  isComplete ? 'text-medical-600' : isCurrent ? 'text-navy-900' : 'text-gray-400'
                }`}
              >
                {stage}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
