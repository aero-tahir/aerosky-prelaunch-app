import React, { useState } from 'react';
import {
  Search, Lock, ChevronDown, ChevronRight, AlertTriangle,
  Plane, Signal, Gauge, MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';
import { RangeSlider } from '@/components/ui/PanelWidgets';

/* ── Fold (shared pattern) ── */
const Fold: React.FC<{
  title: string; icon: React.ReactNode; open?: boolean;
  locked?: boolean; accent?: string; badge?: string; children: React.ReactNode;
}> = ({ title, icon, open: init = false, locked, accent, badge, children }) => {
  const [open, setOpen] = useState(init);
  return (
    <div className={`border-t ${COLOR.divider}`} style={open && accent ? { borderLeftWidth: '2px', borderLeftColor: accent } : undefined}>
      <button onClick={() => !locked && setOpen(p => !p)} className={`w-full flex items-center gap-2 ${SPACE.pad} text-left group transition-colors ${open && !locked ? COLOR.subtleBg : ''}`}>
        <span style={open && accent ? { color: accent } : undefined} className={open && accent ? '' : COLOR.inactiveText}>{icon}</span>
        <span className={`flex-1 ${TEXT.sectionTitle} transition-colors ${open && !locked ? COLOR.titleActiveText : COLOR.titleText}`}>{title}</span>
        {badge && <span className={`${TEXT.sub} px-1.5 py-0.5 rounded-full font-bold ${COLOR.activeBg} ${COLOR.activeText}`}>{badge}</span>}
        {locked
          ? <Lock size={11} className={COLOR.lockedText} />
          : <span className={COLOR.inactiveText}>{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
        }
      </button>
      {open && !locked && <div className={`${SPACE.px} pt-1 pb-2.5 sm:pb-3`}>{children}</div>}
    </div>
  );
};

/* ── Pill toggle ── */
const Pill: React.FC<{ label: string; icon?: string; active: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border ${TEXT.badge} font-bold transition-all ${
    active ? `${COLOR.activeBg} ${COLOR.activeBorder} ${COLOR.activeText}` : `${COLOR.inactiveBg} ${COLOR.inactiveBorder} text-slate-500 dark:text-slate-400 ${COLOR.hoverBg}`
  }`}>
    {icon && <span className="text-xs">{icon}</span>}{label}
  </button>
);

/* ── Airline checkbox ── */
const AirlineRow: React.FC<{ emoji: string; name: string; code: string; hub: string; checked: boolean; onClick: () => void }> = ({ emoji, name, code, hub, checked, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-2 py-1.5 sm:py-2 rounded-md transition-all ${COLOR.hoverBg}`}>
    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 dark:border-white/10'}`}>
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
    </div>
    <div className="flex-1 min-w-0 text-left">
      <span className={`${TEXT.label} font-bold block truncate ${checked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{emoji} {name}</span>
      <span className={`${TEXT.sub} ${COLOR.labelText}`}>{code} · {hub}</span>
    </div>
  </button>
);

/* ── Constants ── */
const TYPES = [
  { id: 'Passenger', label: 'Passenger', icon: '✈️' },
  { id: 'Cargo', label: 'Cargo', icon: '📦' },
  { id: 'Business', label: 'Business', icon: '💼' },
  { id: 'Helicopter', label: 'Helicopter', icon: '🚁' },
  { id: 'Drone', label: 'UAV', icon: '🛸' },
  { id: 'Military', label: 'Military', icon: '🎖️' },
];

const SITUATIONS = [
  { id: 'On Time', label: 'Normal', icon: '🟢' },
  { id: 'Delayed', label: 'Delayed', icon: '🟡' },
  { id: 'In Air', label: 'In Air', icon: '✈️' },
  { id: 'Landing', label: 'Landing', icon: '🛬' },
  { id: 'Scheduled', label: 'Scheduled', icon: '🕓' },
  { id: 'Diverted', label: 'Diverted', icon: '🔴' },
];

const INDIAN_AIRLINES = [
  { code: 'IGO', name: 'IndiGo', emoji: '🔵', hub: 'Delhi' },
  { code: 'AIC', name: 'Air India', emoji: '🇮🇳', hub: 'Delhi' },
  { code: 'AKJ', name: 'Akasa Air', emoji: '🟠', hub: 'Mumbai' },
  { code: 'SEJ', name: 'SpiceJet', emoji: '🌶️', hub: 'Delhi' },
  { code: 'AIX', name: 'Air India Express', emoji: '🧡', hub: 'Kochi' },
  { code: 'VTI', name: 'Vistara', emoji: '✨', hub: 'Delhi' },
];

const INTL_AIRLINES = [
  { code: 'UAE', name: 'Emirates', emoji: '🏜️', hub: 'Dubai' },
  { code: 'QTR', name: 'Qatar Airways', emoji: '🟣', hub: 'Doha' },
  { code: 'SIA', name: 'Singapore Airlines', emoji: '🔷', hub: 'Singapore' },
];

const FIRS = [
  { code: 'VIDF', name: 'Delhi FIR', region: 'North', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/[0.06] border-amber-200 dark:border-amber-500/15' },
  { code: 'VABF', name: 'Mumbai FIR', region: 'West', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/[0.06] border-blue-200 dark:border-blue-500/15' },
  { code: 'VOMF', name: 'Chennai FIR', region: 'South', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/[0.06] border-emerald-200 dark:border-emerald-500/15' },
  { code: 'VECF', name: 'Kolkata FIR', region: 'East', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/[0.06] border-purple-200 dark:border-purple-500/15' },
];

const toggle = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

/* ── Props ── */
interface TrafficFilterPanelProps {
  flightCount: number;
  searchQuery: string; onSearchChange: (q: string) => void;
  activeAirlines: string[]; onAirlinesChange: (v: string[]) => void;
  activeFIRs: string[]; onFIRsChange: (v: string[]) => void;
  activeTypes: string[]; onTypesChange: (v: string[]) => void;
  activeStatuses: string[]; onStatusesChange: (v: string[]) => void;
  altRange: number[]; onAltRangeChange: (v: number[]) => void;
  speedRange: number[]; onSpeedRangeChange: (v: number[]) => void;
}

const TrafficFilterPanel: React.FC<TrafficFilterPanelProps> = ({
  flightCount, searchQuery, onSearchChange,
  activeAirlines, onAirlinesChange,
  activeFIRs, onFIRsChange,
  activeTypes, onTypesChange,
  activeStatuses, onStatusesChange,
  altRange, onAltRangeChange,
  speedRange, onSpeedRangeChange,
}) => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
  const filterCount = activeAirlines.length + activeFIRs.length + activeTypes.length + activeStatuses.length
    + (altRange[0] > 0 || altRange[1] < 60000 ? 1 : 0) + (speedRange[0] > 0 || speedRange[1] < 800 ? 1 : 0);

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ── Sticky header ── */}
      <div className={`${SPACE.pad} ${COLOR.subtleBg} border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">🇮🇳</span>
            <span className={`${TEXT.label} font-bold text-slate-700 dark:text-slate-300`}>Indian Sky</span>
            <span className={`${TEXT.sub} ${COLOR.labelText} font-mono`}>{timeNow} IST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`${TEXT.badge} font-bold ${COLOR.activeText}`}>{flightCount}</span>
          </div>
        </div>
        {/* Live insight banner */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/[0.04] border border-amber-200 dark:border-amber-500/10 rounded-md mb-2">
          <AlertTriangle size={10} className="text-amber-500 shrink-0" />
          <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400`}>Heavy congestion in Delhi FIR — expect delays</span>
        </div>
        {/* Search */}
        <div className="relative group">
          <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${COLOR.labelText} group-focus-within:text-cyan-500 transition-colors`} size={13} />
          <input
            type="text"
            placeholder="Flight, airline, route, registration..."
            className={`w-full ${COLOR.subtleBg} ${COLOR.border} focus:border-cyan-400 dark:focus:border-cyan-500/40 focus:bg-white dark:focus:bg-white/[0.05] rounded-md pl-8 pr-3 py-1.5 sm:py-2 ${TEXT.input} text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 outline-none transition-all`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {filterCount > 0 && (
          <button onClick={() => { onAirlinesChange([]); onFIRsChange([]); onTypesChange([]); onStatusesChange([]); onAltRangeChange([0,60000]); onSpeedRangeChange([0,800]); }}
            className={`mt-1.5 ${TEXT.sub} ${COLOR.errorText} font-bold uppercase tracking-wider`}>
            Clear {filterCount} filter{filterCount > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto pt-1">

        {/* ═══ 1. AIRCRAFT TYPE (Quick pills) ═══ */}
        <Fold title="Aircraft Type" icon={<Plane size={12} />} open accent={ACCENT.aircraft} badge={activeTypes.length ? `${activeTypes.length}` : undefined}>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map(t => <Pill key={t.id} label={t.label} icon={t.icon} active={activeTypes.includes(t.id)} onClick={() => onTypesChange(toggle(activeTypes, t.id))} />)}
          </div>
        </Fold>

        {/* ═══ 2. FLIGHT SITUATION ═══ */}
        <Fold title="Flight Situation" icon={<Plane size={12} />} open accent={ACCENT.environment} badge={activeStatuses.length ? `${activeStatuses.length}` : undefined}>
          <div className="flex flex-wrap gap-1.5">
            {SITUATIONS.map(s => <Pill key={s.id} label={s.label} icon={s.icon} active={activeStatuses.includes(s.id)} onClick={() => onStatusesChange(toggle(activeStatuses, s.id))} />)}
          </div>
        </Fold>

        {/* ═══ 3. SMART FILTERS (Passenger Impact) ═══ */}
        <Fold title="Passenger Impact" icon={<AlertTriangle size={12} />} accent={ACCENT.aircraft}>
          <div className="flex flex-wrap gap-1.5">
            <Pill label="⏱️ Likely Delayed" active={false} onClick={() => {}} />
            <Pill label="🌧 Weather Affected" active={false} onClick={() => {}} />
            <Pill label="🔁 Holding" active={false} onClick={() => {}} />
            <Pill label="🚦 Congested Dest" active={false} onClick={() => {}} />
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>Flights likely to arrive late due to airspace congestion</p>
        </Fold>

        {/* ═══ 4. AIRLINES ═══ */}
        <Fold title="Airlines" icon={<Plane size={12} />} open accent={ACCENT.registry} badge={activeAirlines.length ? `${activeAirlines.length}` : undefined}>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1 mt-0.5`}>🇮🇳 Indian Carriers</div>
          {INDIAN_AIRLINES.map(a => (
            <AirlineRow key={a.code} {...a} checked={activeAirlines.includes(a.code)} onClick={() => onAirlinesChange(toggle(activeAirlines, a.code))} />
          ))}
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1 mt-2`}>🌍 International</div>
          {INTL_AIRLINES.map(a => (
            <AirlineRow key={a.code} {...a} checked={activeAirlines.includes(a.code)} onClick={() => onAirlinesChange(toggle(activeAirlines, a.code))} />
          ))}
        </Fold>

        {/* ═══ 5. GEOGRAPHY (FIR) ═══ */}
        <Fold title="Route & Geography" icon={<MapPin size={12} />} accent={ACCENT.sovereign} badge={activeFIRs.length ? `${activeFIRs.length}` : undefined}>
          <div className={`grid grid-cols-2 ${SPACE.gridGap}`}>
            {FIRS.map(f => {
              const on = activeFIRs.includes(f.code);
              return (
                <button key={f.code} onClick={() => onFIRsChange(toggle(activeFIRs, f.code))}
                  className={`p-2 rounded-md border text-left transition-all ${on ? `${f.bg}` : `${COLOR.subtleBg} ${COLOR.inactiveBorder} ${COLOR.hoverBg}`}`}>
                  <div className={`${TEXT.label} font-bold ${on ? f.color : 'text-slate-600 dark:text-slate-400'}`}>{f.name}</div>
                  <div className={`${TEXT.sub} ${on ? 'opacity-70' : COLOR.labelText}`}>{f.region} India</div>
                  <div className={`${TEXT.sub} font-mono mt-0.5 ${on ? 'opacity-60' : 'text-slate-300 dark:text-white/15'}`}>{f.code}</div>
                </button>
              );
            })}
          </div>
        </Fold>

        {/* ═══ 6. FLIGHT DENSITY ═══ */}
        <Fold title="Flight Density" icon={<Gauge size={12} />} accent={ACCENT.telemetry}>
          <div className="flex flex-wrap gap-1.5">
            <Pill label="Nearby (0–200 km)" active={false} onClick={() => {}} />
            <Pill label="Regional (India)" active={true} onClick={() => {}} />
            <Pill label="Global" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ AUTH-GATED SECTIONS ═══ */}

        {/* ═══ 7. DATA QUALITY (Auth) ═══ */}
        <Fold title="Signal & Transparency" icon={<Signal size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="flex flex-wrap gap-1.5">
            <Pill label="🟢 High Signal" active={false} onClick={() => {}} />
            <Pill label="🟡 Medium" active={false} onClick={() => {}} />
            <Pill label="🔴 Low / Lost" active={false} onClick={() => {}} />
          </div>
          <div className={`mt-2 flex items-center justify-between px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <span className={`${TEXT.sub} ${COLOR.labelText}`}>Min. Receivers</span>
            <span className={`${TEXT.badge} font-bold ${COLOR.valueText}`}>≥ 3 stations</span>
          </div>
          <div className={`mt-1.5 flex gap-1.5`}>
            <Pill label="ADS-B Only" active={true} onClick={() => {}} />
            <Pill label="Include MLAT" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 8. ADVANCED AIRCRAFT (Auth) ═══ */}
        <Fold title="Advanced Filters" icon={<Gauge size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className="space-y-2">
            <RangeSlider label="Altitude" min={0} max={60000} value={altRange} onChange={onAltRangeChange} unit="ft" emoji="🏔️" />
            <RangeSlider label="Speed" min={0} max={800} value={speedRange} onChange={onSpeedRangeChange} unit="kts" emoji="💨" />
          </div>
        </Fold>

        {/* ═══ 9. CONTRIBUTOR LAYER (Auth) ═══ */}
        <Fold title="Contributor Filters" icon={<Signal size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="flex flex-wrap gap-1.5">
            <Pill label="My Station" active={false} onClick={() => {}} />
            <Pill label="Top Stations" active={false} onClick={() => {}} />
            <Pill label="Weak Coverage" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 10. OPS INTELLIGENCE (Auth) ═══ */}
        <Fold title="Ops Intelligence" icon={<Gauge size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <p className={`${TEXT.sub} ${COLOR.labelText} italic`}>Turnaround risk, fuel inefficiency, congestion-heavy arrivals, delay probability &gt; 60% — available in Enterprise tier.</p>
          </div>
        </Fold>

        {/* ── Auth CTA ── */}
        {L && (
          <div className={`${SPACE.pad} border-t ${COLOR.divider}`}>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for signal filters, advanced telemetry, contributor layers & ops intelligence</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrafficFilterPanel;
