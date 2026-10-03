// ============================================================
// Ms.care Hospital — Simulated Demo Data
// All data is fictional and for demonstration purposes only.
// ============================================================

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  roomNumber: string;
  availability: 'Today' | 'Tomorrow' | 'This Week';
  slots: string[];
  experience: string;
  qualification: string;
  bio: string;
  rating: number;
  location: string;
}

export interface HospitalRoom {
  id: string;
  number: string;
  name: string;
  floor: string;
  floorIndex: number;
  category: 'diagnostic' | 'department' | 'service' | 'facility';
  purpose: string;
  equipment: string[];
  services: string[];
  hasProcedure: boolean;
  visualType: string;
  // Blueprint grid position (percentage-based for the floor plan)
  grid: { x: number; y: number; w: number; h: number };
  // Center point for markers (percentage)
  center: { x: number; y: number };
  color: string;
}

export interface HealthReport {
  id: string;
  type: string;
  date: string;
  doctor: string;
  department: string;
  status: 'Normal' | 'Review Needed' | 'Completed';
  summary: string;
  details: { label: string; value: string; range: string; normal: boolean }[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  department: string;
  roomNumber: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  leadTime: '10 min' | '30 min' | '1 hour' | '1 day';
  type: 'appointment' | 'test' | 'general';
}

// ============================================================
// Doctors
// ============================================================

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiology',
    department: 'Cardiology',
    roomNumber: '305',
    availability: 'Today',
    slots: ['10:30 AM', '12:00 PM', '03:30 PM'],
    experience: '14 years',
    qualification: 'MD — Cardiology, AIIMS',
    bio: 'Specialist in interventional cardiology and preventive heart care. Experienced in echocardiography and cardiac rehabilitation.',
    rating: 4.8,
    location: 'Third Floor',
  },
  {
    id: 'doc-2',
    name: 'Dr. Rahul Verma',
    specialty: 'Orthopedics',
    department: 'Orthopedics',
    roomNumber: '308',
    availability: 'Tomorrow',
    slots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    experience: '11 years',
    qualification: 'MS — Orthopedics, JIPMER',
    bio: 'Focuses on joint preservation, sports injury management, and minimally invasive orthopedic procedures.',
    rating: 4.7,
    location: 'Third Floor',
  },
  {
    id: 'doc-3',
    name: 'Dr. Ananya Rao',
    specialty: 'General Medicine',
    department: 'General Medicine',
    roomNumber: '302',
    availability: 'Today',
    slots: ['10:00 AM', '01:00 PM', '04:00 PM'],
    experience: '9 years',
    qualification: 'MD — General Medicine, CMC Vellore',
    bio: 'Primary care physician with expertise in chronic disease management, preventive health, and lifestyle medicine.',
    rating: 4.9,
    location: 'Third Floor',
  },
  {
    id: 'doc-4',
    name: 'Dr. Karthik Nair',
    specialty: 'Neurology',
    department: 'Neurology',
    roomNumber: '306',
    availability: 'This Week',
    slots: ['09:30 AM', '03:00 PM'],
    experience: '16 years',
    qualification: 'DM — Neurology, NIMHANS',
    bio: 'Specializes in stroke management, epilepsy, and neuromuscular disorders. Runs the headache clinic on Thursdays.',
    rating: 4.6,
    location: 'Third Floor',
  },
  {
    id: 'doc-5',
    name: 'Dr. Meera Iyer',
    specialty: 'Dermatology',
    department: 'Dermatology',
    roomNumber: '304',
    availability: 'Today',
    slots: ['11:00 AM', '01:30 PM', '03:00 PM', '05:00 PM'],
    experience: '8 years',
    qualification: 'MD — Dermatology, Kasturba Medical College',
    bio: 'Expert in cosmetic dermatology, acne management, and skin cancer screening. Offers phototherapy and laser treatments.',
    rating: 4.8,
    location: 'Third Floor',
  },
  {
    id: 'doc-6',
    name: 'Dr. Sanjay Gupta',
    specialty: 'Pediatrics',
    department: 'Pediatrics',
    roomNumber: '307',
    availability: 'Tomorrow',
    slots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM'],
    experience: '12 years',
    qualification: 'MD — Pediatrics, PGIMER',
    bio: 'Dedicated to child health, vaccination programs, and developmental assessments. Runs the well-baby clinic.',
    rating: 4.9,
    location: 'Third Floor',
  },
];

