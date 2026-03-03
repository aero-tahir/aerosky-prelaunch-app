import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Plane as PlaneIcon } from 'lucide-react';
import { FLIGHTS } from '../mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const flight = FLIGHTS.find(f => f.id === id);

  if (!flight) {
    return <div className="p-10 text-center text-white">Flight not found</div>;
  }

  const isDelayed = flight.status === 'Delayed';
  const statusColor = isDelayed ? 'text-red-500' : 'text-green-500';
  const bgStatus = isDelayed ? 'bg-red-500/10' : 'bg-green-500/10';

  return (
    <div className="min-h-screen bg-sky-950 pt-20 px-4 md:px-8 pb-20">
      <Link to="/explore/map" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Map
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
               {/* Logo Placeholder */}
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-black font-bold text-xs">
                {flight.airlineCode}
              </div>
              <h2 className="text-xl text-gray-400">{flight.airline}</h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter font-mono">
              {flight.flightNumber}
            </h1>
          </div>
          <div className={`px-4 py-2 rounded-full border ${isDelayed ? 'border-red-500' : 'border-green-500'} ${bgStatus} flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full ${isDelayed ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            <span className={`font-mono font-bold ${statusColor} uppercase tracking-wider`}>
              {flight.status}
            </span>
          </div>
        </div>

        {/* Status Bar (Hero) - Visual Timeline */}
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            {/* Origin */}
            <div className="text-left">
              <div className="text-4xl font-bold mb-1">{flight.origin.iata}</div>
              <div className="text-sm text-gray-400">{flight.origin.city}</div>
              <div className="mt-4 font-mono">
                <div className="text-xs text-gray-500 uppercase mb-1">Scheduled</div>
                <div className="text-lg">{flight.scheduledDep}</div>
                <div className="text-xs text-gray-500 uppercase mt-2 mb-1">Actual</div>
                <div className="text-lg font-bold text-white">{flight.actualDep}</div>
              </div>
            </div>

            {/* Timeline Visual */}
            <div className="flex-1 mx-8 md:mx-16 relative">
              {/* Progress Line */}
              <div className="h-1 bg-gray-700 w-full absolute top-1/2 -translate-y-1/2 rounded-full" />
              <div 
                className={`h-1 ${isDelayed ? 'bg-red-500' : 'bg-green-500'} absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-1000`} 
                style={{ width: '65%' }} 
              />
              
              {/* Plane Icon Moving */}
              <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style={{ left: '65%' }}>
                 <div className="bg-sky-950 p-2 rounded-full border border-gray-600 shadow-xl">
                   <PlaneIcon size={24} className="text-white rotate-90" />
                 </div>
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono text-yellow-400">
                    {flight.liveMetrics.altitude.toLocaleString()} ft
                 </div>
              </div>
            </div>

            {/* Destination */}
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{flight.destination.iata}</div>
              <div className="text-sm text-gray-400">{flight.destination.city}</div>
              <div className="mt-4 font-mono">
                <div className="text-xs text-gray-500 uppercase mb-1">Scheduled</div>
                <div className="text-lg">{flight.scheduledArr}</div>
                <div className="text-xs text-gray-500 uppercase mt-2 mb-1">Estimated</div>
                <div className={`text-lg font-bold ${isDelayed ? 'text-red-400' : 'text-green-400'}`}>{flight.estArr}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aircraft Card */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Aircraft Details</h3>
            <div className="flex gap-4 items-start">
              <img src={flight.aircraft.image} alt="Aircraft" className="w-24 h-24 object-cover rounded-lg border border-white/10" />
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 font-mono">TYPE</div>
                  <div className="font-bold text-lg">{flight.aircraft.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">REGISTRATION</div>
                  <div className="font-mono text-yellow-400">{flight.aircraft.registration}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">AGE</div>
                  <div>{flight.aircraft.age}</div>
                </div>
              </div>
            </div>
            {/* Confidence Badge */}
            <div className="mt-6 flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-2 rounded-lg text-xs font-mono border border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Tracking Source: ADS-B (Live)
            </div>
          </div>

          {/* Altitude Graph */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Flight Profile</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flight.history}>
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#FACC15' }}
                  />
                  <Line type="monotone" dataKey="alt" stroke="#FACC15" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
