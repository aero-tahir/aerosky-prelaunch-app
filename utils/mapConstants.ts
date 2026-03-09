/**
 * Shared map constants and utility functions
 * Used by both MapComponent.tsx and MapBackground.tsx
 * 
 * Single source of truth for:
 * - Ola Maps API configuration
 * - Plane SVG icon path
 * - Plane color scheme
 * - Plane color determination logic
 */

import { Flight } from '../types';

export const OLA_API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY ?? '';

if (!OLA_API_KEY) {
    console.warn(
        '[AeroSky] VITE_OLA_MAP_API_KEY is not set. ' +
        'Restart dev server after adding it to .env.local'
    );
}

export const OLA_MAP_STYLES = {
    dark: OLA_API_KEY
        ? `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json?api_key=${OLA_API_KEY}`
        : '',
    light: OLA_API_KEY
        ? `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${OLA_API_KEY}`
        : '',
    satellite: OLA_API_KEY
        ? `https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard-satellite/style.json?api_key=${OLA_API_KEY}`
        : '',
    hybrid: OLA_API_KEY
        ? `https://api.olamaps.io/tiles/vector/v1/styles/default-earth-standard/style.json?api_key=${OLA_API_KEY}`
        : '',
} as const;

/* ─── India Center Coordinates ─── */
export const INDIA_CENTER = {
    lng: 78.9629,
    lat: 22.5937,
    zoom: 4.5,
} as const;

export const INDIA_BOUNDS = {
    southwest: [40.0, -10.0] as [number, number],  // Indian Ocean
    northeast: [110.0, 50.0] as [number, number],   // China/Mongolia border
} as const;

/* ─── Plane SVG Icon ─── */
export const PLANE_SVG_PATH = 'M9.123 30.464l-1.33-6.268-6.318-1.397 1.291-2.475 5.785-0.316c0.297-0.386 0.96-1.234 1.374-1.648l5.271-5.271-10.989-5.388 2.782-2.782 13.932 2.444 4.933-4.933c0.585-0.585 1.496-0.894 2.634-0.894 0.776 0 1.395 0.143 1.421 0.149l0.3 0.070 0.089 0.295c0.469 1.55 0.187 3.298-0.67 4.155l-4.956 4.956 2.434 13.875-2.782 2.782-5.367-10.945-4.923 4.924c-0.518 0.517-1.623 1.536-2.033 1.912l-0.431 5.425-2.449 1.329z';

/* ─── Plane Color System ─── */
export const PLANE_COLORS = {
    default: '#FACC15',   // Yellow: normal flight
    alert: '#FF9933',     // Orange: squawk / event  
    selected: '#EF4444',  // Red: clicked / selected
    lightMode: '#EA580C', // Orange-600: high contrast for light backgrounds
} as const;

/**
 * Determine plane marker color based on flight state
 * @param flight - Flight data
 * @param isSelected - Whether the flight is currently selected
 * @param theme - Current UI theme ('dark' | 'light'), defaults to 'dark'
 */
export const getPlaneColor = (
    flight: Flight,
    isSelected: boolean,
    theme: 'dark' | 'light' = 'dark'
): string => {
    if (isSelected) return PLANE_COLORS.selected;

    const squawk = flight.liveMetrics?.squawk;
    if (squawk === '7500' || squawk === '7600' || squawk === '7700') {
        return PLANE_COLORS.alert;
    }

    if (flight.status === 'Delayed' || flight.status === 'Diverted') {
        return PLANE_COLORS.alert;
    }

    // High contrast color for light backgrounds
    if (theme === 'light') return PLANE_COLORS.lightMode;

    return PLANE_COLORS.default;
};

/**
 * Normalize flight heading for SVG plane icon rotation
 * The SVG path is oriented at ~135° offset from north
 */
export const normalizeHeading = (heading: number): number => {
    return (heading + 135) % 360;
};

/**
 * Transform request interceptor for Ola Maps API
 * Ensures API key is appended to all Ola Maps tile requests
 */
export const olaTransformRequest = (url: string): { url: string } => {
    if (url.includes('olamaps.io') && !url.includes('api_key') && OLA_API_KEY) {
        return { url: `${url}${url.includes('?') ? '&' : '?'}api_key=${OLA_API_KEY}` };
    }
    return { url };
};
