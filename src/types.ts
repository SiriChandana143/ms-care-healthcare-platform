export type StatusType = 'ready' | 'active' | 'warn' | 'offline' | 'danger';

export interface SystemStatus {
  robot: StatusType;
  bed: StatusType;
  patient: StatusType;
  cover: StatusType;
  wasteUnit: StatusType;
}

export interface CareStep {
  id: number;
  name: string;
  shortName: string;
  description: string;
  status: SystemStatus;
  action: string;
}

export interface CareHistoryEntry {
  id: string;
  date: string;
  time: string;
  cycle: string;
  coverStatus: string;
  wasteStatus: string;
  result: string;
}

export interface NotificationEntry {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
}

export type CameraView = '3d' | 'top' | 'side' | 'mechanism';

export type CareMode = 'patientInitiatedBedridden' | 'sensorInitiatedBedridden' | 'normalCaring';

export type PageName =
  | 'home'
  | 'how-it-works'
  | 'simulation'
  | 'dashboard'
  | 'notifications'
  | 'history'
  | 'waste'
  | 'status'
  | 'about';

export type RobotState = 'idle' | 'scanning' | 'care-active' | 'returning-to-dock' | 'docked' | 'charging' | 'fully-charged';

export const CARE_STEPS: CareStep[] = [
  {
    id: 1,
    name: 'Normal Bed Position',
    shortName: 'Normal Position',
    description: 'The patient remains comfortably positioned while the bed operates normally.',
    status: { robot: 'ready', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'idle',
  },
  {
    id: 2,
    name: 'Smart Camera Alignment',
    shortName: 'Camera Alignment',
    description: 'The MS.care robot moves beside the bed and uses its camera/sensors to identify the required position.',
    status: { robot: 'active', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'scanning',
  },
  {
    id: 3,
    name: 'Central Access Section Opens',
    shortName: 'Central Section Opens',
    description: 'Only the small central rectangular section slides sideways and locks. The patient\'s position and the rest of the bed remain undisturbed.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'center-open',
  },
  {
    id: 4,
    name: 'Fresh Disposable Cover Placement',
    shortName: 'Cover Placement',
    description: 'A guided mechanical slider carrying a fresh disposable cover moves into the bed opening along its guide rails.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'slider-enter',
  },
  {
    id: 5,
    name: 'Slider Locks Into Position',
    shortName: 'Slider Locked',
    description: 'The slider stops at a precise predefined position and locks. The fresh disposable cover is correctly positioned in the hygiene area.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'slider-locked',
  },
  {
    id: 6,
    name: 'Care Mode',
    shortName: 'Care Mode',
    description: 'No lifting. No turning. No bed tilting. Minimal patient disturbance.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'care-mode',
  },
  {
    id: 7,
    name: 'Hygiene Washing Stage',
    shortName: 'Washing',
    description: 'A compact retractable nozzle extends from the slider. Clean water flows from the dock supply tank. Used water is directed into a sealed disposable waste-water pathway. No graphic fluids are shown.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'washing',
  },
  {
    id: 8,
    name: 'Used Cover Retrieval',
    shortName: 'Cover Retrieval',
    description: 'The same guided slider retrieves the used collection cover along its defined mechanical track.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'slider-retrieve',
  },
  {
    id: 9,
    name: 'Cover Sealing',
    shortName: 'Sealing',
    description: 'The slider/sealing mechanism securely seals the used disposable cover — including the collected waste water — before robotic transfer.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'sealing',
  },
  {
    id: 10,
    name: 'Slider Fully Exits',
    shortName: 'Slider Exit',
    description: 'The slider carrying the sealed cover travels completely out of the bed. The bed closes only after the slider is fully clear.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'active', wasteUnit: 'ready' },
    action: 'slider-exit',
  },
  {
    id: 11,
    name: 'Central Section Returns & Locks',
    shortName: 'Bed Restored',
    description: 'Only after the slider is completely out, the small central rectangular section slides back and locks into its original position.',
    status: { robot: 'active', bed: 'active', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'center-close',
  },
  {
    id: 12,
    name: 'Crane Deploys',
    shortName: 'Crane Deploy',
    description: 'The MS.care robot deploys its foldable robotic crane. The crane unfolds and positions itself above the sealed cover.',
    status: { robot: 'active', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'active' },
    action: 'crane-deploy',
  },
  {
    id: 13,
    name: 'Sealed Cover Transfer',
    shortName: 'Waste Transfer',
    description: 'The crane picks up the sealed cover, lifts it, and transfers it to the external vertical waste-storage unit.',
    status: { robot: 'active', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'active' },
    action: 'crane-transfer',
  },
  {
    id: 14,
    name: 'Waste Unit Storage',
    shortName: 'Waste Storage',
    description: 'The sealed cover is placed into the external waste unit. The robot does not store used waste internally.',
    status: { robot: 'active', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'active' },
    action: 'waste-stored',
  },
  {
    id: 15,
    name: 'Crane Retracts + Cycle Complete',
    shortName: 'Crane Retract',
    description: 'The crane folds completely back inside the robot. The care cycle is complete.',
    status: { robot: 'ready', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'crane-retract',
  },
];

export const POST_CYCLE_STEPS: CareStep[] = [
  {
    id: 16,
    name: 'Return to Charging Dock',
    shortName: 'Return to Dock',
    description: 'The MS.care robot automatically returns to its charging dock and aligns itself with the charging contacts.',
    status: { robot: 'active', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'return-to-dock',
  },
  {
    id: 17,
    name: 'Docked & Charging',
    shortName: 'Charging',
    description: 'The robot is docked. Charging has begun. Battery percentage gradually increases.',
    status: { robot: 'active', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'charging',
  },
  {
    id: 18,
    name: 'Fully Charged — Ready',
    shortName: 'Fully Charged',
    description: 'The robot is fully charged and ready for the next care cycle.',
    status: { robot: 'ready', bed: 'ready', patient: 'ready', cover: 'ready', wasteUnit: 'ready' },
    action: 'fully-charged',
  },
];

export const ALL_STEPS: CareStep[] = [...CARE_STEPS, ...POST_CYCLE_STEPS];

export const CARE_HISTORY: CareHistoryEntry[] = [
  { id: '1', date: '10 Sep 2026', time: '10:32 AM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
  { id: '2', date: '10 Sep 2026', time: '08:15 AM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
  { id: '3', date: '09 Sep 2026', time: '06:48 PM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
  { id: '4', date: '09 Sep 2026', time: '02:30 PM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
  { id: '5', date: '09 Sep 2026', time: '10:05 AM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
  { id: '6', date: '08 Sep 2026', time: '09:20 PM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
  { id: '7', date: '08 Sep 2026', time: '03:45 PM', cycle: 'Interrupted', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Paused — Resumed' },
  { id: '8', date: '08 Sep 2026', time: '11:12 AM', cycle: 'Completed', coverStatus: 'Sealed', wasteStatus: 'Transferred', result: 'Successful' },
];
export function getCareHistory(): CareHistoryEntry[] {
  if (typeof window === 'undefined') {
    return CARE_HISTORY;
  }

  const stored = localStorage.getItem('ms-care-history');

  if (!stored) {
    localStorage.setItem('ms-care-history', JSON.stringify(CARE_HISTORY));
    return CARE_HISTORY;
  }

  try {
    return JSON.parse(stored) as CareHistoryEntry[];
  } catch {
    localStorage.setItem('ms-care-history', JSON.stringify(CARE_HISTORY));
    return CARE_HISTORY;
  }
}

export function addCareHistoryEntry(entry: CareHistoryEntry): void {
  const history = getCareHistory();

  const updatedHistory = [entry, ...history];

  localStorage.setItem('ms-care-history', JSON.stringify(updatedHistory));

  window.dispatchEvent(new Event('care-history-updated'));
}

export const NOTIFICATIONS: NotificationEntry[] = [
  { id: '1', title: 'Care cycle completed', message: 'Care cycle #1 finished successfully. Bed restored to normal position.', time: '10:32 AM', type: 'success', read: false },
  { id: '2', title: 'Disposable cover successfully sealed', message: 'The used cover was hygienically sealed before robotic transfer.', time: '10:31 AM', type: 'success', read: false },
  { id: '3', title: 'Sealed waste transferred to vertical waste unit', message: 'Sealed package stored in the vertical waste-storage unit.', time: '10:30 AM', type: 'info', read: false },
  { id: '4', title: 'Robot returned to charging dock', message: 'MS.care robot docked successfully. Charging in progress.', time: '10:29 AM', type: 'info', read: false },
  { id: '5', title: 'Attention: Waste unit nearing capacity', message: 'Waste storage unit is at 32% capacity. Consider scheduling disposal.', time: '09:00 AM', type: 'warning', read: true },
];

export function getNotifications(): NotificationEntry[] {
  if (typeof window === 'undefined') return NOTIFICATIONS;
  const stored = localStorage.getItem('ms-care-notifications');
  if (!stored) {
    localStorage.setItem('ms-care-notifications', JSON.stringify(NOTIFICATIONS));
    return NOTIFICATIONS;
  }
  try {
    return JSON.parse(stored) as NotificationEntry[];
  } catch {
    localStorage.setItem('ms-care-notifications', JSON.stringify(NOTIFICATIONS));
    return NOTIFICATIONS;
  }
}

export function addNotificationEntry(entry: NotificationEntry): void {
  const notifications = getNotifications();
  const updated = [entry, ...notifications].slice(0, 50);
  localStorage.setItem('ms-care-notifications', JSON.stringify(updated));
  window.dispatchEvent(new Event('notifications-updated'));
}

export const STATUS_LABELS: Record<StatusType, string> = {
  ready: 'Ready',
  active: 'Active',
  warn: 'Warning',
  offline: 'Offline',
  danger: 'Critical',
};

export const STATUS_CLASSES: Record<StatusType, string> = {
  ready: 'status-ready text-safe-600',
  active: 'status-active text-medical-600',
  warn: 'status-warn text-warn-600',
  offline: 'status-offline text-gray-500',
  danger: 'status-danger text-danger-600',
};

export const TIMELINE_STAGES = [
  'Position',
  'Central Section',
  'Cover Placement',
  'Slider Lock',
  'Care',
  'Washing',
  'Retrieval',
  'Sealing',
  'Slider Exit',
  'Bed Restored',
  'Crane Deploy',
  'Transfer',
  'Storage',
  'Retract',
  'Complete',
];
