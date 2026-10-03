import { useState } from 'react';
import { useVacuum, ROOM_NAMES, type CleaningIntensity, type CleaningType, type SpotCleanConfig } from '@/context/VacuumContext';
import { Target, X, Check, Zap, Droplets, Wind, AlertTriangle, MapPin } from 'lucide-react';

const ROOM_KEYS = Object.keys(ROOM_NAMES);

const INTENSITY_OPTIONS: { key: CleaningIntensity; label: string; desc: string }[] = [
  { key: 'standard', label: 'Standard', desc: 'Normal suction power' },
  { key: 'deep', label: 'Deep', desc: 'Maximum suction, slower pace' },
];

const TYPE_OPTIONS: { key: CleaningType; label: string; desc: string; icon: typeof Wind }[] = [
  { key: 'vacuum', label: 'Vacuum Only', desc: 'Dry cleaning only', icon: Wind },
  { key: 'vacuum-mop', label: 'Vacuum + Mop', desc: 'Wet and dry cleaning', icon: Droplets },
];

export function SpotCleanModal({ onClose }: { onClose: () => void }) {
  const vac = useVacuum();
  const { startSpotClean, canStartCleaning, cleaningBlockedReason, canStartVacuumMop, vacuumMopBlockedReason } = vac;

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<CleaningIntensity>('standard');
  const [cleaningType, setCleaningType] = useState<CleaningType>('vacuum');
  const [showMapSelect, setShowMapSelect] = useState(false);

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const canProceed =
    selectedRooms.length > 0 &&
    canStartCleaning &&
    (cleaningType === 'vacuum' || canStartVacuumMop);

  const blockedReason =
    !canStartCleaning ? cleaningBlockedReason :
    cleaningType === 'vacuum-mop' && !canStartVacuumMop ? vacuumMopBlockedReason : null;

  const handleStart = () => {
    if (!canProceed) return;
    const config: SpotCleanConfig = {
      rooms: selectedRooms,
      intensity,
      cleaningType,
    };
    startSpotClean(config);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-navy-900/40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl animate-slide-in max-h-[90vh] overflow-y-auto">
        <div className="max-w-lg mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-medical-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-navy-900">Where do you want to Spot Clean?</h2>
                <p className="text-xs text-navy-400">Select rooms and configure cleaning options</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Room selection */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 block">Select Rooms</label>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => toggleRoom(key)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    selectedRooms.includes(key)
                      ? 'border-medical-400 bg-medical-50 shadow-soft'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedRooms.includes(key) ? 'border-medical-500 bg-medical-500' : 'border-gray-300'
                  }`}>
                    {selectedRooms.includes(key) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-medium text-navy-700">{ROOM_NAMES[key]}</span>
                </button>
              ))}
              <button
                onClick={() => setShowMapSelect(!showMapSelect)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all col-span-2 ${
                  showMapSelect
                    ? 'border-navy-400 bg-navy-50 shadow-soft'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  showMapSelect ? 'border-navy-500 bg-navy-500' : 'border-gray-300'
                }`}>
                  {showMapSelect && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <MapPin className="w-4 h-4 text-navy-400" />
                <span className="text-sm font-medium text-navy-700">Select on Map</span>
              </button>
            </div>
          </div>

          {/* Cleaning intensity */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 block">Cleaning Intensity</label>
            <div className="grid grid-cols-2 gap-2">
              {INTENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setIntensity(opt.key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    intensity === opt.key
                      ? 'border-medical-400 bg-medical-50 shadow-soft'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <Zap className={`w-3.5 h-3.5 ${intensity === opt.key ? 'text-medical-600' : 'text-navy-400'}`} />
                    <span className="text-sm font-semibold text-navy-900">{opt.label}</span>
                  </div>
                  <div className="text-xs text-navy-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cleaning type */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 block">Cleaning Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isBlocked = opt.key === 'vacuum-mop' && !canStartVacuumMop;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setCleaningType(opt.key)}
                    disabled={isBlocked}
                    className={`p-3 rounded-xl border text-left transition-all disabled:opacity-50 ${
                      cleaningType === opt.key
                        ? 'border-medical-400 bg-medical-50 shadow-soft'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className={`w-3.5 h-3.5 ${cleaningType === opt.key ? 'text-medical-600' : 'text-navy-400'}`} />
                      <span className="text-sm font-semibold text-navy-900">{opt.label}</span>
                    </div>
                    <div className="text-xs text-navy-400">{opt.desc}</div>
                    {isBlocked && (
                      <div className="text-xs text-danger-600 font-medium mt-1">Unavailable</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety warning */}
          {blockedReason && (
            <div className="mb-5 p-3 rounded-xl bg-danger-50 border border-danger-100 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-danger-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-danger-700">Cleaning Blocked</div>
                <div className="text-xs text-danger-600 mt-0.5">{blockedReason}</div>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedRooms.length > 0 && (
            <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Summary</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-400">Selected Area</span>
                <span className="text-xs font-semibold text-navy-900">
                  {selectedRooms.map((r) => ROOM_NAMES[r]).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-400">Mode</span>
                <span className="text-xs font-semibold text-navy-900">Spot Clean</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-400">Intensity</span>
                <span className="text-xs font-semibold text-navy-900">
                  {intensity === 'standard' ? 'Standard' : 'Deep'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-400">Type</span>
                <span className="text-xs font-semibold text-navy-900">
                  {cleaningType === 'vacuum' ? 'Vacuum Only' : 'Vacuum + Mop'}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleStart}
              disabled={!canProceed}
              className="btn-accent flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Target className="w-4 h-4" />
              Start Spot Cleaning
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
