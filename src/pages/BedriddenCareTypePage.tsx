import { Activity, Home, HeartPulse, Brain, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { AppMode } from './EntryPage';

interface BedriddenCareTypePageProps {
  onSelect: (mode: AppMode) => void;
  onSwitchMode: () => void;
}

export function BedriddenCareTypePage({ onSelect, onSwitchMode }: BedriddenCareTypePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-safe-500/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-medical-500/6 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none" />

      {/* Brand + back */}
      <div className="relative w-full max-w-5xl mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-large">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-white leading-none">Ms.care</div>
              <div className="text-[10px] text-safe-400 font-medium tracking-wide leading-none mt-0.5">Bedridden Caring</div>
            </div>
          </div>
          <button onClick={onSwitchMode} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-navy-300 hover:text-white hover:bg-white/5 transition-all">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Main Menu</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="relative text-center mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">Choose Bedridden Care Type</h1>
        <p className="text-navy-300 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
          Select the care workflow based on the patient's level of awareness and ability to communicate their need.
        </p>
      </div>

      {/* Two cards */}
      <div className="relative grid md:grid-cols-2 gap-5 max-w-4xl w-full animate-scale-in">
        {/* Patient-Initiated */}
        <button
          onClick={() => onSelect('caring')}
          className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-7 text-left transition-all duration-300 hover:border-safe-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-safe-500/8 blur-2xl group-hover:bg-safe-500/12 transition-all" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-safe-500/15 flex items-center justify-center mb-5 group-hover:bg-safe-500/25 transition-all">
              <User className="w-7 h-7 text-safe-400" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold font-display text-white mb-2">Patient-Initiated Bedridden Care</h2>
            <p className="text-navy-300 text-sm leading-relaxed mb-5">
              For bedridden patients who know when they need to use the restroom and can independently request care.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Patient knows when they need to urinate',
                'Patient does not want the care module continuously positioned underneath',
                'Patient can independently request the care cycle',
                'Ms.care prepares the system only when requested',
                'Supports privacy, comfort, and independence',
                'Caregiver is NOT required for routine activation',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs text-navy-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-safe-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-safe-400 font-medium text-sm group-hover:gap-3 transition-all">
              <span>Start Patient-Initiated Care</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Sensor-Initiated */}
        <button
          onClick={() => onSelect('sensor-initiated-care')}
          className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-7 text-left transition-all duration-300 hover:border-medical-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-medical-500/8 blur-2xl group-hover:bg-medical-500/12 transition-all" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-medical-500/15 flex items-center justify-center mb-5 group-hover:bg-medical-500/25 transition-all">
              <Brain className="w-7 h-7 text-medical-400" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold font-display text-white mb-2">Sensor-Initiated Bedridden Care</h2>
            <p className="text-navy-300 text-sm leading-relaxed mb-5">
              For bedridden patients who may not reliably recognize or communicate when they need to use the restroom.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Ms.care monitors the patient-care system continuously',
                'Future weight/load sensor can detect usage of the disposable collection module',
                'Patient does not need to manually request every care cycle',
                'Designed for patients with limited awareness or communication ability',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs text-navy-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-medical-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-medical-400 font-medium text-sm group-hover:gap-3 transition-all">
              <span>Start Sensor-Initiated Care</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      {/* Footer note */}
      <div className="relative mt-12 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-navy-400 text-xs">
          MS.care Robotic Platform — College Innovation & Expo Prototype
        </p>
      </div>
    </div>
  );
}
