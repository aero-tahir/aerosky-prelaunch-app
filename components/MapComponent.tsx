import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Flight } from '../types';
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
} from '../utils/mapConstants';
import { FIR_BOUNDARIES, TERRAIN_BLIND_SPOTS, HOLDING_STACKS, AERO_CHARTS, AIRPORTS } from '../utils/navigationLayers';

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
  showAeroCharts?: boolean;
  showAirportPins?: boolean;
  showAirportLabels?: boolean;
  showAircraftLabels?: boolean;
  mapBrightness?: number; // 0 to 100
  activeMapStyle?: 'dark' | 'satellite' | 'street' | 'vector';
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
  mapStyleUrl,
  flightTrack
}, ref) => {
  const mapRef = useRef<MapRef>(null);

  const finalMapStyle = useMemo(() => {
    if (mapStyleUrl) return mapStyleUrl;
    if (activeMapStyle === 'satellite') return OLA_MAP_STYLES.satellite;
    if (activeMapStyle === 'street') return OLA_MAP_STYLES.light;
    if (activeMapStyle === 'vector') return OLA_MAP_STYLES.hybrid;
    return OLA_MAP_STYLES.dark;
  }, [mapStyleUrl, activeMapStyle]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.getMap()?.zoomIn({ duration: 300 }),
    zoomOut: () => mapRef.current?.getMap()?.zoomOut({ duration: 300 }),
    resetView: () => {
      (mapRef.current as any)?.flyTo({ center: [INDIA_CENTER.lng, INDIA_CENTER.lat], zoom: INDIA_CENTER.zoom, duration: 1200, essential: true });
    },
    flyToFlight: (flight: Flight) => {
      (mapRef.current as any)?.flyTo({ center: [flight.liveMetrics.lng, flight.liveMetrics.lat], zoom: 8, duration: 1000, essential: true });
    },
    getZoom: () => mapRef.current?.getMap()?.getZoom() ?? INDIA_CENTER.zoom,
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

        {/* 5. Airport Pins & Labels */}
        {(showAirportPins || showAirportLabels) && (
          <Source id="airports-source" type="geojson" data={AIRPORTS as any}>
            {showAirportPins && (
              <Layer
                id="airport-dots"
                type="circle"
                paint={{
                  'circle-radius': 4,
                  'circle-color': '#ffffff',
                  'circle-stroke-width': 1.5,
                  'circle-stroke-color': '#0f172a'
                }}
              />
            )}
            {showAirportLabels && (
              <Layer
                id="airport-labels"
                type="symbol"
                layout={{
                  'text-field': ['get', 'iata'],
                  'text-font': ['Open Sans Bold'],
                  'text-size': 10,
                  'text-offset': [0, 1.2],
                  'text-anchor': 'top'
                }}
                paint={{
                  'text-color': '#ffffff',
                  'text-halo-color': '#0f172a',
                  'text-halo-width': 1
                }}
              />
            )}
          </Source>
        )}

        {/* 6. Brightness / Day-Night Mask */}
        {mapBrightness < 100 && (
          <Layer
            id="brightness-mask"
            type="background"
            paint={{
              'background-color': '#000000',
              'background-opacity': (100 - mapBrightness) / 100
            }}
            beforeId="fir-lines" // Ensure it stays behind flight data/FIRs if possible, or just as a base
          />
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
              {/* Flown Path / Track */}
              <Source id={`source-flown-${flight.id}`} type="geojson" data={flownGeoJson as any}>
                <Layer
                  id={`layer-flown-${flight.id}`}
                  type="line"
                  paint={{
                    'line-color': flightTrack ? '#00f0ff' : PLANE_COLORS.selected,
                    'line-width': flightTrack ? 4 : 3,
                    'line-opacity': isLostSignal ? 0.4 : 0.8,
                    'line-dasharray': isWeakSignal && !flightTrack ? [2, 2] : [1, 0]
                  }}
                />
              </Source>

              {/* Projected Path */}
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
    </div>
  );
});

MapComponent.displayName = 'MapComponent';
export default MapComponent;
