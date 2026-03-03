import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AIRPORTS } from '../mockData';
import { Flight } from '../types';

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

/* ─── Ola Maps Configuration ─── */
const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || 'dSpdveDyWcUJ4q2XAnRuweHDDnim2xnv0BFR73kQ';
const OLA_STYLES = {
  dark: `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json?api_key=${OLA_API_KEY}`,
  light: `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${OLA_API_KEY}`,
};

/* ─── Plane SVG Icon Builder ───
   Colors:
     Yellow (#FACC15) = Default / Normal flight
     Orange (#FF9933) = Alert / Squawk event
     Red    (#EF4444) = Selected / Clicked
*/
const PLANE_SVG_PATH = 'M9.123 30.464l-1.33-6.268-6.318-1.397 1.291-2.475 5.785-0.316c0.297-0.386 0.96-1.234 1.374-1.648l5.271-5.271-10.989-5.388 2.782-2.782 13.932 2.444 4.933-4.933c0.585-0.585 1.496-0.894 2.634-0.894 0.776 0 1.395 0.143 1.421 0.149l0.3 0.070 0.089 0.295c0.469 1.55 0.187 3.298-0.67 4.155l-4.956 4.956 2.434 13.875-2.782 2.782-5.367-10.945-4.923 4.924c-0.518 0.517-1.623 1.536-2.033 1.912l-0.431 5.425-2.449 1.329z';

const PLANE_COLORS = {
  default: '#FACC15',  // Yellow — normal flight
  alert: '#FF9933',    // Orange — squawk / event
  selected: '#EF4444', // Red — clicked / selected
} as const;

/* ─── Determine plane color based on flight status / events ─── */
const getPlaneColor = (flight: Flight, isSelected: boolean, theme: 'dark' | 'light'): string => {
  if (isSelected) return PLANE_COLORS.selected;
  const squawk = flight.liveMetrics?.squawk;
  if (squawk === '7500' || squawk === '7600' || squawk === '7700') return PLANE_COLORS.alert;
  if (flight.status === 'Delayed' || flight.status === 'Diverted') return PLANE_COLORS.alert;

  // High contrast for light mode
  if (theme === 'light') return '#EA580C'; // orange-600

  return PLANE_COLORS.default;
};

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
      style: OLA_STYLES[theme],
      center: [center.lng, center.lat],
      zoom,
      interactive,
      attributionControl: false,
      transformRequest: (url: string) => {
        if (url.includes('olamaps.io') && !url.includes('api_key')) {
          return { url: `${url}${url.includes('?') ? '&' : '?'}api_key=${OLA_API_KEY}` };
        }
        return { url };
      },
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
      mapRef.current.setStyle(OLA_STYLES[theme]);
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
        const color = getPlaneColor(flight, isSelected, theme);
        const heading = flight.liveMetrics.heading || 0;
        const size = isSelected ? 28 : 18;
        const rotation = (heading + 135) % 360; // normalize SVG orientation

        // Create SVG element for marker
        const el = document.createElement('div');
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.cursor = 'pointer';
        el.style.transition = 'transform 0.3s ease';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><path d="${PLANE_SVG_PATH}" fill="${color}" transform="rotate(${rotation} 16 16)"/></svg>`;

        if (onFlightClick) {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onFlightClick(flight.id);
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

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([airport.lng, airport.lat])
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });
    }
  }, [flights, showFlights, showAirports, selectedFlightId, onFlightClick]);

  return <div ref={mapContainerRef} className={className} />;
};

export default MapBackground;