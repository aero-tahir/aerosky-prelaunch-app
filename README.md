# ✈️ AeroSky

**Real-time flight visibility and aviation intelligence platform for Indian airspace.**

AeroSky is a modern web application that provides live flight visibility, airport intelligence, coverage mapping, and aviation data analytics with an India-first focus.

## Features

- **Live Flight Map**: Real-time aircraft visibility on an interactive map powered by MapLibre GL with multiple base layer styles (satellite, hybrid, light, dark)
- **Flight Details**: Detailed telemetry including altitude, ground speed, heading, vertical rate, squawk codes, and flight path history
- **Airport Hub**: Airport-level intelligence with arrivals, departures, and operational data
- **Intelligence Dashboard**: Aircraft, airline, and airport analytics
- **Coverage Map**: Ground station and ADS-B coverage visualization
- **Data & API**: Aviation data access and API documentation

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Routing** | React Router v7 |
| **Maps** | MapLibre GL + react-map-gl (Ola Maps tiles) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Data** | OpenSky Network API, Planespotters API |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- An [Ola Maps](https://maps.olacabs.com/) API key

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_OLA_MAP_API_KEY=YOUR_OLA_MAP_API_KEY
clientId=YOUR_CLIENT_ID
clientSecret=YOUR_CLIENT_SECRET
```

### Run Locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
aerosky-ui-app/
├── components/         # Shared UI components
│   ├── Layout.tsx          # App shell (nav, footer)
│   ├── MapComponent.tsx    # Reusable map wrapper
│   └── MapBackground.tsx   # Decorative map background
├── pages/              # Route-level pages
│   ├── Home.tsx            # Landing page
│   ├── LiveMap.tsx         # Real-time flight visibility map
│   ├── FlightDetails.tsx   # Individual flight view
│   ├── AirportHub.tsx      # Airport intelligence
│   ├── Intelligence.tsx    # Data analytics dashboard
│   ├── Coverage.tsx        # ADS-B coverage map
│   ├── DataApi.tsx         # API documentation
│   └── GenericContent.tsx  # Template for upcoming sections
├── services/           # External API integrations
│   ├── OpenSkyService.ts       # OpenSky Network API
│   └── PlanespottersService.ts # Aircraft images API
├── contexts/           # React context providers
├── utils/              # Helper functions
├── types.ts            # TypeScript type definitions
├── App.tsx             # Root component & routing
├── index.tsx           # Entry point
├── index.html          # HTML shell
└── vite.config.ts      # Vite configuration
```

## Demo Flights (with track data)

These 5 flights have pre-built track waypoints for demo. Select them on the map or search to see the flight path polyline.

| Flight | Airline | Route | Registration | Aircraft | Status |
|--------|---------|-------|--------------|----------|--------|
| 6E 554 | IndiGo | DEL → BOM | VT-IZM | Airbus A320neo | On Time |
| AI 101 | Air India | BOM → DEL | VT-ANH | Boeing 787-8 Dreamliner | Delayed |
| UK 992 | Vistara | DEL → BLR | VT-TVC | Airbus A321neo | In Air |
| EK 500 | Emirates | DXB → BOM | A6-EGV | Boeing 777-300ER | On Time |
| QP 132 | Akasa Air | BLR → MAA | VT-YAA | Boeing 737 MAX 8 | Landing |

## License

Private: AeroLytics © 2025
