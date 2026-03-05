import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AIRPORTS } from '../mockData';
import { Flight } from '../types';
import {
  OLA_API_KEY,
  OLA_MAP_STYLES,
  PLANE_SVG_PATH,
  getPlaneColor,
  normalizeHeading,
  olaTransformRequest,
} from '../utils/mapConstants';

interface MapProps {
  interactive?: boolean;
  flights?: Flight[];
  showFlights?: boolean;
  showAirports?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  onFlightClick?: (flightId: string) => void;
  selectedFlightId?: string | null;
  className?: string;
  theme?: 'dark' | 'light';
}

const MapBackground: React.FC<MapProps> = ({
  interactive = true,
  flights = [],
  showFlights = true,
  showAirports = false,
  center = { lat: 22.5937, lng: 78.9629 },
  zoom = 5,
  onFlightClick,
  selectedFlightId,
  className = "w-full h-full absolute inset-0 z-0",
  theme = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize MapLibre GL map with Ola Maps style
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: OLA_MAP_STYLES[theme],
      center: [center.lng, center.lat],
      zoom,
      interactive,
      attributionControl: false,
      transformRequest: olaTransformRequest,
    });

    // Disable all interactions for background map
    if (!interactive) {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.boxZoom.disable();
      map.dragRotate.disable();
      map.keyboard.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center/zoom when props change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter([center.lng, center.lat]);
      mapRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Update map style when theme changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(OLA_MAP_STYLES[theme as keyof typeof OLA_MAP_STYLES]);
    }
  }, [theme]);

  // Render flight markers with plane SVG icons
  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (showFlights) {
      flights.forEach(flight => {
        if (flight.liveMetrics.altitude === 0 && flight.liveMetrics.lat === 0) return;

        const isSelected = flight.id === selectedFlightId;
        const color = getPlaneColor(flight, isSelected, theme as 'dark' | 'light');
        const heading = flight.liveMetrics.heading || 0;
        const size = isSelected ? 28 : 18;
        const rotation = normalizeHeading(heading);

        // Create SVG element for marker
        const el = document.createElement('div');
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.cursor = 'pointer';
        el.style.transition = 'transform 0.3s ease';
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Flight ${flight.flightNumber} — ${flight.status}`);
        el.setAttribute('tabindex', '0');
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true"><path d="${PLANE_SVG_PATH}" fill="${color}" transform="rotate(${rotation} 16 16)"/></svg>`;

        if (onFlightClick) {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onFlightClick(flight.id);
          });
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFlightClick(flight.id);
            }
          });
        }

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([flight.liveMetrics.lng, flight.liveMetrics.lat])
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });
    }

    if (showAirports) {
      Object.values(AIRPORTS).forEach(airport => {
        const el = document.createElement('div');
        el.style.width = '8px';
        el.style.height = '8px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#22C55E';
        el.style.opacity = '0.8';
        el.style.boxShadow = '0 0 6px rgba(34,197,94,0.4)';
        el.title = airport.iata;
        el.setAttribute('aria-label', `Airport: ${airport.iata}`);

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([airport.lng, airport.lat])
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });
    }
  }, [flights, showFlights, showAirports, selectedFlightId, onFlightClick, theme]);

  return <div ref={mapContainerRef} className={className} />;
};

export default MapBackground;