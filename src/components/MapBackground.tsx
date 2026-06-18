import React from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TowerControl } from 'lucide-react';
import { FLIGHT_MARKERS, AIRPORTS } from '../data';

const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || '';
const OLA_STYLE_URL = `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json`;

interface Props {
  className?: string;
  longitude?: number;
  latitude?: number;
  zoom?: number;
}

const MapBackground: React.FC<Props> = ({
  className = 'w-full h-full absolute inset-0 z-0',
  longitude = 65,
  latitude = 22,
  zoom = 4.0,
}) => {
  return (
    <div className={className}>
      <Map
        initialViewState={{
          longitude,
          latitude,
          zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={OLA_STYLE_URL}
        interactive={false}
        attributionControl={false}
        transformRequest={(url: string) => {
          if (url.includes('olamaps.io')) {
            const separator = url.includes('?') ? '&' : '?';
            return { url: `${url}${separator}api_key=${OLA_API_KEY}` };
          }
          return { url };
        }}
      >
        {/* Airport markers */}
        {AIRPORTS.map((airport) => (
          <Marker key={airport.iata} longitude={airport.lng} latitude={airport.lat} anchor="center">
            <div className="relative flex items-center justify-center">
              {/* Animated glow ring */}
              <div className="absolute w-5 h-5 rounded-full border border-blue-400/30 animate-signal-ring" />
              {/* Blue circle with white border + tower icon */}
              <div className="relative w-4 h-4 rounded-full bg-blue-500 border border-white shadow-[0_0_8px_rgba(59,130,246,0.6)] flex items-center justify-center">
                <TowerControl size={8} color="#ffffff" />
              </div>
            </div>
          </Marker>
        ))}

        {/* Flight markers */}
        {FLIGHT_MARKERS.map((flight) => (
          <Marker key={flight.id} longitude={flight.lng} latitude={flight.lat} anchor="center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: `rotate(${flight.heading}deg)`, filter: 'drop-shadow(0 0 3px rgba(250,204,21,0.6))' }}
            >
              <path d="M9.123 30.464l-1.33-6.268-6.318-1.397 1.291-2.475 5.785-0.316c0.297-0.386 0.96-1.234 1.374-1.648l5.271-5.271-10.989-5.388 2.782-2.782 13.932 2.444 4.933-4.933c0.585-0.585 1.496-0.894 2.634-0.894 0.776 0 1.395 0.143 1.421 0.149l0.3 0.070 0.089 0.295c0.469 1.55 0.187 3.298-0.67 4.155l-4.956 4.956 2.434 13.875-2.782 2.782-5.367-10.945-4.923 4.924c-0.518 0.517-1.623 1.536-2.033 1.912l-0.431 5.425-2.449 1.329z" fill="#FACC15" />
            </svg>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapBackground;
