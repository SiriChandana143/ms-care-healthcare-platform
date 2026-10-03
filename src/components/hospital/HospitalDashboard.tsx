import { useState } from 'react';
import {
  Calendar, Clock, User, MapPin, ArrowRight, Stethoscope,
  FileText, Bell, History, Plus, Navigation as NavIcon,
  XCircle, AlertCircle, CheckCircle2, X,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface HospitalDashboardProps {
  onNavigate: (tab: string, data?: unknown) => void;
}

export function HospitalDashboard({ onNavigate }: HospitalDashboardProps) {
  const hospital = useHospital();
  const next = hospital.nextAppointment;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCancelConfirm = () => {
    if (next) {
      hospital.cancelAppointment(next.id);
      setShowCancelDialog(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Upcoming Appointment Hero */}
      <div className="card-lg p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-medical-50/60 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-medical-600" />
            <span className="text-xs font-bold text-medical-600 tracking-wide uppercase">Upcoming Appointment</span>
          </div>
          {next ? (
            <>
              <h2 className="text-2xl font-bold font-display text-navy-900 mt-2">{next.doctorName}</h2>
              <p className="text-medical-600 font-semibold text-sm mt-0.5">{next.specialty}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-navy-400" />
                  <div>
                    <div className="text-[10px] text-navy-400">Date</div>
                    <div className="text-sm font-semibold text-navy-700">{next.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy-400" />
                  <div>
                    <div className="text-[10px] text-navy-400">Time</div>
                    <div className="text-sm font-semibold text-navy-700">{next.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-navy-400" />
                  <div>
                    <div className="text-[10px] text-navy-400">Room</div>
                    <div className="text-sm font-semibold text-navy-700">{next.roomNumber}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-navy-400" />
                  <div>
                    <div className="text-[10px] text-navy-400">Department</div>
                    <div className="text-sm font-semibold text-navy-700">{next.department}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => onNavigate('history')} className="btn-secondary">
                  <Calendar className="w-4 h-4" />
                  View Appointment
                </button>
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="btn-secondary text-danger-600 hover:bg-danger-50 border-danger-200"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Appointment
                </button>
                <button onClick={() => onNavigate('navigation', { room: next.roomNumber })} className="btn-accent">
                  <NavIcon className="w-4 h-4" />
                  Navigate to Room {next.roomNumber}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold font-display text-navy-700 mt-2">No Upcoming Appointments</h2>
              <p className="text-navy-400 text-sm mt-1">Find a doctor and book your next visit.</p>
              <button onClick={() => onNavigate('find-doctor')} className="btn-accent mt-5">
                <Stethoscope className="w-4 h-4" />
                Find a Doctor
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('find-doctor')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center mb-3">
            <Stethoscope className="w-5 h-5 text-medical-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Find a Doctor</h3>
          <p className="text-xs text-navy-500 mt-1">Search by specialty, department, or availability</p>
          <div className="flex items-center gap-1 text-medical-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
            Search <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('find-doctor')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-safe-50 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-safe-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Book Appointment</h3>
          <p className="text-xs text-navy-500 mt-1">Schedule a visit with available doctors</p>
          <div className="flex items-center gap-1 text-safe-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
            Book <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Health Reports</h3>
          <p className="text-xs text-navy-500 mt-1">View lab tests and diagnostic reports</p>
          <div className="flex items-center gap-1 text-sky-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
            View <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
            <History className="w-5 h-5 text-navy-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Appointment History</h3>
          <p className="text-xs text-navy-500 mt-1">Review past and upcoming appointments</p>
          <div className="flex items-center gap-1 text-navy-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
            Review <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('reminders')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-warn-50 flex items-center justify-center mb-3">
            <Bell className="w-5 h-5 text-warn-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Reminders</h3>
          <p className="text-xs text-navy-500 mt-1">Manage appointment and test reminders</p>
          <div className="flex items-center gap-1 text-warn-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
            Manage <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('navigation')}
          className="card p-5 text-left hover:shadow-medium transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center mb-3">
            <NavIcon className="w-5 h-5 text-medical-600" />
          </div>
          <h3 className="font-semibold text-navy-900 text-sm">Hospital Navigation</h3>
          <p className="text-xs text-navy-500 mt-1">Interactive hospital blueprint and directions</p>
          <div className="flex items-center gap-1 text-medical-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
            Navigate <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Recent Reminders Preview */}
      {hospital.reminders.length > 0 && (
        <div className="card-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-warn-600" />
              <h3 className="text-sm font-bold text-navy-900">Upcoming Reminders</h3>
            </div>
            <button onClick={() => onNavigate('reminders')} className="text-xs text-medical-600 font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {hospital.reminders.slice(0, 3).map((rem) => (
              <div key={rem.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-warn-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-warn-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy-900 truncate">{rem.title}</div>
                  <div className="text-xs text-navy-400 truncate">{rem.description}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-navy-700">{rem.date}</div>
                  <div className="text-[10px] text-navy-400">{rem.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && next && (
        <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-lg p-6 sm:p-8 max-w-md w-full animate-scale-in relative">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-danger-50 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-danger-600" />
                </div>
                <h2 className="text-lg font-bold font-display text-navy-900">Cancel Appointment?</h2>
              </div>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="p-2 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-gray-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-navy-500 mb-4">Are you sure you want to cancel this appointment?</p>

            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-xs text-navy-400 flex items-center gap-2"><User className="w-3.5 h-3.5" />Doctor</span>
                <span className="text-sm font-semibold text-navy-700">{next.doctorName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-xs text-navy-400 flex items-center gap-2"><Stethoscope className="w-3.5 h-3.5" />Department</span>
                <span className="text-sm font-semibold text-navy-700">{next.department}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-xs text-navy-400 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Date</span>
                <span className="text-sm font-semibold text-navy-700">{next.date}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-xs text-navy-400 flex items-center gap-2"><Clock className="w-3.5 h-3.5" />Time</span>
                <span className="text-sm font-semibold text-navy-700">{next.time}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-xs text-navy-400 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Room</span>
                <span className="text-sm font-semibold text-navy-700">{next.roomNumber}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="btn-secondary flex-1"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-danger-600 text-white font-semibold text-sm hover:bg-danger-700 transition-all flex items-center justify-center gap-2 shadow-soft"
              >
                <XCircle className="w-4 h-4" />
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="card-lg px-5 py-3 flex items-center gap-3 shadow-large">
            <div className="w-8 h-8 rounded-full bg-safe-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-navy-900">Appointment cancelled successfully.</span>
          </div>
        </div>
      )}

      {/* Demo data disclaimer */}
      <div className="p-4 rounded-xl bg-medical-50 border border-medical-100 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-medical-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-medical-700">i</span>
        </div>
        <p className="text-xs text-medical-700 leading-relaxed">
          Demo Health Data — All doctors, appointments, and reports shown are simulated for demonstration purposes. This is not real medical data.
        </p>
      </div>
    </div>
  );
}
