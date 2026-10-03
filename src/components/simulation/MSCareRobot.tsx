interface MSCareRobotProps {
  scanning?: boolean;
  className?: string;
  compact?: boolean;
  docked?: boolean;
}

export function MSCareRobot({ scanning = false, className = '', compact = false, docked = false }: MSCareRobotProps) {
  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-12 h-8 rounded-full bg-gradient-to-b from-white to-gray-200 border border-navy-200 shadow-soft flex items-center justify-center">
          <div className="w-8 h-2 rounded-full bg-navy-800" />
        </div>
        {scanning && (
          <div className="absolute -inset-1 rounded-full border-2 border-medical-400 animate-pulse-soft" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full" style={{ aspectRatio: '1.3' }}>
        {/* Base shadow */}
        <div className="absolute bottom-[-4%] left-1/2 -translate-x-1/2 w-[85%] h-2 rounded-full bg-navy-900/12 blur-sm" />

        {/* Wheels (visible at bottom) */}
        <div className="absolute bottom-[2%] left-[12%] w-[8%] h-[10%] rounded-full bg-navy-700 border border-navy-600" />
        <div className="absolute bottom-[2%] right-[12%] w-[8%] h-[10%] rounded-full bg-navy-700 border border-navy-600" />
        <div className="absolute bottom-[2%] left-[46%] w-[8%] h-[10%] rounded-full bg-navy-700 border border-navy-600" />

        {/* Main body — low-profile rounded oblong, wider than tall */}
        <div
          className="relative w-full rounded-[40%] overflow-hidden border-2 border-navy-200"
          style={{
            height: '72%',
            marginTop: '8%',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 40%, #e2e8f0 100%)',
            boxShadow: '0 8px 24px rgba(16,42,67,0.12), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 6px rgba(16,42,67,0.06)',
          }}
        >
          {/* Top accent strip — medical blue */}
          <div className="absolute top-0 inset-x-[10%] h-[6%] rounded-b-full bg-medical-400/40" />

          {/* Dark front sensor/display bar — wide, low */}
          <div
            className="absolute rounded-lg bg-navy-900 flex items-center justify-center"
            style={{
              top: '20%',
              left: '12%',
              right: '12%',
              height: '22%',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-1.5">
              {/* Sensor LED */}
              <div className={`w-1.5 h-1.5 rounded-full ${scanning ? 'bg-medical-400 animate-pulse-soft' : 'bg-safe-400'}`} />
              <span className="text-white text-[8px] font-bold tracking-widest">MS.CARE</span>
              {/* Camera lens */}
              <div className="w-2 h-2 rounded-full bg-medical-500/70 border border-medical-300" style={{
                boxShadow: scanning ? '0 0 4px rgba(59,130,246,0.6)' : 'none',
              }} />
            </div>
          </div>

          {/* Side sensor modules */}
          <div className="absolute left-[4%] top-[48%] w-[6%] h-[12%] rounded-full bg-navy-700/60" />
          <div className="absolute right-[4%] top-[48%] w-[6%] h-[12%] rounded-full bg-navy-700/60" />

          {/* Logo plate */}
          <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="text-navy-800 text-[10px] font-bold tracking-tight leading-none">MS.care</div>
            <div className="text-medical-500 text-[6px] tracking-widest leading-none mt-0.5">ROBOTIC CARE</div>
          </div>

          {/* Subtle vent lines on body */}
          <div className="absolute left-[8%] top-[55%] w-[10%] h-[1px] bg-navy-200/40" />
          <div className="absolute left-[8%] top-[60%] w-[10%] h-[1px] bg-navy-200/40" />
          <div className="absolute right-[8%] top-[55%] w-[10%] h-[1px] bg-navy-200/40" />
          <div className="absolute right-[8%] top-[60%] w-[10%] h-[1px] bg-navy-200/40" />

          {/* Scanning beam */}
          {scanning && (
            <>
              <div className="absolute inset-0 overflow-hidden rounded-[40%]">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-medical-400/50 to-transparent animate-scan" />
              </div>
              <div className="absolute -inset-2 rounded-[40%] border border-medical-400/30 animate-pulse-soft" />
            </>
          )}

          {/* Docked indicator */}
          {docked && !scanning && (
            <div className="absolute bottom-[4%] right-[6%] w-1.5 h-1.5 rounded-full bg-safe-500 animate-pulse-soft" />
          )}
        </div>
      </div>
    </div>
  );
}
