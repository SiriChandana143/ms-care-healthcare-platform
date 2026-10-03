import { useState, useEffect, useCallback } from 'react';
import {
  X, Play, RotateCw, Scan, User, Cpu, Image as ImageIcon,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import type { HospitalRoom } from '../../data/hospitalData';

interface ProcedureVisualizationProps {
  room: HospitalRoom;
  onClose: () => void;
}

interface ProcedureStep {
  id: number;
  label: string;
  description: string;
  icon: typeof User;
}

const PROCEDURE_STEPS: Record<string, ProcedureStep[]> = {
  'room-201': [
    { id: 1, label: 'Patient Enters', description: 'Patient arrives at the X-ray room and is greeted by the technician.', icon: User },
    { id: 2, label: 'Positioning', description: 'Patient is positioned near the X-ray machine at the correct angle.', icon: User },
    { id: 3, label: 'Equipment Prep', description: 'Technician prepares the digital X-ray machine and adjusts settings.', icon: Cpu },
    { id: 4, label: 'X-Ray Imaging', description: 'The X-ray machine captures the image. Patient holds still briefly.', icon: Scan },
    { id: 5, label: 'Image Generated', description: 'The digital X-ray image is generated and ready for review.', icon: ImageIcon },
  ],
  'room-202': [
    { id: 1, label: 'Patient Enters', description: 'Patient arrives at the CT scan room.', icon: User },
    { id: 2, label: 'Positioning', description: 'Patient lies on the CT scanner table.', icon: User },
    { id: 3, label: 'Equipment Prep', description: 'Technician configures scan parameters.', icon: Cpu },
    { id: 4, label: 'CT Scanning', description: 'The scanner rotates around the patient capturing cross-sectional images.', icon: Scan },
    { id: 5, label: 'Images Ready', description: 'Reconstructed CT images are ready for review.', icon: ImageIcon },
  ],
  'room-203': [
    { id: 1, label: 'Patient Enters', description: 'Patient arrives at the MRI room and removes metal objects.', icon: User },
    { id: 2, label: 'Positioning', description: 'Patient lies on the MRI table with coils placed around the area.', icon: User },
    { id: 3, label: 'Equipment Prep', description: 'Technician configures MRI sequence parameters.', icon: Cpu },
    { id: 4, label: 'MRI Scanning', description: 'The MRI captures detailed soft tissue images using magnetic fields.', icon: Scan },
    { id: 5, label: 'Images Ready', description: 'High-resolution MRI images are ready for review.', icon: ImageIcon },
  ],
  'room-204': [
    { id: 1, label: 'Patient Enters', description: 'Patient arrives at the laboratory for sample collection.', icon: User },
    { id: 2, label: 'Sample Collection', description: 'A trained technician collects the blood sample using sterile technique.', icon: User },
    { id: 3, label: 'Equipment Prep', description: 'Samples are labeled and prepared for analysis in the blood analyzer.', icon: Cpu },
    { id: 4, label: 'Analysis', description: 'The automated analyzer processes the sample and runs the requested tests.', icon: Scan },
    { id: 5, label: 'Results Ready', description: 'Test results are generated and ready for the doctor to review.', icon: ImageIcon },
  ],
};

export function ProcedureVisualization({ room, onClose }: ProcedureVisualizationProps) {
  const steps = PROCEDURE_STEPS[room.id] ?? [];
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= steps.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [steps.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextStep();
    }, 2500);
    return () => clearInterval(timer);
  }, [isPlaying, nextStep]);

  const togglePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="card-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-navy-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-navy-900">No Procedure Demo</h2>
          <p className="text-sm text-navy-400 mt-1">No procedure visualization is available for this room.</p>
          <button onClick={onClose} className="btn-secondary mt-5">Close</button>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const StepIcon = step.icon;
  const isComplete = currentStep >= steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="card-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-gray-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-medical-600 tracking-wide uppercase">Room {room.number} — {room.name}</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-navy-900">Procedure Visualization</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-warn-50 border border-warn-100">
            <AlertCircle className="w-3 h-3 text-warn-600" />
            <span className="text-[10px] font-semibold text-warn-700">Educational Demo</span>
          </div>
        </div>

        {/* Animation stage */}
        <div className="relative rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
          {/* Room outline */}
          <div className="absolute inset-4 rounded-xl border-2 border-gray-200" />

          {/* Animated visualization based on step */}
          <div className="absolute inset-0 flex items-center justify-center">
            {currentStep === 0 && (
              <div className="animate-fade-in flex flex-col items-center">
                {/* Person walking in */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-medical-200 flex items-center justify-center animate-fade-in-up">
                    <User className="w-8 h-8 text-medical-600" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-medical-200/40" />
                </div>
                <span className="text-xs font-semibold text-medical-600 mt-3">Patient enters room</span>
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-fade-in flex items-end gap-6">
                {/* Patient positioned */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-medical-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-medical-600" />
                  </div>
                  <div className="w-20 h-2 rounded-full bg-medical-300/40 mt-1" />
                </div>
                {/* X-ray machine outline */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 rounded-lg bg-navy-200 border-2 border-navy-300 flex items-center justify-center">
                    <Cpu className="w-7 h-7 text-navy-500" />
                  </div>
                  <span className="text-[10px] text-navy-400 mt-1">Machine</span>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-medical-100 flex items-center justify-center animate-pulse-soft">
                  <Cpu className="w-8 h-8 text-medical-500" />
                </div>
                {/* Gear animation */}
                <div className="flex gap-2 mt-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-medical-400"
                      style={{ animation: `pulseSoft 1s ease-in-out ${i * 0.3}s infinite` }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-medical-600 mt-2">Equipment preparing...</span>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-fade-in flex flex-col items-center">
                {/* Scanning beam animation */}
                <div className="relative w-32 h-32 rounded-xl bg-navy-50 border-2 border-navy-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-10 h-10 text-navy-300" />
                  </div>
                  {/* Scan line */}
                  <div
                    className="absolute left-0 right-0 h-1 bg-medical-400"
                    style={{ animation: 'scan 2s ease-in-out infinite', top: '50%' }}
                  />
                  <div className="absolute left-0 right-0 h-0.5 bg-medical-300/50" style={{ animation: 'scan 2s ease-in-out 0.3s infinite' }} />
                </div>
                <span className="text-xs font-semibold text-medical-600 mt-3">Scanning in progress...</span>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-scale-in flex flex-col items-center">
                <div className="w-20 h-20 rounded-xl bg-safe-100 border-2 border-safe-300 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-safe-600" />
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <CheckCircle2 className="w-4 h-4 text-safe-600" />
                  <span className="text-xs font-semibold text-safe-600">Image generated</span>
                </div>
              </div>
            )}
          </div>

          {/* Step label overlay */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-soft">
            <span className="text-xs font-bold text-navy-700">Step {currentStep + 1}: {step.label}</span>
          </div>
        </div>

        {/* Step description */}
        <div className="p-4 rounded-xl bg-medical-50 border border-medical-100 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-medical-100 flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-5 h-5 text-medical-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">{step.label}</h3>
              <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">{step.description}</p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-medical-500' :
                i < currentStep ? 'w-2 bg-safe-500' :
                'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-secondary text-xs">
            <RotateCw className="w-3.5 h-3.5" />
            Restart
          </button>
          <button onClick={togglePlay} className="btn-accent">
            <Play className="w-4 h-4" />
            {isComplete ? 'Replay' : isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextStep}
            disabled={isComplete}
            className="btn-secondary text-xs disabled:opacity-40"
          >
            Next Step
          </button>
        </div>

        {/* Educational disclaimer */}
        <div className="mt-5 p-3 rounded-xl bg-warn-50 border border-warn-100 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-warn-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-warn-700 leading-relaxed">
            Educational Demo — This is a simplified educational visualization and not medical advice. Actual procedures may differ.
          </p>
        </div>
      </div>
    </div>
  );
}
