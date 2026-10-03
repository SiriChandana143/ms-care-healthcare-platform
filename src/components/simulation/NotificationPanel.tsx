import { useSystemState } from '../../context/SystemContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface NotificationPanelProps {
  className?: string;
  maxItems?: number;
}

export function NotificationPanel({ className = '', maxItems }: NotificationPanelProps) {
  const { notifications } = useSystemState();
  const items = maxItems ? notifications.slice(0, maxItems) : notifications;

  const getIcon = (type: string) => {
    if (type === 'success') return <CheckCircle2 className="w-4 h-4 text-safe-500" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-warn-500" />;
    return <Info className="w-4 h-4 text-medical-500" />;
  };

  const getBg = (type: string) => {
    if (type === 'success') return 'bg-safe-50 border-safe-100';
    if (type === 'warning') return 'bg-warn-50 border-warn-100';
    return 'bg-medical-50 border-medical-100';
  };

  if (items.length === 0) {
    return <div className={`text-center text-sm text-navy-400 py-8 ${className}`}>No notifications yet.</div>;
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {items.map((n) => (
        <div key={n.id} className={`rounded-xl border p-4 transition-all hover:shadow-soft ${getBg(n.type)} ${!n.read ? 'ring-1 ring-medical-200' : ''}`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-navy-900">{n.title}</h4>
                <span className="text-xs text-navy-400 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">{n.message}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-medical-500 flex-shrink-0 mt-2" />}
          </div>
        </div>
      ))}
    </div>
  );
}
