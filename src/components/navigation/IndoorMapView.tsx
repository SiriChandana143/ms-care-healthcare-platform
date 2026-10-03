import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ZoomIn, ZoomOut, Locate, Plus, Minus,
} from 'lucide-react';
import { HOSPITAL_ROOMS, type HospitalRoom, type NavWaypoint } from '../../data/hospitalData';

interface IndoorMapViewProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  selectedRoom: HospitalRoom | null;
  onSelectRoom: (room: HospitalRoom) => void;
  currentLocation: { x: number; y: number; floorIndex: number } | null;
  destinationRoom: HospitalRoom | null;
  routeWaypoints: NavWaypoint[];
  isNavigating: boolean;
  onRecenter: () => void;
}

const FLOORS = ['Ground Floor', 'First Floor', 'Second Floor'];

const ROOM_COLORS: Record<string, { fill: string; stroke: string; text: string; selected: string }> = {
  navy: { fill: '#d9e2ec', stroke: '#9fb3c8', text: '#334e68', selected: '#486581' },
  medical: { fill: '#dbeafe', stroke: '#93c5fd', text: '#1d4ed8', selected: '#2563eb' },
  safe: { fill: '#dcfce7', stroke: '#86efac', text: '#15803d', selected: '#16a34a' },
  sky: { fill: '#e0f2fe', stroke: '#7dd3fc', text: '#0369a1', selected: '#0ea5e9' },
  warn: { fill: '#fef9c3', stroke: '#fde047', text: '#ca8a04', selected: '#eab308' },
  danger: { fill: '#fee2e2', stroke: '#fca5a5', text: '#b91c1c', selected: '#dc2626' },
};

// Map coordinate space (viewBox 0-100 x, 0-60 y)
const MAP_W = 100;
const MAP_H = 60;

