import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, AlertCircle, Plane as PlaneIcon, Lock, Radio,
  Gauge, Navigation, Wind, Thermometer, BarChart3, Clock,
  MapPin, ArrowUpRight, ArrowDownRight, Compass, Signal,
  Wifi, Calendar, Users, Briefcase, Info, Globe, Activity,
  ShieldAlert, ExternalLink
} from 'lucide-react';
import { FLIGHTS } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { PlanespottersService } from '@/services/PlanespottersService';
import { getIndianAirspaceContext, getFlightPhase, generatePilotReport, getFeederStatus } from '@/lib/OperationalIntelligence';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/* ── Reusable data row ── */
const Row: React.FC<{
  label: string; value?: string | number; mono?: boolean;
  locked?: boolean; unit?: string;
}> = ({ label, value, mono, locked, unit }) => (
  <div className="flex items-center justify-between py-[7px] border-b border-slate-100 dark:border-white/[0.04] last:border-0">
    <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-white/30 font-semibold">{label}</span>
    {locked ? (
      <span className="flex items-center gap-1 text-slate-300 dark:text-white/[0.12]">
        <Lock size={10} /><span className="text-[10px]">Login</span>
      </span>
    ) : (
      <span className={`text-[11px] sm:text-xs font-bold text-slate-800 dark:text-white/80 ${mono ? 'font-mono' : ''}`}>
        {value ?? '—'}{unit && <span className="text-slate-400 dark:text-white/25 font-normal ml-0.5">{unit}</span>}
      </span>
    )}
  </div>
);

