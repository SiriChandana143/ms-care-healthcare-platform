import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import {
  ALL_STEPS,
  CARE_STEPS,
  POST_CYCLE_STEPS,
  getCareHistory,
  addCareHistoryEntry,
  getNotifications,
  addNotificationEntry,
} from '../types';
import type { SystemStatus, CareStep, CareHistoryEntry, CareMode, NotificationEntry } from '../types';

export type CycleState = 'idle' | 'running' | 'paused' | 'completed' | 'emergency-stopped';
export type UsageStatus = 'waiting' | 'detected' | 'monitoring';
export type WeightStability = 'waiting' | 'monitoring' | 'stable';
export type CareCycleStatus = 'idle' | 'preparing' | 'ready-for-usage' | 'usage-detected' | 'care-timer' | 'care-complete' | 'washing' | 'retrieving' | 'sealing' | 'slider-exit' | 'bed-restored' | 'waste-disposal' | 'completed';

const INITIAL_HISTORY_LENGTH = 8;
const INITIAL_SEALED_COVERS = 3;
const INITIAL_FILL_LEVEL = 32;
const CAPACITY_PER_COVER = 11;
const DEFAULT_THRESHOLD = 0.2;
const DEFAULT_TIMEOUT_MIN = 20;

export interface SystemContextValue {
  currentStep: number;
  step: CareStep;
  state: CycleState;
  progress: number;
  demoMode: boolean;
  battery: number;
  batteryLabel: string;
  robotDocked: boolean;
  robotState: string;
  isPostCycle: boolean;
  totalSteps: number;
  careStepsCount: number;
  postCycleSteps: typeof POST_CYCLE_STEPS;

  sealedCovers: number;
  fillLevel: number;
  remainingCapacity: number;
  lastDisposalDate: string;
  lastDisposalTime: string;
  history: CareHistoryEntry[];

  systemStatus: SystemStatus;

  careMode: CareMode;
  setCareMode: (mode: CareMode) => void;

  // Weight sensor
  baselineWeight: number;
  currentWeight: number;
  weightChange: number;
  weightThreshold: number;
  setWeightThreshold: (kg: number) => void;
  usageStatus: UsageStatus;
  weightStability: WeightStability;

  // Care timer
  careTimeoutMin: number;
  setCareTimeoutMin: (min: number) => void;
  careTimerSec: number;
  careTimerLabel: string;

  // Care cycle status
  careCycleStatus: CareCycleStatus;

  // Notifications
  notifications: NotificationEntry[];

  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  emergencyStop: () => void;
  goToStep: (step: number) => void;
  startDemo: () => void;
  simulateUsage: () => void;
  resetSensor: () => void;
  adjustCareTimer: (deltaSec: number) => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

export function useSystemState(): SystemContextValue {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystemState must be used within SystemProvider');
  return ctx;
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function makeNotification(title: string, message: string, type: 'success' | 'info' | 'warning' = 'info'): NotificationEntry {
  return { id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, message, time: nowTime(), type, read: false };
}

export function SystemProvider({ children, initialCareMode = 'patientInitiatedBedridden' }: { children: ReactNode; initialCareMode?: CareMode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<CycleState>('idle');
  const [demoMode, setDemoMode] = useState(false);
  const [battery, setBattery] = useState(87);
  const [robotDocked, setRobotDocked] = useState(true);
  const [history, setHistory] = useState<CareHistoryEntry[]>(() => getCareHistory());
  const [careMode, setCareMode] = useState<CareMode>(initialCareMode);
  const [notifications, setNotifications] = useState<NotificationEntry[]>(() => getNotifications());

  // Weight sensor
  const [baselineWeight, setBaselineWeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightThreshold, setWeightThreshold] = useState(DEFAULT_THRESHOLD);
  const [usageStatus, setUsageStatus] = useState<UsageStatus>('waiting');
  const [weightStability, setWeightStability] = useState<WeightStability>('waiting');

  // Care timer
  const [careTimeoutMin, setCareTimeoutMin] = useState(DEFAULT_TIMEOUT_MIN);
  const [careTimerSec, setCareTimerSec] = useState(0);

  // Care cycle status
  const [careCycleStatus, setCareCycleStatus] = useState<CareCycleStatus>('idle');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const careTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepDuration = demoMode ? 3500 : 4500;

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };
  const clearCareTimer = () => {
    if (careTimerRef.current) { clearInterval(careTimerRef.current); careTimerRef.current = null; }
  };

  const pushNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const entry = makeNotification(title, message, type);
    addNotificationEntry(entry);
    setNotifications(getNotifications());
  }, []);

