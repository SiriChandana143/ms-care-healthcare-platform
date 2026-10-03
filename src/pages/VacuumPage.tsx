import { useState } from 'react';
import {
  Activity,
  BatteryCharging,
  Play,
  Pause,
  Home,
  Zap,
  CheckCircle2,
  Navigation,
  Clock,
  Gauge,
  Map as MapIcon,
  Calendar,
  Settings as SettingsIcon,
  Bell,
  Wind,
  Cpu,
  Target,
  AlertTriangle,
  Brush,
  Trash2,
  Droplets,
  FlaskConical,
  Waves,
} from 'lucide-react';
import {
  VacuumProvider,
  useVacuum,
  MODE_LABELS,
  MODE_DESCRIPTIONS,
  type CleanMode,
  type MaintenanceKey,
} from '../context/VacuumContext';
import { VacuumMap } from '../components/vacuum/VacuumMap';
import { VacuumHistory } from '../components/vacuum/VacuumHistory';
import { VacuumSchedule } from '../components/vacuum/VacuumSchedule';
import { VacuumSettings } from '../components/vacuum/VacuumSettings';
import { VacuumNotifications } from '../components/vacuum/VacuumNotifications';
import { SpotCleanModal } from '../components/vacuum/SpotCleanModal';

type Tab = 'dashboard' | 'map' | 'history' | 'schedule' | 'settings' | 'notifications';

const TABS: { key: Tab; label: string; icon: typeof Gauge }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Gauge },
  { key: 'map', label: 'Map', icon: MapIcon },
  { key: 'history', label: 'History', icon: Clock },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
  { key: 'notifications', label: 'Alerts', icon: Bell },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

const MAINT_ICONS: Record<MaintenanceKey, typeof Brush> = {
  mainBrush: Brush,
  dustBin: Trash2,
  wasteWaterTank: Waves,
  detergent: FlaskConical,
  cleanWaterTank: Droplets,
};

const MAINT_LABELS_SHORT: Record<MaintenanceKey, string> = {
  mainBrush: 'Brush',
  dustBin: 'Dust Bin',
  wasteWaterTank: 'Waste Water',
  detergent: 'Detergent',
  cleanWaterTank: 'Clean Water',
};

function VacuumContent({ onSwitchMode }: { onSwitchMode: () => void }) {
  const vac = useVacuum();
  const { unreadCount } = vac;
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showSpotClean, setShowSpotClean] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-soft">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold font-display text-navy-900 leading-none">Ms.care</div>
                <div className="text-[10px] text-medical-500 font-medium tracking-wide leading-none mt-0.5">Vacuum Cleaner</div>
              </div>
            </div>

            {/* Desktop tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-navy-900 text-white shadow-soft'
                      : 'text-navy-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.key === 'notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Switch mode */}
            <button
              onClick={onSwitchMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-gray-50 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Switch Mode</span>
            </button>
          </div>

          {/* Mobile tabs */}
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 bg-gray-50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.key === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <VacuumDashboard onSpotClean={() => setShowSpotClean(true)} />}
        {activeTab === 'map' && <VacuumMap onSpotClean={() => setShowSpotClean(true)} />}
        {activeTab === 'history' && <VacuumHistory />}
        {activeTab === 'schedule' && <VacuumSchedule />}
        {activeTab === 'notifications' && <VacuumNotifications />}
        {activeTab === 'settings' && <VacuumSettings />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold font-display text-navy-900">Ms.care</div>
                <div className="text-[10px] text-navy-400">One robotic platform. Two capabilities.</div>
              </div>
            </div>
            <button
              onClick={onSwitchMode}
              className="text-xs text-navy-500 font-medium hover:text-medical-600 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Switch to Caring
            </button>
          </div>
          <p className="text-xs text-navy-300 mt-4">
            © 2026 Ms.care — College Innovation & Expo Prototype. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Spot Clean Modal */}
      {showSpotClean && <SpotCleanModal onClose={() => setShowSpotClean(false)} />}
    </div>
  );
}

