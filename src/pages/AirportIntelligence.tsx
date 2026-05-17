import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, TowerControl, Plane, PlaneTakeoff, PlaneLanding,
  Cloud, Wind, Eye, AlertTriangle, Activity, BarChart3,
  Clock, Radio, Shield, ChevronRight, Zap, Globe,
  ArrowUpRight, ArrowDownRight, Minus, MapPin, FileText,
  Bell, Database, Server, Users, Layers, Navigation,
  ArrowRight, Lock, Radar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/* ─── India Brand Colors ─── */
const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

/* ─── Static Airport Intelligence Data ─── */
const AIRPORT_INTEL = [
  {
    iata: 'DEL', icao: 'VIDP', name: 'Indira Gandhi International', city: 'New Delhi',
    lat: 28.5562, lng: 77.1000, elevation: '777 ft', runways: 3,
    terminals: 3, paxTraffic: '72.7M', hubAirlines: ['Air India', 'IndiGo', 'Vistara'],
    operator: 'DIAL', opened: 1962, timezone: 'IST (UTC+5:30)',
    arrivals: 142, departures: 138, delayIndex: 12, congestion: 67,
    weatherSeverity: 'Low', visibility: 'CAT-I', avgTaxiOut: '18 min',
    runwayUsage: '28L/28R Active', trend: 'up', metar: '32°C | 270°/5kt | 10km',
    monsoonRisk: 'High', militaryUsage: false, cargo: true,
  },
  {
    iata: 'BOM', icao: 'VABB', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai',
    lat: 19.0896, lng: 72.8656, elevation: '39 ft', runways: 2,
    terminals: 2, paxTraffic: '51.8M', hubAirlines: ['Air India', 'IndiGo', 'GoFirst'],
    operator: 'MIAL', opened: 1942, timezone: 'IST (UTC+5:30)',
    arrivals: 118, departures: 112, delayIndex: 28, congestion: 82,
    weatherSeverity: 'Moderate', visibility: 'CAT-II', avgTaxiOut: '24 min',
    runwayUsage: 'RWY 27 Active', trend: 'up', metar: '29°C | 120°/8kt | 8km',
    monsoonRisk: 'Very High', militaryUsage: false, cargo: true,
  },
  {
    iata: 'BLR', icao: 'VOBL', name: 'Kempegowda International', city: 'Bengaluru',
    lat: 13.1986, lng: 77.7066, elevation: '3000 ft', runways: 2,
    terminals: 2, paxTraffic: '37.5M', hubAirlines: ['IndiGo', 'Air India Express', 'Akasa'],
    operator: 'BIAL', opened: 2008, timezone: 'IST (UTC+5:30)',
    arrivals: 96, departures: 92, delayIndex: 8, congestion: 45,
    weatherSeverity: 'Low', visibility: 'CAT-I', avgTaxiOut: '12 min',
    runwayUsage: 'RWY 09L/09R Active', trend: 'stable', metar: '24°C | 090°/12kt | >10km',
    monsoonRisk: 'Moderate', militaryUsage: false, cargo: true,
  },
  {
    iata: 'HYD', icao: 'VOHS', name: 'Rajiv Gandhi International', city: 'Hyderabad',
    lat: 17.2403, lng: 78.4294, elevation: '2024 ft', runways: 1,
    terminals: 1, paxTraffic: '25.2M', hubAirlines: ['IndiGo', 'Air India'],
    operator: 'GMR', opened: 2008, timezone: 'IST (UTC+5:30)',
    arrivals: 72, departures: 68, delayIndex: 6, congestion: 38,
    weatherSeverity: 'Low', visibility: 'CAT-I', avgTaxiOut: '10 min',
    runwayUsage: 'RWY 09R Active', trend: 'stable', metar: '28°C | 180°/6kt | >10km',
    monsoonRisk: 'Moderate', militaryUsage: false, cargo: true,
  },
  {
    iata: 'MAA', icao: 'VOMM', name: 'Chennai International', city: 'Chennai',
    lat: 12.9941, lng: 80.1709, elevation: '52 ft', runways: 2,
    terminals: 2, paxTraffic: '22.4M', hubAirlines: ['IndiGo', 'SpiceJet', 'Air India'],
    operator: 'AAI', opened: 1954, timezone: 'IST (UTC+5:30)',
    arrivals: 64, departures: 60, delayIndex: 14, congestion: 52,
    weatherSeverity: 'Moderate', visibility: 'CAT-I', avgTaxiOut: '14 min',
    runwayUsage: 'RWY 07/25 Active', trend: 'down', metar: '30°C | 090°/10kt | 9km',
    monsoonRisk: 'High', militaryUsage: true, cargo: true,
  },
  {
    iata: 'CCU', icao: 'VECC', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata',
    lat: 22.6547, lng: 88.4467, elevation: '16 ft', runways: 2,
    terminals: 2, paxTraffic: '20.8M', hubAirlines: ['IndiGo', 'Air India', 'SpiceJet'],
    operator: 'AAI', opened: 1924, timezone: 'IST (UTC+5:30)',
    arrivals: 52, departures: 48, delayIndex: 18, congestion: 44,
    weatherSeverity: 'Moderate', visibility: 'CAT-I', avgTaxiOut: '16 min',
    runwayUsage: 'RWY 01L Active', trend: 'up', metar: '34°C | 200°/4kt | 7km',
    monsoonRisk: 'Very High', militaryUsage: true, cargo: true,
  },
  {
    iata: 'AMD', icao: 'VAAH', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad',
    lat: 23.0772, lng: 72.6347, elevation: '189 ft', runways: 1,
    terminals: 2, paxTraffic: '12.1M', hubAirlines: ['IndiGo', 'Air India'],
    operator: 'AAI', opened: 1937, timezone: 'IST (UTC+5:30)',
    arrivals: 38, departures: 36, delayIndex: 4, congestion: 28,
    weatherSeverity: 'Low', visibility: 'CAT-I', avgTaxiOut: '8 min',
    runwayUsage: 'RWY 23 Active', trend: 'stable', metar: '36°C | 270°/6kt | >10km',
    monsoonRisk: 'Moderate', militaryUsage: true, cargo: true,
  },
  {
    iata: 'GOX', icao: 'VOGO', name: 'Manohar International', city: 'Goa',
    lat: 15.3808, lng: 73.8314, elevation: '558 ft', runways: 1,
    terminals: 1, paxTraffic: '9.8M', hubAirlines: ['IndiGo', 'GoFirst'],
    operator: 'GMR', opened: 2023, timezone: 'IST (UTC+5:30)',
    arrivals: 28, departures: 26, delayIndex: 2, congestion: 18,
    weatherSeverity: 'Low', visibility: 'CAT-I', avgTaxiOut: '6 min',
    runwayUsage: 'RWY 10 Active', trend: 'up', metar: '31°C | 240°/8kt | >10km',
    monsoonRisk: 'High', militaryUsage: false, cargo: false,
  },
];

