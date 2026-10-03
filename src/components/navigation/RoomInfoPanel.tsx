import {
  X, MapPin, Building2, Wrench, Stethoscope, Navigation as NavIcon,
  Play, Layers,
} from 'lucide-react';
import type { HospitalRoom } from '../../data/hospitalData';
import { RoomVisual } from './RoomVisual';

interface RoomInfoPanelProps {
  room: HospitalRoom;
  onClose: () => void;
  onViewProcedure: (room: HospitalRoom) => void;
  onGetDirections: (room: HospitalRoom) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  diagnostic: 'Diagnostic Imaging',
  department: 'Medical Department',
  service: 'Hospital Service',
  facility: 'Hospital Facility',
};

export function RoomInfoPanel({ room, onClose, onViewProcedure, onGetDirections }: RoomInfoPanelProps) {
  return (
    <div className="card-lg p-0 overflow-hidden animate-slide-in">
      {/* Room visual image */}
      <RoomVisual room={room} className="w-full" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-soft">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-medical-600 tracking-wide">ROOM {room.number}</div>
              <h2 className="text-lg font-bold font-display text-navy-900 leading-tight">{room.name}</h2>
              <p className="text-xs text-navy-400 mt-0.5">{room.floor} • {CATEGORY_LABELS[room.category]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-gray-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Purpose */}
        <div className="p-3 rounded-xl bg-gray-50 mb-3">
          <h3 className="text-[10px] font-bold text-navy-400 uppercase tracking-wide mb-1">Purpose</h3>
          <p className="text-xs text-navy-600 leading-relaxed">{room.purpose}</p>
        </div>

        {/* Equipment */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-3.5 h-3.5 text-medical-600" />
            <h3 className="text-xs font-bold text-navy-900">Equipment</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.equipment.map((item) => (
              <span key={item} className="px-2.5 py-1 rounded-lg bg-medical-50 border border-medical-100 text-[10px] font-medium text-medical-700">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-medical-600" />
            <h3 className="text-xs font-bold text-navy-900">Services</h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {room.services.map((service) => (
              <div key={service} className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50">
                <div className="w-1 h-1 rounded-full bg-medical-500 flex-shrink-0" />
                <span className="text-[10px] text-navy-600">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 border border-sky-100 mb-4">
          <Layers className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
          <p className="text-[10px] text-sky-700">
            Location: {room.floor} as shown on the demo map.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {room.hasProcedure && (
            <button
              onClick={() => onViewProcedure(room)}
              className="btn-accent text-xs"
            >
              <Play className="w-3.5 h-3.5" />
              View Procedure
            </button>
          )}
          <button
            onClick={() => onGetDirections(room)}
            className={room.hasProcedure ? "btn-secondary text-xs" : "btn-accent text-xs"}
          >
            <NavIcon className="w-3.5 h-3.5" />
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}
