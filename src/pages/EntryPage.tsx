import { Activity, Wind, HeartPulse, Armchair, ArrowRight, Hospital, Map } from 'lucide-react';

export type AppMode = 'entry' | 'vacuum' | 'caring' | 'normal-caring' | 'bedridden-care-type' | 'sensor-initiated-care' | 'hospital' | 'navigation';

interface EntryPageProps {
  onSelect: (mode: AppMode) => void;
}

export function EntryPage({ onSelect }: EntryPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-medical-500/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/6 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none" />

      {/* Brand */}
      <div className="relative text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-large">
            <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold font-display text-white tracking-tight">Ms.care</h1>
        <p className="text-medical-300 font-semibold mt-3 text-lg">Smart Healthcare Platform</p>
        <p className="text-navy-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          One intelligent platform. Robotic care, hospital appointments, and navigation.
        </p>
      </div>

      {/* Section labels + Mode cards */}
      <div className="relative max-w-5xl w-full animate-scale-in space-y-6">
        {/* Care Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1.5 h-5 rounded-full bg-safe-500" />
            <span className="text-xs font-bold text-safe-400 tracking-wide uppercase">Robotic Care</span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {/* Vacuum Cleaner */}
            <button
              onClick={() => onSelect('vacuum')}
              className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-left transition-all duration-300 hover:border-medical-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-medical-500/8 blur-2xl group-hover:bg-medical-500/12 transition-all" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-medical-500/15 flex items-center justify-center mb-4 group-hover:bg-medical-500/25 transition-all">
                  <Wind className="w-6 h-6 text-medical-400" strokeWidth={2} />
                </div>
                <h2 className="text-lg font-bold font-display text-white mb-1.5">Vacuum Cleaner</h2>
                <p className="text-navy-300 text-xs leading-relaxed mb-4">
                  Autonomous floor cleaning with smart navigation.
                </p>
                <div className="flex items-center gap-2 text-medical-400 font-medium text-xs group-hover:gap-3 transition-all">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {/* Bedridden Caring */}
            <button
              onClick={() => onSelect('bedridden-care-type')}
              className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-left transition-all duration-300 hover:border-safe-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-safe-500/8 blur-2xl group-hover:bg-safe-500/12 transition-all" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-safe-500/15 flex items-center justify-center mb-4 group-hover:bg-safe-500/25 transition-all">
                  <HeartPulse className="w-6 h-6 text-safe-400" strokeWidth={2} />
                </div>
                <h2 className="text-lg font-bold font-display text-white mb-1.5">Bedridden Caring</h2>
                <p className="text-navy-300 text-xs leading-relaxed mb-4">
                  Complete bedside care for patients who remain lying down.
                </p>
                <div className="flex items-center gap-2 text-safe-400 font-medium text-xs group-hover:gap-3 transition-all">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {/* Normal Caring */}
            <button
              onClick={() => onSelect('normal-caring')}
              className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-left transition-all duration-300 hover:border-sky-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-500/8 blur-2xl group-hover:bg-sky-500/12 transition-all" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center mb-4 group-hover:bg-sky-500/25 transition-all">
                  <Armchair className="w-6 h-6 text-sky-400" strokeWidth={2} />
                </div>
                <h2 className="text-lg font-bold font-display text-white mb-1.5">Normal Caring</h2>
                <p className="text-navy-300 text-xs leading-relaxed mb-4">
                  Adaptive bedside care for patients who can use a seated position.
                </p>
                <div className="flex items-center gap-2 text-sky-400 font-medium text-xs group-hover:gap-3 transition-all">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Hospital & Navigation Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1.5 h-5 rounded-full bg-medical-500" />
            <span className="text-xs font-bold text-medical-400 tracking-wide uppercase">Healthcare Services</span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Ms.care Hospital */}
            <button
              onClick={() => onSelect('hospital')}
              className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-left transition-all duration-300 hover:border-medical-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-medical-500/8 blur-2xl group-hover:bg-medical-500/12 transition-all" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-medical-500/15 flex items-center justify-center mb-4 group-hover:bg-medical-500/25 transition-all">
                  <Hospital className="w-6 h-6 text-medical-400" strokeWidth={2} />
                </div>
                <h2 className="text-lg font-bold font-display text-white mb-1.5">Ms.care Hospital</h2>
                <p className="text-navy-300 text-xs leading-relaxed mb-4">
                  Manage appointments, doctors, health reports and healthcare services.
                </p>
                <div className="flex items-center gap-2 text-medical-400 font-medium text-xs group-hover:gap-3 transition-all">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {/* Ms.care Navigation */}
            <button
              onClick={() => onSelect('navigation')}
              className="group relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-left transition-all duration-300 hover:border-sky-400/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-500/8 blur-2xl group-hover:bg-sky-500/12 transition-all" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center mb-4 group-hover:bg-sky-500/25 transition-all">
                  <Map className="w-6 h-6 text-sky-400" strokeWidth={2} />
                </div>
                <h2 className="text-lg font-bold font-display text-white mb-1.5">Ms.care Navigation</h2>
                <p className="text-navy-300 text-xs leading-relaxed mb-4">
                  Interactive hospital blueprint with room details and procedure visualizations.
                </p>
                <div className="flex items-center gap-2 text-sky-400 font-medium text-xs group-hover:gap-3 transition-all">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="relative mt-10 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-navy-400 text-xs">
          MS.care Healthcare Platform — College Innovation & Expo Prototype
        </p>
      </div>
    </div>
  );
}