const INTEL_FEED = [
  { time: '2 min ago', severity: 'warning', airport: 'DEL', message: 'Visibility dropped to CAT-II minimums on RWY 28L', link: '/intelligence/airports/DEL' },
  { time: '5 min ago', severity: 'info', airport: 'BOM', message: 'RWY 27 active - single runway operations commenced', link: '/intelligence/airports/BOM' },
  { time: '8 min ago', severity: 'alert', airport: 'BLR', message: 'Departure congestion rising - avg taxi-out 18 min', link: '/intelligence/airports/BLR' },
  { time: '12 min ago', severity: 'warning', airport: 'HYD', message: 'Weather warning issued - CB activity within 50nm', link: '/intelligence/airports/HYD' },
  { time: '15 min ago', severity: 'info', airport: 'CCU', message: 'Taxi delays increasing - ground hold in effect', link: '/intelligence/airports/CCU' },
  { time: '18 min ago', severity: 'alert', airport: 'MAA', message: 'NOTAM activated - RWY 07 threshold displaced 300m', link: '/intelligence/airports/MAA' },
  { time: '22 min ago', severity: 'info', airport: 'DEL', message: 'T3 departure gates congested - expect delays', link: '/intelligence/airports/DEL' },
  { time: '30 min ago', severity: 'info', airport: 'BOM', message: 'Monsoon cell approaching from SW - ETA 45 min', link: '/intelligence/airports/BOM' },
];

