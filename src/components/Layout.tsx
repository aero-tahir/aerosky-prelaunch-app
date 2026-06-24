import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
    >
      Skip to main content
    </a>
    <Navbar />
    <main id="main-content" className="flex-1 relative z-10">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
