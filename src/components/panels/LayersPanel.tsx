import React, { useState } from 'react';
import {
  Plane, MapPin, ShieldAlert, Map as MapIcon, CloudRain,
  Radio, Signal, Lock, ChevronDown, ChevronRight,
  Wind, Thermometer, Eye, Activity, Navigation, Wifi,
  Sun, BarChart3, Radar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEXT, SPACE, COLOR, ACCENT } from './design-tokens';
import { RangeSlider } from '@/components/ui/PanelWidgets';

export interface LayerConfig {
  showFIR: boolean; showTerrain: boolean; showHolding: boolean;
  showAeroCharts: boolean; showAirportPins: boolean;
  showAirportLabels: boolean; showAircraftLabels: boolean;
  mapBrightness: number;
}

interface Props {
  layerConfig: LayerConfig;
  onLayerChange: (c: LayerConfig) => void;
  activeMapStyle: string;
  onStyleChange: (s: 'dark' | 'satellite' | 'street' | 'vector') => void;
}

/* ── Fold (same pattern as FlightIntelligenceCard) ── */
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
          : <span className={`${COLOR.inactiveText}`}>{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
        }
      </button>
      {open && !locked && <div className={`${SPACE.px} pb-2.5 sm:pb-3`}>{children}</div>}
    </div>
  );
};

