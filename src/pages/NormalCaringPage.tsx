import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity, Home, Play, Pause, RotateCcw, BatteryCharging, Camera,
  CheckCircle2, ShieldCheck, Armchair, Bed, Cpu, Heart, Zap,
  ChevronLeft, ChevronRight, AlertCircle, Wrench, Trash2, Droplets,
} from 'lucide-react';
import { NormalBedSimulation, type NormalCarePhase, type BedPosition } from '../components/simulation/NormalBedSimulation';
import { addCareHistoryEntry } from '../types';
import type { CameraView } from '../types';

interface NormalCaringPageProps {
  onSwitchMode: () => void;
}

const PHASE_SEQUENCE: { phase: NormalCarePhase; label: string; shortName: string; description: string }[] = [
  { phase: 'idle', label: 'Robot Ready', shortName: 'Robot Ready', description: 'The MS.care robot is docked and ready for the next care cycle.' },
  { phase: 'safety-check', label: 'Safety Check', shortName: 'Safety Check', description: 'The robot moves beside the bed and performs a safety scan. Patient positioned, safety supports active, bed mechanism ready, robot ready.' },
  { phase: 'bed-adjusting', label: 'Bed Adjusting', shortName: 'Bed Adjusting', description: 'The head/back section slowly rises upward while the foot/lower section gradually moves downward. The patient remains safely supported on the continuous mattress.' },
  { phase: 'chair-position', label: 'Chair Position', shortName: 'Chair Position', description: 'The bed has reached a comfortable supported chair/reclined position. The patient remains safely on the bed.' },
  { phase: 'care-prep', label: 'Care Preparation', shortName: 'Care Prep', description: 'The small central rectangular toileting access section around the patient\'s pelvic area is unlocked and ready to slide.' },
  { phase: 'central-open', label: 'Central Access Opening', shortName: 'Access Opens', description: 'The small central section slides sideways, creating a controlled opening around the toileting area. The surrounding mattress remains supportive.' },
  { phase: 'slider-enter', label: 'Bed Slider Enters', shortName: 'Slider Enters', description: 'The MS.care bed slider enters through the opening carrying the fresh disposable cover and care module.' },
  { phase: 'care-active', label: 'Care Active', shortName: 'Care Active', description: 'The care mechanism operates while the patient remains comfortably supported in the chair position.' },
  { phase: 'washing', label: 'Washing', shortName: 'Washing', description: 'The hygiene nozzle deploys. Clean water flows from the dock supply. Used water goes into the sealed disposable waste pathway. No graphic fluids shown.' },
  { phase: 'slider-retrieve', label: 'Retrieving Used Module', shortName: 'Retrieving', description: 'The bed slider retrieves the used disposable module. The module is sealed before transfer.' },
  { phase: 'central-close', label: 'Central Access Closing', shortName: 'Access Closes', description: 'The bed slider exits completely. The small central section slides sideways back into place and locks.' },
  { phase: 'bed-returning', label: 'Returning to Flat', shortName: 'Bed Returning', description: 'The head/back section lowers to flat. The foot section rises back to flat. The patient remains safely on the bed throughout.' },
  { phase: 'care-completed', label: 'Care Completed', shortName: 'Care Complete', description: 'The care cycle is complete. The sealed waste is transferred to the external waste unit via the robotic crane.' },
  { phase: 'robot-returning', label: 'Robot Returns to Dock', shortName: 'Robot Returning', description: 'The MS.care robot returns to its charging dock and begins recharging.' },
  { phase: 'docked', label: 'Docked & Charging', shortName: 'Docked', description: 'The robot is docked and charging. The bed is flat. The system is ready for the next cycle.' },
];

const CAMERA_VIEWS: { label: string; value: CameraView }[] = [
  { label: '3D', value: '3d' },
  { label: 'TOP', value: 'top' },
  { label: 'SIDE', value: 'side' },
  { label: 'MECHANISM', value: 'mechanism' },
];

