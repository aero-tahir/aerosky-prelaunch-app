/**
 * India-First Fallback Flight Generator
 * 
 * Generates hyper-realistic Indian aviation data when the OpenSky API
 * is unavailable. Covers all major Indian carriers, 20+ airports,
 * realistic aircraft types/registrations, proper times in IST,
 * gate/terminal info, and rich service metadata.
 */

import { Flight } from '@/types';

// ──────────────────────────────────────────
// INDIAN AIRLINE DATABASE
// ──────────────────────────────────────────
const INDIAN_AIRLINES = [
    { code: 'IGO', name: 'IndiGo', prefix: '6E', hub: 'DEL', type: 'LCC', classes: ['Economy'], seats: 186 },
    { code: 'AIC', name: 'Air India', prefix: 'AI', hub: 'DEL', type: 'Full Service', classes: ['First', 'Business', 'Economy'], seats: 256 },
    { code: 'VTI', name: 'Vistara', prefix: 'UK', hub: 'DEL', type: 'Full Service', classes: ['Business', 'Premium Economy', 'Economy'], seats: 164 },
    { code: 'SEJ', name: 'SpiceJet', prefix: 'SG', hub: 'DEL', type: 'LCC', classes: ['Economy'], seats: 189 },
    { code: 'AKJ', name: 'Akasa Air', prefix: 'QP', hub: 'BOM', type: 'LCC', classes: ['Economy'], seats: 189 },
    { code: 'AIX', name: 'Air India Express', prefix: 'IX', hub: 'COK', type: 'LCC', classes: ['Economy'], seats: 186 },
    { code: 'AAY', name: 'Alliance Air', prefix: '9I', hub: 'DEL', type: 'Regional', classes: ['Economy'], seats: 72 },
    // Premium International with India routes
    { code: 'UAE', name: 'Emirates', prefix: 'EK', hub: 'DXB', type: 'Full Service', classes: ['First', 'Business', 'Economy'], seats: 354 },
    { code: 'QTR', name: 'Qatar Airways', prefix: 'QR', hub: 'DOH', type: 'Full Service', classes: ['Business', 'Economy'], seats: 283 },
    { code: 'SIA', name: 'Singapore Airlines', prefix: 'SQ', hub: 'SIN', type: 'Full Service', classes: ['Suites', 'Business', 'Premium Economy', 'Economy'], seats: 264 },
    { code: 'ETD', name: 'Etihad Airways', prefix: 'EY', hub: 'AUH', type: 'Full Service', classes: ['Business', 'Economy'], seats: 239 },
    { code: 'BAW', name: 'British Airways', prefix: 'BA', hub: 'LHR', type: 'Full Service', classes: ['First', 'Business', 'World Traveller+', 'World Traveller'], seats: 275 },
];