export const SPECIALTIES = ['All', 'Cardiology', 'Orthopedics', 'General Medicine', 'Neurology', 'Dermatology', 'Pediatrics'];
export const AVAILABILITY_FILTERS = ['All', 'Today', 'Tomorrow', 'This Week'];

// ============================================================
// Hospital Rooms / Blueprint
// ============================================================

export const HOSPITAL_ROOMS: HospitalRoom[] = [
  {
    id: 'room-101',
    number: '101',
    name: 'Reception',
    floor: 'Ground Floor',
    floorIndex: 0,
    category: 'facility',
    purpose: 'Patient registration, inquiries, and appointment check-in.',
    equipment: ['Reception Desk', 'Queue Display', 'Information Kiosk'],
    services: ['New Patient Registration', 'Appointment Check-in', 'General Inquiries'],
    hasProcedure: false,
    visualType: 'reception',
    grid: { x: 2, y: 2, w: 16, h: 12 },
    center: { x: 10, y: 8 },
    color: 'navy',
  },
  {
    id: 'room-102',
    number: '102',
    name: 'Pharmacy',
    floor: 'Ground Floor',
    floorIndex: 0,
    category: 'service',
    purpose: 'In-house pharmacy for prescription dispensing and over-the-counter medications.',
    equipment: ['Dispensing Counter', 'Medication Storage', 'Prescription System'],
    services: ['Prescription Dispensing', 'OTC Medications', 'Medication Counseling'],
    hasProcedure: false,
    visualType: 'pharmacy',
    grid: { x: 2, y: 18, w: 16, h: 12 },
    center: { x: 10, y: 24 },
    color: 'safe',
  },
  {
    id: 'room-103',
    number: '103',
    name: 'Emergency',
    floor: 'Ground Floor',
    floorIndex: 0,
    category: 'department',
    purpose: '24/7 emergency medical care for critical and urgent cases.',
    equipment: ['Trauma Beds', 'Cardiac Monitors', 'Resuscitation Equipment'],
    services: ['Emergency Triage', 'Critical Care', 'Ambulance Bay'],
    hasProcedure: false,
    visualType: 'emergency',
    grid: { x: 20, y: 2, w: 18, h: 14 },
    center: { x: 29, y: 9 },
    color: 'danger',
  },
  {
    id: 'room-104',
    number: '104',
    name: 'Waiting Area',
    floor: 'Ground Floor',
    floorIndex: 0,
    category: 'facility',
    purpose: 'Comfortable waiting area for patients and their families.',
    equipment: ['Seating', 'Water Dispenser', 'Display Boards'],
    services: ['Patient Waiting', 'Family Seating'],
    hasProcedure: false,
    visualType: 'waiting',
    grid: { x: 20, y: 18, w: 18, h: 10 },
    center: { x: 29, y: 23 },
    color: 'sky',
  },
  {
    id: 'room-105',
    number: '105',
    name: 'Nurse Station',
    floor: 'Ground Floor',
    floorIndex: 0,
    category: 'service',
    purpose: 'Central nurse coordination station for patient care management.',
    equipment: ['Nurse Console', 'Patient Call System', 'Medication Cart'],
    services: ['Patient Monitoring', 'Care Coordination', 'Medication Management'],
    hasProcedure: false,
    visualType: 'nurse',
    grid: { x: 40, y: 2, w: 14, h: 12 },
    center: { x: 47, y: 8 },
    color: 'medical',
  },
  {
    id: 'room-201',
    number: '201',
    name: 'X-Ray Room',
    floor: 'First Floor',
    floorIndex: 1,
    category: 'diagnostic',
    purpose: 'Diagnostic imaging using digital X-ray technology.',
    equipment: ['Digital X-Ray Machine', 'Lead Shielding', 'Image Processor'],
    services: ['Chest X-Ray', 'Bone X-Ray', 'Abdominal X-Ray'],
    hasProcedure: true,
    visualType: 'xray',
    grid: { x: 2, y: 2, w: 18, h: 16 },
    center: { x: 11, y: 10 },
    color: 'medical',
  },
  {
    id: 'room-202',
    number: '202',
    name: 'CT Scan',
    floor: 'First Floor',
    floorIndex: 1,
    category: 'diagnostic',
    purpose: 'Computed tomography scanning for detailed cross-sectional imaging.',
    equipment: ['CT Scanner', 'Contrast Injector', 'Reconstruction Workstation'],
    services: ['Head CT', 'Chest CT', 'Abdominal CT'],
    hasProcedure: true,
    visualType: 'ctscan',
    grid: { x: 22, y: 2, w: 18, h: 16 },
    center: { x: 31, y: 10 },
    color: 'medical',
  },
  {
    id: 'room-203',
    number: '203',
    name: 'MRI Room',
    floor: 'First Floor',
    floorIndex: 1,
    category: 'diagnostic',
    purpose: 'Magnetic resonance imaging for soft tissue and neurological diagnostics.',
    equipment: ['MRI Scanner', 'Coil System', 'Patient Monitoring'],
    services: ['Brain MRI', 'Spine MRI', 'Joint MRI'],
    hasProcedure: true,
    visualType: 'mri',
    grid: { x: 42, y: 2, w: 18, h: 16 },
    center: { x: 51, y: 10 },
    color: 'medical',
  },
  {
    id: 'room-204',
    number: '204',
    name: 'Laboratory',
    floor: 'First Floor',
    floorIndex: 1,
    category: 'diagnostic',
    purpose: 'Clinical laboratory for blood tests, urinalysis, and pathology.',
    equipment: ['Blood Analyzer', 'Microscope', 'Centrifuge', 'Sample Storage'],
    services: ['Complete Blood Count', 'Lipid Profile', 'Urinalysis', 'Thyroid Panel'],
    hasProcedure: true,
    visualType: 'lab',
    grid: { x: 2, y: 20, w: 20, h: 12 },
    center: { x: 12, y: 26 },
    color: 'warn',
  },
  {
    id: 'room-301',
    number: '301',
    name: 'Cardiology',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Heart and cardiovascular diagnostics, consultation, and treatment.',
    equipment: ['ECG Machine', 'Echocardiogram', 'Stress Test Equipment'],
    services: ['ECG', 'Echocardiography', 'Stress Testing', 'Cardiac Consultation'],
    hasProcedure: false,
    visualType: 'cardiology',
    grid: { x: 2, y: 2, w: 18, h: 14 },
    center: { x: 11, y: 9 },
    color: 'medical',
  },
  {
    id: 'room-302',
    number: '302',
    name: 'General Medicine',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Primary care and general medical consultations.',
    equipment: ['Examination Table', 'BP Monitor', 'Stethoscope', 'Ophthalmoscope'],
    services: ['General Consultation', 'Health Check-up', 'Chronic Disease Management'],
    hasProcedure: false,
    visualType: 'general',
    grid: { x: 22, y: 2, w: 18, h: 14 },
    center: { x: 31, y: 9 },
    color: 'navy',
  },
  {
    id: 'room-303',
    number: '303',
    name: 'Pediatrics',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Child health, vaccination, and developmental care.',
    equipment: ['Pediatric Examination Table', 'Weight Scale', 'Vaccination Storage'],
    services: ['Child Consultation', 'Vaccination', 'Growth Monitoring'],
    hasProcedure: false,
    visualType: 'pediatrics',
    grid: { x: 42, y: 2, w: 18, h: 14 },
    center: { x: 51, y: 9 },
    color: 'safe',
  },
  {
    id: 'room-304',
    number: '304',
    name: 'Dermatology',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Skin care, cosmetic dermatology, and skin cancer screening.',
    equipment: ['Dermatoscope', 'Exam Table', 'Phototherapy Unit'],
    services: ['Skin Consultation', 'Acne Treatment', 'Skin Cancer Screening'],
    hasProcedure: false,
    visualType: 'general',
    grid: { x: 62, y: 2, w: 14, h: 14 },
    center: { x: 69, y: 9 },
    color: 'navy',
  },
  {
    id: 'room-305',
    number: '305',
    name: 'Cardiology Consult',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Cardiology consultation room for Dr. Priya Sharma.',
    equipment: ['ECG Machine', 'Examination Table', 'BP Monitor'],
    services: ['Cardiac Consultation', 'ECG', 'Echocardiography'],
    hasProcedure: false,
    visualType: 'cardiology',
    grid: { x: 2, y: 20, w: 14, h: 14 },
    center: { x: 9, y: 27 },
    color: 'medical',
  },
  {
    id: 'room-306',
    number: '306',
    name: 'Neurology',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Neurology consultation and diagnostic services.',
    equipment: ['EEG Machine', 'Reflex Hammer', 'Exam Table'],
    services: ['Neurological Consultation', 'EEG', 'Stroke Assessment'],
    hasProcedure: false,
    visualType: 'general',
    grid: { x: 18, y: 20, w: 14, h: 14 },
    center: { x: 25, y: 27 },
    color: 'navy',
  },
  {
    id: 'room-307',
    number: '307',
    name: 'Pediatrics Consult',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Pediatric consultation room for Dr. Sanjay Gupta.',
    equipment: ['Pediatric Exam Table', 'Weight Scale', 'Vaccination Storage'],
    services: ['Child Consultation', 'Vaccination', 'Growth Monitoring'],
    hasProcedure: false,
    visualType: 'pediatrics',
    grid: { x: 34, y: 20, w: 14, h: 14 },
    center: { x: 41, y: 27 },
    color: 'safe',
  },
  {
    id: 'room-308',
    number: '308',
    name: 'Orthopedics',
    floor: 'Second Floor',
    floorIndex: 2,
    category: 'department',
    purpose: 'Orthopedic consultation and joint care.',
    equipment: ['X-Ray Viewer', 'Exam Table', 'Traction Equipment'],
    services: ['Orthopedic Consultation', 'Joint Assessment', 'Fracture Care'],
    hasProcedure: false,
    visualType: 'general',
    grid: { x: 50, y: 20, w: 14, h: 14 },
    center: { x: 57, y: 27 },
    color: 'navy',
  },
];