  const advance = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= ALL_STEPS.length - 1) { setState('completed'); return prev; }
      return prev + 1;
    });
  }, []);

  // Battery simulation
  useEffect(() => {
    if (state !== 'running') return;
    const step = ALL_STEPS[currentStep];
    if (!step) return;
    if (step.action === 'idle') setRobotDocked(true);
    else if (step.action === 'scanning') setRobotDocked(false);
    else if (step.action === 'return-to-dock') setRobotDocked(false);
    else if (step.action === 'charging') { setRobotDocked(true); setBattery((b) => Math.min(100, b + 3)); }
    else if (step.action === 'fully-charged') { setRobotDocked(true); setBattery(100); }
    else if (currentStep >= 1 && currentStep <= 14) setBattery((b) => Math.max(1, b - 1));
  }, [currentStep, state]);

  // Step timer — steps 0-4 (prep) and 6+ (post-care) auto-advance. Step 5 is handled by care timer logic.
  useEffect(() => {
    if (state !== 'running') return;
    if (currentStep === 5) return; // step 5 (care-mode) is handled by timer/usage logic
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (currentStep >= ALL_STEPS.length - 1) setState('completed');
      else advance();
    }, stepDuration);
    return clearTimer;
  }, [state, currentStep, stepDuration, advance]);

  // At step 5 (care-mode): sensorInitiated waits for usage; patientInitiated/normalCaring start timer immediately
  useEffect(() => {
    if (state !== 'running' || currentStep !== 5) return;
    if (careMode === 'sensorInitiatedBedridden') {
      setCareCycleStatus('ready-for-usage');
      setUsageStatus('monitoring');
    } else {
      setCareCycleStatus('care-timer');
      pushNotification('Care timer started', `Care completion timer started: ${careTimeoutMin} minutes.`, 'info');
      setCareTimerSec(careTimeoutMin * 60);
    }
  }, [state, currentStep, careMode, careTimeoutMin, pushNotification]);

  // Sensor-Initiated: when usage detected, start care timer and advance to step 6
  useEffect(() => {
    if (usageStatus === 'detected' && state === 'running' && currentStep === 5 && careMode === 'sensorInitiatedBedridden') {
      setCareCycleStatus('care-timer');
      setWeightStability('monitoring');
      pushNotification('Patient usage detected', 'Weight sensor automatically detected patient usage.', 'info');
      pushNotification('Care timer started', `Care completion timer started: ${careTimeoutMin} minutes.`, 'info');
      setCurrentStep(6);
      setCareTimerSec(careTimeoutMin * 60);
    }
  }, [usageStatus, state, currentStep, careMode, careTimeoutMin, pushNotification]);

  // Care timer countdown
  useEffect(() => {
    if (careCycleStatus !== 'care-timer') return;
    clearCareTimer();
    careTimerRef.current = setInterval(() => {
      setCareTimerSec((prev) => {
        if (prev <= 1) {
          clearCareTimer();
          setCareCycleStatus('care-complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearCareTimer;
  }, [careCycleStatus]);

  // Care complete → auto-advance to washing (step 7)
  useEffect(() => {
    if (careCycleStatus !== 'care-complete') return;
    if (careMode === 'sensorInitiatedBedridden') setWeightStability('stable');
    const msg = careMode === 'sensorInitiatedBedridden'
      ? 'Weight stable and timer reached zero. Automatic washing will begin.'
      : 'Care timer reached zero. Automatic washing will begin.';
    pushNotification('Care event completed automatically', msg, 'success');
    const t = setTimeout(() => {
      setCareCycleStatus('washing');
      setCurrentStep(7);
    }, 1500);
    return () => clearTimeout(t);
  }, [careCycleStatus, careMode, pushNotification]);

  // Washing complete → auto-advance through retrieval, sealing, slider exit, bed restore, crane, waste
  useEffect(() => {
    if (careCycleStatus === 'washing' && currentStep === 7) {
      pushNotification('Washing started', 'Automatic hygiene washing cycle in progress.', 'info');
      const t = setTimeout(() => {
        pushNotification('Washing complete', 'Hygiene washing completed. Proceeding to module retrieval.', 'success');
        setCareCycleStatus('retrieving');
        setCurrentStep(8);
      }, stepDuration + 1000);
      return () => clearTimeout(t);
    }
  }, [careCycleStatus, currentStep, stepDuration, pushNotification]);

  // Steps 8-14: auto-advance with notifications
  useEffect(() => {
    if (state !== 'running') return;
    if (currentStep < 8 || currentStep > 14) return;
    const step = ALL_STEPS[currentStep];
    if (!step) return;

    const notificationsForStep: Record<string, [string, string, 'success' | 'info' | 'warning']> = {
      'slider-retrieve': ['Module retrieval', 'Retrieving used disposable module.', 'info'],
      'sealing': ['Module sealed', 'Used module hygienically sealed.', 'success'],
      'slider-exit': ['Slider retracted', 'Slider fully exited the bed area.', 'info'],
      'center-close': ['Central section locked', 'Central bed section returned and locked.', 'success'],
      'crane-deploy': ['Crane deployed', 'Robotic crane deploying to transfer sealed module.', 'info'],
      'crane-transfer': ['Waste disposal', 'Crane transferring sealed module to external waste unit.', 'info'],
      'waste-stored': ['Waste disposal completed', 'Sealed module stored in external waste unit.', 'success'],
      'crane-retract': ['Care cycle completed', 'Crane retracted. Full care cycle completed automatically.', 'success'],
    };

    const notif = notificationsForStep[step.action];
    if (notif) pushNotification(notif[0], notif[1], notif[2]);

    if (step.action === 'slider-retrieve') setCareCycleStatus('retrieving');
    if (step.action === 'sealing') setCareCycleStatus('sealing');
    if (step.action === 'slider-exit') setCareCycleStatus('slider-exit');
    if (step.action === 'center-close') setCareCycleStatus('bed-restored');
    if (step.action === 'crane-transfer') setCareCycleStatus('waste-disposal');
    if (step.action === 'crane-retract') setCareCycleStatus('completed');
  }, [currentStep, state, pushNotification]);

  // On completion: add care history entry
  useEffect(() => {
    if (state !== 'completed') return;
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const cycleLabel = careMode === 'patientInitiatedBedridden' ? 'Patient-Initiated' : careMode === 'sensorInitiatedBedridden' ? 'Sensor-Initiated' : 'Completed';
    addCareHistoryEntry({ id: `cycle-${Date.now()}`, date, time, cycle: cycleLabel, coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' });
    setHistory(getCareHistory());
  }, [state, careMode]);

  // Listen for external updates
  useEffect(() => {
    const updateHistory = () => setHistory(getCareHistory());
    const updateNotifs = () => setNotifications(getNotifications());
    window.addEventListener('care-history-updated', updateHistory);
    window.addEventListener('notifications-updated', updateNotifs);
    return () => {
      window.removeEventListener('care-history-updated', updateHistory);
      window.removeEventListener('notifications-updated', updateNotifs);
    };
  }, []);

  const start = useCallback(() => {
    if (state === 'completed') { setCurrentStep(0); setBattery(87); }
    setState('running');
    setCareCycleStatus('preparing');
    if (careMode === 'patientInitiatedBedridden') {
      pushNotification('Patient requested restroom care', 'Patient pressed bedside request control.', 'info');
    } else if (careMode === 'sensorInitiatedBedridden') {
      pushNotification('Monitoring started', 'System is now monitoring for patient usage via simulated weight sensor.', 'info');
    }
  }, [state, careMode, pushNotification]);

  const pause = useCallback(() => { setState('paused'); clearTimer(); }, []);
  const resume = useCallback(() => { setState('running'); }, []);

  const reset = useCallback(() => {
    clearTimer(); clearCareTimer();
    setCurrentStep(0); setState('idle'); setBattery(87); setRobotDocked(true);
    setBaselineWeight(0); setCurrentWeight(0); setUsageStatus('waiting'); setWeightStability('waiting');
    setCareTimerSec(0); setCareCycleStatus('idle');
  }, []);

  const emergencyStop = useCallback(() => {
    clearTimer(); clearCareTimer(); setState('emergency-stopped');
  }, []);

  const goToStep = useCallback((step: number) => {
    clearTimer(); setCurrentStep(step);
    if (state === 'running') setState('paused');
  }, [state]);

  const startDemo = useCallback(() => {
    setDemoMode(true); setCurrentStep(0); setBattery(87); setState('running');
    setCareCycleStatus('preparing');
  }, []);

  const simulateUsage = useCallback(() => {
    setCurrentWeight(0.8);
    setUsageStatus('detected');
  }, []);

  const resetSensor = useCallback(() => {
    setBaselineWeight(0); setCurrentWeight(0); setUsageStatus('waiting'); setWeightStability('waiting');
    setCareTimerSec(0);
  }, []);

  const adjustCareTimer = useCallback((deltaSec: number) => {
    setCareTimerSec((prev) => Math.max(0, prev + deltaSec));
  }, []);

  const step: CareStep = ALL_STEPS[currentStep] ?? ALL_STEPS[0];
  const progress = ((currentStep + 1) / ALL_STEPS.length) * 100;
  const isPostCycle = currentStep >= CARE_STEPS.length;

  const robotState =
    step.action === 'idle' ? 'idle' :
    step.action === 'scanning' ? 'scanning' :
    step.action === 'return-to-dock' ? 'returning-to-dock' :
    step.action === 'charging' ? 'charging' :
    step.action === 'fully-charged' ? 'fully-charged' :
    'care-active';

  const batteryLabel =
    step.action === 'charging' ? `Charging... ${battery}%` :
    step.action === 'fully-charged' ? 'Fully Charged' :
    `${battery}%`;

  const weightChange = +(currentWeight - baselineWeight).toFixed(2);

  const careTimerLabel = careTimerSec > 0
    ? `${Math.floor(careTimerSec / 60).toString().padStart(2, '0')}:${(careTimerSec % 60).toString().padStart(2, '0')}`
    : 'Not Started';

  const newCycles = Math.max(0, history.length - INITIAL_HISTORY_LENGTH);
  const sealedCovers = INITIAL_SEALED_COVERS + newCycles;
  const fillLevel = Math.min(100, INITIAL_FILL_LEVEL + newCycles * CAPACITY_PER_COVER);
  const remainingCapacity = 100 - fillLevel;

  const lastCompleted = history.find((h) => h.cycle === 'Completed' || h.cycle === 'Patient-Initiated' || h.cycle === 'Sensor-Initiated');
  const lastDisposalDate = lastCompleted?.date ?? '10 Sep 2026';
  const lastDisposalTime = lastCompleted?.time ?? '10:32 AM';

  const systemStatus: SystemStatus = step.status;

  const value: SystemContextValue = {
    currentStep, step, state, progress, demoMode, battery, batteryLabel, robotDocked, robotState,
    isPostCycle, totalSteps: ALL_STEPS.length, careStepsCount: CARE_STEPS.length, postCycleSteps: POST_CYCLE_STEPS,
    sealedCovers, fillLevel, remainingCapacity, lastDisposalDate, lastDisposalTime, history, systemStatus,
    careMode, setCareMode,
    baselineWeight, currentWeight, weightChange, weightThreshold, setWeightThreshold, usageStatus, weightStability,
    careTimeoutMin, setCareTimeoutMin, careTimerSec, careTimerLabel,
    careCycleStatus,
    notifications,
    start, pause, resume, reset, emergencyStop, goToStep, startDemo, simulateUsage, resetSensor, adjustCareTimer,
  };

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}
