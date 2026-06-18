import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Plane, Radio, ChevronDown } from 'lucide-react';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/community', label: 'Community' },
  { to: '/aerocaptains', label: 'AeroCaptains', badge: 'Founding Open' },
  { to: '/coverage', label: 'Coverage' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Tricolor Top Accent ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] flex" aria-hidden="true">
        <div className="flex-1" style={{ background: INDIA_ORANGE }} />
        <div className="flex-1 bg-white" />
        <div className="flex-1" style={{ background: INDIA_GREEN }} />
      </div>

      {/* ── Desktop Header ── */}
      <header
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#060a18]/90 backdrop-blur-xl border-b border-white/[0.04]'
            : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-4 sm:px-5 lg:px-8 py-2.5 max-w-[1400px] mx-auto" aria-label="Main navigation">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group" aria-label="AeroSky Home">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-lg" />
                <Plane className="text-amber-500 rotate-[-45deg] group-hover:rotate-[-30deg] transition-transform duration-500 relative z-10" size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white leading-none">
                  Aero<span className="text-amber-400">Sky</span>
                </span>
                <span className="text-[7px] text-sky-200/60 tracking-[0.15em] uppercase leading-none mt-0.5">
                  Bharat Airspace
                </span>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/[0.06]" />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase transition-all duration-300 relative ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-sky-100/70 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.5 text-[5px] font-extrabold bg-amber-500 text-black rounded uppercase tracking-wider scale-90 origin-bottom-left animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Status + CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Status */}
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[9px] text-amber-400/80 font-medium tracking-wide uppercase">Pre-Launch</span>
              </div>
              <div className="w-px h-3 bg-white/[0.06]" />
              <span className="text-[9px] text-sky-200/60 font-mono">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
              </span>
            </div>

            {/* AeroCaptain CTA */}
            <Link
              to="/aerocaptains"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-100/70 hover:text-amber-400 transition-colors uppercase tracking-wide"
            >
              <Radio size={12} /> Become an AeroCaptain
            </Link>

            {/* Join Founding Members CTA */}
            <a
              href="/#newsletter"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase text-black transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)]"
              style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
            >
              Join Founding Members
            </a>
          </div>

          {/* Mobile: buttons */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/#newsletter"
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-black"
              style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
            >
              Join Founding Members
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sky-200 hover:text-white hover:bg-white/[0.06] transition-colors border border-white/[0.06]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Slide-In Drawer ── */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm shadow-2xl flex flex-col transition-transform duration-300 transform bg-[#060a18] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Plane className="text-amber-400 rotate-[-45deg]" size={20} />
              <span className="text-lg font-bold text-white">
                Aero<span className="text-amber-400">Sky</span>
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] text-sky-300 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 border ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'text-sky-200 border-transparent hover:bg-white/[0.03] hover:text-white'
                  }`
                }
              >
                <span className="text-sm font-semibold flex items-center gap-2">
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[7px] font-extrabold bg-amber-500 text-black rounded uppercase tracking-wider animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-white/[0.04] space-y-3">
              <Link
                to="/aerocaptains"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-sky-200 hover:text-amber-400 transition-colors"
              >
                <Radio size={16} /> Become an AeroCaptain
              </Link>
              <a
                href="/#newsletter"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-2xl text-sm font-bold text-center text-black"
                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
              >
                Join Founding Members
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-sky-200/60 uppercase tracking-widest mb-1">Status</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-400/80">Pre-Launch</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-sky-200/60 uppercase tracking-widest mb-1">Time</div>
                <div className="text-xs font-mono font-bold text-sky-200/60">
                  IST {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
