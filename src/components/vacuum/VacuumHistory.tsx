import { useState } from 'react';
import { useVacuum, MODE_LABELS, type CleanHistoryItem } from '@/context/VacuumContext';
import { CheckCircle2, Navigation, Clock, AlertCircle, X, Calendar, Wind } from 'lucide-react';

export function VacuumHistory() {
  const vac = useVacuum();
  const { state } = vac;
  const [selected, setSelected] = useState<CleanHistoryItem | null>(null);

  const totalSessions = state.history.length;
  const totalArea = state.history.reduce((sum, h) => sum + h.areaNum, 0);
  const totalTime = state.history.reduce((sum, h) => sum + h.durationSec, 0);
  const totalMins = Math.floor(totalTime / 60);
  const interrupted = state.history.filter((h) => h.status === 'interrupted').length;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-navy-900">Cleaning History</h1>
        <p className="text-navy-500 text-sm mt-1">Complete record of all cleaning sessions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-safe-500" />
            <span className="text-xs text-navy-400 font-medium">Total Sessions</span>
          </div>
          <div className="text-2xl font-bold font-display text-navy-900">{totalSessions}</div>
        </div>
        <div className="card-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-medical-500" />
            <span className="text-xs text-navy-400 font-medium">Total Area</span>
          </div>
          <div className="text-2xl font-bold font-display text-navy-900">{totalArea} m²</div>
        </div>
        <div className="card-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-medical-500" />
            <span className="text-xs text-navy-400 font-medium">Total Time</span>
          </div>
          <div className="text-2xl font-bold font-display text-navy-900">{totalMins} min</div>
        </div>
        <div className="card-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warn-500" />
            <span className="text-xs text-navy-400 font-medium">Interrupted</span>
          </div>
          <div className="text-2xl font-bold font-display text-warn-600">{interrupted}</div>
        </div>
      </div>

      {/* History table */}
      <div className="card-lg p-5 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-navy-400 py-3 px-3">Date</th>
                <th className="text-left text-xs font-semibold text-navy-400 py-3 px-3 hidden sm:table-cell">Time</th>
                <th className="text-left text-xs font-semibold text-navy-400 py-3 px-3">Duration</th>
                <th className="text-left text-xs font-semibold text-navy-400 py-3 px-3">Area</th>
                <th className="text-left text-xs font-semibold text-navy-400 py-3 px-3 hidden md:table-cell">Mode</th>
                <th className="text-left text-xs font-semibold text-navy-400 py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.history.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`border-b border-gray-50 cursor-pointer transition-colors ${
                    selected?.id === item.id ? 'bg-medical-50/50' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <td className="text-sm text-navy-700 py-3.5 px-3 font-medium">{item.date}</td>
                  <td className="text-sm text-navy-500 py-3.5 px-3 hidden sm:table-cell">{item.time}</td>
                  <td className="text-sm text-navy-600 py-3.5 px-3">{item.duration}</td>
                  <td className="text-sm text-navy-600 py-3.5 px-3">{item.area}</td>
                  <td className="text-sm text-navy-600 py-3.5 px-3 hidden md:table-cell">{MODE_LABELS[item.mode]}</td>
                  <td className="py-3.5 px-3">
                    <span className={`status-dot ${
                      item.status === 'completed' ? 'status-ready text-safe-600' : 'status-warn text-warn-600'
                    } text-xs font-medium`}>
                      {item.status === 'completed' ? 'Completed' : 'Interrupted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session detail panel */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-navy-900/30" onClick={() => setSelected(null)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl animate-slide-in max-h-[80vh] overflow-y-auto">
            <div className="max-w-2xl mx-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold font-display text-navy-900">Session Details</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selected.status === 'completed' ? 'bg-safe-50' : 'bg-warn-50'
                  }`}>
                    {selected.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-safe-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warn-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-900">{MODE_LABELS[selected.mode]}</div>
                    <div className="text-xs text-navy-400">{selected.date} at {selected.time}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-navy-400" />
                      <span className="text-xs text-navy-400 font-medium">Duration</span>
                    </div>
                    <div className="text-lg font-bold text-navy-900">{selected.duration}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Navigation className="w-3.5 h-3.5 text-navy-400" />
                      <span className="text-xs text-navy-400 font-medium">Area Cleaned</span>
                    </div>
                    <div className="text-lg font-bold text-navy-900">{selected.area}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-navy-400" />
                      <span className="text-xs text-navy-400 font-medium">Date</span>
                    </div>
                    <div className="text-sm font-semibold text-navy-700">{selected.date}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Wind className="w-3.5 h-3.5 text-navy-400" />
                      <span className="text-xs text-navy-400 font-medium">Mode</span>
                    </div>
                    <div className="text-sm font-semibold text-navy-700">{MODE_LABELS[selected.mode]}</div>
                  </div>
                </div>

                <div className="rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-400">Status</span>
                    <span className={`status-dot ${
                      selected.status === 'completed' ? 'status-ready text-safe-600' : 'status-warn text-warn-600'
                    } text-sm font-medium`}>
                      {selected.status === 'completed' ? 'Completed successfully' : 'Interrupted'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
