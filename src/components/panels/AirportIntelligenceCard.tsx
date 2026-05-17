import React, { useState } from 'react';
import {
  TowerControl, Cloud, Wind, Eye, PlaneTakeoff, PlaneLanding,
  ChevronRight, ChevronDown, Zap, Globe, MapPin, FileText,
  AlertTriangle, Layers, Lock, Navigation, Radio,
  ThermometerSun, Gauge
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';

/* ─── Airport Intelligence Data ─── */
const AIRPORT_DATA: Record<string, {
  iata: string; icao: string; name: string; city: string;
  elevation: string; operator: string; terminals: number; runways: number;
  paxTraffic: string; hubAirlines: string[];
  arrivals: number; departures: number; onGround: number;
  congestion: number; delayIndex: number; taxiOut: string; taxiIn: string;
  gateOccupancy: number; holding: number; diversions: number;
  metar: string; temp: string; wind: string; visibility: string; pressure: string;
  activeRunway: string; runwayUtil: number;
  weatherSeverity: string; weatherNote: string;
  notams: { severity: string; title: string }[];
  departures_preview: { time: string; dest: string; flight: string; status: string }[];
  arrivals_preview: { time: string; origin: string; flight: string; status: string }[];
  aiSummary: string;
  timeline: { time: string; severity: string; msg: string }[];
}> = {
  DEL: {
    iata: 'DEL', icao: 'VIDP', name: 'Indira Gandhi International', city: 'New Delhi',
    elevation: '777 ft', operator: 'DIAL', terminals: 3, runways: 3,
    paxTraffic: '72.7M', hubAirlines: ['Air India', 'IndiGo', 'Vistara'],
    arrivals: 142, departures: 138, onGround: 42,
    congestion: 67, delayIndex: 12, taxiOut: '18 min', taxiIn: '8 min',
    gateOccupancy: 78, holding: 6, diversions: 1,
    metar: 'VIDP 170530Z 27005KT 10KM FEW040 32/18 Q1008', temp: '32°C', wind: '270°/5kt', visibility: '10 km', pressure: '1008 hPa',
    activeRunway: 'RWY 28L/28R', runwayUtil: 76,
    weatherSeverity: 'Low', weatherNote: 'Clear conditions. No fog risk. Wind aligned with RWY 28.',
    notams: [
      { severity: 'high', title: 'RWY 11/29 closed for resurfacing' },
      { severity: 'medium', title: 'TWY C3 restricted - construction' },
    ],
    departures_preview: [
      { time: '14:05', dest: 'BOM', flight: '6E 554', status: 'Boarding' },
      { time: '14:20', dest: 'BLR', flight: 'UK 992', status: 'On Time' },
      { time: '14:35', dest: 'MAA', flight: 'AI 143', status: 'Delayed' },
      { time: '14:50', dest: 'HYD', flight: '6E 812', status: 'On Time' },
    ],
    arrivals_preview: [
      { time: '14:10', origin: 'BOM', flight: 'AI 101', status: 'Landing' },
      { time: '14:25', origin: 'CCU', flight: '6E 302', status: 'On Time' },
      { time: '14:40', origin: 'BLR', flight: 'UK 881', status: 'On Time' },
      { time: '14:55', origin: 'DXB', flight: 'EK 510', status: 'Delayed' },
    ],
    aiSummary: 'Moderate departure congestion due to RWY 11/29 closure. Dual runway ops on 28L/28R. Visibility good. 6 aircraft in holding.',
    timeline: [
      { time: '2m', severity: 'warning', msg: 'Visibility approaching CAT-II on 28L' },
      { time: '8m', severity: 'info', msg: 'RWY 10/28 active for arrivals' },
      { time: '15m', severity: 'info', msg: 'T3 gates B12-B18 congested' },
      { time: '22m', severity: 'alert', msg: 'Go-around: AI 302 wind shear' },
    ],
  },
  BOM: {
    iata: 'BOM', icao: 'VABB', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai',
    elevation: '39 ft', operator: 'MIAL', terminals: 2, runways: 2,
    paxTraffic: '51.8M', hubAirlines: ['Air India', 'IndiGo', 'Vistara'],
    arrivals: 118, departures: 112, onGround: 38,
    congestion: 82, delayIndex: 28, taxiOut: '24 min', taxiIn: '12 min',
    gateOccupancy: 91, holding: 8, diversions: 3,
    metar: 'VABB 170530Z 12008KT 8000 FEW025 SCT100 29/24 Q1006', temp: '29°C', wind: '120°/8kt', visibility: '8 km', pressure: '1006 hPa',
    activeRunway: 'RWY 27', runwayUtil: 94,
    weatherSeverity: 'Moderate', weatherNote: 'Haze reducing visibility. Single runway ops. Crosswind moderate.',
    notams: [
      { severity: 'high', title: 'Single runway operations - RWY 27 only' },
      { severity: 'medium', title: 'TWY A7 waterlogging risk' },
    ],
    departures_preview: [
      { time: '14:00', dest: 'DEL', flight: 'AI 866', status: 'Taxiing' },
      { time: '14:15', dest: 'BLR', flight: '6E 431', status: 'Boarding' },
      { time: '14:30', dest: 'GOX', flight: 'SG 102', status: 'On Time' },
      { time: '14:45', dest: 'HYD', flight: '6E 718', status: 'Delayed' },
    ],
    arrivals_preview: [
      { time: '14:05', origin: 'DEL', flight: '6E 554', status: 'Final' },
      { time: '14:20', origin: 'BLR', flight: 'AI 502', status: 'On Time' },
      { time: '14:35', origin: 'DXB', flight: 'EK 500', status: 'On Time' },
      { time: '14:50', origin: 'CCU', flight: '6E 812', status: 'Delayed' },
    ],
    aiSummary: 'High congestion due to single runway operations. Monsoon cell approaching. Departure queue at 12 aircraft. Gate occupancy critical at T2.',
    timeline: [
      { time: '3m', severity: 'alert', msg: 'Single runway ops - RWY 27 only' },
      { time: '10m', severity: 'warning', msg: 'Departure queue: 12 aircraft' },
      { time: '18m', severity: 'info', msg: 'Monsoon cell 40nm SW approaching' },
    ],
  },
  BLR: {
    iata: 'BLR', icao: 'VOBL', name: 'Kempegowda International', city: 'Bengaluru',
    elevation: '3,000 ft', operator: 'BIAL', terminals: 2, runways: 2,
    paxTraffic: '37.5M', hubAirlines: ['IndiGo', 'Air India Express', 'Akasa'],
    arrivals: 96, departures: 92, onGround: 28,
    congestion: 45, delayIndex: 8, taxiOut: '12 min', taxiIn: '6 min',
    gateOccupancy: 62, holding: 2, diversions: 0,
    metar: 'VOBL 170530Z 09012KT 9999 FEW035 24/16 Q1012', temp: '24°C', wind: '090°/12kt', visibility: '>10 km', pressure: '1012 hPa',
    activeRunway: 'RWY 09L/09R', runwayUtil: 58,
    weatherSeverity: 'Low', weatherNote: 'Clear skies. Good visibility. Parallel runway ops active.',
    notams: [
      { severity: 'low', title: 'New T2 apron stands operational' },
    ],
    departures_preview: [
      { time: '14:10', dest: 'DEL', flight: 'UK 992', status: 'On Time' },
      { time: '14:25', dest: 'BOM', flight: '6E 431', status: 'On Time' },
      { time: '14:40', dest: 'MAA', flight: 'QP 132', status: 'Boarding' },
      { time: '14:55', dest: 'HYD', flight: '6E 602', status: 'On Time' },
    ],
    arrivals_preview: [
      { time: '14:05', origin: 'DEL', flight: '6E 201', status: 'On Time' },
      { time: '14:20', origin: 'BOM', flight: 'AI 801', status: 'On Time' },
      { time: '14:35', origin: 'HYD', flight: '6E 515', status: 'On Time' },
      { time: '14:50', origin: 'CCU', flight: 'AI 772', status: 'On Time' },
    ],
    aiSummary: 'Normal operations. Parallel runway ops on 09L/09R. Low congestion. No weather-related delays expected.',
    timeline: [
      { time: '5m', severity: 'info', msg: 'Parallel ops - 09L arr, 09R dep' },
      { time: '12m', severity: 'info', msg: 'T2 international gates available' },
    ],
  },
};

/* ── Collapsible (matches FlightIntelligenceCard Fold exactly) ── */
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

/* ── Row (matches FlightIntelligenceCard Row exactly) ── */
const Row: React.FC<{ l: string; v?: string | number; locked?: boolean }> = ({ l, v, locked }) => (
  <div className={`flex items-center justify-between ${SPACE.rowPy}`}>
    <span className={`${TEXT.label} ${COLOR.labelText}`}>{l}</span>
    {locked
      ? <span className={`flex items-center gap-1 ${COLOR.lockedText}`}><Lock size={10} /><span className={TEXT.sub}>Login</span></span>
      : <span className={`${TEXT.value} ${COLOR.valueText}`}>{v ?? '—'}</span>
    }
  </div>
);

interface Props { airportCode: string | null; }

const AirportIntelligenceCard: React.FC<Props> = ({ airportCode }) => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;

  if (!airportCode || !AIRPORT_DATA[airportCode]) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-white/20 p-6 sm:p-8 space-y-3">
        <TowerControl size={36} className="opacity-15 animate-bounce" />
        <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Select an airport</p>
      </div>
    );
  }

  const apt = AIRPORT_DATA[airportCode];
  const isStressed = apt.congestion > 70;
  const congBg = isStressed ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : apt.congestion > 40 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
  const congDot = isStressed ? 'bg-red-500' : apt.congestion > 40 ? 'bg-amber-500' : 'bg-emerald-500';

  // Airport images (Wikimedia Commons - public domain)
  const AIRPORT_IMAGES: Record<string, string> = {
    DEL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Delhi_Airport%2C_T3.jpg/640px-Delhi_Airport%2C_T3.jpg',
    BOM: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mumbai_03-2016_114_Airport_international_terminal.jpg/640px-Mumbai_03-2016_114_Airport_international_terminal.jpg',
    BLR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kempegowda_International_Airport_Terminal_2.jpg/640px-Kempegowda_International_Airport_Terminal_2.jpg',
  };
  const airportImage = AIRPORT_IMAGES[airportCode] || '';
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ═══ HEADER: Airport Identity (matches Flight header) ═══ */}
      <div className={`${SPACE.pad} bg-white dark:bg-transparent border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <h1 className={`${TEXT.heroTitle} text-slate-900 dark:text-white leading-none`}>{apt.iata}</h1>
              <span className={`${TEXT.sub} font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400`}>{apt.icao}</span>
            </div>
            <p className={`${TEXT.sub} ${COLOR.labelText}`}>{apt.name}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`px-1.5 py-0.5 rounded ${TEXT.sub} font-black uppercase flex items-center gap-1 border ${congBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${congDot}`} />
              {isStressed ? 'High Load' : apt.congestion > 40 ? 'Moderate' : 'Normal'}
            </span>
            <span className={`${TEXT.sub} ${COLOR.labelText}`}>{apt.city}</span>
          </div>
        </div>
      </div>

      {/* ═══ SCROLLABLE BODY ═══ */}
      <div className="flex-1 overflow-y-auto relative">

        {/* ═══ Airport Image (matches Flight aircraft photo) ═══ */}
        <div className={`${SPACE.px} pt-2 sm:pt-2.5`}>
          <div className="relative h-28 sm:h-36 rounded-md sm:rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.03]">
            {/* Loading skeleton */}
            {!imgLoaded && !imgError && airportImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 animate-pulse">
                <TowerControl size={24} className="text-slate-300 dark:text-white/10" />
                <span className={`${TEXT.sub} ${COLOR.labelText}`}>Loading airport...</span>
              </div>
            )}
            {/* Error / no image fallback */}
            {(imgError || !airportImage) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-slate-800 to-slate-900">
                <TowerControl size={28} className="text-white/10" />
                <span className={`${TEXT.sub} text-white/30`}>{apt.name}</span>
              </div>
            )}
            {/* Actual image */}
            {airportImage && !imgError && (
              <img
                src={airportImage}
                alt={`${apt.name} terminal`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}
            {/* Gradient overlay */}
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
                  <span className={`${TEXT.sub} text-white/70 font-mono`}>{apt.iata} / {apt.icao}</span>
                  <span className={`${TEXT.sub} text-white/50`}>{apt.operator}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Quick Metrics (like Flight route bar) ── */}
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 bg-white dark:bg-transparent">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2">
            {[
              { label: 'Arrivals', value: String(apt.arrivals), sub: 'active', subColor: 'text-blue-500' },
              { label: 'Departures', value: String(apt.departures), sub: 'active', subColor: 'text-purple-500' },
              { label: 'Congestion', value: `${apt.congestion}%`, sub: isStressed ? 'high' : 'normal', subColor: isStressed ? 'text-red-500' : 'text-emerald-500' },
              { label: 'On Ground', value: String(apt.onGround), sub: 'aircraft', subColor: 'text-slate-400 dark:text-white/20' },
            ].map(d => (
              <div key={d.label} className="bg-white dark:bg-white/[0.02] rounded-lg p-2 sm:p-2.5 border border-slate-100 dark:border-white/[0.04]">
                <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/20 font-bold uppercase mb-0.5">{d.label}</div>
                <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono leading-tight">
                  {d.value} <span className={`text-[7px] sm:text-[8px] font-normal ${d.subColor}`}>{d.sub}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Signal-like status bar */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border ${congBg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${congDot} animate-pulse`} />
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase`}>{apt.activeRunway}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/20">· {apt.runwayUtil}% util</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-white/20 ml-auto">Taxi {apt.taxiOut}</span>
          </div>
        </div>

        {/* ── AI Ops Intelligence (matches Passenger Intelligence) ── */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-cyan-50/70 dark:bg-cyan-500/[0.04] border-y border-cyan-100 dark:border-cyan-500/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap size={11} className="text-cyan-500" />
            <span className="text-[9px] sm:text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Operational Intelligence</span>
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">"{apt.aiSummary}"</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
            {[
              { icon: <Wind size={10} className="text-blue-400" />, text: `Wind: ${apt.wind}` },
              { icon: <Eye size={10} className="text-cyan-400" />, text: `Vis: ${apt.visibility}` },
              { icon: <Gauge size={10} className="text-amber-400" />, text: `Delay: ${apt.delayIndex}%` },
              { icon: <Navigation size={10} className="text-emerald-400" />, text: `Hold: ${apt.holding} acft` },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {s.icon}
                <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ COLLAPSIBLE SECTIONS ═══ */}

        <Fold title="Weather & METAR" icon={<Cloud size={11} />} open accent={ACCENT.environment}>
          {/* Decoded conditions grid with timestamp */}
          <div className="flex items-center justify-between mb-3 mt-1">
            <span className={`${TEXT.sub} font-black ${COLOR.titleActiveText} uppercase tracking-wider`}>Decoded METAR</span>
            <span className={`${TEXT.sub} ${COLOR.labelText}`}>Updated 5m ago</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
              <ThermometerSun size={12} className="text-orange-400 shrink-0" />
              <div>
                <div className={`${TEXT.sub} ${COLOR.labelText} uppercase`}>Temp</div>
                <div className={`${TEXT.value} ${COLOR.valueText}`}>{apt.temp}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
              <Wind size={12} className="text-blue-400 shrink-0" />
              <div>
                <div className={`${TEXT.sub} ${COLOR.labelText} uppercase`}>Wind</div>
                <div className={`${TEXT.value} ${COLOR.valueText}`}>{apt.wind}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
              <Eye size={12} className="text-cyan-400 shrink-0" />
              <div>
                <div className={`${TEXT.sub} ${COLOR.labelText} uppercase`}>Visibility</div>
                <div className={`${TEXT.value} ${COLOR.valueText}`}>{apt.visibility}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
              <Gauge size={12} className="text-purple-400 shrink-0" />
              <div>
                <div className={`${TEXT.sub} ${COLOR.labelText} uppercase`}>QNH</div>
                <div className={`${TEXT.value} ${COLOR.valueText}`}>{apt.pressure}</div>
              </div>
            </div>
          </div>

          {/* Severity + AI note */}
          <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border mb-1.5 ${
            apt.weatherSeverity === 'Low' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/10' :
            apt.weatherSeverity === 'Moderate' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/10' :
            'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/10'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              apt.weatherSeverity === 'Low' ? 'bg-emerald-500' : apt.weatherSeverity === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className={`${TEXT.sub} font-bold ${
              apt.weatherSeverity === 'Low' ? 'text-emerald-700 dark:text-emerald-400' : apt.weatherSeverity === 'Moderate' ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'
            }`}>Ops Impact: {apt.weatherSeverity}</span>
          </div>
          <p className={`${TEXT.sub} ${COLOR.labelText} leading-relaxed italic`}>{apt.weatherNote}</p>
        </Fold>

        <Fold title="Live Departures" icon={<PlaneTakeoff size={11} />} open accent={ACCENT.aircraft}>
          <div className="space-y-0.5">
            {apt.departures_preview.map((d, i) => (
              <div key={i} className={`flex items-center gap-1.5 ${SPACE.rowPy}`}>
                <span className={`${TEXT.value} w-10`}>{d.time}</span>
                <span className={`${TEXT.sub} text-slate-400`}>→</span>
                <span className={`${TEXT.value} w-7`}>{d.dest}</span>
                <span className={`${TEXT.label} flex-1 text-amber-600 dark:text-amber-400 font-mono`}>{d.flight}</span>
                <span className={`${TEXT.sub} font-bold px-1 py-0.5 rounded ${d.status === 'Delayed' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : d.status === 'Boarding' || d.status === 'Taxiing' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </Fold>

        <Fold title="Live Arrivals" icon={<PlaneLanding size={11} />} accent={ACCENT.environment}>
          <div className="space-y-0.5">
            {apt.arrivals_preview.map((a, i) => (
              <div key={i} className={`flex items-center gap-1.5 ${SPACE.rowPy}`}>
                <span className={`${TEXT.value} w-10`}>{a.time}</span>
                <span className={`${TEXT.sub} text-slate-400`}>←</span>
                <span className={`${TEXT.value} w-7`}>{a.origin}</span>
                <span className={`${TEXT.label} flex-1 text-amber-600 dark:text-amber-400 font-mono`}>{a.flight}</span>
                <span className={`${TEXT.sub} font-bold px-1 py-0.5 rounded ${a.status === 'Delayed' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : a.status === 'Landing' || a.status === 'Final' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </Fold>

        <Fold title="Runway Operations" icon={<Navigation size={11} />} accent={ACCENT.sovereign}>
          <Row l="Active Runway" v={apt.activeRunway} />
          <Row l="Utilization" v={`${apt.runwayUtil}%`} />
          <Row l="Total Runways" v={String(apt.runways)} />
          <Row l="Taxi-Out Avg" v={apt.taxiOut} />
          <Row l="Taxi-In Avg" v={apt.taxiIn} />
          <div className="mt-1.5 h-[3px] bg-slate-200 dark:bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${apt.runwayUtil}%` }} />
          </div>
        </Fold>

        <Fold title="NOTAM Alerts" icon={<FileText size={11} />} accent={ACCENT.registry}>
          {apt.notams.map((n, i) => (
            <div key={i} className={`flex items-start gap-2 ${SPACE.rowPy}`}>
              <AlertTriangle size={10} className={`mt-0.5 shrink-0 ${n.severity === 'high' ? 'text-red-500' : n.severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
              <span className={`${TEXT.label} ${COLOR.valueText} leading-relaxed`}>{n.title}</span>
            </div>
          ))}
        </Fold>

        <Fold title="Surface Operations" icon={<Layers size={11} />} locked={L} accent={ACCENT.telemetry}>
          <Row l="Gate Occupancy" v={`${apt.gateOccupancy}%`} />
          <Row l="Taxi Congestion" v={apt.congestion > 60 ? 'High' : 'Moderate'} />
          <Row l="Pushback Queue" v={apt.congestion > 60 ? '8 aircraft' : '3 aircraft'} />
          <Row l="Diversions" v={String(apt.diversions)} />
          <Row l="Holding" v={`${apt.holding} aircraft`} />
        </Fold>

        <Fold title="Airport Profile" icon={<Globe size={11} />} accent={ACCENT.aircraft}>
          <Row l="Elevation" v={apt.elevation} />
          <Row l="Operator" v={apt.operator} />
          <Row l="Terminals" v={String(apt.terminals)} />
          <Row l="Runways" v={String(apt.runways)} />
          <Row l="Pax/Year" v={apt.paxTraffic} />
          <Row l="Hub Airlines" v={apt.hubAirlines.join(', ')} />
        </Fold>

        <Fold title="Live Timeline" icon={<Radio size={11} />} locked={L} accent={ACCENT.transparency}>
          {apt.timeline.map((t, i) => (
            <div key={i} className={`flex items-start gap-2 ${SPACE.rowPy}`}>
              <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${t.severity === 'alert' ? 'bg-red-500' : t.severity === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'}`} />
              <div className="flex-1">
                <span className={`${TEXT.label} ${COLOR.valueText}`}>{t.msg}</span>
                <span className={`${TEXT.sub} ${COLOR.labelText} ml-2`}>{t.time} ago</span>
              </div>
            </div>
          ))}
        </Fold>

        {/* ── Footer ── */}
        <div className={`${SPACE.px} py-2 sm:py-2.5 border-t ${COLOR.divider}`}>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/10 rounded-md px-2.5 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className={`${TEXT.badge} font-bold text-emerald-700 dark:text-emerald-400`}>ADS-B · Live</div>
              <div className={`${TEXT.sub} text-emerald-600/60 dark:text-emerald-400/40`}>{apt.arrivals + apt.departures} movements</div>
            </div>
          </div>
          {L && (
            <div className="mt-1.5 flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for surface ops, timeline & analytics</span>
            </div>
          )}
        </div>

      </div>

      {/* ═══ STICKY ACTION BAR (matches Flight action bar) ═══ */}
      <div className={`shrink-0 border-t ${COLOR.divider} bg-white dark:bg-[#0c1020] ${SPACE.px}`}>
        <div className="grid grid-cols-4 gap-1 py-1.5 sm:py-2">
          {[
            { icon: <TowerControl size={16} />, label: 'Intel', href: `/intelligence/airports/${apt.iata}` },
            { icon: <PlaneLanding size={16} />, label: 'Arrivals', href: `/intelligence/airports/${apt.iata}/arrivals` },
            { icon: <PlaneTakeoff size={16} />, label: 'Departs', href: `/intelligence/airports/${apt.iata}/departures` },
            { icon: <MapPin size={16} />, label: 'Map', href: `/intelligence/airports/${apt.iata}/live-map` },
          ].map(a => (
            <a key={a.label} href={a.href}
              className={`flex flex-col items-center gap-0.5 py-1 rounded-md transition-colors text-slate-500 dark:text-slate-400 ${COLOR.hoverBg} hover:text-slate-700 dark:hover:text-slate-200`}>
              {a.icon}
              <span className={`${TEXT.sub} font-bold`}>{a.label}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AirportIntelligenceCard;
