import type { FlightMarker, Airport } from './types';

export const AIRPORTS: Airport[] = [
    { iata: 'DEL', lat: 28.556, lng: 77.100 },
    { iata: 'BOM', lat: 19.089, lng: 72.865 },
    { iata: 'BLR', lat: 13.198, lng: 77.706 },
    { iata: 'MAA', lat: 12.994, lng: 80.170 },
    { iata: 'HYD', lat: 17.231, lng: 78.429 },
    { iata: 'CCU', lat: 22.654, lng: 88.446 },
    { iata: 'COK', lat: 10.152, lng: 76.401 },
    { iata: 'GOI', lat: 15.380, lng: 73.831 },
    { iata: 'AMD', lat: 23.077, lng: 72.634 },
    { iata: 'JAI', lat: 26.824, lng: 75.812 },
];

/**
 * Static flight markers scattered across Indian airspace.
 * Just positions + headings for the decorative map background.
 */
export const FLIGHT_MARKERS: FlightMarker[] = [
    { id: 'f1', lat: 23.5, lng: 74.5, heading: 205 },
    { id: 'f2', lat: 24.0, lng: 75.0, heading: 25 },
    { id: 'f3', lat: 27.5, lng: 77.2, heading: 170 },
    { id: 'f4', lat: 22.0, lng: 65.0, heading: 110 },
    { id: 'f5', lat: 12.9, lng: 79.5, heading: 85 },
    { id: 'f6', lat: 20.1, lng: 73.2, heading: 190 },
    { id: 'f7', lat: 15.5, lng: 78.0, heading: 320 },
    { id: 'f8', lat: 26.2, lng: 80.5, heading: 145 },
    { id: 'f9', lat: 18.5, lng: 84.0, heading: 260 },
    { id: 'f10', lat: 30.2, lng: 76.8, heading: 180 },
    { id: 'f11', lat: 21.0, lng: 79.0, heading: 45 },
    { id: 'f12', lat: 25.5, lng: 85.5, heading: 220 },
    { id: 'f13', lat: 16.5, lng: 74.0, heading: 350 },
    { id: 'f14', lat: 28.0, lng: 72.0, heading: 130 },
    { id: 'f15', lat: 11.5, lng: 77.5, heading: 10 },
    { id: 'f16', lat: 19.5, lng: 76.0, heading: 290 },
    { id: 'f17', lat: 14.5, lng: 80.5, heading: 55 },
    { id: 'f18', lat: 22.8, lng: 88.0, heading: 200 },
    { id: 'f19', lat: 26.0, lng: 73.5, heading: 160 },
    { id: 'f20', lat: 17.0, lng: 82.0, heading: 310 },
];
