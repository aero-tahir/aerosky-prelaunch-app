export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: Airport;
  destination: Airport;
  status: 'On Time' | 'Delayed' | 'Diverted' | 'Scheduled' | 'In Air' | 'Landing';
  scheduledDep: string;
  actualDep: string;
  scheduledArr: string;
  estArr: string;
  aircraft: {
    type: string;
    registration: string;
    age: string;
    image: string;
  };
  liveMetrics: {
    altitude: number; // ft
    groundSpeed: number; // kts
    squawk: string;
    heading: number;
    lat: number;
    lng: number;
    // New Detailed Telemetry
    vertRate: number; // fpm
    track: number; // deg
    sq?: string; // squawk alias
    // Extended Physics (Mock/Calc)
    selectedAltitude?: number;
    tas?: number;
    ias?: number;
    mach?: number;
    roll?: number;
    // Environment
    oat?: number; // Outside Air Temp C
    windSpeed?: number;
    windDir?: number;
    baro?: number; // hPa
    // Operational
    signalConfidence: 'High' | 'Medium' | 'Low';
    operationalStatus: string;
    feederCount: number;
    rssi: number;
    lastUpdate: number;
  };
  // Service & Metadata
  service?: {
    type: string; // Passenger, Cargo
    classes: string[];
    seats?: number;
    age?: string;
  };
  // Gate Info
  flightInfo?: {
    terminalOrigin?: string;
    gateOrigin?: string;
    terminalDest?: string;
    gateDest?: string;
    runway?: string;
  };
  history: {
    time: string;
    alt: number;
  }[];
}

export interface Airport {
  name: string;
  iata: string;
  icao: string;
  city: string;
  lat: number;
  lng: number;
  metar?: string;
}

export interface NewsItem {
  id: string;
  text: string;
  type: 'alert' | 'info';
}

export interface Stats {
  tracking: number;
  squawks: number;
  coverage: number;
}