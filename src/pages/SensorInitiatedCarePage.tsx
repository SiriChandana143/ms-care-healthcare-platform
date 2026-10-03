import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity, Home, Play, Pause, RotateCcw, BatteryCharging, Camera,
  Scale, Radio, Timer, Settings, Plus, Minus, ChevronRight,
  RotateCw, AlertOctagon, Zap,
} from 'lucide-react';
import { BedSimulation } from '../components/simulation/BedSimulation';
import { TopViewDiagram } from '../components/simulation/TopViewDiagram';
import { StatusPanel } from '../components/simulation/StatusPanel';
import { CareTimeline } from '../components/simulation/CareTimeline';
import { CareCycleController } from '../components/simulation/CareCycleController';
import { addCareHistoryEntry, addNotificationEntry } from '../types';
import { ALL_STEPS } from '../types';
import type { CameraView, SystemStatus, NotificationEntry } from '../types';
import type { CycleState } from '../hooks/useCareCycle';

interface SensorInitiatedCarePageProps {
  onSwitchMode: () => void;
}

const CAMERA_VIEWS: { label: string; value: CameraView }[] = [
  { label: '3D', value: '3d' },
  { label: 'TOP', value: 'top' },
  { label: 'SIDE', value: 'side' },
  { label: 'MECHANISM', value: 'mechanism' },
];

const TIMEOUT_OPTIONS = [10, 20, 30, 45];

const CARE_CYCLE_STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  preparing: 'Preparing System',
  'ready-for-usage': 'Monitoring Patient Usage',
  'usage-detected': 'Usage Detected',
  'care-timer': 'Care Timer Running',
  'care-complete': 'Care Event Complete',
  washing: 'Washing',
  retrieving: 'Retrieving Used Module',
  sealing: 'Module Sealing',
  'slider-exit': 'Slider Exiting',
  'bed-restored': 'Central Section Locked',
  'waste-disposal': 'Waste Disposal',
  completed: 'Care Completed',
};

type CareCycleStatus =
  | 'idle'
  | 'preparing'
  | 'ready-for-usage'
  | 'usage-detected'
  | 'care-timer'
  | 'care-complete'
  | 'washing'
  | 'retrieving'
  | 'sealing'
  | 'slider-exit'
  | 'bed-restored'
  | 'waste-disposal'
  | 'completed';

type UsageStatus = 'waiting' | 'detected' | 'monitoring';
type WeightStability = 'waiting' | 'monitoring' | 'stable';

const DEFAULT_THRESHOLD = 0.2;
const DEFAULT_TIMEOUT_MIN = 20;
const SIMULATED_USAGE_WEIGHT = 0.8;
const STEP_DURATION = 4500;

function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function makeNotification(title: string, message: string, type: 'success' | 'info' | 'warning' = 'info'): NotificationEntry {
  return { id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, message, time: nowTime(), type, read: false };
}

