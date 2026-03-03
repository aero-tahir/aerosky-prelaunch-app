import { Flight, Airport, NewsItem, Stats } from './types';

export const AIRPORTS: Record<string, Airport> = {
  DEL: {
    name: "Indira Gandhi International",
    iata: "DEL",
    icao: "VIDP",
    city: "New Delhi",
    lat: 28.5562,
    lng: 77.1000,
    metar: "Temp: 32°C | Wind: 270° at 5kts | Vis: 10km"
  },
  BOM: {
    name: "Chhatrapati Shivaji Maharaj",
    iata: "BOM",
    icao: "VABB",
    city: "Mumbai",
    lat: 19.0896,
    lng: 72.8656,
    metar: "Temp: 29°C | Wind: 120° at 8kts | Vis: 8km"
  },
  BLR: {
    name: "Kempegowda International",
    iata: "BLR",
    icao: "VOBL",
    city: "Bengaluru",
    lat: 13.1986,
    lng: 77.7066,
    metar: "Temp: 24°C | Wind: 090° at 12kts | Vis: >10km"
  },
  DXB: {
    name: "Dubai International",
    iata: "DXB",
    icao: "OMDB",
    city: "Dubai",
    lat: 25.2532,
    lng: 55.3657,
    metar: "Temp: 38°C | Wind: 300° at 10kts | Vis: 10km"
  },
  MAA: {
    name: "Chennai International",
    iata: "MAA",
    icao: "VOMM",
    city: "Chennai",
    lat: 12.9941,
    lng: 80.1709,
    metar: "Temp: 30°C | Wind: 090° at 10kts | Vis: 9km"
  }
};

