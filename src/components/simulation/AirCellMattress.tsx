interface AirCellMattressProps {
  className?: string;
}

export function AirCellMattress({ className = '' }: AirCellMattressProps) {
  const cells = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {cells.map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${(i * 100) / cells.length}%`,
            height: `${100 / cells.length - 1}%`,
            left: '4%',
            right: '4%',
            background: `linear-gradient(180deg, ${
              i % 2 === 0 ? '#dbeafe' : '#bfdbfe'
            } 0%, ${i % 2 === 0 ? '#bfdbfe' : '#93c5fd'} 50%, ${
              i % 2 === 0 ? '#dbeafe' : '#bfdbfe'
            } 100%)`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(37,99,235,0.15)',
          }}
        />
      ))}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(37,99,235,0.08) 100%)',
      }} />
    </div>
  );
}
