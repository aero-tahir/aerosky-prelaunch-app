import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { Plane, Radar, Settings, Globe, CloudSun, History, LayoutDashboard } from 'lucide-react';
import { FLIGHTS as MOCK_FLIGHTS } from '@/data/mockData';
import { generateFallbackFlights } from '@/data/fallbackFlights';
import { PlanespottersService } from '@/services/PlanespottersService';
import IntelligenceDock, { DockMode } from '@/components/panels/IntelligenceDock';
import DynamicWidgetPanel from '@/components/panels/DynamicWidgetPanel';
import { useTheme } from '@/contexts/ThemeContext';
import FlightIntelligenceCard from '@/components/panels/FlightIntelligenceCard';
import TrafficFilterPanel from '@/components/panels/TrafficFilterPanel';
import LayersPanel from '@/components/panels/LayersPanel';
import SettingsPanel from '@/components/panels/SettingsPanel';
import WeatherPanel from '@/components/panels/WeatherPanel';
import WidgetsPanel from '@/components/panels/WidgetsPanel';
import PlaybackPanel from '@/components/panels/PlaybackPanel';
import type { LayerConfig } from '@/components/panels/LayersPanel';
import type { WidgetConfig } from '@/components/panels/WidgetsPanel';
import type { Flight } from '@/types';

const MapComponent = lazy(() => import('@/components/map/MapComponent'));
const useSmoothFlights = (flights: Flight[], _interval: number) => flights;

/* ── Panel metadata ── */
const PANEL_META: Record<string, { title: string; subtitle: string; icon: React.ReactNode }> = {
  FILTER: { title: 'Live Traffic Intelligence', subtitle: 'India-first smart airspace filtering', icon: <Radar size={18} /> },
  LAYERS: { title: 'Airspace Intelligence', subtitle: 'India-first airspace awareness & control', icon: <Globe size={18} /> },
  SETTINGS: { title: 'Control Center', subtitle: 'Trust, experience & sovereignty', icon: <Settings size={18} /> },
  WEATHER: { title: 'Weather Intelligence', subtitle: 'Aviation weather & airspace impact', icon: <CloudSun size={18} /> },
  WIDGETS: { title: 'Flight Deck Instruments', subtitle: 'Control what you see — right now', icon: <LayoutDashboard size={18} /> },
  PLAYBACK: { title: 'Airspace Time Machine', subtitle: 'Rewind & replay Indian airspace', icon: <History size={18} /> },
  FLIGHT: { title: 'Flight Intelligence', subtitle: 'Target Analysis', icon: <Plane size={18} /> },
};

