import { useState } from 'react';
import {
  Bell, Clock, Calendar, Trash2, Plus, CheckCircle2,
  AlertCircle, BellRing,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

const LEAD_TIMES = ['10 min', '30 min', '1 hour', '1 day'] as const;
type LeadTime = typeof LEAD_TIMES[number];

export function Reminders() {
  const hospital = useHospital();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('');
  const [leadTime, setLeadTime] = useState<LeadTime>('30 min');

  const typeIcon: Record<string, typeof Bell> = {
    appointment: Calendar,
    test: AlertCircle,
    general: Bell,
  };

  const typeColor: Record<string, string> = {
    appointment: 'bg-medical-100 text-medical-600',
    test: 'bg-warn-100 text-warn-600',
    general: 'bg-navy-100 text-navy-600',
  };

  const handleAdd = () => {
    if (!title.trim() || !time.trim()) return;
    hospital.addReminder({
      title: title.trim(),
      description: description.trim() || 'No description',
      date,
      time: time.trim(),
      leadTime,
      type: 'general',
    });
    setTitle('');
    setDescription('');
    setTime('');
    setShowAdd(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-warn-600" />
          <h2 className="text-lg font-bold font-display text-navy-900">Reminders</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-accent text-xs">
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      {/* Add reminder form */}
      {showAdd && (
        <div className="card-lg p-5 animate-scale-in">
          <h3 className="text-sm font-bold text-navy-900 mb-4">New Reminder</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-navy-400 font-medium mb-1.5 block">Title</label>
              <input
                type="text"
                placeholder="e.g. Doctor Appointment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-navy-700 focus:outline-none focus:border-medical-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-navy-400 font-medium mb-1.5 block">Description</label>
              <input
                type="text"
                placeholder="e.g. Dr. Priya — Cardiology"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-navy-700 focus:outline-none focus:border-medical-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-navy-400 font-medium mb-1.5 block">Date</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-navy-700 bg-white"
              >
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This Week</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-navy-400 font-medium mb-1.5 block">Time</label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-navy-700 focus:outline-none focus:border-medical-400 transition-all"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-navy-400 font-medium mb-1.5 block">Remind Me Before</label>
            <div className="flex flex-wrap gap-2">
              {LEAD_TIMES.map((lt) => (
                <button
                  key={lt}
                  onClick={() => setLeadTime(lt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    leadTime === lt
                      ? 'bg-medical-600 text-white'
                      : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
                  }`}
                >
                  {lt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-accent text-xs flex-1">
              <CheckCircle2 className="w-4 h-4" />
              Save Reminder
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminder list */}
      <div className="space-y-3">
        {hospital.reminders.length === 0 ? (
          <div className="card-lg p-12 text-center">
            <BellRing className="w-12 h-12 text-navy-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-700">No Reminders</h3>
            <p className="text-sm text-navy-400 mt-1">Add a reminder to get notified about upcoming appointments.</p>
          </div>
        ) : (
          hospital.reminders.map((rem) => {
            const Icon = typeIcon[rem.type] ?? Bell;
            return (
              <div key={rem.id} className="card-lg p-5 flex items-start gap-4 group hover:shadow-medium transition-all">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${typeColor[rem.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy-900 text-sm">{rem.title}</h3>
                  <p className="text-xs text-navy-500 mt-0.5">{rem.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-navy-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {rem.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-navy-400">
                      <Clock className="w-3.5 h-3.5" />
                      {rem.time}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-warn-50 text-warn-600 border border-warn-100">
                      Remind {rem.leadTime} before
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => hospital.removeReminder(rem.id)}
                  className="p-2 rounded-lg text-navy-300 hover:text-danger-600 hover:bg-danger-50 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Demo note */}
      <div className="p-3 rounded-xl bg-medical-50 border border-medical-100 flex items-start gap-2">
        <Bell className="w-4 h-4 text-medical-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-medical-700 leading-relaxed">
          Reminders are simulated for demonstration. No real push notifications are sent.
        </p>
      </div>
    </div>
  );
}
