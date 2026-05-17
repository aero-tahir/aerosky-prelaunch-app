import React, { useMemo, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Flight } from '@/types';
import {
  Plus, Minus, Layers, LocateFixed, Moon, Globe, MapIcon, Navigation2, TowerControl
} from 'lucide-react';
import {
  OLA_API_KEY,
  OLA_MAP_STYLES,
  INDIA_CENTER,
  INDIA_BOUNDS,
  PLANE_SVG_PATH,
  PLANE_COLORS,
  getPlaneColor,
  normalizeHeading,
  olaTransformRequest,
} from '@/lib/mapConstants';
import { FIR_BOUNDARIES, TERRAIN_BLIND_SPOTS, HOLDING_STACKS, AERO_CHARTS, AIRPORTS } from '@/data/navigationLayers';

export interface MapControls {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  flyToFlight: (flight: Flight) => void;
  getZoom: () => number;
}

interface MapComponentProps {
  flights: Flight[];
  onFlightClick?: (flightId: string) => void;
  onAirportClick?: (airportCode: string) => void;
  onMapClick?: () => void;
  selectedFlightId?: string | null;
  interactive?: boolean;
  showFIR?: boolean;
  showTerrain?: boolean;
  showHolding?: boolean;
  mapStyleUrl?: string;
  flightTrack?: any[] | null;
  showAeroCharts?: boolean;
  showAirportPins?: boolean;
  showAirportLabels?: boolean;
  showAircraftLabels?: boolean;
  mapBrightness?: number;
  activeMapStyle?: 'dark' | 'satellite' | 'street' | 'vector';
  onStyleChange?: (style: 'dark' | 'satellite' | 'street' | 'vector') => void;
  hideControls?: boolean;
}