function MaintenanceHealthBar() {
  const vac = useVacuum();
  const { state, resolveMaintenance } = vac;
  const keys: MaintenanceKey[] = ['mainBrush', 'dustBin', 'wasteWaterTank', 'detergent', 'cleanWaterTank'];

  const getLevelColor = (level: string) => {
    if (level === 'critical') return { text: 'text-danger-600', bg: 'bg-danger-500', iconBg: 'bg-danger-50' };
    if (level === 'attention') return { text: 'text-warn-600', bg: 'bg-warn-500', iconBg: 'bg-warn-50' };
    return { text: 'text-safe-600', bg: 'bg-safe-500', iconBg: 'bg-safe-50' };
  };

  return (
    <div className="card-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-navy-700">Device Health</h3>
        <span className="text-xs text-navy-400">Live monitoring</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {keys.map((key) => {
          const comp = state.maintenance[key];
          const Icon = MAINT_ICONS[key];
          const colors = getLevelColor(comp.level);
          const displayValue = key === 'mainBrush' ? comp.label : `${Math.round(comp.value)}%`;

          return (
            <button
              key={key}
              onClick={() => {
                if (comp.level !== 'healthy') resolveMaintenance(key);
              }}
              className={`text-left p-3 rounded-xl border transition-all ${
                comp.level === 'healthy'
                  ? 'border-gray-100 hover:bg-gray-50/50'
                  : 'border-warn-200 hover:shadow-soft cursor-pointer'
              } ${comp.level === 'critical' ? 'border-danger-200' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                  <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                </div>
                <span className="text-xs text-navy-400 font-medium">{MAINT_LABELS_SHORT[key]}</span>
              </div>
              <div className={`text-sm font-bold ${colors.text}`}>{displayValue}</div>
              <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden mt-2">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${colors.bg}`}
                  style={{ width: `${comp.value}%` }}
                />
              </div>
              {comp.level !== 'healthy' && (
                <div className={`text-[10px] mt-1.5 font-medium ${colors.text}`}>
                  {comp.level === 'critical' ? 'Action required' : 'Attention needed'}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VacuumDashboard({ onSpotClean }: { onSpotClean: () => void }) {
  const vac = useVacuum();
  const {
    state, isRunning, isPaused, isCharging, isReturning, isActive,
    stateLabel, stateColor,
    startCleaning, pauseCleaning, resumeCleaning, stopCleaning, returnToDock,
    setMode, setSuction, formatDuration, totalArea,
    canStartCleaning, cleaningBlockedReason,
  } = vac;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero device section */}
      <div className="card-lg p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-medical-50/60 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-5 gap-8 items-center">
          {/* Robot image */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
                isCharging ? 'border-safe-400/30 animate-pulse-soft' :
                isRunning ? 'border-medical-400/25 animate-pulse-soft' :
                isReturning ? 'border-warn-400/25 animate-pulse-soft' :
                'border-gray-100'
              }`} />
              {isRunning && (
                <div className="absolute inset-0 rounded-full border-2 border-medical-400/30 animate-ping" />
              )}

              <img
                src="/assets/image.png"
                alt="MS.care robot vacuum"
                className="relative z-10 w-full h-full object-contain transition-transform duration-700"
                style={{ transform: isRunning ? 'scale(1.03)' : 'scale(1)' }}
              />

              {isCharging && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-safe-50 border border-safe-200">
                  <BatteryCharging className="w-3.5 h-3.5 text-safe-600" />
                  <span className="text-xs font-semibold text-safe-700">Charging</span>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <span className={`status-dot ${
                isRunning ? 'status-active' :
                isReturning ? 'status-warn' :
                'status-ready'
              } ${stateColor} text-sm font-semibold`}>
                {stateLabel}
              </span>
            </div>
          </div>

          {/* Stats + controls */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-900">MS.care Vacuum</h1>
              <p className="text-navy-500 text-sm mt-1">Autonomous cleaning with smart navigation</p>
            </div>

            {/* Key stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <BatteryCharging className={`w-3.5 h-3.5 ${state.battery > 20 ? 'text-safe-600' : 'text-danger-600'}`} />
                  <span className="text-[11px] text-navy-400 font-medium">Battery</span>
                </div>
                <div className={`text-lg font-bold font-display ${state.battery > 20 ? 'text-safe-600' : 'text-danger-600'}`}>
                  {Math.round(state.battery)}%
                </div>
                <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden mt-2">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                      state.battery > 20 ? 'bg-safe-500' : 'bg-danger-500'
                    }`}
                    style={{ width: `${state.battery}%` }}
                  />
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Navigation className="w-3.5 h-3.5 text-medical-500" />
                  <span className="text-[11px] text-navy-400 font-medium">Area</span>
                </div>
                <div className="text-lg font-bold font-display text-navy-900">
                  {Math.round(state.areaCleaned)}<span className="text-sm text-navy-400"> m²</span>
                </div>
                <div className="text-[10px] text-navy-300 mt-2">of {totalArea} m²</div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-medical-500" />
                  <span className="text-[11px] text-navy-400 font-medium">Time</span>
                </div>
                <div className="text-lg font-bold font-display text-navy-900">
                  {formatDuration(state.duration)}
                </div>
                <div className="text-[10px] text-navy-300 mt-2">elapsed</div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Home className="w-3.5 h-3.5 text-navy-400" />
                  <span className="text-[11px] text-navy-400 font-medium">Dock</span>
                </div>
                <div className={`text-sm font-bold font-display ${state.docked ? 'text-safe-600' : 'text-navy-500'}`}>
                  {state.docked ? 'Connected' : 'Away'}
                </div>
                <div className="text-[10px] text-navy-300 mt-2">
                  {isCharging ? 'Charging' : state.docked ? 'Ready' : 'In use'}
                </div>
              </div>
            </div>

            {/* Cleaning blocked warning */}
            {!canStartCleaning && !isActive && !isCharging && !isReturning && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger-50 border border-danger-100">
                <AlertTriangle className="w-4 h-4 text-danger-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-danger-700">Cleaning Blocked</div>
                  <div className="text-xs text-danger-600 mt-0.5">{cleaningBlockedReason}</div>
                </div>
              </div>
            )}

            {/* Primary controls */}
            <div className="flex flex-wrap gap-3">
              {!isActive && !isCharging && !isReturning && canStartCleaning && (
                <button onClick={startCleaning} className="btn-accent">
                  <Play className="w-4 h-4" />
                  Start Cleaning
                </button>
              )}
              {!isActive && !isCharging && !isReturning && canStartCleaning && (
                <button onClick={onSpotClean} className="btn-primary">
                  <Target className="w-4 h-4" />
                  Spot Clean
                </button>
              )}
              {isRunning && (
                <button onClick={pauseCleaning} className="btn-secondary">
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
              {isPaused && (
                <button onClick={resumeCleaning} className="btn-accent">
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}
              {isActive && (
                <button onClick={stopCleaning} className="btn-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  Stop & Complete
                </button>
              )}
              {!state.docked && !isActive && (
                <button onClick={returnToDock} className="btn-secondary">
                  <Home className="w-4 h-4" />
                  Return to Dock
                </button>
              )}
              {isCharging && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-safe-50 border border-safe-100">
                  <BatteryCharging className="w-4 h-4 text-safe-600" />
                  <span className="text-sm font-medium text-safe-700">Charging — {Math.round(state.battery)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Device Health */}
      <MaintenanceHealthBar />

      {/* Cleaning mode + Suction */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mode selection */}
        <div className="card-lg p-6">
          <h3 className="text-sm font-semibold text-navy-700 mb-4">Cleaning Mode</h3>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(MODE_LABELS) as CleanMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={isActive}
                className={`p-4 rounded-xl border text-left transition-all disabled:opacity-50 ${
                  state.mode === m
                    ? 'border-medical-400 bg-medical-50 shadow-soft'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                }`}
              >
                <div className="text-sm font-semibold text-navy-900">{MODE_LABELS[m]}</div>
                <div className="text-xs text-navy-400 mt-1">{MODE_DESCRIPTIONS[m]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Suction power + dock status */}
        <div className="card-lg p-6">
          <h3 className="text-sm font-semibold text-navy-700 mb-4">Suction Power</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-medical-500" />
                <span className="text-sm text-navy-600">Power Level</span>
              </div>
              <span className="text-sm font-bold text-navy-900">{state.suctionPower}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={state.suctionPower}
              onChange={(e) => setSuction(Number(e.target.value))}
              disabled={isActive}
              className="w-full accent-medical-600 disabled:opacity-50"
            />
            <div className="flex items-center justify-between text-xs text-navy-400">
              <span>Eco</span>
              <span>Standard</span>
              <span>Max</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-navy-400" />
                <span className="text-sm text-navy-600">Charging Dock</span>
              </div>
              <span className={`text-sm font-semibold ${state.docked ? 'text-safe-600' : 'text-navy-500'}`}>
                {state.docked ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-navy-400" />
                <span className="text-sm text-navy-600">Robot Status</span>
              </div>
              <span className={`text-sm font-semibold ${stateColor}`}>{stateLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent notifications */}
      <div className="card-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-medical-500" />
          <h3 className="text-sm font-semibold text-navy-700">Recent Notifications</h3>
        </div>
        <div className="space-y-3">
          {state.notifications.slice(0, 4).map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 transition-all ${
                n.resolved ? 'bg-gray-50 border-gray-100' :
                n.type === 'success' ? 'bg-safe-50 border-safe-100' :
                n.type === 'warning' ? 'bg-warn-50 border-warn-100' :
                n.type === 'danger' ? 'bg-danger-50 border-danger-100' :
                'bg-medical-50 border-medical-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-navy-900">{n.title}</h4>
                <span className="text-xs text-navy-400 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-navy-500 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VacuumPage({ onSwitchMode }: { onSwitchMode: () => void }) {
  return (
    <VacuumProvider>
      <VacuumContent onSwitchMode={onSwitchMode} />
    </VacuumProvider>
  );
}
