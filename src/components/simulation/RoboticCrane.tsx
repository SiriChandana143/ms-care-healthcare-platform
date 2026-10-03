interface RoboticCraneProps {
  deployed: boolean;
  hasWaste: boolean;
  className?: string;
}

export function RoboticCrane({ deployed, hasWaste, className = '' }: RoboticCraneProps) {
  return (
    <div className={`absolute bed-transition ${className}`} style={{
      transform: deployed ? 'translateY(0) scaleY(1)' : 'translateY(100%) scaleY(0)',
      transformOrigin: 'bottom center',
      transitionDuration: '1.2s',
      opacity: deployed ? 1 : 0,
    }}>
      {/* Crane arm */}
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Vertical arm segment 1 */}
        <div className="w-2 h-[35%] rounded-t bg-gradient-to-b from-gray-300 to-gray-400 shadow-soft" />

        {/* Joint */}
        <div className="w-3 h-3 rounded-full bg-navy-700 border border-navy-600 z-10" />

        {/* Horizontal arm */}
        <div className="w-[60%] h-2 rounded bg-gradient-to-r from-gray-300 to-gray-400 shadow-soft -mt-1" />

        {/* Gripper */}
        <div className="relative -mt-0.5">
          <div className="w-4 h-3 rounded-b-lg bg-navy-800 flex items-center justify-center">
            <div className="w-2 h-1 rounded bg-medical-400" />
          </div>
          {/* Gripper claws */}
          <div className="flex justify-between w-5 -mt-0.5">
            <div className="w-0.5 h-2 rounded-b bg-navy-700" />
            <div className="w-0.5 h-2 rounded-b bg-navy-700" />
          </div>

          {/* Sealed waste package */}
          {hasWaste && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-4 rounded-md bg-gradient-to-b from-safe-200 to-safe-300 border border-safe-500 flex items-center justify-center shadow-soft">
              <span className="text-[6px] font-bold text-safe-700">SEALED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
