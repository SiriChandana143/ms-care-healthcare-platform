import { useState } from 'react';
import { useVacuum, type MaintenanceKey } from '@/context/VacuumContext';
import {
  Activity,
  Droplets,
  Wind,
  Gauge,
  Power,
  RotateCcw,
  Wifi,
  Cpu,
  BellOff,
  BatteryCharging,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export function VacuumSettings() {
  const vac = useVacuum();
  const { state, updateSettings, restartDevice, resetDevice, resolveMaintenance } = vac;
  const s = state.settings;

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dndEnabled, setDndEnabled] = useState(true);
  const [carpetBoost, setCarpetBoost] = useState(s.carpetBoost);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-navy-900">Device Settings</h1>
        <p className="text-navy-500 text-sm mt-1">Configure your MS.care vacuum robot</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* DEVICE */}
        <section>
          <h2 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 px-1">Device</h2>
          <div className="card-lg divide-y divide-gray-50">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-medical-50 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4.5 h-4.5 text-medical-600" />
                </div>
                <div>
                  <div className="text-xs text-navy-400">Device Name</div>
                  <div className="text-sm font-semibold text-navy-900">{s.deviceName}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4.5 h-4.5 text-navy-500" />
                </div>
                <div>
                  <div className="text-xs text-navy-400">Serial Number</div>
                  <div className="text-sm font-semibold text-navy-900">{s.serialNumber}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-4.5 h-4.5 text-navy-500" />
                </div>
                <div>
                  <div className="text-xs text-navy-400">Wi-Fi Connection</div>
                  <div className={`text-sm font-semibold ${s.wifiConnected ? 'text-safe-600' : 'text-danger-600'}`}>
                    {s.wifiConnected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ wifiConnected: !s.wifiConnected })}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  s.wifiConnected ? 'bg-safe-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-all ${
                  s.wifiConnected ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4.5 h-4.5 text-navy-500" />
                </div>
                <div>
                  <div className="text-xs text-navy-400">Firmware</div>
                  <div className="text-sm font-semibold text-navy-900">v{s.firmware}</div>
                </div>
              </div>
              <span className="text-xs text-safe-600 font-medium">Up to date</span>
            </div>
          </div>
        </section>

        {/* MAINTENANCE */}
        <section>
          <h2 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 px-1">Maintenance</h2>
          <div className="card-lg divide-y divide-gray-50">
            {([
              ['mainBrush', 'Main Brush', Wind],
              ['dustBin', 'Dust Bin', Droplets],
              ['wasteWaterTank', 'Waste Water Tank', Droplets],
              ['detergent', 'Detergent', Zap],
              ['cleanWaterTank', 'Clean Water Tank', Droplets],
            ] as [MaintenanceKey, string, typeof Wind][]).map(([key, label, Icon]) => {
              const component = state.maintenance[key];
              const isHealthy = component.level === 'healthy';
              const isCritical = component.level === 'critical';
              const statusText = key === 'mainBrush' ? component.label : `${Math.round(component.value)}%`;
              const color = isCritical ? 'text-danger-600' : isHealthy ? 'text-safe-600' : 'text-warn-600';
              return (
                <div key={key} className="flex items-center justify-between p-5 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCritical ? 'bg-danger-50' : isHealthy ? 'bg-safe-50' : 'bg-warn-50'}`}>
                      <Icon className={`w-4.5 h-4.5 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy-900">{label}</div>
                      <div className="text-xs text-navy-400">Simulated device health status</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium ${color}`}>{statusText}</span>
                    {!isHealthy && (
                      <button onClick={() => resolveMaintenance(key)} className="text-xs font-semibold text-medical-600 hover:text-medical-700">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warn-50 flex items-center justify-center flex-shrink-0">
                  <Wind className="w-4.5 h-4.5 text-warn-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-900">HEPA Filter</div>
                  <div className="text-xs text-navy-400">{s.hepaFilterDays} days remaining</div>
                </div>
              </div>
              <span className="text-xs font-medium text-warn-600">Replace soon</span>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section>
          <h2 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 px-1">Preferences</h2>
          <div className="card-lg divide-y divide-gray-50">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                  <BellOff className="w-4.5 h-4.5 text-navy-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-900">Do Not Disturb</div>
                  <div className="text-xs text-navy-400">{s.doNotDisturbStart} — {s.doNotDisturbEnd}</div>
                </div>
              </div>
              <button
                onClick={() => setDndEnabled(!dndEnabled)}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  dndEnabled ? 'bg-medical-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-all ${
                  dndEnabled ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-medical-50 flex items-center justify-center flex-shrink-0">
                  <BatteryCharging className="w-4.5 h-4.5 text-medical-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy-900">Auto-Charge Threshold</div>
                  <div className="text-xs text-navy-400">Robot returns to dock at this battery level</div>
                </div>
                <span className="text-sm font-bold text-navy-900">{s.autoChargeThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={s.autoChargeThreshold}
                onChange={(e) => updateSettings({ autoChargeThreshold: Number(e.target.value) })}
                className="w-full accent-medical-600"
              />
              <div className="flex items-center justify-between text-xs text-navy-400 mt-1">
                <span>10%</span>
                <span>30%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-medical-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4.5 h-4.5 text-medical-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-900">Carpet Boost</div>
                  <div className="text-xs text-navy-400">Increase suction on carpets automatically</div>
                </div>
              </div>
              <button
                onClick={() => {
                  const newVal = !carpetBoost;
                  setCarpetBoost(newVal);
                  updateSettings({ carpetBoost: newVal });
                }}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  carpetBoost ? 'bg-medical-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-all ${
                  carpetBoost ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* SYSTEM */}
        <section>
          <h2 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 px-1">System</h2>
          <div className="card-lg divide-y divide-gray-50">
            <button
              onClick={restartDevice}
              className="flex items-center justify-between p-5 w-full text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4.5 h-4.5 text-navy-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-900">Restart Device</div>
                  <div className="text-xs text-navy-400">Soft restart the vacuum system</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-between p-5 w-full text-left hover:bg-danger-50/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center justify-center flex-shrink-0">
                  <Power className="w-4.5 h-4.5 text-danger-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-danger-600">Reset Device</div>
                  <div className="text-xs text-navy-400">Erase all data and restore defaults</div>
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <>
          <div className="fixed inset-0 z-40 bg-navy-900/30" onClick={() => setShowResetConfirm(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl animate-slide-in">
            <div className="max-w-md mx-auto p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-danger-600" />
                </div>
                <h2 className="text-lg font-bold font-display text-navy-900">Reset Device?</h2>
              </div>
              <p className="text-sm text-navy-500 leading-relaxed mb-6">
                This will erase all cleaning history, schedules, and settings, restoring the device to factory defaults.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetDevice();
                    setShowResetConfirm(false);
                  }}
                  className="btn-danger flex-1"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
