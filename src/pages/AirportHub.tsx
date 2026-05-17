import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Cloud, Wind, Eye, PlaneTakeoff, PlaneLanding, AlertCircle, ArrowLeft,
  Plane, Activity, Clock, Radio, Shield,
  ChevronRight, Zap, Globe, MapPin, FileText,
  Layers, Navigation, ArrowRight, Lock, Radar, AlertTriangle,
  Maximize2, ThermometerSun, Gauge
} from 'lucide-react';
import { AIRPORTS, FLIGHTS } from '@/data/mockData';
import MapBackground from '@/components/map/MapBackground';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const INDIA_ORANGE = '#FF9933';
const INDIA_GREEN = '#138808';

/* ─── Extended Airport Data ─── */
const AIRPORT_EXTENDED: Record<string, {
  elevation: string; runways: { id: string; length: string; surface: string; ils: string; active: boolean; usage: string }[];
  terminals: number; paxTraffic: string; hubAirlines: string[]; operator: string; opened: number;
  frequencies: { type: string; freq: string }[]; congestion: number; delayIndex: number;
  taxiOut: string; taxiIn: string; gateOccupancy: number; onGround: number; holding: number; diversions: number;
  notams: { severity: string; title: string; effective: string; impact: string }[];
  topRoutes: { dest: string; city: string; freq: string; airlines: string }[];
  timeline: { time: string; severity: string; message: string }[];
}> = {
  DEL: {
    elevation: '777 ft', terminals: 3, paxTraffic: '72.7M', operator: 'DIAL', opened: 1962,
    hubAirlines: ['Air India', 'IndiGo', 'Vistara', 'Akasa Air'],
    runways: [
      { id: '10/28', length: '4,430m', surface: 'Asphalt', ils: 'CAT-IIIB', active: true, usage: 'Primary' },
      { id: '09/27', length: '3,810m', surface: 'Asphalt', ils: 'CAT-I', active: true, usage: 'Secondary' },
      { id: '11/29', length: '4,430m', surface: 'Asphalt', ils: 'CAT-IIIB', active: false, usage: 'Maintenance' },
    ],
    frequencies: [
      { type: 'Tower', freq: '118.10' }, { type: 'Ground', freq: '121.90' },
      { type: 'Approach', freq: '127.15' }, { type: 'ATIS', freq: '126.40' },
    ],
    congestion: 67, delayIndex: 12, taxiOut: '18 min', taxiIn: '8 min',
    gateOccupancy: 78, onGround: 42, holding: 6, diversions: 1,
    notams: [
      { severity: 'high', title: 'RWY 11/29 closed for resurfacing', effective: '15 May - 30 Jun 2026', impact: 'Dual runway ops only' },
      { severity: 'medium', title: 'TWY C3 restricted - construction', effective: 'Until 15 Jul 2026', impact: 'Increased taxi time T3' },
      { severity: 'low', title: 'ILS 28R calibration 0200-0400', effective: '22 May 2026', impact: 'Visual approaches only' },
    ],
    topRoutes: [
      { dest: 'BOM', city: 'Mumbai', freq: '85/week', airlines: '6E, AI, UK' },
      { dest: 'BLR', city: 'Bengaluru', freq: '72/week', airlines: '6E, AI, QP' },
      { dest: 'MAA', city: 'Chennai', freq: '56/week', airlines: '6E, AI, SG' },
      { dest: 'CCU', city: 'Kolkata', freq: '48/week', airlines: '6E, AI, SG' },
      { dest: 'HYD', city: 'Hyderabad', freq: '62/week', airlines: '6E, AI, UK' },
    ],
    timeline: [
      { time: '2 min ago', severity: 'warning', message: 'Visibility approaching CAT-II minimums RWY 28L' },
      { time: '8 min ago', severity: 'info', message: 'RWY 10/28 active for arrivals, 09/27 for departures' },
      { time: '15 min ago', severity: 'info', message: 'T3 gate B12-B18 congested - expect pushback delays' },
      { time: '22 min ago', severity: 'alert', message: 'Go-around: AI 302 - wind shear on final RWY 28L' },
      { time: '30 min ago', severity: 'info', message: 'Surface congestion easing - taxi-out now 16 min avg' },
      { time: '45 min ago', severity: 'warning', message: 'NOTAM: TWY C3 closed for construction until Jul' },
    ],
  },
  BOM: {
    elevation: '39 ft', terminals: 2, paxTraffic: '51.8M', operator: 'MIAL', opened: 1942,
    hubAirlines: ['Air India', 'IndiGo', 'GoFirst', 'Vistara'],
    runways: [
      { id: '09/27', length: '3,660m', surface: 'Asphalt', ils: 'CAT-IIIB', active: true, usage: 'Primary' },
      { id: '14/32', length: '2,987m', surface: 'Asphalt', ils: 'CAT-I', active: false, usage: 'Crosswind' },
    ],
    frequencies: [
      { type: 'Tower', freq: '118.10' }, { type: 'Ground', freq: '121.70' },
      { type: 'Approach', freq: '119.50' }, { type: 'ATIS', freq: '126.15' },
    ],
    congestion: 82, delayIndex: 28, taxiOut: '24 min', taxiIn: '12 min',
    gateOccupancy: 91, onGround: 38, holding: 8, diversions: 3,
    notams: [
      { severity: 'high', title: 'Single runway operations - RWY 27 only', effective: 'Monsoon season', impact: 'Reduced capacity 32 movements/hr' },
      { severity: 'medium', title: 'TWY A7 waterlogging risk', effective: 'Jun - Sep 2026', impact: 'Alternate taxi routes' },
    ],
    topRoutes: [
      { dest: 'DEL', city: 'New Delhi', freq: '85/week', airlines: '6E, AI, UK' },
      { dest: 'BLR', city: 'Bengaluru', freq: '68/week', airlines: '6E, AI, QP' },
      { dest: 'GOX', city: 'Goa', freq: '42/week', airlines: '6E, AI, SG' },
      { dest: 'HYD', city: 'Hyderabad', freq: '52/week', airlines: '6E, AI' },
    ],
    timeline: [
      { time: '3 min ago', severity: 'alert', message: 'Single runway ops - RWY 27 active only' },
      { time: '10 min ago', severity: 'warning', message: 'Departure queue: 12 aircraft - expect 20 min delay' },
      { time: '18 min ago', severity: 'info', message: 'Monsoon cell 40nm SW - approaching' },
      { time: '25 min ago', severity: 'info', message: 'Gate occupancy at 91% - T2 saturated' },
    ],
  },
  BLR: {
    elevation: '3,000 ft', terminals: 2, paxTraffic: '37.5M', operator: 'BIAL', opened: 2008,
    hubAirlines: ['IndiGo', 'Air India Express', 'Akasa Air', 'Star Air'],
    runways: [
      { id: '09L/27R', length: '4,000m', surface: 'Asphalt', ils: 'CAT-IIIB', active: true, usage: 'Primary' },
      { id: '09R/27L', length: '4,000m', surface: 'Asphalt', ils: 'CAT-I', active: true, usage: 'Secondary' },
    ],
    frequencies: [
      { type: 'Tower', freq: '118.35' }, { type: 'Ground', freq: '121.90' },
      { type: 'Approach', freq: '124.00' }, { type: 'ATIS', freq: '127.80' },
    ],
    congestion: 45, delayIndex: 8, taxiOut: '12 min', taxiIn: '6 min',
    gateOccupancy: 62, onGround: 28, holding: 2, diversions: 0,
    notams: [
      { severity: 'low', title: 'New T2 apron stands operational', effective: 'From 10 May 2026', impact: '8 additional contact stands' },
      { severity: 'medium', title: 'TWY E construction - night hours', effective: '2200-0500 daily', impact: 'Single taxiway to RWY 09R' },
    ],
    topRoutes: [
      { dest: 'DEL', city: 'New Delhi', freq: '72/week', airlines: '6E, AI, UK' },
      { dest: 'BOM', city: 'Mumbai', freq: '68/week', airlines: '6E, AI, QP' },
      { dest: 'HYD', city: 'Hyderabad', freq: '48/week', airlines: '6E, AI' },
      { dest: 'MAA', city: 'Chennai', freq: '42/week', airlines: '6E, QP' },
    ],
    timeline: [
      { time: '5 min ago', severity: 'info', message: 'Parallel runway ops - 09L arrivals, 09R departures' },
      { time: '12 min ago', severity: 'info', message: 'T2 international gates available - low congestion' },
      { time: '20 min ago', severity: 'warning', message: 'Departure congestion rising - peak hour' },
    ],
  },
};

