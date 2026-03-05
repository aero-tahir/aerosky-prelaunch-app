import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy loading components for Performance Enhancement
const Home = lazy(() => import('./pages/Home'));
const LiveMap = lazy(() => import('./pages/LiveMap'));
const FlightDetails = lazy(() => import('./pages/FlightDetails'));
const AirportHub = lazy(() => import('./pages/AirportHub'));
const Coverage = lazy(() => import('./pages/Coverage'));
const DataApi = lazy(() => import('./pages/DataApi'));
const Intelligence = lazy(() => import('./pages/Intelligence'));
const GenericContent = lazy(() => import('./pages/GenericContent'));

// Dummy components for routes not yet fully detailed in prompt
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-screen pt-20 text-white text-2xl font-mono">
    {title} - Coming Soon
  </div>
);

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
            <Route path="airports/:code" element={<AirportHub />} />
            <Route path="coverage" element={<Coverage />} />
            <Route path="data" element={<DataApi />} />

            {/* Detailed Pages */}
            <Route path="intelligence" element={<Intelligence />} />

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

            <Route path="login" element={<Placeholder title="Login" />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
