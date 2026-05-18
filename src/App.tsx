import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Feeders = lazy(() => import('./pages/Feeders'));
const Coverage = lazy(() => import('./pages/Coverage'));
const Blog = lazy(() => import('./pages/Blog'));
const Community = lazy(() => import('./pages/Community'));
const About = lazy(() => import('./pages/About'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest">Loading</span>
    </div>
  </div>
);

const App: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="feeders" element={<Feeders />} />
        <Route path="coverage" element={<Coverage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="community" element={<Community />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  </Suspense>
);

export default App;