/* ── Section card ── */
const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/[0.05] overflow-hidden ${className}`}>
    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/[0.04]">
      <h3 className="text-[10px] sm:text-[11px] font-black text-slate-500 dark:text-white/30 uppercase tracking-[0.12em]">{title}</h3>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const flight = FLIGHTS.find(f => f.id === id);
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    if (!flight) return;
    const r = flight.aircraft.registration;
    if (r && r !== 'N/A') PlanespottersService.fetchPhoto(r).then(u => { if (u) setImg(u); });
  }, [flight?.id]);

  if (!flight) return (
    <div className="min-h-screen bg-slate-50 dark:bg-sky-950 flex items-center justify-center pt-20 px-4">
      <div className="text-center space-y-3">
        <AlertCircle size={40} className="mx-auto text-slate-400" />
        <h2 className="text-base font-bold text-slate-700 dark:text-gray-300">Flight not found</h2>
        <Link to="/explore/map" className="inline-flex items-center gap-1.5 text-amber-500 text-sm"><ArrowLeft size={14} /> Back to Map</Link>
      </div>
    </div>
  );

  const m = flight.liveMetrics;
  const ac = flight.aircraft;
  const svc = flight.service;
  const fi = flight.flightInfo;
  const isDel = flight.status === 'Delayed';
  const phase = getFlightPhase(flight);
  const intel = getIndianAirspaceContext(flight);
  const briefing = generatePilotReport(flight);
  const feeder = getFeederStatus(flight);
  const vr = m.vertRate || 0;

  const phases = [
    { l: 'Departed', on: ['TAKEOFF','CLIMB','CRUISE','TOD','APPROACH','FINAL','EN_ROUTE'].includes(phase.phase) },
    { l: 'Cruise', on: ['CRUISE','TOD','APPROACH','FINAL'].includes(phase.phase) },
    { l: 'Approach', on: ['APPROACH','FINAL'].includes(phase.phase) },
    { l: 'Landing', on: phase.phase === 'FINAL' },
  ];

  const depDelta = flight.actualDep && flight.scheduledDep
    ? (() => { const [sh,sm] = flight.scheduledDep.split(':').map(Number); const [ah,am] = flight.actualDep.split(':').map(Number); const d = (ah*60+am)-(sh*60+sm); return d; })()
    : null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b16] pt-14 sm:pt-16 md:pt-20 pb-12">
      <div className="max-w-lg mx-auto px-3 sm:px-4">

        <Link to="/explore/map" className="inline-flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white mb-3 text-xs gap-1">
          <ArrowLeft size={13} /> Back to Map
        </Link>

        {/* ═══ HEADER: Flight ID ═══ */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <PlaneIcon size={20} className="text-amber-500 -rotate-45" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">{flight.flightNumber}</h1>
              <span className="text-[9px] font-bold text-slate-400 dark:text-white/25 bg-slate-200 dark:bg-white/[0.05] px-1.5 py-0.5 rounded font-mono">{flight.airlineCode}</span>
              {ac.typeCode && <span className="text-[9px] font-bold text-slate-400 dark:text-white/25 bg-slate-200 dark:bg-white/[0.05] px-1.5 py-0.5 rounded font-mono">{ac.typeCode}</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-white/40">{flight.airline}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border flex items-center gap-1 ${isDel ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDel ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {flight.status}
            </span>
          </div>
        </div>

        <div className="space-y-3">

          {/* ═══ STATUS INFO ═══ */}
          <Section title="Status Info">
            {/* Route row */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none">{flight.origin.iata}</div>
                <div className="text-[10px] text-slate-400 dark:text-white/30 font-mono">{flight.actualDep || flight.scheduledDep}</div>
                {depDelta !== null && (
                  <div className={`text-[9px] font-bold mt-0.5 ${depDelta <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {depDelta <= 0 ? `${Math.abs(depDelta)}m Early` : `${depDelta}m Late`} · {flight.actualDep}
                  </div>
                )}
              </div>
              <div className="flex-1 mx-4 relative">
                <div className="h-[3px] bg-slate-200 dark:bg-white/[0.06] rounded-full" />
                <div className={`h-[3px] absolute top-0 left-0 rounded-full ${isDel ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: phase.phase === 'FINAL' ? '95%' : phase.phase === 'APPROACH' ? '80%' : ['CRUISE','TOD'].includes(phase.phase) ? '55%' : '20%' }} />
                <div className="absolute top-1/2 -translate-y-1/2" style={{ left: phase.phase === 'FINAL' ? '95%' : phase.phase === 'APPROACH' ? '80%' : ['CRUISE','TOD'].includes(phase.phase) ? '55%' : '20%' }}>
                  <PlaneIcon size={14} className="text-slate-700 dark:text-white rotate-90 -translate-x-1/2 drop-shadow" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none">{flight.destination.iata}</div>
                <div className="text-[10px] text-slate-400 dark:text-white/30 font-mono">{flight.estArr || flight.scheduledArr}</div>
              </div>
            </div>
            {/* Distance */}
            {fi?.distanceMi && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-white/25 mb-3">
                <span>{fi.distanceMi.toLocaleString()} mi · {fi.distanceKm?.toLocaleString()} km</span>
              </div>
            )}
            {/* Phase stepper */}
            <div className="grid grid-cols-4 gap-1 mb-3">
              {phases.map(p => (
                <div key={p.l}>
                  <div className={`h-[3px] rounded-full ${p.on ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/[0.05]'}`} />
                  <div className={`text-[7px] font-black uppercase text-center mt-1 ${p.on ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-300 dark:text-white/10'}`}>{p.l}</div>
                </div>
              ))}
            </div>
            {/* Airport details */}
            <div className="space-y-2.5">
              {[
                { ap: flight.origin, term: fi?.terminalOrigin, utc: fi?.utcOffsetOrigin, dep: flight.actualDep || flight.scheduledDep },
                { ap: flight.destination, term: fi?.terminalDest, utc: fi?.utcOffsetDest, dep: flight.estArr || flight.scheduledArr },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-t border-slate-100 dark:border-white/[0.04]">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mt-0.5">
                    <MapPin size={13} className="text-slate-400 dark:text-white/25" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-white/80">{a.ap.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-white/30">{a.ap.city}</div>
                    {a.term && <div className="text-[10px] text-slate-400 dark:text-white/25">Terminal {a.term}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-slate-600 dark:text-white/50">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                    {a.utc && <div className="text-[9px] text-slate-400 dark:text-white/20">{a.utc}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══ AIRCRAFT INFO ═══ */}
          <Section title="Aircraft Info">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{ac.type}</div>
                <div className="text-[10px] text-slate-400 dark:text-white/30 uppercase">{flight.airline}</div>
              </div>
            </div>
            {/* Aircraft photo */}
            <div className="relative rounded-xl overflow-hidden mb-3 h-40 sm:h-48">
              <img src={img || ac.image} alt={`${ac.type} ${ac.registration}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-[10px] text-white/70">© Planespotters</span>
              </div>
            </div>
            {/* Aircraft data grid */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-0">
              <Row label="Registration" value={ac.registration} mono />
              <Row label="Type Code" value={ac.typeCode} mono />
              <Row label="ADSHEX" value={ac.icao24} mono locked={L} />
              <Row label="Engine(s)" value={ac.engines} locked={L} />
              <Row label="Age" value={ac.age} />
              <Row label="First Flight" value={ac.firstFlight} locked={L} />
              <Row label="Registered" value={ac.registered} locked={L} />
              <Row label="Delivered" value={ac.delivered} locked={L} />
              <Row label="Roll Out" value={ac.rollOut} locked={L} />
              <Row label="Construction" value={ac.constructionNumber || ac.serialNumber} mono locked={L} />
              <Row label="Line No." value={ac.lineNumber} mono locked={L} />
              <Row label="Country" value={ac.countryOfReg} locked={L} />
            </div>
          </Section>

          {/* ═══ LIVE DATA ═══ */}
          <Section title="Live Data">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <Row label="Altitude" value={m.altitude > 0 ? m.altitude.toLocaleString() : '—'} unit="ft" mono />
              <Row label="Speed" value={m.groundSpeed} unit="kts" mono />
              <Row label="Course" value={`${m.track}°`} mono />
              <Row label="Squawk" value={m.squawk || '—'} mono />
              <Row label="Vert Rate" value={`${vr > 0 ? '+' : ''}${vr}`} unit="fpm" mono />
              <Row label="Selected Alt" value={m.selectedAltitude?.toLocaleString()} unit="ft" mono locked={L} />
              <Row label="TAS" value={m.tas} unit="kts" mono locked={L} />
              <Row label="IAS" value={m.ias} unit="kts" mono locked={L} />
              <Row label="GS" value={m.groundSpeed} unit="kts" mono />
              <Row label="MACH" value={m.mach} mono locked={L} />
              <Row label="Track" value={`${m.track}°`} mono />
              <Row label="Roll" value={m.roll !== undefined ? `${m.roll}°` : undefined} mono locked={L} />
              <Row label="Target" value={m.targetHeading !== undefined ? `${m.targetHeading}°` : undefined} mono locked={L} />
              <Row label="Magnetic" value={m.magneticHeading !== undefined ? `${m.magneticHeading}°` : undefined} mono locked={L} />
            </div>
          </Section>

          {/* ═══ ENVIRONMENT ═══ */}
          <Section title="Environment">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <Row label="Air Temp" value={m.oat !== undefined ? `${m.oat}` : undefined} unit="°C" mono locked={L} />
              <Row label="Barometer" value={m.baro} unit="hPa" mono locked={L} />
              <Row label="Wind Speed" value={m.windSpeed} unit="kts" mono locked={L} />
              <Row label="Wind Direction" value={m.windDir !== undefined ? `${m.windDir}°` : undefined} mono locked={L} />
            </div>
          </Section>

          {/* ═══ FLIGHT INFO ═══ */}
          <Section title="Flight Info">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {svc?.daysOfOperation && <Row label="Days of Operation" value={svc.daysOfOperation} />}
              <Row label="Service Type" value={svc?.type || 'Passenger'} locked={L} />
              <Row label="Seats" value={svc?.seats} locked={L} />
              {svc?.capacity && <Row label="Capacity" value={svc.capacity} locked={L} />}
              <Row label="Passenger Classes" value={svc?.classes?.join(', ')} locked={L} />
              {svc?.codeshares && svc.codeshares.length > 0 && <Row label="Codeshares" value={svc.codeshares.join(', ')} mono locked={L} />}
            </div>
          </Section>

          {/* ═══ INTELLIGENCE BRIEF ═══ */}
          <Section title="Intelligence Brief" className="border-cyan-200 dark:border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1 rounded-md bg-cyan-50 dark:bg-white/5 border border-cyan-200 dark:border-cyan-500/20 ${phase.color}`}>{phase.icon}</div>
              <div>
                <div className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  {phase.humanLabel} <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                </div>
                <div className="text-[9px] text-slate-400 dark:text-white/25">{intel.fir.name}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-white/50 leading-relaxed italic mb-2">"{briefing}"</p>
            {intel.alerts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {intel.alerts.map((a, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-[8px] font-black rounded uppercase">{a}</span>
                ))}
              </div>
            )}
          </Section>

          {/* ═══ SOVEREIGN CONTEXT ═══ */}
          <Section title="Sovereign Context">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              <Row label="FIR Sector" value={intel.fir.name} />
              <Row label="Frequency" value={intel.fir.freq} mono />
              <Row label="Squawk" value={m.squawk || '—'} mono />
              <Row label="Track" value={`${m.track || 0}°`} mono />
              <Row label="Mode S" value={flight.id.slice(0, 6).toUpperCase()} mono />
              <Row label="Station ID" value="VIDP-FDR-01" mono />
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity size={10} className="text-cyan-500" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-white/35 uppercase">{feeder.text}</span>
              </div>
              <span className={`px-1.5 py-0.5 text-[8px] font-black rounded border uppercase ${
                feeder.quality === 'excellent' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                : feeder.quality === 'good' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
              }`}>{feeder.quality}</span>
            </div>
          </Section>

          {/* ═══ ALTITUDE PROFILE ═══ */}
          {flight.history.length > 0 && (
            <Section title="Flight Timeline">
              <div className="h-36 sm:h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={flight.history}>
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="alt" stroke="#F59E0B" strokeWidth={2} dot={false} name="Alt (ft)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>
          )}

          {/* ═══ DATA SOURCE ═══ */}
          <Section title="Data Source (ADS-B)">
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-white/40 leading-relaxed mb-2">
              This flight is currently being tracked by our network of ADS-B receivers across Indian airspace.
            </p>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/10 rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">{m.feederCount} receivers · {m.operationalStatus}</span>
            </div>
            {L && (
              <div className="mt-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-lg px-3 py-2 flex items-center gap-2">
                <Lock size={11} className="text-amber-500 shrink-0" />
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">Sign in to unlock full data — speed, environment, aircraft history & service info</span>
              </div>
            )}
          </Section>

        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
