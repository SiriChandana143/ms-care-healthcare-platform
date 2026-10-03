import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity, Home, Navigation as NavIcon, Map as MapIcon,
  Building2, Footprints,
} from 'lucide-react';
import {
  HOSPITAL_ROOMS, ROOM_IMAGES, type HospitalRoom, type NavWaypoint,
  buildNavRoute,
} from '../data/hospitalData';
import { X as CloseIcon } from 'lucide-react';
import { IndoorMapView } from '../components/navigation/IndoorMapView';
import { RoomInfoPanel } from '../components/navigation/RoomInfoPanel';
import { LiveNavigationPanel } from '../components/navigation/LiveNavigationPanel';
import { SearchBar } from '../components/navigation/SearchBar';
import { ProcedureVisualization } from '../components/navigation/ProcedureVisualization';

interface NavigationPageProps {
  onSwitchMode: () => void;
  targetRoom?: string | null;
}

export function NavigationPage({ onSwitchMode, targetRoom }: NavigationPageProps) {
  const [selectedRoom, setSelectedRoom] = useState<HospitalRoom | null>(null);
  const [showProcedure, setShowProcedure] = useState<HospitalRoom | null>(null);
  const [destinationRoom, setDestinationRoom] = useState<HospitalRoom | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<{ x: number; y: number; floorIndex: number } | null>(null);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const [arrivedRoom, setArrivedRoom] = useState<HospitalRoom | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<HospitalRoom | null>(null);

  // Simulated current location is always Reception (Room 101)
  const startRoom = useMemo(
    () => HOSPITAL_ROOMS.find((r) => r.number === '101') ?? HOSPITAL_ROOMS[0],
    []
  );

  // Initialize current location at Reception
  useEffect(() => {
    if (!currentLocation) {
      setCurrentLocation({
        x: startRoom.center.x,
        y: startRoom.center.y,
        floorIndex: startRoom.floorIndex,
      });
    }
  }, [startRoom, currentLocation]);

  // Handle incoming navigation request from Hospital module
  useEffect(() => {
    if (targetRoom && !autoTriggered) {
      const room = HOSPITAL_ROOMS.find((r) => r.number === targetRoom);
      if (room) {
        setDestinationRoom(room);
        setSelectedRoom(room);
        setCurrentFloor(room.floorIndex);
        setAutoTriggered(true);
      }
    }
  }, [targetRoom, autoTriggered]);

  // Build waypoints when destination changes
  const waypoints = useMemo<NavWaypoint[]>(() => {
    if (!destinationRoom) return [];
    return buildNavRoute(startRoom, destinationRoom);
  }, [startRoom, destinationRoom]);

  // When not navigating, keep current location at start room
  useEffect(() => {
    if (!isNavigating) {
      setCurrentLocation({
        x: startRoom.center.x,
        y: startRoom.center.y,
        floorIndex: startRoom.floorIndex,
      });
    }
  }, [isNavigating, startRoom]);

  const handleSelectRoom = useCallback((room: HospitalRoom) => {
    setSelectedRoom(room);
    setCurrentFloor(room.floorIndex);
  }, []);

  const handleCloseRoomInfo = useCallback(() => {
    setSelectedRoom(null);
  }, []);

  const handleViewProcedure = useCallback((room: HospitalRoom) => {
    setShowProcedure(room);
  }, []);

  const handleGetDirections = useCallback((room: HospitalRoom) => {
    setDestinationRoom(room);
    setSelectedRoom(null);
    setIsNavigating(false);
    setArrivedRoom(null);
  }, []);

  const handleStartNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const handleStopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  const handleArrive = useCallback(() => {
    if (destinationRoom) {
      const room = destinationRoom;
      setIsNavigating(false);
      setDestinationRoom(null);
      setAutoTriggered(false);
      setArrivedRoom(room);
      setSelectedRoom(room);
      setCurrentFloor(room.floorIndex);
      // Keep marker at destination room
      setCurrentLocation({
        x: room.center.x,
        y: room.center.y,
        floorIndex: room.floorIndex,
      });
    }
  }, [destinationRoom]);

  const handleCloseNav = useCallback(() => {
    setDestinationRoom(null);
    setIsNavigating(false);
    setAutoTriggered(false);
    setArrivedRoom(null);
  }, []);

  const handleProgress = useCallback((loc: { x: number; y: number; floorIndex: number }) => {
    setCurrentLocation(loc);
  }, []);

  const handleRecenter = useCallback(() => {
    if (currentLocation) {
      setCurrentFloor(currentLocation.floorIndex);
    }
  }, [currentLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-soft">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold font-display text-navy-900 leading-none">Ms.care</div>
                <div className="text-[10px] text-medical-500 font-medium tracking-wide leading-none mt-0.5">Navigation</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-medical-50 border border-medical-100">
              <MapIcon className="w-4 h-4 text-medical-600" />
              <span className="text-sm font-semibold text-medical-700">Indoor Hospital Navigation</span>
            </div>

            <button
              onClick={onSwitchMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-gray-50 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title + Search */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display text-navy-900">Hospital Navigation</h1>
          <p className="text-navy-500 mt-1 text-sm">
            Search for a room, tap any room on the map, and get turn-by-turn directions.
          </p>

          <div className="mt-4">
            <SearchBar onSelectRoom={handleSelectRoom} />
          </div>

          {/* Current location indicator */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-medical-50 border border-medical-100">
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-medical-500" />
                <div className="absolute w-3 h-3 rounded-full bg-medical-500 animate-ping opacity-50" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-medical-600 tracking-wide">CURRENT LOCATION</div>
                <div className="text-xs font-semibold text-medical-700">
                  {startRoom.name} — Room {startRoom.number}
                </div>
              </div>
            </div>

            {destinationRoom && (
              <>
                <div className="flex items-center gap-1 text-navy-300">
                  <NavIcon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warn-50 border border-warn-100">
                  <MapIcon className="w-4 h-4 text-warn-600" />
                  <div>
                    <div className="text-[10px] font-bold text-warn-600 tracking-wide">DESTINATION</div>
                    <div className="text-xs font-semibold text-warn-700">
                      {destinationRoom.name} — Room {destinationRoom.number}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 space-y-6">
            <IndoorMapView
              currentFloor={currentFloor}
              onFloorChange={setCurrentFloor}
              selectedRoom={selectedRoom}
              onSelectRoom={handleSelectRoom}
              currentLocation={currentLocation}
              destinationRoom={destinationRoom}
              routeWaypoints={waypoints}
              isNavigating={isNavigating}
              onRecenter={handleRecenter}
            />

            {/* Room list quick access */}
            <div className="card-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-medical-600" />
                <h3 className="text-sm font-bold text-navy-900">All Rooms</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HOSPITAL_ROOMS.map((room) => {
                  const img = ROOM_IMAGES[room.number];
                  return (
                    <div
                      key={room.id}
                      className="relative"
                      onMouseEnter={() => setHoveredRoom(room)}
                      onMouseLeave={() => setHoveredRoom(null)}
                    >
                      <button
                        onClick={() => handleSelectRoom(room)}
                        className={`w-full flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left ${
                          selectedRoom?.id === room.id
                            ? 'border-medical-300 bg-medical-50'
                            : hoveredRoom?.id === room.id
                              ? 'border-medical-200 bg-medical-50/60'
                              : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-navy-600">{room.number}</span>
                        </div>
                        <span className="text-xs font-medium text-navy-600 truncate">{room.name}</span>
                      </button>

                      {/* Desktop hover preview */}
                      {hoveredRoom !== null && hoveredRoom.id === room.id && img && (
                        <div
                          className="hidden md:block absolute z-40 animate-fade-in"
                          style={{
                            top: 0,
                            left: 'calc(100% + 8px)',
                          }}
                        >
                          <div className="card-lg p-2 w-48 shadow-large">
                            <img
                              src={img}
                              alt={`${room.number} ${room.name}`}
                              className="w-full h-28 object-cover rounded-lg"
                              draggable={false}
                            />
                            <div className="flex items-center gap-1.5 mt-2 px-1">
                              <span className="text-xs font-bold text-navy-700">{room.number}</span>
                              <span className="text-[10px] text-navy-300">•</span>
                              <span className="text-xs font-medium text-navy-600 truncate">{room.name}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Live Navigation Panel (when destination set) */}
            {destinationRoom && (
              <LiveNavigationPanel
                startRoom={startRoom}
                destinationRoom={destinationRoom}
                waypoints={waypoints}
                isNavigating={isNavigating}
                onStart={handleStartNavigation}
                onStop={handleStopNavigation}
                onArrive={handleArrive}
                onClose={handleCloseNav}
                onProgress={handleProgress}
              />
            )}

            {/* Room Info Panel (when room selected and no active navigation) */}
            {selectedRoom && !destinationRoom && (
              <RoomInfoPanel
                room={selectedRoom}
                onClose={handleCloseRoomInfo}
                onViewProcedure={handleViewProcedure}
                onGetDirections={handleGetDirections}
              />
            )}

            {/* Arrival room info (after navigation completes) */}
            {arrivedRoom && !destinationRoom && (
              <RoomInfoPanel
                room={arrivedRoom}
                onClose={() => setArrivedRoom(null)}
                onViewProcedure={handleViewProcedure}
                onGetDirections={handleGetDirections}
              />
            )}

            {/* Default placeholder */}
            {!selectedRoom && !destinationRoom && !arrivedRoom && (
              <div className="card-lg p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-medical-50 flex items-center justify-center mx-auto mb-3">
                  <MapIcon className="w-7 h-7 text-medical-400" />
                </div>
                <h3 className="text-sm font-bold text-navy-900">Explore the Hospital</h3>
                <p className="text-xs text-navy-400 mt-1 leading-relaxed">
                  Search above or tap any room on the map to view details, room visuals, and get turn-by-turn directions.
                </p>
              </div>
            )}

            {/* Simulated location notice */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2">
              <Footprints className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-sky-700 leading-relaxed">
                Indoor navigation demo — simulated location. No GPS or physical indoor positioning is used.
                Designed so real indoor positioning (BLE beacons, UWB, Wi-Fi) could be integrated in the future.
              </p>
            </div>
          </div>
        </div>
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
                <div className="text-sm font-bold font-display text-navy-900">Ms.care Navigation</div>
                <div className="text-[10px] text-navy-400">Indoor hospital navigation demo</div>
              </div>
            </div>
            <button
              onClick={onSwitchMode}
              className="text-xs text-navy-500 font-medium hover:text-medical-600 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Main Menu
            </button>
          </div>
          <p className="text-xs text-navy-300 mt-4">
            © 2026 Ms.care — College Innovation & Expo Prototype. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Mobile/touch image preview */}
      {hoveredRoom && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[min(90vw,20rem)]">
          <div className="card-lg p-2 shadow-large relative">
            <button
              onClick={() => setHoveredRoom(null)}
              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-white/80 backdrop-blur-sm text-navy-400 hover:text-navy-700 z-10"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
            {ROOM_IMAGES[hoveredRoom.number] && (
              <img
                src={ROOM_IMAGES[hoveredRoom.number]}
                alt={`${hoveredRoom.number} ${hoveredRoom.name}`}
                className="w-full h-32 object-cover rounded-lg"
                draggable={false}
              />
            )}
            <div className="flex items-center gap-1.5 mt-2 px-1 pb-1">
              <span className="text-xs font-bold text-navy-700">{hoveredRoom.number}</span>
              <span className="text-[10px] text-navy-300">•</span>
              <span className="text-xs font-medium text-navy-600 truncate">{hoveredRoom.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Procedure Visualization Modal */}
      {showProcedure && (
        <ProcedureVisualization
          room={showProcedure}
          onClose={() => setShowProcedure(null)}
        />
      )}
    </div>
  );
}
