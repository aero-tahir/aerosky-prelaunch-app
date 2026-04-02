import React, { useState, useEffect } from 'react';
import {
  Plane, Globe, Signal, Activity, Wind, Thermometer,
  Gauge, Compass, Navigation, Radio, Lock, ChevronDown,
  ChevronRight, Shield, Clock, MapPin, Wifi,
  Route, Crosshair, Share2, MoreHorizontal, PlayCircle, EyeOff
} from 'lucide-react';
import type { Flight } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  getIndianAirspaceContext, getFlightPhase,
  generatePilotReport, getFeederStatus
} from '@/lib/OperationalIntelligence';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';

const f = (v: number | undefined, d = 1) => v !== undefined ? parseFloat(v.toFixed(d)) : undefined;
const ri = (v: number | undefined) => v !== undefined ? Math.round(v) : undefined;
const dir = (t: number) => t > 315 || t < 45 ? 'N' : t < 135 ? 'E' : t < 225 ? 'S' : 'W';

/* ── Collapsible ── */
const Fold: React.FC<{
  title: string; icon: React.ReactNode; open?: boolean;
  locked?: boolean; accent?: string; children: React.ReactNode;
}> = ({ title, icon, open: init = false, locked, accent, children }) => {
  const [open, setOpen] = useState(init);
  return (
    <div
      className={`border-t ${COLOR.divider}`}
      style={open && accent ? { borderLeftWidth: '2px', borderLeftColor: accent } : undefined}
    >
      <button onClick={() => !locked && setOpen(p => !p)} className={`w-full flex items-center gap-2 ${SPACE.pad} text-left group transition-colors ${open && !locked ? `${COLOR.subtleBg}` : ''}`}>
        <span style={open && accent ? { color: accent } : undefined} className={open && accent ? '' : COLOR.inactiveText}>{icon}</span>
        <span className={`flex-1 ${TEXT.sectionTitle} transition-colors ${open && !locked ? COLOR.titleActiveText : COLOR.titleText}`}>{title}</span>
        {locked
          ? <Lock size={11} className={COLOR.lockedText} />
          : <span className={`${COLOR.inactiveText} group-hover:${COLOR.labelText}`}>{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
        }
      </button>
      {open && !locked && <div className={`${SPACE.px} pb-2.5 sm:pb-3`}>{children}</div>}
    </div>
  );
};

/* ── Row ── */
const Row: React.FC<{ l: string; v?: string | number; locked?: boolean }> = ({ l, v, locked }) => (
  <div className={`flex items-center justify-between ${SPACE.rowPy}`}>
    <span className={`${TEXT.label} ${COLOR.labelText}`}>{l}</span>
    {locked
      ? <span className={`flex items-center gap-1 ${COLOR.lockedText}`}><Lock size={10} /><span className={TEXT.sub}>Login</span></span>
      : <span className={`${TEXT.value} ${COLOR.valueText}`}>{v ?? '—'}</span>
    }
  </div>
);

interface Props { flight: Flight | undefined; flightImage: string | null; }

const FlightIntelligenceCard: React.FC<Props> = ({ flight, flightImage }) => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hideOthers, setHideOthers] = useState(false);
  const imgSrc = flightImage || flight?.aircraft?.image || '';

  // Reset image state when source changes
  useEffect(() => { setImgLoaded(false); setImgError(false); }, [imgSrc]);

  if (!flight) return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-white/20 p-6 sm:p-8 space-y-3">
      <Plane size={36} className="opacity-15 animate-bounce" />
      <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Select a flight</p>
    </div>
  );

  const m = flight.liveMetrics;
  const ac = flight.aircraft;
  const phase = getFlightPhase(flight);
  const briefing = generatePilotReport(flight);
  const intel = getIndianAirspaceContext(flight);
  const feeder = getFeederStatus(flight);
  const vr = m.vertRate || 0;
  const vrLabel = Math.abs(vr) < 100 ? 'Stable' : vr > 0 ? 'Climbing' : 'Descending';
  const windImpact = (m.windSpeed || 0) > 30 ? `+${Math.round((m.windSpeed || 0) / 10)} min` : 'Minimal';
  const pct = phase.phase === 'FINAL' ? 95 : phase.phase === 'APPROACH' ? 80 : ['CRUISE','TOD'].includes(phase.phase) ? 62 : 20;
  const isDelayed = flight.status === 'Delayed';

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ═══ HEADER: Flight Identity ═══ */}
      <div className={`${SPACE.pad} bg-white dark:bg-transparent border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <h1 className={`${TEXT.heroTitle} text-slate-900 dark:text-white leading-none`}>{flight.flightNumber}</h1>
              <span className={`${TEXT.sub} font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white/30`}>{flight.airlineCode}</span>
              {ac.typeCode && <span className={`${TEXT.sub} font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white/30`}>{ac.typeCode}</span>}
            </div>
            <p className={`${TEXT.sub} ${COLOR.labelText}`}>{flight.airline}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`px-1.5 py-0.5 rounded ${TEXT.sub} font-black uppercase flex items-center gap-1 border ${isDelayed ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDelayed ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {flight.status}
            </span>
            <span className={`${TEXT.sub} ${COLOR.labelText}`}>📍 {intel.fir.name}</span>
          </div>
        </div>
      </div>

      {/* ═══ SCROLLABLE BODY ═══ */}
      <div className="flex-1 overflow-y-auto relative">

        {/* ═══ Aircraft Photo (scrolls with content) ═══ */}
        <div className={`${SPACE.px} pt-2 sm:pt-2.5`}>
          <div className="relative h-28 sm:h-36 rounded-md sm:rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.03]">
          {/* Loading skeleton */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 animate-pulse">
              <Plane size={24} className="text-slate-300 dark:text-white/10" />
              <span className={`${TEXT.sub} ${COLOR.labelText}`}>Loading aircraft...</span>
            </div>
          )}
          {/* Error fallback */}
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <Plane size={28} className="text-slate-300 dark:text-white/10 -rotate-12" />
              <span className={`${TEXT.sub} ${COLOR.labelText}`}>{ac.type}</span>
            </div>
          )}
          {/* Actual image */}
          {!imgError && (
            <img
              src={imgSrc}
              alt={`${ac.type} ${ac.registration}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}
          {/* Gradient overlay (only when image loaded) */}
          {imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          )}
          {/* Badges on image */}
          {imgLoaded && !imgError && (
            <>
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="bg-blue-600/80 backdrop-blur text-white text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-sm border border-white/10 flex items-center gap-1">
                  <Radio size={7} className="animate-pulse" /> LIVE
                </span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                <span className={`${TEXT.sub} text-white/70 font-mono`}>{ac.registration}</span>
                <span className={`${TEXT.sub} text-white/50`}>{ac.type}</span>
              </div>
            </>
          )}
          </div>
        </div>

        {/* ── Route + Times ── */}
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 bg-white dark:bg-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono leading-none">{flight.origin.iata}</div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/25 mt-0.5">{flight.origin.city}</div>
            </div>
            <div className="flex-1 relative mx-1 sm:mx-2">
              <div className="h-[2px] bg-slate-200 dark:bg-white/[0.05] rounded-full" />
              <div className={`h-[2px] absolute top-0 left-0 rounded-full ${isDelayed ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${pct}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pct}%` }}>
                <div className="bg-white dark:bg-[#0c1020] p-[2px] rounded-full border-[1.5px] border-cyan-500 -translate-x-1/2">
                  <Plane size={7} className="text-cyan-500 rotate-90" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono leading-none">{flight.destination.iata}</div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/25 mt-0.5">{flight.destination.city}</div>
            </div>
          </div>
          <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-white/30">
            <span>DEP {flight.actualDep || flight.scheduledDep} IST</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/15">📍 {intel.fir.name}</span>
            <span>ETA {flight.estArr || flight.scheduledArr} IST</span>
          </div>
          {/* Phase */}
          <div className="grid grid-cols-4 gap-1 mt-2.5 sm:mt-3">
            {['Departed','Cruise','Approach','Landing'].map((label, i) => {
              const on = i === 0 ? ['TAKEOFF','CLIMB','CRUISE','TOD','APPROACH','FINAL','EN_ROUTE'].includes(phase.phase)
                : i === 1 ? ['CRUISE','TOD','APPROACH','FINAL'].includes(phase.phase)
                : i === 2 ? ['APPROACH','FINAL'].includes(phase.phase) : phase.phase === 'FINAL';
              return (<div key={label}>
                <div className={`h-[3px] rounded-full ${on ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/[0.04]'}`} />
                <div className={`text-[7px] sm:text-[8px] font-bold uppercase text-center mt-0.5 sm:mt-1 ${on ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-300 dark:text-white/10'}`}>{label}</div>
              </div>);
            })}
          </div>
        </div>

        {/* ── Passenger Intelligence ── */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-cyan-50/70 dark:bg-cyan-500/[0.04] border-y border-cyan-100 dark:border-cyan-500/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe size={11} className="text-cyan-500" />
            <span className="text-[9px] sm:text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Passenger Intelligence</span>
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-white/50 leading-relaxed italic mb-2">"{briefing}"</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {[
              { icon: <Wind size={10} className="text-blue-400" />, text: `Wind: ${ri(m.windSpeed) ?? '—'} kts` },
              { icon: <Clock size={10} className="text-amber-400" />, text: `Impact: ${windImpact}` },
              { icon: <Shield size={10} className="text-emerald-400" />, text: 'Safety: Normal' },
              { icon: <Activity size={10} className="text-purple-400" />, text: Math.abs(vr) < 300 ? 'Ride: Smooth' : 'Ride: Light chop' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {s.icon}
                <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-white/30">{s.text}</span>
              </div>
            ))}
          </div>
          {intel.alerts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {intel.alerts.map((a, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-[7px] sm:text-[8px] font-bold rounded">{a}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Live Data Grid ── */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2">
            {[
              { label: 'Altitude', value: m.altitude.toLocaleString(), sub: `FL${Math.round(m.altitude / 100)}`, subColor: 'text-blue-500' },
              { label: 'Speed', value: `${ri(m.groundSpeed)}`, sub: 'kts', subColor: 'text-slate-400 dark:text-white/20' },
              { label: 'Direction', value: `${ri(m.track)}°`, sub: dir(m.track || 0), subColor: 'text-slate-400 dark:text-white/20' },
              { label: 'Vertical', value: vrLabel, sub: vr !== 0 ? `${vr > 0 ? '+' : ''}${ri(vr)} fpm` : '', subColor: vr > 300 ? 'text-emerald-500' : vr < -300 ? 'text-orange-500' : 'text-slate-400 dark:text-white/20' },
            ].map(d => (
              <div key={d.label} className="bg-white dark:bg-white/[0.02] rounded-lg p-2 sm:p-2.5 border border-slate-100 dark:border-white/[0.04]">
                <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/20 font-bold uppercase mb-0.5">{d.label}</div>
                <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono leading-tight">
                  {d.value} {d.sub && <span className={`text-[7px] sm:text-[8px] font-normal ${d.subColor}`}>{d.sub}</span>}
                </div>
              </div>
            ))}
          </div>
          {/* Signal */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border ${
            m.signalConfidence === 'High' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/15'
            : m.signalConfidence === 'Medium' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/15'
            : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/15'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${m.signalConfidence === 'High' ? 'bg-emerald-500 animate-pulse' : m.signalConfidence === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase ${m.signalConfidence === 'High' ? 'text-emerald-700 dark:text-emerald-400' : m.signalConfidence === 'Medium' ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}>{m.signalConfidence}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/20">· {m.feederCount} stations</span>
          </div>
        </div>

        {/* ═══ COLLAPSIBLE SECTIONS ═══ */}

        <Fold title="Environment" icon={<Thermometer size={11} />} open accent={ACCENT.environment}>
          <Row l="Air Temp" v={f(m.oat, 1) !== undefined ? `${f(m.oat, 1)} °C` : undefined} />
          <Row l="Wind" v={ri(m.windSpeed) !== undefined ? `${ri(m.windSpeed)} kts @ ${ri(m.windDir)}°` : undefined} />
          <Row l="Pressure" v={f(m.baro, 1) !== undefined ? `${f(m.baro, 1)} hPa` : undefined} />
          {(m.windSpeed || 0) > 30 && (
            <div className="mt-1.5 px-2 py-1.5 bg-amber-50 dark:bg-amber-500/5 rounded text-[8px] sm:text-[9px] text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/10">
              💨 Strong winds may increase fuel usage
            </div>
          )}
        </Fold>

        <Fold title="Aircraft" icon={<Plane size={11} />} open accent={ACCENT.aircraft}>
          <Row l="Type" v={ac.type} />
          <Row l="Registration" v={ac.registration} />
          <Row l="Airline" v={flight.airline} />
          <Row l="Category" v={ac.category || 'Passenger'} />
          <Row l="Age" v={ac.age} />
        </Fold>

        {/* Auth-gated */}
        <Fold title="Advanced Telemetry" icon={<Gauge size={11} />} locked={L} accent={ACCENT.telemetry}>
          <Row l="TAS" v={f(m.tas) !== undefined ? `${f(m.tas)} kts` : undefined} />
          <Row l="IAS" v={f(m.ias) !== undefined ? `${f(m.ias)} kts` : undefined} />
          <Row l="Mach" v={f(m.mach, 3) !== undefined ? `${f(m.mach, 3)}` : undefined} />
          <Row l="Roll" v={f(m.roll, 1) !== undefined ? `${f(m.roll, 1)}°` : undefined} />
          <Row l="Heading" v={`${ri(m.heading)}°`} />
          <Row l="Selected Alt" v={m.selectedAltitude ? `${m.selectedAltitude.toLocaleString()} ft` : undefined} />
          <Row l="Target Hdg" v={m.targetHeading !== undefined ? `${ri(m.targetHeading)}°` : undefined} />
          <Row l="Magnetic" v={m.magneticHeading !== undefined ? `${ri(m.magneticHeading)}°` : undefined} />
        </Fold>

        <Fold title="Data Transparency" icon={<Signal size={11} />} locked={L} accent={ACCENT.transparency}>
          <Row l="ADS-B Sources" v={`${m.feederCount} receivers`} />
          <Row l="Station ID" v="VIDP-FDR-01" />
          <Row l="Data Latency" v="<2s" />
          <Row l="Confidence" v={m.signalConfidence} />
          <Row l="RSSI" v={`${m.rssi} dBm`} />
          <Row l="Last Update" v={new Date(m.lastUpdate * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST'} />
        </Fold>

        <Fold title="Sovereign Airspace" icon={<Radio size={11} />} locked={L} accent={ACCENT.sovereign}>
          <Row l="FIR" v={intel.fir.name} />
          <Row l="ATC Freq" v={intel.fir.freq} />
          <Row l="Squawk" v={m.squawk || '—'} />
          <Row l="Track" v={`${ri(m.track)}°`} />
          <Row l="Mode S" v={flight.id.slice(0, 6).toUpperCase()} />
        </Fold>

        <Fold title="Aircraft Registry" icon={<MapPin size={11} />} locked={L} accent={ACCENT.registry}>
          <Row l="Registration" v={ac.registration} />
          <Row l="Engines" v={ac.engines} />
          <Row l="Country" v={ac.countryOfReg} />
          <Row l="ICAO Hex" v={ac.icao24} />
          <Row l="Type Code" v={ac.typeCode} />
          <Row l="MSN" v={ac.serialNumber || ac.constructionNumber} />
          <Row l="First Flight" v={ac.firstFlight} />
          <Row l="Delivered" v={ac.delivered} />
          <Row l="Line No." v={ac.lineNumber} />
        </Fold>

        {flight.service && (
          <Fold title="Flight Service" icon={<Activity size={11} />} locked={L} accent={ACCENT.service}>
            <Row l="Service" v={flight.service.type} />
            <Row l="Seats" v={flight.service.seats} />
            <Row l="Classes" v={flight.service.classes?.join(', ')} />
            {flight.service.capacity && <Row l="Capacity" v={flight.service.capacity} />}
            {flight.service.daysOfOperation && <Row l="Days" v={flight.service.daysOfOperation} />}
            {flight.service.codeshares?.length ? <Row l="Codeshares" v={flight.service.codeshares.join(', ')} /> : null}
          </Fold>
        )}

        {/* ── Footer: ADS-B + Auth CTA ── */}
        <div className={`${SPACE.px} py-2 sm:py-2.5 border-t ${COLOR.divider}`}>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/10 rounded-md px-2.5 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className={`${TEXT.badge} font-bold text-emerald-700 dark:text-emerald-400`}>ADS-B · {feeder.quality}</div>
              <div className={`${TEXT.sub} text-emerald-600/60 dark:text-emerald-400/40`}>{feeder.text}</div>
            </div>
          </div>
          {L && (
            <div className="mt-1.5 flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for telemetry, registry & sovereign data</span>
            </div>
          )}
        </div>

        {/* ═══ "MORE" OVERLAY (inside scroll body) ═══ */}
        {showMore && (
          <div className="sticky bottom-0 left-0 right-0 z-30">
            <div className="absolute inset-x-0 bottom-0 top-[-200vh] bg-black/20 dark:bg-black/30" onClick={() => setShowMore(false)} />
            <div className="relative bg-white dark:bg-[#0f1525] border-t border-slate-200 dark:border-white/[0.08] rounded-t-xl shadow-2xl">
              {/* Handle */}
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-8 h-1 rounded-full bg-slate-300 dark:bg-white/15" />
              </div>
              {/* Rows */}
              <div className={`${SPACE.px} pb-2`}>
                {[
                  { label: 'Flight Number', value: flight.flightNumber },
                  { label: 'Aircraft Registration', value: ac.registration },
                  { label: 'Airline', value: flight.airline },
                  { label: 'Origin Airport', value: `${flight.origin.city} ${flight.origin.iata}` },
                  { label: 'Destination Airport', value: `${flight.destination.city} ${flight.destination.iata}` },
                ].map(r => (
                  <button key={r.label} className={`w-full flex items-center justify-between py-2 border-b ${COLOR.divider} text-left ${COLOR.hoverBg} transition-colors rounded-sm`}>
                    <div className="min-w-0 flex-1">
                      <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold leading-tight`}>{r.label}</div>
                      <div className={`${TEXT.label} font-bold text-slate-800 dark:text-white/70 mt-0.5`}>{r.value}</div>
                    </div>
                    <ChevronRight size={13} className={`${COLOR.labelText} shrink-0 ml-2`} />
                  </button>
                ))}
                {/* Playback */}
                <button className={`w-full flex items-center justify-between py-2.5 border-b ${COLOR.divider} text-left ${COLOR.hoverBg} transition-colors rounded-sm`}>
                  <div className="flex items-center gap-2.5">
                    <PlayCircle size={16} className={COLOR.labelText} />
                    <span className={`${TEXT.label} font-bold text-slate-700 dark:text-white/60`}>Playback</span>
                  </div>
                  <ChevronRight size={13} className={`${COLOR.labelText} shrink-0`} />
                </button>
                {/* Hide other aircraft */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <EyeOff size={16} className={COLOR.labelText} />
                    <span className={`${TEXT.label} font-bold text-slate-700 dark:text-white/60`}>Hide other aircraft</span>
                  </div>
                  <button onClick={() => setHideOthers(p => !p)} className={`w-7 h-[16px] rounded-full relative transition-all shrink-0 ${hideOthers ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                    <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-all ${hideOthers ? 'left-[12px]' : 'left-[2px]'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ═══ STICKY ACTION BAR (Bottom — always visible) ═══ */}
      <div className={`shrink-0 border-t ${COLOR.divider} bg-white dark:bg-[#0c1020] ${SPACE.px}`}>
        <div className="grid grid-cols-4 gap-1 py-1.5 sm:py-2">
          {[
            { icon: <Route size={16} />, label: 'Route', onClick: () => setShowMore(false) },
            { icon: <Crosshair size={16} />, label: 'Follow', onClick: () => setShowMore(false) },
            { icon: <Share2 size={16} />, label: 'Share', onClick: () => setShowMore(false) },
            { icon: <MoreHorizontal size={16} />, label: 'More', onClick: () => setShowMore(p => !p), active: showMore },
          ].map(a => (
            <button key={a.label} onClick={a.onClick}
              className={`flex flex-col items-center gap-0.5 py-1 rounded-md transition-colors ${
                a.active ? `${COLOR.activeText}` : `text-slate-400 dark:text-white/30 ${COLOR.hoverBg} hover:text-slate-700 dark:hover:text-white/60`
              }`}>
              {a.icon}
              <span className={`${TEXT.sub} font-bold`}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FlightIntelligenceCard;
