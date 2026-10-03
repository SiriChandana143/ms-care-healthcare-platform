interface WasteUnitProps {
  fillLevel: number;
  active?: boolean;
  className?: string;
  compact?: boolean;
}

export function WasteUnit({ fillLevel, active = false, className = '', compact = false }: WasteUnitProps) {
  const segments = Array.from({ length: 10 }, (_, i) => i);
  const filledSegments = Math.round((fillLevel / 100) * 10);

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-8 h-16 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 overflow-hidden flex flex-col-reverse">
          {segments.map((i) => (
            <div
              key={i}
              className={`h-[10%] transition-all duration-500 ${
                i < filledSegments ? 'bg-safe-400' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
        <div className="text-center text-[7px] text-navy-500 font-medium mt-0.5">{fillLevel}%</div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Top cap */}
      <div className="w-[70%] h-3 rounded-t-lg bg-gradient-to-b from-gray-300 to-gray-400 shadow-soft" />

      {/* Main body */}
      <div
        className={`relative w-full rounded-b-xl border-2 overflow-hidden transition-all ${
          active ? 'border-medical-400 shadow-medium' : 'border-gray-300 shadow-soft'
        }`}
        style={{
          aspectRatio: '0.45',
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        {/* Fill segments */}
        <div className="absolute inset-2 rounded-lg overflow-hidden flex flex-col-reverse">
          {segments.map((i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-700 ${
                i < filledSegments ? 'bg-gradient-to-b from-safe-300 to-safe-400' : 'bg-gray-100/50'
              } ${i < filledSegments ? 'border-t border-safe-200/50' : 'border-t border-gray-200/50'}`}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-medical-500 animate-pulse-soft' : 'bg-safe-500'}`} />
        </div>

        {/* Label */}
        <div className="absolute bottom-2 inset-x-0 text-center">
          <div className="text-navy-700 text-[8px] font-semibold tracking-wider">WASTE UNIT</div>
          <div className="text-navy-500 text-[7px]">{fillLevel}% Full</div>
        </div>

        {/* Active glow */}
        {active && (
          <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
            boxShadow: 'inset 0 0 8px rgba(59,130,246,0.2)',
          }} />
        )}
      </div>

      {/* Base */}
      <div className="w-[80%] h-1.5 rounded-full bg-gray-300 mt-0.5" />
    </div>
  );
}
