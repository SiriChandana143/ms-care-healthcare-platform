import { useState } from 'react';
import { useVacuum, MODE_LABELS, type CleanMode, type ScheduleItem } from '@/context/VacuumContext';
import { Calendar, Plus, Pencil, Trash2, X, Moon, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MODE_KEYS: CleanMode[] = ['auto', 'spot', 'edge', 'quiet'];

interface EditState {
  id: string | null;
  day: string;
  time: string;
  mode: CleanMode;
  isSleepPreset: boolean;
}

export function VacuumSchedule() {
  const vac = useVacuum();
  const { state, toggleSchedule, addSchedule, updateSchedule, deleteSchedule } = vac;

  const [showForm, setShowForm] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    id: null,
    day: 'Monday',
    time: '09:00',
    mode: 'auto',
    isSleepPreset: false,
  });

  const openAdd = () => {
    setEditState({ id: null, day: 'Monday', time: '09:00', mode: 'auto', isSleepPreset: false });
    setShowForm(true);
  };

  const openEdit = (sched: ScheduleItem) => {
    setEditState({
      id: sched.id,
      day: sched.day,
      time: sched.time,
      mode: sched.mode,
      isSleepPreset: sched.isSleepPreset ?? false,
    });
    setShowForm(true);
  };

  const openSleepPreset = () => {
    setEditState({ id: null, day: 'Every Night', time: '23:00', mode: 'quiet', isSleepPreset: true });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editState.id) {
      updateSchedule(editState.id, {
        day: editState.day,
        time: editState.time,
        mode: editState.mode,
        isSleepPreset: editState.isSleepPreset,
      });
    } else {
      addSchedule({
        day: editState.day,
        time: editState.time,
        mode: editState.mode,
        enabled: true,
        isSleepPreset: editState.isSleepPreset,
      });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteSchedule(id);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">Cleaning Schedule</h1>
          <p className="text-navy-500 text-sm mt-1">Automated cleaning at your preferred times</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openSleepPreset} className="btn-secondary text-xs">
            <Moon className="w-3.5 h-3.5" />
            Sleep Cleaning
          </button>
          <button onClick={openAdd} className="btn-accent text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Schedule list */}
      <div className="space-y-3">
        {state.schedules.length === 0 && (
          <div className="card-lg p-8 text-center">
            <Calendar className="w-10 h-10 text-navy-200 mx-auto mb-3" />
            <p className="text-sm text-navy-400">No schedules yet. Add one to automate cleaning.</p>
          </div>
        )}

        {state.schedules.map((sched) => (
          <div
            key={sched.id}
            className={`card-lg p-5 flex items-center justify-between transition-all ${
              sched.enabled ? '' : 'opacity-50'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                sched.isSleepPreset ? 'bg-navy-50' : sched.enabled ? 'bg-medical-50' : 'bg-gray-100'
              }`}>
                {sched.isSleepPreset ? (
                  <Moon className={`w-5 h-5 ${sched.enabled ? 'text-navy-600' : 'text-navy-400'}`} />
                ) : (
                  <Calendar className={`w-5 h-5 ${sched.enabled ? 'text-medical-600' : 'text-navy-400'}`} />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-navy-900 truncate">
                  {sched.day} <span className="text-navy-400">at</span> {sched.time}
                </div>
                <div className="text-xs text-navy-400 mt-0.5 flex items-center gap-1.5">
                  {sched.isSleepPreset && <Moon className="w-3 h-3" />}
                  {MODE_LABELS[sched.mode]}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => openEdit(sched)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(sched.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-danger-50 hover:text-danger-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSchedule(sched.id)}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  sched.enabled ? 'bg-medical-500' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-all ${
                    sched.enabled ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-medical-50 border border-medical-100">
        <p className="text-xs text-medical-700 leading-relaxed">
          Scheduled cleans run automatically when the robot is docked and charged above the auto-charge threshold.
          You can enable or disable individual schedules at any time.
        </p>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-navy-900/30" onClick={() => setShowForm(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl animate-slide-in max-h-[85vh] overflow-y-auto">
            <div className="max-w-lg mx-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display text-navy-900">
                  {editState.id ? 'Edit Schedule' : editState.isSleepPreset ? 'Sleep Cleaning Preset' : 'Add Schedule'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {editState.isSleepPreset && (
                  <div className="p-3 rounded-xl bg-navy-50 border border-navy-100 flex items-center gap-2.5">
                    <Moon className="w-4 h-4 text-navy-500 flex-shrink-0" />
                    <p className="text-xs text-navy-600 leading-relaxed">
                      Sleep Cleaning runs quietly during night-time hours for undisturbed cleaning.
                    </p>
                  </div>
                )}

                {/* Day */}
                <div>
                  <label className="text-xs font-semibold text-navy-400 mb-2 block">Day</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {DAYS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setEditState((prev) => ({ ...prev, day: d }))}
                        className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                          editState.day === d
                            ? 'bg-navy-900 text-white'
                            : 'bg-gray-50 text-navy-600 hover:bg-gray-100'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    ))}
                    {editState.isSleepPreset && (
                      <button
                        onClick={() => setEditState((prev) => ({ ...prev, day: 'Every Night' }))}
                        className={`px-2 py-2 rounded-lg text-xs font-medium transition-all col-span-4 sm:col-span-7 ${
                          editState.day === 'Every Night'
                            ? 'bg-navy-900 text-white'
                            : 'bg-gray-50 text-navy-600 hover:bg-gray-100'
                        }`}
                      >
                        Every Night
                      </button>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-xs font-semibold text-navy-400 mb-2 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={editState.time}
                    onChange={(e) => setEditState((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-navy-900 focus:outline-none focus:border-medical-400 transition-colors"
                  />
                </div>

                {/* Mode */}
                <div>
                  <label className="text-xs font-semibold text-navy-400 mb-2 block">Cleaning Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MODE_KEYS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setEditState((prev) => ({ ...prev, mode: m }))}
                        disabled={editState.isSleepPreset && m !== 'quiet'}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left disabled:opacity-40 ${
                          editState.mode === m
                            ? 'bg-medical-50 border-2 border-medical-400 text-navy-900'
                            : 'bg-gray-50 border-2 border-transparent text-navy-600 hover:bg-gray-100'
                        }`}
                      >
                        {MODE_LABELS[m]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-accent flex-1">
                    {editState.id ? 'Save Changes' : 'Add Schedule'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
