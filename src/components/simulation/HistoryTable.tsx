import { getCareHistory } from '../../types';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface HistoryTableProps {
  className?: string;
  maxRows?: number;
}

export function HistoryTable({ className = '', maxRows }: HistoryTableProps) {
  const [history, setHistory] = useState(getCareHistory());

  useEffect(() => {
    const updateHistory = () => {
      setHistory(getCareHistory());
    };

    window.addEventListener('care-history-updated', updateHistory);

    return () => {
      window.removeEventListener('care-history-updated', updateHistory);
    };
  }, []);

  const rows = maxRows ? history.slice(0, maxRows) : history;

  return (
    <div className={`card-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy-50 border-b border-navy-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-navy-500 uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-navy-500 uppercase tracking-wide">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-navy-500 uppercase tracking-wide">Care Cycle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-navy-500 uppercase tracking-wide">Cover Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-navy-500 uppercase tracking-wide">Waste Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-navy-500 uppercase tracking-wide">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-navy-700 font-medium">{row.date}</td>
                <td className="px-4 py-3 text-sm text-navy-500">{row.time}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
                    row.cycle === 'Completed' ? 'bg-safe-50 text-safe-700' : 'bg-warn-50 text-warn-700'
                  }`}>
                    {row.cycle === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {row.cycle}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-medical-50 text-medical-700">
                    {row.coverStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-navy-50 text-navy-600">
                    {row.wasteStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-medium ${row.result === 'Successful' ? 'text-safe-600' : 'text-warn-600'}`}>
                    {row.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
