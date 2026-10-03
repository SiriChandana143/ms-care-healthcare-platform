import { WashNozzle } from './WashNozzle';

interface CoverSliderProps {
  visible: boolean;
  hasCover: boolean;
  sealed: boolean;
  exiting?: boolean;
  locked?: boolean;
  washing?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CoverSlider({ visible, hasCover, sealed, exiting = false, locked = false, washing = false, className = '', style }: CoverSliderProps) {
  if (!visible) return null;

  return (
    <div
      className={`absolute bed-transition ${className}`}
      style={{
        ...style,
        transform: exiting ? 'translateX(-120%)' : 'translateX(0)',
        opacity: visible ? 1 : 0,
        transitionDuration: '1.5s',
      }}
    >
      {/* Slider track */}
      <div className="relative w-full h-full rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 shadow-inner overflow-hidden">
        {/* Mechanical rail details */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gray-300/50" />
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-300/50" />

        {/* Cover on the slider */}
        {hasCover && (
          <div
            className={`absolute rounded-md transition-all duration-700 ${
              sealed ? 'bg-gradient-to-b from-safe-100 to-safe-200 border-2 border-safe-400' : 'bg-gradient-to-b from-medical-50 to-medical-100 border border-medical-300'
            }`}
            style={{ top: '15%', bottom: '15%', left: '10%', right: '10%' }}
          >
            {sealed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[8px] font-semibold text-safe-700 tracking-wider">SEALED</div>
              </div>
            )}
            {/* Cover texture */}
            <div className="absolute inset-0 rounded-md opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(37,99,235,0.1) 3px, rgba(37,99,235,0.1) 4px)',
            }} />
          </div>
        )}

        {/* Slider guide arrows */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-medical-400 text-[8px]">
          ◄
        </div>

        {/* Mechanical lock */}
        {locked && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm border border-safe-500 bg-safe-100 flex items-center justify-center">
            <div className="w-0.5 h-1 bg-safe-600 rounded-full" />
          </div>
        )}

        {/* Washing nozzle + water flow */}
        {washing && (
          <WashNozzle active={washing} className="inset-0" />
        )}
      </div>
    </div>
  );
}
