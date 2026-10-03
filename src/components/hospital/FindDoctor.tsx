import { useState, useMemo } from 'react';
import { Search, Stethoscope, MapPin, Clock, Star, ArrowRight, Calendar } from 'lucide-react';
import {
  DOCTORS, SPECIALTIES, AVAILABILITY_FILTERS,
  type Doctor,
} from '../../data/hospitalData';

interface FindDoctorProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

export function FindDoctor({ onSelectDoctor }: FindDoctorProps) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [availability, setAvailability] = useState('All');

  const filtered = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesSearch = search === '' ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialty === 'All' || doc.specialty === specialty;
      const matchesAvailability = availability === 'All' || doc.availability === availability;
      return matchesSearch && matchesSpecialty && matchesAvailability;
    });
  }, [search, specialty, availability]);

  const availColor: Record<string, string> = {
    Today: 'bg-safe-100 text-safe-700',
    Tomorrow: 'bg-medical-100 text-medical-700',
    'This Week': 'bg-navy-100 text-navy-700',
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Search & Filters */}
      <div className="card-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-medical-600" />
          <h2 className="text-lg font-bold font-display text-navy-900">Find a Doctor</h2>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-700 bg-white focus:outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100 transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-navy-400 font-medium mb-1.5 block">Specialty</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    specialty === spec
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-navy-400 font-medium mb-1.5 block">Availability</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_FILTERS.map((avail) => (
                <button
                  key={avail}
                  onClick={() => setAvailability(avail)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    availability === avail
                      ? 'bg-medical-600 text-white'
                      : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
                  }`}
                >
                  {avail}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-navy-500">
          {filtered.length} {filtered.length === 1 ? 'doctor' : 'doctors'} found
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="card-lg p-5 hover:shadow-large transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-soft">
                  <span className="text-white text-sm font-bold font-display">
                    {doc.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-sm leading-tight">{doc.name}</h3>
                  <p className="text-xs text-medical-600 font-medium mt-0.5">{doc.specialty}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${availColor[doc.availability]}`}>
                {doc.availability}
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-navy-500">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                Room {doc.roomNumber} • {doc.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-navy-500">
                <Star className="w-3.5 h-3.5 text-warn-500 fill-warn-500" />
                {doc.rating} • {doc.experience} experience
              </div>
              <div className="flex items-center gap-2 text-xs text-navy-500">
                <Clock className="w-3.5 h-3.5 text-navy-400" />
                {doc.slots.length} slots available
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSelectDoctor(doc)}
                className="flex-1 btn-secondary text-xs"
              >
                View Profile
              </button>
              <button
                onClick={() => onSelectDoctor(doc)}
                className="flex-1 btn-accent text-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-lg p-12 text-center">
          <Search className="w-12 h-12 text-navy-200 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-700">No doctors found</h3>
          <p className="text-sm text-navy-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
