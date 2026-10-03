interface MovableCenterSectionProps {
  isOpen: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MovableCenterSection({ isOpen, className = '', style }: MovableCenterSectionProps) {
  return (
    <div
      className={`absolute bed-transition ${className}`}
      style={{
        ...style,
        transform: isOpen ? 'translateX(120%)' : 'translateX(0)',
        transitionDuration: '1.8s',
      }}
    >
      {/* Air cells on the movable section */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${(i * 100) / 5}%`,
              height: `${100 / 5 - 1}%`,
              left: '8%',
              right: '8%',
              background: `linear-gradient(180deg, ${
                i % 2 === 0 ? '#dbeafe' : '#bfdbfe'
              } 0%, ${i % 2 === 0 ? '#bfdbfe' : '#93c5fd'} 50%, ${
                i % 2 === 0 ? '#dbeafe' : '#bfdbfe'
              } 100%)`,
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(37,99,235,0.15)',
            }}
          />
        ))}
        {/* Lock indicator */}
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-medical-400 shadow-medical-400" />
      </div>
      {/* Edge highlight to show it's a separate piece */}
      <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
        boxShadow: isOpen ? '0 0 0 1px rgba(37,99,235,0.3), 0 4px 12px rgba(37,99,235,0.15)' : 'inset 0 0 0 1px rgba(37,99,235,0.08)',
      }} />
    </div>
  );
}