// ============================================================
// Health Reports
// ============================================================

export const HEALTH_REPORTS: HealthReport[] = [
  {
    id: 'report-1',
    type: 'Blood Test — Complete Blood Count',
    date: '12 Sep 2026',
    doctor: 'Dr. Ananya Rao',
    department: 'General Medicine',
    status: 'Normal',
    summary: 'All parameters within normal range. No abnormalities detected.',
    details: [
      { label: 'Hemoglobin', value: '14.2 g/dL', range: '13.0–17.0 g/dL', normal: true },
      { label: 'White Blood Cells', value: '6,800 /µL', range: '4,000–11,000 /µL', normal: true },
      { label: 'Platelets', value: '245,000 /µL', range: '150,000–450,000 /µL', normal: true },
      { label: 'Red Blood Cells', value: '4.9 M/µL', range: '4.2–5.9 M/µL', normal: true },
    ],
  },
  {
    id: 'report-2',
    type: 'X-Ray — Chest PA View',
    date: '05 Sep 2026',
    doctor: 'Dr. Priya Sharma',
    department: 'Cardiology',
    status: 'Normal',
    summary: 'Lung fields clear. Cardiac silhouette within normal limits. No active pathology.',
    details: [
      { label: 'Lung Fields', value: 'Clear', range: 'Clear', normal: true },
      { label: 'Cardiac Size', value: 'Normal', range: 'Normal', normal: true },
      { label: 'Costophrenic Angles', value: 'Sharp', range: 'Sharp', normal: true },
      { label: 'Bony Thorax', value: 'Intact', range: 'Intact', normal: true },
    ],
  },
  {
    id: 'report-3',
    type: 'Cardiology Report — Echocardiogram',
    date: '28 Aug 2026',
    doctor: 'Dr. Priya Sharma',
    department: 'Cardiology',
    status: 'Review Needed',
    summary: 'Mild mitral valve regurgitation noted. Overall cardiac function preserved. Recommend follow-up in 6 months.',
    details: [
      { label: 'Ejection Fraction', value: '62%', range: '55–70%', normal: true },
      { label: 'Mitral Valve', value: 'Mild Regurgitation', range: 'Normal', normal: false },
      { label: 'Aortic Valve', value: 'Normal', range: 'Normal', normal: true },
      { label: 'Left Atrium Size', value: '3.2 cm', range: '2.7–4.0 cm', normal: true },
    ],
  },
  {
    id: 'report-4',
    type: 'Lipid Profile',
    date: '20 Aug 2026',
    doctor: 'Dr. Ananya Rao',
    department: 'General Medicine',
    status: 'Review Needed',
    summary: 'LDL cholesterol slightly elevated. Dietary modifications recommended.',
    details: [
      { label: 'Total Cholesterol', value: '195 mg/dL', range: '< 200 mg/dL', normal: true },
      { label: 'LDL', value: '138 mg/dL', range: '< 130 mg/dL', normal: false },
      { label: 'HDL', value: '52 mg/dL', range: '> 40 mg/dL', normal: true },
      { label: 'Triglycerides', value: '120 mg/dL', range: '< 150 mg/dL', normal: true },
    ],
  },
  {
    id: 'report-5',
    type: 'Thyroid Panel',
    date: '15 Aug 2026',
    doctor: 'Dr. Ananya Rao',
    department: 'General Medicine',
    status: 'Normal',
    summary: 'Thyroid function within normal limits. No medication adjustment needed.',
    details: [
      { label: 'TSH', value: '2.1 µIU/mL', range: '0.4–4.0 µIU/mL', normal: true },
      { label: 'Free T4', value: '1.3 ng/dL', range: '0.8–1.8 ng/dL', normal: true },
      { label: 'Free T3', value: '3.2 pg/mL', range: '2.3–4.2 pg/mL', normal: true },
    ],
  },
];

