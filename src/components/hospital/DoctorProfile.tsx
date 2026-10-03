import { useState } from 'react';
import {
  ArrowLeft, MapPin, Clock, Star, Award, Briefcase, Calendar,
  CheckCircle2, Navigation as NavIcon, Stethoscope, Heart, Shield,
} from 'lucide-react';
import type { Doctor } from '../../data/hospitalData';

interface DoctorProfileProps {
  doctor: Doctor;
  onBack: () => void;
  onBook: (doctor: Doctor, slot: string) => void;
  onNavigate: (room: string) => void;
}

export function DoctorProfile({ doctor, onBack, onBook, onNavigate }: DoctorProfileProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </button>

      {/* Doctor header */}
      <div className="card-lg p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-medical-50/60 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-medium flex-shrink-0">
            <span className="text-white text-2xl font-bold font-display">
              {doctor.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-display text-navy-900">{doctor.name}</h1>
            <p className="text-medical-600 font-semibold mt-1">{doctor.specialty}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 text-warn-500 fill-warn-500" />
                <span className="font-semibold text-navy-700">{doctor.rating}</span>
                <span className="text-navy-400 text-xs">rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Briefcase className="w-4 h-4 text-navy-400" />
                <span className="text-navy-600">{doctor.experience}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-navy-400" />
                <span className="text-navy-600">Room {doctor.roomNumber} • {doctor.location}</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-safe-100 text-safe-700 flex-shrink-0">
            {doctor.availability}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Bio & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="card-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-medical-600" />
              <h3 className="text-sm font-bold text-navy-900">About</h3>
            </div>
            <p className="text-sm text-navy-500 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Qualifications */}
          <div className="card-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-medical-600" />
              <h3 className="text-sm font-bold text-navy-900">Qualification & Experience</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-navy-400">Qualification</span>
                <span className="text-sm font-semibold text-navy-700">{doctor.qualification}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-navy-400">Experience</span>
                <span className="text-sm font-semibold text-navy-700">{doctor.experience}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-navy-400">Department</span>
                <span className="text-sm font-semibold text-navy-700">{doctor.department}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="card-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-medical-600" />
              <h3 className="text-sm font-bold text-navy-900">Services</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Consultation', 'Diagnosis', 'Follow-up Care', 'Preventive Screening'].map((service) => (
                <div key={service} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-safe-600 flex-shrink-0" />
                  <span className="text-xs text-navy-600">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-medical-600" />
              <h3 className="text-sm font-bold text-navy-900">Available Slots</h3>
            </div>
            <div className="space-y-2 mb-5">
              {doctor.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    selectedSlot === slot
                      ? 'border-medical-500 bg-medical-50 shadow-soft'
                      : 'border-gray-200 hover:border-medical-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${selectedSlot === slot ? 'text-medical-600' : 'text-navy-400'}`} />
                    <span className={`text-sm font-semibold ${selectedSlot === slot ? 'text-medical-700' : 'text-navy-700'}`}>{slot}</span>
                  </div>
                  {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-medical-600" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedSlot && onBook(doctor, selectedSlot)}
              disabled={!selectedSlot}
              className="w-full btn-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" />
              {selectedSlot ? `Book ${selectedSlot}` : 'Select a Slot'}
            </button>
          </div>

          {/* Navigate */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <NavIcon className="w-4 h-4 text-medical-600" />
              <h3 className="text-sm font-semibold text-navy-700">Hospital Location</h3>
            </div>
            <p className="text-xs text-navy-400 mb-3">Room {doctor.roomNumber} — {doctor.location}</p>
            <button onClick={() => onNavigate(doctor.roomNumber)} className="w-full btn-secondary text-xs">
              <NavIcon className="w-3.5 h-3.5" />
              View Hospital Location
            </button>
          </div>

          {/* Safety note */}
          <div className="p-3 rounded-xl bg-medical-50 border border-medical-100 flex items-start gap-2">
            <Shield className="w-4 h-4 text-medical-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-medical-700 leading-relaxed">
              Demo data for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
