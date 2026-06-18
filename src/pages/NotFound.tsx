import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, AlertTriangle, ArrowLeft, LifeBuoy } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title="Page Not Found | AeroSky"
        description="The coordinates you requested do not map to active airspace paths. Return to your flight path."
      />
      
      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-rose-500/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center glass rounded-3xl p-8 sm:p-12 border border-white/[0.05]">
        {/* Animated warning emblem */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="text-rose-400" size={28} />
        </div>

        <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-[0.25em] mb-2 block">
          Error Code: 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Route Deviation
        </h1>
        <p className="text-xs sm:text-sm text-sky-200/60 leading-relaxed mb-8">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-black font-bold text-xs sm:text-sm transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.25)] hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={14} /> Return Home
          </Link>
          <Link
            to="/support"
            className="flex-1 px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
          >
            <LifeBuoy size={14} /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
