/**
 * Realistic flight track waypoints for demo flights.
 * Each track is an array of [timestamp, lat, lng] tuples
 * representing the flown path with realistic curves.
 * Only the selected flight's track is rendered on the map.
 */

// 6E 554: DEL → BOM (Delhi to Mumbai)
const TRACK_6E554: [number, number, number][] = [
    [0, 28.556, 77.100],  // DEL
    [1, 28.30, 76.80],
    [2, 27.80, 76.20],
    [3, 27.10, 75.60],
    [4, 26.30, 75.20],    // Over Jaipur corridor
    [5, 25.50, 74.90],
    [6, 24.80, 74.70],
    [7, 24.10, 74.50],
    [8, 23.50, 74.50],    // Current position (mid-flight)
];

// AI 101: BOM → DEL (Mumbai to Delhi)
const TRACK_AI101: [number, number, number][] = [
    [0, 19.089, 72.865],  // BOM
    [1, 19.50, 73.10],
    [2, 20.20, 73.50],
    [3, 21.00, 74.00],
    [4, 21.80, 74.30],
    [5, 22.60, 74.60],
    [6, 23.30, 74.80],
    [7, 24.00, 75.00],    // Current position
];

// UK 992: DEL → BLR (Delhi to Bengaluru)
const TRACK_UK992: [number, number, number][] = [
    [0, 28.556, 77.100],  // DEL
    [1, 28.20, 77.15],
    [2, 27.50, 77.20],    // Current position (just departed, climbing)
];

// EK 500: DXB → BOM (Dubai to Mumbai)
const TRACK_EK500: [number, number, number][] = [
    [0, 25.253, 55.365],  // DXB
    [1, 24.80, 57.00],
    [2, 24.20, 59.00],
    [3, 23.50, 61.00],
    [4, 22.80, 63.00],
    [5, 22.00, 65.00],    // Current position (over Arabian Sea)
];

// QP 132: BLR → MAA (Bengaluru to Chennai)
const TRACK_QP132: [number, number, number][] = [
    [0, 13.198, 77.706],  // BLR
    [1, 13.10, 78.10],
    [2, 13.00, 78.60],
    [3, 12.95, 79.10],
    [4, 12.90, 79.50],    // Current position (on approach)
];

/**
 * Map of flight ID → track waypoints.
 * Returns undefined for flights without pre-built tracks
 * (those will use the default origin→current line).
 */
export const FLIGHT_TRACKS: Record<string, [number, number, number][]> = {
    '6E554': TRACK_6E554,
    'AI101': TRACK_AI101,
    'UK992': TRACK_UK992,
    'EK500': TRACK_EK500,
    'QP132': TRACK_QP132,
};

export function getFlightTrack(flightId: string): [number, number, number][] | null {
    return FLIGHT_TRACKS[flightId] || null;
}
