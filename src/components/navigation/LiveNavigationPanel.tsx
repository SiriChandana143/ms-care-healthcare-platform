import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Navigation as NavIcon, MapPin, X, CheckCircle2, ArrowUp,
  ArrowRight, ArrowLeft, Footprints, Clock, Route, Square,
} from 'lucide-react';
import type { HospitalRoom, NavWaypoint } from '../../data/hospitalData';
import { calculateTotalDistance, estimateWalkingTime } from '../../data/hospitalData';

interface LiveNavigationPanelProps {
  startRoom: HospitalRoom;
  destinationRoom: HospitalRoom;
  waypoints: NavWaypoint[];
  isNavigating: boolean;
  onStart: () => void;
  onStop: () => void;
  onArrive: () => void;
  onClose: () => void;
  onProgress: (location: { x: number; y: number; floorIndex: number }) => void;
}

interface Instruction {
  icon: typeof ArrowUp;
  text: string;
  distance: string;
}

function getInstructionIcon(label: string): typeof ArrowUp {
  if (label.includes('right')) return ArrowRight;
  if (label.includes('left')) return ArrowLeft;
  return ArrowUp;
}

export function LiveNavigationPanel({
  startRoom,
  destinationRoom,
  waypoints,
  isNavigating,
  onStart,
  onStop,
  onArrive,
  onClose,
  onProgress,
}: LiveNavigationPanelProps) {
  const totalDistance = calculateTotalDistance(waypoints);
  const totalEta = estimateWalkingTime(totalDistance);

  // Current position along route (0 to waypoints.length - 1)
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0);
  // Sub-progress between current and next waypoint (0-1)
  const [subProgress, setSubProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Compute current position
  const currentWp = waypoints[currentWaypointIdx];
  const nextWp = waypoints[currentWaypointIdx + 1];
  const currentX = nextWp
    ? currentWp.x + (nextWp.x - currentWp.x) * subProgress
    : currentWp.x;
  const currentY = nextWp
    ? currentWp.y + (nextWp.y - currentWp.y) * subProgress
    : currentWp.y;
  const currentFloor = currentWp.floorIndex;

  // Report position to parent (for map marker)
  useEffect(() => {
    onProgress({ x: currentX, y: currentY, floorIndex: currentFloor });
  }, [currentX, currentY, currentFloor, onProgress]);

  // Animation loop
  useEffect(() => {
    if (!isNavigating || hasArrived) return;

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Speed: move through waypoints at ~1 waypoint per 2.5 seconds
      const speed = 0.4; // progress per second

      setSubProgress((prev) => {
        const newProgress = prev + speed * dt;
        if (newProgress >= 1) {
          // Move to next waypoint
          setCurrentWaypointIdx((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= waypoints.length - 1) {
              // Arrived — keep marker at destination, show arrival, then notify parent
              setHasArrived(true);
              setTimeout(() => onArrive(), 1500);
              return waypoints.length - 1;
            }
            return nextIdx;
          });
          return 0;
        }
        return newProgress;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = 0;
    };
  }, [isNavigating, hasArrived, waypoints.length, onArrive]);

  // Reset when navigation starts
  useEffect(() => {
    if (isNavigating) {
      setCurrentWaypointIdx(0);
      setSubProgress(0);
      setHasArrived(false);
      lastTimeRef.current = 0;
    }
  }, [isNavigating]);

  // Calculate remaining distance
  const remainingDistance = useCallback(() => {
    let dist = 0;
    for (let i = currentWaypointIdx; i < waypoints.length - 1; i++) {
      if (i === currentWaypointIdx) {
        dist += waypoints[i].distance * (1 - subProgress);
      } else {
        dist += waypoints[i].distance;
      }
    }
    return Math.max(0, Math.round(dist));
  }, [currentWaypointIdx, subProgress, waypoints]);

  const remDist = remainingDistance();
  const remEta = estimateWalkingTime(remDist);

  // Current instruction (from the current waypoint to the next)
  const currentInstruction: Instruction | null = nextWp
    ? {
        icon: getInstructionIcon(nextWp.instruction),
        text: nextWp.instruction,
        distance: `${Math.round(nextWp.distance * (1 - subProgress))} m`,
      }
    : null;

  // Upcoming instructions
  const upcomingInstructions = waypoints
    .slice(currentWaypointIdx + 2, currentWaypointIdx + 5)
    .filter((wp) => wp.distance > 0)
    .map((wp) => ({
      icon: getInstructionIcon(wp.instruction),
      text: wp.instruction,
      distance: `${wp.distance} m`,
    }));

  return (
    <div className="card-lg p-0 overflow-hidden animate-slide-in">
      {/* Top bar — destination */}
      <div className="bg-navy-900 text-white p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <NavIcon className="w-4 h-4 text-medical-400" />
            </div>
            <div>
              <div className="text-[10px] text-medical-300 font-semibold tracking-wide uppercase">Navigating to</div>
              <div className="text-sm font-bold">Room {destinationRoom.number} — {destinationRoom.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* From → To */}
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Footprints className="w-3 h-3" />
          <span>From {startRoom.name} (Room {startRoom.number})</span>
        </div>
      </div>

      {hasArrived ? (
        /* Arrival state */
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-safe-500 flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold font-display text-navy-900">Arrived</h2>
          <p className="text-sm text-navy-500 mt-1">
            You have arrived at Room {destinationRoom.number} — {destinationRoom.name}
          </p>
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="btn-secondary flex-1 text-xs">
              Back to Navigation
            </button>
          </div>
        </div>
      ) : !isNavigating ? (
        /* Pre-navigation state — route preview */
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-1.5 text-[10px] text-navy-400 font-semibold mb-1">
                <Route className="w-3 h-3" />DISTANCE
              </div>
              <div className="text-lg font-bold text-navy-900">{totalDistance} m</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-1.5 text-[10px] text-navy-400 font-semibold mb-1">
                <Clock className="w-3 h-3" />EST. TIME
              </div>
              <div className="text-lg font-bold text-navy-900">{totalEta}</div>
            </div>
          </div>

          {/* Route overview */}
          <div className="space-y-1 mb-5 max-h-32 overflow-y-auto">
            {waypoints.filter((wp) => wp.distance > 0).map((wp, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1">
                {(() => {
                  const Icon = getInstructionIcon(wp.instruction);
                  return <Icon className="w-3.5 h-3.5 text-medical-500 flex-shrink-0" />;
                })()}
                <span className="text-navy-600 flex-1 truncate">{wp.instruction}</span>
                <span className="text-navy-400 font-medium">{wp.distance} m</span>
              </div>
            ))}
          </div>

          <button onClick={onStart} className="w-full btn-accent">
            <NavIcon className="w-4 h-4" />
            Start Navigation
          </button>
        </div>
      ) : (
        /* Live navigation state */
        <div className="p-5">
          {/* Distance + ETA */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-medical-50 border border-medical-100">
              <div className="flex items-center gap-1.5 text-[10px] text-medical-600 font-semibold mb-1">
                <Route className="w-3 h-3" />REMAINING
              </div>
              <div className="text-2xl font-bold text-medical-700">{remDist} m</div>
            </div>
            <div className="p-3 rounded-xl bg-medical-50 border border-medical-100">
              <div className="flex items-center gap-1.5 text-[10px] text-medical-600 font-semibold mb-1">
                <Clock className="w-3 h-3" />ETA
              </div>
              <div className="text-2xl font-bold text-medical-700">{remEta}</div>
            </div>
          </div>

          {/* Current instruction — large card */}
          {currentInstruction && (
            <div className="p-4 rounded-xl bg-navy-900 text-white mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <currentInstruction.icon className="w-6 h-6 text-medical-400" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight">{currentInstruction.text}</div>
                  <div className="text-xs text-white/60 mt-0.5">{currentInstruction.distance}</div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming instructions */}
          {upcomingInstructions.length > 0 && (
            <div className="space-y-1.5 mb-4">
              <div className="text-[10px] font-bold text-navy-400 uppercase tracking-wide">Then</div>
              {upcomingInstructions.map((inst, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg bg-gray-50">
                  <inst.icon className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
                  <span className="text-navy-600 flex-1 truncate">{inst.text}</span>
                  <span className="text-navy-400 font-medium text-[10px]">{inst.distance}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-navy-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentWaypointIdx + subProgress) / (waypoints.length - 1)) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-medical-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentWaypointIdx + subProgress) / (waypoints.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Stop button */}
          <button onClick={onStop} className="w-full btn-danger text-xs">
            <Square className="w-3.5 h-3.5" />
            Stop Navigation
          </button>
        </div>
      )}
    </div>
  );
}
