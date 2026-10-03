import { ArrowRight } from 'lucide-react';
import type { PageName } from '../types';
import { CARE_STEPS } from '../types';
import { BedSimulation } from '../components/simulation/BedSimulation';
import { TopViewDiagram } from '../components/simulation/TopViewDiagram';
import { BedCrossSection } from '../components/simulation/BedCrossSection';

interface HowItWorksPageProps {
  onNavigate: (page: PageName) => void;
}

export function HowItWorksPage({ onNavigate }: HowItWorksPageProps) {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-display text-navy-900">How MS.care Works</h1>
        <p className="text-navy-500 mt-3 max-w-2xl mx-auto">
          A 14-step automated care cycle designed around one principle: the patient never moves.
          Only a small central rectangular bed section slides sideways.
        </p>
      </div>

      {/* Step-by-step */}
      <div className="space-y-6">
        {CARE_STEPS.map((step, i) => (
          <div
            key={step.id}
            className={`card-lg p-6 flex flex-col lg:flex-row gap-6 ${
              i % 2 === 0 ? '' : ''
            }`}
          >
            {/* Step number + visual */}
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 p-4 overflow-hidden" style={{ minHeight: '200px' }}>
                <BedSimulation step={step.id - 1} cameraView="3d" />
              </div>
            </div>

            {/* Step content */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-sm">
                  {step.id}
                </div>
                <div>
                  <div className="text-xs text-medical-600 font-semibold uppercase tracking-wide">Step {step.id} of 14</div>
                  <h3 className="text-lg font-bold text-navy-900">{step.name}</h3>
                </div>
              </div>
              <p className="text-sm text-navy-500 leading-relaxed">{step.description}</p>

              {/* Special callouts */}
              {step.id === 3 && (
                <div className="mt-4 p-3 rounded-xl bg-medical-50 border border-medical-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-medical-700">CRITICAL RULE</span>
                  </div>
                  <p className="text-xs text-medical-700 leading-relaxed">
                    ONLY the small central rectangular section moves. Left, right, head, and foot sections remain completely fixed.
                  </p>
                </div>
              )}
              {step.id === 5 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['No lifting', 'No turning', 'No bed tilting', 'Minimal disturbance'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-safe-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-safe-500" />
                      {item}
                    </div>
                  ))}
                </div>
              )}
              {step.id === 12 && (
                <div className="mt-4 p-3 rounded-xl bg-safe-50 border border-safe-100">
                  <p className="text-xs text-safe-700 leading-relaxed">
                    The crane handles ONLY sealed waste. It never touches the fresh cover, the patient, or enters the patient area.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Top view diagram section */}
      <div className="mt-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-display text-navy-900">Central Section Movement</h2>
          <p className="text-navy-500 mt-2">Top view showing how only the center section moves</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-lg p-6">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Normal Position</h3>
            <TopViewDiagram isOpen={false} />
            <p className="text-xs text-navy-500 mt-4 text-center">All sections form a continuous bed surface</p>
          </div>
          <div className="card-lg p-6">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Open Position</h3>
            <TopViewDiagram isOpen={true} />
            <p className="text-xs text-navy-500 mt-4 text-center">Only the center section slides sideways — sides stay fixed</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-navy-50 border border-navy-100 text-center">
          <p className="text-sm font-semibold text-navy-800">
            ONLY CENTER SECTION MOVES — LEFT AND RIGHT SECTIONS REMAIN FIXED
          </p>
        </div>
      </div>

      {/* Cross section */}
      <div className="mt-12">
        <BedCrossSection />
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <button onClick={() => onNavigate('simulation')} className="btn-primary">
          Try Interactive Simulation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