const LiveMap: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => { document.title = 'Live Map Intelligence | AeroSky'; }, []);

  /* ── Dock ── */
  const [activeDockMode, setActiveDockMode] = useState<DockMode>(null);

  /* ── Map config ── */
  const [layerConfig, setLayerConfig] = useState<LayerConfig>({
    showFIR: true, showTerrain: false, showHolding: true, showAeroCharts: false,
    showAirportPins: true, showAirportLabels: true, showAircraftLabels: true, mapBrightness: 100,
  });
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    showTelemetry: true, showCompass: true, showMiniMap: false,
    showWeatherLegend: false, showNetworkStatus: true, showSignalConfidence: true,
  });
  const [activeMapStyle, setActiveMapStyle] = useState<'dark' | 'satellite' | 'street' | 'vector'>(() =>
    localStorage.getItem('theme') === 'light' ? 'street' : 'dark'
  );
  useEffect(() => {
    setActiveMapStyle(prev => {
      if (theme === 'light' && prev === 'dark') return 'street';
      if (theme === 'dark' && prev === 'street') return 'dark';
      return prev;
    });
  }, [theme]);

  /* ── Flight selection ── */
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [flightImage, setFlightImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFlightId) setActiveDockMode('FLIGHT');
    else if (activeDockMode === 'FLIGHT') setActiveDockMode(null);
  }, [selectedFlightId]);

  /* ── Filters ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [altRange, setAltRange] = useState([0, 60000]);
  const [speedRange, setSpeedRange] = useState([0, 800]);
  const [activeAirlines, setActiveAirlines] = useState<string[]>([]);
  const [activeFIRs, setActiveFIRs] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);

  /* ── Data ── */
  const allFlights = useMemo(() => [...MOCK_FLIGHTS, ...generateFallbackFlights()], []);

  const rawFiltered = useMemo(() => allFlights.filter(f => {
    const q = searchQuery.toUpperCase();
    if (q && ![f.flightNumber, f.airline, f.airlineCode, f.origin.iata, f.destination.iata, f.aircraft.registration]
      .some(s => s.toUpperCase().includes(q))) return false;
    if (f.liveMetrics.altitude < altRange[0] || f.liveMetrics.altitude > altRange[1]) return false;
    if (f.liveMetrics.groundSpeed < speedRange[0] || f.liveMetrics.groundSpeed > speedRange[1]) return false;
    if (activeAirlines.length && !activeAirlines.includes(f.airlineCode)) return false;
    if (activeTypes.length) {
      const cat = (f.aircraft.category || f.service?.type || 'Passenger').toLowerCase();
      if (!activeTypes.some(t => cat.includes(t.toLowerCase()))) return false;
    }
    if (activeStatuses.length && !activeStatuses.includes(f.status)) return false;
    return true;
  }), [searchQuery, altRange, speedRange, activeAirlines, activeTypes, activeStatuses, allFlights]);

  const filteredFlights = useSmoothFlights(rawFiltered, 60000);
  const selectedFlight = useMemo(() => allFlights.find(f => f.id === selectedFlightId), [selectedFlightId, allFlights]);

  useEffect(() => {
    setFlightImage(null);
    if (!selectedFlight) return;
    const reg = selectedFlight.aircraft.registration;
    if (reg && reg !== 'N/A') PlanespottersService.fetchPhoto(reg).then(url => { if (url) setFlightImage(url); });
  }, [selectedFlight?.id]);

  /* ── Panel meta ── */
  const meta = PANEL_META[activeDockMode || 'FILTER'];

  return (
    <div className={`relative w-full h-[100dvh] bg-slate-50 dark:bg-[#0c1020] overflow-hidden flex font-sans selection:bg-cyan-500/30`}>

      {/* ═══ MAP AREA (takes remaining space) ═══ */}
      <div className="flex-1 relative flex flex-col min-w-0">
        <div className="flex-1 relative">
          <Suspense fallback={<div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center text-slate-400 dark:text-white/20 italic">Loading Aeronautical Charts...</div>}>
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
              onStyleChange={setActiveMapStyle}
            />
          </Suspense>

          <IntelligenceDock activeMode={activeDockMode} onModeChange={setActiveDockMode} />

          <DynamicWidgetPanel
            isOpen={activeDockMode !== null}
            onClose={() => setActiveDockMode(null)}
            width={340}
            title={activeDockMode === 'FLIGHT' ? (selectedFlight?.flightNumber || meta.title) : meta.title}
            subtitle={activeDockMode === 'FLIGHT' ? (selectedFlight?.airline || meta.subtitle) : meta.subtitle}
            icon={meta.icon}
          >
            {activeDockMode === 'FILTER' && (
              <TrafficFilterPanel
                flightCount={filteredFlights.length}
                searchQuery={searchQuery} onSearchChange={setSearchQuery}
                activeAirlines={activeAirlines} onAirlinesChange={setActiveAirlines}
                activeFIRs={activeFIRs} onFIRsChange={setActiveFIRs}
                activeTypes={activeTypes} onTypesChange={setActiveTypes}
                activeStatuses={activeStatuses} onStatusesChange={setActiveStatuses}
                altRange={altRange} onAltRangeChange={setAltRange}
                speedRange={speedRange} onSpeedRangeChange={setSpeedRange}
              />
            )}
            {activeDockMode === 'LAYERS' && (
              <LayersPanel layerConfig={layerConfig} onLayerChange={setLayerConfig} activeMapStyle={activeMapStyle} onStyleChange={setActiveMapStyle} />
            )}
            {activeDockMode === 'SETTINGS' && <SettingsPanel theme={theme} toggleTheme={toggleTheme} />}
            {activeDockMode === 'WEATHER' && <WeatherPanel />}
            {activeDockMode === 'WIDGETS' && <WidgetsPanel config={widgetConfig} onChange={setWidgetConfig} />}
            {activeDockMode === 'PLAYBACK' && <PlaybackPanel />}
            {activeDockMode === 'FLIGHT' && <FlightIntelligenceCard flight={selectedFlight} flightImage={flightImage} />}
          </DynamicWidgetPanel>
        </div>
      </div>

    </div>
  );
};

export default LiveMap;