/* ─── Plane SVG marker component ─── */
const PlaneSVGMarker: React.FC<{
  flight: Flight;
  isSelected: boolean;
  onClick?: () => void;
}> = ({ flight, isSelected, onClick }) => {
  const color = getPlaneColor(flight, isSelected);
  const rotation = normalizeHeading(flight.liveMetrics.heading || 0);
  const size = isSelected ? 28 : 20;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      role="button"
      tabIndex={0}
      aria-label={`Flight ${flight.flightNumber}: ${flight.airline}, ${flight.status}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className={`cursor-pointer transition-all duration-300 focus-ring rounded-full ${isSelected ? 'z-50 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'z-10 drop-shadow-md hover:scale-110'}`}
      style={{ width: size, height: size }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <path d={PLANE_SVG_PATH} fill={color} transform={`rotate(${rotation} 16 16)`} />
      </svg>
    </div>
  );
};

const MapComponent = forwardRef<MapControls, MapComponentProps>(({
  flights,
  onFlightClick,
  onAirportClick,
  onMapClick,
  selectedFlightId,
  interactive = true,
  showFIR = false,
  showTerrain = false,
  showHolding = false,
  showAeroCharts = false,
  showAirportPins = false,
  showAirportLabels = false,
  showAircraftLabels = false,
  mapBrightness = 100,
  activeMapStyle = 'dark',
  onStyleChange,
  hideControls = false,
  mapStyleUrl,
  flightTrack
}, ref) => {
  const mapRef = useRef<MapRef>(null);
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);

  const finalMapStyle = useMemo(() => {
    if (mapStyleUrl) return mapStyleUrl;
    if (activeMapStyle === 'satellite') return OLA_MAP_STYLES.satellite;
    if (activeMapStyle === 'street') return OLA_MAP_STYLES.light;
    if (activeMapStyle === 'vector') return OLA_MAP_STYLES.hybrid;
    return OLA_MAP_STYLES.dark;
  }, [mapStyleUrl, activeMapStyle]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => { const m = mapRef.current; if (m) m.flyTo({ center: m.getCenter(), zoom: (m.getZoom() || 4) + 1, duration: 400 }); },
    zoomOut: () => { const m = mapRef.current; if (m) m.flyTo({ center: m.getCenter(), zoom: Math.max((m.getZoom() || 4) - 1, 1), duration: 400 }); },
    resetView: () => { mapRef.current?.flyTo({ center: [INDIA_CENTER.lng, INDIA_CENTER.lat], zoom: INDIA_CENTER.zoom, duration: 1200 }); },
    flyToFlight: (flight: Flight) => { mapRef.current?.flyTo({ center: [flight.liveMetrics.lng, flight.liveMetrics.lat], zoom: 8, duration: 1000 }); },
    getZoom: () => mapRef.current?.getZoom() ?? INDIA_CENTER.zoom,
  }));

  /* ── Flight path GeoJSON (always present, data updates reactively) ── */
  const EMPTY_LINE: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

  const flightPathData = useMemo<GeoJSON.FeatureCollection>(() => {
    const flight = flights.find(f => f.id === selectedFlightId);
    if (!flight) return EMPTY_LINE;

    const start: [number, number] = [flight.origin.lng, flight.origin.lat];
    const current: [number, number] = [flight.liveMetrics.lng, flight.liveMetrics.lat];

    let flownCoords: [number, number][];
    if (flightTrack && flightTrack.length >= 2) {
      flownCoords = flightTrack.map(p => [p[2], p[1]] as [number, number]);
    } else {
      flownCoords = [start, current];
    }

    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { lineType: 'flown' },
        geometry: { type: 'LineString', coordinates: flownCoords }
      }]
    };
  }, [flights, selectedFlightId, flightTrack]);

  const projectedPathData = useMemo<GeoJSON.FeatureCollection>(() => {
    const flight = flights.find(f => f.id === selectedFlightId);
    if (!flight) return EMPTY_LINE;

    const current: [number, number] = [flight.liveMetrics.lng, flight.liveMetrics.lat];
    const dest: [number, number] = [flight.destination.lng, flight.destination.lat];

    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { lineType: 'projected' },
        geometry: { type: 'LineString', coordinates: [current, dest] }
      }]
    };
  }, [flights, selectedFlightId]);

  const hasTrack = !!(flightTrack && flightTrack.length >= 2);
  const flownLineColor = hasTrack ? '#00f0ff' : '#ef4444';
  const flownLineWidth = hasTrack ? 4 : 3;


  // Memoized plane markers using custom SVG
  const markers = useMemo(() => {
    return flights.map(flight => (
      <Marker
        key={flight.id}
        longitude={flight.liveMetrics.lng}
        latitude={flight.liveMetrics.lat}
        anchor="center"
      >
        <PlaneSVGMarker
          flight={flight}
          isSelected={selectedFlightId === flight.id}
          onClick={() => onFlightClick?.(flight.id)}
        />
      </Marker>
    ));
  }, [flights, selectedFlightId, onFlightClick]);

  // Airport markers as HTML overlays (visible only at zoom >= 6)
  const [currentZoom, setCurrentZoom] = useState<number>(INDIA_CENTER.zoom);

  const airportMarkers = useMemo(() => {
    if (!showAirportPins || currentZoom < 5) return null;
    return (AIRPORTS as any).features.map((feature: any) => (
      <Marker
        key={feature.properties.iata}
        longitude={feature.geometry.coordinates[0]}
        latitude={feature.geometry.coordinates[1]}
        anchor="center"
      >
        <div
          className="group cursor-pointer flex flex-col items-center"
          onClick={(e) => { e.stopPropagation(); onAirportClick?.(feature.properties.iata); }}
          role="button"
          tabIndex={0}
          aria-label={`Airport ${feature.properties.iata}`}
          onKeyDown={(e) => { if (e.key === 'Enter') onAirportClick?.(feature.properties.iata); }}
        >
          {/* Airport icon in circle */}
          <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_6px_rgba(59,130,246,0.4)] group-hover:scale-125 transition-transform flex items-center justify-center">
            <TowerControl size={12} className="text-white" strokeWidth={2.5} />
          </div>
          {/* Label */}
          {showAirportLabels && (
            <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono font-bold text-blue-300 leading-none whitespace-nowrap shadow-lg border border-white/10">
              {feature.properties.iata}
            </span>
          )}
        </div>
      </Marker>
    ));
  }, [showAirportPins, showAirportLabels, onAirportClick, currentZoom]);

  return (
    <div className="w-full h-full relative" onClick={(e) => {
      const t = e.target as HTMLElement;
      if (t.closest('button') || t.closest('[role="button"]') || t.closest('.maplibregl-ctrl')) return;
      onMapClick?.();
    }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: INDIA_CENTER.lng,
          latitude: INDIA_CENTER.lat,
          zoom: INDIA_CENTER.zoom,
        }}
        maxBounds={[INDIA_BOUNDS.southwest, INDIA_BOUNDS.northeast]}
        minZoom={3}
        maxZoom={18}
        style={{ width: '100%', height: '100%' }}
        mapStyle={finalMapStyle}
        attributionControl={false}
        interactive={interactive}
        transformRequest={olaTransformRequest}
        onClick={(e) => {
          // Only handle if no features clicked (airport clicks handled by Marker onClick)
        }}
        onZoom={(e) => setCurrentZoom(e.viewState.zoom)}
        onError={(e) => {
          console.error("[MapComponent] Map Error:", e);
        }}
      >
        {/* --- LAYERS --- */}

        {/* 1. Terrain / Blind Spots */}
        {showTerrain && (
          <Source id="terrain-source" type="geojson" data={TERRAIN_BLIND_SPOTS as any}>
            <Layer
              id="terrain-fill"
              type="fill"
              paint={{
                'fill-color': '#450a0a',
                'fill-opacity': 0.3
              }}
            />
            <Layer
              id="terrain-outline"
              type="line"
              paint={{
                'line-color': '#ef4444',
                'line-width': 1,
                'line-dasharray': [4, 2],
                'line-opacity': 0.6
              }}
            />
          </Source>
        )}

        {/* 2. FIR Boundaries */}
        {showFIR && (
          <Source id="fir-source" type="geojson" data={FIR_BOUNDARIES as any}>
            <Layer
              id="fir-lines"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2.5,
                'line-opacity': 0.9
              }}
            />
          </Source>
        )}

        {/* 3. Holding Stacks */}
        {showHolding && (
          <Source id="holding-source" type="geojson" data={HOLDING_STACKS as any}>
            <Layer
              id="holding-circles"
              type="circle"
              paint={{
                'circle-radius': 35,
                'circle-color': '#EF4444',
                'circle-opacity': 0.4,
                'circle-blur': 0.6
              }}
            />
          </Source>
        )}

        {/* 4. Aeronautical Charts (Vector Sectors) */}
        {showAeroCharts && (
          <Source id="aero-charts-source" type="geojson" data={AERO_CHARTS as any}>
            <Layer
              id="aero-charts-lines"
              type="line"
              paint={{
                'line-color': '#06b6d4',
                'line-width': 1,
                'line-opacity': 0.4,
                'line-dasharray': [2, 1]
              }}
            />
          </Source>
        )}

        {/* 5. Brightness / Day-Night Mask */}
        {mapBrightness < 100 && (
          <Layer
            id="brightness-mask"
            type="background"
            paint={{
              'background-color': '#000000',
              'background-opacity': (100 - mapBrightness) / 100
            }}
          />
        )}

        {/* 6. Airport Pins & Labels — rendered as HTML Markers above */}

        {/* 7. Flight Path — always mounted, data updates reactively */}
        <Source id="aero-flown-path" type="geojson" data={flightPathData}>
          <Layer
            id="aero-flown-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': flownLineColor,
              'line-width': flownLineWidth,
              'line-opacity': 0.9,
            }}
          />
        </Source>
        <Source id="aero-proj-path" type="geojson" data={projectedPathData}>
          <Layer
            id="aero-proj-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#ffffff',
              'line-width': 2,
              'line-dasharray': [2, 4],
              'line-opacity': 0.5,
            }}
          />
        </Source>

        {/* Airport markers (HTML overlays - below aircraft) */}
        {airportMarkers}

        {/* Aircraft markers (HTML overlays - always on top) */}
        {markers}

        {/* User Location Marker */}
        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
            <div className="relative flex items-center justify-center" aria-label="Your location">
              <div className="absolute w-10 h-10 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute w-6 h-6 rounded-full bg-blue-500/25" />
              <div className="relative w-3.5 h-3.5 rounded-full bg-blue-500 border-[2.5px] border-white shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
            </div>
          </Marker>
        )}
      </Map>

      {/* ═══ MAP CONTROLS (bottom-right) ═══ */}
      {interactive && (
        <div className={`hidden sm:flex absolute bottom-20 right-4 z-30 items-end gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hideControls
            ? 'translate-x-20 opacity-0 pointer-events-none'
            : 'translate-x-0 opacity-100'
        }`}>

          {/* Layer picker — to the LEFT of control buttons */}
          {showLayerPicker && (
            <div className="relative dock-noise bg-white/65 dark:bg-[rgb(20,25,35)]/80 backdrop-blur-[16px] dark:backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_12px_40px_rgba(0,0,0,0.35)] p-1.5 w-[130px]">
              <div className="absolute inset-0 rounded-[20px] pointer-events-none bg-gradient-to-b from-white/30 via-blue-50/20 to-white/30 dark:from-blue-900/20 dark:via-slate-800/10 dark:to-blue-900/20" />
              {([
                { id: 'dark' as const, label: 'Dark', icon: <Moon size={14} /> },
                { id: 'satellite' as const, label: 'Satellite', icon: <Globe size={14} /> },
                { id: 'street' as const, label: 'Streets', icon: <MapIcon size={14} /> },
                { id: 'vector' as const, label: 'Terrain', icon: <Navigation2 size={14} /> },
              ]).map(s => (
                <button
                  key={s.id}
                  onClick={() => { onStyleChange?.(s.id); setShowLayerPicker(false); }}
                  className={`relative z-10 w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[10px] font-bold transition-all duration-[180ms] ease-out ${
                    activeMapStyle === s.id
                      ? 'bg-cyan-500/15 dark:bg-cyan-400/15 text-cyan-600 dark:text-cyan-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Control buttons */}
          <div className="relative dock-noise flex flex-col bg-white/65 dark:bg-[rgb(20,25,35)]/80 backdrop-blur-[16px] dark:backdrop-blur-[20px] border border-white/40 dark:border-white/[0.08] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="absolute inset-0 rounded-[20px] pointer-events-none bg-gradient-to-b from-white/30 via-blue-50/20 to-white/30 dark:from-blue-900/20 dark:via-slate-800/10 dark:to-blue-900/20" />
            <button
              onClick={() => { const m = mapRef.current; if (m) m.flyTo({ center: m.getCenter(), zoom: (m.getZoom() || 4) + 1, duration: 400 }); }}
              className="relative z-10 p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/[0.06] transition-all duration-[180ms] ease-out border-b border-white/30 dark:border-white/[0.06]"
              aria-label="Zoom in"
            >
              <Plus size={18} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => { const m = mapRef.current; if (m) m.flyTo({ center: m.getCenter(), zoom: Math.max((m.getZoom() || 4) - 1, 1), duration: 400 }); }}
              className="relative z-10 p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/[0.06] transition-all duration-[180ms] ease-out border-b border-white/30 dark:border-white/[0.06]"
              aria-label="Zoom out"
            >
              <Minus size={18} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setShowLayerPicker(p => !p)}
              className={`relative z-10 p-2.5 transition-all duration-[180ms] ease-out border-b border-white/30 dark:border-white/[0.06] ${
                showLayerPicker
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 dark:bg-cyan-400/15'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/[0.06]'
              }`}
              aria-label="Base layers"
            >
              <Layers size={18} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => {
                if (!('geolocation' in navigator)) return;
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const loc = { lng: pos.coords.longitude, lat: pos.coords.latitude };
                    setUserLocation(loc);
                    const m = mapRef.current;
                    if (m) {
                      m.flyTo({ center: [loc.lng, loc.lat], zoom: 12, duration: 2000 });
                    }
                  },
                  (err) => { console.warn('Geolocation error:', err.message); },
                  { enableHighAccuracy: true, timeout: 10000 }
                );
              }}
              className={`relative z-10 p-2.5 transition-all duration-[180ms] ease-out ${
                userLocation
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/[0.06]'
              }`}
              aria-label="My location"
            >
              <LocateFixed size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

MapComponent.displayName = 'MapComponent';
export default MapComponent;
