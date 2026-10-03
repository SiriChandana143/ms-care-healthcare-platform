import { useState, useEffect } from 'react';
import type { PageName, CareMode } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SimulationPage } from './pages/SimulationPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { WastePage } from './pages/WastePage';
import { StatusPage } from './pages/StatusPage';
import { AboutPage } from './pages/AboutPage';
import { SystemProvider } from './context/SystemContext';
import { EntryPage, type AppMode } from './pages/EntryPage';
import { BedriddenCareTypePage } from './pages/BedriddenCareTypePage';
import { VacuumPage } from './pages/VacuumPage';
import { NormalCaringPage } from './pages/NormalCaringPage';
import { SensorInitiatedCarePage } from './pages/SensorInitiatedCarePage';
import { HospitalPage } from './pages/HospitalPage';
import { NavigationPage } from './pages/NavigationPage';

function App() {
  const [mode, setMode] = useState<AppMode>('entry');
  const [page, setPage] = useState<PageName>('home');
  const [pendingCareMode, setPendingCareMode] = useState<CareMode>('patientInitiatedBedridden');
  const [navTargetRoom, setNavTargetRoom] = useState<string | null>(null);

  const handleNavigate = (newPage: PageName) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMode = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === 'caring') {
      setPage('home');
    }
    setNavTargetRoom(null);
    window.scrollTo({ top: 0 });
  };

  const handleSelectBedriddenType = (careMode: CareMode | 'sensor-initiated-care') => {
    if (careMode === 'sensor-initiated-care') {
      setMode('sensor-initiated-care');
      window.scrollTo({ top: 0 });
      return;
    }

    setPendingCareMode(careMode);
    setMode('caring');
    setPage('home');
    window.scrollTo({ top: 0 });
  };

  const handleSwitchMode = () => {
    setMode('entry');
    setNavTargetRoom(null);
    window.scrollTo({ top: 0 });
  };

  // Cross-module: Hospital → Navigation with a target room
  const handleNavigateToRoom = (room: string) => {
    setNavTargetRoom(room || null);
    setMode('navigation');
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  // Entry screen — mode selection
  if (mode === 'entry') {
    return <EntryPage onSelect={handleSelectMode} />;
  }

  // Vacuum Cleaner experience
  if (mode === 'vacuum') {
    return <VacuumPage onSwitchMode={handleSwitchMode} />;
  }

  // Normal Caring experience
  if (mode === 'normal-caring') {
    return <NormalCaringPage onSwitchMode={handleSwitchMode} />;
  }

  // Sensor-Initiated Bedridden Care experience — separate standalone page
  if (mode === 'sensor-initiated-care') {
    return <SensorInitiatedCarePage onSwitchMode={handleSwitchMode} />;
  }

  // Bedridden care type selection
  if (mode === 'bedridden-care-type') {
    return <BedriddenCareTypePage onSelect={handleSelectBedriddenType} onSwitchMode={handleSwitchMode} />;
  }

  // Ms.care Hospital experience
  if (mode === 'hospital') {
    return <HospitalPage onSwitchMode={handleSwitchMode} onNavigateToRoom={handleNavigateToRoom} />;
  }

  // Ms.care Navigation experience
  if (mode === 'navigation') {
    return <NavigationPage onSwitchMode={handleSwitchMode} targetRoom={navTargetRoom} />;
  }

  // Caring experience — existing website wrapped in SystemProvider
  return (
    <SystemProvider initialCareMode={pendingCareMode}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header currentPage={page} onNavigate={handleNavigate} onSwitchMode={handleSwitchMode} />
        <main className="flex-1">
          {page === 'home' && <HomePage onNavigate={handleNavigate} />}
          {page === 'how-it-works' && <HowItWorksPage onNavigate={handleNavigate} />}
          {page === 'simulation' && <SimulationPage onNavigate={handleNavigate} />}
          {page === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {page === 'notifications' && <NotificationsPage />}
          {page === 'history' && <HistoryPage />}
          {page === 'waste' && <WastePage />}
          {page === 'status' && <StatusPage />}
          {page === 'about' && <AboutPage onNavigate={handleNavigate} />}
        </main>
        <Footer onNavigate={handleNavigate} onSwitchMode={handleSwitchMode} />
      </div>
    </SystemProvider>
  );
}

export default App;
