import React, { useMemo, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Flight } from '../types';
import { FIR_BOUNDARIES, TERRAIN_BLIND_SPOTS, HOLDING_STACKS } from '../utils/navigationLayers';

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
  selectedFlightId?: string | null;
  interactive?: boolean;
  showFIR?: boolean;
  showTerrain?: boolean;
  showHolding?: boolean;
  mapStyleUrl?: string;
  flightTrack?: any[] | null;
}

/* ─── Ola Maps Configuration ─── */
const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || 'dSpdveDyWcUJ4q2XAnRuweHDDnim2xnv0BFR73kQ';
const OLA_MAPS_STYLE = `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json?api_key=${OLA_API_KEY}`;

/* ─── Plane SVG from public/assets/plane.svg ─── */
const PLANE_SVG_PATH = 'M9.123 30.464l-1.33-6.268-6.318-1.397 1.291-2.475 5.785-0.316c0.297-0.386 0.96-1.234 1.374-1.648l5.271-5.271-10.989-5.388 2.782-2.782 13.932 2.444 4.933-4.933c0.585-0.585 1.496-0.894 2.634-0.894 0.776 0 1.395 0.143 1.421 0.149l0.3 0.070 0.089 0.295c0.469 1.55 0.187 3.298-0.67 4.155l-4.956 4.956 2.434 13.875-2.782 2.782-5.367-10.945-4.923 4.924c-0.518 0.517-1.623 1.536-2.033 1.912l-0.431 5.425-2.449 1.329z';

const PLANE_COLORS = {
  default: '#FACC15',  // Yellow — normal
  alert: '#FF9933',    // Orange — squawk / event
  selected: '#EF4444', // Red — clicked
} as const;

/* ─── Get plane color based on flight state ─── */
const getPlaneColor = (flight: Flight, isSelected: boolean): string => {
  if (isSelected) return PLANE_COLORS.selected;
  const squawk = flight.liveMetrics?.squawk;
  if (squawk === '7500' || squawk === '7600' || squawk === '7700') return PLANE_COLORS.alert;
  if (flight.status === 'Delayed' || flight.status === 'Diverted') return PLANE_COLORS.alert;
  return PLANE_COLORS.default;
};

/* ─── Plane SVG marker component ─── */
const PlaneSVGMarker: React.FC<{
  flight: Flight;
  isSelected: boolean;
  onClick?: () => void;
}> = ({ flight, isSelected, onClick }) => {
  const color = getPlaneColor(flight, isSelected);
  const heading = flight.liveMetrics.heading || 0;
  const rotation = (heading + 135) % 360; // normalize SVG to north-up
  const size = isSelected ? 28 : 20;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className={`cursor-pointer transition-all duration-300 ${isSelected ? 'z-50 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'z-10 drop-shadow-md hover:scale-110'}`}
      style={{ width: size, height: size }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32">
        <path d={PLANE_SVG_PATH} fill={color} transform={`rotate(${rotation} 16 16)`} />
      </svg>
    </div>
  );
};

