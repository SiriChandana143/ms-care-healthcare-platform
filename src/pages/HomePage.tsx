import { useState, useEffect } from 'react';
import { Play, ArrowRight, Activity, ShieldCheck, Cpu, BedDouble, Trash2, BatteryCharging, Bell } from 'lucide-react';
import type { PageName } from '../types';
import { BedSimulation } from '../components/simulation/BedSimulation';
import { MSCareRobot } from '../components/simulation/MSCareRobot';
import { WasteUnit } from '../components/simulation/WasteUnit';
import { useSystemState } from '../context/SystemContext';

interface HomePageProps {
  onNavigate: (page: PageName) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const system = useSystemState();
  const [autoStep, setAutoStep] = useState(0);
  const [showMechanismVideo, setShowMechanismVideo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isRunning = system.state === 'running';
  const centerSectionOpen = ['center-open', 'slider-enter', 'slider-locked', 'cover-placed', 'care-mode', 'slider-retrieve', 'sealing', 'slider-exit'].includes(system.step.action);
  const sliderHome = system.step.action === 'idle' || system.step.action === 'scanning' || system.step.action === 'return-to-dock' || system.step.action === 'charging' || system.step.action === 'fully-charged';
  const craneDeployed = ['crane-deploy', 'crane-transfer', 'waste-stored'].includes(system.step.action);

  const robotStatusLabel = isRunning ? 'Active' : system.robotDocked ? 'Docked' : 'Away';
  const bedStatusLabel = centerSectionOpen ? 'Center Open' : 'Normal Position';
  const sliderStatusLabel = sliderHome ? 'Retracted' : 'Active';
  const craneStatusLabel = craneDeployed ? 'Deployed' : 'Retracted';
  const robotBadgeLabel = isRunning ? 'Active' : 'Ready';
  const robotBadgeClass = isRunning ? 'status-dot status-active text-medical-600 text-xs font-medium' : 'status-dot status-ready text-safe-600 text-xs font-medium';
  const bedBadgeLabel = centerSectionOpen ? 'Active' : 'Stable';
  const bedBadgeClass = centerSectionOpen ? 'status-dot status-active text-medical-600 text-xs font-medium' : 'status-dot status-ready text-safe-600 text-xs font-medium';
  const wasteBadgeLabel = system.fillLevel >= 90 ? 'Critical' : system.fillLevel >= 70 ? 'Warning' : 'Available';
  const wasteBadgeClass = system.fillLevel >= 90 ? 'status-dot status-danger text-danger-600 text-xs font-medium' : system.fillLevel >= 70 ? 'status-dot status-warn text-warn-600 text-xs font-medium' : 'status-dot status-ready text-safe-600 text-xs font-medium';

  return (
    <div className="animate-fade-in">
      {/* === HERO === */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-medical-50/30 to-gray-50">
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-medical-100/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-100/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-medical-50 border border-medical-100 mb-6">
                <span className="status-dot status-ready text-safe-600 text-xs font-medium" />
                <span className="text-xs text-medical-700 font-medium">Healthcare Robotics Concept</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold font-display text-navy-900 leading-tight tracking-tight">
                Ms.care
              </h1>
              <p className="text-xl text-medical-600 font-semibold mt-2">
                Smart Robotic Care for Bedridden Patients
              </p>
              <p className="text-base text-navy-500 mt-4 leading-relaxed max-w-lg">
                An intelligent robotic care concept designed to support hygienic bedside care while reducing
                unnecessary patient movement and caregiver workload.
              </p>
              <p className="text-sm text-navy-400 mt-2 italic">Because Every Patient Deserves Dignity.</p>

              <div className="flex flex-wrap gap-3 mt-8">
                <button onClick={() => onNavigate('how-it-works')} className="btn-primary">
                  Explore MS.care
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
  onClick={() => setShowMechanismVideo(true)}
  className="btn-secondary"
>
  <Play className="w-4 h-4" />
  Watch Working Mechanism
</button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[
                  { label: 'Care Steps', value: '14' },
                  { label: 'Patient Movement', value: 'Zero' },
                  { label: 'Automated', value: '100%' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold font-display text-navy-900">{stat.value}</div>
                    <div className="text-xs text-navy-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: bed simulation visual */}
            <div className="relative animate-scale-in">
              <div className="card-lg p-6 bg-white/70 backdrop-blur-sm">
                <BedSimulation step={autoStep} cameraView="3d" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  {[
                    ['Robot', robotStatusLabel],
                    ['Battery', `${system.battery}%`],
                    ['Bed', bedStatusLabel],
                    ['Slider', sliderStatusLabel],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-gray-50 px-2 py-2">
                      <div className="text-[10px] text-navy-400">{label}</div>
                      <div className="text-xs font-semibold text-navy-700 mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === DEVICE CARDS (Dreamehome-style) === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-display text-navy-900">The MS.care Ecosystem</h2>
          <p className="text-navy-500 mt-2">Three connected devices working in harmony</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Robot card */}
          <div className="card-lg p-6 hover:shadow-large transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-medical-500" />
                <h3 className="font-bold text-navy-900">MS.care Robot</h3>
              </div>
              <span className={robotBadgeClass}>{robotBadgeLabel}</span>
            </div>
            <div className="flex items-center justify-center py-4 h-40">
  <img
    src="/assets/image.png"
    alt="MS.care Robot"
    className="max-h-full w-full object-contain"
  />
</div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Battery</span>
                <span className="text-safe-600 font-medium inline-flex items-center gap-1"><BatteryCharging className="w-3.5 h-3.5" />{system.battery}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Robot</span>
                <span className="text-navy-700 font-medium">{robotStatusLabel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Crane</span>
                <span className="text-navy-700 font-medium">{craneStatusLabel}</span>
              </div>
            </div>
            <button onClick={() => onNavigate('dashboard')} className="w-full btn-secondary mt-4 group-hover:bg-medical-50">
              Device
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bed card */}
          <div className="card-lg p-6 hover:shadow-large transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-medical-500" />
                <h3 className="font-bold text-navy-900">Hospital Bed</h3>
              </div>
              <span className={bedBadgeClass}>{bedBadgeLabel}</span>
            </div>
           <div className="flex items-center justify-center py-4 h-40">
  <img
    src="/assets/bed_status_image.png"
    alt="MS.care Hospital Bed"
    className="max-h-full w-full object-contain"
  />
</div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Center Section</span>
                <span className="text-navy-700 font-medium">{centerSectionOpen ? 'Open' : 'Closed'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Patient Position</span>
                <span className="text-safe-600 font-medium">Maintained</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Side Sections</span>
                <span className="text-navy-700 font-medium">Fixed</span>
              </div>
            </div>
            <button onClick={() => onNavigate('how-it-works')} className="w-full btn-secondary mt-4 group-hover:bg-medical-50">
              How It Works
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Waste unit card */}
          <div className="card-lg p-6 hover:shadow-large transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-medical-500" />
                <h3 className="font-bold text-navy-900">Waste Unit</h3>
              </div>
              <span className={wasteBadgeClass}>{wasteBadgeLabel}</span>
            </div>
            <div className="flex items-center justify-center py-4 h-40">
  <img
    src="/assets/waste_unit_image.png"
    alt="MS.care Waste Unit at 32% capacity"
    className="max-h-full w-full object-contain"
  />
</div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Capacity</span>
                <span className="text-navy-700 font-medium">{system.fillLevel}% Full</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Sealed Covers</span>
                <span className="text-navy-700 font-medium">{system.sealedCovers} Stored</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Status</span>
                <span className="text-safe-600 font-medium">Operational</span>
              </div>
            </div>
            <button onClick={() => onNavigate('waste')} className="w-full btn-secondary mt-4 group-hover:bg-medical-50">
              View Waste Unit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* === KEY FEATURES === */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display text-navy-900">Why MS.care Matters</h2>
            <p className="text-navy-500 mt-2">Designed around patient dignity and caregiver efficiency</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: ShieldCheck, title: 'Minimal Disturbance', desc: 'No lifting, no turning, no bed tilting. The patient remains comfortably positioned throughout.' },
              { icon: Activity, title: 'Smart Detection', desc: 'Camera and sensors identify the precise position needed for care, automatically.' },
              { icon: Cpu, title: 'Automated Hygiene', desc: 'Fresh cover placement, used cover retrieval, and hygienic sealing — all automated.' },
              { icon: Trash2, title: 'Sealed Waste Transfer', desc: 'A robotic crane transfers only sealed waste to a separate vertical storage unit.' },
            ].map((feat) => (
              <div key={feat.title} className="card p-5 hover:shadow-medium transition-all">
                <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center mb-3">
                  <feat.icon className="w-5 h-5 text-medical-600" />
                </div>
                <h3 className="font-semibold text-navy-900 text-sm">{feat.title}</h3>
                <p className="text-xs text-navy-500 mt-1.5 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card-lg p-8 sm:p-12 bg-gradient-to-br from-navy-900 to-navy-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-medical-500/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold font-display text-white">Experience the Full Care Cycle</h2>
            <p className="text-navy-200 mt-3 max-w-xl mx-auto">
              Watch the complete 14-step automated care cycle — from position detection to sealed waste transfer.
            </p>
            <button onClick={() => onNavigate('simulation')} className="btn-accent mt-6">
              <Play className="w-4 h-4" />
              Launch Interactive Simulation
            </button>
          </div>
        </div>
      </section>
    {showMechanismVideo && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div className="relative w-full max-w-5xl">
      <button
        onClick={() => setShowMechanismVideo(false)}
        className="absolute -top-10 right-0 text-white text-2xl font-bold"
      >
        ×
      </button>

      <video
        src="/assets/MS-care-Working-mechanism_.mp4"
        controls
        autoPlay
        className="w-full rounded-xl shadow-2xl"
      />
    </div>
  </div>
)}
      </div>
  );
}
