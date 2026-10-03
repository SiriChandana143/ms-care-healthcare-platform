import { Activity } from 'lucide-react';
import type { PageName } from '@/types';

interface FooterProps {
  onNavigate: (page: PageName) => void;
  onSwitchMode?: () => void;
}

export function Footer({ onNavigate, onSwitchMode }: FooterProps) {
  return (
    <footer className="mt-16 bg-navy-900 text-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-medical-400" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-bold font-display text-white">Ms.care</div>
                <div className="text-[10px] text-navy-300 tracking-wide">Smart Robotic Care</div>
              </div>
            </div>
            <p className="text-sm text-navy-300 max-w-md leading-relaxed">
              An intelligent robotic care concept designed to support hygienic bedside care while reducing
              unnecessary patient movement and caregiver workload.
            </p>
            <p className="text-xs text-navy-400 mt-3 italic">Because Every Patient Deserves Dignity.</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => onNavigate('simulation')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">Interactive Simulation</button>
              <button onClick={() => onNavigate('how-it-works')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">How It Works</button>
              <button onClick={() => onNavigate('dashboard')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('about')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">About MS.care</button>
            </div>
          </div>

          {/* System */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">System</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => onNavigate('status')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">System Status</button>
              <button onClick={() => onNavigate('history')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">Care History</button>
              <button onClick={() => onNavigate('waste')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">Waste Management</button>
              <button onClick={() => onNavigate('notifications')} className="text-sm text-navy-300 hover:text-white text-left transition-colors">Notifications</button>
              {onSwitchMode && (
                <button onClick={onSwitchMode} className="text-sm text-navy-300 hover:text-white text-left transition-colors">Switch Mode</button>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-navy-700">
          <p className="text-xs text-navy-400 leading-relaxed">
            MS.care is an academic healthcare-robotics concept prototype. The mechanical architecture shown is intended
            for demonstration and requires professional biomedical, mechanical, electrical, infection-control, and
            clinical validation before real-world patient use.
          </p>
          <p className="text-xs text-navy-500 mt-4">
            © 2026 Ms.care — College Innovation & Expo Prototype. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
