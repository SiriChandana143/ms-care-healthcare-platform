interface TopViewDiagramProps {
  isOpen: boolean;
  className?: string;
}

export function TopViewDiagram({ isOpen, className = '' }: TopViewDiagramProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full" style={{ aspectRatio: '2/1' }}>
        {/* Bed outline */}
        <div className="absolute inset-0 rounded-xl border-2 border-navy-300 bg-gray-50 overflow-hidden">
          {/* Head indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-navy-400 tracking-widest">
            HEAD
          </div>
          {/* Foot indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-navy-400 tracking-widest">
            FOOT
          </div>

          {/* Fixed left section */}
          <div className="absolute rounded-lg flex items-center justify-center" style={{
            top: '12%',
            bottom: '12%',
            left: '4%',
            width: '28%',
            background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #93c5fd',
          }}>
            <div className="text-center">
              <div className="text-[10px] font-bold text-navy-600">FIXED</div>
              <div className="text-[8px] text-navy-400">Left Section</div>
            </div>
            {/* Air cell lines */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-full rounded-full" style={{
                top: `${15 + i * 12}%`,
                height: '2px',
                background: 'rgba(37,99,235,0.15)',
              }} />
            ))}
          </div>

          {/* Center section / Opening */}
          {!isOpen ? (
            <div className="absolute rounded-lg flex items-center justify-center bed-transition" style={{
              top: '12%',
              bottom: '12%',
              left: '34%',
              width: '32%',
              background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '2px solid #60a5fa',
              transitionDuration: '1s',
            }}>
              <div className="text-center">
                <div className="text-[10px] font-bold text-medical-600">CENTER</div>
                <div className="text-[8px] text-navy-400">Movable Section</div>
              </div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-full rounded-full" style={{
                  top: `${15 + i * 12}%`,
                  height: '2px',
                  background: 'rgba(37,99,235,0.15)',
                }} />
              ))}
            </div>
          ) : (
            <>
              {/* Opening */}
              <div className="absolute rounded-lg flex items-center justify-center" style={{
                top: '12%',
                bottom: '12%',
                left: '34%',
                width: '32%',
                background: 'rgba(16,42,67,0.06)',
                border: '2px dashed #60a5fa',
              }}>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-medical-500">OPENING</div>
                  <div className="text-[8px] text-navy-400">Access Area</div>
                </div>
              </div>
              {/* Moved center section */}
              <div className="absolute rounded-lg flex items-center justify-center bed-transition" style={{
                top: '12%',
                bottom: '12%',
                right: '-2%',
                width: '20%',
                background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '2px solid #60a5fa',
                transitionDuration: '1s',
              }}>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-medical-600">C</div>
                </div>
                {/* Arrow */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-medical-500 text-xs">←</div>
              </div>
            </>
          )}

          {/* Fixed right section */}
          <div className="absolute rounded-lg flex items-center justify-center" style={{
            top: '12%',
            bottom: '12%',
            right: '4%',
            width: '28%',
            background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #93c5fd',
          }}>
            <div className="text-center">
              <div className="text-[10px] font-bold text-navy-600">FIXED</div>
              <div className="text-[8px] text-navy-400">Right Section</div>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-full rounded-full" style={{
                top: `${15 + i * 12}%`,
                height: '2px',
                background: 'rgba(37,99,235,0.15)',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="mt-3 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-navy-400 bg-medical-100" />
          <span className="text-navy-600 font-medium">Fixed Section</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-medical-500 bg-medical-100" />
          <span className="text-navy-600 font-medium">Movable Center</span>
        </div>
        {isOpen && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-dashed border-medical-500 bg-medical-50" />
            <span className="text-navy-600 font-medium">Opening</span>
          </div>
        )}
      </div>
    </div>
  );
}
