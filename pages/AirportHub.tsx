import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cloud, Wind, Eye, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { AIRPORTS, FLIGHTS } from '../mockData';
import MapBackground from '../components/MapBackground';

const AirportHub: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const airport = AIRPORTS[code || 'DEL'];
  const [tab, setTab] = useState<'arrivals' | 'departures'>('departures');

  if (!airport) return <div>Airport Not Found</div>;

  // Filter flights for dummy table
  const relevantFlights = FLIGHTS.filter(f => 
    tab === 'departures' ? f.origin.iata === airport.iata : f.destination.iata === airport.iata
  );

  return (
    <div className="min-h-screen bg-sky-950 pb-20 pt-20">
      {/* Hero Section */}
      <div className="px-6 md:px-12 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
          <div>
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-5xl font-bold text-white">{airport.iata}</h1>
              <span className="text-2xl text-gray-400 font-mono">{airport.icao}</span>
            </div>
            <h2 className="text-xl md:text-2xl text-gray-300">{airport.name}</h2>
            <p className="text-gray-500">{airport.city}, India</p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* Simple Gauge */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <div className="text-xs text-gray-400 uppercase mb-2">Congestion Index</div>
              <div className="relative w-32 h-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-t-full" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-t-full opacity-30" />
                <div className="absolute bottom-0 left-1/2 w-1 h-full bg-white origin-bottom rotate-[-45deg]" style={{transformOrigin: 'bottom center'}} />
              </div>
              <div className="mt-1 font-bold text-green-400">Low Traffic</div>
            </div>
          </div>
        </div>

        {/* METAR Strip */}
        <div className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 flex flex-wrap items-center gap-6 text-sm font-mono text-blue-200">
          <div className="font-bold bg-blue-500/20 px-2 py-1 rounded">METAR</div>
          <div className="flex items-center gap-2"><Cloud size={14}/> 32°C</div>
          <div className="flex items-center gap-2"><Wind size={14}/> 270° at 5kts</div>
          <div className="flex items-center gap-2"><Eye size={14}/> 10km</div>
          <div className="text-xs text-blue-400/50 ml-auto">Updated 5 mins ago</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-12">
        {/* Main FIDS Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={() => setTab('departures')}
              className={`flex-1 py-4 text-center rounded-xl font-bold text-lg border transition-all ${
                tab === 'departures' 
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PlaneTakeoff size={24} /> DEPARTURES
              </div>
            </button>
            <button 
              onClick={() => setTab('arrivals')}
              className={`flex-1 py-4 text-center rounded-xl font-bold text-lg border transition-all ${
                tab === 'arrivals' 
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PlaneLanding size={24} /> ARRIVALS
              </div>
            </button>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden min-h-[400px]">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-black/40 text-gray-500 text-xs uppercase font-mono border-b border-white/10">
                   <th className="p-4">Time</th>
                   <th className="p-4">Flight</th>
                   <th className="p-4">Destination</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Gate</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {relevantFlights.map(flight => (
                   <tr key={flight.id} className="hover:bg-white/5 transition-colors font-mono text-sm">
                     <td className="p-4 text-white font-bold">{tab === 'departures' ? flight.scheduledDep : flight.scheduledArr}</td>
                     <td className="p-4">
                       <div className="flex items-center gap-2">
                         <span className="text-yellow-400">{flight.flightNumber}</span>
                       </div>
                     </td>
                     <td className="p-4">{tab === 'departures' ? flight.destination.city : flight.origin.city}</td>
                     <td className="p-4">
                       <span className={flight.status === 'Delayed' ? 'text-red-400' : 'text-green-400'}>
                         {flight.status}
                       </span>
                     </td>
                     <td className="p-4 text-gray-400">A12</td>
                   </tr>
                 ))}
                 {/* Empty State Fills */}
                 {[1,2,3,4].map(i => (
                   <tr key={i} className="hover:bg-white/5 transition-colors font-mono text-sm opacity-50">
                     <td className="p-4 text-white">1{i+4}:00</td>
                     <td className="p-4 text-yellow-400">6E {300+i}</td>
                     <td className="p-4">Bengaluru</td>
                     <td className="p-4 text-green-400">Scheduled</td>
                     <td className="p-4 text-gray-400">B0{i}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Airport Map */}
        <div className="h-[400px] lg:h-auto rounded-xl overflow-hidden border border-white/10 relative">
          <MapBackground 
            interactive={false} 
            showFlights={false} 
            showAirports={false}
            zoom={12}
            center={{ lat: airport.lat, lng: airport.lng }}
          />
          <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded text-xs font-mono border border-white/20">
            Live Ground Map
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportHub;
