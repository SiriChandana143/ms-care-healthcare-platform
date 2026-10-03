import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, RotateCcw, Zap, Camera, BatteryCharging, Hand, Radio, Scale, Timer, RotateCw, Settings, Plus, Minus } from 'lucide-react';
import { useSystemState } from '../context/SystemContext';
import type { CameraView, PageName } from '../types';
import { ALL_STEPS } from '../types';
import { BedSimulation } from '../components/simulation/BedSimulation';
import { TopViewDiagram } from '../components/simulation/TopViewDiagram';
import { StatusPanel } from '../components/simulation/StatusPanel';
import { CareTimeline } from '../components/simulation/CareTimeline';
import { CareCycleController } from '../components/simulation/CareCycleController';

interface SimulationPageProps {
  onNavigate: (page: PageName) => void;
}

const CAMERA_VIEWS: { label: string; value: CameraView }[] = [
  { label: '3D', value: '3d' },
  { label: 'TOP', value: 'top' },
  { label: 'SIDE', value: 'side' },
  { label: 'MECHANISM', value: 'mechanism' },
];

const CARE_MODE_LABELS: Record<string, string> = {
  patientInitiatedBedridden: 'Patient-Initiated Bedridden Care',
  sensorInitiatedBedridden: 'Sensor-Initiated Bedridden Care',
  normalCaring: 'Normal Caring',
};

const TIMEOUT_OPTIONS = [10, 20, 30, 45];

const CARE_CYCLE_STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  preparing: 'Preparing System',
  'ready-for-usage': 'Ready for Patient Usage',
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

