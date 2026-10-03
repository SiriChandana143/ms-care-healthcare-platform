import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

export type CleanState = 'idle' | 'running' | 'paused' | 'returning' | 'charging' | 'completed';
export type CleanMode = 'auto' | 'spot' | 'edge' | 'quiet';
export type CleaningIntensity = 'standard' | 'deep';
export type CleaningType = 'vacuum' | 'vacuum-mop';

export type MaintenanceLevel = 'healthy' | 'attention' | 'critical';

export interface MaintenanceComponent {
  level: MaintenanceLevel;
  value: number;
  label: string;
  actionLabel: string;
}

export interface MaintenanceState {
  mainBrush: MaintenanceComponent;
  dustBin: MaintenanceComponent;
  wasteWaterTank: MaintenanceComponent;
  detergent: MaintenanceComponent;
  cleanWaterTank: MaintenanceComponent;
}

export interface CleanHistoryItem {
  id: string;
  date: string;
  time: string;
  duration: string;
  durationSec: number;
  area: string;
  areaNum: number;
  mode: CleanMode;
  status: 'completed' | 'interrupted';
  rooms?: string;
  intensity?: CleaningIntensity;
  cleaningType?: CleaningType;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  mode: CleanMode;
  enabled: boolean;
  isSleepPreset?: boolean;
}

export interface VacuumNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  read: boolean;
  resolved: boolean;
  actionLabel?: string;
  actionKey?: MaintenanceKey;
}

export type MaintenanceKey = 'mainBrush' | 'dustBin' | 'wasteWaterTank' | 'detergent' | 'cleanWaterTank';

export interface VacuumSettings {
  deviceName: string;
  serialNumber: string;
  firmware: string;
  wifiConnected: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  autoChargeThreshold: number;
  carpetBoost: boolean;
  dustBinDays: number;
  hepaFilterDays: number;
  sideBrushStatus: string;
}

export interface SpotCleanConfig {
  rooms: string[];
  intensity: CleaningIntensity;
  cleaningType: CleaningType;
}

export interface VacuumState {
  battery: number;
  cleaningState: CleanState;
  mode: CleanMode;
  areaCleaned: number;
  duration: number;
  suctionPower: number;
  docked: boolean;
  robotPosition: { x: number; y: number };
  history: CleanHistoryItem[];
  schedules: ScheduleItem[];
  notifications: VacuumNotification[];
  settings: VacuumSettings;
  maintenance: MaintenanceState;
  spotCleanConfig: SpotCleanConfig | null;
  highlightedRooms: string[];
}

export const MODE_LABELS: Record<CleanMode, string> = {
  auto: 'Auto Clean',
  spot: 'Spot Clean',
  edge: 'Edge Clean',
  quiet: 'Quiet Mode',
};

export const MODE_DESCRIPTIONS: Record<CleanMode, string> = {
  auto: 'Full-room systematic navigation',
  spot: 'Focused cleaning on a specific area',
  edge: 'Along walls and furniture edges',
  quiet: 'Low-noise, reduced suction',
};

export const MODE_ICONS: Record<CleanMode, string> = {
  auto: 'grid',
  spot: 'target',
  edge: 'frame',
  quiet: 'moon',
};

export const ROOM_NAMES: Record<string, string> = {
  living: 'Living Room',
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  hallway: 'Hallway',
};

export const MAINTENANCE_LABELS: Record<MaintenanceKey, string> = {
  mainBrush: 'Main Brush',
  dustBin: 'Dust Bin',
  wasteWaterTank: 'Waste Water',
  detergent: 'Detergent',
  cleanWaterTank: 'Clean Water',
};

export const MAINTENANCE_ACTIONS: Record<MaintenanceKey, string> = {
  mainBrush: 'Clean Brush',
  dustBin: 'Empty Bin',
  wasteWaterTank: 'Empty Tank',
  detergent: 'Add Detergent',
  cleanWaterTank: 'Refill Water',
};

