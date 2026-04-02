import { Flight } from '@/types';
import { SignalQuality, deriveOperationalStatus, measureSignalConfidence, generateMockSignalData } from '@/lib/OperationalIntelligence';

const BASE_URL = 'https://opensky-network.org/api';

// Use environment variables for credentials
const CLIENT_ID = import.meta.env.VITE_OPENSKY_CLIENT_ID || import.meta.env.clientId;
const CLIENT_SECRET = import.meta.env.VITE_OPENSKY_CLIENT_SECRET || import.meta.env.clientSecret;

// Helper to check if we have credentials
const hasCredentials = () => !!CLIENT_ID && !!CLIENT_SECRET;

interface OpenSkyResponse {
    time: number;
    states: (string | number | boolean | number[])[][];
}

export const OpenSkyService = {
    _cache: {} as Record<string, Flight[]>,
    _cacheTime: {} as Record<string, number>,
    _trackCache: {} as Record<string, any>,
    _trackCacheTime: {} as Record<string, number>,

    /**
     * Fetches live flight data from OpenSky Network.
     * Tries Basic Auth first if credentials exist.
     * Falls back to Anonymous if Auth fails (401).
     */
    fetchLiveFlights: async (
        minLat: number = 6.0,   // India South
        maxLat: number = 37.0,  // India North
        minLon: number = 68.0,  // India West
        maxLon: number = 98.0   // India East
    ): Promise<Flight[]> => {
        const url = `${BASE_URL}/states/all?lamin=${minLat}&lomin=${minLon}&lamax=${maxLat}&lomax=${maxLon}`;

        try {
            let response;

            // 1. Try with Auth if available
            if (hasCredentials()) {
                response = await fetch(url, {
                    headers: { 'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`) }
                });

                // If Auth fails, try Anonymous
                if (response.status === 401) {
                    console.warn('OpenSky Auth Failed (401). Retrying as Anonymous...');
                    response = await fetch(url);
                }
            } else {
                // No credentials, try Anonymous
                response = await fetch(url);
            }

            // Simple caching to prevent rate-limit when component remounts
            const cacheKey = `${minLat},${maxLat},${minLon},${maxLon}`;
            const now = Date.now();
            if (OpenSkyService._cache[cacheKey] && now - OpenSkyService._cacheTime[cacheKey] < 59000) {
                return OpenSkyService._cache[cacheKey];
            }

            if (!response || !response.ok) {
                if (response && response.status === 429) {
                    console.warn('OpenSky API rate limit exceeded.');
                    return OpenSkyService._cache[cacheKey] || [];
                }
                throw new Error(`OpenSky API Error: ${response ? response.status : 'Unknown'} ${response ? response.statusText : 'Unknown'}`);
            }

            const data: OpenSkyResponse = await response.json();

            if (!data.states) return [];

            const flights = data.states.map((state: any) => transformToFlight(state));

            OpenSkyService._cache[cacheKey] = flights;
            OpenSkyService._cacheTime[cacheKey] = now;

            return flights;

        } catch (error) {
            console.error('Failed to fetch OpenSky data:', error);
            return [];
        }
    },

    /**
     * Fetches historical track for a specific flight by its icao24
     */
    fetchFlightTrack: async (icao24: string): Promise<any | null> => {
        // flight ID from OpenSkyService has prefix "flight-", so we slice it off to get icao24
        const actualIcao = icao24.replace('flight-', '');
        const url = `${BASE_URL}/tracks/all?icao24=${actualIcao}&time=0`;

        const now = Date.now();
        if (OpenSkyService._trackCache[actualIcao] && now - (OpenSkyService._trackCacheTime[actualIcao] || 0) < 60000) {
            return OpenSkyService._trackCache[actualIcao];
        }

        try {
            let response: Response | undefined = undefined;
            if (hasCredentials()) {
                response = await fetch(url, {
                    headers: { 'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`) }
                });
                if (response.status === 401) {
                    response = await fetch(url);
                }
            } else {
                response = await fetch(url);
            }

            if (!response || !response.ok) {
                console.warn(`OpenSky Track API Error for ${actualIcao}: ${response ? response.status : 'Unknown'} ${response ? response.statusText : 'Unknown'}`);
                return null;
            }

            const data = await response.json();
            OpenSkyService._trackCache[actualIcao] = data;
            OpenSkyService._trackCacheTime[actualIcao] = now;
            return data;
        } catch (error) {
            console.error('Failed to fetch OpenSky track:', error);
            return null;
        }
    }
};

// Airline Code Lookup
const AIRLINE_MAP: Record<string, string> = {
    'IGO': 'IndiGo',
    'AIC': 'Air India',
    'VTI': 'Vistara', // Vistara ICAO
    'UK': 'Vistara',  // Vistara IATA
    'SEJ': 'SpiceJet',
    'SG': 'SpiceJet',
    'AKJ': 'Akasa Air',
    'QP': 'Akasa Air',
    'GOW': 'Go First',
    'IAD': 'AirAsia India',
    'UAE': 'Emirates',
    'ETD': 'Etihad',
    'QTR': 'Qatar Airways',
    'BAW': 'British Airways',
    'DLH': 'Lufthansa',
    'SIA': 'Singapore Airlines',
    'THY': 'Turkish Airlines'
};

// Transform OpenSky State Vector to our Flight Interface
const transformToFlight = (state: any): Flight => {
    const [
        icao24, callsignRaw, origin_country, time_position, last_contact,
        longitude, latitude, baro_altitude, on_ground, velocity,
        true_track, vertical_rate, sensors, geo_altitude, squawk
    ] = state;

    const callsign = (callsignRaw as string).trim();
    const airlineCode = callsign.length >= 3 ? callsign.substring(0, 3).toUpperCase() : 'UNK';
    const airlineName = AIRLINE_MAP[airlineCode] || (callsign.length > 3 ? `${airlineCode} Airlines` : 'Unknown Airline');

    // Generate a deterministic but fake ID for stability
    const id = `flight-${icao24}`;

    const lat = latitude as number;
    const lng = longitude as number;
    const alt = (baro_altitude as number) || 0;
    const speed = (velocity as number) || 0;
    const vRate = (vertical_rate as number) || 0;
    const signalData = generateMockSignalData();

    // Mocking data that is not available in the public/free API
    const mockOrigin = {
        icao: 'UNK',
        iata: 'UNK',
        lat: lat - 2,
        lng: lng - 2,
        name: 'Unknown Origin',
        city: 'Unknown City'
    };
    const mockDest = {
        icao: 'UNK',
        iata: 'UNK',
        lat: lat + 2,
        lng: lng + 2,
        name: 'Unknown Dest',
        city: 'Unknown City'
    };

    return {
        id: id,
        flightNumber: callsign || 'N/A',
        airline: airlineName,
        airlineCode: airlineCode,
        status: on_ground ? 'Landing' : 'In Air',
        scheduledDep: new Date().toISOString(),
        actualDep: new Date().toISOString(),
        scheduledArr: new Date(Date.now() + 3600000).toISOString(),
        estArr: new Date(Date.now() + 3600000).toISOString(),
        origin: mockOrigin,
        destination: mockDest,
        aircraft: {
            type: 'Jet',
            registration: callsign, // Often reg is not callsign, but close enough for mock
            age: '5 years',
            image: 'https://images.unsplash.com/photo-1542296332-2e44a996aa0d?q=80&w=600&auto=format&fit=crop'
        },
        liveMetrics: {
            lat: latitude as number,
            lng: longitude as number,
            altitude: alt,
            groundSpeed: speed,
            squawk: (squawk as string) || 'N/A',
            heading: (true_track as number) || 0,
            // New Fields
            signalConfidence: measureSignalConfidence(last_contact as number),
            operationalStatus: deriveOperationalStatus(alt, speed * 1.944, vRate * 196.85, on_ground as boolean), // m/s to kts, m/s to fpm
            feederCount: signalData.feederCount,
            rssi: signalData.rssi,
            lastUpdate: (last_contact as number),
            // New Detailed Telemetry
            vertRate: (vertical_rate as number) || 0,
            track: (true_track as number) || 0,
            sq: (squawk as string) || 'N/A',
            selectedAltitude: Math.round(alt / 100) * 100, // Mock
            tas: speed + (alt / 1000) * 2, // Mock TAS approx
            ias: speed - (alt / 1000), // Mock IAS approx
            mach: parseFloat((speed / 661).toFixed(2)),
            roll: 0,
            oat: -56 + (alt > 30000 ? 5 : 20), // standard lapse rate approx mock
            windSpeed: Math.floor(Math.random() * 80),
            windDir: Math.floor(Math.random() * 360),
            baro: 1013,
        },
        flightInfo: {
            terminalOrigin: '3',
            gateOrigin: '42B',
            terminalDest: '2',
            gateDest: 'A4',
            runway: '29L'
        },
        service: {
            type: 'Passenger',
            classes: ['First', 'Business', 'Economy'],
            seats: 316,
        },
        history: []
    };
};
