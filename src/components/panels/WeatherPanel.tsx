import React, { useState } from 'react';
import {
  CloudRain, Wind, Thermometer, AlertTriangle, Lock,
  ChevronDown, ChevronRight, Eye, Plane, Radio,
  Signal, Clock, MapPin, CloudSun, Snowflake
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';

/* ── Fold ── */
const Fold: React.FC<{
  title: string; icon: React.ReactNode; open?: boolean;
  locked?: boolean; accent?: string; children: React.ReactNode;
}> = ({ title, icon, open: init = false, locked, accent, children }) => {
  const [open, setOpen] = useState(init);
  return (
    <div className={`border-t ${COLOR.divider}`} style={open && accent ? { borderLeftWidth: '2px', borderLeftColor: accent } : undefined}>
      <button onClick={() => !locked && setOpen(p => !p)} className={`w-full flex items-center gap-2 ${SPACE.pad} text-left group transition-colors ${open && !locked ? COLOR.subtleBg : ''}`}>
        <span style={open && accent ? { color: accent } : undefined} className={open && accent ? '' : COLOR.inactiveText}>{icon}</span>
        <span className={`flex-1 ${TEXT.sectionTitle} transition-colors ${open && !locked ? COLOR.titleActiveText : COLOR.titleText}`}>{title}</span>
        {locked
          ? <Lock size={11} className={COLOR.lockedText} />
          : <span className={COLOR.inactiveText}>{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
        }
      </button>
      {open && !locked && <div className={`${SPACE.px} pb-2.5 sm:pb-3`}>{children}</div>}
    </div>
  );
};

/* ── Toggle ── */
const Toggle: React.FC<{ label: string; desc?: string; active: boolean; onClick: () => void }> = ({ label, desc, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-2 py-1.5 sm:py-2 rounded-md transition-all ${active ? 'bg-cyan-50/80 dark:bg-cyan-500/[0.06]' : ''}`}>
    <div className="text-left">
      <span className={`${TEXT.label} font-bold block ${active ? COLOR.activeText : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
      {desc && <span className={`${TEXT.sub} ${COLOR.labelText} block`}>{desc}</span>}
    </div>
    <div className={`w-7 h-[16px] rounded-full relative transition-all shrink-0 ${active ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/10'}`}>
      <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'left-[12px]' : 'left-[2px]'}`} />
    </div>
  </button>
);

/* ── Alert badge ── */
const Alert: React.FC<{ severity: 'info' | 'advisory' | 'critical'; text: string }> = ({ severity, text }) => {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-500/[0.06] border-blue-200 dark:border-blue-500/15 text-blue-700 dark:text-blue-400',
    advisory: 'bg-amber-50 dark:bg-amber-500/[0.06] border-amber-200 dark:border-amber-500/15 text-amber-700 dark:text-amber-400',
    critical: 'bg-red-50 dark:bg-red-500/[0.06] border-red-200 dark:border-red-500/15 text-red-700 dark:text-red-400',
  };
  const icons = { info: '🟢', advisory: '🟡', critical: '🔴' };
  return (
    <div className={`flex items-start gap-2 px-2 py-1.5 border rounded-md ${styles[severity]}`}>
      <span className="text-xs shrink-0 mt-0.5">{icons[severity]}</span>
      <span className={`${TEXT.sub} leading-relaxed`}>{text}</span>
    </div>
  );
};

/* ── Info row ── */
const Info: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className={`flex items-center justify-between ${SPACE.rowPy}`}>
    <span className={`${TEXT.label} ${COLOR.labelText}`}>{label}</span>
    <span className={`${TEXT.badge} font-bold ${color || COLOR.valueText}`}>{value}</span>
  </div>
);

const WeatherPanel: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;

  const forecast = [
    { day: 'Thu', hi: 31, lo: 24 }, { day: 'Fri', hi: 32, lo: 25 },
    { day: 'Sat', hi: 32, lo: 25 }, { day: 'Sun', hi: 32, lo: 23 },
    { day: 'Mon', hi: 32, lo: 24 },
  ];
  const precip = [0, 0, 0, 5, 12, 8, 0, 0]; // 3-hr slots

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ── Live Weather Widget ── */}
      <div className={`${SPACE.pad} ${COLOR.subtleBg} border-b ${COLOR.divider} shrink-0`}>
        {/* Current conditions */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className={`${TEXT.label} font-bold text-slate-700 dark:text-slate-300`}>Mumbai, India</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">27°</span>
              <span className={`${TEXT.sub} ${COLOR.labelText}`}>C</span>
            </div>
            <span className={`${TEXT.sub} text-amber-600 dark:text-amber-400`}>☀️ Sunny and clear</span>
          </div>
          <div className="text-right">
            <div className="text-4xl leading-none">☀️</div>
            <span className={`${TEXT.sub} ${COLOR.labelText} font-mono`}>IST {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })}</span>
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="flex gap-1 mb-2">
          {forecast.map(d => (
            <div key={d.day} className={`flex-1 text-center px-1 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
              <div className={`${TEXT.sub} ${COLOR.labelText} font-bold`}>{d.day}</div>
              <div className={`${TEXT.sub} text-slate-700 dark:text-white/60 font-bold`}>{d.hi}°</div>
              <div className={`${TEXT.sub} ${COLOR.labelText}`}>{d.lo}°</div>
            </div>
          ))}
        </div>

        {/* Precipitation bar */}
        <div>
          <div className={`${TEXT.sub} ${COLOR.labelText} font-bold uppercase tracking-wider mb-1`}>Precipitation (next 24h)</div>
          <div className="flex items-end gap-[2px] h-6">
            {precip.map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full rounded-t-sm bg-blue-400/60 dark:bg-blue-400/40 transition-all" style={{ height: `${Math.max(p * 4, 1)}px` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-0.5">
            <span className={`${TEXT.sub} ${COLOR.labelText}`} style={{ fontSize: '7px' }}>Now</span>
            <span className={`${TEXT.sub} ${COLOR.labelText}`} style={{ fontSize: '7px' }}>+24h</span>
          </div>
        </div>
      </div>

      {/* ── Impact Summary ── */}
      <div className={`${SPACE.pad} border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
            <CloudSun size={16} className="text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`${TEXT.label} font-bold text-amber-600 dark:text-amber-400`}>🟡 Moderate Impact</span>
            </div>
            <span className={`${TEXT.sub} ${COLOR.labelText}`}>Updated 2 min ago</span>
          </div>
        </div>
        <p className={`${TEXT.label} text-slate-600 dark:text-slate-400 leading-relaxed italic`}>
          "Stable skies over most regions. Reduced visibility (~3 km) near Delhi. Minor delays possible for northern arrivals."
        </p>
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ═══ 1. ACTIVE ALERTS (Default open) ═══ */}
        <Fold title="Active Weather Alerts" icon={<AlertTriangle size={12} />} open accent={ACCENT.registry}>
          <div className="space-y-1.5">
            <Alert severity="advisory" text="SIGMET: Moderate turbulence reported over Himalayan corridor (FL250–FL380)" />
            <Alert severity="advisory" text="Low Visibility: Delhi VIDP ~3000m — CAT III procedures may activate" />
            <Alert severity="info" text="Localized rain cells: Northeast sector (Guwahati, Bagdogra)" />
            <Alert severity="info" text="Monsoon activity: Kerala coast — normal seasonal pattern" />
          </div>
        </Fold>

        {/* ═══ 2. PASSENGER IMPACT ═══ */}
        <Fold title="Passenger Impact" icon={<Plane size={12} />} open accent={ACCENT.aircraft}>
          <div className={`grid grid-cols-3 ${SPACE.gridGap} mb-2`}>
            {[
              { label: 'Delay Risk', value: 'Medium', color: 'text-amber-500 dark:text-amber-400' },
              { label: 'Affected', value: '~12 flights', color: COLOR.valueText },
              { label: 'Severity', value: 'Low', color: 'text-emerald-500 dark:text-emerald-400' },
            ].map(d => (
              <div key={d.label} className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md text-center`}>
                <div className={`${TEXT.sub} ${COLOR.labelText}`}>{d.label}</div>
                <div className={`${TEXT.badge} font-bold ${d.color}`}>{d.value}</div>
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
            <Toggle label="Weather-Affected Flights" desc="Highlight impacted aircraft" active={false} onClick={() => {}} />
            <Toggle label="Landing Difficulty Zones" desc="Crosswind & visibility risk" active={false} onClick={() => {}} />
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>Crosswinds may impact landing stability at BOM</p>
        </Fold>

        {/* ═══ 3. WEATHER LAYERS ═══ */}
        <Fold title="Weather Layers" icon={<CloudRain size={12} />} accent={ACCENT.environment}>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5`}>Precipitation</div>
          <div className="space-y-0.5">
            <Toggle label="Rainfall Radar (IMD)" desc="Indian Meteorological Department" active={false} onClick={() => {}} />
            <Toggle label="Cloud Cover" desc="Satellite imagery overlay" active={false} onClick={() => {}} />
          </div>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Wind</div>
          <div className="space-y-0.5">
            <Toggle label="Surface Wind" desc="Ground-level wind arrows" active={false} onClick={() => {}} />
            <Toggle label="Upper Wind" desc="Jet stream (simplified)" active={false} onClick={() => {}} />
          </div>
          <div className={`${TEXT.sub} ${COLOR.labelText} uppercase tracking-wider font-bold mb-1.5 mt-3`}>Temperature</div>
          <div className="space-y-0.5">
            <Toggle label="Surface Temperature" desc="Ground OAT" active={false} onClick={() => {}} />
            <Toggle label="Flight Level Temp" desc="High-altitude relevance" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 4. INDIA REGIONAL ═══ */}
        <Fold title="India Regional Weather" icon={<MapPin size={12} />} accent={ACCENT.sovereign}>
          <div className={`grid grid-cols-2 ${SPACE.gridGap}`}>
            {[
              { zone: 'Monsoon Zone', status: 'Active (Kerala)', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/[0.06] border-blue-200 dark:border-blue-500/15' },
              { zone: 'Fog Zone', status: 'DEL, AMD, LKO', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/[0.06] border-amber-200 dark:border-amber-500/15' },
              { zone: 'Storm Cells', status: 'NE Sector', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/[0.06] border-purple-200 dark:border-purple-500/15' },
              { zone: 'Clear Skies', status: 'South & West', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/[0.06] border-emerald-200 dark:border-emerald-500/15' },
            ].map(z => (
              <div key={z.zone} className={`px-2 py-1.5 border rounded-md ${z.bg}`}>
                <div className={`${TEXT.sub} ${COLOR.labelText}`}>{z.zone}</div>
                <div className={`${TEXT.badge} font-bold ${z.color}`}>{z.status}</div>
              </div>
            ))}
          </div>
        </Fold>

        {/* ═══ AUTH-GATED SECTIONS ═══ */}

        {/* ═══ 5. AVIATION WEATHER (Auth) ═══ */}
        <Fold title="Aviation Weather" icon={<Wind size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className="space-y-0.5">
            <Toggle label="Turbulence Layer" desc="Light / Moderate / Severe" active={false} onClick={() => {}} />
            <Toggle label="Wind Shear Detection" desc="Approach & departure zones" active={false} onClick={() => {}} />
            <Toggle label="Icing Zones" desc="Altitude-based icing risk" active={false} onClick={() => {}} />
            <Toggle label="Jet Streams" desc="FL-level wind corridors" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 6. IMD RADAR INTELLIGENCE (Auth) ═══ */}
        <Fold title="IMD Radar Intelligence" icon={<Radio size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="space-y-0.5">
            <Toggle label="Radar Coverage Map" desc="IMD station coverage zones" active={false} onClick={() => {}} />
            <Toggle label="Station Sources" desc="Active IMD radar nodes" active={false} onClick={() => {}} />
            <Toggle label="Radar Confidence" desc="Data freshness & quality" active={false} onClick={() => {}} />
          </div>
          <div className={`mt-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="IMD Stations" value="24 active" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="Last Refresh" value="< 5 min" />
            <Info label="Coverage" value="92% Indian airspace" color="text-cyan-500 dark:text-cyan-400" />
          </div>
        </Fold>

        {/* ═══ 7. FLIGHT-WEATHER CORRELATION (Auth) ═══ */}
        <Fold title="Flight-Weather Link" icon={<Plane size={12} />} locked={L} accent={ACCENT.aircraft}>
          <div className="space-y-0.5">
            <Toggle label="Turbulence-Affected" desc="Flights in turbulence zones" active={false} onClick={() => {}} />
            <Toggle label="Rain-Impacted" desc="Flights in precipitation" active={false} onClick={() => {}} />
            <Toggle label="Wind-Affected" desc="Strong headwind/crosswind" active={false} onClick={() => {}} />
            <Toggle label="Rerouted Flights" desc="Weather diversions" active={false} onClick={() => {}} />
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>🔥 Which flights are affected by this weather? AeroSky's unique correlation engine.</p>
        </Fold>

        {/* ═══ 8. PREDICTIVE WEATHER (Auth) ═══ */}
        <Fold title="Predictive Intelligence" icon={<Clock size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Delay Probability" value="Medium (DEL)" color="text-amber-500 dark:text-amber-400" />
            <Info label="Storm Movement" value="NE → 12 kts" />
            <Info label="Runway Risk" value="Low" color="text-emerald-500 dark:text-emerald-400" />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-1`}>4D weather timeline (Now → +6 hrs) — coming soon</p>
          </div>
        </Fold>

        {/* ═══ 9. AIRPORT WEATHER OPS (Auth) ═══ */}
        <Fold title="Airport Weather Ops" icon={<Eye size={12} />} locked={L} accent={ACCENT.registry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="DEL Visibility" value="RVR 3000m" color="text-amber-500 dark:text-amber-400" />
            <Info label="DEL Crosswind" value="8 kts" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="DEL CAT Status" value="CAT I" />
            <Info label="BOM Visibility" value="> 10 km" color="text-emerald-500 dark:text-emerald-400" />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-1`}>"DEL operating under CAT I — standard procedures active"</p>
          </div>
        </Fold>

        {/* ── Auth CTA ── */}
        {L && (
          <div className={`${SPACE.pad} border-t ${COLOR.divider}`}>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for aviation weather, IMD radar, flight-weather correlation & predictive intelligence</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WeatherPanel;