/* ── Toggle row ── */
const Toggle: React.FC<{ label: string; desc?: string; active: boolean; onClick: () => void }> = ({ label, desc, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-2 py-1.5 sm:py-2 rounded-md transition-all ${active ? 'bg-cyan-50/80 dark:bg-cyan-500/[0.06]' : ''}`}>
    <div>
      <span className={`${TEXT.label} font-bold block ${active ? COLOR.activeText : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
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

const LayersPanel: React.FC<Props> = ({ layerConfig: c, onLayerChange, activeMapStyle, onStyleChange }) => {
  const { isLoggedIn } = useAuth();
  const L = !isLoggedIn;
  const set = (patch: Partial<LayerConfig>) => onLayerChange({ ...c, ...patch });

  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">

      {/* ── Header context ── */}
      <div className={`${SPACE.pad} ${COLOR.subtleBg} border-b ${COLOR.divider} shrink-0`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🇮🇳</span>
          <span className={`${TEXT.label} font-bold text-slate-700 dark:text-slate-300`}>Indian Airspace Control</span>
        </div>
        <p className={`${TEXT.sub} ${COLOR.labelText} leading-relaxed`}>
          Configure what you see on the map. Passenger-first defaults, advanced layers for enthusiasts.
        </p>
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ═══ 1. FLIGHT EXPERIENCE (Default open) ═══ */}
        <Fold title="Flight Experience" icon={<Plane size={12} />} open accent={ACCENT.aircraft}>
          <div className="space-y-1">
            <Toggle label="Flight Status Overlay" desc="Live status on aircraft markers" active={c.showAircraftLabels} onClick={() => set({ showAircraftLabels: !c.showAircraftLabels })} />
            <Toggle label="Holding Patterns" desc="Active holding stacks near airports" active={c.showHolding} onClick={() => set({ showHolding: !c.showHolding })} />
          </div>
          <div className={`mt-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Airspace Congestion" value="Moderate" color="text-amber-500 dark:text-amber-400" />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-0.5`}>Heavy arrivals near Delhi may cause holding patterns</p>
          </div>
        </Fold>

        {/* ═══ 2. AIRSPACE CONTEXT (Default open) ═══ */}
        <Fold title="Airspace Context" icon={<ShieldAlert size={12} />} open accent={ACCENT.sovereign}>
          <div className="space-y-1">
            <Toggle label="FIR Boundaries" desc="Indian Flight Information Regions" active={c.showFIR} onClick={() => set({ showFIR: !c.showFIR })} />
            <Toggle label="Terrain Awareness" desc="Himalayan corridor & blind spots" active={c.showTerrain} onClick={() => set({ showTerrain: !c.showTerrain })} />
          </div>
          <div className={`mt-2 grid grid-cols-2 ${SPACE.gridGap}`}>
            {[
              { fir: 'Delhi FIR', status: 'Busy', color: 'text-amber-500' },
              { fir: 'Mumbai FIR', status: 'Normal', color: 'text-emerald-500' },
              { fir: 'Chennai FIR', status: 'Normal', color: 'text-emerald-500' },
              { fir: 'Kolkata FIR', status: 'Low', color: 'text-blue-500' },
            ].map(f => (
              <div key={f.fir} className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
                <div className={`${TEXT.sub} ${COLOR.labelText}`}>{f.fir}</div>
                <div className={`${TEXT.badge} font-bold ${f.color}`}>{f.status}</div>
              </div>
            ))}
          </div>
        </Fold>

        {/* ═══ 3. AIRPORT AWARENESS (Default open) ═══ */}
        <Fold title="Airport Awareness" icon={<MapPin size={12} />} open accent={ACCENT.environment}>
          <div className="space-y-1">
            <Toggle label="Airport Pins" desc="Major Indian airports" active={c.showAirportPins} onClick={() => set({ showAirportPins: !c.showAirportPins })} />
            <Toggle label="Airport Labels" desc="IATA codes on map" active={c.showAirportLabels} onClick={() => set({ showAirportLabels: !c.showAirportLabels })} />
          </div>
          <div className={`mt-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="DEL" value="Busy · 25 min taxi" color="text-amber-500 dark:text-amber-400" />
            <Info label="BOM" value="Normal" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="BLR" value="Normal" color="text-emerald-500 dark:text-emerald-400" />
          </div>
        </Fold>

        {/* ═══ 4. ENVIRONMENT ═══ */}
        <Fold title="Environment" icon={<CloudRain size={12} />} accent={ACCENT.environment}>
          <div className="space-y-1">
            <Toggle label="Weather Impact Zones" desc="Monsoon, fog, storm cells" active={false} onClick={() => {}} />
            <Toggle label="Wind Field" desc="Upper-level wind arrows" active={false} onClick={() => {}} />
            <Toggle label="Temperature Zones" desc="High-altitude relevance" active={false} onClick={() => {}} />
          </div>
          <div className={`mt-2 px-2 py-1.5 bg-amber-50 dark:bg-amber-500/[0.04] border border-amber-200 dark:border-amber-500/10 rounded-md`}>
            <p className={`${TEXT.sub} text-amber-700 dark:text-amber-400`}>⚠️ Fog advisory active: DEL, AMD, LKO (0500-0900 IST)</p>
          </div>
        </Fold>

        {/* ═══ 5. LIVE FLIGHT DENSITY ═══ */}
        <Fold title="Flight Density" icon={<BarChart3 size={12} />} accent={ACCENT.telemetry}>
          <div className="space-y-1">
            <Toggle label="Traffic Density Heatmap" desc="Real-time flight concentration" active={false} onClick={() => {}} />
          </div>
          <div className={`mt-2 grid grid-cols-2 ${SPACE.gridGap}`}>
            <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md text-center`}>
              <div className={`${TEXT.sub} ${COLOR.labelText}`}>Low Alt</div>
              <div className={`${TEXT.badge} font-bold text-slate-700 dark:text-white/60`}>&lt; FL200</div>
            </div>
            <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md text-center`}>
              <div className={`${TEXT.sub} ${COLOR.labelText}`}>Cruise</div>
              <div className={`${TEXT.badge} font-bold text-slate-700 dark:text-white/60`}>FL200+</div>
            </div>
          </div>
        </Fold>

        {/* ═══ AUTH-GATED SECTIONS ═══ */}

        {/* ═══ 6. DATA TRANSPARENCY (Auth) ═══ */}
        <Fold title="Signal Transparency" icon={<Signal size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className="space-y-1">
            <Toggle label="ADS-B Coverage Map" desc="Ground receiver coverage zones" active={false} onClick={() => {}} />
            <Toggle label="Receiver Locations" desc="Fuzzed station positions" active={false} onClick={() => {}} />
            <Toggle label="Signal Strength Heatmap" desc="RSSI visualization" active={false} onClick={() => {}} />
            <Toggle label="MLAT Active Zones" desc="Multilateration areas" active={false} onClick={() => {}} />
          </div>
          <div className={`mt-2 px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <div className="flex items-center justify-between">
              <span className={`${TEXT.sub} ${COLOR.labelText}`}>Confidence Mode</span>
              <div className="flex gap-1.5">
                <span className={`${TEXT.sub} px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold`}>✅ Real</span>
                <span className={`${TEXT.sub} px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] ${COLOR.labelText} font-bold`}>⋯ Estimated</span>
              </div>
            </div>
          </div>
        </Fold>

        {/* ═══ 7. ADVANCED AIRSPACE (Auth) ═══ */}
        <Fold title="Airspace Structure" icon={<Navigation size={12} />} locked={L} accent={ACCENT.sovereign}>
          <div className="space-y-1">
            <Toggle label="FIR Sector Lines" desc="Detailed sector boundaries" active={c.showFIR} onClick={() => set({ showFIR: !c.showFIR })} />
            <Toggle label="ATC Boundaries" desc="Approach/departure zones" active={false} onClick={() => {}} />
            <Toggle label="Airways" desc="Published air routes" active={c.showAeroCharts} onClick={() => set({ showAeroCharts: !c.showAeroCharts })} />
            <Toggle label="Waypoints" desc="Navigation fixes" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 8. INFRASTRUCTURE (Auth) ═══ */}
        <Fold title="Infrastructure" icon={<MapPin size={12} />} locked={L} accent={ACCENT.registry}>
          <div className="space-y-1">
            <Toggle label="All Airport Tiers" desc="Tier 1, 2, 3 airports" active={c.showAirportPins} onClick={() => set({ showAirportPins: !c.showAirportPins })} />
            <Toggle label="Airport Labels" desc="IATA/ICAO codes" active={c.showAirportLabels} onClick={() => set({ showAirportLabels: !c.showAirportLabels })} />
            <Toggle label="Runway Layout" desc="Major airports (Phase 1)" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 9. AIRCRAFT CONTROLS (Auth) ═══ */}
        <Fold title="Aircraft Visualization" icon={<Plane size={12} />} locked={L} accent={ACCENT.aircraft}>
          <div className="space-y-1">
            <Toggle label="Aircraft Labels" desc="Callsign / airline on map" active={c.showAircraftLabels} onClick={() => set({ showAircraftLabels: !c.showAircraftLabels })} />
            <Toggle label="Vector Projection" desc="Heading prediction line" active={false} onClick={() => {}} />
            <Toggle label="Trail Length" desc="Historical track trail" active={false} onClick={() => {}} />
          </div>
        </Fold>

        {/* ═══ 10. B2B INTELLIGENCE (Auth) ═══ */}
        <Fold title="Surface Intelligence" icon={<Radar size={12} />} locked={L} accent={ACCENT.telemetry}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <p className={`${TEXT.sub} ${COLOR.labelText} italic`}>Taxiway congestion, runway occupancy, and predictive delay propagation — available in Enterprise tier.</p>
          </div>
        </Fold>

        {/* ═══ 11. CONTRIBUTOR NETWORK (Auth) ═══ */}
        <Fold title="Contributor Network" icon={<Wifi size={12} />} locked={L} accent={ACCENT.transparency}>
          <div className={`px-2 py-1.5 ${COLOR.subtleBg} ${COLOR.border} rounded-md`}>
            <Info label="Ground Stations" value="850+" color="text-emerald-500 dark:text-emerald-400" />
            <Info label="Coverage" value="98% Indian airspace" color="text-cyan-500 dark:text-cyan-400" />
            <p className={`${TEXT.sub} ${COLOR.labelText} italic mt-1`}>Station coverage zones & blind spot detection</p>
          </div>
        </Fold>

        {/* ═══ VISUAL CONTROLS (Always visible) ═══ */}
        <div className={`border-t ${COLOR.divider} ${SPACE.pad}`}>
          <div className={`${TEXT.sectionTitle} ${COLOR.titleText} mb-2`}>🎚 Visual Controls</div>
          <RangeSlider label="Brightness" min={0} max={100} value={[0, c.mapBrightness]} onChange={([, val]) => set({ mapBrightness: val })} emoji="☀️" />
        </div>

        {/* ── Auth CTA ── */}
        {L && (
          <div className={`${SPACE.pad} border-t ${COLOR.divider}`}>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-md px-2.5 py-2">
              <Lock size={10} className="text-amber-500 shrink-0" />
              <span className={`${TEXT.sub} text-amber-700 dark:text-amber-400 font-bold`}>Sign in for signal transparency, airspace structure, infrastructure & aircraft controls</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LayersPanel;