export function IndoorMapView({
  currentFloor,
  onFloorChange,
  selectedRoom,
  onSelectRoom,
  currentLocation,
  destinationRoom,
  routeWaypoints,
  isNavigating,
  onRecenter,
}: IndoorMapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const floorRooms = HOSPITAL_ROOMS.filter((r) => r.floorIndex === currentFloor);

  // Route waypoints for the current floor only
  const floorWaypoints = routeWaypoints.filter((wp) => wp.floorIndex === currentFloor);

  // Build SVG path from waypoints on this floor
  const routePath = floorWaypoints.length > 1
    ? floorWaypoints.map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`).join(' ')
    : '';

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 2.5)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.75)), []);

  const handleRecenter = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
    onRecenter();
  }, [onRecenter]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x) / (svgRef.current?.clientWidth ?? 1) * MAP_W / zoom;
    const dy = (e.clientY - dragStart.current.y) / (svgRef.current?.clientHeight ?? 1) * MAP_H / zoom;
    setPan({
      x: dragStart.current.panX - dx,
      y: dragStart.current.panY - dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Touch pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX: pan.x, panY: pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = (e.touches[0].clientX - dragStart.current.x) / (svgRef.current?.clientWidth ?? 1) * MAP_W / zoom;
    const dy = (e.touches[0].clientY - dragStart.current.y) / (svgRef.current?.clientHeight ?? 1) * MAP_H / zoom;
    setPan({
      x: dragStart.current.panX - dx,
      y: dragStart.current.panY - dy,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  const viewBoxX = -pan.x - (MAP_W * (zoom - 1)) / 2;
  const viewBoxY = -pan.y - (MAP_H * (zoom - 1)) / 2;
  const viewBoxW = MAP_W * zoom;
  const viewBoxH = MAP_H * zoom;

  // Auto-switch floor when navigating and current location marker changes floor
  useEffect(() => {
    if (isNavigating && currentLocation && currentLocation.floorIndex !== currentFloor) {
      onFloorChange(currentLocation.floorIndex);
    }
  }, [currentLocation, isNavigating, currentFloor, onFloorChange]);

  const showCurrentLocation = currentLocation && currentLocation.floorIndex === currentFloor;
  const showDestination = destinationRoom && destinationRoom.floorIndex === currentFloor;

  return (
    <div className="card-lg p-4 sm:p-6">
      {/* Floor selector + controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {FLOORS.map((floor, i) => (
            <button
              key={floor}
              onClick={() => onFloorChange(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFloor === i
                  ? 'bg-navy-900 text-white shadow-soft'
                  : 'bg-gray-100 text-navy-500 hover:bg-gray-200'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-navy-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-medical-500" />Current</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-medical-500" />Route</span>
        </div>
      </div>

      {/* Map container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50"
        style={{ aspectRatio: '5/3', cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`}
          className="w-full h-full select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Background — map style */}
          <rect x="-50" y="-50" width="200" height="160" fill="#f8fafc" />

          {/* Grid pattern (subtle) */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.15" />
            </pattern>
            <filter id="roomShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.3" stdDeviation="0.3" floodColor="#0a1c2e" floodOpacity="0.08" />
            </filter>
          </defs>
          <rect x="-50" y="-50" width="200" height="160" fill="url(#grid)" />

          {/* Corridors — light paths */}
          <rect x="0" y="13" width="100" height="4" fill="#f1f5f9" rx="1" />
          <rect x="48" y="0" width="4" height="60" fill="#f1f5f9" rx="1" />

          {/* Elevator/stairs indicator at corridor junction */}
          <rect x="46" y="11" width="8" height="8" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.3" />
          <text x="50" y="16" textAnchor="middle" fontSize="3" fill="#64748b" fontWeight="bold">⇅</text>

          {/* Rooms */}
          {floorRooms.map((room) => {
            const colors = ROOM_COLORS[room.color] ?? ROOM_COLORS.navy;
            const isSelected = selectedRoom?.id === room.id;
            const isDestination = destinationRoom?.id === room.id;
            const rx = room.grid.x;
            const ry = room.grid.y;
            const rw = room.grid.w;
            const rh = room.grid.h;

            return (
              <g
                key={room.id}
                onClick={(e) => { e.stopPropagation(); onSelectRoom(room); }}
                className="cursor-pointer"
              >
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  rx="1.5"
                  fill={isSelected ? colors.selected : colors.fill}
                  stroke={isSelected ? colors.selected : colors.stroke}
                  strokeWidth={isSelected ? 0.8 : 0.5}
                  filter="url(#roomShadow)"
                  className="transition-all"
                />
                {/* Room label */}
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 - 1}
                  textAnchor="middle"
                  fontSize={Math.min(rw * 0.15, rh * 0.2, 3.5)}
                  fill={colors.text}
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {room.number}
                </text>
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 + 2}
                  textAnchor="middle"
                  fontSize={Math.min(rw * 0.1, rh * 0.13, 2.2)}
                  fill={colors.text}
                  opacity="0.7"
                  className="pointer-events-none"
                >
                  {room.name}
                </text>
                {/* Destination pin */}
                {isDestination && (
                  <g transform={`translate(${room.center.x}, ${room.center.y - 5})`}>
                    <path d="M 0 0 C -3 -3 -3 -8 0 -8 C 3 -8 3 -3 0 0 Z" fill="#ef4444" />
                    <circle cx="0" cy="-5" r="1.5" fill="white" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Route path */}
          {routePath && (
            <>
              {/* Route background (wider, lighter) */}
              <path
                d={routePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
              />
              {/* Route main line */}
              <path
                d={routePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 1.5"
                className={isNavigating ? 'animate-pulse' : ''}
              />
              {/* Directional arrows along the route */}
              {floorWaypoints.length > 1 && floorWaypoints.slice(0, -1).map((wp, i) => {
                const next = floorWaypoints[i + 1];
                const midX = (wp.x + next.x) / 2;
                const midY = (wp.y + next.y) / 2;
                const angle = Math.atan2(next.y - wp.y, next.x - wp.x) * 180 / Math.PI;
                return (
                  <g key={i} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
                    <path d="M -1 -1 L 1 0 L -1 1 Z" fill="#2563eb" />
                  </g>
                );
              })}
            </>
          )}

          {/* Current location marker — pulsing blue dot */}
          {showCurrentLocation && (
            <g transform={`translate(${currentLocation!.x}, ${currentLocation!.y})`}>
              {/* Pulsing ring */}
              <circle r="3" fill="#3b82f6" opacity="0.2">
                <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Outer ring */}
              <circle r="2.5" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
              {/* Main dot */}
              <circle r="1.5" fill="#3b82f6" />
              <circle r="0.8" fill="#dbeafe" />
            </g>
          )}

          {/* Destination marker (when not a room pin) */}
          {showDestination && !destinationRoom?.grid && null}
        </svg>

        {/* Floating zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-lg bg-white shadow-soft border border-gray-100 flex items-center justify-center text-navy-600 hover:bg-gray-50 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-lg bg-white shadow-soft border border-gray-100 flex items-center justify-center text-navy-600 hover:bg-gray-50 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Recenter button */}
        <div className="absolute right-3 bottom-3">
          <button
            onClick={handleRecenter}
            className="w-9 h-9 rounded-lg bg-white shadow-soft border border-gray-100 flex items-center justify-center text-medical-600 hover:bg-medical-50 transition-all"
            title="Recenter on current location"
          >
            <Locate className="w-4 h-4" />
          </button>
        </div>

        {/* Floor badge */}
        <div className="absolute left-3 top-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-soft">
          <span className="text-xs font-bold text-navy-700">{FLOORS[currentFloor]}</span>
        </div>

        {/* Zoom indicator */}
        <div className="absolute left-3 bottom-3 px-2 py-1 rounded-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-[10px] text-navy-400">
            <ZoomOut className="w-3 h-3" />
            <div className="w-16 h-1 rounded-full bg-gray-200 relative">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-medical-500 transition-all"
                style={{ width: `${((zoom - 0.75) / 1.75) * 100}%` }}
              />
            </div>
            <ZoomIn className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Demo disclaimer */}
      <div className="mt-3 flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-md bg-medical-50 border border-medical-100">
          <span className="text-[10px] font-semibold text-medical-700">Indoor navigation demo — simulated location</span>
        </div>
      </div>
    </div>
  );
}
