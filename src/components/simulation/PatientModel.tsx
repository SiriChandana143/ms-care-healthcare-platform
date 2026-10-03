interface PatientModelProps {
  className?: string;
}

export function PatientModel({ className = '' }: PatientModelProps) {
  return (
    <div className={`relative ${className}`} style={{ pointerEvents: 'none' }}>
      {/* Patient body — lying flat, covered with a blanket */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Head */}
        <div
          className="absolute rounded-full bg-gray-200/80"
          style={{
            width: '14%',
            height: '55%',
            left: '6%',
            top: '18%',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.08)',
          }}
        />
        {/* Body under blanket */}
        <div
          className="absolute rounded-2xl"
          style={{
            width: '72%',
            height: '65%',
            left: '20%',
            top: '15%',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
            boxShadow: '0 2px 8px rgba(16,42,67,0.08), inset 0 1px 3px rgba(255,255,255,0.6)',
          }}
        >
          {/* Blanket fold detail */}
          <div className="absolute inset-x-0 top-0 h-1/3 rounded-t-2xl" style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          }} />
          {/* Subtle blanket texture lines */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full" style={{
                top: `${20 + i * 15}%`,
                height: '1px',
                background: '#94a3b8',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
