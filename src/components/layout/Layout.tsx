import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Map, Plane, Menu, X, Radio,
  Shield, BarChart3, Users, Database,
  Zap, Globe, ChevronRight, Sun, Moon,
  LayoutGrid, Activity, TowerControl,
  AlertTriangle, FileText, Code,
  Bell, Search, History, Clock,
  ChevronDown, Server, Briefcase, BookOpen, Newspaper, Lightbulb,
  LogIn, LogOut, User
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import AdSidebar from '@/components/panels/AdSidebar';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMapPage = location.pathname.includes('/explore/map');
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, login, logout, loginError } = useAuth();

  /* ── Listen for map focus mode (set by LiveMap via data attribute) ── */
  const [mapFocusMode, setMapFocusMode] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMapFocusMode(document.documentElement.getAttribute('data-map-focus') === 'true');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-map-focus'] });
    return () => observer.disconnect();
  }, []);

  /* ─── Navigation Structure ─── */
  const NAV_STRUCTURE = [
    {
      id: 'airspace', label: 'Live Airspace', icon: <Globe size={14} />, accent: 'text-blue-500',
      to: '/explore/map',
    },
    {
      id: 'intelligence', label: 'Intelligence', icon: <Database size={14} />, accent: 'text-amber-500',
      submenu: [
        {
          title: 'Aviation Data', items: [
            { label: 'Intelligence Hub', icon: <Search size={14} />, to: '/intelligence' },
            { label: 'Aircraft Database', icon: <Plane size={14} />, to: '/intelligence/aircraft' },
            { label: 'Airline Directory', icon: <LayoutGrid size={14} />, to: '/intelligence/airlines' },
            { label: 'Airport Operations', icon: <TowerControl size={14} />, to: '/intelligence/airports' },
          ]
        }
      ]
    },
    {
      id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} />, accent: 'text-purple-500',
      submenu: [
        {
          title: 'Insights', items: [
            { label: 'Traffic & Trends', icon: <Activity size={14} />, to: '/insights/trends' },
            { label: 'Weekly Reports', icon: <FileText size={14} />, to: '/insights/reports' },
            { label: 'Emergency Alerts', icon: <AlertTriangle size={14} />, to: '/alerts/squawks' },
          ]
        },
        {
          title: 'Historical', items: [
            { label: '24h Playback', icon: <History size={14} />, to: '/playback/24h' },
            { label: 'Flight History', icon: <Clock size={14} />, to: '/playback/history' },
          ]
        }
      ]
    },
    {
      id: 'community', label: 'Contribution', icon: <Radio size={14} />, accent: 'text-emerald-500',
      submenu: [
        {
          title: 'Share Data', items: [
            { label: 'Contributor Overview', icon: <Users size={14} />, to: '/contribute' },
            { label: 'Build a Receiver', icon: <Code size={14} />, to: '/contribute/build' },
            { label: 'Apply for Receiver', icon: <Zap size={14} />, to: '/contribute/apply' },
          ]
        },
        {
          title: 'Network Status', items: [
            { label: 'Coverage Map', icon: <Map size={14} />, to: '/coverage' },
            { label: 'Most Wanted Areas', icon: <Shield size={14} />, to: '/coverage/wanted' },
            { label: 'Network Statistics', icon: <Radio size={14} />, to: '/coverage/statistics' },
          ]
        }
      ]
    },
    {
      id: 'commercial', label: 'Commercial & API', icon: <Briefcase size={14} />, accent: 'text-indigo-500',
      submenu: [
        {
          title: 'Developer Solutions', items: [
            { label: 'Aviation Data API', icon: <Code size={14} />, to: '/commercial/api' },
            { label: 'Data Services', icon: <Database size={14} />, to: '/commercial/data-services' },
          ]
        },
        {
          title: 'Enterprise Services', items: [
            { label: 'App Integration', icon: <Zap size={14} />, to: '/commercial/integration' },
            { label: 'B2B Solutions', icon: <Server size={14} />, to: '/commercial/b2b' },
          ]
        }
      ]
    },
    {
      id: 'resources', label: 'Blog & Insights', icon: <BookOpen size={14} />, accent: 'text-pink-500',
      submenu: [
        {
          title: 'Resources', items: [
            { label: 'AeroSky Blog', icon: <Newspaper size={14} />, to: '/blog' },
            { label: 'Aviation Insights', icon: <Lightbulb size={14} />, to: '/insights/articles' },
          ]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen w-full relative">

      {/* ═══ HORIZONTAL LAYOUT: Content + Ad Sidebar ═══ */}
      <div className="flex-1 flex min-h-0">

      {/* ═══ Desktop Navigation Bar ═══ */}
      <div className="flex-1 flex flex-col min-w-0 relative">
      <header role="banner" className="hidden md:block absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <nav
          aria-label="Main navigation"
          className={`flex items-center justify-between px-5 py-2.5 pointer-events-auto transition-all duration-500 ${
            mapFocusMode
              ? 'bg-transparent border-b border-transparent'
              : isMapPage
                ? 'bg-white/90 dark:bg-[#060a18]/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/[0.02]'
                : 'bg-white/90 dark:bg-[#060a18]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/[0.04]'
            }`}
        >
          {/* Left: Brand */}
          <div className={`flex items-center gap-6 transition-opacity duration-500 ${mapFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <NavLink to="/" className="flex items-center gap-2 group" aria-label="AeroSky: India's Airspace Intelligence">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-lg" />
                <Plane className="text-amber-500 dark:text-amber-400 rotate-[-45deg] group-hover:rotate-[-30deg] transition-transform duration-500 relative z-10" size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Aero<span className="text-amber-500 dark:text-amber-400">Sky</span>
                </span>
                <span className="text-[7px] text-slate-500 dark:text-slate-500 tracking-[0.15em] uppercase leading-none mt-0.5">
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
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-300 focus-ring"
                    >
                      <span className={`opacity-70 group-hover:opacity-100 transition-opacity ${item.accent}`}>{item.icon}</span>
                      {item.label}
                    </NavLink>
                  ) : (
                    <>
                      <button
                        aria-haspopup="true"
                        aria-expanded="false"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-300 focus-ring"
                      >
                        <span className={`opacity-70 group-hover:opacity-100 transition-opacity ${item.accent}`}>{item.icon}</span>
                        {item.label}
                        <ChevronDown size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </button>

                      {/* Dropdown Panel */}
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl dark:shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50 overflow-hidden">
                        <div className="p-1">
                          {item.submenu?.map((group, idx) => (
                            <div key={idx} className="mb-2 last:mb-0">
                              <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-white/[0.04] mb-1">
                                {group.title}
                              </div>
                              {group.items.map((subItem) => (
                                <NavLink
                                  key={subItem.label}
                                  to={subItem.to}
                                  className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'}`}
                                >
                                  <span className="opacity-60">{subItem.icon}</span>
                                  {subItem.label}
                                </NavLink>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className={`flex items-center gap-3 transition-opacity duration-500 ${mapFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400/80 font-medium tracking-wide uppercase">Live</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-white/[0.06]" />
              <span className="text-[9px] text-slate-500 dark:text-slate-500 font-mono">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
              </span>
            </div>

            {/* Login & Profile */}
            <div className="flex items-center gap-1">
              <button aria-label="Notifications" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus-ring">
                <Bell size={16} aria-hidden="true" />
              </button>

              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus-ring">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <User size={12} className="text-amber-500" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide">{user?.name}</span>
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-40 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden p-1">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold tracking-wide uppercase transition-colors focus-ring"
                >
                  <LogIn size={13} aria-hidden="true" />
                  Login
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors focus-ring"
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══ Mobile Header (Logo + Hamburger) ═══ */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-5 py-3 flex items-center justify-between pointer-events-auto transition-all duration-500 ${
        mapFocusMode
          ? 'bg-transparent border-transparent'
          : 'bg-white/90 dark:bg-[#060a18]/95 border-slate-200 dark:border-white/[0.05]'
      }`}>
        <NavLink to="/" className={`flex items-center gap-2 group transition-opacity duration-500 ${mapFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} aria-label="AeroSky: India's Airspace Intelligence">
          <Plane className="text-amber-500 dark:text-amber-400 rotate-[-45deg]" size={20} />
          <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-white">
            Aero<span className="text-amber-500 dark:text-amber-400">Sky</span>
          </span>
        </NavLink>
        <div className={`flex items-center gap-3 transition-opacity duration-500 ${mapFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {isLoggedIn ? (
            <button onClick={logout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20" aria-label="Sign Out">
              <LogOut size={18} />
            </button>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-bold" aria-label="Login">
              Login
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/[0.04]"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] shadow-sm"
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ═══ Main Content Area ═══ */}
      <main id="main-content" className={`flex-1 relative ${isMapPage ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`} role="main">
        <Outlet />
      </main>
      </div>{/* end left column */}

      {/* ═══ AD SIDEBAR (right column — non-auth, desktop only) ═══ */}
      {!isLoggedIn && isMapPage && (
        <aside className="hidden lg:flex w-[260px] xl:w-[300px] shrink-0 border-l border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0e18] flex-col overflow-y-auto">
          <AdSidebar onUpgrade={() => setShowLoginModal(true)} />
        </aside>
      )}

      </div>{/* end horizontal layout */}


      {/* ═══ Mobile Slide-In Side Menu (Drawer) ═══ */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Side Panel (Drawer) */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm shadow-2xl flex flex-col transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${theme === 'dark' ? 'bg-[#060a18]' : 'bg-white'}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Plane className="text-amber-500 dark:text-amber-400 rotate-[-45deg]" size={20} />
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Aero<span className="text-amber-500 dark:text-amber-400">Sky</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
            {NAV_STRUCTURE.map((group) => (
              <div key={group.id} className="space-y-4">
                {group.to ? (
                  <NavLink
                    to={group.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 border ${isActive
                        ? 'bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-slate-200 border-slate-200 dark:border-white/10 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-slate-300'
                      }`
                    }
                  >
                    <div className={`p-2 rounded-lg bg-white dark:bg-white/5 shadow-sm ${group.accent}`}>{group.icon}</div>
                    <span className="text-base font-bold tracking-tight">{group.label}</span>
                    <ChevronRight size={16} className="ml-auto opacity-30" />
                  </NavLink>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                      {group.label}
                    </div>
                    <div className="space-y-2">
                      {group.submenu?.flatMap(s => s.items).map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 border ${isActive
                              ? 'bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-slate-200 border-slate-200 dark:border-white/10'
                              : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                            }`
                          }
                        >
                          <div className="opacity-70">{item.icon}</div>
                          <span className="text-sm font-semibold">{item.label}</span>
                          <ChevronRight size={14} className="ml-auto opacity-20" />
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Footer of Drawer */}
          <div className="p-6 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Operational Status</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400/80">Systems Normal</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Current Time</div>
                <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">IST {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Login Modal ═══ */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Login">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl p-8">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200" aria-label="Close">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <Plane className="text-amber-500 rotate-[-45deg]" size={20} />
              <span className="text-lg font-bold text-slate-900 dark:text-white">Aero<span className="text-amber-500">Sky</span></span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sign in to unlock full flight intelligence</p>
            {loginError && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                {loginError}
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const email = fd.get('email') as string;
              const password = fd.get('password') as string;
              login(email, password).then(ok => {
                if (ok) setShowLoginModal(false);
              });
            }} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input id="login-email" name="email" type="email" required placeholder="pilot@aerosky.in" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <input id="login-password" name="password" type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm tracking-wide uppercase transition-colors">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;