import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

// Lazy loading components for Performance Enhancement
const Home = lazy(() => import('@/pages/Home'));
const LiveMap = lazy(() => import('@/pages/LiveMap'));
const FlightDetails = lazy(() => import('@/pages/FlightDetails'));
const AirportHub = lazy(() => import('@/pages/AirportHub'));
const Coverage = lazy(() => import('@/pages/Coverage'));
const DataApi = lazy(() => import('@/pages/DataApi'));
const Intelligence = lazy(() => import('@/pages/Intelligence'));
const AirportIntelligence = lazy(() => import('@/pages/AirportIntelligence'));
const GenericContent = lazy(() => import('@/pages/GenericContent'));

const LoadingPage = () => (
  <div className="flex items-center justify-center h-full min-h-screen bg-slate-50 dark:bg-sky-950 text-slate-900 dark:text-white font-mono flex-col gap-4">
    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" aria-label="Loading"></div>
    <div className="text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest text-sm">Loading AeroSky Interface...</div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore/map" element={<LiveMap />} />

            {/* Specific Routes (High Priority) */}
            <Route path="flights/search" element={<GenericContent />} />
            <Route path="flights/live" element={<GenericContent />} />
            <Route path="flights/routes" element={<GenericContent />} />
            <Route path="airports/congestion" element={<GenericContent />} />

            <Route path="flights/:id" element={<FlightDetails />} />
            <Route path="coverage" element={<Coverage />} />
            <Route path="data" element={<DataApi />} />

            {/* Detailed Pages */}
            <Route path="intelligence" element={<Intelligence />} />
            <Route path="intelligence/airports" element={<AirportIntelligence />} />
            <Route path="intelligence/airports/:code" element={<AirportHub />} />

            {/* Placeholders for secondary links */}
            {/* New Sections using Generic Template */}
            <Route path="flights/*" element={<GenericContent />} />
            <Route path="airports/*" element={<GenericContent />} />
            <Route path="coverage/*" element={<GenericContent />} />
            <Route path="feeders/*" element={<GenericContent />} />
            <Route path="insights/*" element={<GenericContent />} />
            <Route path="alerts/*" element={<GenericContent />} />
            <Route path="community/*" element={<GenericContent />} />
            <Route path="playback/*" element={<GenericContent />} />
            <Route path="intelligence/*" element={<GenericContent />} />
            <Route path="contribute/*" element={<GenericContent />} />
            <Route path="contribute" element={<GenericContent />} />
            <Route path="commercial" element={<GenericContent />} />
            <Route path="commercial/*" element={<GenericContent />} />
            <Route path="blog" element={<GenericContent />} />
            <Route path="blog/*" element={<GenericContent />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