const TOTAL_AREA = 120;

const INITIAL_HISTORY: CleanHistoryItem[] = [
  { id: '1', date: '14 Sep 2026', time: '09:15', duration: '42 min', durationSec: 2520, area: '85 m²', areaNum: 85, mode: 'auto', status: 'completed' },
  { id: '2', date: '13 Sep 2026', time: '14:30', duration: '38 min', durationSec: 2280, area: '82 m²', areaNum: 82, mode: 'auto', status: 'completed' },
  { id: '3', date: '13 Sep 2026', time: '19:45', duration: '15 min', durationSec: 900, area: '12 m²', areaNum: 12, mode: 'spot', status: 'completed', rooms: 'Kitchen', intensity: 'standard', cleaningType: 'vacuum' },
  { id: '4', date: '12 Sep 2026', time: '09:00', duration: '45 min', durationSec: 2700, area: '88 m²', areaNum: 88, mode: 'auto', status: 'completed' },
  { id: '5', date: '11 Sep 2026', time: '11:20', duration: '20 min', durationSec: 1200, area: '30 m²', areaNum: 30, mode: 'edge', status: 'interrupted' },
];

const INITIAL_SCHEDULES: ScheduleItem[] = [
  { id: '1', day: 'Monday', time: '09:00', mode: 'auto', enabled: true },
  { id: '2', day: 'Wednesday', time: '09:00', mode: 'auto', enabled: true },
  { id: '3', day: 'Friday', time: '14:00', mode: 'quiet', enabled: false },
  { id: '4', day: 'Sunday', time: '10:30', mode: 'auto', enabled: true },
];

const INITIAL_SETTINGS: VacuumSettings = {
  deviceName: 'MS.care Vacuum',
  serialNumber: 'MSC-2026-001',
  firmware: '2.4.1',
  wifiConnected: true,
  doNotDisturbStart: '22:00',
  doNotDisturbEnd: '07:00',
  autoChargeThreshold: 20,
  carpetBoost: true,
  dustBinDays: 3,
  hepaFilterDays: 15,
  sideBrushStatus: 'Good condition',
};

const INITIAL_MAINTENANCE: MaintenanceState = {
  mainBrush: { level: 'healthy', value: 78, label: 'Good', actionLabel: 'Clean Brush' },
  dustBin: { level: 'healthy', value: 42, label: '42%', actionLabel: 'Empty Bin' },
  wasteWaterTank: { level: 'healthy', value: 31, label: '31%', actionLabel: 'Empty Tank' },
  detergent: { level: 'healthy', value: 68, label: '68%', actionLabel: 'Add Detergent' },
  cleanWaterTank: { level: 'healthy', value: 76, label: '76%', actionLabel: 'Refill Water' },
};

const STORAGE_KEY = 'mscare-vacuum-state';

function getDefaults(): VacuumState {
  return {
    battery: 92,
    cleaningState: 'idle',
    mode: 'auto',
    areaCleaned: 0,
    duration: 0,
    suctionPower: 60,
    docked: true,
    robotPosition: { x: 50, y: 50 },
    history: INITIAL_HISTORY,
    schedules: INITIAL_SCHEDULES,
    notifications: [
      { id: '1', title: 'Cleaning completed', message: 'Auto clean finished. 85 m² cleaned in 42 min.', time: '2 hours ago', type: 'success', read: true, resolved: true },
      { id: '2', title: 'HEPA filter replacement due soon', message: 'HEPA filter has 15 days remaining before replacement.', time: '5 hours ago', type: 'warning', read: false, resolved: false },
      { id: '3', title: 'Scheduled clean', message: 'Next auto clean: Monday at 09:00.', time: '1 day ago', type: 'info', read: true, resolved: true },
    ],
    settings: INITIAL_SETTINGS,
    maintenance: INITIAL_MAINTENANCE,
    spotCleanConfig: null,
    highlightedRooms: [],
  };
}

