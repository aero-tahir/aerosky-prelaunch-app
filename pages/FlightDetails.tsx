import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Plane as PlaneIcon, AlertCircle } from 'lucide-react';
import { FLIGHTS } from '../mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const flight = FLIGHTS.find(f => f.id === id);

  if (!flight) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-sky-950 flex items-center justify-center pt-20 px-4">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-slate-400 dark:text-gray-500" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-gray-300">Flight not found</h2>
          <p className="text-slate-500 dark:text-gray-500 text-sm">The flight you're looking for doesn't exist or has been removed.</p>
          <Link to="/explore/map" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium">
            <ArrowLeft size={14} /> Back to Map
          </Link>
        </div>
      </div>
    );
  }

  const isDelayed = flight.status === 'Delayed';
  const statusColor = isDelayed ? 'text-red-500' : 'text-green-500';
  const statusBg = isDelayed ? 'bg-red-500/10 dark:bg-red-500/10' : 'bg-green-500/10 dark:bg-green-500/10';
  const statusBorder = isDelayed ? 'border-red-500/30 dark:border-red-500' : 'border-green-500/30 dark:border-green-500';
  const statusDot = isDelayed ? 'bg-red-500' : 'bg-green-500';
  const statusLabel = isDelayed ? 'Delayed' : flight.status;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-sky-950 pt-20 px-4 md:px-8 pb-20">
      <Link
        to="/explore/map"
        className="inline-flex items-center text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors focus-ring rounded-md px-2 py-1"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Map
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* Airline Badge */}
              <div className="w-8 h-8 bg-slate-200 dark:bg-white rounded-sm flex items-center justify-center text-slate-800 dark:text-black font-bold text-xs">
                {flight.airlineCode}
              </div>
              <h2 className="text-xl text-slate-500 dark:text-gray-400">{flight.airline}</h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter font-mono">
              {flight.flightNumber}
            </h1>
          </div>
          <div className={`px-4 py-2 rounded-full border ${statusBorder} ${statusBg} flex items-center gap-2`} role="status" aria-live="polite">
            <div className={`w-2 h-2 rounded-full ${statusDot} animate-pulse`} aria-hidden="true" />
            <span className={`font-mono font-bold ${statusColor} uppercase tracking-wider`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Status Bar (Hero) - Visual Timeline */}
        <div className="bg-white dark:bg-transparent dark:glass-panel p-8 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center relative z-10">
            {/* Origin */}
            <div className="text-left">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{flight.origin.iata}</div>
              <div className="text-sm text-slate-500 dark:text-gray-400">{flight.origin.city}</div>
              <div className="mt-4 font-mono">
                <div className="text-xs text-slate-400 dark:text-gray-500 uppercase mb-1">Scheduled</div>
                <div className="text-lg text-slate-700 dark:text-white">{flight.scheduledDep}</div>
                <div className="text-xs text-slate-400 dark:text-gray-500 uppercase mt-2 mb-1">Actual</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{flight.actualDep}</div>
              </div>
            </div>

            {/* Timeline Visual */}
            <div className="flex-1 mx-8 md:mx-16 relative" role="img" aria-label={`Flight progress: approximately 65% complete`}>
              {/* Progress Line */}
              <div className="h-1 bg-slate-200 dark:bg-gray-700 w-full absolute top-1/2 -translate-y-1/2 rounded-full" />
              <div
                className={`h-1 ${isDelayed ? 'bg-red-500' : 'bg-green-500'} absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-1000`}
                style={{ width: '65%' }}
              />

              {/* Plane Icon Moving */}
              <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style={{ left: '65%' }}>
                <div className="bg-slate-100 dark:bg-sky-950 p-2 rounded-full border border-slate-300 dark:border-gray-600 shadow-xl">
                  <PlaneIcon size={24} className="text-slate-900 dark:text-white rotate-90" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono text-amber-600 dark:text-yellow-400">
                  {flight.liveMetrics.altitude.toLocaleString()} ft
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="text-right">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{flight.destination.iata}</div>
              <div className="text-sm text-slate-500 dark:text-gray-400">{flight.destination.city}</div>
              <div className="mt-4 font-mono">
                <div className="text-xs text-slate-400 dark:text-gray-500 uppercase mb-1">Scheduled</div>
                <div className="text-lg text-slate-700 dark:text-white">{flight.scheduledArr}</div>
                <div className="text-xs text-slate-400 dark:text-gray-500 uppercase mt-2 mb-1">Estimated</div>
                <div className={`text-lg font-bold ${isDelayed ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{flight.estArr}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aircraft Card */}
          <div className="bg-white dark:bg-transparent dark:glass-panel p-6 rounded-xl border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none">
            <h3 className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Aircraft Details</h3>
            <div className="flex gap-4 items-start">
              <img
                src={flight.aircraft.image}
                alt={`${flight.aircraft.type} aircraft — Registration ${flight.aircraft.registration}`}
                className="w-24 h-24 object-cover rounded-lg border border-slate-200 dark:border-white/10"
              />
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-slate-400 dark:text-gray-500 font-mono">TYPE</div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white">{flight.aircraft.type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-gray-500 font-mono">REGISTRATION</div>
                  <div className="font-mono text-amber-600 dark:text-yellow-400">{flight.aircraft.registration}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-gray-500 font-mono">AGE</div>
                  <div className="text-slate-700 dark:text-white">{flight.aircraft.age}</div>
                </div>
              </div>
            </div>
            {/* Confidence Badge */}
            <div className="mt-6 flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-xs font-mono border border-blue-200 dark:border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
              <span>Tracking Source: ADS-B (Live)</span>
            </div>
          </div>

          {/* Altitude Graph */}
          <div className="bg-white dark:bg-transparent dark:glass-panel p-6 rounded-xl border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none">
            <h3 className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Flight Profile</h3>
            <div className="h-40 w-full" role="img" aria-label="Altitude profile chart showing flight altitude over time">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flight.history}>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-surface-primary)', border: '1px solid var(--color-border-default)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                    itemStyle={{ color: '#F59E0B' }}
                  />
                  <Line type="monotone" dataKey="alt" stroke="#F59E0B" strokeWidth={2} dot={false} />
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
