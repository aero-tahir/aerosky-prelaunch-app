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
    typeCode?: string;
    registration: string;
    age: string;
    image: string;
    countryOfReg?: string;
    serialNumber?: string;
    category?: string;
    engines?: string;
    firstFlight?: string;
    registered?: string;
    delivered?: string;
    rollOut?: string;
    lineNumber?: string;
    constructionNumber?: string;
    icao24?: string;
  };
  liveMetrics: {
    altitude: number;
    groundSpeed: number;
    squawk: string;
    heading: number;
    lat: number;
    lng: number;
    vertRate: number;
    track: number;
    sq?: string;
    selectedAltitude?: number;
    tas?: number;
    ias?: number;
    mach?: number;
    roll?: number;
    targetHeading?: number;
    magneticHeading?: number;
    oat?: number;
    windSpeed?: number;
    windDir?: number;
    baro?: number;
    signalConfidence: 'High' | 'Medium' | 'Low';
    operationalStatus: string;
    feederCount: number;
    rssi: number;
    lastUpdate: number;
  };
  service?: {
    type: string;
    classes: string[];
    seats?: number;
    capacity?: string;
    daysOfOperation?: string;
    codeshares?: string[];
  };
  flightInfo?: {
    terminalOrigin?: string;
    gateOrigin?: string;
    terminalDest?: string;
    gateDest?: string;
    runway?: string;
    utcOffsetOrigin?: string;
    utcOffsetDest?: string;
    distanceMi?: number;
    distanceKm?: number;
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
  observing: number;
  squawks: number;
  coverage: number;
}