const AIP_NOTICES = [
  { airport: 'DEL', severity: 'high', title: 'RWY 10/28 resurfacing - night closures', effective: '15 May - 30 Jun 2026', impact: 'Single runway ops 2200-0500 IST' },
  { airport: 'BOM', severity: 'medium', title: 'Taxiway C3 restriction - construction', effective: '01 May - 15 Jul 2026', impact: 'Increased taxi time for T2 departures' },
  { airport: 'BLR', severity: 'low', title: 'New T2 apron stands operational', effective: 'From 10 May 2026', impact: 'Additional 8 contact stands available' },
  { airport: 'HYD', severity: 'medium', title: 'ILS RWY 09R calibration flight', effective: '20 May 2026 0600-0900', impact: 'Temporary ILS unavailability' },
  { airport: 'MAA', severity: 'high', title: 'RWY 07 threshold displaced 300m', effective: 'Until Nov 2026', impact: 'Reduced landing distance available' },
];

export default function AirportIntelligence() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const totalArrivals = AIRPORT_INTEL.reduce((s, a) => s + a.arrivals, 0);
  const totalDepartures = AIRPORT_INTEL.reduce((s, a) => s + a.departures, 0);
  const weatherImpacted = AIRPORT_INTEL.filter(a => a.weatherSeverity !== 'Low').length;
  const activeNotams = AIP_NOTICES.length;
  const avgCongestion = Math.round(AIRPORT_INTEL.reduce((s, a) => s + a.congestion, 0) / AIRPORT_INTEL.length);

  const filteredAirports = AIRPORT_INTEL.filter(a =>
    a.iata.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.icao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen bg-slate-50 dark:bg-sky-950 overflow-x-hidden transition-colors duration-300">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 sm:pt-24 pb-10 sm:pb-14 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/20 dark:from-sky-950 dark:via-[#0a1628] dark:to-[#0c1830]" />
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-3 space-y-5">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-[0.15em]"
                style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}
              >
                <TowerControl size={12} className="animate-pulse" />
                AIRPORT INTELLIGENCE • LIVE OPS
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.9] tracking-tighter">
                <span style={{ color: INDIA_ORANGE }}>Airport</span><br />
                <span className="text-slate-900 dark:text-white">Intelligence</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Real-time operational intelligence for Indian airports. Monitor congestion, weather impact, runway status, and AIP amendments across India's aviation network.
              </p>

              {/* AI Summary Card */}
              <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl p-4 backdrop-blur-sm shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">AI Operational Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                  Indian airspace tracking <strong className="text-slate-900 dark:text-white">{totalArrivals + totalDepartures}</strong> active movements across 8 major airports.
                  BOM experiencing elevated congestion (82%) due to single runway operations. DEL visibility approaching CAT-II minimums.
                  {' '}{weatherImpacted} airports under weather advisory.
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl flex items-center p-1.5 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                  <Search className="ml-3 mr-2 text-slate-400 dark:text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search Airport, ICAO, IATA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-0 text-sm py-2 font-medium outline-none"
                    aria-label="Search airports"
                  />
                  <button
                    className="p-2.5 rounded-lg hover:opacity-90 transition-all font-bold text-black"
                    style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
                    aria-label="Search"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/explore/map"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-black text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,153,51,0.15)] hover:shadow-[0_0_30px_rgba(255,153,51,0.3)] hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
                >
                  <Globe size={16} /> Live Airspace
                </Link>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all hover:-translate-y-0.5 shadow-sm dark:shadow-none">
                  <BarChart3 size={16} /> Airport Analytics
                </button>
              </div>
            </div>

            {/* Right - Metrics Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-white/5 shadow-sm dark:shadow-none">
                {[
                  { label: 'Airports Tracked', value: '8', icon: <TowerControl size={16} />, color: INDIA_ORANGE },
                  { label: 'Flights Active', value: String(totalArrivals + totalDepartures), icon: <Plane size={16} />, color: '#60A5FA' },
                  { label: 'Weather Impact', value: String(weatherImpacted), icon: <Cloud size={16} />, color: '#F97316' },
                  { label: 'Active NOTAMs', value: String(activeNotams), icon: <AlertTriangle size={16} />, color: '#EF4444' },
                  { label: 'Avg Congestion', value: `${avgCongestion}%`, icon: <Activity size={16} />, color: '#A855F7' },
                  { label: 'Delayed Deps', value: '34', icon: <Clock size={16} />, color: '#EC4899' },
                ].map((m) => (
                  <div key={m.label} className="bg-white dark:bg-sky-950 p-4 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span style={{ color: m.color }}>{m.icon}</span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-gray-500">{m.label}</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: LIVE AIRPORT STATUS GRID
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <Activity size={12} style={{ color: INDIA_GREEN }} /> Live Operations
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Live Airport <span style={{ color: INDIA_GREEN }}>Status</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Real-time operational metrics for major Indian airports. Click any airport for full intelligence.
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredAirports.map((airport) => (
              <Link
                key={airport.iata}
                to={`/intelligence/airports/${airport.iata}`}
                className="group relative p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 hover:shadow-lg dark:hover:bg-white/[0.06] hover:-translate-y-1 shadow-sm dark:shadow-none"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xl font-mono font-bold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-300 transition-colors">{airport.iata}</div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">{airport.icao}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${airport.congestion > 70 ? 'bg-red-500' : airport.congestion > 40 ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                </div>

                {/* City */}
                <div className="text-xs text-slate-600 dark:text-gray-300 font-medium mb-3 truncate">{airport.city}</div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  <div className="bg-slate-50 dark:bg-white/[0.03] rounded-lg px-2 py-1.5 border border-slate-100 dark:border-white/[0.03]">
                    <div className="text-[8px] text-slate-400 dark:text-gray-500 uppercase font-bold tracking-wider">ARR</div>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">{airport.arrivals}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/[0.03] rounded-lg px-2 py-1.5 border border-slate-100 dark:border-white/[0.03]">
                    <div className="text-[8px] text-slate-400 dark:text-gray-500 uppercase font-bold tracking-wider">DEP</div>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">{airport.departures}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/[0.03] rounded-lg px-2 py-1.5 border border-slate-100 dark:border-white/[0.03]">
                    <div className="text-[8px] text-slate-400 dark:text-gray-500 uppercase font-bold tracking-wider">CONG</div>
                    <div className={`text-sm font-bold font-mono ${airport.congestion > 70 ? 'text-red-500' : airport.congestion > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{airport.congestion}%</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/[0.03] rounded-lg px-2 py-1.5 border border-slate-100 dark:border-white/[0.03]">
                    <div className="text-[8px] text-slate-400 dark:text-gray-500 uppercase font-bold tracking-wider">DELAY</div>
                    <div className={`text-sm font-bold font-mono ${airport.delayIndex > 20 ? 'text-red-500' : airport.delayIndex > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{airport.delayIndex}%</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Cloud size={10} className={airport.weatherSeverity === 'Low' ? 'text-emerald-500' : 'text-amber-500'} />
                    <span className="text-[9px] font-mono text-slate-500 dark:text-gray-400">{airport.visibility}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {airport.trend === 'up' && <ArrowUpRight size={10} className="text-red-500" />}
                    {airport.trend === 'down' && <ArrowDownRight size={10} className="text-emerald-500" />}
                    {airport.trend === 'stable' && <Minus size={10} className="text-slate-400" />}
                    <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500">{airport.avgTaxiOut}</span>
                  </div>
                </div>

                <ArrowRight size={12} className="absolute top-4 right-4 text-slate-300 dark:text-gray-600 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: INTELLIGENCE FEED + ANALYTICS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Intelligence Feed */}
            <div className="lg:col-span-2">
              <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] backdrop-blur-sm shadow-sm dark:shadow-none">
                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Operational Intelligence Feed</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/[0.03]">
                  {INTEL_FEED.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        item.severity === 'alert' ? 'bg-red-500' :
                        item.severity === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-mono font-bold" style={{ color: INDIA_ORANGE }}>{item.airport}</span>
                          <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500">{item.time}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{item.message}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 dark:text-gray-600 mt-1 shrink-0 group-hover:text-orange-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-4">
              {/* Busiest Airports */}
              <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                  <BarChart3 size={12} className="text-purple-500" />
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Busiest Today</span>
                </div>
                <div className="p-4 space-y-2.5">
                  {AIRPORT_INTEL.slice(0, 5).sort((a, b) => (b.arrivals + b.departures) - (a.arrivals + a.departures)).map((a, i) => (
                    <div key={a.iata} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500 w-4">{i + 1}.</span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white w-8">{a.iata}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${((a.arrivals + a.departures) / 300) * 100}%`, background: `linear-gradient(90deg, ${INDIA_ORANGE}, #FFD700)` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 w-8 text-right">{a.arrivals + a.departures}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Congestion Rankings */}
              <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Highest Congestion</span>
                </div>
                <div className="p-4 space-y-2.5">
                  {AIRPORT_INTEL.slice().sort((a, b) => b.congestion - a.congestion).slice(0, 5).map((a) => (
                    <div key={a.iata} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{a.iata}</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">{a.city}</span>
                      </div>
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        a.congestion > 70 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                        a.congestion > 40 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>{a.congestion}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Runways */}
              <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                  <Navigation size={12} className="text-blue-500" />
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Active Runways</span>
                </div>
                <div className="p-4 space-y-2">
                  {AIRPORT_INTEL.slice(0, 5).map((a) => (
                    <div key={a.iata} className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{a.iata}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-white/[0.03] px-2 py-0.5 rounded">{a.runwayUsage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: AIP & NOTAM INTELLIGENCE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <FileText size={12} className="text-orange-500" /> AIP Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              AIP & <span style={{ color: INDIA_ORANGE }}>NOTAM</span> Intelligence
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Active aeronautical information amendments, runway closures, and operational restrictions across Indian airports.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AIP_NOTICES.map((notice, idx) => (
              <div key={idx} className="group relative p-5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 hover:shadow-lg shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono font-bold" style={{ color: INDIA_ORANGE }}>{notice.airport}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                    notice.severity === 'high' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                    notice.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  }`}>{notice.severity}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 leading-snug">{notice.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={11} className="text-slate-400 dark:text-gray-500 shrink-0" />
                    <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">{notice.effective}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={11} className="text-slate-400 dark:text-gray-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed">{notice.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: AIRPORT DISCOVERY
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-gray-300 uppercase mb-4">
              <MapPin size={12} style={{ color: INDIA_GREEN }} /> Discover
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Airport <span style={{ color: INDIA_GREEN }}>Discovery</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Explore India's aviation infrastructure by category, traffic tier, or operational capability.
            </p>
          </header>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Major International', 'Military Shared', 'Regional', 'Cargo Hubs', 'Tourist', 'Mountain', 'Smart Airports', 'Defence Corridors'].map((cat) => (
              <button key={cat} className="px-3 py-2 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider hover:border-orange-400/30 dark:hover:border-orange-400/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all">
                {cat}
              </button>
            ))}
          </div>

          {/* Airport Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {AIRPORT_INTEL.map((airport) => (
              <Link
                key={airport.iata}
                to={`/intelligence/airports/${airport.iata}`}
                className="group relative rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 hover:shadow-lg dark:hover:bg-white/[0.06] hover:-translate-y-1 overflow-hidden shadow-sm dark:shadow-none"
              >
                {/* Gradient Header */}
                <div className="h-14 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-white/[0.06] dark:to-white/[0.02] relative flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-white/90 group-hover:text-orange-300 transition-colors">{airport.iata}</span>
                  <div className="absolute top-2 right-2">
                    <div className={`w-2 h-2 rounded-full ${airport.congestion > 70 ? 'bg-red-500' : airport.congestion > 40 ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{airport.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400 mb-2">{airport.city} • {airport.paxTraffic} pax/yr</div>
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500">{airport.runways} RWY • T{airport.terminals}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: INDIA_GREEN }}>{airport.arrivals + airport.departures} ops</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6: PREMIUM FEATURES
      ══════════════════════════════════════════════════════════ */}
      {!isLoggedIn ? (
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-white/[0.04]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            <div className="relative p-6 sm:p-10">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: INDIA_ORANGE }} />
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: INDIA_ORANGE }}>Premium Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white mb-2 tracking-tight">
                Unlock Full Airport Operations
              </h2>
              <p className="text-sm text-slate-400 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                Sign in to access historical playback, surface analytics, gate occupancy, AI congestion prediction, and real-time operational alerts.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Historical Playback', icon: <Clock size={14} /> },
                  { label: 'Surface Analytics', icon: <Layers size={14} /> },
                  { label: 'AI Predictions', icon: <Zap size={14} /> },
                  { label: 'API Access', icon: <Server size={14} /> },
                  { label: 'Gate Occupancy', icon: <Navigation size={14} /> },
                  { label: 'Operational Alerts', icon: <Bell size={14} /> },
                  { label: 'Advanced Analytics', icon: <BarChart3 size={14} /> },
                  { label: 'Turnaround Data', icon: <Activity size={14} /> },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.05] dark:bg-white/[0.03] border border-white/[0.08] dark:border-white/[0.05]">
                    <span style={{ color: INDIA_ORANGE }}>{f.icon}</span>
                    <span className="text-[10px] font-bold text-slate-300 dark:text-gray-400">{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="px-6 py-3 rounded-xl text-black text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,153,51,0.2)] hover:shadow-[0_0_30px_rgba(255,153,51,0.35)] hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
                >
                  Sign In to Unlock
                </button>
                <button className="px-6 py-3 rounded-xl bg-white/[0.08] dark:bg-white/[0.05] border border-white/[0.12] dark:border-white/[0.08] text-slate-300 dark:text-gray-400 text-sm font-bold hover:bg-white/[0.12] dark:hover:bg-white/[0.08] transition-all hover:-translate-y-0.5">
                  Enterprise Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : (
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="border border-emerald-200 dark:border-emerald-500/10 rounded-2xl overflow-hidden bg-emerald-50/50 dark:bg-emerald-500/5 shadow-sm dark:shadow-none">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: INDIA_GREEN }} />
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">All Features Unlocked</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Full Airport Intelligence Active
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Historical Playback', icon: <Clock size={14} /> },
                  { label: 'Surface Analytics', icon: <Layers size={14} /> },
                  { label: 'AI Predictions', icon: <Zap size={14} /> },
                  { label: 'API Access', icon: <Server size={14} /> },
                  { label: 'Gate Occupancy', icon: <Navigation size={14} /> },
                  { label: 'Operational Alerts', icon: <Bell size={14} /> },
                  { label: 'Advanced Analytics', icon: <BarChart3 size={14} /> },
                  { label: 'Turnaround Data', icon: <Activity size={14} /> },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white dark:bg-white/[0.03] border border-emerald-200 dark:border-emerald-500/10">
                    <span style={{ color: INDIA_GREEN }}>{f.icon}</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-gray-300">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 7: SEO CONTENT BLOCK
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Understanding Indian Airport Operations</h2>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Airport Congestion in India</h3>
                    <p>India's major airports handle over 350 million passengers annually. Congestion analytics track surface movement efficiency, runway utilization rates, and terminal throughput to identify bottlenecks in real-time operations.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">What are NOTAMs?</h3>
                    <p>Notices to Air Missions (NOTAMs) are critical advisories issued to pilots about hazards, restrictions, or changes at airports. AeroSky monitors and interprets NOTAMs across all Indian airports, providing operational impact analysis.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Runway Operations</h3>
                    <p>Indian airports operate complex runway configurations. DEL uses three runways (10/28, 09/27, 11/29), BOM operates single-runway during monsoon, and BLR recently commissioned its second runway for parallel operations.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Airport Weather Intelligence</h3>
                    <p>Weather is the primary cause of delays at Indian airports. Monsoon season (June-September) significantly impacts BOM, CCU, and MAA. AeroSky provides real-time METAR, TAF, and weather radar integration for operational decision-making.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">India's Busiest Airports</h3>
                    <p>Delhi (DEL) leads with 72.7M passengers, followed by Mumbai (BOM) at 51.8M and Bengaluru (BLR) at 37.5M. These three airports account for over 45% of India's total air traffic.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">AIP (Aeronautical Information Publication)</h3>
                    <p>The AIP contains essential information for air navigation including aerodrome data, en-route procedures, and airspace structure. AeroSky tracks AIP amendments and supplements relevant to Indian airport operations.</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { q: 'How often is airport data updated?', a: 'AeroSky updates airport operational data every 30 seconds using ADS-B receivers, METAR feeds, and proprietary data sources.' },
                    { q: 'Which airports does AeroSky cover?', a: 'We cover all 130+ Indian airports with ADS-B coverage, with enhanced intelligence for the top 30 busiest airports.' },
                    { q: 'Can I access historical airport data?', a: 'Historical playback and analytics are available on Plus, Pro, and Enterprise plans with up to 365 days of data retention.' },
                    { q: 'How is congestion score calculated?', a: 'Congestion score combines runway utilization, taxi-out times, gate occupancy, and departure queue length into a 0-100 index.' },
                  ].map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.03]">
                      <div className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">{faq.q}</div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8: FOOTER LINK GRAPH
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">Explore Airport Intelligence</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-3 pb-2 border-b border-slate-100 dark:border-white/5">Popular Airports</h3>
              <div className="space-y-2">
                {AIRPORT_INTEL.slice(0, 6).map((a) => (
                  <Link key={a.iata} to={`/intelligence/airports/${a.iata}`} className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
                    <span className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">{a.iata}</span>
                    <span>{a.city}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-3 pb-2 border-b border-slate-100 dark:border-white/5">By Traffic</h3>
              <div className="space-y-2">
                {['Tier 1 (>40M pax)', 'Tier 2 (10-40M pax)', 'Tier 3 (1-10M pax)', 'Regional (<1M pax)', 'Cargo Only', 'Defence Only'].map((t) => (
                  <span key={t} className="block text-xs text-slate-600 dark:text-gray-400">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-3 pb-2 border-b border-slate-100 dark:border-white/5">By State</h3>
              <div className="space-y-2">
                {['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi NCR', 'Telangana', 'West Bengal'].map((s) => (
                  <span key={s} className="block text-xs text-slate-600 dark:text-gray-400">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-3 pb-2 border-b border-slate-100 dark:border-white/5">Operations</h3>
              <div className="space-y-2">
                {[
                  { label: 'Live Arrivals', to: '/intelligence/airports/DEL/arrivals' },
                  { label: 'Live Departures', to: '/intelligence/airports/DEL/departures' },
                  { label: 'Weather Intelligence', to: '/intelligence/airports/DEL/weather' },
                  { label: 'NOTAM Tracker', to: '/intelligence/airports/DEL/notams' },
                  { label: 'Runway Analytics', to: '/intelligence/airports/DEL/runways' },
                  { label: 'Congestion Monitor', to: '/intelligence/airports/DEL/congestion' },
                ].map((link) => (
                  <Link key={link.label} to={link.to} className="block text-xs text-slate-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
