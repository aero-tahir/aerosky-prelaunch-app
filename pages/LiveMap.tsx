import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Filter, Layers, Navigation, Wind, Search, X,
  Settings, Plus, Minus, Locate, Map as MapIcon,
  Crosshair, ArrowUpRight, Gauge, Plane, Check,
  ChevronDown, ChevronUp, Menu, Globe, Activity,
  Radio, AlertTriangle, Clock, Signal, ArrowLeft,
  BarChart3, ShieldAlert, Calendar, Users, Briefcase,
  Armchair, Thermometer, Compass, ArrowDown, ArrowUp,
  RefreshCw, Luggage, CircleDollarSign, MapPin, Moon, Sun
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import type { MapControls } from '../components/MapComponent';
import { OpenSkyService } from '../services/OpenSkyService';
import { FLIGHTS as MOCK_FLIGHTS } from '../mockData';
import { generateFallbackFlights } from '../utils/fallbackFlights';
import { Flight } from '../types';
import { PlanespottersService } from '../services/PlanespottersService';
import { getOperationalStatus, getDelayRiskDetails, generatePilotReport, getFeederStatus, getFlightPhase, getIndianAirspaceContext, getDestinationIntel } from '../utils/OperationalIntelligence';

type PanelMode = 'FILTER' | 'FLIGHT' | 'ANALYTICS' | 'SYSTEM';
type MapStyleId = 'dark' | 'light' | 'satellite' | 'hybrid';

const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || 'dSpdveDyWcUJ4q2XAnRuweHDDnim2xnv0BFR73kQ';
const MAP_STYLES: Record<MapStyleId, { label: string; icon: string; url: string }> = {
  dark: { label: 'Dark', icon: '🌙', url: `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json?api_key=${OLA_API_KEY}` },
  light: { label: 'Light', icon: '☀️', url: `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${OLA_API_KEY}` },
  satellite: { label: 'Satellite', icon: '🛰️', url: `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard-satellite/style.json?api_key=${OLA_API_KEY}` },
  hybrid: { label: 'Terrain', icon: '🏔️', url: `https://api.olamaps.io/tiles/vector/v1/styles/default-earth-standard/style.json?api_key=${OLA_API_KEY}` },
};

