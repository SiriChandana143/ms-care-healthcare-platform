import type { HospitalRoom } from '../../data/hospitalData';

interface RoomVisualProps {
  room: HospitalRoom;
  className?: string;
}

// Each room type gets a unique SVG illustration
// These are stylized educational illustrations, not real medical images
const VISUALS: Record<string, { bg: string; accent: string; render: () => JSX.Element }> = {
  reception: {
    bg: '#f0f4f8',
    accent: '#486581',
    render: () => (
      <g>
        {/* Floor */}
        <rect x="0" y="60" width="200" height="80" fill="#e8eef5" />
        {/* Reception desk */}
        <rect x="50" y="65" width="100" height="25" rx="4" fill="#627d98" />
        <rect x="55" y="60" width="90" height="8" rx="2" fill="#486581" />
        {/* Computer monitor */}
        <rect x="85" y="48" width="30" height="18" rx="2" fill="#334e68" />
        <rect x="87" y="50" width="26" height="14" rx="1" fill="#60a5fa" opacity="0.3" />
        <rect x="95" y="66" width="10" height="3" fill="#243b53" />
        {/* Person behind desk */}
        <circle cx="70" cy="48" r="7" fill="#bcccdc" />
        <rect x="64" y="55" width="12" height="14" rx="3" fill="#9fb3c8" />
        {/* Person in front */}
        <circle cx="130" cy="90" r="7" fill="#bfdbfe" />
        <rect x="124" y="97" width="12" height="18" rx="3" fill="#93c5fd" />
        {/* Sign */}
        <rect x="10" y="20" width="60" height="16" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
        <text x="40" y="31" textAnchor="middle" fontSize="8" fill="#2563eb" fontWeight="bold">RECEPTION</text>
        {/* Plant */}
        <circle cx="180" cy="70" r="8" fill="#bbf7d0" />
        <rect x="176" y="75" width="8" height="10" rx="1" fill="#8b6f47" />
      </g>
    ),
  },
  pharmacy: {
    bg: '#f0fdf4',
    accent: '#16a34a',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dcfce7" />
        {/* Shelves */}
        <rect x="15" y="25" width="60" height="8" fill="#86efac" />
        <rect x="15" y="38" width="60" height="8" fill="#86efac" />
        <rect x="15" y="51" width="60" height="8" fill="#86efac" />
        {/* Medicine bottles */}
        <rect x="20" y="26" width="6" height="6" rx="1" fill="#22c55e" />
        <rect x="30" y="26" width="6" height="6" rx="1" fill="#3b82f6" />
        <rect x="40" y="26" width="6" height="6" rx="1" fill="#eab308" />
        <rect x="50" y="26" width="6" height="6" rx="1" fill="#ef4444" />
        <rect x="60" y="26" width="6" height="6" rx="1" fill="#22c55e" />
        <rect x="20" y="39" width="6" height="6" rx="1" fill="#eab308" />
        <rect x="30" y="39" width="6" height="6" rx="1" fill="#22c55e" />
        <rect x="40" y="39" width="6" height="6" rx="1" fill="#3b82f6" />
        <rect x="50" y="39" width="6" height="6" rx="1" fill="#ef4444" />
        {/* Counter */}
        <rect x="100" y="70" width="80" height="20" rx="3" fill="#16a34a" />
        {/* Cross sign */}
        <rect x="130" y="25" width="30" height="30" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        <rect x="142" y="30" width="6" height="20" fill="#16a34a" />
        <rect x="135" y="37" width="20" height="6" fill="#16a34a" />
        {/* Pharmacist */}
        <circle cx="115" cy="56" r="7" fill="#bbf7d0" />
        <rect x="109" y="63" width="12" height="10" rx="3" fill="#86efac" />
      </g>
    ),
  },
  emergency: {
    bg: '#fef2f2',
    accent: '#dc2626',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#fee2e2" />
        {/* Emergency sign */}
        <rect x="70" y="15" width="60" height="20" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        <text x="100" y="28" textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold">EMERGENCY</text>
        {/* Bed */}
        <rect x="20" y="65" width="50" height="15" rx="2" fill="#f87171" />
        <rect x="22" y="60" width="10" height="8" rx="1" fill="#fca5a5" />
        <rect x="18" y="78" width="4" height="8" fill="#b91c1c" />
        <rect x="68" y="78" width="4" height="8" fill="#b91c1c" />
        {/* IV stand */}
        <line x1="80" y1="50" x2="80" y2="80" stroke="#b91c1c" strokeWidth="2" />
        <rect x="76" y="44" width="8" height="10" rx="1" fill="#fca5a5" />
        {/* Monitor */}
        <rect x="120" y="50" width="25" height="20" rx="2" fill="#1e3a8a" />
        <rect x="122" y="52" width="21" height="14" rx="1" fill="#60a5fa" opacity="0.4" />
        <path d="M 124 60 L 128 56 L 132 62 L 136 54 L 140 60" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        {/* Red cross */}
        <rect x="160" y="50" width="25" height="25" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        <rect x="170" y="54" width="5" height="17" fill="#dc2626" />
        <rect x="164" y="60" width="17" height="5" fill="#dc2626" />
      </g>
    ),
  },
  waiting: {
    bg: '#f0f9ff',
    accent: '#0ea5e9',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#e0f2fe" />
        {/* Chairs */}
        <rect x="20" y="70" width="18" height="14" rx="3" fill="#7dd3fc" />
        <rect x="20" y="65" width="18" height="6" rx="2" fill="#38bdf8" />
        <rect x="45" y="70" width="18" height="14" rx="3" fill="#7dd3fc" />
        <rect x="45" y="65" width="18" height="6" rx="2" fill="#38bdf8" />
        <rect x="70" y="70" width="18" height="14" rx="3" fill="#7dd3fc" />
        <rect x="70" y="65" width="18" height="6" rx="2" fill="#38bdf8" />
        {/* Table */}
        <rect x="110" y="72" width="30" height="12" rx="2" fill="#bae6fd" />
        {/* Magazine */}
        <rect x="115" y="66" width="8" height="6" rx="1" fill="#0284c7" />
        <rect x="125" y="66" width="8" height="6" rx="1" fill="#0369a1" />
        {/* Person sitting */}
        <circle cx="155" cy="64" r="7" fill="#bae6fd" />
        <rect x="149" y="71" width="12" height="12" rx="3" fill="#7dd3fc" />
        {/* Plant */}
        <circle cx="185" cy="68" r="9" fill="#bbf7d0" />
        <rect x="181" y="74" width="8" height="10" rx="1" fill="#8b6f47" />
        {/* Display board */}
        <rect x="60" y="15" width="80" height="12" rx="2" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="1" />
        <text x="100" y="24" textAnchor="middle" fontSize="6" fill="#0284c7" fontWeight="bold">NOW SERVING: A-024</text>
      </g>
    ),
  },
  nurse: {
    bg: '#eff6ff',
    accent: '#3b82f6',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dbeafe" />
        {/* Console desk */}
        <rect x="30" y="65" width="140" height="20" rx="4" fill="#60a5fa" />
        <rect x="35" y="60" width="130" height="8" rx="2" fill="#3b82f6" />
        {/* Monitors */}
        <rect x="50" y="40" width="30" height="20" rx="2" fill="#1e3a8a" />
        <rect x="52" y="42" width="26" height="16" rx="1" fill="#60a5fa" opacity="0.4" />
        <path d="M 55 52 L 60 48 L 65 54 L 70 46 L 75 52" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        <rect x="90" y="40" width="30" height="20" rx="2" fill="#1e3a8a" />
        <rect x="92" y="42" width="26" height="16" rx="1" fill="#60a5fa" opacity="0.4" />
        <rect x="130" y="40" width="30" height="20" rx="2" fill="#1e3a8a" />
        <rect x="132" y="42" width="26" height="16" rx="1" fill="#60a5fa" opacity="0.4" />
        {/* Nurse */}
        <circle cx="100" cy="30" r="8" fill="#bfdbfe" />
        <rect x="93" y="38" width="14" height="6" rx="2" fill="#93c5fd" />
        {/* Nurse cap with cross */}
        <rect x="95" y="22" width="10" height="5" rx="1" fill="#dbeafe" />
        <rect x="98" y="23" width="4" height="3" fill="#3b82f6" />
        {/* Medication cart */}
        <rect x="160" y="55" width="20" height="25" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
        <line x1="160" y1="62" x2="180" y2="62" stroke="#3b82f6" strokeWidth="0.5" />
        <line x1="160" y1="70" x2="180" y2="70" stroke="#3b82f6" strokeWidth="0.5" />
      </g>
    ),
  },
  xray: {
    bg: '#eff6ff',
    accent: '#2563eb',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dbeafe" />
        {/* X-ray machine arm */}
        <rect x="60" y="20" width="60" height="8" rx="2" fill="#334e68" />
        <rect x="85" y="28" width="10" height="30" fill="#243b53" />
        {/* X-ray panel */}
        <rect x="50" y="58" width="80" height="3" fill="#1e40af" />
        {/* Patient standing */}
        <circle cx="100" cy="42" r="7" fill="#bfdbfe" />
        <rect x="94" y="49" width="12" height="20" rx="3" fill="#93c5fd" />
        {/* Lead shield */}
        <rect x="92" y="55" width="16" height="10" rx="2" fill="#334e68" opacity="0.6" />
        {/* Technician */}
        <circle cx="160" cy="50" r="7" fill="#bfdbfe" />
        <rect x="154" y="57" width="12" height="15" rx="3" fill="#93c5fd" />
        {/* Control panel */}
        <rect x="155" y="72" width="30" height="12" rx="2" fill="#334e68" />
        <circle cx="162" cy="78" r="2" fill="#22c55e" />
        <circle cx="170" cy="78" r="2" fill="#eab308" />
        <circle cx="178" cy="78" r="2" fill="#ef4444" />
        {/* X-ray icon */}
        <rect x="15" y="20" width="25" height="25" rx="3" fill="#1e3a8a" />
        <path d="M 20 25 L 25 35 L 30 28 L 35 38" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
        <text x="27" y="52" textAnchor="middle" fontSize="5" fill="#2563eb" fontWeight="bold">X-RAY</text>
        {/* Radiation symbol */}
        <circle cx="27" cy="32" r="2" fill="#eab308" />
      </g>
    ),
  },
  ctscan: {
    bg: '#eff6ff',
    accent: '#2563eb',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dbeafe" />
        {/* CT Scanner — gantry */}
        <rect x="50" y="40" width="50" height="35" rx="6" fill="#334e68" />
        <circle cx="75" cy="57" r="14" fill="#1e3a8a" />
        <circle cx="75" cy="57" r="8" fill="#60a5fa" opacity="0.5" />
        <circle cx="75" cy="57" r="4" fill="#3b82f6" opacity="0.7" />
        {/* Scanner bed */}
        <rect x="40" y="68" width="70" height="8" rx="2" fill="#627d98" />
        <rect x="42" y="64" width="20" height="6" rx="1" fill="#9fb3c8" />
        {/* Patient on bed */}
        <circle cx="52" cy="60" r="5" fill="#bfdbfe" />
        <rect x="47" y="65" width="10" height="4" rx="2" fill="#93c5fd" />
        {/* Control console */}
        <rect x="130" y="55" width="40" height="20" rx="2" fill="#243b53" />
        <rect x="133" y="58" width="34" height="14" rx="1" fill="#60a5fa" opacity="0.3" />
        {/* Technician */}
        <circle cx="155" cy="45" r="6" fill="#bfdbfe" />
        <rect x="150" y="51" width="10" height="8" rx="2" fill="#93c5fd" />
        {/* CT label */}
        <text x="75" y="35" textAnchor="middle" fontSize="7" fill="#2563eb" fontWeight="bold">CT SCANNER</text>
      </g>
    ),
  },
  mri: {
    bg: '#eff6ff',
    accent: '#2563eb',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dbeafe" />
        {/* MRI machine — large tube */}
        <rect x="45" y="35" width="70" height="45" rx="10" fill="#334e68" />
        <ellipse cx="80" cy="57" rx="18" ry="18" fill="#1e3a8a" />
        <ellipse cx="80" cy="57" rx="12" ry="12" fill="#60a5fa" opacity="0.4" />
        <ellipse cx="80" cy="57" rx="6" ry="6" fill="#3b82f6" opacity="0.6" />
        {/* Bed sliding into MRI */}
        <rect x="50" y="68" width="80" height="6" rx="2" fill="#627d98" />
        <rect x="52" y="63" width="20" height="6" rx="1" fill="#9fb3c8" />
        {/* Patient */}
        <circle cx="58" cy="58" r="5" fill="#bfdbfe" />
        {/* Warning sign — no metal */}
        <rect x="135" y="25" width="45" height="18" rx="3" fill="#fef9c3" stroke="#eab308" strokeWidth="1.5" />
        <text x="157" y="37" textAnchor="middle" fontSize="6" fill="#ca8a04" fontWeight="bold">NO METAL</text>
        {/* Control console */}
        <rect x="140" y="55" width="35" height="18" rx="2" fill="#243b53" />
        <rect x="143" y="58" width="29" height="12" rx="1" fill="#60a5fa" opacity="0.3" />
        {/* MRI label */}
        <text x="80" y="28" textAnchor="middle" fontSize="7" fill="#2563eb" fontWeight="bold">MRI SCANNER</text>
        {/* Magnetic field lines */}
        <path d="M 55 50 Q 80 45 105 50" stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M 55 57 Q 80 52 105 57" stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M 55 64 Q 80 59 105 64" stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.5" />
      </g>
    ),
  },
  lab: {
    bg: '#fefce8',
    accent: '#ca8a04',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#fef9c3" />
        {/* Lab bench */}
        <rect x="15" y="62" width="170" height="15" rx="2" fill="#eab308" />
        {/* Microscope */}
        <rect x="25" y="48" width="5" height="15" fill="#ca8a04" />
        <rect x="22" y="45" width="11" height="5" rx="1" fill="#a16207" />
        <circle cx="27" cy="55" r="3" fill="#60a5fa" opacity="0.5" />
        {/* Test tubes */}
        <rect x="55" y="48" width="4" height="15" rx="1" fill="#22c55e" opacity="0.7" />
        <rect x="62" y="48" width="4" height="15" rx="1" fill="#ef4444" opacity="0.7" />
        <rect x="69" y="48" width="4" height="15" rx="1" fill="#3b82f6" opacity="0.7" />
        <rect x="76" y="48" width="4" height="15" rx="1" fill="#eab308" opacity="0.7" />
        {/* Rack */}
        <rect x="52" y="55" width="32" height="3" fill="#a16207" />
        {/* Centrifuge */}
        <rect x="105" y="48" width="20" height="15" rx="3" fill="#a16207" />
        <circle cx="115" cy="55" r="5" fill="#ca8a04" />
        <circle cx="115" cy="55" r="2" fill="#fef9c3" />
        {/* Blood analyzer */}
        <rect x="145" y="45" width="35" height="18" rx="2" fill="#334e68" />
        <rect x="148" y="48" width="29" height="12" rx="1" fill="#60a5fa" opacity="0.3" />
        <circle cx="155" cy="54" r="1.5" fill="#22c55e" />
        {/* Lab tech */}
        <circle cx="30" cy="35" r="7" fill="#fef9c3" stroke="#eab308" strokeWidth="1" />
        <rect x="24" y="42" width="12" height="12" rx="2" fill="#eab308" />
        {/* Flask */}
        <path d="M 95 50 L 90 62 L 100 62 Z" fill="#60a5fa" opacity="0.5" stroke="#3b82f6" strokeWidth="0.5" />
        <rect x="93" y="45" width="4" height="6" fill="#3b82f6" />
      </g>
    ),
  },
  cardiology: {
    bg: '#eff6ff',
    accent: '#2563eb',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dbeafe" />
        {/* Examination table */}
        <rect x="20" y="68" width="60" height="12" rx="3" fill="#627d98" />
        <rect x="22" y="64" width="15" height="6" rx="1" fill="#9fb3c8" />
        {/* Patient */}
        <circle cx="35" cy="60" r="6" fill="#bfdbfe" />
        <rect x="29" y="66" width="12" height="8" rx="3" fill="#93c5fd" />
        {/* ECG machine */}
        <rect x="110" y="45" width="40" height="25" rx="3" fill="#1e3a8a" />
        <rect x="113" y="48" width="34" height="16" rx="1" fill="#22c55e" opacity="0.2" />
        {/* ECG waveform */}
        <path d="M 115 56 L 120 56 L 123 50 L 126 62 L 129 52 L 132 56 L 140 56 L 143 50 L 146 62 L 149 56" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        {/* Doctor */}
        <circle cx="150" cy="38" r="7" fill="#bfdbfe" />
        <rect x="144" y="45" width="12" height="15" rx="3" fill="#60a5fa" />
        {/* Stethoscope */}
        <path d="M 145 48 Q 140 55 138 52" stroke="#334e68" strokeWidth="1.5" fill="none" />
        <circle cx="138" cy="52" r="2" fill="#334e68" />
        {/* Heart icon */}
        <path d="M 175 25 C 172 22 168 22 168 26 C 168 30 175 35 175 35 C 175 35 182 30 182 26 C 182 22 178 22 175 25" fill="#ef4444" />
        <text x="175" y="48" textAnchor="middle" fontSize="6" fill="#dc2626" fontWeight="bold">CARDIOLOGY</text>
      </g>
    ),
  },
  general: {
    bg: '#f0f4f8',
    accent: '#486581',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#e8eef5" />
        {/* Examination table */}
        <rect x="20" y="68" width="55" height="12" rx="3" fill="#486581" />
        <rect x="22" y="64" width="15" height="6" rx="1" fill="#627d98" />
        {/* Patient */}
        <circle cx="35" cy="60" r="6" fill="#bcccdc" />
        <rect x="29" y="66" width="12" height="8" rx="3" fill="#9fb3c8" />
        {/* Doctor desk */}
        <rect x="100" y="65" width="70" height="18" rx="3" fill="#627d98" />
        {/* Doctor */}
        <circle cx="135" cy="38" r="7" fill="#bcccdc" />
        <rect x="129" y="45" width="12" height="15" rx="3" fill="#486581" />
        {/* BP monitor */}
        <rect x="105" y="50" width="20" height="15" rx="2" fill="#334e68" />
        <circle cx="115" cy="57" r="5" fill="#60a5fa" opacity="0.3" />
        <text x="115" y="59" textAnchor="middle" fontSize="5" fill="#22c55e" fontWeight="bold">120/80</text>
        {/* Stethoscope on desk */}
        <path d="M 145 50 Q 150 55 155 50" stroke="#334e68" strokeWidth="1.5" fill="none" />
        <circle cx="155" cy="50" r="2" fill="#334e68" />
        {/* Chart */}
        <rect x="160" y="40" width="15" height="20" rx="1" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
        <line x1="163" y1="45" x2="172" y2="45" stroke="#3b82f6" strokeWidth="0.5" />
        <line x1="163" y1="48" x2="172" y2="48" stroke="#3b82f6" strokeWidth="0.5" />
        <line x1="163" y1="51" x2="168" y2="51" stroke="#3b82f6" strokeWidth="0.5" />
      </g>
    ),
  },
  pediatrics: {
    bg: '#f0fdf4',
    accent: '#16a34a',
    render: () => (
      <g>
        <rect x="0" y="60" width="200" height="80" fill="#dcfce7" />
        {/* Exam table — smaller, colorful */}
        <rect x="20" y="68" width="45" height="10" rx="3" fill="#22c55e" />
        <rect x="22" y="65" width="12" height="5" rx="1" fill="#86efac" />
        {/* Child patient */}
        <circle cx="35" cy="62" r="5" fill="#bbf7d0" />
        <rect x="30" y="67" width="10" height="6" rx="3" fill="#86efac" />
        {/* Doctor */}
        <circle cx="100" cy="40" r="7" fill="#bbf7d0" />
        <rect x="94" y="47" width="12" height="15" rx="3" fill="#22c55e" />
        {/* Teddy bear on table */}
        <circle cx="55" cy="62" r="4" fill="#ca8a04" />
        <circle cx="52" cy="59" r="2" fill="#ca8a04" />
        <circle cx="58" cy="59" r="2" fill="#ca8a04" />
        <circle cx="54" cy="62" r="1" fill="#a16207" />
        {/* Growth chart */}
        <rect x="130" y="35" width="30" height="35" rx="2" fill="#fef9c3" stroke="#eab308" strokeWidth="1" />
        <line x1="135" y1="40" x2="135" y2="65" stroke="#eab308" strokeWidth="0.5" />
        <line x1="135" y1="65" x2="155" y2="65" stroke="#eab308" strokeWidth="0.5" />
        <path d="M 137 60 L 142 55 L 147 50 L 152 45" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        {/* Weight scale */}
        <rect x="170" y="65" width="20" height="8" rx="2" fill="#86efac" />
        <text x="180" y="71" textAnchor="middle" fontSize="5" fill="#16a34a" fontWeight="bold">12 kg</text>
        {/* Balloon */}
        <circle cx="170" cy="25" r="6" fill="#fca5a5" />
        <line x1="170" y1="31" x2="170" y2="45" stroke="#9fb3c8" strokeWidth="0.5" />
      </g>
    ),
  },
};

export function RoomVisual({ room, className = '' }: RoomVisualProps) {
  const visual = VISUALS[room.visualType] ?? VISUALS.reception;

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-gray-100 ${className}`}
      style={{ background: `linear-gradient(to bottom, ${visual.bg} 0%, ${visual.bg}dd 100%)` }}
    >
      <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Wall */}
        <rect x="0" y="0" width="200" height="60" fill={visual.accent} opacity="0.08" />
        <line x1="0" y1="60" x2="200" y2="60" stroke={visual.accent} strokeWidth="1" opacity="0.2" />
        {/* Room content */}
        {visual.render()}
        {/* Floor texture lines */}
        <line x1="0" y1="100" x2="200" y2="100" stroke={visual.accent} strokeWidth="0.5" opacity="0.1" />
        <line x1="0" y1="120" x2="200" y2="120" stroke={visual.accent} strokeWidth="0.5" opacity="0.1" />
      </svg>
      {/* Educational demo label */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm">
        <span className="text-[9px] font-semibold text-navy-500">Educational Illustration</span>
      </div>
    </div>
  );
}
