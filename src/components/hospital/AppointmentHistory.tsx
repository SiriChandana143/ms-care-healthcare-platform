import { useState } from 'react';
import {
  Calendar, Clock, MapPin, User, CheckCircle2, XCircle,
  ChevronRight, Navigation as NavIcon, Filter,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface AppointmentHistoryProps {
  onNavigate: (room: string) => void;
}

type FilterType = 'all' | 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function AppointmentHistory({ onNavigate }: AppointmentHistoryProps) {
  const hospital = useHospital();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = hospital.appointments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const statusConfig = {
    upcoming: { label: 'Upcoming', class: 'bg-medical-100 text-medical-700', icon: Clock },
    completed: { label: 'Completed', class: 'bg-safe-100 text-safe-700', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', class: 'bg-danger-100 text-danger-700', icon: XCircle },
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-medical-600" />
        <h2 className="text-lg font-bold font-display text-navy-900">Appointment History</h2>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-navy-400" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f.key
                ? 'bg-navy-900 text-white'
                : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-lg p-12 text-center">
            <Calendar className="w-12 h-12 text-navy-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-700">No appointments found</h3>
            <p className="text-sm text-navy-400 mt-1">No appointments match this filter.</p>
          </div>
        ) : (
          filtered.map((apt) => {
            const status = statusConfig[apt.status];
            const StatusIcon = status.icon;
            return (
              <div key={apt.id} className="card-lg p-5 hover:shadow-medium transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold font-display">
                        {apt.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy-900 text-sm">{apt.doctorName}</h3>
                      <p className="text-xs text-medical-600 font-medium">{apt.specialty}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-navy-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-navy-400">
                          <Clock className="w-3.5 h-3.5" />
                          {apt.time}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-navy-400">
                          <MapPin className="w-3.5 h-3.5" />
                          Room {apt.roomNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 ${status.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    {apt.status === 'upcoming' && (
                      <button
                        onClick={() => onNavigate(apt.roomNumber)}
                        className="text-xs text-medical-600 font-medium hover:underline flex items-center gap-1"
                      >
                        <NavIcon className="w-3 h-3" />
                        Navigate
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
