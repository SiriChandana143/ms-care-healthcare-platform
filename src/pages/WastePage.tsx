import { Trash2, Package, Clock, CheckCircle2 } from 'lucide-react';
import { WasteUnit } from '../components/simulation/WasteUnit';
import { useSystemState } from '../context/SystemContext';

export function WastePage() {
  const system = useSystemState();
  const fillLevel = system.fillLevel;
  const sealedCovers = system.sealedCovers;
  const remainingCapacity = system.remainingCapacity;
  const lastDisposalDate = system.lastDisposalDate;
  const lastDisposalTime = system.lastDisposalTime;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display text-navy-900">Waste Management</h1>
        <p className="text-navy-500 mt-1 text-sm">Monitor and manage the vertical waste-storage unit</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visual waste unit */}
        <div className="card-lg p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-navy-700 mb-4">Sealed Waste Storage</h3>
          <div className="w-32">
            <WasteUnit fillLevel={fillLevel} />
          </div>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold font-display text-navy-900">{fillLevel}%</div>
            <div className="text-xs text-navy-400">Capacity Used</div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-medical-500" />
                <span className="text-xs text-navy-400 font-medium">Sealed Covers Stored</span>
              </div>
              <div className="text-2xl font-bold font-display text-navy-900">{sealedCovers}</div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-4 h-4 text-medical-500" />
                <span className="text-xs text-navy-400 font-medium">Remaining Capacity</span>
              </div>
              <div className="text-2xl font-bold font-display text-navy-900">{remainingCapacity}%</div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-medical-500" />
                <span className="text-xs text-navy-400 font-medium">Last Disposal</span>
              </div>
              <div className="text-sm font-semibold text-navy-700 mt-1">{lastDisposalDate}</div>
              <div className="text-xs text-navy-400">{lastDisposalTime}</div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-safe-500" />
                <span className="text-xs text-navy-400 font-medium">System Status</span>
              </div>
              <div className="text-sm font-semibold text-safe-600 mt-1">Operational</div>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="card-lg p-5">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Capacity Indicator</h3>
            <div className="relative h-8 rounded-xl bg-gray-100 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-xl bg-gradient-to-r from-safe-400 to-safe-500 transition-all duration-1000 flex items-center justify-end pr-3"
                style={{ width: `${fillLevel}%` }}
              >
                <span className="text-xs font-bold text-white">{fillLevel}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-navy-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            {/* Threshold markers */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded bg-safe-400" />
                <span className="text-navy-500">Normal: 0–70%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded bg-warn-400" />
                <span className="text-navy-500">Warning: 70–90%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded bg-danger-400" />
                <span className="text-navy-500">Critical: 90–100%</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-medical-50 border border-medical-100">
            <p className="text-xs text-medical-700 leading-relaxed">
              The vertical waste-storage unit stores ONLY sealed used covers. The MS.care robot itself does not
              store used waste — it transfers sealed packages to this separate unit via the robotic crane.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
