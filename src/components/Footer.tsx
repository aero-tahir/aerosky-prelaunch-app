import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="AeroSky Footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Plane size={22} style={{ color: INDIA_ORANGE }} className="rotate-[-45deg]" />
              <span className="text-xl font-bold tracking-tighter text-white">AeroSky</span>
            </div>
            <p className="text-sm text-sky-200/60 leading-relaxed mb-3">
              Building India's community-powered airspace intelligence platform.
            </p>
            <div className="flex items-center gap-2" aria-label="Indian Flag">
              <div className="w-3 h-3 rounded-sm" style={{ background: INDIA_ORANGE }} />
              <div className="w-3 h-3 rounded-sm bg-white" />
              <div className="w-3 h-3 rounded-sm" style={{ background: INDIA_GREEN }} />
              <span className="text-[10px] text-sky-300/50 font-mono ml-1">PROUDLY INDIAN</span>
            </div>
          </div>

          {/* Platform */}
          <nav aria-label="Platform">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-1.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Feeders', to: '/feeders' },
                { label: 'Coverage', to: '/coverage' },
                { label: 'About', to: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-sky-200/60 hover:text-amber-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Community */}
          <nav aria-label="Community">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Community</h3>
            <ul className="space-y-1.5">
              {[
                { label: 'Blog', to: '/blog' },
                { label: 'Community', to: '/community' },
                { label: 'Discord', to: '/community' },
                { label: 'GitHub', to: '/community' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-sky-200/60 hover:text-amber-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Legal</h3>
            <ul className="space-y-1.5">
              <li><span className="text-sm text-sky-200/60 cursor-default">Privacy Policy</span></li>
              <li><span className="text-sm text-sky-200/60 cursor-default">Terms of Service</span></li>
              <li><span className="text-sm text-sky-200/60 cursor-default">Contact</span></li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-sky-200/60">© 2025 AeroSky - AeroLytics Intelligence Pvt. Ltd. | Made in India</p>
          <span className="text-[10px] text-sky-200/50 font-mono">Pre-Launch • Pune, India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