export const FLIGHTS: Flight[] = [
  {
    id: "6E554",
    flightNumber: "6E 554",
    airline: "IndiGo",
    airlineCode: "IGO",
    origin: AIRPORTS.DEL,
    destination: AIRPORTS.BOM,
    status: "On Time",
    scheduledDep: "14:00",
    actualDep: "14:05",
    scheduledArr: "16:15",
    estArr: "16:10",
    aircraft: {
      type: "A320neo",
      registration: "VT-IZM",
      age: "2.4 Years",
      image: "https://images.unsplash.com/photo-1542296332-2e44a996aa0d?q=80&w=800&auto=format&fit=crop"
    },
    liveMetrics: {
      altitude: 32000,
      groundSpeed: 450,
      squawk: "3401",
      heading: 205,
      lat: 23.5,
      lng: 74.5,
      vertRate: 0,
      track: 205,
      signalConfidence: 'High',
      operationalStatus: 'En Route',
      feederCount: 8,
      rssi: -12,
      lastUpdate: Date.now() / 1000,
    },
    history: [
      { time: "14:05", alt: 0 },
      { time: "14:15", alt: 15000 },
      { time: "14:25", alt: 32000 },
      { time: "14:35", alt: 32000 },
      { time: "14:45", alt: 32000 }
    ]
  },
  {
    id: "AI101",
    flightNumber: "AI 101",
    airline: "Air India",
    airlineCode: "AIC",
    origin: AIRPORTS.BOM,
    destination: AIRPORTS.DEL,
    status: "Delayed",
    scheduledDep: "08:00",
    actualDep: "08:45",
    scheduledArr: "10:15",
    estArr: "11:00",
    aircraft: {
      type: "B787-8",
      registration: "VT-ANH",
      age: "8.1 Years",
      image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?q=80&w=800&auto=format&fit=crop"
    },
    liveMetrics: {
      altitude: 38000,
      groundSpeed: 490,
      squawk: "1200",
      heading: 25,
      lat: 24.0,
      lng: 75.0,
      vertRate: 0,
      track: 25,
      signalConfidence: 'High',
      operationalStatus: 'En Route',
      feederCount: 6,
      rssi: -18,
      lastUpdate: Date.now() / 1000,
    },
    history: [
      { time: "08:45", alt: 0 },
      { time: "09:00", alt: 20000 },
      { time: "09:15", alt: 38000 }
    ]
  },
  {
    id: "UK992",
    flightNumber: "UK 992",
    airline: "Vistara",
    airlineCode: "UK",
    origin: AIRPORTS.DEL,
    destination: AIRPORTS.BLR,
    status: "In Air",
    scheduledDep: "15:30",
    actualDep: "15:42",
    scheduledArr: "18:10",
    estArr: "18:05",
    aircraft: {
      type: "A321neo",
      registration: "VT-TVC",
      age: "1.2 Years",
      image: "https://images.unsplash.com/photo-1559683935-71ce4117565c?q=80&w=800&auto=format&fit=crop"
    },
    liveMetrics: {
      altitude: 12500,
      groundSpeed: 380,
      squawk: "4521",
      heading: 170,
      lat: 27.5,
      lng: 77.2,
      vertRate: 1200,
      track: 170,
      signalConfidence: 'High',
      operationalStatus: 'Initial Climb',
      feederCount: 10,
      rssi: -8,
      lastUpdate: Date.now() / 1000,
    },
    history: []
  },
  {
    id: "EK500",
    flightNumber: "EK 500",
    airline: "Emirates",
    airlineCode: "UAE",
    origin: AIRPORTS.DXB,
    destination: AIRPORTS.BOM,
    status: "On Time",
    scheduledDep: "14:00",
    actualDep: "14:10",
    scheduledArr: "18:30",
    estArr: "18:25",
    aircraft: {
      type: "B777-300ER",
      registration: "A6-EGV",
      age: "5.5 Years",
      image: "https://images.unsplash.com/photo-1583072558661-8079b764c052?q=80&w=800&auto=format&fit=crop"
    },
    liveMetrics: {
      altitude: 39000,
      groundSpeed: 510,
      squawk: "7102",
      heading: 110,
      lat: 22.0,
      lng: 65.0,
      vertRate: 0,
      track: 110,
      signalConfidence: 'High',
      operationalStatus: 'Cruising',
      feederCount: 4,
      rssi: -22,
      lastUpdate: Date.now() / 1000,
    },
    history: []
  },
  {
    id: "QP132",
    flightNumber: "QP 132",
    airline: "Akasa Air",
    airlineCode: "AKJ",
    origin: AIRPORTS.BLR,
    destination: AIRPORTS.MAA,
    status: "Landing",
    scheduledDep: "16:00",
    actualDep: "16:05",
    scheduledArr: "17:00",
    estArr: "16:55",
    aircraft: {
      type: "B737 MAX 8",
      registration: "VT-YAA",
      age: "0.8 Years",
      image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=800&auto=format&fit=crop"
    },
    liveMetrics: {
      altitude: 4500,
      groundSpeed: 220,
      squawk: "2201",
      heading: 85,
      lat: 12.9,
      lng: 79.5,
      vertRate: -800,
      track: 85,
      signalConfidence: 'Medium',
      operationalStatus: 'Final Approach',
      feederCount: 7,
      rssi: -15,
      lastUpdate: Date.now() / 1000,
    },
    history: []
  },
  {
    id: "SG816",
    flightNumber: "SG 816",
    airline: "SpiceJet",
    airlineCode: "SEJ",
    origin: AIRPORTS.DEL,
    destination: AIRPORTS.DXB,
    status: "Scheduled",
    scheduledDep: "19:00",
    actualDep: "",
    scheduledArr: "22:00",
    estArr: "",
    aircraft: {
      type: "B737-800",
      registration: "VT-SZK",
      age: "12.4 Years",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop"
    },
    liveMetrics: {
      altitude: 0,
      groundSpeed: 0,
      squawk: "",
      heading: 0,
      lat: 28.5562,
      lng: 77.1000,
      vertRate: 0,
      track: 0,
      signalConfidence: 'High',
      operationalStatus: 'Scheduled',
      feederCount: 0,
      rssi: 0,
      lastUpdate: Date.now() / 1000,
    },
    history: []
  }
];

export const NEWS_TICKER: NewsItem[] = [
  { id: '1', text: "Squawk 7700 Alert: AIC453 declaring emergency near DEL.", type: 'alert' },
  { id: '2', text: "High Priority Flight: Vistara UK992 diverting to JAI due to weather.", type: 'info' },
  { id: '3', text: "Airspace Update: Sector 4 congestion easing.", type: 'info' }
];

export const GLOBAL_STATS: Stats = {
  tracking: 4203,
  squawks: 12,
  coverage: 98
};