import { useState, useEffect } from 'react';
import {
  Activity, Home, LayoutDashboard, Stethoscope, FileText,
  History, Bell,
} from 'lucide-react';
import { HospitalProvider, useHospital } from '../context/HospitalContext';
import { HospitalDashboard } from '../components/hospital/HospitalDashboard';
import { FindDoctor } from '../components/hospital/FindDoctor';
import { DoctorProfile } from '../components/hospital/DoctorProfile';
import { BookingConfirmation } from '../components/hospital/BookingConfirmation';
import { HealthReports } from '../components/hospital/HealthReports';
import { AppointmentHistory } from '../components/hospital/AppointmentHistory';
import { Reminders } from '../components/hospital/Reminders';
import type { Doctor } from '../data/hospitalData';

interface HospitalPageProps {
  onSwitchMode: () => void;
  onNavigateToRoom?: (room: string) => void;
  initialRoom?: string | null;
}

type Tab = 'dashboard' | 'find-doctor' | 'doctor-profile' | 'booking' | 'reports' | 'history' | 'reminders';

const TABS: { key: Tab; label: string; icon: typeof Stethoscope }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'find-doctor', label: 'Find Doctor', icon: Stethoscope },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'history', label: 'Appointments', icon: History },
  { key: 'reminders', label: 'Reminders', icon: Bell },
];

function HospitalContent({ onSwitchMode, onNavigateToRoom, initialRoom }: HospitalPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [navigateRoom, setNavigateRoom] = useState<string | null>(null);

  // Handle incoming navigation request from App (e.g. "Navigate to Room 305")
  useEffect(() => {
    if (initialRoom) {
      setNavigateRoom(initialRoom);
    }
  }, [initialRoom]);

  const handleNavigate = (tab: string, data?: unknown) => {
    if (tab === 'navigation') {
      const roomData = data as { room?: string } | undefined;
      const room = roomData?.room ?? navigateRoom;
      if (onNavigateToRoom) {
        onNavigateToRoom(room ?? '');
      }
      return;
    }
    setActiveTab(tab as Tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setActiveTab('doctor-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBook = (doctor: Doctor, slot: string) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(slot);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRoom = (room: string) => {
    if (onNavigateToRoom) {
      onNavigateToRoom(room);
    }
  };

  const handleBackFromDoctor = () => {
    setActiveTab('find-doctor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromBooking = () => {
    if (selectedDoctor) {
      setActiveTab('doctor-profile');
    } else {
      setActiveTab('find-doctor');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hospital = useHospital();
  const reminderCount = hospital.reminders.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-soft">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold font-display text-navy-900 leading-none">Ms.care</div>
                <div className="text-[10px] text-medical-500 font-medium tracking-wide leading-none mt-0.5">Hospital</div>
              </div>
            </div>

            {/* Desktop tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key || (tab.key === 'find-doctor' && (activeTab === 'doctor-profile' || activeTab === 'booking'))
                      ? 'bg-navy-900 text-white shadow-soft'
                      : 'text-navy-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.key === 'reminders' && reminderCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warn-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {reminderCount > 9 ? '9+' : reminderCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Switch mode */}
            <button
              onClick={onSwitchMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-gray-50 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          </div>

          {/* Mobile tabs */}
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key || (tab.key === 'find-doctor' && (activeTab === 'doctor-profile' || activeTab === 'booking'))
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 bg-gray-50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.key === 'reminders' && reminderCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warn-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {reminderCount > 9 ? '9+' : reminderCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <HospitalDashboard onNavigate={handleNavigate} />}
        {activeTab === 'find-doctor' && <FindDoctor onSelectDoctor={handleSelectDoctor} />}
        {activeTab === 'doctor-profile' && selectedDoctor && (
          <DoctorProfile
            doctor={selectedDoctor}
            onBack={handleBackFromDoctor}
            onBook={handleBook}
            onNavigate={handleNavigateToRoom}
          />
        )}
        {activeTab === 'booking' && selectedDoctor && selectedSlot && (
          <BookingConfirmation
            doctor={selectedDoctor}
            slot={selectedSlot}
            onBack={handleBackFromBooking}
            onViewAppointment={handleBookingConfirmed}
            onNavigate={handleNavigateToRoom}
          />
        )}
        {activeTab === 'reports' && <HealthReports />}
        {activeTab === 'history' && <AppointmentHistory onNavigate={handleNavigateToRoom} />}
        {activeTab === 'reminders' && <Reminders />}
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
                <div className="text-sm font-bold font-display text-navy-900">Ms.care Hospital</div>
                <div className="text-[10px] text-navy-400">Demo data for demonstration purposes</div>
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
    </div>
  );
}

export function HospitalPage({ onSwitchMode, onNavigateToRoom, initialRoom }: HospitalPageProps) {
  return (
    <HospitalProvider>
      <HospitalContent onSwitchMode={onSwitchMode} onNavigateToRoom={onNavigateToRoom} initialRoom={initialRoom} />
    </HospitalProvider>
  );
}