const MapComponent = forwardRef<MapControls, MapComponentProps>(({
  flights,
  onFlightClick,
  selectedFlightId,
  interactive = true,
  showFIR = false,
  showTerrain = false,
  showHolding = false,
  mapStyleUrl,
  flightTrack
}, ref) => {
  const mapRef = useRef<MapRef>(null);

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.getMap()?.zoomIn({ duration: 300 }),
    zoomOut: () => mapRef.current?.getMap()?.zoomOut({ duration: 300 }),
    resetView: () => {
      (mapRef.current as any)?.flyTo({ center: [78.9629, 22.5937], zoom: 4.5, duration: 1200, essential: true });
    },
    flyToFlight: (flight: Flight) => {
      (mapRef.current as any)?.flyTo({ center: [flight.liveMetrics.lng, flight.liveMetrics.lat], zoom: 8, duration: 1000, essential: true });
    },
    getZoom: () => mapRef.current?.getMap()?.getZoom() ?? 4.5,
  }));


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

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 78.9629,  // Center of India
          latitude: 22.5937,
          zoom: 4.5            // Asia-centric zoom showing India prominently
        }}
        // Bounds optimized for Asia view while keeping India central
        maxBounds={[
          [40.0, -10.0], // Southwest (Indian Ocean)
          [110.0, 50.0]  // Northeast (China/Mongolia border)
        ]}
        minZoom={3}
        maxZoom={18}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyleUrl || OLA_MAPS_STYLE}
        attributionControl={false}
        interactive={interactive}
        transformRequest={(url: string) => {
          if (url.includes('olamaps.io') && !url.includes('api_key')) {
            return { url: `${url}${url.includes('?') ? '&' : '?'}api_key=${OLA_API_KEY}` };
          }
          return { url };
        }}
        onError={(e) => {
          console.error("[MapComponent] Map Error:", e);
        }}
      >
        {/* Default controls removed — using custom AeroSky controls */}

        {/* --- LAYERS --- */}

        {/* 1. Terrain / Blind Spots */}
        {showTerrain && (
          <Source id="terrain-source" type="geojson" data={TERRAIN_BLIND_SPOTS as any}>
            <Layer
              id="terrain-fill"
              type="fill"
              paint={{
                'fill-color': '#450a0a', // Deep Red (Red-950)
                'fill-opacity': 0.3
              }}
            />
            <Layer
              id="terrain-outline"
              type="line"
              paint={{
                'line-color': '#ef4444', // Red-500
                'line-width': 1,
                'line-dasharray': [4, 2],
                'line-opacity': 0.6
              }}
            />
            {/* Simple Labels for Terrain */}
            {/* Note: Symbol layers need an icon or text-field. We'll skip complex labels for now to keep it simple or add if needed */}
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
                'line-width': 2.5, // Thicker
                'line-opacity': 0.9
              }}
            />
          </Source>
        )}

        {/* 3. Holding Stacks (Heatmap-like circles) */}
        {showHolding && (
          <Source id="holding-source" type="geojson" data={HOLDING_STACKS as any}>
            <Layer
              id="holding-circles"
              type="circle"
              paint={{
                'circle-radius': 35, // Larger
                'circle-color': '#EF4444',
                'circle-opacity': 0.4,
                'circle-blur': 0.6
              }}
            />
          </Source>
        )}

        {markers}

        {/* Selected Flight Paths */}
        {selectedFlightId && flights.map(flight => {
          if (flight.id !== selectedFlightId) return null;

          const start = [flight.origin.lng, flight.origin.lat];
          const current = [flight.liveMetrics.lng, flight.liveMetrics.lat];
          const dest = [flight.destination.lng, flight.destination.lat];


          const isWeakSignal = flight.liveMetrics.signalConfidence !== 'High';
          const isLostSignal = flight.liveMetrics.signalConfidence === 'Low';

          const flownGeoJson = flightTrack ? {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: flightTrack.map(p => [p[2], p[1]]) }
          } : {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [start, current] }
          };

          const projectedGeoJson = {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [current, dest] }
          };

          return (
            <React.Fragment key={`path-${flight.id}`}>
              {/* Flown Path / Track - Solid if High, Dotted if Weak/Low */}
              <Source id={`source-flown-${flight.id}`} type="geojson" data={flownGeoJson as any}>
                <Layer
                  id={`layer-flown-${flight.id}`}
                  type="line"
                  paint={{
                    'line-color': flightTrack ? '#00f0ff' : PLANE_COLORS.selected,
                    'line-width': flightTrack ? 4 : 3,
                    'line-opacity': isLostSignal ? 0.4 : 0.8,
                    'line-dasharray': isWeakSignal && !flightTrack ? [2, 2] : [1, 0] // Dotted if weak
                  }}
                />
              </Source>

              {/* Projected Path (Dashed White - always dashed for projection) */}
              <Source id={`source-projected-${flight.id}`} type="geojson" data={projectedGeoJson as any}>
                <Layer
                  id={`layer-projected-${flight.id}`}
                  type="line"
                  paint={{
                    'line-color': '#ffffff',
                    'line-width': 2,
                    'line-dasharray': [2, 4],
                    'line-opacity': 0.5
                  }}
                />
              </Source>
            </React.Fragment>
          );
        })}
      </Map>
    </div >
  );
});

MapComponent.displayName = 'MapComponent';
export default MapComponent;
