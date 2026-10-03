import { Play, History, AlertOctagon, Cpu, BedDouble, Trash2, ShieldCheck, BatteryCharging, User, Brain, Hand, Radio, Timer } from 'lucide-react';
import type { PageName } from '../types';
import { MSCareRobot } from '../components/simulation/MSCareRobot';
import { WasteUnit } from '../components/simulation/WasteUnit';
import { ChargingDock } from '../components/simulation/ChargingDock';
import { StatusPanel } from '../components/simulation/StatusPanel';
import { useSystemState } from '../context/SystemContext';

interface DashboardPageProps {
  onNavigate: (page: PageName) => void;
}

const CARE_MODE_LABELS: Record<string, string> = {
  patientInitiatedBedridden: 'Patient-Initiated Bedridden Care',
  sensorInitiatedBedridden: 'Sensor-Initiated Bedridden Care',
  normalCaring: 'Normal Caring',
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const system = useSystemState();
  const isPatientInitiated = system.careMode === 'patientInitiatedBedridden';
  const isSensorInitiated = system.careMode === 'sensorInitiatedBedridden';

  const robotStatusLabel = system.state === 'running' ? 'Active' : system.robotDocked ? 'Docked' : 'Active';
  const batteryStatusColor = system.battery > 20 ? 'text-safe-600' : 'text-danger-600';
  const centerSectionOpen = ['center-open', 'slider-enter', 'slider-locked', 'cover-placed', 'care-mode', 'slider-retrieve', 'sealing', 'slider-exit'].includes(system.step.action);
  const sliderStatus = system.step.action === 'idle' || system.step.action === 'scanning' || system.step.action === 'return-to-dock' || system.step.action === 'charging' || system.step.action === 'fully-charged' ? 'Retracted' : 'Active';

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display text-navy-900">Caregiver Dashboard</h1>
        <p className="text-navy-500 mt-1 text-sm">Monitor and control the MS.care system</p>
        <div className="flex items-center gap-2 mt-3">
          {isPatientInitiated && <User className="w-4 h-4 text-safe-600" />}
          {isSensorInitiated && <Brain className="w-4 h-4 text-medical-600" />}
          <span className="text-xs font-semibold text-navy-700">Current Care Mode:</span>
          <span className={`text-xs font-bold ${isPatientInitiated ? 'text-safe-600' : isSensorInitiated ? 'text-medical-600' : 'text-navy-700'}`}>
            {CARE_MODE_LABELS[system.careMode]}
          </span>
        </div>
      </div>

      {/* Main device card — Dreamehome-style */}
      <div className="card-lg p-6 mb-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Device visual */}
          <div className="overflow-hidden rounded-2xl" style={{ height: '440px' }}>
            <img
              src="/assets/image copy.png"
              alt="MS.care robotic care unit"
              className="block h-full w-full object-cover object-center"
            />
          </div>

          {/* Device info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold font-display text-navy-900">MS.care</h2>
              <span className="text-sm text-navy-400">Care Robot</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="status-dot status-ready text-safe-600 text-sm font-medium">Ready</span>
              <span className="text-sm text-navy-400">Battery: {system.battery}%</span>
              <BatteryCharging className="w-4 h-4 text-safe-500" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-navy-400">Robot</span>
                <span className="text-sm font-semibold text-navy-700">{robotStatusLabel}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-navy-400">Bed</span>
                <span className="text-sm font-semibold text-navy-700">{centerSectionOpen ? 'Center Open' : 'Stable'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-navy-400">Slider</span>
                <span className="text-sm font-semibold text-navy-700">{sliderStatus}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-navy-400">Waste Unit</span>
                <span className="text-sm font-semibold text-navy-700">{system.fillLevel}% Full</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-navy-400">Charging Dock</span>
                <span className="text-sm font-semibold text-safe-600">{system.robotDocked ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => onNavigate('simulation')} className="btn-accent">
                <Play className="w-4 h-4" />
                Start Care Cycle
              </button>
              <button onClick={() => onNavigate('history')} className="btn-secondary">
                <History className="w-4 h-4" />
                History
              </button>
              <button onClick={() => onNavigate('notifications')} className="btn-secondary">
                Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status cards */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy-700 mb-3">Patient Care Status</h3>
        <StatusPanel status={system.systemStatus} />
      </div>

      {/* Care-mode-specific panel */}
      {isPatientInitiated && (
        <div className="card-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Hand className="w-5 h-5 text-safe-600" />
            <h3 className="text-base font-bold text-navy-900">Patient-Initiated Care</h3>
          </div>
          <p className="text-sm text-navy-500 leading-relaxed mb-4">
            The patient has a bedside request control. The care module is NOT positioned underneath the patient
            until the patient independently requests care. This supports privacy, comfort, and independence.
          </p>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-safe-50 border border-safe-100">
            <div className="w-10 h-10 rounded-xl bg-safe-100 flex items-center justify-center">
              <Hand className="w-5 h-5 text-safe-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-navy-900">Bedside Request Control</div>
              <div className="text-xs text-navy-500 mt-0.5">The patient presses this to request restroom assistance</div>
            </div>
            <button onClick={() => onNavigate('simulation')} className="btn-accent">
              <Hand className="w-4 h-4" />
              Simulate Patient Request
            </button>
          </div>
          {/* Care Timer — no weight sensor in this mode */}
          <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-4 h-4 text-navy-500" />
              <h4 className="text-xs font-bold text-navy-700">Care Timer</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div><div className="text-[10px] text-navy-400">Status</div><div className={`text-xs font-semibold ${system.careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>{system.careCycleStatus === 'idle' ? 'Waiting' : system.careCycleStatus === 'care-timer' ? 'Running' : system.careCycleStatus === 'completed' ? 'Completed' : 'Active'}</div></div>
              <div><div className="text-[10px] text-navy-400">Care Timer</div><div className={`text-xs font-semibold ${system.careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>{system.careTimerLabel}</div></div>
              <div><div className="text-[10px] text-navy-400">Timeout</div><div className="text-xs font-semibold text-navy-700">{system.careTimeoutMin} min</div></div>
            </div>
          </div>
        </div>
      )}

      {isSensorInitiated && (
        <div className="card-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-medical-600" />
            <h3 className="text-base font-bold text-navy-900">Sensor-Initiated Care — Monitoring Mode</h3>
          </div>
          <p className="text-sm text-navy-500 leading-relaxed mb-4">
            Ms.care is designed to monitor the patient-care system continuously. The conceptual weight/load sensor can
            detect usage of the disposable collection module, so the patient does not need to manually request every care cycle.
          </p>
          <div className="p-5 rounded-xl bg-medical-50 border border-medical-100">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-medical-600" />
              <h4 className="text-sm font-bold text-navy-900">Patient Usage Monitor</h4>
              <span className="text-[10px] text-navy-400">Simulated Load Sensor</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-medical-100">
                <span className="text-sm text-navy-500 font-medium">Sensor Status</span>
                <span className={`text-sm font-semibold ${system.usageStatus === 'detected' ? 'text-medical-600' : system.usageStatus === 'monitoring' ? 'text-safe-600' : 'text-navy-500'}`}>
                  {system.usageStatus === 'detected' ? 'Usage Detected' : system.usageStatus === 'monitoring' ? 'Monitoring' : 'Ready'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-medical-100">
                <span className="text-sm text-navy-500 font-medium">Current Weight</span>
                <span className="text-sm font-semibold text-navy-700">{system.currentWeight.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-medical-100">
                <span className="text-sm text-navy-500 font-medium">Weight Change</span>
                <span className="text-sm font-semibold text-navy-700">+{system.weightChange.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-medical-100">
                <span className="text-sm text-navy-500 font-medium">Detection Threshold</span>
                <span className="text-sm font-semibold text-navy-700">{system.weightThreshold.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-medical-100">
                <span className="text-sm text-navy-500 font-medium">Care Timer</span>
                <span className={`text-sm font-semibold ${system.careTimerSec > 0 ? 'text-medical-600' : 'text-navy-500'}`}>{system.careTimerLabel}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-navy-500 font-medium">Weight Stability</span>
                <span className={`text-sm font-semibold ${system.weightStability === 'stable' ? 'text-safe-600' : system.weightStability === 'monitoring' ? 'text-medical-600' : 'text-navy-500'}`}>
                  {system.weightStability === 'stable' ? 'Stable' : system.weightStability === 'monitoring' ? 'Monitoring' : 'Waiting'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('simulation')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center mb-3">
            <Play className="w-5 h-5 text-medical-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Start Care Cycle</h3>
          <p className="text-xs text-navy-500 mt-1">Launch the interactive simulation</p>
        </button>

        <div className="card p-5">
          <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center mb-3">
            <AlertOctagon className="w-5 h-5 text-danger-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Emergency Stop</h3>
          <p className="text-xs text-navy-500 mt-1">Halt all operations immediately</p>
          <button onClick={() => onNavigate('simulation')} className="btn-danger mt-3 w-full text-xs">
            Emergency Stop
          </button>
        </div>

        <button
          onClick={() => onNavigate('history')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
            <History className="w-5 h-5 text-navy-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">View History</h3>
          <p className="text-xs text-navy-500 mt-1">Review past care cycles</p>
        </button>
      </div>

      {/* Device overview */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-medical-500" />
            <h3 className="font-semibold text-navy-900 text-sm">Robot Status</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <img
              src="/assets/image.png"
              alt="MS.care robot"
              className="h-56 w-full object-contain"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Connection</span>
              <span className="text-safe-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Battery</span>
              <span className={`${batteryStatusColor} font-medium`}>{system.battery}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Dock Status</span>
              <span className="text-safe-600 font-medium">{robotStatusLabel}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BedDouble className="w-4 h-4 text-medical-500" />
            <h3 className="font-semibold text-navy-900 text-sm">Bed Status</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <img
              src="/assets/bed_status_image.png"
              alt="MS.care bed with closed center section"
              className="h-56 w-full object-contain"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Center Section</span>
              <span className="text-navy-700 font-medium">{centerSectionOpen ? 'Open' : 'Closed'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Patient</span>
              <span className="text-safe-600 font-medium">Stable</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Tilt</span>
              <span className="text-safe-600 font-medium">None</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BatteryCharging className="w-4 h-4 text-medical-500" />
            <h3 className="font-semibold text-navy-900 text-sm">Charging Dock</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <img
              src="/assets/charging_dock_image.png"
              alt="MS.care charging dock"
              className="h-56 w-full object-contain"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Status</span>
              <span className="text-safe-600 font-medium">{system.robotDocked ? (system.step.action === 'charging' ? 'Charging' : 'Connected') : 'Disconnected'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Connection</span>
              <span className="text-safe-600 font-medium">{system.robotDocked ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-4 h-4 text-medical-500" />
            <h3 className="font-semibold text-navy-900 text-sm">Waste Unit</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <img
              src="/assets/waste_unit_image.png"
              alt="MS.care waste unit"
              className="h-56 w-full object-contain"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Capacity</span>
              <span className="text-navy-700 font-medium">{system.fillLevel}% Full</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Sealed Covers</span>
              <span className="text-navy-700 font-medium">{system.sealedCovers}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Status</span>
              <span className="text-safe-600 font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety note */}
      <div className="mt-6 p-4 rounded-xl bg-medical-50 border border-medical-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-medical-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-medical-700 leading-relaxed">
          All operations are designed to minimize patient disturbance. The emergency stop halts all animations
          and returns the system to a safe state. This is a prototype simulation.
        </p>
      </div>
    </div>
  );
}
