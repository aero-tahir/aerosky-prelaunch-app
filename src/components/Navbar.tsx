import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Plane, Radio, ChevronDown } from 'lucide-react';
import { useSiteSettings } from '../context/CMSContext';


const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/community', label: 'Community' },
  { to: '/aerocaptains', label: 'AeroCaptains', badge: 'Apply Now' },
  { to: '/coverage', label: 'Coverage' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const siteSettings = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [istTime, setIstTime] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
  );

  useEffect(() => {
    const tick = () =>
      setIstTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
      );
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  // Focus trap and Escape key handler for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        const drawer = document.querySelector('[role="dialog"]');
        if (!drawer) return;

        const focusables = drawer.querySelectorAll('button, [href], input, select, textarea, [tabIndex="0"]');
        if (focusables.length === 0) return;
        
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        } else if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    const closeBtn = document.querySelector('[aria-label="Close menu"]') as HTMLElement;
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const ctaLink = siteSettings.primaryCtaLink || "/aerocaptains";
  const ctaText = siteSettings.primaryCtaText || "Become an AeroCaptain";

  return (
    <>
      {/* ── Tricolor Top Accent ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] flex" aria-hidden="true">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-india-green" />
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
                  {siteSettings.siteName || 'Aero'}<span className="text-amber-400">{siteSettings.siteName ? '' : 'Sky'}</span>
                </span>
                <span className="text-[9px] text-sky-200/60 tracking-[0.15em] uppercase leading-none mt-0.5">
                  India Airspace Network
                </span>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-white/[0.06]" />

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 relative ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-sky-100/70 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.5 text-[9px] font-extrabold bg-amber-500 text-black rounded uppercase tracking-wider scale-90 origin-bottom-left">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Status + CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Status */}
            <div className="hidden xl:flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-amber-400 font-medium tracking-wide uppercase">
                  {siteSettings.launchPhase || "Phase 1: Genesis"}
                </span>
              </div>
              <div className="w-px h-3 bg-white/[0.06]" />
              <span className="text-xs text-sky-200/60 font-mono">
                {istTime} IST
              </span>
            </div>

            {/* Join Founding Members CTA */}
            {ctaLink.startsWith('http') ? (
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase text-black transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] bg-gradient-to-r from-saffron to-gold"
              >
                {ctaText}
              </a>
            ) : (
              <Link
                to={ctaLink}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase text-black transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] bg-gradient-to-r from-saffron to-gold"
              >
                {ctaText}
              </Link>
            )}
          </div>

          {/* Mobile: buttons */}
          <div className="flex lg:hidden items-center gap-2">
            {ctaLink.startsWith('http') ? (
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-saffron to-gold"
              >
                <span className="hidden sm:inline">{ctaText}</span>
                <span className="inline sm:hidden">Join Network</span>
              </a>
            ) : (
              <Link
                to={ctaLink}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-saffron to-gold"
              >
                <span className="hidden sm:inline">{ctaText}</span>
                <span className="inline sm:hidden">Join Network</span>
              </Link>
            )}
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
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}
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
                {siteSettings.siteName || 'Aero'}<span className="text-amber-400">{siteSettings.siteName ? '' : 'Sky'}</span>
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
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-500 text-black rounded uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-white/[0.04] space-y-3">
              {ctaLink.startsWith('http') ? (
                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-2xl text-sm font-bold text-center text-black bg-gradient-to-r from-saffron to-gold"
                >
                  {ctaText}
                </a>
              ) : (
                <Link
                  to={ctaLink}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-2xl text-sm font-bold text-center text-black bg-gradient-to-r from-saffron to-gold"
                >
                  {ctaText}
                </Link>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-sky-200/60 uppercase tracking-widest mb-1">Status</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-400">
                    {siteSettings.launchPhase || "Phase 1: Genesis"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-sky-200/60 uppercase tracking-widest mb-1">Time</div>
                <div className="text-xs font-mono font-bold text-sky-200/60">
                  IST {istTime}
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
