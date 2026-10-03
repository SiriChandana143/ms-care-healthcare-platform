import { Activity, ShieldCheck, Cpu, BedDouble, Trash2, Heart, BookOpen, Users, AlertCircle } from 'lucide-react';
import type { PageName } from '../types';
import { MSCareRobot } from '../components/simulation/MSCareRobot';
import { WasteUnit } from '../components/simulation/WasteUnit';

interface AboutPageProps {
  onNavigate: (page: PageName) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center shadow-medium">
            <Activity className="w-7 h-7 text-medical-400" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-4xl font-bold font-display text-navy-900">About MS.care</h1>
        <p className="text-xl text-medical-600 font-semibold mt-2">Smart Robotic Care for Bedridden Patients</p>
        <p className="text-sm text-navy-400 italic mt-1">Because Every Patient Deserves Dignity.</p>
      </div>

      {/* Concept overview */}
      <div className="card-lg p-6 mb-6">
        <h2 className="text-xl font-bold font-display text-navy-900 mb-3">The Concept</h2>
        <p className="text-sm text-navy-600 leading-relaxed">
          MS.care is a smart robotic bedside toileting and hygienic waste-management system designed for
          permanently bedridden patients. The system is designed around a normal hospital bed with an
          alternating-pressure air-cell mattress. The patient remains lying normally throughout the entire process.
        </p>
        <p className="text-sm text-navy-600 leading-relaxed mt-3">
          The core innovation is that only a small rectangular central section of the bed moves sideways to create
          access for care. The left side, right side, head section, and foot section remain completely fixed.
          The patient is never lifted, turned, or disturbed.
        </p>
      </div>

      {/* Three devices */}
      <div className="mb-6">
        <h2 className="text-xl font-bold font-display text-navy-900 mb-4 text-center">The Three-Device System</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-20"><MSCareRobot /></div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-medical-500" />
              <h3 className="font-bold text-navy-900 text-sm">MS.care Robot</h3>
            </div>
            <p className="text-xs text-navy-500 leading-relaxed">
              Round, low-profile robot with camera/sensors, internal fresh-cover storage, and a foldable
              robotic crane. Does NOT store used waste.
            </p>
          </div>

          <div className="card p-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-full h-20 rounded-xl bg-gradient-to-b from-medical-50 to-medical-100 flex items-center justify-center">
                <BedDouble className="w-8 h-8 text-medical-400" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <BedDouble className="w-4 h-4 text-medical-500" />
              <h3 className="font-bold text-navy-900 text-sm">Hospital Bed</h3>
            </div>
            <p className="text-xs text-navy-500 leading-relaxed">
              Standard hospital bed with alternating-pressure air-cell mattress. Only the small central
              rectangular section moves sideways.
            </p>
          </div>

          <div className="card p-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12"><WasteUnit fillLevel={32} compact /></div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-medical-500" />
              <h3 className="font-bold text-navy-900 text-sm">Waste Unit</h3>
            </div>
            <p className="text-xs text-navy-500 leading-relaxed">
              Separate tall vertical waste-storage unit. Stores only sealed used covers.
              Clearly separated from the robot.
            </p>
          </div>
        </div>
      </div>

      {/* Key principles */}
      <div className="card-lg p-6 mb-6">
        <h2 className="text-xl font-bold font-display text-navy-900 mb-4">Key Principles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Heart, title: 'Patient Dignity', desc: 'Care without lifting, turning, or disturbing the patient.' },
            { icon: ShieldCheck, title: 'Hygienic Design', desc: 'Automatic sealing of used covers before any robotic transfer.' },
            { icon: Cpu, title: 'Smart Automation', desc: 'Camera and sensor-based position detection for precise care.' },
            { icon: BedDouble, title: 'Minimal Movement', desc: 'Only the small central bed section moves. Everything else stays fixed.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-9 h-9 rounded-xl bg-medical-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-medical-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">{item.title}</h3>
                <p className="text-xs text-navy-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Who it helps */}
      <div className="card-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-medical-500" />
          <h2 className="text-xl font-bold font-display text-navy-900">Who It Helps</h2>
        </div>
        <div className="space-y-3">
          {[
            'Permanently bedridden patients who cannot be easily moved or turned',
            'Caregivers who perform physically demanding bedside hygiene tasks',
            'Hospitals and care facilities seeking to reduce caregiver workload',
            'Patients at risk of pressure ulcers who need alternating-pressure mattress support',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-safe-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-safe-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-navy-600">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic context */}
      <div className="card-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-medical-500" />
          <h2 className="text-xl font-bold font-display text-navy-900">Academic Context</h2>
        </div>
        <p className="text-sm text-navy-600 leading-relaxed">
          MS.care is a college innovation and expo prototype. It demonstrates a conceptual robotic healthcare
          system — not an already clinically certified medical device. The interactive simulation on this
          website shows the complete 14-step care cycle, from position detection to sealed waste transfer.
        </p>
        <button onClick={() => onNavigate('simulation')} className="btn-accent mt-4">
          Explore the Simulation
        </button>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-warn-50 border border-warn-200 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warn-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-warn-800">Concept Prototype Disclaimer</h3>
            <p className="text-xs text-warn-700 mt-1.5 leading-relaxed">
              MS.care is an academic healthcare-robotics concept prototype. The mechanical architecture shown is
              intended for demonstration and requires professional biomedical, mechanical, electrical,
              infection-control, and clinical validation before real-world patient use.
            </p>
            <p className="text-xs text-warn-600 mt-2 font-medium">
              This system is not clinically proven, medically certified, or guaranteed to prevent bedsores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
