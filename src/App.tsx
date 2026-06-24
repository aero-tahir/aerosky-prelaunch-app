import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { trackEvent } from './utils/analytics';

const Home = lazy(() => import('./pages/Home'));
const AeroCaptains = lazy(() => import('./pages/AeroCaptains'));
const HallOfFame = lazy(() => import('./pages/HallOfFame'));
const Coverage = lazy(() => import('./pages/Coverage'));
const Insights = lazy(() => import('./pages/Insights'));
const Community = lazy(() => import('./pages/Community'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Support = lazy(() => import('./pages/Support'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest">Loading</span>
    </div>
  </div>
);

// GTM Route Change Tracker
const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let eventName = '';
    
    if (path === '/') eventName = 'home_page_viewed';
    else if (path === '/about') eventName = 'about_page_viewed';
    else if (path === '/community') eventName = 'community_page_viewed';
    else if (path === '/coverage') eventName = 'coverage_page_viewed';
    else if (path === '/aerocaptains/hall-of-fame') eventName = 'hall_of_fame_viewed';
    else if (path === '/insights') eventName = 'insights_page_viewed';
    else if (path === '/support') eventName = 'support_page_viewed';
    else if (path.startsWith('/member/')) eventName = 'member_dashboard_viewed';
    else if (path === '/privacy') eventName = 'privacy_page_viewed';
    else if (path === '/terms') eventName = 'terms_page_viewed';
    else if (path === '/cookie-policy') eventName = 'cookie_policy_viewed';

    if (eventName) {
      trackEvent(eventName, { path });
    }
  }, [location]);

  return null;
};

const App: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <PageTracker />
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="aerocaptains" element={<AeroCaptains />} />
        <Route path="aerocaptains/hall-of-fame" element={<HallOfFame />} />
        <Route path="coverage" element={<Coverage />} />
        <Route path="insights" element={<Insights />} />
        <Route path="insights/:slug" element={<Insights />} />
        <Route path="community" element={<Community />} />
        <Route path="about" element={<About />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="support" element={<Support />} />
        <Route path="member/:memberId" element={<MemberDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default App;
