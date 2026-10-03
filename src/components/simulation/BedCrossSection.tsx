export function BedCrossSection({ className = '' }: { className?: string }) {
  const layers = [
    { label: 'Patient', sublabel: 'Lying comfortably', color: 'from-gray-100 to-gray-200', textColor: 'text-navy-700', icon: '👤' },
    { label: 'Alternating-Pressure Air-Cell Mattress', sublabel: 'Multiple longitudinal air cells', color: 'from-medical-100 to-medical-200', textColor: 'text-medical-700', icon: '🫧' },
    { label: 'Small Central Movable Section', sublabel: 'Slides sideways — only this moves', color: 'from-sky-100 to-sky-200', textColor: 'text-sky-700', icon: '⬌' },
    { label: 'Slider Mechanism', sublabel: 'Guided mechanical carrier', color: 'from-gray-200 to-gray-300', textColor: 'text-navy-600', icon: '⚙' },
    { label: 'Fresh / Used Disposable Cover', sublabel: 'Hygienic collection module', color: 'from-safe-50 to-safe-100', textColor: 'text-safe-700', icon: '✓' },
    { label: 'Mechanical Support Structure', sublabel: 'Fixed bed frame', color: 'from-navy-100 to-navy-200', textColor: 'text-navy-700', icon: '▔' },
  ];

  return (
    <div className={`card-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold text-navy-900 mb-1">Bed Cross-Section</h3>
      <p className="text-sm text-navy-500 mb-6">Layered technical view of the MS.care bed system</p>

      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div key={i} className="relative">
            <div
              className={`rounded-xl bg-gradient-to-r ${layer.color} px-4 py-3 flex items-center justify-between transition-all hover:shadow-soft`}
              style={{ marginLeft: `${i * 8}px`, marginRight: `${i * 8}px` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{layer.icon}</span>
                <div>
                  <div className={`text-sm font-semibold ${layer.textColor}`}>{layer.label}</div>
                  <div className="text-xs text-navy-400">{layer.sublabel}</div>
                </div>
              </div>
              <div className="text-navy-300 text-xs font-mono">L{layers.length - i}</div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center my-0.5">
                <svg className="w-3 h-3 text-navy-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3l4 6H6l4-6z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-medical-50 border border-medical-100">
        <p className="text-xs text-medical-700 leading-relaxed">
          <span className="font-semibold">Key principle:</span> The patient lies on a continuous alternating-pressure
          air-cell mattress. Only the small central rectangular section beneath the mattress slides sideways to create
          access. The patient's body, the head section, the foot section, and both side sections remain completely stationary.
        </p>
      </div>
    </div>
  );
}