// ============================================================
// Demo Appointment History
// ============================================================

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-demo-1',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Cardiology',
    department: 'Cardiology',
    roomNumber: '305',
    date: '12 Sep 2026',
    time: '10:30 AM',
    status: 'completed',
    createdAt: '10 Sep 2026',
  },
  {
    id: 'appt-demo-2',
    doctorName: 'Dr. Rahul Verma',
    specialty: 'Orthopedics',
    department: 'Orthopedics',
    roomNumber: '308',
    date: '28 Aug 2026',
    time: '02:00 PM',
    status: 'completed',
    createdAt: '25 Aug 2026',
  },
  {
    id: 'appt-demo-3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'General Medicine',
    department: 'General Medicine',
    roomNumber: '302',
    date: '15 Aug 2026',
    time: '01:00 PM',
    status: 'completed',
    createdAt: '12 Aug 2026',
  },
];

export const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem-demo-1',
    title: 'Doctor Appointment',
    description: 'Dr. Priya Sharma — Cardiology, Room 305',
    date: 'Today',
    time: '10:30 AM',
    leadTime: '30 min',
    type: 'appointment',
  },
  {
    id: 'rem-demo-2',
    title: 'X-Ray Appointment',
    description: 'Room 201 — Chest X-Ray',
    date: 'Tomorrow',
    time: '02:00 PM',
    leadTime: '1 hour',
    type: 'test',
  },
];

