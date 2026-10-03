import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  DEMO_APPOINTMENTS,
  DEMO_REMINDERS,
  type Appointment,
  type Reminder,
} from '../data/hospitalData';

const APPT_KEY = 'mscare-hospital-appointments';
const REM_KEY = 'mscare-hospital-reminders';

function loadAppointments(): Appointment[] {
  if (typeof window === 'undefined') return DEMO_APPOINTMENTS;
  try {
    const stored = localStorage.getItem(APPT_KEY);
    if (!stored) {
      localStorage.setItem(APPT_KEY, JSON.stringify(DEMO_APPOINTMENTS));
      return DEMO_APPOINTMENTS;
    }
    return JSON.parse(stored) as Appointment[];
  } catch {
    return DEMO_APPOINTMENTS;
  }
}

function loadReminders(): Reminder[] {
  if (typeof window === 'undefined') return DEMO_REMINDERS;
  try {
    const stored = localStorage.getItem(REM_KEY);
    if (!stored) {
      localStorage.setItem(REM_KEY, JSON.stringify(DEMO_REMINDERS));
      return DEMO_REMINDERS;
    }
    return JSON.parse(stored) as Reminder[];
  } catch {
    return DEMO_REMINDERS;
  }
}

export interface HospitalContextValue {
  appointments: Appointment[];
  reminders: Reminder[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  nextAppointment: Appointment | null;
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  addReminder: (rem: Omit<Reminder, 'id'>) => void;
  removeReminder: (id: string) => void;
}

const HospitalContext = createContext<HospitalContextValue | null>(null);

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);
  const [reminders, setReminders] = useState<Reminder[]>(loadReminders);

  useEffect(() => {
    localStorage.setItem(APPT_KEY, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(REM_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addAppointment = useCallback((apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const newAppt: Appointment = {
      ...apt,
      id: `appt-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'upcoming',
    };
    setAppointments((prev) => [newAppt, ...prev]);
    return newAppt;
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) => {
      const appt = prev.find((a) => a.id === id);
      if (appt) {
        // Remove associated reminders matching this appointment
        setReminders((rems) => rems.filter((r) =>
          !(r.type === 'appointment' && r.description.includes(appt.roomNumber) && r.description.includes(appt.doctorName))
        ));
      }
      return prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
    });
  }, []);

  const completeAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'completed' as const } : a)));
  }, []);

  const addReminder = useCallback((rem: Omit<Reminder, 'id'>) => {
    const newRem: Reminder = { ...rem, id: `rem-${Date.now()}` };
    setReminders((prev) => [newRem, ...prev]);
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');
  const pastAppointments = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');
  const nextAppointment = upcomingAppointments[0] ?? null;

  const value: HospitalContextValue = {
    appointments,
    reminders,
    upcomingAppointments,
    pastAppointments,
    nextAppointment,
    addAppointment,
    cancelAppointment,
    completeAppointment,
    addReminder,
    removeReminder,
  };

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
}

export function useHospital(): HospitalContextValue {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider');
  return ctx;
}
