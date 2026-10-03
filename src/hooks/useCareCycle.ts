import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ALL_STEPS,
  CARE_STEPS,
  POST_CYCLE_STEPS,
  addCareHistoryEntry,
} from '../types';
import type { CareStep } from '../types';

export type CycleState = 'idle' | 'running' | 'paused' | 'completed' | 'emergency-stopped';

export function useCareCycle() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [state, setState] = useState<CycleState>('idle');
  const [demoMode, setDemoMode] = useState(false);
  const [battery, setBattery] = useState(87);
  const [robotDocked, setRobotDocked] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepDuration = demoMode ? 3500 : 4500;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advance = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= ALL_STEPS.length - 1) {
        setState('completed');
        return prev;
      }
      return prev + 1;
    });
  }, []);

  // Battery simulation: drain during care cycle, charge during docking
  useEffect(() => {
    if (state !== 'running') return;
    const step = ALL_STEPS[currentStep];
    if (!step) return;

    if (step.action === 'idle') {
      setRobotDocked(true);
    } else if (step.action === 'scanning') {
      setRobotDocked(false);
    } else if (step.action === 'return-to-dock') {
      setRobotDocked(false);
    } else if (step.action === 'charging') {
      setRobotDocked(true);
      setBattery((b) => Math.min(100, b + 3));
    } else if (step.action === 'fully-charged') {
      setRobotDocked(true);
      setBattery(100);
    } else if (currentStep >= 1 && currentStep <= 14) {
      // Drain battery during care cycle
      setBattery((b) => Math.max(1, b - 1));
    }
  }, [currentStep, state]);

  useEffect(() => {
    if (state === 'running') {
      clearTimer();
      timerRef.current = setTimeout(() => {
        if (currentStep >= ALL_STEPS.length - 1) {
          setState('completed');
        } else {
          advance();
        }
      }, stepDuration);
    }
    return clearTimer;
  }, [state, currentStep, stepDuration, advance]);
  useEffect(() => {
  if (state !== 'completed') return;

  const now = new Date();

  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  addCareHistoryEntry({
    id: `cycle-${Date.now()}`,
    date,
    time,
    cycle: 'Completed',
    coverStatus: 'Sealed',
    wasteStatus: 'Transferred',
    result: 'Successful',
  });
}, [state]);

  const start = useCallback(() => {
    if (state === 'completed') {
      setCurrentStep(0);
      setBattery(87);
    }
    setState('running');
  }, [state]);

  const pause = useCallback(() => {
    setState('paused');
    clearTimer();
  }, []);

  const resume = useCallback(() => {
    setState('running');
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStep(0);
    setState('idle');
    setBattery(87);
    setRobotDocked(true);
  }, []);

  const emergencyStop = useCallback(() => {
    clearTimer();
    setState('emergency-stopped');
  }, []);

  const goToStep = useCallback((step: number) => {
    clearTimer();
    setCurrentStep(step);
    if (state === 'running') {
      setState('paused');
    }
  }, [state]);

  const startDemo = useCallback(() => {
    setDemoMode(true);
    setCurrentStep(0);
    setBattery(87);
    setState('running');
  }, []);

  const step: CareStep = ALL_STEPS[currentStep] ?? ALL_STEPS[0];
  const progress = ((currentStep + 1) / ALL_STEPS.length) * 100;
  const isPostCycle = currentStep >= CARE_STEPS.length;

  // Robot state derived from current step
  const robotState =
    step.action === 'idle' ? 'idle' :
    step.action === 'scanning' ? 'scanning' :
    step.action === 'return-to-dock' ? 'returning-to-dock' :
    step.action === 'charging' ? 'charging' :
    step.action === 'fully-charged' ? 'fully-charged' :
    'care-active';

  // Battery display
  const batteryLabel = step.action === 'charging' ? `Charging... ${battery}%` :
    step.action === 'fully-charged' ? 'Fully Charged' :
    `${battery}%`;

  return {
    currentStep,
    step,
    state,
    progress,
    demoMode,
    battery,
    batteryLabel,
    robotDocked,
    robotState,
    isPostCycle,
    start,
    pause,
    resume,
    reset,
    emergencyStop,
    goToStep,
    startDemo,
    totalSteps: ALL_STEPS.length,
    careStepsCount: CARE_STEPS.length,
    postCycleSteps: POST_CYCLE_STEPS,
  };
}
