import { useState } from 'react';
import {
  CheckCircle2, Calendar, Clock, MapPin, User, Navigation as NavIcon,
  ArrowRight, ArrowLeft, Stethoscope,
} from 'lucide-react';
import type { Doctor } from '../../data/hospitalData';
import { useHospital } from '../../context/HospitalContext';

interface BookingConfirmationProps {
  doctor: Doctor;
  slot: string;
  onBack: () => void;
  onViewAppointment: () => void;
  onNavigate: (room: string) => void;
}

export function BookingConfirmation({ doctor, slot, onBack, onViewAppointment, onNavigate }: BookingConfirmationProps) {
  const hospital = useHospital();
  const [confirmed, setConfirmed] = useState(false);

  if (!confirmed) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="card-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold font-display text-navy-900 mb-2">Confirm Appointment</h1>
          <p className="text-sm text-navy-400 mb-6">Review the details below and confirm your booking.</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><User className="w-4 h-4" />Doctor</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.name}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><Stethoscope className="w-4 h-4" />Department</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.department}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><Calendar className="w-4 h-4" />Date</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.availability === 'Today' ? 'Today' : doctor.availability === 'Tomorrow' ? 'Tomorrow' : 'This Week'}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><Clock className="w-4 h-4" />Time</span>
              <span className="text-sm font-semibold text-navy-700">{slot}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><MapPin className="w-4 h-4" />Room</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.roomNumber}</span>
            </div>
          </div>

          <button
            onClick={() => {
              hospital.addAppointment({
                doctorName: doctor.name,
                specialty: doctor.specialty,
                department: doctor.department,
                roomNumber: doctor.roomNumber,
                date: doctor.availability === 'Today' ? 'Today' : doctor.availability === 'Tomorrow' ? 'Tomorrow' : 'This Week',
                time: slot,
              });
              hospital.addReminder({
                title: 'Doctor Appointment',
                description: `${doctor.name} — ${doctor.specialty}, Room ${doctor.roomNumber}`,
                date: doctor.availability === 'Today' ? 'Today' : doctor.availability === 'Tomorrow' ? 'Tomorrow' : 'This Week',
                time: slot,
                leadTime: '30 min',
                type: 'appointment',
              });
              setConfirmed(true);
            }}
            className="w-full btn-accent"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="card-lg p-6 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-safe-50 blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Success checkmark */}
          <div className="w-20 h-20 rounded-full bg-safe-500 flex items-center justify-center mx-auto mb-5 animate-scale-in shadow-large">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-2xl font-bold font-display text-navy-900">Appointment Confirmed</h1>
          <p className="text-sm text-navy-400 mt-1">Your appointment has been successfully booked.</p>

          {/* Confirmation details */}
          <div className="mt-8 text-left space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><User className="w-4 h-4" />Doctor</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.name}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><Stethoscope className="w-4 h-4" />Department</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.department}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><Clock className="w-4 h-4" />Time</span>
              <span className="text-sm font-semibold text-navy-700">{slot}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="text-sm text-navy-400 flex items-center gap-2"><MapPin className="w-4 h-4" />Room</span>
              <span className="text-sm font-semibold text-navy-700">{doctor.roomNumber}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
            <button onClick={onViewAppointment} className="btn-secondary flex-1">
              <Calendar className="w-4 h-4" />
              View Appointment
            </button>
            <button onClick={() => onNavigate(doctor.roomNumber)} className="btn-accent flex-1">
              <NavIcon className="w-4 h-4" />
              Navigate to Room {doctor.roomNumber}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
