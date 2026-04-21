import React, { useState } from 'react';
import {
  Play, Pause, SkipBack, Clock, Lock,
  ChevronDown, ChevronRight, AlertTriangle,
  CloudRain, Plane, Signal, MapPin, BarChart3, Radio
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

/* ── Info row ── */
const Info: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className={`flex items-center justify-between ${SPACE.rowPy}`}>
    <span className={`${TEXT.label} ${COLOR.labelText}`}>{label}</span>
    <span className={`${TEXT.badge} font-bold ${color || COLOR.valueText}`}>{value}</span>
  </div>
);

const PlaybackPanel: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const [timeOffset, setTimeOffset] = useState(0); // minutes ago
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 5 | 10>(1);

  const timeLabel = timeOffset === 0 ? 'Now' : timeOffset < 60 ? `${timeOffset}m ago` : `${Math.round(timeOffset / 60)}h ${timeOffset % 60}m ago`;

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ── Header ── */}
      <div className={`${SPACE.pad} ${COLOR.subtleBg} border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🕒</span>
          <span className={`${TEXT.label} font-bold text-slate-700 dark:text-slate-300`}>Airspace Time Machine</span>
        </div>
        <p className={`${TEXT.sub} ${COLOR.labelText} leading-relaxed`}>
          See what happened — and understand why. Replay Indian airspace up to 24 hours.
        </p>
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ═══ 1. TIME NAVIGATOR (Hero) ═══ */}
        <div className={`${SPACE.pad} border-b ${COLOR.divider}`}>
          {/* Current time display */}
          <div className="flex items-center justify-between mb-2">
            <span className={`${TEXT.badge} font-bold ${COLOR.activeText} font-mono ${COLOR.activeBg} px-2 py-0.5 rounded-md`}>{timeLabel}</span>
            <span className={`${TEXT.sub} ${COLOR.labelText} font-mono`}>
              {new Date(Date.now() - timeOffset * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>

          {/* Timeline slider */}
          <div className="relative mb-2">
            <input
              type="range" min={0} max={1440} value={timeOffset}
              onChange={(e) => setTimeOffset(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between mt-1">
              <span className={`${TEXT.sub} ${COLOR.labelText}`}>-24h</span>
              <span className={`${TEXT.sub} ${COLOR.labelText}`}>Now</span>
            </div>
          </div>

          {/* Quick jump buttons */}
          <div className="flex gap-1.5 mb-3">
            {[
              { label: '-6h', offset: 360 },
              { label: '-1h', offset: 60 },
              { label: '-30m', offset: 30 },
              { label: 'Now', offset: 0 },
            ].map(j => (
              <button key={j.label} onClick={() => setTimeOffset(j.offset)}
                className={`flex-1 py-1.5 rounded-md border ${TEXT.badge} font-bold transition-all ${
                  timeOffset === j.offset ? `${COLOR.activeBg} ${COLOR.activeBorder} ${COLOR.activeText}` : `${COLOR.subtleBg} ${COLOR.inactiveBorder} text-slate-500 dark:text-slate-400 ${COLOR.hoverBg}`
                }`}>
                {j.label}
              </button>
            ))}
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => setPlaying(!playing)}
              className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all ${playing ? `${COLOR.activeBg} ${COLOR.activeBorder} ${COLOR.activeText}` : `${COLOR.subtleBg} ${COLOR.inactiveBorder} text-slate-500 dark:text-slate-400`}`}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="flex-1 flex gap-1">
              {([1, 5, 10] as const).map(s => (
                <button key={s} onClick={() => setSpeed(s)}
                  className={`flex-1 py-1.5 rounded-md border ${TEXT.sub} font-bold transition-all ${
                    speed === s ? `${COLOR.activeBg} ${COLOR.activeBorder} ${COLOR.activeText}` : `${COLOR.subtleBg} ${COLOR.inactiveBorder} text-slate-500 dark:text-slate-400 ${COLOR.hoverBg}`
                  }`}>
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ 2. WHAT WAS HAPPENING (Insight) ═══ */}
        <Fold title="What Was Happening" icon={<Clock size={12} />} open accent={ACCENT.aircraft}>
          <div className="bg-cyan-50 dark:bg-cyan-500/[0.04] border border-cyan-200 dark:border-cyan-500/10 rounded-md px-2.5 py-2">
            <p className={`${TEXT.label} text-slate-600 dark:text-slate-400 leading-relaxed italic`}>
              {timeOffset === 0
                ? '"Live operations normal. Delhi FIR experiencing moderate arrival congestion."'
                : timeOffset < 120
                  ? '"Fog clearing at Delhi. Departure queue reducing. Normal operations resuming across Indian airspace."'
                  : '"Heavy arrival congestion in Delhi FIR causing holding patterns. Weather disruption over Northeast leading to reroutes."'
              }
            </p>
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>🧠 AeroSky explains the past — not just replays it</p>
        </Fold>

        {/* ═══ 3. AIRSPACE SNAPSHOT ═══ */}
        <Fold title="Airspace Snapshot" icon={<BarChart3 size={12} />} open accent={ACCENT.environment}>
          <div className={`grid grid-cols-3 ${SPACE.gridGap}`}>
            {[
              { label: 'Flights', value: timeOffset === 0 ? '126' : timeOffset < 360 ? '98' : '42', color: COLOR.valueText },
              { label: 'Congestion', value: timeOffset < 120 ? 'High' : 'Medium', color: timeOffset < 120 ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400' },
              { label: 'Weather', value: 'Moderate', color: 'text-amber-500 dark:text-amber-400' },
            ].map(d => (
              <div key={d.label} className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md text-center`}>
                <div className={`${TEXT.sub} ${COLOR.labelText}`}>{d.label}</div>
                <div className={`${TEXT.badge} font-bold ${d.color}`}>{d.value}</div>
              </div>
            ))}
          </div>
        </Fold>

        {/* ═══ 4. FLIGHT REPLAY ═══ */}
        <Fold title="Selected Flight Replay" icon={<Plane size={12} />} accent={ACCENT.aircraft}>
          <p className={`${TEXT.sub} ${COLOR.labelText} italic mb-2`}>Select a flight on the map to see its full replay</p>
          <div className="grid grid-cols-4 gap-1">
            {['Departed', 'Cruise', 'Holding', 'Landing'].map((phase, i) => (
              <div key={phase}>
                <div className={`h-[3px] rounded-full ${i < 2 ? 'bg-cyan-500' : `bg-slate-200 dark:bg-white/[0.04]`}`} />
                <div className={`${TEXT.sub} font-bold uppercase text-center mt-0.5 ${i < 2 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-300 dark:text-white/10'}`} style={{ fontSize: '7px' }}>{phase}</div>
              </div>
            ))}
          </div>
        </Fold>

        {/* ═══ AUTH-GATED SECTIONS ═══ */}

        {/* ═══ 5. EVENT MARKERS (Auth) ═══ */}
        <Fold title="Timeline Events" icon={<AlertTriangle size={12} />} locked={L} accent={ACCENT.registry}>
          <div className="space-y-1.5">
            {[
              { time: '18:42', icon: '⚠️', text: 'Delay spike — DEL arrivals', severity: 'text-amber-600 dark:text-amber-400' },
              { time: '17:15', icon: '🌧', text: 'Weather event — NE sector rain', severity: 'text-blue-600 dark:text-blue-400' },
              { time: '16:30', icon: '🔁', text: 'Holding pattern — BOM approach', severity: 'text-purple-600 dark:text-purple-400' },
              { time: '15:05', icon: '🚨', text: 'Diversion — AI302 to JAI', severity: 'text-red-600 dark:text-red-400' },
            ].map(e => (
              <button key={e.time} onClick={() => {}} className={`w-full flex items-center gap-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md text-left ${COLOR.hoverBg} transition-all`}>
                <span className={`${TEXT.sub} font-mono font-bold ${COLOR.labelText}`}>{e.time}</span>
                <span className="text-xs">{e.icon}</span>
                <span className={`${TEXT.sub} ${e.severity} font-bold flex-1`}>{e.text}</span>
              </button>
            ))}
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>Click any event to jump to that moment</p>
        </Fold>

        {/* ═══ 6. DATA TRANSPARENCY (Auth) ═══ */}
        <Fold title="Replay Transparency" icon={<Signal size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Stations Active" value={timeOffset === 0 ? '850+' : timeOffset < 360 ? '820' : '790'} color="text-emerald-500 dark:text-emerald-400" />
            <Info label="Signal Quality" value={timeOffset < 120 ? 'High' : 'Medium'} color={timeOffset < 120 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'} />
            <Info label="Data Confidence" value="Verified" color="text-cyan-500 dark:text-cyan-400" />
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>Trust maintained even in historical view</p>
        </Fold>

        {/* ═══ 7. FIR REPLAY FILTERS (Auth) ═══ */}
        <Fold title="FIR Replay Filter" icon={<MapPin size={12} />} locked={L} accent={ACCENT.sovereign}>
          <div className={`grid grid-cols-2 ${SPACE.gridGap}`}>
            {[
              { fir: 'Delhi FIR', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/[0.06] border-amber-200 dark:border-amber-500/15' },
              { fir: 'Mumbai FIR', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/[0.06] border-blue-200 dark:border-blue-500/15' },
              { fir: 'Chennai FIR', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/[0.06] border-emerald-200 dark:border-emerald-500/15' },
              { fir: 'Kolkata FIR', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/[0.06] border-purple-200 dark:border-purple-500/15' },
            ].map(f => (
              <button key={f.fir} className={`px-2 py-1.5 border rounded-md text-left ${f.bg} ${COLOR.hoverBg} transition-all`}>
                <div className={`${TEXT.badge} font-bold ${f.color}`}>{f.fir}</div>
              </button>
            ))}
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>🇮🇳 India-first replay segmentation</p>
        </Fold>

        {/* ═══ 8. ADVANCED ANALYTICS (Auth) ═══ */}
        <Fold title="Analytics Replay" icon={<BarChart3 size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Congestion Heatmap" value="Available" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="Runway Usage" value="DEL, BOM, BLR" />
            <Info label="Arrival Clustering" value="Phase 2" color={COLOR.labelText} />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-1`}>Compare: Today vs Yesterday · Peak vs Normal</p>
          </div>
        </Fold>

        {/* ═══ 9. AIRPORT REPLAY (Auth) ═══ */}
        <Fold title="Airport Replay" icon={<Radio size={12} />} locked={L} accent={ACCENT.registry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <p className={`${TEXT.sub} ${COLOR.labelText} italic`}>Replay taxi movements, departures & arrivals at major airports. Solves the "tarmac black hole" — coming in Enterprise tier.</p>
          </div>
        </Fold>

        {/* ── Auth CTA ── */}
        {L && (
          <div className={`${SPACE.pad} border-t ${COLOR.divider}`}>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for timeline events, FIR filters, analytics replay & airport replay</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlaybackPanel;
