import type { SystemStatus, StatusType } from '../../types';
import { STATUS_LABELS, STATUS_CLASSES } from '../../types';

interface StatusPanelProps {
  status: SystemStatus;
  className?: string;
  compact?: boolean;
}

const STATUS_ICONS: Record<string, string> = {
  robot: 'Robot',
  bed: 'Bed',
  patient: 'Patient',
  cover: 'Cover',
  wasteUnit: 'Waste Unit',
};

export function StatusPanel({ status, className = '', compact = false }: StatusPanelProps) {
  const entries = Object.entries(status) as [keyof SystemStatus, StatusType][];

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-gray-100 shadow-soft">
            <span className={`status-dot ${STATUS_CLASSES[value]}`} />
            <span className="text-xs text-navy-600 font-medium">{STATUS_ICONS[key]}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${className}`}>
      {entries.map(([key, value]) => (
        <div key={key} className="card p-3 sm:p-4 min-w-0 flex flex-col gap-1">
          <div className="text-xs text-navy-400 font-medium uppercase tracking-wide break-words">{STATUS_ICONS[key]}</div>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`status-dot ${STATUS_CLASSES[value]} text-sm font-semibold`}>
              {STATUS_LABELS[value]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
