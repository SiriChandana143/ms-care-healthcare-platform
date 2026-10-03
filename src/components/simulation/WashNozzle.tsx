interface WashNozzleProps {
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function WashNozzle({ active, className = '', style }: WashNozzleProps) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={style}
    >
      {/* Nozzle housing (always part of slider, extends when active) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bed-transition"
        style={{
          bottom: active ? '30%' : '50%',
          width: '12%',
          height: active ? '40%' : '8%',
          transitionDuration: '1.2s',
        }}
      >
        {/* Nozzle body */}
        <div className="w-full h-full rounded-t-md bg-gradient-to-b from-gray-300 to-gray-400 border border-gray-400 shadow-soft" />

        {/* Nozzle tip */}
        {active && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full bg-medical-500" />
        )}
      </div>

      {/* Clean water flow — animated blue lines from nozzle downward */}
      {active && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={`clean-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${42 + i * 5}%`,
                top: '30%',
                width: '1.5px',
                height: '40%',
                background: 'linear-gradient(180deg, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.15) 100%)',
                animation: `wash-flow 1.5s ease-in ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Clean water supply line — from dock toward slider (subtle blue path) */}
      {active && (
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            right: '-60%',
            top: '45%',
            width: '60%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0.4) 100%)',
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={`supply-${i}`}
              className="absolute top-0 w-3 h-full rounded-full"
              style={{
                background: 'rgba(59,130,246,0.5)',
                animation: `wash-supply 2s linear ${i * 0.6}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Used water pathway — semi-transparent leading into sealed disposable bag */}
      {active && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Waste water channel (schematic, semi-transparent) */}
          <div
            className="absolute rounded-md"
            style={{
              left: '20%',
              top: '70%',
              width: '60%',
              height: '20%',
              background: 'linear-gradient(180deg, rgba(100,116,139,0.08) 0%, rgba(100,116,139,0.15) 100%)',
              border: '1px dashed rgba(100,116,139,0.25)',
            }}
          >
            {/* Animated waste water droplets flowing downward */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`waste-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: '0%',
                  width: '2px',
                  height: '60%',
                  background: 'linear-gradient(180deg, rgba(100,116,139,0.3) 0%, rgba(100,116,139,0.1) 100%)',
                  animation: `waste-flow 1.8s ease-in ${i * 0.4}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Sealed disposable waste-water bag (small, semi-transparent) */}
          <div
            className="absolute rounded-md border border-slate-300/60"
            style={{
              left: '30%',
              top: '88%',
              width: '40%',
              height: '10%',
              background: 'linear-gradient(180deg, rgba(241,245,249,0.7) 0%, rgba(203,213,225,0.5) 100%)',
              boxShadow: '0 1px 4px rgba(100,116,139,0.15)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[5px] font-bold text-slate-500 tracking-wider">SEALED</span>
            </div>
            {/* Bag fill line */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-slate-300/30" style={{ height: '40%' }} />
          </div>
        </div>
      )}

      {/* Status label */}
      {active && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="px-2 py-0.5 rounded-full bg-medical-500 text-white text-[7px] font-bold tracking-wider">
            WASHING
          </div>
        </div>
      )}

      {/* Sub-status indicators */}
      {active && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse-soft" />
            <span className="text-[5px] font-semibold text-blue-600">Clean water</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-50 border border-slate-200">
            <div className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="text-[5px] font-semibold text-slate-500">Used water sealed</span>
          </div>
        </div>
      )}
    </div>
  );
}
