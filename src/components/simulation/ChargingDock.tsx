interface ChargingDockProps {
  active?: boolean;
  className?: string;
}

export function ChargingDock({ active = false, className = '' }: ChargingDockProps) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Dock base — flat platform */}
      <div
        className="relative w-full rounded-xl border-2 overflow-hidden transition-all"
        style={{
          aspectRatio: '1.8',
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          borderColor: active ? '#22c55e' : '#cbd5e1',
          boxShadow: active ? '0 0 12px rgba(34,197,94,0.2)' : '0 4px 12px rgba(16,42,67,0.08)',
        }}
      >
        {/* Dock contact strip */}
        <div
          className={`absolute top-[15%] left-[20%] right-[20%] h-[8%] rounded transition-all ${
            active ? 'bg-safe-500 shadow-md' : 'bg-navy-300'
          }`}
        />

        {/* Charging indicators */}
        {active && (
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-safe-400 animate-pulse-soft"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        )}

        {/* Label */}
        <div className="absolute bottom-[15%] inset-x-0 text-center">
          <div className="text-navy-600 text-[7px] font-bold tracking-wider">MS.CARE DOCK</div>
          <div className={`text-[6px] font-medium ${active ? 'text-safe-600' : 'text-navy-400'}`}>
            {active ? 'CHARGING' : 'STANDBY'}
          </div>
        </div>

        {/* Side accent strips */}
        <div className="absolute left-[5%] top-[50%] w-[8%] h-[20%] rounded bg-medical-200/50" />
        <div className="absolute right-[5%] top-[50%] w-[8%] h-[20%] rounded bg-medical-200/50" />

        {/* Clean water supply tank (manually serviceable) */}
        <div className="absolute left-[10%] top-[42%] w-[18%] h-[35%] rounded-md border border-blue-300/60 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(219,234,254,0.5) 0%, rgba(147,197,253,0.3) 100%)' }}
        >
          {/* Water level fill */}
          <div className="absolute bottom-0 left-0 right-0 bg-blue-300/40" style={{ height: '75%' }} />
          {/* Surface ripple */}
          <div className="absolute left-0 right-0 bg-blue-200/30" style={{ height: '1px', top: '25%' }} />
        </div>

        {/* Water tank label */}
        <div className="absolute left-[10%] top-[78%] w-[18%] text-center">
          <div className="text-[5px] font-bold text-blue-500 tracking-wider">CLEAN H₂O</div>
        </div>
      </div>

      {/* Floor pad */}
      <div className="w-[90%] h-1 rounded-full bg-gray-300/60 mt-0.5" />
    </div>
  );
}