export function NormalCaringPage({ onSwitchMode }: NormalCaringPageProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'completed' | 'emergency-stopped'>('idle');
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const [safetyChecks, setSafetyChecks] = useState({ patient: false, bedArea: false, mechanism: false, robot: false });
  const [battery, setBattery] = useState(87);
  const [cameraView, setCameraView] = useState<CameraView>('3d');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepDuration = 4000;

  const currentPhase = PHASE_SEQUENCE[phaseIndex];
  const phase = currentPhase.phase;

  const bedPosition: BedPosition =
    phase === 'bed-adjusting' ? 'adjusting' :
    (phase === 'chair-position' || phase === 'care-prep' || phase === 'central-open' || phase === 'slider-enter' || phase === 'care-active' || phase === 'washing' || phase === 'slider-retrieve' || phase === 'central-close') ? 'chair' :
    phase === 'bed-returning' ? 'returning' :
    'flat';

  const clearTimer = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };

  const advance = useCallback(() => {
    setPhaseIndex((prev) => {
      if (prev >= PHASE_SEQUENCE.length - 1) { setState('completed'); return prev; }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (state === 'running') {
      clearTimer();
      timerRef.current = setTimeout(() => {
        if (phaseIndex >= PHASE_SEQUENCE.length - 1) setState('completed');
        else advance();
      }, stepDuration);
    }
    return clearTimer;
  }, [state, phaseIndex, advance]);

  useEffect(() => {
    if (state !== 'running') return;
    if (phase === 'robot-returning' || phase === 'docked') setBattery((b) => Math.min(100, b + 3));
    else if (phase !== 'idle') setBattery((b) => Math.max(1, b - 1));
  }, [phaseIndex, state, phase]);

  useEffect(() => {
    if (state !== 'completed') return;
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addCareHistoryEntry({
      id: `normal-care-${Date.now()}`, date, time,
      cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful',
    });
  }, [state]);

  useEffect(() => {
    if (state !== 'emergency-stopped') return;
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addCareHistoryEntry({
      id: `normal-care-${Date.now()}`, date, time,
      cycle: 'Interrupted', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Interrupted',
    });
  }, [state]);

  const startCycle = () => setShowSafetyCheck(true);

  const confirmSafetyAndStart = () => {
    setShowSafetyCheck(false);
    setSafetyChecks({ patient: false, bedArea: false, mechanism: false, robot: false });
    setPhaseIndex(1);
    setState('running');
  };

  const pause = () => { setState('paused'); clearTimer(); };
  const resume = () => { setState('running'); };
  const reset = () => {
    clearTimer(); setPhaseIndex(0); setState('idle'); setBattery(87);
    setShowSafetyCheck(false);
    setSafetyChecks({ patient: false, bedArea: false, mechanism: false, robot: false });
  };
  const emergencyStop = () => { clearTimer(); setState('emergency-stopped'); };
  const goToStep = (step: number) => { clearTimer(); setPhaseIndex(step); if (state === 'running') setState('paused'); };

  const progress = ((phaseIndex + 1) / PHASE_SEQUENCE.length) * 100;
  const isRunning = state === 'running';
  const isPaused = state === 'paused';
  const isCompleted = state === 'completed';
  const isEmergency = state === 'emergency-stopped';
  const isActive = isRunning || isPaused;

  const batteryLabel = phase === 'docked' ? `Charging... ${battery}%` : phase === 'robot-returning' ? 'Returning...' : `${battery}%`;
  const allSafetyChecked = safetyChecks.patient && safetyChecks.bedArea && safetyChecks.mechanism && safetyChecks.robot;

  const bedStatusLabel =
    bedPosition === 'chair' ? 'Chair Position' :
    bedPosition === 'adjusting' ? 'Adjusting' :
    bedPosition === 'returning' ? 'Returning' : 'Flat';

  const careStatus =
    isCompleted ? 'Completed' :
    (phase === 'care-active' || phase === 'washing') ? 'Active' :
    isActive ? 'Active' : 'Ready';

  const robotStatus =
    phase === 'idle' || phase === 'docked' ? 'Ready' :
    phase === 'robot-returning' ? 'Returning' :
    isActive ? 'Active' : 'Ready';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-soft">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold font-display text-navy-900 leading-none">Ms.care</div>
                <div className="text-[10px] text-sky-500 font-medium tracking-wide leading-none mt-0.5">Normal Caring</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-100">
              <Armchair className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">Normal Caring Mode</span>
            </div>
            <button onClick={onSwitchMode} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-gray-50 transition-all">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Switch Mode</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold font-display text-navy-900">Normal Caring Simulation</h1>
            <p className="text-navy-500 mt-1 text-sm">Adaptive bedside care with bed-to-chair transformation and central toileting access</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-safe-50 border border-safe-100">
              <BatteryCharging className="w-4 h-4 text-safe-600" />
              <span className="text-sm font-semibold text-safe-700">{batteryLabel}</span>
            </div>
            {!isActive && !isCompleted && !isEmergency && (
              <button onClick={startCycle} className="btn-accent">
                <Play className="w-4 h-4" />
                Start Normal Care
              </button>
            )}
          </div>
        </div>

        {/* Main simulation area */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Reference-style mode panel */}
          <div className="lg:col-span-3 card-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Armchair className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-navy-900">Normal Caring Mode</h2>
            </div>
            <p className="text-sm leading-relaxed text-navy-500">
              Adaptive bedside care with bed-to-chair transformation and central toileting access.
            </p>
            <div className="my-5 h-px bg-gray-100" />
            <h3 className="text-sm font-bold text-navy-800 mb-3">Bed Position</h3>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'flat' as BedPosition, label: 'Flat' },
                { value: 'adjusting' as BedPosition, label: 'Adjusting' },
                { value: 'chair' as BedPosition, label: 'Chair Position' },
              ]).map((item) => {
                const active = bedPosition === item.value || (item.value === 'chair' && bedPosition === 'returning');
                return (
                  <div key={item.value} className={`rounded-xl border p-2 text-center transition-all ${
                    active ? 'border-sky-500 bg-sky-50 shadow-soft' : 'border-transparent bg-gray-50'
                  }`}>
                    <div className="relative h-12 mb-1 overflow-hidden">
                      <div className={`absolute left-1 right-1 top-6 h-1.5 rounded-full bg-sky-300 ${
                        item.value === 'chair' ? 'rotate-[-8deg]' : item.value === 'adjusting' ? 'rotate-[-4deg]' : ''
                      }`} />
                      <div className={`absolute left-2 top-4 w-5 h-4 rounded-t bg-sky-400 ${
                        item.value === 'chair' ? 'rotate-[-42deg] origin-bottom' : item.value === 'adjusting' ? 'rotate-[-20deg] origin-bottom' : ''
                      }`} />
                      <div className={`absolute right-2 top-6 w-4 h-3 rounded-b bg-sky-300 ${
                        item.value === 'chair' ? 'rotate-[10deg] origin-top' : item.value === 'adjusting' ? 'rotate-[6deg] origin-top' : ''
                      }`} />
                    </div>
                    <span className={`text-[10px] font-semibold leading-tight ${active ? 'text-sky-700' : 'text-navy-500'}`}>{item.label}</span>
                  </div>
                );
              })}
            </div>
            {!isActive && !isCompleted && !isEmergency && (
              <button onClick={startCycle} className="btn-accent w-full mt-5">
                <Play className="w-4 h-4" />
                Start Normal Care
              </button>
            )}
          </div>

          {/* Bed visualization */}
          <div className="lg:col-span-6">
            <div className="card-lg p-4 sm:p-6 relative">
              {/* Camera view toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {CAMERA_VIEWS.map((view) => (
                    <button key={view.value} onClick={() => setCameraView(view.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        cameraView === view.value ? 'bg-navy-900 text-white' : 'bg-gray-100 text-navy-500 hover:bg-gray-200'
                      }`}>
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
              <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden border border-gray-100">
                <NormalBedSimulation phase={phase} bedPosition={bedPosition} cameraView={cameraView} />
              </div>

              {/* Current step info */}
              <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-sky-600 tracking-wide">
                    STEP {phaseIndex + 1} / {PHASE_SEQUENCE.length}
                  </span>
                  {isRunning && <span className="status-dot status-active text-medical-600 text-xs">Running</span>}
                  {isPaused && <span className="status-dot status-warn text-warn-600 text-xs">Paused</span>}
                </div>
                <h3 className="text-lg font-bold text-navy-900">{currentPhase.label}</h3>
                <p className="text-sm text-navy-500 mt-1 leading-relaxed">{currentPhase.description}</p>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-navy-500">Cycle Progress</span>
                  <span className="text-xs font-bold text-navy-700">{Math.round(progress)}%</span>
                </div>
                <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-1000"
                    style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-5">
                <div className="relative flex items-center justify-between overflow-x-auto pb-2">
                  <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
                  <div className="absolute left-0 top-3 h-0.5 bg-sky-500 transition-all duration-1000"
                    style={{ width: `${(phaseIndex / (PHASE_SEQUENCE.length - 1)) * 100}%` }} />
                  {PHASE_SEQUENCE.map((s, i) => {
                    const isComplete = i < phaseIndex;
                    const isCurrent = i === phaseIndex;
                    return (
                      <div key={i} className="relative flex flex-col items-center z-10 flex-shrink-0" style={{ minWidth: '64px' }}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                          isComplete ? 'bg-sky-500 border-sky-500' :
                          isCurrent ? 'bg-white border-sky-500 shadow-medium animate-pulse-soft' :
                          'bg-white border-gray-300'
                        }`}>
                          {isComplete && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isCurrent && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                        </div>
                        <div className={`mt-2 text-[10px] font-medium text-center transition-colors ${
                          isComplete ? 'text-sky-600' : isCurrent ? 'text-navy-900' : 'text-gray-400'
                        }`}>
                          {s.shortName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Reference-style cycle progress */}
            <div className="card-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-navy-900">Care Cycle Progress</h3>
                <span className="text-sm font-semibold text-navy-500">{phaseIndex + 1} / {PHASE_SEQUENCE.length}</span>
              </div>
              <div className="space-y-2">
                {PHASE_SEQUENCE.map((step, index) => {
                  const complete = index < phaseIndex;
                  const current = index === phaseIndex;
                  return (
                    <button key={step.phase} onClick={() => goToStep(index)} className="w-full flex items-center gap-2 text-left group">
                      <span className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                        complete ? 'bg-safe-500 border-safe-500 text-white' :
                        current ? 'bg-sky-500 border-sky-500 text-white' :
                        'bg-white border-gray-300 text-navy-400 group-hover:border-sky-300'
                      }`}>
                        {complete ? '✓' : current ? index + 1 : index + 1}
                      </span>
                      <span className={`text-xs leading-tight ${
                        current ? 'font-bold text-navy-900' : complete ? 'text-navy-600' : 'text-navy-400'
                      }`}>{step.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode dashboard */}
            <div className="card-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Armchair className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-semibold text-navy-700">Normal Caring Dashboard</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-navy-400" />
                    <span className="text-xs text-navy-500 font-medium">Patient Mode</span>
                  </div>
                  <span className="text-xs font-semibold text-navy-700">Normal Mobility</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-navy-400" />
                    <span className="text-xs text-navy-500 font-medium">Bed Position</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    bedPosition === 'chair' ? 'text-sky-600' :
                    bedPosition === 'adjusting' || bedPosition === 'returning' ? 'text-warn-600' : 'text-navy-700'
                  }`}>
                    {bedStatusLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-navy-400" />
                    <span className="text-xs text-navy-500 font-medium">Care Status</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    careStatus === 'Completed' ? 'text-safe-600' :
                    careStatus === 'Active' ? 'text-medical-600' : 'text-navy-700'
                  }`}>
                    {careStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-navy-400" />
                    <span className="text-xs text-navy-500 font-medium">Robot Status</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    robotStatus === 'Active' ? 'text-medical-600' :
                    robotStatus === 'Returning' ? 'text-warn-600' : 'text-safe-600'
                  }`}>
                    {robotStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-navy-400" />
                    <span className="text-xs text-navy-500 font-medium">Battery</span>
                  </div>
                  <span className={`text-xs font-semibold ${battery > 20 ? 'text-safe-600' : 'text-danger-600'}`}>
                    {Math.round(battery)}%
                  </span>
                </div>
              </div>
              {(bedPosition === 'chair' || bedPosition === 'returning') && !isActive && (
                <button onClick={() => goToStep(11)} className="btn-secondary w-full mt-4">
                  <Bed className="w-4 h-4" />
                  Return Bed to Flat Position
                </button>
              )}
            </div>

            {/* Controller */}
            <div className="card-lg p-5">
              <h3 className="text-sm font-semibold text-navy-700 mb-3">Cycle Controls</h3>
              <div className="space-y-2.5">
                {!isActive && !isCompleted && !isEmergency && (
                  <button onClick={startCycle} className="btn-accent w-full">
                    <Play className="w-4 h-4" />
                    Start Normal Care
                  </button>
                )}
                {isRunning && (
                  <button onClick={pause} className="btn-secondary w-full">
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                {isPaused && (
                  <button onClick={resume} className="btn-accent w-full">
                    <Play className="w-4 h-4" />
                    Resume
                  </button>
                )}
                {(isActive || isCompleted || isEmergency) && (
                  <button onClick={reset} className="btn-primary w-full">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}
                {isActive && (
                  <button onClick={emergencyStop} className="btn-danger w-full">
                    <AlertCircle className="w-4 h-4" />
                    Emergency Stop
                  </button>
                )}
              </div>
            </div>

            {/* Step navigation */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-navy-700 mb-3">Step Navigation</h3>
              <div className="flex items-center justify-between gap-2 mb-3">
                <button onClick={() => goToStep(Math.max(0, phaseIndex - 1))} disabled={phaseIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-navy-700">{phaseIndex + 1} / {PHASE_SEQUENCE.length}</span>
                <button onClick={() => goToStep(Math.min(PHASE_SEQUENCE.length - 1, phaseIndex + 1))} disabled={phaseIndex === PHASE_SEQUENCE.length - 1}
                  className="p-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {PHASE_SEQUENCE.map((s, i) => (
                  <button key={i} onClick={() => goToStep(i)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      i === phaseIndex ? 'bg-sky-50 text-sky-700 font-semibold' :
                      i < phaseIndex ? 'text-navy-400 hover:bg-gray-50' :
                      'text-navy-300 hover:bg-gray-50'
                    }`}>
                    <span className="font-mono mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                    {s.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* System status */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-navy-700 mb-3">System Status</h3>
              <div className="space-y-2">
                {[
                  { icon: Cpu, label: 'Robot', value: robotStatus, color: robotStatus === 'Active' ? 'text-medical-600' : 'text-safe-600' },
                  { icon: Bed, label: 'Bed', value: bedStatusLabel, color: bedPosition === 'chair' ? 'text-sky-600' : 'text-safe-600' },
                  { icon: Heart, label: 'Patient', value: 'On Bed', color: 'text-safe-600' },
                  { icon: Wrench, label: 'Care Mechanism', value: (phase === 'care-active' || phase === 'washing') ? 'Operating' : 'Ready', color: (phase === 'care-active' || phase === 'washing') ? 'text-medical-600' : 'text-safe-600' },
                  { icon: Trash2, label: 'Waste Unit', value: phase === 'care-completed' ? 'Transferred' : 'Ready', color: 'text-safe-600' },
                  { icon: Droplets, label: 'Water Supply', value: phase === 'washing' ? 'Active' : 'Ready', color: phase === 'washing' ? 'text-medical-600' : 'text-safe-600' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5 text-navy-400" />
                      <span className="text-xs text-navy-500">{item.label}</span>
                    </div>
                    <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-navy-900">Ms.care</div>
                <div className="text-[10px] text-navy-400">Normal Caring — Adaptive Bedside Care</div>
              </div>
            </div>
            <button onClick={onSwitchMode} className="text-xs text-navy-500 font-medium hover:text-sky-600 transition-colors flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              Switch Mode
            </button>
          </div>
          <p className="text-xs text-navy-300 mt-4">© 2026 Ms.care — College Innovation & Expo Prototype. All rights reserved.</p>
        </div>
      </footer>

      {/* Safety Check Modal */}
      {showSafetyCheck && (
        <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">Safety Check</h2>
                <p className="text-sm text-navy-500">Confirm all conditions before starting</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { key: 'patient' as const, label: 'Patient positioned', icon: Heart },
                { key: 'bedArea' as const, label: 'Safety supports active', icon: ShieldCheck },
                { key: 'mechanism' as const, label: 'Bed mechanism ready', icon: Wrench },
                { key: 'robot' as const, label: 'Robot ready', icon: Cpu },
              ].map((check) => (
                <button key={check.key}
                  onClick={() => setSafetyChecks((prev) => ({ ...prev, [check.key]: !prev[check.key] }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    safetyChecks[check.key] ? 'border-safe-300 bg-safe-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    safetyChecks[check.key] ? 'bg-safe-500' : 'bg-gray-200'
                  }`}>
                    {safetyChecks[check.key] ? <CheckCircle2 className="w-5 h-5 text-white" /> : <check.icon className="w-4 h-4 text-navy-400" />}
                  </div>
                  <span className={`text-sm font-medium ${safetyChecks[check.key] ? 'text-safe-700' : 'text-navy-600'}`}>
                    {check.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-navy-400 mb-5 text-center">This is a conceptual UI simulation, not a clinical safety validation.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSafetyCheck(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={confirmSafetyAndStart} disabled={!allSafetyChecked}
                className="btn-accent flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
                <Zap className="w-4 h-4" />
                Begin Normal Care
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency stop overlay */}
      {isEmergency && (
        <div className="fixed inset-0 z-50 bg-danger-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-danger-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-danger-700">SYSTEM PAUSED</h2>
            <p className="text-navy-500 mt-2 text-sm">Emergency stop activated. All animations halted. The system is in a safe state.</p>
            <button onClick={reset} className="btn-danger mt-6 w-full">
              <RotateCcw className="w-4 h-4" />
              Reset System
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
            <h2 className="text-2xl font-bold text-navy-900">Normal Caring Complete</h2>
            <p className="text-sm text-navy-400 mt-1">Bed returned to flat position. Robot docked and charging.</p>
            <div className="mt-6 space-y-2 text-left">
              {[
                'Bed adjusted to chair position',
                'Central access section opened',
                'Care and washing completed',
                'Used module sealed and retrieved',
                'Central section closed and locked',
                'Bed returned to flat position',
                'Robot returned to dock',
              ].map((label) => (
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
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="text-xs text-navy-400">Bed</div>
                <div className="text-sm font-semibold text-safe-600">Flat — Ready</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="text-xs text-navy-400">Battery</div>
                <div className="text-sm font-semibold text-safe-600">{Math.round(battery)}%</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="text-xs text-navy-400">Waste</div>
                <div className="text-sm font-semibold text-safe-600">Transferred</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="text-xs text-navy-400">Robot</div>
                <div className="text-sm font-semibold text-safe-600">Docked — Ready</div>
              </div>
            </div>
            <button onClick={reset} className="btn-primary w-full mt-6">
              <Play className="w-4 h-4" />
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