// ──────────────────────────────────────────
// INDIAN AIRPORT DATABASE
// ──────────────────────────────────────────
export const INDIAN_AIRPORT_COORDS = [
    { iata: 'DEL', icao: 'VIDP', lat: 28.556, lng: 77.100, city: 'New Delhi', name: 'Indira Gandhi International', terminals: ['T1', 'T2', 'T3'] },
    { iata: 'BOM', icao: 'VABB', lat: 19.089, lng: 72.865, city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', terminals: ['T1', 'T2'] },
    { iata: 'BLR', icao: 'VOBL', lat: 13.198, lng: 77.706, city: 'Bengaluru', name: 'Kempegowda International', terminals: ['T1', 'T2'] },
    { iata: 'MAA', icao: 'VOMM', lat: 12.994, lng: 80.170, city: 'Chennai', name: 'Chennai International', terminals: ['T1', 'T4'] },
    { iata: 'HYD', icao: 'VOHS', lat: 17.231, lng: 78.429, city: 'Hyderabad', name: 'Rajiv Gandhi International', terminals: ['T'] },
    { iata: 'CCU', icao: 'VECC', lat: 22.654, lng: 88.446, city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International', terminals: ['T1', 'T2'] },
    { iata: 'COK', icao: 'VOCI', lat: 10.152, lng: 76.401, city: 'Kochi', name: 'Cochin International', terminals: ['T1', 'T2', 'T3'] },
    { iata: 'GOI', icao: 'VOGO', lat: 15.380, lng: 73.831, city: 'Goa', name: 'Manohar International', terminals: ['T'] },
    { iata: 'AMD', icao: 'VAAH', lat: 23.077, lng: 72.634, city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International', terminals: ['T1', 'T2'] },
    { iata: 'JAI', icao: 'VIJP', lat: 26.824, lng: 75.812, city: 'Jaipur', name: 'Jaipur International', terminals: ['T1', 'T2'] },
    { iata: 'PNQ', icao: 'VAPO', lat: 18.582, lng: 73.919, city: 'Pune', name: 'Pune Airport', terminals: ['T'] },
    { iata: 'LKO', icao: 'VILK', lat: 26.760, lng: 80.889, city: 'Lucknow', name: 'Chaudhary Charan Singh International', terminals: ['T1', 'T2', 'T3'] },
    { iata: 'GAU', icao: 'VEGT', lat: 26.106, lng: 91.585, city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International', terminals: ['T'] },
    { iata: 'IXC', icao: 'VICG', lat: 30.673, lng: 76.788, city: 'Chandigarh', name: 'Chandigarh International', terminals: ['T'] },
    { iata: 'PAT', icao: 'VEPT', lat: 25.591, lng: 85.087, city: 'Patna', name: 'Jay Prakash Narayan International', terminals: ['T'] },
    { iata: 'SXR', icao: 'VISR', lat: 33.987, lng: 74.774, city: 'Srinagar', name: 'Sheikh ul-Alam International', terminals: ['T'] },
    { iata: 'IXB', icao: 'VEBD', lat: 26.681, lng: 88.328, city: 'Bagdogra', name: 'Bagdogra Airport', terminals: ['T'] },
    { iata: 'VNS', icao: 'VIBN', lat: 25.452, lng: 82.859, city: 'Varanasi', name: 'Lal Bahadur Shastri International', terminals: ['T'] },
    { iata: 'TRV', icao: 'VOTV', lat: 8.482, lng: 76.920, city: 'Thiruvananthapuram', name: 'Trivandrum International', terminals: ['T1', 'T2'] },
    { iata: 'NAG', icao: 'VANP', lat: 21.092, lng: 79.047, city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International', terminals: ['T'] },
];

// ──────────────────────────────────────────
// REALISTIC AIRCRAFT FLEET
// ──────────────────────────────────────────
const AIRCRAFT_TYPES: Record<string, { types: { name: string; regs: string[]; age: string }[] }> = {
    'IGO': {
        types: [
            { name: 'Airbus A320neo', regs: ['VT-IFN', 'VT-IFM', 'VT-IHE', 'VT-IHF', 'VT-IHG', 'VT-IZB', 'VT-IZC'], age: '2.4 yrs' },
            { name: 'Airbus A321neo', regs: ['VT-IUA', 'VT-IUB', 'VT-IUC', 'VT-IUD'], age: '1.8 yrs' },
            { name: 'ATR 72-600', regs: ['VT-IRA', 'VT-IRB'], age: '5.1 yrs' },
        ]
    },
    'AIC': {
        types: [
            { name: 'Boeing 787-8 Dreamliner', regs: ['VT-ANU', 'VT-ANV', 'VT-ANW', 'VT-ANX'], age: '8.2 yrs' },
            { name: 'Boeing 777-300ER', regs: ['VT-ALN', 'VT-ALO', 'VT-ALP'], age: '10.6 yrs' },
            { name: 'Airbus A320neo', regs: ['VT-EXL', 'VT-EXM', 'VT-EXN'], age: '3.3 yrs' },
        ]
    },
    'VTI': {
        types: [
            { name: 'Airbus A320neo', regs: ['VT-TNC', 'VT-TND', 'VT-TNE', 'VT-TNF'], age: '3.0 yrs' },
            { name: 'Boeing 787-9 Dreamliner', regs: ['VT-TSA', 'VT-TSB', 'VT-TSC'], age: '2.1 yrs' },
        ]
    },
    'SEJ': {
        types: [
            { name: 'Boeing 737-800', regs: ['VT-SGA', 'VT-SGB', 'VT-SGC', 'VT-SGD'], age: '7.5 yrs' },
            { name: 'Boeing 737 MAX 8', regs: ['VT-MXA', 'VT-MXB'], age: '1.5 yrs' },
        ]
    },
    'AKJ': {
        types: [
            { name: 'Boeing 737 MAX 8', regs: ['VT-YAA', 'VT-YAB', 'VT-YAC', 'VT-YAD', 'VT-YAE'], age: '0.8 yrs' },
        ]
    },
    'AIX': {
        types: [
            { name: 'Boeing 737-800', regs: ['VT-AXA', 'VT-AXB', 'VT-AXC'], age: '6.3 yrs' },
        ]
    },
    'AAY': {
        types: [
            { name: 'ATR 72-600', regs: ['VT-ABR', 'VT-ABS', 'VT-ABT'], age: '4.2 yrs' },
        ]
    },
    'UAE': {
        types: [
            { name: 'Boeing 777-300ER', regs: ['A6-EGP', 'A6-EGQ', 'A6-EGR'], age: '6.1 yrs' },
            { name: 'Airbus A380-800', regs: ['A6-EDA', 'A6-EDB', 'A6-EDC'], age: '9.8 yrs' },
        ]
    },
    'QTR': {
        types: [
            { name: 'Boeing 787-9 Dreamliner', regs: ['A7-BHA', 'A7-BHB', 'A7-BHC'], age: '3.5 yrs' },
        ]
    },
    'SIA': {
        types: [
            { name: 'Airbus A350-900', regs: ['9V-SMA', '9V-SMB', '9V-SMC'], age: '4.0 yrs' },
        ]
    },
    'ETD': {
        types: [
            { name: 'Boeing 787-9 Dreamliner', regs: ['A6-BLA', 'A6-BLB'], age: '5.2 yrs' },
        ]
    },
    'BAW': {
        types: [
            { name: 'Boeing 787-9 Dreamliner', regs: ['G-ZBKA', 'G-ZBKB'], age: '6.7 yrs' },
        ]
    },
};

// ──────────────────────────────────────────
// TIME UTILITIES
// ──────────────────────────────────────────
const generateIST = (hoursOffset: number = 0): string => {
    const now = new Date();
    now.setHours(now.getHours() + hoursOffset);
    const hr = now.getHours().toString().padStart(2, '0');
    const mn = (Math.floor(now.getMinutes() / 5) * 5).toString().padStart(2, '0');
    return `${hr}:${mn}`;
};

// ──────────────────────────────────────────
// MAIN GENERATOR
// ──────────────────────────────────────────
export const generateFallbackFlights = (): Flight[] => {
    const flights: Flight[] = [];
    const seed = Math.floor(Date.now() / 60000);

    for (let i = 0; i < 120; i++) {
        const airline = INDIAN_AIRLINES[i % INDIAN_AIRLINES.length];
        const originAirport = INDIAN_AIRPORT_COORDS[i % INDIAN_AIRPORT_COORDS.length];
        const destAirport = INDIAN_AIRPORT_COORDS[(i + 3 + Math.floor(i / 5)) % INDIAN_AIRPORT_COORDS.length];

        // Interpolate position between origin and destination
        const progress = ((seed + i * 37) % 100) / 100;
        const jitterLat = ((i * 7 + seed) % 200 - 100) / 500;
        const jitterLng = ((i * 13 + seed) % 200 - 100) / 500;

        const lat = originAirport.lat + (destAirport.lat - originAirport.lat) * progress + jitterLat;
        const lng = originAirport.lng + (destAirport.lng - originAirport.lng) * progress + jitterLng;

        // Stay within Indian airspace
        if (lat < 6.5 || lat > 35.5 || lng < 68 || lng > 97.5) continue;

        const heading = Math.round(Math.atan2(
            destAirport.lng - originAirport.lng,
            destAirport.lat - originAirport.lat
        ) * (180 / Math.PI) + 360) % 360;

        const flightNum = `${airline.prefix}${100 + (i * 3 + seed) % 900}`;
        const altitude = 15000 + ((i * 17 + seed) % 25000);
        const speed = 350 + ((i * 11 + seed) % 200);

        // Pick realistic aircraft
        const fleet = AIRCRAFT_TYPES[airline.code]?.types || [{ name: 'Airbus A320neo', regs: ['VT-XXX'], age: '3.0 yrs' }];
        const acType = fleet[i % fleet.length];
        const registration = acType.regs[i % acType.regs.length];

        // Departure/arrival times
        const depHours = -((i * 7 + seed) % 4) - 1;
        const arrHours = ((i * 11 + seed) % 3) + 1;

        flights.push({
            id: `${flightNum}-${i}`,
            flightNumber: flightNum,
            airline: airline.name,
            airlineCode: airline.code,
            origin: {
                name: originAirport.name, iata: originAirport.iata, icao: originAirport.icao,
                city: originAirport.city, lat: originAirport.lat, lng: originAirport.lng,
            },
            destination: {
                name: destAirport.name, iata: destAirport.iata, icao: destAirport.icao,
                city: destAirport.city, lat: destAirport.lat, lng: destAirport.lng,
            },
            status: 'In Air' as const,
            scheduledDep: generateIST(depHours),
            actualDep: generateIST(depHours),
            scheduledArr: generateIST(arrHours),
            estArr: generateIST(arrHours),
            aircraft: {
                type: acType.name,
                registration,
                age: acType.age,
                image: 'https://images.unsplash.com/photo-1542296332-2e44a996aa0d?q=80&w=600&auto=format&fit=crop',
            },
            liveMetrics: {
                altitude,
                groundSpeed: speed,
                squawk: `${1200 + (i * 13 % 5600)}`,
                heading,
                lat,
                lng,
                signalConfidence: i % 5 === 0 ? 'Low' : i % 3 === 0 ? 'Medium' : 'High',
                operationalStatus: 'En Route',
                feederCount: Math.floor(Math.random() * 10) + 1,
                rssi: -(Math.floor(Math.random() * 30) + 10),
                lastUpdate: Date.now() / 1000,
                vertRate: (Math.random() > 0.8 ? (Math.random() * 2000 - 1000) : 0),
                track: heading,
                sq: `${1200 + (i * 13 % 5600)}`,
                selectedAltitude: Math.round(altitude / 100) * 100,
                tas: speed + (altitude / 1000) * 2,
                ias: speed - (altitude / 1000),
                mach: parseFloat((speed / 661).toFixed(2)),
                roll: (Math.random() * 2 - 1),
                oat: -50 + (Math.random() * 10),
                windSpeed: Math.floor(Math.random() * 50),
                windDir: Math.floor(Math.random() * 360),
                baro: 1013 + (Math.random() * 10 - 5),
            },
            service: {
                type: airline.type,
                classes: airline.classes,
                seats: airline.seats,
            },
            flightInfo: {
                terminalOrigin: originAirport.terminals[i % originAirport.terminals.length],
                gateOrigin: `${String.fromCharCode(65 + (i % 8))}${(i % 30) + 1}`,
                terminalDest: destAirport.terminals[i % destAirport.terminals.length],
                gateDest: `${String.fromCharCode(65 + ((i + 3) % 8))}${((i + 5) % 30) + 1}`,
                runway: `${(i % 2 === 0 ? '09' : '27')}${i % 3 === 0 ? 'L' : 'R'}`,
            },
            history: [],
        });
    }

    return flights;
};