function loadState(): VacuumState {
  const defaults = getDefaults();
  if (typeof window === 'undefined') return defaults;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<VacuumState>;
    const merged: VacuumState = {
      ...defaults,
      ...parsed,
      settings: { ...INITIAL_SETTINGS, ...parsed.settings },
      schedules: parsed.schedules ?? INITIAL_SCHEDULES,
      history: parsed.history ?? INITIAL_HISTORY,
      maintenance: { ...INITIAL_MAINTENANCE, ...parsed.maintenance },
      notifications: parsed.notifications ?? defaults.notifications,
      spotCleanConfig: parsed.spotCleanConfig ?? null,
      highlightedRooms: parsed.highlightedRooms ?? [],
      cleaningState: parsed.cleaningState === 'running' ? 'idle' : (parsed.cleaningState ?? 'idle'),
      areaCleaned: parsed.cleaningState === 'idle' ? 0 : (parsed.areaCleaned ?? 0),
      duration: parsed.cleaningState === 'idle' ? 0 : (parsed.duration ?? 0),
      robotPosition: { x: 50, y: 50 },
    };
    return merged;
  } catch {
    return defaults;
  }
}

function saveState(state: VacuumState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeMaintenanceNotification(key: MaintenanceKey, level: MaintenanceLevel): VacuumNotification {
  const labels: Record<MaintenanceKey, { title: string; message: string }> = {
    mainBrush: {
      title: 'Main Brush Needs Attention',
      message: 'Main brush should be cleaned or inspected.',
    },
    dustBin: {
      title: 'Dust Bin Full',
      message: 'Empty the dust bin before starting another cleaning cycle.',
    },
    wasteWaterTank: {
      title: 'Waste Water Tank Full',
      message: 'Remove and empty the waste-water tank.',
    },
    detergent: {
      title: 'Detergent Low',
      message: 'Add detergent before using Vacuum + Mop.',
    },
    cleanWaterTank: {
      title: 'Clean Water Low',
      message: 'Refill the clean-water tank before using Vacuum + Mop.',
    },
  };

  const info = labels[key];
  return {
    id: `maint-${key}-${Date.now()}`,
    title: info.title,
    message: info.message,
    time: 'Just now',
    type: level === 'critical' ? 'danger' : 'warning',
    read: false,
    resolved: false,
    actionLabel: MAINTENANCE_ACTIONS[key],
    actionKey: key,
  };
}

function levelFromValue(key: MaintenanceKey, value: number): MaintenanceLevel {
  if (key === 'dustBin' || key === 'wasteWaterTank') {
    if (value >= 90) return 'critical';
    if (value >= 75) return 'attention';
    return 'healthy';
  }
  if (key === 'mainBrush') {
    if (value < 20) return 'critical';
    if (value < 40) return 'attention';
    return 'healthy';
  }
  if (value <= 5) return 'critical';
  if (value <= 20) return 'attention';
  return 'healthy';
}

function labelForValue(key: MaintenanceKey, value: number): string {
  if (key === 'mainBrush') {
    if (value < 20) return 'Needs Replacement';
    if (value < 40) return 'Needs Cleaning';
    return 'Good';
  }
  return `${Math.round(value)}%`;
}

export interface VacuumContextValue {
  state: VacuumState;
  startCleaning: () => void;
  pauseCleaning: () => void;
  resumeCleaning: () => void;
  stopCleaning: () => void;
  returnToDock: () => void;
  setMode: (mode: CleanMode) => void;
  setSuction: (power: number) => void;
  toggleSchedule: (id: string) => void;
  addSchedule: (sched: Omit<ScheduleItem, 'id'>) => void;
  updateSchedule: (id: string, sched: Partial<Omit<ScheduleItem, 'id'>>) => void;
  deleteSchedule: (id: string) => void;
  updateSettings: (settings: Partial<VacuumSettings>) => void;
  restartDevice: () => void;
  resetDevice: () => void;
  totalArea: number;
  formatDuration: (sec: number) => string;
  isRunning: boolean;
  isPaused: boolean;
  isCharging: boolean;
  isReturning: boolean;
  isActive: boolean;
  stateLabel: string;
  stateColor: string;
  startSpotClean: (config: SpotCleanConfig) => void;
  resolveMaintenance: (key: MaintenanceKey) => void;
  markNotificationRead: (id: string) => void;
  markNotificationResolved: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  canStartCleaning: boolean;
  cleaningBlockedReason: string | null;
  canStartVacuumMop: boolean;
  vacuumMopBlockedReason: string | null;
}

const VacuumContext = createContext<VacuumContextValue | null>(null);

export function useVacuum(): VacuumContextValue {
  const ctx = useContext(VacuumContext);
  if (!ctx) throw new Error('useVacuum must be used within VacuumProvider');
  return ctx;
}

const WAYPOINTS = [
  { x: 20, y: 30 },
  { x: 55, y: 25 },
  { x: 80, y: 30 },
  { x: 75, y: 60 },
  { x: 45, y: 65 },
  { x: 20, y: 55 },
  { x: 50, y: 50 },
];

// Spot clean waypoints per room
const SPOT_WAYPOINTS: Record<string, { x: number; y: number }[]> = {
  living: [{ x: 30, y: 24 }, { x: 50, y: 20 }, { x: 40, y: 30 }],
  bedroom: [{ x: 22, y: 70 }, { x: 35, y: 85 }, { x: 25, y: 60 }],
  kitchen: [{ x: 75, y: 16 }, { x: 78, y: 24 }, { x: 68, y: 20 }],
  bathroom: [{ x: 56, y: 75 }, { x: 62, y: 85 }, { x: 52, y: 80 }],
  hallway: [{ x: 70, y: 40 }, { x: 80, y: 40 }, { x: 65, y: 40 }],
};

export function VacuumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VacuumState>(() => loadState());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waypointRef = useRef(0);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Generate maintenance notifications when levels change
  const prevMaintRef = useRef<MaintenanceState>(state.maintenance);
  useEffect(() => {
    const prev = prevMaintRef.current;
    const keys: MaintenanceKey[] = ['mainBrush', 'dustBin', 'wasteWaterTank', 'detergent', 'cleanWaterTank'];
    let newNotifications: VacuumNotification[] = [];

    for (const key of keys) {
      const prevLevel = prev[key].level;
      const currLevel = state.maintenance[key].level;
      if (currLevel !== prevLevel && currLevel !== 'healthy') {
        newNotifications.push(makeMaintenanceNotification(key, currLevel));
      }
    }

    if (newNotifications.length > 0) {
      setState((p) => ({
        ...p,
        notifications: [...newNotifications, ...p.notifications],
      }));
    }

    prevMaintRef.current = state.maintenance;
  }, [state.maintenance]);

  // Cleaning simulation loop
  useEffect(() => {
    if (state.cleaningState !== 'running') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setState((prev) => {
        const newArea = prev.areaCleaned + 0.5;
        const newDuration = prev.duration + 1;
        const drainRate = prev.mode === 'quiet' ? 0.3 : prev.mode === 'spot' ? 0.5 : 0.4;
        const newBattery = Math.max(0, prev.battery - drainRate);

        // Update robot position
        const waypoints = prev.mode === 'spot' && prev.spotCleanConfig && prev.spotCleanConfig.rooms.length > 0
          ? (SPOT_WAYPOINTS[prev.spotCleanConfig.rooms[0]] ?? WAYPOINTS)
          : WAYPOINTS;

        const wpIdx = waypointRef.current % waypoints.length;
        const target = waypoints[wpIdx];
        const dx = (target.x - prev.robotPosition.x) * 0.15;
        const dy = (target.y - prev.robotPosition.y) * 0.15;
        const newPos = {
          x: prev.robotPosition.x + dx,
          y: prev.robotPosition.y + dy,
        };

        if (Math.abs(target.x - newPos.x) < 1 && Math.abs(target.y - newPos.y) < 1) {
          waypointRef.current++;
        }

        // Degrade maintenance during cleaning
        const dustBinIncrease = prev.mode === 'spot' ? 0.8 : 0.5;
        const newDustBin = Math.min(100, prev.maintenance.dustBin.value + dustBinIncrease);
        const newMainBrush = Math.max(0, prev.maintenance.mainBrush.value - 0.1);
        const newWasteWater = Math.min(100, prev.maintenance.wasteWaterTank.value + (prev.spotCleanConfig?.cleaningType === 'vacuum-mop' ? 0.6 : 0.2));
        const newCleanWater = Math.max(0, prev.maintenance.cleanWaterTank.value - (prev.spotCleanConfig?.cleaningType === 'vacuum-mop' ? 0.5 : 0));
        const newDetergent = Math.max(0, prev.maintenance.detergent.value - (prev.spotCleanConfig?.cleaningType === 'vacuum-mop' ? 0.3 : 0));

        const updatedMaintenance: MaintenanceState = {
          ...prev.maintenance,
          dustBin: { ...prev.maintenance.dustBin, value: newDustBin },
          mainBrush: { ...prev.maintenance.mainBrush, value: newMainBrush },
          wasteWaterTank: { ...prev.maintenance.wasteWaterTank, value: newWasteWater },
          cleanWaterTank: { ...prev.maintenance.cleanWaterTank, value: newCleanWater },
          detergent: { ...prev.maintenance.detergent, value: newDetergent },
        };

        // Auto-return when battery hits threshold
        if (newBattery <= prev.settings.autoChargeThreshold) {
          return {
            ...prev,
            battery: Math.round(newBattery * 10) / 10,
            cleaningState: 'returning' as const,
            areaCleaned: Math.round(newArea * 10) / 10,
            duration: newDuration,
            robotPosition: newPos,
            maintenance: updatedMaintenance,
            notifications: [
              {
                id: `low-${Date.now()}`,
                title: 'Low battery — returning to dock',
                message: `Battery at ${Math.round(newBattery)}%. Robot returning to charging dock.`,
                time: 'Just now',
                type: 'warning' as const,
                read: false,
                resolved: false,
              },
              ...prev.notifications,
            ],
          };
        }

        return {
          ...prev,
          areaCleaned: Math.round(newArea * 10) / 10,
          duration: newDuration,
          battery: Math.round(newBattery * 10) / 10,
          robotPosition: newPos,
          maintenance: updatedMaintenance,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.cleaningState, state.settings.autoChargeThreshold]);

  // Returning-to-dock animation
  useEffect(() => {
    if (state.cleaningState !== 'returning') return;
    const returnInterval = setInterval(() => {
      setState((prev) => {
        const dx = (50 - prev.robotPosition.x) * 0.2;
        const dy = (50 - prev.robotPosition.y) * 0.2;
        const newPos = { x: prev.robotPosition.x + dx, y: prev.robotPosition.y + dy };

        if (Math.abs(50 - newPos.x) < 1 && Math.abs(50 - newPos.y) < 1) {
          return { ...prev, robotPosition: { x: 50, y: 50 }, docked: true, cleaningState: 'charging' as const };
        }
        return { ...prev, robotPosition: newPos };
      });
    }, 200);
    return () => clearInterval(returnInterval);
  }, [state.cleaningState]);

  // Charging simulation
  useEffect(() => {
    if (state.cleaningState !== 'charging') return;
    const chargeInterval = setInterval(() => {
      setState((prev) => {
        if (prev.battery >= 100) {
          return { ...prev, battery: 100, cleaningState: 'idle' as const, docked: true };
        }
        return { ...prev, battery: Math.min(100, Math.round((prev.battery + 2) * 10) / 10) };
      });
    }, 1500);
    return () => clearInterval(chargeInterval);
  }, [state.cleaningState]);

  const startCleaning = useCallback(() => {
    waypointRef.current = 0;
    setState((prev) => ({
      ...prev,
      cleaningState: 'running',
      docked: false,
      areaCleaned: 0,
      duration: 0,
      robotPosition: { x: 50, y: 50 },
      mode: 'auto',
      spotCleanConfig: null,
      highlightedRooms: [],
    }));
  }, []);

  const pauseCleaning = useCallback(() => {
    setState((prev) => ({ ...prev, cleaningState: 'paused' }));
  }, []);

  const resumeCleaning = useCallback(() => {
    setState((prev) => ({ ...prev, cleaningState: 'running' }));
  }, []);

  const stopCleaning = useCallback(() => {
    setState((prev) => {
      const now = new Date();
      const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const mins = Math.floor(prev.duration / 60);
      const secs = prev.duration % 60;
      const durationStr = mins > 0 ? `${mins} min` : `${secs} sec`;
      const areaStr = `${Math.round(prev.areaCleaned)} m²`;
      const areaNum = Math.round(prev.areaCleaned);

      const completed: CleanHistoryItem = {
        id: `clean-${Date.now()}`,
        date,
        time,
        duration: durationStr,
        durationSec: prev.duration,
        area: areaStr,
        areaNum,
        mode: prev.mode,
        status: 'completed',
        rooms: prev.spotCleanConfig?.rooms.map((r) => ROOM_NAMES[r]).join(', '),
        intensity: prev.spotCleanConfig?.intensity,
        cleaningType: prev.spotCleanConfig?.cleaningType,
      };

      return {
        ...prev,
        cleaningState: 'completed',
        docked: true,
        robotPosition: { x: 50, y: 50 },
        history: [completed, ...prev.history],
        spotCleanConfig: null,
        highlightedRooms: [],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Cleaning completed',
            message: `${MODE_LABELS[prev.mode]} finished. ${areaStr} cleaned in ${durationStr}.`,
            time: 'Just now',
            type: 'success' as const,
            read: false,
            resolved: false,
          },
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const returnToDock = useCallback(() => {
    setState((prev) => ({ ...prev, cleaningState: 'returning' }));
  }, []);

  const setMode = useCallback((mode: CleanMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setSuction = useCallback((power: number) => {
    setState((prev) => ({ ...prev, suctionPower: power }));
  }, []);

  const toggleSchedule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  }, []);

  const addSchedule = useCallback((sched: Omit<ScheduleItem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { ...sched, id: `sched-${Date.now()}` }],
    }));
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<Omit<ScheduleItem, 'id'>>) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((s) => s.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<VacuumSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  }, []);

  const restartDevice = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cleaningState: 'idle',
      docked: true,
      areaCleaned: 0,
      duration: 0,
      robotPosition: { x: 50, y: 50 },
      spotCleanConfig: null,
      highlightedRooms: [],
      notifications: [
        {
          id: `restart-${Date.now()}`,
          title: 'Device restarted',
          message: 'MS.care Vacuum has been restarted successfully.',
          time: 'Just now',
          type: 'info' as const,
          read: false,
          resolved: false,
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const resetDevice = useCallback(() => {
    const defaults = getDefaults();
    setState(defaults);
  }, []);

  const formatDuration = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `0:${String(s).padStart(2, '0')}`;
  }, []);

  const startSpotClean = useCallback((config: SpotCleanConfig) => {
    waypointRef.current = 0;
    setState((prev) => ({
      ...prev,
      cleaningState: 'running',
      mode: 'spot',
      docked: false,
      areaCleaned: 0,
      duration: 0,
      spotCleanConfig: config,
      highlightedRooms: config.rooms,
      robotPosition: { x: 50, y: 50 },
    }));
  }, []);

  const resolveMaintenance = useCallback((key: MaintenanceKey) => {
    setState((prev) => {
      let newValue = 100;
      let newLabel = 'Good';

      if (key === 'dustBin' || key === 'wasteWaterTank') {
        newValue = 0;
        newLabel = '0%';
      } else if (key === 'mainBrush') {
        newValue = 80;
        newLabel = 'Good';
      } else if (key === 'detergent' || key === 'cleanWaterTank') {
        newValue = 100;
        newLabel = '100%';
      }

      const updatedComp: MaintenanceComponent = {
        level: 'healthy',
        value: newValue,
        label: newLabel,
        actionLabel: MAINTENANCE_ACTIONS[key],
      };

      // Mark related notifications as resolved
      const updatedNotifications = prev.notifications.map((n) =>
        n.actionKey === key ? { ...n, resolved: true, read: true } : n
      );

      return {
        ...prev,
        maintenance: { ...prev.maintenance, [key]: updatedComp },
        notifications: [
          {
            id: `resolved-${key}-${Date.now()}`,
            title: `${MAINTENANCE_LABELS[key]} resolved`,
            message: `${MAINTENANCE_LABELS[key]} has been serviced and is ready.`,
            time: 'Just now',
            type: 'success' as const,
            read: false,
            resolved: false,
          },
          ...updatedNotifications,
        ],
      };
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markNotificationResolved = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, resolved: true, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const isRunning = state.cleaningState === 'running';
  const isPaused = state.cleaningState === 'paused';
  const isCharging = state.cleaningState === 'charging';
  const isReturning = state.cleaningState === 'returning';
  const isActive = isRunning || isPaused;

  const stateLabel =
    isRunning ? (state.mode === 'spot' ? 'Spot Cleaning' : 'Cleaning') :
    isPaused ? 'Paused' :
    isReturning ? 'Returning to Dock' :
    isCharging ? 'Charging' :
    state.cleaningState === 'completed' ? 'Cleaning Complete' :
    state.docked ? 'Online — Ready' : 'Idle';

  const stateColor =
    isRunning ? 'text-medical-600' :
    isPaused ? 'text-warn-600' :
    isReturning ? 'text-warn-600' :
    isCharging ? 'text-safe-600' :
    'text-safe-600';

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  // Safety logic
  const canStartCleaning = state.maintenance.dustBin.level !== 'critical';
  const cleaningBlockedReason =
    state.maintenance.dustBin.level === 'critical' ? 'Dust bin is full. Empty it before starting.' : null;

  const mopBlocked =
    state.maintenance.wasteWaterTank.level === 'critical' ||
    state.maintenance.cleanWaterTank.level === 'critical' ||
    state.maintenance.detergent.level === 'critical';

  const canStartVacuumMop = !mopBlocked;
  const vacuumMopBlockedReason = mopBlocked
    ? state.maintenance.wasteWaterTank.level === 'critical' ? 'Waste water tank is full.' :
      state.maintenance.cleanWaterTank.level === 'critical' ? 'Clean water tank is empty.' :
      state.maintenance.detergent.level === 'critical' ? 'Detergent is empty.' : null
    : null;

  const value: VacuumContextValue = {
    state,
    startCleaning,
    pauseCleaning,
    resumeCleaning,
    stopCleaning,
    returnToDock,
    setMode,
    setSuction,
    toggleSchedule,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    updateSettings,
    restartDevice,
    resetDevice,
    totalArea: TOTAL_AREA,
    formatDuration,
    isRunning,
    isPaused,
    isCharging,
    isReturning,
    isActive,
    stateLabel,
    stateColor,
    startSpotClean,
    resolveMaintenance,
    markNotificationRead,
    markNotificationResolved,
    markAllNotificationsRead,
    unreadCount,
    canStartCleaning,
    cleaningBlockedReason,
    canStartVacuumMop,
    vacuumMopBlockedReason,
  };

  return <VacuumContext.Provider value={value}>{children}</VacuumContext.Provider>;
}
