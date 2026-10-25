import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MarineProvider } from './context/MarineContext';
import MainLayout from './components/layout/MainLayout';
import CoastalCommandPage from './pages/CoastalCommandPage';
import SatelliteGisPage from './pages/SatelliteGisPage';
import FleetReroutingPage from './pages/FleetReroutingPage';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingScreen from './components/ui/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <ErrorBoundary>
      <MarineProvider>
        <Router>
          <MainLayout>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/command" replace />} />
                <Route path="/command" element={<CoastalCommandPage />} />
                <Route path="/gis" element={<SatelliteGisPage />} />
                <Route path="/fleet" element={<FleetReroutingPage />} />
                <Route path="*" element={<Navigate to="/command" replace />} />
              </Routes>
            </ErrorBoundary>
          </MainLayout>
        </Router>
      </MarineProvider>
    </ErrorBoundary>
  );
}

