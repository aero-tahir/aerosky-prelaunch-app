import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import {
  Plane,
  Map as MapIcon,
  Filter,
  Settings,
  Layers,
  Wind,
  PlayCircle,
  LayoutDashboard,
  Search,
  Globe,
  Clock,
  Navigation,
  Activity,
  Signal,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  X,
  Menu,
  Sun,
  Moon,
  Info,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Users,
  Briefcase,
  Eye,
  Radar,
  Calendar,
  Zap,
  Radio,
  Wifi,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FLIGHTS as MOCK_FLIGHTS } from '../mockData';
import { generateFallbackFlights } from '../utils/fallbackFlights';
import { PlanespottersService } from '../services/PlanespottersService';
import { getIndianAirspaceContext, getFlightPhase, generatePilotReport, getDelayRiskDetails, getDestinationIntel, deriveOperationalStatus, getFeederStatus } from '../utils/OperationalIntelligence';
import IntelligenceDock, { DockMode } from '../components/IntelligenceDock';
import DynamicWidgetPanel from '../components/DynamicWidgetPanel';

// Lazy load MapComponent
const MapComponent = lazy(() => import('../components/MapComponent'));

// Stub for smoothing hook if not found
const useSmoothFlights = (flights: any[], _interval: number) => flights;

const LiveMap: React.FC = () => {
  const navigate = useNavigate();

  // --- Title Logic ---
  useEffect(() => {
    document.title = "Live Map Intelligence | AeroSky";
  }, []);

  // --- Theme Logic ---
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // --- Dock & Panel Management ---
  const [activeDockMode, setActiveDockMode] = useState<DockMode>(null);

  // Map Controls State
  const [layerConfig, setLayerConfig] = useState({
    showFIR: true,
    showTerrain: false,
    showHolding: true,
    showAeroCharts: false,
    showAirportPins: true,
    showAirportLabels: true,
    showAircraftLabels: true,
    mapBrightness: 100
  });

  const [widgetConfig, setWidgetConfig] = useState({
    showTelemetry: true,
    showCompass: true,
    showMiniMap: false,
    showWeatherLegend: false,
    showNetworkStatus: true,
    showSignalConfidence: true
  });

  const [activeMapStyle, setActiveMapStyle] = useState<'dark' | 'satellite' | 'street' | 'vector'>('dark');

  // Flight Selection
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [flightImage, setFlightImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFlightId) {
      setActiveDockMode('FLIGHT');
    } else if (activeDockMode === 'FLIGHT') {
      setActiveDockMode(null);
    }
  }, [selectedFlightId]);

  const handleBackToFilter = () => {
    setSelectedFlightId(null);
    setActiveDockMode('FILTER');
  };

  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [searchQuery, setSearchQuery] = useState('');
  const [altRange, setAltRange] = useState([0, 60000]);
  const [speedRange, setSpeedRange] = useState([0, 800]);
  const [activeAirlines, setActiveAirlines] = useState<string[]>([]);
  const [activeFIRs, setActiveFIRs] = useState<string[]>([]);

  // Data Processing
  const allFlights = useMemo(() => [...MOCK_FLIGHTS, ...generateFallbackFlights()], []);

  const rawFilteredFlights = useMemo(() => {
    return allFlights.filter(f => {
      const query = searchQuery.toUpperCase();
      const matchSearch =
        f.flightNumber.toUpperCase().includes(query) ||
        f.airline.toUpperCase().includes(query) ||
        f.airlineCode.toUpperCase().includes(query) ||
        f.origin.iata.includes(query) ||
        f.destination.iata.includes(query) ||
        f.aircraft.registration.includes(query);

      if (!matchSearch) return false;

      const alt = f.liveMetrics.altitude;
      if (alt !== undefined && (alt < altRange[0] || alt > altRange[1])) return false;

      const spd = f.liveMetrics.groundSpeed;
      if (spd !== undefined && (spd < speedRange[0] || spd > speedRange[1])) return false;

      if (activeAirlines.length > 0 && !activeAirlines.includes(f.airlineCode)) return false;

      return true;
    });
  }, [searchQuery, altRange, speedRange, activeAirlines, allFlights]);

  const filteredFlights = useSmoothFlights(rawFilteredFlights, 60000);
  const selectedFlight = useMemo(() => allFlights.find(f => f.id === selectedFlightId), [selectedFlightId, allFlights]);

  // Image Handling
  useEffect(() => {
    const fetchImage = async () => {
      setFlightImage(null);
      if (!selectedFlight) return;
      if (selectedFlight.aircraft.registration && selectedFlight.aircraft.registration !== 'N/A') {
        const url = await PlanespottersService.fetchPhoto(selectedFlight.aircraft.registration);
        if (url) setFlightImage(url);
      }
    };
    fetchImage();
  }, [selectedFlight?.id]);

  // --- Mode Renderers ---

  const renderFilterMode = () => {
    const airlineMap: Record<string, { name: string; emoji: string; hub: string }> = {
      'IGO': { name: 'IndiGo', emoji: '🔵', hub: 'Delhi' },
      'AIC': { name: 'Air India', emoji: '🇮🇳', hub: 'Delhi' },
      'VTI': { name: 'Vistara', emoji: '✨', hub: 'Delhi' },
      'UAE': { name: 'Emirates', emoji: '🏜️', hub: 'Dubai' },
      'AKJ': { name: 'Akasa Air', emoji: '🟠', hub: 'Mumbai' },
      'SEJ': { name: 'SpiceJet', emoji: '🌶️', hub: 'Delhi' },
      'AIX': { name: 'Air India Express', emoji: '🧡', hub: 'Kochi' },
    };
    const firMap: Record<string, { name: string; region: string; color: string }> = {
      'VIDF': { name: 'Delhi FIR', region: 'North India', color: 'from-amber-100 to-amber-50 border-amber-200 text-amber-800 dark:from-amber-500/20 dark:to-amber-500/5 dark:border-amber-500/20 dark:text-amber-400' },
      'VABF': { name: 'Mumbai FIR', region: 'West India', color: 'from-blue-100 to-blue-50 border-blue-200 text-blue-800 dark:from-blue-500/20 dark:to-blue-500/5 dark:border-blue-500/20 dark:text-blue-400' },
      'VOMF': { name: 'Chennai FIR', region: 'South India', color: 'from-emerald-100 to-emerald-50 border-emerald-200 text-emerald-800 dark:from-emerald-500/20 dark:to-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-400' },
      'VECF': { name: 'Kolkata FIR', region: 'East India', color: 'from-purple-100 to-purple-50 border-purple-200 text-purple-800 dark:from-purple-500/20 dark:to-purple-500/5 dark:border-purple-500/20 dark:text-purple-400' },
    };
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-gradient-to-r from-orange-500/[0.08] via-slate-500/[0.05] to-green-500/[0.06] dark:via-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-lg p-3 mb-3 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🇮🇳</span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-white/90">Indian Sky — Live</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={9} className="text-slate-400 dark:text-white/30" />
              <span className="text-[9px] text-slate-500 dark:text-white/40 font-mono">{timeNow} IST</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-500 dark:text-white/40 leading-relaxed">
            Tracking <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{filteredFlights.length}</span> flights across Indian airspace.
          </p>
        </div>

        <div className="relative group mb-3 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors duration-300" size={14} />
          <input
            type="text"
            placeholder="Search flights, airlines, airports..."
            className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] focus:border-cyan-500/30 focus:bg-white dark:focus:bg-white/[0.05] rounded-lg pl-8 pr-3 py-2 text-[11px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/25 outline-none transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex p-0.5 bg-slate-100 dark:bg-white/[0.03] mb-3 rounded-lg shrink-0 border border-slate-200 dark:border-white/[0.04]">
          <button onClick={() => setActiveTab('basic')} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-md flex items-center justify-center gap-1 ${activeTab === 'basic' ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'}`}>
            <Globe size={10} /> Discover
          </button>
          <button onClick={() => setActiveTab('advanced')} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-md flex items-center justify-center gap-1 ${activeTab === 'advanced' ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'}`}>
            <Settings size={10} /> Range
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {activeTab === 'basic' ? (
            <>
              <CollapsibleSection title="🛫  Airlines" defaultOpen>
                <div className="space-y-0.5">
                  {Object.entries(airlineMap).map(([code, info]) => (
                    <FilterCheckbox key={code} label={info.name} code={code} emoji={info.emoji} subtitle={info.hub} checked={activeAirlines.includes(code)} onChange={() => setActiveAirlines(p => p.includes(code) ? p.filter(c => c !== code) : [...p, code])} />
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="🗺️  Indian Airspace" defaultOpen>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(firMap).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => setActiveFIRs(p => p.includes(code) ? p.filter(f => f !== code) : [...p, code])}
                      className={`relative overflow-hidden p-2.5 rounded-lg border transition-all duration-300 text-left group
                        ${activeFIRs.includes(code)
                          ? `bg-gradient-to-br ${info.color} shadow-sm`
                          : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/[0.04] hover:shadow-sm'
                        }`}
                    >
                      <div className={`text-[10px] font-bold ${activeFIRs.includes(code) ? '' : 'text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white'} transition-colors`}>{info.name}</div>
                      <div className={`text-[8px] ${activeFIRs.includes(code) ? 'text-current opacity-70' : 'text-slate-400 dark:text-white/25 group-hover:text-slate-500 dark:group-hover:text-white/40'} mt-0.5 transition-colors`}>{info.region}</div>
                      <div className={`text-[8px] font-mono mt-1 ${activeFIRs.includes(code) ? 'text-current opacity-60' : 'text-slate-300 dark:text-white/15 group-hover:text-slate-400 dark:group-hover:text-white/30'}`}>{code}</div>
                    </button>
                  ))}
                </div>
              </CollapsibleSection>
            </>
          ) : (
            <CollapsibleSection title="📊  Telemetry Range" defaultOpen>
              <div className="space-y-3 pt-1">
                <RangeSlider label="Altitude" min={0} max={60000} value={altRange} onChange={(val: number[]) => setAltRange(val)} unit="ft" emoji="🏔️" />
                <RangeSlider label="Speed" min={0} max={800} value={speedRange} onChange={(val: number[]) => setSpeedRange(val)} unit="kts" emoji="💨" />
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    );
  };

  const flightIntelligenceCardContent = useMemo(() => {
    if (!selectedFlight) return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-white/20 p-8 space-y-4">
        <Plane size={48} className="opacity-20 translate-y-2 animate-bounce" />
        <p className="text-xs font-bold tracking-widest uppercase">Select an aircraft for intelligence</p>
      </div>
    );

    const phase = getFlightPhase(selectedFlight);
    const briefing = generatePilotReport(selectedFlight);
    const intel = getIndianAirspaceContext(selectedFlight);
    const feeder = getFeederStatus(selectedFlight);
    const vr = selectedFlight.liveMetrics.vertRate || 0;

    const vrColor = vr > 300 ? 'text-emerald-500' : vr < -300 ? 'text-orange-500' : 'text-slate-400 dark:text-white/40';
    const statusColor = selectedFlight.status === 'On Time' ? 'bg-emerald-500' : selectedFlight.status === 'Delayed' ? 'bg-amber-500' : 'bg-cyan-500';

    // Phase Timeline steps
    const phases = [
      { id: 'T-OFF', label: 'Departed', active: ['TAKEOFF', 'CLIMB', 'CRUISE', 'TOD', 'APPROACH', 'FINAL', 'EN_ROUTE'].includes(phase.phase) },
      { id: 'CRZ', label: 'Cruise', active: ['CRUISE', 'TOD', 'APPROACH', 'FINAL'].includes(phase.phase) },
      { id: 'APP', label: 'Approach', active: ['APPROACH', 'FINAL'].includes(phase.phase) },
      { id: 'LAND', label: 'Landing', active: phase.phase === 'FINAL' }
    ];

    return (
      <div className="flex flex-col min-h-0 h-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out overflow-hidden">
        {/* --- AIRCRAFT HERO --- */}
        <div className="relative h-44 shrink-0 overflow-hidden group">
          <img
            src={flightImage || selectedFlight.aircraft.image}
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[4s] ease-out brightness-90 animate-in zoom-in-110 duration-1000"
            alt="Aircraft"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/70 via-[#0a0e1a]/20 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-sm flex items-center gap-1.5 shadow-2xl border border-white/10">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
              SOVEREIGN LIVE
            </span>
            <span className={`${statusColor} backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-sm shadow-2xl border border-white/10 uppercase tracking-wider`}>
              {selectedFlight.status}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-cyan-400 font-black tracking-[0.25em] uppercase mb-1 drop-shadow-md truncate">{selectedFlight.airline}</div>
                <h1 className="text-3xl font-black text-white leading-none tracking-tighter drop-shadow-lg flex items-center gap-3">
                  {selectedFlight.flightNumber}
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/50 border border-white/5">{selectedFlight.aircraft.registration}</span>
                </h1>
              </div>
              <div className="text-right shrink-0">
                <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center mb-1 ml-auto">
                  <Plane size={24} className="text-cyan-400 opacity-80" />
                </div>
                <div className="text-[10px] text-white/60 font-black uppercase tracking-widest">{selectedFlight.aircraft.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- INTELLIGENCE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-heavy dark:bg-[#0c1020]/40">
          <div className="space-y-5 p-5">

            {/* 1. MISSION PROGRESS & PHASE TIMELINE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="text-center group cursor-help">
                  <div className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1 group-hover:text-cyan-400 transition-colors uppercase">{selectedFlight.origin.iata}</div>
                  <div className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tight">{selectedFlight.origin.city}</div>
                </div>

                <div className="flex-1 px-6 relative flex flex-col items-center">
                  <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 animate-pulse"
                      style={{ width: phase.phase === 'FINAL' ? '95%' : phase.phase === 'APPROACH' ? '80%' : phase.phase === 'CRUISE' ? '50%' : '20%' }}
                    />
                  </div>
                  <div className="absolute inset-x-0 top-0.5 flex justify-center translate-y-[-6px]">
                    <div
                      className="p-1 bg-white dark:bg-[#0c1020] rounded-full border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000"
                      style={{ marginLeft: phase.phase === 'FINAL' ? '90%' : phase.phase === 'APPROACH' ? '60%' : phase.phase === 'CRUISE' ? '0%' : '-60%' }}
                    >
                      <Plane size={10} className="text-cyan-500 rotate-90" />
                    </div>
                  </div>
                  <div className="text-[9px] font-black text-cyan-400/80 uppercase tracking-widest bg-cyan-400/5 px-3 py-1 rounded-full border border-cyan-400/10">
                    {selectedFlight.duration} TO DEST
                  </div>
                </div>

                <div className="text-center group cursor-help">
                  <div className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1 group-hover:text-cyan-400 transition-colors uppercase">{selectedFlight.destination.iata}</div>
                  <div className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tight">{selectedFlight.destination.city}</div>
                </div>
              </div>

              {/* Graphical Phase Stepper */}
              <div className="grid grid-cols-4 gap-1 px-1">
                {phases.map(p => (
                  <div key={p.id} className="space-y-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${p.active ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'bg-slate-200 dark:bg-white/5'}`} />
                    <div className={`text-[8px] font-black uppercase text-center tracking-tighter ${p.active ? 'text-cyan-400' : 'text-slate-400 dark:text-white/10'}`}>
                      {p.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. HUMAN OPERATIONAL BRIEFING */}
            <div className="bg-gradient-to-br from-cyan-500/[0.08] via-transparent to-transparent border border-cyan-500/10 rounded-xl p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe size={40} className="text-cyan-400" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg bg-white dark:bg-white/5 shadow-sm border border-cyan-500/20 ${phase.color}`}>
                  {phase.icon}
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    Human Intelligence Brief
                    <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                  </h3>
                  <div className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase">{phase.humanLabel} • {intel.fir.name}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-white/70 leading-relaxed font-medium italic pr-4">
                "{briefing}"
              </p>

              {intel.alerts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {intel.alerts.map((alert, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black rounded uppercase tracking-tighter">
                      {alert}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 3. TELEMETRY HUB (HIGH PRECISION) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200 dark:border-white/[0.05] hover:border-cyan-500/30 transition-colors">
                <div className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase mb-1">Altitude (ft)</div>
                <div className="text-lg font-black dark:text-white font-mono leading-none flex items-baseline gap-1">
                  {selectedFlight.liveMetrics.altitude.toLocaleString()}
                  <span className="text-[10px] text-blue-400">FL{Math.round(selectedFlight.liveMetrics.altitude / 100)}</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200 dark:border-white/[0.05] hover:border-cyan-500/30 transition-colors">
                <div className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase mb-1">Grd Spd (kts)</div>
                <div className="text-lg font-black dark:text-white font-mono leading-none">
                  {selectedFlight.liveMetrics.groundSpeed}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200 dark:border-white/[0.05] hover:border-cyan-500/30 transition-colors">
                <div className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase mb-1">Vert Rate</div>
                <div className={`text-lg font-black font-mono leading-none ${vrColor}`}>
                  {vr > 0 ? '+' : ''}{vr}
                </div>
              </div>
            </div>

            {/* 4. SOVEREIGN DATA CHAIN */}
            <div className="p-4 bg-[#0a0e1a]/20 border border-white/[0.03] rounded-xl space-y-4">
              <div>
                <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 flex items-center justify-between">
                  Sovereign Context
                  <Signal size={12} className="text-emerald-500" />
                </h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <InfoRow label="FIR Sector" value={intel.fir.name} last={false} />
                  <InfoRow label="Frequency" value={intel.fir.freq} mono last={false} />
                  <InfoRow label="Squawk" value={selectedFlight.aircraft.squawk} last={false} />
                  <InfoRow label="Track" value={`${selectedFlight.liveMetrics.track || 0}°`} last={false} />
                  <InfoRow label="Mode S" value={selectedFlight.id.slice(0, 6).toUpperCase()} last={false} />
                  <InfoRow label="Station ID" value="VIDP-FDR-01" last={false} />
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-cyan-400" />
                    <div className="text-[10px] font-black text-white/60 tracking-tight uppercase">{feeder.text}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-white/30 uppercase">Quality:</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded border border-emerald-500/20">{feeder.quality.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => navigate(`/flights/${selectedFlight.id}`)}
              className="group relative w-full py-3.5 bg-white dark:bg-white/[0.03] hover:bg-cyan-500 p-2 text-slate-700 dark:text-white/80 hover:text-white border border-slate-200 dark:border-white/[0.1] hover:border-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
              FULL ADIZ INTELLIGENCE REPORT <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

          </div>
        </div>
      </div>
    );
  }, [selectedFlight, flightImage, navigate]);

  return (
    <div className="relative w-full h-screen bg-[#0c1020] overflow-hidden flex flex-col font-sans selection:bg-cyan-500/30">
      <div className="flex-1 relative">
        <Suspense fallback={<div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-white/20 italic">Loading Aeronautical Charts...</div>}>
          <MapComponent
            flights={filteredFlights}
            selectedFlightId={selectedFlightId}
            onFlightClick={setSelectedFlightId}
            showFIR={layerConfig.showFIR}
            showTerrain={layerConfig.showTerrain}
            showHolding={layerConfig.showHolding}
            showAeroCharts={layerConfig.showAeroCharts}
            showAirportPins={layerConfig.showAirportPins}
            showAirportLabels={layerConfig.showAirportLabels}
            showAircraftLabels={layerConfig.showAircraftLabels}
            mapBrightness={layerConfig.mapBrightness}
            activeMapStyle={activeMapStyle}
          />
        </Suspense>

        {/* --- INTELLIGENCE DOCK --- */}
        <IntelligenceDock
          activeMode={activeDockMode}
          onModeChange={setActiveDockMode}
        />

        {/* --- DYNAMIC WIDGET PANEL --- */}
        <DynamicWidgetPanel
          isOpen={activeDockMode !== null}
          onClose={() => setActiveDockMode(null)}
          width={activeDockMode === 'FLIGHT' ? 420 : 340}
          title={
            activeDockMode === 'FLIGHT' ? 'Flight Intelligence' :
              activeDockMode === 'LAYERS' ? 'Map Infrastructure' :
                activeDockMode === 'SETTINGS' ? 'System Configuration' :
                  activeDockMode === 'FILTER' ? 'Traffic Filtering' :
                    activeDockMode === 'WEATHER' ? 'Meteorological Data' :
                      activeDockMode === 'WIDGETS' ? 'UI Instrumentation' : 'Playback Control'
          }
          subtitle={
            activeDockMode === 'FLIGHT' ? (selectedFlight?.flightNumber || 'Target Analysis') :
              'Configure real-time intelligence feeds'
          }
          icon={
            activeDockMode === 'FLIGHT' ? <Plane size={18} /> :
              activeDockMode === 'LAYERS' ? <Layers size={18} /> :
                activeDockMode === 'SETTINGS' ? <Settings size={18} /> :
                  activeDockMode === 'FILTER' ? <Filter size={18} /> :
                    activeDockMode === 'WEATHER' ? <Wind size={18} /> :
                      activeDockMode === 'WIDGETS' ? <LayoutDashboard size={18} /> : <PlayCircle size={18} />
          }
        >
          {activeDockMode === 'FILTER' && renderFilterMode()}

          {activeDockMode === 'LAYERS' && (
            <div className="space-y-6">
              <CollapsibleSection title="Base Layers" defaultOpen>
                <div className="grid grid-cols-2 gap-2 p-1">
                  {[
                    { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                    { id: 'satellite', label: 'Satellite', icon: <Globe size={14} /> },
                    { id: 'street', label: 'Streets', icon: <MapIcon size={14} /> },
                    { id: 'vector', label: 'Vectors', icon: <Navigation size={14} /> },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setActiveMapStyle(style.id as any)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${activeMapStyle === style.id ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-slate-100 dark:bg-white/5 border-transparent hover:bg-slate-200 dark:hover:bg-white/10'}`}
                    >
                      {style.icon}
                      <span className="text-[10px] font-bold">{style.label}</span>
                    </button>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Aeronautical Info" defaultOpen>
                <div className="space-y-1">
                  <ToggleSwitch label="ATC Boundaries" active={layerConfig.showFIR} onClick={() => setLayerConfig(p => ({ ...p, showFIR: !p.showFIR }))} icon={<ShieldAlert size={14} />} description="FIR Sector lines" />
                  <ToggleSwitch label="Aero Charts" active={layerConfig.showAeroCharts} onClick={() => setLayerConfig(p => ({ ...p, showAeroCharts: !p.showAeroCharts }))} icon={<MapIcon size={14} />} description="Airways & Waypoints" />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Infrastructure" defaultOpen>
                <div className="space-y-1">
                  <ToggleSwitch label="Airport Pins" active={layerConfig.showAirportPins} onClick={() => setLayerConfig(p => ({ ...p, showAirportPins: !p.showAirportPins }))} icon={<MapPin size={14} />} />
                  <ToggleSwitch label="Airport Labels" active={layerConfig.showAirportLabels} onClick={() => setLayerConfig(p => ({ ...p, showAirportLabels: !p.showAirportLabels }))} icon={<Info size={14} />} />
                  <ToggleSwitch label="Aircraft Labels" active={layerConfig.showAircraftLabels} onClick={() => setLayerConfig(p => ({ ...p, showAircraftLabels: !p.showAircraftLabels }))} icon={<Plane size={14} />} />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Visual Exposure" defaultOpen>
                <div className="px-1 py-1">
                  <RangeSlider label="Brightness" min={0} max={100} value={[0, layerConfig.mapBrightness]} onChange={([_, val]: any) => setLayerConfig(p => ({ ...p, mapBrightness: val }))} emoji="☀️" />
                </div>
              </CollapsibleSection>
            </div>
          )}

          {activeDockMode === 'SETTINGS' && (
            <div className="space-y-6">
              <CollapsibleSection title="Theme Engine" defaultOpen>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={toggleTheme} className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500' : 'bg-white/5 border-transparent text-slate-400'}`}><Sun size={16} /><span className="text-[10px] font-bold">Standard</span></button>
                  <button onClick={toggleTheme} className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-transparent text-slate-400'}`}><Moon size={16} /><span className="text-[10px] font-bold">Night Ops</span></button>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Data Strategy" defaultOpen>
                <div className="p-3 bg-cyan-500/[0.04] rounded-xl border border-cyan-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Radio size={14} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Sovereign Data Mode</span>
                  </div>
                  <p className="text-[9px] text-white/30 leading-relaxed">
                    Native ADS-B streams active. External API dependencies (OpenSky) disabled for maximum data sovereignty and reliability.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="App Settings" defaultOpen>
                <div className="space-y-1">
                  <ToggleSwitch label="Humanized Metrics" active={true} onClick={() => { }} icon={<Briefcase size={14} />} description="DGCA-compliant units" />
                  <ToggleSwitch label="Auto-Tracking" active={true} onClick={() => { }} icon={<Eye size={14} />} description="Focus on selection" />
                </div>
              </CollapsibleSection>
            </div>
          )}

          {activeDockMode === 'WEATHER' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <CloudRain size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">IMD Radar Active</span>
                </div>
                <p className="text-[9px] text-white/40 mb-3">Fetching real-time precipitation data from Indian Meteorological Department stations.</p>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/40 w-[65%] rounded-full animate-pulse" />
                </div>
              </div>

              <CollapsibleSection title="Radar Layers" defaultOpen>
                <div className="space-y-1">
                  <ToggleSwitch label="Rainfall Radar" active={false} onClick={() => { }} icon={<CloudRain size={14} />} description="Precipitation overlay" />
                  <ToggleSwitch label="Wind Streamlines" active={false} onClick={() => { }} icon={<Wind size={14} />} description="Global upper winds" />
                  <ToggleSwitch label="Temperature Map" active={false} onClick={() => { }} icon={<Thermometer size={14} />} description="Surface OAT" />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Weather Alerts" defaultOpen>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <AlertTriangle size={12} />
                    <span className="text-[9px] font-bold uppercase">SIGMET Advisory</span>
                  </div>
                  <p className="text-[8px] text-white/40">Moderate turbulence reported over Himalayan corridor. Visibility 3000m at VIDP.</p>
                </div>
              </CollapsibleSection>
            </div>
          )}

          {activeDockMode === 'WIDGETS' && (
            <div className="space-y-6">
              <CollapsibleSection title="Map Overlays" defaultOpen>
                <div className="space-y-1">
                  <ToggleSwitch label="Flight Telemetry" active={widgetConfig.showTelemetry} onClick={() => setWidgetConfig(p => ({ ...p, showTelemetry: !p.showTelemetry }))} icon={<Activity size={14} />} />
                  <ToggleSwitch label="System Compass" active={widgetConfig.showCompass} onClick={() => setWidgetConfig(p => ({ ...p, showCompass: !p.showCompass }))} icon={<Navigation size={14} />} />
                  <ToggleSwitch label="Network Monitor" active={widgetConfig.showNetworkStatus} onClick={() => setWidgetConfig(p => ({ ...p, showNetworkStatus: !p.showNetworkStatus }))} icon={<Wifi size={14} />} />
                  <ToggleSwitch label="Signal Reliability" active={widgetConfig.showSignalConfidence} onClick={() => setWidgetConfig(p => ({ ...p, showSignalConfidence: !p.showSignalConfidence }))} icon={<Signal size={14} />} />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Intelligence Feed" defaultOpen>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold text-white/40 uppercase">Feed Source</span>
                    <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">LIVE ADS-B</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Station #402 (DEL) Online
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Station #811 (BOM) Online
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          )}

          {activeDockMode === 'PLAYBACK' && (
            <div className="space-y-6">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">History Playback</h3>
                <p className="text-[10px] text-white/30 leading-relaxed">Rewind airspace to any point in the last 24 hours.</p>
              </div>

              <div className="px-2">
                <RangeSlider label="Time Period" min={0} max={1440} value={[0, 1440]} onChange={() => { }} emoji="🕒" unit="min ago" />
                <div className="flex justify-between items-center mt-3 px-1 text-[8px] text-white/20 font-black uppercase tracking-tighter">
                  <span>-24 hours</span>
                  <span>Now</span>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-cyan-400 transition-colors shadow-xl shadow-cyan-500/10">
                  Initialize Playback
                </button>
              </div>
            </div>
          )}

          {activeDockMode === 'FLIGHT' && flightIntelligenceCardContent}
        </DynamicWidgetPanel>




      </div>
    </div>
  );
};

// --- Sub-Components ---
const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] py-2.5 group transition-colors">
        <span className="group-hover:text-slate-600 dark:group-hover:text-white/40">{title}</span>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/[0.03] group-hover:bg-cyan-500/10 transition-all">
          {isOpen ? <ChevronDown size={10} className="group-hover:text-cyan-500" /> : <ChevronRight size={10} className="group-hover:text-cyan-500" />}
        </div>
      </button>
      {isOpen && <div className="animate-in fade-in slide-in-from-top-1 duration-300">{children}</div>}
    </div>
  );
};

const FilterCheckbox = ({ label, code, emoji, subtitle, checked, onChange }: any) => (
  <div onClick={onChange} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer group transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-300 ${checked ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'border-slate-300 dark:border-white/10 p-0.5'}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <div>
        <div className={`text-[10px] font-bold transition-colors ${checked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/60'}`}>{emoji} {label}</div>
        <div className="text-[8px] text-slate-400 dark:text-white/25 uppercase tracking-tight">{code} · {subtitle}</div>
      </div>
    </div>
  </div>
);

const ToggleSwitch: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode; description?: string; color?: string }> = ({ label, active, onClick, icon, description, color = 'cyan' }) => {
  return (
    <div onClick={onClick} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${active ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-cyan-500/20' : 'bg-slate-100 dark:bg-white/[0.04]'}`}>
          {icon}
        </div>
        <div>
          <span className={`text-[10px] font-bold block ${active ? 'text-cyan-400' : 'text-slate-700 dark:text-white/70'}`}>{label}</span>
          {description && <span className="text-[8px] opacity-40 block mt-0.5">{description}</span>}
        </div>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/10'}`}>
        <div className={`absolute top-[4px] w-2 h-2 bg-white rounded-full transition-all ${active ? 'left-[18px]' : 'left-[4px]'}`} />
      </div>
    </div>
  );
};

const RangeSlider = ({ label, min, max, value, onChange, unit, emoji }: any) => (
  <div className="space-y-1.5 py-1">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[9px] font-bold text-slate-500 dark:text-white/30 truncate uppercase tracking-widest">{emoji} {label}</span>
      <span className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded">{value[1]}{unit}</span>
    </div>
    <div className="relative h-6 flex items-center">
      <input type="range" min={min} max={max} value={value[1]} onChange={(e) => onChange([value[0], Number(e.target.value)])} className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500" />
    </div>
  </div>
);

const FilterTag = ({ label, count, color, bg }: any) => (
  <div className={`px-2 py-1 border rounded-lg text-[8px] font-bold flex items-center gap-2 ${bg || 'bg-white/5 border-white/5 text-white/40'}`}>
    <span>{label}</span>
    <span className={color}>{count}</span>
  </div>
);

const TelemetryBox = ({ label, value, unit }: any) => (
  <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-2 rounded-lg flex flex-col items-center">
    <span className="text-[7px] text-slate-400 dark:text-white/20 uppercase mb-0.5 font-black tracking-widest">{label}</span>
    <span className="text-[11px] font-black text-slate-800 dark:text-white font-mono">{value} <span className="text-[7px] font-normal opacity-40 ml-0.5">{unit}</span></span>
  </div>
);

const InfoRow = ({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) => (
  <div className={`flex items-center justify-between py-2 ${!last ? 'border-b border-slate-100 dark:border-white/5' : ''}`}>
    <span className="text-[8px] text-slate-400 dark:text-white/20 uppercase font-bold tracking-wider">{label}</span>
    <span className={`text-[10px] font-black text-slate-700 dark:text-white/70 ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);

export default LiveMap;