export function SimulationPage({ onNavigate }: SimulationPageProps) {
  const cycle = useSystemState();
  const [cameraView, setCameraView] = useState<CameraView>('3d');
  const [showSettings, setShowSettings] = useState(false);
  const isPatientInitiated = cycle.careMode === 'patientInitiatedBedridden';
  const isSensorInitiated = cycle.careMode === 'sensorInitiatedBedridden';

  const isCompleted = cycle.state === 'completed';
  const isEmergency = cycle.state === 'emergency-stopped';
  const showTopView = cameraView === 'top';

  const openActions = ['center-open', 'slider-enter', 'slider-locked', 'cover-placed', 'care-mode', 'washing', 'slider-retrieve', 'sealing', 'slider-exit'];

  const usageStatusLabel = cycle.usageStatus === 'detected' ? 'Usage Detected' : cycle.usageStatus === 'monitoring' ? 'Monitoring' : 'Waiting for Usage';
  const stabilityLabel = cycle.weightStability === 'stable' ? 'Stable' : cycle.weightStability === 'monitoring' ? 'Monitoring' : 'Waiting';

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-navy-900">Interactive Simulation</h1>
          <p className="text-navy-500 mt-1 text-sm">Experience the full MS.care care cycle</p>
          <div className="flex items-center gap-2 mt-2">
            {isPatientInitiated && <Hand className="w-4 h-4 text-safe-600" />}
            {isSensorInitiated && <Radio className="w-4 h-4 text-medical-600" />}
            <span className="text-xs font-semibold text-navy-700">{CARE_MODE_LABELS[cycle.careMode]}</span>
            <span className="text-xs text-navy-300">|</span>
            <span className="text-xs font-medium text-medical-600">{CARE_CYCLE_STATUS_LABELS[cycle.careCycleStatus] ?? 'Idle'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-safe-50 border border-safe-100">
            <BatteryCharging className="w-4 h-4 text-safe-600" />
            <span className="text-sm font-semibold text-safe-700">{cycle.batteryLabel}</span>
          </div>
          {isPatientInitiated ? (
            <button onClick={cycle.start} className="btn-accent" disabled={cycle.state === 'running'}>
              <Hand className="w-4 h-4" />
              Simulate Patient Request
            </button>
          ) : (
            <button onClick={cycle.startDemo} className="btn-accent" disabled={cycle.state === 'running'}>
              <Zap className="w-4 h-4" />
              Run Full Demo
            </button>
          )}
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
                <div className="p-8"><TopViewDiagram isOpen={openActions.includes(cycle.step.action)} /></div>
              ) : (
                <BedSimulation step={cycle.currentStep} cameraView={cameraView} />
              )}
            </div>

            {/* Current step info */}
            <div className="mt-4 p-4 rounded-xl bg-navy-50 border border-navy-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-medical-600 tracking-wide">{cycle.isPostCycle ? 'POST-CYCLE' : 'STEP'} {cycle.step.id}</span>
                {cycle.state === 'running' && <span className="status-dot status-active text-medical-600 text-xs">Running</span>}
                {cycle.state === 'paused' && <span className="status-dot status-warn text-warn-600 text-xs">Paused</span>}
              </div>
              <h3 className="text-lg font-bold text-navy-900">{cycle.step.name}</h3>
              <p className="text-sm text-navy-500 mt-1 leading-relaxed">{cycle.step.description}</p>
            </div>

            {/* Timeline */}
            <div className="mt-4">
              <CareTimeline currentStage={Math.min(cycle.currentStep, 14)} />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Patient Usage Sensor Card — ONLY for Sensor-Initiated Bedridden Care */}
          {isSensorInitiated && (
            <div className="card-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-medical-600" />
                  <h3 className="text-sm font-bold text-navy-900">Patient Usage Sensor</h3>
                </div>
                <span className="text-[10px] font-medium text-navy-400 bg-gray-100 px-2 py-0.5 rounded">Simulated</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Sensor</span>
                  <span className="text-xs font-semibold text-navy-700">Conceptual Load Sensor</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Status</span>
                  <span className={`text-xs font-semibold ${cycle.usageStatus === 'detected' ? 'text-medical-600' : cycle.usageStatus === 'monitoring' ? 'text-safe-600' : 'text-navy-500'}`}>
                    {usageStatusLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Baseline Weight</span>
                  <span className="text-xs font-semibold text-navy-700">{cycle.baselineWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Current Weight</span>
                  <span className="text-xs font-semibold text-navy-700">{cycle.currentWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Weight Change</span>
                  <span className={`text-xs font-semibold ${cycle.weightChange >= cycle.weightThreshold ? 'text-medical-600' : 'text-navy-700'}`}>
                    +{cycle.weightChange.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Detection Threshold</span>
                  <span className="text-xs font-semibold text-navy-700">{cycle.weightThreshold.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Care Timer</span>
                  <span className={`text-xs font-semibold ${cycle.careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>
                    {cycle.careTimerLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-navy-400">Weight Stability</span>
                  <span className={`text-xs font-semibold ${cycle.weightStability === 'stable' ? 'text-safe-600' : cycle.weightStability === 'monitoring' ? 'text-medical-600' : 'text-navy-500'}`}>
                    {stabilityLabel}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={cycle.simulateUsage}
                  disabled={cycle.usageStatus === 'detected' || cycle.state !== 'running' || cycle.currentStep !== 5}
                  className="w-full btn-accent text-xs disabled:opacity-40"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Simulate Patient Usage
                </button>
                <button
                  onClick={cycle.resetSensor}
                  disabled={cycle.usageStatus === 'detected' && cycle.careCycleStatus !== 'idle'}
                  className="w-full btn-secondary text-xs disabled:opacity-40"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Reset Sensor
                </button>
              </div>
              {cycle.careCycleStatus === 'care-timer' && (
                <div className="mt-3 space-y-2">
                  <div className="text-[10px] text-navy-400 font-medium text-center">Adjust Remaining Time</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => cycle.adjustCareTimer(-300)} disabled={cycle.careTimerSec <= 0} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all disabled:opacity-40">
                      <Minus className="w-3 h-3" /> 5 min
                    </button>
                    <button onClick={() => cycle.adjustCareTimer(300)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all">
                      <Plus className="w-3 h-3" /> 5 min
                    </button>
                    <button onClick={() => cycle.adjustCareTimer(-600)} disabled={cycle.careTimerSec <= 0} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all disabled:opacity-40">
                      <Minus className="w-3 h-3" /> 10 min
                    </button>
                    <button onClick={() => cycle.adjustCareTimer(600)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all">
                      <Plus className="w-3 h-3" /> 10 min
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Care Timer Card — shown for patientInitiated and normalCaring (no weight sensor) */}
          {!isSensorInitiated && (
            <div className="card-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-medical-600" />
                <h3 className="text-sm font-bold text-navy-900">Care Timer</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Status</span>
                  <span className={`text-xs font-semibold ${cycle.careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>
                    {cycle.careCycleStatus === 'idle' ? 'Waiting' : cycle.careCycleStatus === 'care-timer' ? 'Running' : cycle.careCycleStatus === 'completed' ? 'Completed' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-navy-400">Care Timer</span>
                  <span className={`text-xs font-semibold ${cycle.careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>
                    {cycle.careTimerLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-navy-400">Completion Timeout</span>
                  <span className="text-xs font-semibold text-navy-700">{cycle.careTimeoutMin} min</span>
                </div>
              </div>
              {cycle.careCycleStatus === 'care-timer' && (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => cycle.adjustCareTimer(-300)} disabled={cycle.careTimerSec <= 0} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all disabled:opacity-40">
                      <Minus className="w-3 h-3" /> 5 min
                    </button>
                    <button onClick={() => cycle.adjustCareTimer(300)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all">
                      <Plus className="w-3 h-3" /> 5 min
                    </button>
                    <button onClick={() => cycle.adjustCareTimer(-600)} disabled={cycle.careTimerSec <= 0} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all disabled:opacity-40">
                      <Minus className="w-3 h-3" /> 10 min
                    </button>
                    <button onClick={() => cycle.adjustCareTimer(600)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 text-xs font-semibold transition-all">
                      <Plus className="w-3 h-3" /> 10 min
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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
                      value={cycle.careTimeoutMin}
                      onChange={(e) => cycle.setCareTimeoutMin(Number(e.target.value))}
                      disabled={cycle.state === 'running'}
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
                    <span className="font-semibold text-safe-600">{isSensorInitiated ? 'Weight Sensor' : 'Patient Request'}</span>
                  </div>
                  {isSensorInitiated && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-400">Detection Threshold</span>
                      <span className="font-semibold text-navy-700">{cycle.weightThreshold.toFixed(1)} kg</span>
                    </div>
                  )}
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
                  {isSensorInitiated
                    ? 'Ms.care automatically detects usage via simulated weight sensor and completes the routine care cycle based on sensor and timing conditions.'
                    : 'Ms.care automatically completes the routine care cycle based on the configured timer. No caregiver confirmation required.'}
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
                  <span className="text-sm font-bold text-navy-900">{cycle.battery}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-navy-400 font-medium mb-1">Robot</div>
                <div className="text-sm font-bold text-navy-900">{cycle.robotDocked ? 'Docked' : 'Active'}</div>
              </div>
            </div>
          </div>

          {/* Status panel */}
          <div>
            <h3 className="text-sm font-semibold text-navy-700 mb-3 px-1">Live System Status</h3>
            <StatusPanel status={cycle.step.status} />
          </div>

          {/* Controller */}
          <CareCycleController
            state={cycle.state}
            currentStep={cycle.currentStep}
            totalSteps={cycle.totalSteps}
            progress={cycle.progress}
            onStart={cycle.start}
            onPause={cycle.pause}
            onResume={cycle.resume}
            onReset={cycle.reset}
            onEmergencyStop={cycle.emergencyStop}
          />

          {/* Step navigation */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Step Navigation</h3>
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => cycle.goToStep(Math.max(0, cycle.currentStep - 1))} disabled={cycle.currentStep === 0}
                className="p-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-navy-700">{cycle.currentStep + 1} / {cycle.totalSteps}</span>
              <button onClick={() => cycle.goToStep(Math.min(cycle.totalSteps - 1, cycle.currentStep + 1))} disabled={cycle.currentStep === cycle.totalSteps - 1}
                className="p-2 rounded-lg bg-gray-100 text-navy-600 hover:bg-gray-200 disabled:opacity-40 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 max-h-56 overflow-y-auto space-y-1">
              {ALL_STEPS.map((s, i) => (
                <button key={s.id} onClick={() => cycle.goToStep(i)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${i === cycle.currentStep ? 'bg-medical-50 text-medical-700 font-semibold' : i < cycle.currentStep ? 'text-navy-400 hover:bg-gray-50' : 'text-navy-300 hover:bg-gray-50'}`}>
                  <span className="font-mono mr-1.5">{String(s.id).padStart(2, '0')}</span>
                  {s.shortName}
                  {i >= cycle.careStepsCount && <span className="ml-1.5 text-[9px] text-navy-300 font-normal">post-cycle</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency stop overlay */}
      {isEmergency && (
        <div className="fixed inset-0 z-50 bg-danger-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-danger-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-danger-700">SYSTEM PAUSED</h2>
            <p className="text-navy-500 mt-2 text-sm">Emergency stop activated. All animations halted. The system is in a safe state.</p>
            <p className="text-xs text-navy-400 mt-1">Reason: Manual emergency stop by operator</p>
            <button onClick={cycle.reset} className="btn-danger mt-6 w-full">
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
              {['Cover positioned', 'Care completed', 'Cover sealed', 'Waste transferred', 'Bed restored', 'Robot returned to dock'].map((label) => (
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
              <button onClick={cycle.reset} className="btn-primary flex-1"><Play className="w-4 h-4" /> Done</button>
              <button onClick={() => onNavigate('history')} className="btn-secondary flex-1">View Care History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