// ============================================================
// Navigation Data — Corridors, Waypoints, Route Building
// ============================================================

export interface NavWaypoint {
  x: number;
  y: number;
  floorIndex: number;
  label: string;
  instruction: string;
  distance: number;
}

// Corridor waypoint for each floor — the path runs through the main corridor
// The corridor is conceptually at y=15 (between top and bottom rooms) and x=50 (center vertical corridor)
const CORRIDOR_Y = 15;
const CORRIDOR_X = 50;

// Build a route from one room to another, generating waypoints with turn-by-turn instructions
export function buildNavRoute(
  fromRoom: HospitalRoom,
  toRoom: HospitalRoom
): NavWaypoint[] {
  const waypoints: NavWaypoint[] = [];

  // Start at the fromRoom center
  waypoints.push({
    x: fromRoom.center.x,
    y: fromRoom.center.y,
    floorIndex: fromRoom.floorIndex,
    label: fromRoom.name,
    instruction: `Start at ${fromRoom.name} (Room ${fromRoom.number})`,
    distance: 0,
  });

  // Exit to corridor — move to corridor Y on same X
  if (fromRoom.center.y < CORRIDOR_Y) {
    waypoints.push({
      x: fromRoom.center.x,
      y: CORRIDOR_Y,
      floorIndex: fromRoom.floorIndex,
      label: 'Main Corridor',
      instruction: 'Exit room and turn into the main corridor',
      distance: 5,
    });
  } else {
    waypoints.push({
      x: fromRoom.center.x,
      y: CORRIDOR_Y,
      floorIndex: fromRoom.floorIndex,
      label: 'Main Corridor',
      instruction: 'Exit room and turn into the main corridor',
      distance: 5,
    });
  }

  // If same floor, go directly along corridor to destination X, then to destination
  if (fromRoom.floorIndex === toRoom.floorIndex) {
    // Move along corridor to destination X
    if (Math.abs(fromRoom.center.x - toRoom.center.x) > 2) {
      waypoints.push({
        x: toRoom.center.x,
        y: CORRIDOR_Y,
        floorIndex: toRoom.floorIndex,
        label: 'Main Corridor',
        instruction: fromRoom.center.x < toRoom.center.x
          ? 'Continue straight down the corridor'
          : 'Continue back down the corridor',
        distance: 12,
      });
    }
    // Turn toward destination room
    const dir = toRoom.center.y < CORRIDOR_Y ? 'right' : 'left';
    waypoints.push({
      x: toRoom.center.x,
      y: toRoom.center.y,
      floorIndex: toRoom.floorIndex,
      label: toRoom.name,
      instruction: `Turn ${dir} and enter Room ${toRoom.number} — ${toRoom.name}`,
      distance: 8,
    });
  } else {
    // Different floor: go to elevator/stairs area (center of corridor)
    waypoints.push({
      x: CORRIDOR_X,
      y: CORRIDOR_Y,
      floorIndex: fromRoom.floorIndex,
      label: 'Elevator / Stairs',
      instruction: 'Proceed to the elevator and stairs area',
      distance: 15,
    });

    // Transition to destination floor
    const floorNames = ['Ground Floor', 'First Floor', 'Second Floor'];
    const dir = toRoom.floorIndex > fromRoom.floorIndex ? 'up' : 'down';
    waypoints.push({
      x: CORRIDOR_X,
      y: CORRIDOR_Y,
      floorIndex: toRoom.floorIndex,
      label: floorNames[toRoom.floorIndex],
      instruction: `Take the elevator ${dir} to the ${floorNames[toRoom.floorIndex]}`,
      distance: 10,
    });

    // Move along corridor to destination X
    if (Math.abs(CORRIDOR_X - toRoom.center.x) > 2) {
      waypoints.push({
        x: toRoom.center.x,
        y: CORRIDOR_Y,
        floorIndex: toRoom.floorIndex,
        label: 'Main Corridor',
        instruction: `Exit elevator, turn ${toRoom.center.x < CORRIDOR_X ? 'left' : 'right'} into the corridor`,
        distance: 12,
      });
    }

    // Enter destination room
    const enterDir = toRoom.center.y < CORRIDOR_Y ? 'right' : 'left';
    waypoints.push({
      x: toRoom.center.x,
      y: toRoom.center.y,
      floorIndex: toRoom.floorIndex,
      label: toRoom.name,
      instruction: `Turn ${enterDir} and enter Room ${toRoom.number} — ${toRoom.name}`,
      distance: 8,
    });
  }

  // Arrival
  waypoints.push({
    x: toRoom.center.x,
    y: toRoom.center.y,
    floorIndex: toRoom.floorIndex,
    label: 'Arrived',
    instruction: `You have arrived at Room ${toRoom.number} — ${toRoom.name}`,
    distance: 0,
  });

  return waypoints;
}

