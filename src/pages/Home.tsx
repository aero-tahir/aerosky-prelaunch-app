import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search, Map as MapIcon, ChevronRight, Activity, Globe, Radio,
  Shield, Flag, Database, Lock, Radar, Plane, TowerControl,
  BarChart3, Users, Zap, ArrowRight, CheckCircle2, MapPin,
  CloudLightning, Eye, Server, Fingerprint, IndianRupee
} from 'lucide-react';
import MapBackground from '@/components/map/MapBackground';
import { GLOBAL_STATS, NEWS_TICKER, AIRPORTS } from '@/data/mockData';
import { FLIGHTS as MOCK_FLIGHTS } from '@/data/mockData';
import { generateFallbackFlights } from '@/data/fallbackFlights';
import { rankedSearch, FlightResultRow } from '@/components/search/FlightSearch';
import type { Flight } from '@/types';

/* ─── Animated Counter Hook ─── */
const useCounter = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startOnView && ref.current) {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
        { threshold: 0.3 }
      );
      obs.observe(ref.current);
      return () => obs.disconnect();
    }
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
};

/* ─── India Flag Colors: Orange → White → Green ─── */
const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';
const INDIA_CENTER = { lat: 22, lng: 64 };

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  /* ─── Flight data (mock only) ─── */
  const [liveFlights, setLiveFlights] = useState<Flight[]>([]);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [dataStatus, setDataStatus] = useState<'loading' | 'live' | 'fallback'>('loading');

  useEffect(() => {
    const fallback = generateFallbackFlights();
    setLiveFlights(fallback);
    setLiveCount(fallback.length);
    setDataStatus('fallback');
  }, []);

  /* ─── All flights for search autocomplete ─── */
  const allSearchFlights = useMemo(() => [...MOCK_FLIGHTS, ...liveFlights], [liveFlights]);
  const searchResults = useMemo(() => rankedSearch(searchTerm, allSearchFlights), [searchTerm, allSearchFlights]);
  const [searchActiveIdx, setSearchActiveIdx] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleFlightSelect = useCallback((flightId: string) => {
    navigate(`/explore/map?flight=${encodeURIComponent(flightId)}`);
  }, [navigate]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchActiveIdx(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchActiveIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchActiveIdx >= 0 && searchResults[searchActiveIdx]) {
        handleFlightSelect(searchResults[searchActiveIdx].id);
      } else if (searchTerm.trim()) {
        navigate('/explore/map');
      }
    }
  };

  // Close search dropdown on outside click
  useEffect(() => {
    if (!isFocused) return;
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isFocused]);

  const quickLinks = [
    { label: 'DEL', path: '/airports/DEL', full: 'New Delhi' },
    { label: 'BOM', path: '/airports/BOM', full: 'Mumbai' },
    { label: 'BLR', path: '/airports/BLR', full: 'Bengaluru' },
    { label: '6E 554', path: '/explore/map?flight=6E554', full: 'IndiGo' },
  ];

  const flightsCounter = useCounter(liveCount || 4203, 2000);
  const airportsCounter = useCounter(137, 1500);
  const coverageCounter = useCounter(98, 1200);
  const feedersCounter = useCounter(850, 1800);

  return (
    <div className="relative w-full h-full bg-slate-50 dark:bg-sky-950 overflow-y-auto overflow-x-hidden scroll-smooth transition-colors duration-300" id="aerosky-home">

      {/* ══════════════════════════════════════════════════════════
          Tricolor Top Accent (always visible)
      ══════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] flex" aria-hidden="true">
        <div className="flex-1" style={{ background: INDIA_ORANGE }} />
        <div className="flex-1 bg-white" />
        <div className="flex-1" style={{ background: INDIA_GREEN }} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: HERO (Map on right, Content on left)
          Fits entirely above the fold (100vh)
      ══════════════════════════════════════════════════════════ */}
      <section
        id="hero-section"
        className="relative h-screen w-full overflow-hidden"
        aria-label="AeroSky: India's Sovereign Airspace Intelligence"
      >
        {/* ── Map Background: light Ola map, dark→light gradient overlay ── */}
        <div className="absolute inset-0 z-0">
          <MapBackground
            interactive={false}
            flights={liveFlights}
            showFlights={true}
            showAirports={true}
            center={INDIA_CENTER}
            zoom={4}
            className="w-full h-full"
            theme={theme}
          />

          {/* Layer 1: Dark→Light gradient (left=100% dark, right=transparent) */}
          <div
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-slate-50 via-slate-50/80 via-30% to-transparent dark:from-[#020617] dark:via-[#020617]/90 dark:via-30% dark:to-transparent"
          />

          {/* Layer 2: Subtle patriotic accent at transition */}
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
            style={{
              background: `linear-gradient(135deg, ${INDIA_ORANGE}00 30%, ${INDIA_ORANGE} 50%, transparent 55%, ${INDIA_GREEN} 60%, ${INDIA_GREEN}00 75%)`
            }}
          />

          {/* Layer 3: Top/bottom blends - reduced opacity in light mode */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50/50 dark:from-sky-950/80 dark:via-transparent dark:to-sky-950" />
        </div>

        {/* ── Live data badge (top-right, over map) ── */}
        <div className="absolute top-16 sm:top-8 right-3 sm:right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          <div className={`w-2 h-2 rounded-full ${dataStatus === 'live' ? 'bg-green-400 animate-pulse' : dataStatus === 'loading' ? 'bg-yellow-400 animate-pulse' : 'bg-blue-400'}`} />
          <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest">
            {dataStatus === 'live' ? `${liveCount} LIVE FLIGHTS` : dataStatus === 'loading' ? 'CONNECTING...' : 'DEMO DATA'}
          </span>
        </div>

        {/* ── Hero Content (left side, vertically centered within viewport) ── */}
        <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-20 pt-16 sm:pt-4 pb-4">
          <div className="w-full max-w-xl">

            {/* Sovereign Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-[0.15em] mb-3 animate-slide-up"
              style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}
            >
              <Shield size={12} className="animate-pulse" />
              SOVEREIGN DATA • MADE IN INDIA • DGCA COMPLIANT
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.88] tracking-tighter mb-3 animate-slide-up delay-100">
              <span style={{ color: INDIA_ORANGE }}>India's Own</span><br />
              <span className="text-slate-900 dark:text-white">Airspace</span>{' '}
              <span style={{ color: INDIA_GREEN }}>Intelligence</span>
            </h1>

            {/* SEO Subheading */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-gray-400 mb-2 max-w-lg leading-relaxed animate-slide-up delay-200">
              India's first sovereign flight visibility &amp; aviation analytics platform.
              Real-time ADS-B coverage across <strong className="text-slate-900 dark:text-white">137+ Indian airports</strong>,
              powered by indigenous data infrastructure.
            </p>

            {/* Trust Badges: unique signals (sovereign/DGCA/infra covered above & in pillars) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 animate-slide-up delay-200">
              <TrustBadge icon={<Fingerprint size={11} />} color={INDIA_GREEN} text="DPDPA Compliant" />
              <span className="hidden sm:inline text-slate-400 dark:text-gray-600 text-[8px]">●</span>
              <TrustBadge icon={<Activity size={11} />} color="#60A5FA" text="99.9% Uptime SLA" />
              <span className="hidden sm:inline text-slate-400 dark:text-gray-600 text-[8px]">●</span>
              <TrustBadge icon={<Zap size={11} />} color={INDIA_ORANGE} text="Sub-Second Latency" />
            </div>

            {/* Search */}
            <div ref={searchContainerRef} className="relative mb-4 animate-slide-up delay-300 z-30">
              <div className={`relative group transition-all duration-500 ease-out ${isFocused ? 'scale-[1.02]' : ''}`}>
                <div
                  className={`absolute -inset-1 blur-xl rounded-2xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
                  style={{ background: `linear-gradient(90deg, ${INDIA_ORANGE}40, #FFFFFF30, ${INDIA_GREEN}40)` }}
                />
                <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl flex items-center p-1.5 shadow-xl dark:shadow-2xl hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                  <Search className={`ml-3 mr-2 transition-colors ${isFocused ? 'text-orange-400' : 'text-slate-400 dark:text-gray-500'}`} size={20} />
                  <input
                    id="flight-search-input"
                    type="text"
                    placeholder="Search flight, airline, registration, airport..."
                    className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-0 text-sm py-2 font-medium outline-none"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setSearchActiveIdx(-1); }}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Search flights, airports, or aircraft registrations across Indian airspace"
                  />
                  <button
                    onClick={() => { if (searchTerm.trim()) navigate('/explore/map'); }}
                    className="text-black p-2.5 rounded-lg hover:opacity-90 transition-all shadow-lg font-bold"
                    style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
                    aria-label="Search"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Autocomplete dropdown */}
                {isFocused && searchTerm.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0c1222]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[240px] sm:max-h-[320px] overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-5 text-center">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">No flights found for "{searchTerm}"</p>
                      </div>
                    ) : (
                      searchResults.map((flight, idx) => (
                        <FlightResultRow
                          key={flight.id}
                          flight={flight}
                          query={searchTerm}
                          active={idx === searchActiveIdx}
                          onClick={() => handleFlightSelect(flight.id)}
                          onHover={() => setSearchActiveIdx(idx)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2 ml-1">
                <span className="text-[10px] text-slate-600 dark:text-gray-400 font-mono py-0.5 uppercase tracking-wider">Trending:</span>
                {quickLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="text-[10px] font-mono font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors border border-slate-200 dark:border-white/5 hover:border-orange-400/30"
                  >
                    {link.label} <span className="text-gray-600 font-normal ml-1">{link.full}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Metrics: compact */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden backdrop-blur-md animate-slide-up delay-400 shadow-xl border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-white/5">
              <div ref={flightsCounter.ref}>
                <StatBlock icon={<Plane size={14} />} label="Flights" value={flightsCounter.count.toLocaleString()} color="text-white" accentColor={INDIA_ORANGE} />
              </div>
              <div ref={airportsCounter.ref}>
                <StatBlock icon={<TowerControl size={14} />} label="Airports" value={airportsCounter.count.toString()} color="text-white" accentColor="#FFFFFF" />
              </div>
              <div ref={coverageCounter.ref}>
                <StatBlock icon={<Radar size={14} />} label="Coverage" value={`${coverageCounter.count}%`} color="text-white" accentColor={INDIA_GREEN} />
              </div>
              <div ref={feedersCounter.ref}>
                <StatBlock icon={<Radio size={14} />} label="Ground Stations" value={feedersCounter.count.toLocaleString()} color="text-white" accentColor="#60A5FA" />
              </div>
            </div>

            {/* CTA Row: compact */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 animate-slide-up delay-500">
              <button
                id="cta-open-live-map"
                onClick={() => navigate('/explore/map')}
                className="flex-1 text-black text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(255,153,51,0.2)] hover:shadow-[0_0_40px_rgba(255,153,51,0.35)] hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
              >
                <MapIcon size={18} /> Open Live Map
              </button>
              <button
                id="cta-api-access"
                onClick={() => navigate('/data')}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-sm font-bold text-slate-700 dark:text-white transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm"
              >
                <Database size={16} /> Sovereign API
              </button>
            </div>

          </div>
        </div>

        {/* Scroll hint: pinned to bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 animate-bounce opacity-30">
          <ChevronRight size={12} className="text-gray-500 rotate-90" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: SOVEREIGN DATA PILLARS
      ══════════════════════════════════════════════════════════ */}
      <section id="sovereign-pillars" className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="Why India Needs Sovereign Aviation Data">
        <article className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <Flag size={12} style={{ color: INDIA_ORANGE }} /> Why Sovereign Aviation Data Matters
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Built in India. <span style={{ color: INDIA_ORANGE }}>For India.</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              AeroSky is India's indigenous airspace intelligence platform, protecting critical Indian aviation data.
              stays on Indian soil, processed by Indian infrastructure, governed by Indian laws.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            <SovereignPillar icon={<Lock size={28} />} title="100% Data Sovereignty" description="Every byte of flight data (including ADS-B, MLAT, and radar feeds) is processed and stored exclusively in Indian data centers. Zero foreign cloud dependency." accentColor={INDIA_ORANGE} stats={[{ label: 'Data Centers', value: 'IN-Only' }, { label: 'GDPR+DPDPA', value: 'Compliant' }]} />
            <SovereignPillar icon={<Shield size={28} />} title="DGCA & MoCA Aligned" description="Purpose-built for DGCA regulations and Ministry of Civil Aviation directives. ICAO standards with Indian regulatory frameworks." accentColor="#FFFFFF" stats={[{ label: 'Standards', value: 'ICAO/DGCA' }, { label: 'Audit', value: 'Certified' }]} />
            <SovereignPillar icon={<Zap size={28} />} title="Indigenous Tech Stack" description="From ADS-B receiver firmware to AI-powered flight prediction, our entire stack is conceived, developed, and maintained by Indian engineers." accentColor={INDIA_GREEN} stats={[{ label: 'Engineers', value: '100% Indian' }, { label: 'R&D', value: 'Bengaluru' }]} />
          </div>
        </article>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: INDIA'S AIRSPACE IN NUMBERS
      ══════════════════════════════════════════════════════════ */}
      <section id="india-airspace-stats" className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="Indian Aviation Statistics">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <BarChart3 size={12} className="text-blue-400" /> Indian Aviation at a Glance
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              The Pulse of <span style={{ color: INDIA_ORANGE }}>Indian Aviation</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Real-time intelligence from the world's third-largest and fastest-growing domestic aviation market.
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            <BigStat value="7,000+" label="Daily Domestic Flights" icon={<Plane size={20} />} color={INDIA_ORANGE} />
            <BigStat value="137+" label="Airports Connected" icon={<TowerControl size={20} />} color="#FFFFFF" />
            <BigStat value="14+" label="Indian Airlines Observed" icon={<Globe size={20} />} color="#60A5FA" />
            <BigStat value="3.28L Km²" label="Airspace Intelligence" icon={<Radar size={20} />} color={INDIA_GREEN} />
          </div>

          <div className="mt-10 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: INDIA_GREEN }} />
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Indian Airlines We Track</span>
            </div>
            <div className="p-5 flex flex-wrap gap-3 justify-center">
              {['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Akasa Air', 'Air India Express', 'Alliance Air', 'Star Air', 'Fly91', 'IndiGo Cargo', 'Blue Dart Aviation', 'Pawan Hans', 'Air India SATS', 'Heritage Aviation'].map((airline) => (
                <span key={airline} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-gray-300 font-medium hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 transition-colors cursor-default">{airline}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: MAJOR INDIAN AIRPORTS
      ══════════════════════════════════════════════════════════ */}
      <section id="indian-airports" className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="Major Indian Airports: Live Visibility">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <MapPin size={12} style={{ color: INDIA_GREEN }} /> Airport Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              India's Busiest <span style={{ color: INDIA_GREEN }}>Airports</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Access live visibility, METAR weather, runway status, and flight schedules for every major Indian airport.
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', flights: '1,200+', icao: 'VIDP' },
              { code: 'BOM', name: 'CSM International', city: 'Mumbai', flights: '950+', icao: 'VABB' },
              { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', flights: '680+', icao: 'VOBL' },
              { code: 'MAA', name: 'Chennai Intl', city: 'Chennai', flights: '520+', icao: 'VOMM' },
              { code: 'CCU', name: 'Netaji Subhas', city: 'Kolkata', flights: '480+', icao: 'VECC' },
              { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', flights: '650+', icao: 'VOHS' },
              { code: 'GOI', name: 'Manohar Intl', city: 'Goa', flights: '320+', icao: 'VOGO' },
              { code: 'COK', name: 'Cochin Intl', city: 'Kochi', flights: '380+', icao: 'VOCI' },
              { code: 'AMD', name: 'Sardar Vallabhbhai', city: 'Ahmedabad', flights: '420+', icao: 'VAAH' },
              { code: 'JAI', name: 'Jaipur Intl', city: 'Jaipur', flights: '280+', icao: 'VIJP' },
            ].map((airport) => (
              <button
                key={airport.code}
                onClick={() => navigate(`/airports/${airport.code}`)}
                id={`airport-card-${airport.code}`}
                className="group relative p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 hover:shadow-lg dark:hover:bg-white/[0.06] hover:-translate-y-1 text-left shadow-sm dark:shadow-none"
              >
                <div className="text-xl font-mono font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-orange-500 dark:group-hover:text-orange-300 transition-colors">{airport.code}</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono mb-1.5">{airport.icao}</div>
                <div className="text-sm text-slate-600 dark:text-gray-300 font-medium mb-0.5">{airport.name}</div>
                <div className="text-xs text-slate-500 dark:text-gray-400">{airport.city}</div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[11px] font-mono font-bold" style={{ color: INDIA_GREEN }}>{airport.flights} flights/day</span>
                </div>
                <ArrowRight size={12} className="absolute top-4 right-4 text-slate-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: CAPABILITIES
      ══════════════════════════════════════════════════════════ */}
      <section id="capabilities" className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="AeroSky Platform Capabilities">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <Eye size={12} style={{ color: INDIA_ORANGE }} /> Platform Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Intelligence. <span style={{ color: INDIA_ORANGE }}>Reimagined.</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Precision tracking technology configured for civil aviation transparency, built from Indian soil.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <FeatureCard icon={<Radar size={24} />} title="Real-Time ADS-B Visibility" desc="Sub-second position updates from 850+ indigenous ADS-B receivers deployed across India, covering every FIR." accent={INDIA_ORANGE} />
            <FeatureCard icon={<CloudLightning size={24} />} title="Indian METAR & Weather" desc="Live weather feeds from IMD integrated with runway-level conditions for every operational Indian airport." accent="#60A5FA" />
            <FeatureCard icon={<BarChart3 size={24} />} title="Delay Analytics (DGCA)" desc="OTP metrics aligned with DGCA reporting standards. Compare airlines across Indian routes." accent={INDIA_GREEN} />
            <FeatureCard icon={<Lock size={24} />} title="Squawk & Alert Intelligence" desc="Real-time awareness of squawk codes (7500, 7600, 7700) with instant notifications for emergencies in Indian airspace." accent="#EF4444" />
            <FeatureCard icon={<Database size={24} />} title="Sovereign Aviation API" desc="RESTful APIs serving Indian aviation data with sub-100ms latency from Indian servers. DPDPA-compliant." accent="#A855F7" />
            <FeatureCard icon={<IndianRupee size={24} />} title="INR-First Pricing" desc="No USD markups. Transparent pricing in Indian Rupees with GST-compliant invoicing." accent="#FACC15" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6: TRUST / SOCIAL PROOF
      ══════════════════════════════════════════════════════════ */}
      <section id="trusted-by" className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="Trusted by Indian Aviation Community">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Trusted Across <span style={{ color: INDIA_ORANGE }}>Indian Aviation</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-xl mx-auto">
              From aviation enthusiasts to enterprise stakeholders, AeroSky provides comprehensive airspace awareness for India.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <TrustCard title="Aviation Enthusiasts" icon={<Users size={24} />} stat="50,000+" desc="Indian avgeeks observe flights daily on AeroSky." accent={INDIA_ORANGE} />
            <TrustCard title="Enterprise & MRO" icon={<Zap size={24} />} stat="120+" desc="MRO, cargo, and aviation companies use AeroSky APIs." accent="#60A5FA" />
            <TrustCard title="Ground Stations" icon={<Radio size={24} />} stat="850+" desc="Community-powered receivers from Srinagar to Kanyakumari." accent={INDIA_GREEN} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7: CTA
      ══════════════════════════════════════════════════════════ */}
      <section id="cta-section" className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="Join India's Sovereign Airspace Movement">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-400/20 text-[11px] font-mono font-bold tracking-widest uppercase mb-5" style={{ color: INDIA_ORANGE }}>
            <Flag size={12} /> Join the Sovereign Airspace Movement
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
            <span style={{ color: INDIA_ORANGE }}>India's Airspace.</span><br />
            <span className="text-slate-900 dark:text-white">India's Data.</span><br />
            <span style={{ color: INDIA_GREEN }}>India's Intelligence.</span>
          </h2>

          <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Be part of India's largest community-driven aviation intelligence network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="cta-explore-map-bottom"
              onClick={() => navigate('/explore/map')}
              className="px-8 py-4 rounded-xl text-black font-bold text-lg transition-all hover:-translate-y-1 shadow-[0_0_40px_rgba(255,153,51,0.2)] hover:shadow-[0_0_60px_rgba(255,153,51,0.3)] flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
            >
              <MapIcon size={22} /> Explore Indian Airspace
            </button>
            <button
              id="cta-become-feeder"
              onClick={() => navigate('/community')}
              className="px-8 py-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm dark:shadow-none"
            >
              <Radio size={22} /> Host a Ground Station
            </button>
          </div>

          <div className="mt-12 flex justify-center" aria-hidden="true">
            <div className="w-32 h-1 rounded-full flex overflow-hidden">
              <div className="flex-1" style={{ background: INDIA_ORANGE }} />
              <div className="flex-1 bg-white" />
              <div className="flex-1" style={{ background: INDIA_GREEN }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer id="footer" className="relative z-10 border-t border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-black/40 backdrop-blur-xl py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24" aria-label="AeroSky Footer">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Plane size={22} style={{ color: INDIA_ORANGE }} className="rotate-[-45deg]" />
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">AeroSky</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-3">India's first sovereign airspace intelligence platform. Made in India, for India.</p>
              <div className="flex items-center gap-2" aria-label="Indian Flag">
                <div className="w-3 h-3 rounded-sm" style={{ background: INDIA_ORANGE }} />
                <div className="w-3 h-3 rounded-sm bg-white" />
                <div className="w-3 h-3 rounded-sm" style={{ background: INDIA_GREEN }} />
                <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono ml-1">PROUDLY INDIAN</span>
              </div>
            </div>
            <nav aria-label="Flight Visibility">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Flight Visibility</h3>
              <ul className="space-y-1.5">
                {['Live Flight Map', 'Flight Status', 'Airport Arrivals & Departures', 'Airline OTP', 'Aircraft Lookup'].map((item) => (
                  <li key={item}><span className="text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Indian Airports">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Indian Airports</h3>
              <ul className="space-y-1.5">
                {['Delhi (DEL)', 'Mumbai (BOM)', 'Bengaluru (BLR)', 'Chennai (MAA)', 'Hyderabad (HYD)', 'Kolkata (CCU)'].map((item) => (
                  <li key={item}><span className="text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Data and Compliance">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Data & Compliance</h3>
              <ul className="space-y-1.5">
                {['API Documentation', 'DGCA Compliance', 'DPDPA Policy', 'Ground Station Program', 'Enterprise Solutions', 'Contact'].map((item) => (
                  <li key={item}><span className="text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-500 dark:text-gray-400">© 2026 AeroSky - AeroLytics Intelligence Pvt. Ltd. | Made with 🇮🇳 in India</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">DGCA Reg. No: RPAS-XXXX</span>
              <span className="text-slate-400 dark:text-gray-700">|</span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">ISO 27001:2022</span>
              <span className="text-slate-400 dark:text-gray-700">|</span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">Data Hosted: IN (Mumbai, Hyderabad)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
          LIVE FEED TICKER
      ══════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-xl" role="marquee" aria-label="Live Indian Airspace Feed">
        <div className="flex items-center h-10">
          <div className="px-3 md:px-5 h-full flex items-center border-r border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: INDIA_ORANGE }} />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: INDIA_ORANGE }}>Live Feed</span>
          </div>
          <div className="flex-1 overflow-hidden relative group">
            <div className="ticker-wrap">
              <div className="ticker font-mono text-xs md:text-sm text-slate-600 dark:text-gray-300 py-2 group-hover:[animation-play-state:paused]">
                {NEWS_TICKER.map((item) => (
                  <span key={item.id} className="inline-flex items-center mr-16">
                    <span className={`mr-3 font-bold ${item.type === 'alert' ? 'text-red-500' : 'text-blue-400'}`}>
                      {item.type === 'alert' ? '/// ALERT' : '/// INFO'}
                    </span>
                    {item.text}
                  </span>
                ))}
                {NEWS_TICKER.map((item) => (
                  <span key={`dup-${item.id}`} className="inline-flex items-center mr-16">
                    <span className={`mr-3 font-bold ${item.type === 'alert' ? 'text-red-500' : 'text-blue-400'}`}>
                      {item.type === 'alert' ? '/// ALERT' : '/// INFO'}
                    </span>
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
            {/* Left gradient for ticker fade */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

const TrustBadge = ({ icon, color, text }: { icon: React.ReactNode; color: string; text: string }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
    <span style={{ color }}>{icon}</span> {text}
  </span>
);

const StatBlock = ({ icon, label, value, color, accentColor }: {
  icon: React.ReactNode; label: string; value: string; color: string; accentColor: string;
}) => (
  <div className="bg-white/40 dark:bg-black/30 p-3 hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300 group cursor-default backdrop-blur-sm border-r border-slate-200 dark:border-white/5 last:border-0 relative">
    <div className="flex items-center gap-1.5 mb-1">
      <span style={{ color: accentColor }}>{icon}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className={`text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white`}>{value}</div>
  </div>
);

const SovereignPillar = ({ icon, title, description, accentColor, stats }: {
  icon: React.ReactNode; title: string; description: string; accentColor: string;
  stats: { label: string; value: string }[];
}) => (
  <article className="group relative p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 hover:shadow-lg dark:hover:bg-white/[0.04] shadow-sm dark:shadow-none">
    <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: accentColor }} />
    <div className="mb-3" style={{ color: accentColor }}>{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
    <div className="flex gap-3">
      {stats.map((s) => (
        <div key={s.label} className="flex-1 bg-slate-50 dark:bg-white/[0.03] rounded-lg p-2.5 border border-slate-100 dark:border-white/5">
          <div className="text-[10px] font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider">{s.label}</div>
          <div className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">{s.value}</div>
        </div>
      ))}
    </div>
  </article>
);

const BigStat = ({ value, label, icon, color }: {
  value: string; label: string; icon: React.ReactNode; color: string;
}) => (
  <div className="text-center p-4 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all hover:shadow-md dark:hover:bg-white/[0.04] shadow-sm dark:shadow-none">
    <div className="mb-2 flex justify-center" style={{ color }}>{icon}</div>
    <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-slate-900 dark:text-white mb-1">{value}</div>
    <div className="text-[10px] sm:text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wider font-medium">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, accent }: {
  icon: React.ReactNode; title: string; desc: string; accent: string;
}) => (
  <article className="group relative p-5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 hover:shadow-lg dark:hover:bg-white/[0.05] hover:-translate-y-1 shadow-sm dark:shadow-none">
    <div className="mb-3 p-2.5 rounded-lg inline-flex" style={{ background: `${accent}12`, color: accent }}>{icon}</div>
    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
  </article>
);

const TrustCard = ({ title, icon, stat, desc, accent }: {
  title: string; icon: React.ReactNode; stat: string; desc: string; accent: string;
}) => (
  <div className="text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all hover:shadow-md shadow-sm dark:shadow-none">
    <div className="mb-3 flex justify-center" style={{ color: accent }}>{icon}</div>
    <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white mb-1">{stat}</div>
    <div className="text-sm font-bold text-slate-700 dark:text-white mb-1.5">{title}</div>
    <p className="text-slate-600 dark:text-gray-400 text-sm">{desc}</p>
  </div>
);

export default Home;