import { HistoryTable } from '../components/simulation/HistoryTable';
import { getCareHistory } from '../types';
import { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function HistoryPage() {
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

const totalCycles = history.length;
const successful = history.filter(
  (entry) => entry.result === 'Successful'
).length;
const interrupted = history.filter(
  (entry) => entry.cycle === 'Interrupted'
).length;

const lastCycle = history[0];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display text-navy-900">Care History</h1>
        <p className="text-navy-500 mt-1 text-sm">Complete record of all care cycles</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-medical-500" />
            <span className="text-xs text-navy-400 font-medium">Total Cycles</span>
          </div>
          <div className="text-2xl font-bold font-display text-navy-900">{totalCycles}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-safe-500" />
            <span className="text-xs text-navy-400 font-medium">Successful</span>
          </div>
          <div className="text-2xl font-bold font-display text-safe-600">{successful}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warn-500" />
            <span className="text-xs text-navy-400 font-medium">Interrupted</span>
          </div>
          <div className="text-2xl font-bold font-display text-warn-600">{interrupted}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-medical-500" />
            <span className="text-xs text-navy-400 font-medium">Last Cycle</span>
          </div>
         <div className="text-sm font-semibold text-navy-700 mt-1">
  {lastCycle?.date ?? 'No cycles'}
</div>
<div className="text-xs text-navy-400">
  {lastCycle?.time ?? '--'}
</div>
        </div>
      </div>

      {/* History table */}
      <HistoryTable />
    </div>
  );
}
