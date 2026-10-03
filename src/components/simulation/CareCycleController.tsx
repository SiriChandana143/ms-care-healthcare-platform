import { Pause, Play, RotateCcw, Square, AlertOctagon } from 'lucide-react';
import type { CycleState } from '../hooks/useCareCycle';

interface CareCycleControllerProps {
  state: CycleState;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onEmergencyStop: () => void;
  className?: string;
}

export function CareCycleController({
  state,
  currentStep,
  totalSteps,
  progress,
  onStart,
  onPause,
  onResume,
  onReset,
  onEmergencyStop,
  className = '',
}: CareCycleControllerProps) {
  return (
    <div className={`card-lg p-5 ${className}`}>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-navy-700">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-navy-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-medical-400 to-medical-600 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {state === 'idle' || state === 'completed' ? (
          <button onClick={onStart} className="btn-accent">
            <Play className="w-4 h-4" />
            {state === 'completed' ? 'Restart' : 'Start Care Cycle'}
          </button>
        ) : state === 'running' ? (
          <button onClick={onPause} className="btn-secondary">
            <Pause className="w-4 h-4" />
            Pause
          </button>
        ) : state === 'paused' ? (
          <button onClick={onResume} className="btn-accent">
            <Play className="w-4 h-4" />
            Resume
          </button>
        ) : null}

        <button onClick={onReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        <button onClick={onEmergencyStop} className="btn-danger">
          <AlertOctagon className="w-4 h-4" />
          Emergency Stop
        </button>
      </div>

      {/* State indicator */}
      {state !== 'idle' && (
        <div className="mt-3 flex items-center gap-2">
          {state === 'running' && (
            <div className="flex items-center gap-1.5 text-medical-600 text-xs font-medium">
              <span className="status-dot status-active" />
              System Running
            </div>
          )}
          {state === 'paused' && (
            <div className="flex items-center gap-1.5 text-warn-600 text-xs font-medium">
              <span className="status-dot status-warn" />
              System Paused
            </div>
          )}
          {state === 'emergency-stopped' && (
            <div className="flex items-center gap-1.5 text-danger-600 text-xs font-medium">
              <span className="status-dot status-danger" />
              Emergency Stop Activated — System Halted
            </div>
          )}
          {state === 'completed' && (
            <div className="flex items-center gap-1.5 text-safe-600 text-xs font-medium">
              <span className="status-dot status-ready" />
              Cycle Completed
            </div>
          )}
        </div>
      )}
    </div>
  );
}