const AirportHub: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const airport = AIRPORTS[code || 'DEL'];
  const extended = AIRPORT_EXTENDED[code || 'DEL'];
  const [tab, setTab] = useState<'arrivals' | 'departures'>('departures');
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();

  if (!airport) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-sky-950 flex items-center justify-center pt-20 px-4">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-slate-500 dark:text-gray-400" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-gray-200">Airport Not Found</h2>
          <p className="text-slate-600 dark:text-gray-300 text-sm">The airport code is not in our database.</p>
          <Link to="/intelligence/airports" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium">
            <ArrowLeft size={14} /> Browse Airports
          </Link>
        </div>
      </div>
    );
  }

  const ext = extended || AIRPORT_EXTENDED.DEL;
  const relevantFlights = FLIGHTS.filter(f =>
    tab === 'departures' ? f.origin.iata === airport.iata : f.destination.iata === airport.iata
  );

  const congestionColor = ext.congestion > 70 ? 'text-red-500' : ext.congestion > 40 ? 'text-amber-500' : 'text-emerald-500';
  const congestionLabel = ext.congestion > 70 ? 'High' : ext.congestion > 40 ? 'Moderate' : 'Low';

  return (
    <div className="relative w-full min-h-screen bg-slate-50 dark:bg-sky-950 transition-colors duration-300">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: AIRPORT HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 sm:pt-24 pb-6 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/20 dark:from-sky-950 dark:via-[#0a1628] dark:to-[#0c1830]" />
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link to="/intelligence/airports" className="hover:text-orange-500 transition-colors">Airports</Link>
            <ChevronRight size={10} />
            <span className="text-slate-900 dark:text-white font-bold">{airport.iata}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left - Airport Info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-[0.15em]"
                style={{ background: 'rgba(255,153,51,0.08)', borderColor: 'rgba(255,153,51,0.3)', color: INDIA_ORANGE }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                OPERATIONAL • LIVE
              </div>

              {/* Title */}
              <div>
                <div className="flex items-baseline gap-4 mb-1">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">{airport.iata}</h1>
                  <span className="text-xl sm:text-2xl font-mono text-slate-400 dark:text-gray-500">{airport.icao}</span>
                </div>
                <h2 className="text-lg sm:text-xl text-slate-700 dark:text-gray-300 font-medium">{airport.name}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">{airport.city}, India</p>
              </div>

              {/* Airport Profile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Elevation', value: ext.elevation },
                  { label: 'Terminals', value: String(ext.terminals) },
                  { label: 'Runways', value: String(ext.runways.length) },
                  { label: 'Pax/Year', value: ext.paxTraffic },
                  { label: 'Operator', value: ext.operator },
                  { label: 'Opened', value: String(ext.opened) },
                  { label: 'Timezone', value: 'IST +5:30' },
                  { label: 'Hub Airlines', value: String(ext.hubAirlines.length) },
                ].map((item) => (
                  <div key={item.label} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2">
                    <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">{item.label}</div>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Live Status Indicators */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold border ${ext.congestion > 70 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : ext.congestion > 40 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'}`}>
                  <Activity size={10} /> Congestion: {ext.congestion}%
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold border ${ext.delayIndex > 20 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'}`}>
                  <Clock size={10} /> Delay Index: {ext.delayIndex}%
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                  <AlertTriangle size={10} /> {ext.notams.length} NOTAMs
                </span>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-wrap gap-2">
                <Link to={`/intelligence/airports/${airport.iata}/arrivals`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all">
                  <PlaneLanding size={13} /> Arrivals
                </Link>
                <Link to={`/intelligence/airports/${airport.iata}/departures`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all">
                  <PlaneTakeoff size={13} /> Departures
                </Link>
                <Link to={`/intelligence/airports/${airport.iata}/weather`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all">
                  <Cloud size={13} /> Weather
                </Link>
                <Link to={`/intelligence/airports/${airport.iata}/notams`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all">
                  <FileText size={13} /> NOTAMs
                </Link>
                <Link to={`/intelligence/airports/${airport.iata}/runways`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all">
                  <Navigation size={13} /> Runways
                </Link>
              </div>
            </div>

            {/* Right - Sticky Sidebar Map + Metrics */}
            <div className="lg:sticky lg:top-20 space-y-3 self-start">
              {/* Map */}
              <div className="h-[220px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative shadow-sm dark:shadow-none">
                <MapBackground
                  interactive={false}
                  showFlights={false}
                  showAirports={false}
                  zoom={13}
                  center={{ lat: airport.lat, lng: airport.lng }}
                  theme={theme}
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-[9px] font-mono font-bold border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Airport Digital Twin
                </div>
                <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 dark:bg-black/80 border border-slate-200 dark:border-white/20 text-slate-600 dark:text-gray-300 hover:text-orange-500 transition-colors" aria-label="Expand map">
                  <Maximize2 size={12} />
                </button>
              </div>

              {/* METAR */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">METAR</span>
                  <span className="text-[8px] text-blue-400 dark:text-blue-500 ml-auto">5 min ago</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-mono text-blue-700 dark:text-blue-200">
                  <span className="flex items-center gap-1"><ThermometerSun size={11} /> 32°C</span>
                  <span className="flex items-center gap-1"><Wind size={11} /> 270°/5kt</span>
                  <span className="flex items-center gap-1"><Eye size={11} /> 10km</span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-lg p-2.5 text-center">
                  <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">Congestion</div>
                  <div className={`text-lg font-bold font-mono ${congestionColor}`}>{ext.congestion}%</div>
                  <div className={`text-[9px] font-bold ${congestionColor}`}>{congestionLabel}</div>
                </div>
                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-lg p-2.5 text-center">
                  <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">On Ground</div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{ext.onGround}</div>
                  <div className="text-[9px] text-slate-500 dark:text-gray-400">aircraft</div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap size={10} className="text-cyan-500" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">AI Ops Summary</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed">
                  {airport.iata} operating at {ext.congestion}% capacity. {ext.holding > 0 ? `${ext.holding} aircraft in holding pattern.` : 'No holding traffic.'} Avg taxi-out {ext.taxiOut}. {ext.notams.length} active NOTAMs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: LIVE OPERATIONS SUMMARY
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { label: 'Active Arrivals', value: String(FLIGHTS.filter(f => f.destination.iata === airport.iata).length + 8), icon: <PlaneLanding size={14} />, color: 'text-blue-500' },
              { label: 'Active Departures', value: String(FLIGHTS.filter(f => f.origin.iata === airport.iata).length + 6), icon: <PlaneTakeoff size={14} />, color: 'text-purple-500' },
              { label: 'On Ground', value: String(ext.onGround), icon: <Plane size={14} />, color: 'text-slate-600 dark:text-gray-300' },
              { label: 'Taxi-Out Avg', value: ext.taxiOut, icon: <Clock size={14} />, color: 'text-amber-500' },
              { label: 'Gate Occupancy', value: `${ext.gateOccupancy}%`, icon: <Layers size={14} />, color: ext.gateOccupancy > 80 ? 'text-red-500' : 'text-emerald-500' },
              { label: 'Holding', value: String(ext.holding), icon: <Radar size={14} />, color: ext.holding > 4 ? 'text-red-500' : 'text-cyan-500' },
              { label: 'Delay Index', value: `${ext.delayIndex}%`, icon: <Activity size={14} />, color: ext.delayIndex > 20 ? 'text-red-500' : 'text-emerald-500' },
              { label: 'Taxi-In Avg', value: ext.taxiIn, icon: <Clock size={14} />, color: 'text-blue-400' },
              { label: 'Diversions', value: String(ext.diversions), icon: <AlertTriangle size={14} />, color: ext.diversions > 0 ? 'text-red-500' : 'text-emerald-500' },
              { label: 'Congestion', value: `${ext.congestion}%`, icon: <Gauge size={14} />, color: congestionColor },
              { label: 'RWY Utilization', value: `${ext.runways.filter(r => r.active).length}/${ext.runways.length}`, icon: <Navigation size={14} />, color: 'text-cyan-500' },
              { label: 'NOTAMs', value: String(ext.notams.length), icon: <FileText size={14} />, color: 'text-orange-500' },
            ].map((m) => (
              <div key={m.label} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl p-3 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={m.color}>{m.icon}</span>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 truncate">{m.label}</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 & 4: ARRIVALS / DEPARTURES (FIDS Board)
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            {/* Tab Header */}
            <div className="flex border-b border-slate-100 dark:border-white/5">
              <button
                onClick={() => setTab('departures')}
                role="tab"
                aria-selected={tab === 'departures'}
                className={`flex-1 py-3.5 text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'departures'
                  ? 'text-slate-900 dark:text-white border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-500/5'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                }`}
              >
                <PlaneTakeoff size={16} /> DEPARTURES
              </button>
              <button
                onClick={() => setTab('arrivals')}
                role="tab"
                aria-selected={tab === 'arrivals'}
                className={`flex-1 py-3.5 text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'arrivals'
                  ? 'text-slate-900 dark:text-white border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-500/5'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                }`}
              >
                <PlaneLanding size={16} /> ARRIVALS
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-500 text-[10px] uppercase font-mono tracking-wider border-b border-slate-100 dark:border-white/5">
                    <th className="px-4 py-3" scope="col">Time</th>
                    <th className="px-4 py-3" scope="col">Flight</th>
                    <th className="px-4 py-3" scope="col">{tab === 'departures' ? 'Destination' : 'Origin'}</th>
                    <th className="px-4 py-3" scope="col">Status</th>
                    <th className="px-4 py-3" scope="col">Gate</th>
                    <th className="px-4 py-3" scope="col">Delay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/[0.03]">
                  {relevantFlights.map(flight => (
                    <tr key={flight.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-sm font-bold font-mono text-slate-900 dark:text-white">{tab === 'departures' ? flight.scheduledDep : flight.scheduledArr}</td>
                      <td className="px-4 py-3">
                        <Link to={`/flights/${flight.id}`} className="text-sm font-mono font-bold hover:underline" style={{ color: INDIA_ORANGE }}>{flight.flightNumber}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-gray-300">{tab === 'departures' ? flight.destination.city : flight.origin.city}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${flight.status === 'Delayed' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${flight.status === 'Delayed' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {flight.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 dark:text-gray-400">A12</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 dark:text-gray-500">{flight.status === 'Delayed' ? '+45m' : '-'}</td>
                    </tr>
                  ))}
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={`ph-${i}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors opacity-60">
                      <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-gray-400">1{i + 4}:{i % 2 === 0 ? '00' : '30'}</td>
                      <td className="px-4 py-3 text-sm font-mono" style={{ color: INDIA_ORANGE }}>6E {300 + i * 2}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-gray-400">{['Bengaluru', 'Mumbai', 'Chennai', 'Hyderabad', 'Kolkata'][i - 1]}</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Scheduled</span></td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 dark:text-gray-500">B{String(i).padStart(2, '0')}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 dark:text-gray-500">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500">Showing preview - {relevantFlights.length + 5} flights</span>
              <Link
                to={`/intelligence/airports/${airport.iata}/${tab}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                style={{ color: INDIA_ORANGE }}
              >
                View Full {tab === 'departures' ? 'Departures' : 'Arrivals'} <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: WEATHER & METAR + SECTION 6: RUNWAYS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Weather */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud size={14} className="text-blue-500" />
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Weather Intelligence</span>
              </div>
              <Link to={`/intelligence/airports/${airport.iata}/weather`} className="text-[10px] font-bold hover:underline" style={{ color: INDIA_ORANGE }}>Full Weather →</Link>
            </div>
            <div className="p-5 space-y-4">
              {/* Decoded METAR */}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/10 rounded-lg p-3 font-mono text-xs text-blue-700 dark:text-blue-300">
                METAR {airport.icao} 170530Z 27005KT 10KM FEW040 SCT100 32/18 Q1008 NOSIG
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Temperature', value: '32°C', icon: <ThermometerSun size={14} /> },
                  { label: 'Wind', value: '270°/5kt', icon: <Wind size={14} /> },
                  { label: 'Visibility', value: '10 km', icon: <Eye size={14} /> },
                  { label: 'Pressure', value: '1008 hPa', icon: <Gauge size={14} /> },
                ].map((w) => (
                  <div key={w.label} className="text-center">
                    <div className="text-blue-500 dark:text-blue-400 flex justify-center mb-1">{w.icon}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{w.value}</div>
                    <div className="text-[9px] text-slate-500 dark:text-gray-500 uppercase">{w.label}</div>
                  </div>
                ))}
              </div>
              {/* AI Insight */}
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.03] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={10} className="text-cyan-500" />
                  <span className="text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">AI Insight</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-gray-400">Clear conditions. No fog risk. Wind aligned with RWY 28. CAT-I operations sufficient. No weather-related delays expected next 3 hours.</p>
              </div>
            </div>
          </div>

          {/* Runways */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-cyan-500" />
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Runway Intelligence</span>
              </div>
              <Link to={`/intelligence/airports/${airport.iata}/runways`} className="text-[10px] font-bold hover:underline" style={{ color: INDIA_ORANGE }}>All Runways →</Link>
            </div>
            <div className="p-5 space-y-3">
              {ext.runways.map((rwy) => (
                <div key={rwy.id} className={`p-3 rounded-xl border ${rwy.active ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/15' : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">RWY {rwy.id}</span>
                      {rwy.active && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Active</span>}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-gray-400">{rwy.usage}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div><span className="text-slate-400 dark:text-gray-500">Length:</span> <span className="font-bold text-slate-700 dark:text-gray-300">{rwy.length}</span></div>
                    <div><span className="text-slate-400 dark:text-gray-500">Surface:</span> <span className="font-bold text-slate-700 dark:text-gray-300">{rwy.surface}</span></div>
                    <div><span className="text-slate-400 dark:text-gray-500">ILS:</span> <span className="font-bold text-slate-700 dark:text-gray-300">{rwy.ils}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7: NOTAM INTELLIGENCE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-orange-500" />
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">NOTAM Intelligence</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">{ext.notams.length}</span>
              </div>
              <Link to={`/intelligence/airports/${airport.iata}/notams`} className="text-[10px] font-bold hover:underline" style={{ color: INDIA_ORANGE }}>View All NOTAMs →</Link>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ext.notams.map((notam, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase ${
                      notam.severity === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                      notam.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>{notam.severity}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 leading-snug">{notam.title}</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-gray-400">
                      <Clock size={10} className="shrink-0" /> {notam.effective}
                    </div>
                    <div className="flex items-start gap-1.5 text-[10px] text-slate-600 dark:text-gray-400">
                      <AlertTriangle size={10} className="shrink-0 mt-0.5" /> {notam.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8: ROUTES & AIRLINES + SECTION 9: TIMELINE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Routes & Airlines */}
          <div className="lg:col-span-2 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-purple-500" />
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Top Routes</span>
              </div>
              <Link to={`/intelligence/airports/${airport.iata}/routes`} className="text-[10px] font-bold hover:underline" style={{ color: INDIA_ORANGE }}>All Routes →</Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-white/[0.03]">
              {ext.topRoutes.map((route) => (
                <div key={route.dest} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{airport.iata}</span>
                      <ArrowRight size={12} className="text-slate-300 dark:text-gray-600" />
                      <span className="text-sm font-bold font-mono" style={{ color: INDIA_ORANGE }}>{route.dest}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">{route.city}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400">{route.freq}</span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500">{route.airlines}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Hub Airlines */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5">
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-2">Hub Airlines</div>
              <div className="flex flex-wrap gap-2">
                {ext.hubAirlines.map((airline) => (
                  <span key={airline} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-700 dark:text-gray-300">{airline}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Airport Timeline Feed */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Live Timeline</span>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-white/[0.03] max-h-[360px] overflow-y-auto">
              {ext.timeline.map((item, idx) => (
                <div key={idx} className="px-4 py-3 flex items-start gap-2.5">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    item.severity === 'alert' ? 'bg-red-500' :
                    item.severity === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'
                  }`} />
                  <div>
                    <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">{item.message}</p>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 10: SURFACE OPS (Premium) + FREQUENCIES
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Surface Operations - Premium */}
          <div className="relative border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-purple-500" />
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Surface Operations</span>
              </div>
              {!isLoggedIn && <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">Premium</span>}
              {isLoggedIn && <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Unlocked</span>}
            </div>
            <div className="p-5 space-y-3 relative">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Taxi Congestion', value: ext.congestion > 60 ? 'High' : 'Moderate' },
                  { label: 'Stand Occupancy', value: `${ext.gateOccupancy}%` },
                  { label: 'Pushback Queue', value: ext.congestion > 60 ? '8 aircraft' : '3 aircraft' },
                  { label: 'Apron Congestion', value: ext.congestion > 60 ? 'Elevated' : 'Normal' },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.03] rounded-lg p-3">
                    <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">{item.label}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>
              {/* Premium Overlay - only shown when not logged in */}
              {!isLoggedIn && (
                <div className="absolute inset-0 bg-white/60 dark:bg-sky-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <Lock size={20} className="mx-auto text-slate-400 dark:text-gray-500 mb-2" />
                    <p className="text-xs font-bold text-slate-600 dark:text-gray-400">Sign in to unlock</p>
                    <button className="mt-2 px-4 py-1.5 rounded-lg text-[10px] font-bold text-black" style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}>
                      Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frequencies */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
              <Radio size={14} className="text-emerald-500" />
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">ATC Frequencies</span>
            </div>
            <div className="p-5 space-y-2">
              {ext.frequencies.map((freq) => (
                <div key={freq.type} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.03]">
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{freq.type}</span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{freq.freq} MHz</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 11: AIRPORT GUIDE (SEO)
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{airport.name} - Airport Guide</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{airport.city}, India | IATA: {airport.iata} | ICAO: {airport.icao}</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Overview</h3>
                  <p>{airport.name} ({airport.iata}/{airport.icao}) is one of India's busiest airports, handling {ext.paxTraffic} passengers annually. Located in {airport.city}, it serves as a major hub for {ext.hubAirlines.slice(0, 3).join(', ')}.</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Runway Operations</h3>
                  <p>The airport operates {ext.runways.length} runway{ext.runways.length > 1 ? 's' : ''} ({ext.runways.map(r => r.id).join(', ')}). {ext.runways.filter(r => r.active).length} currently active for operations. ILS capabilities up to {ext.runways[0].ils} for low-visibility approaches.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Terminal Information</h3>
                  <p>The airport has {ext.terminals} terminal{ext.terminals > 1 ? 's' : ''} serving domestic and international operations. Operated by {ext.operator} since {ext.opened}. Current gate occupancy averages {ext.gateOccupancy}%.</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Weather Challenges</h3>
                  <p>Primary weather challenges include winter fog (Dec-Jan) requiring CAT-III operations, monsoon season (Jun-Sep) with reduced visibility, and summer dust storms affecting approach procedures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 12: RELATED AIRPORTS + PREMIUM CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Related Airports */}
          <div className="lg:col-span-2 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
              <MapPin size={14} style={{ color: INDIA_GREEN }} />
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Related Airports</span>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { code: 'JAI', city: 'Jaipur', type: 'Nearby' },
                { code: 'LKO', city: 'Lucknow', type: 'Nearby' },
                { code: 'IXC', city: 'Chandigarh', type: 'Alternate' },
                { code: 'BOM', city: 'Mumbai', type: 'Competing Hub' },
                { code: 'BLR', city: 'Bengaluru', type: 'Competing Hub' },
                { code: 'HYD', city: 'Hyderabad', type: 'Same FIR' },
              ].map((apt) => (
                <Link
                  key={apt.code}
                  to={`/intelligence/airports/${apt.code}`}
                  className="group p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] hover:border-slate-200 dark:hover:border-white/10 transition-all"
                >
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{apt.code}</div>
                  <div className="text-xs text-slate-600 dark:text-gray-400">{apt.city}</div>
                  <div className="text-[9px] font-mono text-slate-400 dark:text-gray-500 mt-1">{apt.type}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Premium CTA - only show when not logged in */}
          {!isLoggedIn ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-white/[0.04]" />
            <div className="relative p-5 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: INDIA_ORANGE }} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: INDIA_ORANGE }}>Premium</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unlock Full Airport Ops</h3>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed flex-1">
                Historical playback, surface analytics, gate occupancy, AI predictions, and operational alerts for {airport.iata}.
              </p>
              <div className="space-y-2 mb-4">
                {['Historical Playback', 'Surface Analytics', 'AI Congestion Prediction', 'Operational Alerts'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[10px] text-slate-300">
                    <Zap size={10} style={{ color: INDIA_ORANGE }} /> {f}
                  </div>
                ))}
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-black text-xs font-bold transition-all"
                style={{ background: `linear-gradient(135deg, ${INDIA_ORANGE}, #FFD700)` }}
              >
                Sign In to Unlock
              </button>
            </div>
          </div>
          ) : (
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
              <Shield size={14} style={{ color: INDIA_GREEN }} />
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">Your Access</span>
            </div>
            <div className="p-5 space-y-3">
              {['Historical Playback', 'Surface Analytics', 'AI Congestion Prediction', 'Operational Alerts', 'Gate Occupancy', 'Turnaround Data'].map((f) => (
                <div key={f} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                  <Zap size={11} style={{ color: INDIA_GREEN }} />
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">{f}</span>
                  <span className="ml-auto text-[8px] font-mono font-bold text-emerald-600 dark:text-emerald-500 uppercase">Active</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER LINKS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Arrivals', to: `/intelligence/airports/${airport.iata}/arrivals` },
              { label: 'Departures', to: `/intelligence/airports/${airport.iata}/departures` },
              { label: 'Weather', to: `/intelligence/airports/${airport.iata}/weather` },
              { label: 'NOTAMs', to: `/intelligence/airports/${airport.iata}/notams` },
              { label: 'Runways', to: `/intelligence/airports/${airport.iata}/runways` },
              { label: 'Charts', to: `/intelligence/airports/${airport.iata}/charts` },
              { label: 'Analytics', to: `/intelligence/airports/${airport.iata}/analytics` },
              { label: 'Congestion', to: `/intelligence/airports/${airport.iata}/congestion` },
              { label: 'Routes', to: `/intelligence/airports/${airport.iata}/routes` },
              { label: 'Airlines', to: `/intelligence/airports/${airport.iata}/airlines` },
              { label: 'Live Map', to: `/intelligence/airports/${airport.iata}/live-map` },
            ].map((link) => (
              <Link key={link.label} to={link.to} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all">
                {airport.iata} {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AirportHub;