function useSmoothFlights(targetFlights: Flight[], intervalMs: number = 60000): Flight[] {
  const [renderFlights, setRenderFlights] = useState<Flight[]>(targetFlights);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();
    const startFlights = renderFlights;
    const targetMap = new Map(targetFlights.map(f => [f.id, f]));

    const tick = (time: number) => {
      let elapsed = time - startTime;
      if (elapsed > intervalMs) elapsed = intervalMs;
      const progress = elapsed / intervalMs;

      setRenderFlights((prev) => {
        return targetFlights.map(targetFlight => {
          const startFlight = startFlights.find(f => f.id === targetFlight.id);
          if (!startFlight) return targetFlight;

          const latDiff = targetFlight.liveMetrics.lat - startFlight.liveMetrics.lat;
          const lngDiff = targetFlight.liveMetrics.lng - startFlight.liveMetrics.lng;

          return {
            ...targetFlight,
            liveMetrics: {
              ...targetFlight.liveMetrics,
              lat: startFlight.liveMetrics.lat + latDiff * progress,
              lng: startFlight.liveMetrics.lng + lngDiff * progress,
            }
          };
        });
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetFlights]);

  return renderFlights;
}

const LiveMap: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const mapRef = useRef<MapControls>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('FILTER');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [activeMapStyle, setActiveMapStyle] = useState<MapStyleId>('dark');
  const [isStylePickerOpen, setIsStylePickerOpen] = useState(false);

  // Sync map style with global theme
  useEffect(() => {
    setActiveMapStyle(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);


  // Initial Mode Logic
  useEffect(() => {
    if (selectedFlightId) {
      setPanelMode('FLIGHT');
      setIsPanelCollapsed(false);
    } else if (panelMode === 'FLIGHT' && !selectedFlightId) {
      setPanelMode('FILTER');
    }
  }, [selectedFlightId]);

  const handleBackToFilter = () => {
    setSelectedFlightId(null);
    setPanelMode('FILTER');
  }

  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [mapType, setMapType] = useState<'dark' | 'satellite' | 'hybrid'>('dark');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [altRange, setAltRange] = useState([0, 60000]);
  const [speedRange, setSpeedRange] = useState([0, 800]);
  const [activeAirlines, setActiveAirlines] = useState<string[]>([]);
  const [activeFIRs, setActiveFIRs] = useState<string[]>([]);

  // Map Layer States
  const [showWeather, setShowWeather] = useState(false);
  const [showATC, setShowATC] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);
  const [showHolding, setShowHolding] = useState(true);

  // Live Data State
  const [liveFlights, setLiveFlights] = useState<Flight[]>([]);
  const [useLiveData, setUseLiveData] = useState(true);

  // Fetch Live Data
  useEffect(() => {
    if (!useLiveData) return;
    const fetchFlights = async () => {
      try {
        const data = await OpenSkyService.fetchLiveFlights();
        if (data.length > 0) setLiveFlights(data);
      } catch (err) {
        console.error("Failed to fetch live flights", err);
      }
    };
    fetchFlights();
    const interval = setInterval(fetchFlights, 60000);
    return () => clearInterval(interval);
  }, [useLiveData]);

  // Data Processing
  const fallbackFlights = useMemo(() => [...MOCK_FLIGHTS, ...generateFallbackFlights()], []);
  const allFlights = useMemo(() => useLiveData && liveFlights.length > 0 ? liveFlights : fallbackFlights, [liveFlights, useLiveData, fallbackFlights]);

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
  const [flightImage, setFlightImage] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedFlight) return;
    setFlightImage(selectedFlight.aircraft.image);
    const fetchImage = async () => {
      if (selectedFlight.aircraft.registration && selectedFlight.aircraft.registration !== 'N/A') {
        const url = await PlanespottersService.fetchPhoto(selectedFlight.aircraft.registration);
        if (url) setFlightImage(url);
      }
    };
    fetchImage();
  }, [selectedFlight?.id]);

  // Flight Track Handling
  const [flightTrack, setFlightTrack] = useState<any[] | null>(null);
  useEffect(() => {
    if (!selectedFlightId) {
      setFlightTrack(null);
      return;
    }
    const flight = allFlights.find(f => f.id === selectedFlightId);
    if (!flight) return;

    setFlightTrack(null); // clear old track while loading
    if (flight.id.startsWith('flight-')) {
      OpenSkyService.fetchFlightTrack(flight.id).then(track => {
        if (track && track.path) {
          setFlightTrack(track.path);
        }
      });
    }
  }, [selectedFlightId, allFlights]);


  // --- Mode Renderers ---

  const renderHeader = () => (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-4 rounded-xl shadow-lg mb-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {panelMode !== 'FILTER' && (
          <button onClick={handleBackToFilter} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
            {panelMode === 'FILTER' && <><Filter size={14} className="text-cyan-600 dark:text-cyan-400" /> Flight Filter</>}
            {panelMode === 'FLIGHT' && <><Plane size={14} className="text-amber-500 dark:text-yellow-400" /> Operational Detail</>}
            {panelMode === 'ANALYTICS' && <><BarChart3 size={14} className="text-purple-600 dark:text-purple-400" /> Network Analytics</>}
          </h2>
          <div className="text-[10px] text-slate-500 dark:text-gray-500 font-mono mt-0.5">
            {panelMode === 'FILTER' ? `${filteredFlights.length} Active Targets` : panelMode === 'FLIGHT' ? selectedFlight?.flightNumber : 'System Nominal'}
          </div>
        </div>
      </div>
      <button onClick={() => setIsPanelCollapsed(!isPanelCollapsed)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
        {isPanelCollapsed ? <Menu size={18} /> : <X size={18} />}
      </button>
    </div>
  );

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

        {/* ── Indian Sky Status Banner ── */}
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
            {filteredFlights.filter(f => f.status === 'Delayed').length > 0 && (
              <span className="text-amber-600/80 dark:text-amber-400/80"> {filteredFlights.filter(f => f.status === 'Delayed').length} delayed.</span>
            )}
          </p>
        </div>

        {/* ── Search ── */}
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

        {/* ── Tab Selector ── */}
        <div className="flex p-0.5 bg-slate-100 dark:bg-white/[0.03] mb-3 rounded-lg shrink-0 border border-slate-200 dark:border-white/[0.04]">
          <button onClick={() => setActiveTab('basic')} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-md flex items-center justify-center gap-1 ${activeTab === 'basic' ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'}`}>
            <Globe size={10} /> Discover
          </button>
          <button onClick={() => setActiveTab('advanced')} className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-md flex items-center justify-center gap-1 ${activeTab === 'advanced' ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'}`}>
            <Settings size={10} /> Layers
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {activeTab === 'basic' ? (
            <>
              {/* ── Airlines ── */}
              <CollapsibleSection title="🛫  Airlines" defaultOpen>
                <div className="space-y-0.5">
                  {Object.entries(airlineMap).map(([code, info]) => (
                    <FilterCheckbox key={code} label={info.name} code={code} emoji={info.emoji} subtitle={info.hub} checked={activeAirlines.includes(code)} onChange={() => setActiveAirlines(p => p.includes(code) ? p.filter(c => c !== code) : [...p, code])} />
                  ))}
                </div>
              </CollapsibleSection>

              {/* ── Indian Airspace ── */}
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

              {/* ── Quick Insights ── */}
              <CollapsibleSection title="⚡  Quick Insights">
                <div className="flex flex-wrap gap-1.5">
                  <FilterTag label="✈️ In Air" count={filteredFlights.filter(f => f.status === 'In Air' || f.status === 'On Time').length} color="text-cyan-600 dark:text-cyan-400" bg="bg-cyan-100 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/15" />
                  <FilterTag label="⏳ Delayed" count={filteredFlights.filter(f => f.status === 'Delayed').length} color="text-amber-600 dark:text-amber-400" bg="bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/15" />
                  <FilterTag label="📍 Landing" count={filteredFlights.filter(f => f.status === 'Landing').length} color="text-orange-600 dark:text-orange-400" bg="bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/15" />
                  <FilterTag label="🛬 Ground" count={filteredFlights.filter(f => f.liveMetrics.altitude === 0).length} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/15" />
                </div>
              </CollapsibleSection>
            </>
          ) : (
            <>
              {/* ── Altitude & Speed ── */}
              <CollapsibleSection title="📊  Telemetry Range" defaultOpen>
                <div className="space-y-3 pt-1">
                  <RangeSlider label="Altitude" min={0} max={60000} value={altRange} onChange={(val: number[]) => setAltRange(val)} unit="ft" emoji="🏔️" />
                  <RangeSlider label="Speed" min={0} max={800} value={speedRange} onChange={(val: number[]) => setSpeedRange(val)} unit="kts" emoji="💨" />
                </div>
              </CollapsibleSection>

              {/* ── Map Intelligence Layers ── */}
              <CollapsibleSection title="🗺️  Map Intelligence" defaultOpen>
                <div className="space-y-0.5">
                  <ToggleSwitch label="Weather Radar" description="Monsoon & turbulence data" active={showWeather} onClick={() => setShowWeather(!showWeather)} icon={<Wind size={11} />} color="cyan" />
                  <ToggleSwitch label="FIR Boundaries" description="Indian ATC sectors" active={showATC} onClick={() => setShowATC(!showATC)} icon={<Crosshair size={11} />} color="amber" />
                  <ToggleSwitch label="Terrain Awareness" description="Himalayan corridor alerts" active={showTerrain} onClick={() => setShowTerrain(!showTerrain)} icon={<MapIcon size={11} />} color="emerald" />
                </div>
              </CollapsibleSection>

              {/* ── Data Source ── */}
              <CollapsibleSection title="📡  Data Source">
                <ToggleSwitch label="Live ADS-B Feed" description="OpenSky Network" active={useLiveData} onClick={() => setUseLiveData(!useLiveData)} icon={<Radio size={11} />} color="green" />
                <div className="mt-2 text-[8px] text-slate-400 dark:text-white/20 leading-relaxed px-1">
                  {useLiveData
                    ? '🟢 Streaming live ADS-B telemetry from Indian receivers'
                    : '⚪ Using simulated India-first flight data'
                  }
                </div>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderFlightMode = () => {
    if (!selectedFlight) return <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">No flight selected</div>;
    const vr = selectedFlight.liveMetrics.vertRate || 0;
    const vrLabel = vr > 50 ? 'CLIMBING' : vr < -50 ? 'DESCENDING' : 'LEVEL';
    const vrColor = vr > 50 ? 'text-emerald-600 dark:text-emerald-400' : vr < -50 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-gray-400';
    const statusColor = selectedFlight.status === 'On Time' ? 'bg-emerald-500' : selectedFlight.status === 'Delayed' ? 'bg-amber-500' : selectedFlight.status === 'In Air' ? 'bg-cyan-500' : 'bg-gray-500';

    return (
      <div className="flex flex-col min-h-0 animate-in fade-in duration-700">

        {/* ═══════════════════════════════════════════ */}
        {/* HERO: Cinematic Aircraft Banner */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative h-36 shrink-0 overflow-hidden rounded-t-xl group">
          <img
            src={flightImage || selectedFlight.aircraft.image}
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out"
            alt="Aircraft"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/60 to-transparent" />

          {/* Status Badges */}
          <div className="absolute top-2 left-2.5 flex items-center gap-1.5">
            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg shadow-red-500/20">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" /> LIVE
            </span>
            <span className={`${statusColor} backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg`}>
              {selectedFlight.status.toUpperCase()}
            </span>
          </div>

          {/* Flight Identity (Overlay) */}
          <div className="absolute bottom-0 inset-x-0 p-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[9px] text-cyan-400 font-semibold tracking-[0.2em] uppercase mb-0.5">{selectedFlight.airline}</div>
                <h1 className="text-2xl font-black text-white leading-none tracking-tight">{selectedFlight.flightNumber}</h1>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white/90 font-mono">{selectedFlight.aircraft.registration}</div>
                <div className="text-[8px] text-white/50 font-medium">{selectedFlight.aircraft.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* SCROLLABLE CONTENT */}
        {/* ═══════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gradient-to-b dark:from-[#0a0e1a] dark:to-[#080c16]">
          <div className="space-y-0">

            {/* ── HUMAN-READABLE FLIGHT STATUS ── */}
            {(() => {
              const phase = getFlightPhase(selectedFlight);
              const intel = getIndianAirspaceContext(selectedFlight);
              return (
                <div className="px-3.5 pt-3 pb-1.5">
                  <div className="bg-gradient-to-r from-cyan-500/[0.06] to-transparent border border-cyan-500/10 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="text-lg">{phase.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-bold ${phase.color}`}>{phase.humanLabel}</span>
                          <span className="text-[7px] text-slate-300 dark:text-white/20">•</span>
                          <span className="text-[8px] text-slate-400 dark:text-white/30 font-mono">{intel.fir.name}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 dark:text-white/45 leading-relaxed">
                          {intel.humanSummary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── ALERTS (if any) ── */}
            {(() => {
              const intel = getIndianAirspaceContext(selectedFlight);
              if (intel.alerts.length === 0) return null;
              return (
                <div className="px-3.5 pb-1.5">
                  <div className="space-y-1">
                    {intel.alerts.map((alert, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/10 rounded px-2 py-1.5">
                        <AlertTriangle size={9} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-[8px] text-amber-700/80 dark:text-amber-300/80">{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── ROUTE VISUAL ── */}
            <div className="px-3.5 py-3">
              <div className="flex items-center gap-5">
                {/* Origin */}
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{selectedFlight.origin.iata}</div>
                  <div className="text-[9px] text-slate-500 dark:text-white/40 truncate">{selectedFlight.origin.city}</div>
                  <div className="text-xs font-semibold text-cyan-500 dark:text-cyan-400 mt-1 tabular-nums">{selectedFlight.actualDep || selectedFlight.scheduledDep || '—'}</div>
                  {selectedFlight.flightInfo?.terminalOrigin && (
                    <div className="text-[8px] text-slate-400 dark:text-white/30 mt-0.5">T{selectedFlight.flightInfo.terminalOrigin} · Gate {selectedFlight.flightInfo.gateOrigin}</div>
                  )}
                </div>

                {/* Flight Progress */}
                <div className="flex-1 flex flex-col items-center px-2">
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                    <div className="flex-1 h-[2px] bg-slate-200 dark:bg-white/10 relative rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style={{ width: '65%' }} />
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/50 to-cyan-400/50 rounded-full animate-pulse" style={{ width: '65%' }} />
                    </div>
                    <div className="w-2 h-2 rounded-full border border-slate-300 dark:border-white/20" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Plane size={10} className="text-cyan-500 dark:text-cyan-400 -rotate-12" />
                    <span className="text-[9px] text-slate-400 dark:text-white/40 font-medium">EN ROUTE</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{selectedFlight.destination.iata}</div>
                  <div className="text-[9px] text-slate-500 dark:text-white/40 truncate">{selectedFlight.destination.city}</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-white/80 mt-1 tabular-nums">{selectedFlight.estArr || selectedFlight.scheduledArr || '—'}</div>
                  {selectedFlight.flightInfo?.terminalDest && (
                    <div className="text-[8px] text-slate-400 dark:text-white/30 mt-0.5">T{selectedFlight.flightInfo.terminalDest} · Gate {selectedFlight.flightInfo.gateDest}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* ── PRIMARY TELEMETRY ── */}
            <div className="px-3.5 py-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.04] hover:border-cyan-500/20 rounded-lg p-2.5 transition-all duration-300 group cursor-default">
                  <div className="text-[8px] text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400/60 transition-colors">Altitude</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums leading-none">{selectedFlight.liveMetrics.altitude.toLocaleString()}</div>
                  <div className="text-[8px] text-slate-400 dark:text-white/20 mt-0.5">ft · FL{Math.round(selectedFlight.liveMetrics.altitude / 100)}</div>
                </div>
                <div className="bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.04] hover:border-yellow-500/20 rounded-lg p-2.5 transition-all duration-300 group cursor-default">
                  <div className="text-[8px] text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400/60 transition-colors">GND Speed</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums leading-none">{selectedFlight.liveMetrics.groundSpeed}</div>
                  <div className="text-[8px] text-slate-400 dark:text-white/20 mt-0.5">kts</div>
                </div>
                <div className="bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.04] hover:border-purple-500/20 rounded-lg p-2.5 transition-all duration-300 group cursor-default">
                  <div className="text-[8px] text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400/60 transition-colors">Track</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums leading-none">{selectedFlight.liveMetrics.track || selectedFlight.liveMetrics.heading}°</div>
                  <div className="text-[8px] text-slate-400 dark:text-white/20 mt-0.5">mag</div>
                </div>
              </div>

              {/* Vertical Rate Ribbon */}
              <div className="mt-2 flex items-center gap-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] rounded-md px-2.5 py-1.5">
                <div className={`flex items-center gap-1 ${vrColor}`}>
                  {vr > 50 ? <ArrowUp size={12} /> : vr < -50 ? <ArrowDown size={12} /> : <ArrowUpRight size={12} className="rotate-90" />}
                  <span className="text-xs font-bold tabular-nums">{Math.abs(vr).toLocaleString()}</span>
                  <span className="text-[8px] text-slate-400 dark:text-white/30">fpm</span>
                </div>
                <div className={`text-[8px] font-bold uppercase tracking-widest ${vrColor}`}>{vrLabel}</div>
                <div className="flex-1" />
                <div className="text-[8px] text-slate-400 dark:text-white/20 font-medium font-mono">SQK {selectedFlight.liveMetrics.squawk}</div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* ── PERFORMANCE + ENVIRONMENT ── */}
            <div className="px-3.5 py-3">
              <div className="text-[8px] text-slate-500 dark:text-white/25 uppercase tracking-[0.2em] font-semibold mb-2">Performance & Environment</div>
              <div className="grid grid-cols-4 gap-x-3 gap-y-2">
                <DataCell label="Mach" value={`M${selectedFlight.liveMetrics.mach || '.78'}`} />
                <DataCell label="TAS" value={`${Math.round(selectedFlight.liveMetrics.tas || 0)}`} unit="kt" />
                <DataCell label="IAS" value={`${Math.round(selectedFlight.liveMetrics.ias || 0)}`} unit="kt" />
                <DataCell label="Roll" value={`${(selectedFlight.liveMetrics.roll || 0).toFixed(1)}°`} />
                <DataCell label="OAT" value={`${(selectedFlight.liveMetrics.oat || -45).toFixed(0)}°`} unit="C" />
                <DataCell label="Baro" value={`${(selectedFlight.liveMetrics.baro || 1013).toFixed(0)}`} unit="hPa" />
                <DataCell label="Wind" value={`${selectedFlight.liveMetrics.windDir || 0}°`} />
                <DataCell label="W/Spd" value={`${selectedFlight.liveMetrics.windSpeed || 0}`} unit="kt" />
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* ── INDIA-FIRST: OPERATIONAL INTELLIGENCE ── */}
            <div className="px-3.5 py-3">
              <div className="bg-gradient-to-br from-purple-500/[0.08] to-indigo-500/[0.04] border border-purple-500/10 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl" />

                <div className="flex items-center gap-1.5 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded bg-purple-500/20 flex items-center justify-center">
                    <Activity size={8} className="text-purple-400" />
                  </div>
                  <span className="text-[8px] text-purple-300/80 uppercase tracking-[0.15em] font-bold">Pilot Report — Indian Airspace</span>
                </div>

                <p className="text-[9px] text-slate-700 dark:text-white/55 leading-relaxed italic relative z-10 mb-2">
                  "{generatePilotReport(selectedFlight)}"
                </p>

                {(() => {
                  const intel = getIndianAirspaceContext(selectedFlight);
                  return (
                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-indigo-200/30 dark:border-white/[0.04] relative z-10">
                      <MapPin size={8} className="text-indigo-500 dark:text-indigo-400" />
                      <span className="text-[8px] text-slate-500 dark:text-white/45">
                        <span className="text-indigo-600 dark:text-indigo-300 font-semibold">{intel.fir.name}</span>
                        <span className="text-slate-300 dark:text-white/20 mx-1">·</span>
                        {intel.fir.center}
                        <span className="text-slate-300 dark:text-white/20 mx-1">·</span>
                        <span className="font-mono text-slate-400 dark:text-white/30">{intel.fir.freq}</span>
                      </span>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-5 relative z-10">
                  <div>
                    <div className="text-[7px] text-slate-400 dark:text-white/25 uppercase tracking-wider">Delay Risk</div>
                    <div className={`text-[10px] font-bold mt-0.5 ${getDelayRiskDetails(selectedFlight).riskColor}`}>{getDelayRiskDetails(selectedFlight).level}</div>
                  </div>
                  <div>
                    <div className="text-[7px] text-slate-400 dark:text-white/25 uppercase tracking-wider">Signal</div>
                    <div className="text-[10px] font-bold text-slate-600 dark:text-white/70 mt-0.5 flex items-center gap-1">
                      <Signal size={8} className="text-green-500 dark:text-green-400" /> {selectedFlight.liveMetrics.feederCount} feeders
                    </div>
                  </div>
                  <div>
                    <div className="text-[7px] text-slate-400 dark:text-white/25 uppercase tracking-wider">RSSI</div>
                    <div className="text-[10px] font-bold text-slate-600 dark:text-white/70 mt-0.5 font-mono">{selectedFlight.liveMetrics.rssi} dB</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* ── DESTINATION INTELLIGENCE ── */}
            {(() => {
              const destIntel = getDestinationIntel(selectedFlight.destination.iata);
              const congestionColors: Record<string, string> = {
                'Saturated': 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
                'High': 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20',
                'Moderate': 'text-amber-600 dark:text-yellow-400 bg-amber-100 dark:bg-yellow-500/10 border-amber-200 dark:border-yellow-500/20',
                'Low': 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
              };
              const cColor = congestionColors[destIntel.congestion] || congestionColors['Low'];
              return (
                <div className="px-3.5 py-3">
                  <div className="text-[8px] text-slate-400 dark:text-white/25 uppercase tracking-[0.15em] font-semibold mb-2 flex items-center gap-1.5">
                    <MapPin size={8} className="text-orange-500 dark:text-orange-400" /> {selectedFlight.destination.iata} — Arrival Intelligence
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${cColor}`}>
                        {destIntel.congestion}
                      </span>
                      <span className="text-[8px] text-slate-400 dark:text-white/30">congestion</span>
                    </div>
                    <p className="text-[9px] text-slate-500 dark:text-white/45 leading-relaxed">{destIntel.humanNote}</p>
                    {destIntel.notam && (
                      <div className="flex items-start gap-1.5 bg-amber-50 dark:bg-amber-500/[0.04] border border-amber-200 dark:border-amber-500/[0.08] rounded px-2 py-1.5">
                        <ShieldAlert size={8} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-[8px] text-amber-700/80 dark:text-amber-300/70">{destIntel.notam}</span>
                      </div>
                    )}
                    <div className="text-[8px] text-slate-400 dark:text-white/30 font-mono">{destIntel.rwyInfo}</div>
                  </div>
                </div>
              );
            })()}

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* ── AIRCRAFT & SERVICE ── */}
            <div className="px-3.5 py-3">
              <div className="text-[8px] text-slate-500 dark:text-white/25 uppercase tracking-[0.15em] font-semibold mb-2">Aircraft & Service</div>
              <div className="space-y-0">
                <InfoRow label="Registration" value={selectedFlight.aircraft.registration} mono />
                <InfoRow label="Type" value={selectedFlight.aircraft.type} />
                <InfoRow label="Age" value={selectedFlight.aircraft.age || 'N/A'} />
                <InfoRow label="Seats" value={`${selectedFlight.service?.seats || 180}`} />
                <InfoRow label="Classes" value={selectedFlight.service?.classes?.join(' / ') || 'Economy'} />
                <InfoRow label="Service" value={selectedFlight.service?.type || 'Passenger'} last />
              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="px-3.5 pb-3.5 pt-1.5 flex gap-2">
              <button className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5">
                Share
              </button>
              <button onClick={() => navigate(`/flights/${selectedFlight.id}`)} className="flex-1 py-2 bg-slate-100 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/80 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 flex items-center justify-center gap-1">
                Full Report <ArrowUpRight size={9} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative bg-slate-50 dark:bg-slate-950 overflow-hidden flex font-sans transition-colors duration-300">

      {/* --- MAP LAYER --- */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          ref={mapRef}
          interactive={true}
          flights={filteredFlights}
          onFlightClick={(id) => setSelectedFlightId(id)}
          selectedFlightId={selectedFlightId}
          showFIR={showATC}
          showTerrain={showTerrain}
          showHolding={showHolding}
          mapStyleUrl={MAP_STYLES[activeMapStyle].url}
          flightTrack={flightTrack}
        />
      </div>

      {/* --- LEFT DYNAMIC PANEL --- */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-3 top-20 z-20 w-[340px] max-h-[calc(100vh-96px)] pointer-events-auto"
      >

        {/* Collapsed — Floating Orbs (GPU-only: opacity + transform) */}
        <div
          className="absolute top-0 left-0 flex flex-col gap-2.5 will-change-[opacity,transform]"
          style={{
            opacity: isPanelCollapsed ? 1 : 0,
            transform: isPanelCollapsed ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.9)',
            transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: isPanelCollapsed ? 'auto' : 'none',
          }}
        >
          <button onClick={() => { setIsPanelCollapsed(false); setPanelMode('FILTER'); }} className="w-10 h-10 bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 group" title="Discover">
            <Globe size={16} />
          </button>
          <button onClick={() => { setIsPanelCollapsed(false); setPanelMode('FLIGHT'); }} className="w-10 h-10 bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-amber-500 dark:text-amber-400 hover:text-slate-900 dark:hover:text-white hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300 group" title="Flight">
            <Plane size={16} />
          </button>
          <button onClick={() => { setIsPanelCollapsed(false); setPanelMode('ANALYTICS'); }} className="w-10 h-10 bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-purple-500 dark:text-purple-400 hover:text-slate-900 dark:hover:text-white hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 group" title="Intelligence">
            <BarChart3 size={16} />
          </button>
        </div>

        {/* Expanded Panel (GPU-only: opacity + transform) */}
        <div
          className="flex flex-col w-full max-h-[calc(100vh-96px)] overflow-hidden bg-white/95 dark:bg-[#0c1020]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.07] rounded-xl shadow-xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] will-change-[opacity,transform]"
          style={{
            opacity: isPanelCollapsed ? 0 : 1,
            transform: isPanelCollapsed ? 'translateX(-12px) scale(0.97)' : 'translateX(0) scale(1)',
            transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: isPanelCollapsed ? 'none' : 'auto',
          }}
        >

          {/* Panel Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
            <div className="flex items-center gap-2">
              {panelMode !== 'FILTER' && (
                <button onClick={handleBackToFilter} className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
                  <ArrowLeft size={13} />
                </button>
              )}
              <div>
                <h2 className="text-[11px] font-bold text-slate-900 dark:text-white/90 flex items-center gap-1.5">
                  {panelMode === 'FILTER' && <><Globe size={12} className="text-cyan-600 dark:text-cyan-400" /> Indian Sky</>}
                  {panelMode === 'FLIGHT' && <><Plane size={12} className="text-amber-500 dark:text-amber-400" /> Flight Intelligence</>}
                  {panelMode === 'ANALYTICS' && <><Activity size={12} className="text-purple-600 dark:text-purple-400" /> Airspace Insights</>}
                </h2>
                <div className="text-[8px] text-slate-500 dark:text-white/25 tracking-wider mt-0.5">
                  {panelMode === 'FILTER' ? 'Discover & Filter' : panelMode === 'FLIGHT' ? 'Live Telemetry' : 'India Intelligence'}
                </div>
              </div>
            </div>

            <button onClick={() => setIsPanelCollapsed(true)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 dark:text-white/25 hover:text-slate-900 dark:hover:text-white/60 transition-all duration-300">
              <X size={13} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-3.5">
              {panelMode === 'FILTER' && renderFilterMode()}
              {panelMode === 'FLIGHT' && renderFlightMode()}
              {panelMode === 'ANALYTICS' && (
                <div className="space-y-3">
                  {/* India Airspace Health */}
                  <div className="bg-slate-50 dark:bg-gradient-to-br dark:from-purple-500/[0.06] dark:to-indigo-500/[0.03] border border-slate-200 dark:border-purple-500/10 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
                    <div className="flex items-center gap-1.5 mb-2.5 relative z-10">
                      <span className="text-sm">🇮🇳</span>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-white/80">Indian Airspace Health</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 relative z-10">
                      {[
                        { label: 'Delhi FIR', status: 'Normal', color: 'text-emerald-600 dark:text-emerald-400', icon: '🟢' },
                        { label: 'Mumbai FIR', status: 'Congested', color: 'text-amber-600 dark:text-amber-400', icon: '🟡' },
                        { label: 'Chennai FIR', status: 'Clear', color: 'text-emerald-600 dark:text-emerald-400', icon: '🟢' },
                        { label: 'Kolkata FIR', status: 'Normal', color: 'text-emerald-600 dark:text-emerald-400', icon: '🟢' },
                      ].map((fir) => (
                        <div key={fir.label} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] rounded-md p-2 shadow-sm dark:shadow-none">
                          <div className="text-[9px] text-slate-500 dark:text-white/50 font-medium">{fir.label}</div>
                          <div className={`text-[10px] font-bold ${fir.color} mt-0.5 flex items-center gap-1`}>
                            <span className="text-xs">{fir.icon}</span> {fir.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fleet Snapshot */}
                  <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-lg p-3">
                    <div className="text-[9px] text-slate-400 dark:text-white/40 font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Briefcase size={10} className="text-cyan-600 dark:text-cyan-400" /> Fleet Overview
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">{filteredFlights.length}</div>
                        <div className="text-[8px] text-slate-400 dark:text-white/30">Tracked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400 tabular-nums">{filteredFlights.filter(f => f.liveMetrics.altitude > 10000).length}</div>
                        <div className="text-[8px] text-slate-400 dark:text-white/30">Cruising</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-500 dark:text-amber-400 tabular-nums">{filteredFlights.filter(f => f.status === 'Delayed').length}</div>
                        <div className="text-[8px] text-slate-400 dark:text-white/30">Delayed</div>
                      </div>
                    </div>
                  </div>

                  {/* Intelligence Notes */}
                  <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-lg p-3">
                    <div className="text-[9px] text-slate-400 dark:text-white/40 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={10} className="text-amber-500 dark:text-amber-400" /> Operational Advisories
                    </div>
                    <div className="space-y-2">
                      {[
                        { text: 'Mumbai FIR experiencing higher sequencing delays due to monsoon approach patterns', icon: '🌧️' },
                        { text: 'Himalayan corridor (Leh-Srinagar) VFR restricted until 1400 IST', icon: '🏔️' },
                        { text: 'Delhi IGI T3 international gates congested — expect ground delays', icon: '✈️' },
                      ].map((note, i) => (
                        <div key={i} className="flex items-start gap-2 group">
                          <span className="text-xs mt-0.5 shrink-0">{note.icon}</span>
                          <p className="text-[9px] text-slate-500 dark:text-white/40 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-white/60 transition-colors duration-300">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Quality */}
                  <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-lg p-3">
                    <div className="text-[9px] text-slate-400 dark:text-white/40 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Signal size={10} className="text-green-500 dark:text-green-400" /> Receiver Health
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-1.5 bg-slate-200 dark:bg-white/[0.05] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '94%' }} />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">94%</span>
                    </div>
                    <div className="text-[8px] text-slate-400 dark:text-white/25 mt-1.5">Coverage across 48 Indian ADS-B receivers</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="h-6 border-t border-slate-200 dark:border-white/[0.04] flex items-center px-3 justify-between shrink-0 bg-slate-100 dark:bg-black/20">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] text-slate-500 dark:text-white/25 tracking-widest">ADS-B LIVE</span>
            </div>
            <div className="text-[7px] text-slate-400 dark:text-white/15 tracking-wider font-mono">
              48 receivers · 94% coverage
            </div>
          </div>
        </div>

      </div>

      {/* --- AEROSKY MAP CONTROLS --- */}
      <div className="absolute right-3 bottom-3 z-10 pointer-events-auto flex flex-col items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex flex-col bg-white/90 dark:bg-[#0c1020]/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <div className="h-px bg-slate-200 dark:bg-white/[0.07]" />
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
        </div>

        {/* Nav Controls */}
        <div className="flex flex-col bg-white/90 dark:bg-[#0c1020]/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.07] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => mapRef.current?.resetView()}
            className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-white/40 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all duration-300 border-b border-slate-200 dark:border-white/[0.05] group"
            title="Center on India"
          >
            <Navigation size={15} className="group-hover:scale-110 group-hover:-rotate-45 transition-all duration-300" />
          </button>
          <button
            onClick={() => {
              if (selectedFlight) mapRef.current?.flyToFlight(selectedFlight);
            }}
            className={`w-10 h-10 flex items-center justify-center transition-all duration-300 group ${selectedFlight
              ? 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white hover:bg-cyan-500/10'
              : 'text-slate-300 dark:text-white/15 cursor-not-allowed'
              }`}
            title={selectedFlight ? `Fly to ${selectedFlight.flightNumber}` : 'Select a flight'}
            disabled={!selectedFlight}
          >
            <Locate size={15} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Map Style Picker */}
        <div className="relative">
          {/* Style Options (expands upward) */}
          <div
            className="absolute bottom-full right-0 mb-1.5 will-change-[opacity,transform]"
            style={{
              opacity: isStylePickerOpen ? 1 : 0,
              transform: isStylePickerOpen ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
              transition: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isStylePickerOpen ? 'auto' : 'none',
            }}
          >
            <div className="bg-[#0c1020]/95 backdrop-blur-xl border border-white/[0.07] rounded-xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] min-w-[140px]">
              <div className="text-[7px] text-white/25 uppercase tracking-widest px-2 pt-1 pb-1.5">Base Map</div>
              {(Object.entries(MAP_STYLES) as [MapStyleId, typeof MAP_STYLES[MapStyleId]][]).map(([id, style]) => (
                <button
                  key={id}
                  onClick={() => { setActiveMapStyle(id); setIsStylePickerOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all duration-200 ${activeMapStyle === id
                    ? 'bg-cyan-500/15 text-cyan-400'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                >
                  <span className="text-sm">{style.icon}</span>
                  <span className="text-[10px] font-medium">{style.label}</span>
                  {activeMapStyle === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsStylePickerOpen(!isStylePickerOpen)}
            className={`w-10 h-10 bg-white/90 dark:bg-[#0c1020]/90 backdrop-blur-xl border rounded-xl flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${isStylePickerOpen
              ? 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
              : 'border-slate-200 dark:border-white/[0.07] text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/70 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            title="Map Style"
          >
            <Layers size={15} />
          </button>
        </div>
      </div>

    </div>
  );
};


// --- SUB COMPONENTS ---

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="pb-2 last:pb-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-white/50 py-1.5 hover:text-slate-800 dark:hover:text-white/70 transition-colors duration-300 group">
        <span className="group-hover:text-slate-900 dark:group-hover:text-white/80 transition-colors duration-300">{title}</span>
        <ChevronDown size={11} className={`text-slate-400 dark:text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {/* Grid-row trick: 0fr→1fr animates actual content height smoothly (no max-height jank) */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className={`transition-[margin] duration-300 ${isOpen ? 'mt-1.5' : 'mt-0'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterCheckbox: React.FC<{ label: string; code: string; checked: boolean; onChange: () => void; emoji?: string; subtitle?: string }> = ({ label, code, checked, onChange, emoji, subtitle }) => (
  <label className={`flex items-center gap-2.5 cursor-pointer group p-2 rounded-lg transition-all duration-300 ${checked ? 'bg-slate-100 dark:bg-white/[0.08] border border-slate-300 dark:border-white/20 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-transparent'}`}>
    <div className={`w-3.5 h-3.5 border rounded-[4px] flex items-center justify-center transition-all duration-300 shrink-0 ${checked ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.3)]' : 'border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-transparent group-hover:border-slate-400 dark:group-hover:border-white/30'}`}>
      {checked && <Check size={8} className="text-white dark:text-black" strokeWidth={4} />}
    </div>
    {emoji && <span className="text-xs shrink-0 drop-shadow-sm">{emoji}</span>}
    <div className="flex-1 min-w-0">
      <span className={`text-[10px] font-bold transition-colors duration-300 ${checked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white/90'}`}>{label}</span>
      {subtitle && <span className={`text-[8px] ml-1.5 ${checked ? 'text-slate-500 dark:text-white/40' : 'text-slate-400 dark:text-white/30 group-hover:text-slate-500 dark:group-hover:text-white/50'} transition-colors duration-300`}>· {subtitle}</span>}
    </div>
  </label>
);

const ToggleSwitch: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode; description?: string; color?: string }> = ({ label, active, onClick, icon, description, color = 'cyan' }) => {
  const colorMap: Record<string, string> = {
    cyan: active ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/20' : '',
    amber: active ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/20' : '',
    emerald: active ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : '',
    green: active ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20' : '',
  };
  const dotColor: Record<string, string> = {
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    green: 'bg-green-500',
  };
  return (
    <div onClick={onClick} className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer group transition-all duration-300 border ${active ? colorMap[color] : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03]'}`}>
      <div className="flex items-center gap-2.5">
        <div className={`p-1 rounded-md transition-all duration-300 ${active ? `${colorMap[color]}` : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-white/30'}`}>{icon}</div>
        <div>
          <span className={`text-[10px] font-medium transition-colors duration-300 block ${active ? 'text-slate-900 dark:text-white/90' : 'text-slate-500 dark:text-white/50 group-hover:text-slate-700 dark:group-hover:text-white/70'}`}>{label}</span>
          {description && <span className={`text-[8px] ${active ? 'text-slate-400 dark:text-white/30' : 'text-slate-300 dark:text-white/15'} transition-colors duration-300`}>{description}</span>}
        </div>
      </div>
      <div className={`w-7 h-3.5 rounded-full relative transition-all duration-300 ${active ? dotColor[color] : 'bg-slate-200 dark:bg-white/10'}`}>
        <div className={`absolute top-[3px] w-2 h-2 bg-white rounded-full transition-all duration-300 shadow-sm ${active ? 'left-[14px]' : 'left-[3px]'}`} />
      </div>
    </div>
  );
};

const RangeSlider = ({ label, min, max, value, onChange, unit, emoji }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-[9px] text-slate-500 dark:text-white/40 flex items-center gap-1">
        {emoji && <span className="text-xs">{emoji}</span>} {label}
      </span>
      <span className="text-[9px] text-cyan-600 dark:text-cyan-400/80 font-mono tabular-nums">{value[0].toLocaleString()} – {value[1].toLocaleString()} <span className="text-slate-300 dark:text-white/20">{unit}</span></span>
    </div>
    <input type="range" min={min} max={max} value={value[1]} onChange={(e) => onChange([value[0], Number(e.target.value)])} className="w-full h-1 bg-slate-200 dark:bg-white/[0.06] rounded-full appearance-none cursor-pointer accent-cyan-500 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(6,182,212,0.4)] [&::-webkit-slider-thumb]:appearance-none" />
  </div>
);

const FilterTag = ({ label, count, color, bg }: any) => (
  <div className={`px-2.5 py-1.5 ${bg || 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.05]'} border rounded-lg text-[9px] font-medium text-slate-500 dark:text-white/60 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/[0.06] cursor-pointer transition-all duration-300 group`}>
    <span className="group-hover:text-slate-800 dark:group-hover:text-white/80 transition-colors duration-300">{label}</span>
    <span className={`${color} font-mono font-bold text-[10px] tabular-nums`}>{count}</span>
  </div>
);

const TelemetryBox = ({ label, value, unit }: any) => (
  <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] p-2 rounded-lg flex flex-col items-center">
    <span className="text-[7px] text-slate-400 dark:text-white/25 uppercase tracking-widest mb-0.5">{label}</span>
    <span className="text-[11px] font-bold text-slate-800 dark:text-white/80 font-mono">{value} <span className="text-[7px] font-normal text-slate-300 dark:text-white/25">{unit}</span></span>
  </div>
);

const ControlButton: React.FC<{ icon: React.ReactNode; active?: boolean }> = ({ icon, active }) => (
  <button className={`p-2 rounded-lg backdrop-blur-md shadow-lg border transition-all duration-300 ${active ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/90 dark:bg-[#0c1020]/90 text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/[0.07] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'}`}>
    {icon}
  </button>
);

const TelemetryCard = ({ label, value, unit, icon, color = 'text-white', subValue, font = 'font-sans', dim }: any) => (
  <div className={`bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] p-2.5 rounded-lg flex flex-col justify-between h-16 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 ${dim ? 'opacity-60 hover:opacity-100' : ''}`}>
    <div className="flex justify-between items-start z-10">
      <span className="text-[8px] text-slate-400 dark:text-white/25 uppercase tracking-widest">{label}</span>
      <div className="text-slate-300 dark:text-white/15 group-hover:text-slate-500 dark:group-hover:text-white/30 transition-colors duration-300">{icon}</div>
    </div>
    <div className="z-10">
      <div className={`text-base font-bold ${color} ${font} tracking-tight leading-none`}>
        {value} <span className="text-[8px] font-normal text-slate-300 dark:text-white/25 ml-0.5">{unit}</span>
      </div>
      {subValue && <div className="text-[7px] font-bold text-slate-300 dark:text-white/25 mt-0.5 uppercase tracking-wider">{subValue}</div>}
    </div>
  </div>
);

const DataCell = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
  <div className="group cursor-default">
    <div className="text-[7px] text-slate-500 dark:text-white/25 uppercase tracking-wider mb-0.5 group-hover:text-slate-700 dark:group-hover:text-white/40 transition-colors duration-300">{label}</div>
    <div className="text-[11px] font-semibold text-slate-900 dark:text-white/80 tabular-nums group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
      {value}{unit && <span className="text-[8px] text-slate-400 dark:text-white/25 ml-0.5 font-normal">{unit}</span>}
    </div>
  </div>
);

const InfoRow = ({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) => (
  <div className={`flex items-start justify-between py-1.5 ${!last ? 'border-b border-slate-100 dark:border-white/[0.04]' : ''} group hover:bg-slate-50 dark:hover:bg-white/[0.02] -mx-1 px-1 rounded transition-colors duration-300 cursor-default`}>
    <span className="text-[9px] text-slate-500 dark:text-white/30 uppercase tracking-wider mt-0.5 shrink-0">{label}</span>
    <span className={`text-[10px] font-semibold text-slate-700 dark:text-white/80 ${mono ? 'font-mono' : ''} text-right leading-tight max-w-[70%]`}>{value}</span>
  </div>
);

export default LiveMap;