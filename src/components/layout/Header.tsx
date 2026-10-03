import { useState } from 'react';
import { Menu, X, Activity, Home } from 'lucide-react';
import type { PageName } from '@/types';

interface HeaderProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  onSwitchMode?: () => void;
}

const NAV_ITEMS: { label: string; page: PageName }[] = [
  { label: 'Home', page: 'home' },
  { label: 'How It Works', page: 'how-it-works' },
  { label: 'Simulation', page: 'simulation' },
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Care History', page: 'history' },
  { label: 'Waste', page: 'waste' },
  { label: 'System Status', page: 'status' },
  { label: 'About', page: 'about' },
];

export function Header({ currentPage, onNavigate, onSwitchMode }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageName) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all">
              <Activity className="w-5 h-5 text-medical-400" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold font-display text-navy-900 leading-none">Ms.care</div>
              <div className="text-[10px] text-navy-400 tracking-wide leading-none mt-0.5">Robotic Care</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.page
                    ? 'bg-navy-900 text-white shadow-soft'
                    : 'text-navy-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Switch mode + Mobile menu button */}
          <div className="flex items-center gap-2">
            {onSwitchMode && (
              <button
                onClick={onSwitchMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-gray-50 transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Switch Mode</span>
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-navy-600 hover:bg-gray-50"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden py-3 border-t border-gray-100 flex flex-col gap-1 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                  currentPage === item.page
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onSwitchMode && (
              <button
                onClick={onSwitchMode}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-left text-navy-600 hover:bg-gray-50 transition-all"
              >
                <Home className="w-4 h-4" />
                Switch Mode
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
