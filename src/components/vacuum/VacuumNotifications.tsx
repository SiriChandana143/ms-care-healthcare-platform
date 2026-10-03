import { useVacuum, type VacuumNotification } from '@/context/VacuumContext';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  Check,
  X,
  Wrench,
} from 'lucide-react';

function getNotificationIcon(n: VacuumNotification) {
  if (n.type === 'success') return CheckCircle2;
  if (n.type === 'danger') return AlertCircle;
  if (n.type === 'warning') return AlertTriangle;
  return Info;
}

function getNotificationColors(n: VacuumNotification) {
  if (n.resolved) return { bg: 'bg-gray-50', border: 'border-gray-100', icon: 'text-navy-300', iconBg: 'bg-gray-100' };
  if (n.type === 'success') return { bg: 'bg-safe-50', border: 'border-safe-100', icon: 'text-safe-600', iconBg: 'bg-safe-100' };
  if (n.type === 'danger') return { bg: 'bg-danger-50', border: 'border-danger-100', icon: 'text-danger-600', iconBg: 'bg-danger-100' };
  if (n.type === 'warning') return { bg: 'bg-warn-50', border: 'border-warn-100', icon: 'text-warn-600', iconBg: 'bg-warn-100' };
  return { bg: 'bg-medical-50', border: 'border-medical-100', icon: 'text-medical-600', iconBg: 'bg-medical-100' };
}

export function VacuumNotifications() {
  const vac = useVacuum();
  const { state, markNotificationRead, markNotificationResolved, markAllNotificationsRead, resolveMaintenance, unreadCount } = vac;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-900">Notifications</h1>
          <p className="text-navy-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="btn-secondary text-xs">
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {state.notifications.length === 0 && (
          <div className="card-lg p-8 text-center">
            <Bell className="w-10 h-10 text-navy-200 mx-auto mb-3" />
            <p className="text-sm text-navy-400">No notifications yet.</p>
          </div>
        )}

        {state.notifications.map((n) => {
          const Icon = getNotificationIcon(n);
          const colors = getNotificationColors(n);
          const isUnread = !n.read;

          return (
            <div
              key={n.id}
              className={`card-lg p-5 transition-all ${colors.bg} ${colors.border} ${
                isUnread ? 'ring-1 ring-medical-200/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-navy-900">{n.title}</h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-medical-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-navy-400 flex-shrink-0">{n.time}</span>
                  </div>

                  <p className="text-xs text-navy-500 leading-relaxed mb-3">{n.message}</p>

                  {/* Status + actions */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {n.resolved ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-navy-400">
                          <Check className="w-3 h-3" />
                          Resolved
                        </span>
                      ) : isUnread ? (
                        <span className="text-xs font-medium text-medical-600">New</span>
                      ) : (
                        <span className="text-xs font-medium text-navy-400">Read</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Action button */}
                      {n.actionKey && !n.resolved && (
                        <button
                          onClick={() => resolveMaintenance(n.actionKey!)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-navy-700 hover:bg-gray-50 hover:shadow-soft transition-all"
                        >
                          <Wrench className="w-3 h-3" />
                          {n.actionLabel}
                        </button>
                      )}

                      {/* Mark resolved */}
                      {!n.resolved && (
                        <button
                          onClick={() => markNotificationResolved(n.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-navy-400 hover:bg-gray-50 transition-all"
                        >
                          <Check className="w-3 h-3" />
                          Resolve
                        </button>
                      )}

                      {/* Mark read */}
                      {isUnread && !n.resolved && (
                        <button
                          onClick={() => markNotificationRead(n.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-navy-400 hover:bg-gray-50 transition-all"
                        >
                          <X className="w-3 h-3" />
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
