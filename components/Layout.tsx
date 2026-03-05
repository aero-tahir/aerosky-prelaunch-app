import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Map, Plane, Menu, X, Radio,
  Shield, BarChart3, Users, Database,
  Zap, Globe, ChevronRight, Sun, Moon,
  LayoutGrid, Activity, TowerControl, Wifi,
  Play, AlertTriangle, FileText, Code, Award,
  Settings, Bell, Search, History, Clock,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMapPage = location.pathname.includes('/explore/map');
  const { theme, toggleTheme } = useTheme();

  /* ─── India Colors & Theme ─── */
  const INDIA_ORANGE = '#FF9933';
  const INDIA_GREEN = '#138808';

  /* ─── Navigation Structure ─── */
  const NAV_STRUCTURE = [
    {
      id: 'airspace', label: 'Live Airspace', icon: <Globe size={14} />, accent: 'text-blue-500',
      submenu: [
        {
          title: 'Map Views', items: [
            { label: 'Map View', icon: <Map size={14} />, to: '/explore/map' },
            { label: 'Traffic Density', icon: <Activity size={14} />, to: '/explore/map?layer=density' },
            { label: 'Coverage Confidence', icon: <Wifi size={14} />, to: '/explore/map?layer=confidence' },
          ]
        },
        {
          title: 'Time Travel', items: [
            { label: '24h Replay', icon: <History size={14} />, to: '/playback/24h' },
            { label: 'Historical Traffic', icon: <Clock size={14} />, to: '/playback/history' },
          ]
        }
      ]
    },
    {
      id: 'registry', label: 'Intelligence', icon: <Database size={14} />, accent: 'text-amber-500',
      submenu: [
        {
          title: 'Sector Intelligence', items: [
            { label: 'Intelligence Hub', icon: <Search size={14} />, to: '/intelligence' },
            { label: 'Aircraft Intelligence', icon: <Plane size={14} />, to: '/intelligence?tab=aircraft' },
            { label: 'Airline Intelligence', icon: <LayoutGrid size={14} />, to: '/intelligence?tab=airlines' },
          ]
        },
        {
          title: 'Infrastructure', items: [
            { label: 'Airport Intelligence', icon: <TowerControl size={14} />, to: '/intelligence?tab=airports' },
          ]
        }
      ]
    },
    {
      id: 'network', label: 'India Connection', icon: <Radio size={14} />, accent: 'text-emerald-500',
      submenu: [
        {
          title: 'National Network', items: [
            { label: 'Coverage Map', icon: <Map size={14} />, to: '/coverage' },
            { label: 'Feeders & Stations', icon: <Radio size={14} />, to: '/feeders' },
          ]
        }
      ]
    },
    {
      id: 'intelligence', label: 'Analytics', icon: <BarChart3 size={14} />, accent: 'text-purple-500',
      submenu: [
        {
          title: 'Market Trends', items: [
            { label: 'Traffic Trends', icon: <Activity size={14} />, to: '/insights/trends' },
            { label: 'Weekly Report', icon: <FileText size={14} />, to: '/insights/reports' },
          ]
        },
        {
          title: 'Alerts', items: [
            { label: 'Emergency Squawks', icon: <AlertTriangle size={14} />, to: '/alerts/squawks' },
          ]
        }
      ]
    },
    {
      id: 'community', label: 'Collaborators', icon: <Users size={14} />, accent: 'text-cyan-500',
      submenu: [
        {
          title: 'Collaborators', items: [
            { label: 'Top Contributors', icon: <Award size={14} />, to: '/community/contributors' },
            { label: 'Developer Ecosystem', icon: <Code size={14} />, to: '/data' },
          ]
        }
      ]
    }
  ];

  /* ─── Styles ─── */
  const mobileTabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full py-2.5 space-y-0.5 transition-colors duration-200 ${isActive ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500 dark:text-white/30'}`;

  return (
    <div className="flex flex-col h-screen w-full relative">

      {/* ═══ Skip Navigation (Accessibility — WCAG 2.4.1) ═══ */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ═══ Desktop Navigation Bar ═══ */}
      <header role="banner" className="hidden md:block absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <nav
          aria-label="Main navigation"
          className={`flex items-center justify-between px-5 py-2.5 pointer-events-auto transition-all duration-500 ${isMapPage
            ? 'bg-white/90 dark:bg-[#060a18]/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/[0.02]'
            : 'bg-white/90 dark:bg-[#060a18]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/[0.04]'
            }`}
        >
          {/* Left — Brand */}
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2 group" aria-label="AeroSky — India's Airspace Intelligence">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-lg" />
                <Plane className="text-amber-500 dark:text-amber-400 rotate-[-45deg] group-hover:rotate-[-30deg] transition-transform duration-500 relative z-10" size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Aero<span className="text-amber-500 dark:text-amber-400">Sky</span>
                </span>
                <span className="text-[7px] text-slate-500 dark:text-white/20 tracking-[0.15em] uppercase leading-none mt-0.5">
                  Bharat Airspace
                </span>
              </div>
            </NavLink>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-white/[0.06]" />

            {/* Mega Menu Navigation */}
            <div className="flex items-center gap-1">
              {NAV_STRUCTURE.map((item) => (
                <div key={item.id} className="relative group">
                  <button
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-300 focus-ring"
                  >
                    <span className={`opacity-70 group-hover:opacity-100 transition-opacity ${item.accent}`}>{item.icon}</span>
                    {item.label}
                    <ChevronDown size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>

                  {/* Dropdown Panel */}
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl dark:shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50 overflow-hidden">
                    <div className="p-1">
                      {item.submenu.map((group, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/[0.04] mb-1">
                            {group.title}
                          </div>
                          {group.items.map((subItem) => (
                            <NavLink
                              key={subItem.label}
                              to={subItem.to}
                              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'}`}
                            >
                              <span className="opacity-60">{subItem.icon}</span>
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Status + Actions */}
          <div className="flex items-center gap-3">
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400/80 font-medium tracking-wide uppercase">Live</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-white/[0.06]" />
              <span className="text-[9px] text-slate-400 dark:text-white/25 font-mono">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
              </span>
            </div>

            {/* Settings & Profile */}
            <div className="flex items-center gap-1">
              <button aria-label="Notifications" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors focus-ring">
                <Bell size={16} aria-hidden="true" />
              </button>
              <button aria-label="Settings" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors focus-ring">
                <Settings size={16} aria-hidden="true" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-amber-500 dark:hover:text-amber-400 transition-colors focus-ring"
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══ Main Content Area ═══ */}
      <main id="main-content" className={`flex-1 relative ${isMapPage ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`} role="main">
        <Outlet />
      </main>

      {/* ═══ Mobile Bottom Tab Bar ═══ */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#060a18]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.05] z-50 flex justify-between px-1 pb-safe"
      >
        <NavLink to="/explore/map" className={mobileTabClass} aria-label="Live Map">
          <Globe size={18} />
          <span className="text-[9px] font-semibold tracking-wide">Map</span>
        </NavLink>
        <NavLink to="/intelligence" className={mobileTabClass} aria-label="Intelligence">
          <Database size={18} />
          <span className="text-[9px] font-semibold tracking-wide">Intelligence</span>
        </NavLink>
        <NavLink to="/coverage" className={mobileTabClass} aria-label="Network">
          <Radio size={18} />
          <span className="text-[9px] font-semibold tracking-wide">Network</span>
        </NavLink>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`${mobileTabClass({ isActive: false })}`}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          <Menu size={18} />
          <span className="text-[9px] font-semibold tracking-wide">More</span>
        </button>
      </nav>

      {/* ═══ Mobile Full-Screen Menu ═══ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-white/98 dark:bg-[#060a18]/98 backdrop-blur-2xl flex flex-col transition-colors duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Plane className="text-amber-500 dark:text-amber-400 rotate-[-45deg]" size={18} />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Aero<span className="text-amber-500 dark:text-amber-400">Sky</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {NAV_STRUCTURE.map((group) => (
              <div key={group.id}>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
                  <span className={group.accent}>{group.icon}</span> {group.label}
                </div>
                <div className="space-y-1">
                  {group.submenu.flatMap(s => s.items).map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                          ? 'bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white/80'
                        }`
                      }
                    >
                      <div className="opacity-70">{item.icon}</div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-[10px] bg-slate-100 dark:bg-white/[0.05] px-3 py-1.5 rounded-lg text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              <span className="uppercase tracking-wider font-bold">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-600/50 dark:text-emerald-400/50 font-mono">Live</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;