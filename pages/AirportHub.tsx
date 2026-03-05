import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Cloud, Wind, Eye, PlaneTakeoff, PlaneLanding, AlertCircle, ArrowLeft } from 'lucide-react';
import { AIRPORTS, FLIGHTS } from '../mockData';
import MapBackground from '../components/MapBackground';

const AirportHub: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const airport = AIRPORTS[code || 'DEL'];
  const [tab, setTab] = useState<'arrivals' | 'departures'>('departures');

  if (!airport) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-sky-950 flex items-center justify-center pt-20 px-4">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-slate-400 dark:text-gray-500" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-gray-300">Airport Not Found</h2>
          <p className="text-slate-500 dark:text-gray-500 text-sm">The airport you're looking for doesn't exist in our database.</p>
          <Link to="/intelligence?tab=airports" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium">
            <ArrowLeft size={14} /> Browse Airports
          </Link>
        </div>
      </div>
    );
  }

  // Filter flights for table
  const relevantFlights = FLIGHTS.filter(f =>
    tab === 'departures' ? f.origin.iata === airport.iata : f.destination.iata === airport.iata
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-sky-950 pb-20 pt-20">
      {/* Hero Section */}
      <div className="px-6 md:px-12 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
          <div>
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white">{airport.iata}</h1>
              <span className="text-2xl text-slate-400 dark:text-gray-400 font-mono">{airport.icao}</span>
            </div>
            <h2 className="text-xl md:text-2xl text-slate-600 dark:text-gray-300">{airport.name}</h2>
            <p className="text-slate-500 dark:text-gray-500">{airport.city}, India</p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* Congestion Gauge */}
            <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center">
              <div className="text-xs text-slate-500 dark:text-gray-400 uppercase mb-2 font-medium">Congestion Index</div>
              <div className="relative w-32 h-16 overflow-hidden" role="meter" aria-label="Airport congestion level" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                {/* Gauge Arc Background */}
                <svg viewBox="0 0 120 60" className="w-full h-full">
                  {/* Background arc */}
                  <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-slate-200 dark:text-gray-700" />
                  {/* Gradient arc */}
                  <defs>
                    <linearGradient id="gauge-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="50%" stopColor="#FACC15" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="url(#gauge-gradient)" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                  {/* Needle — positioned at 25% (Low Traffic) */}
                  <line x1="60" y1="55" x2="30" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-600 dark:text-white" />
                  {/* Center dot */}
                  <circle cx="60" cy="55" r="4" fill="currentColor" className="text-slate-600 dark:text-white" />
                </svg>
              </div>
              <div className="mt-1 font-bold text-green-600 dark:text-green-400 text-sm">Low Traffic</div>
            </div>
          </div>
        </div>

        {/* METAR Strip */}
        <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 flex flex-wrap items-center gap-6 text-sm font-mono text-blue-700 dark:text-blue-200" role="region" aria-label="Current weather conditions">
          <div className="font-bold bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded text-blue-800 dark:text-blue-200">METAR</div>
          <div className="flex items-center gap-2"><Cloud size={14} aria-hidden="true" /> <span>32°C</span></div>
          <div className="flex items-center gap-2"><Wind size={14} aria-hidden="true" /> <span>270° at 5kts</span></div>
          <div className="flex items-center gap-2"><Eye size={14} aria-hidden="true" /> <span>10km</span></div>
          <div className="text-xs text-blue-400 dark:text-blue-400/50 ml-auto">Updated 5 mins ago</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-12">
        {/* Main FIDS Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4" role="tablist" aria-label="Flight board view">
            <button
              onClick={() => setTab('departures')}
              role="tab"
              aria-selected={tab === 'departures'}
              aria-controls="fids-panel"
              className={`flex-1 py-4 text-center rounded-xl font-bold text-lg border transition-all focus-ring ${tab === 'departures'
                  ? 'bg-amber-400 dark:bg-yellow-400 text-slate-900 dark:text-black border-amber-400 dark:border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PlaneTakeoff size={24} aria-hidden="true" /> DEPARTURES
              </div>
            </button>
            <button
              onClick={() => setTab('arrivals')}
              role="tab"
              aria-selected={tab === 'arrivals'}
              aria-controls="fids-panel"
              className={`flex-1 py-4 text-center rounded-xl font-bold text-lg border transition-all focus-ring ${tab === 'arrivals'
                  ? 'bg-amber-400 dark:bg-yellow-400 text-slate-900 dark:text-black border-amber-400 dark:border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PlaneLanding size={24} aria-hidden="true" /> ARRIVALS
              </div>
            </button>
          </div>

          <div id="fids-panel" role="tabpanel" aria-label={`${tab === 'departures' ? 'Departures' : 'Arrivals'} board`} className="bg-white dark:bg-transparent dark:glass-panel rounded-xl overflow-hidden min-h-[400px] border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-black/40 text-slate-500 dark:text-gray-500 text-xs uppercase font-mono border-b border-slate-200 dark:border-white/10">
                    <th className="p-4" scope="col">Time</th>
                    <th className="p-4" scope="col">Flight</th>
                    <th className="p-4" scope="col">{tab === 'departures' ? 'Destination' : 'Origin'}</th>
                    <th className="p-4" scope="col">Status</th>
                    <th className="p-4" scope="col">Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {relevantFlights.map(flight => (
                    <tr key={flight.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-mono text-sm">
                      <td className="p-4 text-slate-900 dark:text-white font-bold">{tab === 'departures' ? flight.scheduledDep : flight.scheduledArr}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600 dark:text-yellow-400">{flight.flightNumber}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-white">{tab === 'departures' ? flight.destination.city : flight.origin.city}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 ${flight.status === 'Delayed' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${flight.status === 'Delayed' ? 'bg-red-500' : 'bg-green-500'}`} aria-hidden="true" />
                          {flight.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 dark:text-gray-400">A12</td>
                    </tr>
                  ))}
                  {/* Placeholder rows for visual density */}
                  {[1, 2, 3, 4].map(i => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-mono text-sm opacity-50">
                      <td className="p-4 text-slate-600 dark:text-white">1{i + 4}:00</td>
                      <td className="p-4 text-amber-600 dark:text-yellow-400">6E {300 + i}</td>
                      <td className="p-4 text-slate-500 dark:text-white">Bengaluru</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                          Scheduled
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 dark:text-gray-400">B0{i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Airport Map */}
        <div className="h-[400px] lg:h-auto rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative shadow-sm dark:shadow-none">
          <MapBackground
            interactive={false}
            showFlights={false}
            showAirports={false}
            zoom={12}
            center={{ lat: airport.lat, lng: airport.lng }}
          />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 px-3 py-1 rounded text-xs font-mono border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white">
            Live Ground Map
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportHub;
