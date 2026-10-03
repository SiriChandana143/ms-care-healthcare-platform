import { useVacuum, MODE_LABELS, MODE_DESCRIPTIONS, ROOM_NAMES, type CleanMode } from '@/context/VacuumContext';
import {
  Home,
  Navigation,
  Clock,
  Battery,
  MapPin,
  Play,
  Pause,
  CheckCircle2,
  Wind,
  Target,
  Frame,
  Moon,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

const MODE_ICONS: Record<CleanMode, typeof Wind> = {
  auto: Wind,
  spot: Target,
  edge: Frame,
  quiet: Moon,
};

// Room definitions for the floor map
const ROOMS = [
  { id: 'living', name: 'Living Room', x: 4, y: 4, w: 52, h: 40, isDock: false },
  { id: 'kitchen', name: 'Kitchen', x: 60, y: 4, w: 36, h: 28, isDock: false },
  { id: 'hallway', name: 'Hallway', x: 60, y: 36, w: 36, h: 8, isDock: false },
  { id: 'bedroom', name: 'Bedroom', x: 4, y: 48, w: 38, h: 48, isDock: false },
  { id: 'bathroom', name: 'Bathroom', x: 46, y: 48, w: 22, h: 48, isDock: false },
  { id: 'dock', name: 'Dock', x: 72, y: 48, w: 24, h: 48, isDock: true },
];

// Waypoints the robot follows during cleaning (percentages of map area)
const CLEAN_PATH = [
  { x: 30, y: 24 },
  { x: 50, y: 20 },
  { x: 75, y: 16 },
  { x: 78, y: 40 },
  { x: 65, y: 40 },
  { x: 22, y: 70 },
  { x: 35, y: 85 },
  { x: 56, y: 75 },
  { x: 82, y: 80 },
  { x: 84, y: 65 },
];

// Spot clean waypoints per room
const SPOT_WAYPOINTS: Record<string, { x: number; y: number }[]> = {
  living: [{ x: 30, y: 24 }, { x: 50, y: 20 }, { x: 40, y: 30 }, { x: 25, y: 35 }],
  bedroom: [{ x: 22, y: 70 }, { x: 35, y: 85 }, { x: 25, y: 60 }, { x: 30, y: 90 }],
  kitchen: [{ x: 75, y: 16 }, { x: 78, y: 24 }, { x: 68, y: 20 }, { x: 82, y: 25 }],
  bathroom: [{ x: 56, y: 75 }, { x: 62, y: 85 }, { x: 52, y: 80 }, { x: 60, y: 90 }],
  hallway: [{ x: 70, y: 40 }, { x: 80, y: 40 }, { x: 65, y: 40 }, { x: 85, y: 40 }],
};

export function VacuumMap({ onSpotClean }: { onSpotClean?: () => void }) {
  const vac = useVacuum();
  const {
    state, isRunning, isPaused, isCharging, isReturning, isActive,
    stateLabel, stateColor,
    startCleaning, pauseCleaning, resumeCleaning, stopCleaning, returnToDock,
    setMode, formatDuration, totalArea,
    canStartCleaning, cleaningBlockedReason,
  } = vac;

  const remainingArea = Math.max(0, totalArea - Math.round(state.areaCleaned));
  const coverage = Math.min(100, Math.round((state.areaCleaned / totalArea) * 100));
  const estimatedRemainingSec = isRunning ? Math.max(0, Math.ceil(remainingArea / 0.5)) : 0;
  const estDisplay = isRunning
    ? `${Math.floor(estimatedRemainingSec / 60)}:${String(estimatedRemainingSec % 60).padStart(2, '0')}`
    : '--:--';

  // Determine which room the robot is currently in
  const robotPos = state.robotPosition ?? { x: 50, y: 50 };
  const currentRoom = ROOMS.find(
    (r) => !r.isDock && robotPos.x >= r.x && robotPos.x <= r.x + r.w && robotPos.y >= r.y && robotPos.y <= r.y + r.h
  );
  const currentRoomName = currentRoom?.name ?? 'Dock Area';

  const isSpotClean = state.mode === 'spot' && state.spotCleanConfig !== null;
  const highlightedRooms = state.highlightedRooms ?? [];

  // Build path points
  const activePath = isSpotClean && state.spotCleanConfig && state.spotCleanConfig.rooms.length > 0
    ? (SPOT_WAYPOINTS[state.spotCleanConfig.rooms[0]] ?? CLEAN_PATH)
    : CLEAN_PATH;

  const pathPoints = activePath.map((p) => `${p.x},${p.y}`).join(' ');
  const traveledSegments = Math.ceil((coverage / 100) * activePath.length);
  const traveledPath = activePath.slice(0, Math.max(1, traveledSegments)).map((p) => `${p.x},${p.y}`).join(' ');

  // Spot clean area for coverage overlay
  const spotRoom = isSpotClean && state.spotCleanConfig?.rooms[0]
    ? ROOMS.find((r) => r.id === state.spotCleanConfig!.rooms[0])
    : null;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">Cleaning Map</h1>
          <p className="text-navy-500 text-sm mt-1">Real-time autonomous navigation view</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          isRunning ? 'bg-medical-50 border-medical-200' :
          isReturning ? 'bg-warn-50 border-warn-200' :
          isCharging ? 'bg-safe-50 border-safe-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-medical-500 animate-pulse-soft' :
            isReturning ? 'bg-warn-500 animate-pulse-soft' :
            isCharging ? 'bg-safe-500 animate-pulse-soft' :
            'bg-safe-500'
          }`} />
          <span className={`text-sm font-semibold ${
            isRunning ? 'text-medical-700' :
            isReturning ? 'text-warn-700' :
            isCharging ? 'text-safe-700' :
            'text-navy-600'
          }`}>
            {stateLabel}
          </span>
        </div>
      </div>

      {/* Main map + sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Floor map */}
        <div className="lg:col-span-2 card-lg p-4 sm:p-6">
          <div className="relative rounded-2xl bg-navy-50/40 overflow-hidden" style={{ height: '460px' }}>
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `linear-gradient(to right, #bcccdc 1px, transparent 1px), linear-gradient(to bottom, #bcccdc 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            />

            {/* Rooms as SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Room fills */}
              {ROOMS.map((room) => {
                const isHighlighted = highlightedRooms.includes(room.id);
                return (
                  <rect
                    key={room.id}
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    rx="1.5"
                    fill={
                      isHighlighted ? 'rgba(37, 99, 235, 0.12)' :
                      room.isDock ? '#f0fdf4' : 'rgba(255,255,255,0.6)'
                    }
                    stroke={
                      isHighlighted ? 'rgba(37, 99, 235, 0.6)' :
                      room.isDock ? '#86efac' : '#bcccdc'
                    }
                    strokeWidth={isHighlighted ? 0.6 : 0.4}
                  />
                );
              })}

              {/* Cleaned area overlay */}
              {coverage > 0 && !isSpotClean && (
                <rect
                  x="4" y="4" width={Math.max(0, 92 * (coverage / 100))} height="92"
                  rx="1.5"
                  fill="rgba(37, 99, 235, 0.06)"
                />
              )}

              {/* Spot clean area overlay */}
              {coverage > 0 && isSpotClean && spotRoom && (
                <rect
                  x={spotRoom.x} y={spotRoom.y}
                  width={Math.max(0, spotRoom.w * (coverage / 100))}
                  height={spotRoom.h}
                  rx="1.5"
                  fill="rgba(37, 99, 235, 0.10)"
                />
              )}

              {/* Full planned path (dashed, faint) */}
              {(isRunning || isPaused || isReturning) && (
                <polyline
                  points={pathPoints}
                  stroke="rgba(37, 99, 235, 0.2)"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 1"
                  fill="none"
                />
              )}

              {/* Traveled path (solid, brighter) */}
              {(isRunning || isPaused) && traveledPath && (
                <polyline
                  points={traveledPath}
                  stroke="rgba(37, 99, 235, 0.5)"
                  strokeWidth="0.5"
                  fill="none"
                />
              )}

              {/* Return path */}
              {isReturning && (
                <line
                  x1={robotPos.x}
                  y1={robotPos.y}
                  x2="84"
                  y2="72"
                  stroke="rgba(202, 138, 4, 0.5)"
                  strokeWidth="0.5"
                  strokeDasharray="1.5 1"
                />
              )}
            </svg>

            {/* Room labels */}
            {ROOMS.map((room) => {
              const isHighlighted = highlightedRooms.includes(room.id);
              return (
                <div
                  key={room.id}
                  className="absolute flex flex-col items-center justify-center"
                  style={{
                    left: `${room.x}%`,
                    top: `${room.y}%`,
                    width: `${room.w}%`,
                    height: `${room.h}%`,
                  }}
                >
                  <span className={`text-[10px] sm:text-xs font-semibold transition-all ${
                    isHighlighted ? 'text-medical-600' :
                    room.isDock ? 'text-safe-600' : 'text-navy-400'
                  }`}>
                    {room.name}
                  </span>
                  {room.isDock && (
                    <Home className="w-4 h-4 text-safe-500 mt-1" />
                  )}
                  {isHighlighted && (
                    <div className="w-1.5 h-1.5 rounded-full bg-medical-500 mt-1 animate-pulse-soft" />
                  )}
                </div>
              );
            })}

            {/* Robot position marker */}
            <div
              className="absolute transition-all duration-1000 ease-linear z-10"
              style={{
                left: `${robotPos.x}%`,
                top: `${robotPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative flex items-center justify-center">
                {isRunning && (
                  <div className="absolute w-10 h-10 rounded-full border-2 border-medical-400/40 animate-ping" />
                )}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-medium ${
                  isReturning ? 'border-warn-500 bg-warn-400/50' :
                  isRunning ? 'border-medical-500 bg-medical-400/50' :
                  isPaused ? 'border-warn-400 bg-warn-300/40' :
                  'border-safe-500 bg-safe-400/40'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isReturning ? 'bg-warn-600' :
                    isRunning ? 'bg-medical-600 animate-pulse-soft' :
                    isPaused ? 'bg-warn-500' :
                    'bg-safe-600'
                  }`} />
                </div>
              </div>
            </div>

            {/* Coverage badge */}
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/85 backdrop-blur-sm border border-gray-100 shadow-soft">
              <span className="text-xs font-semibold text-navy-700">{coverage}% covered</span>
            </div>

            {/* Current room badge */}
            {(isRunning || isPaused || isReturning) && (
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/85 backdrop-blur-sm border border-gray-100 shadow-soft flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-medical-500" />
                <span className="text-xs font-semibold text-navy-700">{currentRoomName}</span>
              </div>
            )}

            {/* Spot clean badge */}
            {isSpotClean && state.spotCleanConfig && (
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-medical-50/90 backdrop-blur-sm border border-medical-200 shadow-soft flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-medical-600" />
                <span className="text-xs font-semibold text-medical-700">
                  {state.spotCleanConfig.rooms.map((r) => ROOM_NAMES[r]).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Map stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <div className="rounded-xl bg-navy-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                <span className="text-[11px] text-navy-400 font-medium">Total Area</span>
              </div>
              <div className="text-base font-bold text-navy-900">{totalArea} m²</div>
            </div>
            <div className="rounded-xl bg-medical-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Navigation className="w-3.5 h-3.5 text-medical-500" />
                <span className="text-[11px] text-navy-400 font-medium">Cleaned</span>
              </div>
              <div className="text-base font-bold text-medical-600">{Math.round(state.areaCleaned)} m²</div>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-navy-400" />
                <span className="text-[11px] text-navy-400 font-medium">Est. Remaining</span>
              </div>
              <div className="text-base font-bold text-navy-700">{estDisplay}</div>
            </div>
            <div className="rounded-xl bg-safe-50/50 p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Battery className="w-3.5 h-3.5 text-safe-500" />
                <span className="text-[11px] text-navy-400 font-medium">Battery</span>
              </div>
              <div className={`text-base font-bold ${state.battery > 20 ? 'text-safe-600' : 'text-danger-600'}`}>
                {Math.round(state.battery)}%
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: controls + stats */}
        <div className="space-y-5">
          {/* Cleaning controls */}
          <div className="card-lg p-5">
            <h3 className="text-sm font-semibold text-navy-700 mb-4">Controls</h3>

            {/* Blocked warning */}
            {!canStartCleaning && !isActive && !isCharging && !isReturning && (
              <div className="mb-3 p-2.5 rounded-xl bg-danger-50 border border-danger-100 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-danger-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-danger-600">{cleaningBlockedReason}</span>
              </div>
            )}

            <div className="space-y-2.5">
              {!isActive && !isCharging && !isReturning && canStartCleaning && (
                <button onClick={startCleaning} className="btn-accent w-full">
                  <Play className="w-4 h-4" />
                  Start Cleaning
                </button>
              )}
              {!isActive && !isCharging && !isReturning && canStartCleaning && onSpotClean && (
                <button onClick={onSpotClean} className="btn-primary w-full">
                  <Target className="w-4 h-4" />
                  Spot Clean
                </button>
              )}
              {isRunning && (
                <button onClick={pauseCleaning} className="btn-secondary w-full">
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
              {isPaused && (
                <button onClick={resumeCleaning} className="btn-accent w-full">
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}
              {isActive && (
                <button onClick={stopCleaning} className="btn-primary w-full">
                  <CheckCircle2 className="w-4 h-4" />
                  Stop & Complete
                </button>
              )}
              {!state.docked && !isActive && (
                <button onClick={returnToDock} className="btn-secondary w-full">
                  <Home className="w-4 h-4" />
                  Return to Dock
                </button>
              )}
              {isCharging && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-safe-50 border border-safe-100">
                  <Battery className="w-4 h-4 text-safe-600" />
                  <span className="text-sm font-medium text-safe-700">Charging — {Math.round(state.battery)}%</span>
                </div>
              )}
              {isReturning && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-warn-50 border border-warn-100">
                  <Navigation className="w-4 h-4 text-warn-600" />
                  <span className="text-sm font-medium text-warn-700">Returning to dock...</span>
                </div>
              )}
            </div>
          </div>

          {/* Mode selection */}
          <div className="card-lg p-5">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Cleaning Mode</h3>
            <div className="space-y-2">
              {(Object.keys(MODE_LABELS) as CleanMode[]).map((m) => {
                const Icon = MODE_ICONS[m];
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    disabled={isActive}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all disabled:opacity-50 ${
                      state.mode === m
                        ? 'border-medical-400 bg-medical-50 shadow-soft'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      state.mode === m ? 'bg-medical-100' : 'bg-gray-50'
                    }`}>
                      <Icon className={`w-4 h-4 ${state.mode === m ? 'text-medical-600' : 'text-navy-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy-900">{MODE_LABELS[m]}</div>
                      <div className="text-xs text-navy-400 truncate">{MODE_DESCRIPTIONS[m]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live status */}
          <div className="card-lg p-5">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Live Status</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-navy-400" />
                  <span className="text-xs text-navy-500">Robot</span>
                </div>
                <span className={`text-xs font-semibold ${stateColor}`}>{stateLabel}</span>
              </div>
              {isSpotClean && state.spotCleanConfig && (
                <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-medical-400" />
                    <span className="text-xs text-navy-500">Area</span>
                  </div>
                  <span className="text-xs font-semibold text-medical-600">
                    {state.spotCleanConfig.rooms.map((r) => ROOM_NAMES[r]).join(', ')}
                  </span>
                </div>
              )}
              {isSpotClean && state.spotCleanConfig && (
                <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-navy-400" />
                    <span className="text-xs text-navy-500">Type</span>
                  </div>
                  <span className="text-xs font-semibold text-navy-700">
                    {state.spotCleanConfig.cleaningType === 'vacuum' ? 'Vacuum Only' : 'Vacuum + Mop'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-navy-400" />
                  <span className="text-xs text-navy-500">Elapsed</span>
                </div>
                <span className="text-xs font-semibold text-navy-700">{formatDuration(state.duration)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-navy-400" />
                  <span className="text-xs text-navy-500">Coverage</span>
                </div>
                <span className="text-xs font-semibold text-medical-600">{coverage}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-navy-400" />
                  <span className="text-xs text-navy-500">Dock</span>
                </div>
                <span className={`text-xs font-semibold ${state.docked ? 'text-safe-600' : 'text-navy-500'}`}>
                  {state.docked ? 'Connected' : 'Away'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
