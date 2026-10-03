import { Cpu, BedDouble, Trash2, ShieldCheck, Wifi, Battery, Thermometer, Activity, CheckCircle2, BatteryCharging, Scale } from 'lucide-react';
import { useSystemState } from '../context/SystemContext';

export function StatusPage() {
  const system = useSystemState();
  const isSensorInitiated = system.careMode === 'sensorInitiatedBedridden';

  const centerSectionOpen = ['center-open', 'slider-enter', 'slider-locked', 'cover-placed', 'care-mode', 'slider-retrieve', 'sealing', 'slider-exit'].includes(system.step.action);
  const sliderHome = system.step.action === 'idle' || system.step.action === 'scanning' || system.step.action === 'return-to-dock' || system.step.action === 'charging' || system.step.action === 'fully-charged';
  const craneDeployed = ['crane-deploy', 'crane-transfer', 'waste-stored'].includes(system.step.action);
  const isRunning = system.state === 'running';

  const robotStatus = isRunning ? 'Active' : 'Online';
  const robotStatusType = system.state === 'emergency-stopped' ? 'danger' as const : 'ready' as const;

  const systems = [
    {
      icon: Cpu,
      name: 'MS.care Robot',
      status: robotStatus,
      statusType: robotStatusType,
      details: [
        { label: 'Connection', value: 'Stable', ok: true },
        { label: 'Battery', value: `${system.battery}%`, ok: system.battery > 20 },
        { label: 'Dock Status', value: system.robotDocked ? 'Docked' : 'Away', ok: true },
        { label: 'Crane Status', value: craneDeployed ? 'Deployed' : 'Retracted', ok: true },
      ],
    },
    {
      icon: BedDouble,
      name: 'Hospital Bed',
      status: centerSectionOpen ? 'Center Open' : 'Stable',
      statusType: centerSectionOpen ? 'active' as const : 'ready' as const,
      details: [
        { label: 'Center Section', value: centerSectionOpen ? 'Open' : 'Closed', ok: true },
        { label: 'Side Sections', value: 'Fixed', ok: true },
        { label: 'Patient Position', value: 'Maintained', ok: true },
        { label: 'Tilt', value: 'None', ok: true },
      ],
    },
    {
      icon: ShieldCheck,
      name: 'Disposable Cover System',
      status: sliderHome ? 'Available' : 'Active',
      statusType: sliderHome ? 'ready' as const : 'active' as const,
      details: [
        { label: 'Cover Stock', value: '12 remaining', ok: true },
        { label: 'Slider', value: sliderHome ? 'Home position' : 'In motion', ok: true },
        { label: 'Sealing Mechanism', value: system.step.action === 'sealing' ? 'Sealing' : 'Ready', ok: true },
        { label: 'Last Cover Used', value: `${system.lastDisposalDate}, ${system.lastDisposalTime}`, ok: true },
      ],
    },
    {
      icon: BatteryCharging,
      name: 'Charging Dock',
      status: system.robotDocked ? (system.step.action === 'charging' ? 'Charging' : 'Connected') : 'Disconnected',
      statusType: 'ready' as const,
      details: [
        { label: 'Dock Connection', value: system.robotDocked ? 'Active' : 'Inactive', ok: system.robotDocked },
        { label: 'Charging Status', value: system.step.action === 'charging' ? 'Charging' : system.step.action === 'fully-charged' ? 'Complete' : system.robotDocked ? 'Standby' : 'N/A', ok: true },
        { label: 'Power Flow', value: 'Normal', ok: true },
        { label: 'Last Dock', value: `${system.lastDisposalDate}, ${system.lastDisposalTime}`, ok: true },
      ],
    },
    {
      icon: Trash2,
      name: 'Waste Storage Unit',
      status: `${system.fillLevel}% Full`,
      statusType: system.fillLevel >= 90 ? 'danger' as const : system.fillLevel >= 70 ? 'warn' as const : 'ready' as const,
      details: [
        { label: 'Sealed Covers', value: `${system.sealedCovers} stored`, ok: true },
        { label: 'Remaining Capacity', value: `${system.remainingCapacity}%`, ok: true },
        { label: 'Seal Integrity', value: 'Verified', ok: true },
        { label: 'Last Disposal', value: `${system.lastDisposalDate}, ${system.lastDisposalTime}`, ok: true },
      ],
    },
    ...(isSensorInitiated ? [{
      icon: Scale,
      name: 'Patient Usage Sensor',
      status: system.usageStatus === 'detected' ? 'Usage Detected' : system.usageStatus === 'monitoring' ? 'Monitoring' : 'Ready',
      statusType: system.usageStatus === 'detected' ? 'active' as const : 'ready' as const,
      details: [
        { label: 'Sensor Type', value: 'Simulated Load Sensor', ok: true },
        { label: 'Status', value: system.usageStatus === 'detected' ? 'Usage Detected' : system.usageStatus === 'monitoring' ? 'Monitoring' : 'Waiting', ok: true },
        { label: 'Current Weight', value: `${system.currentWeight.toFixed(1)} kg`, ok: true },
        { label: 'Weight Change', value: `+${system.weightChange.toFixed(1)} kg`, ok: system.weightChange >= system.weightThreshold },
        { label: 'Detection Threshold', value: `${system.weightThreshold.toFixed(1)} kg`, ok: true },
        { label: 'Care Timer', value: system.careTimerLabel, ok: system.careTimerSec > 0 },
        { label: 'Weight Stability', value: system.weightStability === 'stable' ? 'Stable' : system.weightStability === 'monitoring' ? 'Monitoring' : 'Waiting', ok: true },
        { label: 'Care Cycle Status', value: system.careCycleStatus === 'idle' ? 'Idle' : system.careCycleStatus === 'completed' ? 'Completed' : 'Active', ok: true },
      ],
    }] : []),
  ];

  const systemMetrics = [
    { icon: Wifi, label: 'Network', value: 'Connected', color: 'text-safe-600' },
    { icon: Battery, label: 'Robot Battery', value: `${system.battery}%`, color: system.battery > 20 ? 'text-safe-600' : 'text-danger-600' },
    { icon: Thermometer, label: 'Operating Temp', value: '22°C', color: 'text-navy-600' },
    { icon: Activity, label: 'Uptime', value: '14h 32m', color: 'text-navy-600' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display text-navy-900">System Status</h1>
        <p className="text-navy-500 mt-1 text-sm">Real-time overview of all MS.care subsystems</p>
      </div>

      {/* Overall status banner */}
      <div className="card-lg p-5 mb-6 flex items-center justify-between bg-gradient-to-r from-safe-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-safe-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-safe-600" />
          </div>
          <div>
            <h2 className="font-bold text-navy-900">All Systems Operational</h2>
            <p className="text-xs text-navy-400">Last checked: {system.lastDisposalDate}, {system.lastDisposalTime}</p>
          </div>
        </div>
        <span className="status-dot status-ready text-safe-600 text-sm font-medium">Healthy</span>
      </div>

      {/* System metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {systemMetrics.map((metric) => (
          <div key={metric.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-navy-400" />
              <span className="text-xs text-navy-400 font-medium">{metric.label}</span>
            </div>
            <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Detailed system cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {systems.map((systemCard) => (
          <div key={systemCard.name} className="card-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-medical-50 flex items-center justify-center">
                  <systemCard.icon className="w-5 h-5 text-medical-600" />
                </div>
                <h3 className="font-bold text-navy-900 text-sm">{systemCard.name}</h3>
              </div>
              <span className={`status-dot status-${systemCard.statusType} text-xs font-medium`}>
                {systemCard.status}
              </span>
            </div>

            <div className="space-y-2">
              {systemCard.details.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-navy-400">{detail.label}</span>
                  <div className="flex items-center gap-1.5">
                    {detail.ok && <div className="w-1.5 h-1.5 rounded-full bg-safe-500" />}
                    <span className="text-xs font-semibold text-navy-700">{detail.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-xs text-navy-400 leading-relaxed text-center">
          This is a prototype simulation. In a production environment, system status would be monitored in real time
          with actual sensor data from the MS.care hardware.
        </p>
      </div>
    </div>
  );
}