export function SensorInitiatedCarePage({ onSwitchMode }: SensorInitiatedCarePageProps) {
  // Care cycle state
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<CycleState>('idle');
  const [battery, setBattery] = useState(87);
  const [robotDocked, setRobotDocked] = useState(true);
  const [careCycleStatus, setCareCycleStatus] = useState<CareCycleStatus>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [cameraView, setCameraView] = useState<CameraView>('3d');

  // Weight sensor state
  const [baselineWeight, setBaselineWeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightThreshold] = useState(DEFAULT_THRESHOLD);
  const [usageStatus, setUsageStatus] = useState<UsageStatus>('waiting');
  const [weightStability, setWeightStability] = useState<WeightStability>('waiting');

  // Care timer state
  const [careTimeoutMin, setCareTimeoutMin] = useState(DEFAULT_TIMEOUT_MIN);
  const [careTimerSec, setCareTimerSec] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const careTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = ALL_STEPS[currentStep] ?? ALL_STEPS[0];
  const progress = ((currentStep + 1) / ALL_STEPS.length) * 100;
  const weightChange = +(currentWeight - baselineWeight).toFixed(2);
  const isCompleted = state === 'completed';
  const isEmergency = state === 'emergency-stopped';
  const showTopView = cameraView === 'top';

  const openActions = ['center-open', 'slider-enter', 'slider-locked', 'cover-placed', 'care-mode', 'washing', 'slider-retrieve', 'sealing', 'slider-exit'];

  const usageStatusLabel = usageStatus === 'detected' ? 'Usage Detected' : usageStatus === 'monitoring' ? 'Monitoring' : 'Waiting for Usage';
  const stabilityLabel = weightStability === 'stable' ? 'Stable' : weightStability === 'monitoring' ? 'Monitoring' : 'Waiting';

  const careTimerLabel = careTimerSec > 0
    ? `${Math.floor(careTimerSec / 60).toString().padStart(2, '0')}:${(careTimerSec % 60).toString().padStart(2, '0')}`
    : 'Not Started';

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };
  const clearCareTimer = () => {
    if (careTimerRef.current) { clearInterval(careTimerRef.current); careTimerRef.current = null; }
  };

  const pushNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const entry = makeNotification(title, message, type);
    addNotificationEntry(entry);
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
    const s = ALL_STEPS[currentStep];
    if (!s) return;
    if (s.action === 'idle') setRobotDocked(true);
    else if (s.action === 'scanning') setRobotDocked(false);
    else if (s.action === 'return-to-dock') setRobotDocked(false);
    else if (s.action === 'charging') { setRobotDocked(true); setBattery((b) => Math.min(100, b + 3)); }
    else if (s.action === 'fully-charged') { setRobotDocked(true); setBattery(100); }
    else if (currentStep >= 1 && currentStep <= 14) setBattery((b) => Math.max(1, b - 1));
  }, [currentStep, state]);

  // Step timer — steps 0-4 (prep) and 6+ (post-care) auto-advance. Step 5 (care-mode) waits for usage.
  useEffect(() => {
    if (state !== 'running') return;
    if (currentStep === 5) return; // step 5 waits for usage detection
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (currentStep >= ALL_STEPS.length - 1) setState('completed');
      else advance();
    }, STEP_DURATION);
    return clearTimer;
  }, [state, currentStep, advance]);

  // At step 5 (care-mode): sensor-initiated waits for usage detection
  useEffect(() => {
    if (state !== 'running' || currentStep !== 5) return;
    setCareCycleStatus('ready-for-usage');
    setUsageStatus('monitoring');
  }, [state, currentStep]);

  // When usage detected, start care timer and advance to step 6
  useEffect(() => {
    if (usageStatus === 'detected' && state === 'running' && currentStep === 5) {
      setCareCycleStatus('care-timer');
      setWeightStability('monitoring');
      pushNotification('Patient usage detected', 'Weight sensor automatically detected patient usage.', 'info');
      pushNotification('Care timer started', `Care completion timer started: ${careTimeoutMin} minutes.`, 'info');
      setCurrentStep(6);
      setCareTimerSec(careTimeoutMin * 60);
    }
  }, [usageStatus, state, currentStep, careTimeoutMin, pushNotification]);

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
    setWeightStability('stable');
    pushNotification('Care event completed automatically', 'Weight stable and timer reached zero. Automatic washing will begin.', 'success');
    const t = setTimeout(() => {
      setCareCycleStatus('washing');
      setCurrentStep(7);
    }, 1500);
    return () => clearTimeout(t);
  }, [careCycleStatus, pushNotification]);

  // Washing complete → auto-advance through retrieval, sealing, slider exit, bed restore, crane, waste
  useEffect(() => {
    if (careCycleStatus === 'washing' && currentStep === 7) {
      pushNotification('Washing started', 'Automatic hygiene washing cycle in progress.', 'info');
      const t = setTimeout(() => {
        pushNotification('Washing complete', 'Hygiene washing completed. Proceeding to module retrieval.', 'success');
        setCareCycleStatus('retrieving');
        setCurrentStep(8);
      }, STEP_DURATION + 1000);
      return () => clearTimeout(t);
    }
  }, [careCycleStatus, currentStep, pushNotification]);

  // Steps 8-14: auto-advance with notifications
  useEffect(() => {
    if (state !== 'running') return;
    if (currentStep < 8 || currentStep > 14) return;
    const s = ALL_STEPS[currentStep];
    if (!s) return;

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

    const notif = notificationsForStep[s.action];
    if (notif) pushNotification(notif[0], notif[1], notif[2]);

    if (s.action === 'slider-retrieve') setCareCycleStatus('retrieving');
    if (s.action === 'sealing') setCareCycleStatus('sealing');
    if (s.action === 'slider-exit') setCareCycleStatus('slider-exit');
    if (s.action === 'center-close') setCareCycleStatus('bed-restored');
    if (s.action === 'crane-transfer') setCareCycleStatus('waste-disposal');
    if (s.action === 'crane-retract') setCareCycleStatus('completed');
  }, [currentStep, state, pushNotification]);

  // On completion: add care history entry
  useEffect(() => {
    if (state !== 'completed') return;
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addCareHistoryEntry({ id: `sensor-cycle-${Date.now()}`, date, time, cycle: 'Sensor-Initiated', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' });
  }, [state]);

  const start = useCallback(() => {
    if (state === 'completed') { setCurrentStep(0); setBattery(87); }
    setState('running');
    setCareCycleStatus('preparing');
    pushNotification('Monitoring started', 'System is now monitoring for patient usage via simulated weight sensor.', 'info');
  }, [state, pushNotification]);

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

  const goToStep = useCallback((s: number) => {
    clearTimer(); setCurrentStep(s);
    if (state === 'running') setState('paused');
  }, [state]);

  const simulateUsage = useCallback(() => {
    setCurrentWeight(SIMULATED_USAGE_WEIGHT);
    setUsageStatus('detected');
  }, []);

  const resetSensor = useCallback(() => {
    setBaselineWeight(0); setCurrentWeight(0); setUsageStatus('waiting'); setWeightStability('waiting');
    setCareTimerSec(0);
  }, []);

  const adjustCareTimer = useCallback((deltaSec: number) => {
    setCareTimerSec((prev) => Math.max(0, prev + deltaSec));
  }, []);

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

  const systemStatus: SystemStatus = step.status;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-soft">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold font-display text-navy-900 leading-none">Ms.care</div>
                <div className="text-[10px] text-medical-500 font-medium tracking-wide leading-none mt-0.5">Sensor-Initiated Bedridden Care</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-medical-50 border border-medical-100">
              <Radio className="w-4 h-4 text-medical-600" />
              <span className="text-sm font-semibold text-medical-700">Sensor-Initiated Mode</span>
            </div>
            <button onClick={onSwitchMode} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-gray-50 transition-all">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold font-display text-navy-900">Sensor-Initiated Bedridden Care</h1>
            <p className="text-navy-500 mt-1 text-sm">Automatic care cycle triggered by simulated weight/load sensor detection</p>
            <div className="flex items-center gap-2 mt-2">
              <Radio className="w-4 h-4 text-medical-600" />
              <span className="text-xs font-semibold text-navy-700">Sensor-Initiated Bedridden Care</span>
              <span className="text-xs text-navy-300">|</span>
              <span className="text-xs font-medium text-medical-600">{CARE_CYCLE_STATUS_LABELS[careCycleStatus] ?? 'Idle'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-safe-50 border border-safe-100">
              <BatteryCharging className="w-4 h-4 text-safe-600" />
              <span className="text-sm font-semibold text-safe-700">{batteryLabel}</span>
            </div>
            <button onClick={start} className="btn-accent" disabled={state === 'running'}>
              <Zap className="w-4 h-4" />
              Start Monitoring
            </button>
          </div>
        </div>

        {/* Main simulation area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bed visualization */}
          <div className="lg:col-span-2">
            <div className="card-lg p-4 sm:p-6 relative">
              {/* Camera view toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {CAMERA_VIEWS.map((view) => (
                    <button key={view.value} onClick={() => setCameraView(view.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${cameraView === view.value ? 'bg-navy-900 text-white' : 'bg-gray-100 text-navy-500 hover:bg-gray-200'}`}>
                      {view.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-navy-400">
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Camera View</span>
                </div>
              </div>

              {/* Visualization */}
              <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
                {showTopView ? (
                  <div className="p-8"><TopViewDiagram isOpen={openActions.includes(step.action)} /></div>
                ) : (
                  <BedSimulation step={currentStep} cameraView={cameraView} />
                )}
              </div>

              {/* Current step info */}
              <div className="mt-4 p-4 rounded-xl bg-medical-50 border border-medical-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-medical-600 tracking-wide">{currentStep >= 15 ? 'POST-CYCLE' : 'STEP'} {step.id}</span>
                  {state === 'running' && <span className="status-dot status-active text-medical-600 text-xs">Running</span>}
                  {state === 'paused' && <span className="status-dot status-warn text-warn-600 text-xs">Paused</span>}
                </div>
                <h3 className="text-lg font-bold text-navy-900">{step.name}</h3>
                <p className="text-sm text-navy-500 mt-1 leading-relaxed">{step.description}</p>
              </div>

              {/* Timeline */}
              <div className="mt-4">
                <CareTimeline currentStage={Math.min(currentStep, 14)} />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Patient Usage Sensor Card */}
            <div className="card-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-medical-600" />
                  <h3 className="text-sm font-bold text-navy-900">Patient Usage Sensor</h3>
                </div>
                <span className="text-[10px] font-medium text-navy-400 bg-gray-100 px-2 py-0.5 rounded">Simulated Weight Sensor</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Sensor</span>
                  <span className="text-xs font-semibold text-navy-700">Conceptual Load / Weight Sensor</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Status</span>
                  <span className={`text-xs font-semibold ${usageStatus === 'detected' ? 'text-medical-600' : usageStatus === 'monitoring' ? 'text-safe-600' : 'text-navy-500'}`}>
                    {usageStatus === 'detected' ? 'Usage Detected' : usageStatus === 'monitoring' ? 'Monitoring' : 'Ready'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Usage</span>
                  <span className={`text-xs font-semibold ${usageStatus === 'detected' ? 'text-medical-600' : 'text-navy-500'}`}>
                    {usageStatus === 'detected' ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Baseline Weight</span>
                  <span className="text-xs font-semibold text-navy-700">{baselineWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Current Weight</span>
                  <span className="text-xs font-semibold text-navy-700">{currentWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Weight Change</span>
                  <span className={`text-xs font-semibold ${weightChange >= weightThreshold ? 'text-medical-600' : 'text-navy-700'}`}>
                    +{weightChange.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Detection Threshold</span>
                  <span className="text-xs font-semibold text-navy-700">{weightThreshold.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Care Timer</span>
                  <span className={`text-xs font-semibold ${careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>
                    {careTimerLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-navy-400">Weight Stability</span>
                  <span className={`text-xs font-semibold ${weightStability === 'stable' ? 'text-safe-600' : weightStability === 'monitoring' ? 'text-medical-600' : 'text-navy-500'}`}>
                    {stabilityLabel}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={simulateUsage}
                  disabled={usageStatus === 'detected' || state !== 'running' || currentStep !== 5}
                  className="w-full btn-accent text-xs disabled:opacity-40"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Simulate Patient Usage
                </button>
                <button
                  onClick={resetSensor}
                  disabled={usageStatus === 'detected' && careCycleStatus !== 'idle'}
                  className="w-full btn-secondary text-xs disabled:opacity-40"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Reset Sensor
                </button>
              </div>

              {/* Timer adjustment during active care */}
              {careCycleStatus === 'care-timer' && (
                <div className="mt-3 space-y-2">
                  <div className="text-[10px] text-navy-400 font-medium text-center">Adjust Remaining Time</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => adjustCareTimer(-300)} disabled={careTimerSec <= 0} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all disabled:opacity-40">
                      <Minus className="w-3 h-3" /> 5 min
                    </button>
                    <button onClick={() => adjustCareTimer(300)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all">
                      <Plus className="w-3 h-3" /> 5 min
                    </button>
                    <button onClick={() => adjustCareTimer(-600)} disabled={careTimerSec <= 0} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all disabled:opacity-40">
                      <Minus className="w-3 h-3" /> 10 min
                    </button>
                    <button onClick={() => adjustCareTimer(600)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all">
                      <Plus className="w-3 h-3" /> 10 min
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Care Cycle Settings */}
            <div className="card p-4">
              <button onClick={() => setShowSettings(!showSettings)} className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-navy-500" />
                  <h3 className="text-sm font-semibold text-navy-700">Care Cycle Settings</h3>
                </div>
                <ChevronRight className={`w-4 h-4 text-navy-400 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
              </button>
              {showSettings && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs text-navy-400 font-medium mb-1.5 block">Care Completion Timeout</label>
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-navy-400" />
                      <select
                        value={careTimeoutMin}
                        onChange={(e) => setCareTimeoutMin(Number(e.target.value))}
                        disabled={state === 'running'}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-navy-700 bg-white disabled:opacity-50"
                      >
                        {TIMEOUT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt} min</option>
                        ))}
                        <option value={60}>Custom (60 min)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-400">Usage Detection</span>
                      <span className="font-semibold text-medical-600">Weight Sensor</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-400">Detection Threshold</span>
                      <span className="font-semibold text-navy-700">{weightThreshold.toFixed(1)} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-400">Autonomous Care</span>
                      <span className="font-semibold text-safe-600">ON</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-400">Caregiver Confirmation</span>
                      <span className="font-semibold text-warn-600">NOT REQUIRED</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-navy-400 leading-relaxed pt-2 border-t border-gray-50">
                    Ms.care automatically detects usage via simulated weight sensor and completes the routine care cycle based on sensor and timing conditions.
                  </p>
                </div>
              )}
            </div>

            {/* Battery + dock status */}
            <div className="card p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-navy-400 font-medium mb-1">Battery</div>
                  <div className="flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-safe-600" />
                    <span className="text-sm font-bold text-navy-900">{battery}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-navy-400 font-medium mb-1">Robot</div>
                  <div className="text-sm font-bold text-navy-900">{robotDocked ? 'Docked' : 'Active'}</div>
                </div>
              </div>
            </div>

            {/* Status panel */}
            <div>
              <h3 className="text-sm font-semibold text-navy-700 mb-3 px-1">Live System Status</h3>
              <StatusPanel status={systemStatus} />
            </div>

            {/* Controller */}
            <CareCycleController
              state={state}
              currentStep={currentStep}
              totalSteps={ALL_STEPS.length}
              progress={progress}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
              onEmergencyStop={emergencyStop}
            />

            {/* Step navigation */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-navy-700 mb-3">Step Navigation</h3>
              <div className="flex items-center justify-between gap-2">
                <button onClick={() => goToStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
                  <span className="sr-only">Previous</span>
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <span className="text-sm font-semibold text-navy-700">{currentStep + 1} / {ALL_STEPS.length}</span>
                <button onClick={() => goToStep(Math.min(ALL_STEPS.length - 1, currentStep + 1))} disabled={currentStep === ALL_STEPS.length - 1}
                  className="p-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 max-h-56 overflow-y-auto space-y-1">
                {ALL_STEPS.map((s, i) => (
                  <button key={s.id} onClick={() => goToStep(i)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${i === currentStep ? 'bg-medical-50 text-medical-700 font-semibold' : i < currentStep ? 'text-navy-400 hover:bg-gray-50' : 'text-navy-300 hover:bg-gray-50'}`}>
                    <span className="font-mono mr-1.5">{String(s.id).padStart(2, '0')}</span>
                    {s.shortName}
                    {i >= 15 && <span className="ml-1.5 text-[9px] text-navy-300 font-normal">post-cycle</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Emergency stop overlay */}
      {isEmergency && (
        <div className="fixed inset-0 z-50 bg-danger-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-danger-500 flex items-center justify-center mx-auto mb-4">
              <AlertOctagon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-danger-700">SYSTEM PAUSED</h2>
            <p className="text-navy-500 mt-2 text-sm">Emergency stop activated. All animations halted. The system is in a safe state.</p>
            <p className="text-xs text-navy-400 mt-1">Reason: Manual emergency stop by operator</p>
            <button onClick={reset} className="btn-danger mt-6 w-full">
              <RotateCcw className="w-4 h-4" /> Reset System
            </button>
          </div>
        </div>
      )}

      {/* Completion screen */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-safe-500 flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Care Completed</h2>
            <p className="text-sm text-navy-400 mt-1">Robot docked and fully charged</p>
            <div className="mt-6 space-y-2 text-left">
              {['Cover positioned', 'Usage detected by sensor', 'Care completed', 'Cover sealed', 'Waste transferred', 'Bed restored', 'Robot returned to dock'].map((label) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-safe-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-safe-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-navy-700">{label}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 rounded-xl bg-gray-50"><div className="text-xs text-navy-400">Bed</div><div className="text-sm font-semibold text-safe-600">Ready</div></div>
              <div className="p-3 rounded-xl bg-gray-50"><div className="text-xs text-navy-400">Battery</div><div className="text-sm font-semibold text-safe-600">100%</div></div>
              <div className="p-3 rounded-xl bg-gray-50"><div className="text-xs text-navy-400">Waste</div><div className="text-sm font-semibold text-safe-600">Transferred</div></div>
              <div className="p-3 rounded-xl bg-gray-50"><div className="text-xs text-navy-400">Robot</div><div className="text-sm font-semibold text-safe-600">Docked — Ready</div></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={reset} className="btn-primary flex-1"><Play className="w-4 h-4" /> Done</button>
              <button onClick={onSwitchMode} className="btn-secondary flex-1">Main Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
