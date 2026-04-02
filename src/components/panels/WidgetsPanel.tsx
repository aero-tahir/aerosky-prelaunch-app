import React, { useState } from 'react';
import {
  Plane, Brain, Target, Globe, Signal, Radio,
  Lock, ChevronDown, ChevronRight, Eye, MapPin,
  Activity, Navigation, Wifi, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';

export interface WidgetConfig {
  showTelemetry: boolean; showCompass: boolean; showMiniMap: boolean;
  showWeatherLegend: boolean; showNetworkStatus: boolean; showSignalConfidence: boolean;
}

interface Props {
  config: WidgetConfig;
  onChange: (c: WidgetConfig) => void;
}

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
      <span className={`${TEXT.label} font-bold block ${active ? COLOR.activeText : 'text-slate-600 dark:text-white/50'}`}>{label}</span>
      {desc && <span className={`${TEXT.sub} ${COLOR.labelText} block`}>{desc}</span>}
    </div>
    <div className={`w-7 h-[16px] rounded-full relative transition-all shrink-0 ${active ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-white/10'}`}>
      <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'left-[12px]' : 'left-[2px]'}`} />
    </div>
  </button>
);

/* ── Info row ── */
const Info: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className={`flex items-center justify-between ${SPACE.rowPy}`}>
    <span className={`${TEXT.label} ${COLOR.labelText}`}>{label}</span>
    <span className={`${TEXT.badge} font-bold ${color || COLOR.valueText}`}>{value}</span>
  </div>
);

const WidgetsPanel: React.FC<Props> = ({ config: c, onChange }) => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const set = (patch: Partial<WidgetConfig>) => onChange({ ...c, ...patch });

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ── Header ── */}
      <div className={`${SPACE.pad} ${COLOR.subtleBg} border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🛫</span>
          <span className={`${TEXT.label} font-bold text-slate-700 dark:text-white/70`}>Flight Deck Widgets</span>
        </div>
        <p className={`${TEXT.sub} ${COLOR.labelText} leading-relaxed`}>
          Control what you see right now. Temporary visual controls — resets on reload.
        </p>
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ═══ 1. FLIGHT VISIBILITY (Default open) ═══ */}
        <Fold title="Flight Visibility" icon={<Plane size={12} />} open accent={ACCENT.aircraft}>
          <div className="space-y-0.5">
            <Toggle label="Aircraft Labels" desc="Show labels on aircraft markers" active={c.showTelemetry} onClick={() => set({ showTelemetry: !c.showTelemetry })} />
            <Toggle label="Flight Trails" desc="Historical track behind aircraft" active={c.showCompass} onClick={() => set({ showCompass: !c.showCompass })} />
            <Toggle label="Position Marker" desc="Current location indicator" active={true} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 2. INTELLIGENCE OVERLAY (Default open) ═══ */}
        <Fold title="Intelligence Overlay" icon={<Brain size={12} />} open accent={ACCENT.telemetry}>
          <div className="space-y-0.5">
            <Toggle label="AI Insights" desc="Passenger intelligence briefings" active={true} onClick={() => {}} />
            <Toggle label="Delay & Weather Alerts" desc="Show alert badges on flights" active={true} onClick={() => {}} />
            <Toggle label="Highlight Impacted" desc="Visually mark affected flights" active={false} onClick={() => {}} />
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>OFF = raw map · ON = enriched experience</p>
        </Fold>

        {/* ═══ 3. FOCUS MODE ═══ */}
        <Fold title="Focus Mode" icon={<Target size={12} />} accent={ACCENT.environment}>
          <div className="space-y-0.5">
            <Toggle label="Focus Selected Flight" desc="Center & zoom on clicked aircraft" active={true} onClick={() => {}} />
            <Toggle label="Dim Other Traffic" desc="Fade non-selected flights" active={false} onClick={() => {}} />
            <Toggle label="Highlight Route" desc="Show origin → destination path" active={true} onClick={() => {}} />
          </div>
          <div className={`mt-2 px-2 py-1.5 bg-cyan-50 dark:bg-cyan-500/[0.04] border border-cyan-200 dark:border-cyan-500/10 rounded-md`}>
            <p className={`${TEXT.sub} text-cyan-700 dark:text-cyan-400`}>🎯 Focus mode is temporary — resets when you deselect</p>
          </div>
        </Fold>

        {/* ═══ 4. SITUATIONAL AWARENESS ═══ */}
        <Fold title="Situational Awareness" icon={<Globe size={12} />} accent={ACCENT.sovereign}>
          <div className="space-y-0.5">
            <Toggle label="FIR Boundaries" desc="Indian airspace sectors" active={true} onClick={() => {}} />
            <Toggle label="Airport Highlights" desc="Major airport markers" active={true} onClick={() => {}} />
            <Toggle label="Traffic Density" desc="Congestion heatmap overlay" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ AUTH-GATED SECTIONS ═══ */}

        {/* ═══ 5. NETWORK VISIBILITY (Auth) ═══ */}
        <Fold title="Network Visibility" icon={<Signal size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="space-y-0.5">
            <Toggle label="Tracking Stations" desc="Show ground receiver locations" active={c.showNetworkStatus} onClick={() => set({ showNetworkStatus: !c.showNetworkStatus })} />
            <Toggle label="Signal Strength" desc="RSSI overlay on map" active={c.showSignalConfidence} onClick={() => set({ showSignalConfidence: !c.showSignalConfidence })} />
            <Toggle label="High Confidence Only" desc="Highlight verified tracks" active={false} onClick={() => {}} />
          </div>
          <div className={`mt-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Active Stations" value="850+" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="Coverage" value="98% Indian airspace" color="text-cyan-500 dark:text-cyan-400" />
          </div>
        </Fold>

        {/* ═══ 6. DATA VISUALIZATION (Auth) ═══ */}
        <Fold title="Data Visualization" icon={<Radio size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="space-y-0.5">
            <Toggle label="ADS-B Tracks" desc="Real surveillance tracks" active={true} onClick={() => {}} />
            <Toggle label="MLAT Tracks" desc="Multilateration estimates" active={false} onClick={() => {}} />
            <Toggle label="Estimated Paths" desc="Projected positions (dashed)" active={false} onClick={() => {}} />
          </div>
          <p className={`mt-1.5 ${TEXT.sub} ${COLOR.labelText} italic`}>Settings controls data policy · Widgets control visual display</p>
        </Fold>

        {/* ═══ 7. ADVANCED FLIGHT VISUALS (Auth) ═══ */}
        <Fold title="Advanced Visuals" icon={<Navigation size={12} />} locked={L} accent={ACCENT.aircraft}>
          <div className="space-y-0.5">
            <Toggle label="Vector Projection" desc="Future path prediction line" active={false} onClick={() => {}} />
            <Toggle label="Aircraft Orientation" desc="Heading arrow on markers" active={false} onClick={() => {}} />
            <Toggle label="Extended Trails" desc="Longer historical track" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 8. OPERATIONAL OVERLAYS (Auth) ═══ */}
        <Fold title="Operational Overlays" icon={<Activity size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className="space-y-0.5">
            <Toggle label="Holding Patterns" desc="Active holding stacks" active={false} onClick={() => {}} />
            <Toggle label="Congestion Zones" desc="High-traffic areas" active={false} onClick={() => {}} />
            <Toggle label="Approach Sequences" desc="Landing queue visualization" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 9. SYSTEM VISUALIZATION (Auth) ═══ */}
        <Fold title="System Health" icon={<Wifi size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Data Latency" value="< 2s" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="Update Frequency" value="1 Hz" />
            <Info label="Signal Density" value="High" color="text-cyan-500 dark:text-cyan-400" />
            <Info label="Feed Source" value="ADS-B Live" color="text-emerald-500 dark:text-emerald-400" />
          </div>
        </Fold>

        {/* ── Auth CTA ── */}
        {L && (
          <div className={`${SPACE.pad} border-t ${COLOR.divider}`}>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for network visibility, data layers, advanced visuals & operational overlays</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WidgetsPanel;