export function calculateTotalDistance(waypoints: NavWaypoint[]): number {
  return waypoints.reduce((sum, wp) => sum + wp.distance, 0);
}

export function estimateWalkingTime(totalDistance: number): string {
  // Average walking speed ~1.4 m/s, but simulated distances are small
  const minutes = Math.max(1, Math.ceil(totalDistance / 30));
  return `${minutes} min`;
}

export const FLOOR_LIST = [
  { name: 'Ground Floor', index: 0 },
  { name: 'First Floor', index: 1 },
  { name: 'Second Floor', index: 2 },
];

// Room image mapping — images uploaded in /public/hospital-rooms/
export const ROOM_IMAGES: Record<string, string> = {
  '101': '/hospital-rooms/101-reception.jpg',
  '102': '/hospital-rooms/102-pharmacy.jpg',
  '103': '/hospital-rooms/103-emergency.jpg',
  '104': '/hospital-rooms/104-waiting-area.jpg',
  '105': '/hospital-rooms/105-nurse-station.jpg',
  '201': '/hospital-rooms/201-xray.jpg',
  '202': '/hospital-rooms/202-ct-scan.jpg',
  '203': '/hospital-rooms/203-mri.jpg',
  '204': '/hospital-rooms/204-laboratory.jpg',
  '301': '/hospital-rooms/301-cardiology.jpg',
  '302': '/hospital-rooms/302-general-medicine..jpg',
  '303': '/hospital-rooms/303-pediatrics.jpg',
  '304': '/hospital-rooms/304-dermatology.jpg',
  '305': '/hospital-rooms/305-cardiology-consult.jpg',
  '306': '/hospital-rooms/306-neurology.jpg',
  '307': '/hospital-rooms/307-pediatrics-consult.jpg',
  '308': '/hospital-rooms/308-orthopedics.jpg',
};
