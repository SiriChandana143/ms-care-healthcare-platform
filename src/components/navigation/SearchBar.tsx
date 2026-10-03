import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, MapPin, Stethoscope, Building2 } from 'lucide-react';
import { HOSPITAL_ROOMS, DOCTORS, type HospitalRoom } from '../../data/hospitalData';

interface SearchBarProps {
  onSelectRoom: (room: HospitalRoom) => void;
}

interface SearchResult {
  type: 'room' | 'doctor';
  room: HospitalRoom;
  label: string;
  sublabel: string;
}

export function SearchBar({ onSelectRoom }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 1) return [];

    const q = query.toLowerCase();
    const roomResults: SearchResult[] = HOSPITAL_ROOMS
      .filter((room) =>
        room.name.toLowerCase().includes(q) ||
        room.number.includes(q) ||
        room.category.toLowerCase().includes(q) ||
        room.services.some((s) => s.toLowerCase().includes(q))
      )
      .map((room) => ({
        type: 'room' as const,
        room,
        label: `Room ${room.number} — ${room.name}`,
        sublabel: `${room.floor} • ${room.services.slice(0, 2).join(', ')}`,
      }));

    const doctorResults: SearchResult[] = DOCTORS
      .filter((doc) =>
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q)
      )
      .map((doc) => {
        const room = HOSPITAL_ROOMS.find((r) => r.number === doc.roomNumber);
        if (!room) return null;
        return {
          type: 'doctor' as const,
          room,
          label: doc.name,
          sublabel: `${doc.specialty} • Room ${doc.roomNumber}`,
        };
      })
      .filter((r): r is SearchResult => r !== null);

    return [...roomResults, ...doctorResults].slice(0, 8);
  }, [query]);

  // Close results on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelectRoom(result.room);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          placeholder="Search room, doctor, department or service..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-navy-700 bg-white shadow-soft focus:outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-30 top-full mt-2 w-full bg-white rounded-xl shadow-large border border-gray-100 overflow-hidden max-h-80 overflow-y-auto animate-fade-in">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-all text-left border-b border-gray-50 last:border-0"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                result.type === 'doctor' ? 'bg-medical-50' : 'bg-navy-50'
              }`}>
                {result.type === 'doctor' ? (
                  <Stethoscope className="w-4 h-4 text-medical-600" />
                ) : (
                  <Building2 className="w-4 h-4 text-navy-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-navy-900 truncate">{result.label}</div>
                <div className="text-xs text-navy-400 truncate">{result.sublabel}</div>
              </div>
              <MapPin className="w-3.5 h-3.5 text-navy-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {showResults && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-30 top-full mt-2 w-full bg-white rounded-xl shadow-large border border-gray-100 p-6 text-center animate-fade-in">
          <Search className="w-8 h-8 text-navy-200 mx-auto mb-2" />
          <p className="text-sm text-navy-500">No results found</p>
          <p className="text-xs text-navy-400 mt-0.5">Try searching for a room number, doctor name, or service</p>
        </div>
      )}
    </div>
  );
}
